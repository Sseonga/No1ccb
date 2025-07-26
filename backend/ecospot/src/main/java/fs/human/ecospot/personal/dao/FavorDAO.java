package fs.human.ecospot.personal.dao;

import fs.human.ecospot.personal.dto.FavorResponseDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface FavorDAO {
    void insertFavorite(@Param("userId") Long userId, @Param("targetId") Long targetId, @Param("favorTypeCd") String favorTypeCd);

    void deleteFavorite(@Param("userId") Long userId, @Param("targetId") Long targetId, @Param("favorTypeCd") String favorTypeCd);

    int existsFavorite(@Param("userId") Long userId,
                       @Param("favorTypeCd") String favorTypeCd,
                       @Param("targetId") Long targetId);

    List<FavorResponseDto> selectFavoritesByUserId(@Param("userId") Long userId);
}
