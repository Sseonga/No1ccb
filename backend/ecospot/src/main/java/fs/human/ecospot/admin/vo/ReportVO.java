package fs.human.ecospot.admin.vo;

import lombok.Data;

@Data
public class ReportVO {
    private Long reportId;
    private Long stationId;
    private Long userId;
    private String reportTypeCd;
    private String reportComment;
    private String state; // 'N' 기본값
}
