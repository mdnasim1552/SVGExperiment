export function splitLinkWithChildren(linkView, coloredSegmentIndex, color, Branch) {
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

export function splitLinkAtPointWithRectangle(linkView, x,y,paper, Branch,Rectangle) {

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
    
    const rect = new Rectangle();

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