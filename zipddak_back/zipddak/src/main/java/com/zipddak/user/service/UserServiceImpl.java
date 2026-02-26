package com.zipddak.user.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zipddak.dto.UserDto;
import com.zipddak.entity.User;
import com.zipddak.repository.UserRepository;
import com.zipddak.user.dto.UserInfoDto;
import com.zipddak.user.repository.LoginProfileDsl;

@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private LoginProfileDsl loginProfileRepository;
	
	@Autowired
	private ModelMapper modelMapper;


	//유저등록
	@Override
	public UserInfoDto login(User user) throws Exception {
		userRepository.save(user);
		UserDto userdto = modelMapper.map(user, UserDto.class);
		
		String username= userdto.getUsername();
		String role = userdto.getRole();
		Boolean expertYN = userdto.getExpert();
		
		String profile = loginProfileRepository.profileFileRename(username, role, expertYN);
		
		//userAtom에 들어가는 값
		UserInfoDto userInfo = modelMapper.map(userdto, UserInfoDto.class);
		userInfo.setProfile(profile);
		
		return userInfo;
	}

	//전문가 전환
	@Override
	public UserInfoDto expertYN(Boolean isExpert, String username) throws Exception {
		
		User user = userRepository.findById(username).orElseThrow(()-> new Exception("username error"));
		user.setExpert(isExpert);
		userRepository.save(user);
		
		UserDto userdto = modelMapper.map(user, UserDto.class);
		String role = userdto.getRole();
		Boolean expertYN = userdto.getExpert();
		
		String profile = loginProfileRepository.profileFileRename(username, role, expertYN);
		
		UserInfoDto userInfo = modelMapper.map(userdto, UserInfoDto.class);
		userInfo.setProfile(profile);
		
		return userInfo;
		
	}

	//계좌정보 업데이트
	@Override
	public void userBank(String username, String settleBank, String settleAccount, String settleHost) throws Exception {

		User user = userRepository.findById(username).orElseThrow(()-> new Exception("username error"));
		user.setSettleBank(settleBank);
		user.setSettleAccount(settleAccount);
		user.setSettleHost(settleHost);
		
		userRepository.save(user);
	}




}
