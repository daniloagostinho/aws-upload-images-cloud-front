import { Injectable } from '@angular/core';
import { S3Client, ListObjectsCommand } from '@aws-sdk/client-s3';

@Injectable({
  providedIn: 'root'
})
export class S3Service {
  private bucketName = 'minha-aplicacao-upload-imagens';

  constructor(private s3Client: S3Client) {}

  async listarImagens() {
    try {
      const listCommand = new ListObjectsCommand({
        Bucket: this.bucketName
      });

      const response = await this.s3Client.send(listCommand);

      if (response.Contents) {
        const imagens = response.Contents.map(item => ({
          key: item.Key || '',
          url: `https://${this.bucketName}.s3.sa-east-1.amazonaws.com/${item.Key}`
        }));
        return imagens;
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
