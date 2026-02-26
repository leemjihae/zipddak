package com.zipddak.seller.service;

import java.util.List;
import java.util.Map;

import com.zipddak.entity.OrderItem;
import com.zipddak.seller.dto.SearchConditionDto;

public interface SellerRefundService {

	//반품 진행 리스트 
	Map<String, Object> getMyRefundList(String sellerUsername, Integer page, SearchConditionDto scDto) throws Exception;
	//반품요청 상세보기  
	Map<String, Object> getRefundReqDetail(String sellerUsername, Integer refundIdx);

	


}
