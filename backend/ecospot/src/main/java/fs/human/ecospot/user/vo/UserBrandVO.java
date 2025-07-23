package fs.human.ecospot.user.vo;

import java.util.Date;

/**
 * 사용자 브랜드 선호도 VO (TB_USER_OPERATOR용)
 */
public class UserBrandVO {
    private String email;        // USER_ID
    private String brandId;      // OPERATOR_ID  
    private String brandName;    // 브랜드명 (조인으로 가져옴)
    private String isActive;     // 활성화 여부 (호환성)
    private Date createdAt;      // CREATED_DATE
    
    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getBrandId() { return brandId; }
    public void setBrandId(String brandId) { this.brandId = brandId; }
    
    public String getBrandName() { return brandName; }
    public void setBrandName(String brandName) { this.brandName = brandName; }
    
    public String getIsActive() { return isActive; }
    public void setIsActive(String isActive) { this.isActive = isActive; }
    
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}