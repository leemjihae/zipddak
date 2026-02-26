package com.zipddak.admin.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.zipddak.admin.service.SettlementService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class SettlementScheduler {

	private final SettlementService settlementService;
	
	// 매월 1일 00:10 에 시작
	@Scheduled(cron = "0 10 0 1 * ?")
//	테스트용 10초
//	@Scheduled(cron = "*/10 * * * * ?")
	public void createMonthlySettlement() {
		
		try {
			log.info("[정산 스케줄러] 전월 정산 생성 시작");
	        settlementService.createMonthlySettlement();
	        log.info("[정산 스케줄러] 전월 정산 생성 완료");
		}catch(Exception e) {
			e.printStackTrace();
			log.error("[정산 스케줄러] 작동 중 에러 발생");
		}
        
    }
	
}
