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
public class PublicRequestListDto {
	private Integer requestIdx; // 요청서 아이디
	private Date createdAt; // 등록일

	private String requesterName; // 요청자 이름
	private String requesterProfile; // 요청자 프로필 이미지
	private Long expertResponseCount; // 견적 보낸 전문가 수

	private String categoryName; // 카테고리 이름
	private String location; // 장소
	private Integer budget; // 예산
	private Date preferredDate; // 희망일
}
