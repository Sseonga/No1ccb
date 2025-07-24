package fs.human.ecospot.user.service;

import fs.human.ecospot.user.dao.UserBrandDAO;
import fs.human.ecospot.user.vo.UserBrandVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 사용자 브랜드 선호도 관리 서비스 (TB_USER_OPERATOR용)
 */
@Service
@Transactional
public class UserBrandService {

    @Autowired
    private UserBrandDAO userBrandDAO;

    /**
     * 사용자의 모든 브랜드 선호도 조회
     * @param email 사용자 이메일
     * @return 브랜드 선호도 목록
     */
    public List<UserBrandVO> getUserBrands(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("사용자 이메일은 필수입니다.");
        }
        
        System.out.println("Service: getUserBrands 호출 - " + email);
        List<UserBrandVO> result = userBrandDAO.selectUserBrands(email);
        System.out.println("Service: 조회된 브랜드 수 - " + (result != null ? result.size() : 0));
        
        return result;
    }

    /**
     * 사용자의 활성화된 브랜드 선호도 조회
     * TB_USER_OPERATOR에서는 레코드 존재 = 활성화 상태
     * @param email 사용자 이메일
     * @return 활성화된 브랜드 선호도 목록
     */
    public List<UserBrandVO> getActiveUserBrands(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("사용자 이메일은 필수입니다.");
        }
        
        System.out.println("Service: getActiveUserBrands 호출 - " + email);
        List<UserBrandVO> result = userBrandDAO.selectActiveUserBrands(email);
        System.out.println("Service: 조회된 활성화 브랜드 수 - " + (result != null ? result.size() : 0));
        
        return result;
    }

    /**
     * 브랜드 선호도 토글 (TB_USER_OPERATOR용)
     * 활성화 = 레코드 삽입, 비활성화 = 레코드 삭제
     * @param email 사용자 이메일
     * @param brandId 브랜드ID
     * @param isActive 활성화 여부
     * @return 성공 여부
     */
    public boolean toggleBrandPreference(String email, String brandId, boolean isActive) {
        try {
            if (email == null || email.trim().isEmpty()) {
                throw new IllegalArgumentException("사용자 이메일은 필수입니다.");
            }
            if (brandId == null || brandId.trim().isEmpty()) {
                throw new IllegalArgumentException("브랜드ID는 필수입니다.");
            }

            System.out.println("Service: toggleBrandPreference 호출 - " + email + ", " + brandId + ", " + isActive);

            Map<String, Object> params = new HashMap<>();
            params.put("email", email);
            params.put("brandId", brandId);

            // 기존 레코드 존재 여부 확인
            int exists = userBrandDAO.existsUserBrand(params);
            System.out.println("기존 레코드 존재 여부: " + exists);

            if (isActive) {
                // 활성화 = 레코드 삽입 (없는 경우에만)
                if (exists == 0) {
                    UserBrandVO userBrand = new UserBrandVO();
                    userBrand.setEmail(email);
                    userBrand.setBrandId(brandId);
                    userBrand.setIsActive("Y"); // 호환성을 위해 설정
                    
                    int insertResult = userBrandDAO.insertUserBrand(userBrand);
                    System.out.println("브랜드 추가 결과: " + insertResult);
                } else {
                    System.out.println("이미 존재하는 브랜드이므로 추가하지 않음");
                }
            } else {
                // 비활성화 = 레코드 삭제
                if (exists > 0) {
                    int deleteResult = userBrandDAO.deleteUserBrand(params);
                    System.out.println("브랜드 삭제 결과: " + deleteResult);
                } else {
                    System.out.println("존재하지 않는 브랜드이므로 삭제하지 않음");
                }
            }

            return true;
        } catch (Exception e) {
            System.err.println("브랜드 선호도 토글 실패: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 브랜드 선호도 완전 삭제
     * @param email 사용자 이메일
     * @param brandId 브랜드ID
     * @return 성공 여부
     */
    public boolean deleteBrandPreference(String email, String brandId) {
        try {
            if (email == null || email.trim().isEmpty()) {
                throw new IllegalArgumentException("사용자 이메일은 필수입니다.");
            }
            if (brandId == null || brandId.trim().isEmpty()) {
                throw new IllegalArgumentException("브랜드ID는 필수입니다.");
            }

            System.out.println("Service: deleteBrandPreference 호출 - " + email + ", " + brandId);

            Map<String, Object> params = new HashMap<>();
            params.put("email", email);
            params.put("brandId", brandId);

            int deleteResult = userBrandDAO.deleteUserBrand(params);
            System.out.println("브랜드 삭제 결과: " + deleteResult);
            
            return true;
        } catch (Exception e) {
            System.err.println("브랜드 선호도 삭제 실패: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 사용자의 모든 브랜드 선호도 삭제
     * @param email 사용자 이메일
     * @return 성공 여부
     */
    public boolean deleteAllUserBrands(String email) {
        try {
            if (email == null || email.trim().isEmpty()) {
                throw new IllegalArgumentException("사용자 이메일은 필수입니다.");
            }

            System.out.println("Service: deleteAllUserBrands 호출 - " + email);

            int deleteResult = userBrandDAO.deleteAllUserBrands(email);
            System.out.println("모든 브랜드 삭제 결과: " + deleteResult);
            
            return true;
        } catch (Exception e) {
            System.err.println("모든 브랜드 선호도 삭제 실패: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 브랜드별 선호도 통계 조회 (관리자용)
     * @return 브랜드별 사용자 수
     */
    public List<Map<String, Object>> getBrandPreferenceStats() {
        System.out.println("Service: getBrandPreferenceStats 호출");
        List<Map<String, Object>> result = userBrandDAO.selectBrandPreferenceStats();
        System.out.println("Service: 통계 데이터 수 - " + (result != null ? result.size() : 0));
        return result;
    }

    /**
     * 특정 브랜드 선호도 존재 여부 확인
     * @param email 사용자 이메일
     * @param brandId 브랜드ID
     * @return 존재 여부
     */
    public boolean existsBrandPreference(String email, String brandId) {
        if (email == null || email.trim().isEmpty() || brandId == null || brandId.trim().isEmpty()) {
            return false;
        }

        Map<String, Object> params = new HashMap<>();
        params.put("email", email);
        params.put("brandId", brandId);

        return userBrandDAO.existsUserBrand(params) > 0;
    }

    /**
     * 브랜드 선호도 일괄 업데이트 (TB_USER_OPERATOR용)
     * 기존 모든 레코드 삭제 후 선택된 브랜드들만 삽입
     * @param email 사용자 이메일
     * @param selectedBrandIds 선택된 브랜드 ID 목록
     * @return 성공 여부
     */
    public boolean updateUserBrandPreferences(String email, List<String> selectedBrandIds) {
        try {
            if (email == null || email.trim().isEmpty()) {
                throw new IllegalArgumentException("사용자 이메일은 필수입니다.");
            }

            System.out.println("Service: updateUserBrandPreferences 호출 - " + email);
            System.out.println("선택된 브랜드 수: " + (selectedBrandIds != null ? selectedBrandIds.size() : 0));

            // 1. 기존 모든 브랜드 삭제
            userBrandDAO.deleteAllUserBrands(email);

            // 2. 선택된 브랜드들 추가
            if (selectedBrandIds != null && !selectedBrandIds.isEmpty()) {
                for (String brandId : selectedBrandIds) {
                    UserBrandVO userBrand = new UserBrandVO();
                    userBrand.setEmail(email);
                    userBrand.setBrandId(brandId);
                    userBrand.setIsActive("Y");
                    
                    userBrandDAO.insertUserBrand(userBrand);
                }
            }

            System.out.println("브랜드 선호도 일괄 업데이트 완료");
            return true;
        } catch (Exception e) {
            System.err.println("브랜드 선호도 일괄 업데이트 실패: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 전체 브랜드 목록 조회
     * @return 전체 브랜드 목록
     */
    public List<Map<String, Object>> getAllBrands() {
        System.out.println("=== Service: getAllBrands 시작 ===");
        
        try {
            List<Map<String, Object>> result = userBrandDAO.selectAllBrands();
            
            System.out.println("=== DAO에서 조회된 브랜드 수: " + (result != null ? result.size() : 0) + " ===");
            
            if (result != null && result.size() > 0) {
                System.out.println("첫 번째 브랜드 데이터: " + result.get(0));
                if (result.size() > 1) {
                    System.out.println("두 번째 브랜드 데이터: " + result.get(1));
                }
                
                // 데이터 구조 검증
                Map<String, Object> firstBrand = result.get(0);
                System.out.println("brand_id: " + firstBrand.get("brand_id"));
                System.out.println("brand_name: " + firstBrand.get("brand_name"));
                System.out.println("BRAND_ID: " + firstBrand.get("BRAND_ID"));
                System.out.println("BRAND_NAME: " + firstBrand.get("BRAND_NAME"));
            }
            
            return result;
        } catch (Exception e) {
            System.err.println("=== getAllBrands 에러 발생 ===");
            System.err.println("에러 메시지: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}