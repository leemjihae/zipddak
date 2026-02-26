package com.zipddak.admin.dto;

import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderListDto {
	
	private Integer productId;
	private Integer optionId;
	private String name;
	private String value;
	private Integer price;
	private Integer count;
}
