package com.zipddak.mypage.service;

import java.util.List;

import com.zipddak.mypage.dto.FavoriteCommunityDto;
import com.zipddak.mypage.dto.FavoriteExpertDto;
import com.zipddak.mypage.dto.FavoriteProductDto;
import com.zipddak.mypage.dto.FavoriteToolDto;
import com.zipddak.util.PageInfo;

public interface FavoriteService {
	List<FavoriteProductDto> getFavoriteProductList(String username, PageInfo pageInfo) throws Exception;

	Boolean toggleProductLike(String username, Integer productIdx) throws Exception;

	List<FavoriteToolDto> getFavoriteToolList(String username, PageInfo pageInfo) throws Exception;

	Boolean toggleToolLike(String username, Integer toolIdx) throws Exception;

	List<FavoriteExpertDto> getFavoriteExpertList(String username, PageInfo pageInfo) throws Exception;

	Boolean toggleExpertLike(String username, Integer expertIdx) throws Exception;

	List<FavoriteCommunityDto> getFavoriteCommunityList(String username, PageInfo pageInfo) throws Exception;

	Boolean toggleCommunityLike(String username, Integer communityIdx) throws Exception;

	List<FavoriteCommunityDto> getMyCommunityList(String username, PageInfo pageInfo) throws Exception;
}
