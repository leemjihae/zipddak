package com.zipddak.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BeforeToolReviewDto {
	private String toolName; // 공구 이름
	private String toolThumbnail; // 공구 썸네일 저장경로
	private String ownerNickname; // 대여자 닉네임

	private Integer toolIdx; // 공구 아이디
	private Integer rentalIdx; // 대여 아이디
}
