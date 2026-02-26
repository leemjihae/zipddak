package com.zipddak.user.controller;

import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.auth.PrincipalDetails;
import com.zipddak.entity.User;
import com.zipddak.mypage.service.NotificationServiceImpl;
import com.zipddak.user.dto.UserInfoDto;
import com.zipddak.user.service.FavoriteToolService;
import com.zipddak.user.service.UserService;

@RestController
public class UserController {

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private UserService userService;

	@Autowired
	private FavoriteToolService favoriteToolService;

	@Autowired
	private NotificationServiceImpl notificationService;

	// 로그인
	@PostMapping("/user")
	public ResponseEntity<UserInfoDto> userInfo(@AuthenticationPrincipal PrincipalDetails principalDetails,
			@RequestParam("fcmToken") String fcmToken) {
		try {
			User user = principalDetails.getUser();
			user.setFcmToken(fcmToken);
			UserInfoDto userInfo = userService.login(user);
			userInfo.setExpert(false);
			notificationService.registFcmToken(user.getUsername(), fcmToken);
			System.out.println("=================");
			System.out.println(userInfo);
			return ResponseEntity.ok(userInfo);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 전문가 전환
	@GetMapping("/expertYn")
	public ResponseEntity<UserInfoDto> expertYn(@RequestParam("isExpert") Boolean isExpert,
			@RequestParam("username") String username) {
		try {

			UserInfoDto userInfo = userService.expertYN(isExpert, username);

			return ResponseEntity.ok(userInfo);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(null);
		}
	}

	// 관심 상품 토글
	@PostMapping("user/favoriteToggle/tool")
	public ResponseEntity<Void> favoriteToggle(@RequestBody Map<String, Object> requestMap) {

		String username = (String) requestMap.get("username");
		Integer toolIdx = (Integer) requestMap.get("toolIdx");

		// DB에서 업데이트
		favoriteToolService.toggleFavorite(toolIdx, username);

		return ResponseEntity.ok().build();

	}

	// 공구 하트
	@GetMapping(value = "/main/heartTool")
	ResponseEntity<Boolean> toolIsHeart(@RequestParam("toolIdx") Integer toolIdx,
			@RequestParam("username") String username) {

		System.out.println("favorite view controller" + toolIdx + username);
		try {
			Boolean heart = favoriteToolService.isHeartTool(toolIdx, username);
			return ResponseEntity.ok(heart);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(false);
		}

	}

	// 상품 하트
	@GetMapping(value = "/main/heartProduct")
	ResponseEntity<Boolean> productHeart(@RequestParam("productIdx") Integer productIdx,
			@RequestParam("username") String username) {

		try {
			Boolean heart = favoriteToolService.isHeartProduct(productIdx, username);
			return ResponseEntity.ok(heart);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body(false);
		}

	}

}
