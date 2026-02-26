package com.zipddak.admin.dto;

import java.util.List;

import com.zipddak.dto.UserDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderListResponseDto {

	private Integer productId; // 자재 id
	private String brandName; // 판매업체명
	private long postCharge; // 배송비
	private String productName; // 자재명
	private long salePrice; // 판매가격
	private List<OptionListDto> orderList; // 구매 옵션
	private UserDto userInfo; // 사용자 정보
	
}
