package com.zipddak.admin.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.admin.service.MatchingService;
import com.zipddak.entity.Matching;
import com.zipddak.entity.Matching.MatchingStatus;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/")
public class MatchingController {

	private final MatchingService matchingService;
	
	@GetMapping("user/checkMatchingState")
	public ResponseEntity<Map<String, Object>> checkMatchingState(@RequestParam Integer estimateIdx){
		
		try {
			Map<String, Object> matchingState = new HashMap<String, Object>();
			
			Optional<Matching> check = matchingService.checkMatchingState(estimateIdx);
			
			if(check.isPresent()) {
				Matching matching = check.get();
				matchingState.put("state", matching.getStatus() != MatchingStatus.PAYMENT_CANCELLED);
				matchingState.put("matchingIdx", matching.getMatchingIdx());
				
				return ResponseEntity.ok(matchingState);
			}
			
			return ResponseEntity.ok(null);
			
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
}
