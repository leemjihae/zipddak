package com.zipddak.admin.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.zipddak.entity.FavoritesExpert;
import com.zipddak.entity.ReportExpert;
import com.zipddak.entity.ReportExpert.ReportState;
import com.zipddak.repository.FavoritesExpertRepository;
import com.zipddak.repository.ReportExpertRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpertReportServiceImpl implements ExpertReportService{

	private final ReportExpertRepository reportExpertRepository;
	
	@Override
	public void reportExpert(String username, Integer expertIdx, String reason) throws Exception {
		
		String reasonText = null;
		
		switch(reason) {
		case "FAKE" : reasonText = "허위 정보 기재"; break;
		case "PRICE_MISMATCH" : reasonText = "견적 금액과 실제 비용 불일치"; break;
		case "UNPROFESSIONAL_RESPONSE" : reasonText = "비전문적이거나 불성실한 응대"; break;
		case "INAPPROPRIATE_BEHAVIOR" : reasonText = "부적절한 언행 또는 부쾌감을 주는 태도"; break;
		case "SERVICE_NOT_PROVIDED" : reasonText = "서비스 미이행 또는 일방적인 계약 파기"; break;
		default : reasonText = "플랫폼 정책 위반 행위";
		}
		
		ReportExpert reportExpert = ReportExpert.builder()
										.expertIdx(expertIdx)
										.userUsername(username)
										.reason(reasonText)
										.state(ReportState.RECEIVED)
										.build();
		
		reportExpertRepository.save(reportExpert);
		
		
	}

	

}
