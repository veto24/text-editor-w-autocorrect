const splits = (word) => {
  const results = [];
  for (let i = 0; i <= word.length; i++) {
    results.push([word.slice(0, i), word.slice(i)]);
  }

  return results;
};

module.exports = splits

// export default splits;