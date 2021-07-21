// import queue from './queue.js';
let edges = []
let nodes = []
for (let i = 0; i < 5; i++) {
    nodes.push({ data: { id: i, text: i } });
}
edges.push({ data: { id: '0->4', weight: 1, source: '0', target: '4' } });
edges.push({ data: { id: '0->1', weight: 3, source: '0', target: '1' } });
edges.push({ data: { id: '1->4', weight: 4, source: '1', target: '4' } });
edges.push({ data: { id: '1->2', weight: 5, source: '1', target: '2' } });
edges.push({ data: { id: '2->4', weight: 6, source: '2', target: '4' } });
edges.push({ data: { id: '2->3', weight: 2, source: '2', target: '3' } });
edges.push({ data: { id: '4->3', weight: 7, source: '4', target: '3' } });
var cy = cytoscape({
    container: document.getElementById('cy'),

    elements: {
        nodes: [
            { data: { id: '0', text: '0' } },
            { data: { id: '1', text: '1' } },
            { data: { id: '2', text: '2' } },
            { data: { id: '3', text: '3' } },
            { data: { id: '4', text: '4' } }
        ],

        edges: [
            { data: { id: '0->4', weight: 1, source: '0', target: '4' } },
            { data: { id: '0->1', weight: 3, source: '0', target: '1' } },
            { data: { id: '1->4', weight: 4, source: '1', target: '4' } },
            { data: { id: '1->2', weight: 5, source: '1', target: '2' } },
            { data: { id: '2->4', weight: 6, source: '2', target: '4' } },
            { data: { id: '2->3', weight: 2, source: '2', target: '3' } },
            { data: { id: '4->3', weight: 7, source: '4', target: '3' } }
        ]
    },

    style: [{
            selector: "node",
            style: {
                width: 20,
                "background-color": "#666",
                label: "data(id)",
                "font-size": "13px",
                "text-valign": "center",
                "background-color": "#555",
                "text-outline-width": "1px",
                color: "#fff",
            }
        },

        {
            selector: "edge",
            style: {
                width: 3,
                "line-color": "red",
                // "target-arrow-color": "blue",
                // "target-arrow-shape": "triangle",
                // "curve-style": "bezier",
                label: "data(weight)",
                "font-size": "14px"
            }
        },
        {
            selector: ".highlighted",
            style: {
                "background-color": "purple",
                "line-color": "yellow",
                // "target-arrow-color": "yellow",
                // "transition-property": "background-color, line-color, target-arrow-color",
                "transition-duration": "0.5s"
            }
        },

    ],

    layout: {
        name: "cose",
        rows: 3,
        directed: true,
        padding: 10
    }
});


function Addnodes() {
    cy.elements().remove();
    let N = document.querySelector("#numVert").value;
    if (N === "") {
        N = 3;
    }

    console.log("Generating a graph of ", N, " vertices");
    nodes = [];
    edges = [];
    for (var i = 0; i < N; i++) {
        nodes.push({ group: "nodes", data: { id: i, text: i } });
    }

    cy.add(nodes);
    cy.layout({ name: "cose" }).run();
}

function Addedge() {
    let edgeFrom = document.getElementById("src_edge").value;
    let edgeTo = document.getElementById("trg_edge").value;
    let edgeWeight = document.getElementById("weight").value;
    edges.push({
        group: "edges",
        data: {
            id: `${edgeFrom}->${edgeTo}`,
            source: `${edgeFrom}`,
            target: `${edgeTo}`,
            position: { x: 100, y: 100 },
            weight: `${edgeWeight}`
        }
    });
    edges.push({
        group: "edges",
        data: {
            id: `${edgeTo}->${edgeFrom}`,
            source: `${edgeTo}`,
            target: `${edgeFrom}`,
            position: { x: 100, y: 100 },
            weight: `${edgeWeight}`
        }
    });
    cy.add(edges);
    cy.layout({ name: "cose" }).run();
    document.getElementById("src_edge").value = null;
    document.getElementById("trg_edge").value = null;
    document.getElementById("weight").value = null;
}

function remove() {
    let id = document.querySelector("#ID").value;
    cy.remove(cy.getElementById(id));
    cy.layout({ name: "cose" }).run();
    document.getElementById("ID").value = null;
}

function runAlgorithm() {
    const algo = document.getElementById("Algorithms").value;
    cy.elements().removeClass("highlighted");
    if (algo === "MST") {
        var mst = doMST_kruskal();
        var i = 0;
        var highlightNextEle = function() {
            if (i < mst.length) {
                cy.getElementById(mst[i]).addClass("highlighted");

                i++;
                setTimeout(highlightNextEle, 1000);
            }
        };
        highlightNextEle();
    }
}


const doMST_kruskal = () => {

    let edgesArr = [];
    edges.forEach(edge => {
        edgesArr.push({ source: edge.data.source, target: edge.data.target, weight: edge.data.weight })
    })

    const sequence = [];
    let count = 0;

    const cyclecheck = {
        link: [],
        size: [],
        find: (vertex) => {
            while (cyclecheck.link[vertex] !== vertex) {
                vertex = cyclecheck.link[vertex];
            }
            return vertex;
        },
        isSame: (a, b) => {
            if (cyclecheck.find(a) === cyclecheck.find(b)) {
                return true;
            }
            return false;
        },
        union: (x, y) => {
            x = cyclecheck.find(x);
            y = cyclecheck.find(y);
            if (cyclecheck.size[x] > cyclecheck.size[y]) {
                cyclecheck.link[y] = x;
                cyclecheck.size[x] += cyclecheck.size[y];
            } else {
                cyclecheck.link[x] = y;
                cyclecheck.size[y] += cyclecheck.size[x];
            }
        }
    };

    for (let i = 0; i <= nodes.length - 1; i++) {
        cyclecheck.link[i] = nodes[i].data.id;
        cyclecheck.size[i] = 1;
    }

    edgesArr.sort((a, b) => a.weight - b.weight);


    for (const key in edgesArr) {
        const edge1 = edgesArr[key];


        if (cyclecheck.isSame(edge1.source, edge1.target)) {
            continue;
        }
        cyclecheck.union(edge1.source, edge1.target);

        sequence.push(`${edge1.source}`);
        sequence.push(`${edge1.source}->${edge1.target}`);
        sequence.push(`${edge1.target}`);

        count++;
        if (count >= nodes.length - 1) {
            break;
        }

    }

    return sequence;
};