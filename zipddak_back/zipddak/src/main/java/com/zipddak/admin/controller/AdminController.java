package com.zipddak.admin.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.admin.dto.AdminSettlementListDto;
import com.zipddak.admin.dto.RequestExpertInfoDto;
import com.zipddak.admin.dto.RequestSellerInfoDto;
import com.zipddak.admin.dto.ResponseAdminListDto;
import com.zipddak.admin.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
	
	private final AdminService adminService;

	@GetMapping("/users")
	public ResponseEntity<ResponseAdminListDto> users(@RequestParam Integer state,
									@RequestParam Integer column,
									@RequestParam String keyword,
									@RequestParam Integer page){
		
		try {
			
			ResponseAdminListDto userList = adminService.userList(state, column, keyword, page);
			
			return ResponseEntity.ok(userList);
			
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	@GetMapping("/experts")
	public ResponseEntity<ResponseAdminListDto> experts(@RequestParam Integer major,
									@RequestParam Integer state,
									@RequestParam Integer column,
									@RequestParam String keyword,
									@RequestParam Integer page){
		
		try {
			
			ResponseAdminListDto expertList = adminService.expertList(major, state, column, keyword, page);
			
			return ResponseEntity.ok(expertList);
			
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	@GetMapping("/sellers")
	public ResponseEntity<ResponseAdminListDto> sellers(@RequestParam Integer productCode,
									@RequestParam Integer state,
									@RequestParam String keyword,
									@RequestParam Integer page){
		
		
		try {
			
			ResponseAdminListDto sellerList = adminService.sellerList(productCode, state, keyword, page);
			
			return ResponseEntity.ok(sellerList);
			
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	@GetMapping("/rentals")
	public ResponseEntity<ResponseAdminListDto> renstals(@RequestParam Integer column,
									@RequestParam Integer state,
									@RequestParam String keyword,
									@RequestParam Integer page,
									@RequestParam(value = "startDate", required = false) String startDate,
									@RequestParam(value = "endDate", required = false) String endDate){
		
		
		try {
			
			ResponseAdminListDto rentalList = adminService.rentalList(column, state, keyword, page, startDate, endDate);
			
			return ResponseEntity.ok(rentalList);
			
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	@GetMapping("/sales")
	public ResponseEntity<ResponseAdminListDto> sales(@RequestParam Integer column,
									@RequestParam Integer state,
									@RequestParam String keyword,
									@RequestParam Integer page,
									@RequestParam(value = "startDate", required = false) String startDate,
									@RequestParam(value = "endDate", required = false) String endDate){
		
		
		try {
			
			ResponseAdminListDto rentalList = adminService.saleList(column, state, keyword, page, startDate, endDate);
			
			return ResponseEntity.ok(rentalList);
			
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	@GetMapping("/payments")
	public ResponseEntity<ResponseAdminListDto> payments(@RequestParam Integer type,
									@RequestParam Integer state,
									@RequestParam String keyword,
									@RequestParam Integer page){
		
		try {
			
			ResponseAdminListDto paymentList = adminService.paymentList(type, state, keyword, page);
			
			return ResponseEntity.ok(paymentList);
			
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	@GetMapping("/membership")
	public ResponseEntity<ResponseAdminListDto> membership(@RequestParam Integer state,
									@RequestParam String keyword,
									@RequestParam Integer page){
		
		try {
			
			ResponseAdminListDto membershipList = adminService.membershipList(state, keyword, page);
			
			return ResponseEntity.ok(membershipList);
			
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	@GetMapping("/requestExpert")
	public ResponseEntity<ResponseAdminListDto> requestExpert(@RequestParam Integer state,
			@RequestParam Integer column,
			@RequestParam String keyword,
			@RequestParam Integer page){

		try {
			ResponseAdminListDto requestExpertList = adminService.requestExpertList(state, column, keyword, page);
			
			return ResponseEntity.ok(requestExpertList);
		
		}catch(Exception e) {
		e.printStackTrace();
		return ResponseEntity.badRequest().body(null);
		}

	}
	
	@GetMapping("/requestSeller")
	public ResponseEntity<ResponseAdminListDto> requestSeller(@RequestParam Integer state,
			@RequestParam Integer column,
			@RequestParam String keyword,
			@RequestParam Integer page){

		try {
		
		ResponseAdminListDto requestSellerList = adminService.requestSellerList(state, column, keyword, page);
		
		return ResponseEntity.ok(requestSellerList);
		
		}catch(Exception e) {
		e.printStackTrace();
		return ResponseEntity.badRequest().body(null);
		}

	}
	
//	@GetMapping("requestExpertInfo")
//	public ResponseEntity<RequestExpertInfoDto> expertInfo(@RequestParam Integer expertIdx) {
//		
//		
//		try {
//			
//			RequestExpertInfoDto expertInfo = adminService.requestExpertInfo(expertIdx);
//			
//			return ResponseEntity.ok(expertInfo);		
//		}catch(Exception e) {
//			e.printStackTrace();
//			return ResponseEntity.badRequest().body(null);
//		}
//	}
	
	@GetMapping("/requestExpertInfo")
	public ResponseEntity<RequestExpertInfoDto> expertInfo(@RequestParam Integer expertIdx) {
	    try {
	        // 1. 서비스에서 DTO 가져오기
	        RequestExpertInfoDto expertInfo = adminService.requestExpertInfo(expertIdx);

	        // 2. 로컬 경로 + rename 파일명을 기반으로 클라이언트 URL 생성
	        // 예: 서버 API를 통해 PDF를 제공하도록 설정
	        if (expertInfo.getBusinessPdfFile() != null && !expertInfo.getBusinessPdfFile().isEmpty()) {
	            String pdfUrl = expertInfo.getBusinessPdfFile();
	            expertInfo.setFileStoragePath(pdfUrl); // 클라이언트에서 접근 가능하도록 URL 저장
	        }

	        // 3. DTO 반환
	        return ResponseEntity.ok(expertInfo);        
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.badRequest().body(null);
	    }
	}

	
	@GetMapping("requestSellerInfo")
	public ResponseEntity<RequestSellerInfoDto> sellerInfo(@RequestParam Integer sellerIdx) {
		
		try {
			
			RequestSellerInfoDto sellefIndo = adminService.requestSellerInfo(sellerIdx);
			
			return ResponseEntity.ok(sellefIndo);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}
	
	
	@PostMapping("switchExpert")
	public ResponseEntity<Boolean> switchExpert(@RequestBody Map<String, Integer> map){
		
		try {
			
			Integer expertIdx = map.get("expertIdx");
			Integer expertResult = map.get("expertResult");
			
			adminService.switchExpert(expertIdx, expertResult);
			
			return ResponseEntity.ok(true);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	@PostMapping("switchSeller")
	public ResponseEntity<Boolean> switchSeller(@RequestBody Map<String, Integer> map){
		
		try {
			
			Integer sellerIdx = map.get("sellerIdx");
			Integer sellerResult = map.get("sellerResult");
			
			adminService.switchSeller(sellerIdx, sellerResult);
			
			return ResponseEntity.ok(true);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	@GetMapping("/settlement")
	public ResponseEntity<ResponseAdminListDto> settlement(
				@RequestParam Integer type,
				@RequestParam String month,
				@RequestParam Integer state,
				@RequestParam Integer page
			){
		try {
			
			ResponseAdminListDto settlementList = adminService.settlement(type, month, state, page);
			
			return ResponseEntity.ok(settlementList);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}
	
	@GetMapping("/settlementDetail")
	public ResponseEntity<AdminSettlementListDto> settlementDetail(@RequestParam Integer settlementIdx) {
		
		try {	
			AdminSettlementListDto settlementDetail = adminService.settlementDetail(settlementIdx);
			
			return ResponseEntity.ok(settlementDetail);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	@PostMapping("/settlementComplate")
	public ResponseEntity<Boolean> settlementComplate(@RequestBody Map<String, Object> map){
		try {
			
			String comment = (String)map.get("comment");
			Integer settlementIdx = (Integer)map.get("settlementIdx");
			
			adminService.settlementComplate(settlementIdx, comment);
			
			return ResponseEntity.ok(true);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}
	
	@GetMapping("/dashboard")
	public ResponseEntity<Map<String, Object>> dashboard(){
		
		try {
			Map<String, Object> response = adminService.dashboard();
			
			return ResponseEntity.ok(response);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
}
