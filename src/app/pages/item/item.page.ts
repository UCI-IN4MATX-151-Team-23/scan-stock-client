import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Item } from 'src/app/data/item';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {

  items$ = new BehaviorSubject<Item[]>([]);

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.onItemRefresh();
  }

  onItemRefresh() {
    this.dataService.getItems().then((data) => {
      this.items$.next(data);
    });
  }

  async onAddItem() {
    await this.dataService.addItem();
    this.onItemRefresh();
  }

  trackByItem(index: number, item: any) {
    return item;
  }

}
