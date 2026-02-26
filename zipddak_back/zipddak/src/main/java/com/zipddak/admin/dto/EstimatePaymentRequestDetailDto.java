package com.zipddak.admin.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class EstimatePaymentRequestDetailDto {

	private Integer requestIdx;
	private String cateName1;
	private String cateName2;
	private String cateName3;
	private Date preferredDate;
	private Integer budget;
	private String location;
	private String additionalRequest;
	
	
}
