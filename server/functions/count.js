const count = (arr) => {
  const result = {};

  arr.forEach((word) => {
    word = word.toLowerCase();
    if (result[word]) {
      result[word]++;
    } else {
      result[word] = 1;
    }
  });

  return result;
};

module.exports = count;
