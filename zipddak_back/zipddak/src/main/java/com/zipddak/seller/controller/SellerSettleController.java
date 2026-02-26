package com.zipddak.seller.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.seller.dto.SalesDailyDto;
import com.zipddak.seller.service.SellerSettleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/seller/settle")
@RequiredArgsConstructor
public class SellerSettleController {
	
	private final SellerSettleService settle_svc;
	
	//월별 매출통계 데이터 모달 
	@GetMapping("/showMySalesHistory/monthly")
	public List<SalesDailyDto> getSellerMonthlyDailySales(@RequestParam("sellerId") String sellerUsername, @RequestParam String month) {
			
		return settle_svc.getSellerMonthlyDailySales( sellerUsername,month);
	    
    }
	
	
	
	

}
