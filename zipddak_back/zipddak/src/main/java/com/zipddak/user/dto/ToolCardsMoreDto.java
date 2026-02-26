package com.zipddak.user.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ToolCardsMoreDto {
	
	private List<ToolCardDto> cards;
	private long totalCount;
	private boolean hasNext;

}
