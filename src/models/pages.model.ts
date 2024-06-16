import { AnimeList } from './anime.model';

export interface NewsUpdate {
  list: AnimeList;
  currentPage: number;
  totalPages: number;
}

export interface MoreList {
  list: AnimeList;
  moreUrl: string;
}

export interface Home {
  newsUpdate: NewsUpdate;
  movies: MoreList;
  liveActions: MoreList;
  newAdded: MoreList;
}
