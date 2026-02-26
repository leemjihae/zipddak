package com.zipddak.config.oauth;

import java.io.File;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.zipddak.auth.PrincipalDetails;
import com.zipddak.entity.ProfileFile;
import com.zipddak.entity.User;
import com.zipddak.entity.User.UserRole;
import com.zipddak.entity.User.UserState;
import com.zipddak.repository.ProfileFileRepository;
import com.zipddak.repository.UserRepository;
import com.zipddak.util.ProfileService;


@Service
public class PrincipalOAuth2UserService extends DefaultOAuth2UserService{

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private ProfileFileRepository profileFileRepository;
	
	@Autowired
	private ProfileService profileDownload;
	
	@Value("${profileFile.path}")
	private String profileUpload;
	
	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		OAuth2User oAuth2User = super.loadUser(userRequest);
		return processOAuth2User(userRequest, oAuth2User);
	}

	private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
		String registrationId = userRequest.getClientRegistration().getRegistrationId();
		
		OAuth2UserInfo oAuth2UserInfo = null;
		
		if(registrationId.equals("naver")) {
			System.out.println("naver");
			oAuth2UserInfo = new NaverUserInfo(oAuth2User.getAttribute("response"));
		}else if(registrationId.equals("kakao")) {
			System.out.println("kakao");
			oAuth2UserInfo = new KakaoUserInfo(oAuth2User.getAttributes(), oAuth2User.getAttribute("properties"));
		}else {
			System.out.println("구글,네이버,카카오만 지원");
			return null;
		}
		
		User user = null;
		ProfileFile profile;
		File socialProfile;
		
		String email;
		if (oAuth2UserInfo.getEmail() == null || oAuth2UserInfo.getEmail().isEmpty()) {
			email = oAuth2UserInfo.getProviderId();
		} else {
			email = oAuth2UserInfo.getEmail();
		}
		
		String nickName;
		if (oAuth2UserInfo.getNickName() == null || oAuth2UserInfo.getNickName().isEmpty()) {
			nickName = oAuth2UserInfo.getName();
		} else {
			nickName = oAuth2UserInfo.getNickName();
		}
		
		String mobile;
		if (oAuth2UserInfo.getMobile() == null || oAuth2UserInfo.getMobile().isEmpty()) {
			mobile ="";
		} else {
			mobile = oAuth2UserInfo.getMobile();
		}
		
		
		Optional<User> ouser = userRepository.findByProviderIdAndProvider(oAuth2UserInfo.getProviderId(), oAuth2UserInfo.getProvider());
		
		if(ouser.isEmpty()) { // 가입
			
			try {
			    socialProfile = profileDownload.ProfiledownloadImage(oAuth2UserInfo.getProfileImage());
			} catch (Exception e) {
			    e.printStackTrace();
			    throw new RuntimeException("프로필 이미지 다운로드 실패");
			}
			
			profile = ProfileFile.builder()
							.fileName("socialLogin"+oAuth2UserInfo.getProvider())
							.fileRename(socialProfile.getName())
							.storagePath(profileUpload)
							.build();
			
			ProfileFile savedProfile = profileFileRepository.save(profile);
			
			user = User.builder()
					.username(email)
					.provider(oAuth2UserInfo.getProvider())
					.providerId(oAuth2UserInfo.getProviderId())
					.profileImg(savedProfile.getProfileFileIdx())
					.name(oAuth2UserInfo.getName())
					.nickname(nickName)
					.phone(mobile)
					.expert(false)
					.role(UserRole.USER)
					.state(UserState.ACTIVE)
					.build();
			
		} else { // 정보 변경
			user = ouser.get();
			
			user.setUsername(email);
			user.setName(oAuth2UserInfo.getName());
			user.setNickname(nickName);
			user.setPhone(mobile);

		}
		
		userRepository.save(user);
		
		return new PrincipalDetails(user, oAuth2User.getAttributes());
	}
	
}
