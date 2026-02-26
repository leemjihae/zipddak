package com.zipddak.seller.service;

import java.util.Map;

import com.zipddak.seller.dto.SearchConditionDto;

public interface SellerShippingService {

	//배송 진행 리스트
	Map<String, Object> getMyShippingList(String sellerUsername, Integer page, SearchConditionDto scDto) throws Exception;

}
