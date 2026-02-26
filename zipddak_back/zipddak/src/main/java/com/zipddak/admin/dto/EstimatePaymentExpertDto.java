package com.zipddak.admin.dto;

import java.sql.Time;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstimatePaymentExpertDto {

	private Integer expertIdx;
	private String imgName;
	private String imgStoragePath;
	private String activityName;
	private String cateName;
	private Double score;
	private Time contactStartTime;
	private Time contactEndTime;
	
}
