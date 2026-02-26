package com.zipddak.user.service;

import java.util.Map;

import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zipddak.dto.RentalDto;
import com.zipddak.entity.Rental;
import com.zipddak.entity.Rental.RentalStatus;
import com.zipddak.entity.Settlement;
import com.zipddak.entity.Settlement.SettlementState;
import com.zipddak.entity.Settlement.TargetType;
import com.zipddak.entity.Tool.ToolStatus;
import com.zipddak.entity.Tool;
import com.zipddak.repository.RentalRepository;
import com.zipddak.repository.SettlementRepository;
import com.zipddak.repository.ToolRepository;
import com.zipddak.user.dto.BorrowPaymentDto;
import com.zipddak.user.dto.BorrowRentalDto;
import com.zipddak.user.dto.BorrowSettlementDto;
import com.zipddak.user.dto.BorrowToolDto;
import com.zipddak.user.dto.ResponseBorrowDetailDto;
import com.zipddak.user.dto.ResponseRentalDetailListDto;
import com.zipddak.user.repository.RentalDsl;

@Service
public class RentalServiceImpl implements RentalService {
	
	@Autowired
	private RentalRepository rentalRepository;
	
	@Autowired
	private RentalDsl rentalDsl;
	
	@Autowired
	private ModelMapper modelMapper;
	
	@Autowired
	private SettlementRepository settlementRepository;
	
	@Autowired
	private ToolRepository toolRepository;

	//대여 등록
	@Override
	@Transactional
	public void rentalApplication(RentalDto rentalDto, String orderId) throws Exception {
		
		Rental rental = modelMapper.map(rentalDto, Rental.class);
		rental.setRentalCode(orderId);
		if(rental.getDirectRental()) {
			rental.setSatus(RentalStatus.PAYED);
		}
		rental.setSatus(RentalStatus.PRE);
		
		rentalRepository.save(rental);
		
		Tool tool = toolRepository.findById(rentalDto.getToolIdx()).get();
		
		tool.setSatus(ToolStatus.INABLE);
		
		toolRepository.save(tool);
	}

 
	@Override
	public ResponseRentalDetailListDto rental(String username, Integer rentalCate, String startDate, String endDate,
			Integer state, Integer page) throws Exception {
		
		return rentalDsl.rentalList(username, rentalCate, startDate, endDate, state, page);
	}


	@Override
	public ResponseBorrowDetailDto borrowDetail(String username, Integer rentalIdx) throws Exception {

		// 요청한 사용자가 대여기록에 있는 사용자 인지 확인해서 아니면 null 반환
		
		BorrowToolDto toolDto = rentalDsl.borrowTool(rentalIdx);
		
		BorrowRentalDto rentalDto = rentalDsl.borrowRental(rentalIdx);
		
		BorrowPaymentDto paymentDto = rentalDsl.borrowPayment(rentalIdx);
		
		return new ResponseBorrowDetailDto(toolDto, rentalDto, paymentDto);
	}


	@Override
	public ResponseBorrowDetailDto lentDetail(String username, Integer rentalIdx) throws Exception {

		BorrowToolDto toolDto = rentalDsl.borrowTool(rentalIdx);
		
		BorrowRentalDto rentalDto = rentalDsl.borrowRental(rentalIdx);
		
		BorrowPaymentDto paymentDto = rentalDsl.borrowPayment(rentalIdx);
		
		// 빌려준 공구에는 정산 정보까지 추가해서 가져가야함
		BorrowSettlementDto settlementDto = rentalDsl.borrowSettlement(rentalIdx);
		
		return new ResponseBorrowDetailDto(toolDto, rentalDto, paymentDto, settlementDto);
	}


	// 송장번호 등록 후 배송중으로 변경
	@Override
	public void postCode(Map<String, Object> map) throws Exception {

		Integer rentalIdx = (Integer)map.get("rentalIdx");
		String postComp = (String)map.get("postComp");
		String postCode = (String)map.get("postCode");
		
		Rental rental = rentalRepository.findById(rentalIdx).orElseThrow(() -> new Exception("대여 목록 조회중 에러"));
		
		rental.setPostComp(postComp);
		rental.setTrackingNo(postCode);
		rental.setSatus(RentalStatus.DELIVERY);
		
		rentalRepository.save(rental);
	}


	// 대여중 상태로 변경
	@Override
	public void stateRental(Integer rentalIdx) throws Exception {
		
		Rental rental = rentalRepository.findById(rentalIdx).orElseThrow(() -> new Exception("대여 목록 조회중 에러"));
		
		// 연결시켜줄 정산 데이터 생성 기본값으로
		Settlement settlement = Settlement.builder()
								.state(SettlementState.PENDING)
								.targetType(TargetType.USER)
								.targetUsername(rental.getOwner())
								.build();
		
		Settlement saveSettlement = settlementRepository.save(settlement);
		
		rental.setSatus(RentalStatus.RENTAL);
		rental.setSettlementIdx(saveSettlement.getSettlementIdx());
		
		rentalRepository.save(rental);
		
	}


	// 반납완료 상태로 변경
	@Override
	public void stateReturn(Integer rentalIdx) throws Exception {
		
		Rental rental = rentalRepository.findById(rentalIdx).orElseThrow(() -> new Exception("대여 목록 조회중 에러"));
		
		rental.setSatus(RentalStatus.RETURN);
		rentalRepository.save(rental);
		
	}


	// 리뷰 작성 상태 업데이트
	@Override
	public void reviewWriteState(Integer rentalIdx) throws Exception {

		Rental rental = rentalRepository.findById(rentalIdx).orElseThrow(() -> new Exception("대여 목록 조회중 에러"));
		
		rental.setReviewCheck(true);
		rentalRepository.save(rental);
		
	}



}
