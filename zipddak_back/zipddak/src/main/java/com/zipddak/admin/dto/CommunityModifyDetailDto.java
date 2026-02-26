package com.zipddak.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityModifyDetailDto {

	private Integer communityId;
	private String title;
	private String content;
	private String img1;
	private String img2;
	private String img3;
	private String img4;
	private String img5;
	private Integer img1id;
	private Integer img2id;
	private Integer img3id;
	private Integer img4id;
	private Integer img5id;
	private String imgStoragePath;
	private Integer category;
	
	
}
