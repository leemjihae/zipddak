package com.zipddak.mypage.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.zipddak.dto.InquiriesDto;
import com.zipddak.mypage.dto.InquiryListDto;
import com.zipddak.util.PageInfo;

public interface InquiryService {
	List<InquiryListDto> getMyInquiryList(String username, PageInfo pageInfo) throws Exception;

	void writeInquiry(InquiriesDto inquiriesDto, MultipartFile[] inquiriyImages) throws Exception;
}
