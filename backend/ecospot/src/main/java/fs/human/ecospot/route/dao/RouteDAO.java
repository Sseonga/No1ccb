package fs.human.ecospot.route.dao;

import fs.human.ecospot.route.vo.RouteVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface RouteDAO {
    List<RouteVO> getAllRoutes();
    int insertRoute(RouteVO vo);
}