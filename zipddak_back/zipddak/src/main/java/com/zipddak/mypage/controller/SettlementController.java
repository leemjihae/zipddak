package com.zipddak.mypage.controller;

import java.sql.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.mypage.dto.SettlementListDto;
import com.zipddak.mypage.service.SettlementServiceImpl;
import com.zipddak.util.PageInfo;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SettlementController {

	private final SettlementServiceImpl settlementService;

	// 정산 목록 조회
	@GetMapping("/settlementList")
	public ResponseEntity<Map<String, Object>> ExpertDetail(@RequestParam("username") String username,
			@RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
			@RequestParam(value = "startDate", required = false) String startDate,
			@RequestParam(value = "endDate", required = false) String endDate) {
		try {
			Date start = parseDate(startDate);
			Date end = parseDate(endDate);

			PageInfo pageInfo = new PageInfo(page);

			SettlementListDto settlementListDto = settlementService.getSettlementList(username, pageInfo, start, end);

			Map<String, Object> res = new HashMap<>();
			res.put("settlements", settlementListDto);
			res.put("pageInfo", pageInfo);

			return ResponseEntity.ok(res);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	private Date parseDate(String value) {
		if (value == null || value.isEmpty() || value.equals("null"))
			return null;
		return Date.valueOf(value);
	}

}
