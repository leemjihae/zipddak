package com.zipddak.user.dto;

import java.sql.Date;

import com.google.auto.value.AutoValue.Builder;
import com.zipddak.entity.Seller;
import com.zipddak.entity.User;
import com.zipddak.entity.User.UserRole;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellerInsertDto {
	
	private String username;
    private String password;
    private String name;
    private String phone;
    private String compBno;
    private Integer compFileIdx;
    private Integer onlinesalesFileIdx;
    private String compName;
    private String compHp;
    private String ceoName;
    private String managerName;
    private String managerTel;
    private String managerEmail;
    private String brandName;
    private String handleItemCateIdx;
    private String introduction;
    private String settleBank;
    private String settleAccount;
    private String settleHost;
    private String zonecode;	//userTable과 동일하게 컬럼명 수정
    private String addr1;	//userTable과 동일하게 컬럼명 수정
    private String addr2;	//userTable과 동일하게 컬럼명 수정
    private String role;
    private Boolean approvalYn;
    private Date createdate;	//userTable과 동일하게 컬럼명 수정
    

    public User toUserEntity() {
        return User.builder()
            .username(username)
            .password(password)
            .name(name)
            .phone(phone)
            .zonecode(zonecode)
            .addr1(addr1)
            .addr2(addr2)
            .settleBank(settleBank)
            .settleAccount(settleAccount)
            .settleHost(settleHost)
            .createdate(createdate)
            .role(UserRole.APPROVAL_SELLER)
            .build();
    }
    
    
    public Seller toSellerEntity(User user) {
        return Seller.builder()
            .user(user) 
            .compBno(compBno)
            .compFileIdx(compFileIdx)
            .compHp(compHp)
            .compName(compName)
            .ceoName(ceoName)
            .brandName(brandName)
            .onlinesalesFileIdx(onlinesalesFileIdx)
            .managerName(managerName)
            .managerTel(managerTel)
            .managerEmail(managerEmail)
            .handleItemCateIdx(handleItemCateIdx)
            .introduction(introduction)
            .build();
    }

}
