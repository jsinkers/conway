document.addEventListener('DOMContentLoaded', () => {
    var cy = cytoscape({
        container: document.getElementById('cy'), // container to render in

        elements: [ // list of graph elements to start with
            { data: { id: '0', label: 'start', instruction: 'start' }},
            { data: { id: '01', source: '0', target: '1', type: 'goTo' }},
            { data: { id: '1', label: '-1', instruction: 'deb', register: 1, goTo: '2', branchTo: '3' }},
            { data: { id: '12', source: '1', target: '2', type: 'goTo' }},
            { data: { id: '2', label: '+2', instruction: 'inc', register: 2, goTo: '1'}},
            { data: { id: '21', source: '2', target: '1', type: 'goTo' }},
            { data: { id: '3', label: 'end', instruction: 'end'}},
            { data: { id: '13', source: '1', target: '3', type: 'branchTo'}}
        ],

        style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': 'blue', //'#666',
            'label': 'data(label)',
            'text-wrap': 'wrap',
            "text-valign": "center",
            "text-halign": "center",
              'color': 'white',
                "width": '50px',
                "height": '50px',
              //"shape": 'round',
              "padding": '50%',

              //"padding-relative-to": "max",

          }
        },

        {
          selector: 'edge',
          style: {
              'curve-style': 'bezier',
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
              "source-label": 'data(source)',
          }
        }
        ],

        layout: {
            name: 'grid',
            rows: 2,
        }
    });

})