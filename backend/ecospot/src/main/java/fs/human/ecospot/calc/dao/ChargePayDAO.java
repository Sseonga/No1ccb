package fs.human.ecospot.calc.dao;

import fs.human.ecospot.calc.vo.ChargePayVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ChargePayDAO {

    // 전체 요금 정보 가져오기
    List<ChargePayVO> getAll();

    // ✅ 중복 제거된 브랜드 이름 목록 가져오기
    List<String> getDistinctBrands();
}
