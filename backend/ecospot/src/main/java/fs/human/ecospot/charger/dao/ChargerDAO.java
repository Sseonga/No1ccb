package fs.human.ecospot.charger.dao;

import fs.human.ecospot.charger.vo.ChargerVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ChargerDAO {
    List<ChargerVO> selectAllCharger();
}