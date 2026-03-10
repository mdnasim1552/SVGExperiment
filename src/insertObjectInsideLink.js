import * as addNoteToElement from './addNoteToElement.js';
export function insertUpBottomStroke(link,ratio,graph, paper,joint) {
    graph.startBatch();

    const linkView = paper.findViewByModel(link);
    if (!linkView) return;
    const upBottomStrokeShape = new joint.shapes.custom.UpBottomStroke();

    upBottomStrokeShape.set('linkAttachment', {
        linkId: link.id,
        ratio,
        lengthPercent:10, // default to 10% of link length, can be adjusted
        heightPercent:50
    });

    graph.addCell(upBottomStrokeShape);  
    updateUpBottomStrokeShape(upBottomStrokeShape, graph, paper);
    addNoteToElement.addNoteToElement(graph,paper,joint,upBottomStrokeShape);
    graph.stopBatch();
    linkView.removeTools();

}
export function updateUpBottomStrokeShape(upBottomStrokeShape, graph, paper) {

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
    const segments = 10;

    const lengthPercent = attachment.lengthPercent || 10;
    const heightPercent = attachment.heightPercent || 50;

    const baseHeight = 30;
    const thinning = link.attr('line/organicStrokeThinning') || 0;

    let organicSize = link.attr('line/organicStrokeSize') || baseHeight;

    if (thinning !== 0) {
        organicSize =
            organicSize +
            (organicSize + (link.attr('line/strokeWidth') || 2)) / 2;
    }

    const shapeLength = (lengthPercent / 100) / 2;
    const step = shapeLength / segments;

    const safeRatio = Math.max(
        shapeLength,
        Math.min(1 - shapeLength, ratio)
    );

    const topPoints = [];
    const bottomPoints = [];

    let avgStroke = 0;
    let count = 0;

    for (let i = -segments; i <= segments; i++) {

        const r = safeRatio + i * step;

        const p = connection.pointAt(r);
        if (!p) continue;

        const delta = step / 2;

        const before = connection.pointAt(Math.max(0, r - delta));
        const after = connection.pointAt(Math.min(1, r + delta));

        if (!before || !after) continue;

        const dx = after.x - before.x;
        const dy = after.y - before.y;

        const len = Math.sqrt(dx * dx + dy * dy);
        if (!len) continue;

        const perpX = -dy / len;
        const perpY = dx / len;

        // thinning along link
        const thinningFactor = (1 - thinning * r);
        const localSize = organicSize * thinningFactor;

        // stroke thickness
        const strokeWidth = (heightPercent / 100) * localSize / 2;

        // keep stroke fully inside link
        const offset = (localSize - strokeWidth) / 2;

        topPoints.push(`${p.x + perpX * offset},${p.y + perpY * offset}`);
        bottomPoints.unshift(`${p.x - perpX * offset},${p.y - perpY * offset}`);

        avgStroke += strokeWidth;
        count++;
    }

    if (!topPoints.length || !bottomPoints.length) return;

    const fillD = `M ${topPoints.join(' L ')} L ${bottomPoints.join(' L ')} Z`;
    const topD = `M ${topPoints.join(' L ')}`;
    const bottomD = `M ${bottomPoints.join(' L ')}`;

    const finalStrokeWidth = avgStroke / count;

    const color = link.attr('line/fill');

    upBottomStrokeShape.attr({
        fillBody: {
            d: fillD,
            fill: color,
            stroke: color
        },
        topPath: {
            d: topD,
            stroke: 'yellow',
            strokeWidth: finalStrokeWidth
        },
        bottomPath: {
            d: bottomD,
            stroke: 'yellow',
            strokeWidth: finalStrokeWidth
        }
    });
}
export function insertWormOnLink(link,ratio,color,graph, paper,joint) {
    graph.startBatch();
    const linkView = paper.findViewByModel(link);
    if (!linkView) return;   
    const worm = new joint.shapes.custom.Worm();
    worm.attr('body/fill', color);
    worm.set('linkAttachment', {
        linkId: link.id,
        ratio,
        lengthPercent:10, // default to 10% of link length, can be adjusted
        heightPercent:50,
    });

    graph.addCell(worm);
    updateWormShape(worm, graph, paper);
    addNoteToElement.addNoteToElement(graph,paper,joint,worm);
    graph.stopBatch();
    linkView.removeTools();
}
export function updateWormShape(worm,graph,paper) {

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
    const lengthPercent = attachment.lengthPercent || 10;
    const heightPercent = attachment.heightPercent || 50;
    const totalLength = connection.length();
    //const wormLength = pixelLength / totalLength; // convert px to ratio 
    const wormLength = (lengthPercent / 100) / 2;
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
export function insertRectangleOnLink(link,ratio,x,y,graph, paper,Rectangle,joint,isRestoring) {
    graph.startBatch();
    const linkView = paper.findViewByModel(link);
    if (!linkView) return;
    const rect = new Rectangle({
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
    updateRectanglePosition(rect, graph, paper,joint,isRestoring);
    graph.stopBatch();
}
export function updateRectanglePosition(rect, graph, paper, joint, isRestoring) {

      const attachment = rect.get('linkAttachment');
    if (!attachment) return;

    const link = graph.getCell(attachment.linkId);
    if (!link) return;

    const linkView = paper.findViewByModel(link);
    if (!linkView) return;

    const connection = linkView.getConnection();
    if (!connection || typeof connection.length !== 'function' || connection.length() === 0) return;
    const totalLength = connection.length();
    if (!totalLength) return;

    // 🔹 Use let so ratio can be adjusted
    let ratio = attachment.ratio;

    // // 🔹 Ensure no overlap with other rectangles on same link
    // const existingRects = graph.getElements().filter(el => {
    //     const a = el.get('linkAttachment');
    //     return a && a.linkId === link.id && el.id !== rect.id;
    // });

    // const minDistance = rect.size().width / totalLength; // minimum spacing along link

    // existingRects.forEach(el => {
    //     const r = el.get('linkAttachment').ratio;
    //     if (Math.abs(r - ratio) < minDistance) {
    //         if (ratio < r) ratio = r - minDistance;
    //         else ratio = r + minDistance;
    //     }
    // });

    // ratio = Math.max(0, Math.min(1, ratio)); // clamp between 0 and 1

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
