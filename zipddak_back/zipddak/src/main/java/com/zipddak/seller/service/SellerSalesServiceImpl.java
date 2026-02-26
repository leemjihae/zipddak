package com.zipddak.seller.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.zipddak.dto.CategoryDto;
import com.zipddak.enums.SalesPeriod;
import com.zipddak.repository.CategoryRepository;
import com.zipddak.seller.dto.SalesAggregationDto;
import com.zipddak.seller.dto.SalesCardResponseDto;
import com.zipddak.seller.dto.SalesTableResponseDto;
import com.zipddak.seller.dto.SalesTableRowDto;
import com.zipddak.seller.repository.SellerProductRepository;
import com.zipddak.seller.repository.SellerSalesRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SellerSalesServiceImpl implements SellerSalesService {
	
	private final SellerSalesRepository sellerSales_repo;
	private final SellerProductRepository sellerProduct_repo;
	
	private final SellerProductService product_svc;
	
	private static final ZoneId KST = ZoneId.of("Asia/Seoul");
	
	private LocalDate today() {
        return LocalDate.now(KST);
    }
	
	private void validateSeller(String sellerUsername) {
        if (sellerUsername == null || sellerUsername.isBlank()) {
            throw new IllegalArgumentException("판매자 정보가 올바르지 않습니다");
        }
    }
	
	private long safe(Long value) {
        return value != null ? value : 0L;
    }
	
	//오늘 총매출
	@Override
	public long getTodaySales(String sellerUsername){
		
		validateSeller(sellerUsername);
        LocalDate t = today();
        return safe(sellerSales_repo.findPeriodSalesBySeller(sellerUsername, t, t));
	}
	//이번달 총매출 
	@Override
	public long getThisMonthSales(String sellerUsername){
		
		validateSeller(sellerUsername);
        LocalDate t = today();
        return safe(sellerSales_repo.findPeriodSalesBySeller(
                sellerUsername,
                t.withDayOfMonth(1),
                t.withDayOfMonth(t.lengthOfMonth())
        ));
	}
	//기간별 매출 
	@Override
	public long getSalesByPeriod(String sellerUsername, LocalDate startDate, LocalDate endDate) {
		validateSeller(sellerUsername);
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("시작일이 종료일보다 클 수 없습니다");
        }
        return safe(sellerSales_repo.findPeriodSalesBySeller(sellerUsername, startDate, endDate));
	}
	
	
	//당일 매출액 (총 결제금액 기준)
	@Override
	public long getTodaySalesBySeller(String sellerUsername) {
		validateSeller(sellerUsername);
        LocalDate t = today();
        return safe(sellerSales_repo.findTodaySalesBySeller(sellerUsername, t, t));
	}
	
	//당일 예상 정산금액 (총 결제금액 × 0.95)
	@Override
	public long getTodayExpectSettle(String sellerUsername){
		validateSeller(sellerUsername);
        LocalDate t = today();
        return safe(sellerSales_repo.findTodayExpectSettle(sellerUsername, t, t));
	}
	
	//당일 평균 주문 금액 (총 결제금액 / 주문 수)
	@Override
	public long getTodayAverageOrderAmount(String sellerUsername) {
		validateSeller(sellerUsername);
        LocalDate t = today();
        return safe(sellerSales_repo.findTodayAverageOrderAmount(sellerUsername, t, t));
	}
	
	//전일 대비 매출 증감률
	@Override
	public double getRevenueChangeRate(String sellerUsername, LocalDate today) {
		validateSeller(sellerUsername);

		long todayRevenue = safe(sellerSales_repo.findTodayRevenue(sellerUsername, today));
		long yesterdayRevenue = safe(sellerSales_repo.findTodayRevenue(sellerUsername, today.minusDays(1)));
		
		if (yesterdayRevenue == 0) return 0.0;
		
		return ((double)(todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
    }
	
	
	//매출통계 카드 데이터 
	public SalesCardResponseDto getSalesDashboardCards(String sellerUsername) {

		validateSeller(sellerUsername);
        LocalDate t = today();

	    long todaySalesAmount = getTodaySalesBySeller(sellerUsername);
	    long todayExpectedSettleAmount = getTodayExpectSettle(sellerUsername);
	    long todayAverageOrderAmount = getTodayAverageOrderAmount(sellerUsername);

	    double revenueChangeRate = getRevenueChangeRate(sellerUsername, t);

	    long todayTotalSales = getTodaySales(sellerUsername);
	    long thisMonthTotalSales = getThisMonthSales(sellerUsername);

	    return SalesCardResponseDto.builder()
	            .todaySalesAmount(todaySalesAmount)
	            .todayExpectedSettleAmount(todayExpectedSettleAmount)
	            .todayAverageOrderAmount(todayAverageOrderAmount)
	            .revenueChangeRate(revenueChangeRate)
	            .todayTotalSales(todayTotalSales)
	            .thisMonthTotalSales(thisMonthTotalSales)
	            .build();
	}
	
	
	//일자별 테이블 (누락 날짜 0원 채우기)
	private SalesTableResponseDto getDailyTable(String sellerUsername, LocalDate start, LocalDate end) {
		
		List<SalesAggregationDto> raw = sellerSales_repo.findDailySalesTable(sellerUsername, start, end);

	    Map<String, Map<Integer, Long>> table = new LinkedHashMap<>();

	    // 1. 날짜 먼저 전부 채움 (0원)
	    for (LocalDate d = start; !d.isAfter(end); d = d.plusDays(1)) {
	        table.put(d.toString(), new HashMap<>());
	    }

	    // 2. 실제 매출 덮어쓰기
	    for (SalesAggregationDto dto : raw) {
	        table.get(dto.getPeriod())
	             .put(dto.getCategoryIdx(), dto.getSalesAmount());
	    }

	    return buildDailyResponse(table, sellerUsername);
	}
	//월별 
	private SalesTableResponseDto getMonthlyTable(String sellerUsername, LocalDate start, LocalDate end) {
	    
		List<SalesAggregationDto> raw = sellerSales_repo.findMonthlySalesTable(sellerUsername, start, end);

	    Map<YearMonth, Map<Integer, Long>> table = new LinkedHashMap<>();

	    YearMonth cur = YearMonth.from(start);
	    YearMonth last = YearMonth.from(end);

	    while (!cur.isAfter(last)) {
	        table.put(cur, new HashMap<>());
	        cur = cur.plusMonths(1);
	    }

	    for (SalesAggregationDto dto : raw) {
	    	 YearMonth ym = YearMonth.parse(dto.getPeriod());
	    	    table.get(ym).put(dto.getCategoryIdx(), dto.getSalesAmount());
	    }

	    return buildMonthlyResponse(table, sellerUsername);
	}
	//연도별 
	private SalesTableResponseDto getYearlyTable(String sellerUsername, LocalDate start, LocalDate end) {
		    
	    List<SalesAggregationDto> raw = sellerSales_repo.findYearlySalesTable(sellerUsername, start, end);

	    return buildYearlyResponse(raw, sellerUsername);
	}
	
	//테이블 생성 
	private SalesTableResponseDto buildDailyResponse(Map<String, Map<Integer, Long>> table, String sellerUsername) {
	    // 1. 카테고리 목록 조회
	    List<CategoryDto> categories = product_svc.getSellerCategories(sellerUsername);
	    System.out.println("categories : " + categories);
	    // 2. 행(row) 생성
	    List<SalesTableRowDto> rows = table.entrySet().stream()
												        .map(entry -> {
												            long total = entry.getValue()
												                .values()
												                .stream()
												                .mapToLong(Long::longValue)
												                .sum();
											
												            return new SalesTableRowDto(
												                entry.getKey(),
												                entry.getValue(),
												                total
												            );
												        }).collect(Collectors.toList());

	    return new SalesTableResponseDto(categories, rows);
	}

	private SalesTableResponseDto buildMonthlyResponse(Map<YearMonth, Map<Integer, Long>> table, String sellerUsername){
		Map<String, Map<Integer, Long>> converted = new LinkedHashMap<>();

	    table.forEach((ym, map) ->
	        converted.put(ym.toString(), map)
	    );

	    return buildDailyResponse(converted, sellerUsername);
	}
	private SalesTableResponseDto buildYearlyResponse(List<SalesAggregationDto> raw, String sellerUsername) {
		Map<String, Map<Integer, Long>> table = new LinkedHashMap<>();

	    for (SalesAggregationDto dto : raw) {
	        table
	            .computeIfAbsent(dto.getPeriod(), k -> new HashMap<>())
	            .put(dto.getCategoryIdx(), dto.getSalesAmount());
	    }

	    return buildDailyResponse(table, sellerUsername);
	}

	//매출통계 테이블 데이터
	@Override
	public SalesTableResponseDto getMySalesTable(SalesPeriod period, String sellerUsername, LocalDate startDate, LocalDate endDate) {
		SalesTableResponseDto dto = null;
		
		switch (period) {
	        case DAY : dto = getDailyTable(sellerUsername, startDate, endDate); break;
	        case MONTH : dto = getMonthlyTable(sellerUsername, startDate, endDate); break;
	        case YEAR : dto = getYearlyTable(sellerUsername, startDate, endDate); break;
	        default: throw new IllegalArgumentException("지원하지 않는 기간: " + period);
		};
		
		return dto;
	}




}
