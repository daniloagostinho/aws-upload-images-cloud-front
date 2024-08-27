import { CommonModule } from '@angular/common';
import {Component } from '@angular/core';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';


@Component({
  selector: 'app-upload-images',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl:'upload-images.component.html',
  styleUrl: './upload-images.component.scss',
})
export class UploadImagesComponent {
  selectedFile: File | null = null;
  s3Client: S3Client;
  uploadStatus: string | null = null;
  bucketName = 'minha-aplicacao-upload-imagens';
  isLoading: boolean = false;
  uploadSuccess: boolean = false;

  constructor() {
    this.s3Client = new S3Client({
      region: 'sa-east-1',
      credentials: {
        accessKeyId: 'AKIAYCO62F54H5FXS3MR',
        secretAccessKey: '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',
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
