export interface Anime {
  url: string;
  title: string;
  thumbnail: string;
  description: string;
  episodes: AnimeList;
  recomendation: AnimeList;
}
export interface AnimeSummary {
  url: string;
  title: string;
  thumbnail: string;
}
export interface AnimeList {
  data: AnimeSummary[];
}
