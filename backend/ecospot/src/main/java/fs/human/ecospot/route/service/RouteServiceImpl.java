package fs.human.ecospot.route.service;

import fs.human.ecospot.route.dao.RouteDAO;
import fs.human.ecospot.route.vo.RouteVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteServiceImpl implements RouteService {

    @Autowired
    private RouteDAO routeDAO;

    @Override
    public List<RouteVO> getAllRoutes() {
        return routeDAO.getAllRoutes();
    }

    @Override
    public int insertRoute(RouteVO vo) {
        return routeDAO.insertRoute(vo);
    }
}
