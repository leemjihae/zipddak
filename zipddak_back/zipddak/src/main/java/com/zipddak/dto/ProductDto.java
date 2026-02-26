package com.zipddak.dto;

import java.sql.Date;
import java.util.List;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {
    private Integer productIdx; //상품 idx
    private String sellerUsername; //등록한 seller Id
    private String name;	//상품명
    private Integer thumbnailFileIdx;	//썸네일 이미지 idx
    private Integer image1FileIdx;	//추가이미지 이미지 idx (1~5)
    private Integer image2FileIdx;
    private Integer image3FileIdx;
    private Integer image4FileIdx;
    private Integer image5FileIdx;
    private Integer detail1FileIdx;
    private Integer detail2FileIdx;	//상세이미지 이미지 idx (1~2)
    private Integer categoryIdx;	//대분류 카테 idx
    private Integer subCategoryIdx;	//소분류 카테 idx 
    private Long price;	//상품가격
    private Long salePrice;	//판매가
    private Integer discount;	//할인율 
    private Boolean optionYn;	//옵션유무 -> 있을경우 ProductOption과 연관 
    private Boolean postYn; //택배배송 여부 
    private String postType;	//배송타입 (bundle / single)
    private Long postCharge;	//배송비 
    private Boolean pickupYn;	//직접픽업여부 
    private String zonecode;	//픽업주소지 우편번호 
    private String pickupAddr1;	//픽업주소지 도로명주소 
    private String pickupAddr2; //픽업주소지 상세주소
    private Boolean visibleYn;	//상품공개여부 
    private Boolean deletedYn;	//상품 삭제 여부 
    private Date createdAt;
    private Date updatedAt;
    
    //join용컬럼
    private String thumbnailFileRename;
    private String image1FileRename;
    private String image2FileRename;
    private String image3FileRename;
    private String image4FileRename;
    private String image5FileRename;
    private String detail1FileRename;
    private String detail2FileRename;
    
    private List<ProductOptionDto> pdOptions;
    private Long reviewCount;
    private Double reviewAvgScore;

    
    
}
