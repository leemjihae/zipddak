package com.zipddak.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PortfolioListDto {
	private Integer portfolioIdx; // 포트폴리오 아이디
	private String image1; // 포트폴리오 이미지1 저장경로
}
