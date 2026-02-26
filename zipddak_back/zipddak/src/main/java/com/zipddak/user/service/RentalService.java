package com.zipddak.user.service;

import java.util.List;
import java.util.Map;

import com.zipddak.dto.RentalDto;
import com.zipddak.user.dto.RentalDetailDto;
import com.zipddak.user.dto.ResponseBorrowDetailDto;
import com.zipddak.user.dto.ResponseRentalDetailListDto;

public interface RentalService {
	
	//대여 등록
	void rentalApplication (RentalDto rentalDto, String orderId) throws Exception;

	ResponseRentalDetailListDto rental(String username, Integer rentalCate, String startDate, String endDate, Integer state, Integer page) throws Exception;

	ResponseBorrowDetailDto borrowDetail(String username, Integer rentalIdx) throws Exception;

	ResponseBorrowDetailDto lentDetail(String username, Integer rentalIdx) throws Exception;

	void postCode(Map<String, Object> map) throws Exception;

	void stateRental(Integer rentalIdx) throws Exception;

	void stateReturn(Integer rentalIdx) throws Exception;

	void reviewWriteState(Integer rentalIdx) throws Exception;


}
