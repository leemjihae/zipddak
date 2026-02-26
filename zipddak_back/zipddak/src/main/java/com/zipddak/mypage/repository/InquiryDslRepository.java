package com.zipddak.mypage.repository;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.entity.QInquireFile;
import com.zipddak.entity.QInquiries;
import com.zipddak.entity.QUser;
import com.zipddak.mypage.dto.InquiryListDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class InquiryDslRepository {

	private final JPAQueryFactory jpaQueryFactory;

	// 내가 작성한 문의목록 조회
	public List<InquiryListDto> selectMyInquiryList(String username, PageRequest pageRequest) throws Exception {

		QInquiries inquiries = QInquiries.inquiries;
		QUser user1 = new QUser("user1");
		QUser user2 = new QUser("user2");
		QInquireFile inquiryFile1 = new QInquireFile("inquiryFile1");
		QInquireFile inquiryFile2 = new QInquireFile("inquiryFile2");
		QInquireFile inquiryFile3 = new QInquireFile("inquiryFile3");

		return jpaQueryFactory.select(Projections.constructor(InquiryListDto.class,

				inquiries.inquiryIdx, inquiries.type, inquiries.content, inquiryFile1.storagePath,
				inquiryFile2.storagePath, inquiryFile3.storagePath, inquiries.writeAt, user1.username, user1.name,
				inquiries.writerType, user2.username, user2.name, inquiries.answererType, inquiries.answer,
				inquiries.answerAt, inquiries.orderItemIdx)).from(inquiries).leftJoin(user1)
				.on(user1.username.eq(username)).leftJoin(user2).on(user2.username.eq(inquiries.answererUsername))
				.leftJoin(inquiryFile1).on(inquiryFile1.inquireFileIdx.eq(inquiries.image1Idx)).leftJoin(inquiryFile2)
				.on(inquiryFile2.inquireFileIdx.eq(inquiries.image2Idx)).leftJoin(inquiryFile3)
				.on(inquiryFile3.inquireFileIdx.eq(inquiries.image3Idx)).where(inquiries.writerUsername.eq(username))
				.orderBy(inquiries.writeAt.desc()).offset(pageRequest.getOffset()).limit(pageRequest.getPageSize())
				.fetch();
	}

	// 내가 작성한 문의목록 개수
	public Long selectMyInquiryCount(String username) throws Exception {
		QInquiries inquiries = QInquiries.inquiries;

		return jpaQueryFactory.select(inquiries.count()).from(inquiries).where(inquiries.writerUsername.eq(username))
				.fetchOne();
	}
}
