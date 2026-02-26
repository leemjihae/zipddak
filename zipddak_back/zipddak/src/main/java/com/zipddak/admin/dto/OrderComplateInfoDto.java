package com.zipddak.admin.dto;

import java.util.List;

import com.zipddak.dto.OrderDto;
import com.zipddak.dto.OrderItemDto;
import com.zipddak.dto.ProductDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderComplateInfoDto {

	private OrderDto orderDto;
	private List<OrderItemsDto> orderItems;
	private ProductDto productDto;
	
}
