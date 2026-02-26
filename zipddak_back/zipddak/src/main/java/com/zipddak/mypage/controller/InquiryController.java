package com.zipddak.mypage.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.zipddak.dto.InquiriesDto;
import com.zipddak.mypage.dto.InquiryListDto;
import com.zipddak.mypage.service.InquiryServiceImpl;
import com.zipddak.util.PageInfo;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class InquiryController {

	private final InquiryServiceImpl inquiryService;

	// 내가 작성한 문의목록 조회
	@GetMapping("/inquiryList")
	public ResponseEntity<Map<String, Object>> inquiryList(@RequestParam("username") String username,
			@RequestParam(value = "page", required = false, defaultValue = "1") Integer page) {
		try {
			PageInfo pageInfo = new PageInfo(page);

			List<InquiryListDto> inquiryList = inquiryService.getMyInquiryList(username, pageInfo);

			Map<String, Object> res = new HashMap<>();
			res.put("inquiryList", inquiryList);
			res.put("pageInfo", pageInfo);

			return ResponseEntity.ok(res);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 문의 작성
	@PostMapping("/inquiry/write")
	public ResponseEntity<Boolean> writeInquiry(InquiriesDto inquiriesDto,
			@RequestParam(value = "inquiriyImages", required = false) MultipartFile[] inquiriyImages) {
		try {
			inquiryService.writeInquiry(inquiriesDto, inquiriyImages);
			return ResponseEntity.ok(true);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

}
