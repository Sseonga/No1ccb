package fs.human.ecospot.personal.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface FavorDAO {
    void insertFavorite(Long userId, Long stationId);

    void deleteFavorite(Long userId, Long stationId);

    int existsFavorite(@Param("userId") Long userId,
                       @Param("favorTypeCd") String favorTypeCd,
                       @Param("targetId") Long targetId);
}
