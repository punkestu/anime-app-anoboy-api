import axios from 'axios';
import Cheerio from 'cheerio';
import { Episode } from 'src/models/episode.model';

export default {
  getEpisode: async function (url: string): Promise<Episode> {
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
  },
};
