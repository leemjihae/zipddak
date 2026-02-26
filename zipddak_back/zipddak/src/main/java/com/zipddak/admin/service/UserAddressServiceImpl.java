package com.zipddak.admin.service;

import org.springframework.stereotype.Service;

import com.zipddak.admin.dto.RecvUserDto;
import com.zipddak.entity.User;
import com.zipddak.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserAddressServiceImpl implements UserAddressService{
	
	private final UserRepository userRepository;
	
	@Override
	public void saveAddress(RecvUserDto recvUser, String username) throws Exception {

		User user = userRepository.findById(username).orElseThrow(() -> new Exception("유저 정보 조회 오류"));
		
		user.setAddr1(recvUser.getAddr1());
		user.setAddr2(recvUser.getDetailAddress());
		user.setZonecode(recvUser.getZonecode());
		
		userRepository.save(user);
		
	}

}
