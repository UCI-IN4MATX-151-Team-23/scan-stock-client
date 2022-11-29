import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'item',
        loadChildren: () => import('../pages/item/item.module').then(m => m.ItemPageModule)
      },
      {
        path: 'item/:id',
        loadChildren: () => import('../pages/item-info/item-info.module').then(m => m.ItemInfoPageModule)
      },
      {
        path: 'tag',
        loadChildren: () => import('../pages/tag/tag.module').then(m => m.TagPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/item',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/item',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
