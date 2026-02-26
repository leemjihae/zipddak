package com.zipddak.mypage.controller;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.mypage.dto.OrderDetailDto;
import com.zipddak.mypage.dto.OrderListDto;
import com.zipddak.mypage.dto.OrderStatusSummaryDto;
import com.zipddak.mypage.service.OrderServiceImpl;
import com.zipddak.util.PageInfo;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class OrderController {

	private final OrderServiceImpl orderService;

	// 주문배송목록 조회
	@GetMapping("/market/orderList")
	public ResponseEntity<Map<String, Object>> orderList(@RequestParam("username") String username,
			@RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
			@RequestParam(value = "startDate", required = false) String startDate,
			@RequestParam(value = "endDate", required = false) String endDate) {
		try {
			Date start = parseDate(startDate);
			Date end = parseDate(endDate);

			PageInfo pageInfo = new PageInfo(page);

			List<OrderListDto> orderListDtoList = orderService.getOrderList(username, pageInfo, start, end);

			Map<String, Object> res = new HashMap<>();
			res.put("orderListDtoList", orderListDtoList);
			res.put("pageInfo", pageInfo);

			return ResponseEntity.ok(res);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 취소교환반품목록 조회
	@GetMapping("/market/returnList")
	public ResponseEntity<Map<String, Object>> returnList(@RequestParam("username") String username,
			@RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
			@RequestParam(value = "startDate", required = false) String startDate,
			@RequestParam(value = "endDate", required = false) String endDate) {
		try {
			Date start = parseDate(startDate);
			Date end = parseDate(endDate);

			PageInfo pageInfo = new PageInfo(page);

			List<OrderListDto> orderListDtoList = orderService.getReturnList(username, pageInfo, start, end);

			Map<String, Object> res = new HashMap<>();
			res.put("orderListDtoList", orderListDtoList);
			res.put("pageInfo", pageInfo);

			return ResponseEntity.ok(res);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 상품주문상태 요약
	@GetMapping("/market/orderStatusSummary")
	public ResponseEntity<Map<String, Object>> orderStatusSummary(@RequestParam("username") String username) {
		try {
			OrderStatusSummaryDto orderStatusSummary = orderService.getOrderStatusSummary(username);

			Map<String, Object> res = new HashMap<>();
			res.put("orderStatusSummary", orderStatusSummary);

			return ResponseEntity.ok(res);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	private Date parseDate(String value) {
		if (value == null || value.isEmpty() || value.equals("null"))
			return null;
		return Date.valueOf(value);
	}

	// 주문상세 조회
	@GetMapping("/market/detail")
	public ResponseEntity<Map<String, Object>> orderDetail(@RequestParam("orderIdx") Integer orderIdx) {
		try {
			OrderDetailDto orderDetail = orderService.getOrderDetail(orderIdx);

			Map<String, Object> res = new HashMap<>();
			res.put("orderDetail", orderDetail);

			return ResponseEntity.ok(res);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}
}
