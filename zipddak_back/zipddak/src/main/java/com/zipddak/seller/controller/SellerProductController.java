package com.zipddak.seller.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.zipddak.dto.CategoryDto;
import com.zipddak.dto.ProductDto;
import com.zipddak.seller.dto.CategoryResponseDto;
import com.zipddak.seller.dto.SaveResultDto;
import com.zipddak.seller.service.SellerProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/seller/product")
@RequiredArgsConstructor
public class SellerProductController {
	
	private final SellerProductService product_svc;
	
	//카테고리 리스트 조회
	@GetMapping("/categories/all")
    public List<CategoryResponseDto> getCategories() {
        try {
        	System.out.println("product_svc.getCategoryTree(); : " + product_svc.getCategoryTree());
			return product_svc.getCategoryTree();
			
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
    }
	
	
	//상품 등록
	@PostMapping("/regist")
    public ResponseEntity<?> productRegist(ProductDto product_dto, 
			    							@RequestParam(value="thumbnailFile") MultipartFile thumbnail, 
											@RequestParam(value="addImageFiles", required=false) MultipartFile[] addImageFiles, 
											@RequestParam(value="detailImageFiles") MultipartFile[] detailImageFiles,
											@RequestParam(value = "options", required = false) String optionsJson,
											@RequestParam(value="sellerId") String sellerUsername) {
//		System.out.println("pDto : " + product_dto);
//		System.out.println(optionsJson);
		
        try {
        	product_dto.setSellerUsername(sellerUsername);
        	SaveResultDto result = product_svc.productRegist(product_dto, thumbnail, addImageFiles, detailImageFiles, optionsJson);

            if (!result.isSuccess()) { //상품 등록 실패한 경우 
                return ResponseEntity.badRequest().body(result);
            }

            return ResponseEntity.ok(result);
			
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
    }
	
	
	//리스트 출력 
	//셀러가 등록한 상품의 카테고리만 필터박스에 세팅 
	@GetMapping("/categories")
	public ResponseEntity<?> getSellerCategories(@RequestParam("sellerId") String sellerUsername) {
		System.out.println("sellerUsername : " + sellerUsername);
		try {
			List<CategoryDto> sellerCategories = product_svc.getSellerCategories(sellerUsername);
			return ResponseEntity.ok(sellerCategories);
			
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}
	
	//상품 리스트
	@GetMapping("/myProductList")
	public ResponseEntity<?> getProductList(@RequestParam("sellerId") String sellerUsername,
											@RequestParam(value="status", required = false) String status,
								            @RequestParam(value="category", required = false) String category,
								            @RequestParam(value="keyword", required = false) String keyword,
								            @RequestParam(value="page", required=false, defaultValue="1") Integer page) {
//		System.out.println("sellerUsernamesss : " + sellerUsername);
//		System.out.println("status : " + status);
//		System.out.println("category : " + category);
//		System.out.println("keyword : " + keyword);
		
		try {
			Map<String, Object> sellerProductList = product_svc.searchMyProductList(sellerUsername, status, category, keyword, page);
			return ResponseEntity.ok(sellerProductList);
			
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
        
    }
	
	//상품 상세보기
	@GetMapping("/myProductDetail")
	public ResponseEntity<?> getProductDetail(@RequestParam("sellerId") String sellerUsername,
												@RequestParam(value="num") Integer productIdx) {
		//@GetMapping("/myProductDetail/{productIdx}")
		// @AuthenticationPrincipal CustomUserDetails user,
	    //@PathVariable Integer productIdx
			ProductDto myProductDetail = product_svc.MyProductDetail(sellerUsername, productIdx);
			System.out.println("myProductDetail" + myProductDetail);
			
			return ResponseEntity.ok(myProductDetail);
        
    }
	
	
	//상품 수정하기
	@PostMapping("/myProductModify")
	public ResponseEntity<?> productModify(ProductDto product_dto, 
											@RequestParam("sellerId") String sellerUsername,
											@RequestParam(value="num") Integer productIdx,
											@RequestParam(value="thumbnailFile", required=false) MultipartFile thumbnail, 
											@RequestParam(value="addImageFiles", required=false) MultipartFile[] addImageFiles, 
											@RequestParam(value="detailImageFiles", required=false) MultipartFile[] detailImageFiles,
											@RequestParam(value="deleteThumbIdx", required = false) Integer deleteThumbIdx,
											@RequestParam(value="deleteAddIdxList", required = false) Integer[] deleteAddIdxList,
											@RequestParam(value="deleteDetailIdxList", required = false) Integer[] deleteDetailIdxList,
											@RequestParam(value = "options", required = false) String optionsJson) {
//		System.out.println("ProductDto : " + product_dto);
//		System.out.println("sellerId : " + sellerUsername);
//		System.out.println("num : " + productIdx);
//		System.out.println("thumbnailFile : " + thumbnail);
//		System.out.println("addImageFiles : " + addImageFiles);
//		System.out.println("detailImageFiles : " + detailImageFiles);
//		System.out.println("deleteThumbIdx : " + deleteThumbIdx);
//		System.out.println("deleteAddIdxList : " + deleteAddIdxList);
//		System.out.println("deleteDetailIdxList : " + deleteDetailIdxList);
//		System.out.println(optionsJson);
		
		try {
			SaveResultDto result = product_svc.productModify(product_dto, sellerUsername, productIdx, thumbnail, addImageFiles, detailImageFiles, 
																	deleteThumbIdx, deleteAddIdxList, deleteDetailIdxList, optionsJson);
		
		if (!result.isSuccess()) { //상품 수정실패한 경우 
			return ResponseEntity.badRequest().body(result);
		}
		
		return ResponseEntity.ok(result);
		
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
    }
	
	
	
	//상품 삭제하기
	@PostMapping("/myProductDelete")
	public ResponseEntity<?> myProductDelete(ProductDto product_dto, 
											@RequestParam("sellerId") String sellerUsername,
											@RequestParam(value="num") Integer productIdx) {
			System.out.println("ProductDto : " + product_dto);
			System.out.println("sellerId : " + sellerUsername);
			System.out.println("num : " + productIdx);
		
		try {
			SaveResultDto result = product_svc.productDelete(product_dto, sellerUsername, productIdx);
		
		if (!result.isSuccess()) { //상품 삭제 실패한 경우 
			return ResponseEntity.badRequest().body(result);
		}
		
		return ResponseEntity.ok(result);
		
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
    }
	
	
	


	
	
	
	
	

}
