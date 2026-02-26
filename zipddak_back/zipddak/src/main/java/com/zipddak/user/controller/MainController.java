package com.zipddak.user.controller;

import java.util.List;

import org.hibernate.mapping.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.admin.dto.ProductCardDto;
import com.zipddak.user.dto.CommunityCardsDto;
import com.zipddak.user.dto.ExpertCardsDto;
import com.zipddak.user.dto.ProductCardsDto;
import com.zipddak.user.dto.ToolCardsDto;
import com.zipddak.user.service.MainService;

@RestController
public class MainController {
	
	@Autowired
	private MainService mainService;
	
	//전문가 리스트
	@GetMapping(value="/main/expert")
	ResponseEntity<ExpertCardsDto> mainExpertList (@RequestParam("categoryNo") Integer categoryNo,
			@RequestParam("keyword") String keyword){
		
		try {
			ExpertCardsDto expertMain = mainService.expertCardMain(categoryNo, keyword);
			return ResponseEntity.ok(expertMain);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	//공구 리스트
	@GetMapping(value="/main/tool")
	ResponseEntity<ToolCardsDto> mainToolList (
			@RequestParam(value="keyword", required=false, defaultValue = "") String keyword,
			@RequestParam("categoryNo") Integer categoryNo,			
			@RequestParam(value="username", required=false, defaultValue = "") String username) {
		
		try {
			ToolCardsDto toolMain = mainService.toolCardMain(categoryNo, keyword, username);
			return ResponseEntity.ok(toolMain);
		}catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	//상품 리스트
		@GetMapping(value="/main/product")
		ResponseEntity<ProductCardsDto> mainProductList (
				@RequestParam(value="keyword", required=false, defaultValue = "") String keyword,
				@RequestParam("categoryNo") Integer categoryNo,				
				@RequestParam(value="username", required=false, defaultValue = "") String username) {
			
			try {
				ProductCardsDto productMain = mainService.productCardMain(categoryNo, keyword, username);
				return ResponseEntity.ok(productMain);
			}catch (Exception e) {
				e.printStackTrace();
				return ResponseEntity.badRequest().body(null);
			}
			
		}
		
	//커뮤니티 리스트
		@GetMapping(value="/main/community")
		ResponseEntity<CommunityCardsDto> mainCommunityList (
				@RequestParam(value="keyword", required=false, defaultValue = "") String keyword,
				@RequestParam("categoryNo") Integer categoryNo) {
			
			try {
				CommunityCardsDto communityMain = mainService.communityCardMain(categoryNo, keyword);
				return ResponseEntity.ok(communityMain);
			}catch (Exception e) {
				e.printStackTrace();
				return ResponseEntity.badRequest().body(null);
			}
			
		}
		
	//상품 베스트100
		@GetMapping(value="/main/best")
		ResponseEntity<List<ProductCardDto>> bestProductList (
				@RequestParam(value="username", required=false, defaultValue = "") String username) {
			
			try {
				List<ProductCardDto> productMain = mainService.products100(username);
				return ResponseEntity.ok(productMain);
			}catch (Exception e) {
				e.printStackTrace();
				return ResponseEntity.badRequest().body(null);
			}
			
		}
		
	
		
	
}
