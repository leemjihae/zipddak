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
public class FavoritesTool {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer favoriteIdx;

    @Column(nullable = false)
    private String userUsername;

    @Column(nullable = false)
    private Integer toolIdx;

    @CreationTimestamp
    private Date createdAt;
}
