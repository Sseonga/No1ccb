package fs.human.ecospot.location.service;

import fs.human.ecospot.location.dao.AccomDAO;
import fs.human.ecospot.location.vo.AccomVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccomService {
    
    @Autowired
    private AccomDAO accomDAO;
    
    /**
     * 숙소 추가
     */
    public void addAccommodation(AccomVO accom) {
        System.out.println("=== 숙소 추가 서비스 ===");
        System.out.println("숙소명: " + accom.getAccomName());
        System.out.println("설명: " + accom.getAccomDesc());
        System.out.println("주소: " + accom.getAccomAddress());
        
        accomDAO.insertAccommodation(accom);
        System.out.println("✅ 숙소 추가 완료");
    }
    
    /**
     * 모든 숙소 목록 조회
     */
    public List<AccomVO> getAllAccommodations() {
        System.out.println("=== 숙소 목록 조회 서비스 ===");
        List<AccomVO> accommodations = accomDAO.selectAllAccommodations();
        System.out.println("조회된 숙소 수: " + accommodations.size());
        return accommodations;
    }
    
    /**
     * 숙소 ID로 조회
     */
    public AccomVO getAccommodationById(Long accomId) {
        return accomDAO.selectAccommodationById(accomId);
    }
    
    /**
     * 숙소 수정
     */
    public void updateAccommodation(AccomVO accom) {
        accomDAO.updateAccommodation(accom);
    }
    
    /**
     * 숙소 삭제
     */
    public void deleteAccommodation(Long accomId) {
        accomDAO.deleteAccommodation(accomId);
    }
}
