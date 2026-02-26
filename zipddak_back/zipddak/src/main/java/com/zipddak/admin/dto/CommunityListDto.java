package com.zipddak.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityListDto {

	private Integer communityId;
	private String categoryName;
	private String title;
	private String content;
	private String nickname;
	private Integer viewCount;
	
	private long replyCount;
	
	private long favoriteCount;
	
	private String img1;
	private String imgStroagePath;
	
}
