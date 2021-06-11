const known = (dictionary, words) => {
  return words.filter((w) => dictionary.includes(w));
};

module.exports = known;
