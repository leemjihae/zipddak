package com.zipddak.repository;



import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.zipddak.entity.Rental;

public interface RentalRepository extends JpaRepository<Rental, Integer> {

	Rental findByRentalCode(String rentalIdx);
	
	 @Modifying
	    @Query("update Rental r set "
	    		+ "r.satus = 'RENTAL' "
	         + "where r.satus = 'PAYED' "
	         + "and r.startDate <= :today")
	    int updateStatusToRental(@Param("today") Date today);

	    @Modifying
	    @Query("update Rental r set "
	    		+ "r.satus = 'RETURN' "
	         + "where r.satus = 'RENTAL' "
	         + "and r.endDate < :today")
	    int updateStatusToReturn(@Param("today") Date today);

}
