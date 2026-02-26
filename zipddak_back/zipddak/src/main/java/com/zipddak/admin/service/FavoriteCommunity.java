package com.zipddak.admin.service;

public interface FavoriteCommunity {

	boolean isFavorite(int communityId, String username) throws Exception;

	long favoriteCount(int communityId) throws Exception;

	void favoriteToggle(String username, Integer communityId) throws Exception;

	

}
