package com.zipddak.mypage.dto;

import java.util.List;

import com.zipddak.entity.Estimate.WorkDurationType;
import com.zipddak.mypage.dto.EstimateWriteDto.EstimateCostListDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstimateUpdateDto {
	private Integer estimateIdx;
	private Integer requestIdx; // 요청서 아이디
	private Integer largeServiceIdx; // 전문가 서비스 대분류
	private String username; // 전문가 아이디

	private WorkDurationType workDurationType; // 작업예상시간 타입
	private Integer workDurationValue; // 작업예상시간 값
	private String workScope; // 작업범위 (콤마로구분)
	private String workDetail; // 작업상세내용

	private List<EstimateCostListDto> costList;

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

}
