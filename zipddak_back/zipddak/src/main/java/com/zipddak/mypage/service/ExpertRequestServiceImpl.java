package com.zipddak.mypage.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zipddak.dto.EstimateDto;
import com.zipddak.entity.Estimate;
import com.zipddak.entity.Expert;
import com.zipddak.entity.Request;
import com.zipddak.mypage.dto.PublicRequestDetailDto;
import com.zipddak.mypage.dto.PublicRequestListDto;
import com.zipddak.mypage.dto.ReceiveRequestDetailDto;
import com.zipddak.mypage.dto.ReceiveRequestListDto;
import com.zipddak.mypage.dto.RequestActiveDetailDto;
import com.zipddak.mypage.dto.RequestActiveExpertListDto;
import com.zipddak.mypage.dto.RequestHistoryListDto;
import com.zipddak.mypage.dto.EstimateWriteDto.EstimateCostListDto;
import com.zipddak.mypage.dto.FavoriteExpertDto;
import com.zipddak.mypage.repository.EstimateDslRepository;
import com.zipddak.mypage.repository.RequestDslRepository;
import com.zipddak.repository.EstimateRepository;
import com.zipddak.repository.ExpertRepository;
import com.zipddak.repository.RequestRepository;
import com.zipddak.util.PageInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpertRequestServiceImpl implements ExpertRequestService {

	private final RequestDslRepository requestDslRepository;
	private final ExpertRepository expertRepository;
	private final RequestRepository requestRepository;
	private final EstimateRepository estimateRepository;
	private final EstimateDslRepository estimateDslRepository;

	// 공개 요청서 목록 조회
	@Override
	public List<PublicRequestListDto> getPublicRequestList(Long lastId, int size) throws Exception {
		return requestDslRepository.selectPublicRequestList(lastId, size);
	}

	// 공개 요청서 상세 조회
	@Override
	public PublicRequestDetailDto getPublicRequestDetail(Integer requestIdx) throws Exception {
		return requestDslRepository.selectPublicRequestDetail(requestIdx);
	}

	// [전문가]받은 요청서 목록 조회
	@Override
	public List<ReceiveRequestListDto> getExpertReceiveRequestList(String username, PageInfo pageInfo)
			throws Exception {
		// 전문가 조회
		Expert expert = expertRepository.findByUser_Username(username).get();

		PageRequest pageRequest = PageRequest.of(pageInfo.getCurPage() - 1, 9);

		List<ReceiveRequestListDto> requestList = requestDslRepository.selectReceiveRequestList(expert.getExpertIdx(),
				pageRequest);
		Long cnt = requestDslRepository.selectReceiveRequestCount(expert.getExpertIdx());

		Integer allPage = (int) (Math.ceil(cnt.doubleValue() / pageRequest.getPageSize()));
		Integer startPage = (pageInfo.getCurPage() - 1) / 9 * 9 + 1;
		Integer endPage = Math.min(startPage + 9 - 1, allPage);

		pageInfo.setAllPage(allPage);
		pageInfo.setStartPage(startPage);
		pageInfo.setEndPage(endPage);

		return requestList;
	}

	// [전문가]받은 요청서 상세 조회
	@Override
	public ReceiveRequestDetailDto getExpertReceiveRequestDetail(Integer requestIdx) throws Exception {
		return requestDslRepository.selectReceiveRequestDetail(requestIdx);
	}

	// [일반사용자]지난 요청서 조회
	@Override
	public List<RequestHistoryListDto> getUserRequestHistoryList(String username, String status, PageInfo pageInfo)
			throws Exception {
		PageRequest pageRequest = PageRequest.of(pageInfo.getCurPage() - 1, 9);

		List<RequestHistoryListDto> requestList = requestDslRepository.selectRequestHistoryList(username, status,
				pageRequest);
		Long cnt = requestDslRepository.selectRequestHistoryCount(username, status);

		Integer allPage = (int) (Math.ceil(cnt.doubleValue() / pageRequest.getPageSize()));
		Integer startPage = (pageInfo.getCurPage() - 1) / 9 * 9 + 1;
		Integer endPage = Math.min(startPage + 9 - 1, allPage);

		pageInfo.setAllPage(allPage);
		pageInfo.setStartPage(startPage);
		pageInfo.setEndPage(endPage);

		return requestList;
	}

	// [일반사용자]진행중인 요청서 조회 - 전문가 목록
	@Override
	public List<RequestActiveExpertListDto> getRequestActiveExpertList(String username) throws Exception {
		Optional<Request> request = requestRepository.findByUserUsernameAndStatus(username, "RECRUITING");
		
		if(request.isPresent()) {
			return requestDslRepository.getRequestActiveExpertList(request.get().getRequestIdx());
		} else {
			return null;
		}
	}

	// [일반사용자]진행중인 요청서 조회
	@Override
	public RequestActiveDetailDto getUserRequestActiveDetail(String username) throws Exception {
		return requestDslRepository.selectUserRequestActiveDetail(username);
	}

	// [일반사용자]진행중인 요청서 견적서 상세조회
	@Override
	public Map<String, Object> getUserEstimateActiveDetail(Integer estimateIdx) throws Exception {

		Estimate estimate = estimateRepository.findById(estimateIdx).get();
		
		Expert expert = expertRepository.findById(estimate.getExpert().getExpertIdx()).get();

		EstimateDto estimateDto = EstimateDto.builder().estimateIdx(estimate.getEstimateIdx())
				.requestIdx(estimate.getRequestIdx()).largeServiceIdx(estimate.getLargeServiceIdx())
				.diagnosisType(estimate.getDiagnosisType()).repairType(estimate.getRepairType())
				.demolitionType(estimate.getDemolitionType()).consultingType(estimate.getConsultingType())
				.workDurationType(estimate.getWorkDurationType()).workDurationValue(estimate.getWorkDurationValue())
				.workScope(estimate.getWorkScope()).workDetail(estimate.getWorkDetail())
				.disposalCost(estimate.getDisposalCost()).demolitionCost(estimate.getDemolitionCost())
				.consultingLaborCost(estimate.getConsultingLaborCost())
				.stylingDesignCost(estimate.getStylingDesignCost()).threeDImageCost(estimate.getThreeDImageCost())
				.reportProductionCost(estimate.getReportProductionCost()).etcFee(estimate.getEtcFee())
				.costDetail(estimate.getCostDetail()).createdAt(estimate.getCreatedAt())
				.expertIdx(estimate.getExpert().getExpertIdx()).activityName(estimate.getExpert().getActivityName())
				.build();

		List<EstimateCostListDto> costList = estimateDslRepository.selectEstimateCostList(estimateIdx);
		
		String expertUsername = expert.getUser().getUsername();
		
		FavoriteExpertDto expertDetail = estimateDslRepository.selectExpertCard(expert.getExpertIdx());

		Map<String, Object> res = new HashMap<>();
		res.put("estimateDetail", estimateDto);
		res.put("costList", costList);
		res.put("expertUsername", expertUsername);
		res.put("expertDetail", expertDetail);

		return res;
	}
	
	// 요청 그만받기
	@Override
	@Transactional
	public Boolean stopRequest(Integer requestIdx) throws Exception {
		Request request = requestRepository.findById(requestIdx).get();
		request.setStatus("STOPPED");
		return true;
	}
}
