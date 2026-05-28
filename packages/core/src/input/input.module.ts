import { LeryxMetadataRegistry } from '../di/metadata-registry.js';
import { InputService } from './input-service.js';

LeryxMetadataRegistry.setInjectable(InputService, { providedIn: 'root' });

export class InputModule {}

LeryxMetadataRegistry.setModule(InputModule, {
    providers: [InputService],
});
