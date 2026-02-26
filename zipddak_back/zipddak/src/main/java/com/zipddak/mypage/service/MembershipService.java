package com.zipddak.mypage.service;

import com.zipddak.mypage.dto.MembershipListDto;
import com.zipddak.util.PageInfo;

public interface MembershipService {
	void membershipSuccess(String paymentKey, String orderId, Integer amount, String username) throws Exception;

	MembershipListDto getMembershipList(String username, PageInfo pageInfo) throws Exception;
}
