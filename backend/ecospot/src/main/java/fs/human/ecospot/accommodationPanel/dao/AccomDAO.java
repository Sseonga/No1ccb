package fs.human.ecospot.accommodationPanel.dao;

import fs.human.ecospot.accommodationPanel.vo.AccommodationVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface AccomDAO {
    List<AccommodationVO> getAccomList();
}