import { LeryxModule } from '@leryx/core';
import { InputService } from './input.service.js';

@LeryxModule({
    providers: [InputService],
})
export class InputModule {}
