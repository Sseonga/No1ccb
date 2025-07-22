package fs.human.ecospot.accommodationPanel.service;

import fs.human.ecospot.accommodationPanel.dao.AccomDAO;
import fs.human.ecospot.accommodationPanel.vo.AccommodationVO;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AccomService {
    private final AccomDAO accomDAO;

    public AccomService(AccomDAO accomDAO) {
        this.accomDAO = accomDAO;
    }

    public List<AccommodationVO> getAccomList() {
        return accomDAO.getAccomList();
    }
}