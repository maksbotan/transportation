
function initGraphics() {
    graph = Viva.Graph.graph();

    costs = [];
    flows = [];

    graphics = Viva.Graph.View.svgGraphics();
    graphics.node(Node);
    graphics.placeNode(PlaceNode);
    graphics.link(Link);
    graphics.placeLink(PlaceLink);

    var layout = Viva.Graph.Layout.forceDirected(graph, {
        springLength: 4*radius,
        gravity: -20
    });

    var renderer = Viva.Graph.View.renderer(graph, {
        graphics: graphics,
        layout: layout,
        container: document.getElementById("graph")
    });
    renderer.run();
}

function InitialSolution() {
    MST = KruskalMST(g, n);
    labels = RelabelMST(MST, n);
    flow = AssignFlow(MST, n, b, labels[0], labels[1]);
    for (var i = 0; i < flow.length; i++)
        SetStroke(flow[i][0], flow[i][1], 'blue', 2, flow[i][2]);
}

function PotentialsStep() {
    v = AssignPotentials(MST, flow, n, labels[0], labels[1]);

    for (var i = 0; i < n; i++)
        graph.addNode(i, i);
}

function OptimalityStep() {
    // opt is [true/false, number of offending edge, correctly oriented edge]
    opt = Optimality(g, v, n);
    if (opt[0] == true) {
        var f = 0;
        for (var i = 0; i < MST.length; i++)
            f += MST[i][2] * flow[i][2];
        var h = 0;
        for (var i = 0; i < n; i++)
            h += b[i] * v[i];

        $("#status").text("Optimal solution found in " + it + " iterations. Primal cost " + f + ", dual cost " + h);
        return;
    }

    SetStroke(opt[2][0], opt[2][1], 'red', 2, '');
}

function CycleStep() {
    // cycle is [first chain, second chain, edge number, lambda]
    cycle = FindBadCycle(flow, opt[2][0], opt[2][1], n, labels[0], labels[1]);
    bad = flow[cycle[2]];

    SetStroke(bad[0], bad[1], 'green', 2, bad[2]);
}

function UpdateStep() {
    UpdateSolution(flow, cycle[0], cycle[1], cycle[3], function (s, d, f) {
        SetStroke(s, d, 'blue', 2, f)
    });

    flow.splice(cycle[2], 1);
    flow.push([opt[2][0], opt[2][1], cycle[3]]);
    MST.splice(cycle[2], 1);
    MST.push(g[opt[1]]);
    labels = RelabelMST(flow, n);

    SetStroke(bad[0], bad[1], 'gray', 1, '');
    SetStroke(opt[2][0], opt[2][1], 'blue', 2, cycle[3]);

    v = undefined;

    for (var i = 0; i < n; i++)
        graph.addNode(i, i);
}