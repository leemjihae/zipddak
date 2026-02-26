package com.zipddak.util;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;

import com.zipddak.seller.dto.DateRangeVO;

public class DateRangeUtil {
	// 월 문자열(yyyy-MM)을 받아서 오늘을 넘지 않는 조회용 날짜 범위(start~end) 만드는 util
	
	private static final ZoneId KOREA_ZONE = ZoneId.of("Asia/Seoul");  //한국 기준 날짜
	private DateRangeUtil() {} //생성자 (new 객체생성 방지) 
	
	
	public static DateRangeVO getSafeMonthRange(String month) {

        YearMonth yearMonth = YearMonth.parse(month);

        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        LocalDate today = LocalDate.now(KOREA_ZONE);
        if (endDate.isAfter(today)) {
            endDate = today;
        }

        return new DateRangeVO(startDate, endDate);
    }
}
