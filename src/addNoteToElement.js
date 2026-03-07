function isOverlapping(rect1, rect2) {
    return !(
        rect1.x + rect1.width <= rect2.x ||
        rect1.x >= rect2.x + rect2.width ||
        rect1.y + rect1.height <= rect2.y ||
        rect1.y >= rect2.y + rect2.height
    );
}
function getExistingNoteRects(graph) {
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
export function addNoteToElement(graph,paper,joint,element) {
    const existingNotes = element.get('attachedNotes') || [];
    if (existingNotes.length > 0) {
        console.warn('Element already has a note. Skipping.');
        return; // stop here
    }

    const noteWidth = 350;
    const noteHeight = 150;

    let noteX=0, noteY=0;

    const elementslink = graph.getCell(element.get('linkAttachment').linkId);
    const linkView = paper.findViewByModel(elementslink);
    const point = linkView.getPointAtRatio(element.get('linkAttachment').ratio);
    const x = point.x;
    const y = point.y;
    if(x>=900){
        noteX=1800
    }else{
        noteX=-200
    }
    let newRect = {
        x: noteX,
        y: noteY,
        width: noteWidth,
        height: noteHeight
    };
    const existingRects = getExistingNoteRects(graph);
    while (
        existingRects.some(r => isOverlapping(newRect, r))
    ) {
        newRect.y += 10; // shift downward
    }
    noteY = newRect.y;
    const note = new joint.shapes.custom.FormNote({
       position: {
            x: noteX, //x + element.size().width + 20,//40
            y: noteY
        },
        //size: { width: noteWidth, height: noteHeight },
        isNote: true,
        vesselLengthValue: element.get('linkAttachment').lengthPercent || 10,
        vesselHeightInput: element.get('linkAttachment').heightPercent || 50,
    });
    note.set('attachedTo', element.id);
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