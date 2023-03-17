import { ApplicationContext, Factory, PartialInstAwareProcessor } from '../../src';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
class FertilizerProducer {
    @Factory('urea')
    produceUrea() {
        return 'A pound of urea';
    }
    @Factory('potassium phosphate')
    producePotassiumPhosphate() {
        return 'A pound of potassium phosphate';
    }
}

const app = new ApplicationContext();

app.registerInstAwareProcessor(
    class implements PartialInstAwareProcessor {
        afterInstantiation<T>(instance: T): T {
            if (typeof instance === 'string') {
                return instance.replace('A pound of', 'Two pounds of') as T;
            }
            return instance;
        }
    }
);

const urea = app.getInstance('urea');
const potassiumPhosphate = app.getInstance('potassium phosphate');

console.log(urea, potassiumPhosphate);

// expect(urea).toBe('Two pounds of urea');
// expect(potassiumPhosphate).toBe('Two pounds of potassium phosphate');
