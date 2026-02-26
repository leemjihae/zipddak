package com.zipddak.seller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor 
@AllArgsConstructor
public class OptionValueDto {
	
	private String value;
    private Long price;
}
