package com.zipddak.seller.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.seller.dto.OrderItemActionRequestDto;
import com.zipddak.seller.dto.SaveResultDto;
import com.zipddak.seller.dto.SearchConditionDto;
import com.zipddak.seller.service.SellerOrderService;
import com.zipddak.seller.service.SellerRefundService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/seller/refund")
@RequiredArgsConstructor
public class SellerRefundController {
	
	private final SellerRefundService refund_svc;
	
	// 반품 리스트
	@GetMapping("/myRefundList")
	public ResponseEntity<?> refundList(@RequestParam("sellerId") String sellerUsername, 
										@RequestParam(value="page", required=false, defaultValue="1") Integer page,
										SearchConditionDto scDto) {
		try {
			Map<String, Object> myRefund = refund_svc.getMyRefundList(sellerUsername, page, scDto);
			return ResponseEntity.ok(myRefund);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	// 반품요청건 내역 상세보기
	@GetMapping("/refundReqDetail")
	public ResponseEntity<?> refundReqDetail(@RequestParam("sellerId") String sellerUsername,@RequestParam("num") Integer refundIdx) {
		Map<String, Object> refundReqDetail = refund_svc.getRefundReqDetail(sellerUsername, refundIdx);
		return ResponseEntity.ok(refundReqDetail);
	}

	
	
	
}
