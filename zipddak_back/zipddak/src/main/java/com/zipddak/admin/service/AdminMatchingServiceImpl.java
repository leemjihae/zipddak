package com.zipddak.admin.service;

import java.sql.Date;
import java.util.Calendar;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.zipddak.admin.dto.EstimatePaymentStep1Dto;
import com.zipddak.entity.Estimate.WorkDurationType;
import com.zipddak.entity.Matching;
import com.zipddak.entity.Matching.MatchingStatus;
import com.zipddak.entity.Request;
import com.zipddak.repository.MatchingRepository;
import com.zipddak.repository.RequestRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminMatchingServiceImpl implements MatchingService{

	private final MatchingRepository matchingRepository;
	private final RequestRepository requestRepository;
	
	@Override
	public void createMatching(EstimatePaymentStep1Dto paymentDto, String orderId) throws Exception {
		
		Request request = requestRepository.findById(paymentDto.getRequestIdx()).orElseThrow(() -> new Exception("요청서 조회 중 오류"));
		
		Date startDate = request.getPreferredDate();
		Date endDate = startDate;
		
		Calendar cal = Calendar.getInstance();
		cal.setTime(startDate);
		
		if(paymentDto.getWorkDurationType() != WorkDurationType.HOUR) {
			int value = paymentDto.getWorkDurationValue();
			
			if(paymentDto.getWorkDurationType() == WorkDurationType.DAY) {
				cal.add(Calendar.DAY_OF_MONTH, value);
			}else if(paymentDto.getWorkDurationType() == WorkDurationType.WEEK) {
				cal.add(Calendar.WEEK_OF_MONTH, value);
			}else {
				cal.add(Calendar.MONTH, value);
			}
			
			endDate = new Date(cal.getTimeInMillis());
		}
		
		Matching matching = Matching.builder()
							.estimateIdx(paymentDto.getEstimateIdx())
							.matchingCode(orderId)
							.requestIdx(paymentDto.getRequestIdx())
							.status(MatchingStatus.PAYMENT_CANCELLED)
							.expertIdx(paymentDto.getExpertIdx())
							.userUsername(paymentDto.getUsername())
							.workStartDate(startDate)
							.workEndDate(endDate)
							.build();
							
		matchingRepository.save(matching);
							
		
	}

	@Override
	public Optional<Matching> checkMatchingState(Integer estimateIdx) throws Exception {

		Optional<Matching> matching = matchingRepository.findFirstByEstimateIdxOrderByMatchingIdxDesc(estimateIdx);
		
		return matching;
	}

}
