function loadSearchScripts() {
  if (!searchBase) {
    jqueryLoaded.then(() => {
      const allSearchScripts = Promise.all([
        loadScript("/assets/js/search.js"),
        loadScript("https://unpkg.com/lunr@2.3.9/lunr.min.js"),
        $.ajax("/assets/json/posts.json").promise(), // Never cache the generated posts.json file
      ]);
      searchBase = allSearchScripts
        .then((results) => {
          return results[2];
        })
        .catch((error) => {
          searchBase = null;
          console.error(
            "Error occurred while loading the search functionality.",
            error
          );
        });
    });
  }
}

function init() {
  window.addEventListener("load", () => {
    // Defer loading JQuery and Bootstrap JS until rendering is complete
    jqueryLoaded = loadScript('https://code.jquery.com/jquery-3.5.1.min.js').then(() => {
      loadScript('/assets/js/bootstrap.bundle.min.js').then(() => {
        $(function () {
          // Enable all tooltips once JQuery and Bootstrap JS are loaded
          $('[data-toggle="tooltip"]').tooltip();

          // Setup search for initial use
          $('#searchPagination').hide();
          $('#noSearchResults').hide();
        });
      })
    }).catch(error => {
      console.error('Error occurred while loading Bootstrap JS and/or JQuery', error);
      return Promise.reject(error);
    });
  });
}
