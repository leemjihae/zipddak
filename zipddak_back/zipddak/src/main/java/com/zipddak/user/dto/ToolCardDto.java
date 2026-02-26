package com.zipddak.user.dto;

import com.google.auto.value.AutoValue.Builder;
import com.zipddak.entity.Tool.ToolStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ToolCardDto {
	
	 private Integer toolIdx;
	 private String name;
	 private Long rentalPrice;
	 private String addr1;
	 private String tradeAddr1;
	 private ToolStatus satus;
	 private String categoryName;
	 
	 private Boolean directRental;
	 private Boolean postRental;
	 
	 private String thunbnail; // 썸네일 파일 이름
	
	 private Long rentalCount; //대여 수
	 private Boolean favorite; // 관심 표시
	 private Long favoriteCount; //관심 수
	 
}
