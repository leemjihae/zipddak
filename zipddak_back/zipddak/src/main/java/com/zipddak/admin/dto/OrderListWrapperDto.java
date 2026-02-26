package com.zipddak.admin.dto;

import java.util.List;


import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class OrderListWrapperDto {

	private List<OrderListDto> orderList;
	private String username;
	
}
