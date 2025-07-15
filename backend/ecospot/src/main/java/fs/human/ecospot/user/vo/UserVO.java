package fs.human.ecospot.user.vo;

import lombok.Data;

@Data
public class UserVO {
    private Long userId;
    private String userEmail;
    private String userPassword;
    private String isAdmin;
    private String createdId;
    private String updatedId;
    private String emailVerified;  // 이메일 인증 상태 ('Y' 또는 'N')
}
