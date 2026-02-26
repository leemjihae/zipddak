package com.zipddak.user.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.zipddak.admin.service.SettlementService;
import com.zipddak.dto.RentalDto;
import com.zipddak.dto.ReviewToolDto;
import com.zipddak.mypage.service.ReviewService;
import com.zipddak.user.dto.ResponseBorrowDetailDto;
import com.zipddak.user.dto.ResponseRentalDetailListDto;
import com.zipddak.user.service.RentalService;
import com.zipddak.user.service.ToolService;

@RestController
public class RentalController {
	
	@Autowired
	private RentalService rentalService;
	
	@Autowired
	private ReviewService reviewService;
	
	@Autowired
	private SettlementService settlementService;
	
	@Autowired
	private ToolService toolService;
	
	//대여등록
		@PostMapping(value="/rental/application")
		ResponseEntity<Boolean> toolRegist (@RequestBody RentalDto rentalDto) {
			try {
				
				// orderId 생성
				String orderId = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
		                + "-" + (int)(Math.random() * 9000 + 1000);
				
				Integer toolIdx = rentalDto.getToolIdx();
				System.out.println("application Rental >>>>>>"+toolIdx);
				
				toolService.makeInableTool(toolIdx);
				rentalService.rentalApplication(rentalDto,orderId);
				
				return ResponseEntity.ok(true);
			}catch(Exception e) {
				e.printStackTrace();
				return ResponseEntity.badRequest().body(false);
			}
		}
	
	// 마이페이지 공구 대여 목록 조회
	@GetMapping("/user/mypage/rental")
	public ResponseEntity<ResponseRentalDetailListDto> borrow(
			@RequestParam String username,
			@RequestParam Integer rentalCate,
			@RequestParam String startDate,
			@RequestParam String endDate,
			@RequestParam Integer state,
			@RequestParam Integer page){
		
		try {
			
			ResponseRentalDetailListDto response = rentalService.rental(username,rentalCate,startDate,endDate,state,page);
			
			return ResponseEntity.ok(response);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	// 마이페이지 빌린 공구 상세
	@GetMapping("/user/mypage/rentals/borrow")
	public ResponseEntity<ResponseBorrowDetailDto> borrowDetail(@RequestParam String username,
											@RequestParam Integer rentalIdx){
		
		try {	
			ResponseBorrowDetailDto response = rentalService.borrowDetail(username, rentalIdx);
			
			return ResponseEntity.ok(response);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
		
	}
	
	// 마이페이지 빌려준 공구 상세
	@GetMapping("/user/mypage/rentals/lent")
	public ResponseEntity<ResponseBorrowDetailDto> lentDetail(@RequestParam String username,
											@RequestParam Integer rentalIdx){
		
		try {	
			ResponseBorrowDetailDto response = rentalService.lentDetail(username, rentalIdx);
			
			return ResponseEntity.ok(response);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
		
	}
	
	// 송장번호 등록후 배송중으로 변경
	@PostMapping("/user/rental/postCode")
	public ResponseEntity<Boolean> postCode(@RequestBody Map<String, Object> map){
		try {	
			
			rentalService.postCode(map);
			
			return ResponseEntity.ok(true);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}
	
	// 대여 상태로 변경
	@PostMapping("/user/rental/stateRental")
	public ResponseEntity<Boolean> stateRental(@RequestBody Map<String, Integer> map){
		try {	
			
			Integer rentalIdx = (Integer)map.get("rentalIdx");
			rentalService.stateRental(rentalIdx);
			
			return ResponseEntity.ok(true);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}
	
	// 반납완료 상태로 변경
	@PostMapping("/user/rental/stateReturn")
	public ResponseEntity<Boolean> stateReturn(@RequestBody Map<String, Integer> map){
		try {	
			
			Integer rentalIdx = (Integer)map.get("rentalIdx");
			Integer toolIdx = (Integer)map.get("toolIdx");
			// 반납완료 상태로 변경
			rentalService.stateReturn(rentalIdx);
			toolService.stateReturn(toolIdx);
			// 바로 정산처리
			settlementService.rentalSettlementCreate(rentalIdx);
			
			return ResponseEntity.ok(true);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}
	
	// 공구 리뷰
	@PostMapping("/user/rental/rentalReview")
	public ResponseEntity<Boolean> rentalReview(
			ReviewToolDto reviewToolDto,
			@RequestParam(value = "reviewImages", required = false) MultipartFile[] reviewImages
			){
		try {	

			// 리뷰 작성
			reviewService.writeToolReview(reviewToolDto, reviewImages);
			// 렌탈 리뷰 작성 상태 업데이트
			rentalService.reviewWriteState(reviewToolDto.getRentalIdx());
			
			return ResponseEntity.ok(true);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}
		
		


}
