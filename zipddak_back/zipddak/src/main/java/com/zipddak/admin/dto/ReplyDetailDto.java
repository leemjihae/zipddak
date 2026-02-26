package com.zipddak.admin.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReplyDetailDto {

	private Integer replyId;
	private String replyUserImg;
	private String imgStoragePath;
	private String replyUsername;
	private String replyUserNickname;
	private String replyContent;
	private Date createdAt;
	
}
