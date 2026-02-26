package com.zipddak.user.dto;

import java.sql.Date;
import java.sql.Timestamp;

import com.zipddak.entity.Rental.RentalStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BorrowPaymentDto {

	private String method;
	private Integer totalAmount;
	private Timestamp appAt;
	
	
	
}
