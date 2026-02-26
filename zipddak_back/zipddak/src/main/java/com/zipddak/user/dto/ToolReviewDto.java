package com.zipddak.user.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ToolReviewDto {
	
	    private Integer reviewToolIdx;
	    private Integer score;
	    private String content;
	    private Date createdate;
	    private String writer;
	    private String writerImg;
	    
	    private String toolIdx;
	    private String rentalIdx;
	    private String img1;
	    private String img2;
	    private String img3;

	
}
