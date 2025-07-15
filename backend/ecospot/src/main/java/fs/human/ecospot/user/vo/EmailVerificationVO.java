package fs.human.ecospot.user.vo;

import lombok.Data;

/**
 * 이메일 인증 관련 데이터 전송 객체
 */
@Data
public class EmailVerificationVO {
    private String email;            // 인증할 이메일 주소
    private String verificationCode; // 인증 코드
    private String message;          // 응답 메시지
}
