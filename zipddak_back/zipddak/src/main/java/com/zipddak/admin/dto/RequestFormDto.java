package com.zipddak.admin.dto;

import java.sql.Date;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestFormDto {

	private String userUsername;
	private String cate1;
	private String cate2;
	private String cate3;
	private Integer budget;
	private Date preferredDate;
	private String addr1;
	private String addr2;
	private String constructionSize;
	private String additionalRequest;
	private String purpose;
	private String place;
	
	private List<MultipartFile> files;
	
	private String expertIdx;
	 
	
}
