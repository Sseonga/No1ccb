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
}
