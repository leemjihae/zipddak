package com.zipddak.seller.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.zipddak.dto.ExchangeDto;
import com.zipddak.dto.OrderDto;
import com.zipddak.seller.dto.SearchConditionDto;
import com.zipddak.seller.repository.SellerExchangeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SellerExchangeServiceImpl implements SellerExchangeService {
	
	private final SellerExchangeRepository sellerExchange_repo;

	// 교환 리스트
	@Override
	public Map<String, Object> getMyExchangeList(String sellerUsername, Integer page, SearchConditionDto scDto) throws Exception {
PageRequest pr = PageRequest.of(page - 1, 10);
		
		List<ExchangeDto> myExchangeList = sellerExchange_repo.searchMyExchanges(sellerUsername, pr, scDto);  //교환리스트
		Long myExchangeCount = sellerExchange_repo.countMyExchanges(sellerUsername, scDto);	//교환진행건 개수 

        int allPage = (int) Math.ceil(myExchangeCount / 10.0);
        int startPage = (page - 1) / 10 * 10 + 1;
        int endPage = Math.min(startPage + 9, allPage);

        Map<String, Object> result = new HashMap<>();
        result.put("curPage", page);
        result.put("allPage", allPage);
        result.put("startPage", startPage);
        result.put("endPage", endPage);
        result.put("myExchangeList", myExchangeList);
        result.put("myExchangeCount", myExchangeCount);
        
		return result;
	}
	
	

}
