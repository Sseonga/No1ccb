package fs.human.ecospot.common.controller;

import fs.human.ecospot.common.dto.CodeDTO;
import fs.human.ecospot.common.service.CodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/code")
@CrossOrigin(origins = "http://localhost:3000")
public class CodeController {

    @Autowired
    private CodeService codeService;

    @GetMapping("/map")
    public ResponseEntity<Map<String, Map<String, String>>> getCodeMap() {
        return ResponseEntity.ok(codeService.getGroupedCodes());
    }

    @GetMapping("/report")
    public ResponseEntity<List<CodeDTO>> getReportCodes() {
        return ResponseEntity.ok(codeService.getReportCodes());
    }
}

