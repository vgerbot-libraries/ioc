import { Newable } from '../types/Newable';
import { PartialInstAwareProcessor } from '../types/InstantiationAwareProcessor';
export declare function InstAwareProcessor(): <Cls extends Newable<PartialInstAwareProcessor>>(target: Cls) => Cls;
