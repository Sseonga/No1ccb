package fs.human.ecospot.route.controller;

import fs.human.ecospot.route.service.RouteService;
import fs.human.ecospot.route.vo.RouteVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/route")
@CrossOrigin(origins = "http://localhost:3000")
public class RouteController {

    @Autowired
    private RouteService routeService;

    // [전체 리스트 조회]
    @GetMapping("")
    public List<RouteVO> getAllRoutes() {
        return routeService.getAllRoutes();
    }

    // [React에서 경로 데이터 저장]
    @PostMapping("/insert")
    public int insertRoute(@RequestBody RouteVO vo) {
        // insert 성공 시 1, 실패 시 0 반환 (MyBatis insert 결과)
        return routeService.insertRoute(vo);
    }
}
