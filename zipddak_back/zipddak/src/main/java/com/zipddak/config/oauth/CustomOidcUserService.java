package com.zipddak.config.oauth;

import java.io.File;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
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
public class CustomOidcUserService extends OidcUserService {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private ProfileFileRepository profileFileRepository;

	@Autowired
	private ProfileService profileDownload;
	
	@Value("${profileFile.path}")
	private String profileUpload;
	
	@Override
	public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
		
		System.out.println("google");
		
		OidcUser oidcUser = super.loadUser(userRequest);
		Map<String, Object> attributes = oidcUser.getAttributes();
		
		System.out.println("구글"+oidcUser.getAttributes());
       
		User user = null;
		ProfileFile profile;
		File socialProfile;
		
		String nickName;
		if (oidcUser.getNickName() == null || oidcUser.getNickName().isEmpty()) {
			nickName = oidcUser.getFullName();
		} else {
			nickName = oidcUser.getNickName();
		}
		
		Optional<User> ouser = userRepository.findByProviderId(oidcUser.getName());
		
		if(ouser.isEmpty()) { // 가입
			
			try {
			    socialProfile = profileDownload.ProfiledownloadImage(oidcUser.getPicture());
			} catch (Exception e) {
			    e.printStackTrace();
			    throw new RuntimeException("프로필 이미지 다운로드 실패");
			}
			
			profile = ProfileFile.builder()
							.fileName("socialLogin"+oidcUser.getName())
							.fileRename(socialProfile.getName())
							.storagePath(profileUpload)
							.build();
			
			ProfileFile savedProfile = profileFileRepository.save(profile);
			
			user = User.builder()
					.username(oidcUser.getEmail())
					.provider("google")
					.providerId(oidcUser.getName()) //sub
					.profileImg(savedProfile.getProfileFileIdx())
					.name(oidcUser.getFullName())
					.nickname(nickName)
					.phone("")
					.expert(false)
					.role(UserRole.USER)
					.state(UserState.ACTIVE)
					.build();
			
		} else { // 정보 변경
			user = ouser.get();
			
			try {
			    socialProfile = profileDownload.ProfiledownloadImage(oidcUser.getPicture());
			} catch (Exception e) {
			    e.printStackTrace();
			    throw new RuntimeException("프로필 이미지 다운로드 실패");
			}
			
			profile = ProfileFile.builder()
							.fileName("socialLogin"+oidcUser.getName())
							.fileRename(socialProfile.getName())
							.storagePath(profileUpload)
							.build();
			
			ProfileFile savedProfile = profileFileRepository.save(profile);
			
			user.setUsername(oidcUser.getEmail());
			user.setName(oidcUser.getFullName());
			user.setNickname(nickName);
			user.setProfileImg(savedProfile.getProfileFileIdx());
		}
		
		userRepository.save(user);
		
		return new PrincipalDetails(
	            user, 
	            attributes,
	            oidcUser.getIdToken(), // OidcUser 전용 정보
	            oidcUser.getUserInfo() // OidcUser 전용 정보
	        );
	}
	

}
