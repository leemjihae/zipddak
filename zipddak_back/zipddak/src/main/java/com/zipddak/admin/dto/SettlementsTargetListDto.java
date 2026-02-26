package com.zipddak.admin.dto;

import java.math.BigDecimal;

import com.zipddak.entity.Payment.PaymentType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SettlementsTargetListDto {

	private String username;
	private String userType;
	private PaymentType paymentType;
	private long totalCount;
	private Integer totalAmount;
}
