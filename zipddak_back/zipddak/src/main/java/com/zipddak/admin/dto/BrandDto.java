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
public class BrandDto {

	private Integer sellerIdx;
	private String brandName;
	private long freeChargeAmount;
	private long basicPostCharge;
	private List<OptionListDto> orderList;
	
}
