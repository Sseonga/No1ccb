package fs.human.ecospot.user.service;

import fs.human.ecospot.user.dao.UserDAO;
import fs.human.ecospot.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserDAO userDAO;

    public void registerUser(UserVO user) {
        // 비밀번호 해시 처리 (Spring Security)
        String hashedPw = new BCryptPasswordEncoder().encode(user.getUserPassword());
        user.setUserPassword(hashedPw);
        userDAO.insertUser(user);
    }
}
