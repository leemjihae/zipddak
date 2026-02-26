package com.zipddak.admin.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.admin.dto.WriteInquiryDto;
import com.zipddak.admin.service.InquiryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class InquiryProductController {

	private final InquiryService inquiryServiceImpl;
	
	@PostMapping("user/writeInquire")
	public ResponseEntity<Boolean> writeInquire(WriteInquiryDto writeInquiryDto){
		
		try {
			inquiryServiceImpl.writeInquire(writeInquiryDto);
			
			return ResponseEntity.ok(true);
			
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
}
