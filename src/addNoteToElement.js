function getVisibleArea(paper) {

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
export function addNoteToElement(graph,paper,joint,element,x,y) {
    const existingNotes = element.get('attachedNotes') || [];
    if (existingNotes.length > 0) {
        console.warn('Element already has a note. Skipping.');
        return; // stop here
    }
    const bbox = element.getBBox();
    const visibleArea = getVisibleArea(paper);

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
        noteX = noteX-700;
    }else if(spaces.right<spaces.left){
        noteX = noteX+700;
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
            y: noteY+120 //1050
        },
        //size: { width: noteWidth, height: noteHeight },
        isNote: true,
        vesselLengthValue: element.get('linkAttachment').lengthPercent || 10,
        vesselHeightInput: element.get('linkAttachment').heightPercent || 10,
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