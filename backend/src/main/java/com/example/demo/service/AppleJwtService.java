package com.example.demo.service;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.ECDSASigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.StringReader;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.interfaces.ECPrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import java.util.Date;

@Service
public class AppleJwtService {

    @Value("${APPLE_TEAM_ID:}")
    private String teamId;

    @Value("${APPLE_KEY_ID:}")
    private String keyId;

    @Value("${APPLE_CLIENT_ID:}")
    private String clientId;

    @Value("${APPLE_PRIVATE_KEY:}")
    private String privateKeyString;

    public String generateClientSecret() {
        try {
            // Parse the private key
            PrivateKey privateKey = parsePrivateKey(privateKeyString);

            // Create JWT claims
            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .issuer(teamId)
                    .issueTime(new Date())
                    .expirationTime(new Date(System.currentTimeMillis() + 300000)) // 5 minutes
                    .audience("https://appleid.apple.com")
                    .subject(clientId)
                    .build();

            // Create JWT header
            JWSHeader header = new JWSHeader.Builder(JWSAlgorithm.ES256)
                    .keyID(keyId)
                    .build();

            // Create and sign JWT
            SignedJWT signedJWT = new SignedJWT(header, claimsSet);
            signedJWT.sign(new ECDSASigner((ECPrivateKey) privateKey));

            return signedJWT.serialize();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Apple JWT", e);
        }
    }

    private PrivateKey parsePrivateKey(String privateKeyString) throws Exception {
        // Remove header, footer, and whitespace
        String privateKeyPEM = privateKeyString
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s", "");

        // Decode Base64
        byte[] keyBytes = Base64.getDecoder().decode(privateKeyPEM);

        // Create PrivateKey object
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("EC");
        return keyFactory.generatePrivate(spec);
    }

    public boolean isAppleConfigured() {
        return teamId != null && !teamId.trim().isEmpty() &&
               keyId != null && !keyId.trim().isEmpty() &&
               clientId != null && !clientId.trim().isEmpty() &&
               privateKeyString != null && !privateKeyString.trim().isEmpty();
    }

    public String getClientId() {
        return clientId;
    }
}