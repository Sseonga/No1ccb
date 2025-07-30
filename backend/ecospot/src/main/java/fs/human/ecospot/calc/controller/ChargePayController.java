package fs.human.ecospot.calc.controller;

import fs.human.ecospot.calc.service.ChargePayService;
import fs.human.ecospot.calc.vo.ChargePayVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/calc")
public class ChargePayController {

    @Autowired
    private ChargePayService chargePayService;

    // 기존 전체 요금 데이터
    @GetMapping("/pay")
    public List<ChargePayVO> getAll() {
        return chargePayService.getAll();
    }

    // ✅ 중복 제거된 브랜드만 응답
    @GetMapping("/brands")
    public List<String> getBrands() {
        System.err.println("test");
        return chargePayService.getDistinctBrands();
    }
}
