export class Item {
    
    id: number;
    attrs: any;
    tags: string[];
    qrcode: string | undefined;
    barcode: string | undefined;

    constructor(data: any) {
        this.id = data.id;
        this.attrs = data.attrs;
        this.tags = data.tags;
        this.qrcode = data?.qrcode;
        this.barcode = data?.barcode;
    }
}
