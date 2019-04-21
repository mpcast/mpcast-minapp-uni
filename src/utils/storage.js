export default class {
  static set (key, value) {
    try {
      uni.setStorageSync(key, value);
    } catch (e) {
      //
    }
    return this;
  }
  static get (key, defaultValue) {
    let value = null;
    try {
      value = uni.getStorageSync(key) || defaultValue;
    } catch (e) {
      //
    }
    return value;
  }
  static remove (key) {
    try {
      uni.removeStorageSync(key);
    } catch (e) {
      //
    }
    return this;
  }
  static clearAll () {
    try {
      uni.clearStorageSync();
    } catch (e) {
      //
    }
    return this;
  }
}
