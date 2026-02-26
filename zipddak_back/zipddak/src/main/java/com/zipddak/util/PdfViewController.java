package com.zipddak.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pdf")
public class PdfViewController {

	@Value("${expertFile.path}")
	private String expertFilePath;
	
    @GetMapping("/{fileName}")
    @CrossOrigin(origins = "http://localhost:5173") // React 개발 서버 허용
    public ResponseEntity<Resource> getPdf(@PathVariable String fileName) throws IOException {
    	
    	System.out.println("접근접근접근접근접근접근접근접근접근접근접근접근접근접근접근접근접근접근접근접근접근접근접근");
    	
        Path filePath = Paths.get(expertFilePath).resolve(fileName);
        if (!Files.exists(filePath)) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new UrlResource(filePath.toUri());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
                .header("X-Frame-Options", "SAMEORIGIN")
                .body(resource);
    }
}
