package fs.human.ecospot.user.service;

import fs.human.ecospot.user.dao.UserDAO;
import fs.human.ecospot.user.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.Random;

@Service
public class UserService {

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private JavaMailSender mailSender;

    // 메모리에 인증 코드 저장 (이메일 -> 인증코드와 만료시간)
    private final ConcurrentHashMap<String, VerificationData> verificationCodes = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    private final Random random = new Random();

    // 인증 코드 데이터 저장용 내부 클래스
    private static class VerificationData {
        String code;
        long expireTime;
        
        VerificationData(String code, long expireTime) {
            this.code = code;
            this.expireTime = expireTime;
        }
    }

    public void registerUser(UserVO user) {
        // 비밀번호 해시 처리 (Spring Security)
        String hashedPw = new BCryptPasswordEncoder().encode(user.getUserPassword());
        user.setUserPassword(hashedPw);
        userDAO.insertUser(user);
    }

    /**
     * 6자리 랜덤 인증 코드 생성
     */
    private String generateVerificationCode() {
        return String.format("%06d", random.nextInt(1000000));
    }

    /**
     * 이메일 인증 코드 발송
     */
    public void sendVerificationCode(String email) {
        // 6자리 인증 코드 생성
        String code = generateVerificationCode();
        
        // 10분 후 만료 시간 설정
        long expireTime = System.currentTimeMillis() + (10 * 60 * 1000);
        
        // 기존 코드가 있다면 제거 (중복 방지)
        verificationCodes.remove(email);
        
        // 메모리에 저장
        verificationCodes.put(email, new VerificationData(code, expireTime));
        
        // 10분 후 자동 삭제 스케줄링
        scheduler.schedule(() -> verificationCodes.remove(email), 10, TimeUnit.MINUTES);
        
        // 실제 Gmail을 통한 이메일 발송
        try {
            // 환경변수 상태 확인 및 로그 출력
            System.out.println("=== 이메일 발송 시도 ===");
            System.out.println("받는 사람: " + email);
            System.out.println("인증 코드: " + code);
            System.out.println("발송자 (GMAIL_USERNAME): " + System.getenv("GMAIL_USERNAME"));
            System.out.println("앱 비밀번호 설정 여부: " + (System.getenv("GMAIL_APP_PASSWORD") != null ? "설정됨" : "미설정"));
            
            if (System.getenv("GMAIL_APP_PASSWORD") != null) {
                System.out.println("앱 비밀번호 길이: " + System.getenv("GMAIL_APP_PASSWORD").length() + "자");
            }
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("EchoSpot 이메일 인증 코드");
            message.setText(
                "안녕하세요!\n\n" +
                "EchoSpot 회원가입을 위한 이메일 인증 코드입니다.\n\n" +
                "인증 코드: " + code + "\n\n" +
                "이 코드는 10분간 유효합니다.\n" +
                "감사합니다.\n\n" +
                "- EchoSpot 팀"
            );
            
            System.out.println("메일 발송 중...");
            mailSender.send(message);
            System.out.println("✅ 이메일 발송 성공: " + email);
            System.out.println("====================");
            
        } catch (Exception e) {
            System.err.println("❌ 이메일 발송 실패: " + e.getMessage());
            System.err.println("에러 타입: " + e.getClass().getSimpleName());
            e.printStackTrace(); // 상세한 스택 트레이스 출력
            // 발송 실패 시 저장된 코드 제거
            verificationCodes.remove(email);
            throw new RuntimeException("이메일 발송에 실패했습니다.");
        }
    }

    /**
     * 인증 코드 확인
     */
    public boolean verifyCode(String email, String inputCode) {
        System.out.println("=== 인증 코드 확인 시작 ===");
        System.out.println("이메일: " + email);
        System.out.println("입력된 코드: " + inputCode);
        
        VerificationData data = verificationCodes.get(email);
        
        if (data == null) {
            System.out.println("❌ 저장된 인증 코드가 없음");
            return false; // 인증 코드가 존재하지 않음
        }
        
        System.out.println("저장된 코드: " + data.code);
        System.out.println("현재 시간: " + System.currentTimeMillis());
        System.out.println("만료 시간: " + data.expireTime);
        
        if (System.currentTimeMillis() > data.expireTime) {
            System.out.println("❌ 인증 코드 만료됨");
            verificationCodes.remove(email); // 만료된 코드 삭제
            return false; // 인증 코드가 만료됨
        }
        
        if (data.code.equals(inputCode)) {
            System.out.println("✅ 인증 코드 일치");
            verificationCodes.remove(email); // 인증 성공 후 코드 삭제
            return true; // 인증 성공
        }
        
        System.out.println("❌ 인증 코드 불일치");
        return false; // 인증 코드가 일치하지 않음
    }

    /**
     * 비밀번호 찾기용 인증 코드 확인 (코드 삭제하지 않음)
     */
    public boolean verifyPasswordResetCode(String email, String inputCode) {
        System.out.println("=== 비밀번호 찾기 인증 코드 확인 시작 ===");
        System.out.println("이메일: " + email);
        System.out.println("입력된 코드: " + inputCode);
        
        VerificationData data = verificationCodes.get(email);
        
        if (data == null) {
            System.out.println("❌ 저장된 인증 코드가 없음");
            return false; // 인증 코드가 존재하지 않음
        }
        
        System.out.println("저장된 코드: " + data.code);
        System.out.println("현재 시간: " + System.currentTimeMillis());
        System.out.println("만료 시간: " + data.expireTime);
        
        if (System.currentTimeMillis() > data.expireTime) {
            System.out.println("❌ 인증 코드 만료됨");
            verificationCodes.remove(email); // 만료된 코드 삭제
            return false; // 인증 코드가 만료됨
        }
        
        if (data.code.equals(inputCode)) {
            System.out.println("✅ 인증 코드 일치 (코드 유지)");
            // 코드 삭제하지 않음! 비밀번호 변경에서 사용해야 함
            return true; // 인증 성공
        }
        
        System.out.println("❌ 인증 코드 불일치");
        return false; // 인증 코드가 일치하지 않음
    }

    /**
     * 비밀번호 변경 시 인증 코드 확인 및 삭제
     */
    public boolean verifyAndConsumeCode(String email, String inputCode) {
        System.out.println("=== 비밀번호 변경 인증 코드 확인 및 삭제 ===");
        System.out.println("이메일: " + email);
        System.out.println("입력된 코드: " + inputCode);
        
        VerificationData data = verificationCodes.get(email);
        
        if (data == null) {
            System.out.println("❌ 저장된 인증 코드가 없음");
            return false;
        }
        
        if (System.currentTimeMillis() > data.expireTime) {
            System.out.println("❌ 인증 코드 만료됨");
            verificationCodes.remove(email);
            return false;
        }
        
        if (data.code.equals(inputCode)) {
            System.out.println("✅ 인증 코드 일치 - 코드 삭제");
            verificationCodes.remove(email); // 사용 후 삭제
            return true;
        }
        
        System.out.println("❌ 인증 코드 불일치");
        return false;
    }

    /**
     * 이메일 존재 여부 확인
     */
    public boolean isEmailExists(String email) {
        try {
            // 이메일로 사용자 조회 시도
            UserVO user = userDAO.findByEmail(email);
            return user != null;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 비밀번호 찾기용 이메일 인증 코드 발송
     */
    public void sendPasswordResetCode(String email) {
        // 6자리 인증 코드 생성
        String code = generateVerificationCode();
        
        // 10분 후 만료 시간 설정
        long expireTime = System.currentTimeMillis() + (10 * 60 * 1000);
        
        // 기존 코드가 있다면 제거 (중복 방지)
        verificationCodes.remove(email);
        
        // 메모리에 저장
        verificationCodes.put(email, new VerificationData(code, expireTime));
        
        // 10분 후 자동 삭제 스케줄링
        scheduler.schedule(() -> verificationCodes.remove(email), 10, TimeUnit.MINUTES);
        
        // 실제 Gmail을 통한 이메일 발송
        try {
            System.out.println("=== 비밀번호 찾기 인증 코드 발송 ===");
            System.out.println("받는 사람: " + email);
            System.out.println("인증 코드: " + code);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("EchoSpot 비밀번호 재설정 인증 코드");
            message.setText(
                "안녕하세요!\n\n" +
                "EchoSpot 비밀번호 재설정을 위한 이메일 인증 코드입니다.\n\n" +
                "인증 코드: " + code + "\n\n" +
                "이 코드는 10분간 유효합니다.\n" +
                "본인이 요청하지 않았다면 이 메일을 무시해주세요.\n\n" +
                "감사합니다.\n\n" +
                "- EchoSpot 팀"
            );
            
            mailSender.send(message);
            System.out.println("✅ 비밀번호 찾기 인증 코드 발송 성공");
            
        } catch (Exception e) {
            System.err.println("❌ 비밀번호 찾기 인증 코드 발송 실패: " + e.getMessage());
            e.printStackTrace();
            verificationCodes.remove(email);
            throw new RuntimeException("인증 코드 발송에 실패했습니다.");
        }
    }

    /**
     * 임시 비밀번호 생성 및 DB 업데이트
     */
    public String generateAndUpdateTempPassword(String email) {
        // 8자리 임시 비밀번호 생성
        String tempPassword = generateTempPassword();
        
        // 비밀번호 해시 처리
        String hashedPassword = new BCryptPasswordEncoder().encode(tempPassword);
        
        try {
            // DB에서 사용자 비밀번호 업데이트
            userDAO.updatePassword(email, hashedPassword);
            System.out.println("✅ 임시 비밀번호 DB 업데이트 성공: " + email);
            
            return tempPassword; // 원본 비밀번호 반환 (사용자에게 알려주기 위해)
            
        } catch (Exception e) {
            System.err.println("❌ 임시 비밀번호 DB 업데이트 실패: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("임시 비밀번호 설정에 실패했습니다.");
        }
    }

    /**
     * 8자리 임시 비밀번호 생성
     */
    private String generateTempPassword() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder result = new StringBuilder();
        
        for (int i = 0; i < 8; i++) {
            result.append(characters.charAt(random.nextInt(characters.length())));
        }
        
        return result.toString();
    }

    /**
     * 비밀번호 업데이트 (이메일 인증 후 새 비밀번호 설정)
     */
    public void updatePassword(String email, String newPassword) {
        // 비밀번호 해시 처리
        String hashedPassword = new BCryptPasswordEncoder().encode(newPassword);
        
        try {
            // DB에서 사용자 비밀번호 업데이트
            userDAO.updatePassword(email, hashedPassword);
            System.out.println("✅ 비밀번호 업데이트 성공: " + email);
            
        } catch (Exception e) {
            System.err.println("❌ 비밀번호 업데이트 실패: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("비밀번호 변경에 실패했습니다.");
        }
    }

    /**
     * 로그인 검증
     */
    public boolean login(String email, String password) {
        try {
            System.out.println("=== 로그인 검증 시작 ===");
            System.out.println("이메일: " + email);
            
            // 1. 이메일로 사용자 조회
            UserVO user = userDAO.findByEmail(email);
            
            if (user == null) {
                System.out.println("❌ 사용자를 찾을 수 없음: " + email);
                return false;
            }
            
            System.out.println("✅ 사용자 조회 성공: " + email);
            System.out.println("DB 해시값: " + user.getUserPassword());
            
            // 2. 비밀번호 검증
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            boolean isPasswordMatch = encoder.matches(password, user.getUserPassword());
            
            if (isPasswordMatch) {
                System.out.println("✅ 비밀번호 일치");
                return true;
            } else {
                System.out.println("❌ 비밀번호 불일치");
                return false;
            }
            
        } catch (Exception e) {
            System.err.println("❌ 로그인 검증 중 오류: " + e.getMessage());
            e.printStackTrace();
            return false;
        }


    }

    public UserVO findUserByEmail(String email) {
        return userDAO.findByEmail(email);
    }
}
