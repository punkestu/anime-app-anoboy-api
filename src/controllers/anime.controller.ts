import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from '../services/anime.service';
import { Home } from 'src/models/pages.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  get(): Promise<Home> {
    return this.appService.getIndex();
  }

  @Get('episode')
  getEpisode(@Query() query: { url: string }) {
    if (!query.url) {
      throw new Error('url is required');
    }
    return this.appService.getEpisode(query.url);
  }
}
