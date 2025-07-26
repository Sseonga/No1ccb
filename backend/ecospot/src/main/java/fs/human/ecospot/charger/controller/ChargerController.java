package fs.human.ecospot.charger.controller;

import fs.human.ecospot.charger.dto.PoiParkingMatchDTO;
import fs.human.ecospot.charger.dto.PoiRequestDTO;
import fs.human.ecospot.charger.service.ChargerService;
import fs.human.ecospot.charger.vo.ChargerVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/charger")  // <- 원하는 대로 route 변경
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ChargerController {

    @Autowired
    private ChargerService chargerService;

    @GetMapping("")
    public List<ChargerVO> getAllCharger() {
        return chargerService.getAllCharger();
    }

    @PostMapping("/match-parking")
    public List<PoiParkingMatchDTO> matchParking(@RequestBody List<PoiRequestDTO> pois) {
        System.out.println("📥 match-parking 요청 도착: " + pois.size());
        return chargerService.matchParkingForPOIs(pois);
    }

    @GetMapping("/parking/{parkingId}")
    public ChargerVO getParking(@PathVariable Long parkingId) {
        return chargerService.getParkingById(parkingId);
    }
}