package fs.human.ecospot.route.service;

import fs.human.ecospot.route.vo.RouteVO;

import java.util.List;

public interface RouteService {
    List<RouteVO> getAllRoutes();
    int insertRoute(RouteVO vo);
}