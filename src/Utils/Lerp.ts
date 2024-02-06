import Victor from 'victor';

export const lerp = (start: number, end: number, amt: number) => {
    return (1 - amt) * start + amt * end;
};

export const lerp2d = (
    start: { x: number; y: number },
    end: { x: number; y: number },
    amt: number
): Victor => {
    start.x = lerp(start.x, end.x, amt);
    start.y = lerp(start.y, end.y, amt);
    return new Victor(start.x, start.y);
};
