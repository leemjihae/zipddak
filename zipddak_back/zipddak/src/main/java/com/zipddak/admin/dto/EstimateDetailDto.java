package com.zipddak.admin.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstimateDetailDto {
	
	private Integer estimateIdx;
	private EstimatePaymentRequestDetailDto requestDto;
	private EstimatePaymentExpertDto expertDto;
	private EstimatePaymentCostDto costDto;
	
}
