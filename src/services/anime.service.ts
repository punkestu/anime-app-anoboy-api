import { Injectable } from '@nestjs/common';
import axios from 'axios';
import Cheerio from 'cheerio';
import { Anime, AnimeSummary } from 'src/models/anime.model';
import { Episode } from 'src/models/episode.model';
import { Home, PagedAnime } from 'src/models/pages.model';

@Injectable()
export class AppService {
  async getIndex(pageNum: number = 1): Promise<Home> {
    const page = (await axios.get(`${process.env.BASE_URL}/page/${pageNum}`))
      .data;
    const $ = Cheerio.load(page);
    const result: Home = {} as Home;

    // Parse the page and assign it to result
    const newsUpdateList = $('.home_index > a')
      .map((_, el) => {
        return {
          url: $(el)
            .attr('href')
            .replace(process.env.BASE_URL_HTTP + '/', ''),
          title: $(el).attr('title'),
          thumbnail: process.env.BASE_URL + $(el).find('amp-img').attr('src'),
        } as AnimeSummary;
      })
      .get() as AnimeSummary[];
    const [currentPage, totalPages] = $('.home_index > .wp-pagenavi > .pages')
      .text()
      .split(' dari ')
      .map((el) =>
        parseInt(el.replace('Halaman', '').trim().split(',').join('')),
      );

    result.newsUpdate = {
      list: { data: newsUpdateList },
      currentPage,
      totalPages,
    };

    return result;
  }
  async searchAnime(search: string, pageNum: number = 1): Promise<PagedAnime> {
    const page = (
      await axios.get(`${process.env.BASE_URL}/page/${pageNum}/?s=${search}`)
    ).data;
    const $ = Cheerio.load(page);
    const result: PagedAnime = { list: { data: [] } } as PagedAnime;

    // Parse the page and assign it to result
    result.list.data = $('.column-content > a')
      .map((_, el) => {
        if (!$(el).attr('title').includes('Episode')) return undefined;
        return {
          url: $(el)
            .attr('href')
            .replace(process.env.BASE_URL + '/', ''),
          title: $(el).attr('title'),
          thumbnail: process.env.BASE_URL + $(el).find('amp-img').attr('src'),
        } as AnimeSummary;
      })
      .get()
      .filter((el) => el) as AnimeSummary[];
    const [currentPage, totalPages] = $('.wp-pagenavi > .pages')
      .text()
      .split(' dari ')
      .map((el) =>
        parseInt(el.replace('Halaman', '').trim().split(',').join('')),
      );
    result.currentPage = currentPage;
    result.totalPages = totalPages;

    return result;
  }
  async getDetail(url: string, pageNum: number = 1): Promise<Anime> {
    const page = (
      await axios.get(`${process.env.BASE_URL}/${url}/page/${pageNum}`)
    ).data;
    const $ = Cheerio.load(page);
    const result = {} as Anime;

    // Parse the page and assign it to result
    result.title = $('.pagetitle > h1').text();
    result.thumbnail =
      process.env.BASE_URL +
      $('.column-content > a > div > amp-img').attr('src');
    result.recomendation = {
      data: $('.column-content > a')
        .map((_, el) => {
          return {
            url: $(el)
              .attr('href')
              .replace(process.env.BASE_URL + '/', ''),
            title: $(el).attr('title'),
            thumbnail: process.env.BASE_URL + $(el).find('amp-img').attr('src'),
          } as AnimeSummary;
        })
        .get() as AnimeSummary[],
    };
    const [currentPage, totalPages] = $('.wp-pagenavi > .pages')
      .text()
      .split(' dari ')
      .map((el) =>
        parseInt(el.replace('Halaman', '').trim().split(',').join('')),
      );
    result.currentPage = currentPage || pageNum;
    result.totalPages = totalPages;

    return result;
  }
  async getEpisode(url: string): Promise<Episode> {
    const result = {} as Episode;
    const page = (await axios.get(`${process.env.BASE_URL}/${url}`)).data;
    const $ = Cheerio.load(page);
    const title = $('.pagetitle > h1').text().trim();
    const anime = $('.breadcrumb > span > span:nth-child(2) > a')
      .attr('href')
      .replace(process.env.BASE_URL + '/', '')
      .trim();
    const prevNext = $('#navigasi > .widget-title > a, #navigasi > a')
      .map((_, el) => ({ inner: $(el).text().trim(), url: $(el).attr('href') }))
      .get()
      .reduce(
        (acc, el) => {
          if (el.inner) {
            if (acc.current === 'next') {
              acc.next = el.url.replace(process.env.BASE_URL + '/', '').trim();
            } else {
              acc.prev = el.url.replace(process.env.BASE_URL + '/', '').trim();
            }
          } else {
            acc.current = 'next';
          }
          return acc;
        },
        {} as { current: string; prev: string; next: string },
      );

    const mediaPlayerURL = `${process.env.BASE_URL}${$('#mediaplayer').attr('src')}`;
    const playerPage = (await axios.get(mediaPlayerURL)).data;
    const $player = Cheerio.load(playerPage);
    const urls = $player('.link')
      .map((_, el) => ({
        url: $player(el).attr('href'),
        resolution: $player(el).text().trim(),
      }))
      .get()
      .reduce(
        (acc, el) => {
          if (el.resolution === '360') {
            acc.p360 = el.url;
          } else if (el.resolution === '720') {
            acc.p720 = el.url;
          }
          return acc;
        },
        {} as { p360: string; p720: string },
      );
    result.title = title;
    result.p360 = urls.p360;
    result.p720 = urls.p720;
    result.anime = anime;
    result.prev = prevNext.prev;
    result.next = prevNext.next;

    return result;
  }
}
