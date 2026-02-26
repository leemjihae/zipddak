package com.zipddak.seller.dto;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShippingManageDto {

	
    private String orderCode;        // 주문번호
    private String shippingProductName;      // 상품명
    private String trackingNo;       // 최초 송장번호
    private String postComp;         // 택배사
    private String orderStatus;      // 주문상태
    private Date orderDate;          // 주문일자
    
    private Long itemCount;			//배송중인 아이템 수 
    private LocalDateTime firstShipDate;	//최초 발송일자
    
    private Integer orderIdx;
    
    
}
