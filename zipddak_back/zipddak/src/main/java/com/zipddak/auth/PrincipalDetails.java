package com.zipddak.auth;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.zipddak.entity.User;

import lombok.Data;

// security가 /loginProc 주소를 낚아채서 로그인 한다.
// 로그인 진행이 완료가 되면 security session을 만들어 준다.(Security ContextHolder)
// security session에 들어가는 타입을 Authentication 타입의 객체여야 한다.
// 그래서, Authentication 안에 User 정보를 넣어야 한다.
// 그 User 오브젝트 타입은 UserDetails 타입이어야 한다.
// 즉, (Security ContextHolder (new Authentication(new UserDetails(new User))))

@Data
public class PrincipalDetails implements UserDetails, OAuth2User,OidcUser{

	private User user;
	private Map<String, Object> attributes;
	private OidcIdToken idToken; 
    private OidcUserInfo userInfo;
	
    //구글 로그인
    public PrincipalDetails(User user, Map<String, Object> attributes, OidcIdToken idToken, OidcUserInfo userInfo) {
        this.user = user;
        this.attributes = attributes;
        this.idToken = idToken;
        this.userInfo = userInfo;
    }
    
    //소셜 로그인
    public PrincipalDetails(User user, Map<String, Object> attributes) {
        this(user, attributes, null, null); 
    }

    //일반 로그인
    public PrincipalDetails(User user){
        this(user, null, null, null);
    }
    
    
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Collection<GrantedAuthority> collect = new ArrayList<GrantedAuthority>();
		collect.add(() -> "ROLE_"+user.getRole().toString());
		return collect;
	}

	@Override
	public String getPassword() {
		return user.getPassword();
	}

	@Override
	public String getUsername() {
		return user.getUsername();
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		// 우리 사이트에서 1년동안 로그인을 안한경우 휴먼 계정으로 변하기로 했다면
		// 현재시간 - 마지막 로그인한 시간을 계산
		return true;
	}

	
	@Override
	public Map<String, Object> getAttributes() {
		
		return attributes;
	}
	
	@Override
	public String getName() {
		return user.getProviderId();
	}
	
	
	//구글 추가됨
	@Override
	public Map<String, Object> getClaims() {
		return attributes;
	}
	
	@Override
	public OidcUserInfo getUserInfo() {
		return this.userInfo;
	}
	
	@Override
	public OidcIdToken getIdToken() {
		return this.idToken;
	}
	
	


}
