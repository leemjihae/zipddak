package com.zipddak.seller.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SalesMonthlyResponseDto {
	
	private SalesMonthlyTotalDto monthTotal;
    private List<SalesDailyDto> dailyList;

}
