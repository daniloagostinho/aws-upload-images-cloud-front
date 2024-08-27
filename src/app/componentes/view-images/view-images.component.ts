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
<div>
  <h2>Imagens no Bucket S3</h2>
  <div *ngIf="imagens.length > 0">
    <ul>
      <li *ngFor="let imagem of imagens">
        <a [href]="imagem.url" target="_blank">{{ imagem.key }}</a>
        <img [src]="imagem.url" alt="Imagem" style="width: 200px; height: auto;"/>
      </li>
    </ul>
  </div>
  <div *ngIf="imagens.length === 0">
    <p>Nenhuma imagem encontrada no bucket.</p>
  </div>
</div>


  `,
  styleUrl: './view-images.component.css',
})
export class ViewImagesComponent {
  bucketName = 'minha-aplicacao-upload-imagens';  // Nome do seu bucket
  s3Client: S3Client;

  imagens: { key: string, url: string }[] = [];

  constructor(private cdr: ChangeDetectorRef) {
    // Configuração do cliente S3

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
  
}
