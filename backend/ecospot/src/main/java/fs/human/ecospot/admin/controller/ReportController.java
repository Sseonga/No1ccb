package fs.human.ecospot.admin.controller;

import fs.human.ecospot.admin.service.ReportService;
import fs.human.ecospot.admin.vo.ReportVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/report")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping("")
    public ResponseEntity<?> insertReport(@RequestBody ReportVO report) {
        reportService.insertReport(report);
        return ResponseEntity.ok("신고 완료");
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkReportExists(
            @RequestParam Long userId,
            @RequestParam Long stationId
    ) {
        boolean exists = reportService.hasReported(userId, stationId);
        return ResponseEntity.ok(Map.of("reported", exists));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getReportStats(@RequestParam Long stationId) {
        Map<String, Object> result = new HashMap<>();
        result.put("total", reportService.countReports(stationId));
        result.put("byType", reportService.countReportsByType(stationId));
        return ResponseEntity.ok(result);
    }
}
