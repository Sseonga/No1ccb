package fs.human.ecospot.accommodationPanel.controller;

import fs.human.ecospot.accommodationPanel.service.AccomService;
import fs.human.ecospot.accommodationPanel.vo.AccommodationVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

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
}
