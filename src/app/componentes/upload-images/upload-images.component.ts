import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';


@Component({
  selector: 'app-upload-images',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
<div class="max-w-7xl mx-auto py-8 px-4">
  <h1 class="text-3xl font-bold text-center mb-8">Upload de Imagens</h1>

  <div class="bg-white p-8 rounded-lg shadow-md">
    <form (submit)="onUpload($event)" class="space-y-4">
      <input type="file" (change)="onFileSelected($event)" class="block w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-md" />
      
      <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500 transition-colors duration-300">Upload</button>
    </form>

    <!-- Mostrar o status do upload -->
    <div *ngIf="isLoading" class="mt-4 text-center">
      <p class="text-lg font-semibold text-blue-600 animate-pulse">Carregando...</p>
    </div>

    <div *ngIf="uploadStatus && !isLoading" class="mt-4 text-center">
      <p [ngClass]="{'text-green-600': uploadSuccess, 'text-red-600': !uploadSuccess}" class="text-lg font-semibold">
        {{ uploadStatus }}
      </p>
    </div>
  </div>
</div>


  `,
  styleUrl: './upload-images.component.css',
})
export class UploadImagesComponent {
  selectedFile: File | null = null;
  s3Client: S3Client;
  uploadStatus: string | null = null;
  bucketName = 'minha-aplicacao-upload-imagens';
  isLoading: boolean = false;
  uploadSuccess: boolean = false;

  constructor() {
    // Inicialize o cliente S3 usando o SDK v3
    this.s3Client = new S3Client({
      region: 'sa-east-1',
      credentials: {
        accessKeyId: 'AKIAYCO62F54H5FXS3MR',  // Substitua pela sua Access Key
        secretAccessKey: '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',  // Substitua pela sua Secret Key,
      },
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadStatus = null;
      this.isLoading = false;
    }
  }

  async onUpload(event: Event) {
    event.preventDefault();
    if (this.selectedFile) {
      this.isLoading = true;
      this.uploadStatus = null;

      try {
        const params = {
          Bucket: this.bucketName,
          Key: this.selectedFile.name,
          Body: this.selectedFile,
          ContentType: this.selectedFile.type,
          // ACL: 'public-read'
        };

        const command = new PutObjectCommand(params);
        await this.s3Client.send(command);
        
        this.uploadSuccess = true;
        this.uploadStatus = 'Upload realizado com sucesso!';
      } catch (error) {
        console.error('Erro ao fazer upload', error);
        this.uploadSuccess = false;
        this.uploadStatus = 'Erro ao realizar o upload.';
      } finally {
        this.isLoading = false;
      }
    } else {
      this.uploadStatus = 'Por favor, selecione um arquivo primeiro.';
    }
  }
}
