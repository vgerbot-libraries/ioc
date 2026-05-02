(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? factory(exports, require('reflect-metadata'), require('@vgerbot/lazily'))
        : typeof define === 'function' && define.amd
          ? define(['exports', 'reflect-metadata', '@vgerbot/lazily'], factory)
          : ((global = typeof globalThis !== 'undefined' ? globalThis : global || self),
            factory((global.IoC = {}), null, global.lazily));
})(this, function (exports, reflectMetadata, lazily) {
    'use strict';

    exports.Advice = void 0;
    (function (Advice) {
        Advice[(Advice['Before'] = 0)] = 'Before';
        Advice[(Advice['After'] = 1)] = 'After';
        Advice[(Advice['Around'] = 2)] = 'Around';
        Advice[(Advice['AfterReturn'] = 3)] = 'AfterReturn';
        Advice[(Advice['Thrown'] = 4)] = 'Thrown';
        Advice[(Advice['Finally'] = 5)] = 'Finally';
    })(exports.Advice || (exports.Advice = {}));

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */

    var extendStatics = function (d, b) {
        extendStatics =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
                function (d, b) {
                    d.__proto__ = b;
                }) ||
            function (d, b) {
                for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== 'function' && b !== null)
            throw new TypeError('Class extends value ' + String(b) + ' is not a constructor or null');
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    }

    var __assign = function () {
        __assign =
            Object.assign ||
            function __assign(t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
                }
                return t;
            };
        return __assign.apply(this, arguments);
    };

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
            d;
        if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
            return Reflect.metadata(metadataKey, metadataValue);
    }

    function __values(o) {
        var s = typeof Symbol === 'function' && Symbol.iterator,
            m = s && o[s],
            i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === 'number')
            return {
                next: function () {
                    if (o && i >= o.length) o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? 'Object is not iterable.' : 'Symbol.iterator is not defined.');
    }

    function __read(o, n) {
        var m = typeof Symbol === 'function' && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o),
            r,
            ar = [],
            e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        } catch (error) {
            e = { error: error };
        } finally {
            try {
                if (r && !r.done && (m = i['return'])) m.call(i);
            } finally {
                if (e) throw e.error;
            }
        }
        return ar;
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                    ar[i] = from[i];
                }
            }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    typeof SuppressedError === 'function'
        ? SuppressedError
        : function (error, suppressed, message) {
              var e = new Error(message);
              return (e.name = 'SuppressedError'), (e.error = error), (e.suppressed = suppressed), e;
          };

    function createDefaultValueMap(factory) {
        var map = new Map();
        var originGet = map.get.bind(map);
        map.get = function (key) {
            if (map.has(key)) {
                return originGet(key);
            } else {
                var defaultValue = factory(key);
                map.set(key, defaultValue);
                return map.get(key);
            }
        };
        return map;
    }

    var AOPClassMetadata = /** @class */ (function () {
        function AOPClassMetadata() {
            this.aspectMap = createDefaultValueMap(function () {
                return createDefaultValueMap(function () {
                    return [];
                });
            });
        }
        AOPClassMetadata.getReflectKey = function () {
            return 'aop:use-aspect-metadata';
        };
        AOPClassMetadata.prototype.init = function () {
            // IGNORE
        };
        AOPClassMetadata.prototype.append = function (methodName, advice, aspects) {
            var adviceAspectMap = this.aspectMap.get(methodName);
            var exitingAspectArray = adviceAspectMap.get(advice);
            exitingAspectArray.push.apply(exitingAspectArray, __spreadArray([], __read(aspects), false));
        };
        AOPClassMetadata.prototype.reader = function () {
            var _this = this;
            return {
                getAspects: function () {
                    return _this.aspectMap;
                },
                getAspectsOf: function (methodName, advice) {
                    return _this.aspectMap.get(methodName).get(advice);
                }
            };
        };
        return AOPClassMetadata;
    })();

    /* eslint-disable @typescript-eslint/no-explicit-any */
    var ComponentMethodAspect = /** @class */ (function () {
        function ComponentMethodAspect() {}
        ComponentMethodAspect.create = function (clazz, methodName) {
            return /** @class */ (function (_super) {
                __extends(ComponentMethodAspectImpl, _super);
                function ComponentMethodAspectImpl() {
                    return (_super !== null && _super.apply(this, arguments)) || this;
                }
                ComponentMethodAspectImpl.prototype.execute = function (jp) {
                    var aspectInstance = jp.ctx.getInstance(clazz);
                    var func = aspectInstance[methodName];
                    return func.call(this.aspectInstance, jp);
                };
                return ComponentMethodAspectImpl;
            })(ComponentMethodAspect);
        };
        return ComponentMethodAspect;
    })();

    var AspectMetadata = /** @class */ (function () {
        function AspectMetadata() {
            this.aspects = [];
            //
        }
        AspectMetadata.getInstance = function () {
            return AspectMetadata.INSTANCE;
        };
        AspectMetadata.prototype.init = function () {
            //
        };
        AspectMetadata.prototype.append = function (componentAspectClass, methodName, advice, pointcut) {
            var AspectClass = ComponentMethodAspect.create(componentAspectClass, methodName);
            this.aspects.push({
                aspectClass: AspectClass,
                methodName: methodName,
                pointcut: pointcut,
                advice: advice
            });
        };
        AspectMetadata.prototype.reader = function () {
            var _this = this;
            return {
                getAspects: function (jpIdentifier, jpMember) {
                    return _this.aspects.filter(function (_a) {
                        var pointcut = _a.pointcut;
                        return pointcut.test(jpIdentifier, jpMember);
                    });
                }
            };
        };
        AspectMetadata.INSTANCE = new AspectMetadata();
        return AspectMetadata;
    })();

    function addAspect(componentAspectClass, methodName, advice, pointcut) {
        AspectMetadata.getInstance().append(componentAspectClass, methodName, advice, pointcut);
        // const AspectClass = ComponentMethodAspect.create(componentAspectClass, methodName);
        // pointcut.getMethodsMap().forEach((jpMembers, jpClass) => {
        //     const metadata = MetadataInstanceManager.getMetadata(jpClass, AOPClassMetadata);
        //     jpMembers.forEach(methodName => {
        //         metadata.append(methodName, advice, [AspectClass]);
        //     });
        // });
    }

    function After(pointcut) {
        return function (target, propertyKey) {
            addAspect(target.constructor, propertyKey, exports.Advice.After, pointcut);
        };
    }

    function AfterReturn(pointcut) {
        return function (target, propertyKey) {
            addAspect(target.constructor, propertyKey, exports.Advice.AfterReturn, pointcut);
        };
    }

    function Around(pointcut) {
        return function (target, propertyKey) {
            addAspect(target.constructor, propertyKey, exports.Advice.Around, pointcut);
        };
    }

    function Before(pointcut) {
        return function (target, propertyKey) {
            addAspect(target.constructor, propertyKey, exports.Advice.Before, pointcut);
        };
    }

    function Finally(pointcut) {
        return function (target, propertyKey) {
            addAspect(target.constructor, propertyKey, exports.Advice.Finally, pointcut);
        };
    }

    function Thrown(pointcut) {
        return function (target, propertyKey) {
            addAspect(target.constructor, propertyKey, exports.Advice.Thrown, pointcut);
        };
    }

    function getMethodDescriptors(prototype) {
        if (
            typeof prototype !== 'object' ||
            prototype === null ||
            Object.prototype === prototype ||
            Function.prototype === prototype
        ) {
            return {};
        }
        var superPrototype = Object.getPrototypeOf(prototype);
        var superDescriptors = superPrototype === prototype ? {} : getMethodDescriptors(superPrototype);
        return Object.assign(superDescriptors, Object.getOwnPropertyDescriptors(prototype));
    }
    function getAllMethodMemberNames(cls) {
        var descriptors = getMethodDescriptors(cls.prototype);
        var methodNames = new Set();
        Reflect.ownKeys(descriptors).forEach(function (key) {
            if (key === 'constructor') {
                return;
            }
            var member = cls.prototype[key];
            if (typeof member === 'function') {
                methodNames.add(key);
            }
        });
        return methodNames;
    }

    var metadataInstanceMap = createDefaultValueMap(function () {
        return new Set();
    });
    var MetadataInstanceManager = /** @class */ (function () {
        function MetadataInstanceManager() {}
        MetadataInstanceManager.getMetadata = function (target, metadataClass) {
            var key = metadataClass.getReflectKey();
            var metadata = Reflect.getMetadata(key, target);
            if (!metadata) {
                metadata = new metadataClass();
                metadata.init(target);
                Reflect.defineMetadata(key, metadata, target);
                var instanceSet = metadataInstanceMap.get(metadataClass);
                instanceSet.add(metadata);
            }
            return metadata;
        };
        MetadataInstanceManager.getAllInstanceof = function (metadataClass) {
            return Array.from(metadataInstanceMap.get(metadataClass));
        };
        return MetadataInstanceManager;
    })();

    // eslint-disable @typescript-eslint/no-explicit-any
    var CLASS_METADATA_KEY = 'ioc:class-metadata';
    var MarkInfoContainer = /** @class */ (function () {
        function MarkInfoContainer() {
            this.map = createDefaultValueMap(function () {
                return {};
            });
        }
        MarkInfoContainer.prototype.getMarkInfo = function (method) {
            return this.map.get(method);
        };
        MarkInfoContainer.prototype.mark = function (method, key, value) {
            var markInfo = this.map.get(method);
            markInfo[key] = value;
        };
        MarkInfoContainer.prototype.getMembers = function () {
            return new Set(this.map.keys());
        };
        return MarkInfoContainer;
    })();
    var ParameterMarkInfoContainer = /** @class */ (function () {
        function ParameterMarkInfoContainer() {
            this.map = createDefaultValueMap(function () {
                return {};
            });
        }
        ParameterMarkInfoContainer.prototype.getMarkInfo = function (method) {
            return this.map.get(method);
        };
        ParameterMarkInfoContainer.prototype.mark = function (method, index, key, value) {
            var paramsMarkInfo = this.map.get(method);
            var markInfo = paramsMarkInfo[index] || {};
            markInfo[key] = value;
            paramsMarkInfo[index] = markInfo;
        };
        return ParameterMarkInfoContainer;
    })();
    var ClassMetadata = /** @class */ (function () {
        function ClassMetadata() {
            this.constructorParameterTypes = [];
            this.lifecycleMethodsMap = {};
            this.propertyTypesMap = new Map();
            this.marks = {
                ctor: {},
                members: new MarkInfoContainer(),
                params: new ParameterMarkInfoContainer()
            };
        }
        ClassMetadata.getReflectKey = function () {
            return CLASS_METADATA_KEY;
        };
        ClassMetadata.getInstance = function (ctor) {
            return MetadataInstanceManager.getMetadata(ctor, ClassMetadata);
        };
        ClassMetadata.getReader = function (ctor) {
            return ClassMetadata.getInstance(ctor).reader();
        };
        ClassMetadata.prototype.init = function (target) {
            var _this = this;
            this.clazz = target;
            var constr = target;
            if (typeof constr.scope === 'function') {
                this.setScope(constr.scope());
            }
            if (typeof constr.inject === 'function') {
                var injections_1 = constr.inject();
                Reflect.ownKeys(injections_1).forEach(function (key) {
                    _this.recordPropertyType(key, injections_1[key]);
                });
            }
            if (typeof constr.metadata === 'function') {
                var metadata = constr.metadata();
                if (metadata.scope) {
                    this.setScope(metadata.scope);
                }
                var injections_2 = metadata.inject;
                if (injections_2) {
                    Reflect.ownKeys(injections_2).forEach(function (key) {
                        _this.recordPropertyType(key, injections_2[key]);
                    });
                }
            }
        };
        ClassMetadata.prototype.marker = function () {
            var _this = this;
            return {
                ctor: function (key, value) {
                    _this.marks.ctor[key] = value;
                },
                member: function (propertyKey) {
                    return {
                        mark: function (key, value) {
                            _this.marks.members.mark(propertyKey, key, value);
                        }
                    };
                },
                parameter: function (propertyKey, index) {
                    return {
                        mark: function (key, value) {
                            _this.marks.params.mark(propertyKey, index, key, value);
                        }
                    };
                }
            };
        };
        ClassMetadata.prototype.setScope = function (scope) {
            this.scope = scope;
        };
        ClassMetadata.prototype.setConstructorParameterType = function (index, type) {
            this.constructorParameterTypes[index] = type;
        };
        ClassMetadata.prototype.recordPropertyType = function (propertyKey, type) {
            this.propertyTypesMap.set(propertyKey, type);
        };
        ClassMetadata.prototype.addLifecycleMethod = function (methodName, lifecycle) {
            var lifecycles = this.getLifecycles(methodName);
            lifecycles.add(lifecycle);
            this.lifecycleMethodsMap[methodName] = lifecycles;
        };
        ClassMetadata.prototype.getLifecycles = function (methodName) {
            return this.lifecycleMethodsMap[methodName] || new Set();
        };
        ClassMetadata.prototype.getMethods = function (lifecycle) {
            var _this = this;
            return Object.keys(this.lifecycleMethodsMap).filter(function (it) {
                var lifecycles = _this.lifecycleMethodsMap[it];
                return lifecycles.has(lifecycle);
            });
        };
        ClassMetadata.prototype.getSuperClass = function () {
            var superClassPrototype = Object.getPrototypeOf(this.clazz);
            if (!superClassPrototype) {
                return null;
            }
            var superClass = superClassPrototype.constructor;
            if (superClass === this.clazz) {
                return null;
            }
            return superClass;
        };
        ClassMetadata.prototype.getSuperClassMetadata = function () {
            var superClass = this.getSuperClass();
            if (!superClass) {
                return null;
            }
            return ClassMetadata.getInstance(superClass);
        };
        ClassMetadata.prototype.reader = function () {
            var _this = this;
            var _a;
            var superReader = (_a = this.getSuperClassMetadata()) === null || _a === void 0 ? void 0 : _a.reader();
            return {
                getClass: function () {
                    return _this.clazz;
                },
                getScope: function () {
                    return _this.scope;
                },
                getConstructorParameterTypes: function () {
                    return _this.constructorParameterTypes.slice(0);
                },
                getMethods: function (lifecycle) {
                    var superMethods =
                        (superReader === null || superReader === void 0 ? void 0 : superReader.getMethods(lifecycle)) || [];
                    var thisMethods = _this.getMethods(lifecycle);
                    return Array.from(new Set(superMethods.concat(thisMethods)));
                },
                getPropertyTypeMap: function () {
                    var superPropertyTypeMap =
                        superReader === null || superReader === void 0 ? void 0 : superReader.getPropertyTypeMap();
                    var thisPropertyTypesMap = _this.propertyTypesMap;
                    if (!superPropertyTypeMap) {
                        return new Map(thisPropertyTypesMap);
                    }
                    var result = new Map(superPropertyTypeMap);
                    thisPropertyTypesMap.forEach(function (value, key) {
                        result.set(key, value);
                    });
                    return result;
                },
                getCtorMarkInfo: function () {
                    return __assign({}, _this.marks.ctor);
                },
                getAllMarkedMembers: function () {
                    var superMethods =
                        superReader === null || superReader === void 0 ? void 0 : superReader.getAllMarkedMembers();
                    var thisMembers = _this.marks.members.getMembers();
                    var result = superMethods ? new Set(superMethods) : new Set();
                    thisMembers.forEach(function (it) {
                        return result.add(it);
                    });
                    return result;
                },
                getMembersMarkInfo: function (key) {
                    return _this.marks.members.getMarkInfo(key);
                },
                getParameterMarkInfo: function (methodKey) {
                    return _this.marks.params.getMarkInfo(methodKey);
                }
            };
        };
        return ClassMetadata;
    })();

    var FUNCTION_METADATA_KEY = Symbol('ioc:function-metadata');
    var FunctionMetadata = /** @class */ (function () {
        function FunctionMetadata() {
            this.parameters = [];
            this.isFactory = false;
        }
        FunctionMetadata.getReflectKey = function () {
            return FUNCTION_METADATA_KEY;
        };
        FunctionMetadata.prototype.setParameterType = function (index, symbol) {
            this.parameters[index] = symbol;
        };
        FunctionMetadata.prototype.setScope = function (scope) {
            this.scope = scope;
        };
        FunctionMetadata.prototype.setIsFactory = function (isFactory) {
            this.isFactory = isFactory;
        };
        FunctionMetadata.prototype.init = function () {
            // PASS;
        };
        FunctionMetadata.prototype.reader = function () {
            var _this = this;
            return {
                getParameters: function () {
                    return _this.parameters.slice(0);
                },
                isFactory: function () {
                    return _this.isFactory;
                },
                getScope: function () {
                    return _this.scope;
                }
            };
        };
        return FunctionMetadata;
    })();

    exports.InstanceScope = void 0;
    (function (InstanceScope) {
        InstanceScope['SINGLETON'] = 'ioc-resolution:container-singleton';
        InstanceScope['TRANSIENT'] = 'ioc-resolution:transient';
        InstanceScope['GLOBAL_SHARED_SINGLETON'] = 'ioc-resolution:global-shared-singleton';
    })(exports.InstanceScope || (exports.InstanceScope = {}));

    var ServiceFactoryDef = /** @class */ (function () {
        /**
         * @param identifier The unique identifier of this factories
         * @param isSingle Indicates whether the identifier defines only one factory.
         */
        function ServiceFactoryDef(identifier, scope) {
            this.identifier = identifier;
            this.scope = scope;
            this.factories = new Map();
        }
        ServiceFactoryDef.createFromClassMetadata = function (metadata) {
            var def = new ServiceFactoryDef(metadata.reader().getClass(), exports.InstanceScope.SINGLETON);
            def.append(function (container, owner) {
                return function () {
                    var reader = metadata.reader();
                    var clazz = reader.getClass();
                    return container.getInstance(clazz, owner);
                };
            });
            return def;
        };
        ServiceFactoryDef.prototype.append = function (factory, injections) {
            if (injections === void 0) {
                injections = [];
            }
            if (this.scope === exports.InstanceScope.SINGLETON && this.factories.size === 1 && this.factories.has(factory)) {
                throw new Error(''.concat(this.identifier.toString(), ' is A singleton! But multiple factories are defined!'));
            }
            this.factories.set(factory, injections);
        };
        ServiceFactoryDef.prototype.produce = function (container, owner) {
            // if (this.isSingle) {
            //     const [factory, injections] = this.factories.entries().next().value as [ServiceFactory<T, unknown>, Identifier[]];
            //     const fn = factory(container, owner);
            //     return () => {
            //         return container.invoke(fn, {
            //             injections
            //         });
            //     };
            // } else {
            // }
            var producers = Array.from(this.factories).map(function (_a) {
                var _b = __read(_a, 2),
                    factory = _b[0],
                    injections = _b[1];
                var fn = factory(container, owner);
                return function () {
                    return container.invoke(fn, {
                        injections: injections
                    });
                };
            });
            return function () {
                return producers.map(function (it) {
                    return it();
                });
            };
        };
        return ServiceFactoryDef;
    })();

    var FactoryRecorder = /** @class */ (function () {
        function FactoryRecorder() {
            this.factories = new Map();
        }
        FactoryRecorder.prototype.append = function (identifier, factory, injections, scope) {
            if (injections === void 0) {
                injections = [];
            }
            if (scope === void 0) {
                scope = exports.InstanceScope.SINGLETON;
            }
            var def = this.factories.get(identifier);
            if (def) {
                def.append(factory, injections);
            } else {
                def = new ServiceFactoryDef(identifier, scope);
                def.append(factory, injections);
            }
            this.factories.set(identifier, def);
        };
        FactoryRecorder.prototype.set = function (identifier, factoryDef) {
            this.factories.set(identifier, factoryDef);
        };
        FactoryRecorder.prototype.get = function (identifier) {
            return this.factories.get(identifier);
        };
        FactoryRecorder.prototype.iterator = function () {
            return this.factories.entries();
        };
        return FactoryRecorder;
    })();

    var GlobalMetadata = /** @class */ (function () {
        function GlobalMetadata() {
            this.classAliasMetadataMap = new Map();
            this.componentFactories = new FactoryRecorder();
            this.processorClasses = new Set();
        }
        GlobalMetadata.getInstance = function () {
            return GlobalMetadata.INSTANCE;
        };
        GlobalMetadata.getReader = function () {
            return GlobalMetadata.getInstance().reader();
        };
        GlobalMetadata.prototype.recordFactory = function (symbol, factory, injections, scope) {
            if (injections === void 0) {
                injections = [];
            }
            if (scope === void 0) {
                scope = exports.InstanceScope.SINGLETON;
            }
            this.componentFactories.append(symbol, factory, injections, scope);
        };
        GlobalMetadata.prototype.recordClassAlias = function (aliasName, metadata) {
            this.classAliasMetadataMap.set(aliasName, metadata);
        };
        GlobalMetadata.prototype.recordProcessorClass = function (clazz) {
            this.processorClasses.add(clazz);
        };
        GlobalMetadata.prototype.init = function () {
            // PASS;
        };
        GlobalMetadata.prototype.reader = function () {
            var _this = this;
            return {
                getComponentFactory: function (key) {
                    return _this.componentFactories.get(key);
                },
                getClassMetadata: function (aliasName) {
                    return _this.classAliasMetadataMap.get(aliasName);
                },
                getInstAwareProcessorClasses: function () {
                    return Array.from(_this.processorClasses);
                }
            };
        };
        GlobalMetadata.INSTANCE = new GlobalMetadata();
        return GlobalMetadata;
    })();

    var Pointcut = /** @class */ (function () {
        function Pointcut() {}
        Pointcut.combine = function () {
            var pointcuts = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                pointcuts[_i] = arguments[_i];
            }
            return new OrPointcut(pointcuts);
        };
        Pointcut.of = function (cls) {
            var methodNames = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                methodNames[_i - 1] = arguments[_i];
            }
            var entries = new Map();
            var methods = new Set(methodNames);
            if (arguments.length === 1) {
                getAllMethodMemberNames(cls).forEach(function (methodName) {
                    methods.add(methodName);
                });
            }
            entries.set(cls, methods);
            return new PrecitePointcut(entries);
        };
        /**
         * @deprecated
         */
        Pointcut.testMatch = function (cls, regex) {
            return Pointcut.match(cls, regex);
        };
        Pointcut.match = function (cls, regex) {
            return new MemberMatchPointcut(cls, regex);
        };
        Pointcut.from = function () {
            var classes = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                classes[_i] = arguments[_i];
            }
            var of = function () {
                var methodNames = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    methodNames[_i] = arguments[_i];
                }
                return new OrPointcut(
                    classes.map(function (cls) {
                        return Pointcut.of.apply(Pointcut, __spreadArray([cls], __read(methodNames), false));
                    })
                );
            };
            var match = function (regex) {
                return new OrPointcut(
                    classes.map(function (cls) {
                        return new MemberMatchPointcut(cls, regex);
                    })
                );
            };
            return {
                of: of,
                match: match,
                /**
                 * @deprecated
                 */
                testMatch: match
            };
        };
        Pointcut.marked = function (type, value) {
            if (value === void 0) {
                value = true;
            }
            return new MarkedPointcut(type, value);
        };
        Pointcut.class = function (cls) {
            return new ClassPointcut(cls);
        };
        return Pointcut;
    })();
    var OrPointcut = /** @class */ (function (_super) {
        __extends(OrPointcut, _super);
        function OrPointcut(pointcuts) {
            var _this = _super.call(this) || this;
            _this.pointcuts = pointcuts;
            return _this;
        }
        OrPointcut.prototype.test = function (jpIdentifier, jpMember) {
            return this.pointcuts.some(function (it) {
                return it.test(jpIdentifier, jpMember);
            });
        };
        return OrPointcut;
    })(Pointcut);
    var PrecitePointcut = /** @class */ (function (_super) {
        __extends(PrecitePointcut, _super);
        function PrecitePointcut(methodEntries) {
            var _this = _super.call(this) || this;
            _this.methodEntries = methodEntries;
            return _this;
        }
        PrecitePointcut.prototype.test = function (jpIdentifier, jpMember) {
            var members = this.methodEntries.get(jpIdentifier);
            return !!members && members.has(jpMember);
        };
        return PrecitePointcut;
    })(Pointcut);
    var MarkedPointcut = /** @class */ (function (_super) {
        __extends(MarkedPointcut, _super);
        function MarkedPointcut(markedType, markedValue) {
            if (markedValue === void 0) {
                markedValue = true;
            }
            var _this = _super.call(this) || this;
            _this.markedType = markedType;
            _this.markedValue = markedValue;
            return _this;
        }
        MarkedPointcut.prototype.test = function (jpIdentifier, jpMember) {
            if (typeof jpIdentifier !== 'function') {
                return false;
            }
            var metadata = MetadataInstanceManager.getMetadata(jpIdentifier, ClassMetadata);
            var markInfo = metadata.reader().getMembersMarkInfo(jpMember);
            return markInfo[this.markedType] === this.markedValue;
        };
        return MarkedPointcut;
    })(Pointcut);
    var MemberMatchPointcut = /** @class */ (function (_super) {
        __extends(MemberMatchPointcut, _super);
        function MemberMatchPointcut(clazz, regex) {
            var _this = _super.call(this) || this;
            _this.clazz = clazz;
            _this.regex = regex;
            return _this;
        }
        MemberMatchPointcut.prototype.test = function (jpIdentifier, jpMember) {
            return jpIdentifier === this.clazz && typeof jpMember === 'string' && !!this.regex.test(jpMember);
        };
        return MemberMatchPointcut;
    })(Pointcut);
    var ClassPointcut = /** @class */ (function (_super) {
        __extends(ClassPointcut, _super);
        function ClassPointcut(clazz) {
            var _this = _super.call(this) || this;
            _this.clazz = clazz;
            return _this;
        }
        ClassPointcut.prototype.test = function (jpIdentifier) {
            return jpIdentifier === this.clazz;
        };
        return ClassPointcut;
    })(Pointcut);

    function UseAspects(advice, aspects) {
        return function (target, propertyKey) {
            var clazz = target.constructor;
            aspects.forEach(function (aspectClass) {
                addAspect(aspectClass, 'execute', advice, Pointcut.of(clazz, propertyKey));
            });
        };
    }

    function Alias(aliasName) {
        return function (target) {
            var metadata = MetadataInstanceManager.getMetadata(target, ClassMetadata);
            GlobalMetadata.getInstance().recordClassAlias(aliasName, metadata);
        };
    }

    exports.ExpressionType = void 0;
    (function (ExpressionType) {
        ExpressionType['ENV'] = 'inject-environment-variables';
        ExpressionType['JSON_PATH'] = 'inject-json-data';
        ExpressionType['ARGV'] = 'inject-argv';
    })(exports.ExpressionType || (exports.ExpressionType = {}));

    var isNodeJs = (function () {
        try {
            return process.versions.node !== null;
        } catch (_e) {
            return false;
        }
    })();

    var InjectionType = /** @class */ (function () {
        function InjectionType(clazz, identifier) {
            if (identifier === void 0) {
                identifier = clazz;
            }
            this.clazz = clazz;
            this.identifier = identifier;
        }
        InjectionType.ofClazz = function (clazz) {
            return new InjectionType(clazz);
        };
        InjectionType.ofIdentifier = function (identifier) {
            return new InjectionType(Object, identifier);
        };
        InjectionType.of = function (clazz, identifier) {
            if (identifier === void 0) {
                identifier = clazz;
            }
            return new InjectionType(clazz, identifier);
        };
        Object.defineProperty(InjectionType.prototype, 'isNewable', {
            get: function () {
                return this.identifier === this.clazz;
            },
            enumerable: false,
            configurable: true
        });
        return InjectionType;
    })();

    function Value(expression, type, externalArgs) {
        switch (type) {
            case exports.ExpressionType.ENV:
            case exports.ExpressionType.ARGV:
                if (!isNodeJs) {
                    throw new Error('The "'.concat(type, '" evaluator only supports nodejs environment!'));
                }
        }
        return function (target, propertyKey) {
            var metadata = MetadataInstanceManager.getMetadata(target.constructor, ClassMetadata);
            var value_symbol = Symbol('');
            metadata.recordPropertyType(propertyKey, InjectionType.ofIdentifier(value_symbol));
            GlobalMetadata.getInstance().recordFactory(value_symbol, function (container, owner) {
                return function () {
                    return container.evaluate(expression, {
                        owner: owner,
                        type: type,
                        externalArgs: externalArgs
                    });
                };
            });
        };
    }

    function Argv(name, argv) {
        if (argv === void 0) {
            argv = process.argv;
        }
        return Value(name, exports.ExpressionType.ARGV, argv);
    }

    /**
     * @deprecated use @Alias instead
     * @param aliasName
     * @returns
     */
    function Bind(aliasName) {
        return Alias(aliasName);
    }

    function Env(name) {
        return Value(name, exports.ExpressionType.ENV);
    }

    function isNull(value) {
        return value === null;
    }
    function isUndefined(value) {
        return value === undefined;
    }
    function isNotDefined(value) {
        return isNull(value) || isUndefined(value);
    }

    var PROXY_TARGET_MAP = new WeakMap();
    function recordProxyTarget(proxy, target) {
        PROXY_TARGET_MAP.set(proxy, target);
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    var AspectUtils = /** @class */ (function () {
        function AspectUtils(fn) {
            this.fn = fn;
            this.beforeHooks = [];
            this.afterHooks = [];
            this.thrownHooks = [];
            this.finallyHooks = [];
            this.afterReturnHooks = [];
            this.aroundHooks = [];
        }
        AspectUtils.prototype.append = function (advice, hook) {
            var hooksArray;
            switch (advice) {
                case exports.Advice.Before:
                    hooksArray = this.beforeHooks;
                    break;
                case exports.Advice.After:
                    hooksArray = this.afterHooks;
                    break;
                case exports.Advice.Thrown:
                    hooksArray = this.thrownHooks;
                    break;
                case exports.Advice.Finally:
                    hooksArray = this.finallyHooks;
                    break;
                case exports.Advice.AfterReturn:
                    hooksArray = this.afterReturnHooks;
                    break;
                case exports.Advice.Around:
                    hooksArray = this.aroundHooks;
                    break;
            }
            if (hooksArray) {
                hooksArray.push(hook);
            }
        };
        AspectUtils.prototype.extract = function () {
            var _a = this,
                aroundHooks = _a.aroundHooks,
                beforeHooks = _a.beforeHooks,
                afterHooks = _a.afterHooks,
                afterReturnHooks = _a.afterReturnHooks,
                finallyHooks = _a.finallyHooks,
                thrownHooks = _a.thrownHooks;
            var fn = aroundHooks.reduceRight(function (prev, next) {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return next.call(this, prev, args);
                };
            }, this.fn);
            return function () {
                var _this = this;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                beforeHooks.forEach(function (hook) {
                    hook.call(_this, args);
                });
                var invoke = function (onError, onFinally, onAfter) {
                    var returnValue;
                    var isPromise = false;
                    try {
                        returnValue = fn.apply(_this, args);
                        if (returnValue instanceof Promise) {
                            isPromise = true;
                            returnValue = returnValue.catch(onError).finally(onFinally);
                        }
                    } catch (error) {
                        onError(error);
                    } finally {
                        if (!isPromise) {
                            onFinally();
                        }
                    }
                    if (isPromise) {
                        return returnValue.then(function (value) {
                            return onAfter(value);
                        });
                    } else {
                        return onAfter(returnValue);
                    }
                };
                return invoke(
                    function (error) {
                        if (thrownHooks.length > 0) {
                            thrownHooks.forEach(function (hook) {
                                return hook.call(_this, error, args);
                            });
                        } else {
                            throw error;
                        }
                    },
                    function () {
                        finallyHooks.forEach(function (hook) {
                            return hook.call(_this, args);
                        });
                    },
                    function (value) {
                        afterHooks.forEach(function (hook) {
                            hook.call(_this, args);
                        });
                        return afterReturnHooks.reduce(function (retVal, hook) {
                            return hook.call(_this, retVal, args);
                        }, value);
                    }
                );
            };
        };
        return AspectUtils;
    })();

    function createAspect(appCtx, target, methodName, methodFunc, aspects) {
        var createAspectCtx = function (advice, args, returnValue, error) {
            if (returnValue === void 0) {
                returnValue = null;
            }
            if (error === void 0) {
                error = null;
            }
            return {
                target: target,
                methodName: methodName,
                arguments: args,
                returnValue: returnValue,
                error: error,
                advice: advice,
                ctx: appCtx
            };
        };
        var aspectUtils = new AspectUtils(methodFunc);
        var ClassToInstance = function (aspectInfo) {
            return appCtx.getInstance(aspectInfo.aspectClass);
        };
        var targetConstructor = target.constructor;
        var allMatchAspects = aspects.filter(function (it) {
            return it.pointcut.test(targetConstructor, methodName);
        });
        var beforeAdviceAspects = allMatchAspects
            .filter(function (it) {
                return it.advice === exports.Advice.Before;
            })
            .map(ClassToInstance);
        var afterAdviceAspects = allMatchAspects
            .filter(function (it) {
                return it.advice === exports.Advice.After;
            })
            .map(ClassToInstance);
        var tryCatchAdviceAspects = allMatchAspects
            .filter(function (it) {
                return it.advice === exports.Advice.Thrown;
            })
            .map(ClassToInstance);
        var tryFinallyAdviceAspects = allMatchAspects
            .filter(function (it) {
                return it.advice === exports.Advice.Finally;
            })
            .map(ClassToInstance);
        var afterReturnAdviceAspects = allMatchAspects
            .filter(function (it) {
                return it.advice === exports.Advice.AfterReturn;
            })
            .map(ClassToInstance);
        var aroundAdviceAspects = allMatchAspects
            .filter(function (it) {
                return it.advice === exports.Advice.Around;
            })
            .map(ClassToInstance);
        if (beforeAdviceAspects.length > 0) {
            aspectUtils.append(exports.Advice.Before, function (args) {
                var joinPoint = createAspectCtx(exports.Advice.Before, args);
                beforeAdviceAspects.forEach(function (aspect) {
                    aspect.execute(joinPoint);
                });
            });
        }
        if (afterAdviceAspects.length > 0) {
            aspectUtils.append(exports.Advice.After, function (args) {
                var joinPoint = createAspectCtx(exports.Advice.After, args);
                afterAdviceAspects.forEach(function (aspect) {
                    aspect.execute(joinPoint);
                });
            });
        }
        if (tryCatchAdviceAspects.length > 0) {
            aspectUtils.append(exports.Advice.Thrown, function (error, args) {
                var joinPoint = createAspectCtx(exports.Advice.Thrown, args, null, error);
                tryCatchAdviceAspects.forEach(function (aspect) {
                    aspect.execute(joinPoint);
                });
            });
        }
        if (tryFinallyAdviceAspects.length > 0) {
            aspectUtils.append(exports.Advice.Finally, function (args) {
                var joinPoint = createAspectCtx(exports.Advice.Finally, args);
                tryFinallyAdviceAspects.forEach(function (aspect) {
                    aspect.execute(joinPoint);
                });
            });
        }
        if (afterReturnAdviceAspects.length > 0) {
            aspectUtils.append(exports.Advice.AfterReturn, function (returnValue, args) {
                return afterReturnAdviceAspects.reduce(function (_prevReturnValue, aspect) {
                    var joinPoint = createAspectCtx(exports.Advice.AfterReturn, args, returnValue);
                    return aspect.execute(joinPoint);
                }, returnValue);
            });
        }
        if (aroundAdviceAspects.length > 0) {
            aroundAdviceAspects.forEach(function (aspect) {
                aspectUtils.append(exports.Advice.Around, function (originFn, args) {
                    var joinPoint = createAspectCtx(exports.Advice.Around, args, null);
                    joinPoint.proceed = function (jpArgs) {
                        if (jpArgs === void 0) {
                            jpArgs = args;
                        }
                        return originFn(jpArgs);
                    };
                    return aspect.execute(joinPoint);
                });
            });
        }
        return aspectUtils.extract();
    }

    var AOPInstantiationAwareProcessor = /** @class */ (function () {
        function AOPInstantiationAwareProcessor() {}
        AOPInstantiationAwareProcessor.create = function (appCtx) {
            return /** @class */ (function (_super) {
                __extends(class_1, _super);
                function class_1() {
                    var _this = (_super !== null && _super.apply(this, arguments)) || this;
                    _this.appCtx = appCtx;
                    return _this;
                }
                return class_1;
            })(AOPInstantiationAwareProcessor);
        };
        AOPInstantiationAwareProcessor.prototype.afterInstantiation = function (instance) {
            var _this = this;
            if (!instance || typeof instance !== 'object') {
                return instance;
            }
            var clazz = instance.constructor;
            var aspectMetadata = AspectMetadata.getInstance().reader();
            // const useAspectMetadata = MetadataInstanceManager.getMetadata(clazz, AOPClassMetadata);
            // const useAspectMetadataReader = useAspectMetadata.reader();
            // const useAspectsMap = useAspectMetadataReader.getAspects();
            // if (useAspectsMap.size === 0) {
            //     return instance;
            // }
            var aspectStoreMap = new WeakMap();
            aspectStoreMap.set(instance, new Map());
            var proxyResult = new Proxy(instance, {
                get: function (target, prop, receiver) {
                    var originValue = Reflect.get(target, prop, receiver);
                    switch (prop) {
                        case 'constructor':
                            return originValue;
                    }
                    if (Reflect.has(target, prop) && typeof originValue === 'function') {
                        var aspectMap = aspectStoreMap.get(instance);
                        if (!aspectMap) {
                            return originValue;
                        }
                        if (aspectMap.has(prop)) {
                            return aspectMap.get(prop);
                        }
                        var aspectsOfMethod = aspectMetadata.getAspects(clazz, prop);
                        var aspectFn = createAspect(_this.appCtx, target, prop, originValue, aspectsOfMethod);
                        aspectMap.set(prop, aspectFn);
                        return aspectFn;
                    }
                    return originValue;
                }
            });
            if (process.env.NODE_ENV === 'test') {
                recordProxyTarget(proxyResult, instance);
            }
            return proxyResult;
        };
        return AOPInstantiationAwareProcessor;
    })();

    var ArgvEvaluator = /** @class */ (function () {
        function ArgvEvaluator() {}
        ArgvEvaluator.prototype.eval = function (_context, expression, args) {
            var argv = args || process.argv;
            var minimist = require('minimist');
            var map = minimist(argv);
            return map[expression];
        };
        return ArgvEvaluator;
    })();

    var EnvironmentEvaluator = /** @class */ (function () {
        function EnvironmentEvaluator() {}
        EnvironmentEvaluator.prototype.eval = function (_context, expression) {
            return process.env[expression];
        };
        return EnvironmentEvaluator;
    })();

    var JSONDataEvaluator = /** @class */ (function () {
        function JSONDataEvaluator() {
            this.namespaceDataMap = new Map();
        }
        JSONDataEvaluator.prototype.eval = function (_context, expression) {
            var colonIndex = expression.indexOf(':');
            if (colonIndex === -1) {
                throw new Error('Incorrect expression, namespace not specified');
            }
            var namespace = expression.substring(0, colonIndex);
            var exp = expression.substring(colonIndex + 1);
            if (!this.namespaceDataMap.has(namespace)) {
                throw new Error('Incorrect expression: namespace not recorded: "'.concat(namespace, '"'));
            }
            var data = this.namespaceDataMap.get(namespace);
            return runExpression(exp, data);
        };
        JSONDataEvaluator.prototype.recordData = function (namespace, data) {
            this.namespaceDataMap.set(namespace, data);
        };
        JSONDataEvaluator.prototype.getJSONData = function (namespace) {
            return this.namespaceDataMap.get(namespace);
        };
        return JSONDataEvaluator;
    })();
    function runExpression(expression, rootContext) {
        var fn = compileExpression(expression);
        return fn(rootContext);
    }
    function compileExpression(expression) {
        if (expression.indexOf(',') > -1) {
            throw new Error("Incorrect expression syntax, The ',' is not allowed in expression: \"".concat(expression, '"'));
        }
        if (expression.length > 120) {
            throw new Error(
                'Incorrect expression syntax, expression length cannot be greater than 120, but actual: '.concat(
                    expression.length
                )
            );
        }
        if (/\(.*?\)/.test(expression)) {
            throw new Error('Incorrect expression syntax, parentheses are not allowed in expression: "'.concat(expression, '"'));
        }
        expression = expression.trim();
        if (expression === '') {
            return function (root) {
                return root;
            };
        }
        var rootVarName = varName('context');
        return new Function(
            rootVarName,
            '\n        "use strict";\n        try {\n            return '
                .concat(rootVarName, '.')
                .concat(expression, ';\n        } catch(error) { throw error }\n    ')
        );
    }
    var VAR_SEQUENCE = Date.now();
    function varName(prefix) {
        return ''.concat(prefix).concat((VAR_SEQUENCE++).toString(16));
    }

    exports.Lifecycle = void 0;
    (function (Lifecycle) {
        Lifecycle['PRE_INJECT'] = 'ioc-scope:pre-inject';
        Lifecycle['POST_INJECT'] = 'ioc-scope:post-inject';
        Lifecycle['PRE_DESTROY'] = 'ioc-scope:pre-destroy';
    })(exports.Lifecycle || (exports.Lifecycle = {}));

    function invokePreDestroy(instance) {
        var clazz = instance === null || instance === void 0 ? void 0 : instance.constructor;
        if (!clazz) {
            return;
        }
        var metadata = MetadataInstanceManager.getMetadata(clazz, ClassMetadata);
        var preDestroyMethods = metadata.getMethods(exports.Lifecycle.PRE_DESTROY);
        preDestroyMethods.forEach(function (methodName) {
            var method = clazz.prototype[methodName];
            if (typeof method === 'function') {
                method.apply(instance);
            }
        });
    }

    var instanceSerialNo = -1;
    var ComponentInstanceWrapper = /** @class */ (function () {
        function ComponentInstanceWrapper(instance) {
            this.instance = instance;
            this.serialNo = ++instanceSerialNo;
        }
        ComponentInstanceWrapper.prototype.compareTo = function (other) {
            return this.serialNo > other.serialNo ? -1 : this.serialNo < other.serialNo ? 1 : 0;
        };
        return ComponentInstanceWrapper;
    })();

    var SingletonInstanceResolution = /** @class */ (function () {
        function SingletonInstanceResolution() {
            this.INSTANCE_MAP = new Map();
        }
        SingletonInstanceResolution.prototype.getInstance = function (options) {
            var _a;
            return (_a = this.INSTANCE_MAP.get(options.identifier)) === null || _a === void 0 ? void 0 : _a.instance;
        };
        SingletonInstanceResolution.prototype.saveInstance = function (options) {
            this.INSTANCE_MAP.set(options.identifier, new ComponentInstanceWrapper(options.instance));
        };
        SingletonInstanceResolution.prototype.shouldGenerate = function (options) {
            return !this.INSTANCE_MAP.has(options.identifier);
        };
        SingletonInstanceResolution.prototype.destroy = function () {
            var instanceWrappers = Array.from(this.INSTANCE_MAP.values());
            instanceWrappers.sort(function (a, b) {
                return a.compareTo(b);
            });
            instanceWrappers.forEach(function (instanceWrapper) {
                invokePreDestroy(instanceWrapper.instance);
            });
            this.INSTANCE_MAP.clear();
        };
        return SingletonInstanceResolution;
    })();

    var SINGLETON_INSTANCE_SINGLETON = new SingletonInstanceResolution();
    var GlobalSharedInstanceResolution = /** @class */ (function () {
        function GlobalSharedInstanceResolution() {}
        GlobalSharedInstanceResolution.prototype.getInstance = function (options) {
            return SINGLETON_INSTANCE_SINGLETON.getInstance(options);
        };
        GlobalSharedInstanceResolution.prototype.saveInstance = function (options) {
            SINGLETON_INSTANCE_SINGLETON.saveInstance(options);
        };
        GlobalSharedInstanceResolution.prototype.shouldGenerate = function (options) {
            return SINGLETON_INSTANCE_SINGLETON.shouldGenerate(options);
        };
        GlobalSharedInstanceResolution.prototype.destroy = function () {
            // PASS;
        };
        return GlobalSharedInstanceResolution;
    })();

    var TransientInstanceResolution = /** @class */ (function () {
        function TransientInstanceResolution() {
            this.instances = new Set();
        }
        TransientInstanceResolution.prototype.shouldGenerate = function () {
            return true;
        };
        TransientInstanceResolution.prototype.getInstance = function () {
            return;
        };
        TransientInstanceResolution.prototype.saveInstance = function (options) {
            this.instances.add(options.instance);
        };
        TransientInstanceResolution.prototype.destroy = function () {
            this.instances.forEach(function (it) {
                if (!it) {
                    return;
                }
                invokePreDestroy(it);
            });
            this.instances.clear();
        };
        TransientInstanceResolution.prototype.destroyThat = function (instance) {
            if (!this.instances.has(instance)) {
                return;
            }
            invokePreDestroy(instance);
            this.instances.delete(instance);
        };
        return TransientInstanceResolution;
    })();

    var LifecycleManager = /** @class */ (function () {
        function LifecycleManager(componentClass, container) {
            this.componentClass = componentClass;
            this.container = container;
            this.classMetadataReader = MetadataInstanceManager.getMetadata(this.componentClass, ClassMetadata).reader();
        }
        LifecycleManager.prototype.invokePreInjectMethod = function (instance) {
            var methods = this.classMetadataReader.getMethods(exports.Lifecycle.PRE_INJECT);
            this.invokeLifecycleMethods(instance, methods);
        };
        LifecycleManager.prototype.invokePostInjectMethod = function (instance) {
            var methods = this.classMetadataReader.getMethods(exports.Lifecycle.POST_INJECT);
            this.invokeLifecycleMethods(instance, methods);
        };
        LifecycleManager.prototype.invokePreDestroyInjectMethod = function (instance) {
            var methods = this.classMetadataReader.getMethods(exports.Lifecycle.PRE_DESTROY);
            this.invokeLifecycleMethods(instance, methods);
        };
        LifecycleManager.prototype.invokeLifecycleMethods = function (instance, methodKeys) {
            var _this = this;
            methodKeys.forEach(function (key) {
                _this.container.invoke(instance[key], {
                    context: instance
                });
            });
        };
        return LifecycleManager;
    })();

    var ComponentInstanceBuilder = /** @class */ (function () {
        function ComponentInstanceBuilder(componentClass, container, instAwareProcessorManager) {
            this.componentClass = componentClass;
            this.container = container;
            this.instAwareProcessorManager = instAwareProcessorManager;
            this.getConstructorArgs = function () {
                return [];
            };
            this.propertyFactories = new FactoryRecorder();
            this.lazyMode = true;
            this.lifecycleResolver = new LifecycleManager(componentClass, container);
            var reader = MetadataInstanceManager.getMetadata(componentClass, ClassMetadata).reader();
            this.classMetadataReader = reader;
            this.appendClassMetadata(reader);
        }
        ComponentInstanceBuilder.prototype.appendLazyMode = function (lazyMode) {
            this.lazyMode = lazyMode;
        };
        ComponentInstanceBuilder.prototype.appendClassMetadata = function (classMetadataReader) {
            var e_1, _a;
            var _this = this;
            var types = classMetadataReader.getConstructorParameterTypes();
            this.getConstructorArgs = function () {
                return types.map(function (it) {
                    return _this.container.getInstance(it.isNewable ? it.clazz : it.identifier);
                });
            };
            var globalMetadataReader = GlobalMetadata.getReader();
            var propertyTypes = classMetadataReader.getPropertyTypeMap();
            var _loop_1 = function (propertyName, propertyType) {
                if (propertyType.isNewable) {
                    this_1.propertyFactories.append(propertyName, function (container, owner) {
                        return function () {
                            return container.getInstance(propertyType.clazz, owner);
                        };
                    });
                    return 'continue';
                }
                var identifier = propertyType.identifier;
                var factoryDef = this_1.container.getFactory(identifier);
                if (factoryDef) {
                    this_1.propertyFactories.set(propertyName, factoryDef);
                    return 'continue';
                }
                var propertyClassMetadata = globalMetadataReader.getClassMetadata(identifier);
                if (propertyClassMetadata) {
                    this_1.propertyFactories.set(propertyName, ServiceFactoryDef.createFromClassMetadata(propertyClassMetadata));
                    return 'continue';
                }
                var propertyFactoryDef = globalMetadataReader.getComponentFactory(identifier);
                if (propertyFactoryDef) {
                    this_1.propertyFactories.set(propertyName, propertyFactoryDef);
                }
            };
            var this_1 = this;
            try {
                for (
                    var propertyTypes_1 = __values(propertyTypes), propertyTypes_1_1 = propertyTypes_1.next();
                    !propertyTypes_1_1.done;
                    propertyTypes_1_1 = propertyTypes_1.next()
                ) {
                    var _b = __read(propertyTypes_1_1.value, 2),
                        propertyName = _b[0],
                        propertyType = _b[1];
                    _loop_1(propertyName, propertyType);
                }
            } catch (e_1_1) {
                e_1 = { error: e_1_1 };
            } finally {
                try {
                    if (propertyTypes_1_1 && !propertyTypes_1_1.done && (_a = propertyTypes_1.return)) _a.call(propertyTypes_1);
                } finally {
                    if (e_1) throw e_1.error;
                }
            }
        };
        ComponentInstanceBuilder.prototype.build = function () {
            var _a, _b;
            var args = this.getConstructorArgs();
            var properties = this.createPropertiesGetterBuilder();
            var isCreatingInstAwareProcessor = this.instAwareProcessorManager.isInstAwareProcessorClass(this.componentClass);
            if (isCreatingInstAwareProcessor) {
                var instance = new ((_a = this.componentClass).bind.apply(_a, __spreadArray([void 0], __read(args), false)))();
                this.lifecycleResolver.invokePreInjectMethod(instance);
                defineProperties.call(this, instance);
                this.lifecycleResolver.invokePostInjectMethod(instance);
                return instance;
            } else {
                var instance = this.instAwareProcessorManager.beforeInstantiation(this.componentClass, args);
                if (!instance) {
                    instance = new ((_b = this.componentClass).bind.apply(_b, __spreadArray([void 0], __read(args), false)))();
                }
                this.lifecycleResolver.invokePreInjectMethod(instance);
                defineProperties.call(this, instance);
                instance = this.instAwareProcessorManager.afterInstantiation(instance);
                this.lifecycleResolver.invokePostInjectMethod(instance);
                return instance;
            }
            function defineProperties(instance) {
                var _this = this;
                properties.forEach(function (value, key) {
                    var getter = value(instance);
                    _this.defineProperty(instance, typeof key === 'number' ? ''.concat(key) : key, getter);
                });
            }
        };
        ComponentInstanceBuilder.prototype.defineProperty = function (instance, key, getter) {
            if (this.lazyMode) {
                var lazyValue_1 = lazily.value(function () {
                    return {
                        value: getter()
                    };
                });
                Object.defineProperty(instance, key, {
                    get: function () {
                        return lazyValue_1.get().value;
                    }
                });
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                instance[key] = getter();
            }
        };
        ComponentInstanceBuilder.prototype.createPropertiesGetterBuilder = function () {
            var e_2, _a;
            var _this = this;
            var result = new Map();
            var propertyTypeMap = this.classMetadataReader.getPropertyTypeMap();
            var _loop_2 = function (key, factoryDef) {
                var injectionType = propertyTypeMap.get(key);
                var isArray = !injectionType.isNewable && injectionType.clazz === Array;
                if (!isArray) {
                    if (factoryDef.factories.size > 1) {
                        throw new Error(
                            'Multiple matching injectables found for property injection,\nbut property '.concat(
                                key.toString(),
                                ' is not an array,\n                        It is ambiguous to determine which object should be injected!'
                            )
                        );
                    }
                    var _e = __read(factoryDef.factories.entries().next().value, 2),
                        factory_1 = _e[0],
                        injections_1 = _e[1];
                    result.set(key, function (instance) {
                        var producer = factory_1(_this.container, instance);
                        return function () {
                            return _this.container.invoke(producer, {
                                injections: injections_1
                            });
                        };
                    });
                } else {
                    result.set(key, function (instance) {
                        var producerAndInjections = Array.from(factoryDef.factories).map(function (_a) {
                            var _b = __read(_a, 2),
                                factory = _b[0],
                                injections = _b[1];
                            return [factory(_this.container, instance), injections];
                        });
                        return function () {
                            return producerAndInjections.map(function (_a) {
                                var _b = __read(_a, 2),
                                    producer = _b[0],
                                    injections = _b[1];
                                return _this.container.invoke(producer, {
                                    injections: injections
                                });
                            });
                        };
                    });
                }
            };
            try {
                for (var _b = __values(this.propertyFactories.iterator()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2),
                        key = _d[0],
                        factoryDef = _d[1];
                    _loop_2(key, factoryDef);
                }
            } catch (e_2_1) {
                e_2 = { error: e_2_1 };
            } finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                } finally {
                    if (e_2) throw e_2.error;
                }
            }
            return result;
        };
        return ComponentInstanceBuilder;
    })();

    var EventEmitter = /** @class */ (function () {
        function EventEmitter() {
            this.events = new Map();
        }
        EventEmitter.prototype.on = function (type, listener) {
            var listeners = this.events.get(type);
            if (listeners) {
                if (listeners.indexOf(listener) === -1) {
                    listeners.push(listener);
                }
            } else {
                listeners = [listener];
                this.events.set(type, listeners);
            }
            return function () {
                var ls = listeners;
                var index = ls.indexOf(listener);
                if (index > -1) {
                    ls.splice(index, 1);
                }
            };
        };
        EventEmitter.prototype.emit = function (type) {
            var _a;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            (_a = this.events.get(type)) === null || _a === void 0
                ? void 0
                : _a.forEach(function (fn) {
                      fn.apply(void 0, __spreadArray([], __read(args), false));
                  });
        };
        return EventEmitter;
    })();

    var InstantiationAwareProcessorManager = /** @class */ (function () {
        function InstantiationAwareProcessorManager(container) {
            var _this = this;
            this.container = container;
            this.instAwareProcessorClasses = new Set();
            this.instAwareProcessorInstances = lazily.lazy(function () {
                var globalInstAwareProcessorClasses = GlobalMetadata.getReader().getInstAwareProcessorClasses();
                var instAwareProcessorClasses = globalInstAwareProcessorClasses.concat(
                    Array.from(_this.instAwareProcessorClasses)
                );
                return instAwareProcessorClasses.map(function (it) {
                    return _this.container.getInstance(it);
                });
            });
            lazily.recreateWhen(
                this.instAwareProcessorInstances,
                lazily.when(function (t) {
                    return t.or(
                        t.changed(function () {
                            return _this.instAwareProcessorClasses.size;
                        }),
                        t.changed(function () {
                            return GlobalMetadata.getReader().getInstAwareProcessorClasses().length;
                        })
                    );
                })
            );
        }
        InstantiationAwareProcessorManager.prototype.appendInstAwareProcessorClass = function (instAwareProcessorClass) {
            this.instAwareProcessorClasses.add(instAwareProcessorClass);
        };
        InstantiationAwareProcessorManager.prototype.appendInstAwareProcessorClasses = function (instAwareProcessorClasses) {
            var _this = this;
            instAwareProcessorClasses.forEach(function (it) {
                _this.instAwareProcessorClasses.add(it);
            });
        };
        InstantiationAwareProcessorManager.prototype.beforeInstantiation = function (componentClass, args) {
            var instAwareProcessors = this.instAwareProcessorInstances;
            var instance;
            instAwareProcessors.some(function (processor) {
                if (!processor.beforeInstantiation) {
                    return false;
                }
                instance = processor.beforeInstantiation(componentClass, args);
                return !!instance;
            });
            return instance;
        };
        InstantiationAwareProcessorManager.prototype.afterInstantiation = function (instance) {
            return this.instAwareProcessorInstances.reduce(function (instance, processor) {
                if (processor.afterInstantiation) {
                    var result = processor.afterInstantiation(instance);
                    if (result) {
                        return result;
                    }
                }
                return instance;
            }, instance);
        };
        InstantiationAwareProcessorManager.prototype.isInstAwareProcessorClass = function (cls) {
            var classes = this.getInstAwareProcessorClasses();
            return classes.indexOf(cls) > -1;
        };
        InstantiationAwareProcessorManager.prototype.getInstAwareProcessorClasses = function () {
            var globalInstAwareProcessorClasses = GlobalMetadata.getInstance().reader().getInstAwareProcessorClasses();
            return globalInstAwareProcessorClasses.concat(Array.from(this.instAwareProcessorClasses));
        };
        return InstantiationAwareProcessorManager;
    })();

    function hasArgs(options) {
        return 'args' in options;
    }
    function hasInjections(options) {
        return 'injections' in options;
    }

    var PRE_DESTROY_EVENT_KEY = 'container:event:pre-destroy';
    var PRE_DESTROY_THAT_EVENT_KEY = 'container:event:pre-destroy-that';
    var INSTANCE_PRE_DESTROY_METHOD = Symbol('solidium:instance-pre-destroy');
    var ApplicationContext = /** @class */ (function () {
        function ApplicationContext(options) {
            if (options === void 0) {
                options = {};
            }
            var _a;
            this.resolutions = new Map();
            this.factories = new FactoryRecorder();
            this.evaluatorClasses = new Map();
            this.eventEmitter = new EventEmitter();
            this.isDestroyed = false;
            this.defaultScope = options.defaultScope || exports.InstanceScope.SINGLETON;
            this.lazyMode = (_a = options.lazyMode) !== null && _a !== void 0 ? _a : true;
            this.registerInstanceScopeResolution(exports.InstanceScope.SINGLETON, SingletonInstanceResolution);
            this.registerInstanceScopeResolution(exports.InstanceScope.GLOBAL_SHARED_SINGLETON, GlobalSharedInstanceResolution);
            this.registerInstanceScopeResolution(exports.InstanceScope.TRANSIENT, TransientInstanceResolution);
            this.registerEvaluator(exports.ExpressionType.JSON_PATH, JSONDataEvaluator);
            if (isNodeJs) {
                this.registerEvaluator(exports.ExpressionType.ENV, EnvironmentEvaluator);
                this.registerEvaluator(exports.ExpressionType.ARGV, ArgvEvaluator);
            }
            this.instAwareProcessorManager = new InstantiationAwareProcessorManager(this);
            this.registerInstAwareProcessor(AOPInstantiationAwareProcessor.create(this));
        }
        ApplicationContext.prototype.getInstance = function (symbol, owner) {
            if (typeof symbol === 'string' || typeof symbol === 'symbol') {
                return this.getInstanceBySymbol(symbol, owner);
            }
            return this.getInstanceByClass(symbol, owner);
        };
        ApplicationContext.prototype.getInstanceBySymbol = function (symbol, owner) {
            var _this = this;
            var factoryDef = this.getFactory(symbol);
            if (factoryDef) {
                var producer = factoryDef.produce(this, owner);
                var resolution_1 = this.getScropeResolutionInstance(factoryDef.scope);
                if (
                    !resolution_1.shouldGenerate({
                        identifier: symbol,
                        owner: owner
                    })
                ) {
                    return resolution_1.getInstance({
                        identifier: symbol,
                        owner: owner
                    });
                }
                var instances = producer();
                var results = instances.map(function (it) {
                    _this.attachPreDestroyHook(it);
                    var constr = it === null || it === void 0 ? void 0 : it.constructor;
                    if (typeof constr === 'function') {
                        var componentClass = constr;
                        var resolver = new LifecycleManager(componentClass, _this);
                        var isInstAwareProcessor = _this.instAwareProcessorManager.isInstAwareProcessorClass(componentClass);
                        resolver.invokePreInjectMethod(it);
                        if (!isInstAwareProcessor) {
                            it = _this.instAwareProcessorManager.afterInstantiation(it);
                        }
                        resolver.invokePostInjectMethod(it);
                    }
                    resolution_1.saveInstance({
                        identifier: symbol,
                        instance: it
                    });
                    return it;
                });
                return results.length === 1 ? results[0] : results;
            } else {
                var classMetadata = GlobalMetadata.getInstance().reader().getClassMetadata(symbol);
                if (!classMetadata) {
                    throw new Error('Class alias not found: '.concat(symbol.toString()));
                } else {
                    var clazz = classMetadata.reader().getClass();
                    return this.getInstanceByClass(clazz, owner);
                }
            }
        };
        ApplicationContext.prototype.getInstanceByClass = function (componentClass, owner) {
            if (componentClass === ApplicationContext) {
                return this;
            }
            var reader = ClassMetadata.getInstance(componentClass).reader();
            var scope = reader.getScope();
            var resolution =
                this.resolutions.get(scope !== null && scope !== void 0 ? scope : this.defaultScope) ||
                this.resolutions.get(this.defaultScope);
            var getInstanceOptions = {
                identifier: componentClass,
                owner: owner,
                ownerPropertyKey: undefined
            };
            if (resolution.shouldGenerate(getInstanceOptions)) {
                var builder = this.createComponentInstanceBuilder(componentClass);
                var instance = builder.build();
                var saveInstanceOptions = __assign(__assign({}, getInstanceOptions), { instance: instance });
                resolution.saveInstance(saveInstanceOptions);
                this.attachPreDestroyHook(instance);
                return instance;
            } else {
                return resolution.getInstance(getInstanceOptions);
            }
        };
        ApplicationContext.prototype.attachPreDestroyHook = function (instances) {
            var _this = this;
            var instancesArray = Array.isArray(instances) ? instances : [instances];
            instancesArray.forEach(function (it) {
                var instance = it;
                if (typeof instance !== 'object' || instance === null) {
                    return;
                }
                if (Reflect.has(instance, INSTANCE_PRE_DESTROY_METHOD)) {
                    return;
                }
                var clazz = instance.constructor;
                if (!clazz) {
                    return;
                }
                var metadata = MetadataInstanceManager.getMetadata(instance.constructor, ClassMetadata);
                metadata.addLifecycleMethod(INSTANCE_PRE_DESTROY_METHOD, exports.Lifecycle.PRE_DESTROY);
                Reflect.set(instance, INSTANCE_PRE_DESTROY_METHOD, function () {
                    _this.eventEmitter.emit(PRE_DESTROY_EVENT_KEY, instance);
                });
            });
        };
        ApplicationContext.prototype.createComponentInstanceBuilder = function (componentClass) {
            var builder = new ComponentInstanceBuilder(componentClass, this, this.instAwareProcessorManager);
            builder.appendLazyMode(this.lazyMode);
            return builder;
        };
        ApplicationContext.prototype.getFactory = function (key) {
            var factory = GlobalMetadata.getInstance().reader().getComponentFactory(key);
            if (!factory) {
                return this.factories.get(key);
            }
            return factory;
        };
        ApplicationContext.prototype.bindFactory = function (symbol, factory, injections, scope) {
            if (scope === void 0) {
                scope = exports.InstanceScope.SINGLETON;
            }
            this.factories.append(symbol, factory, injections, scope);
        };
        ApplicationContext.prototype.invoke = function (func, options) {
            var _this = this;
            if (options === void 0) {
                options = {};
            }
            var fn;
            if (arguments.length > 1) {
                fn = func.bind(options.context);
            } else {
                fn = func;
            }
            if (hasArgs(options)) {
                return options.args ? fn.apply(void 0, __spreadArray([], __read(options.args), false)) : fn();
            }
            var argsIndentifiers = [];
            if (hasInjections(options)) {
                argsIndentifiers = options.injections;
            } else {
                var metadata = MetadataInstanceManager.getMetadata(fn, FunctionMetadata).reader();
                argsIndentifiers = metadata.getParameters();
            }
            var args = argsIndentifiers.map(function (identifier, index) {
                var instance = _this.getInstance(identifier);
                if (Array.isArray(instance)) {
                    var isArrayType = identifier === Array;
                    if (isArrayType) {
                        return instance;
                    }
                    if (instance.length > 1) {
                        throw new Error('Multiple matching injectables found for parameter at '.concat(index, '.'));
                    }
                    return instance[0];
                }
                return instance;
            });
            return args.length > 0 ? fn.apply(void 0, __spreadArray([], __read(args), false)) : fn();
        };
        ApplicationContext.prototype.destroy = function () {
            if (this.isDestroyed) {
                return;
            }
            this.isDestroyed = true;
            this.eventEmitter.emit(PRE_DESTROY_EVENT_KEY);
            this.resolutions.forEach(function (it) {
                it.destroy();
            });
        };
        ApplicationContext.prototype.evaluate = function (expression, options) {
            var evaluatorClass = this.evaluatorClasses.get(options.type);
            if (!evaluatorClass) {
                throw new TypeError('Unknown evaluator name: '.concat(options.type));
            }
            var evaluator = this.getInstance(evaluatorClass);
            return evaluator.eval(this, expression, options.externalArgs);
        };
        ApplicationContext.prototype.recordJSONData = function (namespace, data) {
            var evaluator = this.getInstance(JSONDataEvaluator);
            evaluator.recordData(namespace, data);
        };
        ApplicationContext.prototype.getJSONData = function (namespace) {
            var evaluator = this.getInstance(JSONDataEvaluator);
            return evaluator.getJSONData(namespace);
        };
        ApplicationContext.prototype.bindInstance = function (identifier, instance) {
            var resolution = this.resolutions.get(exports.InstanceScope.SINGLETON);
            resolution === null || resolution === void 0
                ? void 0
                : resolution.saveInstance({
                      identifier: identifier,
                      instance: instance
                  });
        };
        ApplicationContext.prototype.registerInstanceScopeResolution = function (scope, resolutionConstructor, constructorArgs) {
            this.resolutions.set(
                scope,
                new (resolutionConstructor.bind.apply(
                    resolutionConstructor,
                    __spreadArray(
                        [void 0],
                        __read(constructorArgs !== null && constructorArgs !== void 0 ? constructorArgs : []),
                        false
                    )
                ))()
            );
        };
        ApplicationContext.prototype.getScropeResolutionInstance = function (scope) {
            var _a;
            return (_a = this.resolutions.get(scope)) !== null && _a !== void 0 ? _a : this.resolutions.get(this.defaultScope);
        };
        ApplicationContext.prototype.registerEvaluator = function (name, evaluatorClass) {
            var metadata = MetadataInstanceManager.getMetadata(evaluatorClass, ClassMetadata);
            metadata.setScope(exports.InstanceScope.SINGLETON);
            this.evaluatorClasses.set(name, evaluatorClass);
        };
        /**
         * @description Registers an InstantiationAwareProcessor class to customize
         *      the instantiation process at various stages within the IoC
         * @deprecated Replaced with {@link registerBeforeInstantiationProcessor} and {@link registerAfterInstantiationProcessor}
         * @param {Newable<PartialInstAwareProcessor>} clazz
         * @see InstantiationAwareProcessor
         * @since 1.0.0
         */
        ApplicationContext.prototype.registerInstAwareProcessor = function (clazz) {
            this.instAwareProcessorManager.appendInstAwareProcessorClass(clazz);
        };
        ApplicationContext.prototype.registerBeforeInstantiationProcessor = function (processor) {
            this.instAwareProcessorManager.appendInstAwareProcessorClass(
                /** @class */ (function () {
                    function InnerProcessor() {}
                    InnerProcessor.prototype.beforeInstantiation = function (constructor, args) {
                        return processor(constructor, args);
                    };
                    return InnerProcessor;
                })()
            );
        };
        ApplicationContext.prototype.registerAfterInstantiationProcessor = function (processor) {
            this.instAwareProcessorManager.appendInstAwareProcessorClass(
                /** @class */ (function () {
                    function InnerProcessor() {}
                    InnerProcessor.prototype.afterInstantiation = function (instance) {
                        return processor(instance);
                    };
                    return InnerProcessor;
                })()
            );
        };
        ApplicationContext.prototype.onPreDestroy = function (listener) {
            return this.eventEmitter.on(PRE_DESTROY_EVENT_KEY, listener);
        };
        ApplicationContext.prototype.onPreDestroyThat = function (listener) {
            return this.eventEmitter.on(PRE_DESTROY_THAT_EVENT_KEY, listener);
        };
        ApplicationContext.prototype.getClassMetadata = function (ctor) {
            return ClassMetadata.getReader(ctor);
        };
        ApplicationContext.prototype.destroyTransientInstance = function (instance) {
            var _a;
            var resolution = this.resolutions.get(exports.InstanceScope.TRANSIENT);
            (_a = resolution === null || resolution === void 0 ? void 0 : resolution.destroyThat) === null || _a === void 0
                ? void 0
                : _a.call(resolution, instance);
        };
        return ApplicationContext;
    })();

    function Factory(produceIdentifier, scope) {
        if (scope === void 0) {
            scope = exports.InstanceScope.SINGLETON;
        }
        return function (target, propertyKey) {
            var metadata = GlobalMetadata.getInstance();
            var clazz = target.constructor;
            if (isNotDefined(produceIdentifier)) {
                produceIdentifier = Reflect.getMetadata('design:returntype', target, propertyKey);
            }
            if (isNotDefined(produceIdentifier)) {
                throw new Error('The return type not recognized, cannot perform instance creation!');
            }
            var injections = Reflect.getMetadata('design:paramtypes', target, propertyKey);
            metadata.recordFactory(
                produceIdentifier,
                function (container, owner) {
                    var instance = container.getInstance(clazz, owner);
                    var func = instance[propertyKey];
                    if (typeof func === 'function') {
                        return function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            var instance = container.getInstance(clazz);
                            return func.apply(instance, args);
                        };
                    } else {
                        return function () {
                            return func;
                        };
                    }
                },
                injections,
                scope
            );
        };
    }

    function Generate(generator) {
        return function (target, propertyKey) {
            var metadata = MetadataInstanceManager.getMetadata(target.constructor, ClassMetadata);
            var value_symbol = Symbol('');
            metadata.recordPropertyType(propertyKey, InjectionType.ofIdentifier(value_symbol));
            GlobalMetadata.getInstance().recordFactory(value_symbol, function (container, owner) {
                return function () {
                    return generator.call(owner, container);
                };
            });
        };
    }

    function Inject(identifier) {
        return function (target, propertyKey, parameterIndex) {
            var injectClass;
            if (typeof target === 'function' && typeof parameterIndex === 'number') {
                // constructor parameter
                var targetConstr = target;
                if (typeof identifier === 'function') {
                    injectClass = identifier;
                } else {
                    injectClass = Reflect.getMetadata('design:paramtypes', target, propertyKey)[parameterIndex];
                }
                if (isNotDefined(injectClass)) {
                    throw new Error('Type not recognized, injection cannot be performed');
                }
                var classMetadata = MetadataInstanceManager.getMetadata(targetConstr, ClassMetadata);
                classMetadata.setConstructorParameterType(parameterIndex, InjectionType.of(injectClass, identifier));
            } else if (typeof target === 'object' && target !== null && propertyKey !== undefined) {
                var injectClass_1;
                if (typeof identifier === 'function') {
                    injectClass_1 = identifier;
                } else {
                    injectClass_1 = Reflect.getMetadata('design:type', target, propertyKey);
                }
                var metadata = MetadataInstanceManager.getMetadata(target.constructor, ClassMetadata);
                if (isNotDefined(injectClass_1)) {
                    if (identifier && typeof identifier !== 'function') {
                        var factoryDef = GlobalMetadata.getInstance().reader().getComponentFactory(identifier);
                        if (factoryDef) {
                            metadata.recordPropertyType(propertyKey, InjectionType.ofIdentifier(identifier));
                            return;
                        }
                    }
                    throw new Error('Type not recognized, injection cannot be performed');
                } else {
                    metadata.recordPropertyType(propertyKey, InjectionType.of(injectClass_1, identifier));
                }
            }
        };
    }

    /**
     * This decorator is typically used to identify classes that need to be configured within the IoC container.
     * In most cases, @Injectable can be omitted unless explicit configuration is required.
     */
    function Injectable(options) {
        return function (target) {
            if (typeof (options === null || options === void 0 ? void 0 : options.produce) === 'undefined') {
                return target;
            }
            var metadata = GlobalMetadata.getInstance();
            var produces = Array.isArray(options.produce) ? options.produce : [options.produce];
            var classMetadata = MetadataInstanceManager.getMetadata(target, ClassMetadata);
            produces.forEach(function (produce) {
                var _a, _b;
                metadata.recordFactory(
                    produce,
                    function (container, owner) {
                        return function () {
                            var instance = container.getInstance(target, owner);
                            return instance;
                        };
                    },
                    [],
                    (_b = (_a = classMetadata.reader().getScope()) !== null && _a !== void 0 ? _a : options.scope) !== null &&
                        _b !== void 0
                        ? _b
                        : exports.InstanceScope.SINGLETON
                );
            });
            return target;
        };
    }

    function InstAwareProcessor() {
        return function (target) {
            GlobalMetadata.getInstance().recordProcessorClass(target);
            return target;
        };
    }

    function JSONData(namespace, jsonpath) {
        return Value(''.concat(namespace, ':').concat(jsonpath), exports.ExpressionType.JSON_PATH);
    }

    /**
     * Urn calls the methods annotated with @PostInject only once, just after the injection of properties.
     * @annotation
     */
    var LifecycleDecorator = function (lifecycle) {
        return function (target, propertyKey) {
            var metadata = MetadataInstanceManager.getMetadata(target.constructor, ClassMetadata);
            metadata.addLifecycleMethod(propertyKey, lifecycle);
        };
    };

    function Mark(key, value) {
        if (value === void 0) {
            value = true;
        }
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args.length === 1) {
                // class decorator
                var metadata = MetadataInstanceManager.getMetadata(args[0], ClassMetadata);
                metadata.marker().ctor(key, value);
            } else if (args.length === 2) {
                // property decorator
                var _a = __read(args, 2),
                    prototype = _a[0],
                    propertyKey = _a[1];
                var metadata = MetadataInstanceManager.getMetadata(prototype.constructor, ClassMetadata);
                metadata.marker().member(propertyKey).mark(key, value);
            } else if (args.length === 3 && typeof args[2] === 'number') {
                // parameter decorator
                var _b = __read(args, 3),
                    prototype = _b[0],
                    propertyKey = _b[1],
                    index = _b[2];
                var metadata = MetadataInstanceManager.getMetadata(prototype.constructor, ClassMetadata);
                metadata.marker().parameter(propertyKey, index).mark(key, value);
            } else {
                // method decorator
                var _c = __read(args, 2),
                    prototype = _c[0],
                    propertyKey = _c[1];
                var metadata = MetadataInstanceManager.getMetadata(prototype.constructor, ClassMetadata);
                metadata.marker().member(propertyKey).mark(key, value);
            }
        };
    }

    /**
     * Urn calls the methods annotated with @PostInject only once, just after the injection of properties.
     * @annotation
     */
    var PostInject = function () {
        return LifecycleDecorator(exports.Lifecycle.POST_INJECT);
    };

    var PreDestroy = function () {
        return LifecycleDecorator(exports.Lifecycle.PRE_DESTROY);
    };

    /**
     * Urn calls the methods annotated with @PostInject only once, just after the injection of properties.
     * @annotation
     */
    var PreInject = function () {
        return LifecycleDecorator(exports.Lifecycle.PRE_INJECT);
    };

    function Scope(scope) {
        return function (target) {
            var metadata = MetadataInstanceManager.getMetadata(target, ClassMetadata);
            metadata.setScope(scope);
        };
    }

    function createFactoryWrapper(produceIdentifier, produce, owner) {
        var TheFactory = /** @class */ (function () {
            function TheFactory() {}
            TheFactory.prototype.produce = function () {
                return produce;
            };
            TheFactory.preventTreeShaking = function () {
                return owner;
            };
            __decorate(
                [
                    Factory(produceIdentifier),
                    __metadata('design:type', Function),
                    __metadata('design:paramtypes', []),
                    __metadata('design:returntype', void 0)
                ],
                TheFactory.prototype,
                'produce',
                null
            );
            return TheFactory;
        })();
        return TheFactory.preventTreeShaking();
    }

    exports.AOPClassMetadata = AOPClassMetadata;
    exports.After = After;
    exports.AfterReturn = AfterReturn;
    exports.Alias = Alias;
    exports.ApplicationContext = ApplicationContext;
    exports.Argv = Argv;
    exports.Around = Around;
    exports.Before = Before;
    exports.Bind = Bind;
    exports.ClassMetadata = ClassMetadata;
    exports.ComponentMethodAspect = ComponentMethodAspect;
    exports.Env = Env;
    exports.FUNCTION_METADATA_KEY = FUNCTION_METADATA_KEY;
    exports.Factory = Factory;
    exports.Finally = Finally;
    exports.FunctionMetadata = FunctionMetadata;
    exports.Generate = Generate;
    exports.GlobalMetadata = GlobalMetadata;
    exports.Inject = Inject;
    exports.Injectable = Injectable;
    exports.InjectionType = InjectionType;
    exports.InstAwareProcessor = InstAwareProcessor;
    exports.JSONData = JSONData;
    exports.LifecycleDecorator = LifecycleDecorator;
    exports.Mark = Mark;
    exports.MarkInfoContainer = MarkInfoContainer;
    exports.ParameterMarkInfoContainer = ParameterMarkInfoContainer;
    exports.Pointcut = Pointcut;
    exports.PostInject = PostInject;
    exports.PreDestroy = PreDestroy;
    exports.PreInject = PreInject;
    exports.Scope = Scope;
    exports.Thrown = Thrown;
    exports.UseAspects = UseAspects;
    exports.Value = Value;
    exports.createFactoryWrapper = createFactoryWrapper;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudW1kLmpzIiwic291cmNlcyI6WyIuLi9zcmMvYW9wL0FkdmljZS50cyIsIi4uL3NyYy9jb21tb24vRGVmYXVsdFZhbHVlTWFwLnRzIiwiLi4vc3JjL2FvcC9BT1BDbGFzc01ldGFkYXRhLnRzIiwiLi4vc3JjL2FvcC9Db21wb25lbnRNZXRob2RBc3BlY3QudHMiLCIuLi9zcmMvYW9wL0FzcGVjdE1ldGFkdGEudHMiLCIuLi9zcmMvYW9wL2FkZEFzcGVjdC50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9BZnRlci50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9BZnRlclJldHVybi50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9Bcm91bmQudHMiLCIuLi9zcmMvYW9wL2RlY29yYXRvcnMvQmVmb3JlLnRzIiwiLi4vc3JjL2FvcC9kZWNvcmF0b3JzL0ZpbmFsbHkudHMiLCIuLi9zcmMvYW9wL2RlY29yYXRvcnMvVGhyb3duLnRzIiwiLi4vc3JjL2NvbW1vbi9nZXRBbGxNZXRob2RNZW1iZXJOYW1lcy50cyIsIi4uL3NyYy9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlci50cyIsIi4uL3NyYy9tZXRhZGF0YS9DbGFzc01ldGFkYXRhLnRzIiwiLi4vc3JjL21ldGFkYXRhL0Z1bmN0aW9uTWV0YWRhdGEudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9JbnN0YW5jZVNjb3BlLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vU2VydmljZUZhY3RvcnlEZWYudHMiLCIuLi9zcmMvY29tbW9uL0ZhY3RvcnlSZWNvcmRlci50cyIsIi4uL3NyYy9tZXRhZGF0YS9HbG9iYWxNZXRhZGF0YS50cyIsIi4uL3NyYy9hb3AvUG9pbnRjdXQudHMiLCIuLi9zcmMvYW9wL2RlY29yYXRvcnMvVXNlQXNwZWN0cy50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0FsaWFzLnRzIiwiLi4vc3JjL3R5cGVzL0V2YWx1YXRlT3B0aW9ucy50cyIsIi4uL3NyYy9jb21tb24vaXNOb2RlSnMudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9JbmplY3Rpb25UeXBlLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvVmFsdWUudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9Bcmd2LnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvQmluZC50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0Vudi50cyIsIi4uL3NyYy9jb21tb24vaXNOb3REZWZpbmVkLnRzIiwiLi4vc3JjL2NvbW1vbi9Qcm94eVRhcmdldFJlY29yZGVyLnRzIiwiLi4vc3JjL2FvcC9Bc3BlY3RVdGlscy50cyIsIi4uL3NyYy9hb3AvY3JlYXRlQXNwZWN0LnRzIiwiLi4vc3JjL2FvcC9BT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3IudHMiLCIuLi9zcmMvZXZhbHVhdG9yL0FyZ3ZFdmFsdWF0b3IudHMiLCIuLi9zcmMvZXZhbHVhdG9yL0Vudmlyb25tZW50RXZhbHVhdG9yLnRzIiwiLi4vc3JjL2V2YWx1YXRvci9KU09ORGF0YUV2YWx1YXRvci50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0xpZmVjeWNsZS50cyIsIi4uL3NyYy9jb21tb24vaW52b2tlUHJlRGVzdHJveS50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0NvbXBvbmVudEluc3RhbmNlV3JhcHBlci50cyIsIi4uL3NyYy9yZXNvbHV0aW9uL1NpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbi50cyIsIi4uL3NyYy9yZXNvbHV0aW9uL0dsb2JhbFNoYXJlZEluc3RhbmNlUmVzb2x1dGlvbi50cyIsIi4uL3NyYy9yZXNvbHV0aW9uL1RyYW5zaWVudEluc3RhbmNlUmVzb2x1dGlvbi50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0xpZmVjeWNsZU1hbmFnZXIudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9Db21wb25lbnRJbnN0YW5jZUJ1aWxkZXIudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9FdmVudEVtaXR0ZXIudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9JbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vSW52b2tlRnVuY3Rpb25PcHRpb25zLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vQXBwbGljYXRpb25Db250ZXh0LnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvRmFjdG9yeS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0dlbmVyYXRlLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvSW5qZWN0LnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvSW5qZWN0YWJsZS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0luc3RBd2FyZVByb2Nlc3Nvci50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0pTT05EYXRhLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvTGlmZWN5Y2xlRGVjb3JhdG9yLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvTWFyay50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL1Bvc3RJbmplY3QudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9QcmVEZXN0cm95LnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvUHJlSW5qZWN0LnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvU2NvcGUudHMiLCIuLi9zcmMvdXRpbHMvY3JlYXRlRmFjdG9yeVdyYXBwZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGVudW0gQWR2aWNlIHtcbiAgICBCZWZvcmUsXG4gICAgQWZ0ZXIsXG4gICAgQXJvdW5kLFxuICAgIEFmdGVyUmV0dXJuLFxuICAgIFRocm93bixcbiAgICBGaW5hbGx5XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gY3JlYXRlRGVmYXVsdFZhbHVlTWFwPEssIFY+KGZhY3Rvcnk6IChrZXk6IEspID0+IFYpIHtcbiAgICBjb25zdCBtYXAgPSBuZXcgTWFwPEssIFY+KCk7XG4gICAgY29uc3Qgb3JpZ2luR2V0ID0gbWFwLmdldC5iaW5kKG1hcCk7XG4gICAgbWFwLmdldCA9IChrZXk6IEspID0+IHtcbiAgICAgICAgaWYgKG1hcC5oYXMoa2V5KSkge1xuICAgICAgICAgICAgcmV0dXJuIG9yaWdpbkdldChrZXkpIGFzIFY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0VmFsdWUgPSBmYWN0b3J5KGtleSk7XG4gICAgICAgICAgICBtYXAuc2V0KGtleSwgZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBtYXAuZ2V0KGtleSkgYXMgVjtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIG1hcCBhcyBEZWZhdWx0VmFsdWVNYXA8SywgVj47XG59XG5leHBvcnQgdHlwZSBEZWZhdWx0VmFsdWVNYXA8SywgVj4gPSBPbWl0PE1hcDxLLCBWPiwgJ2dldCc+ICYge1xuICAgIGdldDogKGtleTogSykgPT4gVjtcbn07XG4iLCJpbXBvcnQgeyBjcmVhdGVEZWZhdWx0VmFsdWVNYXAsIHR5cGUgRGVmYXVsdFZhbHVlTWFwIH0gZnJvbSAnLi4vY29tbW9uL0RlZmF1bHRWYWx1ZU1hcCc7XG5pbXBvcnQgdHlwZSB7IE1ldGFkYXRhLCBNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4uL3R5cGVzL01ldGFkYXRhJztcbmltcG9ydCB0eXBlIHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHR5cGUgeyBBZHZpY2UgfSBmcm9tICcuL0FkdmljZSc7XG5pbXBvcnQgdHlwZSB7IEFzcGVjdCB9IGZyb20gJy4vQXNwZWN0JztcblxuZXhwb3J0IHR5cGUgVXNlQXNwZWN0TWFwID0gRGVmYXVsdFZhbHVlTWFwPHN0cmluZyB8IHN5bWJvbCwgRGVmYXVsdFZhbHVlTWFwPEFkdmljZSwgQXJyYXk8TmV3YWJsZTxBc3BlY3Q+Pj4+O1xuXG5leHBvcnQgaW50ZXJmYWNlIFVzZUFzcGVjdE1ldGFkYXRhUmVhZGVyIGV4dGVuZHMgTWV0YWRhdGFSZWFkZXIge1xuICAgIGdldEFzcGVjdHMoKTogVXNlQXNwZWN0TWFwO1xuICAgIGdldEFzcGVjdHNPZihtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2wsIGFkdmljZTogQWR2aWNlKTogQXJyYXk8TmV3YWJsZTxBc3BlY3Q+Pjtcbn1cbmV4cG9ydCBjbGFzcyBBT1BDbGFzc01ldGFkYXRhIGltcGxlbWVudHMgTWV0YWRhdGE8VXNlQXNwZWN0TWV0YWRhdGFSZWFkZXIsIE5ld2FibGU8dW5rbm93bj4+IHtcbiAgICBzdGF0aWMgZ2V0UmVmbGVjdEtleSgpIHtcbiAgICAgICAgcmV0dXJuICdhb3A6dXNlLWFzcGVjdC1tZXRhZGF0YSc7XG4gICAgfVxuICAgIHByaXZhdGUgYXNwZWN0TWFwOiBVc2VBc3BlY3RNYXAgPSBjcmVhdGVEZWZhdWx0VmFsdWVNYXAoKCkgPT4gY3JlYXRlRGVmYXVsdFZhbHVlTWFwKCgpID0+IFtdKSk7XG4gICAgaW5pdCgpOiB2b2lkIHtcbiAgICAgICAgLy8gSUdOT1JFXG4gICAgfVxuXG4gICAgYXBwZW5kKG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCwgYWR2aWNlOiBBZHZpY2UsIGFzcGVjdHM6IEFycmF5PE5ld2FibGU8QXNwZWN0Pj4pIHtcbiAgICAgICAgY29uc3QgYWR2aWNlQXNwZWN0TWFwID0gdGhpcy5hc3BlY3RNYXAuZ2V0KG1ldGhvZE5hbWUpO1xuICAgICAgICBjb25zdCBleGl0aW5nQXNwZWN0QXJyYXkgPSBhZHZpY2VBc3BlY3RNYXAuZ2V0KGFkdmljZSk7XG4gICAgICAgIGV4aXRpbmdBc3BlY3RBcnJheS5wdXNoKC4uLmFzcGVjdHMpO1xuICAgIH1cblxuICAgIHJlYWRlcigpOiBVc2VBc3BlY3RNZXRhZGF0YVJlYWRlciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXRBc3BlY3RzOiAoKTogVXNlQXNwZWN0TWFwID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3BlY3RNYXA7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0QXNwZWN0c09mOiAobWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sLCBhZHZpY2U6IEFkdmljZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzcGVjdE1hcC5nZXQobWV0aG9kTmFtZSkuZ2V0KGFkdmljZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSAqL1xuXG5pbXBvcnQgdHlwZSB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB0eXBlIHsgQXNwZWN0LCBKb2luUG9pbnQgfSBmcm9tICcuL0FzcGVjdCc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb21wb25lbnRNZXRob2RBc3BlY3QgaW1wbGVtZW50cyBBc3BlY3Qge1xuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKGNsYXp6OiBOZXdhYmxlPHVua25vd24+LCBtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2wpOiBOZXdhYmxlPEFzcGVjdD4ge1xuICAgICAgICByZXR1cm4gY2xhc3MgQ29tcG9uZW50TWV0aG9kQXNwZWN0SW1wbCBleHRlbmRzIENvbXBvbmVudE1ldGhvZEFzcGVjdCB7XG4gICAgICAgICAgICBleGVjdXRlKGpwOiBKb2luUG9pbnQpOiBhbnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFzcGVjdEluc3RhbmNlID0ganAuY3R4LmdldEluc3RhbmNlKGNsYXp6KSBhcyBhbnk7XG4gICAgICAgICAgICAgICAgY29uc3QgZnVuYyA9IGFzcGVjdEluc3RhbmNlW21ldGhvZE5hbWVdO1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpcy5hc3BlY3RJbnN0YW5jZSwganApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgYXNwZWN0SW5zdGFuY2UhOiBhbnk7XG4gICAgYWJzdHJhY3QgZXhlY3V0ZShjdHg6IEpvaW5Qb2ludCk6IGFueTtcbn1cbiIsImltcG9ydCB0eXBlIHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB0eXBlIHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHR5cGUgeyBNZXRhZGF0YSwgTWV0YWRhdGFSZWFkZXIgfSBmcm9tICcuLi90eXBlcy9NZXRhZGF0YSc7XG5pbXBvcnQgdHlwZSB7IEFkdmljZSB9IGZyb20gJy4vQWR2aWNlJztcbmltcG9ydCB7IENvbXBvbmVudE1ldGhvZEFzcGVjdCB9IGZyb20gJy4vQ29tcG9uZW50TWV0aG9kQXNwZWN0JztcbmltcG9ydCB0eXBlIHsgUG9pbnRjdXQgfSBmcm9tICcuL1BvaW50Y3V0JztcblxuZXhwb3J0IGludGVyZmFjZSBBc3BlY3RJbmZvIHtcbiAgICBhc3BlY3RDbGFzczogTmV3YWJsZTx1bmtub3duPjtcbiAgICBtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2w7XG4gICAgcG9pbnRjdXQ6IFBvaW50Y3V0O1xuICAgIGFkdmljZTogQWR2aWNlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFzcGVjdE1ldGFkYXRhUmVhZGVyIGV4dGVuZHMgTWV0YWRhdGFSZWFkZXIge1xuICAgIGdldEFzcGVjdHMoanBJZGVudGlmaWVyOiBJZGVudGlmaWVyLCBqcE1lbWJlcjogc3RyaW5nIHwgc3ltYm9sKTogQXNwZWN0SW5mb1tdO1xufVxuXG5leHBvcnQgY2xhc3MgQXNwZWN0TWV0YWRhdGEgaW1wbGVtZW50cyBNZXRhZGF0YTxBc3BlY3RNZXRhZGF0YVJlYWRlciwgdm9pZD4ge1xuICAgIHByaXZhdGUgc3RhdGljIElOU1RBTkNFID0gbmV3IEFzcGVjdE1ldGFkYXRhKCk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBhc3BlY3RzOiBBc3BlY3RJbmZvW10gPSBbXTtcbiAgICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCkge1xuICAgICAgICByZXR1cm4gQXNwZWN0TWV0YWRhdGEuSU5TVEFOQ0U7XG4gICAgfVxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8vXG4gICAgfVxuICAgIGluaXQoKTogdm9pZCB7XG4gICAgICAgIC8vXG4gICAgfVxuICAgIGFwcGVuZChjb21wb25lbnRBc3BlY3RDbGFzczogTmV3YWJsZTx1bmtub3duPiwgbWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sLCBhZHZpY2U6IEFkdmljZSwgcG9pbnRjdXQ6IFBvaW50Y3V0KSB7XG4gICAgICAgIGNvbnN0IEFzcGVjdENsYXNzID0gQ29tcG9uZW50TWV0aG9kQXNwZWN0LmNyZWF0ZShjb21wb25lbnRBc3BlY3RDbGFzcywgbWV0aG9kTmFtZSk7XG4gICAgICAgIHRoaXMuYXNwZWN0cy5wdXNoKHtcbiAgICAgICAgICAgIGFzcGVjdENsYXNzOiBBc3BlY3RDbGFzcyxcbiAgICAgICAgICAgIG1ldGhvZE5hbWUsXG4gICAgICAgICAgICBwb2ludGN1dCxcbiAgICAgICAgICAgIGFkdmljZVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVhZGVyKCk6IEFzcGVjdE1ldGFkYXRhUmVhZGVyIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldEFzcGVjdHM6IChqcElkZW50aWZpZXIsIGpwTWVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNwZWN0cy5maWx0ZXIoKHsgcG9pbnRjdXQgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnRjdXQudGVzdChqcElkZW50aWZpZXIsIGpwTWVtYmVyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgdHlwZSB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB0eXBlIHsgQWR2aWNlIH0gZnJvbSAnLi9BZHZpY2UnO1xuaW1wb3J0IHsgQXNwZWN0TWV0YWRhdGEgfSBmcm9tICcuL0FzcGVjdE1ldGFkdGEnO1xuaW1wb3J0IHR5cGUgeyBQb2ludGN1dCB9IGZyb20gJy4vUG9pbnRjdXQnO1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkQXNwZWN0KFxuICAgIGNvbXBvbmVudEFzcGVjdENsYXNzOiBOZXdhYmxlPHVua25vd24+LFxuICAgIG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCxcbiAgICBhZHZpY2U6IEFkdmljZSxcbiAgICBwb2ludGN1dDogUG9pbnRjdXRcbikge1xuICAgIEFzcGVjdE1ldGFkYXRhLmdldEluc3RhbmNlKCkuYXBwZW5kKGNvbXBvbmVudEFzcGVjdENsYXNzLCBtZXRob2ROYW1lLCBhZHZpY2UsIHBvaW50Y3V0KTtcbiAgICAvLyBjb25zdCBBc3BlY3RDbGFzcyA9IENvbXBvbmVudE1ldGhvZEFzcGVjdC5jcmVhdGUoY29tcG9uZW50QXNwZWN0Q2xhc3MsIG1ldGhvZE5hbWUpO1xuICAgIC8vIHBvaW50Y3V0LmdldE1ldGhvZHNNYXAoKS5mb3JFYWNoKChqcE1lbWJlcnMsIGpwQ2xhc3MpID0+IHtcbiAgICAvLyAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShqcENsYXNzLCBBT1BDbGFzc01ldGFkYXRhKTtcbiAgICAvLyAgICAganBNZW1iZXJzLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgLy8gICAgICAgICBtZXRhZGF0YS5hcHBlbmQobWV0aG9kTmFtZSwgYWR2aWNlLCBbQXNwZWN0Q2xhc3NdKTtcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gfSk7XG59XG4iLCJpbXBvcnQgdHlwZSB7IE5ld2FibGUgfSBmcm9tICcuLi8uLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4uL0FkdmljZSc7XG5pbXBvcnQgeyBhZGRBc3BlY3QgfSBmcm9tICcuLi9hZGRBc3BlY3QnO1xuaW1wb3J0IHR5cGUgeyBQb2ludGN1dCB9IGZyb20gJy4uL1BvaW50Y3V0JztcblxuZXhwb3J0IGZ1bmN0aW9uIEFmdGVyKHBvaW50Y3V0OiBQb2ludGN1dCk6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuICh0YXJnZXQsIHByb3BlcnR5S2V5KSA9PiB7XG4gICAgICAgIGFkZEFzcGVjdCh0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTx1bmtub3duPiwgcHJvcGVydHlLZXksIEFkdmljZS5BZnRlciwgcG9pbnRjdXQpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgdHlwZSB7IE5ld2FibGUgfSBmcm9tICcuLi8uLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4uL0FkdmljZSc7XG5pbXBvcnQgeyBhZGRBc3BlY3QgfSBmcm9tICcuLi9hZGRBc3BlY3QnO1xuaW1wb3J0IHR5cGUgeyBQb2ludGN1dCB9IGZyb20gJy4uL1BvaW50Y3V0JztcblxuZXhwb3J0IGZ1bmN0aW9uIEFmdGVyUmV0dXJuKHBvaW50Y3V0OiBQb2ludGN1dCk6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuICh0YXJnZXQsIHByb3BlcnR5S2V5KSA9PiB7XG4gICAgICAgIGFkZEFzcGVjdCh0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTx1bmtub3duPiwgcHJvcGVydHlLZXksIEFkdmljZS5BZnRlclJldHVybiwgcG9pbnRjdXQpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgdHlwZSB7IE5ld2FibGUgfSBmcm9tICcuLi8uLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4uL0FkdmljZSc7XG5pbXBvcnQgeyBhZGRBc3BlY3QgfSBmcm9tICcuLi9hZGRBc3BlY3QnO1xuaW1wb3J0IHR5cGUgeyBQb2ludGN1dCB9IGZyb20gJy4uL1BvaW50Y3V0JztcblxuZXhwb3J0IGZ1bmN0aW9uIEFyb3VuZChwb2ludGN1dDogUG9pbnRjdXQpOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkgPT4ge1xuICAgICAgICBhZGRBc3BlY3QodGFyZ2V0LmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dW5rbm93bj4sIHByb3BlcnR5S2V5LCBBZHZpY2UuQXJvdW5kLCBwb2ludGN1dCk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB0eXBlIHsgTmV3YWJsZSB9IGZyb20gJy4uLy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi4vQWR2aWNlJztcbmltcG9ydCB7IGFkZEFzcGVjdCB9IGZyb20gJy4uL2FkZEFzcGVjdCc7XG5pbXBvcnQgdHlwZSB7IFBvaW50Y3V0IH0gZnJvbSAnLi4vUG9pbnRjdXQnO1xuXG5leHBvcnQgZnVuY3Rpb24gQmVmb3JlKHBvaW50Y3V0OiBQb2ludGN1dCk6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuICh0YXJnZXQsIHByb3BlcnR5S2V5KSA9PiB7XG4gICAgICAgIGFkZEFzcGVjdCh0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTx1bmtub3duPiwgcHJvcGVydHlLZXksIEFkdmljZS5CZWZvcmUsIHBvaW50Y3V0KTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHR5cGUgeyBOZXdhYmxlIH0gZnJvbSAnLi4vLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuLi9BZHZpY2UnO1xuaW1wb3J0IHsgYWRkQXNwZWN0IH0gZnJvbSAnLi4vYWRkQXNwZWN0JztcbmltcG9ydCB0eXBlIHsgUG9pbnRjdXQgfSBmcm9tICcuLi9Qb2ludGN1dCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBGaW5hbGx5KHBvaW50Y3V0OiBQb2ludGN1dCk6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuICh0YXJnZXQsIHByb3BlcnR5S2V5KSA9PiB7XG4gICAgICAgIGFkZEFzcGVjdCh0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTx1bmtub3duPiwgcHJvcGVydHlLZXksIEFkdmljZS5GaW5hbGx5LCBwb2ludGN1dCk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB0eXBlIHsgTmV3YWJsZSB9IGZyb20gJy4uLy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi4vQWR2aWNlJztcbmltcG9ydCB7IGFkZEFzcGVjdCB9IGZyb20gJy4uL2FkZEFzcGVjdCc7XG5pbXBvcnQgdHlwZSB7IFBvaW50Y3V0IH0gZnJvbSAnLi4vUG9pbnRjdXQnO1xuXG5leHBvcnQgZnVuY3Rpb24gVGhyb3duKHBvaW50Y3V0OiBQb2ludGN1dCk6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuICh0YXJnZXQsIHByb3BlcnR5S2V5KSA9PiB7XG4gICAgICAgIGFkZEFzcGVjdCh0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTx1bmtub3duPiwgcHJvcGVydHlLZXksIEFkdmljZS5UaHJvd24sIHBvaW50Y3V0KTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHR5cGUgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmZ1bmN0aW9uIGdldE1ldGhvZERlc2NyaXB0b3JzKHByb3RvdHlwZTogb2JqZWN0KTogUmVjb3JkPHN0cmluZywgUHJvcGVydHlEZXNjcmlwdG9yPiB7XG4gICAgaWYgKFxuICAgICAgICB0eXBlb2YgcHJvdG90eXBlICE9PSAnb2JqZWN0JyB8fFxuICAgICAgICBwcm90b3R5cGUgPT09IG51bGwgfHxcbiAgICAgICAgT2JqZWN0LnByb3RvdHlwZSA9PT0gcHJvdG90eXBlIHx8XG4gICAgICAgIEZ1bmN0aW9uLnByb3RvdHlwZSA9PT0gcHJvdG90eXBlXG4gICAgKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgY29uc3Qgc3VwZXJQcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG90eXBlKTtcbiAgICBjb25zdCBzdXBlckRlc2NyaXB0b3JzID0gc3VwZXJQcm90b3R5cGUgPT09IHByb3RvdHlwZSA/IHt9IDogZ2V0TWV0aG9kRGVzY3JpcHRvcnMoc3VwZXJQcm90b3R5cGUpO1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHN1cGVyRGVzY3JpcHRvcnMsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHByb3RvdHlwZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsTWV0aG9kTWVtYmVyTmFtZXM8VD4oY2xzOiBOZXdhYmxlPFQ+KSB7XG4gICAgY29uc3QgZGVzY3JpcHRvcnMgPSBnZXRNZXRob2REZXNjcmlwdG9ycyhjbHMucHJvdG90eXBlKTtcbiAgICBjb25zdCBtZXRob2ROYW1lcyA9IG5ldyBTZXQ8c3RyaW5nIHwgc3ltYm9sPigpO1xuICAgIFJlZmxlY3Qub3duS2V5cyhkZXNjcmlwdG9ycykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBpZiAoa2V5ID09PSAnY29uc3RydWN0b3InKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWVtYmVyID0gY2xzLnByb3RvdHlwZVtrZXldO1xuICAgICAgICBpZiAodHlwZW9mIG1lbWJlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbWV0aG9kTmFtZXMuYWRkKGtleSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbWV0aG9kTmFtZXM7XG59XG4iLCJpbXBvcnQgdHlwZSB7IE1ldGFkYXRhLCBNZXRhZGF0YUNsYXNzLCBNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4uL3R5cGVzL01ldGFkYXRhJztcbmltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgeyBjcmVhdGVEZWZhdWx0VmFsdWVNYXAgfSBmcm9tICcuLi9jb21tb24vRGVmYXVsdFZhbHVlTWFwJztcblxudHlwZSBBbnlNZXRhZGF0YSA9IE1ldGFkYXRhPE1ldGFkYXRhUmVhZGVyLCB1bmtub3duPjtcbnR5cGUgQW55TWV0YWRhdGFDbGFzcyA9IE1ldGFkYXRhQ2xhc3M8TWV0YWRhdGFSZWFkZXIsIHVua25vd24sIEFueU1ldGFkYXRhPjtcblxuY29uc3QgbWV0YWRhdGFJbnN0YW5jZU1hcCA9IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcDxBbnlNZXRhZGF0YUNsYXNzLCBTZXQ8QW55TWV0YWRhdGE+PigoKSA9PiBuZXcgU2V0KCkpO1xuXG5leHBvcnQgY2xhc3MgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIge1xuICAgIHN0YXRpYyBnZXRNZXRhZGF0YTxSIGV4dGVuZHMgTWV0YWRhdGFSZWFkZXIsIFQgZXh0ZW5kcyBvYmplY3QsIE0gZXh0ZW5kcyBNZXRhZGF0YTxSLCBUPiA9IE1ldGFkYXRhPFIsIFQ+PihcbiAgICAgICAgdGFyZ2V0OiBULFxuICAgICAgICBtZXRhZGF0YUNsYXNzOiBNZXRhZGF0YUNsYXNzPFIsIFQsIE0+XG4gICAgKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IG1ldGFkYXRhQ2xhc3MuZ2V0UmVmbGVjdEtleSgpO1xuICAgICAgICBsZXQgbWV0YWRhdGEgPSBSZWZsZWN0LmdldE1ldGFkYXRhKGtleSwgdGFyZ2V0KTtcbiAgICAgICAgaWYgKCFtZXRhZGF0YSkge1xuICAgICAgICAgICAgbWV0YWRhdGEgPSBuZXcgbWV0YWRhdGFDbGFzcygpO1xuICAgICAgICAgICAgbWV0YWRhdGEuaW5pdCh0YXJnZXQpO1xuICAgICAgICAgICAgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YShrZXksIG1ldGFkYXRhLCB0YXJnZXQpO1xuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2VTZXQgPSBtZXRhZGF0YUluc3RhbmNlTWFwLmdldChtZXRhZGF0YUNsYXNzKTtcbiAgICAgICAgICAgIGluc3RhbmNlU2V0LmFkZChtZXRhZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1ldGFkYXRhIGFzIE07XG4gICAgfVxuICAgIHN0YXRpYyBnZXRBbGxJbnN0YW5jZW9mPE0gZXh0ZW5kcyBBbnlNZXRhZGF0YUNsYXNzPihtZXRhZGF0YUNsYXNzOiBNKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKG1ldGFkYXRhSW5zdGFuY2VNYXAuZ2V0KG1ldGFkYXRhQ2xhc3MpKTtcbiAgICB9XG59XG4iLCIvLyBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG5cbmltcG9ydCB7IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcCB9IGZyb20gJy4uL2NvbW1vbi9EZWZhdWx0VmFsdWVNYXAnO1xuaW1wb3J0IHR5cGUgeyBJbmplY3Rpb25UeXBlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9JbmplY3Rpb25UeXBlJztcbmltcG9ydCB0eXBlIHsgSW5zdGFuY2VTY29wZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vSW5zdGFuY2VTY29wZSc7XG5pbXBvcnQgdHlwZSB7IExpZmVjeWNsZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vTGlmZWN5Y2xlJztcbmltcG9ydCB0eXBlIHsgSnNTZXJ2aWNlQ2xhc3MgfSBmcm9tICcuLi90eXBlcy9Kc1NlcnZpY2VDbGFzcyc7XG5pbXBvcnQgdHlwZSB7IEtleU9mIH0gZnJvbSAnLi4vdHlwZXMvS2V5T2YnO1xuaW1wb3J0IHR5cGUgeyBNZW1iZXJLZXkgfSBmcm9tICcuLi90eXBlcy9NZW1iZXJLZXknO1xuaW1wb3J0IHR5cGUgeyBNZXRhZGF0YSwgTWV0YWRhdGFSZWFkZXIgfSBmcm9tICcuLi90eXBlcy9NZXRhZGF0YSc7XG5pbXBvcnQgdHlwZSB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5cbmNvbnN0IENMQVNTX01FVEFEQVRBX0tFWSA9ICdpb2M6Y2xhc3MtbWV0YWRhdGEnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1hcmtJbmZvIHtcbiAgICBba2V5OiBzdHJpbmcgfCBzeW1ib2xdOiB1bmtub3duO1xufVxuXG5leHBvcnQgY2xhc3MgTWFya0luZm9Db250YWluZXIge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbWFwID0gY3JlYXRlRGVmYXVsdFZhbHVlTWFwPE1lbWJlcktleSwgTWFya0luZm8+KCgpID0+ICh7fSkgYXMgTWFya0luZm8pO1xuICAgIGdldE1hcmtJbmZvKG1ldGhvZDogTWVtYmVyS2V5KTogTWFya0luZm8ge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXAuZ2V0KG1ldGhvZCk7XG4gICAgfVxuICAgIG1hcmsobWV0aG9kOiBNZW1iZXJLZXksIGtleTogTWVtYmVyS2V5LCB2YWx1ZTogdW5rbm93bikge1xuICAgICAgICBjb25zdCBtYXJrSW5mbyA9IHRoaXMubWFwLmdldChtZXRob2QpO1xuICAgICAgICBtYXJrSW5mb1trZXldID0gdmFsdWU7XG4gICAgfVxuICAgIGdldE1lbWJlcnMoKSB7XG4gICAgICAgIHJldHVybiBuZXcgU2V0KHRoaXMubWFwLmtleXMoKSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGFyYW1ldGVyTWFya0luZm9Db250YWluZXIge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbWFwID0gY3JlYXRlRGVmYXVsdFZhbHVlTWFwPE1lbWJlcktleSwgUmVjb3JkPG51bWJlciwgTWFya0luZm8+PigoKSA9PiB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9KTtcbiAgICBnZXRNYXJrSW5mbyhtZXRob2Q6IE1lbWJlcktleSk6IFJlY29yZDxudW1iZXIsIE1hcmtJbmZvPiB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcC5nZXQobWV0aG9kKTtcbiAgICB9XG4gICAgbWFyayhtZXRob2Q6IE1lbWJlcktleSwgaW5kZXg6IG51bWJlciwga2V5OiBNZW1iZXJLZXksIHZhbHVlOiB1bmtub3duKSB7XG4gICAgICAgIGNvbnN0IHBhcmFtc01hcmtJbmZvID0gdGhpcy5tYXAuZ2V0KG1ldGhvZCk7XG4gICAgICAgIGNvbnN0IG1hcmtJbmZvID0gcGFyYW1zTWFya0luZm9baW5kZXhdIHx8IHt9O1xuICAgICAgICBtYXJrSW5mb1trZXldID0gdmFsdWU7XG4gICAgICAgIHBhcmFtc01hcmtJbmZvW2luZGV4XSA9IG1hcmtJbmZvO1xuICAgIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBDbGFzc01hcmtJbmZvIHtcbiAgICBjdG9yOiBNYXJrSW5mbztcbiAgICBtZW1iZXJzOiBNYXJrSW5mb0NvbnRhaW5lcjtcbiAgICBwYXJhbXM6IFBhcmFtZXRlck1hcmtJbmZvQ29udGFpbmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENsYXNzTWV0YWRhdGFSZWFkZXI8VD4gZXh0ZW5kcyBNZXRhZGF0YVJlYWRlciB7XG4gICAgZ2V0Q2xhc3MoKTogTmV3YWJsZTxUPjtcbiAgICBnZXRTY29wZSgpOiBJbnN0YW5jZVNjb3BlIHwgc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIGdldENvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZXMoKTogQXJyYXk8SW5qZWN0aW9uVHlwZT47XG4gICAgZ2V0TWV0aG9kcyhsaWZlY3ljbGU6IExpZmVjeWNsZSk6IEFycmF5PHN0cmluZyB8IHN5bWJvbD47XG4gICAgZ2V0UHJvcGVydHlUeXBlTWFwKCk6IE1hcDxzdHJpbmcgfCBzeW1ib2wsIEluamVjdGlvblR5cGU+O1xuICAgIGdldEN0b3JNYXJrSW5mbygpOiBNYXJrSW5mbztcbiAgICBnZXRBbGxNYXJrZWRNZW1iZXJzKCk6IFNldDxNZW1iZXJLZXk+O1xuICAgIGdldE1lbWJlcnNNYXJrSW5mbyhtZXRob2RLZXk6IEtleU9mPFQ+KTogTWFya0luZm87XG4gICAgZ2V0UGFyYW1ldGVyTWFya0luZm8obWV0aG9kS2V5OiBLZXlPZjxUPik6IFJlY29yZDxudW1iZXIsIE1hcmtJbmZvPjtcbn1cblxuZXhwb3J0IGNsYXNzIENsYXNzTWV0YWRhdGE8VD4gaW1wbGVtZW50cyBNZXRhZGF0YTxDbGFzc01ldGFkYXRhUmVhZGVyPFQ+LCBOZXdhYmxlPFQ+PiB7XG4gICAgc3RhdGljIGdldFJlZmxlY3RLZXkoKSB7XG4gICAgICAgIHJldHVybiBDTEFTU19NRVRBREFUQV9LRVk7XG4gICAgfVxuICAgIHByaXZhdGUgc2NvcGU/OiBJbnN0YW5jZVNjb3BlIHwgc3RyaW5nO1xuICAgIHByaXZhdGUgY29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlczogQXJyYXk8SW5qZWN0aW9uVHlwZT4gPSBbXTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxpZmVjeWNsZU1ldGhvZHNNYXA6IFJlY29yZDxzdHJpbmcgfCBzeW1ib2wsIFNldDxMaWZlY3ljbGU+PiA9IHt9O1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcHJvcGVydHlUeXBlc01hcCA9IG5ldyBNYXA8c3RyaW5nIHwgc3ltYm9sLCBJbmplY3Rpb25UeXBlPigpO1xuICAgIHByaXZhdGUgY2xhenohOiBOZXdhYmxlPFQ+O1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbWFya3M6IENsYXNzTWFya0luZm8gPSB7XG4gICAgICAgIGN0b3I6IHt9LFxuICAgICAgICBtZW1iZXJzOiBuZXcgTWFya0luZm9Db250YWluZXIoKSxcbiAgICAgICAgcGFyYW1zOiBuZXcgUGFyYW1ldGVyTWFya0luZm9Db250YWluZXIoKVxuICAgIH07XG5cbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2U8VD4oY3RvcjogTmV3YWJsZTxUPikge1xuICAgICAgICByZXR1cm4gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoY3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgfVxuICAgIHN0YXRpYyBnZXRSZWFkZXI8VD4oY3RvcjogTmV3YWJsZTxUPikge1xuICAgICAgICByZXR1cm4gQ2xhc3NNZXRhZGF0YS5nZXRJbnN0YW5jZShjdG9yKS5yZWFkZXIoKTtcbiAgICB9XG5cbiAgICBpbml0KHRhcmdldDogTmV3YWJsZTxUPikge1xuICAgICAgICB0aGlzLmNsYXp6ID0gdGFyZ2V0O1xuICAgICAgICBjb25zdCBjb25zdHIgPSB0YXJnZXQgYXMgSnNTZXJ2aWNlQ2xhc3M8dW5rbm93bj47XG4gICAgICAgIGlmICh0eXBlb2YgY29uc3RyLnNjb3BlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnNldFNjb3BlKGNvbnN0ci5zY29wZSgpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGNvbnN0ci5pbmplY3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNvbnN0IGluamVjdGlvbnMgPSBjb25zdHIuaW5qZWN0KCk7XG4gICAgICAgICAgICBSZWZsZWN0Lm93bktleXMoaW5qZWN0aW9ucykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucmVjb3JkUHJvcGVydHlUeXBlKGtleSwgaW5qZWN0aW9uc1trZXldKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgY29uc3RyLm1ldGFkYXRhID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IGNvbnN0ci5tZXRhZGF0YSgpO1xuICAgICAgICAgICAgaWYgKG1ldGFkYXRhLnNjb3BlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTY29wZShtZXRhZGF0YS5zY29wZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpbmplY3Rpb25zID0gbWV0YWRhdGEuaW5qZWN0O1xuICAgICAgICAgICAgaWYgKGluamVjdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBSZWZsZWN0Lm93bktleXMoaW5qZWN0aW9ucykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlY29yZFByb3BlcnR5VHlwZShrZXksIGluamVjdGlvbnNba2V5XSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtYXJrZXIoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjdG9yOiAoa2V5OiBzdHJpbmcgfCBzeW1ib2wsIHZhbHVlOiB1bmtub3duKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXJrcy5jdG9yW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtZW1iZXI6IChwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sIHwgbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgbWFyazogKGtleTogc3RyaW5nIHwgc3ltYm9sLCB2YWx1ZTogdW5rbm93bikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXJrcy5tZW1iZXJzLm1hcmsocHJvcGVydHlLZXksIGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJhbWV0ZXI6IChwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgbWFyazogKGtleTogc3RyaW5nIHwgc3ltYm9sLCB2YWx1ZTogdW5rbm93bikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXJrcy5wYXJhbXMubWFyayhwcm9wZXJ0eUtleSwgaW5kZXgsIGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgc2V0U2NvcGUoc2NvcGU6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zY29wZSA9IHNjb3BlO1xuICAgIH1cbiAgICBzZXRDb25zdHJ1Y3RvclBhcmFtZXRlclR5cGUoaW5kZXg6IG51bWJlciwgdHlwZTogSW5qZWN0aW9uVHlwZSkge1xuICAgICAgICB0aGlzLmNvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZXNbaW5kZXhdID0gdHlwZTtcbiAgICB9XG4gICAgcmVjb3JkUHJvcGVydHlUeXBlKHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wsIHR5cGU6IEluamVjdGlvblR5cGUpIHtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eVR5cGVzTWFwLnNldChwcm9wZXJ0eUtleSwgdHlwZSk7XG4gICAgfVxuICAgIGFkZExpZmVjeWNsZU1ldGhvZChtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2wsIGxpZmVjeWNsZTogTGlmZWN5Y2xlKSB7XG4gICAgICAgIGNvbnN0IGxpZmVjeWNsZXMgPSB0aGlzLmdldExpZmVjeWNsZXMobWV0aG9kTmFtZSk7XG4gICAgICAgIGxpZmVjeWNsZXMuYWRkKGxpZmVjeWNsZSk7XG4gICAgICAgIHRoaXMubGlmZWN5Y2xlTWV0aG9kc01hcFttZXRob2ROYW1lXSA9IGxpZmVjeWNsZXM7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0TGlmZWN5Y2xlcyhtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2wpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGlmZWN5Y2xlTWV0aG9kc01hcFttZXRob2ROYW1lXSB8fCBuZXcgU2V0PExpZmVjeWNsZT4oKTtcbiAgICB9XG4gICAgZ2V0TWV0aG9kcyhsaWZlY3ljbGU6IExpZmVjeWNsZSk6IEFycmF5PHN0cmluZyB8IHN5bWJvbD4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5saWZlY3ljbGVNZXRob2RzTWFwKS5maWx0ZXIoaXQgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGlmZWN5Y2xlcyA9IHRoaXMubGlmZWN5Y2xlTWV0aG9kc01hcFtpdF07XG4gICAgICAgICAgICByZXR1cm4gbGlmZWN5Y2xlcy5oYXMobGlmZWN5Y2xlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0U3VwZXJDbGFzcygpIHtcbiAgICAgICAgY29uc3Qgc3VwZXJDbGFzc1Byb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzLmNsYXp6KTtcbiAgICAgICAgaWYgKCFzdXBlckNsYXNzUHJvdG90eXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdXBlckNsYXNzID0gc3VwZXJDbGFzc1Byb3RvdHlwZS5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPHVua25vd24+O1xuICAgICAgICBpZiAoc3VwZXJDbGFzcyA9PT0gdGhpcy5jbGF6eikge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyQ2xhc3M7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0U3VwZXJDbGFzc01ldGFkYXRhKCk6IENsYXNzTWV0YWRhdGE8dW5rbm93bj4gfCBudWxsIHtcbiAgICAgICAgY29uc3Qgc3VwZXJDbGFzcyA9IHRoaXMuZ2V0U3VwZXJDbGFzcygpO1xuICAgICAgICBpZiAoIXN1cGVyQ2xhc3MpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBDbGFzc01ldGFkYXRhLmdldEluc3RhbmNlKHN1cGVyQ2xhc3MpO1xuICAgIH1cbiAgICByZWFkZXIoKTogQ2xhc3NNZXRhZGF0YVJlYWRlcjxUPiB7XG4gICAgICAgIGNvbnN0IHN1cGVyUmVhZGVyID0gdGhpcy5nZXRTdXBlckNsYXNzTWV0YWRhdGEoKT8ucmVhZGVyKCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXRDbGFzczogKCkgPT4gdGhpcy5jbGF6eixcbiAgICAgICAgICAgIGdldFNjb3BlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NvcGU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0Q29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlczogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZXMuc2xpY2UoMCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0TWV0aG9kczogKGxpZmVjeWNsZTogTGlmZWN5Y2xlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3VwZXJNZXRob2RzID0gc3VwZXJSZWFkZXI/LmdldE1ldGhvZHMobGlmZWN5Y2xlKSB8fCBbXTtcbiAgICAgICAgICAgICAgICBjb25zdCB0aGlzTWV0aG9kcyA9IHRoaXMuZ2V0TWV0aG9kcyhsaWZlY3ljbGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQoc3VwZXJNZXRob2RzLmNvbmNhdCh0aGlzTWV0aG9kcykpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRQcm9wZXJ0eVR5cGVNYXA6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdXBlclByb3BlcnR5VHlwZU1hcCA9IHN1cGVyUmVhZGVyPy5nZXRQcm9wZXJ0eVR5cGVNYXAoKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0aGlzUHJvcGVydHlUeXBlc01hcCA9IHRoaXMucHJvcGVydHlUeXBlc01hcDtcbiAgICAgICAgICAgICAgICBpZiAoIXN1cGVyUHJvcGVydHlUeXBlTWFwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTWFwKHRoaXNQcm9wZXJ0eVR5cGVzTWFwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gbmV3IE1hcChzdXBlclByb3BlcnR5VHlwZU1hcCk7XG4gICAgICAgICAgICAgICAgdGhpc1Byb3BlcnR5VHlwZXNNYXAuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuc2V0KGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0Q3Rvck1hcmtJbmZvOiAoKTogTWFya0luZm8gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IC4uLnRoaXMubWFya3MuY3RvciB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldEFsbE1hcmtlZE1lbWJlcnM6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdXBlck1ldGhvZHMgPSBzdXBlclJlYWRlcj8uZ2V0QWxsTWFya2VkTWVtYmVycygpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNNZW1iZXJzID0gdGhpcy5tYXJrcy5tZW1iZXJzLmdldE1lbWJlcnMoKTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBzdXBlck1ldGhvZHMgPyBuZXcgU2V0KHN1cGVyTWV0aG9kcykgOiBuZXcgU2V0PE1lbWJlcktleT4oKTtcbiAgICAgICAgICAgICAgICB0aGlzTWVtYmVycy5mb3JFYWNoKGl0ID0+IHJlc3VsdC5hZGQoaXQpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldE1lbWJlcnNNYXJrSW5mbzogKGtleTogS2V5T2Y8VD4pOiBNYXJrSW5mbyA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFya3MubWVtYmVycy5nZXRNYXJrSW5mbyhrZXkgYXMgTWVtYmVyS2V5KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRQYXJhbWV0ZXJNYXJrSW5mbzogKG1ldGhvZEtleTogS2V5T2Y8VD4pOiBSZWNvcmQ8bnVtYmVyLCBNYXJrSW5mbz4gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hcmtzLnBhcmFtcy5nZXRNYXJrSW5mbyhtZXRob2RLZXkgYXMgTWVtYmVyS2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IHR5cGUgeyBJbnN0YW5jZVNjb3BlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9JbnN0YW5jZVNjb3BlJztcbmltcG9ydCB0eXBlIHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHR5cGUgeyBNZXRhZGF0YSB9IGZyb20gJy4uL3R5cGVzL01ldGFkYXRhJztcblxuZXhwb3J0IGNvbnN0IEZVTkNUSU9OX01FVEFEQVRBX0tFWSA9IFN5bWJvbCgnaW9jOmZ1bmN0aW9uLW1ldGFkYXRhJyk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRnVuY3Rpb25NZXRhZGF0YVJlYWRlciB7XG4gICAgZ2V0UGFyYW1ldGVycygpOiBJZGVudGlmaWVyW107XG4gICAgaXNGYWN0b3J5KCk6IGJvb2xlYW47XG4gICAgZ2V0U2NvcGUoKTogSW5zdGFuY2VTY29wZSB8IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGNsYXNzIEZ1bmN0aW9uTWV0YWRhdGEgaW1wbGVtZW50cyBNZXRhZGF0YTxGdW5jdGlvbk1ldGFkYXRhUmVhZGVyLCBGdW5jdGlvbj4ge1xuICAgIHN0YXRpYyBnZXRSZWZsZWN0S2V5KCkge1xuICAgICAgICByZXR1cm4gRlVOQ1RJT05fTUVUQURBVEFfS0VZO1xuICAgIH1cbiAgICBwcml2YXRlIHJlYWRvbmx5IHBhcmFtZXRlcnM6IElkZW50aWZpZXJbXSA9IFtdO1xuICAgIHByaXZhdGUgc2NvcGU/OiBJbnN0YW5jZVNjb3BlO1xuICAgIHByaXZhdGUgaXNGYWN0b3J5OiBib29sZWFuID0gZmFsc2U7XG4gICAgc2V0UGFyYW1ldGVyVHlwZShpbmRleDogbnVtYmVyLCBzeW1ib2w6IElkZW50aWZpZXIpIHtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzW2luZGV4XSA9IHN5bWJvbDtcbiAgICB9XG4gICAgc2V0U2NvcGUoc2NvcGU6IEluc3RhbmNlU2NvcGUpIHtcbiAgICAgICAgdGhpcy5zY29wZSA9IHNjb3BlO1xuICAgIH1cbiAgICBzZXRJc0ZhY3RvcnkoaXNGYWN0b3J5OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuaXNGYWN0b3J5ID0gaXNGYWN0b3J5O1xuICAgIH1cbiAgICBpbml0KCkge1xuICAgICAgICAvLyBQQVNTO1xuICAgIH1cbiAgICByZWFkZXIoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXRQYXJhbWV0ZXJzOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyYW1ldGVycy5zbGljZSgwKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpc0ZhY3Rvcnk6ICgpID0+IHRoaXMuaXNGYWN0b3J5LFxuICAgICAgICAgICAgZ2V0U2NvcGU6ICgpID0+IHRoaXMuc2NvcGVcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJleHBvcnQgZW51bSBJbnN0YW5jZVNjb3BlIHtcbiAgICBTSU5HTEVUT04gPSAnaW9jLXJlc29sdXRpb246Y29udGFpbmVyLXNpbmdsZXRvbicsXG4gICAgVFJBTlNJRU5UID0gJ2lvYy1yZXNvbHV0aW9uOnRyYW5zaWVudCcsXG4gICAgR0xPQkFMX1NIQVJFRF9TSU5HTEVUT04gPSAnaW9jLXJlc29sdXRpb246Z2xvYmFsLXNoYXJlZC1zaW5nbGV0b24nXG59XG4iLCJpbXBvcnQgdHlwZSB7IENsYXNzTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB0eXBlIHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHR5cGUgeyBTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4uL3R5cGVzL1NlcnZpY2VGYWN0b3J5JztcbmltcG9ydCB0eXBlIHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHsgSW5zdGFuY2VTY29wZSB9IGZyb20gJy4vSW5zdGFuY2VTY29wZSc7XG5cbmV4cG9ydCBjbGFzcyBTZXJ2aWNlRmFjdG9yeURlZjxUPiB7XG4gICAgc3RhdGljIGNyZWF0ZUZyb21DbGFzc01ldGFkYXRhPFQ+KG1ldGFkYXRhOiBDbGFzc01ldGFkYXRhPFQ+KSB7XG4gICAgICAgIGNvbnN0IGRlZiA9IG5ldyBTZXJ2aWNlRmFjdG9yeURlZihtZXRhZGF0YS5yZWFkZXIoKS5nZXRDbGFzcygpLCBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTik7XG4gICAgICAgIGRlZi5hcHBlbmQoKGNvbnRhaW5lcjogQXBwbGljYXRpb25Db250ZXh0LCBvd25lcjogdW5rbm93bikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWFkZXIgPSBtZXRhZGF0YS5yZWFkZXIoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjbGF6eiA9IHJlYWRlci5nZXRDbGFzcygpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXIuZ2V0SW5zdGFuY2UoY2xhenosIG93bmVyKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGVmO1xuICAgIH1cbiAgICBwdWJsaWMgcmVhZG9ubHkgZmFjdG9yaWVzID0gbmV3IE1hcDxTZXJ2aWNlRmFjdG9yeTxULCB1bmtub3duPiwgSWRlbnRpZmllcltdPigpO1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBpZGVudGlmaWVyIFRoZSB1bmlxdWUgaWRlbnRpZmllciBvZiB0aGlzIGZhY3Rvcmllc1xuICAgICAqIEBwYXJhbSBpc1NpbmdsZSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgaWRlbnRpZmllciBkZWZpbmVzIG9ubHkgb25lIGZhY3RvcnkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyByZWFkb25seSBpZGVudGlmaWVyOiBJZGVudGlmaWVyLFxuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgc2NvcGU6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmdcbiAgICApIHt9XG4gICAgYXBwZW5kKGZhY3Rvcnk6IFNlcnZpY2VGYWN0b3J5PFQsIHVua25vd24+LCBpbmplY3Rpb25zOiBJZGVudGlmaWVyW10gPSBbXSkge1xuICAgICAgICBpZiAodGhpcy5zY29wZSA9PT0gSW5zdGFuY2VTY29wZS5TSU5HTEVUT04gJiYgdGhpcy5mYWN0b3JpZXMuc2l6ZSA9PT0gMSAmJiB0aGlzLmZhY3Rvcmllcy5oYXMoZmFjdG9yeSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLmlkZW50aWZpZXIudG9TdHJpbmcoKX0gaXMgQSBzaW5nbGV0b24hIEJ1dCBtdWx0aXBsZSBmYWN0b3JpZXMgYXJlIGRlZmluZWQhYCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mYWN0b3JpZXMuc2V0KGZhY3RvcnksIGluamVjdGlvbnMpO1xuICAgIH1cbiAgICBwcm9kdWNlKGNvbnRhaW5lcjogQXBwbGljYXRpb25Db250ZXh0LCBvd25lcj86IHVua25vd24pIHtcbiAgICAgICAgLy8gaWYgKHRoaXMuaXNTaW5nbGUpIHtcbiAgICAgICAgLy8gICAgIGNvbnN0IFtmYWN0b3J5LCBpbmplY3Rpb25zXSA9IHRoaXMuZmFjdG9yaWVzLmVudHJpZXMoKS5uZXh0KCkudmFsdWUgYXMgW1NlcnZpY2VGYWN0b3J5PFQsIHVua25vd24+LCBJZGVudGlmaWVyW11dO1xuICAgICAgICAvLyAgICAgY29uc3QgZm4gPSBmYWN0b3J5KGNvbnRhaW5lciwgb3duZXIpO1xuICAgICAgICAvLyAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgLy8gICAgICAgICByZXR1cm4gY29udGFpbmVyLmludm9rZShmbiwge1xuICAgICAgICAvLyAgICAgICAgICAgICBpbmplY3Rpb25zXG4gICAgICAgIC8vICAgICAgICAgfSk7XG4gICAgICAgIC8vICAgICB9O1xuICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAvLyB9XG4gICAgICAgIGNvbnN0IHByb2R1Y2VycyA9IEFycmF5LmZyb20odGhpcy5mYWN0b3JpZXMpLm1hcCgoW2ZhY3RvcnksIGluamVjdGlvbnNdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmbiA9IGZhY3RvcnkoY29udGFpbmVyLCBvd25lcik7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXIuaW52b2tlKGZuLCB7XG4gICAgICAgICAgICAgICAgICAgIGluamVjdGlvbnNcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHByb2R1Y2Vycy5tYXAoaXQgPT4gaXQoKSk7XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSW5zdGFuY2VTY29wZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vSW5zdGFuY2VTY29wZSc7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeURlZiB9IGZyb20gJy4uL2ZvdW5kYXRpb24vU2VydmljZUZhY3RvcnlEZWYnO1xuaW1wb3J0IHR5cGUgeyBGYWN0b3J5SWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0ZhY3RvcnlJZGVudGlmaWVyJztcbmltcG9ydCB0eXBlIHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHR5cGUgeyBTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4uL3R5cGVzL1NlcnZpY2VGYWN0b3J5JztcblxuZXhwb3J0IGNsYXNzIEZhY3RvcnlSZWNvcmRlciB7XG4gICAgcHJpdmF0ZSBmYWN0b3JpZXMgPSBuZXcgTWFwPEZhY3RvcnlJZGVudGlmaWVyLCBTZXJ2aWNlRmFjdG9yeURlZjx1bmtub3duPj4oKTtcblxuICAgIHB1YmxpYyBhcHBlbmQ8VD4oXG4gICAgICAgIGlkZW50aWZpZXI6IEZhY3RvcnlJZGVudGlmaWVyLFxuICAgICAgICBmYWN0b3J5OiBTZXJ2aWNlRmFjdG9yeTxULCB1bmtub3duPixcbiAgICAgICAgaW5qZWN0aW9uczogSWRlbnRpZmllcltdID0gW10sXG4gICAgICAgIHNjb3BlOiBJbnN0YW5jZVNjb3BlIHwgc3RyaW5nID0gSW5zdGFuY2VTY29wZS5TSU5HTEVUT05cbiAgICApIHtcbiAgICAgICAgbGV0IGRlZiA9IHRoaXMuZmFjdG9yaWVzLmdldChpZGVudGlmaWVyKTtcbiAgICAgICAgaWYgKGRlZikge1xuICAgICAgICAgICAgZGVmLmFwcGVuZChmYWN0b3J5LCBpbmplY3Rpb25zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlZiA9IG5ldyBTZXJ2aWNlRmFjdG9yeURlZihpZGVudGlmaWVyLCBzY29wZSk7XG4gICAgICAgICAgICBkZWYuYXBwZW5kKGZhY3RvcnksIGluamVjdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmFjdG9yaWVzLnNldChpZGVudGlmaWVyLCBkZWYpO1xuICAgIH1cbiAgICBwdWJsaWMgc2V0KGlkZW50aWZpZXI6IEZhY3RvcnlJZGVudGlmaWVyLCBmYWN0b3J5RGVmOiBTZXJ2aWNlRmFjdG9yeURlZjx1bmtub3duPikge1xuICAgICAgICB0aGlzLmZhY3Rvcmllcy5zZXQoaWRlbnRpZmllciwgZmFjdG9yeURlZik7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQ8VD4oaWRlbnRpZmllcjogRmFjdG9yeUlkZW50aWZpZXIpOiBTZXJ2aWNlRmFjdG9yeURlZjxUPiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLmZhY3Rvcmllcy5nZXQoaWRlbnRpZmllcikgYXMgU2VydmljZUZhY3RvcnlEZWY8VD4gfCB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHB1YmxpYyBpdGVyYXRvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmFjdG9yaWVzLmVudHJpZXMoKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBGYWN0b3J5UmVjb3JkZXIgfSBmcm9tICcuLi9jb21tb24vRmFjdG9yeVJlY29yZGVyJztcbmltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luc3RhbmNlU2NvcGUnO1xuaW1wb3J0IHR5cGUgeyBTZXJ2aWNlRmFjdG9yeURlZiB9IGZyb20gJy4uL2ZvdW5kYXRpb24vU2VydmljZUZhY3RvcnlEZWYnO1xuaW1wb3J0IHR5cGUgeyBGYWN0b3J5SWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0ZhY3RvcnlJZGVudGlmaWVyJztcbmltcG9ydCB0eXBlIHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHR5cGUgeyBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yJztcbmltcG9ydCB0eXBlIHsgTWV0YWRhdGEgfSBmcm9tICcuLi90eXBlcy9NZXRhZGF0YSc7XG5pbXBvcnQgdHlwZSB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB0eXBlIHsgU2VydmljZUZhY3RvcnkgfSBmcm9tICcuLi90eXBlcy9TZXJ2aWNlRmFjdG9yeSc7XG5pbXBvcnQgdHlwZSB7IENsYXNzTWV0YWRhdGEgfSBmcm9tICcuL0NsYXNzTWV0YWRhdGEnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEdsb2JhbE1ldGFkYXRhUmVhZGVyIHtcbiAgICBnZXRDb21wb25lbnRGYWN0b3J5PFQ+KGtleTogRmFjdG9yeUlkZW50aWZpZXIpOiBTZXJ2aWNlRmFjdG9yeURlZjxUPiB8IHVuZGVmaW5lZDtcbiAgICBnZXRDbGFzc01ldGFkYXRhPFQ+KGFsaWFzTmFtZTogc3RyaW5nIHwgc3ltYm9sKTogQ2xhc3NNZXRhZGF0YTxUPiB8IHVuZGVmaW5lZDtcbiAgICBnZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKCk6IEFycmF5PE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4+O1xufVxuZXhwb3J0IGNsYXNzIEdsb2JhbE1ldGFkYXRhIGltcGxlbWVudHMgTWV0YWRhdGE8R2xvYmFsTWV0YWRhdGFSZWFkZXIsIHZvaWQ+IHtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBJTlNUQU5DRSA9IG5ldyBHbG9iYWxNZXRhZGF0YSgpO1xuICAgIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICAgICAgcmV0dXJuIEdsb2JhbE1ldGFkYXRhLklOU1RBTkNFO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0UmVhZGVyKCkge1xuICAgICAgICByZXR1cm4gR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWFkZXIoKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBjbGFzc0FsaWFzTWV0YWRhdGFNYXAgPSBuZXcgTWFwPHN0cmluZyB8IHN5bWJvbCwgQ2xhc3NNZXRhZGF0YTx1bmtub3duPj4oKTtcbiAgICBwcml2YXRlIGNvbXBvbmVudEZhY3RvcmllcyA9IG5ldyBGYWN0b3J5UmVjb3JkZXIoKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHByb2Nlc3NvckNsYXNzZXM6IFNldDxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+PiA9IG5ldyBTZXQoKTtcbiAgICByZWNvcmRGYWN0b3J5PFQ+KFxuICAgICAgICBzeW1ib2w6IEZhY3RvcnlJZGVudGlmaWVyLFxuICAgICAgICBmYWN0b3J5OiBTZXJ2aWNlRmFjdG9yeTxULCB1bmtub3duPixcbiAgICAgICAgaW5qZWN0aW9uczogSWRlbnRpZmllcltdID0gW10sXG4gICAgICAgIHNjb3BlOiBJbnN0YW5jZVNjb3BlIHwgc3RyaW5nID0gSW5zdGFuY2VTY29wZS5TSU5HTEVUT05cbiAgICApIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnRGYWN0b3JpZXMuYXBwZW5kKHN5bWJvbCwgZmFjdG9yeSwgaW5qZWN0aW9ucywgc2NvcGUpO1xuICAgIH1cbiAgICByZWNvcmRDbGFzc0FsaWFzPFQ+KGFsaWFzTmFtZTogc3RyaW5nIHwgc3ltYm9sLCBtZXRhZGF0YTogQ2xhc3NNZXRhZGF0YTxUPikge1xuICAgICAgICB0aGlzLmNsYXNzQWxpYXNNZXRhZGF0YU1hcC5zZXQoYWxpYXNOYW1lLCBtZXRhZGF0YSk7XG4gICAgfVxuICAgIHJlY29yZFByb2Nlc3NvckNsYXNzKGNsYXp6OiBOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+KSB7XG4gICAgICAgIHRoaXMucHJvY2Vzc29yQ2xhc3Nlcy5hZGQoY2xhenopO1xuICAgIH1cbiAgICBpbml0KCkge1xuICAgICAgICAvLyBQQVNTO1xuICAgIH1cbiAgICByZWFkZXIoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXRDb21wb25lbnRGYWN0b3J5OiA8VD4oa2V5OiBGYWN0b3J5SWRlbnRpZmllcik6IFNlcnZpY2VGYWN0b3J5RGVmPFQ+IHwgdW5kZWZpbmVkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRGYWN0b3JpZXMuZ2V0KGtleSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0Q2xhc3NNZXRhZGF0YTogPFQ+KGFsaWFzTmFtZTogc3RyaW5nIHwgc3ltYm9sKTogQ2xhc3NNZXRhZGF0YTxUPiB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3NBbGlhc01ldGFkYXRhTWFwLmdldChhbGlhc05hbWUpIGFzIENsYXNzTWV0YWRhdGE8VD4gfCB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0SW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlczogKCk6IEFycmF5PE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4+ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLnByb2Nlc3NvckNsYXNzZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGdldEFsbE1ldGhvZE1lbWJlck5hbWVzIH0gZnJvbSAnLi4vY29tbW9uL2dldEFsbE1ldGhvZE1lbWJlck5hbWVzJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB0eXBlIHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHR5cGUgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5cbnR5cGUgTWVtYmVySWRlbnRpZmllciA9IHN0cmluZyB8IHN5bWJvbDtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBvaW50Y3V0IHtcbiAgICBzdGF0aWMgY29tYmluZSguLi5wb2ludGN1dHM6IFBvaW50Y3V0W10pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBPclBvaW50Y3V0KHBvaW50Y3V0cyk7XG4gICAgfVxuICAgIHN0YXRpYyBvZjxUPihjbHM6IE5ld2FibGU8VD4sIC4uLm1ldGhvZE5hbWVzOiBNZW1iZXJJZGVudGlmaWVyW10pIHtcbiAgICAgICAgY29uc3QgZW50cmllcyA9IG5ldyBNYXA8TmV3YWJsZTx1bmtub3duPiwgU2V0PE1lbWJlcklkZW50aWZpZXI+PigpO1xuICAgICAgICBjb25zdCBtZXRob2RzID0gbmV3IFNldDxNZW1iZXJJZGVudGlmaWVyPihtZXRob2ROYW1lcyBhcyBNZW1iZXJJZGVudGlmaWVyW10pO1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgZ2V0QWxsTWV0aG9kTWVtYmVyTmFtZXMoY2xzKS5mb3JFYWNoKG1ldGhvZE5hbWUgPT4ge1xuICAgICAgICAgICAgICAgIG1ldGhvZHMuYWRkKG1ldGhvZE5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZW50cmllcy5zZXQoY2xzLCBtZXRob2RzKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcmVjaXRlUG9pbnRjdXQoZW50cmllcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkXG4gICAgICovXG4gICAgc3RhdGljIHRlc3RNYXRjaDxUPihjbHM6IE5ld2FibGU8VD4sIHJlZ2V4OiBSZWdFeHApIHtcbiAgICAgICAgcmV0dXJuIFBvaW50Y3V0Lm1hdGNoKGNscywgcmVnZXgpO1xuICAgIH1cbiAgICBzdGF0aWMgbWF0Y2g8VD4oY2xzOiBOZXdhYmxlPFQ+LCByZWdleDogUmVnRXhwKSB7XG4gICAgICAgIHJldHVybiBuZXcgTWVtYmVyTWF0Y2hQb2ludGN1dChjbHMsIHJlZ2V4KTtcbiAgICB9XG4gICAgc3RhdGljIGZyb20oLi4uY2xhc3NlczogQXJyYXk8TmV3YWJsZTx1bmtub3duPj4pIHtcbiAgICAgICAgY29uc3Qgb2YgPSAoLi4ubWV0aG9kTmFtZXM6IE1lbWJlcklkZW50aWZpZXJbXSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBPclBvaW50Y3V0KGNsYXNzZXMubWFwKGNscyA9PiBQb2ludGN1dC5vZihjbHMsIC4uLm1ldGhvZE5hbWVzKSkpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBtYXRjaCA9IChyZWdleDogUmVnRXhwKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE9yUG9pbnRjdXQoXG4gICAgICAgICAgICAgICAgY2xhc3Nlcy5tYXAoY2xzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBNZW1iZXJNYXRjaFBvaW50Y3V0KGNscywgcmVnZXgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb2YsXG4gICAgICAgICAgICBtYXRjaCxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQGRlcHJlY2F0ZWRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGVzdE1hdGNoOiBtYXRjaFxuICAgICAgICB9O1xuICAgIH1cbiAgICBzdGF0aWMgbWFya2VkKHR5cGU6IHN0cmluZyB8IHN5bWJvbCwgdmFsdWU6IHVua25vd24gPSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBuZXcgTWFya2VkUG9pbnRjdXQodHlwZSwgdmFsdWUpO1xuICAgIH1cbiAgICBzdGF0aWMgY2xhc3M8VD4oY2xzOiBOZXdhYmxlPFQ+KSB7XG4gICAgICAgIHJldHVybiBuZXcgQ2xhc3NQb2ludGN1dChjbHMpO1xuICAgIH1cbiAgICBhYnN0cmFjdCB0ZXN0KGpwSWRlbnRpZmllcjogSWRlbnRpZmllciwganBNZW1iZXI6IHN0cmluZyB8IHN5bWJvbCk6IGJvb2xlYW47XG59XG5cbmNsYXNzIE9yUG9pbnRjdXQgZXh0ZW5kcyBQb2ludGN1dCB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwb2ludGN1dHM6IFBvaW50Y3V0W10pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgdGVzdChqcElkZW50aWZpZXI6IElkZW50aWZpZXIsIGpwTWVtYmVyOiBzdHJpbmcgfCBzeW1ib2wpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9pbnRjdXRzLnNvbWUoaXQgPT4gaXQudGVzdChqcElkZW50aWZpZXIsIGpwTWVtYmVyKSk7XG4gICAgfVxufVxuXG5jbGFzcyBQcmVjaXRlUG9pbnRjdXQgZXh0ZW5kcyBQb2ludGN1dCB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBtZXRob2RFbnRyaWVzOiBNYXA8SWRlbnRpZmllciwgU2V0PE1lbWJlcklkZW50aWZpZXI+Pikge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICB0ZXN0KGpwSWRlbnRpZmllcjogSWRlbnRpZmllciwganBNZW1iZXI6IHN0cmluZyB8IHN5bWJvbCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBtZW1iZXJzID0gdGhpcy5tZXRob2RFbnRyaWVzLmdldChqcElkZW50aWZpZXIpO1xuICAgICAgICByZXR1cm4gISFtZW1iZXJzICYmIG1lbWJlcnMuaGFzKGpwTWVtYmVyKTtcbiAgICB9XG59XG5jbGFzcyBNYXJrZWRQb2ludGN1dCBleHRlbmRzIFBvaW50Y3V0IHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBtYXJrZWRUeXBlOiBzdHJpbmcgfCBzeW1ib2wsXG4gICAgICAgIHByaXZhdGUgbWFya2VkVmFsdWU6IHVua25vd24gPSB0cnVlXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHRlc3QoanBJZGVudGlmaWVyOiBJZGVudGlmaWVyLCBqcE1lbWJlcjogc3RyaW5nIHwgc3ltYm9sKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0eXBlb2YganBJZGVudGlmaWVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShqcElkZW50aWZpZXIsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBjb25zdCBtYXJrSW5mbyA9IG1ldGFkYXRhLnJlYWRlcigpLmdldE1lbWJlcnNNYXJrSW5mbyhqcE1lbWJlcik7XG4gICAgICAgIHJldHVybiBtYXJrSW5mb1t0aGlzLm1hcmtlZFR5cGVdID09PSB0aGlzLm1hcmtlZFZhbHVlO1xuICAgIH1cbn1cbmNsYXNzIE1lbWJlck1hdGNoUG9pbnRjdXQgZXh0ZW5kcyBQb2ludGN1dCB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgY2xheno6IE5ld2FibGU8dW5rbm93bj4sXG4gICAgICAgIHByaXZhdGUgcmVnZXg6IFJlZ0V4cFxuICAgICkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICB0ZXN0KGpwSWRlbnRpZmllcjogSWRlbnRpZmllciwganBNZW1iZXI6IHN0cmluZyB8IHN5bWJvbCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4ganBJZGVudGlmaWVyID09PSB0aGlzLmNsYXp6ICYmIHR5cGVvZiBqcE1lbWJlciA9PT0gJ3N0cmluZycgJiYgISF0aGlzLnJlZ2V4LnRlc3QoanBNZW1iZXIpO1xuICAgIH1cbn1cbmNsYXNzIENsYXNzUG9pbnRjdXQgZXh0ZW5kcyBQb2ludGN1dCB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjbGF6ejogTmV3YWJsZTx1bmtub3duPikge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICB0ZXN0KGpwSWRlbnRpZmllcjogSWRlbnRpZmllcik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4ganBJZGVudGlmaWVyID09PSB0aGlzLmNsYXp6O1xuICAgIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgTmV3YWJsZSB9IGZyb20gJy4uLy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHR5cGUgeyBBZHZpY2UgfSBmcm9tICcuLi9BZHZpY2UnO1xuaW1wb3J0IHR5cGUgeyBBc3BlY3QsIFByb2NlZWRpbmdBc3BlY3QgfSBmcm9tICcuLi9Bc3BlY3QnO1xuaW1wb3J0IHsgYWRkQXNwZWN0IH0gZnJvbSAnLi4vYWRkQXNwZWN0JztcbmltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi4vUG9pbnRjdXQnO1xuXG5mdW5jdGlvbiBVc2VBc3BlY3RzKGFkdmljZTogQWR2aWNlLkFyb3VuZCwgYXNwZWN0czogQXJyYXk8TmV3YWJsZTxQcm9jZWVkaW5nQXNwZWN0Pj4pOiBNZXRob2REZWNvcmF0b3I7XG5mdW5jdGlvbiBVc2VBc3BlY3RzKGFkdmljZTogQWR2aWNlLCBhc3BlY3RzOiBBcnJheTxOZXdhYmxlPEFzcGVjdD4+KTogTWV0aG9kRGVjb3JhdG9yO1xuZnVuY3Rpb24gVXNlQXNwZWN0cyhhZHZpY2U6IEFkdmljZSwgYXNwZWN0czogQXJyYXk8TmV3YWJsZTxBc3BlY3Q+Pik6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuICh0YXJnZXQsIHByb3BlcnR5S2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IGNsYXp6ID0gdGFyZ2V0LmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dHlwZW9mIHRhcmdldD47XG4gICAgICAgIGFzcGVjdHMuZm9yRWFjaChhc3BlY3RDbGFzcyA9PiB7XG4gICAgICAgICAgICBhZGRBc3BlY3QoYXNwZWN0Q2xhc3MsICdleGVjdXRlJywgYWR2aWNlLCBQb2ludGN1dC5vZihjbGF6eiwgcHJvcGVydHlLZXkpKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn1cblxuZXhwb3J0IHsgVXNlQXNwZWN0cyB9O1xuIiwiaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9HbG9iYWxNZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB0eXBlIHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gQWxpYXMoYWxpYXNOYW1lOiBzdHJpbmcgfCBzeW1ib2wpOiBDbGFzc0RlY29yYXRvciB7XG4gICAgcmV0dXJuIDxURnVuY3Rpb24gZXh0ZW5kcyBGdW5jdGlvbj4odGFyZ2V0OiBURnVuY3Rpb24pID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQgYXMgdW5rbm93biBhcyBOZXdhYmxlPHVua25vd24+LCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWNvcmRDbGFzc0FsaWFzKGFsaWFzTmFtZSwgbWV0YWRhdGEpO1xuICAgIH07XG59XG4iLCJleHBvcnQgaW50ZXJmYWNlIEV2YWx1YXRpb25PcHRpb25zPE8sIEUgZXh0ZW5kcyBzdHJpbmcsIEEgPSB1bmtub3duPiB7XG4gICAgdHlwZTogRTtcbiAgICBvd25lcj86IE87XG4gICAgcHJvcGVydHlOYW1lPzogc3RyaW5nIHwgc3ltYm9sO1xuICAgIGV4dGVybmFsQXJncz86IEE7XG59XG5cbmV4cG9ydCBlbnVtIEV4cHJlc3Npb25UeXBlIHtcbiAgICBFTlYgPSAnaW5qZWN0LWVudmlyb25tZW50LXZhcmlhYmxlcycsXG4gICAgSlNPTl9QQVRIID0gJ2luamVjdC1qc29uLWRhdGEnLFxuICAgIEFSR1YgPSAnaW5qZWN0LWFyZ3YnXG59XG4iLCJleHBvcnQgY29uc3QgaXNOb2RlSnMgPSAoKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBwcm9jZXNzLnZlcnNpb25zLm5vZGUgIT09IG51bGw7XG4gICAgfSBjYXRjaCAoX2UpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn0pKCk7XG4iLCJpbXBvcnQgdHlwZSB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB0eXBlIHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgY2xhc3MgSW5qZWN0aW9uVHlwZSB7XG4gICAgc3RhdGljIG9mQ2xhenooY2xheno6IE5ld2FibGU8dW5rbm93bj4pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbmplY3Rpb25UeXBlKGNsYXp6KTtcbiAgICB9XG4gICAgc3RhdGljIG9mSWRlbnRpZmllcihpZGVudGlmaWVyOiBJZGVudGlmaWVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5qZWN0aW9uVHlwZShPYmplY3QgYXMgdW5rbm93biBhcyBOZXdhYmxlPHVua25vd24+LCBpZGVudGlmaWVyKTtcbiAgICB9XG4gICAgc3RhdGljIG9mKGNsYXp6OiBOZXdhYmxlPHVua25vd24+LCBpZGVudGlmaWVyOiBJZGVudGlmaWVyID0gY2xhenopIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbmplY3Rpb25UeXBlKGNsYXp6LCBpZGVudGlmaWVyKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IGNsYXp6OiBOZXdhYmxlPHVua25vd24+LFxuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgaWRlbnRpZmllcjogSWRlbnRpZmllciA9IGNsYXp6XG4gICAgKSB7fVxuXG4gICAgZ2V0IGlzTmV3YWJsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRlbnRpZmllciA9PT0gdGhpcy5jbGF6ejtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBpc05vZGVKcyB9IGZyb20gJy4uL2NvbW1vbi9pc05vZGVKcyc7XG5pbXBvcnQgeyBJbmplY3Rpb25UeXBlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9JbmplY3Rpb25UeXBlJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBFeHByZXNzaW9uVHlwZSB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRlT3B0aW9ucyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBWYWx1ZTxBID0gdW5rbm93bj4oZXhwcmVzc2lvbjogc3RyaW5nLCB0eXBlOiBFeHByZXNzaW9uVHlwZSB8IHN0cmluZywgZXh0ZXJuYWxBcmdzPzogQSk6IFByb3BlcnR5RGVjb3JhdG9yIHtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSBFeHByZXNzaW9uVHlwZS5FTlY6XG4gICAgICAgIGNhc2UgRXhwcmVzc2lvblR5cGUuQVJHVjpcbiAgICAgICAgICAgIGlmICghaXNOb2RlSnMpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBcIiR7dHlwZX1cIiBldmFsdWF0b3Igb25seSBzdXBwb3J0cyBub2RlanMgZW52aXJvbm1lbnQhYCk7XG4gICAgICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAodGFyZ2V0OiBvYmplY3QsIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wpID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQuY29uc3RydWN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBjb25zdCB2YWx1ZV9zeW1ib2wgPSBTeW1ib2woJycpO1xuICAgICAgICBtZXRhZGF0YS5yZWNvcmRQcm9wZXJ0eVR5cGUocHJvcGVydHlLZXksIEluamVjdGlvblR5cGUub2ZJZGVudGlmaWVyKHZhbHVlX3N5bWJvbCkpO1xuICAgICAgICBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlY29yZEZhY3RvcnkodmFsdWVfc3ltYm9sLCAoY29udGFpbmVyLCBvd25lcikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICgpID0+XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmV2YWx1YXRlPHN0cmluZywgdHlwZW9mIG93bmVyLCBBPihleHByZXNzaW9uIGFzIHN0cmluZywge1xuICAgICAgICAgICAgICAgICAgICBvd25lcixcbiAgICAgICAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgZXh0ZXJuYWxBcmdzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBFeHByZXNzaW9uVHlwZSB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRlT3B0aW9ucyc7XG5pbXBvcnQgeyBWYWx1ZSB9IGZyb20gJy4vVmFsdWUnO1xuXG5leHBvcnQgZnVuY3Rpb24gQXJndihuYW1lOiBzdHJpbmcsIGFyZ3Y6IHN0cmluZ1tdID0gcHJvY2Vzcy5hcmd2KSB7XG4gICAgcmV0dXJuIFZhbHVlKG5hbWUsIEV4cHJlc3Npb25UeXBlLkFSR1YsIGFyZ3YpO1xufVxuIiwiaW1wb3J0IHsgQWxpYXMgfSBmcm9tICcuL0FsaWFzJztcbi8qKlxuICogQGRlcHJlY2F0ZWQgdXNlIEBBbGlhcyBpbnN0ZWFkXG4gKiBAcGFyYW0gYWxpYXNOYW1lXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gQmluZChhbGlhc05hbWU6IHN0cmluZyB8IHN5bWJvbCk6IENsYXNzRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gQWxpYXMoYWxpYXNOYW1lKTtcbn1cbiIsImltcG9ydCB7IEV4cHJlc3Npb25UeXBlIH0gZnJvbSAnLi4vdHlwZXMvRXZhbHVhdGVPcHRpb25zJztcbmltcG9ydCB7IFZhbHVlIH0gZnJvbSAnLi9WYWx1ZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBFbnYobmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIFZhbHVlKG5hbWUsIEV4cHJlc3Npb25UeXBlLkVOVik7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gaXNOdWxsKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgbnVsbCB7XG4gICAgcmV0dXJuIHZhbHVlID09PSBudWxsO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc05vdERlZmluZWQ8VD4odmFsdWU6IFQgfCB1bmRlZmluZWQgfCBudWxsKTogdmFsdWUgaXMgdW5kZWZpbmVkIHwgbnVsbCB7XG4gICAgcmV0dXJuIGlzTnVsbCh2YWx1ZSkgfHwgaXNVbmRlZmluZWQodmFsdWUpO1xufVxuIiwiY29uc3QgUFJPWFlfVEFSR0VUX01BUCA9IG5ldyBXZWFrTWFwPG9iamVjdCwgb2JqZWN0PigpO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVjb3JkUHJveHlUYXJnZXQ8VCBleHRlbmRzIG9iamVjdD4ocHJveHk6IFQsIHRhcmdldDogVCk6IHZvaWQge1xuICAgIFBST1hZX1RBUkdFVF9NQVAuc2V0KHByb3h5LCB0YXJnZXQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJveHlUYXJnZXQ8VCBleHRlbmRzIG9iamVjdD4ocHJveHk6IFQpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gUFJPWFlfVEFSR0VUX01BUC5nZXQocHJveHkpIGFzIFQgfCB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Byb3h5T2Y8VCBleHRlbmRzIG9iamVjdD4ocHJveHk6IFQsIHRhcmdldDogVCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBQUk9YWV9UQVJHRVRfTUFQLmdldChwcm94eSkgPT09IHRhcmdldDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc1Byb3h5UmVjb3JkKG9iajogb2JqZWN0KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIFBST1hZX1RBUkdFVF9NQVAuaGFzKG9iaik7XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuL0FkdmljZSc7XG5cbnR5cGUgQmVmb3JlSG9vayA9IChhcmdzOiBhbnlbXSkgPT4gdm9pZDtcbnR5cGUgQWZ0ZXJIb29rID0gKGFyZ3M6IGFueVtdKSA9PiB2b2lkO1xudHlwZSBUaHJvd25Ib29rID0gKHJlYXNvbjogYW55LCBhcmdzOiBhbnlbXSkgPT4gdm9pZDtcbnR5cGUgRmluYWxseUhvb2sgPSAoYXJnczogYW55W10pID0+IHZvaWQ7XG50eXBlIEFmdGVyUmV0dXJuSG9vayA9IChyZXR1cm5WYWx1ZTogYW55LCBhcmdzOiBhbnlbXSkgPT4gYW55O1xudHlwZSBBcm91bmRIb29rID0gKHRoaXM6IGFueSwgb3JpZ2luZm46ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCwgYXJnczogYW55W10pID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBBc3BlY3RVdGlscyB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBiZWZvcmVIb29rczogQXJyYXk8QmVmb3JlSG9vaz4gPSBbXTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGFmdGVySG9va3M6IEFycmF5PEFmdGVySG9vaz4gPSBbXTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHRocm93bkhvb2tzOiBBcnJheTxUaHJvd25Ib29rPiA9IFtdO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZmluYWxseUhvb2tzOiBBcnJheTxGaW5hbGx5SG9vaz4gPSBbXTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGFmdGVyUmV0dXJuSG9va3M6IEFycmF5PEFmdGVyUmV0dXJuSG9vaz4gPSBbXTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGFyb3VuZEhvb2tzOiBBcnJheTxBcm91bmRIb29rPiA9IFtdO1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZm46ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KSB7fVxuICAgIGFwcGVuZChhZHZpY2U6IEFkdmljZS5CZWZvcmUsIGhvb2s6IEJlZm9yZUhvb2spOiB2b2lkO1xuICAgIGFwcGVuZChhZHZpY2U6IEFkdmljZS5BZnRlciwgaG9vazogQWZ0ZXJIb29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuVGhyb3duLCBob29rOiBUaHJvd25Ib29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuRmluYWxseSwgaG9vazogRmluYWxseUhvb2spOiB2b2lkO1xuICAgIGFwcGVuZChhZHZpY2U6IEFkdmljZS5BZnRlclJldHVybiwgaG9vazogQWZ0ZXJSZXR1cm5Ib29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuQXJvdW5kLCBob29rOiBBcm91bmRIb29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UsIGhvb2s6IEZ1bmN0aW9uKSB7XG4gICAgICAgIGxldCBob29rc0FycmF5OiBGdW5jdGlvbltdIHwgdW5kZWZpbmVkO1xuICAgICAgICBzd2l0Y2ggKGFkdmljZSkge1xuICAgICAgICAgICAgY2FzZSBBZHZpY2UuQmVmb3JlOlxuICAgICAgICAgICAgICAgIGhvb2tzQXJyYXkgPSB0aGlzLmJlZm9yZUhvb2tzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBZHZpY2UuQWZ0ZXI6XG4gICAgICAgICAgICAgICAgaG9va3NBcnJheSA9IHRoaXMuYWZ0ZXJIb29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLlRocm93bjpcbiAgICAgICAgICAgICAgICBob29rc0FycmF5ID0gdGhpcy50aHJvd25Ib29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLkZpbmFsbHk6XG4gICAgICAgICAgICAgICAgaG9va3NBcnJheSA9IHRoaXMuZmluYWxseUhvb2tzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBZHZpY2UuQWZ0ZXJSZXR1cm46XG4gICAgICAgICAgICAgICAgaG9va3NBcnJheSA9IHRoaXMuYWZ0ZXJSZXR1cm5Ib29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLkFyb3VuZDpcbiAgICAgICAgICAgICAgICBob29rc0FycmF5ID0gdGhpcy5hcm91bmRIb29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaG9va3NBcnJheSkge1xuICAgICAgICAgICAgaG9va3NBcnJheS5wdXNoKGhvb2spO1xuICAgICAgICB9XG4gICAgfVxuICAgIGV4dHJhY3QoKSB7XG4gICAgICAgIGNvbnN0IHsgYXJvdW5kSG9va3MsIGJlZm9yZUhvb2tzLCBhZnRlckhvb2tzLCBhZnRlclJldHVybkhvb2tzLCBmaW5hbGx5SG9va3MsIHRocm93bkhvb2tzIH0gPSB0aGlzO1xuICAgICAgICBjb25zdCBmbjogdHlwZW9mIHRoaXMuZm4gPSBhcm91bmRIb29rcy5yZWR1Y2VSaWdodCgocHJldiwgbmV4dCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0aGlzOiBhbnksIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQuY2FsbCh0aGlzLCBwcmV2LCBhcmdzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sIHRoaXMuZm4pO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHRoaXM6IGFueSwgLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgICAgIGJlZm9yZUhvb2tzLmZvckVhY2goaG9vayA9PiB7XG4gICAgICAgICAgICAgICAgaG9vay5jYWxsKHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBpbnZva2UgPSAob25FcnJvcjogKHJlYXNvbjogYW55KSA9PiB2b2lkLCBvbkZpbmFsbHk6ICgpID0+IHZvaWQsIG9uQWZ0ZXI6IChyZXR1cm5WYWx1ZTogYW55KSA9PiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmV0dXJuVmFsdWU6IGFueTtcbiAgICAgICAgICAgICAgICBsZXQgaXNQcm9taXNlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSBmbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJldHVyblZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNQcm9taXNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblZhbHVlID0gcmV0dXJuVmFsdWUuY2F0Y2gob25FcnJvcikuZmluYWxseShvbkZpbmFsbHkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1Byb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRmluYWxseSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpc1Byb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlLnRoZW4oKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvbkFmdGVyKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9uQWZ0ZXIocmV0dXJuVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gaW52b2tlKFxuICAgICAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRocm93bkhvb2tzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93bkhvb2tzLmZvckVhY2goaG9vayA9PiBob29rLmNhbGwodGhpcywgZXJyb3IsIGFyZ3MpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGZpbmFsbHlIb29rcy5mb3JFYWNoKGhvb2sgPT4gaG9vay5jYWxsKHRoaXMsIGFyZ3MpKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHZhbHVlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYWZ0ZXJIb29rcy5mb3JFYWNoKGhvb2sgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaG9vay5jYWxsKHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFmdGVyUmV0dXJuSG9va3MucmVkdWNlKChyZXRWYWwsIGhvb2spID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBob29rLmNhbGwodGhpcywgcmV0VmFsLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSAqL1xuaW1wb3J0IHR5cGUgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5pbXBvcnQgdHlwZSB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4vQWR2aWNlJztcbmltcG9ydCB0eXBlIHsgQXNwZWN0LCBKb2luUG9pbnQsIFByb2NlZWRpbmdKb2luUG9pbnQgfSBmcm9tICcuL0FzcGVjdCc7XG5pbXBvcnQgdHlwZSB7IEFzcGVjdEluZm8gfSBmcm9tICcuL0FzcGVjdE1ldGFkdGEnO1xuaW1wb3J0IHsgQXNwZWN0VXRpbHMgfSBmcm9tICcuL0FzcGVjdFV0aWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFzcGVjdDxUPihcbiAgICBhcHBDdHg6IEFwcGxpY2F0aW9uQ29udGV4dCxcbiAgICB0YXJnZXQ6IFQsXG4gICAgbWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sLFxuICAgIG1ldGhvZEZ1bmM6IEZ1bmN0aW9uLFxuICAgIGFzcGVjdHM6IEFzcGVjdEluZm9bXVxuKSB7XG4gICAgY29uc3QgY3JlYXRlQXNwZWN0Q3R4ID0gKGFkdmljZTogQWR2aWNlLCBhcmdzOiBhbnlbXSwgcmV0dXJuVmFsdWU6IGFueSA9IG51bGwsIGVycm9yOiBhbnkgPSBudWxsKTogSm9pblBvaW50ID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRhcmdldCxcbiAgICAgICAgICAgIG1ldGhvZE5hbWUsXG4gICAgICAgICAgICBhcmd1bWVudHM6IGFyZ3MsXG4gICAgICAgICAgICByZXR1cm5WYWx1ZSxcbiAgICAgICAgICAgIGVycm9yLFxuICAgICAgICAgICAgYWR2aWNlLFxuICAgICAgICAgICAgY3R4OiBhcHBDdHhcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIGNvbnN0IGFzcGVjdFV0aWxzID0gbmV3IEFzcGVjdFV0aWxzKG1ldGhvZEZ1bmMgYXMgKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpO1xuICAgIGNvbnN0IENsYXNzVG9JbnN0YW5jZSA9IChhc3BlY3RJbmZvOiBBc3BlY3RJbmZvKSA9PiBhcHBDdHguZ2V0SW5zdGFuY2UoYXNwZWN0SW5mby5hc3BlY3RDbGFzcykgYXMgQXNwZWN0O1xuICAgIGNvbnN0IHRhcmdldENvbnN0cnVjdG9yID0gKHRhcmdldCBhcyBvYmplY3QpLmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8VD47XG4gICAgY29uc3QgYWxsTWF0Y2hBc3BlY3RzID0gYXNwZWN0cy5maWx0ZXIoaXQgPT4gaXQucG9pbnRjdXQudGVzdCh0YXJnZXRDb25zdHJ1Y3RvciwgbWV0aG9kTmFtZSkpO1xuXG4gICAgY29uc3QgYmVmb3JlQWR2aWNlQXNwZWN0cyA9IGFsbE1hdGNoQXNwZWN0cy5maWx0ZXIoaXQgPT4gaXQuYWR2aWNlID09PSBBZHZpY2UuQmVmb3JlKS5tYXAoQ2xhc3NUb0luc3RhbmNlKTtcbiAgICBjb25zdCBhZnRlckFkdmljZUFzcGVjdHMgPSBhbGxNYXRjaEFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LmFkdmljZSA9PT0gQWR2aWNlLkFmdGVyKS5tYXAoQ2xhc3NUb0luc3RhbmNlKTtcbiAgICBjb25zdCB0cnlDYXRjaEFkdmljZUFzcGVjdHMgPSBhbGxNYXRjaEFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LmFkdmljZSA9PT0gQWR2aWNlLlRocm93bikubWFwKENsYXNzVG9JbnN0YW5jZSk7XG4gICAgY29uc3QgdHJ5RmluYWxseUFkdmljZUFzcGVjdHMgPSBhbGxNYXRjaEFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LmFkdmljZSA9PT0gQWR2aWNlLkZpbmFsbHkpLm1hcChDbGFzc1RvSW5zdGFuY2UpO1xuICAgIGNvbnN0IGFmdGVyUmV0dXJuQWR2aWNlQXNwZWN0cyA9IGFsbE1hdGNoQXNwZWN0cy5maWx0ZXIoaXQgPT4gaXQuYWR2aWNlID09PSBBZHZpY2UuQWZ0ZXJSZXR1cm4pLm1hcChDbGFzc1RvSW5zdGFuY2UpO1xuICAgIGNvbnN0IGFyb3VuZEFkdmljZUFzcGVjdHMgPSBhbGxNYXRjaEFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LmFkdmljZSA9PT0gQWR2aWNlLkFyb3VuZCkubWFwKENsYXNzVG9JbnN0YW5jZSk7XG5cbiAgICBpZiAoYmVmb3JlQWR2aWNlQXNwZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFzcGVjdFV0aWxzLmFwcGVuZChBZHZpY2UuQmVmb3JlLCAoYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGpvaW5Qb2ludCA9IGNyZWF0ZUFzcGVjdEN0eChBZHZpY2UuQmVmb3JlLCBhcmdzKTtcbiAgICAgICAgICAgIGJlZm9yZUFkdmljZUFzcGVjdHMuZm9yRWFjaChhc3BlY3QgPT4ge1xuICAgICAgICAgICAgICAgIGFzcGVjdC5leGVjdXRlKGpvaW5Qb2ludCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChhZnRlckFkdmljZUFzcGVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLkFmdGVyLCAoYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGpvaW5Qb2ludCA9IGNyZWF0ZUFzcGVjdEN0eChBZHZpY2UuQWZ0ZXIsIGFyZ3MpO1xuICAgICAgICAgICAgYWZ0ZXJBZHZpY2VBc3BlY3RzLmZvckVhY2goYXNwZWN0ID0+IHtcbiAgICAgICAgICAgICAgICBhc3BlY3QuZXhlY3V0ZShqb2luUG9pbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodHJ5Q2F0Y2hBZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXNwZWN0VXRpbHMuYXBwZW5kKEFkdmljZS5UaHJvd24sIChlcnJvciwgYXJncykgPT4ge1xuICAgICAgICAgICAgY29uc3Qgam9pblBvaW50ID0gY3JlYXRlQXNwZWN0Q3R4KEFkdmljZS5UaHJvd24sIGFyZ3MsIG51bGwsIGVycm9yKTtcbiAgICAgICAgICAgIHRyeUNhdGNoQWR2aWNlQXNwZWN0cy5mb3JFYWNoKGFzcGVjdCA9PiB7XG4gICAgICAgICAgICAgICAgYXNwZWN0LmV4ZWN1dGUoam9pblBvaW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodHJ5RmluYWxseUFkdmljZUFzcGVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLkZpbmFsbHksIChhcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgam9pblBvaW50ID0gY3JlYXRlQXNwZWN0Q3R4KEFkdmljZS5GaW5hbGx5LCBhcmdzKTtcbiAgICAgICAgICAgIHRyeUZpbmFsbHlBZHZpY2VBc3BlY3RzLmZvckVhY2goYXNwZWN0ID0+IHtcbiAgICAgICAgICAgICAgICBhc3BlY3QuZXhlY3V0ZShqb2luUG9pbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChhZnRlclJldHVybkFkdmljZUFzcGVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLkFmdGVyUmV0dXJuLCAocmV0dXJuVmFsdWUsIGFyZ3MpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhZnRlclJldHVybkFkdmljZUFzcGVjdHMucmVkdWNlKChfcHJldlJldHVyblZhbHVlLCBhc3BlY3QpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBqb2luUG9pbnQgPSBjcmVhdGVBc3BlY3RDdHgoQWR2aWNlLkFmdGVyUmV0dXJuLCBhcmdzLCByZXR1cm5WYWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFzcGVjdC5leGVjdXRlKGpvaW5Qb2ludCk7XG4gICAgICAgICAgICB9LCByZXR1cm5WYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChhcm91bmRBZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXJvdW5kQWR2aWNlQXNwZWN0cy5mb3JFYWNoKGFzcGVjdCA9PiB7XG4gICAgICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLkFyb3VuZCwgKG9yaWdpbkZuLCBhcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgam9pblBvaW50ID0gY3JlYXRlQXNwZWN0Q3R4KEFkdmljZS5Bcm91bmQsIGFyZ3MsIG51bGwpIGFzIFByb2NlZWRpbmdKb2luUG9pbnQ7XG4gICAgICAgICAgICAgICAgam9pblBvaW50LnByb2NlZWQgPSAoanBBcmdzID0gYXJncykgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luRm4oanBBcmdzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBhc3BlY3QuZXhlY3V0ZShqb2luUG9pbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBhc3BlY3RVdGlscy5leHRyYWN0KCk7XG59XG4iLCJpbXBvcnQgeyByZWNvcmRQcm94eVRhcmdldCB9IGZyb20gJy4uL2NvbW1vbi9Qcm94eVRhcmdldFJlY29yZGVyJztcbmltcG9ydCB0eXBlIHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHR5cGUgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgdHlwZSB7IFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3IgfSBmcm9tICcuLi90eXBlcy9JbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3InO1xuaW1wb3J0IHR5cGUgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBBc3BlY3RNZXRhZGF0YSB9IGZyb20gJy4vQXNwZWN0TWV0YWR0YSc7XG5pbXBvcnQgeyBjcmVhdGVBc3BlY3QgfSBmcm9tICcuL2NyZWF0ZUFzcGVjdCc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3IgaW1wbGVtZW50cyBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yIHtcbiAgICBzdGF0aWMgY3JlYXRlKGFwcEN0eDogQXBwbGljYXRpb25Db250ZXh0KTogTmV3YWJsZTxBT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3I+IHtcbiAgICAgICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgQU9QSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yIHtcbiAgICAgICAgICAgIHByb3RlY3RlZCByZWFkb25seSBhcHBDdHg6IEFwcGxpY2F0aW9uQ29udGV4dCA9IGFwcEN0eDtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IGFwcEN0eDogQXBwbGljYXRpb25Db250ZXh0O1xuICAgIGFmdGVySW5zdGFudGlhdGlvbjxUIGV4dGVuZHMgb2JqZWN0PihpbnN0YW5jZTogVCk6IFQge1xuICAgICAgICBpZiAoIWluc3RhbmNlIHx8IHR5cGVvZiBpbnN0YW5jZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjbGF6eiA9IGluc3RhbmNlLmNvbnN0cnVjdG9yO1xuXG4gICAgICAgIGNvbnN0IGFzcGVjdE1ldGFkYXRhID0gQXNwZWN0TWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWFkZXIoKTtcbiAgICAgICAgLy8gY29uc3QgdXNlQXNwZWN0TWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShjbGF6eiwgQU9QQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgIC8vIGNvbnN0IHVzZUFzcGVjdE1ldGFkYXRhUmVhZGVyID0gdXNlQXNwZWN0TWV0YWRhdGEucmVhZGVyKCk7XG4gICAgICAgIC8vIGNvbnN0IHVzZUFzcGVjdHNNYXAgPSB1c2VBc3BlY3RNZXRhZGF0YVJlYWRlci5nZXRBc3BlY3RzKCk7XG4gICAgICAgIC8vIGlmICh1c2VBc3BlY3RzTWFwLnNpemUgPT09IDApIHtcbiAgICAgICAgLy8gICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIGNvbnN0IGFzcGVjdFN0b3JlTWFwID0gbmV3IFdlYWtNYXA8b2JqZWN0LCBNYXA8c3RyaW5nIHwgc3ltYm9sLCBGdW5jdGlvbj4+KCk7XG4gICAgICAgIGFzcGVjdFN0b3JlTWFwLnNldChpbnN0YW5jZSwgbmV3IE1hcDxzdHJpbmcgfCBzeW1ib2wsIEZ1bmN0aW9uPigpKTtcblxuICAgICAgICBjb25zdCBwcm94eVJlc3VsdCA9IG5ldyBQcm94eShpbnN0YW5jZSwge1xuICAgICAgICAgICAgZ2V0OiAodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpblZhbHVlID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcik7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChwcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NvbnN0cnVjdG9yJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5WYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCkgJiYgdHlwZW9mIG9yaWdpblZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzcGVjdE1hcCA9IGFzcGVjdFN0b3JlTWFwLmdldChpbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghYXNwZWN0TWFwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFzcGVjdE1hcC5oYXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhc3BlY3RNYXAuZ2V0KHByb3ApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzcGVjdHNPZk1ldGhvZCA9IGFzcGVjdE1ldGFkYXRhLmdldEFzcGVjdHMoY2xhenogYXMgSWRlbnRpZmllciwgcHJvcCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzcGVjdEZuID0gY3JlYXRlQXNwZWN0KHRoaXMuYXBwQ3R4LCB0YXJnZXQsIHByb3AsIG9yaWdpblZhbHVlLCBhc3BlY3RzT2ZNZXRob2QpO1xuICAgICAgICAgICAgICAgICAgICBhc3BlY3RNYXAuc2V0KHByb3AsIGFzcGVjdEZuKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFzcGVjdEZuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Rlc3QnKSB7XG4gICAgICAgICAgICByZWNvcmRQcm94eVRhcmdldChwcm94eVJlc3VsdCwgaW5zdGFuY2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHByb3h5UmVzdWx0O1xuICAgIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHR5cGUgeyBFdmFsdWF0b3IgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0b3InO1xuXG5leHBvcnQgY2xhc3MgQXJndkV2YWx1YXRvciBpbXBsZW1lbnRzIEV2YWx1YXRvciB7XG4gICAgZXZhbDxULCBBID0gc3RyaW5nW10+KF9jb250ZXh0OiBBcHBsaWNhdGlvbkNvbnRleHQsIGV4cHJlc3Npb246IHN0cmluZywgYXJncz86IEEpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc3QgYXJndiA9IGFyZ3MgfHwgcHJvY2Vzcy5hcmd2O1xuXG4gICAgICAgIGNvbnN0IG1pbmltaXN0ID0gcmVxdWlyZSgnbWluaW1pc3QnKTtcbiAgICAgICAgY29uc3QgbWFwID0gbWluaW1pc3QoYXJndik7XG4gICAgICAgIHJldHVybiBtYXBbZXhwcmVzc2lvbl07XG4gICAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5pbXBvcnQgdHlwZSB7IEV2YWx1YXRvciB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRvcic7XG5cbmV4cG9ydCBjbGFzcyBFbnZpcm9ubWVudEV2YWx1YXRvciBpbXBsZW1lbnRzIEV2YWx1YXRvciB7XG4gICAgZXZhbDxUPihfY29udGV4dDogQXBwbGljYXRpb25Db250ZXh0LCBleHByZXNzaW9uOiBzdHJpbmcpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHByb2Nlc3MuZW52W2V4cHJlc3Npb25dIGFzIFQgfCB1bmRlZmluZWQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5pbXBvcnQgdHlwZSB7IEV2YWx1YXRvciB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRvcic7XG5pbXBvcnQgdHlwZSB7IEpTT05EYXRhIH0gZnJvbSAnLi4vdHlwZXMvSlNPTkRhdGEnO1xuXG5leHBvcnQgY2xhc3MgSlNPTkRhdGFFdmFsdWF0b3IgaW1wbGVtZW50cyBFdmFsdWF0b3Ige1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbmFtZXNwYWNlRGF0YU1hcCA9IG5ldyBNYXA8c3RyaW5nLCBKU09ORGF0YT4oKTtcbiAgICBldmFsPFQ+KF9jb250ZXh0OiBBcHBsaWNhdGlvbkNvbnRleHQsIGV4cHJlc3Npb246IHN0cmluZyk6IFQgfCB1bmRlZmluZWQge1xuICAgICAgICBjb25zdCBjb2xvbkluZGV4ID0gZXhwcmVzc2lvbi5pbmRleE9mKCc6Jyk7XG4gICAgICAgIGlmIChjb2xvbkluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbmNvcnJlY3QgZXhwcmVzc2lvbiwgbmFtZXNwYWNlIG5vdCBzcGVjaWZpZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuYW1lc3BhY2UgPSBleHByZXNzaW9uLnN1YnN0cmluZygwLCBjb2xvbkluZGV4KTtcbiAgICAgICAgY29uc3QgZXhwID0gZXhwcmVzc2lvbi5zdWJzdHJpbmcoY29sb25JbmRleCArIDEpO1xuICAgICAgICBpZiAoIXRoaXMubmFtZXNwYWNlRGF0YU1hcC5oYXMobmFtZXNwYWNlKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbmNvcnJlY3QgZXhwcmVzc2lvbjogbmFtZXNwYWNlIG5vdCByZWNvcmRlZDogXCIke25hbWVzcGFjZX1cImApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLm5hbWVzcGFjZURhdGFNYXAuZ2V0KG5hbWVzcGFjZSkgYXMgSlNPTkRhdGE7XG4gICAgICAgIHJldHVybiBydW5FeHByZXNzaW9uKGV4cCwgZGF0YSBhcyBvYmplY3QpO1xuICAgIH1cbiAgICByZWNvcmREYXRhKG5hbWVzcGFjZTogc3RyaW5nLCBkYXRhOiBKU09ORGF0YSkge1xuICAgICAgICB0aGlzLm5hbWVzcGFjZURhdGFNYXAuc2V0KG5hbWVzcGFjZSwgZGF0YSk7XG4gICAgfVxuICAgIGdldEpTT05EYXRhKG5hbWVzcGFjZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWVzcGFjZURhdGFNYXAuZ2V0KG5hbWVzcGFjZSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBydW5FeHByZXNzaW9uKGV4cHJlc3Npb246IHN0cmluZywgcm9vdENvbnRleHQ6IG9iamVjdCkge1xuICAgIGNvbnN0IGZuID0gY29tcGlsZUV4cHJlc3Npb24oZXhwcmVzc2lvbik7XG4gICAgcmV0dXJuIGZuKHJvb3RDb250ZXh0KTtcbn1cblxuZnVuY3Rpb24gY29tcGlsZUV4cHJlc3Npb24oZXhwcmVzc2lvbjogc3RyaW5nKSB7XG4gICAgaWYgKGV4cHJlc3Npb24uaW5kZXhPZignLCcpID4gLTEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbmNvcnJlY3QgZXhwcmVzc2lvbiBzeW50YXgsIFRoZSAnLCcgaXMgbm90IGFsbG93ZWQgaW4gZXhwcmVzc2lvbjogXCIke2V4cHJlc3Npb259XCJgKTtcbiAgICB9XG4gICAgaWYgKGV4cHJlc3Npb24ubGVuZ3RoID4gMTIwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBJbmNvcnJlY3QgZXhwcmVzc2lvbiBzeW50YXgsIGV4cHJlc3Npb24gbGVuZ3RoIGNhbm5vdCBiZSBncmVhdGVyIHRoYW4gMTIwLCBidXQgYWN0dWFsOiAke2V4cHJlc3Npb24ubGVuZ3RofWBcbiAgICAgICAgKTtcbiAgICB9XG4gICAgaWYgKC9cXCguKj9cXCkvLnRlc3QoZXhwcmVzc2lvbikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbmNvcnJlY3QgZXhwcmVzc2lvbiBzeW50YXgsIHBhcmVudGhlc2VzIGFyZSBub3QgYWxsb3dlZCBpbiBleHByZXNzaW9uOiBcIiR7ZXhwcmVzc2lvbn1cImApO1xuICAgIH1cbiAgICBleHByZXNzaW9uID0gZXhwcmVzc2lvbi50cmltKCk7XG4gICAgaWYgKGV4cHJlc3Npb24gPT09ICcnKSB7XG4gICAgICAgIHJldHVybiAocm9vdDogb2JqZWN0KSA9PiByb290O1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3RWYXJOYW1lID0gdmFyTmFtZSgnY29udGV4dCcpO1xuICAgIHJldHVybiBuZXcgRnVuY3Rpb24oXG4gICAgICAgIHJvb3RWYXJOYW1lLFxuICAgICAgICBgXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuICR7cm9vdFZhck5hbWV9LiR7ZXhwcmVzc2lvbn07XG4gICAgICAgIH0gY2F0Y2goZXJyb3IpIHsgdGhyb3cgZXJyb3IgfVxuICAgIGBcbiAgICApO1xufVxubGV0IFZBUl9TRVFVRU5DRSA9IERhdGUubm93KCk7XG5mdW5jdGlvbiB2YXJOYW1lKHByZWZpeDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGAke3ByZWZpeH0keyhWQVJfU0VRVUVOQ0UrKykudG9TdHJpbmcoMTYpfWA7XG59XG4iLCJleHBvcnQgZW51bSBMaWZlY3ljbGUge1xuICAgIFBSRV9JTkpFQ1QgPSAnaW9jLXNjb3BlOnByZS1pbmplY3QnLFxuICAgIFBPU1RfSU5KRUNUID0gJ2lvYy1zY29wZTpwb3N0LWluamVjdCcsXG4gICAgUFJFX0RFU1RST1kgPSAnaW9jLXNjb3BlOnByZS1kZXN0cm95J1xufVxuIiwiaW1wb3J0IHsgTGlmZWN5Y2xlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9MaWZlY3ljbGUnO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZva2VQcmVEZXN0cm95KGluc3RhbmNlOiB1bmtub3duKSB7XG4gICAgY29uc3QgY2xhenogPSBpbnN0YW5jZT8uY29uc3RydWN0b3I7XG4gICAgaWYgKCFjbGF6eikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoY2xhenosIENsYXNzTWV0YWRhdGEpO1xuICAgIGNvbnN0IHByZURlc3Ryb3lNZXRob2RzID0gbWV0YWRhdGEuZ2V0TWV0aG9kcyhMaWZlY3ljbGUuUFJFX0RFU1RST1kpO1xuICAgIHByZURlc3Ryb3lNZXRob2RzLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IGNsYXp6LnByb3RvdHlwZVttZXRob2ROYW1lXTtcbiAgICAgICAgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIG1ldGhvZC5hcHBseShpbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbiIsImxldCBpbnN0YW5jZVNlcmlhbE5vID0gLTE7XG5cbmV4cG9ydCBjbGFzcyBDb21wb25lbnRJbnN0YW5jZVdyYXBwZXIge1xuICAgIHB1YmxpYyByZWFkb25seSBzZXJpYWxObyA9ICsraW5zdGFuY2VTZXJpYWxObztcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBpbnN0YW5jZTogdW5rbm93bikge31cblxuICAgIHB1YmxpYyBjb21wYXJlVG8ob3RoZXI6IENvbXBvbmVudEluc3RhbmNlV3JhcHBlcik6IC0xIHwgMCB8IDEge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXJpYWxObyA+IG90aGVyLnNlcmlhbE5vID8gLTEgOiB0aGlzLnNlcmlhbE5vIDwgb3RoZXIuc2VyaWFsTm8gPyAxIDogMDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBpbnZva2VQcmVEZXN0cm95IH0gZnJvbSAnLi4vY29tbW9uL2ludm9rZVByZURlc3Ryb3knO1xuaW1wb3J0IHsgQ29tcG9uZW50SW5zdGFuY2VXcmFwcGVyIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9Db21wb25lbnRJbnN0YW5jZVdyYXBwZXInO1xuaW1wb3J0IHR5cGUgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgdHlwZSB7IEdldEluc3RhbmNlT3B0aW9ucywgSW5zdGFuY2VSZXNvbHV0aW9uLCBTYXZlSW5zdGFuY2VPcHRpb25zIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2VSZXNvbHV0aW9uJztcblxuZXhwb3J0IGNsYXNzIFNpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbiBpbXBsZW1lbnRzIEluc3RhbmNlUmVzb2x1dGlvbiB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBJTlNUQU5DRV9NQVAgPSBuZXcgTWFwPElkZW50aWZpZXIsIENvbXBvbmVudEluc3RhbmNlV3JhcHBlcj4oKTtcbiAgICBnZXRJbnN0YW5jZTxULCBPPihvcHRpb25zOiBHZXRJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiBUIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuSU5TVEFOQ0VfTUFQLmdldChvcHRpb25zLmlkZW50aWZpZXIpPy5pbnN0YW5jZSBhcyBUO1xuICAgIH1cblxuICAgIHNhdmVJbnN0YW5jZTxULCBPPihvcHRpb25zOiBTYXZlSW5zdGFuY2VPcHRpb25zPFQsIE8+KTogdm9pZCB7XG4gICAgICAgIHRoaXMuSU5TVEFOQ0VfTUFQLnNldChvcHRpb25zLmlkZW50aWZpZXIsIG5ldyBDb21wb25lbnRJbnN0YW5jZVdyYXBwZXIob3B0aW9ucy5pbnN0YW5jZSkpO1xuICAgIH1cblxuICAgIHNob3VsZEdlbmVyYXRlPFQsIE8+KG9wdGlvbnM6IEdldEluc3RhbmNlT3B0aW9uczxULCBPPik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gIXRoaXMuSU5TVEFOQ0VfTUFQLmhhcyhvcHRpb25zLmlkZW50aWZpZXIpO1xuICAgIH1cbiAgICBkZXN0cm95KCkge1xuICAgICAgICBjb25zdCBpbnN0YW5jZVdyYXBwZXJzID0gQXJyYXkuZnJvbSh0aGlzLklOU1RBTkNFX01BUC52YWx1ZXMoKSk7XG4gICAgICAgIGluc3RhbmNlV3JhcHBlcnMuc29ydCgoYSwgYikgPT4gYS5jb21wYXJlVG8oYikpO1xuICAgICAgICBpbnN0YW5jZVdyYXBwZXJzLmZvckVhY2goaW5zdGFuY2VXcmFwcGVyID0+IHtcbiAgICAgICAgICAgIGludm9rZVByZURlc3Ryb3koaW5zdGFuY2VXcmFwcGVyLmluc3RhbmNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuSU5TVEFOQ0VfTUFQLmNsZWFyKCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBHZXRJbnN0YW5jZU9wdGlvbnMsIEluc3RhbmNlUmVzb2x1dGlvbiwgU2F2ZUluc3RhbmNlT3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlUmVzb2x1dGlvbic7XG5pbXBvcnQgeyBTaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24gfSBmcm9tICcuL1NpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbic7XG5cbmNvbnN0IFNJTkdMRVRPTl9JTlNUQU5DRV9TSU5HTEVUT04gPSBuZXcgU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uKCk7XG5cbmV4cG9ydCBjbGFzcyBHbG9iYWxTaGFyZWRJbnN0YW5jZVJlc29sdXRpb24gaW1wbGVtZW50cyBJbnN0YW5jZVJlc29sdXRpb24ge1xuICAgIGdldEluc3RhbmNlPFQsIE8+KG9wdGlvbnM6IEdldEluc3RhbmNlT3B0aW9uczxULCBPPik6IFQge1xuICAgICAgICByZXR1cm4gU0lOR0xFVE9OX0lOU1RBTkNFX1NJTkdMRVRPTi5nZXRJbnN0YW5jZShvcHRpb25zKTtcbiAgICB9XG5cbiAgICBzYXZlSW5zdGFuY2U8VCwgTz4ob3B0aW9uczogU2F2ZUluc3RhbmNlT3B0aW9uczxULCBPPik6IHZvaWQge1xuICAgICAgICBTSU5HTEVUT05fSU5TVEFOQ0VfU0lOR0xFVE9OLnNhdmVJbnN0YW5jZShvcHRpb25zKTtcbiAgICB9XG5cbiAgICBzaG91bGRHZW5lcmF0ZTxULCBPPihvcHRpb25zOiBHZXRJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIFNJTkdMRVRPTl9JTlNUQU5DRV9TSU5HTEVUT04uc2hvdWxkR2VuZXJhdGUob3B0aW9ucyk7XG4gICAgfVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIC8vIFBBU1M7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgaW52b2tlUHJlRGVzdHJveSB9IGZyb20gJy4uL2NvbW1vbi9pbnZva2VQcmVEZXN0cm95JztcbmltcG9ydCB0eXBlIHsgSW5zdGFuY2VSZXNvbHV0aW9uLCBTYXZlSW5zdGFuY2VPcHRpb25zIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2VSZXNvbHV0aW9uJztcblxuZXhwb3J0IGNsYXNzIFRyYW5zaWVudEluc3RhbmNlUmVzb2x1dGlvbiBpbXBsZW1lbnRzIEluc3RhbmNlUmVzb2x1dGlvbiB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBpbnN0YW5jZXMgPSBuZXcgU2V0PHVua25vd24+KCk7XG4gICAgc2hvdWxkR2VuZXJhdGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGdldEluc3RhbmNlPFQ+KCk6IFQgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2F2ZUluc3RhbmNlPFQsIE8+KG9wdGlvbnM6IFNhdmVJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZXMuYWRkKG9wdGlvbnMuaW5zdGFuY2UpO1xuICAgIH1cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLmluc3RhbmNlcy5mb3JFYWNoKGl0ID0+IHtcbiAgICAgICAgICAgIGlmICghaXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbnZva2VQcmVEZXN0cm95KGl0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaW5zdGFuY2VzLmNsZWFyKCk7XG4gICAgfVxuICAgIGRlc3Ryb3lUaGF0PFQ+KGluc3RhbmNlOiBUKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5pbnN0YW5jZXMuaGFzKGluc3RhbmNlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGludm9rZVByZURlc3Ryb3koaW5zdGFuY2UpO1xuICAgICAgICB0aGlzLmluc3RhbmNlcy5kZWxldGUoaW5zdGFuY2UpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IENsYXNzTWV0YWRhdGEsIHR5cGUgQ2xhc3NNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgdHlwZSB7IEluc3RhbmNlIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2UnO1xuaW1wb3J0IHR5cGUgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgdHlwZSB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4vQXBwbGljYXRpb25Db250ZXh0JztcbmltcG9ydCB7IExpZmVjeWNsZSB9IGZyb20gJy4vTGlmZWN5Y2xlJztcblxuZXhwb3J0IGNsYXNzIExpZmVjeWNsZU1hbmFnZXI8VCA9IHVua25vd24+IHtcbiAgICBwcml2YXRlIGNsYXNzTWV0YWRhdGFSZWFkZXI6IENsYXNzTWV0YWRhdGFSZWFkZXI8VD47XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY29tcG9uZW50Q2xhc3M6IE5ld2FibGU8VD4sXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY29udGFpbmVyOiBBcHBsaWNhdGlvbkNvbnRleHRcbiAgICApIHtcbiAgICAgICAgdGhpcy5jbGFzc01ldGFkYXRhUmVhZGVyID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGhpcy5jb21wb25lbnRDbGFzcywgQ2xhc3NNZXRhZGF0YSkucmVhZGVyKCk7XG4gICAgfVxuICAgIGludm9rZVByZUluamVjdE1ldGhvZChpbnN0YW5jZTogSW5zdGFuY2U8VD4pIHtcbiAgICAgICAgY29uc3QgbWV0aG9kcyA9IHRoaXMuY2xhc3NNZXRhZGF0YVJlYWRlci5nZXRNZXRob2RzKExpZmVjeWNsZS5QUkVfSU5KRUNUKTtcbiAgICAgICAgdGhpcy5pbnZva2VMaWZlY3ljbGVNZXRob2RzKGluc3RhbmNlLCBtZXRob2RzKTtcbiAgICB9XG4gICAgaW52b2tlUG9zdEluamVjdE1ldGhvZChpbnN0YW5jZTogSW5zdGFuY2U8VD4pIHtcbiAgICAgICAgY29uc3QgbWV0aG9kcyA9IHRoaXMuY2xhc3NNZXRhZGF0YVJlYWRlci5nZXRNZXRob2RzKExpZmVjeWNsZS5QT1NUX0lOSkVDVCk7XG4gICAgICAgIHRoaXMuaW52b2tlTGlmZWN5Y2xlTWV0aG9kcyhpbnN0YW5jZSwgbWV0aG9kcyk7XG4gICAgfVxuICAgIGludm9rZVByZURlc3Ryb3lJbmplY3RNZXRob2QoaW5zdGFuY2U6IEluc3RhbmNlPFQ+KSB7XG4gICAgICAgIGNvbnN0IG1ldGhvZHMgPSB0aGlzLmNsYXNzTWV0YWRhdGFSZWFkZXIuZ2V0TWV0aG9kcyhMaWZlY3ljbGUuUFJFX0RFU1RST1kpO1xuICAgICAgICB0aGlzLmludm9rZUxpZmVjeWNsZU1ldGhvZHMoaW5zdGFuY2UsIG1ldGhvZHMpO1xuICAgIH1cbiAgICBwcml2YXRlIGludm9rZUxpZmVjeWNsZU1ldGhvZHMoaW5zdGFuY2U6IEluc3RhbmNlPFQ+LCBtZXRob2RLZXlzOiBBcnJheTxzdHJpbmcgfCBzeW1ib2w+KSB7XG4gICAgICAgIG1ldGhvZEtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW52b2tlKGluc3RhbmNlW2tleV0sIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0OiBpbnN0YW5jZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEZhY3RvcnlSZWNvcmRlciB9IGZyb20gJy4uL2NvbW1vbi9GYWN0b3J5UmVjb3JkZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSwgdHlwZSBDbGFzc01ldGFkYXRhUmVhZGVyIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0dsb2JhbE1ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHR5cGUgeyBBbnlGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzL0FueUZ1bmN0aW9uJztcbmltcG9ydCB0eXBlIHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHR5cGUgeyBJbnN0YW5jZSB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlJztcbmltcG9ydCB0eXBlIHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHR5cGUgeyBTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4uL3R5cGVzL1NlcnZpY2VGYWN0b3J5JztcbmltcG9ydCB0eXBlIHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHR5cGUgeyBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyIH0gZnJvbSAnLi9JbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyJztcbmltcG9ydCB7IExpZmVjeWNsZU1hbmFnZXIgfSBmcm9tICcuL0xpZmVjeWNsZU1hbmFnZXInO1xuaW1wb3J0IHsgU2VydmljZUZhY3RvcnlEZWYgfSBmcm9tICcuL1NlcnZpY2VGYWN0b3J5RGVmJztcbmltcG9ydCB7IHZhbHVlIH0gZnJvbSAnQHZnZXJib3QvbGF6aWx5JztcblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudEluc3RhbmNlQnVpbGRlcjxUPiB7XG4gICAgcHJpdmF0ZSBnZXRDb25zdHJ1Y3RvckFyZ3M6ICgpID0+IHVua25vd25bXSA9ICgpID0+IFtdO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcHJvcGVydHlGYWN0b3JpZXMgPSBuZXcgRmFjdG9yeVJlY29yZGVyKCk7XG4gICAgcHJpdmF0ZSBsYXp5TW9kZTogYm9vbGVhbiA9IHRydWU7XG4gICAgcHJpdmF0ZSByZWFkb25seSBsaWZlY3ljbGVSZXNvbHZlcjogTGlmZWN5Y2xlTWFuYWdlcjxUPjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNsYXNzTWV0YWRhdGFSZWFkZXI6IENsYXNzTWV0YWRhdGFSZWFkZXI8VD47XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY29tcG9uZW50Q2xhc3M6IE5ld2FibGU8VD4sXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY29udGFpbmVyOiBBcHBsaWNhdGlvbkNvbnRleHQsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlcjogSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlclxuICAgICkge1xuICAgICAgICB0aGlzLmxpZmVjeWNsZVJlc29sdmVyID0gbmV3IExpZmVjeWNsZU1hbmFnZXI8VD4oY29tcG9uZW50Q2xhc3MsIGNvbnRhaW5lcik7XG4gICAgICAgIGNvbnN0IHJlYWRlciA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGNvbXBvbmVudENsYXNzLCBDbGFzc01ldGFkYXRhKS5yZWFkZXIoKTtcbiAgICAgICAgdGhpcy5jbGFzc01ldGFkYXRhUmVhZGVyID0gcmVhZGVyO1xuICAgICAgICB0aGlzLmFwcGVuZENsYXNzTWV0YWRhdGEocmVhZGVyKTtcbiAgICB9XG4gICAgYXBwZW5kTGF6eU1vZGUobGF6eU1vZGU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5sYXp5TW9kZSA9IGxhenlNb2RlO1xuICAgIH1cbiAgICBwcml2YXRlIGFwcGVuZENsYXNzTWV0YWRhdGE8VD4oY2xhc3NNZXRhZGF0YVJlYWRlcjogQ2xhc3NNZXRhZGF0YVJlYWRlcjxUPikge1xuICAgICAgICBjb25zdCB0eXBlcyA9IGNsYXNzTWV0YWRhdGFSZWFkZXIuZ2V0Q29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlcygpO1xuICAgICAgICB0aGlzLmdldENvbnN0cnVjdG9yQXJncyA9ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlcy5tYXAoaXQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRhaW5lci5nZXRJbnN0YW5jZShpdC5pc05ld2FibGUgPyBpdC5jbGF6eiA6IGl0LmlkZW50aWZpZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGdsb2JhbE1ldGFkYXRhUmVhZGVyID0gR2xvYmFsTWV0YWRhdGEuZ2V0UmVhZGVyKCk7XG4gICAgICAgIGNvbnN0IHByb3BlcnR5VHlwZXMgPSBjbGFzc01ldGFkYXRhUmVhZGVyLmdldFByb3BlcnR5VHlwZU1hcCgpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VHlwZV0gb2YgcHJvcGVydHlUeXBlcykge1xuICAgICAgICAgICAgaWYgKHByb3BlcnR5VHlwZS5pc05ld2FibGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5RmFjdG9yaWVzLmFwcGVuZChwcm9wZXJ0eU5hbWUsIChjb250YWluZXIsIG93bmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiBjb250YWluZXIuZ2V0SW5zdGFuY2UocHJvcGVydHlUeXBlLmNsYXp6LCBvd25lcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpZGVudGlmaWVyID0gcHJvcGVydHlUeXBlLmlkZW50aWZpZXIgYXMgRXhjbHVkZTxJZGVudGlmaWVyLCBOZXdhYmxlPHVua25vd24+PjtcbiAgICAgICAgICAgIGNvbnN0IGZhY3RvcnlEZWYgPSB0aGlzLmNvbnRhaW5lci5nZXRGYWN0b3J5KGlkZW50aWZpZXIpO1xuICAgICAgICAgICAgaWYgKGZhY3RvcnlEZWYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5RmFjdG9yaWVzLnNldChwcm9wZXJ0eU5hbWUsIGZhY3RvcnlEZWYpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcHJvcGVydHlDbGFzc01ldGFkYXRhID0gZ2xvYmFsTWV0YWRhdGFSZWFkZXIuZ2V0Q2xhc3NNZXRhZGF0YShpZGVudGlmaWVyKTtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eUNsYXNzTWV0YWRhdGEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5RmFjdG9yaWVzLnNldChwcm9wZXJ0eU5hbWUsIFNlcnZpY2VGYWN0b3J5RGVmLmNyZWF0ZUZyb21DbGFzc01ldGFkYXRhKHByb3BlcnR5Q2xhc3NNZXRhZGF0YSkpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcHJvcGVydHlGYWN0b3J5RGVmID0gZ2xvYmFsTWV0YWRhdGFSZWFkZXIuZ2V0Q29tcG9uZW50RmFjdG9yeShpZGVudGlmaWVyKTtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eUZhY3RvcnlEZWYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5RmFjdG9yaWVzLnNldChwcm9wZXJ0eU5hbWUsIHByb3BlcnR5RmFjdG9yeURlZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgYnVpbGQoKSB7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmdldENvbnN0cnVjdG9yQXJncygpO1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gdGhpcy5jcmVhdGVQcm9wZXJ0aWVzR2V0dGVyQnVpbGRlcigpO1xuICAgICAgICBjb25zdCBpc0NyZWF0aW5nSW5zdEF3YXJlUHJvY2Vzc29yID0gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyLmlzSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3ModGhpcy5jb21wb25lbnRDbGFzcyk7XG4gICAgICAgIGlmIChpc0NyZWF0aW5nSW5zdEF3YXJlUHJvY2Vzc29yKSB7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyB0aGlzLmNvbXBvbmVudENsYXNzKC4uLmFyZ3MpIGFzIEluc3RhbmNlPFQ+O1xuICAgICAgICAgICAgdGhpcy5saWZlY3ljbGVSZXNvbHZlci5pbnZva2VQcmVJbmplY3RNZXRob2QoaW5zdGFuY2UpO1xuICAgICAgICAgICAgZGVmaW5lUHJvcGVydGllcy5jYWxsKHRoaXMsIGluc3RhbmNlKTtcbiAgICAgICAgICAgIHRoaXMubGlmZWN5Y2xlUmVzb2x2ZXIuaW52b2tlUG9zdEluamVjdE1ldGhvZChpbnN0YW5jZSk7XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgaW5zdGFuY2U6IHVuZGVmaW5lZCB8IEluc3RhbmNlPFQ+ID0gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyLmJlZm9yZUluc3RhbnRpYXRpb24odGhpcy5jb21wb25lbnRDbGFzcywgYXJncyk7XG4gICAgICAgICAgICBpZiAoIWluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2UgPSBuZXcgdGhpcy5jb21wb25lbnRDbGFzcyguLi5hcmdzKSBhcyBJbnN0YW5jZTxUPjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubGlmZWN5Y2xlUmVzb2x2ZXIuaW52b2tlUHJlSW5qZWN0TWV0aG9kKGluc3RhbmNlKTtcbiAgICAgICAgICAgIGRlZmluZVByb3BlcnRpZXMuY2FsbCh0aGlzLCBpbnN0YW5jZSk7XG4gICAgICAgICAgICBpbnN0YW5jZSA9IHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5hZnRlckluc3RhbnRpYXRpb24oaW5zdGFuY2UpO1xuICAgICAgICAgICAgdGhpcy5saWZlY3ljbGVSZXNvbHZlci5pbnZva2VQb3N0SW5qZWN0TWV0aG9kKGluc3RhbmNlKTtcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGhpczogQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyPFQ+LCBpbnN0YW5jZTogSW5zdGFuY2U8VD4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdldHRlciA9IHZhbHVlKGluc3RhbmNlIGFzIFQpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVmaW5lUHJvcGVydHkoaW5zdGFuY2UsIHR5cGVvZiBrZXkgPT09ICdudW1iZXInID8gYCR7a2V5fWAgOiBrZXksIGdldHRlcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGRlZmluZVByb3BlcnR5PFQsIFY+KGluc3RhbmNlOiBULCBrZXk6IHN0cmluZyB8IHN5bWJvbCwgZ2V0dGVyOiAoKSA9PiBWKSB7XG4gICAgICAgIGlmICh0aGlzLmxhenlNb2RlKSB7XG4gICAgICAgICAgICBjb25zdCBsYXp5VmFsdWUgPSB2YWx1ZSgoKSA9PiAoe1xuICAgICAgICAgICAgICAgIHZhbHVlOiBnZXR0ZXIoKVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGluc3RhbmNlLCBrZXksIHtcbiAgICAgICAgICAgICAgICBnZXQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhenlWYWx1ZS5nZXQoKS52YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcbiAgICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgICAgIGluc3RhbmNlW2tleV0gPSBnZXR0ZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZVByb3BlcnRpZXNHZXR0ZXJCdWlsZGVyKCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgTWFwPGtleW9mIFQsIChpbnN0YW5jZTogVCkgPT4gKCkgPT4gdW5rbm93biB8IHVua25vd25bXT4oKTtcbiAgICAgICAgY29uc3QgcHJvcGVydHlUeXBlTWFwID0gdGhpcy5jbGFzc01ldGFkYXRhUmVhZGVyLmdldFByb3BlcnR5VHlwZU1hcCgpO1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIGZhY3RvcnlEZWZdIG9mIHRoaXMucHJvcGVydHlGYWN0b3JpZXMuaXRlcmF0b3IoKSkge1xuICAgICAgICAgICAgY29uc3QgaW5qZWN0aW9uVHlwZSA9IHByb3BlcnR5VHlwZU1hcC5nZXQoa2V5KSE7XG4gICAgICAgICAgICBjb25zdCBpc0FycmF5ID0gIWluamVjdGlvblR5cGUuaXNOZXdhYmxlICYmIGluamVjdGlvblR5cGUuY2xhenogPT09IChBcnJheSBhcyB1bmtub3duIGFzIE5ld2FibGU8dW5rbm93bj4pO1xuICAgICAgICAgICAgaWYgKCFpc0FycmF5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGZhY3RvcnlEZWYuZmFjdG9yaWVzLnNpemUgPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGBNdWx0aXBsZSBtYXRjaGluZyBpbmplY3RhYmxlcyBmb3VuZCBmb3IgcHJvcGVydHkgaW5qZWN0aW9uLFxcbmJ1dCBwcm9wZXJ0eSAke2tleS50b1N0cmluZygpfSBpcyBub3QgYW4gYXJyYXksXG4gICAgICAgICAgICAgICAgICAgICAgICBJdCBpcyBhbWJpZ3VvdXMgdG8gZGV0ZXJtaW5lIHdoaWNoIG9iamVjdCBzaG91bGQgYmUgaW5qZWN0ZWQhYFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBbZmFjdG9yeSwgaW5qZWN0aW9uc10gPSBmYWN0b3J5RGVmLmZhY3Rvcmllcy5lbnRyaWVzKCkubmV4dCgpLnZhbHVlIGFzIFtcbiAgICAgICAgICAgICAgICAgICAgU2VydmljZUZhY3Rvcnk8dW5rbm93biwgdW5rbm93bj4sXG4gICAgICAgICAgICAgICAgICAgIElkZW50aWZpZXJbXVxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgcmVzdWx0LnNldChrZXkgYXMga2V5b2YgVCwgPFQ+KGluc3RhbmNlOiBUKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2R1Y2VyID0gZmFjdG9yeSh0aGlzLmNvbnRhaW5lciwgaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGFpbmVyLmludm9rZShwcm9kdWNlciwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluamVjdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuc2V0KGtleSBhcyBrZXlvZiBULCA8VD4oaW5zdGFuY2U6IFQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvZHVjZXJBbmRJbmplY3Rpb25zID0gQXJyYXkuZnJvbShmYWN0b3J5RGVmLmZhY3RvcmllcykubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgKFtmYWN0b3J5LCBpbmplY3Rpb25zXSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZmFjdG9yeSh0aGlzLmNvbnRhaW5lciwgaW5zdGFuY2UpLCBpbmplY3Rpb25zXSBhcyBbQW55RnVuY3Rpb248dW5rbm93bj4sIElkZW50aWZpZXJbXV1cbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2R1Y2VyQW5kSW5qZWN0aW9ucy5tYXAoKFtwcm9kdWNlciwgaW5qZWN0aW9uc10pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb250YWluZXIuaW52b2tlKHByb2R1Y2VyLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluamVjdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBBbnlGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzL0FueUZ1bmN0aW9uJztcblxuZXhwb3J0IHR5cGUgRXZlbnRMaXN0ZW5lciA9IEFueUZ1bmN0aW9uO1xuZXhwb3J0IGNsYXNzIEV2ZW50RW1pdHRlciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBldmVudHMgPSBuZXcgTWFwPHN0cmluZyB8IHN5bWJvbCwgRXZlbnRMaXN0ZW5lcltdPigpO1xuXG4gICAgb24odHlwZTogc3RyaW5nIHwgc3ltYm9sLCBsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5ldmVudHMuZ2V0KHR5cGUpO1xuICAgICAgICBpZiAobGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpc3RlbmVycyA9IFtsaXN0ZW5lcl07XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5zZXQodHlwZSwgbGlzdGVuZXJzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbHMgPSBsaXN0ZW5lcnMgYXMgRXZlbnRMaXN0ZW5lcltdO1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBscy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgbHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgZW1pdCh0eXBlOiBzdHJpbmcgfCBzeW1ib2wsIC4uLmFyZ3M6IHVua25vd25bXSkge1xuICAgICAgICB0aGlzLmV2ZW50cy5nZXQodHlwZSk/LmZvckVhY2goZm4gPT4ge1xuICAgICAgICAgICAgZm4oLi4uYXJncyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuaW1wb3J0IHR5cGUgeyBJbnN0YW5jZSB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlJztcbmltcG9ydCB0eXBlIHsgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yLCBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yJztcbmltcG9ydCB0eXBlIHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHR5cGUgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5pbXBvcnQgeyBsYXp5LCByZWNyZWF0ZVdoZW4gfSBmcm9tICdAdmdlcmJvdC9sYXppbHknO1xuaW1wb3J0IHsgd2hlbiB9IGZyb20gJ0B2Z2VyYm90L2xhemlseSc7XG5cbmV4cG9ydCBjbGFzcyBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyIHtcbiAgICBwcml2YXRlIGluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXM6IFNldDxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+PiA9IG5ldyBTZXQoKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGluc3RBd2FyZVByb2Nlc3Nvckluc3RhbmNlczogQXJyYXk8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4gPSBsYXp5KCgpID0+IHtcbiAgICAgICAgY29uc3QgZ2xvYmFsSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcyA9IEdsb2JhbE1ldGFkYXRhLmdldFJlYWRlcigpLmdldEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoKTtcbiAgICAgICAgY29uc3QgaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcyA9IGdsb2JhbEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuY29uY2F0KEFycmF5LmZyb20odGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKSk7XG4gICAgICAgIHJldHVybiBpbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLm1hcChpdCA9PiB0aGlzLmNvbnRhaW5lci5nZXRJbnN0YW5jZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yLCB2b2lkPihpdCkpO1xuICAgIH0pO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjb250YWluZXI6IEFwcGxpY2F0aW9uQ29udGV4dCkge1xuICAgICAgICByZWNyZWF0ZVdoZW4oXG4gICAgICAgICAgICB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvckluc3RhbmNlcyxcbiAgICAgICAgICAgIHdoZW4odCA9PlxuICAgICAgICAgICAgICAgIHQub3IoXG4gICAgICAgICAgICAgICAgICAgIHQuY2hhbmdlZCgoKSA9PiB0aGlzLmluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuc2l6ZSksXG4gICAgICAgICAgICAgICAgICAgIHQuY2hhbmdlZCgoKSA9PiBHbG9iYWxNZXRhZGF0YS5nZXRSZWFkZXIoKS5nZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKCkubGVuZ3RoKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICB9XG4gICAgYXBwZW5kSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3M6IE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4pIHtcbiAgICAgICAgdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLmFkZChpbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyk7XG4gICAgfVxuICAgIGFwcGVuZEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoXG4gICAgICAgIGluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXM6IFNldDxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+PiB8IEFycmF5PE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4+XG4gICAgKSB7XG4gICAgICAgIGluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuZm9yRWFjaChpdCA9PiB7XG4gICAgICAgICAgICB0aGlzLmluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuYWRkKGl0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGJlZm9yZUluc3RhbnRpYXRpb248VD4oY29tcG9uZW50Q2xhc3M6IE5ld2FibGU8VD4sIGFyZ3M6IHVua25vd25bXSkge1xuICAgICAgICBjb25zdCBpbnN0QXdhcmVQcm9jZXNzb3JzID0gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JJbnN0YW5jZXM7XG4gICAgICAgIGxldCBpbnN0YW5jZTogdW5kZWZpbmVkIHwgSW5zdGFuY2U8VD47XG4gICAgICAgIGluc3RBd2FyZVByb2Nlc3NvcnMuc29tZShwcm9jZXNzb3IgPT4ge1xuICAgICAgICAgICAgaWYgKCFwcm9jZXNzb3IuYmVmb3JlSW5zdGFudGlhdGlvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluc3RhbmNlID0gcHJvY2Vzc29yLmJlZm9yZUluc3RhbnRpYXRpb248VD4oY29tcG9uZW50Q2xhc3MsIGFyZ3MpIGFzIEluc3RhbmNlPFQ+O1xuICAgICAgICAgICAgcmV0dXJuICEhaW5zdGFuY2U7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfVxuICAgIGFmdGVySW5zdGFudGlhdGlvbjxUPihpbnN0YW5jZTogSW5zdGFuY2U8VD4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29ySW5zdGFuY2VzLnJlZHVjZSgoaW5zdGFuY2UsIHByb2Nlc3NvcikgPT4ge1xuICAgICAgICAgICAgaWYgKHByb2Nlc3Nvci5hZnRlckluc3RhbnRpYXRpb24pIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBwcm9jZXNzb3IuYWZ0ZXJJbnN0YW50aWF0aW9uKGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgYXMgSW5zdGFuY2U8VD47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9LCBpbnN0YW5jZSk7XG4gICAgfVxuICAgIGlzSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoY2xzOiBOZXdhYmxlPHVua25vd24+KSB7XG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSB0aGlzLmdldEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoKTtcbiAgICAgICAgcmV0dXJuIGNsYXNzZXMuaW5kZXhPZihjbHMgYXMgTmV3YWJsZTxJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3I+KSA+IC0xO1xuICAgIH1cbiAgICBnZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKCkge1xuICAgICAgICBjb25zdCBnbG9iYWxJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzID0gR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWFkZXIoKS5nZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKCk7XG4gICAgICAgIHJldHVybiBnbG9iYWxJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLmNvbmNhdChBcnJheS5mcm9tKHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcykpO1xuICAgIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuXG50eXBlIEludm9rZUZ1bmN0aW9uQXJncyA9IHtcbiAgICBhcmdzPzogdW5rbm93bltdO1xufTtcbnR5cGUgSW52b2tlRnVuY3Rpb25JbmplY3Rpb25zID0ge1xuICAgIGluamVjdGlvbnM6IElkZW50aWZpZXJbXTtcbn07XG5cbnR5cGUgSW52b2tlRnVuY3Rpb25CYXNpY09wdGlvbnM8VD4gPSB7XG4gICAgY29udGV4dD86IFQ7XG59O1xuXG5leHBvcnQgdHlwZSBJbnZva2VGdW5jdGlvbk9wdGlvbnM8VD4gPVxuICAgIHwgKEludm9rZUZ1bmN0aW9uQmFzaWNPcHRpb25zPFQ+ICYgSW52b2tlRnVuY3Rpb25BcmdzKVxuICAgIHwgKEludm9rZUZ1bmN0aW9uQmFzaWNPcHRpb25zPFQ+ICYgUGFydGlhbDxJbnZva2VGdW5jdGlvbkluamVjdGlvbnM+KTtcblxuZXhwb3J0IGZ1bmN0aW9uIGhhc0FyZ3M8VD4ob3B0aW9uczogSW52b2tlRnVuY3Rpb25PcHRpb25zPFQ+KTogb3B0aW9ucyBpcyBJbnZva2VGdW5jdGlvbkJhc2ljT3B0aW9uczxUPiAmIEludm9rZUZ1bmN0aW9uQXJncyB7XG4gICAgcmV0dXJuICdhcmdzJyBpbiBvcHRpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzSW5qZWN0aW9uczxUPihcbiAgICBvcHRpb25zOiBJbnZva2VGdW5jdGlvbk9wdGlvbnM8VD5cbik6IG9wdGlvbnMgaXMgSW52b2tlRnVuY3Rpb25CYXNpY09wdGlvbnM8VD4gJiBJbnZva2VGdW5jdGlvbkluamVjdGlvbnMge1xuICAgIHJldHVybiAnaW5qZWN0aW9ucycgaW4gb3B0aW9ucztcbn1cbiIsImltcG9ydCB7IEFPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL2FvcC9BT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3InO1xuaW1wb3J0IHsgRmFjdG9yeVJlY29yZGVyIH0gZnJvbSAnLi4vY29tbW9uL0ZhY3RvcnlSZWNvcmRlcic7XG5pbXBvcnQgeyBpc05vZGVKcyB9IGZyb20gJy4uL2NvbW1vbi9pc05vZGVKcyc7XG5pbXBvcnQgeyBBcmd2RXZhbHVhdG9yIH0gZnJvbSAnLi4vZXZhbHVhdG9yL0FyZ3ZFdmFsdWF0b3InO1xuaW1wb3J0IHsgRW52aXJvbm1lbnRFdmFsdWF0b3IgfSBmcm9tICcuLi9ldmFsdWF0b3IvRW52aXJvbm1lbnRFdmFsdWF0b3InO1xuaW1wb3J0IHsgSlNPTkRhdGFFdmFsdWF0b3IgfSBmcm9tICcuLi9ldmFsdWF0b3IvSlNPTkRhdGFFdmFsdWF0b3InO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSwgdHlwZSBDbGFzc01ldGFkYXRhUmVhZGVyIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBGdW5jdGlvbk1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvRnVuY3Rpb25NZXRhZGF0YSc7XG5pbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0dsb2JhbE1ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgR2xvYmFsU2hhcmVkSW5zdGFuY2VSZXNvbHV0aW9uIH0gZnJvbSAnLi4vcmVzb2x1dGlvbi9HbG9iYWxTaGFyZWRJbnN0YW5jZVJlc29sdXRpb24nO1xuaW1wb3J0IHsgU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uIH0gZnJvbSAnLi4vcmVzb2x1dGlvbi9TaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24nO1xuaW1wb3J0IHsgVHJhbnNpZW50SW5zdGFuY2VSZXNvbHV0aW9uIH0gZnJvbSAnLi4vcmVzb2x1dGlvbi9UcmFuc2llbnRJbnN0YW5jZVJlc29sdXRpb24nO1xuaW1wb3J0IHR5cGUgeyBBbnlGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzL0FueUZ1bmN0aW9uJztcbmltcG9ydCB0eXBlIHsgQXBwbGljYXRpb25Db250ZXh0T3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzL0FwcGxpY2F0aW9uQ29udGV4dE9wdGlvbnMnO1xuaW1wb3J0IHsgdHlwZSBFdmFsdWF0aW9uT3B0aW9ucywgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuaW1wb3J0IHR5cGUgeyBFdmFsdWF0b3IgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0b3InO1xuaW1wb3J0IHR5cGUgeyBGYWN0b3J5SWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0ZhY3RvcnlJZGVudGlmaWVyJztcbmltcG9ydCB0eXBlIHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHR5cGUgeyBJbnN0YW5jZSB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlJztcbmltcG9ydCB0eXBlIHsgSW5zdGFuY2VSZXNvbHV0aW9uIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB0eXBlIHsgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL3R5cGVzL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcic7XG5pbXBvcnQgdHlwZSB7IEpTT05EYXRhIH0gZnJvbSAnLi4vdHlwZXMvSlNPTkRhdGEnO1xuaW1wb3J0IHR5cGUgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgdHlwZSB7IFNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi4vdHlwZXMvU2VydmljZUZhY3RvcnknO1xuaW1wb3J0IHsgQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyIH0gZnJvbSAnLi9Db21wb25lbnRJbnN0YW5jZUJ1aWxkZXInO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCB0eXBlIEV2ZW50TGlzdGVuZXIgfSBmcm9tICcuL0V2ZW50RW1pdHRlcic7XG5pbXBvcnQgeyBJbnN0YW5jZVNjb3BlIH0gZnJvbSAnLi9JbnN0YW5jZVNjb3BlJztcbmltcG9ydCB7IEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXIgfSBmcm9tICcuL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXInO1xuaW1wb3J0IHsgaGFzQXJncywgaGFzSW5qZWN0aW9ucywgdHlwZSBJbnZva2VGdW5jdGlvbk9wdGlvbnMgfSBmcm9tICcuL0ludm9rZUZ1bmN0aW9uT3B0aW9ucyc7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBMaWZlY3ljbGVNYW5hZ2VyIH0gZnJvbSAnLi9MaWZlY3ljbGVNYW5hZ2VyJztcblxuY29uc3QgUFJFX0RFU1RST1lfRVZFTlRfS0VZID0gJ2NvbnRhaW5lcjpldmVudDpwcmUtZGVzdHJveSc7XG5jb25zdCBQUkVfREVTVFJPWV9USEFUX0VWRU5UX0tFWSA9ICdjb250YWluZXI6ZXZlbnQ6cHJlLWRlc3Ryb3ktdGhhdCc7XG5jb25zdCBJTlNUQU5DRV9QUkVfREVTVFJPWV9NRVRIT0QgPSBTeW1ib2woJ3NvbGlkaXVtOmluc3RhbmNlLXByZS1kZXN0cm95Jyk7XG5cbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbkNvbnRleHQge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcmVzb2x1dGlvbnMgPSBuZXcgTWFwPEluc3RhbmNlU2NvcGUgfCBzdHJpbmcsIEluc3RhbmNlUmVzb2x1dGlvbj4oKTtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgZmFjdG9yaWVzID0gbmV3IEZhY3RvcnlSZWNvcmRlcigpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZXZhbHVhdG9yQ2xhc3NlcyA9IG5ldyBNYXA8c3RyaW5nLCBOZXdhYmxlPEV2YWx1YXRvcj4+KCk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBldmVudEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBkZWZhdWx0U2NvcGU6IEluc3RhbmNlU2NvcGU7XG4gICAgcHJpdmF0ZSByZWFkb25seSBsYXp5TW9kZTogYm9vbGVhbjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXI6IEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXI7XG4gICAgcHJpdmF0ZSBpc0Rlc3Ryb3llZCA9IGZhbHNlO1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihvcHRpb25zOiBBcHBsaWNhdGlvbkNvbnRleHRPcHRpb25zID0ge30pIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0U2NvcGUgPSBvcHRpb25zLmRlZmF1bHRTY29wZSB8fCBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTjtcbiAgICAgICAgdGhpcy5sYXp5TW9kZSA9IG9wdGlvbnMubGF6eU1vZGUgPz8gdHJ1ZTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlckluc3RhbmNlU2NvcGVSZXNvbHV0aW9uKEluc3RhbmNlU2NvcGUuU0lOR0xFVE9OLCBTaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24pO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySW5zdGFuY2VTY29wZVJlc29sdXRpb24oSW5zdGFuY2VTY29wZS5HTE9CQUxfU0hBUkVEX1NJTkdMRVRPTiwgR2xvYmFsU2hhcmVkSW5zdGFuY2VSZXNvbHV0aW9uKTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlckluc3RhbmNlU2NvcGVSZXNvbHV0aW9uKEluc3RhbmNlU2NvcGUuVFJBTlNJRU5ULCBUcmFuc2llbnRJbnN0YW5jZVJlc29sdXRpb24pO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZhbHVhdG9yKEV4cHJlc3Npb25UeXBlLkpTT05fUEFUSCwgSlNPTkRhdGFFdmFsdWF0b3IpO1xuICAgICAgICBpZiAoaXNOb2RlSnMpIHtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFdmFsdWF0b3IoRXhwcmVzc2lvblR5cGUuRU5WLCBFbnZpcm9ubWVudEV2YWx1YXRvcik7XG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyRXZhbHVhdG9yKEV4cHJlc3Npb25UeXBlLkFSR1YsIEFyZ3ZFdmFsdWF0b3IpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlciA9IG5ldyBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyKHRoaXMpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySW5zdEF3YXJlUHJvY2Vzc29yKEFPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvci5jcmVhdGUodGhpcykpO1xuICAgIH1cbiAgICBnZXRJbnN0YW5jZTxULCBPPihzeW1ib2w6IE5ld2FibGU8VD4sIG93bmVyPzogTyk6IFQ7XG4gICAgZ2V0SW5zdGFuY2U8VCwgTz4oc3ltYm9sOiBJZGVudGlmaWVyPFQ+LCBvd25lcj86IE8pOiBUIHwgVFtdO1xuICAgIGdldEluc3RhbmNlPFQsIE8+KHN5bWJvbDogSWRlbnRpZmllcjxUPiwgb3duZXI/OiBPKTogVCB8IFRbXSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3ltYm9sID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygc3ltYm9sID09PSAnc3ltYm9sJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2VCeVN5bWJvbChzeW1ib2wsIG93bmVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW5jZUJ5Q2xhc3Moc3ltYm9sLCBvd25lcik7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0SW5zdGFuY2VCeVN5bWJvbDxULCBPPihzeW1ib2w6IHN0cmluZyB8IHN5bWJvbCwgb3duZXI/OiBPKTogVCB8IFRbXSB7XG4gICAgICAgIGNvbnN0IGZhY3RvcnlEZWYgPSB0aGlzLmdldEZhY3Rvcnkoc3ltYm9sKTtcbiAgICAgICAgaWYgKGZhY3RvcnlEZWYpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb2R1Y2VyID0gZmFjdG9yeURlZi5wcm9kdWNlKHRoaXMsIG93bmVyKTtcblxuICAgICAgICAgICAgY29uc3QgcmVzb2x1dGlvbiA9IHRoaXMuZ2V0U2Nyb3BlUmVzb2x1dGlvbkluc3RhbmNlKGZhY3RvcnlEZWYuc2NvcGUpITtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAhcmVzb2x1dGlvbi5zaG91bGRHZW5lcmF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6IHN5bWJvbCxcbiAgICAgICAgICAgICAgICAgICAgb3duZXJcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdXRpb24uZ2V0SW5zdGFuY2Uoe1xuICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiBzeW1ib2wsXG4gICAgICAgICAgICAgICAgICAgIG93bmVyXG4gICAgICAgICAgICAgICAgfSkgYXMgVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlcyA9IHByb2R1Y2VyKCkgYXMgVFtdO1xuXG4gICAgICAgICAgICBjb25zdCByZXN1bHRzID0gaW5zdGFuY2VzLm1hcChpdCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRhY2hQcmVEZXN0cm95SG9vayhpdCk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29uc3RyID0gaXQ/LmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc3RyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudENsYXNzID0gY29uc3RyIGFzIE5ld2FibGU8VD47XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc29sdmVyID0gbmV3IExpZmVjeWNsZU1hbmFnZXI8VD4oY29tcG9uZW50Q2xhc3MsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0luc3RBd2FyZVByb2Nlc3NvciA9IHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5pc0luc3RBd2FyZVByb2Nlc3NvckNsYXNzKGNvbXBvbmVudENsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZXIuaW52b2tlUHJlSW5qZWN0TWV0aG9kKGl0IGFzIEluc3RhbmNlPFQ+KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0luc3RBd2FyZVByb2Nlc3Nvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXQgPSB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuYWZ0ZXJJbnN0YW50aWF0aW9uKGl0IGFzIEluc3RhbmNlPFQ+KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlci5pbnZva2VQb3N0SW5qZWN0TWV0aG9kKGl0IGFzIEluc3RhbmNlPFQ+KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzb2x1dGlvbi5zYXZlSW5zdGFuY2Uoe1xuICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiBzeW1ib2wsXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlOiBpdFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBpdDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHMubGVuZ3RoID09PSAxID8gcmVzdWx0c1swXSA6IHJlc3VsdHM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjbGFzc01ldGFkYXRhID0gR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWFkZXIoKS5nZXRDbGFzc01ldGFkYXRhPFQ+KHN5bWJvbCk7XG4gICAgICAgICAgICBpZiAoIWNsYXNzTWV0YWRhdGEpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENsYXNzIGFsaWFzIG5vdCBmb3VuZDogJHtzeW1ib2wudG9TdHJpbmcoKX1gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2xhenogPSBjbGFzc01ldGFkYXRhLnJlYWRlcigpLmdldENsYXNzKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2VCeUNsYXNzKGNsYXp6LCBvd25lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRJbnN0YW5jZUJ5Q2xhc3M8VCwgTz4oY29tcG9uZW50Q2xhc3M6IE5ld2FibGU8VD4sIG93bmVyPzogTyk6IFQgfCBUW10ge1xuICAgICAgICBpZiAoY29tcG9uZW50Q2xhc3MgPT09IEFwcGxpY2F0aW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMgYXMgdW5rbm93biBhcyBUO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlYWRlciA9IENsYXNzTWV0YWRhdGEuZ2V0SW5zdGFuY2UoY29tcG9uZW50Q2xhc3MpLnJlYWRlcigpO1xuICAgICAgICBjb25zdCBzY29wZSA9IHJlYWRlci5nZXRTY29wZSgpO1xuICAgICAgICBjb25zdCByZXNvbHV0aW9uID0gKHRoaXMucmVzb2x1dGlvbnMuZ2V0KHNjb3BlID8/IHRoaXMuZGVmYXVsdFNjb3BlKSB8fFxuICAgICAgICAgICAgdGhpcy5yZXNvbHV0aW9ucy5nZXQodGhpcy5kZWZhdWx0U2NvcGUpKSBhcyBJbnN0YW5jZVJlc29sdXRpb247XG4gICAgICAgIGNvbnN0IGdldEluc3RhbmNlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGlkZW50aWZpZXI6IGNvbXBvbmVudENsYXNzLFxuICAgICAgICAgICAgb3duZXIsXG4gICAgICAgICAgICBvd25lclByb3BlcnR5S2V5OiB1bmRlZmluZWRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHJlc29sdXRpb24uc2hvdWxkR2VuZXJhdGUoZ2V0SW5zdGFuY2VPcHRpb25zKSkge1xuICAgICAgICAgICAgY29uc3QgYnVpbGRlciA9IHRoaXMuY3JlYXRlQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyKGNvbXBvbmVudENsYXNzKTtcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gYnVpbGRlci5idWlsZCgpO1xuICAgICAgICAgICAgY29uc3Qgc2F2ZUluc3RhbmNlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAuLi5nZXRJbnN0YW5jZU9wdGlvbnMsXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXNvbHV0aW9uLnNhdmVJbnN0YW5jZShzYXZlSW5zdGFuY2VPcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuYXR0YWNoUHJlRGVzdHJveUhvb2soaW5zdGFuY2UpO1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdXRpb24uZ2V0SW5zdGFuY2UoZ2V0SW5zdGFuY2VPcHRpb25zKSBhcyBUO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgYXR0YWNoUHJlRGVzdHJveUhvb2s8VD4oaW5zdGFuY2VzOiBUIHwgVFtdKSB7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlc0FycmF5ID0gQXJyYXkuaXNBcnJheShpbnN0YW5jZXMpID8gaW5zdGFuY2VzIDogW2luc3RhbmNlc107XG4gICAgICAgIGluc3RhbmNlc0FycmF5LmZvckVhY2goaXQgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBpdCBhcyBJbnN0YW5jZTxUPjtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5zdGFuY2UgIT09ICdvYmplY3QnIHx8IGluc3RhbmNlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFJlZmxlY3QuaGFzKGluc3RhbmNlLCBJTlNUQU5DRV9QUkVfREVTVFJPWV9NRVRIT0QpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY2xhenogPSBpbnN0YW5jZS5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgIGlmICghY2xhenopIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGluc3RhbmNlLmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcblxuICAgICAgICAgICAgbWV0YWRhdGEuYWRkTGlmZWN5Y2xlTWV0aG9kKElOU1RBTkNFX1BSRV9ERVNUUk9ZX01FVEhPRCwgTGlmZWN5Y2xlLlBSRV9ERVNUUk9ZKTtcbiAgICAgICAgICAgIFJlZmxlY3Quc2V0KGluc3RhbmNlLCBJTlNUQU5DRV9QUkVfREVTVFJPWV9NRVRIT0QsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KFBSRV9ERVNUUk9ZX0VWRU5UX0tFWSwgaW5zdGFuY2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZUNvbXBvbmVudEluc3RhbmNlQnVpbGRlcjxUPihjb21wb25lbnRDbGFzczogTmV3YWJsZTxUPikge1xuICAgICAgICBjb25zdCBidWlsZGVyID0gbmV3IENvbXBvbmVudEluc3RhbmNlQnVpbGRlcihjb21wb25lbnRDbGFzcywgdGhpcywgdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyKTtcbiAgICAgICAgYnVpbGRlci5hcHBlbmRMYXp5TW9kZSh0aGlzLmxhenlNb2RlKTtcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXI7XG4gICAgfVxuXG4gICAgZ2V0RmFjdG9yeShrZXk6IEZhY3RvcnlJZGVudGlmaWVyKSB7XG4gICAgICAgIGNvbnN0IGZhY3RvcnkgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlYWRlcigpLmdldENvbXBvbmVudEZhY3Rvcnkoa2V5KTtcbiAgICAgICAgaWYgKCFmYWN0b3J5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mYWN0b3JpZXMuZ2V0KGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfVxuICAgIGJpbmRGYWN0b3J5PFQ+KFxuICAgICAgICBzeW1ib2w6IEZhY3RvcnlJZGVudGlmaWVyLFxuICAgICAgICBmYWN0b3J5OiBTZXJ2aWNlRmFjdG9yeTxULCB1bmtub3duPixcbiAgICAgICAgaW5qZWN0aW9ucz86IElkZW50aWZpZXJbXSxcbiAgICAgICAgc2NvcGU6IEluc3RhbmNlU2NvcGUgPSBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTlxuICAgICkge1xuICAgICAgICB0aGlzLmZhY3Rvcmllcy5hcHBlbmQoc3ltYm9sLCBmYWN0b3J5LCBpbmplY3Rpb25zLCBzY29wZSk7XG4gICAgfVxuICAgIGludm9rZTxSLCBDdHg+KGZ1bmM6IEFueUZ1bmN0aW9uPFIsIEN0eD4sIG9wdGlvbnM6IEludm9rZUZ1bmN0aW9uT3B0aW9uczxDdHg+ID0ge30pOiBSIHtcbiAgICAgICAgbGV0IGZuOiBBbnlGdW5jdGlvbjxSPjtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBmbiA9IGZ1bmMuYmluZChvcHRpb25zLmNvbnRleHQgYXMgVGhpc1BhcmFtZXRlclR5cGU8dHlwZW9mIGZ1bmM+KSBhcyBBbnlGdW5jdGlvbjxSPjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZuID0gZnVuYyBhcyBBbnlGdW5jdGlvbjxSPjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGFzQXJncyhvcHRpb25zKSkge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMuYXJncyA/IGZuKC4uLm9wdGlvbnMuYXJncykgOiBmbigpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhcmdzSW5kZW50aWZpZXJzOiBJZGVudGlmaWVyW10gPSBbXTtcbiAgICAgICAgaWYgKGhhc0luamVjdGlvbnMob3B0aW9ucykpIHtcbiAgICAgICAgICAgIGFyZ3NJbmRlbnRpZmllcnMgPSBvcHRpb25zLmluamVjdGlvbnM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGZuLCBGdW5jdGlvbk1ldGFkYXRhKS5yZWFkZXIoKTtcbiAgICAgICAgICAgIGFyZ3NJbmRlbnRpZmllcnMgPSBtZXRhZGF0YS5nZXRQYXJhbWV0ZXJzKCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXJncyA9IGFyZ3NJbmRlbnRpZmllcnMubWFwKChpZGVudGlmaWVyLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEluc3RhbmNlKGlkZW50aWZpZXIpO1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW5zdGFuY2UpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNBcnJheVR5cGUgPSAoaWRlbnRpZmllciBhcyB1bmtub3duKSA9PT0gQXJyYXk7XG4gICAgICAgICAgICAgICAgaWYgKGlzQXJyYXlUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGluc3RhbmNlLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdWx0aXBsZSBtYXRjaGluZyBpbmplY3RhYmxlcyBmb3VuZCBmb3IgcGFyYW1ldGVyIGF0ICR7aW5kZXh9LmApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaW5zdGFuY2VbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYXJncy5sZW5ndGggPiAwID8gZm4oLi4uYXJncykgOiBmbigpO1xuICAgIH1cbiAgICBkZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5pc0Rlc3Ryb3llZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KFBSRV9ERVNUUk9ZX0VWRU5UX0tFWSk7XG4gICAgICAgIHRoaXMucmVzb2x1dGlvbnMuZm9yRWFjaChpdCA9PiB7XG4gICAgICAgICAgICBpdC5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBldmFsdWF0ZTxULCBPLCBBPihleHByZXNzaW9uOiBzdHJpbmcsIG9wdGlvbnM6IEV2YWx1YXRpb25PcHRpb25zPE8sIHN0cmluZywgQT4pOiBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc3QgZXZhbHVhdG9yQ2xhc3MgPSB0aGlzLmV2YWx1YXRvckNsYXNzZXMuZ2V0KG9wdGlvbnMudHlwZSk7XG4gICAgICAgIGlmICghZXZhbHVhdG9yQ2xhc3MpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFVua25vd24gZXZhbHVhdG9yIG5hbWU6ICR7b3B0aW9ucy50eXBlfWApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGV2YWx1YXRvciA9IHRoaXMuZ2V0SW5zdGFuY2UoZXZhbHVhdG9yQ2xhc3MpO1xuICAgICAgICByZXR1cm4gZXZhbHVhdG9yLmV2YWwodGhpcywgZXhwcmVzc2lvbiwgb3B0aW9ucy5leHRlcm5hbEFyZ3MpO1xuICAgIH1cbiAgICByZWNvcmRKU09ORGF0YShuYW1lc3BhY2U6IHN0cmluZywgZGF0YTogSlNPTkRhdGEpIHtcbiAgICAgICAgY29uc3QgZXZhbHVhdG9yID0gdGhpcy5nZXRJbnN0YW5jZShKU09ORGF0YUV2YWx1YXRvcik7XG4gICAgICAgIGV2YWx1YXRvci5yZWNvcmREYXRhKG5hbWVzcGFjZSwgZGF0YSk7XG4gICAgfVxuICAgIGdldEpTT05EYXRhKG5hbWVzcGFjZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGV2YWx1YXRvciA9IHRoaXMuZ2V0SW5zdGFuY2UoSlNPTkRhdGFFdmFsdWF0b3IpO1xuICAgICAgICByZXR1cm4gZXZhbHVhdG9yLmdldEpTT05EYXRhKG5hbWVzcGFjZSk7XG4gICAgfVxuICAgIGJpbmRJbnN0YW5jZTxUPihpZGVudGlmaWVyOiBzdHJpbmcgfCBzeW1ib2wsIGluc3RhbmNlOiBUKSB7XG4gICAgICAgIGNvbnN0IHJlc29sdXRpb24gPSB0aGlzLnJlc29sdXRpb25zLmdldChJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTik7XG4gICAgICAgIHJlc29sdXRpb24/LnNhdmVJbnN0YW5jZSh7XG4gICAgICAgICAgICBpZGVudGlmaWVyLFxuICAgICAgICAgICAgaW5zdGFuY2VcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlZ2lzdGVySW5zdGFuY2VTY29wZVJlc29sdXRpb248VCBleHRlbmRzIE5ld2FibGU8SW5zdGFuY2VSZXNvbHV0aW9uPj4oXG4gICAgICAgIHNjb3BlOiBJbnN0YW5jZVNjb3BlIHwgc3RyaW5nLFxuICAgICAgICByZXNvbHV0aW9uQ29uc3RydWN0b3I6IFQsXG4gICAgICAgIGNvbnN0cnVjdG9yQXJncz86IENvbnN0cnVjdG9yUGFyYW1ldGVyczxUPlxuICAgICkge1xuICAgICAgICB0aGlzLnJlc29sdXRpb25zLnNldChzY29wZSwgbmV3IHJlc29sdXRpb25Db25zdHJ1Y3RvciguLi4oY29uc3RydWN0b3JBcmdzID8/IFtdKSkpO1xuICAgIH1cbiAgICBnZXRTY3JvcGVSZXNvbHV0aW9uSW5zdGFuY2Uoc2NvcGU6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb2x1dGlvbnMuZ2V0KHNjb3BlKSA/PyB0aGlzLnJlc29sdXRpb25zLmdldCh0aGlzLmRlZmF1bHRTY29wZSk7XG4gICAgfVxuICAgIHJlZ2lzdGVyRXZhbHVhdG9yKG5hbWU6IHN0cmluZywgZXZhbHVhdG9yQ2xhc3M6IE5ld2FibGU8RXZhbHVhdG9yPikge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGV2YWx1YXRvckNsYXNzLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgbWV0YWRhdGEuc2V0U2NvcGUoSW5zdGFuY2VTY29wZS5TSU5HTEVUT04pO1xuICAgICAgICB0aGlzLmV2YWx1YXRvckNsYXNzZXMuc2V0KG5hbWUsIGV2YWx1YXRvckNsYXNzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFJlZ2lzdGVycyBhbiBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3IgY2xhc3MgdG8gY3VzdG9taXplXG4gICAgICogICAgICB0aGUgaW5zdGFudGlhdGlvbiBwcm9jZXNzIGF0IHZhcmlvdXMgc3RhZ2VzIHdpdGhpbiB0aGUgSW9DXG4gICAgICogQGRlcHJlY2F0ZWQgUmVwbGFjZWQgd2l0aCB7QGxpbmsgcmVnaXN0ZXJCZWZvcmVJbnN0YW50aWF0aW9uUHJvY2Vzc29yfSBhbmQge0BsaW5rIHJlZ2lzdGVyQWZ0ZXJJbnN0YW50aWF0aW9uUHJvY2Vzc29yfVxuICAgICAqIEBwYXJhbSB7TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPn0gY2xhenpcbiAgICAgKiBAc2VlIEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3NvclxuICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAqL1xuICAgIHJlZ2lzdGVySW5zdEF3YXJlUHJvY2Vzc29yKGNsYXp6OiBOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+KSB7XG4gICAgICAgIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5hcHBlbmRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyhjbGF6eik7XG4gICAgfVxuICAgIHJlZ2lzdGVyQmVmb3JlSW5zdGFudGlhdGlvblByb2Nlc3Nvcihwcm9jZXNzb3I6IDxUPihjb25zdHJ1Y3RvcjogTmV3YWJsZTxUPiwgYXJnczogdW5rbm93bltdKSA9PiBUIHwgdW5kZWZpbmVkIHwgdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5hcHBlbmRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyhcbiAgICAgICAgICAgIGNsYXNzIElubmVyUHJvY2Vzc29yIGltcGxlbWVudHMgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB7XG4gICAgICAgICAgICAgICAgYmVmb3JlSW5zdGFudGlhdGlvbjxUPihjb25zdHJ1Y3RvcjogTmV3YWJsZTxUPiwgYXJnczogdW5rbm93bltdKTogdW5kZWZpbmVkIHwgVCB8IHVuZGVmaW5lZCB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9jZXNzb3IoY29uc3RydWN0b3IsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG4gICAgcmVnaXN0ZXJBZnRlckluc3RhbnRpYXRpb25Qcm9jZXNzb3IocHJvY2Vzc29yOiA8VCBleHRlbmRzIG9iamVjdD4oaW5zdGFuY2U6IFQpID0+IFQpIHtcbiAgICAgICAgdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyLmFwcGVuZEluc3RBd2FyZVByb2Nlc3NvckNsYXNzKFxuICAgICAgICAgICAgY2xhc3MgSW5uZXJQcm9jZXNzb3IgaW1wbGVtZW50cyBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yIHtcbiAgICAgICAgICAgICAgICBhZnRlckluc3RhbnRpYXRpb248VCBleHRlbmRzIG9iamVjdD4oaW5zdGFuY2U6IFQpOiBUIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3NvcihpbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbiAgICBvblByZURlc3Ryb3kobGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRFbWl0dGVyLm9uKFBSRV9ERVNUUk9ZX0VWRU5UX0tFWSwgbGlzdGVuZXIpO1xuICAgIH1cbiAgICBvblByZURlc3Ryb3lUaGF0KGxpc3RlbmVyOiAoaW5zdGFuY2U6IG9iamVjdCkgPT4gdm9pZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudEVtaXR0ZXIub24oUFJFX0RFU1RST1lfVEhBVF9FVkVOVF9LRVksIGxpc3RlbmVyKTtcbiAgICB9XG4gICAgZ2V0Q2xhc3NNZXRhZGF0YTxUPihjdG9yOiBOZXdhYmxlPFQ+KSB7XG4gICAgICAgIHJldHVybiBDbGFzc01ldGFkYXRhLmdldFJlYWRlcihjdG9yKSBhcyBDbGFzc01ldGFkYXRhUmVhZGVyPFQ+O1xuICAgIH1cbiAgICBkZXN0cm95VHJhbnNpZW50SW5zdGFuY2U8VD4oaW5zdGFuY2U6IFQpIHtcbiAgICAgICAgY29uc3QgcmVzb2x1dGlvbiA9IHRoaXMucmVzb2x1dGlvbnMuZ2V0KEluc3RhbmNlU2NvcGUuVFJBTlNJRU5UKTtcbiAgICAgICAgcmVzb2x1dGlvbj8uZGVzdHJveVRoYXQ/LihpbnN0YW5jZSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgaXNOb3REZWZpbmVkIH0gZnJvbSAnLi4vY29tbW9uL2lzTm90RGVmaW5lZCc7XG5pbXBvcnQgeyBJbnN0YW5jZVNjb3BlIH0gZnJvbSAnLi4vZm91bmRhdGlvbic7XG5pbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0dsb2JhbE1ldGFkYXRhJztcbmltcG9ydCB0eXBlIHsgRmFjdG9yeUlkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9GYWN0b3J5SWRlbnRpZmllcic7XG5pbXBvcnQgdHlwZSB7IEluc3RhbmNlIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2UnO1xuaW1wb3J0IHR5cGUgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBGYWN0b3J5KHByb2R1Y2VJZGVudGlmaWVyPzogRmFjdG9yeUlkZW50aWZpZXIsIHNjb3BlOiBJbnN0YW5jZVNjb3BlID0gSW5zdGFuY2VTY29wZS5TSU5HTEVUT04pOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiAodGFyZ2V0OiBvYmplY3QsIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wpID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpO1xuICAgICAgICBjb25zdCBjbGF6eiA9IHRhcmdldC5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPEluc3RhbmNlPHVua25vd24+PjtcblxuICAgICAgICBpZiAoaXNOb3REZWZpbmVkKHByb2R1Y2VJZGVudGlmaWVyKSkge1xuICAgICAgICAgICAgcHJvZHVjZUlkZW50aWZpZXIgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdkZXNpZ246cmV0dXJudHlwZScsIHRhcmdldCwgcHJvcGVydHlLZXkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc05vdERlZmluZWQocHJvZHVjZUlkZW50aWZpZXIpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSByZXR1cm4gdHlwZSBub3QgcmVjb2duaXplZCwgY2Fubm90IHBlcmZvcm0gaW5zdGFuY2UgY3JlYXRpb24hJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaW5qZWN0aW9ucyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ2Rlc2lnbjpwYXJhbXR5cGVzJywgdGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG5cbiAgICAgICAgbWV0YWRhdGEucmVjb3JkRmFjdG9yeShcbiAgICAgICAgICAgIHByb2R1Y2VJZGVudGlmaWVyLFxuICAgICAgICAgICAgKGNvbnRhaW5lciwgb3duZXIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGNvbnRhaW5lci5nZXRJbnN0YW5jZShjbGF6eiwgb3duZXIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZ1bmMgPSBpbnN0YW5jZVtwcm9wZXJ0eUtleV07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmdW5jID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBjb250YWluZXIuZ2V0SW5zdGFuY2UoY2xhenopO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiBmdW5jO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmplY3Rpb25zLFxuICAgICAgICAgICAgc2NvcGVcbiAgICAgICAgKTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHR5cGUgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuLi9mb3VuZGF0aW9uJztcbmltcG9ydCB7IEluamVjdGlvblR5cGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luamVjdGlvblR5cGUnO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSwgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcblxuZXhwb3J0IGZ1bmN0aW9uIEdlbmVyYXRlPFQsIFY+KGdlbmVyYXRvcjogKHRoaXM6IFQsIGFwcEN0eDogQXBwbGljYXRpb25Db250ZXh0KSA9PiBWKTogUHJvcGVydHlEZWNvcmF0b3Ige1xuICAgIHJldHVybiAodGFyZ2V0OiBvYmplY3QsIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wpID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQuY29uc3RydWN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBjb25zdCB2YWx1ZV9zeW1ib2wgPSBTeW1ib2woJycpO1xuICAgICAgICBtZXRhZGF0YS5yZWNvcmRQcm9wZXJ0eVR5cGUocHJvcGVydHlLZXksIEluamVjdGlvblR5cGUub2ZJZGVudGlmaWVyKHZhbHVlX3N5bWJvbCkpO1xuICAgICAgICBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlY29yZEZhY3RvcnkodmFsdWVfc3ltYm9sLCAoY29udGFpbmVyLCBvd25lcikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IGdlbmVyYXRvci5jYWxsKG93bmVyIGFzIFQsIGNvbnRhaW5lcik7XG4gICAgICAgIH0pO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBpc05vdERlZmluZWQgfSBmcm9tICcuLi9jb21tb24vaXNOb3REZWZpbmVkJztcbmltcG9ydCB7IEluamVjdGlvblR5cGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luamVjdGlvblR5cGUnO1xuaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YSc7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB0eXBlIHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHR5cGUgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBJbmplY3Q8VD4oaWRlbnRpZmllcj86IElkZW50aWZpZXI8VD4pIHtcbiAgICByZXR1cm4gPFRhcmdldD4odGFyZ2V0OiBUYXJnZXQsIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wsIHBhcmFtZXRlckluZGV4PzogbnVtYmVyKSA9PiB7XG4gICAgICAgIGxldCBpbmplY3RDbGFzczogTmV3YWJsZTx1bmtub3duPiB8IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHBhcmFtZXRlckluZGV4ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgLy8gY29uc3RydWN0b3IgcGFyYW1ldGVyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRDb25zdHIgPSB0YXJnZXQgYXMgTmV3YWJsZTxUPjtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaWRlbnRpZmllciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGluamVjdENsYXNzID0gaWRlbnRpZmllcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5qZWN0Q2xhc3MgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdkZXNpZ246cGFyYW10eXBlcycsIHRhcmdldCwgcHJvcGVydHlLZXkpW3BhcmFtZXRlckluZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc05vdERlZmluZWQoaW5qZWN0Q2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUeXBlIG5vdCByZWNvZ25pemVkLCBpbmplY3Rpb24gY2Fubm90IGJlIHBlcmZvcm1lZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY2xhc3NNZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldENvbnN0ciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBjbGFzc01ldGFkYXRhLnNldENvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZShwYXJhbWV0ZXJJbmRleCwgSW5qZWN0aW9uVHlwZS5vZihpbmplY3RDbGFzcywgaWRlbnRpZmllcikpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdvYmplY3QnICYmIHRhcmdldCAhPT0gbnVsbCAmJiBwcm9wZXJ0eUtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBsZXQgaW5qZWN0Q2xhc3M6IE5ld2FibGU8dW5rbm93bj4gfCB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGlkZW50aWZpZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBpbmplY3RDbGFzcyA9IGlkZW50aWZpZXI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGluamVjdENsYXNzID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnZGVzaWduOnR5cGUnLCB0YXJnZXQsIHByb3BlcnR5S2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGFyZ2V0LmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgICAgIGlmIChpc05vdERlZmluZWQoaW5qZWN0Q2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlkZW50aWZpZXIgJiYgdHlwZW9mIGlkZW50aWZpZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmFjdG9yeURlZiA9IEdsb2JhbE1ldGFkYXRhLmdldEluc3RhbmNlKCkucmVhZGVyKCkuZ2V0Q29tcG9uZW50RmFjdG9yeShpZGVudGlmaWVyKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZhY3RvcnlEZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFkYXRhLnJlY29yZFByb3BlcnR5VHlwZShwcm9wZXJ0eUtleSwgSW5qZWN0aW9uVHlwZS5vZklkZW50aWZpZXIoaWRlbnRpZmllcikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHlwZSBub3QgcmVjb2duaXplZCwgaW5qZWN0aW9uIGNhbm5vdCBiZSBwZXJmb3JtZWQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWV0YWRhdGEucmVjb3JkUHJvcGVydHlUeXBlKHByb3BlcnR5S2V5LCBJbmplY3Rpb25UeXBlLm9mKGluamVjdENsYXNzLCBpZGVudGlmaWVyKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgSW5zdGFuY2VTY29wZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24nO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSwgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB0eXBlIHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB0eXBlIHsgSW5zdGFuY2UgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW5qZWN0YWJsZU9wdGlvbnMge1xuICAgIHByb2R1Y2U6IHN0cmluZyB8IHN5bWJvbCB8IEFycmF5PHN0cmluZyB8IHN5bWJvbD47XG4gICAgc2NvcGU/OiBJbnN0YW5jZVNjb3BlO1xufVxuXG4vKipcbiAqIFRoaXMgZGVjb3JhdG9yIGlzIHR5cGljYWxseSB1c2VkIHRvIGlkZW50aWZ5IGNsYXNzZXMgdGhhdCBuZWVkIHRvIGJlIGNvbmZpZ3VyZWQgd2l0aGluIHRoZSBJb0MgY29udGFpbmVyLlxuICogSW4gbW9zdCBjYXNlcywgQEluamVjdGFibGUgY2FuIGJlIG9taXR0ZWQgdW5sZXNzIGV4cGxpY2l0IGNvbmZpZ3VyYXRpb24gaXMgcmVxdWlyZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBJbmplY3RhYmxlKG9wdGlvbnM/OiBJbmplY3RhYmxlT3B0aW9ucyk6IENsYXNzRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gPFRGdW5jdGlvbiBleHRlbmRzIEZ1bmN0aW9uPih0YXJnZXQ6IFRGdW5jdGlvbik6IFRGdW5jdGlvbiB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucz8ucHJvZHVjZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpO1xuICAgICAgICBjb25zdCBwcm9kdWNlcyA9IEFycmF5LmlzQXJyYXkob3B0aW9ucy5wcm9kdWNlKSA/IG9wdGlvbnMucHJvZHVjZSA6IFtvcHRpb25zLnByb2R1Y2VdO1xuICAgICAgICBjb25zdCBjbGFzc01ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGFyZ2V0IGFzIHVua25vd24gYXMgTmV3YWJsZTx1bmtub3duPiwgQ2xhc3NNZXRhZGF0YSk7XG5cbiAgICAgICAgcHJvZHVjZXMuZm9yRWFjaChwcm9kdWNlID0+IHtcbiAgICAgICAgICAgIG1ldGFkYXRhLnJlY29yZEZhY3RvcnkoXG4gICAgICAgICAgICAgICAgcHJvZHVjZSxcbiAgICAgICAgICAgICAgICAoY29udGFpbmVyLCBvd25lcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBjb250YWluZXIuZ2V0SW5zdGFuY2UodGFyZ2V0IGFzIHVua25vd24gYXMgTmV3YWJsZTxJbnN0YW5jZTx1bmtub3duPj4sIG93bmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFtdLFxuICAgICAgICAgICAgICAgIGNsYXNzTWV0YWRhdGEucmVhZGVyKCkuZ2V0U2NvcGUoKSA/PyBvcHRpb25zLnNjb3BlID8/IEluc3RhbmNlU2NvcGUuU0lOR0xFVE9OXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9HbG9iYWxNZXRhZGF0YSc7XG5pbXBvcnQgdHlwZSB7IFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3IgfSBmcm9tICcuLi90eXBlcy9JbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3InO1xuaW1wb3J0IHR5cGUgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBJbnN0QXdhcmVQcm9jZXNzb3IoKSB7XG4gICAgcmV0dXJuIDxDbHMgZXh0ZW5kcyBOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+Pih0YXJnZXQ6IENscykgPT4ge1xuICAgICAgICBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlY29yZFByb2Nlc3NvckNsYXNzKHRhcmdldCk7XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IEV4cHJlc3Npb25UeXBlIH0gZnJvbSAnLi4vdHlwZXMvRXZhbHVhdGVPcHRpb25zJztcbmltcG9ydCB7IFZhbHVlIH0gZnJvbSAnLi9WYWx1ZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBKU09ORGF0YShuYW1lc3BhY2U6IHN0cmluZywganNvbnBhdGg6IHN0cmluZykge1xuICAgIHJldHVybiBWYWx1ZShgJHtuYW1lc3BhY2V9OiR7anNvbnBhdGh9YCwgRXhwcmVzc2lvblR5cGUuSlNPTl9QQVRIKTtcbn1cbiIsImltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgdHlwZSB7IExpZmVjeWNsZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vTGlmZWN5Y2xlJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuXG4vKipcbiAqIFVybiBjYWxscyB0aGUgbWV0aG9kcyBhbm5vdGF0ZWQgd2l0aCBAUG9zdEluamVjdCBvbmx5IG9uY2UsIGp1c3QgYWZ0ZXIgdGhlIGluamVjdGlvbiBvZiBwcm9wZXJ0aWVzLlxuICogQGFubm90YXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IExpZmVjeWNsZURlY29yYXRvciA9IChsaWZlY3ljbGU6IExpZmVjeWNsZSk6IE1ldGhvZERlY29yYXRvciA9PiB7XG4gICAgcmV0dXJuICh0YXJnZXQ6IG9iamVjdCwgcHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCkgPT4ge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldC5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgIG1ldGFkYXRhLmFkZExpZmVjeWNsZU1ldGhvZChwcm9wZXJ0eUtleSwgbGlmZWN5Y2xlKTtcbiAgICB9O1xufTtcbiIsImltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcblxuZXhwb3J0IGZ1bmN0aW9uIE1hcmsoa2V5OiBzdHJpbmcgfCBzeW1ib2wsIHZhbHVlOiB1bmtub3duID0gdHJ1ZSk6IEZ1bmN0aW9uIHtcbiAgICByZXR1cm4gKFxuICAgICAgICAuLi5hcmdzOlxuICAgICAgICAgICAgfCBQYXJhbWV0ZXJzPENsYXNzRGVjb3JhdG9yPlxuICAgICAgICAgICAgfCBQYXJhbWV0ZXJzPE1ldGhvZERlY29yYXRvcj5cbiAgICAgICAgICAgIHwgUGFyYW1ldGVyczxQcm9wZXJ0eURlY29yYXRvcj5cbiAgICAgICAgICAgIHwgUGFyYW1ldGVyczxQYXJhbWV0ZXJEZWNvcmF0b3I+XG4gICAgKSA9PiB7XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgLy8gY2xhc3MgZGVjb3JhdG9yXG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGFyZ3NbMF0sIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICAgICAgbWV0YWRhdGEubWFya2VyKCkuY3RvcihrZXksIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgLy8gcHJvcGVydHkgZGVjb3JhdG9yXG4gICAgICAgICAgICBjb25zdCBbcHJvdG90eXBlLCBwcm9wZXJ0eUtleV0gPSBhcmdzO1xuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShwcm90b3R5cGUuY29uc3RydWN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICAgICAgbWV0YWRhdGEubWFya2VyKCkubWVtYmVyKHByb3BlcnR5S2V5KS5tYXJrKGtleSwgdmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZ3MubGVuZ3RoID09PSAzICYmIHR5cGVvZiBhcmdzWzJdID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgLy8gcGFyYW1ldGVyIGRlY29yYXRvclxuICAgICAgICAgICAgY29uc3QgW3Byb3RvdHlwZSwgcHJvcGVydHlLZXksIGluZGV4XSA9IGFyZ3MgYXMgW29iamVjdCwgc3RyaW5nIHwgc3ltYm9sLCBudW1iZXJdO1xuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShwcm90b3R5cGUuY29uc3RydWN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICAgICAgbWV0YWRhdGEubWFya2VyKCkucGFyYW1ldGVyKHByb3BlcnR5S2V5LCBpbmRleCkubWFyayhrZXksIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIG1ldGhvZCBkZWNvcmF0b3JcbiAgICAgICAgICAgIGNvbnN0IFtwcm90b3R5cGUsIHByb3BlcnR5S2V5XSA9IGFyZ3MgYXMgUGFyYW1ldGVyczxNZXRob2REZWNvcmF0b3I+O1xuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShwcm90b3R5cGUuY29uc3RydWN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICAgICAgbWV0YWRhdGEubWFya2VyKCkubWVtYmVyKHByb3BlcnR5S2V5KS5tYXJrKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfTtcbn1cbiIsImltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBMaWZlY3ljbGVEZWNvcmF0b3IgfSBmcm9tICcuL0xpZmVjeWNsZURlY29yYXRvcic7XG5cbi8qKlxuICogVXJuIGNhbGxzIHRoZSBtZXRob2RzIGFubm90YXRlZCB3aXRoIEBQb3N0SW5qZWN0IG9ubHkgb25jZSwganVzdCBhZnRlciB0aGUgaW5qZWN0aW9uIG9mIHByb3BlcnRpZXMuXG4gKiBAYW5ub3RhdGlvblxuICovXG5leHBvcnQgY29uc3QgUG9zdEluamVjdCA9ICgpOiBNZXRob2REZWNvcmF0b3IgPT4gTGlmZWN5Y2xlRGVjb3JhdG9yKExpZmVjeWNsZS5QT1NUX0lOSkVDVCk7XG4iLCJpbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBMaWZlY3ljbGVEZWNvcmF0b3IgfSBmcm9tICcuL0xpZmVjeWNsZURlY29yYXRvcic7XG5cbmV4cG9ydCBjb25zdCBQcmVEZXN0cm95ID0gKCkgPT4gTGlmZWN5Y2xlRGVjb3JhdG9yKExpZmVjeWNsZS5QUkVfREVTVFJPWSk7XG4iLCJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9MaWZlY3ljbGUnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlRGVjb3JhdG9yIH0gZnJvbSAnLi9MaWZlY3ljbGVEZWNvcmF0b3InO1xuXG4vKipcbiAqIFVybiBjYWxscyB0aGUgbWV0aG9kcyBhbm5vdGF0ZWQgd2l0aCBAUG9zdEluamVjdCBvbmx5IG9uY2UsIGp1c3QgYWZ0ZXIgdGhlIGluamVjdGlvbiBvZiBwcm9wZXJ0aWVzLlxuICogQGFubm90YXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IFByZUluamVjdCA9ICgpOiBNZXRob2REZWNvcmF0b3IgPT4gTGlmZWN5Y2xlRGVjb3JhdG9yKExpZmVjeWNsZS5QUkVfSU5KRUNUKTtcbiIsImltcG9ydCB0eXBlIHsgSW5zdGFuY2VTY29wZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vSW5zdGFuY2VTY29wZSc7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB0eXBlIHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gU2NvcGUoc2NvcGU6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmcpOiBDbGFzc0RlY29yYXRvciB7XG4gICAgcmV0dXJuIDxURnVuY3Rpb24gZXh0ZW5kcyBGdW5jdGlvbj4odGFyZ2V0OiBURnVuY3Rpb24pID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQgYXMgdW5rbm93biBhcyBOZXdhYmxlPHVua25vd24+LCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgbWV0YWRhdGEuc2V0U2NvcGUoc2NvcGUpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBGYWN0b3J5IH0gZnJvbSAnLi4vZGVjb3JhdG9ycyc7XG5pbXBvcnQgdHlwZSB7IEZhY3RvcnlJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvRmFjdG9yeUlkZW50aWZpZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRmFjdG9yeVdyYXBwZXI8VD4ocHJvZHVjZUlkZW50aWZpZXI6IEZhY3RvcnlJZGVudGlmaWVyLCBwcm9kdWNlOiB1bmtub3duLCBvd25lcjogVCk6IFQge1xuICAgIGNsYXNzIFRoZUZhY3Rvcnkge1xuICAgICAgICBARmFjdG9yeShwcm9kdWNlSWRlbnRpZmllcilcbiAgICAgICAgcHJvZHVjZSgpIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9kdWNlO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRpYyBwcmV2ZW50VHJlZVNoYWtpbmcoKSB7XG4gICAgICAgICAgICByZXR1cm4gb3duZXI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFRoZUZhY3RvcnkucHJldmVudFRyZWVTaGFraW5nKCk7XG59XG4iXSwibmFtZXMiOlsiQWR2aWNlIiwiSW5zdGFuY2VTY29wZSIsIkV4cHJlc3Npb25UeXBlIiwiTGlmZWN5Y2xlIiwidmFsdWUiLCJsYXp5IiwicmVjcmVhdGVXaGVuIiwid2hlbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQVlBLDRCQU9YO0lBUEQsQ0FBQSxVQUFZLE1BQU0sRUFBQTtJQUNkLElBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxRQUFNLENBQUE7SUFDTixJQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsT0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsT0FBSyxDQUFBO0lBQ0wsSUFBQSxNQUFBLENBQUEsTUFBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLFFBQU0sQ0FBQTtJQUNOLElBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxhQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxhQUFXLENBQUE7SUFDWCxJQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsUUFBTSxDQUFBO0lBQ04sSUFBQSxNQUFBLENBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLFNBQU8sQ0FBQTtJQUNYLENBQUMsRUFQV0EsY0FBTSxLQUFOQSxjQUFNLEdBT2pCLEVBQUEsQ0FBQSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUNQSyxTQUFVLHFCQUFxQixDQUFPLE9BQXNCLEVB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
