package com.zipddak.admin.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.admin.dto.ExpertCardDto;
import com.zipddak.admin.dto.ExpertCareerDto;
import com.zipddak.admin.dto.ExpertPortfolioDto;
import com.zipddak.admin.dto.ExpertProfileDto;
import com.zipddak.admin.dto.ExpertReviewDto;
import com.zipddak.admin.dto.ResponseExpertProfileDto;
import com.zipddak.admin.dto.ResponseReviewListAndHasnext;
import com.zipddak.admin.service.CategoryService;
import com.zipddak.admin.service.ExpertCareerService;
import com.zipddak.admin.service.ExpertFindService;
import com.zipddak.admin.service.ExpertReportService;
import com.zipddak.admin.service.ExpertReviewService;
import com.zipddak.admin.service.FavoriteExpertService;
import com.zipddak.admin.service.PortfolioService;
import com.zipddak.dto.CategoryDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class ExpertFindController {

	private final ExpertFindService expertFindService;
	private final CategoryService categoryService;
	private final ExpertCareerService expertCareerService;
	private final PortfolioService portFolioService;
	private final ExpertReviewService expertReviewService;
	private final ExpertReportService expertReportService;
	private final FavoriteExpertService favoriteExpertService;
	
	@GetMapping("experts")
	public ResponseEntity<List<ExpertCardDto>> experts(
				@RequestParam("page") Integer page,
				@RequestParam("cateNo") Integer cateNo,
				@RequestParam(value = "keyword", required = false) String keyword,
				@RequestParam("sort") String sort
			) {
		
		
		try {
			List<ExpertCardDto> experts = expertFindService.experts(page, cateNo, keyword, sort);
			
//			ExpertsMainListsDto expertListDto = new ExpertsMainListsDto(addExperts, experts);
			
			return ResponseEntity.ok(experts);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	@GetMapping("addExperts")
	public ResponseEntity<List<ExpertCardDto>> addExperts(
				@RequestParam("cateNo") Integer cateNo
			) {
		
		try {
			
			// 광고 전문가
			List<ExpertCardDto> addExperts = expertFindService.addExperts(cateNo);
			
			return ResponseEntity.ok(addExperts);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	@GetMapping("expertProfile")
	public ResponseEntity<ResponseExpertProfileDto> expertInfo(@RequestParam("expertIdx") Integer expertIdx,
																@RequestParam("username") String username){
		
		try {
			ExpertProfileDto expertProfile = expertFindService.expertProfile(expertIdx);
			
			// 이거는 제공 서비스가 존재 할때
			String providedServiceIdxs = expertProfile.getProvidedServiceIdx();
			List<CategoryDto> categoryList = categoryService.providedService(providedServiceIdxs);
			
			// 커리어
			ExpertCareerDto careerDto = expertCareerService.expertCareer(expertIdx);
			
			// 포트폴리오
			List<ExpertPortfolioDto> portFolioDtoList = portFolioService.expertPortfolio(expertIdx);
			
			ExpertReviewDto expertReviewDto = expertReviewService.expertReviews(expertIdx);
			
			Boolean favorite = favoriteExpertService.expertFavoriteUser(expertIdx, username);
			
			ResponseExpertProfileDto response = new ResponseExpertProfileDto(expertProfile, 
																		categoryList,
																		careerDto,
																		portFolioDtoList,
																		expertReviewDto,
																		favorite);
			
			return ResponseEntity.ok(response);
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	@GetMapping("expertProfile/moreReview")
	public ResponseEntity<ResponseReviewListAndHasnext> reviewMore(@RequestParam("page") Integer page,
																@RequestParam("expertIdx") Integer expertIdx){
		
		try {
			
			ResponseReviewListAndHasnext reviewList = expertReviewService.reviewMore(page, expertIdx);
			
			return ResponseEntity.ok(reviewList);
			
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	@PostMapping("user/reportExpert")
	public ResponseEntity<Boolean> reportExpert (@RequestBody Map<String, Object> map){
		
		try {
			
			String username = (String)map.get("username");
			String reason = (String)map.get("reason");
			Integer expertIdx = Integer.parseInt((String)map.get("expertIdx"));
			
			expertReportService.reportExpert(username, expertIdx, reason);
			
			return ResponseEntity.ok(true);
			
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	@PostMapping("user/favoriteExpert")
	public ResponseEntity<Boolean> favoriteToggle (@RequestBody Map<String, Object> map){
		
		try {
			
			String username = (String)map.get("username");
			Integer expertIdx = Integer.parseInt((String)map.get("expertIdx"));
			
			favoriteExpertService.favoriteToggle(username, expertIdx);
			
			return ResponseEntity.ok(true);
			
		}catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
		
	}
	
	// 전문가 프로필에서 메인 서비스 등록이 안되어있을때
	@GetMapping("expert/mainServiceCheck")
	public ResponseEntity<Boolean> mainServiceCheck(@RequestParam(required = false) String username) {

	    try {
	        boolean check = expertFindService.mainServiceCheck(username);

	        return ResponseEntity.ok(check);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.badRequest().body(null);
	    }
	}

	// 전문가 질문답변 수정
	@PostMapping("expert/modifyQuestion")
	public ResponseEntity<Boolean> modifyQuestion(@RequestBody Map<String, Object> map) {

	    try {
	    	
	    	String username = (String)map.get("username");
	    	List<String> questions = (List<String>)map.get("questionAnswers");
	    	
	    	expertFindService.modifyQuestion(username, questions);

	        return ResponseEntity.ok(true);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.badRequest().body(null);
	    }
	}
	
}
