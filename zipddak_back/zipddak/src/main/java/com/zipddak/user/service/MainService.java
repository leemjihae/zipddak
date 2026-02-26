package com.zipddak.user.service;

import java.util.List;

import com.zipddak.admin.dto.ExpertCardDto;
import com.zipddak.admin.dto.ProductCardDto;
import com.zipddak.user.dto.CommunityCardsDto;
import com.zipddak.user.dto.ExpertCardsDto;
import com.zipddak.user.dto.ProductCardsDto;
import com.zipddak.user.dto.ToolCardDto;
import com.zipddak.user.dto.ToolCardsDto;

public interface MainService {
	
	//전문가
	ExpertCardsDto expertCardMain(Integer categoryNo, String keyword) throws Exception;
	
	//공구
	ToolCardsDto toolCardMain(Integer categoryNo, String keyword, String username) throws Exception;
	
	//상품
	ProductCardsDto productCardMain(Integer categoryNo, String keyword, String username)throws Exception;
	
	//커뮤니티
	CommunityCardsDto communityCardMain (Integer categoryNo, String keyword)throws Exception;
	
	//베스트 100
	List<ProductCardDto> products100(String username)throws Exception;
	
}
