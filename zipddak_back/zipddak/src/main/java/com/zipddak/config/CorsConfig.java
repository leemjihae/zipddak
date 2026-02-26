package com.zipddak.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.zipddak.config.jwt.JwtProperties;

@Configuration
public class CorsConfig {
	@Bean
	public CorsFilter corsFilter() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowCredentials(true); // 프론트의 Access-Control-Allow-Credentials 요청에 대한 허용
		config.addAllowedOriginPattern("http://localhost:5173"); // react-dev 서버
		config.addAllowedHeader("*"); // 모든 헤더 허용
		config.addAllowedMethod("*"); // 모든 메서드 허용
		config.addExposedHeader(JwtProperties.HEADER_STRING); // react에서 받기 위해 반듯 ㅣ필요
		config.addExposedHeader("Authorization");
		config.addExposedHeader("Refresh-Token");
		
		source.registerCorsConfiguration("/**", config);
		return new CorsFilter(source);
	}
}
