import axios from 'axios';
import Cheerio from 'cheerio';
import { Anime, AnimeSummary } from 'src/models/anime.model';
import { Home, PagedAnime } from 'src/models/pages.model';

export default {
  getHome: async function (pageNum: number): Promise<Home> {
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

    // const moreList = $(
    //   '.side_home > a, .side_home > div.social.link, .side_home > h2',
    // )
    //   .map((_, el) => {
    //     if (el.tagName === 'a') {
    //       return {
    //         type: 'summary',
    //         url: $(el)
    //           .attr('href')
    //           .replace(process.env.BASE_URL_HTTP + '/', ''),
    //         title: $(el).attr('title'),
    //         thumbnail: process.env.BASE_URL + $(el).find('amp-img').attr('src'),
    //       };
    //     } else if (el.tagName === 'div') {
    //       return { type: 'more', url: $(el).find('a').attr('href') };
    //     } else {
    //       return { type: 'tag', text: $(el).text().trim() };
    //     }
    //   })
    //   .get()
    //   .reduce(
    //     (acc, el) => {
    //       if (el.type === 'tag') {
    //         if (el.text === 'Movie') {
    //           acc.current = 'movies';
    //         } else if (el.text === 'Live Action') {
    //           acc.current = 'liveActions';
    //         } else if (el.text === 'Baru ditambahkan') {
    //           acc.current = 'newAdded';
    //         }
    //       }
    //       if (el.type === 'summary') {
    //         if (!acc[acc.current])
    //           acc[acc.current] = {
    //             list: { data: [] as AnimeSummary[] } as AnimeList,
    //           } as MoreList;
    //         acc[acc.current].list.data.push({ ...el, type: undefined });
    //       } else if (el.type === 'more') {
    //         acc[acc.current].moreUrl = el.url;
    //       }

    //       return acc;
    //     },
    //     {} as {
    //       current: string;
    //       movies: MoreList;
    //       liveActions: MoreList;
    //       newAdded: MoreList;
    //     },
    //   );

    result.newsUpdate = {
      list: { data: newsUpdateList },
      currentPage,
      totalPages,
    };
    // result.movies = moreList.movies;
    // result.liveActions = moreList.liveActions;
    // result.newAdded = moreList.newAdded;

    return result;
  },
  search: async function (
    search: string,
    pageNum: number,
  ): Promise<PagedAnime> {
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
  },
  getDetail: async function (url: string, pageNum: number): Promise<Anime> {
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
  },
};
