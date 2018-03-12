var width = 960,
height = 800;


d3.json("/Dataset/semanticForce.json", function(error, links) {
    
    var nodes = {};
    var optArray = [];
    var temp = 0
    links.forEach(function(link) {
        link.source = nodes[link.source] || 
            (nodes[link.source] = {name: link.source});
        link.target = nodes[link.target] || 
            (nodes[link.target] = {name: link.target});
        link.value = +link.value;
    });
   
    var colorScale = d3.scale.category10();
    var svg = d3.select('#network').append('svg')
        .attr('width', width)
        .attr('height', height);

    var force = d3.layout.force()
        .size([width, height])
        .charge(-60)
        .nodes(d3.values(nodes))
        .links(links)
        .on("tick", tick)
        .linkDistance(60)
        .start();
        
    var link = svg.selectAll('.link')
        .data(links)
        .enter().append('line')
        .attr('class', 'link')
        .style("stroke-width", "1px")
        .style("stroke", function(d) { 
            if(temp <= d.value){
                temp = d.value
                return colorScale(1); 
            }else {
                temp = d.value
                return colorScale(2);
            }
            
            
        });
        
    var node = svg.selectAll('.node')
        .data(force.nodes())
        .enter();
        
     var circle = node.append('circle')
        .attr('class', 'node')
        .attr('r', width * 0.006);
        //.style("fill", function(d){return colorScale(d.x + d.y)});
    let sidelab = [];            
    var label = node.append("text")
        .attr("dy", ".35em")
        .attr("dx", 8)
        .text(function(d) { 
            optArray.push(d.name);
            sidelab.push(d.name +' (' + d.weight +')');
            return d.name; })
        //.style("fill", "gray")
        .style("font-size","9px");
       
        //wait(10000); 
        var phrase = d3.select("#words");
        phrase.selectAll('li')
            .data(sidelab)
            .enter()
            .append('li')
            //.append('a')
            .attr('data-toggle', 'modal')
            .attr('data-target', '#myModal')
            .text(function(d){return d})
            .on('click', function(d) {
                var d = d3.select(this).node().__data__;
                modifyText(d)
            });  

     function tick(e) {
        circle.attr('cx', function(d) {return d.x})
            .attr('cy', function(d) {return d.y})
            .call(force.drag)
            .on('dblclick', connectedNodes);

        link.attr('x1', function(d){return d.source.x;})
            .attr('y1', function(d){return d.source.y;}) 
            .attr('x2', function(d){return d.target.x;})
            .attr('y2', function(d){return d.target.y;}); 

        label.attr("x", function(d){return d.x})
             .attr("y", function(d) { return d.y; });      
     }   

     //Toggle stores whether the highlighting is on
    var toggle = 0;
    //Create an array logging what is connected to what
    var linkedByIndex = {};
    //window.linkedByIndex = linkedByIndex;
    for (i = 0; i < nodes.length; i++) {
        linkedByIndex[i + "," + i] = 1;
    };
    links.forEach(function (d) {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });
    //This function looks up whether a pair are neighbours
    function neighboring(a, b) {
        return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
    }
    var setId = new Set();
    var isExist = new Set();
    function findNeighbors(node){


        //console.log(node);
        setId.add(node);
       
        circle.style("opacity", function (o) { 
            var flag = neighboring(node, o) | neighboring(o, node);
            if(flag){
                
                if(!setId.has(o)){
                    
                    //console.log(o.name);
                    findNeighbors(o);
                }
                    
            }
            
            return flag ? 1 : 0.03;
        });
    }

    
    
     function connectedNodes() {
         setId.clear();
         isExist.clear();
        if (toggle == 0) {
            //Reduce the opacity of all but the neighbouring nodes to 0.3.
            var d = d3.select(this).node().__data__;
            //console.log('connected node : ', d);
            new Promise((resolve, reject) => {
                findNeighbors(d);
                resolve();
            })
            .then(
                () => 
                    {
                        //var setindex = setId.values();
                        
                        link.style("stroke-opacity", 0);
                        circle.style("opacity", function (o) { return setId.has(o) ? 1 : 0.01}); 
                        label.style("display", function(o) {return setId.has(o) ? "" : "none";});
                        label.style("font-size", function(o) {return setId.has(o) ? "10px" : "8px";});
                        setId.forEach(function (i) {
                            dd = i
                        link.style("stroke-opacity", function (o) {
                            if(dd.index==o.source.index | dd.index==o.target.index){
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
                        });
                    });
                        
                    }
            )
           
            toggle = 1;
        } else {
            //Restore everything back to normal
            circle.style("opacity", 1);
            link.style("stroke-opacity", 1);
            //link.style("stroke-width", 1);
            label.style("display", "");
            label.style("font-size", "8px");
            toggle = 0;
        }
    }  
    
    populatelist();
    function populatelist(nodes){
        
            //console.log('ul items: ', ul);    
        }
        var phrases = []
        function checkAdult(rawdata) {
            let term = document.getElementById('title').innerHTML;
            //console.log('term: ', term);
            return (rawdata.indexOf(term) > -1);
        }
    function modifyText(d){
        let textid = d.split(" ");
        let modalhead = document.getElementById('title');
        modalhead.innerHTML = textid[0];
        var myrawdata = rawdata.filter(checkAdult);
        var filterlist = d3.select("#minornode");
        filterlist.selectAll('li').remove();
        filterlist.selectAll('li')
            .data(myrawdata)
            .enter()
            .append('li')
            .text(function(d){return d});
        //document.getElementById("minornode").innerHTML = rawdata.filter(checkAdult);
        let newLinks = [];
        myrawdata.forEach(function(a){
            let xy = a.split(' ');
            for(i =0; i < xy.length -1; i++){
                var newLink = new Object();
                newLink.source = xy[i];
                newLink.target = xy[i+1];
                //console.log(newLink);
                newLinks.push(newLink);
            }
        });
        console.log(newLinks);

    }
    
    optArray = optArray.sort();
    $(function () {
        $("#filterInp").autocomplete({
            source: optArray,
            select: function(event, ui){ 
                $("#filterInp").val(ui.item.label);
                searchNode();
            }
        });
    });
    $("#filterInp").focus(function(){
        $(this).css("background-color", "#ffffff");
    });
    //console.log(optArray);
    function searchNode() {
        
        //find the nodedocument.getElementById("filterInp");
        var selectedVal = document.getElementById('filterInp').value;
        var node = svg.selectAll(".node");
        if (selectedVal == "none") {
            node.style("stroke", "white").style("stroke-width", "1");
        } else {
            var selected = node.filter(function (d, i) {
                return d.name != selectedVal;
            });
            selected.style("opacity", "0");
            var link = svg.selectAll(".link")
            link.style("opacity", "0");
            d3.selectAll(".node, .link").transition()
                .duration(5000)
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
        
        //console.log('rawdata: ', rawdata);
   

});