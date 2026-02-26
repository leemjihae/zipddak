package com.zipddak.mypage.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.mypage.dto.FavoriteCommunityDto;
import com.zipddak.mypage.dto.FavoriteExpertDto;
import com.zipddak.mypage.dto.FavoriteProductDto;
import com.zipddak.mypage.dto.FavoriteToolDto;
import com.zipddak.mypage.service.FavoriteServiceImpl;
import com.zipddak.util.PageInfo;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class FavoriteController {

	private final FavoriteServiceImpl favoriteService;

	// 관심 상품 조회
	@GetMapping("/likeList/product")
	public ResponseEntity<Map<String, Object>> favoriteProductList(@RequestParam("username") String username,
			@RequestParam(value = "page", required = false, defaultValue = "1") Integer page) {
		try {
			PageInfo pageInfo = new PageInfo(page);

			List<FavoriteProductDto> favoriteProductList = favoriteService.getFavoriteProductList(username, pageInfo);

			Map<String, Object> res = new HashMap<>();
			res.put("favoriteProductList", favoriteProductList);
			res.put("pageInfo", pageInfo);

			return ResponseEntity.ok(res);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 상품 좋아요
	@GetMapping("/like/product")
	public ResponseEntity<Boolean> likeProduct(@RequestParam("username") String username,
			@RequestParam("productIdx") Integer productIdx) {
		try {
			return ResponseEntity.ok(favoriteService.toggleProductLike(username, productIdx));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 관심 공구 조회
	@GetMapping("/likeList/tool")
	public ResponseEntity<Map<String, Object>> favoriteToolList(@RequestParam("username") String username,
			@RequestParam(value = "page", required = false, defaultValue = "1") Integer page) {
		try {
			PageInfo pageInfo = new PageInfo(page);

			List<FavoriteToolDto> favoriteToolList = favoriteService.getFavoriteToolList(username, pageInfo);

			Map<String, Object> res = new HashMap<>();
			res.put("favoriteToolList", favoriteToolList);
			res.put("pageInfo", pageInfo);

			return ResponseEntity.ok(res);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 공구 좋아요
	@GetMapping("/like/tool")
	public ResponseEntity<Boolean> likeTool(@RequestParam("username") String username,
			@RequestParam("toolIdx") Integer toolIdx) {
		try {
			return ResponseEntity.ok(favoriteService.toggleToolLike(username, toolIdx));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 관심 전문가 조회
	@GetMapping("/likeList/expert")
	public ResponseEntity<Map<String, Object>> favoriteExpertList(@RequestParam("username") String username,
			@RequestParam(value = "page", required = false, defaultValue = "1") Integer page) {
		try {
			PageInfo pageInfo = new PageInfo(page);

			List<FavoriteExpertDto> favoriteExpertList = favoriteService.getFavoriteExpertList(username, pageInfo);

			Map<String, Object> res = new HashMap<>();
			res.put("favoriteExpertList", favoriteExpertList);
			res.put("pageInfo", pageInfo);

			return ResponseEntity.ok(res);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 전문가 좋아요
	@GetMapping("/like/expert")
	public ResponseEntity<Boolean> likeExpert(@RequestParam("username") String username,
			@RequestParam("expertIdx") Integer expertIdx) {
		try {
			return ResponseEntity.ok(favoriteService.toggleExpertLike(username, expertIdx));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 관심 커뮤니티 조회
	@GetMapping("/likeList/community")
	public ResponseEntity<Map<String, Object>> favoriteCommunityList(@RequestParam("username") String username,
			@RequestParam(value = "page", required = false, defaultValue = "1") Integer page) {
		try {
			PageInfo pageInfo = new PageInfo(page);

			List<FavoriteCommunityDto> favoriteCommunityList = favoriteService.getFavoriteCommunityList(username,
					pageInfo);

			Map<String, Object> res = new HashMap<>();
			res.put("favoriteCommunityList", favoriteCommunityList);
			res.put("pageInfo", pageInfo);

			return ResponseEntity.ok(res);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 커뮤니티 좋아요
	@GetMapping("/like/community")
	public ResponseEntity<Boolean> likeCommunity(@RequestParam("username") String username,
			@RequestParam("communityIdx") Integer communityIdx) {
		try {
			return ResponseEntity.ok(favoriteService.toggleCommunityLike(username, communityIdx));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 내 커뮤니티 목록 조회
	@GetMapping("/my/communityList")
	public ResponseEntity<Map<String, Object>> myCommunityList(@RequestParam("username") String username,
			@RequestParam(value = "page", required = false, defaultValue = "1") Integer page) {
		try {
			PageInfo pageInfo = new PageInfo(page);

			List<FavoriteCommunityDto> myCommunityList = favoriteService.getMyCommunityList(username, pageInfo);

			Map<String, Object> res = new HashMap<>();
			res.put("myCommunityList", myCommunityList);
			res.put("pageInfo", pageInfo);

			return ResponseEntity.ok(res);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}
}
