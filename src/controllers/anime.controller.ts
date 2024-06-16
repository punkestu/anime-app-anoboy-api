import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { AppService } from '../services/anime.service';
import { Home } from 'src/models/pages.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  get(@Query() query: { page: number }): Promise<Home> {
    if (!parseInt(query.page.toString())) {
      throw new BadRequestException('page is invalid');
    }
    return this.appService.getIndex(query.page);
  }

  @Get('episode')
  getEpisode(@Query() query: { url: string }) {
    if (!query.url) {
      throw new BadRequestException('url is required');
    }
    return this.appService.getEpisode(query.url);
  }
}
