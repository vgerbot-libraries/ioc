import { ApplicationContext, ExpressionType, Value } from '../../../src';

describe('@Value Annotation', () => {
    it('Should inject value correctly', () => {
        class Service {
            @Value('i18n:sidebar.toggle', ExpressionType.JSON_PATH)
            value!: string;
        }
        const context = new ApplicationContext();
        const TOGGLE_VALUE = 'Toggle Sidebar';
        context.recordJSONData('i18n', {
            sidebar: {
                toggle: TOGGLE_VALUE
            }
        });

        debugger;

        const service = context.getInstance(Service);

        expect(service.value).toBe(TOGGLE_VALUE);
    });
});
