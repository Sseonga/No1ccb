package fs.human.ecospot.location.vo;

import lombok.Data;

@Data
public class AccomVO {
    private Long accomId;           // 숙소 ID (Primary Key)
    private String accomName;       // 숙소 이름
    private String accomDesc;       // 숙소 소개
    private String accomCheckin;    // 체크인 시간
    private String accomCheckout;   // 체크아웃 시간
    private String accomAddress;    // 숙소 주소
    private String accomAddressD;   // 숙소 상세주소
    private Double accomLat;        // 위도
    private Double accomLon;        // 경도 (실제 DB 컬럼명: ACCOM_LON)
    private String accomPhone;      // 전화번호
    private String accomUrl;        // 숙소 URL
    private String accomImgMain;    // 메인 이미지
    private String createdId;       // 작성자 ID
    private String createdDate;     // 작성일
    private String updatedId;       // 수정자 ID
    private String updatedDate;     // 수정일
    
    // 프론트엔드 호환성을 위한 getter 메서드들
    public String getName() {
        return this.accomName;
    }
    
    public String getDescription() {
        return this.accomDesc;
    }
    
    public String getAddress() {
        return this.accomAddress;
    }
    
    public String getPhone() {
        return this.accomPhone;
    }
    
    public Double getLatitude() {
        return this.accomLat;
    }
    
    public Double getLongitude() {
        return this.accomLon;
    }
}
