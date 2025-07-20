package fs.human.ecospot.charger.controller;

import fs.human.ecospot.charger.service.ChargerService;
import fs.human.ecospot.charger.vo.ChargerVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/charger")  // <- 원하는 대로 route 변경
@CrossOrigin(origins = "http://localhost:3000")
public class ChargerController {

    @Autowired
    private ChargerService chargerService;

    @GetMapping("")
    public List<ChargerVO> getAllCharger() {
        return chargerService.getAllCharger();
    }
}