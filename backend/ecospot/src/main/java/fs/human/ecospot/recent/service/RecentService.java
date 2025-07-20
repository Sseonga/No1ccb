package fs.human.ecospot.recent.service;

import fs.human.ecospot.recent.dao.RecentDAO;
import fs.human.ecospot.recent.vo.RecentVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 최근검색 서비스
 * - 중복 체크/업데이트/최대 10개 유지 로직은 Controller or Service에서 분기 가능
 */
@Service
public class RecentService {

    @Autowired
    private RecentDAO recentDAO;

    /**
     * 최근검색 insert (신규 저장)
     * @param recentVO 저장할 최근검색 VO
     * @return insert 성공시 1
     */
    public int insertRecent(RecentVO recentVO) {
        return recentDAO.insertRecent(recentVO);
    }

    /**
     * 유저별 최근검색 목록 조회 (최신 10개)
     * @param userId 유저 PK
     * @return 최근검색 리스트
     */
    public List<RecentVO> getRecentListByUser(Long userId) {
        return recentDAO.selectRecentByUser(userId);
    }

    /**
     * 동일한 경로/타입 중복 있는지 체크
     * @param recentVO 출발/도착/타입/유저 기준
     * @return 중복 1건 or null
     */
    public RecentVO getDupRecent(RecentVO recentVO) {
        return recentDAO.selectRecentDup(recentVO);
    }

    /**
     * 유저/타입별 가장 오래된 최근검색 1건 삭제 (최대 10개 유지용)
     * @param userId 유저 PK
     * @param recentTypeCd 타입 (예: ROUTE)
     * @return 삭제건수(1)
     */
    public int deleteOldestRecent(Long userId, String recentTypeCd) {
        return recentDAO.deleteOldestRecent(userId, recentTypeCd);
    }

    /**
     * 동일한 유저+출발지+도착지+타입의 기존 경로 삭제 (중복 제거)
     * @param recentVO 중복 조건 (userId, startAddress, endAddress, recentTypeCd)
     * @return 삭제건수
     */
    public int deleteRecentDup(RecentVO recentVO) {
        return recentDAO.deleteRecentDup(recentVO);
    }
}
