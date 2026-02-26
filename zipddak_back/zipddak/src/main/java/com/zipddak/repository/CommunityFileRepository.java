package com.zipddak.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.CommunityFile;

public interface CommunityFileRepository extends JpaRepository<CommunityFile, Integer>{

	CommunityFile findByFileRename(String imgName);

}
