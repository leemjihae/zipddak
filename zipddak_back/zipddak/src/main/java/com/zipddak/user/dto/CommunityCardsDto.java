package com.zipddak.user.dto;

import java.util.List;

import com.zipddak.admin.dto.CommunityListDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityCardsDto {
	
	private List<CommunityListDto> cards;
	private long totalCount;
	
}
