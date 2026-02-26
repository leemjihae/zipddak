package com.zipddak.dto;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.persistence.Column;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDto {
	private Integer orderItemIdx;
	private Integer orderIdx;
	private Integer productIdx;
	private Integer productOptionIdx;
	private Long unitPrice;
	private Integer quantity;
	private String receiveWay;
	private String postComp;
	private String trackingNo; 
	private LocalDateTime firstShipDate; // 최초 출고일자
	private String orderStatus;
	private Integer refundIdx;
	private Integer exchangeIdx;
	private Integer exchangeNewOptIdx;
	private Integer cancelIdx;
	private Date createdAt;
	private LocalDateTime exchangeRejectedAt;  //교환 거절일자 (판매자)
	private LocalDateTime exchangeAcceptedAt;	//교환 접수수락일자 (판매자) = 수거요청일자
	private LocalDateTime exchangePickupComplatedAt; //교환 수거완료일자 (판매자)
	private LocalDateTime resendAt; //교환 재배송 일자 (판매자)
	private LocalDateTime exchangeComplatedAt;  //교환 처리완료 일자 
	private LocalDateTime refundRejectedAt;  //반품 거절일자 (판매자)
	private LocalDateTime refundAcceptedAt;	//반품 접수수락일자 (판매자) = 수거요청일자
	private LocalDateTime refundPickupComplatedAt; //반품 수거완료일자 (판매자)
	private LocalDateTime refundComplatedAt;  //반품 처리완료 일자 

	//jon용 컬럼 
	private String name;
	private String sellerUsername;
	private String customerUsername;
	private String postType;	//배송타입 (bundle / single)
	private String productName;	//상품명
	private Long postCharge;	//배송비
	private String optionName;	//옵션명
	private String optionValue;	//옵션선택값
	private Long optionPrice;	//옵션추가금액 
	private String thumbnailFileRename;
}
