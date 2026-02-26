package com.zipddak.seller.dto;

import java.util.List;

import com.zipddak.enums.TrackingRegistType;

import lombok.Data;

@Data
public class OrderItemActionRequestDto {
	
	private Integer orderIdx;
	private List<Integer> itemIdxs;
	private Integer num;
	private String claimType;
	
//	private String refundReason;	//환불처리에서만 사용 (환불사유)
//	private String refundDetailReason;	//환불처리에서만 사용 (환불사유상세)
	
//	private String rejectReason;	//거절처리에서만 사용 (거절사유)
//	private String rejectDetailReason;	//거절처리에서만 사용 (거절사유상세)
	
	private TrackingRegistType registType;	//어느 상황의 운송장 등록인지 판별용 
	private String postComp; // 운송장 등록에서만 사용(택배사)
    private String trackingNumber;  // 운송장 등록에서만 사용(송장번호)

}
