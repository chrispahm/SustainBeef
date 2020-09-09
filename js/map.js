// Get svg container, specify viewBox, height and width for later use in d3
var width = window.innerWidth
var height = window.innerHeight

var svg = d3.select("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", "0 0 " + width + " " + height)
            

// default for displays > 1024px
var scale = 2000
var center = [2.58, 52.27]

// tablet horizontal
if (width == 768) {
  scale = 1600
} else if (width < 768) {
  // mobile phones, optimized for 375px width displays
  scale = 800
  center = [2.58, 52.27]
}

// Map and projection
var path = d3.geoPath()
var projection = d3.geoMercator()
  .scale(scale)
  .center(center)
  .translate([width / 2, height / 2])

// Load eurostat external data and boot
d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/eurostat/Nuts2json/master/2016/4258/20M/nutsrg_2.json")
  .await(ready)

function ready(error, topo) {
  if (error) {
    console.log(error)
    return
  }
  var mouseOver = function(d) {
    var caseStudyRegion = d.properties.id
    if (!(caseStudyRegion in regions)) return
    // update tooltip info
    updateTooltip(regions[caseStudyRegion])
    // show tooltip
    tooltip.style.display = 'block'
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .5)
    d3.select(this)
      .style("cursor", "pointer")
      .on("click", function () {
        // jump to the detailed results page when the case-study region is clicked
        // if (regions[caseStudyRegion].name == 'BE-D') return
        window.location.href = "results/" + regions[caseStudyRegion].name + ".html"
      })
      .transition()
      .duration(200)
      .style("opacity", 1)
  }

  var mouseLeave = function() {
    // hide tooltip when SustainBeef NUTS2 case-study region is left
    tooltip.style.display = 'none'
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .8)
    d3.select(this)
      .style("cursor", "default")
      .transition()
      .duration(200)
      .style("opacity", .8)
  }

  // Draw the map
  var g = svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
    // draw each country
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    // set the color of each country
    .attr("fill", function(d) {
      var caseStudyRegion = d.properties.id
      var country = d.properties.id.substring(0, 2)
      if (caseStudyRegion in regions) {
        return '#f19d0d'
      } else if (countries.includes(country)) {
        return '#e3e3e3'
      }
      return '#ececec'
    })
    .style("stroke", function(d) {
      var caseStudyRegion = d.properties.id
      if (caseStudyRegion in regions) {
        return 'white'
      }
      return 'transparent'
    })
    .attr("class", function() {
      return "Country"
    })
    .style("opacity", .8)
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave)

  // zoom and pan
  var zoom = d3.zoom()
    .on('zoom', function() {
      g.style('stroke-width', 1.5 / d3.event.transform.k + 'px')
      g.attr('transform', d3.event.transform)
    })

  svg.call(zoom)
}