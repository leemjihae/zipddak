package com.zipddak.config;

import java.io.InputStream;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;

@Configuration
public class FCMConfig {
	
	@Bean
	FirebaseMessaging firebaseMessaging() throws Exception {
		ClassPathResource resource = new ClassPathResource("firebase/kosta-2025-764a0-firebase-adminsdk-fbsvc-1b57041012.json");
		InputStream inStream = resource.getInputStream();
		FirebaseApp firebaseApp = null;
		List<FirebaseApp> firebaseAppList = FirebaseApp.getApps();
		
		if(firebaseAppList != null && !firebaseAppList.isEmpty()) {
			for(FirebaseApp app : firebaseAppList) {
				if(app.getName().equals(FirebaseApp.DEFAULT_APP_NAME)) {
					firebaseApp = app;
					break;
				}
			}
		} else {
			FirebaseOptions options = FirebaseOptions.builder().setCredentials(GoogleCredentials.fromStream(inStream)).build();
			
			firebaseApp = FirebaseApp.initializeApp(options);
		}
		return FirebaseMessaging.getInstance(firebaseApp);
	}
}
