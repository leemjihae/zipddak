package com.zipddak.admin.dto;


import com.zipddak.entity.Estimate.WorkDurationType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstimatePaymentStep1Dto {

	private String username;
	private Integer expertIdx;
	private Integer estimateIdx;
	private WorkDurationType workDurationType;
	private Integer workDurationValue;
	private Integer requestIdx;
	
}
