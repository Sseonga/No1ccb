package fs.human.ecospot.admin.service;

import fs.human.ecospot.admin.dao.ReportDAO;
import fs.human.ecospot.admin.dto.ReportGroupCountDTO;
import fs.human.ecospot.admin.vo.ReportVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    @Autowired
    private ReportDAO reportDAO;

    public void insertReport(ReportVO report) {
        if (report.getState() == null) {
            report.setState("N");
        }
        reportDAO.insertReport(report);
    }

    public boolean hasReported(Long userId, Long stationId) {
        return reportDAO.countReportByUserAndStation(userId, stationId) > 0;
    }

    public int countReports(Long stationId) {
        return reportDAO.countReports(stationId);
    }

    public List<ReportGroupCountDTO> countReportsByType(Long stationId) {
        return reportDAO.countReportsByType(stationId);
    }
}
