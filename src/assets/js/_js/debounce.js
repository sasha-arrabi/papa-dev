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
