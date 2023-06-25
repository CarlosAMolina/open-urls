document.addEventListener('click', (eventClick) => {
  let targetId = eventClick.target.id;
  if (targetId == "open-urls") {
    console.log("Init open URLs");
    let element = document.querySelector(`#urls-input`);
    let urls = element.value.split('\n');
    for (let url of urls) {
      console.log(`Init manage url input: ${url}`);
      if (url == ''){
        console.log("Invalid URL, omitting");
      } else {
        url = getUrlWithCorrectFormat(url);
        console.log(`Init open url: ${url}`);
        openUrl(url);
      }
    }
  }
});

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

function getUrlWithCorrectFormat(url){
  let result = url
  if (result.substring(0, 4).toLowerCase() != 'http'){
    result = `https://${result}`;
  }
  return result;
}
