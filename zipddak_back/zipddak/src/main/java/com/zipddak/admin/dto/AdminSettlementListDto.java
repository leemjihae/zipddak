package com.zipddak.admin.dto;

import java.sql.Date;

import com.zipddak.entity.Settlement.SettlementState;
import com.zipddak.entity.Settlement.TargetType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminSettlementListDto {

	private Integer settlementIdx;
	private TargetType userType;
	private String username;
	private String name;
	private Integer totalAmount;
	private Integer feeRate;
	private Date month;
	private Integer settlementTotalAmount;
	private SettlementState state;
	
}
