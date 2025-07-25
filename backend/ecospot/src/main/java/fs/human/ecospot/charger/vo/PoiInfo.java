package fs.human.ecospot.charger.vo;

import lombok.Data;

@Data
public class PoiInfo {
    private String name;
    private Double frontLat;
    private Double frontLon;
    private String upperAddrName;
    private String middleAddrName;
    private String lowerAddrName;
    private String detailAddrName;
    private String zipCode;
    private String telNo;
}
