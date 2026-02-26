package com.zipddak.seller.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.seller.dto.SearchConditionDto;
import com.zipddak.seller.service.SellerOrderService;
import com.zipddak.seller.service.SellerShippingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/seller/shipping")
@RequiredArgsConstructor
public class SellerShippingController {
	
	private final SellerShippingService shipping_svc;
	
	
	//배송 진행 리스트
	@GetMapping("/myShippingList")
	public ResponseEntity<?> shippingList(@RequestParam("sellerId") String sellerUsername, 
										@RequestParam(value="page", required=false, defaultValue="1") Integer page,
										SearchConditionDto scDto) {
		
		System.out.println("sellerUsername ; " + sellerUsername);
		System.out.println("scDto ; " + scDto);
		try {
			Map<String, Object> myShipping = shipping_svc.getMyShippingList(sellerUsername, page, scDto);
			return ResponseEntity.ok(myShipping);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

}
