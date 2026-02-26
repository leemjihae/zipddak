package com.zipddak.admin.service;

import java.sql.Date;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.zipddak.admin.dto.AdminSettlementListDto;
import com.zipddak.admin.dto.AdminUserListDto;
import com.zipddak.admin.dto.MonthlyStatDto;
import com.zipddak.admin.dto.RequestExpertInfoDto;
import com.zipddak.admin.dto.RequestSellerInfoDto;
import com.zipddak.admin.dto.ResponseAdminListDto;
import com.zipddak.admin.repository.AdminDashBoardDslRepository;
import com.zipddak.admin.repository.AdminDslRepository;
import com.zipddak.entity.Expert;
import com.zipddak.entity.Payment.PaymentType;
import com.zipddak.entity.Seller;
import com.zipddak.entity.Settlement;
import com.zipddak.entity.User;
import com.zipddak.entity.Settlement.SettlementState;
import com.zipddak.entity.User.UserRole;
import com.zipddak.repository.ExpertRepository;
import com.zipddak.repository.SellerRepository;
import com.zipddak.repository.SettlementRepository;
import com.zipddak.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService{
	
	private final AdminDslRepository adminDslRepository;
	private final AdminDashBoardDslRepository dashBoardDsl;
	private final ExpertRepository expertRepository;
	private final SellerRepository sellerRepository;
	private final SettlementRepository settlementRepository;
	private final UserRepository userRepository;
	
	// 회원 목록
	@Override
	public ResponseAdminListDto userList(Integer state, Integer column, String keyword, Integer page)
			throws Exception {

		return adminDslRepository.userList(state, column, keyword, page); 
	}

	// 전문가 목록
	@Override
	public ResponseAdminListDto expertList(Integer major, Integer state, Integer column, String keyword, Integer page)
			throws Exception {

		return adminDslRepository.expertList(major, state, column, keyword, page); 
	}

	// 판매업체 목록
	@Override
	public ResponseAdminListDto sellerList(Integer productCode, Integer state, String keyword, Integer page)
			throws Exception {

		return adminDslRepository.sellerList(productCode, state, keyword, page);
	}

	// 대여 내역
	@Override
	public ResponseAdminListDto rentalList(Integer column, Integer state, String keyword, Integer page, String startDate,
			String endDate) throws Exception {
		
		return adminDslRepository.rentalList(column, state, keyword, page, startDate, endDate);
	}

	// 판매 내역
	@Override
	public ResponseAdminListDto saleList(Integer column, Integer state, String keyword, Integer page, String startDate,
			String endDate) throws Exception {
		
		return adminDslRepository.saleList(column, state, keyword, page, startDate, endDate);
	}

	// 결제 내역
	@Override
	public ResponseAdminListDto paymentList(Integer type, Integer state, String keyword, Integer page)
			throws Exception {
		
		return adminDslRepository.paymentList(type, state, keyword, page);
	}

	// 멤버십 내역
	@Override
	public ResponseAdminListDto membershipList(Integer state, String keyword, Integer page) throws Exception {

		return adminDslRepository.membershipList(state, keyword, page);
	}

	// 전문가 전환 요청 목록
	@Override
	public ResponseAdminListDto requestExpertList(Integer state, Integer column, String keyword, Integer page) throws Exception {
		
		return adminDslRepository.requestExpertList(state, column, keyword, page);
	}

	// 판매업체 입점 신청 목록
	@Override
	public ResponseAdminListDto requestSellerList(Integer state, Integer column, String keyword, Integer page)
			throws Exception {
		
		return adminDslRepository.requestSellerList(state, column, keyword, page);
	}

	// 전문가 상세
	@Override
	public RequestExpertInfoDto requestExpertInfo(Integer expertIdx) throws Exception {

		RequestExpertInfoDto expertInfo = adminDslRepository.expertInfo(expertIdx);
		
		// 서비스 idx가 , 기준으로 나열되어있음
		String serviceString = expertInfo.getServiceString();
		
		List<Integer> serviceIdx = Arrays.stream(serviceString.split(","))
									.map(Integer::parseInt)
									.collect(Collectors.toList());
		
		List<String> service = new ArrayList<>();
		
		for(Integer categoryIdx : serviceIdx) {
			
			service.add(adminDslRepository.expertService(categoryIdx));
			
		}
		
		expertInfo.setService(service);
		
		return expertInfo;
	}

	@Override
	public void switchExpert(Integer expertIdx, Integer expertResult) throws Exception {

		Expert expert = expertRepository.findById(expertIdx).orElseThrow(() -> new Exception("전문가 전환 중 오류"));
		
		// 승인
		if(expertResult == 1) {
			expert.setActivityStatus("ACTIVE");
		}else { // 거부
			expert.setActivityStatus("REJECT");
		}
		
		expertRepository.save(expert);
		
	}

	@Override
	public RequestSellerInfoDto requestSellerInfo(Integer sellerIdx) throws Exception {
		
		RequestSellerInfoDto sellerInfo = adminDslRepository.sellerInfo(sellerIdx);
		
		// 서비스 idx가 , 기준으로 나열되어있음
		String serviceString = sellerInfo.getItemIdxs();
		
		List<Integer> itemIdxs = Arrays.stream(serviceString.split(","))
									.map(Integer::parseInt)
									.collect(Collectors.toList());
		
		List<String> items = new ArrayList<>();
		
		for(Integer categoryIdx : itemIdxs) {
			
			items.add(adminDslRepository.expertService(categoryIdx));
			
		}
		
		sellerInfo.setItems(items);
		
		return sellerInfo;
	}

	@Override
	public void switchSeller(Integer sellerIdx, Integer sellerResult) throws Exception {
		
		Seller seller = sellerRepository.findById(sellerIdx).orElseThrow(() -> new Exception("업체 승인 중 오류"));
		User user = userRepository.findById(seller.getUser().getUsername()).orElseThrow(() -> new Exception("판매업체의 일반 사용자 계정 조회 중 오류"));
		
		// 승인
		if(sellerResult == 1) {
			seller.setActivityStatus("ACTIVE");
			user.setRole(UserRole.APPROVAL_SELLER);
		}else { // 거부
			seller.setActivityStatus("REJECT");
		}
		
		sellerRepository.save(seller);
		
	}

	// 정산 페이지 들어올때 결제 테이블에서 추출한 데이터 리스트 반환
	@Override
	public ResponseAdminListDto settlement(Integer type, String month, Integer state, Integer page) throws Exception {

		return adminDslRepository.settlementList(type, month, state, page);
		
	}

	@Override
	public AdminSettlementListDto settlementDetail(Integer settlementIdx) throws Exception {
		
		return adminDslRepository.settlementDetail(settlementIdx);
	}

	
	@Override
	public void settlementComplate(Integer settlementIdx, String comment) throws Exception {
		
		Settlement settlement = settlementRepository.findById(settlementIdx).orElseThrow(() -> new Exception("정산 데이터 찾다가 오류"));
		
		settlement.setState(SettlementState.COMPLETED);
		
		if(comment != null) {
			settlement.setComment(comment);
		}
		
		
		settlementRepository.save(settlement);
		
	}

	@Override
	public Map<String, Object> dashboard() throws Exception {
		
		YearMonth thisMonth = YearMonth.now(); // 이번달
		
		// 1. 이번달 수수료 수익
		// 1.1 전월 대비 비교 %
		Map<String, Object> commissionMap = dashBoardDsl.commission(thisMonth, null);
		
		
		// 2. 이번달 멤버심 수익
		// 2.1 전월 대비 비교 %
		Map<String, Object> membershipMap = dashBoardDsl.commission(thisMonth, PaymentType.MEMBERSHIP);
		
		// 3. 총 회원수
		// 3.1 활성 사용자수, 전체 %
		Map<String, Object> userCount = dashBoardDsl.userCount();
		
		// 4. 이번달 신규 가입자
		// 4.1 저번달 가입자
		Map<String, Object> JoinCount = dashBoardDsl.userJoin(thisMonth);
		
		// 5. 수익구조
		// 5.1 이번달 수수료, 멤버십 더한거에 
		// 5.2 멤버십, 전문가 매칭 수수료, 판매 수수료 퍼센트
		Map<String, Object> dougnut = dashBoardDsl.dougnut(thisMonth);
		
		
		// 6. 현재 달부터 6개월 전부터 6개의 달에 해당하는 매칭 수수료
		List<MonthlyStatDto> matchingFeeList = dashBoardDsl.line(thisMonth, "matching");
		
		List<MonthlyStatDto> orderFeeList = dashBoardDsl.line(thisMonth, "order");
		
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("commissionMap", commissionMap);
		resultMap.put("membershipMap", membershipMap);
		resultMap.put("userCount", userCount);
		resultMap.put("JoinCount", JoinCount);
		resultMap.put("dougnut", dougnut);
		resultMap.put("matchingFeeList", matchingFeeList);
		resultMap.put("orderFeeList", orderFeeList);
		
		return resultMap;
	}

}

