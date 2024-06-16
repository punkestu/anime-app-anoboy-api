export interface Anime {
  title: string;
  thumbnail: string;
  description: string;
  episodes: AnimeList;
  recomendation: AnimeList;
  currentPage: number;
  totalPages: number;
}
export interface AnimeSummary {
  url: string;
  title: string;
  thumbnail: string;
}
export interface AnimeList {
  data: AnimeSummary[];
}
