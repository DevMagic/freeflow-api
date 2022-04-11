import { FilesUploadService } from './file-upload-provider.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    exports: [FilesUploadService],
    providers: [
        FilesUploadService,],
})
export class FilesUploadModule {}
