package com.zipddak.admin.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.zipddak.admin.dto.ExpertReviewDetailDto;
import com.zipddak.admin.dto.ExpertReviewDto;
import com.zipddak.admin.dto.ExpertReviewScoreDto;
import com.zipddak.admin.dto.ResponseReviewListAndHasnext;
import com.zipddak.admin.repository.ExpertFindDslRepository;
import com.zipddak.util.PageInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpertReviewServiceImpl implements ExpertReviewService{

	private final ExpertFindDslRepository expertFindDslRepository;
	
	@Override
	public ExpertReviewDto expertReviews(Integer expertIdx) throws Exception {
		
		ExpertReviewScoreDto reviewScoreDto = expertFindDslRepository.reviewScore(expertIdx);
		
		// 처음 호출되는 페이지 1
		PageInfo pageInfo = new PageInfo(1);
		PageRequest pageRequest = PageRequest.of(pageInfo.getCurPage() - 1, 5);
		ResponseReviewListAndHasnext reviewList = expertFindDslRepository.reviewList(pageRequest, expertIdx);
		
		return new ExpertReviewDto(reviewScoreDto, reviewList);
	}

	@Override
	public ResponseReviewListAndHasnext reviewMore(Integer page, Integer expertIdx) throws Exception {

		PageInfo pageInfo = new PageInfo(page);
		PageRequest pageRequest = PageRequest.of(pageInfo.getCurPage() - 1, 5);
		
		ResponseReviewListAndHasnext reviewList = expertFindDslRepository.reviewList(pageRequest, expertIdx);
		
		return reviewList;
	}

}
