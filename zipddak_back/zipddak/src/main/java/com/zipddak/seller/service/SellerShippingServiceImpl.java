package com.zipddak.seller.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.zipddak.dto.OrderDto;
import com.zipddak.repository.OrderItemRepository;
import com.zipddak.seller.dto.SearchConditionDto;
import com.zipddak.seller.dto.ShippingManageDto;
import com.zipddak.seller.repository.SellerShippingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SellerShippingServiceImpl implements SellerShippingService {
	
	private final OrderItemRepository orderItem_repo;
	private final SellerShippingRepository sellerShipping_repo;

	// 배송 진행 리스트
	@Override
	public Map<String, Object> getMyShippingList(String sellerUsername, Integer page, SearchConditionDto scDto) throws Exception {
		PageRequest pr = PageRequest.of(page - 1, 10);
		
		
		List<ShippingManageDto> myShippingList = sellerShipping_repo.searchMyShippings(sellerUsername, pr, scDto); // 배송진행리스트
		Long myShippingCount = sellerShipping_repo.countMyShippings(sellerUsername, scDto); // 배송 개수

		int allPage = (int) Math.ceil(myShippingCount / 10.0);
		int startPage = (page - 1) / 10 * 10 + 1;
		int endPage = Math.min(startPage + 9, allPage);

		Map<String, Object> result = new HashMap<>();
		result.put("curPage", page);
		result.put("allPage", allPage);
		result.put("startPage", startPage);
		result.put("endPage", endPage);
		result.put("myShippingList", myShippingList);
		result.put("myShippingCount", myShippingCount);

		return result;
	}

}
