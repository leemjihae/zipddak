package com.zipddak.seller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SalesMonthlyTotalDto {
	//매출 월합계 Dto 
	
	private long totalSales;
    private long deliveryFee;
    private long netSales;
	

}
