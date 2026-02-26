package com.zipddak.config.oauth;

public interface OAuth2UserInfo {

	String getProviderId();
	String getProvider(); // 카카오 or 네이버
	String getEmail();
	String getName();
	String getProfileImage();
	String getNickName();
	String getMobile();
	
}
