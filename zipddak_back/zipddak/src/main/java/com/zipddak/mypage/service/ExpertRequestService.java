package com.zipddak.mypage.service;

import java.util.List;
import java.util.Map;

import com.zipddak.mypage.dto.PublicRequestDetailDto;
import com.zipddak.mypage.dto.PublicRequestListDto;
import com.zipddak.mypage.dto.ReceiveRequestDetailDto;
import com.zipddak.mypage.dto.ReceiveRequestListDto;
import com.zipddak.mypage.dto.RequestActiveDetailDto;
import com.zipddak.mypage.dto.RequestActiveExpertListDto;
import com.zipddak.mypage.dto.RequestHistoryListDto;
import com.zipddak.util.PageInfo;

public interface ExpertRequestService {
	List<PublicRequestListDto> getPublicRequestList(Long lastId, int size) throws Exception;

	PublicRequestDetailDto getPublicRequestDetail(Integer requestIdx) throws Exception;
	
	List<ReceiveRequestListDto> getExpertReceiveRequestList(String username, PageInfo pageInfo) throws Exception;
	
	ReceiveRequestDetailDto getExpertReceiveRequestDetail(Integer requestIdx) throws Exception;
	
	List<RequestHistoryListDto> getUserRequestHistoryList(String username, String status, PageInfo pageInfo) throws Exception;
	
	List<RequestActiveExpertListDto> getRequestActiveExpertList(String username) throws Exception;
	
	RequestActiveDetailDto getUserRequestActiveDetail(String username) throws Exception;
	
	Map<String, Object> getUserEstimateActiveDetail(Integer estimateIdx) throws Exception;
	
	Boolean stopRequest(Integer requestIdx) throws Exception;
}
