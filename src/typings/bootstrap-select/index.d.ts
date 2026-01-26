interface JQuery {
    selectpicker(): JQuery;
    selectpicker(options: BootstrapSelect.Options):void;
    selectpicker(method: 'val', key?: string): number|string;
    selectpicker(method: 'refresh'):void;
    selectpicker(method: string): any;
}

declare module BootstrapSelect {
    interface Options {
        container: string;
    }
}
