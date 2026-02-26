package com.zipddak.mypage.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.zipddak.entity.FavoritesCommunity;
import com.zipddak.entity.FavoritesExpert;
import com.zipddak.entity.FavoritesProduct;
import com.zipddak.entity.FavoritesTool;
import com.zipddak.mypage.dto.FavoriteCommunityDto;
import com.zipddak.mypage.dto.FavoriteExpertDto;
import com.zipddak.mypage.dto.FavoriteProductDto;
import com.zipddak.mypage.dto.FavoriteToolDto;
import com.zipddak.mypage.repository.FavoriteDslRepository;
import com.zipddak.repository.FavoritesCommunityRepository;
import com.zipddak.repository.FavoritesExpertRepository;
import com.zipddak.repository.FavoritesProductRepository;
import com.zipddak.repository.FavoritesToolRepository;
import com.zipddak.util.PageInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

	private final FavoriteDslRepository favoriteDslRepository;
	private final FavoritesProductRepository favoritesProductRepository;
	private final FavoritesToolRepository favoritesToolRepository;
	private final FavoritesExpertRepository favoritesExpertRepository;
	private final FavoritesCommunityRepository favoritesCommunityRepository;

	// 관심 상품목록 조회
	@Override
	public List<FavoriteProductDto> getFavoriteProductList(String username, PageInfo pageInfo) throws Exception {
		PageRequest pageRequest = PageRequest.of(pageInfo.getCurPage() - 1, 10);

		List<FavoriteProductDto> favoriteProductList = favoriteDslRepository.selectFavoriteProductList(username,
				pageRequest);

		// 페이지 수 계산
		Long cnt = favoriteDslRepository.selectFavoriteProductCount(username);

		Integer allPage = (int) (Math.ceil(cnt.doubleValue() / pageRequest.getPageSize()));
		Integer startPage = (pageInfo.getCurPage() - 1) / 10 * 10 + 1;
		Integer endPage = Math.min(startPage + 10 - 1, allPage);

		pageInfo.setAllPage(allPage);
		pageInfo.setStartPage(startPage);
		pageInfo.setEndPage(endPage);

		return favoriteProductList;
	}

	// 상품 좋아요 토글
	@Override
	public Boolean toggleProductLike(String username, Integer productIdx) throws Exception {
		Optional<FavoritesProduct> ofavoritesProduct = favoritesProductRepository
				.findByUserUsernameAndProductIdx(username, productIdx);

		// 좋아요 추가
		if (ofavoritesProduct.isEmpty()) {
			favoritesProductRepository
					.save(FavoritesProduct.builder().userUsername(username).productIdx(productIdx).build());

			return true;
		}
		// 좋아요 삭제
		else {
			favoritesProductRepository.delete(ofavoritesProduct.get());

			return false;
		}
	}

	// 관심 공구목록 조회
	@Override
	public List<FavoriteToolDto> getFavoriteToolList(String username, PageInfo pageInfo) throws Exception {
		PageRequest pageRequest = PageRequest.of(pageInfo.getCurPage() - 1, 10);

		List<FavoriteToolDto> favoriteToolList = favoriteDslRepository.selectFavoriteToolList(username, pageRequest);

		// 페이지 수 계산
		Long cnt = favoriteDslRepository.selectFavoriteToolCount(username);

		Integer allPage = (int) (Math.ceil(cnt.doubleValue() / pageRequest.getPageSize()));
		Integer startPage = (pageInfo.getCurPage() - 1) / 10 * 10 + 1;
		Integer endPage = Math.min(startPage + 10 - 1, allPage);

		pageInfo.setAllPage(allPage);
		pageInfo.setStartPage(startPage);
		pageInfo.setEndPage(endPage);

		return favoriteToolList;
	}

	// 공구 좋아요 토글
	@Override
	public Boolean toggleToolLike(String username, Integer toolIdx) throws Exception {
		Optional<FavoritesTool> ofavoritesTool = favoritesToolRepository.findByUserUsernameAndToolIdx(username,
				toolIdx);

		// 좋아요 추가
		if (ofavoritesTool.isEmpty()) {
			favoritesToolRepository.save(FavoritesTool.builder().userUsername(username).toolIdx(toolIdx).build());

			return true;
		}
		// 좋아요 삭제
		else {
			favoritesToolRepository.delete(ofavoritesTool.get());

			return false;
		}
	}

	// 관심 전문가목록 조회
	@Override
	public List<FavoriteExpertDto> getFavoriteExpertList(String username, PageInfo pageInfo) throws Exception {
		PageRequest pageRequest = PageRequest.of(pageInfo.getCurPage() - 1, 10);

		List<FavoriteExpertDto> favoriteExpertList = favoriteDslRepository.selectFavoriteExpertList(username,
				pageRequest);

		// 페이지 수 계산
		Long cnt = favoriteDslRepository.selectFavoriteExpertCount(username);

		Integer allPage = (int) (Math.ceil(cnt.doubleValue() / pageRequest.getPageSize()));
		Integer startPage = (pageInfo.getCurPage() - 1) / 10 * 10 + 1;
		Integer endPage = Math.min(startPage + 10 - 1, allPage);

		pageInfo.setAllPage(allPage);
		pageInfo.setStartPage(startPage);
		pageInfo.setEndPage(endPage);

		return favoriteExpertList;
	}

	// 전문가 좋아요 토글
	@Override
	public Boolean toggleExpertLike(String username, Integer expertIdx) throws Exception {
		Optional<FavoritesExpert> ofavoritesExpert = favoritesExpertRepository.findByUserUsernameAndExpertIdx(username,
				expertIdx);

		// 좋아요 추가
		if (ofavoritesExpert.isEmpty()) {
			favoritesExpertRepository
					.save(FavoritesExpert.builder().userUsername(username).expertIdx(expertIdx).build());

			return true;
		}
		// 좋아요 삭제
		else {
			favoritesExpertRepository.delete(ofavoritesExpert.get());

			return false;
		}
	}

	// 관심 커뮤니티목록 조회
	@Override
	public List<FavoriteCommunityDto> getFavoriteCommunityList(String username, PageInfo pageInfo) throws Exception {
		PageRequest pageRequest = PageRequest.of(pageInfo.getCurPage() - 1, 10);

		List<FavoriteCommunityDto> favoriteCommunityList = favoriteDslRepository.selectFavoriteCommunityList(username,
				pageRequest);

		// 페이지 수 계산
		Long cnt = favoriteDslRepository.selectFavoriteCommunityCount(username);

		Integer allPage = (int) (Math.ceil(cnt.doubleValue() / pageRequest.getPageSize()));
		Integer startPage = (pageInfo.getCurPage() - 1) / 10 * 10 + 1;
		Integer endPage = Math.min(startPage + 10 - 1, allPage);

		pageInfo.setAllPage(allPage);
		pageInfo.setStartPage(startPage);
		pageInfo.setEndPage(endPage);

		return favoriteCommunityList;
	}

	// 커뮤니티 좋아요 토글
	@Override
	public Boolean toggleCommunityLike(String username, Integer communityIdx) throws Exception {
		Optional<FavoritesCommunity> ofavoritesCommunity = favoritesCommunityRepository
				.findByUserUsernameAndCommunityIdx(username, communityIdx);

		// 좋아요 추가
		if (ofavoritesCommunity.isEmpty()) {
			favoritesCommunityRepository
					.save(FavoritesCommunity.builder().userUsername(username).communityIdx(communityIdx).build());

			return true;
		}
		// 좋아요 삭제
		else {
			favoritesCommunityRepository.delete(ofavoritesCommunity.get());

			return false;
		}
	}

	// 내 커뮤니티 목록 조회
	@Override
	public List<FavoriteCommunityDto> getMyCommunityList(String username, PageInfo pageInfo) throws Exception {
		PageRequest pageRequest = PageRequest.of(pageInfo.getCurPage() - 1, 10);

		List<FavoriteCommunityDto> myCommunityList = favoriteDslRepository.selectMyCommunityList(username, pageRequest);

		// 페이지 수 계산
		Long cnt = favoriteDslRepository.selectMyCommunityCount(username);

		Integer allPage = (int) (Math.ceil(cnt.doubleValue() / pageRequest.getPageSize()));
		Integer startPage = (pageInfo.getCurPage() - 1) / 10 * 10 + 1;
		Integer endPage = Math.min(startPage + 10 - 1, allPage);

		pageInfo.setAllPage(allPage);
		pageInfo.setStartPage(startPage);
		pageInfo.setEndPage(endPage);

		return myCommunityList;
	}

}
