import Victor from 'victor';

export default {
    global: {
        width: 800,
        height: 600,
        gravity: new Victor(0, 0.2),
    },
    dirt: {
        baseline: 0.5,
        wiggle: 0.05,
        soil: {
            grass: { color: 0x50ff50, amount: 1 },
            topSoil: { color: 0xcd8500, amount: 4 },
            soil: { color: 0x632b00, amount: 8 },
            deepSoil: { color: 0x311500, amount: 16 },
        },
        size: 4,
        gravity: 256, // in pixels per second, constant
    },
    tank: {
        playerStartPos: 0.2, // as a float across the whole width
        size: new Victor(40, 20),
    },
    localStorageController: {
        namespace: 'HyperTanksGame',
    },
} as const;
