import { getStroke } from 'perfect-freehand';
import * as joint from '@joint/core';
import * as regionConstraints from './regionConstraints.js';
import * as branchFactory from './branchFactory.js';
import * as insertObjectInsideLink from './insertObjectInsideLink.js';
import * as splitLinkAndInertObject from './splitLinkAndInertObject.js';
import * as restoreFromSnapshot from './restoreFromSnapshot.js';
import * as addNoteToElement from './addNoteToElement.js';
import './styles.css';
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
                d: 'M 561 27 C 523 95 510 153 548 270 C 553 305 556 355 544 412 C 529 442 498 471 466 505 C 414 557 388 597 365 636 C 339 682 312 725 297 772 C 279 820 262 871 259 921 C 254 976 253 1033 263 1085 C 279 1192 321 1255 355 1333 C 383 1392 423 1444 458 1496 C 491 1557 547 1621 604 1672 C 649 1706 694 1770 746 1812 C 765 1833 791 1850 834 1878 C 859 1896 912 1908 965 1906 C 1068 1891 1121 1859 1147 1848 C 1221 1815 1277 1779 1322 1729 C 1373 1681 1445 1596 1482 1524 C 1526 1440 1556 1377 1567 1333 C 1577 1300 1566 1285 1587 1257 C 1589 1245 1662 1157 1677 1088 C 1696 1027 1691 936 1671 852 C 1640 775 1611 715 1538 629 C 1493 582 1448 535 1393 495 C 1340 451 1283 401 1248 324 C 1227 259 1214 156 1224 28',
                fill: '#ffffff',
                stroke: '#000',
                strokeWidth: 5,
                pointerEvents: 'none'
            },
            area2: {
                d: 'M 1070 514 L 1077 522 L 1116 489 L 1103 468 L 1098 434 L 1024 429 L 991 420 z M 648 27 C 625 105 623 181 637 255 C 649 329 684 391 719 450 C 740 490 719 542 728 571 C 750 638 815 652 838 648 C 893 639 938 592 936 565 C 946 606 985 626 1036 583 C 1059 561 1074 535 1066 509 C 1041 479.3333 1016 449.6667 991 420 C 956 398 955 364 960 322',
                fill: '#ffffff',
                stroke: '#000',
                strokeWidth: 5,
                pointerEvents: 'none'
            },
            area3: {
                d: 'M 888 629 C 901 695 993 651 980 607',
                fill: '#ffffff',
                stroke: '#000',
                strokeWidth: 5,
                pointerEvents: 'none'
            },
            area4: {
                d: 'M 1070 514 L 1077 522 L 1116 489 L 1103 468 L 1098 434 L 1024 429 L 991 420 z',
                fill: '#ED2E24',
                stroke: '#000',
                strokeWidth: 5,
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
const region = new joint.shapes.custom.Region({
    position: { x: 0, y: 0 },
    z: -1,
});
const regionBBox = region.getBBox();
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
        size: { width: 220, height: 120 },

        attrs: {
            body: {
                refWidth: '100%',
                refHeight: '100%',
                fill: '#fffbe6',
                stroke: '#333',
                rx: 10,
                ry: 10
            },
            fo: {
                refWidth: '100%',
                refHeight: '100%'
            }
        },

        markup: [
            {
                tagName: 'rect',
                selector: 'body'
            },
            {
                tagName: 'foreignObject',
                selector: 'fo',
                children: [
                    {
                        tagName: 'div',
                        namespaceURI: 'http://www.w3.org/1999/xhtml',
                        selector: 'formContainer',
                        attributes: {
                            class: 'form-note-container',
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
            <div class="FormNoteViewDiv">
                <label>Stenosis:</label>
                <div class="FormNoteViewInnerDiv" joint-selector="heightDiv">
                    <label class="FormNoteViewLable">Height:</label>
                    <input type="number" min="1" max="100" joint-selector="vesselHeightInput"/>
                    <label class="FormNoteViewLable">&nbsp;%</label>
                </div>
                <div class="FormNoteViewInnerDiv" joint-selector="lengthDiv">
                    <label class="FormNoteViewLable">Width:&nbsp;</label>
                    <input type="number" min="1" max="100" joint-selector="vesselLengthInput"/>
                    <label class="FormNoteViewLable">&nbsp;%</label>
                </div>
            </div>
        `;

        const parentId = this.model.get('attachedTo');
        if (parentId) {
            const graph = this.paper.model; // assuming paper is accessible
            const parent = graph.getCell(parentId);
            if (parent && parent.get('type') === 'custom.Worm') {
                const heightDiv = container.querySelector('[joint-selector="heightDiv"]');
                if (heightDiv) heightDiv.style.display = 'none';
            }
        }
        if (!container.dataset.initialized) {
            const lengthInput = container.querySelector('[joint-selector="vesselLengthInput"]');
            const heightInput = container.querySelector('[joint-selector="vesselHeightInput"]');
            lengthInput.value = this.model.get('vesselLengthValue') || '';
            heightInput.value = this.model.get('vesselHeightInput') || '';
            const MAX = 100;
            lengthInput.addEventListener('input', (e) => {
                let value = parseFloat(e.target.value);
                if (!isNaN(value) && value > MAX) {
                    value = MAX;
                    e.target.value = value;
                }
                this.model.set('vesselLengthValue', value);
            });
            heightInput.addEventListener('input', (e) => {
                let value = parseFloat(e.target.value);
                if (!isNaN(value) && value > MAX) {
                    value = MAX;
                    e.target.value = value;
                }
                this.model.set('vesselHeightInput', value);
            });
            container.dataset.initialized = "true";
        }
        requestAnimationFrame(() => {

            const content = container.firstElementChild;

            const width = content.scrollWidth+2;
            const height = content.scrollHeight+2;

            this.model.resize(width, height);

            this.model.attr({
                body: {
                    width: width,
                    height: height
                },
                fo: {
                    width: width,
                    height: height
                }
            });

        });

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
                restoreFromSnapshot.restoreFromSnapshot(graph, op.before,shapeNamespace,joint); // restore manually
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
                restoreFromSnapshot.restoreFromSnapshot(graph, op.after,shapeNamespace,joint); 
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
        insertObjectInsideLink.updateWormShape(element,graph,paper);
    } 
    else if(element.get('type') === 'custom.UpBottomStroke') {
        insertObjectInsideLink.updateUpBottomStrokeShape(element,graph,paper);
    }
    else {
        insertObjectInsideLink.updateRectanglePosition(element,graph,paper,joint,isRestoring);
    }
}
// --- Keyboard shortcuts ---
document.addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    // Undo
    if ((e.ctrlKey || e.metaKey) && key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if(undoStack.length>2){
            undo();
        }
        
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
    if (cell.get('linkAttachment') || cell.get('attachedTo')) return;
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
// ---------------- 5️⃣ Convert Region areas to polygons ----------------
const polygons = [
    regionConstraints.parsePathToPoints(region.attr('area1/d')),
    regionConstraints.parsePathToPoints(region.attr('area2/d')),
    regionConstraints.parsePathToPoints(region.attr('area3/d')),
    regionConstraints.parsePathToPoints(region.attr('area4/d')),
].filter(p => p.length > 0); // ignore empty
graph.on('change:vertices', link => {
    const vertices = link.vertices();
    if (!vertices) return;

    const clamped = vertices.map(v => {
        // If inside any polygon, keep it
        for (let poly of polygons) {
            if (regionConstraints.isPointInPolygon(v.x, v.y, poly)) return v;
        }
        // Outside → snap to nearest polygon edge
        let nearest = null;
        let minDist = Infinity;
        for (let poly of polygons) {
            const [nx, ny] = regionConstraints.snapPointToPolygon(v.x, v.y, poly);
            const d = Math.hypot(v.x - nx, v.y - ny);
            if (d < minDist) {
                minDist = d;
                nearest = [nx, ny];
            }
        }
        return { x: nearest[0], y: nearest[1] };
    });

    link.set('vertices', clamped, { silent: true });

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

        if (curr.range) {

            const { min, max } = curr.range;
            const distance = curr.position?.distance ?? 0;

            const clamped = Math.max(min, Math.min(max, distance));

            if (clamped !== distance) {
                link.label(i, {
                    ...curr,
                    position: {
                        ...curr.position,
                        distance: clamped
                    }
                }, { restricted: true });   // prevent recursion

                return; // stop here — new change:labels will fire
            }
        }

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
                insertObjectInsideLink.updateWormShape(el, graph, paper);
            } 
            else if (el.get('type') === 'custom.UpBottomStroke') {
                insertObjectInsideLink.updateUpBottomStrokeShape(el, graph, paper);
            }
            else {
                insertObjectInsideLink.updateRectanglePosition(el, graph, paper, joint, isRestoring);
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
    const model = elementView.model;
    menuOpen = true;
    showElementMenu({
        x: evt.clientX,
        y: evt.clientY,
        elementView,
        isNote: model.get('isNote') === true
    });
    // const model = elementView.model;

    // if (model.get('type') === 'custom.Worm') {
    //     if (confirm('Delete this worm?')) {
    //         model.remove();
    //     }
    // }
});
const elementMenu = document.getElementById('element-menu');
function showElementMenu({ x, y, elementView, isNote }) {
    const model = elementView.model;
    elementMenu.style.display = 'none';
    const left = x; //- paperRect.left;
    const top = y; //- paperRect.top;
    elementMenu.style.left = left + 'px';
    elementMenu.style.top = top + 'px';

    const deleteBtn = elementMenu.querySelector('[data-action="delete"]');
    const addNoteBtn = elementMenu.querySelector('[data-action="add-note"]');

    if (isNote) {
        // 🔥 Only delete for notes
        deleteBtn.style.display = 'block';
        addNoteBtn.style.display = 'none';
    } else {
        deleteBtn.style.display = 'block';
        addNoteBtn.style.display = 'block';
    }

    elementMenu.style.display = 'block';
    elementMenu.onclick = e => {
        const item = e.target.closest('li');
        if (!item || !elementMenu.contains(item)) return;
        const action = item.dataset.action;
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
                if (model.get('attachedTo')) {
                    const parent = graph.getCell(model.get('attachedTo'));
                    if (parent) {
                        parent.set('attachedNotes', []);
                    }
                }
                model.remove();
            }
        }else if (action === 'add-note') {
            addNoteToElement.addNoteToElement(graph,paper,joint,model,x,y);
        }
        elementMenu.style.display = 'none';
        menuOpen = false;
    };
}
graph.on('change:vesselLengthValue', function(note, value) {
    const elementId = note.get('attachedTo');
    if (!elementId) return;

    const element = graph.getCell(elementId);
    if (!element) return;

    const attachment = element.get('linkAttachment');
    if (!attachment) return;

    element.set('linkAttachment', {
        ...attachment,
        lengthPercent: value
    });
    if (element.isElement() && element.get('type') === 'custom.Worm') {
        insertObjectInsideLink.updateWormShape(element, graph, paper);
    } else if(element.isElement() && element.get('type') === 'custom.UpBottomStroke') {
        insertObjectInsideLink.updateUpBottomStrokeShape(element, graph, paper);
    }
    else {
        insertObjectInsideLink.updateRectanglePosition(element, graph, paper, joint, isRestoring);
    }
});
graph.on('change:vesselHeightInput', function(note, value) {
    const elementId = note.get('attachedTo');
    if (!elementId) return;

    const element = graph.getCell(elementId);
    if (!element) return;

    const attachment = element.get('linkAttachment');
    if (!attachment) return;

    element.set('linkAttachment', {
        ...attachment,
        heightPercent: value
    });
    if (element.isElement() && element.get('type') === 'custom.Worm') {
        insertObjectInsideLink.updateWormShape(element, graph, paper);
    } else if(element.isElement() && element.get('type') === 'custom.UpBottomStroke') {
        insertObjectInsideLink.updateUpBottomStrokeShape(element, graph, paper);
    }
    else {
        insertObjectInsideLink.updateRectanglePosition(element, graph, paper, joint, isRestoring);
    }
});
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
    const segmentIndex = getNearestSegmentIndex(view, paper, evt);
    //if (vertexIndex === -1) return; // Not a vertex
    if (vertexIndex === -1) {      
        if (segmentIndex !== -1) {
            showLinkColorMenu({
                x: evt.clientX,
                y: evt.clientY,
                linkView: view,
                segmentIndex
            });
        }
    } else {
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

        const item = e.target.closest('li');
        if (!item || !colorMenu.contains(item)) return;

        const link = graph.getCell(activeLinkId);
        const color = item.dataset.color;
        const action = item.dataset.action;
        if (!link) return;
        const linkView = paper.findViewByModel(link);
        if (!linkView) return;
        if (color && !action){
            executeWithSnapshot(graph, () => {
                splitLinkAndInertObject.splitLinkWithChildren(linkView, activeSegmentIndex, color, Branch);
            });
            colorMenu.style.display = 'none';
        }else{
            if (!action) return;
            if (action === 'hide-label') {
                hideAllLinkLabels();
            }else if(action === 'show-label') {
                showAllLinkLabels();
            }else if(action==='add-rectangle'){
                insertObjectInsideLink.insertRectangleOnLink(link,x,y,graph,paper,joint.shapes.standard.Rectangle,joint,isRestoring);
            }else if(action==='divide-segment'){                
                executeWithSnapshot(graph, () => {
                    splitLinkAndInertObject.splitLinkAtPointWithRectangle(linkView, x,y,paper,Branch,joint.shapes.standard.Rectangle);
                });
            }else if(action==='add-worm'){ 
                insertObjectInsideLink.insertWormOnLink(link,x,y,color,graph,paper,joint);
            }else if(action==='add-up-bottom-stroke'){
                insertObjectInsideLink.insertUpBottomStroke(link,x,y,graph,paper,joint);
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
        ratio: ratio,
        lengthPercent: attachment.lengthPercent || 10,
        heightPercent: attachment.heightPercent || 10,
    });
    if (element.isElement() && element.get('type') === 'custom.Worm') {
        insertObjectInsideLink.updateWormShape(element, graph, paper);
    } else if(element.isElement() && element.get('type') === 'custom.UpBottomStroke') {
        insertObjectInsideLink.updateUpBottomStrokeShape(element, graph, paper);
    }
    else {
        insertObjectInsideLink.updateRectanglePosition(element, graph, paper, joint, isRestoring);
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
//const cells=branchFactory.buildBranches(Branch);
const { cells, branchConfig } = branchFactory.buildBranches(Branch);

graph.addCells([region]);
graph.addCells(cells);
// cells.forEach(cell => {
//     const cfg = branchConfig.find(c => c.id === cell.id);
//     if (cfg && cfg.order >= 4) {
//         cell.set('z', cfg.order);
//     }
// });
// const myLeftLinkModel = graph.getCell('myLeftBLink');

// if (myLeftLinkModel) {
//     // Set z index on the model
//     myLeftLinkModel.set('z', 0); // higher number = on top
// }
// Recalculate child links safely
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
document.getElementById('saveBtn').addEventListener('click', () => {
    const json = graph.toJSON();
    localStorage.setItem('mySavedDiagram', JSON.stringify(json));
    console.log(json);
    alert('Diagram saved successfully!');
});
document.getElementById('loadBtn').addEventListener('click', () => {
    const savedJSON = localStorage.getItem('mySavedDiagram');
    if (!savedJSON) {
        alert('No saved diagram found.');
        return;
    }
    try {
        const snapshot = JSON.parse(savedJSON);
        executeWithSnapshot(graph, () => {
            restoreFromSnapshot.restoreFromSnapshot(graph, snapshot, shapeNamespace,joint);
        });
        refreshPaper();
        alert('Diagram loaded successfully!');
    } catch (err) {
        console.error(err);
        alert('Failed to load diagram. Check console for errors.');
    }
});
document.getElementById('undoBtn').addEventListener('click', () => {
    if(undoStack.length>2){
        undo();
    }
});
document.getElementById('redoBtn').addEventListener('click', () => {
    redo();
});
hideAllLinkLabels();
setTimeout(() => {
    paper.unfreeze();
}, 0);
