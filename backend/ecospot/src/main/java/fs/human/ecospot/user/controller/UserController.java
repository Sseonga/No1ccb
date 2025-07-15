package fs.human.ecospot.user.controller;

import fs.human.ecospot.user.service.UserService;
import fs.human.ecospot.user.vo.UserVO;
import fs.human.ecospot.user.vo.EmailVerificationVO;
import fs.human.ecospot.user.vo.PasswordChangeVO;
import fs.human.ecospot.user.vo.LoginVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody UserVO user) {
        try {
            userService.registerUser(user);
            return ResponseEntity.ok("가입성공");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "가입 실패"));
        }
    }

    /**
     * 이메일 인증 코드 발송 API
     */
    @PostMapping("/send-verification")
    public ResponseEntity<?> sendVerificationCode(@RequestBody EmailVerificationVO request) {
        try {
            userService.sendVerificationCode(request.getEmail());
            return ResponseEntity.ok(Map.of("message", "인증 코드가 발송되었습니다."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "인증 코드 발송에 실패했습니다."));
        }
    }

    /**
     * 이메일 인증 코드 확인 API
     */
    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody EmailVerificationVO request) {
        try {
            boolean isValid = userService.verifyCode(request.getEmail(), request.getVerificationCode());
            
            if (isValid) {
                return ResponseEntity.ok(Map.of("message", "이메일 인증이 완료되었습니다."));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "인증 코드가 올바르지 않거나 만료되었습니다."));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "인증 코드 확인에 실패했습니다."));
        }
    }

    /**
     * 비밀번호 찾기용 이메일 인증 코드 발송 API
     */
    @PostMapping("/send-password-reset-code")
    public ResponseEntity<?> sendPasswordResetCode(@RequestBody EmailVerificationVO request) {
        try {
            System.out.println("=== 비밀번호 찾기 인증 코드 발송 요청 ===");
            System.out.println("요청 이메일: " + request.getEmail());
            
            // 1. 이메일이 가입된 계정인지 확인
            if (!userService.isEmailExists(request.getEmail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "가입되지 않은 이메일입니다."));
            }
            
            // 2. 인증 코드 발송
            userService.sendPasswordResetCode(request.getEmail());
            
            return ResponseEntity.ok(Map.of("message", "비밀번호 재설정 코드가 발송되었습니다."));
            
        } catch (Exception e) {
            System.err.println("비밀번호 찾기 인증 코드 발송 실패: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "인증 코드 발송에 실패했습니다."));
        }
    }

    /**
     * 비밀번호 찾기용 인증 코드 확인 API
     */
    @PostMapping("/verify-password-reset-code")
    public ResponseEntity<?> verifyPasswordResetCode(@RequestBody EmailVerificationVO request) {
        try {
            System.out.println("=== 비밀번호 찾기 인증 코드 확인 요청 ===");
            System.out.println("요청 이메일: " + request.getEmail());
            System.out.println("인증 코드: " + request.getVerificationCode());
            
            boolean isValid = userService.verifyCode(request.getEmail(), request.getVerificationCode());
            
            if (isValid) {
                return ResponseEntity.ok(Map.of("message", "인증 코드가 확인되었습니다."));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "인증 코드가 올바르지 않거나 만료되었습니다."));
            }
        } catch (Exception e) {
            System.err.println("비밀번호 찾기 인증 코드 확인 실패: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "인증 코드 확인에 실패했습니다."));
        }
    }

    /**
     * 임시 비밀번호 생성 및 설정 API
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody EmailVerificationVO request) {
        try {
            System.out.println("=== 임시 비밀번호 설정 요청 ===");
            System.out.println("요청 이메일: " + request.getEmail());
            
            // 1. 인증 코드 재확인
            boolean isValid = userService.verifyCode(request.getEmail(), request.getVerificationCode());
            
            if (!isValid) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "인증 코드가 올바르지 않거나 만료되었습니다."));
            }
            
            // 2. 임시 비밀번호 생성 및 DB 업데이트
            String tempPassword = userService.generateAndUpdateTempPassword(request.getEmail());
            
            return ResponseEntity.ok(Map.of(
                "message", "임시 비밀번호가 설정되었습니다.",
                "tempPassword", tempPassword
            ));
            
        } catch (Exception e) {
            System.err.println("임시 비밀번호 설정 실패: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "임시 비밀번호 설정에 실패했습니다."));
        }
    }

    /**
     * 비밀번호 변경 API (이메일 인증 후 새 비밀번호 설정)
     */
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeVO request) {
        try {
            System.out.println("=== 비밀번호 변경 요청 ===");
            System.out.println("요청 이메일: " + request.getEmail());
            System.out.println("인증 코드: " + request.getVerificationCode());
            
            // 1. 인증 코드 확인
            boolean isValid = userService.verifyCode(request.getEmail(), request.getVerificationCode());
            
            if (!isValid) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "인증 코드가 올바르지 않거나 만료되었습니다."));
            }
            
            // 2. 새 비밀번호로 변경
            userService.updatePassword(request.getEmail(), request.getNewPassword());
            
            return ResponseEntity.ok(Map.of("message", "비밀번호가 성공적으로 변경되었습니다."));
            
        } catch (Exception e) {
            System.err.println("비밀번호 변경 실패: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "비밀번호 변경에 실패했습니다."));
        }
    }

    /**
     * 로그인 API
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginVO request) {
        try {
            System.out.println("=== 로그인 시도 ===");
            System.out.println("이메일: " + request.getEmail());
            
            // 로그인 검증
            boolean isValid = userService.login(request.getEmail(), request.getPassword());
            
            if (isValid) {
                return ResponseEntity.ok(Map.of(
                    "message", "로그인 성공",
                    "email", request.getEmail()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "이메일 또는 비밀번호가 올바르지 않습니다."));
            }
            
        } catch (Exception e) {
            System.err.println("로그인 실패: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "로그인 처리 중 오류가 발생했습니다."));
        }
    }
}
