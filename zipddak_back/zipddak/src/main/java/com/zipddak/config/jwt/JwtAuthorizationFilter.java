package com.zipddak.config.jwt;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zipddak.auth.PrincipalDetails;
import com.zipddak.entity.User;
import com.zipddak.repository.UserRepository;

// 인가 : 로그인 처리가 되어야만 하는 처리가 들어왔을 때 실행
public class JwtAuthorizationFilter extends BasicAuthenticationFilter {

	public JwtAuthorizationFilter(AuthenticationManager authenticationManager) {
		super(authenticationManager);
		// TODO Auto-generated constructor stub
	}

	@Autowired
	private UserRepository userRepository;
	
	public JwtAuthorizationFilter(AuthenticationManager authenticationManager, UserRepository userRepository) {
		super(authenticationManager);
		this.userRepository = userRepository;
	}
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		
		String uri = request.getRequestURI();
		System.out.println(uri);
		
		 // 결제 완료 콜백은 인증 제외
		if (uri.startsWith("/user/payment/") ||
			    uri.startsWith("/user/orderInfo")) {
			    chain.doFilter(request, response);
			    return;
			}
		
		String[] parts = uri.split("/"); // "/" 기준으로 분리

		// parts[1]가 admin, seller, expert 중 하나면 인증 체크
		boolean isProtectedPath = parts.length > 1 && 
		(parts[1].equals("admin") || parts[1].equals("seller") || parts[1].equals("expert")|| parts[1].equals("user"));

		if (!isProtectedPath) {
		    chain.doFilter(request, response);
		    return;
		}

		
		String authentication = request.getHeader(JwtProperties.HEADER_STRING);
		if(authentication == null) {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인 필요");
			System.out.println("access token이 없음");
			return;
		}
		
		// 토큰을 가져옴
		
		// json 형태의 문자열을 map으로 변환
		ObjectMapper objectMapper = new ObjectMapper();
		Map<String, String> token = objectMapper.readValue(authentication, Map.class);

		// access_token : header로부터 accessToken 가져와 bearer 체크
		String accessToken = token.get("access_token");
		if(!accessToken.startsWith(JwtProperties.TOKEN_PREFIX)) {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인 필요");
			System.out.println("Bearer가 붙어있지 않음");
			return;
		}
		
		accessToken = accessToken.replace(JwtProperties.TOKEN_PREFIX, "");
		
		try {
			// 1. access token check
			// 1-1. 보안키, 만료시간 체크
			String username = JWT.require(Algorithm.HMAC512(JwtProperties.SECRET))
									.build()
									.verify(accessToken) // 만료 시간 체크
									.getClaim("sub") // 페이로드에 있는 항목중 sub
									.asString();
			if(username == null || username.isEmpty()) {
				response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인 필요");
				System.out.println("액세스토큰은 유효한데 username이 비어있을 경우");
				return;
			}
			
			// 1-2. username check
			Optional<User> ouser = userRepository.findById(username);
			if(ouser.isEmpty()) {
				response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인 필요");
				System.out.println("username이라는 아이디를 가진 회원이 존재하지 않는 경우");
				return;
			}
			
			// 필수가 아니지만 사용자의 정보를 내려보내주기위함
			PrincipalDetails  principalDetails = new PrincipalDetails(ouser.get());
			UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(principalDetails, null,
					principalDetails.getAuthorities());
			
			SecurityContextHolder.getContext().setAuthentication(auth);
			// 여기까지 사용자의 정보를 내려주기 위한 코드
			
			chain.doFilter(request, response);
			return;
			
		}catch(TokenExpiredException e) { // access token이 기간 만료되었을 때 refresh token check
			e.printStackTrace();
			// 1. refresh token 유효할 경우
			String refreshToken = token.get("refresh_token");
			System.out.println("==================");
			System.out.println(refreshToken);
			if(!refreshToken.startsWith(JwtProperties.TOKEN_PREFIX)) {
				response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인 필요");
				return;
			}
			
			// refresh token에서 Bearer 삭제
			refreshToken = refreshToken.replace(JwtProperties.TOKEN_PREFIX, "");
			try {
				String username = JWT.require(Algorithm.HMAC512(JwtProperties.SECRET))
						.build()
						.verify(refreshToken)
						.getClaim("sub")
						.asString();
				if(username == null || username.isEmpty()) {
					response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인 필요");
					return;
				}
				
				Optional<User> ouser = userRepository.findById(username);
				System.out.println(ouser.get());
				if(ouser.isEmpty()) {
					response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인 필요");
					return;
				}
				
				// 새 토큰 생성
				JwtToken jwtToken = new JwtToken();
				String nAccessToken = jwtToken.makeAccessToken(username);
				String nRefreshToken = jwtToken.makeRefreshToken(username);
				
				Map<String, String> mToken = new HashMap<String, String>();
				mToken.put("access_token", JwtProperties.TOKEN_PREFIX + nAccessToken);
				mToken.put("refresh_token", JwtProperties.TOKEN_PREFIX + nRefreshToken);
				
				String nToken = objectMapper.writeValueAsString(mToken);
				// response header에 새로 만든 토큰을 넣어준다.
				response.addHeader(JwtProperties.HEADER_STRING, nToken);
				
				PrincipalDetails  principalDetails = new PrincipalDetails(ouser.get());
				UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(principalDetails, null,
						principalDetails.getAuthorities());
				
				SecurityContextHolder.getContext().setAuthentication(auth);
				
				chain.doFilter(request, response);
				return;
				
			}catch(TokenExpiredException re) { // refresh token 기간 만료
				re.printStackTrace();
				response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "로그인 필요");
				return;
			}
			
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
	}
	
	
}