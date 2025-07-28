import { Module } from '@nestjs/common';
import { CriteriaService } from './criteria/criteria.service';

@Module({
  providers: [CriteriaService],
  exports: [CriteriaService],
})
export class SharedModule {}
