
function DSU(n) {
    this.p = new Array(n);
    this.rank = new Array(n);

    for (var i = 0; i < n; i++) {
        this.p[i] = i;
        this.rank[i] = 0;
    }

    this.find = function(x) {
        if (this.p[x] == x)
            return x;
        else
            return (this.p[x] = this.find(this.p[x]));
    };

    this.union = function(x, y) {
        var px = this.find(x),
            py = this.find(y);

        if (px == py)
            return;

        if (this.rank[px] < this.rank[py]) {
            var t = px;
            px = py;
            py = t;
        }

        this.p[py] = px;
        if (this.rank[px] == this.rank[py])
            this.rank[px]++;
    };
}
