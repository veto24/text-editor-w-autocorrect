const deletes = (splits) => {
  const results = [];
  for (let i = 0; i < splits.length - 1; i++) {
    results.push(splits[i][0] + splits[i][1].slice(1));
  }

  return results;
};

module.exports = deletes;
