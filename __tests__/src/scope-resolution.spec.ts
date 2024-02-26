import { ApplicationContext, InstanceResolution, InstanceScope, PreDestroy, Scope } from '../../src';
import { GetInstanceOptions } from '../../src/types/InstanceResolution';

describe('InstanceScope', () => {
    describe('SINGLETON', () => {
        @Scope(InstanceScope.SINGLETON)
        class Service {}
        it('should only be created once', () => {
            const context = new ApplicationContext({});
            const service1 = context.getInstance(Service);
            const service2 = context.getInstance(Service);
            expect(service1 === service2).toBeTruthy();
        });
    });
    describe('GLOBAL_SHARED_SINGLETON', () => {
        @Scope(InstanceScope.GLOBAL_SHARED_SINGLETON)
        class Service {}
        it('should only be created once and shared in different contexts', () => {
            const context1 = new ApplicationContext();
            const context2 = new ApplicationContext();
            const service1 = context1.getInstance(Service);
            const service2 = context2.getInstance(Service);

            expect(service1 === service2).toBeTruthy();
        });
    });
    describe('TRANSIENT', () => {
        @Scope(InstanceScope.TRANSIENT)
        class Service {}
        it('should create new instance each time it is requested', () => {
            const context = new ApplicationContext();
            const service1 = context.getInstance(Service);
            const service2 = context.getInstance(Service);

            expect(service1 === service2).toBeFalsy();
        });
        it('should transient instance be destroyed correctly', () => {
            const context = new ApplicationContext();
            const fn = jest.fn();
            @Scope(InstanceScope.TRANSIENT)
            class TransientService {
                @PreDestroy()
                onDestroy() {
                    fn.call(this);
                }
            }
            const instance = context.getInstance(TransientService);
            context.destroyTransientInstance(instance);
            expect(fn).toBeCalledWith(instance);
        });
        it('should singleton instance not be destroyed by destroyTransientInstance', () => {
            const context = new ApplicationContext();
            const fn = jest.fn();
            class SingletonService {
                @PreDestroy()
                onDestroy() {
                    fn.call(this);
                }
            }
            const instance = context.getInstance(SingletonService);
            context.destroyTransientInstance(instance);
            expect(fn).not.toBeCalled();
        });
    });
    describe('Custom instance scope', () => {
        const CUSTOM_INSTANCE_SCOPE_NAME = 'custom-instance-scope';

        @Scope(CUSTOM_INSTANCE_SCOPE_NAME)
        class RootTreeNodeService {
            //
        }

        class TreeNode {
            constructor(public parent?: TreeNode) {
                // PASS
            }
        }

        class CustomInstanceSolution implements InstanceResolution {
            static METADATA_KEY = Symbol('');
            destroy(): void {
                // PASS
            }
            getInstance<T, O>(options: GetInstanceOptions<T, O>): T | undefined {
                if (!options.owner) {
                    return;
                }
                const cls = options.identifier;
                if (typeof cls !== 'function') {
                    return;
                }
                const root = this.getRoot(options.owner as unknown as TreeNode);
                const instances = (Reflect.getMetadata(CustomInstanceSolution.METADATA_KEY, root) || []) as T[];
                return instances.find(it => it instanceof cls);
            }
            saveInstance<T, O>(instance: T, owner?: O): void {
                if (!owner) {
                    return;
                }
                const root = this.getRoot(owner as unknown as TreeNode);
                const instances = (Reflect.getMetadata(CustomInstanceSolution.METADATA_KEY, root) || []) as T[];
                instances.push(instance);
                Reflect.defineMetadata(CustomInstanceSolution.METADATA_KEY, instances, root);
            }
            getRoot(owner: TreeNode) {
                let root = owner;
                while (root.parent) {
                    root = root.parent;
                }
                return root;
            }
            shouldGenerate<T = RootTreeNodeService, O = TreeNode>(options: GetInstanceOptions<T, O>): boolean {
                return !!this.getInstance(options);
            }
        }

        it('Should custom scope resolution work correctly', () => {
            const context = new ApplicationContext();
            context.registerInstanceScopeResolution(CUSTOM_INSTANCE_SCOPE_NAME, CustomInstanceSolution);
            const root = new TreeNode();
            const child0 = new TreeNode(root);
            const child1 = new TreeNode(root);

            expect(context.getInstance(RootTreeNodeService, child0)).toBe(context.getInstance(RootTreeNodeService, child1));
        });
    });
});
