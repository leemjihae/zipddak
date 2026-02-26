package com.zipddak.admin.scheduler;



import java.util.Date;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.zipddak.repository.RentalRepository;
import com.zipddak.repository.ToolRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RentalScheduler {

    private final RentalRepository rentalRepository;
    private final ToolRepository toolRepository;

    @Scheduled(cron = "0 0 0 * * *") // 매일 자정
    @Transactional
    public void updateRentalStatus() {
        Date today = new Date();

        // Tool 상태 업데이트
        toolRepository.updateToolsToAble(today);
        toolRepository.updateToolsToInable(today);
        
        // Rental 상태 업데이트
        rentalRepository.updateStatusToRental(today);
        rentalRepository.updateStatusToReturn(today);
        
    }
}

