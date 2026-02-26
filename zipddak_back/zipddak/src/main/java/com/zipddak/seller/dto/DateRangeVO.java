package com.zipddak.seller.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DateRangeVO {
	
	private LocalDate startDate;
    private LocalDate endDate;

}
