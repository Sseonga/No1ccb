package fs.human.ecospot.recent.vo;

import lombok.Data;

import java.util.Date;

// TB_RECENT 테이블과 1:1 매핑 (camelCase: recentId, userId ...)
@Data
public class RecentVO {
    private Long recentId;
    private Long userId;
    private String recentTypeCd;
    private String startAddress;
    private String startAddressD;
    private Double startLat;
    private Double startLon;
    private String endAddress;
    private String endAddressD;
    private Double endLat;
    private Double endLon;
    private String keyword;
    private Date createdDate;
    private Long createdId;
    private Date updatedDate;
    private Long updatedId;
}
