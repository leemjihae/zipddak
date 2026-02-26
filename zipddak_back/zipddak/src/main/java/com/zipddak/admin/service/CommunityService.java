package com.zipddak.admin.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.zipddak.admin.dto.CommunityDetailDto;
import com.zipddak.admin.dto.CommunityModifyDetailDto;
import com.zipddak.admin.dto.CommunityPagetDto;

public interface CommunityService {

	Integer write(int category, String title, String content, String username, List<MultipartFile> images) throws Exception;

	CommunityDetailDto communityDetail(int communityId) throws Exception;

	boolean isWrite(int communityId, String username) throws Exception;

	void deleteCommunity(String username, Integer communityId) throws Exception;

	CommunityModifyDetailDto modifyCommunityDetail(Integer modifyCommunityId) throws Exception;

	Integer modify(int category, String title, String content, String username, List<MultipartFile> images, int communityId, List<Integer> existingIds) throws Exception;

	CommunityPagetDto communityList(Integer category, Integer page) throws Exception;

}
