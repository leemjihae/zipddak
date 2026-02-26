package com.zipddak.admin.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.zipddak.entity.ReportSeller;
import com.zipddak.entity.ReportSeller.ReportState;
import com.zipddak.repository.ReportSellerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportSellerServiceImpl implements ReportSellerService {
	
	private final ReportSellerRepository reportSellerRepository;
	
	@Override
	public void reportSeller(Map<String, Object> reportMap) throws Exception {
		
		String reason = (String)reportMap.get("reason");
		String sellerUsername = (String)reportMap.get("sellerUsername");
		String username = (String)reportMap.get("username");
		String content = "";
		switch(reason) {
		case "FAKE" : content = "허위 정보 기재"; break;
		case "EXPENSIVE" : content = "과도한 가격 책정"; break;
		case "DANGER" : content = "불량/위험 자재 판매"; break;
		case "CONDITION_BREACH" : content = "거래 조건 불이행"; break;
		case "TERMS_NOT_MET" : content = "부적절한 언행 및 서비스"; break;
		default : content = "사기 의심 행위";
		}
		
		
		
		ReportSeller report = ReportSeller.builder()
								.reason(content)
								.sellerUsername(sellerUsername)
								.userUsername(username)
								.state(ReportState.RECEIVED)
								.build();
								
		reportSellerRepository.save(report);
		
	}

}
