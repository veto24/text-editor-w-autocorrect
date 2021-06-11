const fs = require('fs');
const count = require('./functions/count');
const edits = require('./functions/edits1');
const unique = require('./functions/unique');
const murmurhash = require('murmurhash');

fs.readFile('./big.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const words = data.match(/[A-Za-z]+/g);
  const wordHash = count(Array.from(words));

  

  const inputWord = 'asefsdf';
  const firstEdits = edits(inputWord);
  const secondEdits = firstEdits.flatMap(edits);

  const candidates = unique(
    known(firstEdits).length
      ? known(firstEdits)
      : known(secondEdits).length
      ? known(secondEdits)
      : [inputWord]
  );

  // compares words by frequency
  const byFrequency = (topWord, currentWord) => {
    if (wordHash[currentWord] > wordHash[topWord]) {
      return currentWord;
    }

    return topWord;
  };

  // final correction word
  const correction = candidates.reduce(byFrequency);
  console.log(correction);

  for (let i = 0; i < 3; i++) {
    console.log(murmurhash.v3('hello', i));
  }
});
