package fs.human.ecospot.calc.service;

import fs.human.ecospot.calc.vo.ChargePayVO;

import java.util.List;

// 어노테이션 절대 X!!
public interface ChargePayService {
    List<ChargePayVO> getAll();
}