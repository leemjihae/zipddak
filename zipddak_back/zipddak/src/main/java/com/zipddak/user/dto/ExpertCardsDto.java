package com.zipddak.user.dto;

import java.util.List;

import com.zipddak.admin.dto.ExpertCardDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExpertCardsDto {
	
	private List<ExpertCardDto> cards;
	private long totalCount;

}
