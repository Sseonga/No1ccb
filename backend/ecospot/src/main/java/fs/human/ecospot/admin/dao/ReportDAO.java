package fs.human.ecospot.admin.dao;

import fs.human.ecospot.admin.dto.ReportGroupCountDTO;
import fs.human.ecospot.admin.vo.ReportVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface ReportDAO {
    void insertReport(ReportVO report);

    int countReportByUserAndStation(@Param("userId") Long userId, @Param("stationId") Long stationId);

    int countReports(@Param("stationId") Long stationId);

    List<ReportGroupCountDTO> countReportsByType(@Param("stationId") Long stationId);
}
