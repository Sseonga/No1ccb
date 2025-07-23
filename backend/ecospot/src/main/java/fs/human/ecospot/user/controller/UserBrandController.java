package fs.human.ecospot.user.controller;

import fs.human.ecospot.user.service.UserBrandService;
import fs.human.ecospot.user.vo.UserBrandVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 사용자 브랜드 선호도 관리 컨트롤러
 */
@RestController
@RequestMapping("/api/brands")
@CrossOrigin(
    origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, 
    allowCredentials = "false",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
public class UserBrandController {

    @Autowired
    private UserBrandService userBrandService;

    /**
     * 디버깅용 단순 쿼리 테스트
     */
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testSimpleQuery() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("=== 단순 쿼리 테스트 시작 ===");
            
            // 임시로 직접 하드코딩된 데이터 반환
            List<Map<String, Object>> brands = new ArrayList<>();
            
            for (int i = 1; i <= 10; i++) {
                Map<String, Object> brand = new HashMap<>();
                brand.put("brand_id", "TEST_" + String.format("%03d", i));
                brand.put("brand_name", "테스트 운영사 " + i);
                brands.add(brand);
            }
            
            response.put("success", true);
            response.put("brands", brands);
            response.put("message", "테스트 데이터 반환");
            
            System.out.println("테스트 데이터 생성 완료: " + brands.size() + "개");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("테스트 쿼리 실패: " + e.getMessage());
            e.printStackTrace();
            
            response.put("success", false);
            response.put("message", "테스트 실패: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 사용자의 모든 브랜드 선호도 조회
     * @param email 사용자 이메일
     * @return 브랜드 선호도 목록
     */
    @GetMapping("/{email}")
    public ResponseEntity<Map<String, Object>> getUserBrands(@PathVariable String email) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("=== 사용자 브랜드 조회 시작: " + email + " ===");
            
            List<UserBrandVO> brands = userBrandService.getUserBrands(email);
            response.put("success", true);
            response.put("brands", brands);
            response.put("message", "브랜드 선호도 조회 성공");
            
            System.out.println("조회된 브랜드 수: " + (brands != null ? brands.size() : 0));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("=== 사용자 브랜드 조회 실패 ===");
            System.err.println("에러 메시지: " + e.getMessage());
            e.printStackTrace();
            
            // 에러 시 빈 목록 반환 (페이지 크래시 방지)
            response.put("success", true);
            response.put("brands", new ArrayList<>());
            response.put("message", "브랜드 선호도 조회 실패, 빈 목록 반환");
            
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 사용자의 활성화된 브랜드 선호도 조회
     * @param email 사용자 이메일
     * @return 활성화된 브랜드 선호도 목록
     */
    @GetMapping("/{email}/active")
    public ResponseEntity<Map<String, Object>> getActiveUserBrands(@PathVariable String email) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("=== 활성화된 사용자 브랜드 조회 시작: " + email + " ===");
            
            List<UserBrandVO> brands = userBrandService.getActiveUserBrands(email);
            response.put("success", true);
            response.put("brands", brands);
            response.put("message", "활성화된 브랜드 선호도 조회 성공");
            
            System.out.println("조회된 활성화 브랜드 수: " + (brands != null ? brands.size() : 0));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("=== 활성화된 브랜드 선호도 조회 실패 ===");
            System.err.println("에러 메시지: " + e.getMessage());
            e.printStackTrace();
            
            // 에러 시 빈 목록 반환
            response.put("success", true);
            response.put("brands", new ArrayList<>());
            response.put("message", "활성화된 브랜드 선호도 조회 실패, 빈 목록 반환");
            
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 브랜드 선호도 토글 (활성화/비활성화)
     * @param email 사용자 이메일
     * @param requestData 브랜드ID와 활성화 상태
     * @return 처리 결과
     */
    @PostMapping("/{email}/toggle")
    public ResponseEntity<Map<String, Object>> toggleBrandPreference(
            @PathVariable String email,
            @RequestBody Map<String, Object> requestData) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("=== 브랜드 선호도 토글 시작: " + email + " ===");
            System.out.println("요청 데이터: " + requestData);
            
            String brandId = (String) requestData.get("brandId");
            Boolean isActive = (Boolean) requestData.get("isActive");
            
            if (brandId == null || isActive == null) {
                response.put("success", false);
                response.put("message", "브랜드ID와 활성화 상태는 필수입니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            boolean success = userBrandService.toggleBrandPreference(email, brandId, isActive);
            
            if (success) {
                response.put("success", true);
                response.put("message", "브랜드 선호도가 성공적으로 업데이트되었습니다.");
                System.out.println("브랜드 토글 성공: " + brandId + " -> " + isActive);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "브랜드 선호도 업데이트에 실패했습니다.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
            
        } catch (Exception e) {
            System.err.println("=== 브랜드 선호도 토글 실패 ===");
            System.err.println("에러 메시지: " + e.getMessage());
            e.printStackTrace();
            
            response.put("success", false);
            response.put("message", "브랜드 선호도 토글 실패: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 브랜드 선호도 일괄 업데이트
     * @param email 사용자 이메일
     * @param requestData 선택된 브랜드 ID 목록
     * @return 처리 결과
     */
    @PostMapping("/{email}/batch-update")
    public ResponseEntity<Map<String, Object>> updateUserBrandPreferences(
            @PathVariable String email,
            @RequestBody Map<String, Object> requestData) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("=== 브랜드 선호도 일괄 업데이트 시작: " + email + " ===");
            
            @SuppressWarnings("unchecked")
            List<String> selectedBrandIds = (List<String>) requestData.get("selectedBrandIds");
            
            boolean success = userBrandService.updateUserBrandPreferences(email, selectedBrandIds);
            
            if (success) {
                response.put("success", true);
                response.put("message", "브랜드 선호도가 성공적으로 업데이트되었습니다.");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "브랜드 선호도 업데이트에 실패했습니다.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
            
        } catch (Exception e) {
            System.err.println("=== 브랜드 선호도 일괄 업데이트 실패 ===");
            System.err.println("에러 메시지: " + e.getMessage());
            e.printStackTrace();
            
            response.put("success", false);
            response.put("message", "브랜드 선호도 일괄 업데이트 실패: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 브랜드 선호도 삭제
     * @param email 사용자 이메일
     * @param brandId 브랜드ID
     * @return 처리 결과
     */
    @DeleteMapping("/{email}/{brandId}")
    public ResponseEntity<Map<String, Object>> deleteBrandPreference(
            @PathVariable String email,
            @PathVariable String brandId) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("=== 브랜드 선호도 삭제 시작: " + email + ", " + brandId + " ===");
            
            boolean success = userBrandService.deleteBrandPreference(email, brandId);
            
            if (success) {
                response.put("success", true);
                response.put("message", "브랜드 선호도가 성공적으로 삭제되었습니다.");
                System.out.println("브랜드 삭제 성공: " + brandId);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "브랜드 선호도 삭제에 실패했습니다.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
            
        } catch (Exception e) {
            System.err.println("=== 브랜드 선호도 삭제 실패 ===");
            System.err.println("에러 메시지: " + e.getMessage());
            e.printStackTrace();
            
            response.put("success", false);
            response.put("message", "브랜드 선호도 삭제 실패: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 사용자의 모든 브랜드 선호도 삭제
     * @param email 사용자 이메일
     * @return 처리 결과
     */
    @DeleteMapping("/{email}")
    public ResponseEntity<Map<String, Object>> deleteAllUserBrands(@PathVariable String email) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("=== 모든 브랜드 선호도 삭제 시작: " + email + " ===");
            
            boolean success = userBrandService.deleteAllUserBrands(email);
            
            if (success) {
                response.put("success", true);
                response.put("message", "모든 브랜드 선호도가 성공적으로 삭제되었습니다.");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "모든 브랜드 선호도 삭제에 실패했습니다.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
            
        } catch (Exception e) {
            System.err.println("=== 모든 브랜드 선호도 삭제 실패 ===");
            System.err.println("에러 메시지: " + e.getMessage());
            e.printStackTrace();
            
            response.put("success", false);
            response.put("message", "모든 브랜드 선호도 삭제 실패: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 브랜드별 선호도 통계 조회 (관리자용)
     * @return 브랜드별 사용자 수 통계
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getBrandPreferenceStats() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("=== 브랜드 선호도 통계 조회 시작 ===");
            
            List<Map<String, Object>> stats = userBrandService.getBrandPreferenceStats();
            response.put("success", true);
            response.put("stats", stats);
            response.put("message", "브랜드 선호도 통계 조회 성공");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("=== 브랜드 선호도 통계 조회 실패 ===");
            System.err.println("에러 메시지: " + e.getMessage());
            e.printStackTrace();
            
            response.put("success", false);
            response.put("message", "브랜드 선호도 통계 조회 실패: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 전체 브랜드 목록 조회
     * @return 브랜드 목록
     */
    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllBrands() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("=== 전체 브랜드 목록 조회 시작 ===");
            
            // DB 조회 시도
            List<Map<String, Object>> brands = userBrandService.getAllBrands();
            
            if (brands != null && !brands.isEmpty()) {
                response.put("success", true);
                response.put("brands", brands);
                response.put("message", "브랜드 목록 조회 성공 (DB)");
                System.out.println("DB에서 브랜드 조회 성공: " + brands.size() + "개");
                return ResponseEntity.ok(response);
            } else {
                System.out.println("DB에서 브랜드가 조회되지 않음, 임시 데이터 사용");
                
                // DB에 데이터가 없으면 임시 데이터 반환
                List<Map<String, Object>> tempBrands = new ArrayList<>();
                
                Map<String, Object> brand1 = new HashMap<>();
                brand1.put("brand_id", "KEPCO");
                brand1.put("brand_name", "한국전력공사");
                tempBrands.add(brand1);
                
                Map<String, Object> brand2 = new HashMap<>();
                brand2.put("brand_id", "ENV");
                brand2.put("brand_name", "환경부");
                tempBrands.add(brand2);
                
                Map<String, Object> brand3 = new HashMap<>();
                brand3.put("brand_id", "SK");
                brand3.put("brand_name", "SK네트웍스");
                tempBrands.add(brand3);
                
                Map<String, Object> brand4 = new HashMap<>();
                brand4.put("brand_id", "GS");
                brand4.put("brand_name", "GS칼텍스");
                tempBrands.add(brand4);
                
                Map<String, Object> brand5 = new HashMap<>();
                brand5.put("brand_id", "SOIL");
                brand5.put("brand_name", "S-Oil");
                tempBrands.add(brand5);
                
                response.put("success", true);
                response.put("brands", tempBrands);
                response.put("message", "브랜드 목록 조회 성공 (임시 데이터)");
                System.out.println("임시 데이터로 브랜드 반환: " + tempBrands.size() + "개");
                
                return ResponseEntity.ok(response);
            }
            
        } catch (Exception e) {
            System.err.println("=== 브랜드 목록 조회 실패 ===");
            System.err.println("에러 메시지: " + e.getMessage());
            e.printStackTrace();
            
            // 에러 발생 시에도 임시 데이터 반환
            List<Map<String, Object>> tempBrands = new ArrayList<>();
            
            Map<String, Object> brand1 = new HashMap<>();
            brand1.put("brand_id", "KEPCO");
            brand1.put("brand_name", "한국전력공사");
            tempBrands.add(brand1);
            
            Map<String, Object> brand2 = new HashMap<>();
            brand2.put("brand_id", "ENV");
            brand2.put("brand_name", "환경부");
            tempBrands.add(brand2);
            
            response.put("success", true);
            response.put("brands", tempBrands);
            response.put("message", "브랜드 목록 조회 성공 (에러 시 임시 데이터)");
            
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 디버깅용 DB 직접 테스트 (안전한 쿼리)
     */
    @GetMapping("/db-test")
    public ResponseEntity<Map<String, Object>> testDirectDB() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("=== DB 직접 테스트 시작 ===");
            
            // 매우 안전한 단순 쿼리 시도
            List<Map<String, Object>> result = userBrandService.getAllBrands();
            
            response.put("success", true);
            response.put("data", result);
            response.put("count", result != null ? result.size() : 0);
            response.put("message", "DB 직접 조회 성공");
            
            System.out.println("DB 직접 조회 결과: " + (result != null ? result.size() : 0) + "개");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("=== DB 직접 테스트 실패 ===");
            System.err.println("에러 클래스: " + e.getClass().getSimpleName());
            System.err.println("에러 메시지: " + e.getMessage());
            e.printStackTrace();
            
            response.put("success", false);
            response.put("error", e.getMessage());
            response.put("errorClass", e.getClass().getSimpleName());
            response.put("message", "DB 직접 조회 실패");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}