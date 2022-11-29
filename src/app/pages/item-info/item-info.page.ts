import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from 'src/app/data/item';
import { ItemField } from 'src/app/data/item-field';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-item-info',
  templateUrl: './item-info.page.html',
  styleUrls: ['./item-info.page.scss'],
})
export class ItemInfoPage implements OnInit {

  id: number = -1;
  attrs: ItemField[] = [];
  tags: string[] = [];
  qrcode: string | undefined;
  barcode: string | undefined;

  isEditing = false;

  constructor(private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getItem(parseInt(this.route.snapshot.paramMap.get('id') as string))
      .then((data) => {
        if(data == undefined) return;
        this.readFromItem(data);
      });
  }

  trackByData(index: number, data: any): any {
    return data;
  }

  async onEditModeSwitch(): Promise<void> {
    if(this.isEditing) {
      let data = await this.dataService.modifyItem(this.constructItem());
      this.readFromItem(data);
    }
    this.isEditing = !this.isEditing;
  }

  addAttr(): void {
    this.attrs.push(new ItemField('', ''));
  }

  deleteAttr(index: number): void {
    this.attrs.splice(index, 1);
  }


  addTag() {
    this.tags.push('');
  }

  deleteTag(index: number) {
    this.tags.splice(index, 1);
  }

  private readFromItem(item: Item | undefined): void {
    if(item == undefined) {
      this.id = -1;
      this.attrs.splice(0);
      this.tags.splice(0);
      return;
    }
    this.id = item.id;
    this.attrs.splice(0);
    this.attrs.push(...Object.entries(item.attrs).map(([key, value]) => new ItemField(key, (value as any).toString())));
    this.tags.splice(0);
    this.tags.push(...item.tags.sort());
    this.qrcode = item.qrcode;
    this.barcode = item.barcode;
  }

  private constructItem(): Item {
    let newAttrs: any = {};
    this.attrs.forEach((entry) => {
      newAttrs[entry.key] = entry.value;
    });
    let newTags: any = [...new Set(this.tags)].sort();
    return new Item({
      id: this.id,
      attrs: newAttrs,
      tags: newTags
    });
  }

  printQRCode(): void {
    // TODO
  }

  printBarcode(): void {
    // TODO
  }

}
