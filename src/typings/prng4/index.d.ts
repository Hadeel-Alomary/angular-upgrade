declare class Arcfour {
    i: number;
    j: number;
    S: any[];
    init: typeof ARC4init;
    next: typeof ARC4next;
}
declare class ARC4init {
    constructor(key: any);
    i: number;
    j: number;
}
declare class ARC4next {
    i: number;
    j: number;
}
declare function prng_newstate(): Arcfour;
declare var rng_psize: number;
