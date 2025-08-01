export interface UserStats {
  id: number;
  steamid: string;
  name: string;
  guid: string;
  kills: number; // tvt_kills
  deaths: number; // tvt_deaths
  kd_ratio: number;
  tvt_kdr: number;
  ai_kills: number;
  ai_deaths: number;
  coop_kdr: number;
  shots_fired: number;
  accuracy_percentage: number; // calculated: (kills / shots_fired) * 100
  friendly_fire_events: number; // ff_events
  grenades_thrown: number;
  civilians_killed: number; // civs_killed
  disconnections: number; // leaves
  connections: number;
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
