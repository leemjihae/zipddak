package com.zipddak.admin.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.admin.service.ReportSellerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class ReportSellerController {

	private final ReportSellerService reportSellerService;
	
	@PostMapping("reportSeller")
	public ResponseEntity<Boolean> reportSeller(@RequestBody Map<String, Object> reportMap) {
		
		try {	
			reportSellerService.reportSeller(reportMap);
			return ResponseEntity.ok(true);
			
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
					
		}
		
	}
	
}
