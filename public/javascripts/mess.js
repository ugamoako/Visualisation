var width = 1200,
    height = 1200

var svg = d3.select(".force").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .gravity(0.10)
    .distance(300)
    .charge(-1400)
    .size([width, height]);

d3.json("/Dataset/forces.json", function(error, json) {
  if (error) throw error;

  force
      .nodes(json.nodes)
      .links(json.links)
      .start();

  var link = svg.selectAll(".link")
      .data(json.links)
    .enter().append("line")
      .attr("class", "link");

  var node = svg.selectAll(".node")
      .data(json.nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(force.drag);

  node.append("image")
      .attr("xlink:href", "/images/globe.png")
      .attr("x", -8)
      .attr("y", -8)
      .attr("width", 12)
      .attr("height", 12);

  node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    
  });
});

//link.style("stroke-opacity", function (o) {
                                    
                                        //if(i.index==o.source.index || i.index==o.target.index ){
                                            //console.log('item 1: ', i.index, 'item 2: ', o.source.index , o.target.index);
                                            //link.style("opacity", 1);
                                            //return 1;
                                          // }
                                        //return d.index==o.source.index || d.index==o.target.index ? 1: 0.03;
                                //});
                                    //console.log('item 1: ', i, 'item 2: ', o);
                                    //return i.index==o.source.index | i.index==o.target.index ? 1 : 0.03;
                                
                                
                                //console.log('set index item: ', i);
                            //});
                            

        /*var fisheye = d3.fisheye.circular()
                .radius(200);
          svg.on("mousemove", function() {
                force.stop();
                fisheye.focus(d3.mouse(this));
                d3.selectAll("circle").each(function(d) { d.fisheye = fisheye(d); })
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
              });*/     
        /*var ul = d3.selectAll("ul").append('li')
            .data(sidelab)
            .enter().append('li')
            .text(function(d){return d;})
            .on("click", modifyText); */
     
             
        
        new Promise((resolve, reject) => {
            
             resolve();
         })
         .then(
             () => 
                 {
                 
                     
                     
                 })
 
         // Compute the distinct nodes from the links.
            
         //console.log(nodes);

          
                //circle.style("opacity", function (o) { return setId.has(0) ? 1 : 0.01});
                //circle.style("opacity", function (o) { 

                    //var flag = neighboring(d, o) | neighboring(o, d);
                    //console.log('flags: ', flag);
                    //return flag ? 1 : 0.03;
                //});
                /*label.style("display", function(o) {
                    return neighboring(d, o) | neighboring(o, d) ? "" : "none";
                });*/
                /*label.style("font-size", function(o) {
                    return neighboring(d, o) | neighboring(o, d) ? "10px" : "8px";
                });*/
                //Reduce the opacity of all but the neighbouring edges to 0.8.
                /*link.style("opacity", function (o) {
                    return d.index==o.source.index | d.index==o.target.index ? 1 : 0.03;
                });*/
                //Increases the stroke width of the neighbouring edges.
                
                //Reset the toggle.
                     
       /* for (var i = 0; i < nodes.length - 1; i++) {
            
            
        }*/




        //great mess

       
        setId.clear();
        isExist.clear();
       
        //findNeighbors(dataNode);
        if (toggle == 0) {
            //Reduce the opacity of all but the neighbouring nodes to 0.3.
            let dataNode = nodes[textid[0]];
            new Promise((resolve, reject) => {
                findNeighbors(dataNode);
                resolve();
            })
            .then(
                () => 
                    {
                        link.style("stroke-opacity", 0);
                        circle.style("opacity", function (o) { return setId.has(o) ? 1 : 0.01}); 
                        label.style("display", function(o) {return setId.has(o) ? "" : "none";});
                        label.style("font-size", function(o) {return setId.has(o) ? "10px" : "8px";});
                        setId.forEach(function (e) {
                            dd = e
                            //phrases.push(dd.name);
                        link.style("stroke-opacity", function (o) {
                            if(dd.index==o.source.index | dd.index==o.target.index){
                                isExist.add(o);
                                return 1;
                            }
                            else {
                                if(isExist.has(o)){
                                    return 1;
                                } else {
                                    return 0;
                                }
                            }
                        });
                    });
                        
                    }
            )
           
            toggle = 0;
        } else {
            //Restore everything back to normal
            circle.style("opacity", 1);
            link.style("stroke-opacity", 1);
            label.style("display", "");
            label.style("font-size", "8px");
            toggle = 0;
        }
        
        var arr = [];
        new Promise((resolve, reject) => {
            var ds = [];
            setId.forEach(function (e) {
                arr.push(e.name);
            });
            /*arr = $.map(ds, function(value, index) {
                return [value];
            });*/
            /*var arr = $.map(phrases, function(value, index) {
                return [value];
            });*/
            
            resolve();
            })
            .then(
                () => 
                    {
                        var x = document.getElementById("minornode");
                        x.innerHTML = arr.join(" ");
                        //console.log('list:: ', arr.join(" "));
                        
                    });
        
       
           
        //let phrase = d3.select('#phrases');
        //var x = document.getElementById("minornode");
        //var s = phrases;
        //console.log('joined phrases>>> ', s);
        //x.innerHTML = s
//script(src='/javascripts/semanticForce.js')
   
   //h1 Pyfia Oracle Data Visualization
   //p.
   Pythia is an interactive sonic sculpture, analyzing the audience’s speech and interpreting it into 
   absurd or perhaps prophetic messages, the so-called divine glitch. <a href='http://www.sonicartist.me/wp/pythia/'> Read more...</a>
  //P.
   The Visualization below represent the data collected in an eleven month period in the year 2015.
   this Visualization is interactive and the user can select in between time periods to analyse the 
   frequency in the words or phrase for such periods. Also, a single word or phrase can be looked up
   via the search boxes to visualise its existence or frequency in the oracle. Detailed report on the
   analysis of the data can be found in the report tab located in the navigation bar or click <a href='/report.jade'> here</a>

  //ul.nav.nav-pills.nav-justified
   li.active
     a(a data-toggle="pill" href="#home") Force-Directed Graph
   li
     a(a data-toggle="pill" href="#hierarchy") Bubble Chart
   li
     a(a data-toggle="pill" href="#size") Tree Chart
  //.tab-content
   #home.tab-pane.fade.in.active
     iframe(src='/force' style="width:100%; height:100%; position:absolute; border:none; overflow:hidden")
   #hierarchy.tab-pane.fade
     iframe(src='/bubble' style="width:1200px; height:1000px; border:none; overflow:auto")
   #size.tab-pane.fade
     iframe(src='/tree' style="width:1200px; height:1000px; border:none; overflow:auto")
    