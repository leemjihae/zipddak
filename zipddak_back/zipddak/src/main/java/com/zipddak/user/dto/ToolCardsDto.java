package com.zipddak.user.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ToolCardsDto {
	
	private List<ToolCardDto> cards;
	private long totalCount;

}
