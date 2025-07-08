const cache = new Map();

/**
 * Get data from cache only
 * @param {string} key - Cache key
 * @returns {any|null} Cached data or null if not found/expired
 */
function getCachedData(key) {
  if (cache.has(key)) {
    const cachedItem = cache.get(key);

    // If the cached item is still valid, return it
    if (new Date() < cachedItem.expiry) {
      return cachedItem.value;
    }

    // Otherwise, remove the expired item
    cache.delete(key);
  }

  return null;
}

/**
 * Get data from cache or the provided fetch function if not cached
 * @param {string} key - Cache key
 * @param {Function} fetchFunction - Function to fetch data if not in cache
 * @returns {any} Cached or fetched data
 */
function getCacheOrFetch(key, fetchFunction) {
  const cachedData = getCachedData(key);
  if (cachedData !== null) {
    return cachedData;
  }

  // Fetch new data, cache it, and return
  const data = fetchFunction();
  setCacheData(key, data);
  return data;
}

/**
 * Set data in cache with an optional TTL
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttlSeconds - Time to live in seconds
 */
function setCacheData(key, value, ttlSeconds = 60) {
  const expiry = new Date();
  expiry.setSeconds(expiry.getSeconds() + ttlSeconds);
  cache.set(key, { value, expiry });
}

/**
 * Clear outdated cache values
 */
function clearExpiredCache() {
  const now = new Date();
  for (const [key, item] of cache.entries()) {
    if (item.expiry < now) {
      cache.delete(key);
    }
  }
}

module.exports = {
  getCachedData,
  getCacheOrFetch,
  setCacheData,
  clearExpiredCache
};

