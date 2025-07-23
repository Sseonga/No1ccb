package fs.human.ecospot.location.dao;

import fs.human.ecospot.location.vo.AccomVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AccomDAO {
    
    /**
     * 숙소 추가
     */
    void insertAccommodation(AccomVO accom);
    
    /**
     * 모든 숙소 목록 조회
     */
    List<AccomVO> selectAllAccommodations();
    
    /**
     * 숙소 ID로 조회
     */
    AccomVO selectAccommodationById(Long accomId);
    
    /**
     * 숙소 수정
     */
    void updateAccommodation(AccomVO accom);
    
    /**
     * 숙소 삭제
     */
    void deleteAccommodation(Long accomId);
}
