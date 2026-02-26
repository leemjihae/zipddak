package com.zipddak.mypage.service;

import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zipddak.entity.Membership;
import com.zipddak.entity.Payment;
import com.zipddak.entity.Payment.PaymentType;
import com.zipddak.mypage.dto.MembershipListDto;
import com.zipddak.mypage.repository.MembershipDslRepository;
import com.zipddak.repository.MembershipRepository;
import com.zipddak.repository.PaymentRepository;
import com.zipddak.util.PageInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MembershipServiceImpl implements MembershipService {

	private final PaymentRepository paymentRepository;
	private final MembershipRepository membershipRepository;
	private final MembershipDslRepository membershipDslRepository;

	@Value("${toss-payment-secret-key}")
	private String tossSecretKey;

	// 결제 성공 처리
	@Override
	public void membershipSuccess(String paymentKey, String orderId, Integer amount, String username) throws Exception {

		// Toss 결제 승인 api url
		String url = "https://api.tosspayments.com/v1/payments/" + paymentKey;

		// 헤더 설정 -> 시크릿 키
		HttpHeaders headers = new HttpHeaders();
		headers.setBasicAuth(tossSecretKey, "");
		headers.setContentType(MediaType.APPLICATION_JSON);

		// body
		Map<String, Object> body = new HashMap<String, Object>();
		body.put("orderId", orderId);
		body.put("amount", amount);

		HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

		// 결제 승인 요청
		RestTemplate restTemplate = new RestTemplate();
		restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));
		ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

		System.out.println(response);

		// response에 가져온 데이터를 꺼내야함
		ObjectMapper objectMapper = new ObjectMapper();
		JsonNode jsonNode = objectMapper.readTree(response.getBody());

		// 만약에 결제가 성공 된다면 추가할 데이터

		if (response.getStatusCode() == HttpStatus.OK) {

			OffsetDateTime requestedAtOdt = OffsetDateTime.parse(jsonNode.path("requestedAt").asText());
			OffsetDateTime approvedAtOdt = OffsetDateTime.parse(jsonNode.path("approvedAt").asText());

			// Timestamp로 변환
			Timestamp requestedAt = Timestamp.from(requestedAtOdt.toInstant());
			Timestamp approvedAt = Timestamp.from(approvedAtOdt.toInstant());

			// 결제 데이터 (결제 테이블)
			Payment payment = Payment.builder().paymentKey(jsonNode.path("paymentKey").asText())
					.type(jsonNode.path("type").asText()).orderId(jsonNode.path("orderId").asText())
					.orderName(jsonNode.path("orderName").asText()).mId(jsonNode.path("mId").asText())
					.method(jsonNode.path("method").asText()).totalAmount(jsonNode.path("totalAmount").asInt())
					.balanceAmount(jsonNode.path("balanceAmount").asInt()).status(jsonNode.path("status").asText())
					.requestedAt(requestedAt).approvedAt(approvedAt)
					.lastTransactionKey(jsonNode.path("lastTransactionKey").asText())
					.isPartialCancelable(jsonNode.path("isPartialCancelable").asBoolean())
					.receiptUrl(jsonNode.path("receipt").path("url").asText())
					.cardAmount(jsonNode.path("card").path("amount").asInt())
					.cardIssuerCode(jsonNode.path("card").path("issuerCode").asText())
					.cardAcquirerCode(jsonNode.path("card").path("acquirerCode").asText())
					.cardNumber(jsonNode.path("card").path("number").asText())
					.cardInstallmentPlanMonths(jsonNode.path("card").path("installmentPlanMonths").asInt())
					.easypayProvider(jsonNode.path("easyPay").path("provider").asText())
					.easypayAmount(jsonNode.path("easyPay").path("amount").asInt())
					.username(username).paymentType(PaymentType.MEMBERSHIP).build();

			Payment savedPayment = paymentRepository.save(payment);

			LocalDate start = LocalDate.now();
			LocalDate end = start.plusDays(30);

			java.sql.Date startDate = java.sql.Date.valueOf(start);
			java.sql.Date endDate = java.sql.Date.valueOf(end);


			// 멤버십 테이블 생성
			Membership membership = Membership.builder().username(username).paymentIdx(savedPayment.getPaymentIdx())
					.startDate(startDate).endDate(endDate).build();
			
			membershipRepository.save(membership);

		}

	}

	// 멤버십 목록 조회
	@Override
	public MembershipListDto getMembershipList(String username, PageInfo pageInfo) throws Exception {
		PageRequest pageRequest = PageRequest.of(pageInfo.getCurPage() - 1, 10);

		MembershipListDto membershipListDto = membershipDslRepository.selectMembershipList(username, pageRequest);

		// 페이지 수 계산
		Long cnt = membershipDslRepository.selectPaymentCount(username);

		Integer allPage = (int) (Math.ceil(cnt.doubleValue() / pageRequest.getPageSize()));
		Integer startPage = (pageInfo.getCurPage() - 1) / 10 * 10 + 1;
		Integer endPage = Math.min(startPage + 10 - 1, allPage);

		pageInfo.setAllPage(allPage);
		pageInfo.setStartPage(startPage);
		pageInfo.setEndPage(endPage);
		
		return membershipListDto;
	}

}
