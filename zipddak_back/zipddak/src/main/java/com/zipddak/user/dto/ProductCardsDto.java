package com.zipddak.user.dto;

import java.util.List;

import com.zipddak.admin.dto.ProductCardDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductCardsDto {
	
	private List<ProductCardDto> cards;
	private long totalCount;

}
