package com.zipddak.user.service;

import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zipddak.dto.ToolDto;
import com.zipddak.entity.Tool;
import com.zipddak.entity.Tool.ToolStatus;
import com.zipddak.entity.ToolFile;
import com.zipddak.repository.ToolFileRepository;
import com.zipddak.repository.ToolRepository;
import com.zipddak.user.dto.ToolCardDto;
import com.zipddak.user.dto.ToolCardsDto;
import com.zipddak.user.dto.ToolCardsMoreDto;
import com.zipddak.user.dto.ToolDetailviewDto;
import com.zipddak.user.repository.ToolCardDsl;

@Service
public class ToolServiceImpl implements ToolService {

	@Autowired
	private ToolCardDsl toolCardDsl;

	@Autowired
	private ToolRepository toolRepository;

	@Autowired
	private ToolFileRepository toolFileRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Value("${toolFile.path}")
	private String toolfileUpload;

	// 공구 메인
	@Override
	public ToolCardsMoreDto toolCardsToolMain(String categoryNo, String keyword, String username, Integer wayNo,
			Integer orderNo, Boolean rentalState, Integer offset, Integer size) throws Exception {
		ToolCardsDto toolCards = toolCardDsl.toolsToolMain(categoryNo, keyword, username, wayNo, orderNo, rentalState,
				offset, size);

		boolean hasNext = (offset + 1) * size < toolCards.getTotalCount();

		return new ToolCardsMoreDto(toolCards.getCards(), toolCards.getTotalCount(), hasNext);
	}

	// 공구 사진 저장
	public Integer saveToolFile(MultipartFile file) throws Exception {

		String originName = file.getOriginalFilename();
		String rename = UUID.randomUUID() + "_" + originName;

		File saveFile = new File(toolfileUpload, rename);
		file.transferTo(saveFile);

		ToolFile toolFile = new ToolFile();
		toolFile.setFileName(originName);
		toolFile.setFileRename(rename);
		toolFile.setStoragePath(toolfileUpload);

		ToolFile saved = toolFileRepository.save(toolFile);
		System.out.println("1saved : " + saved);
		return saved.getToolFileIdx();
	}

	// 공구 등록
	@Override
	@Transactional
	public Integer ToolRegist(ToolDto toolDto, MultipartFile thumbnail, List<MultipartFile> imgs) throws Exception {

		// 썸네일 저장
		Integer thumbnailIdx = null;
		if (thumbnail != null && !thumbnail.isEmpty()) {
			thumbnailIdx = saveToolFile(thumbnail);
		}
		System.out.println("썸네일 저장 : " + thumbnailIdx);
		// 상세 이미지 저장
		Integer[] imgIdx = new Integer[5];

		if (imgs != null) {
			for (int i = 0; i < imgs.size() && i < 5; i++) {
				MultipartFile img = imgs.get(i);
				if (img == null || img.isEmpty())
					continue;

				imgIdx[i] = saveToolFile(img);
			}
		}

		// Tool 생성
		Tool tool = modelMapper.map(toolDto, Tool.class);

		tool.setThunbnail(thumbnailIdx);
		tool.setImg1(imgIdx[0]);
		tool.setImg2(imgIdx[1]);
		tool.setImg3(imgIdx[2]);
		tool.setImg4(imgIdx[3]);
		tool.setImg5(imgIdx[4]);
		
		System.out.println(tool);

		Tool savedTool = toolRepository.save(tool);
		toolRepository.flush();

		return savedTool.getToolIdx();

	}

	// 새 이미지 채우기
	private void setToolImgIdx(Tool tool, int index, Integer idx) {
		switch (index) {
		case 0:
			tool.setImg1(idx);
			break;
		case 1:
			tool.setImg2(idx);
			break;
		case 2:
			tool.setImg3(idx);
			break;
		case 3:
			tool.setImg4(idx);
			break;
		case 4:
			tool.setImg5(idx);
			break;
		}
	}
	

	// 공구 수정
	@Override
	public void ToolModify(ToolDto toolDto, MultipartFile thumbnail, List<MultipartFile> imgs, List<Integer> imageIndexes) throws Exception {

		//기존 tool
		 Tool tool = toolRepository.findById(toolDto.getToolIdx())
		            .orElseThrow(() -> new RuntimeException("Tool not found"));

		    //tool 덮어쓰기
		    modelMapper.map(toolDto, tool);

		    // 썸네일 교체
		    if (thumbnail != null && !thumbnail.isEmpty()) {
		        Integer thumbnailIdx = saveToolFile(thumbnail);
		        tool.setThunbnail(thumbnailIdx);
		    }

		    // 상세 이미지 교체 (지정된 슬롯만)
		    if (imgs != null && imageIndexes != null) {

		        for (int i = 0; i < imgs.size(); i++) {

		            MultipartFile img = imgs.get(i);
		            Integer slotIdx = imageIndexes.get(i); // ⭐ 핵심

		            if (img == null || img.isEmpty()) continue;

		            Integer newImgIdx = saveToolFile(img);

		            // 슬롯 번호에 맞게 덮어쓰기
		            setToolImgIdx(tool, slotIdx, newImgIdx);
		        }
		    }

		    toolRepository.save(tool);

	}

	//내공구 목록
	@Override
	public ToolCardsMoreDto myTools(String username, Integer toolStatusNo, Integer size, Integer offset)
			throws Exception {
		ToolCardsDto toolCards = toolCardDsl.myTools(username, toolStatusNo, size, offset);

		boolean hasNext = (offset + 1) * size < toolCards.getTotalCount();

		return new ToolCardsMoreDto(toolCards.getCards(), toolCards.getTotalCount(), hasNext);
	}
	
	
	//공구 상태변경
	@Override
	public ToolStatus stopTool(String username, Integer toolIdx) throws Exception {
		System.out.println(toolIdx);
		Tool tool = toolRepository.findById(toolIdx).orElseThrow(()-> new Exception("toolIdx error"));
		
		
		if (!tool.getOwner().equals(username)) {
	        throw new Exception("권한 없음");
	    }
		
		
		if(tool.getSatus() == ToolStatus.ABLE) {
			tool.setSatus(ToolStatus.STOP);
			toolRepository.save(tool);
		
		}else if(tool.getSatus() == ToolStatus.STOP){
			tool.setSatus(ToolStatus.ABLE);
			toolRepository.save(tool);
		}
		
		return tool.getSatus();
	}

	
	//공구 삭제
	@Override
	public ToolStatus delteTool(String username, Integer toolIdx) throws Exception {
		
		Tool tool = toolRepository.findById(toolIdx).orElseThrow(()-> new Exception("toolIdx error"));
		
		
		if (!tool.getOwner().equals(username)) {
	        throw new Exception("권한 없음");
	    }
			
	    tool.setSatus(ToolStatus.DELETE);
	    toolRepository.save(tool);
		
		
		return tool.getSatus();
	}

	
	//공구 상세 
	@Override
	public ToolDetailviewDto targetTool(Integer toolIdx, String username) throws Exception {
		ToolDetailviewDto toolDto = toolCardDsl.toolDetails(toolIdx, username);
		System.out.println(toolDto);
		return toolDto;
	}
	

	//유저의 다른 공구
	@Override
	public ToolCardsDto ownersTool(String username, String owner, Integer toolIdx) throws Exception {
		
		System.out.println("또 왜");
		ToolCardsDto toolDto = toolCardDsl.toolOwner(username, owner, toolIdx);
		
		return toolDto;
	}

	//공구 리뷰
	@Override
	public Map<String,Object> toolsReview(Integer toolIdx, Integer page, Integer orderNo) throws Exception {
		
		int pageSize = 5; // 한 페이지에 5개
        PageRequest pageRequest = PageRequest.of(page-1, pageSize);
		
		Map<String,Object> toolReview = toolCardDsl.toolReview(toolIdx, pageRequest, orderNo);
		
		return toolReview;
	}

	//공구 선택
	@Override
	public ToolDto toolSelect(Integer toolIdx) throws Exception {
		Tool tool = toolRepository.findById(toolIdx).orElseThrow(()-> new Exception("toolIdx error"));
		ToolDto toolDto = modelMapper.map(tool, ToolDto.class);
		return toolDto;
	}

	
	//공구 좋아요 수
	@Override
	public Long toolFavoriteCount(Integer toolIdx) throws Exception {
		
		return toolCardDsl.toolFavoriteCount(toolIdx);
	}
	
	//공구 렌탈 수 
	@Override
	public Long toolRentalCount(Integer toolIdx) throws Exception {

		return toolCardDsl.toolRentalCount(toolIdx);
	}
	
	//공구 주소기반 리스트
	@Override
	public List<ToolCardDto> toolList(String keyword, String username) throws Exception {
		
		return toolCardDsl.toolMap(keyword, username);
	}

	//반납시 공구 대여가능으로 변경
	@Override
	public void stateReturn(Integer toolIdx) throws Exception {

		Tool tool = toolRepository.findById(toolIdx).get();
		
		tool.setSatus(ToolStatus.ABLE);
		
		toolRepository.save(tool);
		
	}

	//대여시 공구 대여중으로 변경
	@Override
	public void makeInableTool(Integer toolIdx) throws Exception {
		
		Tool tool = toolRepository.findById(toolIdx).get();
		
		tool.setSatus(ToolStatus.INABLE);
		
		toolRepository.save(tool);
		
	}


	//공구 신고
//	@Override
//	public void reportTool(String username, String reason, Integer toolId) throws Exception {
//		
//		String reasonString = null;
//		
//		switch(reason) {
//		case "COMMENT_REPORT_ABUSE" : reasonString = "욕설 / 비하"; break;
//		case "COMMENT_REPORT_AD" : reasonString = "광고 / 홍보"; break;
//		case "COMMENT_REPORT_ILLEGAL" : reasonString = "음란 / 불법 콘텐츠"; break;
//		case "COMMENT_REPORT_POLITICAL" : reasonString = "정치적 / 사회적 논쟁 유도"; break;
//		case "COMMENT_REPORT_PRIVACY" : reasonString = "개인정보 유출"; break;
//		default : reasonString = "기타 부적절한 내용";
//		}
//		
//		ReportTool reportCommunity = ReportCommunity.builder()
//											.communityIdx(communityId)
//											.userUsername(username)
//											.reason(reasonString)
//											.state(ReportState.RECEIVED)
//											.build();
//		
//		reportCommunityRepository.save(reportCommunity);
//		
//	}

	

	
	

}
