package com.zipddak.repository;

import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.zipddak.entity.Tool;

public interface ToolRepository extends JpaRepository<Tool, Integer> {
	
	@Modifying
	@Query("update Tool t set t.satus = 'INABLE' "
	     + "where t.toolIdx in ("
	     + " select r.tool.toolIdx from Rental r "
	     + " where r.satus = 'RENTAL' and r.startDate <= :today)"
	)
	int updateToolsToInable(@Param("today") Date today);

	@Modifying
	@Query("update Tool t set t.satus = 'ABLE' "
	     + "where t.toolIdx in ("
	     + " select r.tool.toolIdx from Rental r "
	     + " where r.satus = 'RENTAL' and r.endDate < :today)"
	)
	int updateToolsToAble(@Param("today") Date today);


}
