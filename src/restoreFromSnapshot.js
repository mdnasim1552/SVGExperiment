// function restoreFromSnapshot(graph, snapshot, shapeNamespace) {
//     if (!snapshot || !snapshot.cells) return;
    
//     // 1️⃣ Clear current graph
//     graph.clear();
//     const cells = [];
//     const cellsMap = new Map(); // ID -> cell

//     // 2️⃣ Recreate all elements and links
//     snapshot.cells.forEach(data => {
//         let cell;
//             // Element: use correct class from shapeNamespace
//         const ElementClass = shapeNamespace[data.type];
//         if (!ElementClass) {
//             switch (data.type) {
//                 case 'standard.Rectangle':
//                     cell = new joint.shapes.standard.Rectangle(data);
//                     break;
//                 case 'standard.Circle':
//                     cell = new joint.shapes.standard.Circle(data);
//                     break;
//                 case 'standard.Ellipse':
//                     cell = new joint.shapes.standard.Ellipse(data);
//                     break;
//                 case 'custom.Region':
//                     cell = new joint.shapes.custom.Region(data);
//                     break;
//                 case 'custom.Worm':
//                     cell=new joint.shapes.custom.Worm(data);
//                     break;
//                 case 'custom.UpBottomStroke':
//                     cell=new joint.shapes.custom.UpBottomStroke(data);
//                     break;
//                 case 'custom.FormNote':
//                     cell=new joint.shapes.custom.FormNote(data);
//                     break;
//                 case 'standard.Link':
//                     cell=new joint.shapes.standard.Link(data);
//                     break;
//                 default:
//                     //console.warn(`Shape class "${data.type}" not found. Using joint.dia.Element as fallback.`);
//                     //cell = new (ElementClass || joint.dia.Element)(data);
//                     return;
//             }
//         }else{
//             cell = new ElementClass(data);
//         }
//         // if (data.z != null) {
//         //     cell.set('z', data.z, { silent: true });
//         // }
//         //graph.addCell(cell);
//         cells.push(cell);
//         cellsMap.set(data.id, cell);
//     });
//     graph.addCells(cells);
//     // 3️⃣ Restore vertices and labels
//     // 4️⃣ Restore source and target
//     graph.getLinks().forEach(link => {
//         const data = snapshot.cells.find(c => c.id === link.id);
//         if (!data) return;

//         link.set({
//             vertices: (data.vertices || []).map(v => ({ ...v })),
//             labels: (data.labels || []).map(l => ({ ...l })),
//             source: { ...data.source },
//             target: { ...data.target }
//         });
//     });

//     // 5️⃣ Restore z-index
//     graph.getCells().forEach(cell => {
//         const data = snapshot.cells.find(c => c.id === cell.id);
//         if (data && data.z != null) {
//             cell.set('z', data.z);
//         }
//     });

//     // 6️⃣ Reattach child links to parent links
//     // graph.getLinks().forEach(link => {
//     //     const data = snapshot.cells.find(c => c.id === link.id);
//     //     if (!data) return;

//     //     const children = snapshot.cells.filter(c => c.source && c.source.id === link.id);
//     //     children.forEach(childData => {
//     //         const child = cellsMap.get(childData.id);
//     //         if (child) {
//     //             child.set('source', { id: link.id, anchor: childData.source.anchor });
//     //         }
//     //     });
//     // });
//     snapshot.cells.forEach(data => {
//         if (!data.source?.id) return;
//         const parent = cellsMap.get(data.source.id);
//         const child = cellsMap.get(data.id);
//         if (parent && child) {
//             child.set('source', { id: parent.id, anchor: data.source.anchor });
//         }
//     });
// }
export function restoreFromSnapshot(graph, snapshot, shapeNamespace,joint) {
    if (!snapshot?.cells?.length) return;

    graph.clear();
    const cellsMap = new Map();
    const links = [];
    const elements = [];
    const linkDataMap = new Map();

    // 1️⃣ Create all cells
    snapshot.cells.forEach(data => {
        linkDataMap.set(data.id, data);
        let cell;
        const ElementClass = shapeNamespace[data.type];

        if (ElementClass) {
            cell = new ElementClass(data);
        } else {
            switch (data.type) {
                case 'standard.Rectangle': cell = new joint.shapes.standard.Rectangle(data); break;
                case 'standard.Circle': cell = new joint.shapes.standard.Circle(data); break;
                case 'standard.Ellipse': cell = new joint.shapes.standard.Ellipse(data); break;
                case 'custom.Region': cell = new joint.shapes.custom.Region(data); break;
                case 'custom.Worm': cell = new joint.shapes.custom.Worm(data); break;
                case 'custom.UpBottomStroke': cell = new joint.shapes.custom.UpBottomStroke(data); break;
                case 'custom.FormNote': cell = new joint.shapes.custom.FormNote(data); break;
                case 'standard.Link': cell = new joint.shapes.standard.Link(data); break;
                default: return;
            }
        }

        cellsMap.set(data.id, cell);
        if (cell.isLink?.()) links.push(cell);
        else elements.push(cell);
    });

    // 2️⃣ Add all elements and links to the graph
    graph.addCells([...elements, ...links]);

    // 3️⃣ Restore vertices, labels, and absolute target
    links.forEach(link => {
        const data = linkDataMap.get(link.id);
        if (!data) return;

        link.set({
            vertices: (data.vertices || []).map(v => ({ ...v })),
            labels: (data.labels || []).map(l => ({ ...l })),
            target: { ...data.target }
        }, { silent: true });
    });

    // 4️⃣ Restore source as absolute coordinates first to prevent displacement
    links.forEach(link => {
        const data = linkDataMap.get(link.id);
        if (!data || !data.source) return;

        if (data.source.id) {
            const parent = cellsMap.get(data.source.id);
            if (parent) {
                const parentVertices = parent.get('vertices') || [];
                const ratio = data.source.anchor?.args?.ratio ?? 0;

                // Compute absolute point along parent path
                let absPoint;
                if (parentVertices.length > 0) {
                    const idx = Math.floor(ratio * (parentVertices.length - 1));
                    absPoint = parentVertices[idx];
                } else {
                    const pos = parent.position?.() || { x: 0, y: 0 };
                    absPoint = { x: pos.x, y: pos.y };
                }

                link.set('source', { x: absPoint.x, y: absPoint.y }, { silent: true });
            }
        } else {
            link.set('source', { ...data.source }, { silent: true });
        }
    });

    // 5️⃣ Reattach child links using original anchor info
    snapshot.cells
        .filter(c => c.source?.id)
        .forEach(data => {
            const parent = cellsMap.get(data.source.id);
            const child = cellsMap.get(data.id);
            if (parent && child) {
                // Now attach child using connectionRatio after absolute positioning
                child.set('source', { id: parent.id, anchor: data.source.anchor });
            }
        });

    // 6️⃣ Restore z-index
    snapshot.cells
        .filter(c => c.z != null)
        .sort((a, b) => (a.z || 0) - (b.z || 0))
        .forEach(data => {
            const cell = cellsMap.get(data.id);
            if (cell) cell.set('z', data.z);
        });

    // 7️⃣ Force update all views
    graph.getCells().forEach(cell => {
        const view = graph.paper?.findViewByModel(cell);
        if (view) view.update();
    });
}