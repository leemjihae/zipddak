package com.zipddak.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OptionDto {
	
    private String optionName;
    private String optionValue;
    private long optionPrice;
    
}