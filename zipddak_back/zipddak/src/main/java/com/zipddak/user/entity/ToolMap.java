package com.zipddak.user.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.DynamicInsert;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@DynamicInsert
@Entity
public class ToolMap {

	 @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer mapIdx;
	
	 @Column
	private Double lat;
	    @Column
	private Double lng;
	    @Column
	private String address;
	    
	    @Column
		private Integer toolIdx;

}
