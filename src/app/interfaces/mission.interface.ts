export interface Mission {
  id: number;
  name: string;
  author: string;
  terrain: string;
  description: string;
  gametype: string;
  players: string;
  sidecounts: string;
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
}
