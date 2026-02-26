package com.zipddak.mypage.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SentEstimateListDto {
	private Integer estimateIdx; // 견적서 아이디
	private Date createdAt; // 등록일
	private Integer totalCost; // 견적 총액
	
	private String categoryName; // 카테고리 이름
	private String location; // 장소
	private Integer budget; // 예산
	private Date preferredDate; // 희망일
}
