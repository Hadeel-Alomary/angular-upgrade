declare function parseBigInt(str: any, r: any): any;
declare function linebrk(s: any, n: any): string;
declare function byte2Hex(b: any): any;
declare function pkcs1pad2(s: any, n: any): any;
//declare function RSAKey(): void;
declare class RSAKey {
    n: any;
    e: number;
    d: any;
    p: any;
    q: any;
    dmp1: any;
    dmq1: any;
    coeff: any;
    doPublic: typeof RSADoPublic;
    setPublic: typeof RSASetPublic;
    encrypt: typeof RSAEncrypt;


    //RSASetPublic(N: any, E: any): void;
}


declare function RSASetPublic(N: any, E: any): any;
/*declare class RSASetPublic {
    constructor(N: any, E: any);
    n: any;
    e: number;
}*/
declare function RSADoPublic(x: any): any;
declare function RSAEncrypt(text: any): any;
