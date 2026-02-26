package com.zipddak;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ZipddakApplication {

	public static void main(String[] args) {
		SpringApplication.run(ZipddakApplication.class, args);
	}

}
