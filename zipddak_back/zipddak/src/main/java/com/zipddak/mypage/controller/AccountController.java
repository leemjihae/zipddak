package com.zipddak.mypage.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.zipddak.dto.UserDto;
import com.zipddak.mypage.dto.UserAccountDto;
import com.zipddak.mypage.service.AccountServiceImpl;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AccountController {

	private final AccountServiceImpl accountService;

	// 유저 정보 상세조회
	@GetMapping("/account/detail")
	public ResponseEntity<UserAccountDto> ExpertDetail(@RequestParam String username) {
		try {
			return ResponseEntity.ok(accountService.getUserAccountDetail(username));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 유저 정보 수정
	@PostMapping("/account/modify")
	public ResponseEntity<Boolean> modifyUserAccount(UserDto userDto,
			@RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
		try {
			accountService.modifyUserAccount(userDto, profileImage);
			return ResponseEntity.ok(true);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

}
