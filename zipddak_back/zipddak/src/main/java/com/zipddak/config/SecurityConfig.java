package com.zipddak.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.CorsFilter;

import com.zipddak.config.jwt.JwtAuthenticationFilter;
import com.zipddak.config.jwt.JwtAuthorizationFilter;
import com.zipddak.config.oauth.OAuth2SuccessHandler;
import com.zipddak.config.oauth.PrincipalOAuth2UserService;
import com.zipddak.repository.UserRepository;
import com.zipddak.user.repository.LoginProfileDsl;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	private CorsFilter corsFilter;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private LoginProfileDsl profileRepository;	
	
	@Autowired
	private PrincipalOAuth2UserService principalOAuth2UserService;
	
	@Autowired
	private OAuth2SuccessHandler oAuth2SuccessHandler;
	
	

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
			throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationManager authenticationManager) throws Exception{
		http.addFilter(corsFilter) // 다른 도메인 접근 허용
		.csrf().disable() // ccsfr 공격 비활성화
		.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS); // session 비활성화
		
		//인증
		http.formLogin().disable() // 로그인 폼 비활성화
		.httpBasic().disable() // httpBasic은 header에 username, password를 암호화하지 않은 상태로 주고받는다. 이를 사용하지 않겠다는 의미
		.addFilterAt(new JwtAuthenticationFilter(authenticationManager, userRepository, profileRepository), UsernamePasswordAuthenticationFilter.class);
		
		//소셜 로그인
		http.oauth2Login()
		.authorizationEndpoint().baseUri("/oauth2/authorization")
		.and()
		.redirectionEndpoint().baseUri("/zipddak/login/*")
		.and().userInfoEndpoint().userService(principalOAuth2UserService) //카카오나 네이버로 사용자 정보를 받아 인증처리
		.and()
		.successHandler(oAuth2SuccessHandler); //인증처리 후 토큰 만들어 리엑트에 전송
		
		http.headers()
        .frameOptions().disable()
        .contentSecurityPolicy("frame-ancestors 'self' http://localhost:5173");


		//인가(권한체크)
		http.addFilter(new JwtAuthorizationFilter(authenticationManager, userRepository))
		.authorizeRequests()
		
		.antMatchers("/zipddak/**").authenticated() // 로그인 필요
		.antMatchers("/expert/**").access("hasRole('ADMIN') or hasRole('EXPERT')")
		.antMatchers("/seller/**").access("hasRole('ADMIN') or hasRole('APPROVAL_SELLER')")
		.antMatchers("/admin/**").access("hasRole('ADMIN')")
		.anyRequest().permitAll();
		
		return http.build();
	}

	@Bean
	public BCryptPasswordEncoder encoderPassword() {
		return new BCryptPasswordEncoder();
	}

}