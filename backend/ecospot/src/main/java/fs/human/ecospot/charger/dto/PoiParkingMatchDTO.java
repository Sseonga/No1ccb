package fs.human.ecospot.charger.dto;

import lombok.Data;

@Data
public class PoiParkingMatchDTO {
    private String poiId;
    private Long parkingId;
    private String parkingFee;


    public PoiParkingMatchDTO() {}

    public PoiParkingMatchDTO(String poiId, Long parkingId, String parkingFee) {
        this.poiId = poiId;
        this.parkingId = parkingId;
        this.parkingFee = parkingFee;
    }
}
