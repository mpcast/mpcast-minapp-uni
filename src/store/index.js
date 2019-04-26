import Vue from "vue";
import Vuex from "vuex";
// import global from '../utils/global'
// import appApi from '../api/app'
// import userApi from '../api/app'
import categoryApi from "@/api/category";
import postApi from "@/api/posts";
import Tips from "@/utils/tips";
import http from "@/utils/http";

import appinfo from "./modules/appinfo";
// import audio from './modules/audio'

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        appinfo
        // audio
    },
    state: {
        print: "Hello caixie!",
        // app: {},
        // layout: {},
        // swiper: [],
        categories: [],
        featured: {},
        popular: {},
        news: {},
        posts: []
    },
    getters: {
        // appInfo (state) {
        //   return state.app
        // }
    },
    mutations: {
        SET_CATEGORIES(state, data) {
            state.categories = data;
        },
        SET_FEATURED(state, data) {
            state.featured = data;
        },
        SET_POPULAR(state, data) {
            state.popular = data;
        },
        SET_NEWS(state, data) {
            state.news = data;
        }
    },
    actions: {
        async getCategories({commit}) {
            const categories = await categoryApi.list();
            if (categories) {
                commit("SET_CATEGORIES", categories);
            }
        },
        async getFeatured({commit}) {
            const data = await postApi.getByCategory("featured");
            // console.log(data)
            // const pageData = await page.next();
            // const data = await http.get(page.url)
            // if (pageData.list) {
            //     let pageData = {
            //         list: []
            //     }
            //     pageData.list = pageData.list.concat(data.result)
            //
            // commit("SET_FEATURED", pageData);
            // }
            if (data.result) {
                let pageData = {
                    list: []
                }
                pageData.list = pageData.list.concat(data.result);
                commit("SET_FEATURED", pageData);
                Tips.loaded()
            }
        },
        async getPopular({commit}, pagesize = 6) {
            const data = await postApi.getByCategory("popular");
            // const pageData = await page.next({pagesize: pagesize});
            // if (pageData.list) {
            // commit("SET_POPULAR", pageData);
            // }
            commit("SET_POPULAR", data.result);
            Tips.loaded()
        },
        async getNews({commit}) {
            // const page = postApi.page("new");
            // const pageData = await page.next();
            // if (pageData.list) {
            const data = await postApi.getByCategory("new");

            commit("SET_NEWS", data.result);
            Tips.loaded()
            // }
        },
        async getPostsFromCategory({commit}) {
        }
        // async getMe ({commit}) {
        // }
    }
});

export default store;
