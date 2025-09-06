export interface ReplayFile {
  filename: string;
  name: string;
  extension: string;
  size: number;
  sizeFormatted: string;
  dateModified: string;
  downloadUrl: string;
}

export interface ReplaysResponse {
  success: boolean;
  replays: ReplayFile[];
  total_count: number;
  directory: string;
  base_url: string;
}
