package fs.human.ecospot.user.dao;

import fs.human.ecospot.user.vo.UserStationVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 사용자 충전소 즐겨찾기 DAO 인터페이스
 */
@Mapper
public interface UserStationDAO {
    
    /**
     * 사용자의 즐겨찾기 충전소 목록 조회
     * @param email 사용자 이메일
     * @return 즐겨찾기 충전소 목록
     */
    List<UserStationVO> selectUserStations(@Param("email") String email);
    
    /**
     * 사용자의 활성화된 즐겨찾기 충전소 목록 조회
     * @param email 사용자 이메일
     * @return 활성화된 즐겨찾기 충전소 목록
     */
    List<UserStationVO> selectActiveUserStations(@Param("email") String email);
    
    /**
     * 즐겨찾기 충전소 추가
     * @param userStation 추가할 충전소 정보
     * @return 추가된 행 수
     */
    int insertUserStation(UserStationVO userStation);
    
    /**
     * 즐겨찾기 충전소 활성화/비활성화 토글
     * @param email 사용자 이메일
     * @param stationId 충전소 ID
     * @return 업데이트된 행 수
     */
    int updateStationActiveStatus(@Param("email") String email, @Param("stationId") String stationId);
    
    /**
     * 즐겨찾기 충전소 삭제
     * @param email 사용자 이메일
     * @param stationId 충전소 ID
     * @return 삭제된 행 수
     */
    int deleteUserStation(@Param("email") String email, @Param("stationId") String stationId);
    
    /**
     * 특정 충전소가 이미 즐겨찾기에 등록되어 있는지 확인
     * @param email 사용자 이메일
     * @param stationId 충전소 ID
     * @return 존재하면 1, 없으면 0
     */
    int checkStationExists(@Param("email") String email, @Param("stationId") String stationId);
}
