package com.zipddak.mypage.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpertSettleDto {
	private String settleBank; // 은행명
	private String settleAccount; // 계좌번호
	private String settleHost; // 예금주
	
	private String activityStatus; // 전문가 활동상태
}