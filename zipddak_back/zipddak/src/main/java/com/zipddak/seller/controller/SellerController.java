package com.zipddak.seller.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.zipddak.seller.dto.SaveResultDto;
import com.zipddak.seller.exception.NotFoundException;

@RestControllerAdvice
public class SellerController {

	@ExceptionHandler(IllegalStateException.class)
	public ResponseEntity<SaveResultDto> handleIllegalState(IllegalStateException ise) {
		return ResponseEntity.badRequest().body(new SaveResultDto(false, null, ise.getMessage()));
	}
	
	
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<?> handle(Exception e) {
	    return ResponseEntity.badRequest().body(e.getMessage());
	}
	
	
	@ExceptionHandler(NotFoundException.class)
	public ResponseEntity<SaveResultDto> handleNotFound(NotFoundException e) {
	    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new SaveResultDto(false, null, e.getMessage()));
	}
	
	

}
