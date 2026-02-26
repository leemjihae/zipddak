package com.zipddak.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembershipDto {
	private Integer membershipIdx;
	private String username;
	private Integer paymentIdx;
	private Date startDate;
	private Date endDate;
}
