package com.zipddak.dto;


import java.sql.Timestamp;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminPaymentListDto {

	private Integer paymentIdx;
	private String orderId;
	private String orderName;
	private Timestamp approvedAt;
	private String method;
	private Integer amount;
	private String state;
	
}
