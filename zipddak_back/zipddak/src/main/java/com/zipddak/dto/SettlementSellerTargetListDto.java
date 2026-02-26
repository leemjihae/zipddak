package com.zipddak.dto;

import com.zipddak.admin.dto.SettlementsTargetListDto;
import com.zipddak.entity.Payment.PaymentType;
import com.zipddak.entity.Product.PostType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SettlementSellerTargetListDto {

	private String username;
	private long basicPostCharge;
	private long freeChargeAmount;
	private PostType postType;
	private long postCharge;
	private long totalAmount;
	private Integer totalQuantity;
	
}
