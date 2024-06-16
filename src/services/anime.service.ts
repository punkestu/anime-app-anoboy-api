import { Injectable } from '@nestjs/common';
import { Episode } from 'src/models/episode.model';
import { Home } from 'src/models/pages.model';
import animeRepo from 'src/repositories/anime.repo';
import episodeRepo from 'src/repositories/episode.repo';

@Injectable()
export class AppService {
  async getIndex(page: number = 1): Promise<Home> {
    return animeRepo.getHome(page);
  }
  async getEpisode(url: string): Promise<Episode> {
    return episodeRepo.getEpisode(url);
  }
}
