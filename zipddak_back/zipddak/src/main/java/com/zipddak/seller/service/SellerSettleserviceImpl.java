package com.zipddak.seller.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.zipddak.seller.dto.DateRangeVO;
import com.zipddak.seller.dto.SalesDailyDto;
import com.zipddak.seller.repository.SellerSettleRepository;
import com.zipddak.util.DateRangeUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SellerSettleserviceImpl implements SellerSettleService{
	
	private final SellerSettleRepository sellerSettle_repo;

	//월별 매출통계 데이터 모달 
	@Override
	public List<SalesDailyDto> getSellerMonthlyDailySales(String sellerUsername, String month) {
		
		DateRangeVO range = DateRangeUtil.getSafeMonthRange(month);
		
	    return sellerSettle_repo.findMonthlyDailySales(sellerUsername,range.getStartDate(),range.getEndDate());
	}

}
