export interface Mission {
  id: number;
  name: string;
  author: string;
  terrain: string;
  description: string;
  gametype: string;
  players: string;
  sidecounts: string;
  jsonlink: string;
  jsondata?: string | null;
}

export interface MissionStatistics {
  events: MissionEvent[];
  sessions?: any[];
  summary: {
    totalEvents: number;
    playerCount: number;
    totalKills?: number;
    eventTypes?: { [key: string]: number };
    mostActivePlayer?: string;
    playerWithMostKills?: string;
    duration?: string;
    outcome?: string;
  };
}

export interface MissionEvent {
  timestamp: string;
  type: string;
  description: string;
  player?: string;
  location?: string;
  details?: any;
}

export interface MissionsResponse {
  success: boolean;
  missions: Mission[];
  total_count: number;
  current_page: number;
  total_pages: number;
  limit: number;
  offset: number;
}

export interface MissionFilters {
  limit?: number;
  offset?: number;
  gametype?: string;
  terrain?: string;
  author?: string;
  search?: string;
  sort?: 'asc' | 'desc';
}
