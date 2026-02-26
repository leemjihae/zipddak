package com.zipddak.admin.service;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.zipddak.admin.dto.BrandDto;
import com.zipddak.admin.dto.OptionListDto;
import com.zipddak.admin.dto.OrderListDto;
import com.zipddak.admin.dto.RecvUserDto;
import com.zipddak.admin.repository.ProductDslRepository;
import com.zipddak.dto.OrderDto;
import com.zipddak.entity.Order;
import com.zipddak.entity.OrderItem;
import com.zipddak.entity.OrderItem.OrderStatus;
import com.zipddak.entity.OrderItem.ReceiveWay;
import com.zipddak.entity.OrderItem.ReceiveWay;
import com.zipddak.entity.Product;
import com.zipddak.entity.Order.PaymentStatus;
import com.zipddak.entity.User;
import com.zipddak.repository.OrderItemRepository;
import com.zipddak.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentOrderService implements OrderService {

	private final ProductDslRepository productDslRepository;
	
	private final OrderRepository orderRepository;
	private final OrderItemRepository orderItemRepository;

	// 주문과 주문 상품을 db에 저장
	@Override
	public void addOrder(String username, String orderId, Map<String, Long> amount, RecvUserDto recvUser,
			List<BrandDto> brandList) {

		
		
		Order order = Order.builder()
						.orderCode(orderId)
						.user(User.builder()
								.username(username)
								.build())
						.subtotalAmount(amount.get("productTotal"))
						.shippingAmount(amount.get("postChargeTotal"))
						.totalAmount(amount.get("totalPrice"))
						.postZonecode(recvUser.getZonecode())
						.postAddr1(recvUser.getAddr1())
						.postAddr2(recvUser.getDetailAddress())
						.phone(recvUser.getTel())
						.postRecipient(recvUser.getRecvier())
						.postNote(recvUser.getRequestContent())
						.createdAt(new java.sql.Date(System.currentTimeMillis()))
						.paymentStatus(PaymentStatus.결제대기)
						.build();
		
		// 주문 저장
		Order savedOrder = orderRepository.save(order);
		
		Integer orderIdx = savedOrder.getOrderIdx();
		
		for (BrandDto brand : brandList) {
		    List<OptionListDto> orderList = brand.getOrderList();
		    if (orderList == null) continue;

		    for (OptionListDto optionListDto : orderList) {
		        OrderItem orderItem = OrderItem.builder()
		                .orderIdx(orderIdx)
		                .product(Product.builder()
		                        .productIdx(optionListDto.getProductId())
		                        .build())
		                .unitPrice(optionListDto.getPrice()) // long 타입으로 처리 가능
		                .quantity(optionListDto.getCount())
		                .receiveWay(ReceiveWay.post)
		                .orderStatus(OrderStatus.결제취소)
		                .productOptionIdx(optionListDto.getOptionId())
		                .createdAt(new java.sql.Date(System.currentTimeMillis()))
		                .build();

		        orderItemRepository.save(orderItem);
		    }
		}

			
	}
		
		

	// 주문 정보 받아오기
	@Override
	public OrderDto getOrderInfo(String orderCode) throws Exception {
		
		return productDslRepository.getOrderInfo(orderCode);
	}



	@Override
	public void addRentalOrder(String username, String orderId, Integer amount, RecvUserDto recvUser) {
		// TODO Auto-generated method stub
		
	}
	
	
	



}
