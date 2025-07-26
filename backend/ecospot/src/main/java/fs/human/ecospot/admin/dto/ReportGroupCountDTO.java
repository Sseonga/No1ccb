package fs.human.ecospot.admin.dto;

import lombok.Data;

@Data
public class ReportGroupCountDTO {
    private String codeDetailId;   // ex: REPORT_01
    private String codeDetailName; // ex: 위치정보 오류
    private int count;
}
