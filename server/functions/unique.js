function unique(arr) {
  let hash = {},
    result = [];
  for (let i = 0, l = arr.length; i < l; ++i) {
    if (!hash.hasOwnProperty(arr[i])) {
      hash[arr[i]] = true;
      result.push(arr[i]);
    }
  }
  return result;
}

module.exports = unique