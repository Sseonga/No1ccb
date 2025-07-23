package fs.human.ecospot.calc.dao;

import fs.human.ecospot.calc.vo.ChargePayVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ChargePayDAO {
    List<ChargePayVO> getAll();
}
