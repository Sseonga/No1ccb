package fs.human.ecospot.charger.dto;

import lombok.Data;

@Data
public class PoiRequestDTO {
    private String id;
    private double lat;
    private double lng;
}

