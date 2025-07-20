package fs.human.ecospot.route.vo;

import lombok.Data;

@Data
public class RouteVO {
    private Long routeId;         // ROUTE_ID (시퀀스)
    private Long userId;          // USER_ID
    private String routeName;     // ROUTE_NAME
    private String startAddress;  // START_ADDRESS
    private String startAddressD; // START_ADDRESS_D
    private Double startLat;      // START_LAT
    private Double startLon;      // START_LON
    private String endAddress;    // END_ADDRESS
    private String endAddressD;   // END_ADDRESS_D
    private Double endLat;        // END_LAT
    private Double endLon;        // END_LON
    private Long createdId;       // CREATED_ID
    private String createdAt;     // CREATED_AT (날짜타입이면 Date로)
}
