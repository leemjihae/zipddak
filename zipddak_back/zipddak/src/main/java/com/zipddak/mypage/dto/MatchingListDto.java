package com.zipddak.mypage.dto;

import java.sql.Date;

import com.zipddak.entity.Matching.MatchingStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchingListDto {
	private Integer matchingIdx; // 매칭 아이디
	private String matchingCode; // 매칭 코드
	private Date createdAt; // 계약일자
	private Date workStartDate; // 작업시작날짜
	private Date workEndDate; // 작업종료날짜
	private MatchingStatus status; // 작업상태
	private Integer totalAmount; // 결제금액

	private String name; // 요청자 이름
	private String activityName; // 전문가 활동명

	private Integer largeServiceIdx; // 대분류 카테고리 아이디
	private String categoryName; // 카테고리 이름
	private String location; // 장소
	private Integer budget; // 예산
	private Date preferredDate; // 희망일
	
	private Integer expertIdx; // 전문가 아이디
	private String expertThumbnail; // 전문가 프로필
	
	private boolean writeReview; // 리뷰 작성 유무
}
