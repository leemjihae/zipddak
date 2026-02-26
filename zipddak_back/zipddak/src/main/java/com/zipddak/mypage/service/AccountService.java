package com.zipddak.mypage.service;

import org.springframework.web.multipart.MultipartFile;

import com.zipddak.dto.UserDto;
import com.zipddak.mypage.dto.UserAccountDto;

public interface AccountService {
	UserAccountDto getUserAccountDetail(String username) throws Exception;

	void modifyUserAccount(UserDto userDto, MultipartFile profileImage) throws Exception;
}
