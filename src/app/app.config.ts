import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { S3Client } from '@aws-sdk/client-s3';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: S3Client,
      useFactory: () => new S3Client({
        region: 'sa-east-1',
        credentials: {
          accessKeyId: 'AKIAYCO62F54H5FXS3MR',
          secretAccessKey: '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',
        },
      })
    }
  ]
};
