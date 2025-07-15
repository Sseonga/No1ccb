package fs.human.ecospot.user.vo;

import lombok.Data;

/**
 * 로그인 관련 데이터 전송 객체
 */
@Data
public class LoginVO {
    private String email;       // 로그인 이메일
    private String password;    // 로그인 비밀번호
}
