package com.zipddak.user.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zipddak.admin.dto.ProductCardDto;
import com.zipddak.user.dto.CommunityCardsDto;
import com.zipddak.user.dto.ExpertCardsDto;
import com.zipddak.user.dto.ProductCardsDto;
import com.zipddak.user.dto.ToolCardsDto;
import com.zipddak.user.repository.CommunityCardDsl;
import com.zipddak.user.repository.ExpertCardDsl;
import com.zipddak.user.repository.ProductCardDsl;
import com.zipddak.user.repository.ToolCardDsl;

@Service
public class MainServiceImpl implements MainService {
	
	@Autowired
	private ExpertCardDsl expertCardDsl;
	
	@Autowired
	private ToolCardDsl toolCardDsl;
	
	@Autowired
	private ProductCardDsl productCardDsl;
	
	@Autowired
	private CommunityCardDsl communityCardDsl;

	@Override
	public ExpertCardsDto expertCardMain(Integer categoryNo, String keyword) throws Exception {
		return expertCardDsl.expertsMain(categoryNo, keyword);
	}

	@Override
	public ToolCardsDto toolCardMain(Integer categoryNo, String keyword, String username) throws Exception {
		return toolCardDsl.toolsMain(categoryNo, keyword, username);
	}

	@Override
	public ProductCardsDto productCardMain(Integer categoryNo, String keyword, String username) throws Exception {
		return productCardDsl.productsMain(categoryNo, keyword, username);
	}

	@Override
	public CommunityCardsDto communityCardMain(Integer categoryNo, String keyword) throws Exception {
		return communityCardDsl.communityMain(categoryNo, keyword);
	}
	
	@Override
	public List<ProductCardDto> products100(String username) throws Exception {
		return productCardDsl.Bestproducts(username);
	}

	

}
