package com.zipddak.admin.controller;


import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.admin.dto.CartBrandDto;
import com.zipddak.admin.dto.OrderListToListDto;
import com.zipddak.admin.service.CartService;
import com.zipddak.util.PageInfo;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class CartController {
	
	private final CartService cartService;

	@PostMapping("/addCart")
	public ResponseEntity<Boolean> addCart(@RequestBody OrderListToListDto orderListDto){
		
		try {
			// 장바구니에 추가
			cartService.addCart(orderListDto);
			
			return ResponseEntity.ok(true);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	// 해당 유저의 장바구니 리스트 조회
	@GetMapping("/cartList")
	public ResponseEntity<List<CartBrandDto>> cartList(
			@RequestParam("username") String username
			){
		
		try {
			
			List<CartBrandDto> cartListDto = cartService.cartList(username);
			
			return ResponseEntity.ok(cartListDto);
			
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	// 장바구니 수량 증가
	@PostMapping("/cartList/increaseCount")
	public ResponseEntity<Boolean> increaseCount(@RequestBody Map<String, Integer> cartMap){
		
		try {
			
			cartService.increaseCount(cartMap.get("cartIdx"));
			
			return ResponseEntity.ok(true);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	// 장바구니 수량 감소
	@PostMapping("/cartList/decreaseCount")
	public ResponseEntity<Boolean> decreaseCount(@RequestBody Map<String, Integer> cartMap){
		
		try {
			
			cartService.decreaseCount(cartMap.get("cartIdx"));
			
			return ResponseEntity.ok(true);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	// 장바구니 선택 삭제
	@PostMapping("/cartList/delete")
	public ResponseEntity<Boolean> deleteCartList(@RequestBody Map<String, List<Integer>> cartMap){
		
		try {
			System.out.println("ffff : " + cartMap.get("cartIdxs"));
			cartService.delete(cartMap.get("cartIdxs"));
			
			return ResponseEntity.ok(true);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
}
