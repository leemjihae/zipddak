package com.zipddak.dto;

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
public class InquiriesDto {
	private Integer inquiryIdx;
	private InquiryType type;
	private String content;
	private String writerUsername;
	private WriterType writerType;
	private String answererUsername;
	private AnswererType answererType;
	private String answer;
	private Integer image1Idx;
	private Integer image2Idx;
	private Integer image3Idx;
	private Integer orderItemIdx;
	private Date writeAt;
	private Date answerAt;
	private Integer productIdx;

}
