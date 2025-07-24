package fs.human.ecospot.common.dao;

import fs.human.ecospot.common.dto.CodeDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CodeDAO {
    List<CodeDTO> findAllCodes();

    List<CodeDTO> findByCodeId(@Param("codeId") String codeId);
}
