package com.zipddak.config.pdf;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class PdfConfig implements WebMvcConfigurer{

	@Value("${expertFile.path}")
	private String expertFilePath;
	
	@Value("${sellerFile.path}")
	private String sellerFilePath;
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {

	    registry.addResourceHandler("/pdf/expert/**")
	            .addResourceLocations("file:///" + expertFilePath + "/");
	    
	    registry.addResourceHandler("/pdf/seller/**")
        		.addResourceLocations("file:///" + sellerFilePath + "/");
	}

	
}
