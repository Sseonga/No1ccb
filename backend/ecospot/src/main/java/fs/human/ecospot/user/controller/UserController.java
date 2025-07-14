package fs.human.ecospot.user.controller;

import fs.human.ecospot.user.service.UserService;
import fs.human.ecospot.user.vo.UserVO;
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
}
