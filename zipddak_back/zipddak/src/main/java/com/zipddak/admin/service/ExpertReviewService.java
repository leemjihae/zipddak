package com.zipddak.admin.service;

import java.util.List;

import com.zipddak.admin.dto.ExpertReviewDetailDto;
import com.zipddak.admin.dto.ExpertReviewDto;
import com.zipddak.admin.dto.ResponseReviewListAndHasnext;

public interface ExpertReviewService {

	ExpertReviewDto expertReviews(Integer expertIdx) throws Exception;

	ResponseReviewListAndHasnext reviewMore(Integer page, Integer expertIdx) throws Exception;

}
