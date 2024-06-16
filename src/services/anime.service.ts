import { Injectable } from '@nestjs/common';
import { Anime } from 'src/models/anime.model';
import { Episode } from 'src/models/episode.model';
import { Home, PagedAnime } from 'src/models/pages.model';
import animeRepo from 'src/repositories/anime.repo';
import episodeRepo from 'src/repositories/episode.repo';

@Injectable()
export class AppService {
  async getIndex(page: number = 1): Promise<Home> {
    return animeRepo.getHome(page);
  }
  async searchAnime(search: string, page: number = 1): Promise<PagedAnime> {
    return animeRepo.search(search, page);
  }
  async getDetail(url: string, page: number = 1): Promise<Anime> {
    return animeRepo.getDetail(url, page);
  }
  async getEpisode(url: string): Promise<Episode> {
    return episodeRepo.getEpisode(url);
  }
}
