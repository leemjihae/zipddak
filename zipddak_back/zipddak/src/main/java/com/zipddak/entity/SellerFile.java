package com.zipddak.entity;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@Entity
public class SellerFile {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer sellerFileIdx;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false, unique = true)
    private String fileRename;

    @Column(nullable = false)
    private String storagePath;

    @CreationTimestamp
    private Date createdAt;

}
