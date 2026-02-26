package com.zipddak.mypage.dto;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembershipListDto {
	private Date finishDate; // 마지막 멤버십 종료일
	private Long totalMembershipMonths; // 총 이용 개월 수
	private Boolean isActiveMembership; // 현재 멤버십 활성 여부

	private List<MembershipPaymentDto> payments;

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	@Builder
	public static class MembershipPaymentDto {
		private Integer membershipIdx; // 멤버십 아이디
		private Timestamp paymentDate; // 결제 날짜
		private String paymentName; // 결제 이름
		private Date usagePeriodStart; // 멤버십 시작 날짜
		private Date usagePeriodEnd; // 멤버십 종료 날짜
		private String receiptUrl; // 결제 영수증 url
		private Integer amount; // 결제 총액
		private String paymentMethod; // 결제수단
	}
}
