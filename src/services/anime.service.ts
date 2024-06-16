import { Injectable } from '@nestjs/common';
import { Home } from 'src/models/pages.model';
import animeRepo from 'src/repositories/anime.repo';

@Injectable()
export class AppService {
  async getIndex(page: number = 1): Promise<Home> {
    return animeRepo.getHome(page);
  }
}
