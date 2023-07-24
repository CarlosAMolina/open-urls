function openUrlsInput() {
  console.log('Init open URLs');
  let openAllPaths = document.getElementById('open-all-paths').checked == true;
  console.log(`Configuration. Open URLs all paths: ${openAllPaths}`);
  let urls = getUrlsToOpen(openAllPaths);
  let delayMs = getDelayMsOpenUrls();
  console.log(`Configuration. Open URLs delay: ${delayMs} ms`);
  openUrls(urls, delayMs);
  showUrlsOpened(urls);
};

function getUrlsToOpen(openAllPaths) {
  let element = document.getElementById('urls-input');
  const input = element.value;
  let urlsInput;
  // TODO
  if (false) {
    urlsInput = input.split('\n');
  } else {
    // https://regexr.com/37i6s
    const regexp = /[^(\s|\[|\])]*\w*\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    urlsInput = Array.from(input.matchAll(regexp), (m) => m[0]);
  }
  let result = [];
  for (let url of urlsInput) {
    console.log(`Init manage url input: ${url}`);
    let urlToOpen = url.trim(); // Drop leading and trailing spaces.
    if (urlToOpen == '') {
      console.log('Invalid URL, omitting');
    } else {
      urlToOpen = getStringDropLastCharacterIfMatched(urlToOpen, '/');
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

function getDelayMsOpenUrls() {
  if (document.getElementById('delay-checkbox').checked == false) {
    return 0;
  } else {
    let delay_s = document.getElementById('delay-input').valueAsNumber;
    let result = delay_s * 1000;
    return result;
  }
}

async function openUrls(urls, delayMs) {
  let urlsLength = urls.length;
  for (var i = 0; i < urlsLength; i++) {
    var url = urls[i];
    console.log(`Init URL ${i+1}/${urlsLength}: '${url}'`);
    if (i != 0) {
      await sleepMs(delayMs);
    }
    // TODO window.open(url);
  }
}

// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleepMs(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// https://www.discoduroderoer.es/como-crear-una-lista-html-en-javascript-con-dom/
function showUrlsOpened(urls) {
  if (urls.length > 0) {
    unhideUrlsOpened();
    let ol = document.createElement('ol');
    document.getElementById('open-urls-list').innerHTML = '';
    for (let url of urls) {
      let li = document.createElement('li');
      let liText = document.createTextNode(url);
      li.appendChild(liText);
      ol.appendChild(li);
    }
    document.getElementById('open-urls-list').appendChild(ol);
  }
}

function cleanUrlsInput() {
  console.log('Init clean URLs input');
  let element = document.getElementById('urls-input');
  element.value = '';
  hideUrlsOpened();
}

function hideUrlsOpened() {
  document.getElementById('open-urls-section').classList.add('hidden');
}

function unhideUrlsOpened() {
  document.getElementById('open-urls-section').classList.remove('hidden');
}

function runDelayCheckbox() {
  if (document.getElementById('delay-checkbox').checked == true) {
    document.getElementById('delay-input').classList.remove('hidden');
    document.getElementById('delay-checkbox-section').classList.add('delay-section-with-input');
  } else {
    document.getElementById('delay-input').classList.add('hidden');
  }
}
