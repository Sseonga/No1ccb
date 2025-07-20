package fs.human.ecospot.recent.dao;

import fs.human.ecospot.recent.vo.RecentVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * TB_RECENT 테이블 매퍼 DAO
 * - insertRecent : 최근검색 저장 (insert)
 * - selectRecentByUser : 유저별 최근검색 10개 조회
 * - selectRecentDup : 중복 검색(출발/도착/타입) 있는지 체크
 * - deleteOldestRecent : 유저/타입별 가장 오래된 기록 1개 삭제
 */
@Mapper
public interface RecentDAO {

    // 1. 최근검색 insert
    int insertRecent(RecentVO recent);

    // 2. 유저별 최근검색 목록 조회 (최신 10개)
    List<RecentVO> selectRecentByUser(Long userId);

    // 3. 중복 경로/타입 체크 (있으면 최근 1개 반환)
    RecentVO selectRecentDup(RecentVO recent);

    // 4. 유저별, 타입별 가장 오래된 최근검색 1개 삭제
    int deleteOldestRecent(Long userId, String recentTypeCd);
    // 5. 동일한 유저+출발지+도착지+타입의 기존 경로 삭제 (중복제거)
    int deleteRecentDup(RecentVO recent);
}
