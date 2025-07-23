package fs.human.ecospot.user.controller;

import fs.human.ecospot.user.service.UserStationService;
import fs.human.ecospot.user.vo.UserStationVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 사용자 충전소 즐겨찾기 API 컨트롤러
 */
@RestController
@RequestMapping("/api/user/stations")
@CrossOrigin(origins = "http://localhost:3000")
public class UserStationController {

    @Autowired
    private UserStationService userStationService;

    /**
     * 사용자의 즐겨찾기 충전소 목록 조회
     * GET /api/user/stations?email=user@example.com
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getUserStations(@RequestParam String email) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<UserStationVO> stations = userStationService.getUserStations(email);
            
            response.put("success", true);
            response.put("message", "즐겨찾기 충전소 목록 조회 성공");
            response.put("data", stations);
            response.put("count", stations.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "즐겨찾기 충전소 목록 조회 실패: " + e.getMessage());
            response.put("data", null);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 사용자의 활성화된 즐겨찾기 충전소 목록 조회
     * GET /api/user/stations/active?email=user@example.com
     */
    @GetMapping("/active")
    public ResponseEntity<Map<String, Object>> getActiveUserStations(@RequestParam String email) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<UserStationVO> stations = userStationService.getActiveUserStations(email);
            
            response.put("success", true);
            response.put("message", "활성화된 즐겨찾기 충전소 목록 조회 성공");
            response.put("data", stations);
            response.put("count", stations.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "활성화된 즐겨찾기 충전소 목록 조회 실패: " + e.getMessage());
            response.put("data", null);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 즐겨찾기 충전소 추가
     * POST /api/user/stations
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> addUserStation(@RequestBody UserStationVO userStation) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 필수 필드 검증
            if (userStation.getEmail() == null || userStation.getEmail().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "사용자 이메일이 필요합니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (userStation.getStationId() == null || userStation.getStationId().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "충전소 ID가 필요합니다.");
                return ResponseEntity.badRequest().body(response);
            }

            boolean result = userStationService.addUserStation(userStation);
            
            if (result) {
                response.put("success", true);
                response.put("message", "즐겨찾기 충전소 추가 성공");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "즐겨찾기 충전소 추가 실패");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "즐겨찾기 충전소 추가 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 즐겨찾기 충전소 활성화/비활성화 토글
     * PUT /api/user/stations/toggle
     */
    @PutMapping("/toggle")
    public ResponseEntity<Map<String, Object>> toggleStationActive(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.get("email");
            String stationId = request.get("stationId");
            
            if (email == null || email.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "사용자 이메일이 필요합니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (stationId == null || stationId.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "충전소 ID가 필요합니다.");
                return ResponseEntity.badRequest().body(response);
            }

            boolean result = userStationService.toggleStationActive(email, stationId);
            
            if (result) {
                response.put("success", true);
                response.put("message", "충전소 활성화 상태 변경 성공");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "충전소 활성화 상태 변경 실패");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "충전소 활성화 상태 변경 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 즐겨찾기 충전소 삭제
     * DELETE /api/user/stations
     */
    @DeleteMapping
    public ResponseEntity<Map<String, Object>> removeUserStation(@RequestParam String email, @RequestParam String stationId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (email == null || email.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "사용자 이메일이 필요합니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (stationId == null || stationId.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "충전소 ID가 필요합니다.");
                return ResponseEntity.badRequest().body(response);
            }

            boolean result = userStationService.removeUserStation(email, stationId);
            
            if (result) {
                response.put("success", true);
                response.put("message", "즐겨찾기 충전소 삭제 성공");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "즐겨찾기 충전소 삭제 실패");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "즐겨찾기 충전소 삭제 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 특정 충전소가 이미 즐겨찾기에 등록되어 있는지 확인
     * GET /api/user/stations/check?email=user@example.com&stationId=STATION123
     */
    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkStationFavorite(@RequestParam String email, @RequestParam String stationId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (email == null || email.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "사용자 이메일이 필요합니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (stationId == null || stationId.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "충전소 ID가 필요합니다.");
                return ResponseEntity.badRequest().body(response);
            }

            boolean isFavorite = userStationService.isStationFavorite(email, stationId);
            
            response.put("success", true);
            response.put("message", "즐겨찾기 여부 확인 성공");
            response.put("isFavorite", isFavorite);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "즐겨찾기 여부 확인 실패: " + e.getMessage());
            response.put("isFavorite", false);
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
