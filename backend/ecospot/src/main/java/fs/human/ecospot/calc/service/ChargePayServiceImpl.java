package fs.human.ecospot.calc.service;

import fs.human.ecospot.calc.dao.ChargePayDAO;
import fs.human.ecospot.calc.vo.ChargePayVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChargePayServiceImpl implements ChargePayService {

    @Autowired
    private ChargePayDAO chargePayDAO;

    @Override
    public List<ChargePayVO> getAll() {
        return chargePayDAO.getAll();
    }

    @Override
    public List<String> getDistinctBrands() {
        return chargePayDAO.getDistinctBrands();
    }
}
