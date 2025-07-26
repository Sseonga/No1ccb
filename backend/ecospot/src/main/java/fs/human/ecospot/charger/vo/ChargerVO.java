package fs.human.ecospot.charger.vo;

import lombok.Data;


@Data
public class ChargerVO {
    private Long parkingId;
    private String parkingName;
    private String parkingType;
    private Double parkingLon;
    private Double parkingLat;
    private String parkingFee;
    private String parkingCode;
    private String parkingAddress;
    private String parkingAddressD;
    private String parkingOperating;
    private Integer parkingCapacity;
    private String parkingPhone;
}

