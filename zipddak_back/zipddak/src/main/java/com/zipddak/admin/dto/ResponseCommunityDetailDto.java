package com.zipddak.admin.dto;

import java.sql.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseCommunityDetailDto {

	private CommunityDetailDto communityDetail;
	
	private boolean checkWrite; // 글쓴이 여부
	
	private long favorite; // 공감수
	private boolean checkFavorite; // 공감 여부
	
	private long replyCount; // 댓글 수
	private ResponseReplyListAndHasnext replyList; // 댓글
	
	
	
}
