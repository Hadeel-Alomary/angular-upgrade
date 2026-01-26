interface CanvasRenderingContext2D{
    // scxApplyStrokeTheme(theme: IStrokeTheme): CanvasRenderingContext2D;
    scxApplyStrokeTheme(theme: any): CanvasRenderingContext2D;

    // scxApplyFillTheme(theme: IFillTheme): CanvasRenderingContext2D;
    scxApplyFillTheme(theme: any): CanvasRenderingContext2D;

    // scxApplyTextTheme(theme: ITextTheme): CanvasRenderingContext2D;
    scxApplyTextTheme(theme: any): CanvasRenderingContext2D;

    // scxFill(theme: IFillTheme, force?: boolean): CanvasRenderingContext2D;
    scxFill(theme: any, force?: boolean): CanvasRenderingContext2D;

    // scxStroke(theme: IStrokeTheme, force?: boolean): CanvasRenderingContext2D;
    scxStroke(theme: any, force?: boolean): CanvasRenderingContext2D;

    // scxFillStroke(fillTheme: IFillTheme, strokeTheme: IStrokeTheme): CanvasRenderingContext2D;
    scxFillStroke(fillTheme: any, strokeTheme: any): CanvasRenderingContext2D;

    // scxStrokePolyline(points: IPoint[], theme: IStrokeTheme): CanvasRenderingContext2D;
    scxStrokePolyline(points: any[], theme: any): CanvasRenderingContext2D;

    // scxStrokePolyline(points: IPoint[], theme: IFillTheme): CanvasRenderingContext2D;
    scxFillPolyLine(points:any[], theme:any):CanvasRenderingContext2D;

    // scxRounderRectangle(bounds: IRect, radius: number): CanvasRenderingContext2D;
    scxRounderRectangle(bounds: any, radius: number): CanvasRenderingContext2D;

    // scxDrawAntiAliasingLine(point1: IPoint, point2: IPoint): CanvasRenderingContext2D;
    scxDrawAntiAliasingLine(point1: any, point2: any): CanvasRenderingContext2D;

    // scxDrawArrow(point:IPoint, radians:number, width:number, height:number):CanvasRenderingContext2D;
    scxDrawArrow(point:any, radians:number, width:number, height:number):CanvasRenderingContext2D;
}