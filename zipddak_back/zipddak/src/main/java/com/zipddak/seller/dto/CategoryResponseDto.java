package com.zipddak.seller.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryResponseDto {
	


	private Integer categoryIdx;
	private String name;
	private List<SubCategoryResponseDto> subCategories;

}
