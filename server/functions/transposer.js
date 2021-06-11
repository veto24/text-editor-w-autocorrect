const transposer = (splits) => {
  const result = [];
  for (let i = 0; i < splits.length - 2; i++) {
    const wordSplit = splits[i];
    result.push(
      wordSplit[0] + wordSplit[1][1] + wordSplit[1][0] + wordSplit[1].slice(2)
    );
  }

  return result;
};

module.exports = transposer;
