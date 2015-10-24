
function PickSample() {
    var id = $(this).data('id');
    problem = samples[id];

    initGraphics();
    for (var i = 0; i < problem.g.length; i++)
        graph.addLink(problem.g[i][0], problem.g[i][1], [i, problem.g[i][2]]);

    SaveProblem();

    $("#pick").hide();
    $("#solution").show();
}

function initGraphics() {
    graph = Viva.Graph.graph();

    costs = [];
    flows = [];

    graphics = Viva.Graph.View.svgGraphics();

    var arrow1 = Viva.Graph.svg('marker')
        .attr('id', 'arrow1')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', '10')
        .attr('refY', '5')
        .attr('markerUnits', 'strokeWidth')
        .attr('markerWidth', '10')
        .attr('markerHeight', '5')
        .attr('orient', 'auto');
    arrow1.append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z');

    var arrow2 = Viva.Graph.svg('marker')
        .attr('id', 'arrow2')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', '0')
        .attr('refY', '5')
        .attr('markerUnits', 'strokeWidth')
        .attr('markerWidth', '10')
        .attr('markerHeight', '5')
        .attr('orient', 'auto');
    arrow2.append('path').attr('d', 'M 10 0 L 0 5 L 10 10 z');

    var defs = graphics.getSvgRoot().append('defs');
    defs.append(arrow1);
    defs.append(arrow2);

    geom = Viva.Graph.geom();

    layout = Viva.Graph.Layout.constant(graph);

    graphics.node(Node);
    graphics.placeNode(PlaceNode);
    layout.placeNode(PlaceNodeConstant);
    graphics.link(Link);
    graphics.placeLink(PlaceLink);

    renderer = Viva.Graph.View.renderer(graph, {
        graphics: graphics,
        layout: layout,
        container: document.getElementById("graph")
    });
    renderer.run();
}

function InitialSolution() {
    MST = KruskalMST(problem.g, problem.n);
    labels = RelabelMST(MST, problem.n);
    flow = AssignFlow(MST, problem.n, problem.b, labels[0], labels[1]);
    for (var i = 0; i < flow.length; i++)
        SetStroke(flow[i][0], flow[i][1], 'blue', 2, flow[i][2]);
}

function PotentialsStep() {
    v = AssignPotentials(MST, flow, problem.n, labels[0], labels[1]);

    for (var i = 0; i < problem.n; i++)
        graph.addNode(i, i);
}

function OptimalityStep() {
    // opt is [true/false, number of offending edge, correctly oriented edge]
    opt = Optimality(problem.g, v, problem.n);
    if (opt[0] == true) {
        var f = 0;
        for (var i = 0; i < MST.length; i++)
            f += MST[i][2] * flow[i][2];
        var h = 0;
        for (var i = 0; i < problem.n; i++)
            h += problem.b[i] * v[i];

        $("#status").text("Optimal solution found in " + it + " iterations. Primal cost " + f + ", dual cost " + h);
        return;
    }

    SetStroke(opt[2][0], opt[2][1], 'red', 2, '');
}

function CycleStep() {
    // cycle is [first chain, second chain, edge number, lambda]
    cycle = FindBadCycle(flow, opt[2][0], opt[2][1], problem.n, labels[0], labels[1]);
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
    MST.push(problem.g[opt[1]]);
    labels = RelabelMST(flow, problem.n);

    SetStroke(bad[0], bad[1], 'gray', 1, null);
    SetStroke(opt[2][0], opt[2][1], 'blue', 2, cycle[3]);

    v = undefined;

    for (var i = 0; i < problem.n; i++)
        graph.addNode(i, i);
}
