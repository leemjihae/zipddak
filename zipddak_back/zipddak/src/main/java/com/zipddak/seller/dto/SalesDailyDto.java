package com.zipddak.seller.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SalesDailyDto {
	//하루 기준 집계 dto
	
	private LocalDate salesDate; //날짜
    private long totalSales; //총매출
    private long deliveryFee;	//배송비 
    private long netSales;	//순매출

}
