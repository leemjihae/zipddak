package com.zipddak.admin.service;

import java.util.Optional;

import com.zipddak.admin.dto.EstimatePaymentStep1Dto;
import com.zipddak.entity.Matching;

public interface MatchingService {

	void createMatching(EstimatePaymentStep1Dto paymentDto, String orderId) throws Exception;

	Optional<Matching> checkMatchingState(Integer estimateIdx) throws Exception;

}
