package com.zipddak.seller.service;

import java.util.Map;

import com.zipddak.seller.dto.SearchConditionDto;

public interface SellerOrderService {

	//주문 리스트 보기
	Map<String, Object> getMyOrderList(String sellerUsername, Integer page, SearchConditionDto scDto) throws Exception;

	//주문내역 상세보기
	Map<String, Object> getMyOrderDetail(String sellerUsername, Integer orderIdx) throws Exception;

	//자동배송완료처리
	void autoCompleteDelivery();

	

}
