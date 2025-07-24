package fs.human.ecospot.user.service;

import fs.human.ecospot.user.dao.UserStationDAO;
import fs.human.ecospot.user.vo.UserStationVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 사용자 충전소 즐겨찾기 서비스
 */
@Service
public class UserStationService {

    @Autowired
    private UserStationDAO userStationDAO;

    /**
     * 사용자의 즐겨찾기 충전소 목록 조회
     * @param email 사용자 이메일
     * @return 즐겨찾기 충전소 목록
     */
    public List<UserStationVO> getUserStations(String email) {
        try {
            return userStationDAO.selectUserStations(email);
        } catch (Exception e) {
            throw new RuntimeException("즐겨찾기 충전소 목록 조회 실패: " + e.getMessage(), e);
        }
    }

    /**
     * 사용자의 활성화된 즐겨찾기 충전소 목록 조회
     * @param email 사용자 이메일
     * @return 활성화된 즐겨찾기 충전소 목록
     */
    public List<UserStationVO> getActiveUserStations(String email) {
        try {
            return userStationDAO.selectActiveUserStations(email);
        } catch (Exception e) {
            throw new RuntimeException("활성화된 즐겨찾기 충전소 목록 조회 실패: " + e.getMessage(), e);
        }
    }

    /**
     * 즐겨찾기 충전소 추가
     * @param userStation 추가할 충전소 정보
     * @return 성공 여부
     */
    @Transactional
    public boolean addUserStation(UserStationVO userStation) {
        try {
            // 이미 등록된 충전소인지 확인
            if (userStationDAO.checkStationExists(userStation.getEmail(), userStation.getStationId()) > 0) {
                throw new IllegalArgumentException("이미 등록된 충전소입니다.");
            }

            int result = userStationDAO.insertUserStation(userStation);
            return result > 0;
        } catch (Exception e) {
            throw new RuntimeException("즐겨찾기 충전소 추가 실패: " + e.getMessage(), e);
        }
    }

    /**
     * 즐겨찾기 충전소 활성화/비활성화 토글
     * @param email 사용자 이메일
     * @param stationId 충전소 ID
     * @return 성공 여부
     */
    @Transactional
    public boolean toggleStationActive(String email, String stationId) {
        try {
            // 충전소가 존재하는지 확인
            if (userStationDAO.checkStationExists(email, stationId) == 0) {
                throw new IllegalArgumentException("등록되지 않은 충전소입니다.");
            }

            int result = userStationDAO.updateStationActiveStatus(email, stationId);
            return result > 0;
        } catch (Exception e) {
            throw new RuntimeException("충전소 활성화 상태 변경 실패: " + e.getMessage(), e);
        }
    }

    /**
     * 즐겨찾기 충전소 삭제
     * @param email 사용자 이메일
     * @param stationId 충전소 ID
     * @return 성공 여부
     */
    @Transactional
    public boolean removeUserStation(String email, String stationId) {
        try {
            // 충전소가 존재하는지 확인
            if (userStationDAO.checkStationExists(email, stationId) == 0) {
                throw new IllegalArgumentException("등록되지 않은 충전소입니다.");
            }

            int result = userStationDAO.deleteUserStation(email, stationId);
            return result > 0;
        } catch (Exception e) {
            throw new RuntimeException("즐겨찾기 충전소 삭제 실패: " + e.getMessage(), e);
        }
    }

    /**
     * 특정 충전소가 이미 즐겨찾기에 등록되어 있는지 확인
     * @param email 사용자 이메일
     * @param stationId 충전소 ID
     * @return 등록 여부
     */
    public boolean isStationFavorite(String email, String stationId) {
        try {
            return userStationDAO.checkStationExists(email, stationId) > 0;
        } catch (Exception e) {
            throw new RuntimeException("충전소 즐겨찾기 여부 확인 실패: " + e.getMessage(), e);
        }
    }
}
