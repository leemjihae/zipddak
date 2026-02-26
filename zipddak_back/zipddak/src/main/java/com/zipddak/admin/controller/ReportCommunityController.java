package com.zipddak.admin.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.admin.service.ReportCommunityService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/")
public class ReportCommunityController {
	
	private final ReportCommunityService reportCommunirtService;

	@PostMapping("user/reportCommunity")
	public ResponseEntity<Boolean> reportCommunity(@RequestBody Map<String, Object> map) {
		
		try {
		
			String username = (String)map.get("username");
			String reason = (String)map.get("reason");
			Integer communityId = (Integer)map.get("communityId");
			
			reportCommunirtService.reportCommunity(username, reason, communityId);
			
			return ResponseEntity.ok(true);
			
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
}
