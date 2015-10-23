
var radius = 40;

function Node(node) {
    var value = Viva.Graph.svg('text')
        .text('' + b[node.id])
        .attr('text-anchor', 'middle')
        .attr('dx', radius)
        .attr('dy', 2 * radius / 3);
    if (typeof(v) != 'undefined') {
        var pot = Viva.Graph.svg('text')
            .text('' + v[node.id])
            .attr('text-anchor', 'middle')
            .attr('dx', radius)
            .attr('dy', radius + 2 * radius / 3)
            .attr('stroke', 'blue');
    }
    var circle = Viva.Graph.svg('circle')
        .attr('cx', radius)
        .attr('cy', radius)
        .attr('r', radius)
        .attr('fill', 'white')
        .attr('stroke', 'black');
    var line = Viva.Graph.svg('line')
        .attr('x1', 0)
        .attr('x2', 2*radius)
        .attr('y1', radius)
        .attr('y2', radius)
        .attr('stroke', 'black');

    var ui = Viva.Graph.svg('g');
    ui.append(circle);
    ui.append(line);
    ui.append(value);
    if (typeof(v) != 'undefined')
        ui.append(pot);

    node.isPinned = true;

    return ui;
}

function PlaceNode(nodeUI, pos) {
    nodeUI.attr('transform', 'translate(' + (pos.x - radius) + ',' + (pos.y - radius) + ')');
}

function Link(link, fromPos, toPos) {
    var i = link.data[0],
        c = link.data[1];

    var label = Viva.Graph.svg('text')
        .text(c);
    costs[i] = label;
    var flow_label = Viva.Graph.svg('text')
        .text('')
        .attr('stroke', 'blue');
    flows[i] = flow_label;
    graphics.getSvgRoot().childNodes[0].append(label);
    graphics.getSvgRoot().childNodes[0].append(flow_label);

    return Viva.Graph.svg('path')
        .attr('stroke', 'gray')
        .attr('data-id', i);
}

function degrees(x) {
    return x * (180 / Math.PI);
}

function PlaceLink(linkUI, fromPos, toPos) {
    var data = 'M' + fromPos.x + ',' + fromPos.y +
               'L' + toPos.x + ',' + toPos.y;
    var label = costs[linkUI.attr('data-id')],
        flow_label = flows[linkUI.attr('data-id')];

    linkUI.attr('d', data);

    var x = (fromPos.x + toPos.x) / 2,
        y = (fromPos.y + toPos.y) / 2,
        angle = Math.atan((toPos.y - fromPos.y) / (toPos.x - fromPos.x));
    label
        .attr('x', x + 8*Math.sin(angle))
        .attr('y', y - 8*Math.cos(angle))
        .attr('transform', 'rotate(' + degrees(angle) + ',' + x + ',' + y +')');
    flow_label
        .attr('x', x + 8*Math.sin(angle))
        .attr('y', y - 8*Math.cos(angle) + 22)
        .attr('transform', 'rotate(' + degrees(angle) + ',' + x + ',' + y +')');
}

function SetStroke(s, d, stroke, width, f) {
    var set = false;
    graph.forEachLinkedNode(s, function(node, link) {
        if (node.id != d)
            return;

        set = true;

        var linkUI = graphics.getLinkUI(link.id);
        linkUI.attr('stroke', stroke);
        linkUI.attr('stroke-width', width);

        if (flow != undefined) {
            var id = linkUI.attr('data-id');
            flows[id].text(f);
        }
    });
}
