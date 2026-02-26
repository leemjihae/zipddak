package com.zipddak.admin.service;

import com.zipddak.admin.dto.EstimatePaymentRequestDetailDto;
import com.zipddak.admin.dto.RequestFormDto;
public interface RequestService {

	void writeRequest(RequestFormDto requestForm) throws Exception;

	EstimatePaymentRequestDetailDto detail(Integer estimateIdx, String username) throws Exception;

	boolean requestCheck(String username) throws Exception;

}
