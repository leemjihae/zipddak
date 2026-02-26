package com.zipddak.user.dto;

import com.zipddak.admin.dto.RecvUserDto;
import com.zipddak.dto.RentalDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RentalPaymentStep1Dto {
	
	private String username;
	private RecvUserDto recvUser;
	private Integer amount;
	private Integer toolIdx;
	private RentalDto rental;

}
