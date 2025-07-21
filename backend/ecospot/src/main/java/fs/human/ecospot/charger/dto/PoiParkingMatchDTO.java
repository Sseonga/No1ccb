package fs.human.ecospot.charger.dto;

import lombok.Data;

@Data
public class PoiParkingMatchDTO {
    private String poiId;
    private Long parkingId;

    public PoiParkingMatchDTO(String poiId, Long parkingId) {
        this.poiId = poiId;
        this.parkingId = parkingId;
    }
}
