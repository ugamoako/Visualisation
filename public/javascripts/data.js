$(document).ready(function(){
    'use strict';
    
var  width = 500;
var height = 500;
var radius = Math.min(width, height)/2;
var donutWidth = 75;
var legendRectSize = 18;
var legendSpaceing = 4;
var color = d3.scaleOrdinal(d3.schemeCategory20b);


var svg = d3.select('#chart')
    .append('svg')
    .attr('width',width)
    .attr('height',height)
    .append('g')
    .attr('transform','translate('+(width/2)+','+ (height/2)+')');

var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

var pie = d3.pie()
    .value(function(d){return d.count;})
    .sort(null);
var tooltip = d3.select('#chart')            // NEW
  .append('div')                             // NEW
  .attr('class', 'tooltip');                 // NEW

tooltip.append('div')                        // NEW
  .attr('class', 'label');                   // NEW

tooltip.append('div')                        // NEW
  .attr('class', 'count');                   // NEW

tooltip.append('div')                        // NEW
  .attr('class', 'percent');                 // NEW

    
d3.csv('/dataset/monthcount.csv', function(error, dataset){
    dataset.forEach(function(d){
        d.count = +d.count;
    });

    var path = svg.selectAll('path')
        .data(pie(dataset))
        .enter()
        .append('path')
        .attr('d',arc)
        .attr('fill', function(d, i){
            return color(d.data.label);
        });
         path.on('mouseover', function(d) {                            // NEW
            var total = d3.sum(dataset.map(function(d) {                // NEW
              return d.count;                                           // NEW
            }));                                                        // NEW
            var percent = Math.round(1000 * d.data.count / total) / 10; // NEW
            tooltip.select('.label').html(d.data.label);                // NEW
            tooltip.select('.count').html(d.data.count);                // NEW
            tooltip.select('.percent').html(percent + '%');             // NEW
            tooltip.style('display', 'block');                          // NEW
          });                                                           // NEW

          path.on('mouseout', function() {                              // NEW
            tooltip.style('display', 'none');                           // NEW
          });                                                           // NEW
          path.on('mousemove', function(d) {                            // NEW
            tooltip.style('top', (d3.event.layerY + 10) + 'px')         // NEW
              .style('left', (d3.event.layerX + 10) + 'px');            // NEW
          });               
        var legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class','legend')
        .attr('transform', function(d,i){
            var height = legendRectSize + legendSpaceing;
            var offset = height * color.domain().length/2;
            var horz = -2 * legendRectSize;
            var vert = i * height - offset;
            return 'translate('+horz + ',' + vert + ')';
        });
        legend.append('rect')
            .attr('width',legendRectSize)
            .attr('height',legendRectSize)
            .style('fill',color)
            .style('stroke',color);

        legend.append('text')
            .attr('x', legendRectSize + legendSpaceing)
            .attr('y', legendRectSize - legendSpaceing)
            .text(function(d){return d; });
     })
});