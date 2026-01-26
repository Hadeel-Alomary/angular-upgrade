declare namespace Slick {
    export class AutoColumnSize extends Slick.Plugin<null>{
        constructor(initialAutosize?: boolean);
        public resizeAllColumns(): void;
    }
}
