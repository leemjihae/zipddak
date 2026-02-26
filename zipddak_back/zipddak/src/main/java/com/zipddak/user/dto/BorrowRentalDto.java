package com.zipddak.user.dto;

import java.sql.Date;

import com.zipddak.entity.Rental.RentalStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BorrowRentalDto {

	private RentalStatus state;
	private Date startDate;
	private Date endDate;
	private Integer dateDiff;
	private Integer postCharge;
	private boolean postRental;
	private boolean directRental;
	private String recvName;
	private String recvPhone;
	private String addr1;
	private String addr2;
	
	
}
