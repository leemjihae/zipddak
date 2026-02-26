package com.zipddak.admin.service;


import java.io.File;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zipddak.admin.dto.CommunityDetailDto;
import com.zipddak.admin.dto.CommunityModifyDetailDto;
import com.zipddak.admin.dto.CommunityPagetDto;
import com.zipddak.admin.repository.CommunityDslRepository;
import com.zipddak.entity.Community;
import com.zipddak.entity.CommunityFile;
import com.zipddak.entity.User;
import com.zipddak.repository.CommunityFileRepository;
import com.zipddak.repository.CommunityRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityServiceImpl implements CommunityService{
	
	@Value("${communityFile.path}")
	private String filePath;
	
	private final CommunityDslRepository communityDslRepository;
	
	private final CommunityRepository communityRepository;
	private final CommunityFileRepository communitFileRepository;
	
	@Override
	public Integer write(int category, String title, String content, String username, List<MultipartFile> images)
			throws Exception {
		
		List<Integer> savedFileIdxs = new ArrayList<>();
		
		if (images != null && !images.isEmpty()) {
			
			for(MultipartFile file : images) {
				
				String originalFilename = file.getOriginalFilename();
				String extension = "";
	            if (originalFilename != null && originalFilename.contains(".")) {
	                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
	            }

	            String storedFileName = UUID.randomUUID().toString() + extension;
	            File dest = new File(filePath + File.separator + storedFileName);

	            // 폴더 없으면 생성
	            if (!dest.getParentFile().exists()) {
	                dest.getParentFile().mkdirs(); // 상위 폴더가 없으면 생성
	            }
	            file.transferTo(dest);
	            
	            
	            CommunityFile communityfile = CommunityFile.builder()
	            								.fileName(originalFilename)
	            								.fileRename(storedFileName)
	            								.storagePath(filePath)
	            								.build();
	            
	            CommunityFile saveFile = communitFileRepository.save(communityfile);
	            
	            savedFileIdxs.add(saveFile.getCommunityFileIdx());
				
			}
			
		}		
		
		
		Community community = Community.builder()
								.category(category)
								.title(title)
								.content(content)
								.user(User.builder()
										.username(username)
										.build())
								.img1(savedFileIdxs.size() > 0 ? savedFileIdxs.get(0) : null)
					            .img2(savedFileIdxs.size() > 1 ? savedFileIdxs.get(1) : null)
					            .img3(savedFileIdxs.size() > 2 ? savedFileIdxs.get(2) : null)
					            .img4(savedFileIdxs.size() > 3 ? savedFileIdxs.get(3) : null)
					            .img5(savedFileIdxs.size() > 4 ? savedFileIdxs.get(4) : null)
								.build();
										
		Community saveCommunity = communityRepository.save(community);
								
		return saveCommunity.getCommunityIdx();
		
	}
	
	@Override
	public Integer modify(int category, String title, String content, String username, 
	                      List<MultipartFile> images, int communityId, List<Integer> existingIds) 
	        throws Exception {

	    CommunityModifyDetailDto imgDto = communityDslRepository.modifyCommunityDetail(communityId);
	    String storagePath = imgDto.getImgStoragePath();

	    // 기존 이미지 정보
	    Map<Integer, String> beforeImages = new LinkedHashMap<>();
	    beforeImages.put(imgDto.getImg1id(), imgDto.getImg1());
	    beforeImages.put(imgDto.getImg2id(), imgDto.getImg2());
	    beforeImages.put(imgDto.getImg3id(), imgDto.getImg3());
	    beforeImages.put(imgDto.getImg4id(), imgDto.getImg4());
	    beforeImages.put(imgDto.getImg5id(), imgDto.getImg5());

	    // 삭제할 이미지 처리 (기존 이미지 중 프론트에서 선택 안한 것)
	    for (Map.Entry<Integer, String> entry : beforeImages.entrySet()) {
	        Integer id = entry.getKey();
	        String fileName = entry.getValue();
	        if (fileName != null && (existingIds == null || !existingIds.contains(id))) {
	            File file = new File(storagePath + "/" + fileName);
	            if (file.exists()) file.delete();

	            CommunityFile commFile = communitFileRepository.findByFileRename(fileName);
	            if (commFile != null) communitFileRepository.delete(commFile);
	        }
	    }

	    // 새 이미지 저장
	    List<Integer> savedFileIdxs = new ArrayList<>();
	    if (images != null && !images.isEmpty()) {
	        for (MultipartFile file : images) {
	            String originalFilename = file.getOriginalFilename();
	            String extension = "";
	            if (originalFilename != null && originalFilename.contains(".")) {
	                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
	            }

	            String storedFileName = UUID.randomUUID().toString() + extension;
	            File dest = new File(storagePath + "/" + storedFileName);
	            if (!dest.getParentFile().exists()) dest.getParentFile().mkdirs();
	            file.transferTo(dest);

	            CommunityFile communityfile = CommunityFile.builder()
	                    .fileName(originalFilename)
	                    .fileRename(storedFileName)
	                    .storagePath(storagePath)
	                    .build();

	            CommunityFile saveFile = communitFileRepository.save(communityfile);
	            savedFileIdxs.add(saveFile.getCommunityFileIdx());
	        }
	    }

	    // 최종 community 엔티티에 기존 유지 이미지 + 새 이미지 매핑
	    Community community = communityRepository.findByCommunityIdx(communityId)
	            .orElseThrow(() -> new Exception("게시글 수정중 오류"));

	    community.setCategory(category);
	    community.setTitle(title);
	    community.setContent(content);

	    // 기존 유지 이미지 ID 먼저 넣기
	    List<Integer> finalImageIds = new ArrayList<>();
	    if (existingIds != null) finalImageIds.addAll(existingIds);
	    // 새 이미지 추가
	    finalImageIds.addAll(savedFileIdxs);

	    // community 엔티티 img1~img5에 세팅
	    community.setImg1(finalImageIds.size() > 0 ? finalImageIds.get(0) : null);
	    community.setImg2(finalImageIds.size() > 1 ? finalImageIds.get(1) : null);
	    community.setImg3(finalImageIds.size() > 2 ? finalImageIds.get(2) : null);
	    community.setImg4(finalImageIds.size() > 3 ? finalImageIds.get(3) : null);
	    community.setImg5(finalImageIds.size() > 4 ? finalImageIds.get(4) : null);

	    Community saveCommunity = communityRepository.save(community);
	    return saveCommunity.getCommunityIdx();
	}


	@Override
	public CommunityDetailDto communityDetail(int communityId) throws Exception {
	
		return communityDslRepository.communityDetail(communityId);
	}

	@Override
	public boolean isWrite(int communityId, String username) throws Exception {
		
		Community community = communityRepository.findByCommunityIdx(communityId).orElseThrow(() -> new Exception("게시글 조회 오류"));
		
		return community.getUser().getUsername().equals(username) ? true : false;
	}

	@Override
	public void deleteCommunity(String username, Integer communityId) throws Exception {

		Community community = communityRepository.findByCommunityIdx(communityId).orElseThrow(() -> new Exception("게시글 삭제중 오류"));
		
		if(community.getUser().getUsername().equals(username)) {
			communityRepository.delete(community);
		}else {
			throw new Exception("작성자와 로그인 한사람이 일치하지 않음");
		}
		
	}

	@Override
	public CommunityModifyDetailDto modifyCommunityDetail(Integer modifyCommunityId) throws Exception {
		
		return communityDslRepository.modifyCommunityDetail(modifyCommunityId);
	}

	@Override
	public CommunityPagetDto communityList(Integer category, Integer page) throws Exception {
		
		return communityDslRepository.communityList(category, page);
	}



}
