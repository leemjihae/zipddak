package com.zipddak.admin.dto;

import java.util.List;

import com.zipddak.dto.UserDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LastOrderResponseDto {

	private UserDto userInfo;
	private List<BrandDto> brandDto;
	
}
