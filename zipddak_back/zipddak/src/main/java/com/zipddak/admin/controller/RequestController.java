package com.zipddak.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.admin.dto.RequestFormDto;
import com.zipddak.admin.service.RequestService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class RequestController {

	private final RequestService requestService;
	
	@PostMapping("user/writeRequest")
	public ResponseEntity<Boolean> writeRequest(RequestFormDto requestForm){
		
		try {
			
			requestService.writeRequest(requestForm);
			
			return ResponseEntity.ok(true);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	@GetMapping("user/requestCheck")
	public ResponseEntity<Boolean> reqeustCheck(@RequestParam String username){
		
		try {
			
			boolean check = requestService.requestCheck(username);
			
			return ResponseEntity.ok(check);
			
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
}
