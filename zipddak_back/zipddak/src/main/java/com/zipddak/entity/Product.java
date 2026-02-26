package com.zipddak.entity;

import java.sql.Date;

import javax.persistence.*;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.UpdateTimestamp;

import com.zipddak.dto.ProductDto;

import lombok.*;
import lombok.Builder.Default;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productIdx;

    @Column(nullable = false)
    private String sellerUsername;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer thumbnailFileIdx;

    @Column
    private Integer image1FileIdx;

    @Column
    private Integer image2FileIdx;

    @Column
    private Integer image3FileIdx;

    @Column
    private Integer image4FileIdx;

    @Column
    private Integer image5FileIdx;

    @Column(nullable = false)
    private Integer detail1FileIdx;

    @Column
    private Integer detail2FileIdx;

    @Column(nullable = false)
    private Integer categoryIdx;

    @Column
    private Integer subCategoryIdx;

    @Column(nullable = false)
    private Long price;

    @Column
    private Long salePrice;

    @Column
    private Integer discount;

    @Column
    private Boolean optionYn;

    @Column
    private Boolean postYn;

    @Enumerated(EnumType.STRING)
    private PostType postType; // bundle, single

    @Column(nullable = false)
    private Long postCharge;

    @Column
    private Boolean pickupYn;

    @Column
    private String zonecode;

    @Column
    private String pickupAddr1;

    @Column
    private String pickupAddr2;

    @Column(nullable = false)
    private Boolean visibleYn; 
    
    @Column(nullable = false)
    @ColumnDefault("false")  //기본값 지정 
    private Boolean deletedYn; 

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;

    public enum PostType {
        bundle, single
    }
    

    
    //상품 삭제시 작동 메소드 
    public void delete() {
        this.deletedYn = true;
    }
    

    
    public ProductDto toProductDetailDto() {
        return ProductDto.builder()
                .productIdx(productIdx)
                .sellerUsername(sellerUsername)
                .name(name)

                .thumbnailFileIdx(thumbnailFileIdx)
                .image1FileIdx(image1FileIdx)
                .image2FileIdx(image2FileIdx)
                .image3FileIdx(image3FileIdx)
                .image4FileIdx(image4FileIdx)
                .image5FileIdx(image5FileIdx)

                .detail1FileIdx(detail1FileIdx)
                .detail2FileIdx(detail2FileIdx)

                .categoryIdx(categoryIdx)
                .subCategoryIdx(subCategoryIdx)

                .price(price)
                .salePrice(salePrice)
                .discount(discount)

                .optionYn(optionYn)
                .postYn(postYn)

                // enum -> String
                .postType(postType != null ? postType.name() : null)

                .postCharge(postCharge)
                .pickupYn(pickupYn)

                .zonecode(zonecode)
                .pickupAddr1(pickupAddr1)
                .pickupAddr2(pickupAddr2)

                .visibleYn(visibleYn)
                .deletedYn(deletedYn)
                .createdAt(createdAt)
                .updatedAt(updatedAt)

                .build();
    }
    
    
    public void updateFromDto(ProductDto dto) {
        this.name = dto.getName();
		this.categoryIdx = dto.getCategoryIdx();
		this.subCategoryIdx = dto.getSubCategoryIdx();
        this.price = dto.getPrice();
        this.salePrice = dto.getSalePrice();
        this.discount = dto.getDiscount();
        this.optionYn = dto.getOptionYn();
		this.postYn = dto.getPostYn();
		this.postType = dto.getPostType() != null ? PostType.valueOf(dto.getPostType()) : null;
        this.postCharge = dto.getPostCharge();
        this.pickupYn = dto.getPickupYn();
		this.zonecode = dto.getZonecode();
		this.pickupAddr1 = dto.getPickupAddr1();
		this.pickupAddr2 = dto.getPickupAddr2();
		this.visibleYn = dto.getVisibleYn();
		this.updatedAt = dto.getUpdatedAt();
    }
    
    

    
    
    

}
