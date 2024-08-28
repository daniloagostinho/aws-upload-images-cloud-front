import { Injectable } from '@angular/core';
import { S3Client, ListObjectsCommand } from '@aws-sdk/client-s3';

@Injectable({
  providedIn: 'root'
})
export class CloundFrontService {
  private bucketName = 'minha-aplicacao-upload-imagens';
  private cloudFrontDomain = 'https://d2s9dzjvc1bucl.cloudfront.net';

  constructor(private s3Client: S3Client) {}

  async listarImagens() {
    try {
      const listCommand = new ListObjectsCommand({
        Bucket: this.bucketName
      });

      const response = await this.s3Client.send(listCommand);

      if (response.Contents) {
        return response.Contents.map(item => ({
          key: item.Key || '',
          url: `${this.cloudFrontDomain}/${item.Key}`
        }));
      } else {
        console.log("Nenhuma imagem encontrada.");
        return [];
      }
    } catch (error) {
      console.error('Erro ao listar objetos no S3:', error);
      throw error;
    }
  }
}
