package com.zipddak.admin.service;

import java.util.List;

import com.zipddak.admin.dto.OrderItemsDto;
import com.zipddak.dto.OrderItemDto;

public interface OrderItemService {

	List<OrderItemsDto> getOrderItem(Integer orderIdx) throws Exception;

}
