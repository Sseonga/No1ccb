package fs.human.ecospot.user.dao;

import fs.human.ecospot.user.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserDAO {
    void insertUser(UserVO user);
}
