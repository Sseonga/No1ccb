package fs.human.ecospot.personal.controller;

import fs.human.ecospot.personal.dto.FavorRequestDto;
import fs.human.ecospot.personal.service.FavorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import fs.human.ecospot.personal.dto.FavorResponseDto;

@RestController
@RequestMapping("/api/favor")
@CrossOrigin(origins = "http://localhost:3000")
public class FavorController {

    @Autowired
    private FavorService favorService;

    @PostMapping
    public ResponseEntity<?> addFavorite(@RequestBody FavorRequestDto dto) {
        // 숙소인지 충전소인지 구분
        if ("ACCOM_01".equals(dto.getOperatorId())) {
            favorService.addAccommodationFavorite(dto.getUserId(), dto.getStationId());
        } else {
            favorService.addFavorite(dto);
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<?> removeFavorite(@RequestBody FavorRequestDto dto) {
        // 숙소인지 충전소인지 구분
        if ("ACCOM_01".equals(dto.getOperatorId())) {
            favorService.removeAccommodationFavorite(dto.getUserId(), dto.getStationId());
        } else {
            favorService.removeFavorite(dto);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/exist")
    public ResponseEntity<?> checkFavoriteExist(
            @RequestParam Long userId,
            @RequestParam Long stationId,
            @RequestParam(required = false) String type
    ) {
        boolean exists;
        if ("accommodation".equals(type)) {
            exists = favorService.isAccommodationFavorited(userId, stationId);
        } else {
            exists = favorService.isStationFavorited(userId, stationId);
        }
        return ResponseEntity.ok(Map.of("favorited", exists));
    }

    @GetMapping
    public ResponseEntity<?> getFavorites(@RequestParam Long userId) {
        List<FavorResponseDto> list = favorService.getFavoritesByUserId(userId);
        return ResponseEntity.ok(list);
    }
}
