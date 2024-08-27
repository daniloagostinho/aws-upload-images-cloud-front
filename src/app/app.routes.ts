import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { ViewImagesComponent } from './componentes/view-images/view-images.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'ver-imagens', component: ViewImagesComponent},
];
