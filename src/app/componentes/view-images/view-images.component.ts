import { CommonModule } from '@angular/common';
import {Component } from '@angular/core';
import { S3Client, ListObjectsCommand } from '@aws-sdk/client-s3';

@Component({
  selector: 'app-view-images',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl:'./view-images.component.html',
  styleUrl: './view-images.component.scss',
})
export class ViewImagesComponent {
  bucketName = 'minha-aplicacao-upload-imagens';
  s3Client: S3Client;
  imagens: { key: string, url: string }[] = [];
  isModalOpen: boolean = false;
  selectedImageUrl: string | null = null;
  isDetailsModalOpen = false;
  selectedImage: any = null;

  constructor() {
    this.s3Client = new S3Client({
      region: 'sa-east-1',
      credentials: {
        accessKeyId: 'AKIAYCO62F54H5FXS3MR',
        secretAccessKey: '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'
      }
    });
  }

  async ngOnInit() {
    try {
      const listCommand = new ListObjectsCommand({
        Bucket: this.bucketName
      });

      const response = await this.s3Client.send(listCommand);

      if (response.Contents) {
        this.imagens = response.Contents.map(item => ({
          key: item.Key || '',
          url: `https://${this.bucketName}.s3.sa-east-1.amazonaws.com/${item.Key}`
        }));
        console.log("Imagens e URLs geradas:", this.imagens);
      } else {
        console.log("Nenhuma imagem encontrada.");
      }

    } catch (error) {
      console.error('Erro ao listar objetos no S3:', error);
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
