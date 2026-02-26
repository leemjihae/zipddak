package com.zipddak.seller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class SalesCardResponseDto {
	
	 // 당일
    private long todaySalesAmount;          // 당일 매출액
    private long todayExpectedSettleAmount; // 당일 예상 정산금액
    private long todayAverageOrderAmount;   // 당일 평균 주문금액

    // 비교
    private double revenueChangeRate;       // 전일 대비 매출 증감률 (%)

    // 요약
    private long todayTotalSales;            // 오늘 총 매출
    private long thisMonthTotalSales;        // 이번 달 총 매출

}
