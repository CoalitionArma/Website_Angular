-- Stored procedure to get user statistics from coalition.a4stats table
-- This procedure takes an ARMA GUID and returns the user's ARMA 4 statistics

DELIMITER $$

DROP PROCEDURE IF EXISTS GetUserA4Stats$$

CREATE PROCEDURE GetUserA4Stats(
    IN p_arma_guid VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    -- Get user statistics from a4stats table
    -- Using actual column names from the a4stats table
    SELECT 
        id,
        steamid,
        name,
        guid,
        tvt_kills as kills,
        tvt_deaths as deaths,
        CASE 
            WHEN tvt_deaths = 0 THEN tvt_kills 
            ELSE ROUND(tvt_kills / tvt_deaths, 2) 
        END as kd_ratio,
        tvt_kdr,
        ai_kills,
        ai_deaths,
        coop_kdr,
        shots_fired,
        CASE 
            WHEN shots_fired = 0 THEN 0 
            ELSE ROUND((tvt_kills / shots_fired) * 100, 2) 
        END as accuracy_percentage,
        ff_events as friendly_fire_events,
        grenades_thrown,
        civs_killed as civilians_killed,
        leaves as disconnections,
        connections,
        -- Add ranking data to the same result set
        (SELECT COUNT(*) FROM coalition.a4stats) as total_players,
        (
            SELECT COUNT(*) + 1 
            FROM coalition.a4stats s2 
            WHERE s2.tvt_kdr > (
                SELECT tvt_kdr 
                FROM coalition.a4stats s3
                WHERE s3.guid = p_arma_guid
                AND s2.connections > 5
            )
        ) as rank_position
    FROM coalition.a4stats 
    WHERE guid = p_arma_guid;

END$$

DELIMITER ;
