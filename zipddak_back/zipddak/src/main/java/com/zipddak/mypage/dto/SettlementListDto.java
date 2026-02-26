package com.zipddak.mypage.dto;

import java.util.List;
import java.sql.Date;

import com.zipddak.entity.Settlement.SettlementState;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SettlementListDto {
	private Integer totalSalesCount; // 총 매출 건 수
	private Integer totalSalesAmountInteger; // 이번 달 총 매출금액

	private List<SettlementItemDto> settlementItems; // 정산 대상 목록

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	public static class SettlementItemDto {
		private Integer settlementIdx; // 정산 아이디
		private Integer settlementAmount; // 정산 금액
		private Integer platformFee; // 플랫폼 수수료
		private SettlementState state; // 정산 상태
		private Date completedAt; // 정산 완료일
		private String comment; // 관리자 코멘트

		private Integer customerPayment; // 고객 결제 금액
		private String serviceName; // 작업 이름
		private Date workStartDate; // 작업 시작일
		private Date workEndDate; // 작업 종료일
		private Integer workDays; // 작업 일 수
	}
}
