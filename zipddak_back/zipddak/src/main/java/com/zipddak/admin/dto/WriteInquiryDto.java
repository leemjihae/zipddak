package com.zipddak.admin.dto;

import lombok.Builder;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WriteInquiryDto {

	private Integer productIdx;
	private String username;
	private String content;
	private List<MultipartFile> files;
	
}
