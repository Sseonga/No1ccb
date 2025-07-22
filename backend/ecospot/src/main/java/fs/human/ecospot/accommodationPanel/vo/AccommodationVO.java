package fs.human.ecospot.accommodationPanel.vo;

import lombok.Data;
import java.util.Date;

@Data
public class AccommodationVO {
    private Long accomId;            // ACCOM_ID
    private String accomName;        // ACCOM_NAME
    private String accomDesc;        // ACCOM_DESC
    private String accomCheckin;     // ACCOM_CHECKIN
    private String accomCheckout;    // ACCOM_CHECKOUT
    private String accomAddress;     // ACCOM_ADDRESS
    private String accomAddressD;    // ACCOM_ADDRESS_D
    private Double accomLat;         // ACCOM_LAT
    private Double accomLon;         // ACCOM_LON
    private String accomPhone;       // ACCOM_PHONE
    private String accomUrl;         // ACCOM_URL
    private String accomImgMain1;    // ACCOM_IMG_MAIN1
    private Date createdDate;        // CREATED_DATE
    private Long createdId;          // CREATED_ID
    private Date updatedDate;        // UPDATED_DATE
    private Long updatedId;          // UPDATED_ID
}
