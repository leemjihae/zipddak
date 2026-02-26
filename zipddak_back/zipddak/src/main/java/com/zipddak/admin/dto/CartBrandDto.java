package com.zipddak.admin.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartBrandDto {

	private Integer brandId; // 판매업체 id
	private String brandName; // 판매업체 이름
	private long freeChargeAmount; // 무료배송 기준 금액
	private long basicPostCharge; // 기본 배송비
	List<CartProductDetailDto> productList; // 상품 목록
	
	
}
