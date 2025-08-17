package com.example.demo.service;

import com.google.api.client.auth.oauth2.BearerToken;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Events;
import com.example.demo.entity.User;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Service
public class GoogleCalendarService {

    private static final String APPLICATION_NAME = "Friend Scheduler";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    public List<Event> getUserCalendarEvents(User user, LocalDateTime startTime, LocalDateTime endTime) 
            throws GeneralSecurityException, IOException {
        
        if (user.getAccessToken() == null) {
            throw new IllegalArgumentException("User does not have Google access token");
        }

        HttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
        
        Credential credential = new Credential.Builder(BearerToken.authorizationHeaderAccessMethod())
                .setTransport(httpTransport)
                .setJsonFactory(JSON_FACTORY)
                .build()
                .setAccessToken(user.getAccessToken());

        Calendar service = new Calendar.Builder(httpTransport, JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();

        com.google.api.client.util.DateTime timeMin = new com.google.api.client.util.DateTime(
                Date.from(startTime.atZone(ZoneId.systemDefault()).toInstant()));
        com.google.api.client.util.DateTime timeMax = new com.google.api.client.util.DateTime(
                Date.from(endTime.atZone(ZoneId.systemDefault()).toInstant()));

        Events events = service.events().list("primary")
                .setTimeMin(timeMin)
                .setTimeMax(timeMax)
                .setOrderBy("startTime")
                .setSingleEvents(true)
                .execute();

        return events.getItems();
    }

    public List<Event> getUpcomingEvents(User user, int maxResults) 
            throws GeneralSecurityException, IOException {
        
        if (user.getAccessToken() == null) {
            throw new IllegalArgumentException("User does not have Google access token");
        }

        HttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
        
        Credential credential = new Credential.Builder(BearerToken.authorizationHeaderAccessMethod())
                .setTransport(httpTransport)
                .setJsonFactory(JSON_FACTORY)
                .build()
                .setAccessToken(user.getAccessToken());

        Calendar service = new Calendar.Builder(httpTransport, JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();

        com.google.api.client.util.DateTime now = new com.google.api.client.util.DateTime(System.currentTimeMillis());

        Events events = service.events().list("primary")
                .setTimeMin(now)
                .setMaxResults(maxResults)
                .setOrderBy("startTime")
                .setSingleEvents(true)
                .execute();

        return events.getItems();
    }
}