package com.zipddak.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.admin.dto.ProductCardDto;
import com.zipddak.admin.dto.SellerInfoDto;
import com.zipddak.admin.service.SellerInfoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class SellerInfoController {

	private final SellerInfoService sellerInfoService;
	
	// 자재 판매 업체의 정보를 가져와서 보여주기
	@GetMapping("storeInfo")
	public ResponseEntity<SellerInfoDto> sellerInfo(@RequestParam("sellerId") Integer sellerId,
													@RequestParam(value = "username", required = false) String username){
		
		try {
			
			SellerInfoDto sellerInfo = sellerInfoService.getSellerInfo(sellerId);
			
			// 인기 상품
			List<ProductCardDto> bestProductList = sellerInfoService.bestProductList(sellerId, username);
			
			sellerInfo.setBestProductList(bestProductList);
			
			return ResponseEntity.ok(sellerInfo);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	@GetMapping("getProductList")
	public ResponseEntity<List<ProductCardDto>> getProductList(@RequestParam("page") Integer page,
																@RequestParam("cateNo") Integer cateNo,
																@RequestParam("sellerId") Integer sellerId,
																@RequestParam("username") String username){
		
		try{
			
			// 일반 상품											카테고리번호, 현재페이지
			List<ProductCardDto> productList = sellerInfoService.productList(cateNo, page, sellerId, username);
			
			return ResponseEntity.ok(productList);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
}
