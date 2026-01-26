/* tslint:disable */

declare module Detectizr {
    interface Device {
        type: String;
    }

    function detect(params: any):void;
    var device: Device
}
