package com.zipddak.admin.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SellerInfoDto {

	private String username;
	private Integer sellerIdx;
	private String managerTel;
	private String logoFileRename;
	private String logoFileStorage;
	private String compHp; // 홈페이지
	private String brandName;
	private String handleItemCateIdx; // 카테고리번호인데 , 을 기준으로 나눠야함
	private String introduction;
	private String compAddr1; // 회사 주소
	private String compAddr2; // 회사 상세 주소
	
	private List<ProductCardDto> bestProductList; // 베스트 상품들
	
}
