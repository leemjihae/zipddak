package com.zipddak.util;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.zipddak.entity.ToolFile;
import com.zipddak.repository.ToolFileRepository;

@Service
public class ProfileService {
	
	@Value("${profileFile.path}")
	private String profileUpload;
	
	public File ProfiledownloadImage(String imageUrl) throws Exception {
		

	    URL url = new URL(imageUrl);
	    InputStream in = new BufferedInputStream(url.openStream());

	    String fileName = UUID.randomUUID() + ".png";
	    File socialProfile = new File(profileUpload, fileName);

	    try (OutputStream out = new FileOutputStream(socialProfile)) {
	        byte[] buf = new byte[1024];
	        int n;
	        while ((n = in.read(buf)) != -1) {
	            out.write(buf, 0, n);
	        }
	    }

	    return socialProfile;
	}
	

}
