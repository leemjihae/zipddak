package com.zipddak.seller.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor 
@AllArgsConstructor
public class OptionGroupDto {
	
	 private String optionName;
	 private List<OptionValueDto> values;

}
