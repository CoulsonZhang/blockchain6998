window.onload = function() {

    const nodes = [
        { "name": "Myriel",             "group":  1 , id: 0},
        { "name": "Napoleon",           "group":  2 , id: 1},
        { "name": "Mlle.Baptistine",    "group":  3 , id: 2},
        { "name": "Mme.Magloire",       "group":  4 , id: 3},
        { "name": "CountessdeLo",       "group":  5 , id: 4},
        { "name": "Geborand",           "group":  6 , id: 5},
        { "name": "Champtercier",       "group":  7 , id: 6},
        { "name": "Cravatte",           "group":  8 , id: 7},
        { "name": "Count",              "group":  9 , id: 8}
    ];

        const links = [
        { "source":  1,  "target":  0,  "value":  1 }
    ];


        var fisheye = d3.fisheye.circular()
                    .radius(100)
                    .distortion(5);

        const svg = d3.select("svg");
        const width = +svg.attr("width");
        const height = +svg.attr("height");

        // The simulation now uses the name property to link nodes
        const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-30))
        .force("center", d3.forceCenter(width / 2, height / 2));

        // Create the links between nodes
        const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

        // Create the nodes
        const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", colorByGroup)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        // Create the labels for nodes
        const label = svg.append("g")
        .selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("dx", 15)
        .attr("dy", ".35em")
        .text(d => d.name)
        .style("fill", "grey");

        // Define a color scale for the nodes
        function colorByGroup(d) {
            // Set the domain to cover all groups from 1 to 2 (adjust if you have more groups)
            const scale = d3.scaleOrdinal(d3.schemeCategory10).domain([0, 1, 2,3,4,5,6,7,8,9,10]);
            console.log('Group:', d.group, 'Color:', scale(d.group)); // Debug statement
            return scale(d.group);
        }

        // Update simulation on each tick
        simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        label
            .attr("x", d => d.x)
            .attr("y", d => d.y);
        });

        // Functions to handle drag events
        function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        }

        function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
        }

        function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        }

        svg.on("mousemove", function() {
            fisheye.focus(d3.mouse(this));
            

            node.each(function(d) { d.fisheye = fisheye(d); })
                .attr("cx", function(d) { return d.fisheye.x; })
                .attr("cy", function(d) { return d.fisheye.y; })
                .attr("r", function(d) { return d.fisheye.z * 4.5; });

            link.attr("x1", function(d) { return d.source.fisheye.x; })
                .attr("y1", function(d) { return d.source.fisheye.y; })
                .attr("x2", function(d) { return d.target.fisheye.x; })
                .attr("y2", function(d) { return d.target.fisheye.y; });
            label.each(function(d) { d.fisheye = fisheye(d); })
                .attr("x", d => d.fisheye.x + (d.fisheye.z * 5)) 
                .attr("y", d => d.fisheye.y)
                .style("font-size", d => `${d.fisheye.z * 10}px`);
        });
    }