package com.zipddak.seller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SalesAggregationDto {
	
	private String period;
    private Integer categoryIdx;
    private Long salesAmount;

}
