package com.zipddak.admin.service;

import com.zipddak.admin.dto.EstimatePaymentCostDto;

public interface EstimateDetailService {

	boolean estimateCheck(Integer estimateIdx, String username) throws Exception;

	EstimatePaymentCostDto detail(Integer estimateIdx) throws Exception;

}
