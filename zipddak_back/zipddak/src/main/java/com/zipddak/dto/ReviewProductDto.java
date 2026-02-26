package com.zipddak.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewProductDto {
	private Integer reviewProductIdx;
	private Integer score;
	private String content;
	private Date createdate;
	private String writer;
	private Integer orderItemIdx;
	private Integer img1;
	private Integer img2;
	private Integer img3;
	
	private Integer productIdx;
	private String productName;
}
