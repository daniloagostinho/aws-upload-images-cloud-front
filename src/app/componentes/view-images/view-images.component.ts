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
 <div class="gallery-container">
  <h1 class="gallery-title">Galeria de Imagens</h1>

  <div *ngIf="imagens.length > 0" class="gallery-grid">
    <div *ngFor="let imagem of imagens" class="gallery-item">
      <!-- Imagem -->
      <img [src]="imagem.url" alt="{{ imagem.key }}" class="gallery-image" />

      <!-- Link de Visualização sobre a Imagem -->
      <a (click)="openModal(imagem.url)" class="gallery-overlay">
        <span class="overlay-text">Visualizar</span>
      </a>

      <!-- Botão Ver Detalhes da Imagem -->
      <button (click)="openDetailsModal(imagem)" class="details-button">
        Ver Detalhes da Imagem
      </button>
    </div>
  </div>

  <div *ngIf="imagens.length === 0" class="no-images-text">
    Nenhuma imagem encontrada.
  </div>

  <!-- Modal de visualização de imagem -->
  <div *ngIf="isModalOpen" class="image-modal">
    <div class="modal-content">
      <img [src]="selectedImageUrl" alt="Imagem em tela cheia" class="modal-image" />
      <button (click)="closeModal()" class="modal-close-button">&times;</button>
    </div>
  </div>
</div>

  <!-- Modal de Detalhes da Imagem -->
  <div *ngIf="isDetailsModalOpen" class="details-modal" (click)="closeDetailsModal()">
  <div class="modal-content" (click)="$event.stopPropagation()">
    <button (click)="closeDetailsModal()" class="modal-close-button" aria-label="Fechar">&times;</button>
    <h6 class="modal-title" style="font-size: 1.2em;">Detalhes da Imagem</h6>
    <div class="modal-body">
      <p><strong>Nome:</strong> {{ selectedImage?.key }}</p>
      <p><strong>Formato:</strong> {{ selectedImage?.format }}</p> <!-- Formato da imagem -->
    </div>
    <button (click)="closeDetailsModal()" class="close-modal-btn">Fechar</button>
  </div>
</div>

  `,
  styleUrl: './view-images.component.scss',
})
export class ViewImagesComponent {
  bucketName = 'minha-aplicacao-upload-imagens';  // Nome do seu bucket
  s3Client: S3Client;
  imagens: { key: string, url: string }[] = [];
  isModalOpen: boolean = false;
  selectedImageUrl: string | null = null;
  isDetailsModalOpen = false;
  selectedImage: any = null;

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

  openDetailsModal(imagem: any) {
    const extension = imagem.key.split('.').pop()?.toUpperCase();
    imagem.format = extension || 'Desconhecido';  // Definir formato automaticamente
    this.selectedImage = imagem;

    console.log("selectedImage --->> ", imagem);
    this.isDetailsModalOpen = true;
  }

  closeDetailsModal() {
    this.isDetailsModalOpen = false;
    this.selectedImage = null;
  }
}
