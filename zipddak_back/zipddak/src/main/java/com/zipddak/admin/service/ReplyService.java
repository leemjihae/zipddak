package com.zipddak.admin.service;

import java.util.List;

import com.zipddak.admin.dto.ReplyDetailDto;
import com.zipddak.admin.dto.ResponseReplyListAndHasnext;

public interface ReplyService {

	long replyCountByCommunityId(int communityId) throws Exception;

	ResponseReplyListAndHasnext replayList(int communityId, int page);

	void writeReply(String username, String content, Integer communityId) throws Exception;

	ResponseReplyListAndHasnext replyMore(Integer communityId, Integer page) throws Exception;

	void deleteReply(Integer replyId) throws Exception;

}
