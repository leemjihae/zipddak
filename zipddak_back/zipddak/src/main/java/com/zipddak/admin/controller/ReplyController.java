package com.zipddak.admin.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.admin.service.ReplyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class ReplyController {
	
	private final ReplyService replyService;

	@PostMapping("user/writeReply")
	public ResponseEntity<Boolean> writeReply(@RequestBody Map<String, Object> map){
		
		try {
			
			String username = (String)map.get("username");
			String content = (String)map.get("content");
			Integer communityId = (Integer)map.get("communityID");
			
			replyService.writeReply(username, content, communityId);
			
			return ResponseEntity.ok(true);
			
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	@PostMapping("user/deleteReply")
	public ResponseEntity<Boolean> deleteReply(@RequestBody Map<String, Object> map){
		
		try {
			Integer replyId = (Integer)map.get("replyId");
			
			replyService.deleteReply(replyId);
			
			return ResponseEntity.ok(true);
			
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
}
