package com.zipddak.entity;

import java.sql.Date;
import javax.persistence.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import lombok.*;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@Entity
public class Tool {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer toolIdx;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer category;

    @Column(nullable = false)
    private Long rentalPrice;

    @Column
    private Boolean freeRental;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column
    private String tradeAddr1;
    
    @Column
    private String tradeAddr2;
    
    @Column
    private String tradeZonecode;
    
    @Column
    private Boolean quickRental;

    @Column(nullable = false)
    private Boolean directRental;

    @Column(nullable = false)
    private Boolean postRental;

    @Column
    private Boolean freePost;

    @Column
    private Long postCharge;

    @Column
    private String zonecode;

    @Column
    private String addr1;

    @Column
    private String addr2;

    @Column
    private String postRequest;

    @Enumerated(EnumType.STRING)
    private ToolStatus satus;

    @Column
    private String owner;

    @CreationTimestamp
    private Date createdate;

    @Column
    private Integer thunbnail;

    @Column
    private Integer img1;

    @Column
    private Integer img2;

    @Column
    private Integer img3;

    @Column
    private Integer img4;

    @Column
    private Integer img5;
    
    @Column
    private Integer toolChatCnt;
    
    @Column
    private String settleBank;
    @Column
    private String settleAccount;
    @Column
    private String settleHost;

    public enum ToolStatus {
        ABLE, INABLE, DELETE, STOP
    }
    
    
    
}
