package com.zipddak.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerDto {
	private Integer careerIdx;
	private Integer expertIdx;
	private String title;
	private Date startDate;
	private Date endDate;
	private String description;
	private Date createdAt;
	private Integer months;
}
