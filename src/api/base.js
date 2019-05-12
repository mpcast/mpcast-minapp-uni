import http from '../utils/http'

const VERSION = 'v1'
// const APP_ID = 'S11SeYT2W'
// const BASE_URL = process.env.SERVICE_URL
// const APP_API = `${BASE_URL}/${VERSION}/apps/${APP_ID}`
const BASE_URL = 'http://localhost:5000'

/**
 * 方便子类调用 http 请求
 */
export default class Base {
	// constructor() {
	    // this.baseUrl = BASE_URL
	// }
  static baseUrl = 'http://localhost:5000';
  static appService = this.baseUrl + '/api';
  static getApi = function (version) {
    return `${BASE_URL}/${version}/apps/${APP_ID}`
  }
  static get = http.get.bind(http);
  static put = http.put.bind(http);
  static post = http.post.bind(http);
  static delete = http.delete.bind(http);
}
