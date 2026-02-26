package com.zipddak.admin.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseReplyListAndHasnext {

	private List<ReplyDetailDto> replyList;
	private boolean hasNext;
	
}
