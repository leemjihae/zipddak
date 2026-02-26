package com.zipddak.seller.controller;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.enums.SalesPeriod;
import com.zipddak.seller.dto.SalesCardResponseDto;
import com.zipddak.seller.dto.SalesTableResponseDto;
import com.zipddak.seller.service.SellerSalesService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/seller/sales")
@RequiredArgsConstructor
public class SellerSalesController {
	
	private final SellerSalesService sales_svc;
	
	//매출통계 카드 데이터 
	@GetMapping("/mySalesCard")
	public ResponseEntity<SalesCardResponseDto> getMySalesInfo(@RequestParam("sellerId") String sellerUsername) {
			
		SalesCardResponseDto response = sales_svc.getSalesDashboardCards(sellerUsername);
		return ResponseEntity.ok(response);
	    
    }
	
	
	//매출통계 테이블 데이터
	@GetMapping("/mySalesTable")
	public SalesTableResponseDto getMySalesTable(@RequestParam SalesPeriod period,
													@RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
													@RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
											        @RequestParam("sellerId") String sellerUsername) {
	    
		return sales_svc.getMySalesTable(period, sellerUsername, startDate, endDate);
	}
	

	
	

}
