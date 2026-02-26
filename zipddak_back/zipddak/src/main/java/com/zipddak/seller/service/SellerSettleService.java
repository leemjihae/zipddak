package com.zipddak.seller.service;

import java.util.List;

import com.zipddak.seller.dto.SalesDailyDto;

public interface SellerSettleService {

	//월별 매출통계 데이터 모달 
	List<SalesDailyDto> getSellerMonthlyDailySales(String sellerUsername, String month);

}
