import { ApplicationContext } from '../../../src';
import { JSONData } from '../../../src/decorators/JSONData';
import { Env } from '../../../src/decorators/Env';
import { Argv } from '../../../src/decorators/Argv';

describe('@Value Annotation', () => {
    it('Should inject value correctly', () => {
        class Service {
            @JSONData('i18n', 'sidebar.toggle')
            value!: string;
        }
        const context = new ApplicationContext();
        const TOGGLE_VALUE = 'Toggle Sidebar';
        context.recordJSONData('i18n', {
            sidebar: {
                toggle: TOGGLE_VALUE
            }
        });

        const service = context.getInstance(Service);

        expect(service.value).toBe(TOGGLE_VALUE);
    });
    it('Should inject environment variables correctly', () => {
        class Service {
            @Env('PATH')
            value!: string;
        }
        const context = new ApplicationContext();

        const service = context.getInstance(Service);

        expect(service.value).toBe(process.env.PATH);
    });
    it('Should inject argument options correctly', () => {
        const ARGV = ['--value', 'value-str'];
        class Service {
            @Argv('value', ARGV)
            value!: string;
        }
        const context = new ApplicationContext();

        const service = context.getInstance(Service);

        expect(service.value).toBe(ARGV[1]);
    });
});
