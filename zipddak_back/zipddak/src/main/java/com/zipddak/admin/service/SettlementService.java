package com.zipddak.admin.service;

public interface SettlementService {

	void createMonthlySettlement() throws Exception;

	void rentalSettlementCreate(Integer rentalIdx) throws Exception;

}
