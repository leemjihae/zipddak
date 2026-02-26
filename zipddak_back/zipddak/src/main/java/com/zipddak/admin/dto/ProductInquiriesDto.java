package com.zipddak.admin.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString

public class ProductInquiriesDto {
	
	private Integer inquiryIdx;
	private String writerNickname; // 문의 작성자 닉네임
	private String content; // 문의 내용
	private String answer; // 답변
	private Date writeAt; // 질문일
	private Date answerAt; // 답변일
	private String brandName; // 자재업체이름
	
	
	
	
}
