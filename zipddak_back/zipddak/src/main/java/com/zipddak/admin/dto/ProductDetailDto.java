package com.zipddak.admin.dto;

import com.zipddak.entity.Product.PostType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDetailDto {
	
	private Integer productIdx; // 상품 번호
	private String name; // 상품 이름
	private Integer discount; // 할인율
	private Long price; // 가격
	private Long salePrice; // 판매가격
	private Long postCharge; // 배송비
	private Boolean optionYn; // 옵션 유무
	private PostType postType; // 묶음 개별 여부
	private Boolean postYn; // 배송가능유무
	private Boolean pickupYn; // 픽업가능유무
	private String zonecode; // 픽업지 주소 우편번호
	private String pickupAddr1; // 픽업지 주소 도로명 주소
	private String pickupAddr2; // 픽업지 주소 상세 주소
	
	// 조인해서 가져올 데이터
	private String brandName; // 브랜드명
	private String category; // 메인 카테고리
	private String subCategory; // 서브 카테고리
	
	// 판매업체 아이디
	private Integer sellerIdx;
	
	// 이미지 목록들
	private String thumbnail;
	private String img1;
	private String img2;
	private String img3;
	private String img4;
	private String img5;
	private String detailImg1;
	private String detailImg2;
	
	
}
