
function AssignFlow(ST, n, b, vN, eN) {
    var flow = [];
    b = b.slice(0);

    for (var i = n - 1; i > 0; i--) {
        var e = ST[eN[i]];
        var s = e[0],
            d = e[1];
        if (vN[i] == s) {
            var t = s;
            s = d;
            d = t;
        }

        if (b[d] > 0)
            flow[eN[i]] = [s, d, b[d]];
        else
            flow[eN[i]] = [d, s, -b[d]];
        b[s] += b[d];
    }

    return flow;
}

function AssignPotentials(ST, flow, n, vN, eN, s) {
    var v = [];
    v[0] = 0;

    for (var i = 1; i < n; i++) {
        var sign = (flow[eN[i]][1] == vN[i]) ? 1 : -1;
        var d = (flow[eN[i]][1] == vN[i]) ? flow[eN[i]][0] : flow[eN[i]][1];

        v[vN[i]] = v[d] + sign*ST[eN[i]][2];
    }

    if (s != undefined && s != 0)
        for (var i = 0; i < n; i++)
            v[i] -= v[s];

    return v;
}
