package com.zipddak.entity;

import java.sql.Date;
import javax.persistence.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@Entity
public class Rental {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer rentalIdx;

    @Column(nullable = false, unique = true)
    private String rentalCode;

    @Column(nullable = false)
    private Date startDate;

    @Column(nullable = false)
    private Date endDate;

    @Column
    private String request;

    @Column(nullable = false)
    private Boolean directRental;

    @Column
    private Integer postCharge;

    @Column(nullable = false)
    private Boolean postRental;

    @Column
    private String zonecode;

    @Column
    private String addr1;

    @Column
    private String addr2;

    @Column
    private String postRequest;

    @Column(nullable = false)
    private Boolean paymentType;

    @Enumerated(EnumType.STRING)
    private RentalStatus satus;

    @Column
    private String borrower;

    @Column
    private String owner;

    @Column
    private Integer paymentIdx;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "toolIdx")
    private Tool tool;
    
    @CreationTimestamp
    private Date createdAt;
    
    @Column
    private String name;
    
    @Column
    private String phone;
    
    @Column
    private Integer settlementIdx;
    
    @Column
    private String postComp;
    
    @Column
    private String trackingNo;
    
    @Column(nullable = false)
    private Boolean reviewCheck = false;

    public enum RentalStatus {
        PRE, PAYED, DELIVERY, RENTAL, RETURN
    }
}
