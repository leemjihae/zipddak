package com.zipddak.mypage.service;

import java.sql.Date;
import java.util.List;

import com.zipddak.mypage.dto.OrderDetailDto;
import com.zipddak.mypage.dto.OrderListDto;
import com.zipddak.mypage.dto.OrderStatusSummaryDto;
import com.zipddak.util.PageInfo;

public interface OrderService {
	List<OrderListDto> getOrderList(String username, PageInfo pageInfo, Date startDate, Date endDate) throws Exception;

	List<OrderListDto> getReturnList(String username, PageInfo pageInfo, Date startDate, Date endDate) throws Exception;

	OrderStatusSummaryDto getOrderStatusSummary(String username) throws Exception;

	OrderDetailDto getOrderDetail(Integer orderIdx) throws Exception;
}
