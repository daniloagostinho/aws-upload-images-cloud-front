import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { S3Client, ListObjectsCommand } from '@aws-sdk/client-s3';
import { S3Service } from '../../services/s3.service';

@Component({
  selector: 'app-view-images',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './view-images.component.html',
  styleUrl: './view-images.component.scss',
})
export class ViewImagesComponent {
  imagens: { key: string, url: string }[] = [];
  isModalOpen: boolean = false;
  selectedImageUrl: string | null = null;
  isDetailsModalOpen = false;
  selectedImage: any = null;

  constructor(private s3Service: S3Service) { }

  async ngOnInit() {
    try {
      this.imagens = await this.s3Service.listarImagens();
      console.log("Imagens e URLs geradas:", this.imagens);
    } catch (error) {
      console.error('Erro ao carregar as imagens:', error);
    }
  }
  openModal(url: string) {
    this.selectedImageUrl = url;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedImageUrl = null;
  }

  openDetailsModal(imagem: any) {
    const extension = imagem.key.split('.').pop()?.toUpperCase();
    imagem.format = extension || 'Desconhecido';
    this.selectedImage = imagem;

    console.log("selectedImage --->> ", imagem);
    this.isDetailsModalOpen = true;
  }

  closeDetailsModal() {
    this.isDetailsModalOpen = false;
    this.selectedImage = null;
  }
}
