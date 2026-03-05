/**
 * Combined player stats from two sources:
 *   coalition.a4stats       – coalition-specific tracking (kills, attendance, FF)
 *   reforgerjs.playerstats  – vanilla engine stats (shots, distance, medical, XP, bans)
 * Joined by guid = playerUID in GetUserA4Stats stored procedure.
 * Fields from reforgerjs.playerstats may be null if the vanilla bot hasn't
 * written a record for this player yet.
 */
export interface UserStats {
  // Identity
  id: number;
  steamid: string;
  name: string;
  guid: string;

  // Kill / death (coalition-tracked, faction-aware)
  kills: number;           // tvt_kills
  deaths: number;          // tvt_deaths
  kd_ratio: number;
  tvt_kdr: number;
  missions_attended: number;
  total_missions_attended: number;

  // AI combat (reforgerjs.playerstats)
  ai_kills: number | null;
  ai_roadkills: number | null;
  friendly_ai_kills: number | null;
  friendly_ai_roadkills: number | null;
  coop_kdr: number | null;

  // Marksmanship (reforgerjs.playerstats)
  shots_fired: number | null;
  accuracy_percentage: number | null;
  grenades_thrown: number | null;

  // Movement (reforgerjs.playerstats)
  distance_walked: number | null;
  distance_driven: number | null;
  distance_as_occupant: number | null;

  // Medical (reforgerjs.playerstats)
  bandage_friendlies: number | null;
  bandage_self: number | null;
  saline_friendlies: number | null;
  saline_self: number | null;
  morphine_friendlies: number | null;
  morphine_self: number | null;
  tourniquet_friendlies: number | null;
  tourniquet_self: number | null;
  healing_done: number | null;  // sum of all medical actions on friendlies

  // Session / experience (reforgerjs.playerstats)
  session_duration: number | null;
  level: number | null;
  level_experience: number | null;

  // Vehicles (reforgerjs.playerstats)
  roadkills: number | null;
  players_died_in_vehide: number | null;       // NB: column has a typo in reforgerjs.playerstats
  points_as_driver_of_players: number | null;

  // Conduct (coalition-tracked)
  friendly_fire_events: number;  // ff_events
  civilians_killed: number;      // civs_killed
  disconnections: number;        // leaves
  connections: number;

  // Ban tracking (reforgerjs.playerstats)
  warcrimes: number | null;
  kick_streak: number | null;
  kick_session_duration: number | null;
  lightban_streak: number | null;
  lightban_session_duration: number | null;
  heavyban_streak: number | null;
  heavyban_kick_session_duration: number | null;
}

export interface UserRanking {
  total_players: number;
  rank_position: number;
}

export interface UserStatsResponse {
  success: boolean;
  stats: UserStats;
  ranking: UserRanking | null;
  timestamp: string;
}

