package com.zipddak.admin.service;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import com.zipddak.entity.ReportCommunity;
import com.zipddak.entity.ReportCommunity.ReportState;
import com.zipddak.repository.ReportCommunityRepository;

@Service
@RequiredArgsConstructor
public class ReportCommunityServiceImpl implements ReportCommunityService{
	
	private final ReportCommunityRepository reportCommunityRepository;
	
	@Override
	public void reportCommunity(String username, String reason, Integer communityId) throws Exception {

		String reasonString = null;
		
		switch(reason) {
		case "COMMENT_REPORT_ABUSE" : reasonString = "욕설 / 비하"; break;
		case "COMMENT_REPORT_AD" : reasonString = "광고 / 홍보"; break;
		case "COMMENT_REPORT_ILLEGAL" : reasonString = "음란 / 불법 콘텐츠"; break;
		case "COMMENT_REPORT_POLITICAL" : reasonString = "정치적 / 사회적 논쟁 유도"; break;
		case "COMMENT_REPORT_PRIVACY" : reasonString = "개인정보 유출"; break;
		default : reasonString = "기타 부적절한 내용";
		}
		
		ReportCommunity reportCommunity = ReportCommunity.builder()
											.communityIdx(communityId)
											.userUsername(username)
											.reason(reasonString)
											.state(ReportState.RECEIVED)
											.build();
		
		reportCommunityRepository.save(reportCommunity);
		
		
	}

}
