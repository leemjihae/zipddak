package com.zipddak.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseBorrowDetailDto {

	private BorrowToolDto tool;
	private BorrowRentalDto rental;
	private BorrowPaymentDto payment;
	
	// 빌려준 공구 상세 에서 쓸 정산 DTO
	private BorrowSettlementDto settlement;

	public ResponseBorrowDetailDto(BorrowToolDto tool, BorrowRentalDto rental, BorrowPaymentDto payment) {
		this.tool = tool;
		this.rental = rental;
		this.payment = payment;
	}
	
	
	
}
