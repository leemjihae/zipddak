package com.zipddak.config.oauth;

import java.util.Map;

public class KakaoUserInfo implements OAuth2UserInfo {

	private Map<String, Object> attributes;
	private Map<String, Object> properties;
	private Map<String, Object> kakao_account;
	
	public KakaoUserInfo(Map<String, Object> attributes, Map<String, Object> properties) {
		this.attributes = attributes;
		this.properties = properties;
//		this.kakao_account =kakao_account;
	}
	
	@Override
	public String getProviderId() {
		return String.valueOf(attributes.get("id"));
	}

	@Override
	public String getProvider() {
		return "Kakao";
	}

	@Override
	public String getEmail() {
//		return (String)kakao_account.get("email");
		return null;
	}

	@Override
	public String getName() {
		return (String)properties.get("nickname");
	}

	@Override
	public String getProfileImage() {
		return (String)properties.get("profile_image"); 
	}

	@Override
	public String getNickName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getMobile() {
		// TODO Auto-generated method stub
		return null;
	}

}
