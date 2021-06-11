const inserter = (splits) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const results = [];
  for (let i = 0; i < splits.length; i++) {
    for (let j = 0; j < alphabet.length; j++) {
      results.push(splits[i][0] + alphabet[j] + splits[i][1]);
    }
  }

  return results;
};

module.exports = inserter;
