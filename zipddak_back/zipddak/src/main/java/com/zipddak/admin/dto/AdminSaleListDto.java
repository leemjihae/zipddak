package com.zipddak.admin.dto;

import java.sql.Date;

import com.zipddak.entity.Order.PaymentStatus;
import com.zipddak.entity.Rental.RentalStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminSaleListDto {

	private Integer orderIdx;
	private String orderCode;
	private String buyer;
	private String recv;
	private long amount;
	private Date createdAt;
	private PaymentStatus state;
	
}
