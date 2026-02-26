package com.zipddak.mypage.dto;

import java.sql.Date;

import com.zipddak.entity.Estimate.WorkDurationType;
import com.zipddak.entity.Matching.MatchingStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMatchingDetailDto {
	/* 매칭 */
	private Integer matchingIdx; // 매칭 아이디
	private String matchingCode; // 매칭 코드
	private Integer totalAmount; // 결제 금액
	private String method; // 결제 방법
	private Date workStartDate; // 작업 시작일
	private Date workEndDate; // 작업 종료일
	private MatchingStatus matchingStatus; // 작업 상태
	private Date matchingAt; // 계약일

	/* 견적서 */
	private Integer estimateIdx; // 견적서 아이디

	private WorkDurationType workDurationType; // 작업예상시간 타입
	private Integer workDurationValue; // 작업예상시간 값
	private String workScope; // 작업범위 (콤마로구분)
	private String workDetail; // 작업상세내용

	private Integer disposalCost; // 폐기물 처리비
	private Integer demolitionCost; // 철거비
	private Integer etcFee; // 기타비용
	private String costDetail; // 비용상세내용

	// 대분류 = 수리
	private String diagnosisType; // 사전진단 필요여부
	private String repairType; // 수리방식

	// 대분류 = 인테리어
	private String demolitionType; // 철거방식

	// 대분류 = 컨설팅
	private String consultingType; // 컨설팅방식

	private Integer consultingLaborCost; // 컨설팅 인건비
	private Integer stylingDesignCost; // 스타일링디자인 작업비
	private Integer threeDImageCost; // 3D이미지 작업비
	private Integer reportProductionCost; // 보고서 제작비

	/* 요청서 */
	private Integer requestIdx; // 요청서 아이디
	private Date requestAt; // 요청일
	private String largeServiceName; // 서비스 대분류 이름
	private String midServiceName; // 서비스 중분류 이름
	private String smallServiceName; // 서비스 소분류 이름

	private Integer budget; // 예산
	private Date preferredDate; // 희망 시공일
	private String location; // 시공 장소
	private String constructionSize; // 시공 사이즈
	private String purpose; // 시공 목적
	private String place; // 시공할 공간
	private String additionalRequest; // 추가 요청사항
	private String status; // 요청서 진행 상태
	private String image1Idx;
	private String image2Idx;
	private String image3Idx;
}
