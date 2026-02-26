package com.zipddak.mypage.dto;

import java.sql.Date;

import com.zipddak.entity.Inquiries.AnswererType;
import com.zipddak.entity.Inquiries.InquiryType;
import com.zipddak.entity.Inquiries.WriterType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InquiryListDto {
	private Integer inquiryIdx; // 문의 아이디
	private InquiryType type; // 문의 타입
	private String content; // 문의 내용
	private String image1; // 문의 이미지1 저장경로
	private String image2; // 문의 이미지2 저장경로
	private String image3; // 문의 이미지3 저장경로
	private Date writeAt; // 문의 작성 날짜

	private String writerUsername; // 작성자 아이디
	private String writerName; // 작성자 이름
	private WriterType writerType; // 작성자 타입

	private String answererUsername; // 답변자 아이디
	private String answererName; // 답변자 이름
	private AnswererType answererType; // 답변자 타입

	private String answer; // 답변 내용
	private Date answerAt; // 답변 작성 날짜

	private Integer orderItemIdx; // 주문상품 아이디
}
