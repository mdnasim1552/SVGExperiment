import { getStroke } from 'perfect-freehand';
import * as joint from '@joint/core';
const { TangentDirections } = joint.connectors.curve;
const borderWidth = 4;
const speciesSize = 100;
const colors = {
    fg: '#ed2637',
    bg: '#FFFFFF',
    text: '#000000',
    border: '#ed2637',
    link: '#FFFFFF',
    highlight: '#f7a1a8',
};
joint.shapes.custom = {};

joint.shapes.custom.Worm = joint.dia.Element.define('custom.Worm', {
    size: { width: 60, height: 30 },

    attrs: {
        body: {
            d: '',
            fill: '#4c4ed8',
            stroke: '#000000',
            strokeWidth: 3,
            class: 'custom-shape',
        }
    }
}, {
    markup: [
        {
            tagName: 'path',
            selector: 'body'
        }
    ]
});
joint.shapes.custom.UpBottomStroke = joint.dia.Element.define('custom.UpBottomStroke', {
    size: { width: 1, height: 1 }, // small because we position paths absolutely
    attrs: {
        root: { class: 'custom-shape' }, 
        topPath: { d: '', fill: 'none', stroke: 'blue', strokeWidth: 8 },
        bottomPath: { d: '', fill: 'none', stroke: 'orange', strokeWidth: 8 },
        fillBody: { d: '', fill: '#aa0000', stroke: 'none' } // optional fill
    }
}, {
    markup: [
        { tagName: 'path', selector: 'fillBody' },
        { tagName: 'path', selector: 'topPath' },
        { tagName: 'path', selector: 'bottomPath' }
    ]
});

// 2️⃣ Define the FormNote element
// FormNote element
// Define FormNote element
joint.shapes.custom.FormNote = joint.dia.Element.define(
    'custom.FormNote',
    {
        size: { width: 350, height: 150 },
    },
    {
        markup: [
            {
                tagName: 'rect',
                selector: 'body',
                attributes: {
                    width: 350,
                    height: 150,
                    fill: '#fffbe6',
                    stroke: '#333',
                    rx: 10,
                    ry: 10
                }
            },
            {
                tagName: 'foreignObject',
                selector: 'fo',
                attributes: {
                    width: 350,
                    height: 150,
                    x: 0,
                    y: 0,
                    overflow: 'hidden'
                },
                children: [
                    {
                        tagName: 'div',
                        namespaceURI: 'http://www.w3.org/1999/xhtml',
                        selector: 'formContainer',
                        attributes: {
                            style: `
                                width:350px;
                                height:150px;
                                margin:0;
                                padding:0;
                                box-sizing:border-box;
                                font-size:10px;
                                overflow:hidden;
                            `
                        }
                    }
                ]
            }
        ]
    }
);

joint.shapes.custom.FormNoteView = joint.dia.ElementView.extend({
    render() {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
        const container = this.el.querySelector('[joint-selector="formContainer"]');
        if (!container) return this;

        container.innerHTML = `
    <div style="
        width: 350px;
        height: 150px;
        box-sizing: border-box;
        background: #fffbe6;
        border: 2px solid #333;
        border-radius: 10px;
        padding: 35px;
        font-family: sans-serif;
        font-size: 28px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 20px;
    ">
        <div style="display:flex; flex-direction:column;">
            <label style="font-weight:bold;">Vessel:</label>
            <input type="number" style="padding:8px; font-size:28px;"/>
        </div>
    </div>
`;
        return this;
    }
});
const SvgElement = joint.dia.Element.define('custom.SvgElement', {
    size: { width: 120, height: 80 },
    attrs: {
        body: {
            refWidth: '100%',
            refHeight: '100%',
            fill: 'transparent'
        },
        svgImage: {
            refWidth: '100%',
            refHeight: '100%',
            xlinkHref: 'assets/HeadDia.svg'
        }
    }
}, {
    markup: [
        {
            tagName: 'image',
            selector: 'svgImage'
        }
    ]
});
class Species extends joint.dia.Element {
    defaults() {
        return {
            ...super.defaults,
            type: 'Species',
            z: 2,
            size: {
                width: speciesSize,
                height: speciesSize,
            },
            attrs: {
                root: {
                    magnetSelector: 'border',
                },
                border: {
                    fill: colors.bg,
                    stroke: colors.bg,
                    strokeWidth: 2,
                    rx: 'calc(w/2)',
                    ry: 'calc(h/2)',
                    cx: 'calc(w/2)',
                    cy: 'calc(h/2)',
                },
                innerBorder: {
                    fill: colors.bg,
                    stroke: colors.fg,
                    strokeWidth: 4,
                    rx: `calc(w/2 - ${borderWidth})`,
                    ry: `calc(h/2 - ${borderWidth})`,
                    cx: 'calc(w/2)',
                    cy: 'calc(h/2)',
                },
                icon: {
                    width: 'calc(3 * w / 4)',
                    height: 'calc(3 * h / 4)',
                    x: 'calc(w / 8)',
                    y: 'calc(h / 8)',
                },
                labelPath: {
                    d: 'M -10 calc(h/2) A 20 20 0 0 0 calc(w + 10) calc(h / 2)',
                    stroke: 'none',
                    fill: 'none',
                },
                label: {
                    textPath: { selector: 'labelPath' },
                    text: '',
                    fontWeight: 'bold',
                    fontSize: 16,
                    fontFamily: 'sans-serif',
                    fill: colors.text,
                    stroke: colors.bg,
                    strokeWidth: 5,
                    paintOrder: 'stroke',
                    textVerticalAnchor: 'top',
                    textAnchor: 'middle',
                    letterSpacing: 5,
                    // Quarter of the circumference of the circle
                    // 2 * π * (r + border) / 4
                    // Moves the anchor of the text to the center of the `labelPath`.
                    x: (2 * Math.PI * (speciesSize / 2 + 10)) / 4,
                },
            },
        };
    }
    preinitialize() {
        this.markup = [
            {
                tagName: 'ellipse',
                selector: 'border',
            },
            {
                tagName: 'ellipse',
                selector: 'innerBorder',
            },
            {
                tagName: 'image',
                selector: 'icon',
            },
            {
                tagName: 'path',
                selector: 'labelPath',
            },
            {
                tagName: 'text',
                selector: 'label',
            },
        ];
    }
}
class Branch extends joint.dia.Link {
    defaults() {
        return {
            ...super.defaults,
            type: 'Branch',
            z: 1,
            attrs: {
                line: {
                    // Native SVG Attributes
                    fill: '#aa0000',//colors.link,
                    stroke: '#aa0000',
                    strokeWidth: 3,
                    strokeLinecap: 'round',
                    // Custom attributes
                    organicStroke: true,
                    organicStrokeSize: 20,
                    organicStrokeThinning:0,
                    organicStrokeTaper:false,
                    organicStrokeStartCap:true,
                },
            },
        };
    }
    preinitialize() {
        this.markup = [
            {
                tagName: 'path',
                selector: 'line',
            },
        ];
        this.defaultLabel = {
            attrs: {
                labelText: {
                    fontSize: 34,
                    fontFamily: 'sans-serif',
                    letterSpacing: 5,
                    fill: colors.text,
                    textAnchor: 'middle',
                    textVerticalAnchor: 'middle',
                },
                labelBackground: {
                    fill: colors.bg,
                    stroke: colors.border,
                    strokeWidth: 3,
                    rx: 4,
                    ry: 4,
                    ref: 'labelText',
                    x: 'calc(x - 10)',
                    y: 'calc(y - 10)',
                    width: 'calc(w + 20)',
                    height: 'calc(h + 20)',
                },
                line: {
                    d: 'M 0 0 Q 0 50 -60 60',
                    fill: 'none',
                    stroke: colors.border,
                    strokeWidth: 2,
                    targetMarker: {
                        type: 'circle',
                        r: 4,
                    },
                },
            },
            position: {
                distance: 0.5,
                offset: {
                    x: 70,
                    y: -50,
                },
            },
            markup: [
                {
                    tagName: 'path',
                    selector: 'line',
                },
                {
                    tagName: 'rect',
                    selector: 'labelBackground',
                },
                {
                    tagName: 'text',
                    selector: 'labelText',
                },
            ],
        };
    }
    static attributes = {
        // The `organicStroke` attribute is used to set the `d` attribute of the `<path>` element.
        // It works similarly to the `connection` attribute of JointJS.
        'organic-stroke': {
            set: function (
                _value,
                _refBBox,
                _node,
                attrs
            ) {
                if (!this.model.isLink()) {
                    throw new Error('The `organicStroke` attribute can only be used with links.');
                }
                // The path of the link as returned by the `connector`.
                const path = this.getConnection();
                const segmentSubdivisions = this.getConnectionSubdivisions();
                // Convert polylines to points and add the pressure value to each point.
                const polylines = path.toPolylines({ segmentSubdivisions });
                let points = [];
                polylines.forEach((polyline) => {
                    const maxIndex = polyline.points.length - 1;
                    polyline.points.forEach((point, index) => {
                        points.push([
                            point.x,
                            point.y,
                            organicStyle(index, maxIndex),
                        ]);
                    });
                });
                // Using the `getStroke` function from the `perfect-freehand` library,
                // we get the points that represent the outline of the stroke.
                const outlinePoints = getStroke(points, {
                    size: attrs['organic-stroke-size'] || 20,
                    thinning: attrs['organic-stroke-thinning'] ?? 0, // <-- read from attrs
                    simulatePressure: false,
                    last: true,
                    end:{
                        taper: attrs['organic-stroke-taper'] ?? false,
                        cap:false
                    },
                    start:{
                        cap: attrs['organic-stroke-start-cap'] ?? true,
                    }
                });
                // How to interpolate the points to get the outline?
                const d = quadraticInterpolation(outlinePoints);
                // The `d` attribute is set on the `node` element.
                return { d };
            },
            unset: 'd'
        },
        // Empty attributes definition to prevent the attribute from being set on the element.
        // They are only meant to be used in the `organicStroke` function.
        'organic-stroke-size': {},
        'organic-stroke-thinning': {}, // <-- new attribute
        'organic-stroke-taper': {},
        'organic-stroke-start-cap': {}, // <-- new attribute
    };
}
// Stroke Style
// ------------
const time = (index, maxIndex) => index / maxIndex;
// It gradually decrease the pressure from 1 to 0. This means that the stroke
// will be thinner at the end.
const organicStyle = (index, maxIndex) => {
    return 1 - time(index, maxIndex);
};
// Points Interpolation
// --------------------
const average = (a, b) => (a + b) / 2;
// Alternatively, a linear or a cubic interpolation can be used.
function quadraticInterpolation(points) {
    const len = points.length;
    if (len < 4) {
        return '';
    }
    let [a, b, c] = points;
    let result = `
    M${a[0].toFixed(2)},${a[1].toFixed(2)}
    Q${b[0].toFixed(2)},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(
        2
    )},${average(b[1], c[1]).toFixed(2)}
    T
`;
    for (let i = 2, max = len - 1; i < max; i++) {
        a = points[i];
        b = points[i + 1];
        result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(2)} `;
    }
    result += 'Z';
    return result;
}
// Rotate Tool
// -----------
const RotateTool = joint.elementTools.Control.extend({
    children: [
        {
            tagName: 'g',
            selector: 'handle',
            children: [
                {
                    tagName: 'circle',
                    attributes: {
                        r: 15,
                        fill: colors.bg,
                    },
                },
                {
                    tagName: 'image',
                    attributes: {
                        cursor: 'pointer',
                        x: -10,
                        y: -10,
                        width: 20,
                        height: 20,
                        'xlink:href': 'assets/rotate.svg',
                    },
                },
            ],
        },
    ],
    getPosition: function (view) {
        const { model } = view;
        const { width } = model.size();
        return new joint.g.Point(width, 0);
    },
    setPosition: function (view, coordinates) {
        const { model } = view;
        const { width, height } = model.size();
        const center = new joint.g.Point(width / 2, height / 2);
        const angle = center.angleBetween(coordinates, this.getPosition(view));
        model.rotate(Math.round(angle));
    },
});
// Application
// -----------
const shapeNamespace = {
    ...joint.shapes,
    Species,
    Branch,
    ...joint.shapes.custom,
};
const graph = new joint.dia.Graph({}, { cellNamespace: shapeNamespace });
const undoStack = [];
const redoStack = [];
let isRestoring = false;
let batchOperations = [];

// Push meaningful operations during a batch
function pushOperation(op) {
    batchOperations.push(op);
}

// Commit operations after batch:stop
graph.on('batch:stop', () => {
    if (isRestoring || batchOperations.length === 0) return;
    undoStack.push([...batchOperations]);
    redoStack.length = 0;
    batchOperations = [];
});

// --- UNDO ---
function undo() {
    if (!undoStack.length) return;
    isRestoring = true;

    const ops = undoStack.pop();
    const reversedOps = [...ops].reverse();

    reversedOps.forEach(op => {
        // if (op.type === 'snapshot') {
        //     //graph.clear();               // remove all current cells
        //     //graph.fromJSON(op.before);   // restore previous snapshot
        //     restoreFromSnapshot(graph, op.before,shapeNamespace); // restore manually
        //     refreshPaper();
        //     return; // skip other operations
        // }
        switch (op.type) {
            case 'snapshot':
                restoreFromSnapshot(graph, op.before,shapeNamespace); // restore manually
                refreshPaper();
                break;
            case 'addElement': op.element.remove(); break;
            case 'removeElement': graph.addCell(op.element); break;
            case 'moveElement': 
                op.element.position(op.from.x, op.from.y);
                break;
            case 'moveAttachment':
                const attUndo = op.element.get('linkAttachment');
                op.element.set('linkAttachment', {
                    ...attUndo,
                    ratio: op.from
                });
                RefreshElementAfterUndoAndRedo(op.element);
                break;
            case 'addLink':
                op.link.remove(); 
                // if(undoStack.length>1){
                //     op.link.remove(); 
                // }
                break;
            case 'removeLink': graph.addCell(op.link); break;
            case 'moveVertices': op.link.set('vertices', op.from); break;
            case 'changeLabelText':
                op.cell.label(op.labelIndex, {
                    ...op.cell.get('labels')[op.labelIndex],
                    attrs: { labelText: { text: op.from } },
                });
                break;
            case 'moveLabel':
                op.cell.label(op.labelIndex, {
                    ...op.cell.get('labels')[op.labelIndex],
                    position: op.from,
                });
                break;
            case 'changeSource':
                op.link.set('source', op.from);
                break;
            case 'changeTarget':
                op.link.set('target', op.from);
                break;

        }
    });

    redoStack.push(ops);
    isRestoring = false;
}
function restoreFromSnapshot(graph, snapshot, shapeNamespace) {
    if (!snapshot || !snapshot.cells) return;
    
    // 1️⃣ Clear current graph
    graph.clear();

    const cellsMap = new Map(); // ID -> cell

    // 2️⃣ Recreate all elements and links
    snapshot.cells.forEach(data => {
        let cell;

        if (data.type && data.type.includes('link')) {
            // Link
            cell = new joint.dia.Link(data);
        } else {
            // Element: use correct class from shapeNamespace
            const ElementClass = shapeNamespace[data.type];
            if (!ElementClass) {
                switch (data.type) {
                    case 'standard.Rectangle':
                        cell = new joint.shapes.standard.Rectangle(data);
                        break;
                    case 'standard.Circle':
                        cell = new joint.shapes.standard.Circle(data);
                        break;
                    case 'standard.Ellipse':
                        cell = new joint.shapes.standard.Ellipse(data);
                        break;
                    default:
                        console.warn(`Shape class "${data.type}" not found. Using joint.dia.Element as fallback.`);
                        cell = new (ElementClass || joint.dia.Element)(data);
                }
            }else{
                cell = new ElementClass(data);
            }
            
        }

        graph.addCell(cell);
        cellsMap.set(data.id, cell);
    });

    // 3️⃣ Restore vertices and labels
    graph.getLinks().forEach(link => {
        const data = snapshot.cells.find(c => c.id === link.id);
        if (!data) return;

        link.set('vertices', (data.vertices || []).map(v => ({ ...v })));
        link.set('labels', (data.labels || []).map(l => ({ ...l })));
    });

    // 4️⃣ Restore source and target
    graph.getLinks().forEach(link => {
        const data = snapshot.cells.find(c => c.id === link.id);
        if (!data) return;

        link.set({
            source: { ...data.source },
            target: { ...data.target }
        });
    });

    // 5️⃣ Restore z-index
    graph.getCells().forEach(cell => {
        const data = snapshot.cells.find(c => c.id === cell.id);
        if (data && data.z != null) {
            cell.set('z', data.z);
        }
    });

    // 6️⃣ Reattach child links to parent links
    graph.getLinks().forEach(link => {
        const data = snapshot.cells.find(c => c.id === link.id);
        if (!data) return;

        const children = snapshot.cells.filter(c => c.source && c.source.id === link.id);
        children.forEach(childData => {
            const child = cellsMap.get(childData.id);
            if (child) {
                child.set('source', { id: link.id, anchor: childData.source.anchor });
            }
        });
    });
}




// --- REDO ---
function redo() {
    if (!redoStack.length) return;
    isRestoring = true;

    const ops = redoStack.pop();
    ops.forEach(op => {
        // if (op.type === 'snapshot') {
        //     //graph.clear();
        //     //graph.fromJSON(op.after);  // restore snapshot after the operation
        //     restoreFromSnapshot(graph, op.after,shapeNamespace); 
        //     refreshPaper();
        //     return;
        // }
        switch (op.type) {
            case 'snapshot':
                restoreFromSnapshot(graph, op.after,shapeNamespace); 
                refreshPaper();
                break;
            case 'addElement': graph.addCell(op.element); break;
            case 'removeElement': op.element.remove(); break;
            case 'moveElement': 
                op.element.position(op.to.x, op.to.y);
                break;
            case 'moveAttachment':
                const attRedo = op.element.get('linkAttachment');
                op.element.set('linkAttachment', {
                    ...attRedo,
                    ratio: op.to
                });
                RefreshElementAfterUndoAndRedo(op.element);
                break;

            case 'addLink': graph.addCell(op.link); break;
            case 'removeLink': op.link.remove(); break;
            case 'moveVertices': op.link.set('vertices', op.to); break;
            case 'changeLabelText':
                op.cell.label(op.labelIndex, {
                    ...op.cell.get('labels')[op.labelIndex],
                    attrs: { labelText: { text: op.to } },
                });
                break;
            case 'moveLabel':
                op.cell.label(op.labelIndex, {
                    ...op.cell.get('labels')[op.labelIndex],
                    position: op.to,
                });
                break;
            case 'changeSource':
                op.link.set('source', op.to);
                break;
            case 'changeTarget':
                op.link.set('target', op.to);
                break;

        }
    });

    undoStack.push(ops);
    isRestoring = false;
}
function RefreshElementAfterUndoAndRedo(element){
    if (element.get('type') === 'custom.Worm') {
        updateWormShape(element);
    } 
    else if(element.get('type') === 'custom.UpBottomStroke') {
        updateUpBottomStrokeShape(element);
    }
    else {
        updateRectanglePosition(element);
    }
}
// --- Keyboard shortcuts ---
document.addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    // Undo
    if ((e.ctrlKey || e.metaKey) && key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
    }
    // Redo
    if ((e.ctrlKey || e.metaKey) && ((key === 'y') || (e.shiftKey && key === 'z'))) {
        e.preventDefault();
        redo();
    }
});


// --- Track meaningful operations ---
graph.on('add', cell => {
    if (isRestoring) return;
    if (cell.isElement()) pushOperation({ type: 'addElement', element: cell });
    if (cell.isLink()) pushOperation({ type: 'addLink', link: cell });
});

graph.on('remove', cell => {
    if (isRestoring) return;
    if (cell.isElement()) pushOperation({ type: 'removeElement', element: cell });
    if (cell.isLink()) pushOperation({ type: 'removeLink', link: cell });
});

graph.on('change:position', cell => {
    if (isRestoring || !cell.isElement()) return;
    if (cell.get('linkAttachment')) return;
    const prev = cell.previous('position');
    const curr = cell.position();
    if (!prev || (prev.x === curr.x && prev.y === curr.y)) return;

    pushOperation({
        type: 'moveElement',
        element: cell,
        from: prev,
        to: { ...curr },
    });
});

graph.on('change:vertices', link => {
    if (isRestoring) return;
    const prev = link.previous('vertices') || [];
    const curr = link.get('vertices') || [];
    if (JSON.stringify(prev) !== JSON.stringify(curr)) {
        pushOperation({
            type: 'moveVertices',
            link,
            from: prev.map(v => ({ ...v })),
            to: curr.map(v => ({ ...v })),
        });
    }
    RefreshElementsOfGraph(link);
});
graph.on('change:labels', link => {
    if (isRestoring || !link.isLink()) return;

    const prevLabels = link.previous('labels') || [];
    const currLabels = link.get('labels') || [];

    currLabels.forEach((lbl, i) => {
        const prev = prevLabels[i] || {};
        const curr = lbl || {};

        // Text change
        const prevText = prev.attrs?.labelText?.text || '';
        const currText = curr.attrs?.labelText?.text || '';
        if (prevText !== currText) {
            pushOperation({
                type: 'changeLabelText',
                cell: link,
                labelIndex: i,
                from: prevText,
                to: currText,
            });
        }

        // Label position change
        const prevPos = prev.position || {};
        const currPos = curr.position || {};
        if (prevPos.distance !== currPos.distance || prevPos.angle !== currPos.angle) {
            pushOperation({
                type: 'moveLabel',
                cell: link,
                labelIndex: i,
                from: { ...prevPos },
                to: { ...currPos },
            });
        }
    });
});
graph.on('change:source change:target', function (link) {

    if (isRestoring || !link.isLink()) return;

    const prevSource = link.previous('source');
    const currSource = link.get('source');

    const prevTarget = link.previous('target');
    const currTarget = link.get('target');

    // Track source anchor move
    if (prevSource && JSON.stringify(prevSource) !== JSON.stringify(currSource)) {
        pushOperation({
            type: 'changeSource',
            link: link,
            from: { ...prevSource },
            to: { ...currSource }
        });
    }

    // Track target anchor move
    if (prevTarget && JSON.stringify(prevTarget) !== JSON.stringify(currTarget)) {
        pushOperation({
            type: 'changeTarget',
            link: link,
            from: { ...prevTarget },
            to: { ...currTarget }
        });
    }
    RefreshElementsOfGraph(link);
});
function RefreshElementsOfGraph(link){
    graph.getElements().forEach(el => {
        const attachment = el.get('linkAttachment');
        if (attachment && attachment.linkId === link.id) {
            if (el.get('type') === 'custom.Worm') {
                updateWormShape(el);
            } 
            else if (el.get('type') === 'custom.UpBottomStroke') {
                updateUpBottomStrokeShape(el);
            }
            else {
                updateRectanglePosition(el);
            }
        }
    });
}

const paper = new joint.dia.Paper({
    el: document.getElementById('paper'),
    width: '100%',
    height: '100%',
    model: graph,
    frozen: true,
    async: true,
    overflow: true,
    cellViewNamespace: shapeNamespace,
    clickThreshold: 0,
    interactive: {
        labelMove: true,
        linkMove: false,
        stopDelegation: false,
        linkDelete: false,
    },
    snapLabels: true,
    labelsLayer: true,
    background: {
        color: colors.bg,
    },
    defaultConnector: {
        name: 'curve',
        args: {
            sourceDirection: TangentDirections.OUTWARDS,
            targetDirection: TangentDirections.OUTWARDS,
        },
    },
    defaultConnectionPoint: {
        name: 'boundary',
        args: {
            selector: false,
        },
    },
});
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});
paper.on('element:contextmenu', function (elementView, evt) {
    evt.preventDefault();
    evt.stopPropagation();
    menuOpen = true;
    showElementMenu({
        x: evt.clientX,
        y: evt.clientY,
        elementView
    });
    // const model = elementView.model;

    // if (model.get('type') === 'custom.Worm') {
    //     if (confirm('Delete this worm?')) {
    //         model.remove();
    //     }
    // }
});
const elementMenu = document.getElementById('element-menu');
function showElementMenu({ x, y, elementView}) {
    const model = elementView.model;
    elementMenu.style.display = 'none';
    const left = x; //- paperRect.left;
    const top = y; //- paperRect.top;
    elementMenu.style.left = left + 'px';
    elementMenu.style.top = top + 'px';
    elementMenu.style.display = 'block';
    elementMenu.onclick = e => {
        const action = e.target.dataset.action;
        if (!action) return;
        if (action === 'delete') {
            if (confirm('Do you want to delete this?')) {
                // 🔥 Delete attached notes if any
                const notes = model.get('attachedNotes') || [];
                notes.forEach(n => {
                    const noteCell = graph.getCell(n.noteId);
                    if (noteCell) noteCell.remove();

                    const linkCell = graph.getCell(n.linkId);
                    if (linkCell) linkCell.remove();
                });
                model.remove();
            }
        }else if (action === 'add-note') {
            addNoteToElement(model,x,y);
        }
        elementMenu.style.display = 'none';
        menuOpen = false;
    };
}
function getVisibleArea() {

    const rect = paper.el.getBoundingClientRect();

    // Convert browser pixels to graph coordinates
    const topLeft = paper.clientToLocalPoint({
        x: rect.left,
        y: rect.top
    });

    const bottomRight = paper.clientToLocalPoint({
        x: rect.right,
        y: rect.bottom
    });

    return {
        x: topLeft.x,
        y: topLeft.y,
        width: bottomRight.x - topLeft.x,
        height: bottomRight.y - topLeft.y
    };
}
function isOverlapping(rect1, rect2) {
    return !(
        rect1.x + rect1.width <= rect2.x ||
        rect1.x >= rect2.x + rect2.width ||
        rect1.y + rect1.height <= rect2.y ||
        rect1.y >= rect2.y + rect2.height
    );
}
function getExistingNoteRects() {
    return graph.getElements()
        .filter(el => el.get('type') === 'custom.FormNote')
        .map(el => {
            const b = el.getBBox();
            return {
                x: b.x,
                y: b.y,
                width: b.width,
                height: b.height
            };
        });
}
function addNoteToElement(element,x,y) {
    const bbox = element.getBBox();
    const visibleArea = getVisibleArea();

    const noteWidth = 350;
    const noteHeight = 150;
    const margin = 20;

    // Available spaces
    const spaces = {
        top: y - visibleArea.y,
        right: (visibleArea.x + visibleArea.width) - (x + bbox.width),
        bottom: (visibleArea.y + visibleArea.height) - (y + bbox.height),
        left: x - visibleArea.x
    };

    // Pick direction with MAX space
    const direction = Object.keys(spaces).reduce((a, b) =>
        spaces[a] > spaces[b] ? a : b
    );

    let noteX, noteY;

    switch (direction) {

        case 'top':
            noteX = x + bbox.width / 2 - noteWidth / 2;
            noteY = y - noteHeight - margin;
            break;

        case 'right':
            noteX = x + bbox.width + margin;
            noteY = y + bbox.height / 2 - noteHeight / 2;
            break;

        case 'bottom':
            noteX = x + bbox.width / 2 - noteWidth / 2;
            noteY = y + bbox.height + margin;
            break;

        case 'left':
            noteX = x - noteWidth - margin;
            noteY = y + bbox.height / 2 - noteHeight / 2;
            break;
    }

    // ---- Clamp inside visible area ----
    noteX = Math.max(visibleArea.x,
        Math.min(noteX, visibleArea.x + visibleArea.width - noteWidth));

    noteY = Math.max(visibleArea.y,
        Math.min(noteY, visibleArea.y + visibleArea.height - noteHeight));
    if(spaces.right>spaces.left){
        noteX = noteX-600;
    }else if(spaces.right<spaces.left){
        noteX = noteX+600;
    }
    let newRect = {
        x: noteX,
        y: noteY,
        width: noteWidth,
        height: noteHeight
    };
    const existingRects = getExistingNoteRects();
    while (
        existingRects.some(r => isOverlapping(newRect, r))
    ) {
        newRect.y += 1; // shift downward
    }
    noteY = newRect.y;
    const note = new joint.shapes.custom.FormNote({
       position: {
            x: noteX, //x + element.size().width + 20,//40
            y: noteY+120 //1050
        },
        size: { width: noteWidth, height: noteHeight } // ensures correct size
    });

    graph.addCell(note);

    const link = new joint.shapes.standard.Link({
        source: { id: element.id },
        target: { id: note.id },
        connector: { name: 'smooth' },
        attrs: { line: { stroke: '#666', strokeWidth: 1, strokeDasharray: '4 2' } },
        customNoContext: true
    });

    graph.addCell(link);
     // 🌟 Save reference on element so we can delete later
    const notes = element.get('attachedNotes') || [];
    notes.push({ noteId: note.id, linkId: link.id });
    element.set('attachedNotes', notes);
}
paper.el.addEventListener('contextmenu', (evt) => {
    // Stop browser menu immediately
    evt.preventDefault();
    evt.stopPropagation();
    // Find the JointJS view under this event
    const view = paper.findView(evt.target);
    if (!view) return;
    // Only proceed if it’s a link
    if (!view.model.isLink() || view.model.get('customNoContext')) return;
    menuOpen = true;
    const toolsView = new joint.dia.ToolsView({
        tools: [new joint.linkTools.Vertices()]
    });
    view.addTools(toolsView);
    // Get the vertex index under the mouse
    //const vertexIndex = view.getVertexIndex(evt.target);
    const point = paper.clientToLocalPoint({
        x: evt.clientX,
        y: evt.clientY
    });
    const vertexIndex = getVertexIndexFromMouse(view, paper, evt);
    //if (vertexIndex === -1) return; // Not a vertex
    if (vertexIndex === -1) {
        // 👉 Right-click on link body
        // showLinkColorMenu({
        //     x: evt.clientX,
        //     y: evt.clientY,
        //     linkView: view
        // });
        const segmentIndex = getNearestSegmentIndex(view, paper, evt);
        if (segmentIndex !== -1) {
            showLinkColorMenu({
                x: evt.clientX,
                y: evt.clientY,
                linkView: view,
                segmentIndex
            });
        }
    } else {
        const segmentIndex = getNearestSegmentIndex(view, paper, evt);
        if (segmentIndex !== -1) {
            showLinkColorMenu({
                x: evt.clientX,
                y: evt.clientY,
                linkView: view,
                segmentIndex
            });
        }
        // Show your custom menu
        // showVertexMenu({
        //     x: evt.clientX,
        //     y: evt.clientY,
        //     linkView: view,
        //     vertexIndex
        // });
    }
});
function distancePointToSegment(p, a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    if (dx === 0 && dy === 0) return Math.hypot(p.x - a.x, p.y - a.y);
    const t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy);
    const clampedT = Math.max(0, Math.min(1, t));
    const closestX = a.x + clampedT * dx;
    const closestY = a.y + clampedT * dy;
    return Math.hypot(p.x - closestX, p.y - closestY);
}
function getNearestSegmentIndex(linkView, paper, evt, tolerance = 150) {
    const vertices = linkView.model.vertices() || [];
    const points = [linkView.sourcePoint, ...vertices, linkView.targetPoint];
    const mouse = paper.clientToLocalPoint({ x: evt.clientX, y: evt.clientY });
    let minDist = Infinity;
    let segmentIndex = -1;
    for (let i = 0; i < points.length - 1; i++) {
        const dist = distancePointToSegment(mouse, points[i], points[i + 1]);
        if (dist < tolerance && dist < minDist) {
            minDist = dist;
            segmentIndex = i;
        }
    }
    return segmentIndex;
}
// === Segment coloring ===
// function colorSegment(linkView, segmentIndex, color) {
//     const originalLink = linkView.model;
//     const vertices = originalLink.vertices() || [];
//     const points = [
//         linkView.sourcePoint,
//         ...vertices,
//         linkView.targetPoint
//     ];
//     const start = points[segmentIndex];
//     const end = points[segmentIndex + 1];
//     const strokeWidth =
//         originalLink.attr('line/organicStrokeSize') ||
//         originalLink.attr('line/stroke-width') ||
//         3;
//     const overlay = new Branch({
//         source: { x: start.x, y: start.y },
//         target: { x: end.x, y: end.y },
//         // // 🔴 VERY IMPORTANT
//         // router: null,
//         // connector: { name: 'curve' },
//         // connectionPoint: null,
//         attrs: {
//             line: {
//                 fill:color,
//                 organicStrokeSize:originalLink.attr('line/organicStrokeSize')
//                 // stroke: color,
//                 // 'stroke-width': strokeWidth,
//                 // 'stroke-linecap': 'butt',   // no rounding
//                 // 'stroke-linejoin': 'miter',
//                 //'pointer-events': 'none'   // no interaction padding
//             }
//         }
//     });
//     // overlay.set({
//     //     z: originalLink.get('z') + 1,
//     //     interactive: false   // no tools, no hover
//     // });
//     originalLink.graph.addCell(overlay);
// }
function splitLinkWithChildren(linkView, coloredSegmentIndex, color) {
    const graph = linkView.model.graph;
    const original = linkView.model;
    const vertices = original.vertices() || [];
    const points = [
        linkView.sourcePoint,
        ...vertices,
        linkView.targetPoint
    ];
    const source = original.get('source');
    const target = original.get('target');
    const router = original.get('router');
    const connector = original.get('connector');
    const baseLineAttrs = original.attr('line') || {};
    const z = original.get('z') || 1;
    const segments = [];
    const segmentCount = points.length - 1;
    // 1️⃣ create segments
    for (let i = 0; i < segmentCount; i++) {
        const link = new Branch({
            source: i === 0
                ? source
                : { x: points[i].x, y: points[i].y },
            target: i === segmentCount - 1
                ? target
                : { x: points[i + 1].x, y: points[i + 1].y },
            router,
            connector,
            attrs: {
                line: {
                    ...baseLineAttrs,
                    ...(i === coloredSegmentIndex ? { fill: color } : {}),
                    ...(i === segmentCount - 1 && baseLineAttrs.organicStrokeThinning > 0
                        ? { organicStrokeThinning: baseLineAttrs.organicStrokeThinning }
                        : {organicStrokeThinning:0,organicStrokeSize:30})
                }
            }
        });
        link.set({ z });
        segments.push(link);
    }
    // 2️⃣ find children of original link
    const children = graph.getConnectedLinks(original, { outbound: true });
    // 3️⃣ reattach children
    children.forEach(child => {
        const src = child.get('source');
        if (!src.anchor || src.id !== original.id) return;
        const r = src.anchor.args.ratio;
        const segIndex = Math.min(
            segmentCount - 1,
            Math.floor(r * segmentCount)
        );
        const localRatio =
            (r * segmentCount) - segIndex;
        child.set('source', {
            id: segments[segIndex].id,
            anchor: {
                name: 'connectionRatio',
                args: { ratio: localRatio }
            }
        });
    });
    const labels = original.get('labels') || [];
    labels.forEach(label => {
        const d = label.position.distance;
        const segIndex = Math.min(segmentCount - 1, Math.floor(d * segmentCount));
        const localDistance = (d * segmentCount) - segIndex;
        segments[segIndex].appendLabel({
            attrs: label.attrs,
            position: { distance: localDistance, angle: label.position.angle }
        });
    });
    // 4️⃣ replace original
    original.remove();
    graph.addCells(segments);
    return segments;
}
function getVertexIndexFromMouse(linkView, paper, evt, tolerance = 10) {
    const link = linkView.model;
    const vertices = link.vertices() || [];
    if (!vertices.length) return -1;
    const mousePoint = paper.clientToLocalPoint({
        x: evt.clientX,
        y: evt.clientY
    });
    let minDist = Infinity;
    let closestIndex = -1;
    vertices.forEach((v, index) => {
        const dx = v.x - mousePoint.x;
        const dy = v.y - mousePoint.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < tolerance && dist < minDist) {
            minDist = dist;
            closestIndex = index;
        }
    });
    return closestIndex;
}
const menuEl = document.getElementById('vertex-menu');
function showVertexMenu({ x, y, linkView, vertexIndex }) {
    colorMenu.style.display = 'none';
    const paperRect = paper.el.getBoundingClientRect();
    // Convert viewport coordinates to paper-local coordinates
    const left = x; //- paperRect.left;
    const top = y; //- paperRect.top;
    menuEl.style.left = left + 'px';
    menuEl.style.top = top + 'px';
    menuEl.style.display = 'block';
    menuEl.onclick = e => {
        const action = e.target.dataset.action;
        if (!action) return;
        if (action === 'delete') {
            deleteVertex(linkView, vertexIndex);
        }
        menuEl.style.display = 'none';
        menuOpen = false;
    };
}
const colorMenu = document.getElementById('link-color-menu');
let activeLinkId = null;
let activeSegmentIndex = null;
function showLinkColorMenu({ x, y, linkView, segmentIndex }) {
    menuEl.style.display = 'none';
    const paperRect = paper.el.getBoundingClientRect();
    // Convert viewport coordinates to paper-local coordinates
    const left = x;// - paperRect.left;
    const top = y;// - paperRect.top;
    colorMenu.style.left = left + 'px';
    colorMenu.style.top = top + 'px';
    colorMenu.style.display = 'block';
    activeLinkId = linkView.model.id;
    activeSegmentIndex = segmentIndex;
    colorMenu.onclick = e => {
        if (!activeLinkId) return;
        const link = graph.getCell(activeLinkId);
        const color = e.target.dataset.color;
        const action = e.target.dataset.action;
        if (!link) return;
        const linkView = paper.findViewByModel(link);
        if (!linkView) return;
        if (color && !action){
            executeWithSnapshot(graph, () => {
                splitLinkWithChildren(linkView, activeSegmentIndex, color);
            });
            colorMenu.style.display = 'none';
        }else{
            if (!action) return;
            if (action === 'hide-label') {
                hideAllLinkLabels()
                
            }else if(action === 'show-label') {
                showAllLinkLabels();
            }else if(action==='add-rectangle'){
                insertRectangleOnLink(link,x,y);
            }else if(action==='divide-segment'){                
                executeWithSnapshot(graph, () => {
                    splitLinkAtPointWithRectangle(linkView, x,y);
                });
            }else if(action==='add-worm'){                
                insertWormOnLink(link,x,y,e.target.dataset.color);
            }else if(action==='add-up-bottom-stroke'){
                insertUpBottomStroke(link,x,y);
            }
            
            colorMenu.style.display = 'none';
        }
        
        menuOpen = false;
    };
}
function snapshotGraph(graph) {
    return graph.toJSON({ deep: true }); // full state of graph
}
function executeWithSnapshot(graph, fn) {
    const before = snapshotGraph(graph); // capture before state
    isRestoring = true; // ignore add/remove events
    graph.startBatch();
    fn(); // your operation, e.g., splitLinkWithChildren
    graph.stopBatch();
    isRestoring = false;
    const after = snapshotGraph(graph); // capture after state
    undoStack.push([{ type: 'snapshot', before, after }]);

    // pushOperation([{
    //     type: 'snapshot',
    //     before,
    //     after
    // }]);
    redoStack.length = 0;
}
function insertWormOnLink(link, x,y,color) {
    graph.startBatch();
    const linkView = paper.findViewByModel(link);
    if (!linkView) return;

    const localPoint = paper.clientToLocalPoint({
        x: x,
        y: y
    });

    const connection = linkView.getConnection();

    const totalLength = connection.length();
    const closestLength = connection.closestPointLength(localPoint);
    // let ratio = closestLength / totalLength;
    // ratio = Math.max(0, Math.min(1, ratio));
    // ratio = Math.round(ratio * 1000) / 1000; // optional: 0.001 precision
    let ratio = Math.max(0, Math.min(1, closestLength / totalLength));
    const worm = new joint.shapes.custom.Worm();
    worm.attr('body/fill', color);
    worm.set('linkAttachment', {
        linkId: link.id,
        ratio
    });

    graph.addCell(worm);

    updateWormShape(worm);
    graph.stopBatch();
    linkView.removeTools();
}
function updateWormShape(worm) {

    const attachment = worm.get('linkAttachment');
    if (!attachment) return;

    const link = graph.getCell(attachment.linkId);
    if (!link) return;

    const linkView = paper.findViewByModel(link);
    if (!linkView) return;

    const connection = linkView.getConnection();
    if (!connection) return;

    // 🚀 CRITICAL FIX
    worm.position(0, 0);
    worm.rotate(0);

    const ratio = attachment.ratio;
    const segments = 6;
    const baseHeight = 30;


    const pixelLength =  60;
    const totalLength = connection.length();
    const wormLength = pixelLength / totalLength; // convert px to ratio
    const step = wormLength / segments;
    const safeRatio = Math.max(
        wormLength,
        Math.min(1 - wormLength, ratio)
    );
    
    const thinning = link.attr('line/organicStrokeThinning') || 0;
    let organicSize = (link.attr('line/organicStrokeSize') || baseHeight);
    if(thinning!=0){
        organicSize=organicSize+(organicSize+link.attr('line/strokeWidth'))/2;
    }
    const top = [];
    const bottom = [];

    for (let i = -segments; i <= segments; i++) {
        let r = safeRatio + i * step;
       // let r = ratio + i *step;// 0.01;
        //r = Math.max(0, Math.min(1, r));
        const p = connection.pointAt(r);
        if (!p) continue;

        const delta = step / 2;//0.002;
        const before = connection.pointAt(Math.max(0, r - delta));
        const after  = connection.pointAt(Math.min(1, r + delta));
        if (!before || !after) continue;

        const dx = after.x - before.x;
        const dy = after.y - before.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (!len) continue;

        const perpX = -dy / len;
        const perpY = dx / len;
        const height =organicSize * (1 - thinning * r);
        top.push(`${p.x + perpX * height/2},${p.y + perpY * height/2}`);
        bottom.unshift(`${p.x - perpX * height/2},${p.y - perpY * height/2}`);
    }

    const pathD = `M ${top.join(' L ')} L ${bottom.join(' L ')} Z`;

    worm.attr('body/d', pathD);
    //linkView.removeTools();
}
function insertUpBottomStroke(link, x,y) {
    graph.startBatch();
    const linkView = paper.findViewByModel(link);
    if (!linkView) return;

    const localPoint = paper.clientToLocalPoint({
        x: x,
        y: y
    });

    const connection = linkView.getConnection();

    const totalLength = connection.length();
    const closestLength = connection.closestPointLength(localPoint);
    // let ratio = closestLength / totalLength;
    // ratio = Math.max(0, Math.min(1, ratio));
    // ratio = Math.round(ratio * 1000) / 1000; // optional: 0.001 precision
    let ratio = Math.max(0, Math.min(1, closestLength / totalLength));
    const upBottomStrokeShape = new joint.shapes.custom.UpBottomStroke();

    upBottomStrokeShape.set('linkAttachment', {
        linkId: link.id,
        ratio
    });

    graph.addCell(upBottomStrokeShape);

    updateUpBottomStrokeShape(upBottomStrokeShape);
    graph.stopBatch();
    linkView.removeTools();

}
function updateUpBottomStrokeShape(upBottomStrokeShape) {
    const attachment = upBottomStrokeShape.get('linkAttachment');
    if (!attachment) return;

    const link = graph.getCell(attachment.linkId);
    if (!link) return;

    const linkView = paper.findViewByModel(link);
    if (!linkView) return;

    const connection = linkView.getConnection();
    if (!connection) return;

    upBottomStrokeShape.position(0, 0);
    upBottomStrokeShape.rotate(0);

    const ratio = attachment.ratio;
    const segments = 6;
    const baseHeight = 30;
    const pixelLength = 60;
    const totalLength = connection.length();
    const upBottomStrokeShapeLength = pixelLength / totalLength;
    const step = upBottomStrokeShapeLength / segments;
    const safeRatio = Math.max(
        upBottomStrokeShapeLength,
        Math.min(1 - upBottomStrokeShapeLength, ratio)
    );
    const thinning = link.attr('line/organicStrokeThinning') || 0;
    let organicSize = link.attr('line/organicStrokeSize') || baseHeight;
    if (thinning != 0) {
        organicSize = organicSize + (organicSize + (link.attr('line/strokeWidth') || 2)) / 2;
    }

    const topPoints = [];
    const bottomPoints = [];

    for (let i = -segments; i <= segments; i++) {
        //let r = Math.max(0, Math.min(1, ratio + i * step));
        let r = safeRatio + i * step;
        const p = connection.pointAt(r);
        if (!p) continue;

        const delta = step / 2;//0.002;
        const before = connection.pointAt(Math.max(0, r - delta));
        const after = connection.pointAt(Math.min(1, r + delta));
        if (!before || !after) continue;

        const dx = after.x - before.x;
        const dy = after.y - before.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (!len) continue;

        const perpX = -dy / len;
        const perpY = dx / len;
        const height = organicSize * (1 - thinning * r);

        topPoints.push(`${p.x + perpX * height/2},${p.y + perpY * height/2}`);
        bottomPoints.unshift(`${p.x - perpX * height/2},${p.y - perpY * height/2}`);
    }

    if (!topPoints.length || !bottomPoints.length) return;

    const fillD = `M ${topPoints.join(' L ')} L ${bottomPoints.join(' L ')} Z`;
    const topD = `M ${topPoints.join(' L ')}`;
    const bottomD = `M ${bottomPoints.join(' L ')}`;

    upBottomStrokeShape.attr({
        fillBody: { d: fillD },
        topPath: { d: topD, stroke: 'yellow' },      // top stroke color
        bottomPath: { d: bottomD, stroke: 'yellow' } // bottom stroke color
    });

    //linkView.removeTools();
}

function updateRectanglePosition(rect) {

      const attachment = rect.get('linkAttachment');
    if (!attachment) return;

    const link = graph.getCell(attachment.linkId);
    if (!link) return;

    const linkView = paper.findViewByModel(link);
    if (!linkView) return;

    const connection = linkView.getConnection();
    const totalLength = connection.length();
    if (!totalLength) return;

    // 🔹 Use let so ratio can be adjusted
    let ratio = attachment.ratio;

    // 🔹 Ensure no overlap with other rectangles on same link
    const existingRects = graph.getElements().filter(el => {
        const a = el.get('linkAttachment');
        return a && a.linkId === link.id && el.id !== rect.id;
    });

    const minDistance = rect.size().width / totalLength; // minimum spacing along link

    existingRects.forEach(el => {
        const r = el.get('linkAttachment').ratio;
        if (Math.abs(r - ratio) < minDistance) {
            if (ratio < r) ratio = r - minDistance;
            else ratio = r + minDistance;
        }
    });

    ratio = Math.max(0, Math.min(1, ratio)); // clamp between 0 and 1

    // 🔹 Store updated ratio
    //rect.set('linkAttachment', { linkId: link.id, ratio });
    if (!isRestoring) {
        rect.set('linkAttachment', { linkId: link.id, ratio });
    } else {
        rect.attributes.linkAttachment = { linkId: link.id, ratio };
    }

    // 🔹 Get position along link
    const point = connection.pointAt(ratio);
    if (!point) return;

    // compute tangent manually
    const delta =  0.002;
    const before = connection.pointAt(Math.max(0, ratio - delta));
    const after  = connection.pointAt(Math.min(1, ratio + delta));
    if (!before || !after) return;

    const tangent = { x: after.x - before.x, y: after.y - before.y };
    let angle = joint.g.toDeg(Math.atan2(tangent.y, tangent.x));
    //if (angle > 90 || angle < -90) angle += 180;
    // Smooth angle to prevent flipping
    const prevAngle = rect.rotation || angle;
    if (angle - prevAngle > 90) angle -= 180;
    else if (angle - prevAngle < -90) angle += 180;

    let curvature = 0;

    if (before && after) {
        const dx1 = point.x - before.x;
        const dy1 = point.y - before.y;
        const dx2 = after.x - point.x;
        const dy2 = after.y - point.y;

        const angle1 = Math.atan2(dy1, dx1);
        const angle2 = Math.atan2(dy2, dx2);

        curvature = Math.abs(angle2 - angle1);
    }

    // 🔥 Dynamic height based on curvature
    const baseWidth = 60;
    const baseHeight = 30;

    const dynamicHeight = baseHeight - (curvature * totalLength * 0.1);//baseHeight - (curvature * 40);
// const localLength = Math.sqrt((after.x - before.x)**2 + (after.y - before.y)**2);
// const dynamicHeight = Math.max(12, Math.min(baseHeight, localLength*0.8, baseHeight - curvature*totalLength*0.1));

    const finalHeight = Math.max(12, dynamicHeight);

    rect.resize(baseWidth, finalHeight);

    rect.position(
        point.x - baseWidth / 2,
        point.y - finalHeight / 2
    );
    rect.rotate(angle, true);
}



function insertRectangleOnLink(link,x,y) {
    graph.startBatch();
    const linkView = paper.findViewByModel(link);
    if (!linkView) return;

    const localPoint = paper.clientToLocalPoint({
        x: x,
        y: y
    });

    const connection = linkView.getConnection();

    const totalLength = connection.length();
    const closestLength = connection.closestPointLength(localPoint);
    // let ratio = closestLength / totalLength;
    // ratio = Math.max(0, Math.min(1, ratio));
    // ratio = Math.round(ratio * 1000) / 1000; // optional: 0.001 precision
    let ratio = Math.max(0, Math.min(1, closestLength / totalLength));
    const rect = new joint.shapes.standard.Rectangle({
        size: { width: 40, height: 30 }, // height will auto-adjust
        attrs: {
            body: { fill: '#4c4ed8', stroke: '#000000', strokeWidth: 2, rx: 10, ry: 10 },
            //label: { text: 'Block', fill: '#000000' }
        }
    });

    // store ratio on element
    rect.set('linkAttachment', {
        linkId: link.id,
        ratio: ratio
    });

    graph.addCell(rect);
    updateRectanglePosition(rect);
    graph.stopBatch();
}
paper.on('element:pointermove', function(view, evt, x, y) {
    const element = view.model;
    const attachment = element.get('linkAttachment');
    if (!attachment) return;

    const link = graph.getCell(attachment.linkId);
    if (!link) return;

    const linkView = paper.findViewByModel(link);
    if (!linkView) return;

    const connection = linkView.getConnection();

    const totalLength = connection.length();
    const closestLength = connection.closestPointLength({ x, y });
    const ratio = closestLength / totalLength;

    element.set('linkAttachment', {
        linkId: attachment.linkId,
        ratio: ratio
    });
    if (element.isElement() && element.get('type') === 'custom.Worm') {
        updateWormShape(element);
    } else if(element.isElement() && element.get('type') === 'custom.UpBottomStroke') {
        updateUpBottomStrokeShape(element);
    }
    else {
        updateRectanglePosition(element);
    }
});
const dragStartPosition = new Map();

paper.on('element:pointerdown', (view, evt) => {
    const element = view.model;
    if (!element.get('linkAttachment')) return;
    // store initial position before drag for undo
    dragStartPosition.set(element.id, element.get('linkAttachment').ratio);
});

paper.on('element:pointerup', (view, evt) => {
    const element = view.model;
    const attachment = element.get('linkAttachment');
    if (!attachment) return;

    const startRatio = dragStartPosition.get(element.id);
    dragStartPosition.delete(element.id);

    const endRatio = element.get('linkAttachment').ratio;

    if (startRatio === undefined || startRatio === endRatio) return;

    pushOperation({
        type: 'moveAttachment',
        element: element,
        from: startRatio,
        to: endRatio
    });
});


function splitLinkAtPointWithRectangle(linkView, x,y) {

    const graph = linkView.model.graph;
    const original = linkView.model;

    const localPoint = paper.clientToLocalPoint(x, y);
    const connection = linkView.getConnection();
    if (!connection) return;

    const totalLength = connection.length();
    if (!totalLength) return;

    const lengthAtPoint = connection.closestPointLength(localPoint);
    let ratio = lengthAtPoint / totalLength;

    // prevent extreme edge split
    ratio = Math.max(0.001, Math.min(0.999, ratio));

    const splitPoint = connection.pointAtLength(lengthAtPoint);
    if (!splitPoint) return;

    const source = original.get('source');
    const target = original.get('target');
    const router = original.get('router');
    const connector = original.get('connector');
    const baseLineAttrs = original.attr('line') || {};
    const z = original.get('z') || 1;

    // 1️⃣ Create rectangle
    const width = 60;
    const height = 30;
    
    const rect = new joint.shapes.standard.Rectangle();

    rect.resize(width, height);

    rect.position(
        localPoint.x - width / 2,
        localPoint.y - height / 2
    );
    rect.attr({
        body: { fill: '#4c4ed8', stroke: '#000000' }
    });
    graph.addCell(rect);

    const vertices = original.get('vertices') || [];
    const leftVertices = [];
    const rightVertices = [];

    vertices.forEach(v => {
        const ptLength = connection.closestPointLength(v);
        const ptRatio = ptLength / connection.length();

        if (ptRatio <= ratio) {
            leftVertices.push({ ...v });
        } else {
            rightVertices.push({ ...v });
        }
    });

    // 2️⃣ Create new links
    const leftLink = new Branch({
        source,
        target: { id: rect.id },
        router,
        connector,
        attrs: { line: { ...baseLineAttrs } }
    });
    leftLink.set('vertices', leftVertices);
    const rightLink = new Branch({
        source: { id: rect.id },
        target,
        router,
        connector,
        attrs: { line: { ...baseLineAttrs } }
    });
    rightLink.set('vertices', rightVertices);

    leftLink.set({ z });
    rightLink.set({ z });

    graph.addCells([leftLink, rightLink]);

    // -----------------------------
    // 🔁 Reattach CHILD LINKS
    // -----------------------------
    const children = graph.getConnectedLinks(original, { outbound: true });

    children.forEach(child => {
        const src = child.get('source');
        if (!src.anchor || src.id !== original.id) return;

        const r = src.anchor.args.ratio;

        if (r <= ratio) {

            const newRatio = r / ratio;

            child.set('source', {
                id: leftLink.id,
                anchor: {
                    name: 'connectionRatio',
                    args: { ratio: newRatio }
                }
            });

        } else {

            const newRatio = (r - ratio) / (1 - ratio);

            child.set('source', {
                id: rightLink.id,
                anchor: {
                    name: 'connectionRatio',
                    args: { ratio: newRatio }
                }
            });
        }
    });

    // -----------------------------
    // 🏷 Preserve LABELS
    // -----------------------------
    const labels = original.get('labels') || [];

    labels.forEach(label => {

        const d = label.position.distance;

        if (d <= ratio) {

            const newDistance = d / ratio;

            leftLink.appendLabel({
                attrs: label.attrs,
                position: {
                    distance: newDistance,
                    angle: label.position.angle
                }
            });

        } else {

            const newDistance = (d - ratio) / (1 - ratio);

            rightLink.appendLabel({
                attrs: label.attrs,
                position: {
                    distance: newDistance,
                    angle: label.position.angle
                }
            });
        }
    });

    // finally remove original
    original.remove();

    return { rect, leftLink, rightLink };
}


function hideAllLinkLabels() {
    graph.getLinks().forEach(link => {
        const labels = link.labels();

        labels.forEach((label, index) => {
            link.label(index, {
                attrs: {
                    labelText: { display: 'none' },
                    labelBackground: { display: 'none' },
                    line: { display: 'none' },
                }
            });
        });
    });
}
function showAllLinkLabels(){
    graph.getLinks().forEach(link => {
        const labels = link.labels();
        labels.forEach((label, index) => {
            link.label(index, {
                attrs: {
                    labelText: { display: 'block' },
                    labelBackground: { display: 'block' },
                    line: { display: 'block' },
                }
            });
        });
    });
}

function colorLinkSharp(linkView, color) {
    linkView.model.attr({
        line: {
            fill: color,
            filter: null               // remove any SVG blur
        }
    });
}
let menuOpen = false;
// paper.on('blank:pointerdown element:pointerdown', () => {
//     menuEl.style.display = 'none';
//     colorMenu.style.display = 'none';
//     menuOpen = false;
// });
function onBlankAndElementdownClick(e) {
    menuEl.style.display = 'none';
    colorMenu.style.display = 'none';
    elementMenu.style.display = 'none';
    menuOpen = false;
    activeLabelEditor?.remove();
    activeLabelEditor = null;
}
function deleteVertex(linkView, vertexIndex) {
    const link = linkView.model;
    let vertices = link.vertices() || [];
    // Fallback: if vertexIndex is -1 and there is at least 1 vertex, delete the first one
    if (vertexIndex === -1 && vertices.length > 0) {
        vertexIndex = 0;
    }
    if (vertexIndex < 0 || vertexIndex >= vertices.length) {
        return;
    }
    const newVertices = vertices.slice();
    newVertices.splice(vertexIndex, 1);
    link.set('vertices', newVertices);
}
// Move the labels layer to the front so that the labels are not covered
// by the link tools.
const labelLayerEl = paper.getLayerNode('labels');
labelLayerEl.parentElement.appendChild(labelLayerEl);
// Events
function onPaperLinkMouseEnter(linkView,evt) {
    if (menuOpen) return;
    const target = evt.target;
    if (target.closest('.custom-shape')) return;
    // Scale the tools based on the width of the link.
    const branchWidth = linkView.model.attr('line/organicStrokeSize') || 5;
    const scale = Math.max(1, Math.min(2, branchWidth / 5));
    const toolsView = new joint.dia.ToolsView({
        tools: [
            new joint.linkTools.Vertices({
                snapRadius: 0,              // allow very close placement
                redundancyRemoval: false,   // DO NOT auto-remove
                vertexAdding: true
            }),
            new joint.linkTools.SourceAnchor({ restrictArea: false, scale }),
            //new joint.linkTools.Remove({ scale }),
        ],
    });
    linkView.addTools(toolsView);
}
function onPaperLinkMouseLeave(linkView) {
    if (menuOpen) return; // keep tools visible while menu is open
    linkView.removeTools();
}
function onPaperElementPointerclick(elementView) {
    paper.removeTools();
    joint.highlighters.mask.removeAll(paper);
    joint.highlighters.mask.add(elementView, 'border', 'node-hgl', {
        attrs: {
            stroke: colors.highlight,
            'stroke-width': 2,
        },
    });
    // elementView.addTools(
    //     new joint.dia.ToolsView({
    //         tools: [
    //             new RotateTool({
    //                 selector: 'border',
    //             }),
    //         ],
    //     })
    // );
}
function onBlankPointerclick() {
    paper.removeTools();
    joint.highlighters.mask.removeAll(paper);
}
paper.on({
    'link:mouseenter': onPaperLinkMouseEnter,
    'link:mouseleave': onPaperLinkMouseLeave,
    'element:pointerclick': onPaperElementPointerclick,
    'blank:pointerclick': onBlankPointerclick,
    'blank:pointerdown': onBlankAndElementdownClick,
    'element:pointerdown': onBlankAndElementdownClick,
});
let activeLabelEditor = null;
function makeLabelEditable(link, labelIndex = 0) {
    if (activeLabelEditor) {
        activeLabelEditor.remove();
        activeLabelEditor = null;
    }
    const label = link.get('labels')?.[labelIndex];
    if (!label) return;
    const linkView = link.findView(paper);
    if (!linkView) return;
    const offset = label.position?.offset || { x: 0, y: 0 };
    const bbox = linkView.getBBox({ useModelGeometry: true });
    const labelX = bbox.x + offset.x;
    const labelY = bbox.y + offset.y;
    // Create a container div for input + buttons
    const container = document.createElement('div');
    container.style.position = 'absolute';
    //container.style.left = `${labelX}px`;
    //container.style.top = `${labelY}px`;
    container.style.display = 'inline-flex';
    container.style.alignItems = 'center';
    container.style.gap = '5px';
    container.style.zIndex = 9999;
    const paperRect = paper.el.getBoundingClientRect();
    container.style.left = `${labelX}px`;
    container.style.top = `${labelY}px`;
    // Stop clicks from propagating to paper
    container.addEventListener('mousedown', e => e.stopPropagation());
    container.addEventListener('click', e => e.stopPropagation());
    activeLabelEditor = container; // 🔑 track active editor
    // Create input
    const input = document.createElement('input');
    input.type = 'text';
    input.value = label.attrs?.labelText?.text || '';
    input.style.fontSize = '14px';
    input.style.fontFamily = 'sans-serif';
    input.style.width = '120px';
    input.style.height = '25px';
    container.appendChild(input);
    // Create Save button
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.style.height = '25px';
    saveBtn.addEventListener('click', () => {
        if (input.value.trim() !== '') {
            graph.startBatch('label-edit');
            link.label(labelIndex, {
                attrs: {
                    labelText: { text: input.value },
                },
            });
            graph.stopBatch('label-edit');
        }
        container.remove();
        activeLabelEditor = null;
    });
    container.appendChild(saveBtn);
    // Create Cancel button
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.height = '25px';
    cancelBtn.addEventListener('click', () => {
        container.remove();
        activeLabelEditor = null;
    });
    container.appendChild(cancelBtn);
    //document.body.appendChild(container);
    paper.el.appendChild(container);
    input.focus();
    // Optional: handle Enter / Escape keys
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveBtn.click();
        if (e.key === 'Escape') cancelBtn.click();
    });
}
// Attach to double-click anywhere on paper
paper.on('link:pointerdblclick', (linkView, evt) => {
    evt.stopPropagation();
    const target = evt.target;
    // ❌ Ignore dblclicks coming from vertices
    if (target.closest('.joint-vertex')) return;
    // ❌ Ignore link path
    if (target.closest('[joint-selector="line"]')) return;
    // ✅ Allow only label text or label background
    const labelText = target.closest('[joint-selector="labelText"]');
    const labelBg = target.closest('[joint-selector="labelBackground"]');
    if (!labelText && !labelBg) return;
    const labelGroup = target.closest('g.label');
    if (!labelGroup) return;
    // 🔑 Read label index
    const labelIndex = parseInt(labelGroup.getAttribute('label-idx'), 10);
    if (Number.isNaN(labelIndex)) return;
    makeLabelEditable(linkView.model, labelIndex);
});
// Species
// -------
//const porifera = new Species({
//    id: 'Porifera',
//    position: { x: 696, y: 552 },
//    attrs: {
//        label: {
//            text: 'Porifera',
//        },
//        icon: {
//            xlinkHref: 'assets/porifera.svg',
//        },
//    },
//});
//const cnidaria = new Species({
//    id: 'Cnidaria',
//    position: { x: 264, y: 432 },
//    attrs: {
//        label: {
//            text: 'Cnidaria',
//        },
//        icon: {
//            xlinkHref: 'assets/cnidaria.svg',
//        },
//    },
//});
//const cnidaria2 = new Species({
//    id: 'Cnidaria2',
//    position: { x: 330, y: 396 },
//    z: -1,
//    angle: 15,
//    attrs: {
//        icon: {
//            xlinkHref: 'assets/cnidaria2.svg',
//        },
//    },
//});
//const platyhelmintha = new Species({
//    id: 'platyhelmintha',
//    position: { x: 768, y: 400 },
//    angle: -25,
//    attrs: {
//        label: {
//            text: 'Platyhelmintha',
//        },
//        icon: {
//            xlinkHref: 'assets/platyhelmintha.svg',
//        },
//    },
//});
//const brachiopoda = new Species({
//    id: 'Brachiopoda',
//    position: { x: 840, y: 248 },
//    angle: -25,
//    attrs: {
//        label: {
//            text: 'Brachiopoda',
//        },
//        icon: {
//            xlinkHref: 'assets/brachiopoda.svg',
//        },
//    },
//});
//const annelida = new Species({
//    id: 'Annelida',
//    position: { x: 936, y: 112 },
//    attrs: {
//        label: {
//            text: 'Annelida',
//        },
//        icon: {
//            xlinkHref: 'assets/annelida.svg',
//        },
//    },
//});
//const mollusca = new Species({
//    id: 'Mollusca',
//    position: { x: 856, y: 8 },
//    angle: -20,
//    attrs: {
//        label: {
//            text: 'Mollusca',
//        },
//        icon: {
//            xlinkHref: 'assets/mollusca.svg',
//        },
//    },
//});
//const tarigrada = new Species({
//    id: 'Tarigrada',
//    position: { x: 560, y: -136 },
//    angle: 15,
//    attrs: {
//        label: {
//            text: 'Tarigrada',
//        },
//        icon: {
//            xlinkHref: 'assets/tarigrada.svg',
//        },
//    },
//});
//const arthropoda = new Species({
//    id: 'Arthropoda',
//    position: { x: 784, y: -105 },
//    angle: -45,
//    attrs: {
//        label: {
//            text: 'Arthropoda',
//        },
//        icon: {
//            xlinkHref: 'assets/arthropoda.svg',
//        },
//    },
//});
//const nematoda = new Species({
//    id: 'Nematoda',
//    position: { x: 432, y: -56 },
//    attrs: {
//        label: {
//            text: 'Nematoda',
//        },
//        icon: {
//            xlinkHref: 'assets/nematoda.svg',
//        },
//    },
//});
//const echinodermata = new Species({
//    id: 'Echinodermata',
//    position: { x: 56, y: 128 },
//    angle: 30,
//    attrs: {
//        label: {
//            text: 'Echinodermata',
//        },
//        icon: {
//            xlinkHref: 'assets/echinodermata.svg',
//        },
//    },
//});
//const chordata = new Species({
//    id: 'Chordata',
//    position: { x: 256, y: 8 },
//    angle: 45,
//    attrs: {
//        label: {
//            text: 'Chordata',
//        },
//        icon: {
//            xlinkHref: 'assets/chordata.svg',
//        },
//    },
//});
//const chordata2 = new Species({
//    id: 'Chordata2',
//    position: { x: 290, y: -70 },
//    z: -1,
//    angle: 15,
//    attrs: {
//        icon: {
//            xlinkHref: 'assets/chordata2.svg',
//        },
//    },
//});
//const chordata3 = new Species({
//    id: 'Chordata3',
//    position: { x: 206, y: -60 },
//    z: -1,
//    angle: -20,
//    attrs: {
//        icon: {
//            xlinkHref: 'assets/chordata3.svg',
//        },
//    },
//});
//chordata.embed([chordata2, chordata3]);
//cnidaria.embed([cnidaria2]);
//graph.addCells([
//    porifera,
//    cnidaria,
//    cnidaria2,
//    platyhelmintha,
//    brachiopoda,
//    annelida,
//    mollusca,
//    tarigrada,
//    arthropoda,
//    nematoda,
//    echinodermata,
//    chordata,
//    chordata2,
//    chordata3,
//]);
// Branches
// --------
// const outerLink = new Branch({
//     source: { x: 556, y: 46 },
//     target: { x: 1225, y: 35 },
//     vertices: [{ x: 527, y: 107 }, { x: 527, y: 168 }, 
//         { x: 549, y: 274 },{ x: 552, y: 361 }, { x: 539, y: 424 },{ x: 495, y: 476 },{x:441,y:531}
//         ,{x:377,y:618},{x:316,y:725},{x:262,y:868},{x:252,y:1036},{x:285,y:1181},{x:341,y:1303}
//         ,{x:448,y:1484},{x:550,y:1622},{x:678,y:1741},
//         {x:805,y:1864},{x:907,y:1907},{x:965,y:1910},
//         {x:1065,y:1884},{x:1187,y:1833},{x:1317,y:1741},
//         {x:1411,y:1634},{x:1503,y:1489},{x:1569,y:1346},
//         {x:1579,y:1262},{x:1633,y:1189},{x:1681,y:1092},
//         {x:1691,y:975},{x:1683,y:886},{x:1645,y:787},
//         {x:1611,y:721},{x:1564,y:652},{x:1423,y:513},
//         {x:1362,y:461},{x:1296,y:394},{x:1251,y:318},
//         {x:1228,y:137}],
//     attrs: {
//         line: {
//             fill: '#000000',
//             stroke: '#000000',
//             organicStrokeSize: 2,
//             pointerEvents: 'none',
//             //organicStrokeThinning:.8,
//         },
//     },
//     //interactive: false   // 🔒 LOCKED
// });
// const outerLink2 = new Branch({
//     source: { x: 641, y: 50 },
//     target: { x: 955, y: 327 },
//     vertices: [{ x: 631, y: 115 }, { x: 631, y: 176 }, 
//         { x: 636, y: 257 },{ x: 657, y: 329 }, { x: 700, y: 423 },{ x: 731, y: 466 },{x:728,y:527}
//         ,{x:731,y:576},{x:751,y:619},{x:797,y:645},{x:840,y:652},{x:886,y:632},{x:942,y:584}
//         ,{x:980,y:609},{x:1024,y:594},{x:1049,y:568},
//         {x:1068,y:508},{x:991,y:420},{x:965,y:401},
//         {x:956,y:368}],
//     attrs: {
//         line: {
//             fill: '#000000',
//             stroke: '#000000',
//             organicStrokeSize: 2,
//             pointerEvents: 'none',
//             //organicStrokeThinning:.8,
//         },
//     },
//     //interactive: false   // 🔒 LOCKED
// });
// const outerLink3 = new Branch({
//     source: { x: 886, y: 632 },
//     target: { x: 980, y: 609 },
//     vertices: [{ x: 924, y: 665 }, { x: 950, y: 660 }, 
//         { x: 972, y: 641 }],
//     attrs: {
//         line: {
//             fill: '#000000',
//             stroke: '#000000',
//             organicStrokeSize: 2,
//             pointerEvents: 'none',
//             //organicStrokeThinning:.8,
//         },
//     },
//     //interactive: false   // 🔒 LOCKED
// });
// const outerLink4 = new Branch({
//     source: { x: 1068, y: 508 },
//     target: { x: 995, y: 424 },
//     vertices: [{ x: 1116, y: 489 }, { x: 1103, y: 468 }, 
//         { x: 1098, y: 434 },{ x: 1024, y: 429 }],
//     attrs: {
//         line: {
//             fill: '#000000',
//             stroke: '#000000',
//             organicStrokeSize: 2,
//             pointerEvents: 'none',
//             //organicStrokeThinning:.8,
//         },
//     },
//     //interactive: false   // 🔒 LOCKED
// });
joint.shapes.custom.Region = joint.dia.Element.define(
    'custom.Region',
    {
        size: { width: 2000, height: 2000 },
        attrs: {
            // body: {
            //     d: `
            //         M 556 46 L 527 107 L 527 168 L 538 234 L 552 297 L 552 361 L 539 424 L 493 478 L 441 531 L 377 618 L 316 725 L 262 868 L 252 1036 L 285 1181 L 341 1303 L 448 1484 L 550 1622 L 657 1720 L 720 1792 L 805 1864 L 907 1907 L 965 1910 L 1065 1884 L 1187 1833 L 1267 1782 L 1350 1702 L 1430 1609 L 1493 1501 L 1535 1421 L 1567 1333 L 1575 1278 L 1585 1253 L 1635 1185 L 1671 1107 L 1689 1040 L 1691 975 L 1683 886 L 1645 787 L 1611 721 L 1564 652 L 1423 513 L 1332 443 L 1289 395 L 1245 318 l -19 -96 L 1224 137 L 1225 25 M 641 50 L 631 115 L 631 176 L 636 257 L 657 329 L 700 423 L 731 466 L 728 527 L 731 576 L 751 619 L 781 640 L 807 650 L 840 652 L 867 642 L 886 631 L 906 618 L 922 605 L 930 595 L 938 581 L 954 595 L 971 608 L 983 610 L 1000 605 L 1023 593 L 1042 573 L 1054 556 L 1061 542 L 1070 514 L 991 420 L 965 401 L 956 368 L 955 327 M 886 631 L 896 650 L 907 661 L 920 666 L 939 665 L 951 660 L 962 653 L 971 642 L 980 629 L 983 610 M 1070 514 L 1076 522 L 1116 489 L 1103 467 L 1098 434 L 1024 429 L 995 424
            //     `,
            //     fill: '#ffffff',
            //     stroke: '#000000',
            //     strokeWidth: 6,
            //     pointerEvents: 'none'

            // },
            area1: {
                d: 'M 556 46 L 527 107 L 527 168 L 538 234 L 552 297 L 552 361 L 539 424 L 493 478 L 441 531 L 377 618 L 316 725 L 262 868 L 252 1036 L 285 1181 L 341 1303 L 448 1484 L 550 1622 L 657 1720 L 720 1792 L 805 1864 L 907 1907 L 965 1910 L 1065 1884 L 1187 1833 L 1267 1782 L 1350 1702 L 1430 1609 L 1493 1501 L 1535 1421 L 1567 1333 L 1575 1278 L 1585 1253 L 1635 1185 L 1671 1107 L 1689 1040 L 1691 975 L 1683 886 L 1645 787 L 1611 721 L 1564 652 L 1423 513 L 1332 443 L 1289 395 L 1245 318 l -19 -96 L 1224 137 L 1225 25',
                fill: '#ffffff',
                stroke: '#000',
                strokeWidth: 4,
                pointerEvents: 'none'
            },
            area2: {
                d: 'M 641 50 L 631 115 L 631 176 L 636 257 L 657 329 L 700 423 L 731 466 L 728 527 L 731 576 L 751 619 L 781 640 L 807 650 L 840 652 L 867 642 L 886 631 L 906 618 L 922 605 L 930 595 L 938 581 L 954 595 L 971 608 L 983 610 L 1000 605 L 1023 593 L 1042 573 L 1054 556 L 1061 542 L 1070 514 L 991 420 L 965 401 L 956 368 L 955 327',
                fill: '#ffffff',
                stroke: '#000',
                strokeWidth: 4,
                pointerEvents: 'none'
            },
            area3: {
                d: 'M 886 631 L 896 650 L 907 661 L 920 666 L 939 665 L 951 660 L 962 653 L 971 642 L 980 629 L 983 610',
                fill: '#ffffff',
                stroke: '#000',
                strokeWidth: 4,
                pointerEvents: 'none'
            },
            area4: {
                d: 'M 1070 514 L 1077 522 L 1116 489 L 1103 468 L 1098 434 L 1024 429 L 991 420 z',
                fill: '#ED2E24',
                stroke: '#000',
                strokeWidth: 4,
                pointerEvents: 'none'
            }
        }
    },
    {
        markup: [
            { tagName: 'path', selector: 'area1' },
            { tagName: 'path', selector: 'area2' },
            { tagName: 'path', selector: 'area3' },
            { tagName: 'path', selector: 'area4' }
        ]
    }
);
// const laorigin = { x: 862, y: 804 };

// const laLink = new Branch({
//     source: laorigin,
//     target: { x: 1128, y: 1530 },
//     vertices: [{ x: 768, y: 891 }, { x: 707, y: 973 }, 
//         { x: 681, y: 1058 },{ x: 620, y: 1226 }, { x: 601, y: 1304 },{ x: 599, y: 1383 },{x:632,y:1398}
//         ,{x:693,y:1383},{x:794,y:1270},{x:840,y:1255},{x:896,y:1272},{x:937,y:1311},{x:987,y:1374}
//         ,{x:1004,y:1433},{x:1069,y:1466},{x:1092,y:1507}],
//     attrs: {
//         line: {
//             organicStrokeSize: 20,
//             organicStrokeThinning:.8,
//         },
//     },
//     labels: [
//         {
//             attrs: {
//                 labelText: {
//                     text: 'PRCA',
//                 },
//             },
//             position: {
//                 distance: 0.15,
//                 angle: 10,
//             },
//         },
//         {
//             attrs: {
//                 labelText: {
//                     text: 'MRCA',
//                 },
//             },
//             position: {
//                 distance: 0.55,
//                 angle: 10,
//             },
//         },
//         {
//             attrs: {
//                 labelText: {
//                     text: 'AMARG',
//                 },
//             },
//             position: {
//                 distance: 0.95,
//                 angle: 10,
//             },
//         },
//     ],
// });
// const lb0Link = new Branch({
//     source: {
//         id: laLink.id,
//         anchor: { name: 'connectionRatio', args: { ratio: 0.03 } },
//     },
//     target: { x: 718, y: 838 },
//     vertices: [{ x: 759, y: 794 }, { x: 733, y: 743 },{ x: 751, y: 720 },{ x: 821, y: 699 }
//         ,{ x: 830, y: 661 },{ x: 792, y: 643 },{ x: 718, y: 643 }, { x: 668, y: 667 }, { x: 639, y: 735 }
//         ,{ x: 665, y: 788 },{ x: 692, y: 829 },{ x: 718, y: 838 }
//     ],
//     attrs: {
//         line: {
//             organicStrokeSize: 10,
//             organicStrokeThinning:.8,
//         },
//     },
//     labels: [
//         {
//             attrs: {
//                 labelText: {
//                     text: 'DRCA',
//                 },
//             },
//             position: {
//                 distance: 0.45,
//                 angle: 10,
//             },
//         },
//     ],
// });
// const lbLink = new Branch({
//     source: {
//         id: laLink.id,
//         anchor: { name: 'connectionRatio', args: { ratio: 0.1 } },
//     },
//     target: { x: 933, y: 982 },
//     vertices: [{ x: 842, y: 944 }, { x: 892, y: 979 }],
//     attrs: {
//         line: {
//             organicStrokeSize: 10,
//             organicStrokeThinning:.8,
//         },
//     },
//     labels: [
//         {
//             attrs: {
//                 labelText: {
//                     text: 'DRCA',
//                 },
//             },
//             position: {
//                 distance: 0.45,
//                 angle: 10,
//             },
//         },
//     ],
// });
// const lcLink = new Branch({
//     source: {
//         id: laLink.id,
//         anchor: { name: 'connectionRatio', args: { ratio: 0.2 } },
//     },
//     target: { x: 951, y: 1236 },
//     vertices: [{ x: 742, y: 1130 }, { x: 810, y: 1159 },{x:877,y:1180},{x:910,y:1212}],
//     attrs: {
//         line: {
//             organicStrokeSize: 15,
//             organicStrokeThinning:.8,
//         },
//     },
//     labels: [
//         {
//             attrs: {
//                 labelText: {
//                     text: 'DRCA',
//                 },
//             },
//             position: {
//                 distance: 0.45,
//                 angle: 10,
//             },
//         },
//     ],
// });
// const ldLink = new Branch({
//     source: {
//         id: laLink.id,
//         anchor: { name: 'connectionRatio', args: { ratio: 0.35 } },
//     },
//     target: { x: 1039, y: 1507 },
//     vertices: [{ x: 712, y: 1306 }, { x: 765, y: 1368 },{x:874,y:1415},{x:957,y:1477}],
//     attrs: {
//         line: {
//             organicStrokeSize: 15,
//             organicStrokeThinning:.8,
//         },
//     },
//     labels: [
//         {
//             attrs: {
//                 labelText: {
//                     text: 'DRCA',
//                 },
//             },
//             position: {
//                 distance: 0.45,
//                 angle: 10,
//             },
//         },
//     ],
// });
// const leLink = new Branch({
//     source: {
//         id: laLink.id,
//         anchor: { name: 'connectionRatio', args: { ratio: 0.65 } },
//     },
//     target: { x: 904, y: 1121 },
//     vertices: [{ x: 789, y: 1250 }, { x: 804, y: 1221 },{x:848,y:1191},{x:874,y:1144}],
//     attrs: {
//         line: {
//             organicStrokeSize: 10,
//             organicStrokeThinning:.8,
//         },
//     },
//     labels: [
//         {
//             attrs: {
//                 labelText: {
//                     text: 'DRCA',
//                 },
//             },
//             position: {
//                 distance: 0.45,
//                 angle: 10,
//             },
//         },
//     ],
// });
// const raorigin = { x: 942, y: 738 };
// const raLink = new Branch({
//     source: raorigin,
//     target: { x: 1051, y: 1480 },
//     vertices: [{ x: 1019, y: 729 }, { x: 1081, y: 767 }, 
//         { x: 1157, y: 962 },{ x: 1199, y: 1085 }, { x: 1207, y: 1197 },{ x: 1184, y: 1292 },{x:1202,y:1336}
//         ,{x:1187,y:1442},{x:1156,y:1557},{x:1113,y:1579},{x:1084,y:1531},{x:1065,y:1511}],
//     attrs: {
//         line: {
//             organicStrokeSize: 20,
//             organicStrokeThinning:.8,
//         },
//     },
//     labels: [
//         {
//             attrs: {
//                 labelText: {
//                     text: 'PLM',
//                 },
//             },
//             position: {
//                 distance: 0.45,
//                 angle: 10,
//             },
//         },
//     ],
// });
// const rbLink = new Branch({
//     source: {
//         id: raLink.id,
//         anchor: { name: 'connectionRatio', args: { ratio: 0.17 } },
//     },
//     target: { x: 1316, y: 947 },
//     vertices:[{x:1196,y:844},{x:1246,y:900}],
//     attrs: {
//         line: {
//             organicStrokeSize: 20,
//         },
//     },
//     labels: [
//         {
//             attrs: {
//                 labelText: {
//                     text: 'PLAD',
//                 },
//             },
//             position: {
//                 distance: 0.45,
//                 angle: 10,
//             },
//         },
//     ],
// });
// const rcLink = new Branch({
//     source: {
//         id: raLink.id,
//         anchor: { name: 'connectionRatio', args: { ratio: 0.3 } },
//     },
//     target: { x: 1375, y: 1471 },
//     vertices: [{ x: 1219, y: 973 },{ x: 1272, y: 1044 },{ x: 1319, y: 1118 },{ x: 1343, y: 1156 },{ x: 1355, y: 1215 }
//         ,{ x: 1375, y: 1262 },{ x: 1372, y: 1292 },{ x: 1390, y: 1336 },{ x: 1381, y: 1380 },{ x: 1390, y: 1427 }
//     ],
//     attrs: {
//         line: {
//             organicStrokeSize: 15,
//             organicStrokeThinning:0.8,
//         },
//     },
//     labels: [
//         {
//             attrs: {
//                 labelText: {
//                     text: 'D1',
//                 },
//             },
//             position: {
//                 distance: 0.45,
//                 angle: 10,
//             },
//         },
//     ],
// });
// const rdLink = new Branch({
//     source: {
//         id: raLink.id,
//         anchor: { name: 'connectionRatio', args: { ratio: 0.54 } },
//     },
//     target: { x: 1272, y: 1507 },
//     vertices:[{x:1243,y:1256},{x:1258,y:1348},{x:1278,y:1392},{x:1287,y:1445}],
//     attrs: {
//         line: {
//             organicStrokeSize: 15,
//             organicStrokeThinning:0.8
//         },
//     },
//     labels: [
//         {
//             attrs: {
//                 labelText: {
//                     text: 'MLAD',
//                 },
//             },
//             position: {
//                 distance: 0.45,
//                 angle: 10,
//             },
//         },
//     ],
// });
// const reLink = new Branch({
//     source: {
//         id: raLink.id,
//         anchor: { name: 'connectionRatio', args: { ratio: 0.29 } },
//     },
//     target: { x: 1069, y: 1203 },
//     vertices:[{x:1110,y:1021},{x:1113,y:1082},{x:1084,y:1109},{x:1098,y:1144},{x:1075,y:1168}],
//     attrs: {
//         line: {
//             organicStrokeSize: 15,
//             organicStrokeThinning:0.8
//         },
//     },
//     labels: [
//         {
//             attrs: {
//                 labelText: {
//                     text: 'D2',
//                 },
//             },
//             position: {
//                 distance: 0.45,
//                 angle: 10,
//             },
//         },
//     ],
// });
// const rfLink = new Branch({
//     source: {
//         id: raLink.id,
//         anchor: { name: 'connectionRatio', args: { ratio: 0.42 } },
//     },
//     target: { x: 1134, y: 1162 },
//     vertices:[{x:1169,y:1112},{x:1160,y:1138}],
//     attrs: {
//         line: {
//             organicStrokeSize: 8,
//             organicStrokeThinning: 0.8, 
//         },
//     },
//     labels: [
//         {
//             attrs: {
//                 labelText: {
//                     text: 'DLAD',
//                 },
//             },
//             position: {
//                 distance: 0.45,
//                 angle: 10,
//             },
//         },
//     ],
// });
// const rgLink = new Branch({
//     source: {
//         id: raLink.id,
//         anchor: { name: 'connectionRatio', args: { ratio: 0.55 } },
//     },
//     target: { x: 1045, y: 1362 },
//     vertices: [{ x: 1128, y: 1236 },{ x: 1110, y: 1277 },{ x: 1092, y: 1295 },{ x: 1092, y: 1321 },{ x: 1069, y: 1333 }],
//     attrs: {
//         line: {
//             organicStrokeSize: 10,
//             organicStrokeThinning:0.8,
//         },
//     },
//     labels: [
//         {
//             attrs: {
//                 labelText: {
//                     text: 'Lat Ramus',
//                 },
//             },
//             position: {
//                 distance: 0.45,
//                 angle: 10,
//             },
//         },
//     ],
// });

const branchConfig = [
  {
    id: 'mpLink',
    order: 99,
    toFront: true,
    source: { x: 1123, y: 582 },
    target: { x: 1101, y: 449 },
    vertices: [
      { x: 1157, y: 543 }, { x: 1169, y: 491 },{ x: 1155, y: 457 }
    ],
    style: { fill: "#C07BAE",stroke: '#000000', strokeWidth:1, organicStrokeSize: 50, organicStrokeThinning: .5, organicStrokeTaper: 0, organicStrokeStartCap: false }
  },
  {
    id: 'myLink',
    order: 10,
    parent: 'mpLink',
    ratio: 0,
    target: { x: 967, y: 1788 },
    vertices: [
      { x: 1078, y: 632 },{x:1014,y:761},{x:931,y:927},{ x: 864, y: 1066 }, { x: 797, y: 1203 },{ x: 782, y: 1323 },{x:782,y:1431}
        ,{x:765,y:1501},{x:815,y:1770},{x:861,y:1896},{x:894,y:1925},{x:935,y:1876}
    ],
    style: { fill:"#EFE648", stroke: '#000000', strokeWidth:1, organicStrokeSize: 35, organicStrokeThinning:.3, organicStrokeTaper:1 }
  },
  {
    id: 'myLeftLink',
    order: 3,
    parent: 'mpLink',
    ratio: 0,
    target: { x: 818, y: 816 },
    vertices: [
      { x: 1058, y: 620 },{ x: 977, y: 693 }, { x: 907, y: 735 }
    ],
    style: { fill:"#EFE648", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 30, organicStrokeThinning:.3, organicStrokeTaper:1 }
  },
  {
    id: 'myLeftBLink',
    order: 2,
    parent: 'myLeftLink',
    ratio: 0.45,
    target: { x: 915, y: 832 },
    vertices: [
        { x: 965, y: 736 },{ x: 953, y: 776 }
    ],
    style: { fill:"#EFE648", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 20, organicStrokeThinning:.3, organicStrokeTaper:1 }
  },
  {
    id: 'myLeftCLink',
    order: 3,
    parent: 'myLink',
    ratio: 0.18,
    target: { x: 734, y: 959 },
    vertices: [
        { x: 939, y: 867 },{ x: 880, y: 882 }, { x: 803, y: 959 }
    ],
    style: { fill:"#EFE648", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 20, organicStrokeThinning:.3, organicStrokeTaper:1 }
  },
  {
    id: 'myLeftDLink',
    order: 3,
    parent: 'myLink',
    ratio: 0.3,
    target: { x: 693, y: 1165 },
    vertices: [
        { x: 836, y: 1042 },{ x: 767, y: 1114 }, { x: 716, y: 1128 }
    ],
    style: { fill:"#EFE648", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 20, organicStrokeThinning:.3, organicStrokeTaper:1 }
  },
  {
    id: 'myRightLink',
    order: 3,
    parent: 'mpLink',
    ratio: 0,
    target: { x: 1241, y: 1290 },
    vertices: [
        { x: 1144, y: 628 },{ x: 1152, y: 839 }, { x: 1144, y: 954 },{ x: 1162, y: 1042 },{ x: 1235, y: 1199 }
    ],
    style: { fill:"#EFE648", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 30, organicStrokeThinning:.3, organicStrokeTaper:1 }
  },
  {
    id: 'myRightBLink',
    order: 2,
    parent: 'myRightLink',
    ratio: 0.4,
    target: { x: 1283, y: 1103 },
    vertices: [
        { x: 1169, y: 890 },{ x: 1219, y: 1001 }, { x: 1236, y: 1057 }
    ],
    style: { fill:"#EFE648", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 20, organicStrokeThinning:.3, organicStrokeTaper:1 }
  },
  {
    id: 'myRightCLink',
    order: 3,
    parent: 'myLink',
    ratio: 0.17,
    target: { x: 1102, y: 1229 },
    vertices: [
        { x: 1002, y: 924 },{ x: 999, y: 1001 },{ x: 1036, y: 1058 },{ x: 1045, y: 1158 }
    ],
    style: { fill:"#EFE648", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 25, organicStrokeThinning:.3, organicStrokeTaper:1 }
  },
  {
    id: 'myRightDLink',
    order: 2,
    parent: 'myRightCLink',
    ratio: 0.17,
    target: { x: 1079, y: 1052 },
    vertices: [
        { x: 1036, y: 955 },{ x: 1079, y: 1015 }
    ],
    style: { fill:"#EFE648", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 20, organicStrokeThinning:.3, organicStrokeTaper:1 }
  },
  {
    id: 'myRightELink',
    order: 3,
    parent: 'myLink',
    ratio: 0.32,
    target: { x: 934, y: 1277 },
    vertices: [
        { x: 897, y: 1101 },{ x: 900, y: 1209 }
    ],
    style: { fill:"#EFE648", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 20, organicStrokeThinning:.3, organicStrokeTaper:1 }
  },
  {
    id: 'myRightFLink',
    order: 2,
    parent: 'myRightELink',
    ratio: 0.37,
    target: { x: 959, y: 1211 },
    vertices: [
        { x: 941, y: 1163 }
    ],
    style: { fill:"#EFE648", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 20, organicStrokeThinning:.3, organicStrokeTaper:1 }
  },
  {
    id: 'mB0Link',
    order: 10,
    source: { x: 1097, y: 506 },
    target: { x: 1491, y: 1294 },
    vertices: [
      { x: 1124, y: 532 },{ x: 1212, y: 517 },{x:1331,y:510},{x:1443,y:576},{ x: 1541, y: 674 }, { x: 1611, y: 786 },{ x: 1654, y: 895 },{x:1657,y:1007},
        {x:1632,y:1109},{x:1569,y:1214}
    ],
    style: { fill:"#3679BD", stroke: '#000000', strokeWidth:1, organicStrokeSize: 50, organicStrokeThinning:.3, organicStrokeTaper:0,organicStrokeStartCap: false }
  },
  {
    id: 'mB0LinkChild01',
    order: 3,
    parent: 'mB0Link',
    ratio: 0.15,
    target: { x: 1297, y: 440 },
    style: { fill:"#3679BD", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 25, organicStrokeThinning:0.8}
  },
  {
    id: 'mB0LinkChild1',
    order: 3,
    parent: 'mB0Link',
    ratio: 0.1,
    target: { x: 1305, y: 1016 },
    vertices: [
        { x: 1273, y: 573 },{ x: 1289, y: 637 },{ x: 1273, y: 730 },{ x: 1261, y: 782 },{ x: 1273, y: 871 },{ x: 1305, y: 931 }
    ],
    style: { fill:"#6CBE47", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 20, organicStrokeThinning:.3, organicStrokeTaper:1 }
  },
  {
    id: 'mB0LinkChild2',
    order: 2,
    parent: 'mB0LinkChild1',
    ratio: 0.4,
    target: { x: 1362, y: 847 },
    vertices: [
        { x: 1305, y: 806 }
    ],
    style: { fill:"#6CBE47", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 20, organicStrokeThinning:.3, organicStrokeTaper:1 }
  },
  {
    id: 'mB0LinkChild3',
    order: 3,
    parent: 'mB0Link',
    ratio: 0.2,
    target: { x: 1382, y: 1012 },
    vertices: [
        { x: 1378, y: 597 },{ x: 1426, y: 677 },{ x: 1439, y: 758 },{ x: 1430, y: 851 },{ x: 1430, y: 935 }
    ],
    style: { fill:"#3679BD", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 25, organicStrokeThinning:.3, organicStrokeTaper:1 }
  },
  {
    id: 'mB0LinkChild4',
    order: 2,
    parent: 'mB0LinkChild3',
    ratio: 0.5,
    target: { x: 1515, y: 891 },
    vertices: [
        { x: 1463, y: 790 },{ x: 1479, y: 851 }
    ],
    style: { fill:"#3679BD", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 25, organicStrokeThinning:.3, organicStrokeTaper:1 }
  },
  {
    id: 'mB0LinkChild5',
    order: 3,
    parent: 'mB0Link',
    ratio: 0.58,
    target: { x: 1354, y: 1113 },
    vertices: [
        { x: 1620, y: 859 },{ x: 1576, y: 935 },{ x: 1527, y: 996 },{ x: 1475, y: 1012 },{ x: 1430, y: 1080 },{ x: 1394, y: 1113 }
    ],
    style: { fill:"#3679BD", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 25, organicStrokeThinning:.3, organicStrokeTaper:1 }
  },
  {
    id: 'mB0LinkChild6',
    order: 2,
    parent: 'mB0LinkChild5',
    ratio: 0.5,
    target: { x: 1471, y: 1101 },
    vertices: [
        { x: 1515, y: 1024 },{ x: 1503, y: 1072 }
    ],
    style: { fill:"#3679BD", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 25, organicStrokeThinning:.3, organicStrokeTaper:1 }
  },
  {
    id: 'mB0LinkChild7',
    order: 3,
    parent: 'mB0Link',
    ratio: 0.74,
    target: { x: 1334, y: 1246 },
    vertices: [
        { x: 1620, y: 1048 },{ x: 1531, y: 1137 },{ x: 1402, y: 1181 }
    ],
    style: { fill:"#3679BD", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 25, organicStrokeThinning:.3, organicStrokeTaper:1 }
  },
  {
    id: 'mB0LinkChild8',
    order: 2,
    parent: 'mB0LinkChild7',
    ratio: 0.4,
    target: { x: 1503, y: 1205 },
    vertices: [
        { x: 1531, y: 1161 }
    ],
    style: { fill:"#3679BD", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 25, organicStrokeThinning:.3, organicStrokeTaper:1 }
  },
];
//const sortedConfig = [...branchConfig].sort((a, b) => a.order - b.order);
const createdLinks = {};
const cells = [];

branchConfig.forEach(cfg => {

  // Build source
  let source;

  if (cfg.parent) {
    source = {
      id: createdLinks[cfg.parent].id,
      anchor: {
        name: 'connectionRatio',
        args: { ratio: cfg.ratio ?? 0 }
      }
    };
  } else {
    source = cfg.source;
  }
const lineAttrs = {
  ...(cfg.style?.fill !== undefined && { fill: cfg.style.fill }),
  ...(cfg.style?.stroke !== undefined && { stroke: cfg.style.stroke }),
  ...(cfg.style?.strokeWidth !== undefined && { strokeWidth: cfg.style.strokeWidth }),
  ...(cfg.style?.organicStrokeSize !== undefined && { organicStrokeSize: cfg.style.organicStrokeSize }),
  ...(cfg.style?.organicStrokeThinning !== undefined && { organicStrokeThinning: cfg.style.organicStrokeThinning }),
  ...(cfg.style?.organicStrokeTaper !== undefined && { organicStrokeTaper: cfg.style.organicStrokeTaper }),
  ...(cfg.style?.organicStrokeStartCap !== undefined && { organicStrokeStartCap: cfg.style.organicStrokeStartCap })
};
  const link = new Branch({
    source,
    target: cfg.target,
    vertices: cfg.vertices || [],
    ...(Object.keys(lineAttrs).length && {
        attrs: { line: lineAttrs }
    })
  });
if(cfg.order) {
    //link.toFront();
    link.set('z', cfg.order);
}
  createdLinks[cfg.id] = link;
  cells.push(link);
});
const region = new joint.shapes.custom.Region({
    position: { x: 0, y: 0 },
});
graph.addCells([region]);
graph.addCells(cells);
// graph.addCells([
//     region,
//     mpLink,
//     myLeftLink,
//     myRightLink,
//     myLink,
//     myLeftBLink,
//     myRightBLink
//     // rootLink,
//     // outerLink,
//     // outerLink2,
//     // outerLink3,
//     // outerLink4
// ]);
// Fit the content of the paper to the viewport.
// ---------------------------------------------
paper.transformToFitContent({
    //contentArea: { x: 0, y: 0, width: 2000, height: 2000 },
    horizontalAlign: 'middle',
    verticalAlign: 'middle',
    //padding: 50,
    useModelGeometry: true,
});
// function ensureToolsLayerOnTop(paper) {
//     const svg = paper.svg;
//     const toolsLayer = svg.querySelector('.joint-tools-layer');

//     if (toolsLayer) {
//         svg.appendChild(toolsLayer); // move to end → always on top
//     }
// }
// paper.on('render:done', function () {
//     ensureToolsLayerOnTop(paper);
// });
function refreshPaper() {
    if (!paper) return;

    // Force update of all views
    paper.model.getCells().forEach(cell => {
        const view = paper.findViewByModel(cell);
        if (view) view.update();
    });
}
hideAllLinkLabels();
setTimeout(() => {
    paper.unfreeze();
}, 0);
