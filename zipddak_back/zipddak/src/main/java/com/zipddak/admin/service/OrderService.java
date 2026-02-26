package com.zipddak.admin.service;

import java.util.List;
import java.util.Map;

import com.zipddak.admin.dto.BrandDto;
import com.zipddak.admin.dto.OptionListDto;
import com.zipddak.admin.dto.RecvUserDto;
import com.zipddak.dto.OrderDto;

public interface OrderService {

	void addOrder(String username, String orderId, Map<String, Long> amount, RecvUserDto recvUser,
			List<BrandDto> brandList);

	OrderDto getOrderInfo(String orderCode) throws Exception;
	
	//대여
	public void addRentalOrder(String username, String orderId, Integer amount, RecvUserDto recvUser);

}
