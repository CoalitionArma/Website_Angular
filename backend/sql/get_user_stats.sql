-- Stored procedure to get user statistics from coalition.a4stats table
-- joined with reforgerjs.playerstats for vanilla engine-tracked stats.
-- This procedure takes an ARMA GUID and returns the combined player statistics.
-- 
-- Data sources:
--   coalition.a4stats       - Coalition-specific stats (kills, attendance, role stats, FF events)
--   reforgerjs.playerstats  - Vanilla engine stats (shots, distance, medical, XP, bans, etc.)
--                             Written by the Reforger.js bot from .playersave profile files.
-- Link key: coalition.a4stats.guid = reforgerjs.playerstats.playerUID

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

    SELECT 
        -- Identity
        a.id,
        a.steamid,
        a.name,
        a.guid,

        -- Kill / death stats (coalition-tracked, faction-aware)
        a.tvt_kills AS kills,
        a.tvt_deaths AS deaths,
        CASE
            WHEN a.tvt_deaths = 0 THEN a.tvt_kills
            ELSE ROUND(a.tvt_kills / a.tvt_deaths, 2)
        END AS kd_ratio,
        a.tvt_kdr,

        -- AI combat (vanilla engine — reforgerjs.playerstats)
        ps.ai_kills,
        ps.ai_roadkills,
        ps.friendly_ai_kills,
        ps.friendly_ai_roadkills,
        CASE
            WHEN COALESCE(ps.deaths, 0) = 0 THEN COALESCE(ps.ai_kills, 0)
            ELSE ROUND(COALESCE(ps.ai_kills, 0) / ps.deaths, 2)
        END AS coop_kdr,

        -- Marksmanship (vanilla engine — reforgerjs.playerstats)
        ps.shots AS shots_fired,
        CASE
            WHEN COALESCE(ps.shots, 0) = 0 THEN 0
            ELSE ROUND((a.tvt_kills / ps.shots) * 100, 2)
        END AS accuracy_percentage,
        ps.grenades_thrown,

        -- Movement (vanilla engine)
        ps.distance_walked,
        ps.distance_driven,
        ps.distance_as_occupant,

        -- Medical (vanilla engine — sum of all medical actions on friendlies)
        ps.bandage_friendlies,
        ps.bandage_self,
        ps.saline_friendlies,
        ps.saline_self,
        ps.morphine_friendlies,
        ps.morphine_self,
        ps.tourniquet_friendlies,
        ps.tourniquet_self,
        (
            COALESCE(ps.bandage_friendlies, 0) +
            COALESCE(ps.saline_friendlies,  0) +
            COALESCE(ps.morphine_friendlies, 0) +
            COALESCE(ps.tourniquet_friendlies, 0)
        ) AS healing_done,

        -- Session / experience (vanilla engine)
        ps.session_duration,
        ps.level,
        ps.level_experience,

        -- Vehicles (vanilla engine)
        ps.roadkills,
        ps.players_died_in_vehicle,
        ps.points_as_driver_of_players,

        -- Conduct (coalition-tracked)
        a.ff_events AS friendly_fire_events,
        a.civs_killed AS civilians_killed,
        a.leaves AS disconnections,
        a.connections,
        a.missions_attended,

        -- Ban tracking (vanilla engine)
        ps.warcrimes,
        ps.kick_streak,
        ps.kick_session_duration,
        ps.lightban_streak,
        ps.lightban_session_duration,
        ps.heavyban_streak,
        ps.heavyban_kick_session_duration,

        -- Ranking (coalition.a4stats only)
        -- Only players with more than 5 missions_attended are included in the ranked pool.
        -- rank_position counts how many ranked players have a higher tvt_kdr than this player.
        (SELECT COUNT(*) FROM coalition.a4stats WHERE missions_attended > 5) AS total_players,
        (
            SELECT COUNT(*) + 1
            FROM coalition.a4stats s2
            WHERE s2.missions_attended > 5
            AND s2.tvt_kdr > a.tvt_kdr
        ) AS rank_position

    FROM coalition.a4stats a
    LEFT JOIN reforgerjs.playerstats ps ON ps.playerUID = a.guid
    WHERE a.guid = p_arma_guid;

END$$

DELIMITER ;
