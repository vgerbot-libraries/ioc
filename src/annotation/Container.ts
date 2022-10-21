import { DEFAULT_CONTAINER_ID } from '../foundation/consts';
import { ClassMetadata } from '../metadata/ClassMetadata';
import { ComponentContainer } from '../foundation/ComponentContainer';

export function Container(containerId: string = DEFAULT_CONTAINER_ID): ClassDecorator {
    return target => {
        const metadata = ClassMetadata.getMetadata(target);
        const container = ComponentContainer.getContainer(containerId);
        metadata.setContainer(container);
    };
}
