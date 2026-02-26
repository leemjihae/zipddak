package com.zipddak.admin.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Date;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zipddak.admin.dto.SettlementsTargetListDto;
import com.zipddak.admin.repository.PaymentDslRepository;
import com.zipddak.dto.SettlementSellerTargetListDto;
import com.zipddak.entity.Payment;
import com.zipddak.entity.Rental;
import com.zipddak.entity.Settlement;
import com.zipddak.entity.Settlement.SettlementState;
import com.zipddak.entity.Settlement.TargetType;
import com.zipddak.mypage.repository.SettlementDslRepository;
import com.zipddak.repository.PaymentRepository;
import com.zipddak.repository.RentalRepository;
import com.zipddak.repository.SettlementRepository;
import com.zipddak.user.repository.RentalDsl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminSettlementServiceImpl implements SettlementService{

	private final PaymentDslRepository paymentDslRepository;
	private final RentalDsl rentalDsl;
	private final SettlementRepository settlementRepository;
	private final PaymentRepository paymentRepository;
	private final RentalRepository rentalRepository;
	
	@Override
	@Transactional
	public void createMonthlySettlement() throws Exception {
		
		// 전월 기준
        YearMonth targetMonth = YearMonth.now().minusMonths(1);
        log.info("정산 대상 월: {}", targetMonth);
        
        // 전문가 정산 리스트
        List<SettlementsTargetListDto> expertSettlementList = paymentDslRepository.expertSettlementsTarget(targetMonth);
        
        // 판매업체 정산 리스트
        List<SettlementSellerTargetListDto> sellerSettlementList = paymentDslRepository.sellerSettlementsTarget(targetMonth);
        
        Date targetDate = Date.valueOf(targetMonth.atDay(1));
        
        // 전문가 정산 리스트를 통해서 정산 테이블에 저장
        // 이미 정산되어있는 정산 리스트면 저장 제외
        for(SettlementsTargetListDto target : expertSettlementList) {
        	
        	Optional<Settlement> targetSettlement = settlementRepository.findByTargetUsernameAndTargetTypeAndSettlementMonth(
        			target.getUsername(), TargetType.EXPERT,  targetDate
        			);
        	
        	// 존재하지 않는다면 새로 만들어야함
        	if(!targetSettlement.isPresent()) {
        		
        		Settlement settlement = Settlement.builder()
        								.amount(target.getTotalAmount())
        								.state(SettlementState.PENDING)
        								.targetUsername(target.getUsername())
        								.feeRate(5)
        								.settlementAmount(
        									    target.getTotalAmount() * 95 / 100
        									)
        								.targetType(TargetType.EXPERT)
        								.targetUsername(target.getUsername())
        								.settlementMonth(targetDate)
        								.build();
        		
        		settlementRepository.save(settlement);
        	}
        	
        }
        
        // 판매업체 정산 리스트를 통해서 정산 테이블에 저장
        for(SettlementSellerTargetListDto target : sellerSettlementList) {
        	
        	Optional<Settlement> targetSettlement = settlementRepository.findByTargetUsernameAndTargetTypeAndSettlementMonth(
        			target.getUsername(), TargetType.SELLER,  targetDate
        			);
        	
        	// 존재하지 않는다면 새로 만들어야함
        	if(!targetSettlement.isPresent()) {
        		
        		Settlement settlement = Settlement.builder()
        								.amount((int)target.getTotalAmount())
        								.state(SettlementState.PENDING)
        								.targetUsername(target.getUsername())
        								.feeRate(5)
        								.settlementAmount(
        									    ((int)target.getTotalAmount()) * 95 / 100
        									)
        								.targetType(TargetType.SELLER)
        								.targetUsername(target.getUsername())
        								.settlementMonth(targetDate)
        								.build();
        		
        		settlementRepository.save(settlement);
        	}
        	
        }
		
	}

	// 공구 대여 반납완료시 정산처리
	@Override
	public void rentalSettlementCreate(Integer rentalIdx) throws Exception {

		Rental rental = rentalRepository.findById(rentalIdx)
		        .orElseThrow(() -> new Exception("정산 렌탈 아이디 조회 오류"));
		
		Settlement settlement = settlementRepository.findById(rental.getSettlementIdx()).orElseThrow(() -> new Exception("정산 데이터 조회 오류"));

		Payment payment = paymentRepository.findByOrderId(rental.getRentalCode());

		// 결제 총액(BigDecimal)
		BigDecimal totalAmount = BigDecimal.valueOf(payment.getTotalAmount());

		// 배송비 제외 금액
		BigDecimal amountExcludingPost = totalAmount.subtract(BigDecimal.valueOf(rental.getPostCharge()));

		// 수수료 적용 전 금액(int)
		int settlementBeforeFee = amountExcludingPost.setScale(0, RoundingMode.HALF_UP).intValue();

		// 수수료 5% 적용
		BigDecimal settlementAfterFeeBD = amountExcludingPost.multiply(BigDecimal.valueOf(0.95));

		// 수수료 적용 후 금액(int)
		int settlementAfterFee = settlementAfterFeeBD.setScale(0, RoundingMode.HALF_UP).intValue();

		// 현재 날짜 만들기
		LocalDate today = LocalDate.now();
		Date sqlDate = Date.valueOf(today);

		settlement.setAmount(settlementBeforeFee);
		settlement.setComment("rentalIdx(" + rental.getRentalIdx() + ")정산");
		settlement.setFeeRate(5);
		settlement.setSettlementAmount(settlementAfterFee);
		settlement.setCreatedAt(sqlDate);
		settlement.setCompletedAt(sqlDate);
		settlement.setState(SettlementState.COMPLETED);
		settlement.setSettlementMonth(sqlDate);
		
		settlementRepository.save(settlement);
		
		
	}

}
