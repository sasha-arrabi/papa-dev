function loadScript(path, async, noCache) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    if (noCache === true) {
      script.src = path + '?v=' + Math.random().toString(36).substring(2);
    } else {
      script.src = path;
    }
    script.async = async === false;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(`The script at '${path}' could not be downloaded / loaded.`);
    document.body.appendChild(script);
  });
}

function debounce(delay, callback) {
  // each call to debounce creates a new timeoutId
  let timeoutId;

  return function() {
    // this inner function keeps a reference to
    // timeoutId from the function outside of it
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay || 500);
  }
}

var jqueryLoaded = null;
var searchBase = null;

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
      loadScript('https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js').then(() => {
        $(function () {
          // Enable all tooltips once JQuery and Bootstrap JS are loaded
          $('[data-toggle="tooltip"]').tooltip();

          // Hide empty search results message
          $('#noSearchResults').hide();
        });
      })
    }).catch(error => {
      console.error('Error occurred while loading Bootstrap JS and/or JQuery', error);
      return Promise.reject(error);
    });
  });
}

init();
