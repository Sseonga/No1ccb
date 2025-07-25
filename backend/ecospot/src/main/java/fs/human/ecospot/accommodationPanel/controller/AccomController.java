package fs.human.ecospot.accommodationPanel.controller;

import fs.human.ecospot.accommodationPanel.service.AccomService;
import fs.human.ecospot.accommodationPanel.vo.AccommodationVO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accommodation")
public class AccomController {
    private final AccomService accomService;

    public AccomController(AccomService accomService) {
        this.accomService = accomService;
    }

    @GetMapping
    public List<AccommodationVO> getAccomList() {
        return accomService.getAccomList();
    }

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addAccommodation(@RequestBody AccommodationVO accommodation) {
        int inserted = accomService.insertAccommodation(accommodation);

        Map<String, Object> result = new HashMap<>();
        result.put("success", inserted > 0);
        result.put("insertedCount", inserted);

        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @DeleteMapping("/{accomId}")
    public ResponseEntity<Map<String, Object>> deleteAccommodation(@PathVariable Long accomId) {
        int deleted = accomService.deleteAccommodation(accomId);
        Map<String, Object> result = new HashMap<>();
        result.put("success", deleted > 0);
        result.put("deletedCount", deleted);

        return ResponseEntity.ok(result);
    }
}
