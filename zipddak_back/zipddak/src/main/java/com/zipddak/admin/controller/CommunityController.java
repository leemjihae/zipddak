package com.zipddak.admin.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zipddak.admin.dto.CommunityDetailDto;
import com.zipddak.admin.dto.CommunityModifyDetailDto;
import com.zipddak.admin.dto.CommunityPagetDto;
import com.zipddak.admin.dto.ReplyDetailDto;
import com.zipddak.admin.dto.ResponseCommunityDetailDto;
import com.zipddak.admin.dto.ResponseReplyListAndHasnext;
import com.zipddak.admin.service.CommunityService;
import com.zipddak.admin.service.FavoriteCommunity;
import com.zipddak.admin.service.ReplyService;
import com.zipddak.dto.CommunityDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/")
public class CommunityController {
	
	private final CommunityService communityService;
	private final FavoriteCommunity favoriteCommunity;
	private final ReplyService replyService;

	@PostMapping("user/writeCommunity")
	public ResponseEntity<Integer> writeCommunity(
					@RequestParam int category,
					@RequestParam String title,
					@RequestParam String content,
					@RequestParam String username,
					@RequestPart(required = false) List<MultipartFile> images
			) {
		
		try {
			
			Integer commutnityIdx = communityService.write(category, title, content, username, images);
			
			return ResponseEntity.ok(commutnityIdx);
			
		}catch(Exception e) {
			
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
			
		}
		
	}
	
	@PostMapping("user/modifyCommunity")
	public ResponseEntity<Integer> modifyCommunity(
					@RequestParam int category,
					@RequestParam String title,
					@RequestParam String content,
					@RequestParam String username,
					@RequestPart(required = false) List<MultipartFile> images,
					@RequestParam int communityId,
					@RequestParam(required = false) String existingImageIds
			) {
		
		try {
			List<Integer> existingIds = new ArrayList<>();
	        if (existingImageIds != null && !existingImageIds.isEmpty()) {
	            existingIds = new ObjectMapper().readValue(existingImageIds, new TypeReference<List<Integer>>() {});
	        }
	        
	        System.out.println(existingIds);
			
			Integer commutnityIdx = communityService.modify(category, title, content, username, images, communityId, existingIds);
			
			return ResponseEntity.ok(commutnityIdx);
			
		}catch(Exception e) {
			
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
			
		}
		
	}
	
	@GetMapping("communityDetail")
	public ResponseEntity<ResponseCommunityDetailDto> communityDetail(
				@RequestParam int communityId,
				@RequestParam String username
			) {
		
		try {
			
			CommunityDetailDto communityDetail = communityService.communityDetail(communityId);
			
			boolean checkWrite = communityService.isWrite(communityId, username);
			
			long favoriteCount = favoriteCommunity.favoriteCount(communityId);
			
			boolean checkFavorite = favoriteCommunity.isFavorite(communityId, username);
			
			long replyCount = replyService.replyCountByCommunityId(communityId);
			
			ResponseReplyListAndHasnext replyList = replyService.replayList(communityId, 1); 
			
			ResponseCommunityDetailDto response = new ResponseCommunityDetailDto(
											communityDetail,
											checkWrite,
											favoriteCount,
											checkFavorite,
											replyCount,
											replyList
					);
			
			return ResponseEntity.ok(response);
			
		}catch(Exception e) {
			
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
			
		}
	}
	
	@GetMapping("communityDetail/replyMore")
	public ResponseEntity<ResponseReplyListAndHasnext> replyMore(@RequestParam Integer communityId, @RequestParam Integer page) {
		try {
			
			ResponseReplyListAndHasnext replyList = replyService.replyMore(communityId, page);
			
			return ResponseEntity.ok(replyList);			
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	@PostMapping("user/favoriteCommunity")
	public ResponseEntity<Boolean> favoriteCommunity(@RequestBody Map<String, Object> map) {
		try {
			
			String username = (String)map.get("username");
			Integer communityId = (Integer)map.get("communityId");
			
			favoriteCommunity.favoriteToggle(username,communityId);
			
			return ResponseEntity.ok(true);			
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	@PostMapping("user/deleteCommunity")
	public ResponseEntity<Boolean> deleteCommunity(@RequestBody Map<String, Object> map) {
		try {
			
			String username = (String)map.get("username");
			Integer communityId = (Integer)map.get("communityId");
			
			communityService.deleteCommunity(username, communityId);
			
			return ResponseEntity.ok(true);			
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	@GetMapping("community/modify")
	public ResponseEntity<CommunityModifyDetailDto> modifyCommunityDetail(@RequestParam Integer communityId){
		
		try {
			
			CommunityModifyDetailDto modifyCommunityDetail = communityService.modifyCommunityDetail(communityId);
			
			return ResponseEntity.ok(modifyCommunityDetail);
			
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	@GetMapping("communityList")
	public ResponseEntity<CommunityPagetDto> communityList(@RequestParam Integer category,
											@RequestParam Integer page){
		
		try {
			
			System.out.println(category);
			System.out.println(page);
			
			CommunityPagetDto response = communityService.communityList(category, page);
			
			return ResponseEntity.ok(response);
			
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	
	
}
