package com.zipddak.dto;

import java.sql.Date;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellerDto {
	private Integer sellerIdx;
	private String sellerUsername; 
    private String password;
    private String username;
    private Integer logoFileIdx; //로고 이미지 idx
    private String compBno;//사업자등록번호
    private Integer compFileIdx;	//사업자등록증 pdf idx
    private Integer onlinesalesFileIdx; //통신판매업신고증 이미지 idx
    private String compName;  //회사이름
    private String compHp;  //회사홈페이지
    private String ceoName;  //대표자명
    private String managerName; //담당자명
    private String managerTel; //담당자 연락처
    private String managerEmail;//담당자 이메일
    private String brandName;//대표브랜드명 (=상호명)
    private String handleItemCateIdx;    //취급 품목 카테고리 idx
    private String introduction;  //소개말
    private String settleBank; //은행 (user
    private String settleAccount;//계좌번호(user
    private String settleHost;//예금주(user
    private String zonecode;	//userTable과 동일하게 컬럼명 수정
    private String addr1;	//userTable과 동일하게 컬럼명 수정
    private String addr2;	//userTable과 동일하게 컬럼명 수정
    private String pickupZonecode;   //픽업지(출고지) 주소 (우편번호)
    private String pickupAddr1;//픽업지(출고지) 주소 (도로명주소)
    private String pickupAddr2;//픽업지(출고지) 주소 (상세주소)
    private Long basicPostCharge; //기본 배송비
    private Long freeChargeAmount; //무료배송 기준 금액 
    private String role;
    private Boolean approvalYn; //승인상태
    private Date createdate;	//userTable과 동일하게 컬럼명 수정
    private Date updatedAt;
    private String activityStatus; // ACTIVE, WAITING, STOPPED, REJECT
    
    //join용 컬럼 
    private String logoFileRename;
}
