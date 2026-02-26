package com.zipddak.mypage.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.mypage.dto.EstimateUpdateDto;
import com.zipddak.mypage.dto.EstimateWriteDto;
import com.zipddak.mypage.dto.SentEstimateDetailDto;
import com.zipddak.mypage.dto.SentEstimateListDto;
import com.zipddak.mypage.service.EstimateServiceImpl;
import com.zipddak.util.PageInfo;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class EstimateController {

	private final EstimateServiceImpl estimateService;

	// [전문가]견적서 보내기
	@PostMapping("/estimate/write")
	public ResponseEntity<Boolean> writeEstimate(@RequestBody EstimateWriteDto EstimateWriteDto) {
		try {
			estimateService.writeEstimate(EstimateWriteDto);
			return ResponseEntity.ok(true);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// [전문가]견적서 업데이트
	@PostMapping("/estimate/update")
	public ResponseEntity<Boolean> updateEstimate(@RequestBody EstimateUpdateDto EstimateUpdateDto) {
		try {
			estimateService.updateEstimate(EstimateUpdateDto);
			return ResponseEntity.ok(true);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// [전문가]보낸 견적서 목록 조회
	@GetMapping("/sent/estimateList")
	public ResponseEntity<Map<String, Object>> expertSentEstimateList(@RequestParam("username") String username,
			@RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
			@RequestParam("status") String status) {
		try {
			PageInfo pageInfo = new PageInfo(page);

			List<SentEstimateListDto> estimateList = estimateService.getExpertSentEstimateList(username, pageInfo,
					status);

			Map<String, Object> res = new HashMap<>();
			res.put("estimateList", estimateList);
			res.put("pageInfo", pageInfo);

			return ResponseEntity.ok(res);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// [전문가]보낸 견적서 상세 조회
	@GetMapping("/sent/estimateDetail")
	public ResponseEntity<Map<String, Object>> expertSentEstimateDetail(
			@RequestParam("estimateIdx") Integer estimateIdx) {
		try {
			return ResponseEntity.ok(estimateService.getExpertSentEstimateDetail(estimateIdx));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

}
