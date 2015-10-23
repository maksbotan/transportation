
function Optimality(graph, v, n) {
    var max = 0,
        s1, d1, i0;

    for (var i = 0; i < n; i++) {
        var s = graph[i][0],
            d = graph[i][1],
            c = graph[i][2];

        if (Math.abs(v[s] - v[d]) - c > max) {
            s1 = (v[s] < v[d]) ? s : d,
            d1 = (v[s] < v[d]) ? d : s;
            i0 = i;
        }
    }

    if (s1 != undefined)
        return [false, i0, [s1, d1]];
    else
        return [true];
}

function FindBadCycle(flow, s, d, n, vN, eN) {
    var c1 = [[s, 0, -1]],
        c2 = [[d, 0, -1]];
    var i0 = -1,
        min;

    // Traversing edges from vertex s and from vertex d
    // When going from s, direction is _against_ cycle oriented by s->d
    // When going from d, direction is _along_ the same cycle

    for (var i = n - 1; i > 0; i--) {
        if (vN[i] == c1[0][0]) {
            var sign = (flow[eN[i]][0] == vN[i]) ? -1 : 1
            c1.unshift([ OtherEnd(flow[eN[i]], vN[i]), sign, eN[i] ]);
            if (sign == -1)
                if (i0 == -1 || flow[eN[i]][2] < min) {
                    i0 = eN[i];
                    min = flow[eN[i]][2];
                }
        }
        if (vN[i] == c2[c2.length - 1][0]) {
            var sign = (flow[eN[i]][0] != vN[i]) ? -1 : 1
            c2.push([ OtherEnd(flow[eN[i]], vN[i]), sign, eN[i] ]);
            if (sign == -1)
                if (i0 == -1 || flow[eN[i]][2] < min) {
                    i0 = eN[i];
                    min = flow[eN[i]][2];
                }
        }

        if (c1[0][0] == c2[c2.length - 1][0])
            return [c1, c2, i0, min];
    }
}

function UpdateSolution(flow, c1, c2, l, cb) {
    var c = c1.concat(c2);

    for (var i = 0; i < c.length; i++)
        if (c[i][1] != 0) {
            flow[c[i][2]][2] += c[i][1] * l;
            if (cb != undefined)
                cb(flow[c[i][2]][0], flow[c[i][2]][1], flow[c[i][2]][2]);
        }
}
