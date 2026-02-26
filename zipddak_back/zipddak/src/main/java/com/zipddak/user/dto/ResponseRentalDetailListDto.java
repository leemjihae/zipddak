package com.zipddak.user.dto;

import java.util.List;

import com.zipddak.admin.dto.ResponseAdminListDto;
import com.zipddak.util.PageInfo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseRentalDetailListDto {

	private List<?> list;
	private PageInfo pageInfo;
	
}
