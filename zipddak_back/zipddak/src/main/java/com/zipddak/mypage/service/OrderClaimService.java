package com.zipddak.mypage.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.zipddak.dto.OrderDto;
import com.zipddak.dto.ProductOptionDto;
import com.zipddak.mypage.dto.ExchangeRequestDto;
import com.zipddak.mypage.dto.ReturnRequestDto;

public interface OrderClaimService {
	void cancelOrderItem(List<Integer> orderItemIdxs) throws Exception;

	OrderDto getOrderInfo(Integer orderIdx) throws Exception;

	void returnOrderItem(ReturnRequestDto returnRequest, MultipartFile[] returnImages) throws Exception;

	List<ProductOptionDto> getProductOptionList(Integer productIdx) throws Exception;

	void exchangeOrderItem(ExchangeRequestDto exchangeRequest, MultipartFile[] exchangeImages) throws Exception;
}
