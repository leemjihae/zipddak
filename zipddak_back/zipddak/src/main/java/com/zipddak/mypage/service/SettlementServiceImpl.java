package com.zipddak.mypage.service;

import java.sql.Date;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.zipddak.mypage.dto.SettlementListDto;
import com.zipddak.mypage.repository.SettlementDslRepository;
import com.zipddak.util.PageInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SettlementServiceImpl implements SettlementService {

	private final SettlementDslRepository settlementDslRepository;

	// 정산 목록 조회
	@Override
	public SettlementListDto getSettlementList(String username, PageInfo pageInfo, Date startDate, Date endDate)
			throws Exception {

		PageRequest pageRequest = PageRequest.of(pageInfo.getCurPage() - 1, 10);

		SettlementListDto settlementListDto = settlementDslRepository.selectSettlementList(username, pageRequest, startDate, endDate);

		// 페이지 수 계산
		Long cnt = settlementDslRepository.selectSettlementCount(username, startDate, endDate);

		Integer allPage = (int) (Math.ceil(cnt.doubleValue() / pageRequest.getPageSize()));
		Integer startPage = (pageInfo.getCurPage() - 1) / 10 * 10 + 1;
		Integer endPage = Math.min(startPage + 10 - 1, allPage);

		pageInfo.setAllPage(allPage);
		pageInfo.setStartPage(startPage);
		pageInfo.setEndPage(endPage);
		
		return settlementListDto;
	}

}
