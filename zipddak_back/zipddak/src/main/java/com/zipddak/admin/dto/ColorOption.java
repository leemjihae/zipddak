package com.zipddak.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ColorOption {

	private Integer optionId;
	private Long price;
	private String color;

}
