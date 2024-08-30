# CCSConfig Module

## Usage

```ts
import { Module } from '@nestjs/common';
import { CcsConfigModule } from 'shared/ccs-config/ccs-config.module';

@Module({
  imports: [
    // ...
    CcsConfigModule.forRoot(),
  ],
})
export class AppModule {}
```