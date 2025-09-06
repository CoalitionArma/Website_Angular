DELIMITER $$

DROP PROCEDURE IF EXISTS GetMissionsList;

CREATE PROCEDURE GetMissionsList(
    IN p_limit INT,
    IN p_offset INT,
    IN p_gametype VARCHAR(255),
    IN p_terrain VARCHAR(255),
    IN p_author VARCHAR(255),
    IN p_search_term VARCHAR(255)
)
BEGIN
    -- Set default values for parameters
    IF p_limit IS NULL THEN
        SET p_limit = 50;
    END IF;
    
    IF p_offset IS NULL THEN
        SET p_offset = 0;
    END IF;

    -- Get filtered list of missions with optional pagination and filtering
    SELECT 
        m.id,
        m.name,
        m.author,
        m.terrain,
        m.details,
        m.gametype,
        m.players,
        m.sidecounts,
        m.jsonlink,
        m.jsondata,
        -- Count total missions for pagination
        (SELECT COUNT(*) 
         FROM coalition.a4missions m2 
         WHERE 
            (p_gametype IS NULL OR m2.gametype = p_gametype)
            AND (p_terrain IS NULL OR m2.terrain = p_terrain)
            AND (p_author IS NULL OR m2.author = p_author)
            AND (p_search_term IS NULL OR 
                 m2.name LIKE CONCAT('%', p_search_term, '%') OR 
                 m2.details LIKE CONCAT('%', p_search_term, '%'))
        ) as total_count
    FROM coalition.a4missions m
    WHERE 
        (p_gametype IS NULL OR m.gametype = p_gametype)
        AND (p_terrain IS NULL OR m.terrain = p_terrain)
        AND (p_author IS NULL OR m.author = p_author)
        AND (p_search_term IS NULL OR 
             m.name LIKE CONCAT('%', p_search_term, '%') OR 
             m.details LIKE CONCAT('%', p_search_term, '%'))
    ORDER BY m.name ASC
    LIMIT p_offset, p_limit;

END$$

DELIMITER ;
