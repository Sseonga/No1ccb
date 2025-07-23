package fs.human.ecospot.location.controller;

import fs.human.ecospot.location.service.AccomService;
import fs.human.ecospot.location.vo.AccomVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accommodation")
@CrossOrigin(origins = "http://localhost:3000")
public class AccomController {
    
    @Autowired
    private AccomService accomService;
    
    /**
     * 숙소 추가 API (관리자용)
     */
    @PostMapping("/add")
    public ResponseEntity<?> addAccommodation(@RequestBody AccomVO accom) {
        try {
            System.out.println("=== 숙소 추가 API 호출 ===");
            System.out.println("숙소명: " + accom.getAccomName());
            System.out.println("주소: " + accom.getAccomAddress());
            System.out.println("전화번호: " + accom.getAccomPhone());
            
            // 관리자 권한 체크는 프론트엔드에서 이미 처리됨
            accom.setCreatedId("admin"); // 실제로는 세션에서 가져와야 함
            
            accomService.addAccommodation(accom);
            
            return ResponseEntity.ok(Map.of("message", "숙소가 성공적으로 추가되었습니다."));
            
        } catch (Exception e) {
            System.err.println("숙소 추가 실패: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "숙소 추가에 실패했습니다."));
        }
    }
    
    /**
     * 모든 숙소 목록 조회 API (사용자용)
     */
    @GetMapping("/list")
    public ResponseEntity<?> getAllAccommodations() {
        try {
            System.out.println("=== 숙소 목록 조회 API 호출 ===");
            
            List<AccomVO> accommodations = accomService.getAllAccommodations();
            
            return ResponseEntity.ok(Map.of(
                "message", "숙소 목록 조회 성공",
                "data", accommodations
            ));
            
        } catch (Exception e) {
            System.err.println("숙소 목록 조회 실패: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "숙소 목록 조회에 실패했습니다."));
        }
    }
    
    /**
     * 숙소 상세 조회 API
     */
    @GetMapping("/{accomId}")
    public ResponseEntity<?> getAccommodationById(@PathVariable Long accomId) {
        try {
            AccomVO accommodation = accomService.getAccommodationById(accomId);
            
            if (accommodation != null) {
                return ResponseEntity.ok(Map.of(
                    "message", "숙소 조회 성공",
                    "data", accommodation
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "숙소를 찾을 수 없습니다."));
            }
            
        } catch (Exception e) {
            System.err.println("숙소 조회 실패: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "숙소 조회에 실패했습니다."));
        }
    }
}
