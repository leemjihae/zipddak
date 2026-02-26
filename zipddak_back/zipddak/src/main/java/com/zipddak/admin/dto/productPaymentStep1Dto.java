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
public class productPaymentStep1Dto {

	private String username;
	private List<BrandDto> brandList;
	private RecvUserDto recvUser;
	
}
