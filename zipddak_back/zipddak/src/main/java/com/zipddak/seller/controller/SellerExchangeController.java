package com.zipddak.seller.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.seller.dto.SearchConditionDto;
import com.zipddak.seller.service.SellerExchangeService;
import com.zipddak.seller.service.SellerOrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/seller/exchange")
@RequiredArgsConstructor
public class SellerExchangeController {
	
	private final SellerExchangeService exchange_svc;
	
	// 교환 리스트
	@GetMapping("/myExchangeList")
	public ResponseEntity<?> orderList(@RequestParam("sellerId") String sellerUsername, 
										@RequestParam(value="page", required=false, defaultValue="1") Integer page,
										SearchConditionDto scDto) {
		

		try {
			Map<String, Object> myExchange = exchange_svc.getMyExchangeList(sellerUsername, page, scDto);
			return ResponseEntity.ok(myExchange);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

}
