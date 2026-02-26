package com.zipddak.admin.service;

public interface FavoriteExpertService {

	void favoriteToggle(String username, Integer expertIdx) throws Exception;
	
	Boolean expertFavoriteUser(Integer expertIdx, String username);
}
