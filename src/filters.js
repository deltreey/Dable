export default [
  //PHRASES FILTER
  function(searchText, value) {
    searchText = searchText.toString().toLowerCase();
    value = value.toString().toLowerCase();
    var phrases = [];
    var regex = /\s*".*?"\s*/g;
    var match;
    while ((match = regex.exec(searchText))) {
      var phrase = match[0].replace(/"/g, '').trim();
      phrases.push(phrase);
      searchText = searchText.replace(match[0], ' ');
    }

    for (var i = 0; i < phrases.length; ++i) {
      if (value.indexOf(phrases[i]) > -1) {
        return true;
      }
    }
    return false;
  },

  //WORDS FILTER, IGNORING PHRASES
  function(searchText, value) {
    searchText = searchText.toString().toLowerCase();
    value = value.toString().toLowerCase();
    var regex = /\s*".*?"\s*/g;
    var match;
    while ((match = regex.exec(searchText))) {
      searchText = searchText.replace(match[0], ' ');
    } //remove phrases
    var splitText = searchText.split(' ');
    for (var i = 0; i < splitText.length; ++i) {
      if (!splitText[i]) { //clear out empty strings
        splitText.splice(i, 1);
        --i;
      }
    }

    for (var j = 0; j < splitText.length; ++j) {
      if (value.indexOf(splitText[j]) > -1) {
        return true;
      }
    }

    return false;
  }
];
