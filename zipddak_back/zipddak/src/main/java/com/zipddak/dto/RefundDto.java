package com.zipddak.dto;

import java.sql.Date;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefundDto {
    private Integer refundIdx;
    private Integer orderIdx;
    private String reasonType;
    private String reasonDetail;
    private Integer image1Idx;
    private Integer image2Idx;
    private Integer image3Idx;
    private String shippingChargeType;
    private Integer returnShippingFee;
    private Integer refundAmount;
    private String pickupPostComp;
    private String pickupTrackingNo;
    private Date createdAt;
    
    //join용 컬럼
    private String orderCode;        // 주문번호
    private Date orderDate; 		//주문 일자
    private String refundProductName;      // 반품 상품명
    private Long refundItemCount;	//반품요청 상품 개수
    private String orderStatus;      // 주문(처리)상태
    private String username;		//구매자
    private String customerName;	//수령자
    private String customerPhone;	//수령자 연락처
    private String refundImage1;
    private String refundImage2;
    private String refundImage3;
    private String postZonecode;
    private String postAddr1;
    private String postAddr2;
    private String paymentMethod;  //환불수단(=결제수단)
    
}
