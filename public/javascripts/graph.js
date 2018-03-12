var width = 960,
    height = 500;
var w = 300,
    h = 200
var sv = d3.select("#minornode").append("svg")
            .attr("width", w)
            .attr("height", h);
var forc = d3.layout.force()
            .size([w,h]);                
var svg = d3.select("#network").append("svg")
.attr("width", width)
.attr("height", height);

var force = d3.layout.force()
.size([width, height]);
d3.csv("/Dataset/labels.csv", function(error, labels) {
//console.log('labels: ', labels[0].label);

   
d3.json("/Dataset/graph.json", function(error, graph) {
    //console.log(graph);
if (error) throw error;
var nodes = d3.values(graph),
  links = d3.merge(nodes.map(function(source) {
    return source.map(function(target) {
      return {source: source, target: graph[target]};
    });
  }));
force
  .nodes(nodes)
  .links(links)
  .start();
var colorScale = d3.scale.category10();
var link = svg.selectAll(".link")
  .data(links)
.enter().append("line");

var node = svg.selectAll(".node")
  .data(nodes)
.enter();
var circle = node.append("circle")
  .attr("r", 5)
  .style("fill", function(d, i) { return colorScale(i); })
  .call(force.drag);

force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    circle.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });

    label.attr("x", function(d){return d.x})
         .attr("y", function(d) { return d.y; });
    });
    var lab = [];
    
    var label = node.append('text')
    .attr("dy", ".35em")
    .attr("dx", 6)
    .attr("text-anchor", function(d){ return d.index})
    .text(function(d, i){ return labels[i].label })
    .style("font-size","8px");
    populatelist(labels);
    function populatelist(data){
        var ul = d3.select("ul");
        ul.selectAll('li')
            .data(data)
            .enter()
            .append('li')
            .attr('class', 'collection')
            .attr('data-toggle', 'modal')
            .attr('data-target', '#myModal')
            .text(function(d){return d.label;})
            .on("click", modifyText);
    }

    var fisheye = d3.fisheye.circular()
    .radius(200)
    .distortion(2);

    svg.on("mousemove", function() {
        fisheye.focus(d3.mouse(this));
      
        circle.each(function(d) { d.fisheye = fisheye(d); })
            .attr("cx", function(d) { return d.fisheye.x; })
            .attr("cy", function(d) { return d.fisheye.y; })
            .attr("r", function(d) { return d.fisheye.z * 4.5; });
      
        link.attr("x1", function(d) { return d.source.fisheye.x; })
            .attr("y1", function(d) { return d.source.fisheye.y; })
            .attr("x2", function(d) { return d.target.fisheye.x; })
            .attr("y2", function(d) { return d.target.fisheye.y; });
        
        label.attr("x", function(d) { return d.fisheye.x; })
             .attr("y", function(d) { return d.fisheye.y; })
             .style("font-size", function(d){ return d.fisheye.z * 7 + 'px'}); 
             
      });  

    let filterInput = document.getElementById("filterInp");
    filterInput.addEventListener("keyup", filterwords)
    function filterwords(){
        let filterValue = document.getElementById("filterInp").value;
        
        let ul = document.getElementById("words");
        let li = ul.querySelectorAll('li.collection');
        
        for(let i = 0; i < li.length; i++){
            let a = li[i];
            //console.log(a.innerHTML);
            if(a.innerHTML.indexOf(filterValue) > -1){
                li[i].style.display = '';
            } else {
                li[i].style.display = 'none';
            }
        }
        //console.log(filterValue);
    };
    var el = d3.selectAll(".collection");
  
    function modifyText(d){
        let modalhead = document.getElementById('title');
        modalhead.innerHTML = d.label;
        let sample = {};
        let children = graph[d.id];
        sample[d.id] = children;
        //console.log('children', children);
        var phrases = [];
        children.forEach(function(e) {
            let grandchild = graph[e];
            grandchild.forEach(function(f){
                if( (d.label!==labels[f-1].label)&&(labels[e-1].label !== labels[f-1].label)){
                    phrases.push(d.label +' '+ labels[e-1].label +' '+ labels[f-1].label);
                }
                
            },this);
            sample[e] = grandchild;
        }, this);
        
    var nods = d3.values(sample),
        liks = d3.merge(nods.map(function(source) {
          return source.map(function(target) {
            return {source: source, target: sample[target]};
          });
        }));
        console.log(liks);
    forc
        .nodes(nods)
        .links(liks)
        .start();
      var colorScale = d3.scale.category10();
      let link = svg.selectAll(".link")
        .data(liks)
      .enter().append("line");
      
      var nod = svg.selectAll(".node")
        .data(nods)
      .enter();
      let circle = nod.append("circle")
        .attr("r", 5)
        .style("fill", function(d, i) { return colorScale(i); })
        .call(forc.drag);
        forc.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
        
            circle.attr("cx", function(d) { return d.x; })
                  .attr("cy", function(d) { return d.y; });
        
            //label.attr("x", function(d){return d.x})
                 //.attr("y", function(d) { return d.y; });
            });
        //console.log('samples ', sample);
        d3.selectAll('p').remove();
        var phrase = d3.select("#phrases");
        phrase.selectAll('p')
            .data(phrases)
            .enter()
            .append('p')
            .text(function(d){return d});
    };
    
});

    
});