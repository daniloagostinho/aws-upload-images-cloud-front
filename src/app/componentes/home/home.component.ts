import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
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
  templateUrl: 'home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  imagensRecentes: { key: string, url: string }[] = [];
  bucketName = 'minha-aplicacao-upload-imagens';
  s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: 'sa-east-1',
      credentials: {
        accessKeyId: 'AKIAYCO62F54H5FXS3MR',
        secretAccessKey: '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',
      },
    });
  }

  async ngOnInit() {
    try {
      const listCommand = new ListObjectsCommand({
        Bucket: this.bucketName,
        MaxKeys: 5,
      });
  
      const response = await this.s3Client.send(listCommand);
  
      if (response.Contents) {
        this.imagensRecentes = response.Contents.slice(0, 5).map(item => ({
          key: item.Key || '',
          url: `https://${this.bucketName}.s3.sa-east-1.amazonaws.com/${item.Key}`
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar as últimas imagens', error);
    }
  }
  
}
