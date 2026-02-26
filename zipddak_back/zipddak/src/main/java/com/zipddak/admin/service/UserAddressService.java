package com.zipddak.admin.service;

import com.zipddak.admin.dto.RecvUserDto;

public interface UserAddressService {

	void saveAddress(RecvUserDto recvUser, String username) throws Exception;

}
