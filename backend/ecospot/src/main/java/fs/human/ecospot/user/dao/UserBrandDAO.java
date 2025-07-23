package fs.human.ecospot.user.dao;

import fs.human.ecospot.user.vo.UserBrandVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 사용자 브랜드 선호도 관리 DAO
 */
@Mapper
public interface UserBrandDAO {

    /**
     * 사용자의 모든 브랜드 선호도 조회
     * @param email 사용자 이메일
     * @return 브랜드 선호도 목록
     */
    List<UserBrandVO> selectUserBrands(String email);

    /**
     * 사용자의 활성화된 브랜드 선호도 조회
     * @param email 사용자 이메일
     * @return 활성화된 브랜드 선호도 목록
     */
    List<UserBrandVO> selectActiveUserBrands(String email);

    /**
     * 특정 브랜드 선호도 존재 여부 확인
     * @param params 이메일과 브랜드ID가 포함된 맵
     * @return 존재하는 레코드 수
     */
    int existsUserBrand(Map<String, Object> params);

    /**
     * 사용자 브랜드 선호도 등록
     * @param userBrand 사용자 브랜드 선호도 정보
     * @return 등록된 레코드 수
     */
    int insertUserBrand(UserBrandVO userBrand);

    /**
     * 사용자 브랜드 선호도 활성화 상태 업데이트
     * @param params 이메일, 브랜드ID, 활성화 상태가 포함된 맵
     * @return 업데이트된 레코드 수
     */
    int updateBrandActiveStatus(Map<String, Object> params);

    /**
     * 사용자 브랜드 선호도 삭제
     * @param params 이메일과 브랜드ID가 포함된 맵
     * @return 삭제된 레코드 수
     */
    int deleteUserBrand(Map<String, Object> params);

    /**
     * 사용자의 모든 브랜드 선호도 삭제
     * @param email 사용자 이메일
     * @return 삭제된 레코드 수
     */
    int deleteAllUserBrands(String email);

    /**
     * 브랜드별 선호도 통계 조회 (관리자용)
     * @return 브랜드별 사용자 수 목록
     */
    List<Map<String, Object>> selectBrandPreferenceStats();
    
    /**
     * 전체 브랜드 목록 조회 (TB_CODE_D에서)
     * @return 브랜드 목록
     */
    List<Map<String, Object>> selectAllBrands();
}
