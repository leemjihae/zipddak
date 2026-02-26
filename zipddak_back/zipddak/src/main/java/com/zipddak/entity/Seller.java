package com.zipddak.entity;

import java.sql.Date;
import javax.persistence.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.UpdateTimestamp;

import com.zipddak.dto.ProductDto;
import com.zipddak.dto.SellerDto;
import com.zipddak.entity.Product.PostType;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@Entity
public class Seller {


	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer sellerIdx;
	
	//username
	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name="username", nullable = false)
    private User user;

	//로고 이미지 idx
    @Column(unique = true)
    private Integer logoFileIdx;

    //사업자등록번호
    @Column(nullable = false, unique = true)
    private String compBno;
    
    //사업자등록증 pdf idx
    @Column(nullable = false)
    private Integer compFileIdx;

    //프로필사진 idx (안쓰는듯...?)
    @Column(unique = true)
    private Integer profileFileIdx;

    //통신판매업신고증 이미지 idx
    @Column(unique = true)
    private Integer onlinesalesFileIdx;

    //회사이름
    @Column(nullable = false)
    private String compName;

    //회사홈페이지
    @Column
    private String compHp;
    
    //대표자명
    @Column
    private String ceoName;

    //담당자명
    @Column(nullable = false)
    private String managerName;

    //담당자 연락처
    @Column(nullable = false, unique = true)
    private String managerTel;

    //담당자 이메일
    @Column(nullable = false, unique = true)
    private String managerEmail;

    //대표브랜드명 (=상호명)
    @Column(nullable = false)
    private String brandName;

    //취급 품목 카테고리 idx
    @Column(nullable = false)
    private String handleItemCateIdx; // 콤마로 구분

    //소개말
    @Column(columnDefinition = "TEXT")
    private String introduction;

    //은행 (user
    @Column
    private String settleBank;

    //계좌번호(user
    @Column(unique = true)
    private String settleAccount;

    //예금주(user
    @Column
    private String settleHost;

    //우편번호 comp_zonecode(user
    @Column
    private String compZonecode;

    //도로명 주소 comp_addr1(user
    @Column
    private String compAddr1;

    //상세주소 comp_addr2(user
    @Column
    private String compAddr2;

    //픽업지(출고지) 주소 (우편번호)
    @Column
    private String pickupZonecode;

    //픽업지(출고지) 주소 (도로명주소)
    @Column
    private String pickupAddr1;

    //픽업지(출고지) 주소 (상세주소)
    @Column
    private String pickupAddr2;

    //기본 배송비
    @Column
    private Long basicPostCharge;

    //무료배송 기준 금액 
    @Column
    private Long freeChargeAmount;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;
    
	@Column
	private String activityStatus; // ACTIVE, WAITING, STOPPED, REJECT
	
	
	
	public void profileUpdateFromDto(SellerDto dto) {
		this.brandName = dto.getBrandName();
        this.compHp = dto.getCompHp();
		this.handleItemCateIdx = dto.getHandleItemCateIdx();
		this.pickupZonecode = dto.getPickupZonecode();
		this.pickupAddr1 = dto.getPickupAddr1();
		this.pickupAddr2 = dto.getPickupAddr2();
		this.basicPostCharge = dto.getBasicPostCharge();
		this.freeChargeAmount = dto.getFreeChargeAmount();
		this.introduction = dto.getIntroduction();
		this.updatedAt = dto.getUpdatedAt();
    }
}