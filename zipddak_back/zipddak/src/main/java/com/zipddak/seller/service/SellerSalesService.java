package com.zipddak.seller.service;

import java.time.LocalDate;

import com.zipddak.enums.SalesPeriod;
import com.zipddak.seller.dto.SalesCardResponseDto;
import com.zipddak.seller.dto.SalesTableResponseDto;

public interface SellerSalesService {
	
	//오늘 총매출
	long getTodaySales(String sellerUsername);
	//이번달 총매출
	long getThisMonthSales(String sellerUsername);
	//기간별 매출 
	long getSalesByPeriod(String sellerUsername, LocalDate startDate, LocalDate endDate);
	
	//당일 매출액 (총 결제금액 기준)
	long getTodaySalesBySeller(String sellerUsername);
	//당일 예상 정산금액 (총 결제금액 × 0.95)
	long getTodayExpectSettle(String sellerUsername);
	//당일 평균 주문 금액 (총 결제금액 / 주문 수)
	long getTodayAverageOrderAmount(String sellerUsername);
	//전일 대비 매출 증감률
	double getRevenueChangeRate(String sellerUsername, LocalDate today);

	//매출통계 카드 데이터 
	SalesCardResponseDto getSalesDashboardCards(String sellerUsername);
	//매출통계 테이블 데이터
	SalesTableResponseDto getMySalesTable(SalesPeriod period, String sellerUsername, LocalDate startDate, LocalDate endDate);
}
