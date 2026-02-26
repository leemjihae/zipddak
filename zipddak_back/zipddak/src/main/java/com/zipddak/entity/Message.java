package com.zipddak.entity;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.ColumnDefault;
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
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer messageIdx;
    
    @Column
    private Integer messageRoomIdx;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private String recvUsername;

    @Column(nullable = false)
    private String sendUsername;

    @Column
    private Boolean sendButton;
    
    @ColumnDefault("false")
	private Boolean confirm;

    @CreationTimestamp
    private Timestamp createdAt;

}
