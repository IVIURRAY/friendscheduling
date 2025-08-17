package com.example.demo.config;

import com.example.demo.service.AppleJwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class AppleOAuthConfig {

    @Autowired
    private AppleJwtService appleJwtService;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String googleClientSecret;

    @Bean
    public ClientRegistrationRepository clientRegistrationRepository() {
        List<ClientRegistration> registrations = new ArrayList<>();
        
        // Always add Google
        registrations.add(googleClientRegistration());
        
        // Only add Apple if credentials are provided
        if (appleJwtService.isAppleConfigured()) {
            registrations.add(appleClientRegistration());
        }
        
        return new InMemoryClientRegistrationRepository(registrations);
    }

    private ClientRegistration googleClientRegistration() {
        return ClientRegistration.withRegistrationId("google")
                .clientId(googleClientId)
                .clientSecret(googleClientSecret)
                .scope("openid", "profile", "email", "https://www.googleapis.com/auth/calendar.readonly")
                .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
                .tokenUri("https://www.googleapis.com/oauth2/v4/token")
                .userInfoUri("https://www.googleapis.com/oauth2/v2/userinfo")
                .userNameAttributeName("sub")
                .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}")
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .build();
    }

    private ClientRegistration appleClientRegistration() {
        String clientSecret = appleJwtService.generateClientSecret();
        return ClientRegistration.withRegistrationId("apple")
                .clientId(appleJwtService.getClientId())
                .clientSecret(clientSecret)
                .scope("openid", "name", "email")
                .authorizationUri("https://appleid.apple.com/auth/authorize")
                .tokenUri("https://appleid.apple.com/auth/token")
                .jwkSetUri("https://appleid.apple.com/auth/keys")
                .userNameAttributeName("sub")
                .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}")
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_POST)
                .build();
    }
}