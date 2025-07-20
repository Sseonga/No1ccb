package fs.human.ecospot.charger.service;

import fs.human.ecospot.charger.dao.ChargerDAO;
import fs.human.ecospot.charger.vo.ChargerVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChargerService {
    @Autowired
    private ChargerDAO chargerDAO;

    public List<ChargerVO> getAllCharger() {
        return chargerDAO.selectAllCharger();
    }
}