package fs.human.ecospot.calc.controller;

import fs.human.ecospot.calc.service.ChargePayService;
import fs.human.ecospot.calc.vo.ChargePayVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
// !! 꼭 @RestController로!!
@RequestMapping("/api/calc")
public class ChargePayController {

    @Autowired
    private ChargePayService service;

    @GetMapping("/pay")
    public List<ChargePayVO> getAll() {
        return service.getAll();
    }
}
