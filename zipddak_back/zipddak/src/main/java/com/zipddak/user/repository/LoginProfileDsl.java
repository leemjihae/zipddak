package com.zipddak.user.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.zipddak.entity.QExpert;
import com.zipddak.entity.QExpertFile;
import com.zipddak.entity.QProfileFile;
import com.zipddak.entity.QSeller;
import com.zipddak.entity.QSellerFile;
import com.zipddak.entity.QUser;

@Repository
public class LoginProfileDsl {
	
	@Autowired
	private JPAQueryFactory jpaQueryFactory;
	
	public String profileFileRename (String username, String type, Boolean expertYN) {
		QUser user = QUser.user;
		QSeller seller = QSeller.seller;
		QExpert expert = QExpert.expert;
		QProfileFile profileFile = QProfileFile.profileFile;
		QExpertFile expertFile = QExpertFile.expertFile;
		QSellerFile sellerFile = QSellerFile.sellerFile;
		
		if(type == "USER" || (type == "EXPERT" && Boolean.FALSE.equals(expertYN))) {
			
			return jpaQueryFactory
					.select(profileFile.fileRename)
					.from(profileFile)
					.leftJoin(user)
					.on(user.profileImg.eq(profileFile.profileFileIdx))
					.where(user.username.eq(username))
					.fetchOne();
					
		}else if (type == "EXPERT" && Boolean.TRUE.equals(expertYN)) {
			
			return jpaQueryFactory
					.select(expertFile.fileRename)
					.from(expertFile)
					.leftJoin(expert)
					.on(expert.profileImageIdx.eq(expertFile.expertFileIdx))
					.where(expert.user.username.eq(username))
					.fetchOne();
			
		}else if (type == "APPROVAL_SELLER") {
			
			return jpaQueryFactory
					.select(sellerFile.fileRename)
					.from(sellerFile)
					.leftJoin(seller)
					.on(seller.logoFileIdx.eq(sellerFile.sellerFileIdx))
					.where(seller.user.username.eq(username))
					.fetchOne();
			
		}
			
		return null;
		
	}
	
	
}
