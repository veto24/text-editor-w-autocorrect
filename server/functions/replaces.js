const replacer = (splits) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const results = [];
  for (let i = 0; i < splits.length - 1; i++) {
    for (let j = 0; j < alphabet.length; j++) {
      results.push(splits[i][0] + alphabet[j] + splits[i][1].slice(1));
    }
  }

  return results;
};

module.exports = replacer;
