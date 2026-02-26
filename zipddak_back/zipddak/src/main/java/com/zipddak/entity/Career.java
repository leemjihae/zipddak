package com.zipddak.entity;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import com.zipddak.dto.CareerDto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@Entity
public class Career {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer careerIdx;

    @Column(nullable = false)
    private Integer expertIdx;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Date startDate;

    @Column(nullable = false)
    private Date endDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    private Date createdAt;
    
    @Column(nullable = false)
    private Integer months;
    
    public CareerDto toDto() {
    	return CareerDto.builder()
    			.careerIdx(careerIdx)
    			.expertIdx(expertIdx)
    			.title(title)
    			.startDate(startDate)
    			.endDate(endDate)
    			.description(description)
    			.months(months)
    			.createdAt(createdAt)
    			.build();
    			
    }
    
}
