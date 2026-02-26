package com.zipddak.mypage.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.mypage.dto.PublicRequestDetailDto;
import com.zipddak.mypage.dto.PublicRequestListDto;
import com.zipddak.mypage.dto.ReceiveRequestDetailDto;
import com.zipddak.mypage.dto.ReceiveRequestListDto;
import com.zipddak.mypage.dto.RequestActiveDetailDto;
import com.zipddak.mypage.dto.RequestActiveExpertListDto;
import com.zipddak.mypage.dto.RequestHistoryListDto;
import com.zipddak.mypage.service.ExpertRequestServiceImpl;
import com.zipddak.util.PageInfo;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ExpertRequestController {

	private final ExpertRequestServiceImpl requestService;

	// 공개 요청서 목록 조회
	@GetMapping("/publicRequestsList")
	public ResponseEntity<List<PublicRequestListDto>> publicRequestsList(@RequestParam(required = false) Long lastId,
			@RequestParam(defaultValue = "10") int size) {
		try {
			return ResponseEntity.ok(requestService.getPublicRequestList(lastId, size));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 공개 요청서 상세 조회
	@GetMapping("/publicRequestsDetail")
	public ResponseEntity<PublicRequestDetailDto> publicRequestsDetail(@RequestParam Integer requestIdx) {
		try {
			return ResponseEntity.ok(requestService.getPublicRequestDetail(requestIdx));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// [전문가]받은 요청서 조회
	@GetMapping("/receive/requestList")
	public ResponseEntity<Map<String, Object>> expertReceiveRequestList(@RequestParam("username") String username,
			@RequestParam(value = "page", required = false, defaultValue = "1") Integer page) {
		try {
			PageInfo pageInfo = new PageInfo(page);

			List<ReceiveRequestListDto> requestList = requestService.getExpertReceiveRequestList(username, pageInfo);

			Map<String, Object> res = new HashMap<>();
			res.put("requestList", requestList);
			res.put("pageInfo", pageInfo);

			return ResponseEntity.ok(res);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// [전문가]받은 요청서 상세조회
	@GetMapping("/receive/requestDetail")
	public ResponseEntity<ReceiveRequestDetailDto> expertReceiveRequestDetail(@RequestParam Integer requestIdx) {
		try {
			return ResponseEntity.ok(requestService.getExpertReceiveRequestDetail(requestIdx));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// [일반사용자]지난 요청서 조회
	@GetMapping("/history/requestList")
	public ResponseEntity<Map<String, Object>> userRequestHistoryList(@RequestParam("username") String username,
			@RequestParam("status") String status,
			@RequestParam(value = "page", required = false, defaultValue = "1") Integer page) {
		try {
			PageInfo pageInfo = new PageInfo(page);

			List<RequestHistoryListDto> requestList = requestService.getUserRequestHistoryList(username, status,
					pageInfo);

			Map<String, Object> res = new HashMap<>();
			res.put("requestList", requestList);
			res.put("pageInfo", pageInfo);

			return ResponseEntity.ok(res);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// [일반사용자]진행중인 요청서 조회
	@GetMapping("/active/requestDetail")
	public ResponseEntity<Map<String, Object>> userActiveRequestDetail(@RequestParam("username") String username) {
		try {
			RequestActiveDetailDto requestDetail = requestService.getUserRequestActiveDetail(username);
			List<RequestActiveExpertListDto> expertList = requestService.getRequestActiveExpertList(username);

			Map<String, Object> res = new HashMap<>();
			res.put("requestDetail", requestDetail);
			res.put("expertList", expertList);

			return ResponseEntity.ok(res);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// [일반사용자]진행중인 요청서 견적 상세조회
	@GetMapping("/active/estimateDetail")
	public ResponseEntity<Map<String, Object>> userActiveEstimateDetail(
			@RequestParam("estimateIdx") Integer estimateIdx) {
		try {
			return ResponseEntity.ok(requestService.getUserEstimateActiveDetail(estimateIdx));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}
	
	// 요청 그만하기
	@GetMapping("/request/stop")
	public ResponseEntity<Boolean> stopRequest(
			@RequestParam("requestIdx") Integer requestIdx) {
		try {
			return ResponseEntity.ok(requestService.stopRequest(requestIdx));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}
}
