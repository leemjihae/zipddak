package com.zipddak.dto;

import java.sql.Date;

import com.zipddak.entity.Estimate.WorkDurationType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstimateDto {
	private Integer estimateIdx;
	private Integer requestIdx;
	private Integer largeServiceIdx;
	private String diagnosisType;
	private String repairType;
	private String demolitionType;
	private String consultingType;
	private WorkDurationType workDurationType;
	private Integer workDurationValue;
	private String workScope;
	private String workDetail;
	private Integer disposalCost;
	private Integer demolitionCost;
	private Integer consultingLaborCost;
	private Integer stylingDesignCost;
	private Integer threeDImageCost;
	private Integer reportProductionCost;
	private Integer etcFee;
	private String costDetail;
	private Date createdAt;

	private Integer expertIdx;
	private String activityName;
}
