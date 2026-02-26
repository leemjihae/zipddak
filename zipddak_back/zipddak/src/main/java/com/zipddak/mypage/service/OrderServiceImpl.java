package com.zipddak.mypage.service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.zipddak.entity.OrderItem.OrderStatus;
import com.zipddak.mypage.dto.DeliveryGroupsDto;
import com.zipddak.mypage.dto.OrderDetailDto;
import com.zipddak.mypage.dto.OrderItemDto;
import com.zipddak.mypage.dto.OrderItemFlatDto;
import com.zipddak.mypage.dto.OrderListDto;
import com.zipddak.mypage.dto.OrderStatusSummaryDto;
import com.zipddak.mypage.repository.OrderDslRepository;
import com.zipddak.util.PageInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

	private final OrderDslRepository orderDslRepository;

	// 주문배송목록 조회
	@Override
	public List<OrderListDto> getOrderList(String username, PageInfo pageInfo, Date startDate, Date endDate)
			throws Exception {
		PageRequest pageRequest = PageRequest.of(pageInfo.getCurPage() - 1, 10);

		// 평탄화한 주문상품목록 가져오기
		List<OrderItemFlatDto> orderItemFlatDtoList = orderDslRepository.selectOrderItemFlatList(username, pageRequest,
				startDate, endDate);

		// 페이지 수 계산
		Long cnt = orderDslRepository.selectOrderItemFlatCount(username, startDate, endDate);

		Integer allPage = (int) (Math.ceil(cnt.doubleValue() / pageRequest.getPageSize()));
		Integer startPage = (pageInfo.getCurPage() - 1) / 10 * 10 + 1;
		Integer endPage = Math.min(startPage + 10 - 1, allPage);

		pageInfo.setAllPage(allPage);
		pageInfo.setStartPage(startPage);
		pageInfo.setEndPage(endPage);

		Map<Integer, OrderListDto> orderListDtoMap = new LinkedHashMap<>();

		for (OrderItemFlatDto orderItemFlatDto : orderItemFlatDtoList) {
			System.out.print(orderItemFlatDto + "\n");

			// 1. 주문상품목록을 주문번호 기준으로 묶기 -> OrderListDto
			OrderListDto orderListDto = orderListDtoMap.get(orderItemFlatDto.getOrderIdx());
			if (orderListDto == null) {
				orderListDto = new OrderListDto();
				orderListDto.setOrderIdx(orderItemFlatDto.getOrderIdx());
				orderListDto.setOrderCode(orderItemFlatDto.getOrderCode());
				orderListDto.setOrderDate(orderItemFlatDto.getOrderDate());
				orderListDto.setCanCancel(false);
				orderListDto.setCanReturn(false);
				orderListDto.setDeliveryGroups(new ArrayList<>());
				orderListDtoMap.put(orderItemFlatDto.getOrderIdx(), orderListDto);
			}

			// 주문상품 중 "상품준비중"이 하나라도 있으면 취소 가능
			if (orderItemFlatDto.getOrderStatus() == OrderStatus.상품준비중) {
				orderListDto.setCanCancel(true);
			}
			// 주문상품 중 "배송중", "배송완료"가 하나라도 있으면 교환/환불 가능
			if (orderItemFlatDto.getOrderStatus() == OrderStatus.배송중
					|| orderItemFlatDto.getOrderStatus() == OrderStatus.배송완료) {
				orderListDto.setCanReturn(true);
			}

			// 배송key 생성
			String key = orderItemFlatDto.getBrandName() + "_" + orderItemFlatDto.getDeliveryType() + "_"
					+ orderItemFlatDto.getDeliveryFeeType();

			// 2. 하나의 주문을 배송key 기준으로 묶기 -> DeliveryGroupsDto
			DeliveryGroupsDto deliveryGroupsDto = orderListDto.getDeliveryGroups().stream().filter(
					o -> (o.getBrandName() + "_" + o.getDeliveryType() + "_" + o.getDeliveryFeeType()).equals(key))
					.findFirst().orElse(null);

			if (deliveryGroupsDto == null) {
				deliveryGroupsDto = new DeliveryGroupsDto();
				deliveryGroupsDto.setBrandName(orderItemFlatDto.getBrandName());
				deliveryGroupsDto.setDeliveryType(orderItemFlatDto.getDeliveryType());
				deliveryGroupsDto.setDeliveryFeeType(orderItemFlatDto.getDeliveryFeeType());
				deliveryGroupsDto.setFreeChargeAmount(orderItemFlatDto.getFreeChargeAmount());
				deliveryGroupsDto.setDeliveryFeePrice(orderItemFlatDto.getDeliveryFeePrice());
				deliveryGroupsDto.setOrderItems(new ArrayList<>());

				orderListDto.getDeliveryGroups().add(deliveryGroupsDto);
			}

			// 3. OrderItemDto 생성
			OrderItemDto orderItemDto = new OrderItemDto();
			orderItemDto.setOrderItemIdx(orderItemFlatDto.getOrderItemIdx());
			orderItemDto.setProductIdx(orderItemFlatDto.getProductIdx());
			orderItemDto.setProductName(orderItemFlatDto.getProductName());
			orderItemDto.setOptionName(orderItemFlatDto.getOptionName());
			orderItemDto.setQuantity(orderItemFlatDto.getQuantity());
			orderItemDto.setPrice(orderItemFlatDto.getPrice());
			orderItemDto.setSalePrice(orderItemFlatDto.getSalePrice());
			orderItemDto.setProductPrice(orderItemFlatDto.getProductPrice());
			orderItemDto.setThumbnail(orderItemFlatDto.getThumbnail());
			orderItemDto.setTrackingNo(orderItemFlatDto.getTrackingNo());
			orderItemDto.setPostComp(orderItemFlatDto.getPostComp());
			orderItemDto.setOrderStatus(orderItemFlatDto.getOrderStatus());
			orderItemDto.setReviewAvailable(orderItemFlatDto.getReviewAvailable());
			orderItemDto.setExchangeOption(orderItemFlatDto.getExchangeOption());

			deliveryGroupsDto.getOrderItems().add(orderItemDto);
		}

		// 배송비 계산
		for (OrderListDto orderListDto : orderListDtoMap.values()) {
			for (DeliveryGroupsDto group : orderListDto.getDeliveryGroups()) {

				// 수량 * 상품 가격으로 총합 상품 금액 계산
				long totalGroupPrice = group.getOrderItems().stream()
				        .mapToLong(item -> item.getPrice() * item.getQuantity())
				        .sum();


				// 무료배송
				if (group.getFreeChargeAmount() != null && totalGroupPrice >= group.getFreeChargeAmount()) {

					group.setFreeCharge(true);
					group.setAppliedDeliveryFee(0L);
					continue;
				}

				group.setFreeCharge(false);

				switch (group.getDeliveryFeeType()) {
				case single: // 개별배송
					group.setAppliedDeliveryFee(group.getDeliveryFeePrice() * group.getOrderItems().size());
					break;

				case bundle: // 묶음배송
					group.setAppliedDeliveryFee(group.getDeliveryFeePrice());
					break;

				default: // 무료배송
					group.setAppliedDeliveryFee(0L);
				}
			}
		}
		return new ArrayList<>(orderListDtoMap.values());
	}

	// 취소교환반품목록 조회
	@Override
	public List<OrderListDto> getReturnList(String username, PageInfo pageInfo, Date startDate, Date endDate)
			throws Exception {
		PageRequest pageRequest = PageRequest.of(pageInfo.getCurPage() - 1, 10);

		// 평탄화한 취소교환반품목록 가져오기
		List<OrderItemFlatDto> orderItemFlatDtoList = orderDslRepository.selectReturnOrderItemFlatList(username,
				pageRequest, startDate, endDate);

		// 페이지 수 계산
		Long cnt = orderDslRepository.selectReturnOrderItemFlatCount(username, startDate, endDate);

		Integer allPage = (int) (Math.ceil(cnt.doubleValue() / pageRequest.getPageSize()));
		Integer startPage = (pageInfo.getCurPage() - 1) / 10 * 10 + 1;
		Integer endPage = Math.min(startPage + 10 - 1, allPage);

		pageInfo.setAllPage(allPage);
		pageInfo.setStartPage(startPage);
		pageInfo.setEndPage(endPage);

		Map<Integer, OrderListDto> orderListDtoMap = new LinkedHashMap<>();

		for (OrderItemFlatDto orderItemFlatDto : orderItemFlatDtoList) {

			// 1. 취소교환반품목록을 주문번호 기준으로 묶기 -> OrderListDto
			OrderListDto orderListDto = orderListDtoMap.get(orderItemFlatDto.getOrderIdx());
			if (orderListDto == null) {
				orderListDto = new OrderListDto();
				orderListDto.setOrderIdx(orderItemFlatDto.getOrderIdx());
				orderListDto.setOrderCode(orderItemFlatDto.getOrderCode());
				orderListDto.setOrderDate(orderItemFlatDto.getOrderDate());
				orderListDto.setCanCancel(false);
				orderListDto.setCanReturn(false);
				orderListDto.setDeliveryGroups(new ArrayList<>());
				orderListDtoMap.put(orderItemFlatDto.getOrderIdx(), orderListDto);
			}

			// 배송key 생성
			String key = orderItemFlatDto.getBrandName() + "_" + orderItemFlatDto.getDeliveryType() + "_"
					+ orderItemFlatDto.getDeliveryFeeType();

			// 2. 하나의 주문을 배송key 기준으로 묶기 -> DeliveryGroupsDto
			DeliveryGroupsDto deliveryGroupsDto = orderListDto.getDeliveryGroups().stream().filter(
					o -> (o.getBrandName() + "_" + o.getDeliveryType() + "_" + o.getDeliveryFeeType()).equals(key))
					.findFirst().orElse(null);

			if (deliveryGroupsDto == null) {
				deliveryGroupsDto = new DeliveryGroupsDto();
				deliveryGroupsDto.setBrandName(orderItemFlatDto.getBrandName());
				deliveryGroupsDto.setDeliveryType(orderItemFlatDto.getDeliveryType());
				deliveryGroupsDto.setDeliveryFeeType(orderItemFlatDto.getDeliveryFeeType());
				deliveryGroupsDto.setFreeChargeAmount(orderItemFlatDto.getFreeChargeAmount());
				deliveryGroupsDto.setDeliveryFeePrice(orderItemFlatDto.getDeliveryFeePrice());
				deliveryGroupsDto.setOrderItems(new ArrayList<>());

				orderListDto.getDeliveryGroups().add(deliveryGroupsDto);
			}

			// 3. OrderItemDto 생성
			OrderItemDto orderItemDto = new OrderItemDto();
			orderItemDto.setOrderItemIdx(orderItemFlatDto.getOrderItemIdx());
			orderItemDto.setProductIdx(orderItemFlatDto.getProductIdx());
			orderItemDto.setProductName(orderItemFlatDto.getProductName());
			orderItemDto.setOptionName(orderItemFlatDto.getOptionName());
			orderItemDto.setQuantity(orderItemFlatDto.getQuantity());
			orderItemDto.setPrice(orderItemFlatDto.getPrice());
			orderItemDto.setThumbnail(orderItemFlatDto.getThumbnail());
			orderItemDto.setOrderStatus(orderItemFlatDto.getOrderStatus());
			orderItemDto.setReviewAvailable(false);
			orderItemDto.setExchangeOption(orderItemFlatDto.getExchangeOption());

			deliveryGroupsDto.getOrderItems().add(orderItemDto);
		}

		// 배송비 계산
		for (OrderListDto orderListDto : orderListDtoMap.values()) {
			for (DeliveryGroupsDto group : orderListDto.getDeliveryGroups()) {

				long totalGroupPrice = group.getOrderItems().stream().mapToLong(OrderItemDto::getPrice).sum();

				// 무료배송
				if (group.getFreeChargeAmount() != null && totalGroupPrice >= group.getFreeChargeAmount()) {

					group.setFreeCharge(true);
					group.setAppliedDeliveryFee(0L);
					continue;
				}

				group.setFreeCharge(false);

				switch (group.getDeliveryFeeType()) {
				case single: // 개별배송
					group.setAppliedDeliveryFee(group.getDeliveryFeePrice() * group.getOrderItems().size());
					break;

				case bundle: // 묶음배송
					group.setAppliedDeliveryFee(group.getDeliveryFeePrice());
					break;

				default: // 무료배송
					group.setAppliedDeliveryFee(0L);
				}
			}
		}

		return new ArrayList<>(orderListDtoMap.values());
	}

	// 상품주문상태 요약
	@Override
	public OrderStatusSummaryDto getOrderStatusSummary(String username) throws Exception {
		// 오늘 날짜와 6개월 전 날짜 구하기
		LocalDate today = LocalDate.now();
		LocalDate sixMonthsAgo = today.minusMonths(6);

		Date todayDate = Date.valueOf(today);
		Date sixMonthsAgoDate = Date.valueOf(sixMonthsAgo);

		return orderDslRepository.selectOrderStatusSummary(username, todayDate, sixMonthsAgoDate);

	}

	// 주문상세 조회
	@Override
	public OrderDetailDto getOrderDetail(Integer orderIdx) throws Exception {
		return orderDslRepository.selectOrderDetail(orderIdx);
	}
}
