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
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cartIdx;

    @Column(nullable = false)
    private String userUsername;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "productIdx")
    private Product product;

    @Column
    private Integer optionIdx;

    @Column(nullable = false)
    private Integer quantity;

    @CreationTimestamp
    private Date createdAt;
}
