package fs.human.ecospot.user.dao;

import fs.human.ecospot.user.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserDAO {
    void insertUser(UserVO user);
    
    /**
     * 이메일로 사용자 조회
     */
    UserVO findByEmail(String email);
    
    /**
     * 사용자 비밀번호 업데이트
     */
    void updatePassword(String email, String hashedPassword);
}
