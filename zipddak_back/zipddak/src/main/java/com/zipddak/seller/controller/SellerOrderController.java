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

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/seller/order")
@RequiredArgsConstructor
public class SellerOrderController {

	private final SellerOrderService order_svc;

	// 주문 리스트
	@GetMapping("/myOrderList")
	public ResponseEntity<?> orderList(@RequestParam("sellerId") String sellerUsername,
										@RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
										SearchConditionDto scDto) {
		System.out.println("sellerUsername" + sellerUsername);
		System.out.println(sellerUsername);
		System.out.println(scDto);
		try {
			Map<String, Object> myOrder = order_svc.getMyOrderList(sellerUsername, page, scDto);
			return ResponseEntity.ok(myOrder);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	// 주문 내역 상세보기
	@GetMapping("/myOrderDetail")
	public ResponseEntity<?> orderDetail(@RequestParam("sellerId") String sellerUsername,@RequestParam("num") Integer orderIdx) {
		try {
			Map<String, Object> myOrderDetail = order_svc.getMyOrderDetail(sellerUsername, orderIdx);
			return ResponseEntity.ok(myOrderDetail);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	

}
