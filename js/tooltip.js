// get html elements for later reference
var tooltip = document.querySelectorAll('.tooltip')[0]
var tpImage = document.getElementById('tp-image')
var tpHeader = document.getElementById('tp-header')
var tpRegion = document.getElementById('tp-region')
var tpDescription = document.getElementById('tp-description')
var tpDescription2 = document.getElementById('tp-description2')
var tpDescription3 = document.getElementById('tp-description3')

// attach event listener to mousemove event, so that tooltip follows mouse movement
// when the mouse is hovered over a case-study region
document.addEventListener('mousemove', tpFollowMouse, false)

function tpFollowMouse(e) {
  tooltip.style.left = e.pageX + 'px'
  tooltip.style.top = e.pageY + 'px'
}

// pre-load images for better display performance -> no waiting on image to load
var preloaded = []
function preloadImage(url) {
  var img=new Image();
  img.src=url;
  // this is a trick to ensure that the image remains in the browsers cache,
  // once the tooltip is hidden most browsers will free up memory, thus
  // requiring the image to be loaded again
  preloaded.push(img)
}
Object.keys(regions)
  .map(r => 'assets/' + regions[r].name + '.png')
  .forEach(preloadImage)

// update tooltip with case study description data (image, text, etc.)
// linked to the currently hovered case-study region
function updateTooltip(caseStudy) {
  tpImage.style.backgroundImage = 'url("assets/' + caseStudy.name + '.png")'
  tpHeader.innerHTML = caseStudy.name
  tpRegion.innerHTML = caseStudy.region + ',' + caseStudy.country
  tpDescription.innerHTML = caseStudy.description
  tpDescription2.innerHTML = caseStudy.description2
  tpDescription3.innerHTML = caseStudy.description3
}