package com.zipddak.mypage.controller;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.entity.Matching.MatchingStatus;
import com.zipddak.mypage.dto.MatchingListDto;
import com.zipddak.mypage.dto.MatchingStatusSummaryDto;
import com.zipddak.mypage.service.MatchingServiceImpl;
import com.zipddak.util.PageInfo;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ExpertMatchingController {

	private final MatchingServiceImpl matchingService;

	// [전문가]매칭 목록 조회
	@GetMapping("/matching/expertList")
	public ResponseEntity<Map<String, Object>> expertMatchingList(@RequestParam("username") String username,
			@RequestParam(value = "status", required = false) MatchingStatus status,
			@RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
			@RequestParam(value = "startDate", required = false) String startDate,
			@RequestParam(value = "endDate", required = false) String endDate) {
		try {
			Date start = parseDate(startDate);
			Date end = parseDate(endDate);

			PageInfo pageInfo = new PageInfo(page);

			List<MatchingListDto> matchingListDtoList = matchingService.getExpertMatchingList(username, status,
					pageInfo, start, end);

			Map<String, Object> res = new HashMap<>();
			res.put("matchingList", matchingListDtoList);
			res.put("pageInfo", pageInfo);

			return ResponseEntity.ok(res);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// [전문가]매칭 상세 조회
	@GetMapping("/matching/expertDetail")
	public ResponseEntity<Map<String, Object>> expertMatchingDetail(@RequestParam("matchingIdx") Integer matchingIdx) {
		try {
			return ResponseEntity.ok(matchingService.getExpertMatchingDetail(matchingIdx));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// [전문가]매칭현황 요약
	@GetMapping("/matchingStatusSummary")
	public ResponseEntity<Map<String, Object>> matchingStatusSummary(@RequestParam("username") String username) {
		try {
			MatchingStatusSummaryDto matchingStatusSummary = matchingService.getMatchingStatusSummary(username);

			Map<String, Object> res = new HashMap<>();
			res.put("matchingStatusSummary", matchingStatusSummary);

			return ResponseEntity.ok(res);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// [일반사용자]매칭 목록 조회
	@GetMapping("/matching/userList")
	public ResponseEntity<Map<String, Object>> userMatchingList(@RequestParam("username") String username,
			@RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
			@RequestParam(value = "startDate", required = false) String startDate,
			@RequestParam(value = "endDate", required = false) String endDate) {
		try {
			Date start = parseDate(startDate);
			Date end = parseDate(endDate);

			PageInfo pageInfo = new PageInfo(page);

			List<MatchingListDto> matchingListDtoList = matchingService.getUserMatchingList(username, pageInfo, start,
					end);

			Map<String, Object> res = new HashMap<>();
			res.put("matchingList", matchingListDtoList);
			res.put("pageInfo", pageInfo);

			return ResponseEntity.ok(res);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// [일반사용자]매칭 상세 조회
	@GetMapping("/matching/userDetail")
	public ResponseEntity<Map<String, Object>> userMatchingDetail(@RequestParam("matchingIdx") Integer matchingIdx) {
		try {
			return ResponseEntity.ok(matchingService.getUserMatchingDetail(matchingIdx));
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
