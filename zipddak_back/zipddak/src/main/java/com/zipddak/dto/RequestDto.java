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
public class RequestDto {
	private Integer requestIdx;
	private String userUsername;
	private Integer largeServiceIdx;
	private Integer midServiceIdx;
	private Integer smallServiceIdx;
	private Integer budget;
	private Date preferredDate;
	private String location;
	private String constructionSize;
	private String additionalRequest;
	private Integer image1Idx;
	private Integer image2Idx;
	private Integer image3Idx;
	private Date createdAt;
	private String purpose;
	private String place;
	private String status;
}
