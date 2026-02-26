package com.zipddak.user.service;

public interface FavoriteToolService {
	
	void toggleFavorite(Integer toolIdx, String username);
	
	Boolean isHeartTool (Integer toolIdx, String username);
	
	Boolean isHeartProduct (Integer productIdx, String username);
	

}
