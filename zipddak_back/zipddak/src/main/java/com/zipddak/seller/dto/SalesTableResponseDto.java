package com.zipddak.seller.dto;

import java.util.List;

import com.zipddak.dto.CategoryDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SalesTableResponseDto {
	private List<CategoryDto> categories;
    private List<SalesTableRowDto> rows;

}
