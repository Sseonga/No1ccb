package fs.human.ecospot.charger.dao;

import fs.human.ecospot.charger.dto.PoiParkingMatchDTO;
import fs.human.ecospot.charger.vo.ChargerVO;
import fs.human.ecospot.charger.vo.StationVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.security.core.parameters.P;

import java.util.List;

@Mapper
public interface ChargerDAO {
    List<ChargerVO> selectAllCharger();

    PoiParkingMatchDTO findNearestParkingInfo(@Param("lat") double lat, @Param("lng") double lng);

    void insertStation(@Param("station") StationVO station, @Param("userId") Long userId);

    boolean existsStation(Long stationId);
}