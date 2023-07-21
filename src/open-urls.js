document.addEventListener('click', (eventClick) => {
  let targetId = eventClick.target.id;
  if (targetId == "open-urls") {
      if (document.querySelector(`#open-urls-paths-bool`).checked == true) {
        openUrlsInputAllPaths();
      } else {
        openUrlsInput();
      }
  } else if (targetId == "clean-urls-input" ) {
    cleanUrlsInput();
  }
});

function openUrlsInput() {
  console.log("Init open URLs");
  let urls = getUrlsToOpen(false)
  openUrls(urls);
}

function openUrlsInputAllPaths() {
  console.log("Init open URLs all paths");
  let urls = getUrlsToOpen(true)
  openUrls(urls);
}

function getUrlsToOpen(openAllPaths) {
  let element = document.querySelector(`#urls-input`);
  let urlsInput = element.value.split('\n');
  let result = [];
  for (let url of urlsInput) {
    console.log(`Init manage url input: ${url}`);
    if (url == '') {
      console.log("Invalid URL, omitting");
    } else {
      let urlToOpen = getStringDropLeadingAndTrailingSpaces(url);
      urlToOpen = getStringDropLastCharacterIfMatched(urlToOpen, "/");
      urlToOpen = getUrlWithProtocol(urlToOpen);
      if (openAllPaths === true) {
        let urlsPaths = getUrlsWithPaths(urlToOpen)
        for (let urlPath of urlsPaths) {
          result.push(urlPath);
        }
      } else {
          result.push(urlToOpen);
      }
    }
  }
  return result;
}

function getStringDropLeadingAndTrailingSpaces(string){
  return string.trim();
}

function getStringDropLastCharacterIfMatched(string, character){
  let result = string;
  if (result.slice(-1) == character){
    result = result.substring(0, result.length -1);
  }
  return result;
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
    result = result.reverse(); // Open the longest URL first.
  }
  return result;
}

async function openUrls(urls) {
  let delay_s = document.querySelector(`#delay-input`).valueAsNumber;
  let delay_ms = delay_s * 1000;
  let urlsLength = urls.length;
  for (var i = 0; i < urlsLength; i++) {
    var url = urls[i];
    console.log(`Init URL ${i+1}/${urlsLength}: '${url}'`);
    if (i != 0) {
      await sleepMs(delay_ms);
    }
    openUrl(url);
  }
}

// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleepMs(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* Open an url and catches possible exception.
https://developer.mozilla.org/en-US/docs/Web/API/Window/open
:param url: str, url to check.
:return null.
*/
function openUrl(url){
  try{
    window.open(url);
  }
  catch(error){
    console.error(error);
  }
}

function cleanUrlsInput() {
  console.log('Init clean URLs input');
  let element = document.querySelector(`#urls-input`);
  element.value = "";
}

function run_open_urls_paths_bool(element) {
  if (element.checked == true) {
    element.style.background = 'gray';
    element.style.color = 'lightgray';
    element.textContent = 'off';
    element.checked = false;
  } else {
    element.style.background = 'green';
    element.style.color = 'lightgreen';
    element.textContent = 'on';
    element.checked = true;
  }
}

