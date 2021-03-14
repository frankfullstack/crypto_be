import { Module } from '@nestjs/common';
import { Utils } from './utils/utils';

@Module({
  imports: [],
  controllers: [],
  providers: [
      Utils
  ],
})
export class SharedModule { }
