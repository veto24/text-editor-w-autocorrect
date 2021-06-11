const deletes = require('./deleter');
const inserts = require('./inserter');
const replaces = require('./replaces');
const splitter = require('./splitter');
const transposes = require('./transposer');
const unique = require('./unique');

const edits = (word) => {
  // 1 edit awat from 'word'
  const splits = splitter(word);
  return [
    ...deletes(splits),
    ...transposes(splits),
    ...replaces(splits),
    ...inserts(splits),
  ];
};

module.exports = edits;
