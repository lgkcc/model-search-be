import { Module } from '@nestjs/common';
import { ServicesTypeController } from './services-type.controller';
import { ServicesTypeService } from './services-type.service';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { MessengerController } from './messenger.controller';
import { MessengerService } from './messenger.service';
import { AdditionalServicesController } from './additional-services.controller';
import { AdditionalServicesService } from './additional-services.service';
import { BodyTypeController } from './body-type.controller';
import { BodyTypeService } from './body-type.service';
import { HairColorController } from './hair-color.controller';
import { HairColorService } from './hair-color.service';
import { HairLengthController } from './hair-length.controller';
import { HairLengthService } from './hair-length.service';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';

@Module({
  controllers: [
    ServicesTypeController,
    CurrencyController,
    MessengerController,
    AdditionalServicesController,
    BodyTypeController,
    HairColorController,
    HairLengthController,
    PriceController,
  ],
  providers: [
    ServicesTypeService,
    CurrencyService,
    MessengerService,
    AdditionalServicesService,
    BodyTypeService,
    HairColorService,
    HairLengthService,
    PriceService,
  ],
  exports: [PriceService],
})
export class DictionariesModule {}
