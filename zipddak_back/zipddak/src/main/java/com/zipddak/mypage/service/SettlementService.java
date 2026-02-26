package com.zipddak.mypage.service;

import java.sql.Date;

import com.zipddak.mypage.dto.SettlementListDto;
import com.zipddak.util.PageInfo;

public interface SettlementService {
	SettlementListDto getSettlementList(String username, PageInfo pageInfo, Date startDate, Date endDate) throws Exception;
}
