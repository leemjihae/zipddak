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
public class OrderItemsDto {

	private Integer orderItemIdx;
    private int quantity;
	private String fileRename;
	private String storagePath;
	private String productName;
	private long salePrice;
	private long productPrice;
	private OptionDto option; // 각 주문 상품에 옵션 1개
}
