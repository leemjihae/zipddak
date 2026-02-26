package com.zipddak.admin.dto;

import java.util.List;

import com.zipddak.dto.EstimateCostDto;
import com.zipddak.entity.Estimate.WorkDurationType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstimatePaymentCostDto {

	private Integer largeServiceIdx; // 서비스 대분류 
	
	private Integer disposalCost; // 폐기물 처리기
	private Integer demolitionCost; // 철거비
	private Integer consultingLaborCost; // 컨설팅 인건비
	private Integer stylingDesignCost; // 스타일링/디자인 작업비
	private Integer threeDImageCost; // 3D 이미지 작업비
	private Integer reportProductionCost; // 보고서 제작비
	private Integer etcFee; // 기타 제작비
	private Integer consCostSum; // 컨설팅 비용 합계
	
	private List<EstimateCostDto> buildCostList; // 시공비
	private List<EstimateCostDto> materialCostList; // 자재비
	private Integer buildCostSum; // 시공비 합계
	private Integer materialCostSum; // 자재비 합계
	
	private String costDetail; // 비용 상세 설명
	
	private WorkDurationType workDurationType; // 작업 예상 타입
	private Integer workDurationValue; // 작업 예상 시간
	
}
