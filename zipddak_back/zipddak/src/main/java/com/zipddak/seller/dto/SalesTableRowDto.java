package com.zipddak.seller.dto;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SalesTableRowDto {
	
	private String period;                 
    private Map<Integer, Long> categorySales;
    private long total;

}
