package fs.human.ecospot.personal.service;

import fs.human.ecospot.charger.dao.ChargerDAO;
import fs.human.ecospot.charger.service.ChargerService;
import fs.human.ecospot.charger.vo.PoiInfo;
import fs.human.ecospot.charger.vo.StationVO;
import fs.human.ecospot.personal.dao.FavorDAO;
import fs.human.ecospot.personal.dto.FavorRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class FavorService {

    @Autowired
    private FavorDAO favorDAO;

    @Autowired
    private ChargerService chargerService;

    @Autowired
    private ChargerDAO chargerDAO;

    public void addFavorite(FavorRequestDto dto) {
        // 충전소 정보 없으면 insert
        if(!chargerDAO.existsStation(dto.getStationId())) {
            PoiInfo poi = dto.getPoiInfo();

            StationVO station = new StationVO();
            station.setStationId(dto.getStationId());
            station.setStationName(poi.getName());
            station.setStationOperatiorCD(dto.getOperatorId());
            station.setStationLat(poi.getFrontLat());
            station.setStationLon(poi.getFrontLon());
            station.setStationAddress(
                    Stream.of(poi.getUpperAddrName(), poi.getMiddleAddrName(), poi.getLowerAddrName(), poi.getDetailAddrName())
                            .filter(Objects::nonNull)
                            .collect(Collectors.joining(" "))
            );
            station.setStationAddressD(dto.getFullAddressRoad());
            station.setStationAreaCode(poi.getZipCode());
            station.setStationPhone(poi.getTelNo());


            chargerDAO.insertStation(station, dto.getUserId());
        }

        // 즐겨찾기 등록
        favorDAO.insertFavorite(dto.getUserId(), dto.getStationId());
    }

    public void removeFavorite(FavorRequestDto dto) {
        favorDAO.deleteFavorite(dto.getUserId(), dto.getStationId());
    }

    public boolean isStationFavorited(Long userId, Long stationId) {
        return favorDAO.existsFavorite(userId, "FAVOR_02", stationId) > 0;
    }
}
