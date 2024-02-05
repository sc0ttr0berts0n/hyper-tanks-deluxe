import Victor from 'victor';

export default {
    global: {
        width: 800,
        height: 600,
    },
    ParticleStrips: {
        baseline: 0.5,
        wiggle: 0.5,
        soil: {
            grass: { color: 0x50ff50, amount: 1 },
            topSoil: { color: 0xcd8500, amount: 4 },
            soil: { color: 0x632b00, amount: 8 },
            deepSoil: { color: 0x311500, amount: 16 },
        },
        particleSize: 8,
    },
    localStorageController: {
        namespace: 'HyperTanksGame',
    },
} as const;
