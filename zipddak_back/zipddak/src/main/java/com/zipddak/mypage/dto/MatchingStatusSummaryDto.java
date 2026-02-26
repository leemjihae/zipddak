package com.zipddak.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchingStatusSummaryDto {
	private Integer paymentStatus; // 결제완료
	private Integer progressStatus; // 작업중
	private Integer completeStatus; // 작업완료
	private Integer cancelStatus; // 취소
}
