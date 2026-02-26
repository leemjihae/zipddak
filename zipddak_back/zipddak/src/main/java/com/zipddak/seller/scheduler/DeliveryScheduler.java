package com.zipddak.seller.scheduler;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.zipddak.repository.OrderItemRepository;
import com.zipddak.seller.service.SellerOrderService;

import lombok.RequiredArgsConstructor;

@EnableScheduling
@Component
@RequiredArgsConstructor
public class DeliveryScheduler {
	
	private final OrderItemRepository orderItem_repo;
	private final SellerOrderService order_svc;

//    @Scheduled(fixedRate = 1000 * 60 * 10) // 10분마다 변경
//    @Transactional
//    public void autoCompleteDelivery() {
//        LocalDate ReferenceTime = LocalDate.now().minusDays(1);
//
//        List<OrderItem> targets = orderItem_repo.findByOrderStatusAndShippingStartedAtBefore(OrderStatus.배송중, ReferenceTime);
//
//        for (OrderItem item : targets) {
//            item.setOrderStatus(OrderStatus.배송완료);
//            item.setDeliveredAt(LocalDate.now());
//        }
//    }
	
	@Scheduled(cron = "0 */5 * * * *")  //매 10분마다 실행
	public void run() {
		order_svc.autoCompleteDelivery();
	}

}
