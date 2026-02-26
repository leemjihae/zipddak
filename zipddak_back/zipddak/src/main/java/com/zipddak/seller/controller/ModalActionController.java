package com.zipddak.seller.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.zipddak.seller.dto.CompletedResponseDto;
import com.zipddak.seller.dto.OrderItemActionRequestDto;
import com.zipddak.seller.dto.SaveResultDto;
import com.zipddak.seller.service.ModalActionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ModalActionController {
	
	private final ModalActionService modal_svc;
	
	//운송장 등록
	@PostMapping("/registerTrackingNo")
	public ResponseEntity<?> registerTrackingNo(@RequestBody OrderItemActionRequestDto reqItems) {
		System.out.println("reqItems : "  + reqItems);
		
		SaveResultDto result = modal_svc.registerTrackingNo(reqItems);

		if (!result.isSuccess()) { //운송장 등록 실패한 경우 
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);

	}
	
	//반품 수거완료 처리 
	@PostMapping("/pickupComplated")
    public ResponseEntity<CompletedResponseDto> refundPickupComplated(@RequestBody OrderItemActionRequestDto req) {
		
    	CompletedResponseDto pickupComplated = modal_svc.pickupComplated(req);
		return ResponseEntity.ok(pickupComplated);
    }
	
	//반품 거절 처리 
	@PostMapping("/refundRejectItems")
    public ResponseEntity<?> refundRejectItems(@RequestBody OrderItemActionRequestDto reqItems) {
		System.out.println("reqItems : " + reqItems);
		
    	SaveResultDto result = modal_svc.refundRejectItems(reqItems);

		if (!result.isSuccess()) { //처리 실패한 경우 
			return ResponseEntity.badRequest().body(result);
		}
		return ResponseEntity.ok(result);
    }
	
	
	//반품 접수 수락 처리 
	@PostMapping("/refundAcceptItems")
    public ResponseEntity<?> refundAcceptItems(@RequestBody OrderItemActionRequestDto reqItems) {
		System.out.println("reqItems : " + reqItems);
		
    	SaveResultDto result = modal_svc.refundAcceptItems(reqItems);

		if (!result.isSuccess()) { //처리 실패한 경우 
			return ResponseEntity.badRequest().body(result);
		}
		return ResponseEntity.ok(result);
    }
		
		
		
	//환불처리 
	@PostMapping("/refundItems")
    public ResponseEntity<?> refundItems(@RequestBody OrderItemActionRequestDto reqItems) {
		System.out.println("reqItems : " + reqItems);
        try {
        	SaveResultDto result = modal_svc.refundItems(reqItems.getOrderIdx(),reqItems.getItemIdxs());

			 if (!result.isSuccess()) { //환불처리 실패한 경우 
		            return ResponseEntity.badRequest().body(result);
		        }
		        return ResponseEntity.ok(result);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
    }

}
