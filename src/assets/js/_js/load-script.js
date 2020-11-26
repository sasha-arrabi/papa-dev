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
