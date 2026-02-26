package com.zipddak.admin.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.querydsl.QPageRequest;
import org.springframework.stereotype.Service;

import com.zipddak.admin.dto.CartBrandDto;
import com.zipddak.admin.dto.OrderListDto;
import com.zipddak.admin.dto.OrderListToListDto;
import com.zipddak.admin.repository.ProductDslRepository;
import com.zipddak.entity.Cart;
import com.zipddak.entity.Product;
import com.zipddak.repository.CartRepository;
import com.zipddak.util.PageInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

	private final ProductDslRepository productDslRepository;
	
	private final CartRepository cartRepository;
	
	// 장바구니에 물건들 추가하기
	@Override
	public void addCart(OrderListToListDto orderListDto) throws Exception {

		List<OrderListDto> productList = orderListDto.getOrderListDto();
		String username = orderListDto.getUsername();
		
		for(OrderListDto product : productList) {
			
			Optional<Cart> checkCart = cartRepository.findByProduct_ProductIdxAndUserUsernameAndOptionIdx(product.getProductId(), username, product.getOptionId());
			
			
			Cart cart = null;
			
			// 이미 존재하면 수량 증가
			if(checkCart.isPresent()) {
				cart = checkCart.get();
				
				cart.setQuantity(cart.getQuantity() + product.getCount());
				
			}else { // 새로 만들어서 저장 
				cart = Cart.builder()
						.optionIdx(product.getOptionId())
						.product(Product.builder()
								.productIdx(product.getProductId())
								.build())
						.quantity(product.getCount())
						.userUsername(username)
						.build();
		
			}
			
			cartRepository.save(cart);
		}
		
	}

	// 카트 리스트 가져오기
	@Override
	public List<CartBrandDto> cartList(String username) throws Exception {
		
		return productDslRepository.cartList(username);
	}

	@Override
	public void decreaseCount(Integer cartIdx) throws Exception {

		Cart cart = cartRepository.findById(cartIdx).orElseThrow(() -> new Exception("장바구니 조회 중 에러"));
		
		// 수량이 1개면 삭제
		if(cart.getQuantity() == 1) {
			cartRepository.delete(cart);
		}else {
			cart.setQuantity(cart.getQuantity() - 1);
			cartRepository.save(cart);
		}
		
	}

	@Override
	public void increaseCount(Integer cartIdx) throws Exception {
		
		Cart cart = cartRepository.findById(cartIdx).orElseThrow(() -> new Exception("장바구니 조회 중 에러"));
		
		cart.setQuantity(cart.getQuantity() + 1);
		
		cartRepository.save(cart);
	}

	@Override
	public void delete(List<Integer> list) throws Exception {

		for(Integer cartIdx : list) {
			
			Cart cart = cartRepository.findById(cartIdx).orElseThrow(() -> new Exception("장바구니 조회 중 에러"));
			
			cartRepository.delete(cart);
		}
		
	}

}
