

$(document).ready(function(){
    var mydatavar = "/Dataset/withIndex.csv";
    var num = $('#fiterByNumber').val();
    var more = 1;
    var term = parseInt(num, 0);
    //alert(term);
    $('#filtersubmit').click(function() {
            more = 6;
            term = $('#filter').val();
            console.log('more: ', more, ' term: ', term);
            //mydatavar = '/Dataset/my'+this.text+'.csv';
            d3.selectAll('svg').remove(); 
            mygrah(mydatavar);
        //alert('Searching for ' + $('#filter').val());
    });
    $('#submitfilt').click(function(){
            more = 6;
            term = $('#submittext').val();
            console.log('more: ', more, ' term: ', term);
            //mydatavar = '/Dataset/my'+this.text+'.csv';
            d3.selectAll('svg').remove(); 
            mygrah(mydatavar);
        //alert('searching.....');
    })
        $(function () {
             $('#datetimepicker1').datetimepicker();
             //$('#datetimepicker1').data("DateTimePicker").maxDate(2015-01-01);
             $('#datetimepicker2').datetimepicker({
                 useCurrent: false, //Important! See issue #1075
              });
             $("#datetimepicker1").on("dp.change", function (e) {
             $('#datetimepicker2').data("DateTimePicker").minDate(e.date);
            });
            $("#datetimepicker2").on("dp.change", function (e) {
                 $('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
        });
    });
    
        mygrah(mydatavar);
        $('#submitfil').on('click',function(){
            num = $('#fiterByNumber').val();
            term = parseInt(num, 0);
            more = $('#selectcat').val();
            console.log('more: ', more, ' term: ', term);
            //mydatavar = '/Dataset/my'+this.text+'.csv';
            d3.selectAll('svg').remove(); 
            mygrah(mydatavar);
        });
        $('#fiterByNumber').on('blur',function(){          
            num = $('#fiterByNumber').val();
            term = parseInt(num, 0);
            more = $('#selectcat').val();
            //alert('hello');             
            console.log('more: ', more, ' term: ', term);
            //mydatavar = '/Dataset/my'+this.text+'.csv';
            d3.selectAll('svg').remove(); 
            mygrah(mydatavar);
                     
           
            //alert('hello')
        });
function mygrah(param){
    
    var width = 1200,
    height = 1000,
    padding = 1.5, // separation between same-color nodes
    clusterPadding = 6, // separation between different-color nodes
    maxRadius = 40;
    minRadius = 20;    
      d3.csv(param, function(data) {
          data = data.filter(function(row) {
              if(more == 1){
                return row['Counter'] > term;
            } else if(more == 2) {
                return row['Counter'] > term;
            } else if(more == 4) {
                return row['Counter'] == term;
            } else if(more == 3) {
                return row['Id'] < term;
            } else if(more == 6) {
                return (row.name.indexOf(term) === 0);
                //return row['name'] == term;
            } else {
                return row['Counter'] > 100;}
          })
        //calculate teh maximum group present
        m = d3.max(data, function(d){return d.group});
        //create teh color categories
        color = d3.scale.category20()
        .domain(d3.range(m));
        //make teh clusters array each cluster for each group
        clusters = new Array(m);
        dataset = data.map(function(d) {
            //find teh radius intered in the csv
        var r = parseInt(d.radius);
            
            var dta = {
            cluster: d.group,//group
            name: d.name,//label
            radius: r,//radius
            x: Math.cos(d.group / m * 2 * Math.PI) * 100 + width / 2 + Math.random(),
            y: Math.sin(d.group / m * 2 * Math.PI) * 100 + height / 2 + Math.random()
            };
            //add the one off the node inside teh cluster
            if (!clusters[d.group] || (d.radius > clusters[d.group].radius)) clusters[d.group] = dta;
            return dta;
        });
        //after mapping use that t make the graph
        makeGraph(dataset);
        });
  //}

        //this will make the grapg from nodes
        function makeGraph(nodes) {
             //d3.selectAll("svg > *").remove();            
            var force = d3.layout.force()
                .nodes(nodes)
                .size([width, height])
                .gravity(.02)
                .charge(0)
                .on("tick", tick)
                .start();
            var svg = d3.select(".body").append("svg")
                .attr("width", width)
                .attr("height", height);
            var node = svg.selectAll("circle")
                .data(nodes)
                .enter().append("g").call(force.drag);
        //addcircle to the group
            node.append("circle")
                .style("fill", function(d) {
                return color(d.cluster);
                }).attr("r", function(d) {
                return d.radius
                })
            //add text to the group    
            node.append("text")
                .text(function(d) {
                return d.name;
                })
                .attr("dx", -10)
                .attr("dy", ".35em")
                .text(function(d) {
                return d.name
                })
                .style("stroke", "none");
            function tick(e) {
                node.each(cluster(10 * e.alpha * e.alpha))
                .each(collide(.5))
                //.attr("transform", functon(d) {});
                .attr("transform", function(d) {
                    var k = "translate(" + d.x + "," + d.y + ")";
                    return k;
                })

            }

        // Move d to be adjacent to the cluster node.
            function cluster(alpha) {
                return function(d) {
                var cluster = clusters[d.cluster];
                if (cluster === d) return;
                var x = d.x - cluster.x,
                    y = d.y - cluster.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + cluster.radius;
                if (l != r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    cluster.x += x;
                    cluster.y += y;
                }
                };
            }

        // Resolves collisions between d and all other circles.
            function collide(alpha) {
                var quadtree = d3.geom.quadtree(nodes);
                return function(d) {
                var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                    nx1 = d.x - r,
                    nx2 = d.x + r,
                    ny1 = d.y - r,
                    ny2 = d.y + r;
                quadtree.visit(function(quad, x1, y1, x2, y2) {
                    if (quad.point && (quad.point !== d)) {
                    var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                    if (l < r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                    }
                    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                });
                };
            }
        }
        

 //refresh();
};
function togglebtw() {
    var x = document.getElementById('fiterByNumber2');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}
}); 