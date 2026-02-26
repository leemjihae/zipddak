package com.zipddak.user.dto;

import java.sql.Date;

import com.zipddak.entity.Rental.RentalStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RentalDetailDto {

	private Integer toolIdx;
	private Integer rentalIdx;
	private String toolImg;
	private String toolName;
	private Date startDate;
	private Date endDate;
	private Integer amount;
	private RentalStatus state;
	private Boolean reviewCheck;
	
	// 빌려준 공구일 경우 신청자 이름이 포함
	private String borrowName;
	
	// 배송 조회 필요 데이터
	private String postComp;
	private String invoice;
}
