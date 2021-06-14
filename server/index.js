const express = require('express');
const fs = require('fs');
const cors = require('cors');
const count = require('./functions/count');
const unique = require('./functions/unique');
const app = express();
const murmurhash = require('murmurhash');
const edits = require('./functions/edits1');

app.use(express.json());
app.use(cors());

fs.readFile('./big.txt', 'utf8', (err, data) => {
  if (err) {
    return response.json({ err });
  }

  const wordsData = data.match(/[A-Za-z]+/g);
  const wordHash = count(Array.from(wordsData)); // key value pair of words and its frequency
  const itemsCount = Object.keys(wordHash).length;
  const bitSize = Math.trunc(-(itemsCount * Math.log(0.05)) / Math.log(2) ** 2); // length of bit array
  const hashCount = Math.trunc((bitSize / itemsCount) * Math.log(2)); // number of hash functions needed
  const bitArray = Array(bitSize).fill(0); // stores bit data

  // register an element to the bit array
  const add = (word) => {
    for (let i = 0; i < hashCount; i++) {
      const hash = murmurhash.v3(word, i) % bitSize;
      bitArray[hash] = true;
    }
  };

  // check if certain element is present
  const check = (word) => {
    for (let i = 0; i < hashCount; i++) {
      const hash = murmurhash.v3(word, i) % bitSize;
      if (!bitArray[hash]) return false;
    }

    return true;
  };

  // filters out unknown words from collection of words
  const known = (arr) => {
    return arr.filter((word) => wordHash[word]);
  };

  Object.keys(wordHash).forEach(add);

  // allow post request only if reference file is ready
  app.post('/api/corrections', (request, response) => {
    const { text } = request.body;
    const wordsFromText = text.match(/[A-Za-z]+/g);

    if (!wordsFromText) {
      return response.json(null);
    }

    // checks words according to bloom filter
    const mispelled = Array.from(wordsFromText).filter(
      (word) => !check(word.toLowerCase())
    );

    const corrections = {}; // key value pair which will contain results

    mispelled.forEach((word) => {
      const firstEdits = edits(word); // words 1 edit away from 'word'
      const secondEdits = firstEdits.flatMap(edits); // words 2 edits away from 'word'

      const candidates = unique(
        known(firstEdits).length ? known(firstEdits) : known(secondEdits)
      );

      // skip if no candidates
      if (!candidates.length) return;

      const mostCommon = (topWord, currentWord) => {
        if (wordHash[currentWord] > wordHash[topWord]) {
          return currentWord;
        }

        return topWord;
      }; 

      const correction = candidates.reduce(mostCommon);
      corrections[word] = correction;
    });

    return response.json(corrections);
  });
});

app.listen(3001, () => console.log('Server started at port 3001'));
