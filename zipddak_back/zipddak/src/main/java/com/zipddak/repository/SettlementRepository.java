package com.zipddak.repository;

import java.sql.Date;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.Settlement;
import com.zipddak.entity.Settlement.TargetType;

public interface SettlementRepository extends JpaRepository<Settlement, Integer>{

	Optional<Settlement> findByTargetUsernameAndTargetTypeAndSettlementMonth(String username, TargetType userType, Date targetDate);
	
}
