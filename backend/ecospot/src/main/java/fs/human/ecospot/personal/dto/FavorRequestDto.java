package fs.human.ecospot.personal.dto;

import fs.human.ecospot.charger.vo.PoiInfo;
import lombok.Data;

@Data
public class FavorRequestDto {
    private Long userId;
    private Long stationId;
    private PoiInfo poiInfo;
    private String operatorId;
    private String fullAddressRoad;
}
