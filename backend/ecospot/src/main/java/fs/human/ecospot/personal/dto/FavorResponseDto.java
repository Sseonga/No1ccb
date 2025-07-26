package fs.human.ecospot.personal.dto;

public class FavorResponseDto {
    private Long favorId;
    private Long userId;
    private String favorTypeCd;
    private Long targetId;
    private String createdDate;
    private String updatedDate;
    
    // 상세 정보 필드 추가
    private String targetName;        // 충전소명 또는 숙소명
    private String targetAddress;     // 주소

    // Getter/Setter
    public Long getFavorId() { return favorId; }
    public void setFavorId(Long favorId) { this.favorId = favorId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFavorTypeCd() { return favorTypeCd; }
    public void setFavorTypeCd(String favorTypeCd) { this.favorTypeCd = favorTypeCd; }

    public Long getTargetId() { return targetId; }
    public void setTargetId(Long targetId) { this.targetId = targetId; }

    public String getCreatedDate() { return createdDate; }
    public void setCreatedDate(String createdDate) { this.createdDate = createdDate; }

    public String getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(String updatedDate) { this.updatedDate = updatedDate; }

    public String getTargetName() { return targetName; }
    public void setTargetName(String targetName) { this.targetName = targetName; }

    public String getTargetAddress() { return targetAddress; }
    public void setTargetAddress(String targetAddress) { this.targetAddress = targetAddress; }
} 