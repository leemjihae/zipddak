package com.zipddak.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentInfoDto {

	private String orderId;
	private Integer amount;
	private String orderName;
	
}
