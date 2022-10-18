import { ComponentClass } from './ComponentClass';
import { Container } from './Container';

export interface Provider {
    getInstance<T>(container: Container, componentClass: ComponentClass<T>): T;
    destroyComponents(): void;
}
