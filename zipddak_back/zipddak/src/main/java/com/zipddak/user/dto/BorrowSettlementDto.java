package com.zipddak.user.dto;

import java.sql.Date;

import com.zipddak.entity.Settlement.SettlementState;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BorrowSettlementDto {

	private Date completedAt;
	private Integer totalAmount;
	private Integer feeRate;
	private String account;
	private String bank;
	private String host;
	private SettlementState state;
	private Integer money;
	
}
