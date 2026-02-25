// ---------------- 1️⃣ Helper: Point-in-Polygon ----------------
export function isPointInPolygon(x, y, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0], yi = polygon[i][1];
        const xj = polygon[j][0], yj = polygon[j][1];
        const intersect = ((yi > y) !== (yj > y)) &&
                          (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// ---------------- 2️⃣ Helper: Distance between point and segment ----------------
export function closestPointOnSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    if (dx === 0 && dy === 0) return [x1, y1]; // degenerate segment
    const t = ((px - x1) * dx + (py - y1) * dy) / (dx*dx + dy*dy);
    const tClamped = Math.max(0, Math.min(1, t));
    return [x1 + tClamped*dx, y1 + tClamped*dy];
}

// ---------------- 3️⃣ Helper: Snap point to polygon edge ----------------
export function snapPointToPolygon(px, py, polygon) {
    let closest = null;
    let minDist = Infinity;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [cx, cy] = closestPointOnSegment(px, py,
                                               polygon[j][0], polygon[j][1],
                                               polygon[i][0], polygon[i][1]);
        const dist = Math.hypot(px - cx, py - cy);
        if (dist < minDist) {
            minDist = dist;
            closest = [cx, cy];
        }
    }
    return closest;
}

// ---------------- 4️⃣ Helper: Parse SVG Path 'd' to points ----------------
export function parsePathToPoints(d) {
    if (!d) return [];
    const commands = d.match(/[ML][^ML]+/g); // only M/L
    if (!commands) return [];
    return commands.map(cmd => {
        const coords = cmd.slice(1).trim().split(/[\s,]+/);
        return [parseFloat(coords[0]), parseFloat(coords[1])];
    });
}