package com.zipddak.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.zipddak.entity.User;
import com.zipddak.repository.UserRepository;



// security 설정에서 loginProcessingUrl("/loginProc")
// loginProc 요청이 오면 자동으로 UserDetailService의 타입으로 IoC 되어있는 loadUserByUsername 함수가 호출된다.

@Service
public class PrincipalDetailService implements UserDetailsService {

	@Autowired
	private UserRepository userRepository;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findById(username).orElseThrow(() -> new UsernameNotFoundException(username));
		System.out.println(user);
		return new PrincipalDetails(user);
	}

}
