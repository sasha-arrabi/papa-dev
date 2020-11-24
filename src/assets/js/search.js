const searchInput = $('#search')
const events = 'input keydown keypress keyup paste';
/** @type { import('lunr').Index } */
let index = null;
let currentPage = 1;
let totalPages = 1;

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
      $('#noSearchResults').hide();

      const paginatedDivs = setupPagination(results);
      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        // Create individual elements
        const card = document.createElement('div');
        card.className = "card-body mb-5";

        const cardTitle = document.createElement('h5');
        cardTitle.className = "card-title";

        const postLink = document.createElement('a');
        postLink.href = posts[+result.ref].url;
        postLink.textContent = posts[+result.ref].title;

        const picture = document.createElement('picture');
        let imageFile = posts[+result.ref].image;
        imageFile = imageFile.split('.');
        const webpSource = document.createElement('source');
        webpSource.type = 'image/webp';
        webpSource.srcset = imageFile[0] + '-xs.webp 360w';
        webpSource.sizes = '100px';
        const origSource = document.createElement('source');
        origSource.srcset = imageFile[0] + '-xs.' + imageFile[1] + ' 360w';
        origSource.sizes = '100px';
        const img = document.createElement('img');
        img.className = 'img-fluid img-thumbnail search-thumb float-left mr-3';
        img.src = imageFile[0] + '-xs.' + imageFile[1];
        img.alt = posts[+result.ref].title;
        img.width = 100;
        img.height = 100;

        const postExcerpt = document.createElement('p');
        postExcerpt.className = "card-text";
        const excerpt = posts[+result.ref].excerpt;
        postExcerpt.textContent = excerpt.length < 200 ? excerpt : excerpt.slice(0, 200).trim().concat('...');

        // Nest elements together
        cardTitle.append(postLink);
        card.append(cardTitle);
        picture.append(webpSource);
        picture.append(origSource);
        picture.append(img);
        card.append(picture);
        card.append(postExcerpt);

        // Determine whether to add to paginated element
        if (paginatedDivs.length > 0) {
          paginatedDivs[Math.floor(i / 10)].append(card);
        } else {
          // Append search result to searchLinks div
          $('#searchLinks').append(card);
        }
      }

      // If pagination was used, then add the paginated divs and show the first one
      if (paginatedDivs.length > 0) {
        paginatedDivs.forEach(div => {
          $('#searchLinks').append(div);
        });
        $(paginatedDivs[0]).show();
      }

      // Display search results
      $('#searchLinks').show();
    } else {
      $('#searchLinks').hide();
      $('#noSearchResults').show();
    }

    $('#search-total').text(results.length);
    $('#searchResults').collapse('show');
  });
}

function setupPagination(results) {
  const paginatedDivs = [];

  if (results.length > 10) {
    // Pagination will be added
    $('#searchPagination').show();
    currentPage = 1;
    totalPages = Math.ceil(results.length / 10);
    const paginationLinks = $('#paginationLinks');
    paginationLinks.empty();

    // Add "previous" pagination link
    const previousLink = document.createElement('li');
    previousLink.id = 'paginationPrevious';
    previousLink.className = 'page-item disabled';
    previousLink.tabIndex = -1;
    const previousAnchor = document.createElement('a');
    previousAnchor.className = 'page-link';
    previousAnchor.href = '#';
    previousAnchor.onclick = (ev) => {
      ev.preventDefault();
      previousPage();
      return false
    };
    previousAnchor.textContent = "Previous";
    previousLink.append(previousAnchor);
    paginationLinks.append(previousLink);

    for (let paginatedIndex = 1; paginatedIndex <= totalPages; paginatedIndex++) {
      // Setup paginated div
      const paginatedDiv = document.createElement('div');
      paginatedDiv.id = 'paginated-' + paginatedIndex;
      $(paginatedDiv).hide();
      paginatedDivs.push(paginatedDiv);

      // Add pagination link
      const li = document.createElement('li');
      li.id = 'pagination-link-' + paginatedIndex;
      if (paginatedIndex === 1) {
        li.className = 'page-item active';
      } else {
        li.className = 'page-item';
      }
      const anchor = document.createElement('a');
      anchor.className = 'page-link';
      anchor.href = '#';
      anchor.onclick = (ev) => {
        ev.preventDefault();
        goToPage(paginatedIndex);
        return false
      };
      anchor.textContent = paginatedIndex;
      li.append(anchor);
      paginationLinks.append(li);
    }

    // Add "next" pagination link
    const nextLink = document.createElement('li');
    nextLink.id = 'paginationNext';
    nextLink.className = 'page-item';
    const nextAnchor = document.createElement('a');
    nextAnchor.className = 'page-link';
    nextAnchor.href = '#';
    nextAnchor.onclick = (ev) => {
      ev.preventDefault();
      nextPage();
      return false
    };
    nextAnchor.textContent = "Next";
    nextLink.append(nextAnchor);
    paginationLinks.append(nextLink);
  } else {
    $('#searchPagination').hide();
  }

  return paginatedDivs;
}

function clearSearchResults() {
  currentPage = 1;
  totalPages = 1;
  $('#searchResults').collapse('hide');
  $('#search-total').text(0);
  $('#searchPagination').hide();
  $('#searchLinks').hide();
  $('#noSearchResults').hide();
  $('#emptySearchQuery').show();
}

function nextPage() {
  if (currentPage < totalPages) {
    goToPage(currentPage + 1);
  }
}

function previousPage() {
  if (currentPage > 1) {
    goToPage(currentPage - 1);
  }
}

function goToPage(page) {
  // Disable currently active page
  $('#paginated-' + currentPage).hide();
  $('#pagination-link-' + currentPage).removeClass('active');

  // Show requested page
  currentPage = page;
  $('#paginated-' + currentPage).show();
  $('#pagination-link-' + currentPage).addClass('active');

  setPaginationIncrementers();
  scrollToAnchor('searchResults');
  return false;
}

function setPaginationIncrementers() {
  if (currentPage === 1) {
    $('#paginationPrevious').addClass('disabled');
  } else {
    $('#paginationPrevious').removeClass('disabled');
  }

  if (currentPage === totalPages) {
    $('#paginationNext').addClass('disabled');
  } else {
    $('#paginationNext').removeClass('disabled');
  }
}
