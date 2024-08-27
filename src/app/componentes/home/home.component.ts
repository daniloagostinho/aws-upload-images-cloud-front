import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { S3Service } from '../../services/s3.service';


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


  constructor(private s3Service: S3Service) {
  }

  async ngOnInit() {
    try {
      this.imagensrecentes = await this.s3Service.listarImagens();
      console.log("Imagens e URLs geradas:", this.imagensrecentes);
    } catch (error) {
      console.error('Erro ao carregar as imagens:', error);
    }
  }

}
