/*用export把方法暴露出来*/
// 设置key的过期时间
/**
 * 给storage的key设置过期时间
 * @param key  键
 * @param value 值
 * @param expire 过期时间，单位是分钟
 */
export function setStorageExpire(key, value, expire) {
  const obj = {
    data: value,
    time: Date.now(),
    expire: 1000 * 60 * expire, // 单位是分钟
  };
  localStorage.setItem(key, JSON.stringify(obj));
}

//判断是否过期，过期则返回null,判断key是否过期
export function getStorageExpire(key) {
  const val = localStorage.getItem(key);
  if (val != null) {
    let storageInfo = JSON.parse(val);
    const timeSpan = Date.now() - storageInfo.time;

    if (timeSpan > storageInfo.expire) {
      localStorage.removeItem(key);
      return null;
    }
    return storageInfo.data;
  }
  return null;
}
