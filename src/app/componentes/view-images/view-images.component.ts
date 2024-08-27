import { CommonModule, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { S3Client, ListObjectsCommand, GetObjectCommand } from '@aws-sdk/client-s3';

@Component({
  selector: 'app-view-images',
  standalone: true,
  imports: [
    CommonModule,
    NgIf
  ],
  template: `
<div class="max-w-7xl mx-auto py-8 px-4">
  <h1 class="text-3xl font-bold text-center mb-8">Galeria de Imagens</h1>

  <div *ngIf="imagens.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  <div *ngFor="let imagem of imagens" class="group relative">
    <!-- Imagem -->
    <img [src]="imagem.url" alt="{{ imagem.key }}" class="w-full h-64 object-cover rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105" />

    <!-- Link de Visualização sobre a Imagem -->
    <a (click)="openModal(imagem.url)"
       class="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100">
      <span class="bg-black bg-opacity-60 text-white text-lg font-semibold px-4 py-2 rounded-lg cursor-pointer">
        Visualizar
      </span>
    </a>
  </div>
</div>


  <div *ngIf="imagens.length === 0" class="text-center text-gray-600">
    Nenhuma imagem encontrada.
  </div>

  <!-- Modal de visualização de imagem -->
  <div *ngIf="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
    <div class="relative">
      <img [src]="selectedImageUrl" alt="Imagem em tela cheia" class="max-w-full max-h-screen object-contain rounded-lg shadow-lg" />
      <button (click)="closeModal()" class="absolute top-4 right-4 text-white text-3xl">&times;</button>
    </div>
  </div>
</div>


  `,
  styleUrl: './view-images.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewImagesComponent {
  bucketName = 'minha-aplicacao-upload-imagens';  // Nome do seu bucket
  s3Client: S3Client;

  imagens: { key: string, url: string }[] = [];

  isModalOpen: boolean = false;
  selectedImageUrl: string | null = null;

  constructor(private cdr: ChangeDetectorRef) {
    // Configuração do cliente S3
    this.s3Client = new S3Client({
      region: 'sa-east-1',  // Ex: 'sa-east-1'
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

  // Fecha o modal
  closeModal() {
    this.isModalOpen = false;
    this.selectedImageUrl = null;
  }
}
