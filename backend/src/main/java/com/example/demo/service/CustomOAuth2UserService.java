package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends OidcUserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);
        
        String provider = userRequest.getClientRegistration().getRegistrationId();
        String oauthId = oidcUser.getSubject();
        String accessToken = userRequest.getAccessToken().getTokenValue();
        String refreshToken = null;
        
        String email;
        String name;
        String profilePictureUrl;
        
        if ("apple".equals(provider)) {
            email = oidcUser.getEmail();
            Object nameObject = oidcUser.getAttribute("name");
            if (nameObject instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, String> nameMap = (Map<String, String>) nameObject;
                String firstName = nameMap.get("firstName");
                String lastName = nameMap.get("lastName");
                name = (firstName != null ? firstName : "") + 
                       (lastName != null ? " " + lastName : "");
                name = name.trim();
                if (name.isEmpty()) {
                    name = email != null ? email.split("@")[0] : "Apple User";
                }
            } else {
                name = nameObject != null ? nameObject.toString() : 
                       (email != null ? email.split("@")[0] : "Apple User");
            }
            profilePictureUrl = null;
        } else {
            email = oidcUser.getEmail();
            name = oidcUser.getFullName();
            profilePictureUrl = oidcUser.getAttribute("picture");
        }

        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;
        
        if (existingUser.isPresent()) {
            user = existingUser.get();
            user.setOauthProvider(provider);
            user.setOauthId(oauthId);
            user.setAccessToken(accessToken);
            user.setRefreshToken(refreshToken);
            if (profilePictureUrl != null) {
                user.setProfilePictureUrl(profilePictureUrl);
            }
            if (name != null && !name.isEmpty()) {
                user.setName(name);
            }
        } else {
            user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setOauthProvider(provider);
            user.setOauthId(oauthId);
            user.setAccessToken(accessToken);
            user.setRefreshToken(refreshToken);
            user.setProfilePictureUrl(profilePictureUrl);
        }
        
        userRepository.save(user);
        
        return oidcUser;
    }
}