
// Graph storage format: list of triples (i, j, c)

function KruskalMST(graph, n) {
    var dsu = new DSU(n);
    var m = graph.length;

    var MST = new Array();

    // Sort by costs ascending
    graph.sort(function (a, b) {
        return a[2] - b[2];
    });

    for (var i = 0; i < m; i++) {
        var s = dsu.find(graph[i][0]),
            d = dsu.find(graph[i][1]);

        if (s != d) {
            dsu.union(s, d);
            MST.push(graph[i]);
        }
    }

    return MST;
}

function OtherEnd(edge, v) {
    return edge[0] == v ? edge[1] : edge[0];
}

function RelabelMST(MST, n) {
    var Q = [0];
    var vN = [],
        eN = [],
        visited = [];

    vN[0] = 0;
    var k = 1;

    while (Q.length > 0) {
        var v = Q.shift();
        visited[v] = true;
        for (var i = 0; i < MST.length; i++) {
            if ((MST[i][0] == v) || (MST[i][1] == v)) {
                var u = OtherEnd(MST[i], v);
                if (visited[u] != undefined)
                    continue;
                Q.push(u);
                vN[k] = u;
                eN[k] = i;
                k++;
            }
        }
    }

    return [vN, eN];
}
