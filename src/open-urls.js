document.addEventListener('click', (eventClick) => {
  let targetId = eventClick.target.id;
  if (targetId == "open-urls") {
    openUrls();
  } else if (targetId == "open-urls-paths" ) {
    openUrlsAllPaths();
  }
});

function openUrls() {
  console.log("Init open URLs");
  openUrlsInput(false);
}

function openUrlsAllPaths() {
  console.log("Init open URLs all paths");
  openUrlsInput(true);
}

function openUrlsInput(openAllPaths) {
  let element = document.querySelector(`#urls-input`);
  let urls = element.value.split('\n');
  for (let url of urls) {
    console.log(`Init manage url input: ${url}`);
    if (url == ''){
      console.log("Invalid URL, omitting");
    } else {
      url = getUrlWithProtocol(url);
      if (openAllPaths === true) {
        let urlsPaths = getUrlsWithPaths(url)
        for (let urlPath of urlsPaths) {
          openUrl(urlPath);
        }
      } else {
          openUrl(url);
      }
    }
  }
}

/* Open an url and catches possible exception.
https://developer.mozilla.org/en-US/docs/Web/API/Window/open
:param url: str, url to check.
:return null.
*/
function openUrl(url){
  console.log(`Init open url: ${url}`);
  try{
    window.open(url);
  }
  catch(error){
    console.error(error);
  }
}

function getUrlWithProtocol(url){
  let result = url
  if (result.substring(0, 4).toLowerCase() != 'http'){
    result = `https://${result}`;
  }
  return result;
}

function getUrlsWithPaths(url){
  let urlParts = url.split('/');
  let indexDomainAndTld = 2;
  let urlWithoutPaths = `${urlParts[0]}//${urlParts[indexDomainAndTld]}`;
  let result = [urlWithoutPaths];
  if (urlParts.length > indexDomainAndTld + 1) {
    let paths = urlParts.slice(indexDomainAndTld + 1, urlParts.length);
    for (let path of paths) {
      let lastAddedUrl = result[result.length - 1];
      let newUrl = `${lastAddedUrl}/${path}`;
      result.push(newUrl);
    }
    result = result.reverse();
  }
  return result;
}
