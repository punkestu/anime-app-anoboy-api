import { AnimeList } from './anime.model';

export interface PagedAnime {
  list: AnimeList;
  currentPage: number;
  totalPages: number;
}

export interface MoreList {
  list: AnimeList;
  moreUrl: string;
}

export interface Home {
  newsUpdate: PagedAnime;
  // movies: MoreList;
  // liveActions: MoreList;
  // newAdded: MoreList;
}
