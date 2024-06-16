import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { AppService } from '../services/anime.service';
import { Home } from 'src/models/pages.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  get(@Query() query: { page: number }): Promise<Home> {
    if (query.page && !parseInt(query.page.toString())) {
      throw new BadRequestException('page is invalid');
    }
    return this.appService.getIndex(query.page);
  }

  @Get('search/:search')
  search(
    @Query() query: { page: number },
    @Param() params: { search: string },
  ) {
    if (query.page && !parseInt(query.page.toString())) {
      throw new BadRequestException('page is invalid');
    }
    return this.appService.searchAnime(params.search, query.page);
  }

  @Get('detail')
  getDetail(@Query() query: { url: string; page: number }) {
    if (!query.url) {
      throw new BadRequestException('url is required');
    }
    if (query.page && !parseInt(query.page.toString())) {
      throw new BadRequestException('page is invalid');
    }
    return this.appService.getDetail(query.url);
  }

  @Get('episode')
  getEpisode(@Query() query: { url: string }) {
    if (!query.url) {
      throw new BadRequestException('url is required');
    }
    return this.appService.getEpisode(query.url);
  }
}
