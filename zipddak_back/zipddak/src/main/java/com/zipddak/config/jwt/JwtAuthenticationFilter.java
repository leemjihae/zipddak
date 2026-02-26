package com.zipddak.config.jwt;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zipddak.auth.PrincipalDetails;
import com.zipddak.entity.User;
import com.zipddak.repository.UserRepository;
import com.zipddak.user.repository.LoginProfileDsl;
import com.zipddak.util.FileSaveService;

public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter{
	
	//전역변수로 쓰기위해 필요 
	private UserRepository userRepository;
	private LoginProfileDsl profileRepository;	
	
	JwtToken jwtToken = new JwtToken();
	
	public JwtAuthenticationFilter (AuthenticationManager authenticationManager, UserRepository userRepository, LoginProfileDsl profileRepository) {
		super(authenticationManager);
		this.userRepository = userRepository;
		this.profileRepository = profileRepository;
	}
	
	// super의 attemptAuthentication 메소드가 실행되고 성공하면 successfulAuthentication가 호출된다.
	// attempteAuthentication 메소드가 리턴해준 Authentication을 파라미터로 받음
	@Override
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
			Authentication authResult) throws IOException, ServletException {
		PrincipalDetails principalDetails = (PrincipalDetails)authResult.getPrincipal();
		String username = principalDetails.getUsername();

		String accessToken = jwtToken.makeAccessToken(username);
		String refreshToken = jwtToken.makeRefreshToken(username);
		
		Map<String, String> map = new HashMap<String, String>();
		map.put("access_token", JwtProperties.TOKEN_PREFIX + accessToken);
		map.put("refresh_token", JwtProperties.TOKEN_PREFIX + refreshToken);
		
		// map에 있는 token을 json 문자열로 변환
		ObjectMapper objectMapper = new ObjectMapper();
		String token = objectMapper.writeValueAsString(map);
		
		response.addHeader(JwtProperties.HEADER_STRING, token);
		response.setContentType("application/json; charset=utf-8");
		
		
		User user = principalDetails.getUser();
		
		String fcmToken = request.getParameter("fcmToken");
		user.setFcmToken(fcmToken);
		userRepository.save(user);

		String profile = 
				profileRepository.profileFileRename(username, user.getRole().toString(), false);
				
		Map<String, Object> userInfo = new HashMap<String, Object>();
		userInfo.put("username", user.getUsername());
		userInfo.put("name", user.getName());
		userInfo.put("nickname", user.getNickname());
		userInfo.put("role", user.getRole());
		userInfo.put("expert", false);
		userInfo.put("profile", profile);
		userInfo.put("addr1", user.getAddr1());
		userInfo.put("addr2", user.getAddr2());
		userInfo.put("zonecode", user.getZonecode());
		userInfo.put("settleBank", user.getSettleBank());
		userInfo.put("settleAccount", user.getSettleAccount());
		userInfo.put("settleHost", user.getSettleHost());
		
		response.getWriter().write(objectMapper.writeValueAsString(userInfo));

	}
	
}