package fs.human.ecospot.calc.service;

import fs.human.ecospot.calc.vo.ChargePayVO;

import java.util.List;

public interface ChargePayService {
    List<ChargePayVO> getAll();

    // ✅ 브랜드 중복 제거된 목록
    List<String> getDistinctBrands();
}
