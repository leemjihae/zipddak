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
public class Settlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer settlementIdx;

    @Column(nullable = false)
    private String targetUsername;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TargetType targetType;
    
    @Column
    private Integer workIdx;

    @Column
    private String workType;

    @Column
    private Integer amount;
    
    @Column
    private Integer settlementAmount;
    
    @Column
    private Integer feeRate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SettlementState state;

    @Column
    private Date completedAt;

    @CreationTimestamp
    private Date createdAt;
    
    @Column
    private Date settlementMonth; // 예: "2025-09"
    
    @Column
    private String comment;

    public enum TargetType {
        EXPERT, SELLER, USER
    }

    public enum SettlementState {
        PENDING, COMPLETED
    }
}
