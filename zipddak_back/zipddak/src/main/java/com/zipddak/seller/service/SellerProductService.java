package com.zipddak.seller.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.zipddak.dto.CategoryDto;
import com.zipddak.dto.ProductDto;
import com.zipddak.entity.Product;
import com.zipddak.seller.dto.CategoryResponseDto;
import com.zipddak.seller.dto.SaveResultDto;

public interface SellerProductService {

	List<CategoryResponseDto> getCategoryTree(); //카테고리 리스트 조회
	//상품 등록 
	SaveResultDto productRegist(ProductDto product_dto, MultipartFile thumbnail, MultipartFile[] addImageFiles, MultipartFile[] detailImageFiles, String optionsJson) throws Exception;
	//셀러가 등록한 상품들이 갖고있는 카테고리 리스트 
	List<CategoryDto> getSellerCategories(String sellerUsername);
	//상품 리스트 
	Map<String, Object> searchMyProductList(String sellerUsername, String status, String category, String keyword, Integer page) throws Exception;
	//상품 상세보기
	ProductDto MyProductDetail(String sellerUsername, Integer productIdx);
	//상품 수정 
	SaveResultDto productModify(ProductDto product_dto, String sellerUsername, Integer productIdx,
			MultipartFile thumbnail, MultipartFile[] addImageFiles, MultipartFile[] detailImageFiles,
			Integer deleteThumbIdx, Integer[] deleteAddIdxList, Integer[] deleteDetailIdxList, String optionsJson) throws Exception;
	//상품 삭제  
	SaveResultDto productDelete(ProductDto product_dto, String sellerUsername, Integer productIdx) throws Exception;
	
	//상품 삭제시 이미지 처리용 
	void deleteProductImages(Product productEntity);
	

}
