const searchInput = $('#search')
const events = 'input keydown keypress keyup paste';
/** @type { import('lunr').Index } */
let index = null;

searchInput.on(events, debounce(350, () => {
  const searchQuery = searchInput.val();
  if (searchQuery.length > 3) {
    if (!index) {
      searchBase.then((posts) => {
        index = lunr(function builder() {
          this.field('title', { boost: 3 });
          this.field('tags', { boost: 2});
          this.field('excerpt');
          this.field('author');

          for (let i = 0; i < posts.length; i++) {
            posts[i].id = i;
            this.add(posts[i]);
          }
        });

        displaySearchResults(index.search(searchQuery));
      }).catch(() => {
        console.error('Unexpected error: unable to perform search.', error);
      });
    } else {
      displaySearchResults(index.search(searchQuery));
    }
  } else if (searchQuery.length === 0) {
    clearSearchResults();
  }
}));

function displaySearchResults(results) {
  $('#emptySearchQuery').hide();
  searchBase.then(posts => {
    if (results.length > 0) {
      $('#searchLinks').empty();

      for (const result of results) {
        $('#noSearchResults').hide();
        // Create individual elements
        const card = document.createElement('div');
        card.className = "card-body";
        const cardTitle = document.createElement('h5');
        cardTitle.className = "card-title";
        const postLink = document.createElement('a');
        postLink.href = posts[+result.ref].url;
        postLink.textContent = posts[+result.ref].title;
        const postExcerpt = document.createElement('p');
        postExcerpt.className = "card-text";
        postExcerpt.textContent = posts[+result.ref].excerpt;

        // Nest elements together
        cardTitle.append(postLink);
        card.append(cardTitle);
        card.append(postExcerpt);

        // Append search result to searchLinks div
        $('#searchLinks').append(card);

        // Display search results
        $('#searchLinks').show();
      }
    } else {
      $('#searchLinks').hide();
      $('#noSearchResults').show();
    }

    $('#search-total').text(results.length);
    $('#searchResults').collapse('show');
  });
}

function clearSearchResults() {
  $('#searchResults').collapse('hide');
  $('#search-total').text(0);
  $('#searchLinks').hide();
  $('#noSearchResults').hide();
  $('#emptySearchQuery').show();
}
