package fs.human.ecospot.user.vo;

import lombok.Data;

/**
 * 비밀번호 변경 관련 데이터 전송 객체
 */
@Data
public class PasswordChangeVO {
    private String email;            // 사용자 이메일
    private String verificationCode; // 인증 코드
    private String newPassword;      // 새 비밀번호
}
