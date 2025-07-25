package fs.human.ecospot.personal.controller;

import fs.human.ecospot.personal.dto.FavorRequestDto;
import fs.human.ecospot.personal.service.FavorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/favor")
@CrossOrigin(origins = "http://localhost:3000")
public class FavorController {

    @Autowired
    private FavorService favorService;

    @PostMapping
    public ResponseEntity<?> addFavorite(@RequestBody FavorRequestDto dto) {
        favorService.addFavorite(dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<?> removeFavorite(@RequestBody FavorRequestDto dto) {
        favorService.removeFavorite(dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/exist")
    public ResponseEntity<?> checkFavoriteExist(
            @RequestParam Long userId,
            @RequestParam Long stationId
    ) {
        boolean exists = favorService.isStationFavorited(userId, stationId);
        return ResponseEntity.ok(Map.of("favorited", exists));
    }
}
