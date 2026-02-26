package com.zipddak.admin.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentComplateDto {

	private String orderId;
	private String paymentKey;
	private Integer amount;
	private String productId;
	private String orderName;
	private String username;
	private Integer expertIdx;
	private Integer toolIdx;
	
}
