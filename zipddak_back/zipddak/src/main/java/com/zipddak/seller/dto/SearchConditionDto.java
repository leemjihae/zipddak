package com.zipddak.seller.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchConditionDto {

    private String keyword;               // 공통 검색어
    
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate searchDate;         // 특정 날짜 검색
   
    private List<Integer> categoryList;   // 카테고리 번호
    
    private String sellerUsername;        // 셀러
    
    private String customerUsername;      // 구매자
    
    private List<Boolean> visibleList;	//상품 공개여부 
    private List<String> orderStateList;	//주문상태 
    
    //콤마문자열을 List로 변환 
    public void setOrderStateList(String orderStateList) {
        if (orderStateList == null || orderStateList.isEmpty()) {
            this.orderStateList = null;
        } else {
            this.orderStateList = Arrays.asList(orderStateList.split(","));
        }
    }
}

