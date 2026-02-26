package com.zipddak.seller.service;

import org.springframework.web.multipart.MultipartFile;

import com.zipddak.dto.SellerDto;
import com.zipddak.seller.dto.SaveResultDto;

public interface SellerMypageService {

	//프로필 상세보기
	SellerDto getMyProfileDetail(String sellerUsername);
	//프로필 수정 
	SaveResultDto profileModify(SellerDto seller_dto, String sellerUsername, MultipartFile thumbnail, Integer deleteThumbIdx) throws Exception;

}
