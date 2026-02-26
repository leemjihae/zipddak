package com.zipddak.mypage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteCommunityDto {
	private Integer communityIdx; // 커뮤니티 아이디
	private String categoryName; // 카테고리명
	private String title; // 타이틀
	private String content; // 내용
	private String thumbnail; // 썸네일 경로
	private String writerNickname; // 글쓴이 닉네임
	private Integer views; // 조회수

	private Long replyCount; // 댓글 수
}
