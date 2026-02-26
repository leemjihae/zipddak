package com.zipddak.user.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.zipddak.dto.CategoryDto;
import com.zipddak.dto.SellerDto;
import com.zipddak.dto.UserDto;
import com.zipddak.user.dto.ExpertInsertDto;
import com.zipddak.user.dto.SellerInsertDto;
import com.zipddak.user.service.SignUpService;

@RestController
public class SignUpController {

	@Autowired
	private SignUpService signUpService;

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	@PostMapping(value = "/checkDoubleId")
	public ResponseEntity<Boolean> checkDoubleId(@RequestBody Map<String, String> params) {
		try {
			String username = params.get("username");
			Boolean checkId = signUpService.checkDoubleId(username);
			return ResponseEntity.ok().body(checkId);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(false);
		}
	}

	@PostMapping(value = "/joinUser")
	public ResponseEntity<Boolean> joinUser(@RequestBody UserDto userDto) {
		try {
			String password = bCryptPasswordEncoder.encode(userDto.getPassword());
			userDto.setPassword(password);
			signUpService.joinUser(userDto);

			return ResponseEntity.ok(true);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(false);
		}
	}

	@GetMapping(value = "/signUpExpertCategory")
	public ResponseEntity<Map<Integer, List<CategoryDto>>> signUpExpertCategory(
			@RequestParam("parentIdx") List<Integer> parentIdx) {

		Map<Integer, List<CategoryDto>> categoryList = new HashMap<>();
		
		try {
			categoryList = signUpService.showExpertCategory(parentIdx);
			return ResponseEntity.ok(categoryList);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	@PostMapping(value = "/joinExpert")
	public ResponseEntity<Boolean> joinExpert(@RequestPart("businessLicenseFile") MultipartFile file,
			ExpertInsertDto expertDto) {
		try {
			
			signUpService.joinExpert(expertDto,file);
			
			return ResponseEntity.ok(true);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(false);
		}
	}
	
	@PostMapping(value = "/joinSeller")
	public ResponseEntity<Boolean> joinSeller(@RequestPart("compFile") MultipartFile file, 
			@RequestPart("onlinesalesFile")MultipartFile imgfile, SellerInsertDto sellerDto) {
		try {
			
			String password = bCryptPasswordEncoder.encode(sellerDto.getPassword());
			sellerDto.setPassword(password);
			signUpService.joinSeller(sellerDto, file, imgfile);
			
			return ResponseEntity.ok(true);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(false);
		}
	}

}
