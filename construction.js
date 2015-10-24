
function AddVertex() {
    if (typeof(problem) == 'undefined') {
        problem = {n: 0, g: [], b: [], positions: []};
        initGraphics();
    }

    var capacity = prompt("Please specify capacity of the vertex");
    if (!capacity)
        return;

    problem.b.push(parseInt(capacity));
    problem.positions.push({x: problem.n*3*radius, y: 0});

    graph.addNode(problem.n);

    problem.n++;
}

function AddEdge() {
    if (typeof(problem) == 'undefined')
        return;

    var cost = prompt("Please specify the cost of the edge, then click two of its ends");
    if (!cost)
        return;

    problem.g.push([0, 0, parseInt(cost)]);
    stage = "first";
}

function DoAddEdge() {
    if (typeof(problem) == 'undefined')
        return;

    var id = $(this).data('id');

    if (stage == "first") {
        problem.g[problem.g.length - 1][0] = id;
        stage = "second";
    } else if (stage == "second") {
        var edge = problem.g[problem.g.length - 1];
        if (edge[0] == id) // Disallow loops
            return;

        problem.g[problem.g.length - 1][1] = id;
        stage = "done";

        graph.addLink(edge[0], edge[1], [problem.g.length - 1, edge[2]]);
    }
}

function SaveProblem() {
    localStorage["transportation.problem"] = JSON.stringify(problem);
}
