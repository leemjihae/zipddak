package com.zipddak.admin.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.zipddak.admin.dto.OrderItemsDto;
import com.zipddak.admin.repository.ProductDslRepository;
import com.zipddak.dto.OrderItemDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderItemServiceImpl implements OrderItemService{

	private final ProductDslRepository productDslRepository;
	
	@Override
	public List<OrderItemsDto> getOrderItem(Integer orderIdx) throws Exception {
		
		return productDslRepository.getOrderItems(orderIdx);
	}

}
