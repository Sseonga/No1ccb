package fs.human.ecospot.charger.vo;

import lombok.Data;

@Data
public class StationVO {
    private Long stationId;
    private String stationName;
    private String stationOperatiorCD;
    private Double stationLat;
    private Double stationLon;
    private String stationAddress;
    private String stationAddressD;
    private String stationAreaCode;
    private String stationPhone;
    private Long parkingId;
}
