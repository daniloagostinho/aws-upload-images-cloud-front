import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
    <div>
  <h2>Upload de Imagem Privada para S3</h2>
  <input type="file" (change)="onFileSelected($event)" />
  <button (click)="onUpload()">Upload</button>
</div>

  `,
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  selectedFile: File | null = null;
  s3Client: S3Client;

  constructor() {
    // Inicialize o cliente S3 usando o SDK v3
    this.s3Client = new S3Client({
      region: '',
      credentials: {
        accessKeyId: '',  // Substitua pela sua Access Key
        secretAccessKey: '',  // Substitua pela sua Secret Key
      },
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async onUpload() {
    if (this.selectedFile) {
      const params = {
        Bucket: 'minha-aplicacao-upload-imagens',  // Substitua pelo nome do bucket
        Key: this.selectedFile.name,
        Body: this.selectedFile,
        ContentType: this.selectedFile.type,
        // ACL: 'public-read' as ObjectCannedACL,  // Altere conforme necessário (público ou privado)
      };

      try {
        const command = new PutObjectCommand(params);
        const data = await this.s3Client.send(command);
        console.log('Upload bem-sucedido', data);
        alert('Upload bem-sucedido!');
      } catch (err) {
        console.error('Erro ao fazer upload', err);
        alert('Erro ao fazer upload');
      }
    } else {
      alert('Selecione um arquivo primeiro!');
    }
  }
}
