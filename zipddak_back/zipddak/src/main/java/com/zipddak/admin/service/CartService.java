package com.zipddak.admin.service;

import java.util.List;

import com.zipddak.admin.dto.CartBrandDto;
import com.zipddak.admin.dto.OrderListToListDto;
import com.zipddak.util.PageInfo;

public interface CartService {

	void addCart(OrderListToListDto orderListDto) throws Exception;

	List<CartBrandDto> cartList(String username) throws Exception;

	void decreaseCount(Integer cartIdx) throws Exception;

	void increaseCount(Integer cartIdx) throws Exception;

	void delete(List<Integer> list) throws Exception;

}
