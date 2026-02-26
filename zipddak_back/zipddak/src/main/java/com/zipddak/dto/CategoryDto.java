package com.zipddak.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDto {
	private Integer categoryIdx;
	private String name;
	private Integer depth;
	private Integer parentIdx;
	private String type;
	
	
	
}
