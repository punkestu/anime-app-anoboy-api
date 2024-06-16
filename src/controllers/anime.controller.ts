import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/anime.service';
import { Home } from 'src/models/pages.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  get(): Promise<Home> {
    return this.appService.getIndex();
  }
}
