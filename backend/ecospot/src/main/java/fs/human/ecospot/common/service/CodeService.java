package fs.human.ecospot.common.service;

import fs.human.ecospot.common.dao.CodeDAO;
import fs.human.ecospot.common.dto.CodeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CodeService {

    @Autowired
    private CodeDAO codeDAO;

    public Map<String, Map<String, String>> getGroupedCodes() {
        List<CodeDTO> codes = codeDAO.findAllCodes();

        return codes.stream()
                .collect(Collectors.groupingBy(
                        CodeDTO::getCodeId,
                        Collectors.toMap(
                                CodeDTO::getCodeDetailId,
                                CodeDTO::getCodeDetailName,
                                (a, b) -> a, // 중복 방지
                                LinkedHashMap::new
                        )
                ));
    }

    public List<CodeDTO> getReportCodes() {
        return codeDAO.findByCodeId("REPORT");
    }
}
