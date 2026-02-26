package com.zipddak.seller.service;

import java.util.List;
import java.util.Map;

import com.zipddak.seller.dto.CompletedResponseDto;
import com.zipddak.seller.dto.OrderItemActionRequestDto;
import com.zipddak.seller.dto.SaveResultDto;

public interface ModalActionService {
	
	
	//운송장 등록
	SaveResultDto registerTrackingNo(OrderItemActionRequestDto reqItems);
	//수거완료처리
	CompletedResponseDto pickupComplated(OrderItemActionRequestDto req);
	//환불처리
	SaveResultDto refundItems(Integer orderIdx, List<Integer> itemIdxs);
	//반품 거절 처리 
	SaveResultDto refundRejectItems(OrderItemActionRequestDto reqItems);
	//반품 접수 수락 처리 
	SaveResultDto refundAcceptItems(OrderItemActionRequestDto reqItems);

}
