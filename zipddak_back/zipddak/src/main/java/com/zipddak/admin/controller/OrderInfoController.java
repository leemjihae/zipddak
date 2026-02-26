package com.zipddak.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.admin.dto.OrderComplateInfoDto;
import com.zipddak.admin.dto.OrderItemsDto;
import com.zipddak.admin.service.OrderItemService;
import com.zipddak.admin.service.OrderService;
import com.zipddak.dto.OrderDto;
import com.zipddak.dto.OrderItemDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class OrderInfoController {

	private final OrderService orderService;
	private final OrderItemService orderItemService;

	@GetMapping("user/orderInfo")
	public ResponseEntity<OrderComplateInfoDto> orderInfo(@RequestParam("orderCode") String orderCode){
		
		try {
			OrderDto orderDto = orderService.getOrderInfo(orderCode);
			
//			ProductDto productDto = orderService.getProductInfo(orderDto.getOrderIdx());
			
			List<OrderItemsDto> orderItems = orderItemService.getOrderItem(orderDto.getOrderIdx());
			
			// 외부에 노출되지 않게 없애기
			orderDto.setOrderIdx(null);
			
			OrderComplateInfoDto complateInfoDto = OrderComplateInfoDto.builder()
														.orderDto(orderDto)
														.orderItems(orderItems)
														.build();
			
			
			return ResponseEntity.ok(complateInfoDto);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
}
