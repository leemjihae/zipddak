package com.zipddak.mypage.controller;

import java.net.URI;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.mypage.dto.MembershipListDto;
import com.zipddak.mypage.service.MembershipServiceImpl;
import com.zipddak.util.PageInfo;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MembershipController {

	private final MembershipServiceImpl membershipServiceImpl;

	@Value("${react-server.uri}")
	private String reactServer;

	// orderId 생성
	@GetMapping("/make/orderId")
	public ResponseEntity<String> makeOrderId() {
		try {
			return ResponseEntity.ok(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + "-"
					+ (int) (Math.random() * 9000 + 1000));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 결제 성공 처리
	@GetMapping("/membership/success")
	public ResponseEntity<?> membershipSuccess(@RequestParam("paymentKey") String paymentKey,
			@RequestParam("orderId") String orderId, @RequestParam("amount") Integer amount,
			@RequestParam("username") String username) {
		try {
			membershipServiceImpl.membershipSuccess(paymentKey, orderId, amount, username);

			String redirectUrl = reactServer + "expert/mypage/membership?success=true";

			return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(redirectUrl)).build();
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 내 멤버십 목록 조회
	@GetMapping("/membershipList")
	public ResponseEntity<Map<String, Object>> ExpertDetail(@RequestParam("username") String username,
			@RequestParam(value = "page", required = false, defaultValue = "1") Integer page) {
		try {
			PageInfo pageInfo = new PageInfo(page);

			MembershipListDto membershipListDto = membershipServiceImpl.getMembershipList(username, pageInfo);

			Map<String, Object> res = new HashMap<>();
			res.put("membershipList", membershipListDto);
			res.put("pageInfo", pageInfo);

			return ResponseEntity.ok(res);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

}
