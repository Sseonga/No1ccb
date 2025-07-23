package fs.human.ecospot.common.dto;

import lombok.Data;

@Data
public class CodeDTO {
    private String codeDetailId;   // ex: CHARGER_TYPE_01
    private String codeId;         // ex: CHARGER_TYPE
    private String codeDetailName; // ex: DC차데모
}
