package com.zipddak.admin.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.admin.dto.ReplyDetailDto;
import com.zipddak.admin.dto.ResponseReplyListAndHasnext;
import com.zipddak.entity.QProfileFile;
import com.zipddak.entity.QReply;
import com.zipddak.entity.QUser;

@Repository
public class ReplyDslRepository {

	@Autowired
	private JPAQueryFactory jpaQueryFactory;

	public ResponseReplyListAndHasnext replyList(int communityId, PageRequest pageRequest) {

		QUser user = QUser.user;
		QProfileFile profile = QProfileFile.profileFile;
		QReply reply = QReply.reply;
		
		 List<ReplyDetailDto> replyList = jpaQueryFactory.select(Projections.bean(ReplyDetailDto.class, 
						reply.replyIdx.as("replyId"),
						profile.fileRename.as("replyUserImg"),
						profile.storagePath.as("imgStoragePath"),
						user.nickname.as("replyUserNickname"),
						user.username.as("replyUsername"),
						reply.context.as("replyContent"),
						reply.createdate.as("createdAt")
				))
				.from(reply)
				.leftJoin(user).on(user.username.eq(reply.writer))
				.leftJoin(profile).on(user.profileImg.eq(profile.profileFileIdx))
				.where(reply.communityIdx.eq(communityId))
				.offset(pageRequest.getOffset())
				.limit(pageRequest.getPageSize() + 1)
				.orderBy(reply.replyIdx.desc())
				.fetch();
		 
		 boolean hasNext = replyList.size() > pageRequest.getPageSize();
				
		// 한개 더 가져온거 제거
			if(hasNext) {
				replyList.remove(pageRequest.getPageSize());
			}
		 
			
		return new ResponseReplyListAndHasnext(replyList, hasNext);
			
	}
	
}
