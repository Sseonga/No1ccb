package fs.human.ecospot.user.vo;

/**
 * 사용자 즐겨찾기 충전소 VO 클래스
 * TB_USER_STATION 테이블과 매핑
 */
public class UserStationVO {
    private String email;              // 사용자 이메일
    private String stationId;          // 충전소 ID
    private String stationName;        // 충전소 이름
    private String stationAddress;     // 충전소 주소
    private String stationProvider;    // 운영기관
    private String chargerType;        // 충전기 타입 (급속/완속)
    private Double stationLat;         // 위도
    private Double stationLon;         // 경도
    private String isActive;           // 활성화 상태 (Y/N)
    private String createdAt;          // 등록일시

    // 기본 생성자
    public UserStationVO() {}

    // 생성자
    public UserStationVO(String email, String stationId, String stationName, 
                        String stationAddress, String stationProvider, String chargerType,
                        Double stationLat, Double stationLon, String isActive) {
        this.email = email;
        this.stationId = stationId;
        this.stationName = stationName;
        this.stationAddress = stationAddress;
        this.stationProvider = stationProvider;
        this.chargerType = chargerType;
        this.stationLat = stationLat;
        this.stationLon = stationLon;
        this.isActive = isActive;
    }

    // Getter & Setter
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStationId() {
        return stationId;
    }

    public void setStationId(String stationId) {
        this.stationId = stationId;
    }

    public String getStationName() {
        return stationName;
    }

    public void setStationName(String stationName) {
        this.stationName = stationName;
    }

    public String getStationAddress() {
        return stationAddress;
    }

    public void setStationAddress(String stationAddress) {
        this.stationAddress = stationAddress;
    }

    public String getStationProvider() {
        return stationProvider;
    }

    public void setStationProvider(String stationProvider) {
        this.stationProvider = stationProvider;
    }

    public String getChargerType() {
        return chargerType;
    }

    public void setChargerType(String chargerType) {
        this.chargerType = chargerType;
    }

    public Double getStationLat() {
        return stationLat;
    }

    public void setStationLat(Double stationLat) {
        this.stationLat = stationLat;
    }

    public Double getStationLon() {
        return stationLon;
    }

    public void setStationLon(Double stationLon) {
        this.stationLon = stationLon;
    }

    public String getIsActive() {
        return isActive;
    }

    public void setIsActive(String isActive) {
        this.isActive = isActive;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "UserStationVO{" +
                "email='" + email + '\'' +
                ", stationId='" + stationId + '\'' +
                ", stationName='" + stationName + '\'' +
                ", stationAddress='" + stationAddress + '\'' +
                ", stationProvider='" + stationProvider + '\'' +
                ", chargerType='" + chargerType + '\'' +
                ", stationLat=" + stationLat +
                ", stationLon=" + stationLon +
                ", isActive='" + isActive + '\'' +
                ", createdAt='" + createdAt + '\'' +
                '}';
    }
}
