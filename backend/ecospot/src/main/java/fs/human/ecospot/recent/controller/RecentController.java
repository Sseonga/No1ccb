package fs.human.ecospot.recent.controller;

import fs.human.ecospot.recent.service.RecentService;
import fs.human.ecospot.recent.vo.RecentVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 최근검색 API 컨트롤러
 * - POST /api/recent : 최근검색 저장 (중복시 최신 1개만, 10개 유지)
 * - GET  /api/recent?userId=... : 유저별 최근검색 10개 조회
 */
@RestController
@RequestMapping("/api/recent")
public class RecentController {

    @Autowired
    private RecentService recentService;

    /**
     * 최근검색 저장 (중복시 기존 기록 삭제 후 insert, 10개만 유지)
     * 프론트에서 동일 출발/도착/타입으로 여러번 요청 시 → 중복 1개만 남김
     */
    @PostMapping
    public int saveRecent(@RequestBody RecentVO vo) {
        // 1. 동일한 userId + startAddress + endAddress + recentTypeCd 중복 삭제
        recentService.deleteRecentDup(vo);

        // 2. 10개 초과시 가장 오래된 기록 삭제 (10개 유지)
        List<RecentVO> recentList = recentService.getRecentListByUser(vo.getUserId());
        if (recentList.size() >= 10) {
            // 타입별로 유지하고 싶으면 recentTypeCd도 넘겨야 함
            recentService.deleteOldestRecent(vo.getUserId(), vo.getRecentTypeCd());
        }

        // 3. 새 기록 insert
        return recentService.insertRecent(vo);
    }

    /**
     * 유저별 최근검색 최신 10개 조회 (마이페이지 등에서 사용)
     */
    @GetMapping
    public List<RecentVO> getRecentList(@RequestParam Long userId) {
        return recentService.getRecentListByUser(userId);
    }
}
