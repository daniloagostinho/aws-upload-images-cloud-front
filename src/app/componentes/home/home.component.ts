import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { S3Client, ListObjectsCommand } from '@aws-sdk/client-s3';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    NgIf,
    NgFor
  ],
  template: `
   <section class="image-section">
  <h2 class="image-section-title">Últimas Imagens Enviadas</h2>
  
  <div *ngIf="imagensRecentes.length > 0" class="image-grid">
    <div *ngFor="let imagem of imagensRecentes" class="image-item">
      <img [src]="imagem.url" alt="{{ imagem.key }}" class="image" />
    </div>
  </div>

  <div *ngIf="imagensRecentes.length === 0" class="no-images">
    Nenhuma imagem recente encontrada.
  </div>
</section>

  `,
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  imagensRecentes: { key: string, url: string }[] = [];
  bucketName = 'minha-aplicacao-upload-imagens';  // Substitua pelo nome do seu bucket
  s3Client: S3Client;

  constructor() {
    // Configuração do cliente S3
    this.s3Client = new S3Client({
      region: 'sa-east-1',
      credentials: {
        accessKeyId: 'AKIAYCO62F54H5FXS3MR',  // Substitua pela sua Access Key
        secretAccessKey: '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',  // Substitua pela sua Secret Key,
      },
    });
  }

  async ngOnInit() {
    try {
      const listCommand = new ListObjectsCommand({
        Bucket: this.bucketName,
        MaxKeys: 5,  // Limitar para as 5 últimas imagens
        Delimiter: '/',  // Pegar apenas objetos de nível superior
      });

      const response = await this.s3Client.send(listCommand);

      // Ordenar as imagens pela data de envio, da mais recente para a mais antiga
      if (response.Contents) {
        const sortedImages = response.Contents.sort((a, b) =>
          (new Date(b.LastModified || '').getTime()) - (new Date(a.LastModified || '').getTime())
        ).slice(0, 5);

        // Mapear as imagens e gerar as URLs
        this.imagensRecentes = sortedImages.map(item => ({
          key: item.Key || '',
          url: `https://${this.bucketName}.s3.sa-east-1.amazonaws.com/${item.Key}`
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar as últimas imagens', error);
    }
  }
}
