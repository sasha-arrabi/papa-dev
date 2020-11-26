---
---
// Load all global variables first
{% include_relative _js/globals.js %}
// Load all dependencies
{% include_relative _js/debounce.js %}
{% include_relative _js/load-script.js %}
{% include_relative _js/scroll-to-anchor.js %}
{% include_relative _js/init.js %}
// Perform any initializing logic
init();
