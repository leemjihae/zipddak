package com.zipddak.admin.dto;

import java.sql.Date;

import com.zipddak.entity.Rental.RentalStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminRentalListDto {

	private Integer rentalIdx; // 대여 번호
	private String toolName; // 공구 이름
	private String owner; // 빌려준 사람
	private String borrower; // 빌린 사람
	private Date startDate; // 대여 날짜
	private Date endDate; // 반납 날짜
	private RentalStatus state; // 상태
	
}
