package com.zipddak.seller.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.zipddak.dto.ProductDto;
import com.zipddak.dto.SellerDto;
import com.zipddak.seller.dto.SaveResultDto;
import com.zipddak.seller.service.SellerMypageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/seller/mypage")
@RequiredArgsConstructor
public class SellerMypageController {
	
	private final SellerMypageService mypage_svc;
	
	
	//프로필 상세보기
	@GetMapping("/myProfile")
	public ResponseEntity<?> getMyProfileDetail(@RequestParam("sellerId") String sellerUsername) {
			SellerDto myProfileDetail = mypage_svc.getMyProfileDetail(sellerUsername);
			System.out.println("myProfileDetail" + myProfileDetail);
			
			return ResponseEntity.ok(myProfileDetail);
        
    }
	
	//프로필 수정하기
	@PostMapping("/myProfileModify")
	public ResponseEntity<?> profileModify(SellerDto seller_dto, 
											@RequestParam("sellerId") String sellerUsername,
											@RequestParam(value="thumbnailFile", required=false) MultipartFile thumbnail, 
											@RequestParam(value="deleteThumbIdx", required = false) Integer deleteThumbIdx) {

		
		try {
			SaveResultDto result = mypage_svc.profileModify(seller_dto, sellerUsername, thumbnail, deleteThumbIdx);
		
		if (!result.isSuccess()) { //수정실패한 경우 
			return ResponseEntity.badRequest().body(result);
		}
		
		return ResponseEntity.ok(result);
		
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
    }

}
