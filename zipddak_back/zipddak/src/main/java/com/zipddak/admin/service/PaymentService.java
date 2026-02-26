package com.zipddak.admin.service;

import java.util.List;
import java.util.Map;

import com.zipddak.admin.dto.BrandDto;
import com.zipddak.admin.dto.PaymentComplateDto;

public interface PaymentService {


	Map<String, Long> getTotalPrice(List<BrandDto> brandList);

	String getOrderName(List<BrandDto> brandList);

	void approvePayment(PaymentComplateDto paymentComplateDto, String type) throws Exception;

}
