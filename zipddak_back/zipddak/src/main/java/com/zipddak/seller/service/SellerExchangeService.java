package com.zipddak.seller.service;

import java.util.Map;

import com.zipddak.seller.dto.SearchConditionDto;

public interface SellerExchangeService {

	// 교환 리스트
	Map<String, Object> getMyExchangeList(String sellerUsername, Integer page, SearchConditionDto scDto) throws Exception;

}
