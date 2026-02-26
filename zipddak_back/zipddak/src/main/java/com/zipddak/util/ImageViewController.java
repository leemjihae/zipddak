package com.zipddak.util;

import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Files;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ImageViewController {

	@Value("${expertFile.path}")
	private String expertPath;

	@Value("${profileFile.path}")
	private String profilePath;

	@Value("${sellerFile.path}")
	private String sellerPath;

	@Value("${productFile.path}")
	private String productPath;

	@Value("${toolFile.path}")
	private String toolPath;

	@Value("${reviewFile.path}")
	private String reviewPath;

	@Value("${communityFile.path}")
	private String communityPath;

	@Value("${claimFile.path}")
	private String claimPath;

	@Value("${inquireFile.path}")
	private String inquiryPath;

	@GetMapping("imageView")
	public void imageView(@RequestParam("type") String type, @RequestParam("filename") String fileName,
			HttpServletResponse response) {
		
		try {
			// 1. 타입별 디렉토리 매핑
			String basePath = null;
			

			switch (type.toLowerCase()) {
			case "expert":
				basePath = expertPath;
				break;
			case "profile":
				basePath = profilePath;
				break;
			case "seller":
				basePath = sellerPath;
				break;
			case "product":
				basePath = productPath;
				break;
			case "tool":
				basePath = toolPath;
				break;
			case "review":
				basePath = reviewPath;
				break;
			case "community":
				basePath = communityPath;
				break;
			case "claim":
				basePath = claimPath;
				break;
			case "inquiry":
				basePath = inquiryPath;
				break;
			case "user":
				basePath = profilePath;
				break;
			case "approval_seller":
				basePath = sellerPath;
				break;
			default:
				throw new IllegalArgumentException("Invalid type");
			}
			

			// 2. 파일 객체 생성
			File file = new File(basePath, fileName);
			
			//파일이 없는경우
			if (!file.exists()) {
				return;
			}

			// 3. Stream 출력
			FileInputStream fis = new FileInputStream(file);
			FileCopyUtils.copy(fis, response.getOutputStream());
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
