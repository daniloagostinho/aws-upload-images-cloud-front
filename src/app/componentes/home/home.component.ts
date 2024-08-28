import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CloundFrontService } from '../../services/cloud-front.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
  ],
  templateUrl: 'home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  imagensrecentes: { key: string, url: string }[] = [];


  constructor(private cloundFrontService: CloundFrontService) {
  }

  async ngOnInit() {
    try {
      this.imagensrecentes = await this.cloundFrontService.listarImagens();
      console.log("Imagens e URLs geradas:", this.imagensrecentes);
    } catch (error) {
      console.error('Erro ao carregar as imagens:', error);
    }
  }

}
