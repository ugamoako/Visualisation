var width = 1000,
    height = window.innerHeight;
var rawdata = [];
let sidelab = [];
let optArray = [];     
var toggle = 0;
var url = "http://localhost:3000/users/m0";
d3.json(url, function (json) {
    json.forEach((e)=>{
        //rawdata.push(e.text);
        if(e.text !== null)
            rawdata.push(e.text);
            //console.log('new json rec',e.text.split(' '));
    });
    createJson(rawdata);
});
d3.csv("Dataset/groupmsg.csv", function(d) {
    populateTranscriptView(d);
});

function createJson(data){
    let nodes = {};
    let newLinks = [];
    new Promise((resolve, reject) => {
        data.forEach(function(a){
            let xy = a.split(' ');
            for(i =0; i < xy.length -1; i++){
                var newLink = {};
                newLink["source"] = xy[i];
                newLink["target"] = xy[i+1];
               newLinks.push({"source": xy[i], "target":xy[i+1], "value": 1});

            }
        });
        
        resolve();
    })
    .then(
        () => 
            {
                newLinks.forEach(function(link) {
                    link.source = nodes[link.source] || 
                        (nodes[link.source] = {name: link.source});
                    link.target = nodes[link.target] || 
                        (nodes[link.target] = {name: link.target});
                    link.value = +link.value;
                });
                drawgraph(nodes, newLinks);
               
                
                console.log('links>>>', newLinks);
                //populateTranscriptView(sidelab);
            });  
}
function drawgraph(nodes, links){

    var colorScale = d3.scale.category10();
    var svg = d3.select('#network').append('svg')
        .attr('width', width)
        .attr('height', height);
    var force = d3.layout.force()
        .size([width, height])
        .charge(-80)
        .nodes(d3.values(nodes))
        .links(links)
        .on("tick", tick)
        .linkDistance(60)
        .start();

    var link = svg.selectAll('.link')
        .data(links)
        .enter().append('line')
        .attr('class', 'link')
        .style("stroke-opacity", function(d) { 
            //console.log('good: ', Math.sqrt(d.source.weight*0.01));
            return Math.sqrt(d.source.weight * 0.01);
        });
        //.style("stroke", function(d) { return colorScale(1);}); 
       //console.log(links);
    var node = svg.selectAll('.node')
        .data(force.nodes())
        .enter();  
    var circle = node.append('circle')
        .attr('class', 'node')
        .attr('r', function(d) {
            const r = width * 0.001 * d.weight;
            const i = width * 0.004;
            return r > i ? r: i;
        });  
        
    var label = node.append("text")
        .attr("dy", ".35em")
        .attr("dx", 8)
        .text(function(d) { 
            optArray.push(d.name);
            sidelab.push({"name" : d.name, "count" : d.weight});
            return d.name; })
        .style("font-size","9px");

        function tick(e) {
            circle.attr('cx', function(d) {return d.x})
                .attr('cy', function(d) {return d.y})
                .call(force.drag)
                .on('dblclick', connectednodes);

            link.attr('x1', function(d){return d.source.x;})
                .attr('y1', function(d){return d.source.y;}) 
                .attr('x2', function(d){return d.target.x;})
                .attr('y2', function(d){return d.target.y;}); 

            label.attr("x", function(d){return d.x})
                 .attr("y", function(d) { return d.y; });      
         }  
          
}
let toggleTable = false;        
function tableView(){
    var filterlist = d3.select("#ui-to-buttom");
    if(!toggleTable){
        $('#ui-to-buttom').css({'height':'500px', 'opacity':1});
        filterlist.selectAll('li').remove();
        filterlist.selectAll('li')
            .data(rawdata)
            .enter()
            .append('li')
            .text(function(d){return d})
            .on('mouseover', highlighConnection);
        toggleTable = true;
    } else {
        filterlist.selectAll('li').remove();
        d3.select('svg').remove();
        createJson(rawdata); 
        $('#ui-to-buttom').css({'height':'200px', 'opacity':0.7});
        toggleTable = false;
    }
   
}
    function populateTranscriptView(data){
        var sortAscending = true;
        var table = d3.select('#words').append('table');
        var titles = d3.keys(data[0]);
        var headers = table.append('thead').append('tr')
                         .selectAll('th')
                         .data(titles).enter()
                         .append('th')
                         .text(function (d) {
                              return d;
                          })
                         .on('click', function (d) {
                             //headers.attr('class', 'header');
                             var x = d3.select(this).node().__data__;
                             //sconsole.log('clicked value: ', x);
                             if (sortAscending) {
                               rows.sort(function(a, b) { 
                                if (a[x] < b[x]) { 
                                    return -1; 
                                  } else if (a[x] > b[x]) { 
                                    return 1; 
                                  } else {
                                    return 0;
                                  }
                                //console.log('a value: ', a.name, 'b value: ', b.name);
                                 });
                               sortAscending = false;
                               this.className = 'aes';
                             } else {
                                rows.sort(function(a,b) { 
                                    if (a[x] < b[x]) { 
                                      return 1; 
                                    } else if (a[x] > b[x]) { 
                                      return -1; 
                                    } else {
                                      return 0;
                                    }
                                  });
                               sortAscending = true;
                               this.className = 'des';
                             }
                             
                         });
                        
        var rows = table.append('tbody').selectAll('tr')
                     .data(data).enter()
                     .append('tr');
        rows.selectAll('td')
          .data(function (d) {
              return titles.map(function (k) {
                  return { 'conv_count': d[k], 'movie': k};
              });
          }).enter()
          .append('td')
          .attr('data-th', function (d) {
              return d.movie;
          })
          
          .append('div').attr('class', function(d, i){
            return i==0 ? 'movie': 'conv_count';
          })
          .text(function (d) {
            return d.conv_count;
        })
          .style('width', function(d, i){
            return i==0 ? '': Math.round(d.conv_count * 0.1) +'px';
          })
          .on('click', function (d) {
              //modifyText(d.conv_count);
              //console.log('you clicked me...', d.value);
              clickedMovie(d.movie);
          })
          .on('mousemove', function(d){
              //searchNode(d.value);
              //selectNode(d.conv_count);
            });
          //.on('mouseout', deSelectNode); 
          
        /*var width = 100,
          barHeight = 20;
                   
        var x = d3.scale.linear()
                  .range([0, width]);
                   
        x.domain([0, d3.max(data, function(d) { return d.conv_count; })]);
        //chart.attr("height", barHeight * data.length);
        var chart = rows.append("td").attr("class", "chart").attr("width", width);
          var bar = chart.selectAll(".conv_count")
              .data(data)
              .enter().append("g")
              .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
        
          bar.append("rect")
              .attr("width", function(d) { return x(d.conv_count); })
              .attr("height", barHeight - 1);
        
          bar.append("text")
              .attr("x", function(d) { return x(d.conv_count) - 3; })
              .attr("y", barHeight / 2)
              .attr("dy", ".35em")
              .text(function(d) { return d.conv_count; });*/

           
    }        
    function clickedMovie(d){
        console.log('hello good');
    }

        function modifyText(d){
            if(d.length < 4){ d+= ' '}
            //let textid = d.split(" ");
            //console.log('modify text is called.', d);
            function checkOneNode(rawdata) {
                //let term = document.getElementById('title').innerHTML;
                return (rawdata.indexOf(d) > -1);
            }
            let myrawdata = rawdata.filter(function(e){
                
                return e.match(d);
            });
            //console.log('modify text is called.', myrawdata);
            let modalhead = document.getElementById('title');
                modalhead.innerHTML = d;
            var filterlist = d3.select("#ui-to-buttom");
            filterlist.selectAll('li').remove();
            filterlist.selectAll('li')
                .data(myrawdata)
                .enter()
                .append('li')
                .text(function(d){return d})
                .on('mouseover', highlighConnection);
            d3.select('svg').remove();
                
            createJson(myrawdata);    
            //document.getElementById("minornode").innerHTML = rawdata.filter(checkAdult);
            
        }
       
        function connectednodes(){
            if (toggle === 0) {
            let d = d3.select(this).node().__data__;
            let circle = d3.selectAll('circle')
                .attr('data-toggle', 'modal')
                .attr('data-target', '#myModal');
            //console.log(d.name);
            toggle = 1;
            modifyText(d.name)
            
            } else {
                d3.select('svg').remove(); 
                toggle = 0; 
                createJson(rawdata);
                   
            }
        }
    optArray = optArray.sort();
        $(function () {
            $("#filterInp").autocomplete({
                source: optArray,
                select: function(event, ui){ 
                    $("#filterInp").val(ui.item.label);
                    var selectedVal = document.getElementById('filterInp').value;
                    searchNode(selectedVal);
                }
            });
        });
        $("#filterInp").focus(function(){
            $(this).css("background-color", "#ffffff");
        });
        

        function highlighConnection(){
            var isExist = new Set();
            let d = d3.select(this).node().__data__;
            let textLinks = d.split(" ");
            let link = d3.selectAll('.link');
            let circle = d3.selectAll('.node');
            //console.log('circle passed: ', circle);
            circle.style("fill", function (o) { return textLinks.indexOf(o.name)> -1? '#DF1843': '#ccc'});
            for(i=0;i<textLinks.length -1; i++){
                link.style("stroke-opacity", function (o) {
                    if(textLinks[i]==o.source.name & textLinks[i+1]==o.target.name){
                        isExist.add(o);
                        
                        //console.log('is exist>>>', isExist);
                        return 1;
                    }
                    else {
                        if(isExist.has(o)){
                            return 1;
                        } else {
                            return 0;
                        }
                        
                    }
                    //console.log(i.index);
                   //console.log('neighbours: ', getNeighboursByNodeId(i.index)); 
                }).style('stroke', '#DF1843');
            }
            
           } 
        //console.log(optArray);
        function selectNode(selectedVal){
            var node = d3.selectAll(".node");
            if (selectedVal == "none") {
                node.style("stroke", "white").style("stroke-width", "1");
            } else {
                var selected = node.filter(function (d, i) {
                    return d.name != selectedVal;
                });
                selected.style("opacity", "0");
                node.style('fill', '#DF1843');
                var link = d3.selectAll(".link")
                    link.style("opacity", "0");
                
            }
        }
        function deSelectNode(){
            d3.selectAll(".node, .link").transition()
                    .duration(500)
                    .style('fill', '#ccc')
                    .style("opacity", 1);
        }
        
        function searchNode(selectedVal) {
            
            var node = d3.selectAll(".node");
            if (selectedVal == "none") {
                node.style("stroke", "white").style("stroke-width", "1");
            } else {
                var selected = node.filter(function (d, i) {
                    return d.name != selectedVal;
                });
                selected.style("opacity", "0");
                var link = d3.selectAll(".link")
                    link.style("opacity", "0");
                d3.selectAll(".node, .link").transition()
                    .duration(2000)
                    .style("opacity", 1);
            }
        }
        let filterInput = document.getElementById("filterInp");
        filterInput.addEventListener("keyup", filterwords)
        function filterwords(){
            let filterValue = document.getElementById("filterInp").value;
            
            let ul = document.getElementById("words");
            let li = ul.querySelectorAll('li');
            
            for(let i = 0; i < li.length; i++){
                let a = li[i];
                //console.log(a.innerHTML);
                if(a.innerHTML.indexOf(filterValue) > -1){
                    li[i].style.display = '';
                } else {
                    li[i].style.display = 'none';
                }
            }
        };

        $(document).ready(function(){
            $('[data-tooltip="tooltip"]').tooltip({'placement': 'left'});
        });
            
            //console.log('rawdata: ', rawdata);
       

    