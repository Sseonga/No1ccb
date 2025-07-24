package fs.human.ecospot.charger.service;

import fs.human.ecospot.charger.dao.ChargerDAO;
import fs.human.ecospot.charger.dto.PoiParkingMatchDTO;
import fs.human.ecospot.charger.dto.PoiRequestDTO;
import fs.human.ecospot.charger.vo.ChargerVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChargerService {
    @Autowired
    private ChargerDAO chargerDAO;

    public List<ChargerVO> getAllCharger() {
        return chargerDAO.selectAllCharger();
    }

    public List<PoiParkingMatchDTO> matchParkingForPOIs(List<PoiRequestDTO> pois) {
        return pois.stream()
                .map(poi -> {
                    PoiParkingMatchDTO match = chargerDAO.findNearestParkingInfo(poi.getLat(), poi.getLng());
                    if (match == null) {
                        return new PoiParkingMatchDTO(poi.getId(), null, null);
                    } else {
                        return new PoiParkingMatchDTO(poi.getId(), match.getParkingId(), match.getParkingFee());
                    }
                })
                .collect(Collectors.toList());
    }
}