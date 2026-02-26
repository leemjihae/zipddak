package com.zipddak.user.service;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zipddak.dto.CategoryDto;
import com.zipddak.dto.UserDto;
import com.zipddak.entity.Category;
import com.zipddak.entity.Expert;
import com.zipddak.entity.ExpertFile;
import com.zipddak.entity.Seller;
import com.zipddak.entity.SellerFile;
import com.zipddak.entity.User;
import com.zipddak.entity.User.UserRole;
import com.zipddak.entity.User.UserState;
import com.zipddak.repository.CategoryRepository;
import com.zipddak.repository.ExpertFileRepository;
import com.zipddak.repository.SellerFileRepository;
import com.zipddak.repository.ExpertRepository;
import com.zipddak.repository.SellerRepository;
import com.zipddak.repository.UserRepository;
import com.zipddak.user.dto.ExpertInsertDto;
import com.zipddak.user.dto.SellerInsertDto;

@Service
public class SignUpServiceImpl implements SignUpService {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private ExpertRepository signExpertRepository;
	
	@Autowired
	private CategoryRepository categoryRepository;
	
	@Autowired
	private SellerRepository signSellerRepository;
	
	@Autowired
	private ModelMapper modelMapper;
	
	@Value("${profileFile.path}")
	private String profileUpload;
	
	@Value("${expertFile.path}")
	private String expertUpload;
	@Autowired
	private ExpertFileRepository expertFileRepository;
	
	@Value("${sellerFile.path}")
	private String sellerUpload;
	@Autowired
	private SellerFileRepository sellerFileRepository;

	@Override
	public void joinUser(UserDto userDto) throws Exception {
		//닉네임이 없을시 이름으로 대체
		if(userDto.getNickname() == null || userDto.getNickname().trim().isEmpty()) {
			userDto.setNickname(userDto.getName());
		}
		userDto.setState(UserState.ACTIVE);
		User user = modelMapper.map(userDto, User.class);
		userRepository.save(user);
	}

	@Override
	public Boolean checkDoubleId(String username) throws Exception {
		return userRepository.findById(username).isPresent();
	}

	@Override
	public Map<Integer, List<CategoryDto>> showExpertCategory(List<Integer> parentIdxList) throws Exception {
		
		Map<Integer, List<CategoryDto>> categoryList = new HashMap<>();
		
		
		for (Integer parentIdx : parentIdxList) {
			List<Category> list = categoryRepository.findByParentIdx(parentIdx);
			for(Category subCategory : list) {
				List<CategoryDto> subList = categoryRepository.findByParentIdx(subCategory.getCategoryIdx())
						.stream()
						.map(c -> modelMapper.map(c, CategoryDto.class))
						.collect(Collectors.toList());
	        
				categoryList.put(subCategory.getCategoryIdx(), subList);
			}
		}
		return categoryList;
	}

	@Override
	@Transactional
	public void joinExpert(ExpertInsertDto expertDto, MultipartFile file) throws Exception {
		
		Integer expertFileIdx = null;

	    //파일이 있을 경우 ExpertFile에 먼저 저장
	    if (file != null && !file.isEmpty()) {

	    	try {
	    	
	        String originName = file.getOriginalFilename();
	        String rename = UUID.randomUUID() + "_" + originName;

	        File saveFile = new File(expertUpload, rename);
	        file.transferTo(saveFile);

	        ExpertFile expertFile = new ExpertFile();
	        expertFile.setFileName(originName);
	        expertFile.setFileRename(rename);
	        expertFile.setStoragePath(expertUpload);

	        ExpertFile savedFile = expertFileRepository.save(expertFile);
	        expertFileIdx = savedFile.getExpertFileIdx(); 
	        System.out.println(savedFile);
	        System.out.println(">>>>전문가파일"+expertFileIdx);
	        
	    	}catch (Exception e) {
	    		e.printStackTrace();
			}
	        
	     //Expert 등록
	        String username = expertDto.getUsername();
	        System.out.println(username);
	        
	        User user = userRepository.findById(username).orElseThrow(()-> new Exception("username error"));
	        user.setRole(UserRole.EXPERT);
	        user.setExpert(true);
	        
	        Expert expert = expertDto.toEntity();
	        expert.setBusinessLicensePdfId(expertFileIdx);
	        expert.setUser(user);
	        //관리자가 승인...
	        expert.setActivityStatus("WAITING");
	        
	        signExpertRepository.save(expert);
	    }
		
	}

	@Override
	public void joinSeller(SellerInsertDto sellerDto, MultipartFile file, MultipartFile imgFile) throws Exception {
		
		Integer sellerFileIdx = null;
		Integer SellerImgFileIdx = null;

	    //SellerFile에 파일 저장
	    if (file != null && !file.isEmpty()) {
	    	
	    	try {

	        String originName = file.getOriginalFilename();
	        String rename = UUID.randomUUID() + "_" + originName;

	        File saveFile = new File(sellerUpload, rename);
	        file.transferTo(saveFile);

	        SellerFile sellerFile = new SellerFile();
	        sellerFile.setFileName(originName);
	        sellerFile.setFileRename(rename);
	        sellerFile.setStoragePath(sellerUpload);

	        SellerFile savedFile = sellerFileRepository.save(sellerFile);
	        sellerFileIdx = savedFile.getSellerFileIdx(); 
	        System.out.println(savedFile);
	        System.out.println(">>>>셀러파일"+sellerFileIdx);
	        
	    	}catch (Exception e) {
	    		e.printStackTrace();
	    	}
	    }
	        
	      //SellerFile에 이미지파일 저장
	    if (imgFile != null && !imgFile.isEmpty()) {
	    	
	    	try {
	    		
	        String originName = imgFile.getOriginalFilename();
	        String rename = UUID.randomUUID() + "_" + originName;

	        File saveImgFile = new File(sellerUpload, rename);
	        imgFile.transferTo(saveImgFile);

	        SellerFile sellerImgFile = new SellerFile();
	        sellerImgFile.setFileName(originName);
	        sellerImgFile.setFileRename(rename);
	        sellerImgFile.setStoragePath(sellerUpload);

	        SellerFile savedImgFile = sellerFileRepository.save(sellerImgFile);
	        SellerImgFileIdx = savedImgFile.getSellerFileIdx(); 
	        System.out.println(savedImgFile);
	        System.out.println(">>>>셀러파일"+SellerImgFileIdx);
	        
	    	}catch (Exception e) {
	    		e.printStackTrace();
	    	}
	    }
	     
		    //User테이블 등록
	        User user = sellerDto.toUserEntity();
	        user.setNickname(sellerDto.getBrandName());
	        user.setRole(UserRole.SELLER);
	        user.setState(UserState.ACTIVE);
	        userRepository.save(user);
	        
	        //Seller테이블 등록
	        Seller seller = sellerDto.toSellerEntity(user);
	        seller.setOnlinesalesFileIdx(SellerImgFileIdx);
	        seller.setCompFileIdx(sellerFileIdx);
	        seller.setActivityStatus("WAITING");
	        signSellerRepository.save(seller);
		
	}

	

}
