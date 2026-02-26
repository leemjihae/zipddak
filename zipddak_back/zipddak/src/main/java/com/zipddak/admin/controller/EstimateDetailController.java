package com.zipddak.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.admin.dto.EstimateDetailDto;
import com.zipddak.admin.dto.EstimatePaymentCostDto;
import com.zipddak.admin.dto.EstimatePaymentExpertDto;
import com.zipddak.admin.dto.EstimatePaymentRequestDetailDto;
import com.zipddak.admin.service.EstimateDetailService;
import com.zipddak.admin.service.ExpertFindService;
import com.zipddak.admin.service.RequestService;
import com.zipddak.dto.RequestDto;
import com.zipddak.mypage.service.ExpertProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class EstimateDetailController {

	private final EstimateDetailService estimateDetailService;
	private final RequestService requestService;
	private final ExpertFindService expertFindService;
	
	@GetMapping("user/estimate")
	public ResponseEntity<EstimateDetailDto> estimateDetail(@RequestParam Integer estimateIdx,
											@RequestParam String username){
		
		try {
			
			// 제일 먼저 사용자, 견적서가 일치하는지 확인
			boolean check = estimateDetailService.estimateCheck(estimateIdx, username);
			
			// 일치하지 않으면
			if(!check) return null;
			
			EstimatePaymentRequestDetailDto requestDto = requestService.detail(estimateIdx, username);
			
			EstimatePaymentExpertDto expertDto = expertFindService.expertDetail(estimateIdx);
			
			EstimatePaymentCostDto costDto = estimateDetailService.detail(estimateIdx);
			
			EstimateDetailDto responseDto = new EstimateDetailDto(estimateIdx, requestDto, expertDto, costDto);
			
			
			
			return ResponseEntity.ok(responseDto);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
}
