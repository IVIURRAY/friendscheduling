package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomOAuth2UserService extends OidcUserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);
        
        String email = oidcUser.getEmail();
        String name = oidcUser.getFullName();
        String oauthId = oidcUser.getSubject();
        String provider = userRequest.getClientRegistration().getRegistrationId();
        String profilePictureUrl = oidcUser.getAttribute("picture");
        
        String accessToken = userRequest.getAccessToken().getTokenValue();
        String refreshToken = null;

        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;
        
        if (existingUser.isPresent()) {
            user = existingUser.get();
            user.setOauthProvider(provider);
            user.setOauthId(oauthId);
            user.setAccessToken(accessToken);
            user.setRefreshToken(refreshToken);
            user.setProfilePictureUrl(profilePictureUrl);
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