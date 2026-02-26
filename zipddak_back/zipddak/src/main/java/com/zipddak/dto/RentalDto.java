package com.zipddak.dto;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.CreationTimestamp;

import com.zipddak.entity.Tool;
import com.zipddak.entity.Rental.RentalStatus;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RentalDto {
    private Integer rentalIdx;
    private String rentalCode;
    private Date startDate;
    private Date endDate;
    private String request;
    private Boolean directRental;
    private Integer postCharge;
    private Boolean postRental;
    private String zonecode;
    private String addr1;
    private String addr2;
    private String postRequest;
    private Boolean paymentType;
    private RentalStatus satus;
    private String borrower;
    private String owner;
    private Integer paymentIdx;
    private Date createdAt;
    
    //join용컬럼
    private Integer toolIdx;
    private String name;
    private String phone;
    
    private String trackingNo;

}
