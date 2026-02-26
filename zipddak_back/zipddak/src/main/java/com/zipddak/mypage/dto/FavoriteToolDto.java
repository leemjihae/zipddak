package com.zipddak.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteToolDto {
	private Integer toolIdx; // 공구 아이디
	private String toolName; // 공구 이름
	private String thumbnail; // 썸네일 경로
	private Long rentalPrice; // 1일 대여비
	private String tradeAddr; // 거래희망장소
}
