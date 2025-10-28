(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('reflect-metadata'), require('@vgerbot/lazy')) :
    typeof define === 'function' && define.amd ? define(['exports', 'reflect-metadata', '@vgerbot/lazy'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.IoC = {}, null, global.lazy));
})(this, (function (exports, reflectMetadata, lazy) { 'use strict';

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

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    function createDefaultValueMap(factory) {
        var map = new Map();
        var originGet = map.get.bind(map);
        map.get = function (key) {
            if (map.has(key)) {
                return originGet(key);
            }
            else {
                var defaultValue = factory(key);
                map.set(key, defaultValue);
                return map.get(key);
            }
        };
        return map;
    }

    var metadataInstanceMap = createDefaultValueMap(function () { return new Set(); });
    var MetadataInstanceManager = /** @class */ (function () {
        function MetadataInstanceManager() {
        }
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
    }());

    var CLASS_METADATA_KEY = 'ioc:class-metadata';
    var MarkInfoContainer = /** @class */ (function () {
        function MarkInfoContainer() {
            this.map = createDefaultValueMap(function () { return ({}); });
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
    }());
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
    }());
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
            return this.getInstance(ctor).reader();
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
                getClass: function () { return _this.clazz; },
                getScope: function () {
                    return _this.scope;
                },
                getConstructorParameterTypes: function () {
                    return _this.constructorParameterTypes.slice(0);
                },
                getMethods: function (lifecycle) {
                    var superMethods = (superReader === null || superReader === void 0 ? void 0 : superReader.getMethods(lifecycle)) || [];
                    var thisMethods = _this.getMethods(lifecycle);
                    return Array.from(new Set(superMethods.concat(thisMethods)));
                },
                getPropertyTypeMap: function () {
                    var superPropertyTypeMap = superReader === null || superReader === void 0 ? void 0 : superReader.getPropertyTypeMap();
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
                    var superMethods = superReader === null || superReader === void 0 ? void 0 : superReader.getAllMarkedMembers();
                    var thisMembers = _this.marks.members.getMembers();
                    var result = superMethods ? new Set(superMethods) : new Set();
                    thisMembers.forEach(function (it) { return result.add(it); });
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
    }());

    exports.InstanceScope = void 0;
    (function (InstanceScope) {
        InstanceScope["SINGLETON"] = "ioc-resolution:container-singleton";
        InstanceScope["TRANSIENT"] = "ioc-resolution:transient";
        InstanceScope["GLOBAL_SHARED_SINGLETON"] = "ioc-resolution:global-shared-singleton";
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
            if (injections === void 0) { injections = []; }
            if (this.scope === exports.InstanceScope.SINGLETON && this.factories.size === 1 && this.factories.has(factory)) {
                throw new Error("".concat(this.identifier.toString(), " is A singleton! But multiple factories are defined!"));
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
                var _b = __read(_a, 2), factory = _b[0], injections = _b[1];
                var fn = factory(container, owner);
                return function () {
                    return container.invoke(fn, {
                        injections: injections
                    });
                };
            });
            return function () {
                return producers.map(function (it) { return it(); });
            };
        };
        return ServiceFactoryDef;
    }());

    var FactoryRecorder = /** @class */ (function () {
        function FactoryRecorder() {
            this.factories = new Map();
        }
        FactoryRecorder.prototype.append = function (identifier, factory, injections, scope) {
            if (injections === void 0) { injections = []; }
            if (scope === void 0) { scope = exports.InstanceScope.SINGLETON; }
            var def = this.factories.get(identifier);
            if (def) {
                def.append(factory, injections);
            }
            else {
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
    }());

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
            return this.getInstance().reader();
        };
        GlobalMetadata.prototype.recordFactory = function (symbol, factory, injections, scope) {
            if (injections === void 0) { injections = []; }
            if (scope === void 0) { scope = exports.InstanceScope.SINGLETON; }
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
    }());

    exports.ExpressionType = void 0;
    (function (ExpressionType) {
        ExpressionType["ENV"] = "inject-environment-variables";
        ExpressionType["JSON_PATH"] = "inject-json-data";
        ExpressionType["ARGV"] = "inject-argv";
    })(exports.ExpressionType || (exports.ExpressionType = {}));

    var isNodeJs = (function () {
        try {
            return process.versions.node !== null;
        }
        catch (e) {
            return false;
        }
    })();

    var InjectionType = /** @class */ (function () {
        function InjectionType(clazz, identifier) {
            if (identifier === void 0) { identifier = clazz; }
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
            if (identifier === void 0) { identifier = clazz; }
            return new InjectionType(clazz, identifier);
        };
        Object.defineProperty(InjectionType.prototype, "isNewable", {
            get: function () {
                return this.identifier === this.clazz;
            },
            enumerable: false,
            configurable: true
        });
        return InjectionType;
    }());

    function Value(expression, type, externalArgs) {
        switch (type) {
            case exports.ExpressionType.ENV:
            case exports.ExpressionType.ARGV:
                if (!isNodeJs) {
                    throw new Error("The \"".concat(type, "\" evaluator only supports nodejs environment!"));
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
        if (argv === void 0) { argv = process.argv; }
        return Value(name, exports.ExpressionType.ARGV, argv);
    }

    function Alias(aliasName) {
        return function (target) {
            var metadata = MetadataInstanceManager.getMetadata(target, ClassMetadata);
            GlobalMetadata.getInstance().recordClassAlias(aliasName, metadata);
        };
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

    exports.Advice = void 0;
    (function (Advice) {
        Advice[Advice["Before"] = 0] = "Before";
        Advice[Advice["After"] = 1] = "After";
        Advice[Advice["Around"] = 2] = "Around";
        Advice[Advice["AfterReturn"] = 3] = "AfterReturn";
        Advice[Advice["Thrown"] = 4] = "Thrown";
        Advice[Advice["Finally"] = 5] = "Finally";
    })(exports.Advice || (exports.Advice = {}));

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
            var _a = this, aroundHooks = _a.aroundHooks, beforeHooks = _a.beforeHooks, afterHooks = _a.afterHooks, afterReturnHooks = _a.afterReturnHooks, finallyHooks = _a.finallyHooks, thrownHooks = _a.thrownHooks;
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
                    }
                    catch (error) {
                        onError(error);
                    }
                    finally {
                        if (!isPromise) {
                            onFinally();
                        }
                    }
                    if (isPromise) {
                        return returnValue.then(function (value) {
                            return onAfter(value);
                        });
                    }
                    else {
                        return onAfter(returnValue);
                    }
                };
                return invoke(function (error) {
                    if (thrownHooks.length > 0) {
                        thrownHooks.forEach(function (hook) { return hook.call(_this, error, args); });
                    }
                    else {
                        throw error;
                    }
                }, function () {
                    finallyHooks.forEach(function (hook) { return hook.call(_this, args); });
                }, function (value) {
                    afterHooks.forEach(function (hook) {
                        hook.call(_this, args);
                    });
                    return afterReturnHooks.reduce(function (retVal, hook) {
                        return hook.call(_this, retVal, args);
                    }, value);
                });
            };
        };
        return AspectUtils;
    }());

    function createAspect(appCtx, target, methodName, methodFunc, aspects) {
        var createAspectCtx = function (advice, args, returnValue, error) {
            if (returnValue === void 0) { returnValue = null; }
            if (error === void 0) { error = null; }
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
        var ClassToInstance = function (aspectInfo) { return appCtx.getInstance(aspectInfo.aspectClass); };
        var targetConstructor = target.constructor;
        var allMatchAspects = aspects.filter(function (it) { return it.pointcut.test(targetConstructor, methodName); });
        var beforeAdviceAspects = allMatchAspects.filter(function (it) { return it.advice === exports.Advice.Before; }).map(ClassToInstance);
        var afterAdviceAspects = allMatchAspects.filter(function (it) { return it.advice === exports.Advice.After; }).map(ClassToInstance);
        var tryCatchAdviceAspects = allMatchAspects.filter(function (it) { return it.advice === exports.Advice.Thrown; }).map(ClassToInstance);
        var tryFinallyAdviceAspects = allMatchAspects.filter(function (it) { return it.advice === exports.Advice.Finally; }).map(ClassToInstance);
        var afterReturnAdviceAspects = allMatchAspects.filter(function (it) { return it.advice === exports.Advice.AfterReturn; }).map(ClassToInstance);
        var aroundAdviceAspects = allMatchAspects.filter(function (it) { return it.advice === exports.Advice.Around; }).map(ClassToInstance);
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
                return afterReturnAdviceAspects.reduce(function (prevReturnValue, aspect) {
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
                        if (jpArgs === void 0) { jpArgs = args; }
                        return originFn(jpArgs);
                    };
                    return aspect.execute(joinPoint);
                });
            });
        }
        return aspectUtils.extract();
    }

    var ComponentMethodAspect = /** @class */ (function () {
        function ComponentMethodAspect() {
        }
        ComponentMethodAspect.create = function (clazz, methodName) {
            return /** @class */ (function (_super) {
                __extends(ComponentMethodAspectImpl, _super);
                function ComponentMethodAspectImpl() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ComponentMethodAspectImpl.prototype.execute = function (jp) {
                    var aspectInstance = jp.ctx.getInstance(clazz);
                    var func = aspectInstance[methodName];
                    return func.call(this.aspectInstance, jp);
                };
                return ComponentMethodAspectImpl;
            }(ComponentMethodAspect));
        };
        return ComponentMethodAspect;
    }());

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
    }());

    var PROXY_TARGET_MAP = new WeakMap();
    function recordProxyTarget(proxy, target) {
        PROXY_TARGET_MAP.set(proxy, target);
    }

    var AOPInstantiationAwareProcessor = /** @class */ (function () {
        function AOPInstantiationAwareProcessor() {
        }
        AOPInstantiationAwareProcessor.create = function (appCtx) {
            return /** @class */ (function (_super) {
                __extends(class_1, _super);
                function class_1() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.appCtx = appCtx;
                    return _this;
                }
                return class_1;
            }(AOPInstantiationAwareProcessor));
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
    }());

    var ArgvEvaluator = /** @class */ (function () {
        function ArgvEvaluator() {
        }
        ArgvEvaluator.prototype.eval = function (context, expression, args) {
            var argv = args || process.argv;
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            var minimist = require('minimist');
            var map = minimist(argv);
            return map[expression];
        };
        return ArgvEvaluator;
    }());

    var EnvironmentEvaluator = /** @class */ (function () {
        function EnvironmentEvaluator() {
        }
        EnvironmentEvaluator.prototype.eval = function (context, expression) {
            return process.env[expression];
        };
        return EnvironmentEvaluator;
    }());

    var JSONDataEvaluator = /** @class */ (function () {
        function JSONDataEvaluator() {
            this.namespaceDataMap = new Map();
        }
        JSONDataEvaluator.prototype.eval = function (context, expression) {
            var colonIndex = expression.indexOf(':');
            if (colonIndex === -1) {
                throw new Error('Incorrect expression, namespace not specified');
            }
            var namespace = expression.substring(0, colonIndex);
            var exp = expression.substring(colonIndex + 1);
            if (!this.namespaceDataMap.has(namespace)) {
                throw new Error("Incorrect expression: namespace not recorded: \"".concat(namespace, "\""));
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
    }());
    function runExpression(expression, rootContext) {
        var fn = compileExpression(expression);
        return fn(rootContext);
    }
    function compileExpression(expression) {
        if (expression.indexOf(',') > -1) {
            throw new Error("Incorrect expression syntax, The ',' is not allowed in expression: \"".concat(expression, "\""));
        }
        if (expression.length > 120) {
            throw new Error("Incorrect expression syntax, expression length cannot be greater than 120, but actual: ".concat(expression.length));
        }
        if (/\(.*?\)/.test(expression)) {
            throw new Error("Incorrect expression syntax, parentheses are not allowed in expression: \"".concat(expression, "\""));
        }
        expression = expression.trim();
        if (expression === '') {
            return function (root) { return root; };
        }
        var rootVarName = varName('context');
        return new Function(rootVarName, "\n        \"use strict\";\n        try {\n            return ".concat(rootVarName, ".").concat(expression, ";\n        } catch(error) { throw error }\n    "));
    }
    var VAR_SEQUENCE = Date.now();
    function varName(prefix) {
        return prefix + '' + (VAR_SEQUENCE++).toString(16);
    }

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
                isFactory: function () { return _this.isFactory; },
                getScope: function () { return _this.scope; }
            };
        };
        return FunctionMetadata;
    }());

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
    }());

    exports.Lifecycle = void 0;
    (function (Lifecycle) {
        Lifecycle["PRE_INJECT"] = "ioc-scope:pre-inject";
        Lifecycle["POST_INJECT"] = "ioc-scope:post-inject";
        Lifecycle["PRE_DESTROY"] = "ioc-scope:pre-destroy";
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
            instanceWrappers.sort(function (a, b) { return a.compareTo(b); });
            instanceWrappers.forEach(function (instanceWrapper) {
                invokePreDestroy(instanceWrapper.instance);
            });
            this.INSTANCE_MAP.clear();
        };
        return SingletonInstanceResolution;
    }());

    var SINGLETON_INSTANCE_SINGLETON = new SingletonInstanceResolution();
    var GlobalSharedInstanceResolution = /** @class */ (function () {
        function GlobalSharedInstanceResolution() {
        }
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
    }());

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
    }());

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
    }());

    var ComponentInstanceBuilder = /** @class */ (function () {
        function ComponentInstanceBuilder(componentClass, container, instAwareProcessorManager) {
            this.componentClass = componentClass;
            this.container = container;
            this.instAwareProcessorManager = instAwareProcessorManager;
            this.getConstructorArgs = function () { return []; };
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
                        return function () { return container.getInstance(propertyType.clazz, owner); };
                    });
                    return "continue";
                }
                var identifier = propertyType.identifier;
                var factoryDef = this_1.container.getFactory(identifier);
                if (factoryDef) {
                    this_1.propertyFactories.set(propertyName, factoryDef);
                    return "continue";
                }
                var propertyClassMetadata = globalMetadataReader.getClassMetadata(identifier);
                if (propertyClassMetadata) {
                    this_1.propertyFactories.set(propertyName, ServiceFactoryDef.createFromClassMetadata(propertyClassMetadata));
                    return "continue";
                }
                var propertyFactoryDef = globalMetadataReader.getComponentFactory(identifier);
                if (propertyFactoryDef) {
                    this_1.propertyFactories.set(propertyName, propertyFactoryDef);
                }
            };
            var this_1 = this;
            try {
                for (var propertyTypes_1 = __values(propertyTypes), propertyTypes_1_1 = propertyTypes_1.next(); !propertyTypes_1_1.done; propertyTypes_1_1 = propertyTypes_1.next()) {
                    var _b = __read(propertyTypes_1_1.value, 2), propertyName = _b[0], propertyType = _b[1];
                    _loop_1(propertyName, propertyType);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (propertyTypes_1_1 && !propertyTypes_1_1.done && (_a = propertyTypes_1.return)) _a.call(propertyTypes_1);
                }
                finally { if (e_1) throw e_1.error; }
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
            }
            else {
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
                    _this.defineProperty(instance, typeof key === 'number' ? key + '' : key, getter);
                });
            }
        };
        ComponentInstanceBuilder.prototype.defineProperty = function (instance, key, getter) {
            if (this.lazyMode) {
                lazy.lazyProp(instance, key, getter);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
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
                        // eslint-disable-next-line max-len
                        "Multiple matching injectables found for property injection,\nbut property ".concat(key.toString(), " is not an array,\n                        It is ambiguous to determine which object should be injected!"));
                    }
                    var _e = __read(factoryDef.factories.entries().next().value, 2), factory_1 = _e[0], injections_1 = _e[1];
                    result.set(key, function (instance) {
                        var producer = factory_1(_this.container, instance);
                        return function () {
                            return _this.container.invoke(producer, {
                                injections: injections_1
                            });
                        };
                    });
                }
                else {
                    result.set(key, function (instance) {
                        var producerAndInjections = Array.from(factoryDef.factories).map(function (_a) {
                            var _b = __read(_a, 2), factory = _b[0], injections = _b[1];
                            return [factory(_this.container, instance), injections];
                        });
                        return function () {
                            return producerAndInjections.map(function (_a) {
                                var _b = __read(_a, 2), producer = _b[0], injections = _b[1];
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
                    var _d = __read(_c.value, 2), key = _d[0], factoryDef = _d[1];
                    _loop_2(key, factoryDef);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return result;
        };
        return ComponentInstanceBuilder;
    }());

    var EventEmitter = /** @class */ (function () {
        function EventEmitter() {
            this.events = new Map();
        }
        EventEmitter.prototype.on = function (type, listener) {
            var listeners = this.events.get(type);
            if (listeners) {
                if (listeners.indexOf(listener) == -1) {
                    listeners.push(listener);
                }
            }
            else {
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
            (_a = this.events.get(type)) === null || _a === void 0 ? void 0 : _a.forEach(function (fn) {
                fn.apply(void 0, __spreadArray([], __read(args), false));
            });
        };
        return EventEmitter;
    }());

    var InstantiationAwareProcessorManager = /** @class */ (function () {
        function InstantiationAwareProcessorManager(container) {
            this.container = container;
            this.instAwareProcessorClasses = new Set();
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
                    if (!!result) {
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
        __decorate([
            lazy.lazyMember({
                evaluate: function (instance) {
                    var globalInstAwareProcessorClasses = GlobalMetadata.getReader().getInstAwareProcessorClasses();
                    var instAwareProcessorClasses = globalInstAwareProcessorClasses.concat(Array.from(instance.instAwareProcessorClasses));
                    return instAwareProcessorClasses.map(function (it) { return instance.container.getInstance(it); });
                },
                resetBy: [
                    function (instance) { return instance.instAwareProcessorClasses.size; },
                    function () {
                        var globalInstAwareProcessorClasses = GlobalMetadata.getReader().getInstAwareProcessorClasses();
                        return globalInstAwareProcessorClasses.length;
                    }
                ]
            }),
            __metadata("design:type", Array)
        ], InstantiationAwareProcessorManager.prototype, "instAwareProcessorInstances", void 0);
        return InstantiationAwareProcessorManager;
    }());

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
            if (options === void 0) { options = {}; }
            var _a;
            this.resolutions = new Map();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                if (!resolution_1.shouldGenerate({
                    identifier: symbol,
                    owner: owner
                })) {
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
            }
            else {
                var classMetadata = GlobalMetadata.getInstance().reader().getClassMetadata(symbol);
                if (!classMetadata) {
                    throw new Error("Class alias not found: ".concat(symbol.toString()));
                }
                else {
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
            var resolution = (this.resolutions.get(scope !== null && scope !== void 0 ? scope : this.defaultScope) ||
                this.resolutions.get(this.defaultScope));
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
            }
            else {
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
            if (scope === void 0) { scope = exports.InstanceScope.SINGLETON; }
            this.factories.append(symbol, factory, injections, scope);
        };
        ApplicationContext.prototype.invoke = function (func, options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            var fn;
            if (arguments.length > 1) {
                fn = func.bind(options.context);
            }
            else {
                fn = func;
            }
            if (hasArgs(options)) {
                return options.args ? fn.apply(void 0, __spreadArray([], __read(options.args), false)) : fn();
            }
            var argsIndentifiers = [];
            if (hasInjections(options)) {
                argsIndentifiers = options.injections;
            }
            else {
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
                        throw new Error("Multiple matching injectables found for parameter at ".concat(index, "."));
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
                throw new TypeError("Unknown evaluator name: ".concat(options.type));
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
            resolution === null || resolution === void 0 ? void 0 : resolution.saveInstance({
                identifier: identifier,
                instance: instance
            });
        };
        ApplicationContext.prototype.registerInstanceScopeResolution = function (scope, resolutionConstructor, constructorArgs) {
            this.resolutions.set(scope, new (resolutionConstructor.bind.apply(resolutionConstructor, __spreadArray([void 0], __read((constructorArgs !== null && constructorArgs !== void 0 ? constructorArgs : [])), false)))());
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
            this.instAwareProcessorManager.appendInstAwareProcessorClass(/** @class */ (function () {
                function InnerProcessor() {
                }
                InnerProcessor.prototype.beforeInstantiation = function (constructor, args) {
                    return processor(constructor, args);
                };
                return InnerProcessor;
            }()));
        };
        ApplicationContext.prototype.registerAfterInstantiationProcessor = function (processor) {
            this.instAwareProcessorManager.appendInstAwareProcessorClass(/** @class */ (function () {
                function InnerProcessor() {
                }
                InnerProcessor.prototype.afterInstantiation = function (instance) {
                    return processor(instance);
                };
                return InnerProcessor;
            }()));
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
            var resolution = this.resolutions.get(exports.InstanceScope.TRANSIENT);
            (resolution === null || resolution === void 0 ? void 0 : resolution.destroyThat) && resolution.destroyThat(instance);
        };
        return ApplicationContext;
    }());

    function Factory(produceIdentifier, scope) {
        if (scope === void 0) { scope = exports.InstanceScope.SINGLETON; }
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
            metadata.recordFactory(produceIdentifier, function (container, owner) {
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
                }
                else {
                    return function () { return func; };
                }
            }, injections, scope);
        };
    }

    function Generate(generator) {
        return function (target, propertyKey) {
            var metadata = MetadataInstanceManager.getMetadata(target.constructor, ClassMetadata);
            var value_symbol = Symbol('');
            metadata.recordPropertyType(propertyKey, InjectionType.ofIdentifier(value_symbol));
            GlobalMetadata.getInstance().recordFactory(value_symbol, function (container, owner) {
                return function () { return generator.call(owner, container); };
            });
        };
    }

    function Inject(identifier) {
        return function (target, propertyKey, parameterIndex) {
            var injectClass = undefined;
            if (typeof target === 'function' && typeof parameterIndex === 'number') {
                // constructor parameter
                var targetConstr = target;
                if (typeof identifier === 'function') {
                    injectClass = identifier;
                }
                else {
                    injectClass = Reflect.getMetadata('design:paramtypes', target, propertyKey)[parameterIndex];
                }
                if (isNotDefined(injectClass)) {
                    throw new Error('Type not recognized, injection cannot be performed');
                }
                var classMetadata = MetadataInstanceManager.getMetadata(targetConstr, ClassMetadata);
                classMetadata.setConstructorParameterType(parameterIndex, InjectionType.of(injectClass, identifier));
            }
            else if (typeof target === 'object' && target !== null && propertyKey !== undefined) {
                var injectClass_1 = undefined;
                if (typeof identifier === 'function') {
                    injectClass_1 = identifier;
                }
                else {
                    injectClass_1 = Reflect.getMetadata('design:type', target, propertyKey);
                }
                if (isNotDefined(injectClass_1)) {
                    throw new Error('Type not recognized, injection cannot be performed');
                }
                var metadata = MetadataInstanceManager.getMetadata(target.constructor, ClassMetadata);
                metadata.recordPropertyType(propertyKey, InjectionType.of(injectClass_1, identifier));
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
                metadata.recordFactory(produce, function (container, owner) {
                    return function () {
                        var instance = container.getInstance(target, owner);
                        return instance;
                    };
                }, [], (_b = (_a = classMetadata.reader().getScope()) !== null && _a !== void 0 ? _a : options.scope) !== null && _b !== void 0 ? _b : exports.InstanceScope.SINGLETON);
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
        return Value("".concat(namespace, ":").concat(jsonpath), exports.ExpressionType.JSON_PATH);
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
        if (value === void 0) { value = true; }
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args.length === 1) {
                // class decorator
                var metadata = MetadataInstanceManager.getMetadata(args[0], ClassMetadata);
                metadata.marker().ctor(key, value);
            }
            else if (args.length === 2) {
                // property decorator
                var _a = __read(args, 2), prototype = _a[0], propertyKey = _a[1];
                var metadata = MetadataInstanceManager.getMetadata(prototype.constructor, ClassMetadata);
                metadata.marker().member(propertyKey).mark(key, value);
            }
            else if (args.length === 3 && typeof args[2] === 'number') {
                // parameter decorator
                var _b = __read(args, 3), prototype = _b[0], propertyKey = _b[1], index = _b[2];
                var metadata = MetadataInstanceManager.getMetadata(prototype.constructor, ClassMetadata);
                metadata.marker().parameter(propertyKey, index).mark(key, value);
            }
            else {
                // method decorator
                var _c = __read(args, 2), prototype = _c[0], propertyKey = _c[1];
                var metadata = MetadataInstanceManager.getMetadata(prototype.constructor, ClassMetadata);
                metadata.marker().member(propertyKey).mark(key, value);
            }
        };
    }

    /**
     * Urn calls the methods annotated with @PostInject only once, just after the injection of properties.
     * @annotation
     */
    var PostInject = function () { return LifecycleDecorator(exports.Lifecycle.POST_INJECT); };

    var PreDestroy = function () { return LifecycleDecorator(exports.Lifecycle.PRE_DESTROY); };

    /**
     * Urn calls the methods annotated with @PostInject only once, just after the injection of properties.
     * @annotation
     */
    var PreInject = function () { return LifecycleDecorator(exports.Lifecycle.PRE_INJECT); };

    function Scope(scope) {
        return function (target) {
            var metadata = MetadataInstanceManager.getMetadata(target, ClassMetadata);
            metadata.setScope(scope);
        };
    }

    var AOPClassMetadata = /** @class */ (function () {
        function AOPClassMetadata() {
            this.aspectMap = createDefaultValueMap(function () { return createDefaultValueMap(function () { return []; }); });
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
    }());

    function getMethodDescriptors(prototype) {
        if (typeof prototype !== 'object' ||
            prototype === null ||
            Object.prototype === prototype ||
            Function.prototype === prototype) {
            return {};
        }
        var superPrototype = Object.getPrototypeOf(prototype);
        var superDescriptors = superPrototype === prototype ? {} : getMethodDescriptors(superPrototype);
        return Object.assign(superDescriptors, Object.getOwnPropertyDescriptors(prototype));
    }
    function getAllMethodMemberNames(cls) {
        var descriptors = getMethodDescriptors(cls.prototype);
        delete descriptors['constructor'];
        var methodNames = new Set();
        Reflect.ownKeys(descriptors).forEach(function (key) {
            var member = cls.prototype[key];
            if (typeof member === 'function') {
                methodNames.add(key);
            }
        });
        return methodNames;
    }

    var Pointcut = /** @class */ (function () {
        function Pointcut() {
        }
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
            return this.match(cls, regex);
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
                return new OrPointcut(classes.map(function (cls) { return Pointcut.of.apply(Pointcut, __spreadArray([cls], __read(methodNames), false)); }));
            };
            var match = function (regex) {
                return new OrPointcut(classes.map(function (cls) {
                    return new MemberMatchPointcut(cls, regex);
                }));
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
            if (value === void 0) { value = true; }
            return new MarkedPointcut(type, value);
        };
        Pointcut.class = function (cls) {
            return new ClassPointcut(cls);
        };
        return Pointcut;
    }());
    var OrPointcut = /** @class */ (function (_super) {
        __extends(OrPointcut, _super);
        function OrPointcut(pointcuts) {
            var _this = _super.call(this) || this;
            _this.pointcuts = pointcuts;
            return _this;
        }
        OrPointcut.prototype.test = function (jpIdentifier, jpMember) {
            return this.pointcuts.some(function (it) { return it.test(jpIdentifier, jpMember); });
        };
        return OrPointcut;
    }(Pointcut));
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
    }(Pointcut));
    var MarkedPointcut = /** @class */ (function (_super) {
        __extends(MarkedPointcut, _super);
        function MarkedPointcut(markedType, markedValue) {
            if (markedValue === void 0) { markedValue = true; }
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
    }(Pointcut));
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
    }(Pointcut));
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
    }(Pointcut));

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

    function UseAspects(advice, aspects) {
        return function (target, propertyKey) {
            var clazz = target.constructor;
            aspects.forEach(function (aspectClass) {
                addAspect(aspectClass, 'execute', advice, Pointcut.of(clazz, propertyKey));
            });
        };
    }

    function createFactoryWrapper(produceIdentifier, produce, owner) {
        var TheFactory = /** @class */ (function () {
            function TheFactory() {
            }
            TheFactory.prototype.produce = function () {
                return produce;
            };
            TheFactory.preventTreeShaking = function () {
                return owner;
            };
            __decorate([
                Factory(produceIdentifier),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], TheFactory.prototype, "produce", null);
            return TheFactory;
        }());
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

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudW1kLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29tbW9uL0RlZmF1bHRWYWx1ZU1hcC50cyIsIi4uL3NyYy9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlci50cyIsIi4uL3NyYy9tZXRhZGF0YS9DbGFzc01ldGFkYXRhLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vSW5zdGFuY2VTY29wZS50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL1NlcnZpY2VGYWN0b3J5RGVmLnRzIiwiLi4vc3JjL2NvbW1vbi9GYWN0b3J5UmVjb3JkZXIudHMiLCIuLi9zcmMvbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEudHMiLCIuLi9zcmMvdHlwZXMvRXZhbHVhdGVPcHRpb25zLnRzIiwiLi4vc3JjL2NvbW1vbi9pc05vZGVKcy50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0luamVjdGlvblR5cGUudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9WYWx1ZS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0FyZ3YudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9BbGlhcy50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0JpbmQudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9FbnYudHMiLCIuLi9zcmMvY29tbW9uL2lzTm90RGVmaW5lZC50cyIsIi4uL3NyYy9hb3AvQWR2aWNlLnRzIiwiLi4vc3JjL2FvcC9Bc3BlY3RVdGlscy50cyIsIi4uL3NyYy9hb3AvY3JlYXRlQXNwZWN0LnRzIiwiLi4vc3JjL2FvcC9Db21wb25lbnRNZXRob2RBc3BlY3QudHMiLCIuLi9zcmMvYW9wL0FzcGVjdE1ldGFkdGEudHMiLCIuLi9zcmMvY29tbW9uL1Byb3h5VGFyZ2V0UmVjb3JkZXIudHMiLCIuLi9zcmMvYW9wL0FPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvci50cyIsIi4uL3NyYy9ldmFsdWF0b3IvQXJndkV2YWx1YXRvci50cyIsIi4uL3NyYy9ldmFsdWF0b3IvRW52aXJvbm1lbnRFdmFsdWF0b3IudHMiLCIuLi9zcmMvZXZhbHVhdG9yL0pTT05EYXRhRXZhbHVhdG9yLnRzIiwiLi4vc3JjL21ldGFkYXRhL0Z1bmN0aW9uTWV0YWRhdGEudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9Db21wb25lbnRJbnN0YW5jZVdyYXBwZXIudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9MaWZlY3ljbGUudHMiLCIuLi9zcmMvY29tbW9uL2ludm9rZVByZURlc3Ryb3kudHMiLCIuLi9zcmMvcmVzb2x1dGlvbi9TaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24udHMiLCIuLi9zcmMvcmVzb2x1dGlvbi9HbG9iYWxTaGFyZWRJbnN0YW5jZVJlc29sdXRpb24udHMiLCIuLi9zcmMvcmVzb2x1dGlvbi9UcmFuc2llbnRJbnN0YW5jZVJlc29sdXRpb24udHMiLCIuLi9zcmMvZm91bmRhdGlvbi9MaWZlY3ljbGVNYW5hZ2VyLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vRXZlbnRFbWl0dGVyLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlci50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0ludm9rZUZ1bmN0aW9uT3B0aW9ucy50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0FwcGxpY2F0aW9uQ29udGV4dC50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0ZhY3RvcnkudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9HZW5lcmF0ZS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0luamVjdC50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0luamVjdGFibGUudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9JbnN0QXdhcmVQcm9jZXNzb3IudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9KU09ORGF0YS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0xpZmVjeWNsZURlY29yYXRvci50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL01hcmsudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9Qb3N0SW5qZWN0LnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvUHJlRGVzdHJveS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL1ByZUluamVjdC50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL1Njb3BlLnRzIiwiLi4vc3JjL2FvcC9BT1BDbGFzc01ldGFkYXRhLnRzIiwiLi4vc3JjL2NvbW1vbi9nZXRBbGxNZXRob2RNZW1iZXJOYW1lcy50cyIsIi4uL3NyYy9hb3AvUG9pbnRjdXQudHMiLCIuLi9zcmMvYW9wL2FkZEFzcGVjdC50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9BZnRlci50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9BZnRlclJldHVybi50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9Bcm91bmQudHMiLCIuLi9zcmMvYW9wL2RlY29yYXRvcnMvQmVmb3JlLnRzIiwiLi4vc3JjL2FvcC9kZWNvcmF0b3JzL0ZpbmFsbHkudHMiLCIuLi9zcmMvYW9wL2RlY29yYXRvcnMvVGhyb3duLnRzIiwiLi4vc3JjL2FvcC9kZWNvcmF0b3JzL1VzZUFzcGVjdHMudHMiLCIuLi9zcmMvdXRpbHMvY3JlYXRlRmFjdG9yeVdyYXBwZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURlZmF1bHRWYWx1ZU1hcDxLLCBWPihmYWN0b3J5OiAoa2V5OiBLKSA9PiBWKSB7XG4gICAgY29uc3QgbWFwID0gbmV3IE1hcDxLLCBWPigpO1xuICAgIGNvbnN0IG9yaWdpbkdldCA9IG1hcC5nZXQuYmluZChtYXApO1xuICAgIG1hcC5nZXQgPSBmdW5jdGlvbiAoa2V5OiBLKSB7XG4gICAgICAgIGlmIChtYXAuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiBvcmlnaW5HZXQoa2V5KSBhcyBWO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFZhbHVlID0gZmFjdG9yeShrZXkpO1xuICAgICAgICAgICAgbWFwLnNldChrZXksIGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gbWFwLmdldChrZXkpIGFzIFY7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBtYXAgYXMgRGVmYXVsdFZhbHVlTWFwPEssIFY+O1xufVxuZXhwb3J0IHR5cGUgRGVmYXVsdFZhbHVlTWFwPEssIFY+ID0gT21pdDxNYXA8SywgVj4sICdnZXQnPiAmIHtcbiAgICBnZXQ6IChrZXk6IEspID0+IFY7XG59O1xuIiwiaW1wb3J0IHsgTWV0YWRhdGEsIE1ldGFkYXRhQ2xhc3MsIE1ldGFkYXRhUmVhZGVyIH0gZnJvbSAnLi4vdHlwZXMvTWV0YWRhdGEnO1xuaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcCB9IGZyb20gJy4uL2NvbW1vbi9EZWZhdWx0VmFsdWVNYXAnO1xuXG50eXBlIEFueU1ldGFkYXRhID0gTWV0YWRhdGE8TWV0YWRhdGFSZWFkZXIsIHVua25vd24+O1xudHlwZSBBbnlNZXRhZGF0YUNsYXNzID0gTWV0YWRhdGFDbGFzczxNZXRhZGF0YVJlYWRlciwgdW5rbm93biwgQW55TWV0YWRhdGE+O1xuXG5jb25zdCBtZXRhZGF0YUluc3RhbmNlTWFwID0gY3JlYXRlRGVmYXVsdFZhbHVlTWFwPEFueU1ldGFkYXRhQ2xhc3MsIFNldDxBbnlNZXRhZGF0YT4+KCgpID0+IG5ldyBTZXQoKSk7XG5cbmV4cG9ydCBjbGFzcyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB7XG4gICAgc3RhdGljIGdldE1ldGFkYXRhPFIgZXh0ZW5kcyBNZXRhZGF0YVJlYWRlciwgVCBleHRlbmRzIE9iamVjdCwgTSBleHRlbmRzIE1ldGFkYXRhPFIsIFQ+ID0gTWV0YWRhdGE8UiwgVD4+KFxuICAgICAgICB0YXJnZXQ6IFQsXG4gICAgICAgIG1ldGFkYXRhQ2xhc3M6IE1ldGFkYXRhQ2xhc3M8UiwgVCwgTT5cbiAgICApIHtcbiAgICAgICAgY29uc3Qga2V5ID0gbWV0YWRhdGFDbGFzcy5nZXRSZWZsZWN0S2V5KCk7XG4gICAgICAgIGxldCBtZXRhZGF0YSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoa2V5LCB0YXJnZXQpO1xuICAgICAgICBpZiAoIW1ldGFkYXRhKSB7XG4gICAgICAgICAgICBtZXRhZGF0YSA9IG5ldyBtZXRhZGF0YUNsYXNzKCk7XG4gICAgICAgICAgICBtZXRhZGF0YS5pbml0KHRhcmdldCk7XG4gICAgICAgICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKGtleSwgbWV0YWRhdGEsIHRhcmdldCk7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZVNldCA9IG1ldGFkYXRhSW5zdGFuY2VNYXAuZ2V0KG1ldGFkYXRhQ2xhc3MpO1xuICAgICAgICAgICAgaW5zdGFuY2VTZXQuYWRkKG1ldGFkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWV0YWRhdGEgYXMgTTtcbiAgICB9XG4gICAgc3RhdGljIGdldEFsbEluc3RhbmNlb2Y8TSBleHRlbmRzIEFueU1ldGFkYXRhQ2xhc3M+KG1ldGFkYXRhQ2xhc3M6IE0pIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obWV0YWRhdGFJbnN0YW5jZU1hcC5nZXQobWV0YWRhdGFDbGFzcykpO1xuICAgIH1cbn1cbiIsIi8vIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbmltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luc3RhbmNlU2NvcGUnO1xuaW1wb3J0IHsgSnNTZXJ2aWNlQ2xhc3MgfSBmcm9tICcuLi90eXBlcy9Kc1NlcnZpY2VDbGFzcyc7XG5pbXBvcnQgeyBNZXRhZGF0YSwgTWV0YWRhdGFSZWFkZXIgfSBmcm9tICcuLi90eXBlcy9NZXRhZGF0YSc7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBjcmVhdGVEZWZhdWx0VmFsdWVNYXAgfSBmcm9tICcuLi9jb21tb24vRGVmYXVsdFZhbHVlTWFwJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBNZW1iZXJLZXkgfSBmcm9tICcuLi90eXBlcy9NZW1iZXJLZXknO1xuaW1wb3J0IHsgS2V5T2YgfSBmcm9tICcuLi90eXBlcy9LZXlPZic7XG5pbXBvcnQgeyBJbmplY3Rpb25UeXBlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9JbmplY3Rpb25UeXBlJztcblxuY29uc3QgQ0xBU1NfTUVUQURBVEFfS0VZID0gJ2lvYzpjbGFzcy1tZXRhZGF0YSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFya0luZm8ge1xuICAgIFtrZXk6IHN0cmluZyB8IHN5bWJvbF06IHVua25vd247XG59XG5cbmV4cG9ydCBjbGFzcyBNYXJrSW5mb0NvbnRhaW5lciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBtYXAgPSBjcmVhdGVEZWZhdWx0VmFsdWVNYXA8TWVtYmVyS2V5LCBNYXJrSW5mbz4oKCkgPT4gKHt9IGFzIE1hcmtJbmZvKSk7XG4gICAgZ2V0TWFya0luZm8obWV0aG9kOiBNZW1iZXJLZXkpOiBNYXJrSW5mbyB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcC5nZXQobWV0aG9kKTtcbiAgICB9XG4gICAgbWFyayhtZXRob2Q6IE1lbWJlcktleSwga2V5OiBNZW1iZXJLZXksIHZhbHVlOiB1bmtub3duKSB7XG4gICAgICAgIGNvbnN0IG1hcmtJbmZvID0gdGhpcy5tYXAuZ2V0KG1ldGhvZCk7XG4gICAgICAgIG1hcmtJbmZvW2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgZ2V0TWVtYmVycygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTZXQodGhpcy5tYXAua2V5cygpKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQYXJhbWV0ZXJNYXJrSW5mb0NvbnRhaW5lciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBtYXAgPSBjcmVhdGVEZWZhdWx0VmFsdWVNYXA8TWVtYmVyS2V5LCBSZWNvcmQ8bnVtYmVyLCBNYXJrSW5mbz4+KCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH0pO1xuICAgIGdldE1hcmtJbmZvKG1ldGhvZDogTWVtYmVyS2V5KTogUmVjb3JkPG51bWJlciwgTWFya0luZm8+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwLmdldChtZXRob2QpO1xuICAgIH1cbiAgICBtYXJrKG1ldGhvZDogTWVtYmVyS2V5LCBpbmRleDogbnVtYmVyLCBrZXk6IE1lbWJlcktleSwgdmFsdWU6IHVua25vd24pIHtcbiAgICAgICAgY29uc3QgcGFyYW1zTWFya0luZm8gPSB0aGlzLm1hcC5nZXQobWV0aG9kKTtcbiAgICAgICAgY29uc3QgbWFya0luZm8gPSBwYXJhbXNNYXJrSW5mb1tpbmRleF0gfHwge307XG4gICAgICAgIG1hcmtJbmZvW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgcGFyYW1zTWFya0luZm9baW5kZXhdID0gbWFya0luZm87XG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENsYXNzTWFya0luZm8ge1xuICAgIGN0b3I6IE1hcmtJbmZvO1xuICAgIG1lbWJlcnM6IE1hcmtJbmZvQ29udGFpbmVyO1xuICAgIHBhcmFtczogUGFyYW1ldGVyTWFya0luZm9Db250YWluZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhc3NNZXRhZGF0YVJlYWRlcjxUPiBleHRlbmRzIE1ldGFkYXRhUmVhZGVyIHtcbiAgICBnZXRDbGFzcygpOiBOZXdhYmxlPFQ+O1xuICAgIGdldFNjb3BlKCk6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgZ2V0Q29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlcygpOiBBcnJheTxJbmplY3Rpb25UeXBlPjtcbiAgICBnZXRNZXRob2RzKGxpZmVjeWNsZTogTGlmZWN5Y2xlKTogQXJyYXk8c3RyaW5nIHwgc3ltYm9sPjtcbiAgICBnZXRQcm9wZXJ0eVR5cGVNYXAoKTogTWFwPHN0cmluZyB8IHN5bWJvbCwgSW5qZWN0aW9uVHlwZT47XG4gICAgZ2V0Q3Rvck1hcmtJbmZvKCk6IE1hcmtJbmZvO1xuICAgIGdldEFsbE1hcmtlZE1lbWJlcnMoKTogU2V0PE1lbWJlcktleT47XG4gICAgZ2V0TWVtYmVyc01hcmtJbmZvKG1ldGhvZEtleTogS2V5T2Y8VD4pOiBNYXJrSW5mbztcbiAgICBnZXRQYXJhbWV0ZXJNYXJrSW5mbyhtZXRob2RLZXk6IEtleU9mPFQ+KTogUmVjb3JkPG51bWJlciwgTWFya0luZm8+O1xufVxuXG5leHBvcnQgY2xhc3MgQ2xhc3NNZXRhZGF0YTxUPiBpbXBsZW1lbnRzIE1ldGFkYXRhPENsYXNzTWV0YWRhdGFSZWFkZXI8VD4sIE5ld2FibGU8VD4+IHtcbiAgICBzdGF0aWMgZ2V0UmVmbGVjdEtleSgpIHtcbiAgICAgICAgcmV0dXJuIENMQVNTX01FVEFEQVRBX0tFWTtcbiAgICB9XG4gICAgcHJpdmF0ZSBzY29wZT86IEluc3RhbmNlU2NvcGUgfCBzdHJpbmc7XG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvclBhcmFtZXRlclR5cGVzOiBBcnJheTxJbmplY3Rpb25UeXBlPiA9IFtdO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbGlmZWN5Y2xlTWV0aG9kc01hcDogUmVjb3JkPHN0cmluZyB8IHN5bWJvbCwgU2V0PExpZmVjeWNsZT4+ID0ge307XG4gICAgcHJpdmF0ZSByZWFkb25seSBwcm9wZXJ0eVR5cGVzTWFwID0gbmV3IE1hcDxzdHJpbmcgfCBzeW1ib2wsIEluamVjdGlvblR5cGU+KCk7XG4gICAgcHJpdmF0ZSBjbGF6eiE6IE5ld2FibGU8VD47XG4gICAgcHJpdmF0ZSByZWFkb25seSBtYXJrczogQ2xhc3NNYXJrSW5mbyA9IHtcbiAgICAgICAgY3Rvcjoge30sXG4gICAgICAgIG1lbWJlcnM6IG5ldyBNYXJrSW5mb0NvbnRhaW5lcigpLFxuICAgICAgICBwYXJhbXM6IG5ldyBQYXJhbWV0ZXJNYXJrSW5mb0NvbnRhaW5lcigpXG4gICAgfTtcblxuICAgIHN0YXRpYyBnZXRJbnN0YW5jZTxUPihjdG9yOiBOZXdhYmxlPFQ+KSB7XG4gICAgICAgIHJldHVybiBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICB9XG4gICAgc3RhdGljIGdldFJlYWRlcjxUPihjdG9yOiBOZXdhYmxlPFQ+KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbmNlKGN0b3IpLnJlYWRlcigpO1xuICAgIH1cblxuICAgIGluaXQodGFyZ2V0OiBOZXdhYmxlPFQ+KSB7XG4gICAgICAgIHRoaXMuY2xhenogPSB0YXJnZXQ7XG4gICAgICAgIGNvbnN0IGNvbnN0ciA9IHRhcmdldCBhcyBKc1NlcnZpY2VDbGFzczx1bmtub3duPjtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25zdHIuc2NvcGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U2NvcGUoY29uc3RyLnNjb3BlKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgY29uc3RyLmluamVjdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29uc3QgaW5qZWN0aW9ucyA9IGNvbnN0ci5pbmplY3QoKTtcbiAgICAgICAgICAgIFJlZmxlY3Qub3duS2V5cyhpbmplY3Rpb25zKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWNvcmRQcm9wZXJ0eVR5cGUoa2V5LCBpbmplY3Rpb25zW2tleV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBjb25zdHIubWV0YWRhdGEgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gY29uc3RyLm1ldGFkYXRhKCk7XG4gICAgICAgICAgICBpZiAobWV0YWRhdGEuc2NvcGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNjb3BlKG1ldGFkYXRhLnNjb3BlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGluamVjdGlvbnMgPSBtZXRhZGF0YS5pbmplY3Q7XG4gICAgICAgICAgICBpZiAoaW5qZWN0aW9ucykge1xuICAgICAgICAgICAgICAgIFJlZmxlY3Qub3duS2V5cyhpbmplY3Rpb25zKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVjb3JkUHJvcGVydHlUeXBlKGtleSwgaW5qZWN0aW9uc1trZXldKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1hcmtlcigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGN0b3I6IChrZXk6IHN0cmluZyB8IHN5bWJvbCwgdmFsdWU6IHVua25vd24pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm1hcmtzLmN0b3Jba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1lbWJlcjogKHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wgfCBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBtYXJrOiAoa2V5OiBzdHJpbmcgfCBzeW1ib2wsIHZhbHVlOiB1bmtub3duKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtzLm1lbWJlcnMubWFyayhwcm9wZXJ0eUtleSwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcmFtZXRlcjogKHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBtYXJrOiAoa2V5OiBzdHJpbmcgfCBzeW1ib2wsIHZhbHVlOiB1bmtub3duKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtzLnBhcmFtcy5tYXJrKHByb3BlcnR5S2V5LCBpbmRleCwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBzZXRTY29wZShzY29wZTogSW5zdGFuY2VTY29wZSB8IHN0cmluZykge1xuICAgICAgICB0aGlzLnNjb3BlID0gc2NvcGU7XG4gICAgfVxuICAgIHNldENvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZShpbmRleDogbnVtYmVyLCB0eXBlOiBJbmplY3Rpb25UeXBlKSB7XG4gICAgICAgIHRoaXMuY29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlc1tpbmRleF0gPSB0eXBlO1xuICAgIH1cbiAgICByZWNvcmRQcm9wZXJ0eVR5cGUocHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCwgdHlwZTogSW5qZWN0aW9uVHlwZSkge1xuICAgICAgICB0aGlzLnByb3BlcnR5VHlwZXNNYXAuc2V0KHByb3BlcnR5S2V5LCB0eXBlKTtcbiAgICB9XG4gICAgYWRkTGlmZWN5Y2xlTWV0aG9kKG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCwgbGlmZWN5Y2xlOiBMaWZlY3ljbGUpIHtcbiAgICAgICAgY29uc3QgbGlmZWN5Y2xlcyA9IHRoaXMuZ2V0TGlmZWN5Y2xlcyhtZXRob2ROYW1lKTtcbiAgICAgICAgbGlmZWN5Y2xlcy5hZGQobGlmZWN5Y2xlKTtcbiAgICAgICAgdGhpcy5saWZlY3ljbGVNZXRob2RzTWFwW21ldGhvZE5hbWVdID0gbGlmZWN5Y2xlcztcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRMaWZlY3ljbGVzKG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5saWZlY3ljbGVNZXRob2RzTWFwW21ldGhvZE5hbWVdIHx8IG5ldyBTZXQ8TGlmZWN5Y2xlPigpO1xuICAgIH1cbiAgICBnZXRNZXRob2RzKGxpZmVjeWNsZTogTGlmZWN5Y2xlKTogQXJyYXk8c3RyaW5nIHwgc3ltYm9sPiB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmxpZmVjeWNsZU1ldGhvZHNNYXApLmZpbHRlcihpdCA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaWZlY3ljbGVzID0gdGhpcy5saWZlY3ljbGVNZXRob2RzTWFwW2l0XTtcbiAgICAgICAgICAgIHJldHVybiBsaWZlY3ljbGVzLmhhcyhsaWZlY3ljbGUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRTdXBlckNsYXNzKCkge1xuICAgICAgICBjb25zdCBzdXBlckNsYXNzUHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMuY2xhenopO1xuICAgICAgICBpZiAoIXN1cGVyQ2xhc3NQcm90b3R5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN1cGVyQ2xhc3MgPSBzdXBlckNsYXNzUHJvdG90eXBlLmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dW5rbm93bj47XG4gICAgICAgIGlmIChzdXBlckNsYXNzID09PSB0aGlzLmNsYXp6KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXJDbGFzcztcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRTdXBlckNsYXNzTWV0YWRhdGEoKTogQ2xhc3NNZXRhZGF0YTx1bmtub3duPiB8IG51bGwge1xuICAgICAgICBjb25zdCBzdXBlckNsYXNzID0gdGhpcy5nZXRTdXBlckNsYXNzKCk7XG4gICAgICAgIGlmICghc3VwZXJDbGFzcykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIENsYXNzTWV0YWRhdGEuZ2V0SW5zdGFuY2Uoc3VwZXJDbGFzcyk7XG4gICAgfVxuICAgIHJlYWRlcigpOiBDbGFzc01ldGFkYXRhUmVhZGVyPFQ+IHtcbiAgICAgICAgY29uc3Qgc3VwZXJSZWFkZXIgPSB0aGlzLmdldFN1cGVyQ2xhc3NNZXRhZGF0YSgpPy5yZWFkZXIoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldENsYXNzOiAoKSA9PiB0aGlzLmNsYXp6LFxuICAgICAgICAgICAgZ2V0U2NvcGU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zY29wZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRDb25zdHJ1Y3RvclBhcmFtZXRlclR5cGVzOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlcy5zbGljZSgwKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRNZXRob2RzOiAobGlmZWN5Y2xlOiBMaWZlY3ljbGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdXBlck1ldGhvZHMgPSBzdXBlclJlYWRlcj8uZ2V0TWV0aG9kcyhsaWZlY3ljbGUpIHx8IFtdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNNZXRob2RzID0gdGhpcy5nZXRNZXRob2RzKGxpZmVjeWNsZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChzdXBlck1ldGhvZHMuY29uY2F0KHRoaXNNZXRob2RzKSkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldFByb3BlcnR5VHlwZU1hcDogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1cGVyUHJvcGVydHlUeXBlTWFwID0gc3VwZXJSZWFkZXI/LmdldFByb3BlcnR5VHlwZU1hcCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNQcm9wZXJ0eVR5cGVzTWFwID0gdGhpcy5wcm9wZXJ0eVR5cGVzTWFwO1xuICAgICAgICAgICAgICAgIGlmICghc3VwZXJQcm9wZXJ0eVR5cGVNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXAodGhpc1Byb3BlcnR5VHlwZXNNYXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgTWFwKHN1cGVyUHJvcGVydHlUeXBlTWFwKTtcbiAgICAgICAgICAgICAgICB0aGlzUHJvcGVydHlUeXBlc01hcC5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRDdG9yTWFya0luZm86ICgpOiBNYXJrSW5mbyA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgLi4udGhpcy5tYXJrcy5jdG9yIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0QWxsTWFya2VkTWVtYmVyczogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1cGVyTWV0aG9kcyA9IHN1cGVyUmVhZGVyPy5nZXRBbGxNYXJrZWRNZW1iZXJzKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGhpc01lbWJlcnMgPSB0aGlzLm1hcmtzLm1lbWJlcnMuZ2V0TWVtYmVycygpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyTWV0aG9kcyA/IG5ldyBTZXQoc3VwZXJNZXRob2RzKSA6IG5ldyBTZXQ8TWVtYmVyS2V5PigpO1xuICAgICAgICAgICAgICAgIHRoaXNNZW1iZXJzLmZvckVhY2goaXQgPT4gcmVzdWx0LmFkZChpdCkpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0TWVtYmVyc01hcmtJbmZvOiAoa2V5OiBLZXlPZjxUPik6IE1hcmtJbmZvID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXJrcy5tZW1iZXJzLmdldE1hcmtJbmZvKGtleSBhcyBNZW1iZXJLZXkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldFBhcmFtZXRlck1hcmtJbmZvOiAobWV0aG9kS2V5OiBLZXlPZjxUPik6IFJlY29yZDxudW1iZXIsIE1hcmtJbmZvPiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFya3MucGFyYW1zLmdldE1hcmtJbmZvKG1ldGhvZEtleSBhcyBNZW1iZXJLZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsImV4cG9ydCBlbnVtIEluc3RhbmNlU2NvcGUge1xuICAgIFNJTkdMRVRPTiA9ICdpb2MtcmVzb2x1dGlvbjpjb250YWluZXItc2luZ2xldG9uJyxcbiAgICBUUkFOU0lFTlQgPSAnaW9jLXJlc29sdXRpb246dHJhbnNpZW50JyxcbiAgICBHTE9CQUxfU0hBUkVEX1NJTkdMRVRPTiA9ICdpb2MtcmVzb2x1dGlvbjpnbG9iYWwtc2hhcmVkLXNpbmdsZXRvbidcbn1cbiIsImltcG9ydCB7IFNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi4vdHlwZXMvU2VydmljZUZhY3RvcnknO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHsgSW5zdGFuY2VTY29wZSB9IGZyb20gJy4vSW5zdGFuY2VTY29wZSc7XG5cbmV4cG9ydCBjbGFzcyBTZXJ2aWNlRmFjdG9yeURlZjxUPiB7XG4gICAgc3RhdGljIGNyZWF0ZUZyb21DbGFzc01ldGFkYXRhPFQ+KG1ldGFkYXRhOiBDbGFzc01ldGFkYXRhPFQ+KSB7XG4gICAgICAgIGNvbnN0IGRlZiA9IG5ldyBTZXJ2aWNlRmFjdG9yeURlZihtZXRhZGF0YS5yZWFkZXIoKS5nZXRDbGFzcygpLCBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTik7XG4gICAgICAgIGRlZi5hcHBlbmQoKGNvbnRhaW5lcjogQXBwbGljYXRpb25Db250ZXh0LCBvd25lcjogdW5rbm93bikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWFkZXIgPSBtZXRhZGF0YS5yZWFkZXIoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjbGF6eiA9IHJlYWRlci5nZXRDbGFzcygpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXIuZ2V0SW5zdGFuY2UoY2xhenosIG93bmVyKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGVmO1xuICAgIH1cbiAgICBwdWJsaWMgcmVhZG9ubHkgZmFjdG9yaWVzID0gbmV3IE1hcDxTZXJ2aWNlRmFjdG9yeTxULCB1bmtub3duPiwgSWRlbnRpZmllcltdPigpO1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBpZGVudGlmaWVyIFRoZSB1bmlxdWUgaWRlbnRpZmllciBvZiB0aGlzIGZhY3Rvcmllc1xuICAgICAqIEBwYXJhbSBpc1NpbmdsZSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgaWRlbnRpZmllciBkZWZpbmVzIG9ubHkgb25lIGZhY3RvcnkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGlkZW50aWZpZXI6IElkZW50aWZpZXIsIHB1YmxpYyByZWFkb25seSBzY29wZTogSW5zdGFuY2VTY29wZSB8IHN0cmluZykge31cbiAgICBhcHBlbmQoZmFjdG9yeTogU2VydmljZUZhY3Rvcnk8VCwgdW5rbm93bj4sIGluamVjdGlvbnM6IElkZW50aWZpZXJbXSA9IFtdKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3BlID09PSBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTiAmJiB0aGlzLmZhY3Rvcmllcy5zaXplID09PSAxICYmIHRoaXMuZmFjdG9yaWVzLmhhcyhmYWN0b3J5KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMuaWRlbnRpZmllci50b1N0cmluZygpfSBpcyBBIHNpbmdsZXRvbiEgQnV0IG11bHRpcGxlIGZhY3RvcmllcyBhcmUgZGVmaW5lZCFgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZhY3Rvcmllcy5zZXQoZmFjdG9yeSwgaW5qZWN0aW9ucyk7XG4gICAgfVxuICAgIHByb2R1Y2UoY29udGFpbmVyOiBBcHBsaWNhdGlvbkNvbnRleHQsIG93bmVyPzogdW5rbm93bikge1xuICAgICAgICAvLyBpZiAodGhpcy5pc1NpbmdsZSkge1xuICAgICAgICAvLyAgICAgY29uc3QgW2ZhY3RvcnksIGluamVjdGlvbnNdID0gdGhpcy5mYWN0b3JpZXMuZW50cmllcygpLm5leHQoKS52YWx1ZSBhcyBbU2VydmljZUZhY3Rvcnk8VCwgdW5rbm93bj4sIElkZW50aWZpZXJbXV07XG4gICAgICAgIC8vICAgICBjb25zdCBmbiA9IGZhY3RvcnkoY29udGFpbmVyLCBvd25lcik7XG4gICAgICAgIC8vICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAvLyAgICAgICAgIHJldHVybiBjb250YWluZXIuaW52b2tlKGZuLCB7XG4gICAgICAgIC8vICAgICAgICAgICAgIGluamVjdGlvbnNcbiAgICAgICAgLy8gICAgICAgICB9KTtcbiAgICAgICAgLy8gICAgIH07XG4gICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgIC8vIH1cbiAgICAgICAgY29uc3QgcHJvZHVjZXJzID0gQXJyYXkuZnJvbSh0aGlzLmZhY3RvcmllcykubWFwKChbZmFjdG9yeSwgaW5qZWN0aW9uc10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZuID0gZmFjdG9yeShjb250YWluZXIsIG93bmVyKTtcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRhaW5lci5pbnZva2UoZm4sIHtcbiAgICAgICAgICAgICAgICAgICAgaW5qZWN0aW9uc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcHJvZHVjZXJzLm1hcChpdCA9PiBpdCgpKTtcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJbnN0YW5jZVNjb3BlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9JbnN0YW5jZVNjb3BlJztcbmltcG9ydCB7IFNlcnZpY2VGYWN0b3J5RGVmIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9TZXJ2aWNlRmFjdG9yeURlZic7XG5pbXBvcnQgeyBGYWN0b3J5SWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0ZhY3RvcnlJZGVudGlmaWVyJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB0eXBlIHsgU2VydmljZUZhY3RvcnkgfSBmcm9tICcuLi90eXBlcy9TZXJ2aWNlRmFjdG9yeSc7XG5cbmV4cG9ydCBjbGFzcyBGYWN0b3J5UmVjb3JkZXIge1xuICAgIHByaXZhdGUgZmFjdG9yaWVzID0gbmV3IE1hcDxGYWN0b3J5SWRlbnRpZmllciwgU2VydmljZUZhY3RvcnlEZWY8dW5rbm93bj4+KCk7XG5cbiAgICBwdWJsaWMgYXBwZW5kPFQ+KFxuICAgICAgICBpZGVudGlmaWVyOiBGYWN0b3J5SWRlbnRpZmllcixcbiAgICAgICAgZmFjdG9yeTogU2VydmljZUZhY3Rvcnk8VCwgdW5rbm93bj4sXG4gICAgICAgIGluamVjdGlvbnM6IElkZW50aWZpZXJbXSA9IFtdLFxuICAgICAgICBzY29wZTogSW5zdGFuY2VTY29wZSB8IHN0cmluZyA9IEluc3RhbmNlU2NvcGUuU0lOR0xFVE9OXG4gICAgKSB7XG4gICAgICAgIGxldCBkZWYgPSB0aGlzLmZhY3Rvcmllcy5nZXQoaWRlbnRpZmllcik7XG4gICAgICAgIGlmIChkZWYpIHtcbiAgICAgICAgICAgIGRlZi5hcHBlbmQoZmFjdG9yeSwgaW5qZWN0aW9ucyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWYgPSBuZXcgU2VydmljZUZhY3RvcnlEZWYoaWRlbnRpZmllciwgc2NvcGUpO1xuICAgICAgICAgICAgZGVmLmFwcGVuZChmYWN0b3J5LCBpbmplY3Rpb25zKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZhY3Rvcmllcy5zZXQoaWRlbnRpZmllciwgZGVmKTtcbiAgICB9XG4gICAgcHVibGljIHNldChpZGVudGlmaWVyOiBGYWN0b3J5SWRlbnRpZmllciwgZmFjdG9yeURlZjogU2VydmljZUZhY3RvcnlEZWY8dW5rbm93bj4pIHtcbiAgICAgICAgdGhpcy5mYWN0b3JpZXMuc2V0KGlkZW50aWZpZXIsIGZhY3RvcnlEZWYpO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0PFQ+KGlkZW50aWZpZXI6IEZhY3RvcnlJZGVudGlmaWVyKTogU2VydmljZUZhY3RvcnlEZWY8VD4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5mYWN0b3JpZXMuZ2V0KGlkZW50aWZpZXIpIGFzIFNlcnZpY2VGYWN0b3J5RGVmPFQ+IHwgdW5kZWZpbmVkO1xuICAgIH1cbiAgICBwdWJsaWMgaXRlcmF0b3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZhY3Rvcmllcy5lbnRyaWVzKCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTWV0YWRhdGEgfSBmcm9tICcuLi90eXBlcy9NZXRhZGF0YSc7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4uL3R5cGVzL1NlcnZpY2VGYWN0b3J5JztcbmltcG9ydCB7IEZhY3RvcnlJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvRmFjdG9yeUlkZW50aWZpZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4vQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeURlZiB9IGZyb20gJy4uL2ZvdW5kYXRpb24vU2VydmljZUZhY3RvcnlEZWYnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL3R5cGVzL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcic7XG5pbXBvcnQgeyBGYWN0b3J5UmVjb3JkZXIgfSBmcm9tICcuLi9jb21tb24vRmFjdG9yeVJlY29yZGVyJztcbmltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luc3RhbmNlU2NvcGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEdsb2JhbE1ldGFkYXRhUmVhZGVyIHtcbiAgICBnZXRDb21wb25lbnRGYWN0b3J5PFQ+KGtleTogRmFjdG9yeUlkZW50aWZpZXIpOiBTZXJ2aWNlRmFjdG9yeURlZjxUPiB8IHVuZGVmaW5lZDtcbiAgICBnZXRDbGFzc01ldGFkYXRhPFQ+KGFsaWFzTmFtZTogc3RyaW5nIHwgc3ltYm9sKTogQ2xhc3NNZXRhZGF0YTxUPiB8IHVuZGVmaW5lZDtcbiAgICBnZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKCk6IEFycmF5PE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4+O1xufVxuZXhwb3J0IGNsYXNzIEdsb2JhbE1ldGFkYXRhIGltcGxlbWVudHMgTWV0YWRhdGE8R2xvYmFsTWV0YWRhdGFSZWFkZXIsIHZvaWQ+IHtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBJTlNUQU5DRSA9IG5ldyBHbG9iYWxNZXRhZGF0YSgpO1xuICAgIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICAgICAgcmV0dXJuIEdsb2JhbE1ldGFkYXRhLklOU1RBTkNFO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0UmVhZGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW5jZSgpLnJlYWRlcigpO1xuICAgIH1cbiAgICBwcml2YXRlIGNsYXNzQWxpYXNNZXRhZGF0YU1hcCA9IG5ldyBNYXA8c3RyaW5nIHwgc3ltYm9sLCBDbGFzc01ldGFkYXRhPHVua25vd24+PigpO1xuICAgIHByaXZhdGUgY29tcG9uZW50RmFjdG9yaWVzID0gbmV3IEZhY3RvcnlSZWNvcmRlcigpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcHJvY2Vzc29yQ2xhc3NlczogU2V0PE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4+ID0gbmV3IFNldCgpO1xuICAgIHJlY29yZEZhY3Rvcnk8VD4oXG4gICAgICAgIHN5bWJvbDogRmFjdG9yeUlkZW50aWZpZXIsXG4gICAgICAgIGZhY3Rvcnk6IFNlcnZpY2VGYWN0b3J5PFQsIHVua25vd24+LFxuICAgICAgICBpbmplY3Rpb25zOiBJZGVudGlmaWVyW10gPSBbXSxcbiAgICAgICAgc2NvcGU6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmcgPSBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTlxuICAgICkge1xuICAgICAgICB0aGlzLmNvbXBvbmVudEZhY3Rvcmllcy5hcHBlbmQoc3ltYm9sLCBmYWN0b3J5LCBpbmplY3Rpb25zLCBzY29wZSk7XG4gICAgfVxuICAgIHJlY29yZENsYXNzQWxpYXM8VD4oYWxpYXNOYW1lOiBzdHJpbmcgfCBzeW1ib2wsIG1ldGFkYXRhOiBDbGFzc01ldGFkYXRhPFQ+KSB7XG4gICAgICAgIHRoaXMuY2xhc3NBbGlhc01ldGFkYXRhTWFwLnNldChhbGlhc05hbWUsIG1ldGFkYXRhKTtcbiAgICB9XG4gICAgcmVjb3JkUHJvY2Vzc29yQ2xhc3MoY2xheno6IE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4pIHtcbiAgICAgICAgdGhpcy5wcm9jZXNzb3JDbGFzc2VzLmFkZChjbGF6eik7XG4gICAgfVxuICAgIGluaXQoKSB7XG4gICAgICAgIC8vIFBBU1M7XG4gICAgfVxuICAgIHJlYWRlcigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldENvbXBvbmVudEZhY3Rvcnk6IDxUPihrZXk6IEZhY3RvcnlJZGVudGlmaWVyKTogU2VydmljZUZhY3RvcnlEZWY8VD4gfCB1bmRlZmluZWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudEZhY3Rvcmllcy5nZXQoa2V5KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRDbGFzc01ldGFkYXRhOiA8VD4oYWxpYXNOYW1lOiBzdHJpbmcgfCBzeW1ib2wpOiBDbGFzc01ldGFkYXRhPFQ+IHwgdW5kZWZpbmVkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jbGFzc0FsaWFzTWV0YWRhdGFNYXAuZ2V0KGFsaWFzTmFtZSkgYXMgQ2xhc3NNZXRhZGF0YTxUPiB8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzOiAoKTogQXJyYXk8TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPj4gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMucHJvY2Vzc29yQ2xhc3Nlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiZXhwb3J0IGludGVyZmFjZSBFdmFsdWF0aW9uT3B0aW9uczxPLCBFIGV4dGVuZHMgc3RyaW5nLCBBID0gdW5rbm93bj4ge1xuICAgIHR5cGU6IEU7XG4gICAgb3duZXI/OiBPO1xuICAgIHByb3BlcnR5TmFtZT86IHN0cmluZyB8IHN5bWJvbDtcbiAgICBleHRlcm5hbEFyZ3M/OiBBO1xufVxuXG5leHBvcnQgZW51bSBFeHByZXNzaW9uVHlwZSB7XG4gICAgRU5WID0gJ2luamVjdC1lbnZpcm9ubWVudC12YXJpYWJsZXMnLFxuICAgIEpTT05fUEFUSCA9ICdpbmplY3QtanNvbi1kYXRhJyxcbiAgICBBUkdWID0gJ2luamVjdC1hcmd2J1xufVxuIiwiZXhwb3J0IGNvbnN0IGlzTm9kZUpzID0gKCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gcHJvY2Vzcy52ZXJzaW9ucy5ub2RlICE9PSBudWxsO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn0pKCk7XG4iLCJpbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBjbGFzcyBJbmplY3Rpb25UeXBlIHtcbiAgICBzdGF0aWMgb2ZDbGF6eihjbGF6ejogTmV3YWJsZTx1bmtub3duPikge1xuICAgICAgICByZXR1cm4gbmV3IEluamVjdGlvblR5cGUoY2xhenopO1xuICAgIH1cbiAgICBzdGF0aWMgb2ZJZGVudGlmaWVyKGlkZW50aWZpZXI6IElkZW50aWZpZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbmplY3Rpb25UeXBlKE9iamVjdCBhcyB1bmtub3duIGFzIE5ld2FibGU8dW5rbm93bj4sIGlkZW50aWZpZXIpO1xuICAgIH1cbiAgICBzdGF0aWMgb2YoY2xheno6IE5ld2FibGU8dW5rbm93bj4sIGlkZW50aWZpZXI6IElkZW50aWZpZXIgPSBjbGF6eikge1xuICAgICAgICByZXR1cm4gbmV3IEluamVjdGlvblR5cGUoY2xhenosIGlkZW50aWZpZXIpO1xuICAgIH1cbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBjbGF6ejogTmV3YWJsZTx1bmtub3duPiwgcHVibGljIHJlYWRvbmx5IGlkZW50aWZpZXI6IElkZW50aWZpZXIgPSBjbGF6eikge31cblxuICAgIGdldCBpc05ld2FibGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkZW50aWZpZXIgPT09IHRoaXMuY2xheno7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9HbG9iYWxNZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IEV4cHJlc3Npb25UeXBlIH0gZnJvbSAnLi4vdHlwZXMvRXZhbHVhdGVPcHRpb25zJztcbmltcG9ydCB7IGlzTm9kZUpzIH0gZnJvbSAnLi4vY29tbW9uL2lzTm9kZUpzJztcbmltcG9ydCB7IEluamVjdGlvblR5cGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luamVjdGlvblR5cGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gVmFsdWU8QSA9IHVua25vd24+KGV4cHJlc3Npb246IHN0cmluZywgdHlwZTogRXhwcmVzc2lvblR5cGUgfCBzdHJpbmcsIGV4dGVybmFsQXJncz86IEEpOiBQcm9wZXJ0eURlY29yYXRvciB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgRXhwcmVzc2lvblR5cGUuRU5WOlxuICAgICAgICBjYXNlIEV4cHJlc3Npb25UeXBlLkFSR1Y6XG4gICAgICAgICAgICBpZiAoIWlzTm9kZUpzKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgXCIke3R5cGV9XCIgZXZhbHVhdG9yIG9ubHkgc3VwcG9ydHMgbm9kZWpzIGVudmlyb25tZW50IWApO1xuICAgICAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gKHRhcmdldDogT2JqZWN0LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sKSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGFyZ2V0LmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgY29uc3QgdmFsdWVfc3ltYm9sID0gU3ltYm9sKCcnKTtcbiAgICAgICAgbWV0YWRhdGEucmVjb3JkUHJvcGVydHlUeXBlKHByb3BlcnR5S2V5LCBJbmplY3Rpb25UeXBlLm9mSWRlbnRpZmllcih2YWx1ZV9zeW1ib2wpKTtcbiAgICAgICAgR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWNvcmRGYWN0b3J5KHZhbHVlX3N5bWJvbCwgKGNvbnRhaW5lciwgb3duZXIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoKSA9PlxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5ldmFsdWF0ZTxzdHJpbmcsIHR5cGVvZiBvd25lciwgQT4oZXhwcmVzc2lvbiBhcyBzdHJpbmcsIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXIsXG4gICAgICAgICAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGV4dGVybmFsQXJnc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgVmFsdWUgfSBmcm9tICcuL1ZhbHVlJztcbmltcG9ydCB7IEV4cHJlc3Npb25UeXBlIH0gZnJvbSAnLi4vdHlwZXMvRXZhbHVhdGVPcHRpb25zJztcblxuZXhwb3J0IGZ1bmN0aW9uIEFyZ3YobmFtZTogc3RyaW5nLCBhcmd2OiBzdHJpbmdbXSA9IHByb2Nlc3MuYXJndikge1xuICAgIHJldHVybiBWYWx1ZShuYW1lLCBFeHByZXNzaW9uVHlwZS5BUkdWLCBhcmd2KTtcbn1cbiIsImltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBBbGlhcyhhbGlhc05hbWU6IHN0cmluZyB8IHN5bWJvbCk6IENsYXNzRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gPFRGdW5jdGlvbiBleHRlbmRzIEZ1bmN0aW9uPih0YXJnZXQ6IFRGdW5jdGlvbikgPT4ge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldCBhcyB1bmtub3duIGFzIE5ld2FibGU8dW5rbm93bj4sIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlY29yZENsYXNzQWxpYXMoYWxpYXNOYW1lLCBtZXRhZGF0YSk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IEFsaWFzIH0gZnJvbSAnLi9BbGlhcyc7XG4vKipcbiAqIEBkZXByZWNhdGVkIHVzZSBAQWxpYXMgaW5zdGVhZFxuICogQHBhcmFtIGFsaWFzTmFtZVxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEJpbmQoYWxpYXNOYW1lOiBzdHJpbmcgfCBzeW1ib2wpOiBDbGFzc0RlY29yYXRvciB7XG4gICAgcmV0dXJuIEFsaWFzKGFsaWFzTmFtZSk7XG59XG4iLCJpbXBvcnQgeyBWYWx1ZSB9IGZyb20gJy4vVmFsdWUnO1xuaW1wb3J0IHsgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gRW52KG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBWYWx1ZShuYW1lLCBFeHByZXNzaW9uVHlwZS5FTlYpO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGlzTnVsbCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIG51bGwge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQ7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNOb3REZWZpbmVkPFQ+KHZhbHVlOiBUIHwgdW5kZWZpbmVkIHwgbnVsbCk6IHZhbHVlIGlzIHVuZGVmaW5lZCB8IG51bGwge1xuICAgIHJldHVybiBpc051bGwodmFsdWUpIHx8IGlzVW5kZWZpbmVkKHZhbHVlKTtcbn1cbiIsImV4cG9ydCBlbnVtIEFkdmljZSB7XG4gICAgQmVmb3JlLFxuICAgIEFmdGVyLFxuICAgIEFyb3VuZCxcbiAgICBBZnRlclJldHVybixcbiAgICBUaHJvd24sXG4gICAgRmluYWxseVxufVxuIiwiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSAqL1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi9BZHZpY2UnO1xuXG50eXBlIEJlZm9yZUhvb2sgPSAoYXJnczogYW55W10pID0+IHZvaWQ7XG50eXBlIEFmdGVySG9vayA9IChhcmdzOiBhbnlbXSkgPT4gdm9pZDtcbnR5cGUgVGhyb3duSG9vayA9IChyZWFzb246IGFueSwgYXJnczogYW55W10pID0+IHZvaWQ7XG50eXBlIEZpbmFsbHlIb29rID0gKGFyZ3M6IGFueVtdKSA9PiB2b2lkO1xudHlwZSBBZnRlclJldHVybkhvb2sgPSAocmV0dXJuVmFsdWU6IGFueSwgYXJnczogYW55W10pID0+IGFueTtcbnR5cGUgQXJvdW5kSG9vayA9ICh0aGlzOiBhbnksIG9yaWdpbmZuOiAoLi4uYXJnczogYW55W10pID0+IHZvaWQsIGFyZ3M6IGFueVtdKSA9PiB2b2lkO1xuXG5leHBvcnQgY2xhc3MgQXNwZWN0VXRpbHMge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgYmVmb3JlSG9va3M6IEFycmF5PEJlZm9yZUhvb2s+ID0gW107XG4gICAgcHJpdmF0ZSByZWFkb25seSBhZnRlckhvb2tzOiBBcnJheTxBZnRlckhvb2s+ID0gW107XG4gICAgcHJpdmF0ZSByZWFkb25seSB0aHJvd25Ib29rczogQXJyYXk8VGhyb3duSG9vaz4gPSBbXTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZpbmFsbHlIb29rczogQXJyYXk8RmluYWxseUhvb2s+ID0gW107XG4gICAgcHJpdmF0ZSByZWFkb25seSBhZnRlclJldHVybkhvb2tzOiBBcnJheTxBZnRlclJldHVybkhvb2s+ID0gW107XG4gICAgcHJpdmF0ZSByZWFkb25seSBhcm91bmRIb29rczogQXJyYXk8QXJvdW5kSG9vaz4gPSBbXTtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGZuOiAoLi4uYXJnczogYW55W10pID0+IGFueSkge31cbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuQmVmb3JlLCBob29rOiBCZWZvcmVIb29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuQWZ0ZXIsIGhvb2s6IEFmdGVySG9vayk6IHZvaWQ7XG4gICAgYXBwZW5kKGFkdmljZTogQWR2aWNlLlRocm93biwgaG9vazogVGhyb3duSG9vayk6IHZvaWQ7XG4gICAgYXBwZW5kKGFkdmljZTogQWR2aWNlLkZpbmFsbHksIGhvb2s6IEZpbmFsbHlIb29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuQWZ0ZXJSZXR1cm4sIGhvb2s6IEFmdGVyUmV0dXJuSG9vayk6IHZvaWQ7XG4gICAgYXBwZW5kKGFkdmljZTogQWR2aWNlLkFyb3VuZCwgaG9vazogQXJvdW5kSG9vayk6IHZvaWQ7XG4gICAgYXBwZW5kKGFkdmljZTogQWR2aWNlLCBob29rOiBGdW5jdGlvbikge1xuICAgICAgICBsZXQgaG9va3NBcnJheTogRnVuY3Rpb25bXSB8IHVuZGVmaW5lZDtcbiAgICAgICAgc3dpdGNoIChhZHZpY2UpIHtcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLkJlZm9yZTpcbiAgICAgICAgICAgICAgICBob29rc0FycmF5ID0gdGhpcy5iZWZvcmVIb29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLkFmdGVyOlxuICAgICAgICAgICAgICAgIGhvb2tzQXJyYXkgPSB0aGlzLmFmdGVySG9va3M7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFkdmljZS5UaHJvd246XG4gICAgICAgICAgICAgICAgaG9va3NBcnJheSA9IHRoaXMudGhyb3duSG9va3M7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFkdmljZS5GaW5hbGx5OlxuICAgICAgICAgICAgICAgIGhvb2tzQXJyYXkgPSB0aGlzLmZpbmFsbHlIb29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLkFmdGVyUmV0dXJuOlxuICAgICAgICAgICAgICAgIGhvb2tzQXJyYXkgPSB0aGlzLmFmdGVyUmV0dXJuSG9va3M7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFkdmljZS5Bcm91bmQ6XG4gICAgICAgICAgICAgICAgaG9va3NBcnJheSA9IHRoaXMuYXJvdW5kSG9va3M7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhvb2tzQXJyYXkpIHtcbiAgICAgICAgICAgIGhvb2tzQXJyYXkucHVzaChob29rKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBleHRyYWN0KCkge1xuICAgICAgICBjb25zdCB7IGFyb3VuZEhvb2tzLCBiZWZvcmVIb29rcywgYWZ0ZXJIb29rcywgYWZ0ZXJSZXR1cm5Ib29rcywgZmluYWxseUhvb2tzLCB0aHJvd25Ib29rcyB9ID0gdGhpcztcbiAgICAgICAgY29uc3QgZm46IHR5cGVvZiB0aGlzLmZuID0gYXJvdW5kSG9va3MucmVkdWNlUmlnaHQoKHByZXYsIG5leHQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAodGhpczogYW55LCAuLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0LmNhbGwodGhpcywgcHJldiwgYXJncyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9LCB0aGlzLmZuKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0aGlzOiBhbnksIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgICAgICBiZWZvcmVIb29rcy5mb3JFYWNoKGhvb2sgPT4ge1xuICAgICAgICAgICAgICAgIGhvb2suY2FsbCh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgaW52b2tlID0gKG9uRXJyb3I6IChyZWFzb246IGFueSkgPT4gdm9pZCwgb25GaW5hbGx5OiAoKSA9PiB2b2lkLCBvbkFmdGVyOiAocmV0dXJuVmFsdWU6IGFueSkgPT4gYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJldHVyblZhbHVlOiBhbnk7XG4gICAgICAgICAgICAgICAgbGV0IGlzUHJvbWlzZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVyblZhbHVlID0gZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXR1cm5WYWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUHJvbWlzZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSA9IHJldHVyblZhbHVlLmNhdGNoKG9uRXJyb3IpLmZpbmFsbHkob25GaW5hbGx5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkZpbmFsbHkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaXNQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXR1cm5WYWx1ZS50aGVuKCh2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb25BZnRlcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvbkFmdGVyKHJldHVyblZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIGludm9rZShcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aHJvd25Ib29rcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvd25Ib29rcy5mb3JFYWNoKGhvb2sgPT4gaG9vay5jYWxsKHRoaXMsIGVycm9yLCBhcmdzKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBmaW5hbGx5SG9va3MuZm9yRWFjaChob29rID0+IGhvb2suY2FsbCh0aGlzLCBhcmdzKSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGFmdGVySG9va3MuZm9yRWFjaChob29rID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2suY2FsbCh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhZnRlclJldHVybkhvb2tzLnJlZHVjZSgocmV0VmFsLCBob29rKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaG9vay5jYWxsKHRoaXMsIHJldFZhbCwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH0sIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9O1xuICAgIH1cbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cbmltcG9ydCB0eXBlIHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi9BZHZpY2UnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQXNwZWN0LCBKb2luUG9pbnQsIFByb2NlZWRpbmdKb2luUG9pbnQgfSBmcm9tICcuL0FzcGVjdCc7XG5pbXBvcnQgeyBBc3BlY3RVdGlscyB9IGZyb20gJy4vQXNwZWN0VXRpbHMnO1xuaW1wb3J0IHsgQXNwZWN0SW5mbyB9IGZyb20gJy4vQXNwZWN0TWV0YWR0YSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBc3BlY3Q8VD4oXG4gICAgYXBwQ3R4OiBBcHBsaWNhdGlvbkNvbnRleHQsXG4gICAgdGFyZ2V0OiBULFxuICAgIG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCxcbiAgICBtZXRob2RGdW5jOiBGdW5jdGlvbixcbiAgICBhc3BlY3RzOiBBc3BlY3RJbmZvW11cbikge1xuICAgIGNvbnN0IGNyZWF0ZUFzcGVjdEN0eCA9IChhZHZpY2U6IEFkdmljZSwgYXJnczogYW55W10sIHJldHVyblZhbHVlOiBhbnkgPSBudWxsLCBlcnJvcjogYW55ID0gbnVsbCk6IEpvaW5Qb2ludCA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0YXJnZXQsXG4gICAgICAgICAgICBtZXRob2ROYW1lLFxuICAgICAgICAgICAgYXJndW1lbnRzOiBhcmdzLFxuICAgICAgICAgICAgcmV0dXJuVmFsdWUsXG4gICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgIGFkdmljZSxcbiAgICAgICAgICAgIGN0eDogYXBwQ3R4XG4gICAgICAgIH07XG4gICAgfTtcbiAgICBjb25zdCBhc3BlY3RVdGlscyA9IG5ldyBBc3BlY3RVdGlscyhtZXRob2RGdW5jIGFzICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTtcbiAgICBjb25zdCBDbGFzc1RvSW5zdGFuY2UgPSAoYXNwZWN0SW5mbzogQXNwZWN0SW5mbykgPT4gYXBwQ3R4LmdldEluc3RhbmNlKGFzcGVjdEluZm8uYXNwZWN0Q2xhc3MpIGFzIEFzcGVjdDtcbiAgICBjb25zdCB0YXJnZXRDb25zdHJ1Y3RvciA9ICh0YXJnZXQgYXMgb2JqZWN0KS5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPFQ+O1xuICAgIGNvbnN0IGFsbE1hdGNoQXNwZWN0cyA9IGFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LnBvaW50Y3V0LnRlc3QodGFyZ2V0Q29uc3RydWN0b3IsIG1ldGhvZE5hbWUpKTtcblxuICAgIGNvbnN0IGJlZm9yZUFkdmljZUFzcGVjdHMgPSBhbGxNYXRjaEFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LmFkdmljZSA9PT0gQWR2aWNlLkJlZm9yZSkubWFwKENsYXNzVG9JbnN0YW5jZSk7XG4gICAgY29uc3QgYWZ0ZXJBZHZpY2VBc3BlY3RzID0gYWxsTWF0Y2hBc3BlY3RzLmZpbHRlcihpdCA9PiBpdC5hZHZpY2UgPT09IEFkdmljZS5BZnRlcikubWFwKENsYXNzVG9JbnN0YW5jZSk7XG4gICAgY29uc3QgdHJ5Q2F0Y2hBZHZpY2VBc3BlY3RzID0gYWxsTWF0Y2hBc3BlY3RzLmZpbHRlcihpdCA9PiBpdC5hZHZpY2UgPT09IEFkdmljZS5UaHJvd24pLm1hcChDbGFzc1RvSW5zdGFuY2UpO1xuICAgIGNvbnN0IHRyeUZpbmFsbHlBZHZpY2VBc3BlY3RzID0gYWxsTWF0Y2hBc3BlY3RzLmZpbHRlcihpdCA9PiBpdC5hZHZpY2UgPT09IEFkdmljZS5GaW5hbGx5KS5tYXAoQ2xhc3NUb0luc3RhbmNlKTtcbiAgICBjb25zdCBhZnRlclJldHVybkFkdmljZUFzcGVjdHMgPSBhbGxNYXRjaEFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LmFkdmljZSA9PT0gQWR2aWNlLkFmdGVyUmV0dXJuKS5tYXAoQ2xhc3NUb0luc3RhbmNlKTtcbiAgICBjb25zdCBhcm91bmRBZHZpY2VBc3BlY3RzID0gYWxsTWF0Y2hBc3BlY3RzLmZpbHRlcihpdCA9PiBpdC5hZHZpY2UgPT09IEFkdmljZS5Bcm91bmQpLm1hcChDbGFzc1RvSW5zdGFuY2UpO1xuXG4gICAgaWYgKGJlZm9yZUFkdmljZUFzcGVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLkJlZm9yZSwgKGFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBqb2luUG9pbnQgPSBjcmVhdGVBc3BlY3RDdHgoQWR2aWNlLkJlZm9yZSwgYXJncyk7XG4gICAgICAgICAgICBiZWZvcmVBZHZpY2VBc3BlY3RzLmZvckVhY2goYXNwZWN0ID0+IHtcbiAgICAgICAgICAgICAgICBhc3BlY3QuZXhlY3V0ZShqb2luUG9pbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoYWZ0ZXJBZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXNwZWN0VXRpbHMuYXBwZW5kKEFkdmljZS5BZnRlciwgKGFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBqb2luUG9pbnQgPSBjcmVhdGVBc3BlY3RDdHgoQWR2aWNlLkFmdGVyLCBhcmdzKTtcbiAgICAgICAgICAgIGFmdGVyQWR2aWNlQXNwZWN0cy5mb3JFYWNoKGFzcGVjdCA9PiB7XG4gICAgICAgICAgICAgICAgYXNwZWN0LmV4ZWN1dGUoam9pblBvaW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHRyeUNhdGNoQWR2aWNlQXNwZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFzcGVjdFV0aWxzLmFwcGVuZChBZHZpY2UuVGhyb3duLCAoZXJyb3IsIGFyZ3MpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGpvaW5Qb2ludCA9IGNyZWF0ZUFzcGVjdEN0eChBZHZpY2UuVGhyb3duLCBhcmdzLCBudWxsLCBlcnJvcik7XG4gICAgICAgICAgICB0cnlDYXRjaEFkdmljZUFzcGVjdHMuZm9yRWFjaChhc3BlY3QgPT4ge1xuICAgICAgICAgICAgICAgIGFzcGVjdC5leGVjdXRlKGpvaW5Qb2ludCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRyeUZpbmFsbHlBZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXNwZWN0VXRpbHMuYXBwZW5kKEFkdmljZS5GaW5hbGx5LCAoYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGpvaW5Qb2ludCA9IGNyZWF0ZUFzcGVjdEN0eChBZHZpY2UuRmluYWxseSwgYXJncyk7XG4gICAgICAgICAgICB0cnlGaW5hbGx5QWR2aWNlQXNwZWN0cy5mb3JFYWNoKGFzcGVjdCA9PiB7XG4gICAgICAgICAgICAgICAgYXNwZWN0LmV4ZWN1dGUoam9pblBvaW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoYWZ0ZXJSZXR1cm5BZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXNwZWN0VXRpbHMuYXBwZW5kKEFkdmljZS5BZnRlclJldHVybiwgKHJldHVyblZhbHVlLCBhcmdzKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYWZ0ZXJSZXR1cm5BZHZpY2VBc3BlY3RzLnJlZHVjZSgocHJldlJldHVyblZhbHVlLCBhc3BlY3QpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBqb2luUG9pbnQgPSBjcmVhdGVBc3BlY3RDdHgoQWR2aWNlLkFmdGVyUmV0dXJuLCBhcmdzLCByZXR1cm5WYWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFzcGVjdC5leGVjdXRlKGpvaW5Qb2ludCk7XG4gICAgICAgICAgICB9LCByZXR1cm5WYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChhcm91bmRBZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXJvdW5kQWR2aWNlQXNwZWN0cy5mb3JFYWNoKGFzcGVjdCA9PiB7XG4gICAgICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLkFyb3VuZCwgKG9yaWdpbkZuLCBhcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgam9pblBvaW50ID0gY3JlYXRlQXNwZWN0Q3R4KEFkdmljZS5Bcm91bmQsIGFyZ3MsIG51bGwpIGFzIFByb2NlZWRpbmdKb2luUG9pbnQ7XG4gICAgICAgICAgICAgICAgam9pblBvaW50LnByb2NlZWQgPSAoanBBcmdzID0gYXJncykgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luRm4oanBBcmdzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBhc3BlY3QuZXhlY3V0ZShqb2luUG9pbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBhc3BlY3RVdGlscy5leHRyYWN0KCk7XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG5pbXBvcnQgeyBBc3BlY3QsIEpvaW5Qb2ludCB9IGZyb20gJy4vQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbXBvbmVudE1ldGhvZEFzcGVjdCBpbXBsZW1lbnRzIEFzcGVjdCB7XG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUoY2xheno6IE5ld2FibGU8dW5rbm93bj4sIG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCk6IE5ld2FibGU8QXNwZWN0PiB7XG4gICAgICAgIHJldHVybiBjbGFzcyBDb21wb25lbnRNZXRob2RBc3BlY3RJbXBsIGV4dGVuZHMgQ29tcG9uZW50TWV0aG9kQXNwZWN0IHtcbiAgICAgICAgICAgIGV4ZWN1dGUoanA6IEpvaW5Qb2ludCk6IGFueSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXNwZWN0SW5zdGFuY2UgPSBqcC5jdHguZ2V0SW5zdGFuY2UoY2xhenopIGFzIGFueTtcbiAgICAgICAgICAgICAgICBjb25zdCBmdW5jID0gYXNwZWN0SW5zdGFuY2VbbWV0aG9kTmFtZV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLmFzcGVjdEluc3RhbmNlLCBqcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIHByb3RlY3RlZCBhc3BlY3RJbnN0YW5jZSE6IGFueTtcbiAgICBhYnN0cmFjdCBleGVjdXRlKGN0eDogSm9pblBvaW50KTogYW55O1xufVxuIiwiaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IE1ldGFkYXRhLCBNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4uL3R5cGVzL01ldGFkYXRhJztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4vQWR2aWNlJztcbmltcG9ydCB7IENvbXBvbmVudE1ldGhvZEFzcGVjdCB9IGZyb20gJy4vQ29tcG9uZW50TWV0aG9kQXNwZWN0JztcbmltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi9Qb2ludGN1dCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXNwZWN0SW5mbyB7XG4gICAgYXNwZWN0Q2xhc3M6IE5ld2FibGU8dW5rbm93bj47XG4gICAgbWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sO1xuICAgIHBvaW50Y3V0OiBQb2ludGN1dDtcbiAgICBhZHZpY2U6IEFkdmljZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBc3BlY3RNZXRhZGF0YVJlYWRlciBleHRlbmRzIE1ldGFkYXRhUmVhZGVyIHtcbiAgICBnZXRBc3BlY3RzKGpwSWRlbnRpZmllcjogSWRlbnRpZmllciwganBNZW1iZXI6IHN0cmluZyB8IHN5bWJvbCk6IEFzcGVjdEluZm9bXTtcbn1cblxuZXhwb3J0IGNsYXNzIEFzcGVjdE1ldGFkYXRhIGltcGxlbWVudHMgTWV0YWRhdGE8QXNwZWN0TWV0YWRhdGFSZWFkZXIsIHZvaWQ+IHtcbiAgICBwcml2YXRlIHN0YXRpYyBJTlNUQU5DRSA9IG5ldyBBc3BlY3RNZXRhZGF0YSgpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgYXNwZWN0czogQXNwZWN0SW5mb1tdID0gW107XG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICAgICAgcmV0dXJuIEFzcGVjdE1ldGFkYXRhLklOU1RBTkNFO1xuICAgIH1cbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvL1xuICAgIH1cbiAgICBpbml0KCk6IHZvaWQge1xuICAgICAgICAvL1xuICAgIH1cbiAgICBhcHBlbmQoY29tcG9uZW50QXNwZWN0Q2xhc3M6IE5ld2FibGU8dW5rbm93bj4sIG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCwgYWR2aWNlOiBBZHZpY2UsIHBvaW50Y3V0OiBQb2ludGN1dCkge1xuICAgICAgICBjb25zdCBBc3BlY3RDbGFzcyA9IENvbXBvbmVudE1ldGhvZEFzcGVjdC5jcmVhdGUoY29tcG9uZW50QXNwZWN0Q2xhc3MsIG1ldGhvZE5hbWUpO1xuICAgICAgICB0aGlzLmFzcGVjdHMucHVzaCh7XG4gICAgICAgICAgICBhc3BlY3RDbGFzczogQXNwZWN0Q2xhc3MsXG4gICAgICAgICAgICBtZXRob2ROYW1lLFxuICAgICAgICAgICAgcG9pbnRjdXQsXG4gICAgICAgICAgICBhZHZpY2VcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlYWRlcigpOiBBc3BlY3RNZXRhZGF0YVJlYWRlciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXRBc3BlY3RzOiAoanBJZGVudGlmaWVyLCBqcE1lbWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzcGVjdHMuZmlsdGVyKCh7IHBvaW50Y3V0IH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBvaW50Y3V0LnRlc3QoanBJZGVudGlmaWVyLCBqcE1lbWJlcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiY29uc3QgUFJPWFlfVEFSR0VUX01BUCA9IG5ldyBXZWFrTWFwPG9iamVjdCwgb2JqZWN0PigpO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVjb3JkUHJveHlUYXJnZXQ8VCBleHRlbmRzIG9iamVjdD4ocHJveHk6IFQsIHRhcmdldDogVCk6IHZvaWQge1xuICAgIFBST1hZX1RBUkdFVF9NQVAuc2V0KHByb3h5LCB0YXJnZXQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJveHlUYXJnZXQ8VCBleHRlbmRzIG9iamVjdD4ocHJveHk6IFQpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gUFJPWFlfVEFSR0VUX01BUC5nZXQocHJveHkpIGFzIFQgfCB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Byb3h5T2Y8VCBleHRlbmRzIG9iamVjdD4ocHJveHk6IFQsIHRhcmdldDogVCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBQUk9YWV9UQVJHRVRfTUFQLmdldChwcm94eSkgPT09IHRhcmdldDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc1Byb3h5UmVjb3JkKG9iajogb2JqZWN0KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIFBST1hZX1RBUkdFVF9NQVAuaGFzKG9iaik7XG59XG4iLCJpbXBvcnQgeyBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yJztcbmltcG9ydCB0eXBlIHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHsgY3JlYXRlQXNwZWN0IH0gZnJvbSAnLi9jcmVhdGVBc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQXNwZWN0TWV0YWRhdGEgfSBmcm9tICcuL0FzcGVjdE1ldGFkdGEnO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgcmVjb3JkUHJveHlUYXJnZXQgfSBmcm9tICcuLi9jb21tb24vUHJveHlUYXJnZXRSZWNvcmRlcic7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3IgaW1wbGVtZW50cyBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yIHtcbiAgICBzdGF0aWMgY3JlYXRlKGFwcEN0eDogQXBwbGljYXRpb25Db250ZXh0KTogTmV3YWJsZTxBT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3I+IHtcbiAgICAgICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgQU9QSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yIHtcbiAgICAgICAgICAgIHByb3RlY3RlZCByZWFkb25seSBhcHBDdHg6IEFwcGxpY2F0aW9uQ29udGV4dCA9IGFwcEN0eDtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IGFwcEN0eDogQXBwbGljYXRpb25Db250ZXh0O1xuICAgIGFmdGVySW5zdGFudGlhdGlvbjxUIGV4dGVuZHMgb2JqZWN0PihpbnN0YW5jZTogVCk6IFQge1xuICAgICAgICBpZiAoIWluc3RhbmNlIHx8IHR5cGVvZiBpbnN0YW5jZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjbGF6eiA9IGluc3RhbmNlLmNvbnN0cnVjdG9yO1xuXG4gICAgICAgIGNvbnN0IGFzcGVjdE1ldGFkYXRhID0gQXNwZWN0TWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWFkZXIoKTtcbiAgICAgICAgLy8gY29uc3QgdXNlQXNwZWN0TWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShjbGF6eiwgQU9QQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgIC8vIGNvbnN0IHVzZUFzcGVjdE1ldGFkYXRhUmVhZGVyID0gdXNlQXNwZWN0TWV0YWRhdGEucmVhZGVyKCk7XG4gICAgICAgIC8vIGNvbnN0IHVzZUFzcGVjdHNNYXAgPSB1c2VBc3BlY3RNZXRhZGF0YVJlYWRlci5nZXRBc3BlY3RzKCk7XG4gICAgICAgIC8vIGlmICh1c2VBc3BlY3RzTWFwLnNpemUgPT09IDApIHtcbiAgICAgICAgLy8gICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIGNvbnN0IGFzcGVjdFN0b3JlTWFwID0gbmV3IFdlYWtNYXA8b2JqZWN0LCBNYXA8c3RyaW5nIHwgc3ltYm9sLCBGdW5jdGlvbj4+KCk7XG4gICAgICAgIGFzcGVjdFN0b3JlTWFwLnNldChpbnN0YW5jZSwgbmV3IE1hcDxzdHJpbmcgfCBzeW1ib2wsIEZ1bmN0aW9uPigpKTtcblxuICAgICAgICBjb25zdCBwcm94eVJlc3VsdCA9IG5ldyBQcm94eShpbnN0YW5jZSwge1xuICAgICAgICAgICAgZ2V0OiAodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpblZhbHVlID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcik7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChwcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NvbnN0cnVjdG9yJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5WYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCkgJiYgdHlwZW9mIG9yaWdpblZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzcGVjdE1hcCA9IGFzcGVjdFN0b3JlTWFwLmdldChpbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghYXNwZWN0TWFwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFzcGVjdE1hcC5oYXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhc3BlY3RNYXAuZ2V0KHByb3ApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzcGVjdHNPZk1ldGhvZCA9IGFzcGVjdE1ldGFkYXRhLmdldEFzcGVjdHMoY2xhenogYXMgSWRlbnRpZmllciwgcHJvcCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzcGVjdEZuID0gY3JlYXRlQXNwZWN0KHRoaXMuYXBwQ3R4LCB0YXJnZXQsIHByb3AsIG9yaWdpblZhbHVlLCBhc3BlY3RzT2ZNZXRob2QpO1xuICAgICAgICAgICAgICAgICAgICBhc3BlY3RNYXAuc2V0KHByb3AsIGFzcGVjdEZuKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFzcGVjdEZuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Rlc3QnKSB7XG4gICAgICAgICAgICByZWNvcmRQcm94eVRhcmdldChwcm94eVJlc3VsdCwgaW5zdGFuY2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHByb3h5UmVzdWx0O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEV2YWx1YXRvciB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRvcic7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5cbmV4cG9ydCBjbGFzcyBBcmd2RXZhbHVhdG9yIGltcGxlbWVudHMgRXZhbHVhdG9yIHtcbiAgICBldmFsPFQsIEEgPSBzdHJpbmdbXT4oY29udGV4dDogQXBwbGljYXRpb25Db250ZXh0LCBleHByZXNzaW9uOiBzdHJpbmcsIGFyZ3M/OiBBKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IGFyZ3YgPSBhcmdzIHx8IHByb2Nlc3MuYXJndjtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby12YXItcmVxdWlyZXNcbiAgICAgICAgY29uc3QgbWluaW1pc3QgPSByZXF1aXJlKCdtaW5pbWlzdCcpO1xuICAgICAgICBjb25zdCBtYXAgPSBtaW5pbWlzdChhcmd2KTtcbiAgICAgICAgcmV0dXJuIG1hcFtleHByZXNzaW9uXTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBFdmFsdWF0b3IgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0b3InO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuXG5leHBvcnQgY2xhc3MgRW52aXJvbm1lbnRFdmFsdWF0b3IgaW1wbGVtZW50cyBFdmFsdWF0b3Ige1xuICAgIGV2YWw8VD4oY29udGV4dDogQXBwbGljYXRpb25Db250ZXh0LCBleHByZXNzaW9uOiBzdHJpbmcpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHByb2Nlc3MuZW52W2V4cHJlc3Npb25dIGFzIFQgfCB1bmRlZmluZWQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgRXZhbHVhdG9yIH0gZnJvbSAnLi4vdHlwZXMvRXZhbHVhdG9yJztcbmltcG9ydCB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4uL2ZvdW5kYXRpb24vQXBwbGljYXRpb25Db250ZXh0JztcbmltcG9ydCB7IEpTT05EYXRhIH0gZnJvbSAnLi4vdHlwZXMvSlNPTkRhdGEnO1xuXG5leHBvcnQgY2xhc3MgSlNPTkRhdGFFdmFsdWF0b3IgaW1wbGVtZW50cyBFdmFsdWF0b3Ige1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbmFtZXNwYWNlRGF0YU1hcCA9IG5ldyBNYXA8c3RyaW5nLCBKU09ORGF0YT4oKTtcbiAgICBldmFsPFQ+KGNvbnRleHQ6IEFwcGxpY2F0aW9uQ29udGV4dCwgZXhwcmVzc2lvbjogc3RyaW5nKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IGNvbG9uSW5kZXggPSBleHByZXNzaW9uLmluZGV4T2YoJzonKTtcbiAgICAgICAgaWYgKGNvbG9uSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luY29ycmVjdCBleHByZXNzaW9uLCBuYW1lc3BhY2Ugbm90IHNwZWNpZmllZCcpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5hbWVzcGFjZSA9IGV4cHJlc3Npb24uc3Vic3RyaW5nKDAsIGNvbG9uSW5kZXgpO1xuICAgICAgICBjb25zdCBleHAgPSBleHByZXNzaW9uLnN1YnN0cmluZyhjb2xvbkluZGV4ICsgMSk7XG4gICAgICAgIGlmICghdGhpcy5uYW1lc3BhY2VEYXRhTWFwLmhhcyhuYW1lc3BhY2UpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEluY29ycmVjdCBleHByZXNzaW9uOiBuYW1lc3BhY2Ugbm90IHJlY29yZGVkOiBcIiR7bmFtZXNwYWNlfVwiYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMubmFtZXNwYWNlRGF0YU1hcC5nZXQobmFtZXNwYWNlKSBhcyBKU09ORGF0YTtcbiAgICAgICAgcmV0dXJuIHJ1bkV4cHJlc3Npb24oZXhwLCBkYXRhIGFzIE9iamVjdCk7XG4gICAgfVxuICAgIHJlY29yZERhdGEobmFtZXNwYWNlOiBzdHJpbmcsIGRhdGE6IEpTT05EYXRhKSB7XG4gICAgICAgIHRoaXMubmFtZXNwYWNlRGF0YU1hcC5zZXQobmFtZXNwYWNlLCBkYXRhKTtcbiAgICB9XG4gICAgZ2V0SlNPTkRhdGEobmFtZXNwYWNlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZXNwYWNlRGF0YU1hcC5nZXQobmFtZXNwYWNlKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJ1bkV4cHJlc3Npb24oZXhwcmVzc2lvbjogc3RyaW5nLCByb290Q29udGV4dDogT2JqZWN0KSB7XG4gICAgY29uc3QgZm4gPSBjb21waWxlRXhwcmVzc2lvbihleHByZXNzaW9uKTtcbiAgICByZXR1cm4gZm4ocm9vdENvbnRleHQpO1xufVxuXG5mdW5jdGlvbiBjb21waWxlRXhwcmVzc2lvbihleHByZXNzaW9uOiBzdHJpbmcpIHtcbiAgICBpZiAoZXhwcmVzc2lvbi5pbmRleE9mKCcsJykgPiAtMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEluY29ycmVjdCBleHByZXNzaW9uIHN5bnRheCwgVGhlICcsJyBpcyBub3QgYWxsb3dlZCBpbiBleHByZXNzaW9uOiBcIiR7ZXhwcmVzc2lvbn1cImApO1xuICAgIH1cbiAgICBpZiAoZXhwcmVzc2lvbi5sZW5ndGggPiAxMjApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYEluY29ycmVjdCBleHByZXNzaW9uIHN5bnRheCwgZXhwcmVzc2lvbiBsZW5ndGggY2Fubm90IGJlIGdyZWF0ZXIgdGhhbiAxMjAsIGJ1dCBhY3R1YWw6ICR7ZXhwcmVzc2lvbi5sZW5ndGh9YFxuICAgICAgICApO1xuICAgIH1cbiAgICBpZiAoL1xcKC4qP1xcKS8udGVzdChleHByZXNzaW9uKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEluY29ycmVjdCBleHByZXNzaW9uIHN5bnRheCwgcGFyZW50aGVzZXMgYXJlIG5vdCBhbGxvd2VkIGluIGV4cHJlc3Npb246IFwiJHtleHByZXNzaW9ufVwiYCk7XG4gICAgfVxuICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnRyaW0oKTtcbiAgICBpZiAoZXhwcmVzc2lvbiA9PT0gJycpIHtcbiAgICAgICAgcmV0dXJuIChyb290OiBPYmplY3QpID0+IHJvb3Q7XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdFZhck5hbWUgPSB2YXJOYW1lKCdjb250ZXh0Jyk7XG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbihcbiAgICAgICAgcm9vdFZhck5hbWUsXG4gICAgICAgIGBcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gJHtyb290VmFyTmFtZX0uJHtleHByZXNzaW9ufTtcbiAgICAgICAgfSBjYXRjaChlcnJvcikgeyB0aHJvdyBlcnJvciB9XG4gICAgYFxuICAgICk7XG59XG5sZXQgVkFSX1NFUVVFTkNFID0gRGF0ZS5ub3coKTtcbmZ1bmN0aW9uIHZhck5hbWUocHJlZml4OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gcHJlZml4ICsgJycgKyAoVkFSX1NFUVVFTkNFKyspLnRvU3RyaW5nKDE2KTtcbn1cbiIsImltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YSB9IGZyb20gJy4uL3R5cGVzL01ldGFkYXRhJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luc3RhbmNlU2NvcGUnO1xuXG5leHBvcnQgY29uc3QgRlVOQ1RJT05fTUVUQURBVEFfS0VZID0gU3ltYm9sKCdpb2M6ZnVuY3Rpb24tbWV0YWRhdGEnKTtcblxuZXhwb3J0IGludGVyZmFjZSBGdW5jdGlvbk1ldGFkYXRhUmVhZGVyIHtcbiAgICBnZXRQYXJhbWV0ZXJzKCk6IElkZW50aWZpZXJbXTtcbiAgICBpc0ZhY3RvcnkoKTogYm9vbGVhbjtcbiAgICBnZXRTY29wZSgpOiBJbnN0YW5jZVNjb3BlIHwgdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgY2xhc3MgRnVuY3Rpb25NZXRhZGF0YSBpbXBsZW1lbnRzIE1ldGFkYXRhPEZ1bmN0aW9uTWV0YWRhdGFSZWFkZXIsIEZ1bmN0aW9uPiB7XG4gICAgc3RhdGljIGdldFJlZmxlY3RLZXkoKSB7XG4gICAgICAgIHJldHVybiBGVU5DVElPTl9NRVRBREFUQV9LRVk7XG4gICAgfVxuICAgIHByaXZhdGUgcmVhZG9ubHkgcGFyYW1ldGVyczogSWRlbnRpZmllcltdID0gW107XG4gICAgcHJpdmF0ZSBzY29wZT86IEluc3RhbmNlU2NvcGU7XG4gICAgcHJpdmF0ZSBpc0ZhY3Rvcnk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBzZXRQYXJhbWV0ZXJUeXBlKGluZGV4OiBudW1iZXIsIHN5bWJvbDogSWRlbnRpZmllcikge1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnNbaW5kZXhdID0gc3ltYm9sO1xuICAgIH1cbiAgICBzZXRTY29wZShzY29wZTogSW5zdGFuY2VTY29wZSkge1xuICAgICAgICB0aGlzLnNjb3BlID0gc2NvcGU7XG4gICAgfVxuICAgIHNldElzRmFjdG9yeShpc0ZhY3Rvcnk6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5pc0ZhY3RvcnkgPSBpc0ZhY3Rvcnk7XG4gICAgfVxuICAgIGluaXQoKSB7XG4gICAgICAgIC8vIFBBU1M7XG4gICAgfVxuICAgIHJlYWRlcigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldFBhcmFtZXRlcnM6ICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJhbWV0ZXJzLnNsaWNlKDApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzRmFjdG9yeTogKCkgPT4gdGhpcy5pc0ZhY3RvcnksXG4gICAgICAgICAgICBnZXRTY29wZTogKCkgPT4gdGhpcy5zY29wZVxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsImxldCBpbnN0YW5jZVNlcmlhbE5vID0gLTE7XG5cbmV4cG9ydCBjbGFzcyBDb21wb25lbnRJbnN0YW5jZVdyYXBwZXIge1xuICAgIHB1YmxpYyByZWFkb25seSBzZXJpYWxObyA9ICsraW5zdGFuY2VTZXJpYWxObztcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBpbnN0YW5jZTogdW5rbm93bikge31cblxuICAgIHB1YmxpYyBjb21wYXJlVG8ob3RoZXI6IENvbXBvbmVudEluc3RhbmNlV3JhcHBlcik6IC0xIHwgMCB8IDEge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXJpYWxObyA+IG90aGVyLnNlcmlhbE5vID8gLTEgOiB0aGlzLnNlcmlhbE5vIDwgb3RoZXIuc2VyaWFsTm8gPyAxIDogMDtcbiAgICB9XG59XG4iLCJleHBvcnQgZW51bSBMaWZlY3ljbGUge1xuICAgIFBSRV9JTkpFQ1QgPSAnaW9jLXNjb3BlOnByZS1pbmplY3QnLFxuICAgIFBPU1RfSU5KRUNUID0gJ2lvYy1zY29wZTpwb3N0LWluamVjdCcsXG4gICAgUFJFX0RFU1RST1kgPSAnaW9jLXNjb3BlOnByZS1kZXN0cm95J1xufVxuIiwiaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZva2VQcmVEZXN0cm95KGluc3RhbmNlOiB1bmtub3duKSB7XG4gICAgY29uc3QgY2xhenogPSBpbnN0YW5jZT8uY29uc3RydWN0b3I7XG4gICAgaWYgKCFjbGF6eikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoY2xhenosIENsYXNzTWV0YWRhdGEpO1xuICAgIGNvbnN0IHByZURlc3Ryb3lNZXRob2RzID0gbWV0YWRhdGEuZ2V0TWV0aG9kcyhMaWZlY3ljbGUuUFJFX0RFU1RST1kpO1xuICAgIHByZURlc3Ryb3lNZXRob2RzLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IGNsYXp6LnByb3RvdHlwZVttZXRob2ROYW1lXTtcbiAgICAgICAgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIG1ldGhvZC5hcHBseShpbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbiIsImltcG9ydCB7IEdldEluc3RhbmNlT3B0aW9ucywgSW5zdGFuY2VSZXNvbHV0aW9uLCBTYXZlSW5zdGFuY2VPcHRpb25zIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IENvbXBvbmVudEluc3RhbmNlV3JhcHBlciB9IGZyb20gJy4uL2ZvdW5kYXRpb24vQ29tcG9uZW50SW5zdGFuY2VXcmFwcGVyJztcbmltcG9ydCB7IGludm9rZVByZURlc3Ryb3kgfSBmcm9tICcuLi9jb21tb24vaW52b2tlUHJlRGVzdHJveSc7XG5cbmV4cG9ydCBjbGFzcyBTaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24gaW1wbGVtZW50cyBJbnN0YW5jZVJlc29sdXRpb24ge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgSU5TVEFOQ0VfTUFQID0gbmV3IE1hcDxJZGVudGlmaWVyLCBDb21wb25lbnRJbnN0YW5jZVdyYXBwZXI+KCk7XG4gICAgZ2V0SW5zdGFuY2U8VCwgTz4ob3B0aW9uczogR2V0SW5zdGFuY2VPcHRpb25zPFQsIE8+KTogVCB7XG4gICAgICAgIHJldHVybiB0aGlzLklOU1RBTkNFX01BUC5nZXQob3B0aW9ucy5pZGVudGlmaWVyKT8uaW5zdGFuY2UgYXMgVDtcbiAgICB9XG5cbiAgICBzYXZlSW5zdGFuY2U8VCwgTz4ob3B0aW9uczogU2F2ZUluc3RhbmNlT3B0aW9uczxULCBPPik6IHZvaWQge1xuICAgICAgICB0aGlzLklOU1RBTkNFX01BUC5zZXQob3B0aW9ucy5pZGVudGlmaWVyLCBuZXcgQ29tcG9uZW50SW5zdGFuY2VXcmFwcGVyKG9wdGlvbnMuaW5zdGFuY2UpKTtcbiAgICB9XG5cbiAgICBzaG91bGRHZW5lcmF0ZTxULCBPPihvcHRpb25zOiBHZXRJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLklOU1RBTkNFX01BUC5oYXMob3B0aW9ucy5pZGVudGlmaWVyKTtcbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgY29uc3QgaW5zdGFuY2VXcmFwcGVycyA9IEFycmF5LmZyb20odGhpcy5JTlNUQU5DRV9NQVAudmFsdWVzKCkpO1xuICAgICAgICBpbnN0YW5jZVdyYXBwZXJzLnNvcnQoKGEsIGIpID0+IGEuY29tcGFyZVRvKGIpKTtcbiAgICAgICAgaW5zdGFuY2VXcmFwcGVycy5mb3JFYWNoKGluc3RhbmNlV3JhcHBlciA9PiB7XG4gICAgICAgICAgICBpbnZva2VQcmVEZXN0cm95KGluc3RhbmNlV3JhcHBlci5pbnN0YW5jZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLklOU1RBTkNFX01BUC5jbGVhcigpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEdldEluc3RhbmNlT3B0aW9ucywgSW5zdGFuY2VSZXNvbHV0aW9uLCBTYXZlSW5zdGFuY2VPcHRpb25zIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IFNpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbiB9IGZyb20gJy4vU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uJztcblxuY29uc3QgU0lOR0xFVE9OX0lOU1RBTkNFX1NJTkdMRVRPTiA9IG5ldyBTaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24oKTtcblxuZXhwb3J0IGNsYXNzIEdsb2JhbFNoYXJlZEluc3RhbmNlUmVzb2x1dGlvbiBpbXBsZW1lbnRzIEluc3RhbmNlUmVzb2x1dGlvbiB7XG4gICAgZ2V0SW5zdGFuY2U8VCwgTz4ob3B0aW9uczogR2V0SW5zdGFuY2VPcHRpb25zPFQsIE8+KTogVCB7XG4gICAgICAgIHJldHVybiBTSU5HTEVUT05fSU5TVEFOQ0VfU0lOR0xFVE9OLmdldEluc3RhbmNlKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHNhdmVJbnN0YW5jZTxULCBPPihvcHRpb25zOiBTYXZlSW5zdGFuY2VPcHRpb25zPFQsIE8+KTogdm9pZCB7XG4gICAgICAgIFNJTkdMRVRPTl9JTlNUQU5DRV9TSU5HTEVUT04uc2F2ZUluc3RhbmNlKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHNob3VsZEdlbmVyYXRlPFQsIE8+KG9wdGlvbnM6IEdldEluc3RhbmNlT3B0aW9uczxULCBPPik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gU0lOR0xFVE9OX0lOU1RBTkNFX1NJTkdMRVRPTi5zaG91bGRHZW5lcmF0ZShvcHRpb25zKTtcbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgLy8gUEFTUztcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJbnN0YW5jZVJlc29sdXRpb24sIFNhdmVJbnN0YW5jZU9wdGlvbnMgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZVJlc29sdXRpb24nO1xuaW1wb3J0IHsgaW52b2tlUHJlRGVzdHJveSB9IGZyb20gJy4uL2NvbW1vbi9pbnZva2VQcmVEZXN0cm95JztcblxuZXhwb3J0IGNsYXNzIFRyYW5zaWVudEluc3RhbmNlUmVzb2x1dGlvbiBpbXBsZW1lbnRzIEluc3RhbmNlUmVzb2x1dGlvbiB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBpbnN0YW5jZXMgPSBuZXcgU2V0PHVua25vd24+KCk7XG4gICAgc2hvdWxkR2VuZXJhdGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGdldEluc3RhbmNlPFQ+KCk6IFQgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2F2ZUluc3RhbmNlPFQsIE8+KG9wdGlvbnM6IFNhdmVJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZXMuYWRkKG9wdGlvbnMuaW5zdGFuY2UpO1xuICAgIH1cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLmluc3RhbmNlcy5mb3JFYWNoKGl0ID0+IHtcbiAgICAgICAgICAgIGlmICghaXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbnZva2VQcmVEZXN0cm95KGl0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaW5zdGFuY2VzLmNsZWFyKCk7XG4gICAgfVxuICAgIGRlc3Ryb3lUaGF0PFQ+KGluc3RhbmNlOiBUKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5pbnN0YW5jZXMuaGFzKGluc3RhbmNlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGludm9rZVByZURlc3Ryb3koaW5zdGFuY2UpO1xuICAgICAgICB0aGlzLmluc3RhbmNlcy5kZWxldGUoaW5zdGFuY2UpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEsIENsYXNzTWV0YWRhdGFSZWFkZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgTGlmZWN5Y2xlIH0gZnJvbSAnLi9MaWZlY3ljbGUnO1xuaW1wb3J0IHsgSW5zdGFuY2UgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZSc7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5cbmV4cG9ydCBjbGFzcyBMaWZlY3ljbGVNYW5hZ2VyPFQgPSB1bmtub3duPiB7XG4gICAgcHJpdmF0ZSBjbGFzc01ldGFkYXRhUmVhZGVyOiBDbGFzc01ldGFkYXRhUmVhZGVyPFQ+O1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY29tcG9uZW50Q2xhc3M6IE5ld2FibGU8VD4sIHByaXZhdGUgcmVhZG9ubHkgY29udGFpbmVyOiBBcHBsaWNhdGlvbkNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5jbGFzc01ldGFkYXRhUmVhZGVyID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGhpcy5jb21wb25lbnRDbGFzcywgQ2xhc3NNZXRhZGF0YSkucmVhZGVyKCk7XG4gICAgfVxuICAgIGludm9rZVByZUluamVjdE1ldGhvZChpbnN0YW5jZTogSW5zdGFuY2U8VD4pIHtcbiAgICAgICAgY29uc3QgbWV0aG9kcyA9IHRoaXMuY2xhc3NNZXRhZGF0YVJlYWRlci5nZXRNZXRob2RzKExpZmVjeWNsZS5QUkVfSU5KRUNUKTtcbiAgICAgICAgdGhpcy5pbnZva2VMaWZlY3ljbGVNZXRob2RzKGluc3RhbmNlLCBtZXRob2RzKTtcbiAgICB9XG4gICAgaW52b2tlUG9zdEluamVjdE1ldGhvZChpbnN0YW5jZTogSW5zdGFuY2U8VD4pIHtcbiAgICAgICAgY29uc3QgbWV0aG9kcyA9IHRoaXMuY2xhc3NNZXRhZGF0YVJlYWRlci5nZXRNZXRob2RzKExpZmVjeWNsZS5QT1NUX0lOSkVDVCk7XG4gICAgICAgIHRoaXMuaW52b2tlTGlmZWN5Y2xlTWV0aG9kcyhpbnN0YW5jZSwgbWV0aG9kcyk7XG4gICAgfVxuICAgIGludm9rZVByZURlc3Ryb3lJbmplY3RNZXRob2QoaW5zdGFuY2U6IEluc3RhbmNlPFQ+KSB7XG4gICAgICAgIGNvbnN0IG1ldGhvZHMgPSB0aGlzLmNsYXNzTWV0YWRhdGFSZWFkZXIuZ2V0TWV0aG9kcyhMaWZlY3ljbGUuUFJFX0RFU1RST1kpO1xuICAgICAgICB0aGlzLmludm9rZUxpZmVjeWNsZU1ldGhvZHMoaW5zdGFuY2UsIG1ldGhvZHMpO1xuICAgIH1cbiAgICBwcml2YXRlIGludm9rZUxpZmVjeWNsZU1ldGhvZHMoaW5zdGFuY2U6IEluc3RhbmNlPFQ+LCBtZXRob2RLZXlzOiBBcnJheTxzdHJpbmcgfCBzeW1ib2w+KSB7XG4gICAgICAgIG1ldGhvZEtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW52b2tlKGluc3RhbmNlW2tleV0sIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0OiBpbnN0YW5jZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEsIENsYXNzTWV0YWRhdGFSZWFkZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4vQXBwbGljYXRpb25Db250ZXh0JztcbmltcG9ydCB7IEluc3RhbmNlIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2UnO1xuaW1wb3J0IHsgU2VydmljZUZhY3RvcnlEZWYgfSBmcm9tICcuL1NlcnZpY2VGYWN0b3J5RGVmJztcbmltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuaW1wb3J0IHsgbGF6eVByb3AgfSBmcm9tICdAdmdlcmJvdC9sYXp5JztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlciB9IGZyb20gJy4vSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlcic7XG5pbXBvcnQgeyBMaWZlY3ljbGVNYW5hZ2VyIH0gZnJvbSAnLi9MaWZlY3ljbGVNYW5hZ2VyJztcbmltcG9ydCB7IEZhY3RvcnlSZWNvcmRlciB9IGZyb20gJy4uL2NvbW1vbi9GYWN0b3J5UmVjb3JkZXInO1xuaW1wb3J0IHsgQW55RnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcy9BbnlGdW5jdGlvbic7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4uL3R5cGVzL1NlcnZpY2VGYWN0b3J5JztcblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudEluc3RhbmNlQnVpbGRlcjxUPiB7XG4gICAgcHJpdmF0ZSBnZXRDb25zdHJ1Y3RvckFyZ3M6ICgpID0+IHVua25vd25bXSA9ICgpID0+IFtdO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcHJvcGVydHlGYWN0b3JpZXMgPSBuZXcgRmFjdG9yeVJlY29yZGVyKCk7XG4gICAgcHJpdmF0ZSBsYXp5TW9kZTogYm9vbGVhbiA9IHRydWU7XG4gICAgcHJpdmF0ZSByZWFkb25seSBsaWZlY3ljbGVSZXNvbHZlcjogTGlmZWN5Y2xlTWFuYWdlcjxUPjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNsYXNzTWV0YWRhdGFSZWFkZXI6IENsYXNzTWV0YWRhdGFSZWFkZXI8VD47XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY29tcG9uZW50Q2xhc3M6IE5ld2FibGU8VD4sXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY29udGFpbmVyOiBBcHBsaWNhdGlvbkNvbnRleHQsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlcjogSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlclxuICAgICkge1xuICAgICAgICB0aGlzLmxpZmVjeWNsZVJlc29sdmVyID0gbmV3IExpZmVjeWNsZU1hbmFnZXI8VD4oY29tcG9uZW50Q2xhc3MsIGNvbnRhaW5lcik7XG4gICAgICAgIGNvbnN0IHJlYWRlciA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGNvbXBvbmVudENsYXNzLCBDbGFzc01ldGFkYXRhKS5yZWFkZXIoKTtcbiAgICAgICAgdGhpcy5jbGFzc01ldGFkYXRhUmVhZGVyID0gcmVhZGVyO1xuICAgICAgICB0aGlzLmFwcGVuZENsYXNzTWV0YWRhdGEocmVhZGVyKTtcbiAgICB9XG4gICAgYXBwZW5kTGF6eU1vZGUobGF6eU1vZGU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5sYXp5TW9kZSA9IGxhenlNb2RlO1xuICAgIH1cbiAgICBwcml2YXRlIGFwcGVuZENsYXNzTWV0YWRhdGE8VD4oY2xhc3NNZXRhZGF0YVJlYWRlcjogQ2xhc3NNZXRhZGF0YVJlYWRlcjxUPikge1xuICAgICAgICBjb25zdCB0eXBlcyA9IGNsYXNzTWV0YWRhdGFSZWFkZXIuZ2V0Q29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlcygpO1xuICAgICAgICB0aGlzLmdldENvbnN0cnVjdG9yQXJncyA9ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlcy5tYXAoaXQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRhaW5lci5nZXRJbnN0YW5jZShpdC5pc05ld2FibGUgPyBpdC5jbGF6eiA6IGl0LmlkZW50aWZpZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGdsb2JhbE1ldGFkYXRhUmVhZGVyID0gR2xvYmFsTWV0YWRhdGEuZ2V0UmVhZGVyKCk7XG4gICAgICAgIGNvbnN0IHByb3BlcnR5VHlwZXMgPSBjbGFzc01ldGFkYXRhUmVhZGVyLmdldFByb3BlcnR5VHlwZU1hcCgpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VHlwZV0gb2YgcHJvcGVydHlUeXBlcykge1xuICAgICAgICAgICAgaWYgKHByb3BlcnR5VHlwZS5pc05ld2FibGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5RmFjdG9yaWVzLmFwcGVuZChwcm9wZXJ0eU5hbWUsIChjb250YWluZXIsIG93bmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiBjb250YWluZXIuZ2V0SW5zdGFuY2UocHJvcGVydHlUeXBlLmNsYXp6LCBvd25lcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpZGVudGlmaWVyID0gcHJvcGVydHlUeXBlLmlkZW50aWZpZXIgYXMgRXhjbHVkZTxJZGVudGlmaWVyLCBOZXdhYmxlPHVua25vd24+PjtcbiAgICAgICAgICAgIGNvbnN0IGZhY3RvcnlEZWYgPSB0aGlzLmNvbnRhaW5lci5nZXRGYWN0b3J5KGlkZW50aWZpZXIpO1xuICAgICAgICAgICAgaWYgKGZhY3RvcnlEZWYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5RmFjdG9yaWVzLnNldChwcm9wZXJ0eU5hbWUsIGZhY3RvcnlEZWYpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcHJvcGVydHlDbGFzc01ldGFkYXRhID0gZ2xvYmFsTWV0YWRhdGFSZWFkZXIuZ2V0Q2xhc3NNZXRhZGF0YShpZGVudGlmaWVyKTtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eUNsYXNzTWV0YWRhdGEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5RmFjdG9yaWVzLnNldChwcm9wZXJ0eU5hbWUsIFNlcnZpY2VGYWN0b3J5RGVmLmNyZWF0ZUZyb21DbGFzc01ldGFkYXRhKHByb3BlcnR5Q2xhc3NNZXRhZGF0YSkpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcHJvcGVydHlGYWN0b3J5RGVmID0gZ2xvYmFsTWV0YWRhdGFSZWFkZXIuZ2V0Q29tcG9uZW50RmFjdG9yeShpZGVudGlmaWVyKTtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eUZhY3RvcnlEZWYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5RmFjdG9yaWVzLnNldChwcm9wZXJ0eU5hbWUsIHByb3BlcnR5RmFjdG9yeURlZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgYnVpbGQoKSB7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmdldENvbnN0cnVjdG9yQXJncygpO1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gdGhpcy5jcmVhdGVQcm9wZXJ0aWVzR2V0dGVyQnVpbGRlcigpO1xuICAgICAgICBjb25zdCBpc0NyZWF0aW5nSW5zdEF3YXJlUHJvY2Vzc29yID0gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyLmlzSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3ModGhpcy5jb21wb25lbnRDbGFzcyk7XG4gICAgICAgIGlmIChpc0NyZWF0aW5nSW5zdEF3YXJlUHJvY2Vzc29yKSB7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyB0aGlzLmNvbXBvbmVudENsYXNzKC4uLmFyZ3MpIGFzIEluc3RhbmNlPFQ+O1xuICAgICAgICAgICAgdGhpcy5saWZlY3ljbGVSZXNvbHZlci5pbnZva2VQcmVJbmplY3RNZXRob2QoaW5zdGFuY2UpO1xuICAgICAgICAgICAgZGVmaW5lUHJvcGVydGllcy5jYWxsKHRoaXMsIGluc3RhbmNlKTtcbiAgICAgICAgICAgIHRoaXMubGlmZWN5Y2xlUmVzb2x2ZXIuaW52b2tlUG9zdEluamVjdE1ldGhvZChpbnN0YW5jZSk7XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgaW5zdGFuY2U6IHVuZGVmaW5lZCB8IEluc3RhbmNlPFQ+ID0gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyLmJlZm9yZUluc3RhbnRpYXRpb24odGhpcy5jb21wb25lbnRDbGFzcywgYXJncyk7XG4gICAgICAgICAgICBpZiAoIWluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2UgPSBuZXcgdGhpcy5jb21wb25lbnRDbGFzcyguLi5hcmdzKSBhcyBJbnN0YW5jZTxUPjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubGlmZWN5Y2xlUmVzb2x2ZXIuaW52b2tlUHJlSW5qZWN0TWV0aG9kKGluc3RhbmNlKTtcbiAgICAgICAgICAgIGRlZmluZVByb3BlcnRpZXMuY2FsbCh0aGlzLCBpbnN0YW5jZSk7XG4gICAgICAgICAgICBpbnN0YW5jZSA9IHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5hZnRlckluc3RhbnRpYXRpb24oaW5zdGFuY2UpO1xuICAgICAgICAgICAgdGhpcy5saWZlY3ljbGVSZXNvbHZlci5pbnZva2VQb3N0SW5qZWN0TWV0aG9kKGluc3RhbmNlKTtcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGhpczogQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyPFQ+LCBpbnN0YW5jZTogSW5zdGFuY2U8VD4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdldHRlciA9IHZhbHVlKGluc3RhbmNlIGFzIFQpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVmaW5lUHJvcGVydHkoaW5zdGFuY2UsIHR5cGVvZiBrZXkgPT09ICdudW1iZXInID8ga2V5ICsgJycgOiBrZXksIGdldHRlcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGRlZmluZVByb3BlcnR5PFQsIFY+KGluc3RhbmNlOiBULCBrZXk6IHN0cmluZyB8IHN5bWJvbCwgZ2V0dGVyOiAoKSA9PiBWKSB7XG4gICAgICAgIGlmICh0aGlzLmxhenlNb2RlKSB7XG4gICAgICAgICAgICBsYXp5UHJvcChpbnN0YW5jZSwga2V5LCBnZXR0ZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgaW5zdGFuY2Vba2V5XSA9IGdldHRlcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgY3JlYXRlUHJvcGVydGllc0dldHRlckJ1aWxkZXIoKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBNYXA8a2V5b2YgVCwgKGluc3RhbmNlOiBUKSA9PiAoKSA9PiB1bmtub3duIHwgdW5rbm93bltdPigpO1xuICAgICAgICBjb25zdCBwcm9wZXJ0eVR5cGVNYXAgPSB0aGlzLmNsYXNzTWV0YWRhdGFSZWFkZXIuZ2V0UHJvcGVydHlUeXBlTWFwKCk7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgZmFjdG9yeURlZl0gb2YgdGhpcy5wcm9wZXJ0eUZhY3Rvcmllcy5pdGVyYXRvcigpKSB7XG4gICAgICAgICAgICBjb25zdCBpbmplY3Rpb25UeXBlID0gcHJvcGVydHlUeXBlTWFwLmdldChrZXkpITtcbiAgICAgICAgICAgIGNvbnN0IGlzQXJyYXkgPSAhaW5qZWN0aW9uVHlwZS5pc05ld2FibGUgJiYgaW5qZWN0aW9uVHlwZS5jbGF6eiA9PT0gKEFycmF5IGFzIHVua25vd24gYXMgTmV3YWJsZTx1bmtub3duPik7XG4gICAgICAgICAgICBpZiAoIWlzQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmFjdG9yeURlZi5mYWN0b3JpZXMuc2l6ZSA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgICAgICAgICAgICAgICAgICAgIGBNdWx0aXBsZSBtYXRjaGluZyBpbmplY3RhYmxlcyBmb3VuZCBmb3IgcHJvcGVydHkgaW5qZWN0aW9uLFxcbmJ1dCBwcm9wZXJ0eSAke2tleS50b1N0cmluZygpfSBpcyBub3QgYW4gYXJyYXksXG4gICAgICAgICAgICAgICAgICAgICAgICBJdCBpcyBhbWJpZ3VvdXMgdG8gZGV0ZXJtaW5lIHdoaWNoIG9iamVjdCBzaG91bGQgYmUgaW5qZWN0ZWQhYFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBbZmFjdG9yeSwgaW5qZWN0aW9uc10gPSBmYWN0b3J5RGVmLmZhY3Rvcmllcy5lbnRyaWVzKCkubmV4dCgpLnZhbHVlIGFzIFtcbiAgICAgICAgICAgICAgICAgICAgU2VydmljZUZhY3Rvcnk8dW5rbm93biwgdW5rbm93bj4sXG4gICAgICAgICAgICAgICAgICAgIElkZW50aWZpZXJbXVxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgcmVzdWx0LnNldChrZXkgYXMga2V5b2YgVCwgPFQ+KGluc3RhbmNlOiBUKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2R1Y2VyID0gZmFjdG9yeSh0aGlzLmNvbnRhaW5lciwgaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGFpbmVyLmludm9rZShwcm9kdWNlciwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluamVjdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuc2V0KGtleSBhcyBrZXlvZiBULCA8VD4oaW5zdGFuY2U6IFQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvZHVjZXJBbmRJbmplY3Rpb25zID0gQXJyYXkuZnJvbShmYWN0b3J5RGVmLmZhY3RvcmllcykubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgKFtmYWN0b3J5LCBpbmplY3Rpb25zXSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZmFjdG9yeSh0aGlzLmNvbnRhaW5lciwgaW5zdGFuY2UpLCBpbmplY3Rpb25zXSBhcyBbQW55RnVuY3Rpb248dW5rbm93bj4sIElkZW50aWZpZXJbXV1cbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2R1Y2VyQW5kSW5qZWN0aW9ucy5tYXAoKFtwcm9kdWNlciwgaW5qZWN0aW9uc10pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb250YWluZXIuaW52b2tlKHByb2R1Y2VyLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluamVjdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQW55RnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcy9BbnlGdW5jdGlvbic7XG5cbmV4cG9ydCB0eXBlIEV2ZW50TGlzdGVuZXIgPSBBbnlGdW5jdGlvbjtcbmV4cG9ydCBjbGFzcyBFdmVudEVtaXR0ZXIge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZXZlbnRzID0gbmV3IE1hcDxzdHJpbmcgfCBzeW1ib2wsIEV2ZW50TGlzdGVuZXJbXT4oKTtcblxuICAgIG9uKHR5cGU6IHN0cmluZyB8IHN5bWJvbCwgbGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgbGV0IGxpc3RlbmVycyA9IHRoaXMuZXZlbnRzLmdldCh0eXBlKTtcbiAgICAgICAgaWYgKGxpc3RlbmVycykge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpc3RlbmVycyA9IFtsaXN0ZW5lcl07XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5zZXQodHlwZSwgbGlzdGVuZXJzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbHMgPSBsaXN0ZW5lcnMgYXMgRXZlbnRMaXN0ZW5lcltdO1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBscy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgbHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgZW1pdCh0eXBlOiBzdHJpbmcgfCBzeW1ib2wsIC4uLmFyZ3M6IHVua25vd25bXSkge1xuICAgICAgICB0aGlzLmV2ZW50cy5nZXQodHlwZSk/LmZvckVhY2goZm4gPT4ge1xuICAgICAgICAgICAgZm4oLi4uYXJncyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3NvciwgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL3R5cGVzL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcic7XG5pbXBvcnQgeyBsYXp5TWVtYmVyIH0gZnJvbSAnQHZnZXJib3QvbGF6eSc7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlJztcbmltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuXG5leHBvcnQgY2xhc3MgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlciB7XG4gICAgcHJpdmF0ZSBpbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzOiBTZXQ8TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPj4gPSBuZXcgU2V0KCk7XG4gICAgQGxhenlNZW1iZXI8SW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlciwga2V5b2YgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlciwgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvcltdPih7XG4gICAgICAgIGV2YWx1YXRlOiBpbnN0YW5jZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBnbG9iYWxJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzID0gR2xvYmFsTWV0YWRhdGEuZ2V0UmVhZGVyKCkuZ2V0SW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcygpO1xuICAgICAgICAgICAgY29uc3QgaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcyA9IGdsb2JhbEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuY29uY2F0KFxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oaW5zdGFuY2UuaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcylcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3Nlcy5tYXAoaXQgPT4gaW5zdGFuY2UuY29udGFpbmVyLmdldEluc3RhbmNlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3IsIHZvaWQ+KGl0KSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlc2V0Qnk6IFtcbiAgICAgICAgICAgIGluc3RhbmNlID0+IGluc3RhbmNlLmluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuc2l6ZSxcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBnbG9iYWxJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzID0gR2xvYmFsTWV0YWRhdGEuZ2V0UmVhZGVyKCkuZ2V0SW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcygpO1xuICAgICAgICAgICAgICAgIHJldHVybiBnbG9iYWxJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH0pXG4gICAgcHJpdmF0ZSBpbnN0QXdhcmVQcm9jZXNzb3JJbnN0YW5jZXMhOiBBcnJheTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY29udGFpbmVyOiBBcHBsaWNhdGlvbkNvbnRleHQpIHt9XG4gICAgYXBwZW5kSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3M6IE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4pIHtcbiAgICAgICAgdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLmFkZChpbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyk7XG4gICAgfVxuICAgIGFwcGVuZEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoXG4gICAgICAgIGluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXM6IFNldDxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+PiB8IEFycmF5PE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4+XG4gICAgKSB7XG4gICAgICAgIGluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuZm9yRWFjaChpdCA9PiB7XG4gICAgICAgICAgICB0aGlzLmluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuYWRkKGl0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGJlZm9yZUluc3RhbnRpYXRpb248VD4oY29tcG9uZW50Q2xhc3M6IE5ld2FibGU8VD4sIGFyZ3M6IHVua25vd25bXSkge1xuICAgICAgICBjb25zdCBpbnN0QXdhcmVQcm9jZXNzb3JzID0gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JJbnN0YW5jZXM7XG4gICAgICAgIGxldCBpbnN0YW5jZTogdW5kZWZpbmVkIHwgSW5zdGFuY2U8VD47XG4gICAgICAgIGluc3RBd2FyZVByb2Nlc3NvcnMuc29tZShwcm9jZXNzb3IgPT4ge1xuICAgICAgICAgICAgaWYgKCFwcm9jZXNzb3IuYmVmb3JlSW5zdGFudGlhdGlvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluc3RhbmNlID0gcHJvY2Vzc29yLmJlZm9yZUluc3RhbnRpYXRpb248VD4oY29tcG9uZW50Q2xhc3MsIGFyZ3MpIGFzIEluc3RhbmNlPFQ+O1xuICAgICAgICAgICAgcmV0dXJuICEhaW5zdGFuY2U7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfVxuICAgIGFmdGVySW5zdGFudGlhdGlvbjxUPihpbnN0YW5jZTogSW5zdGFuY2U8VD4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29ySW5zdGFuY2VzLnJlZHVjZSgoaW5zdGFuY2UsIHByb2Nlc3NvcikgPT4ge1xuICAgICAgICAgICAgaWYgKHByb2Nlc3Nvci5hZnRlckluc3RhbnRpYXRpb24pIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBwcm9jZXNzb3IuYWZ0ZXJJbnN0YW50aWF0aW9uKGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICBpZiAoISFyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdCBhcyBJbnN0YW5jZTxUPjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIH0sIGluc3RhbmNlKTtcbiAgICB9XG4gICAgaXNJbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyhjbHM6IE5ld2FibGU8dW5rbm93bj4pIHtcbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IHRoaXMuZ2V0SW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcygpO1xuICAgICAgICByZXR1cm4gY2xhc3Nlcy5pbmRleE9mKGNscyBhcyBOZXdhYmxlPEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcj4pID4gLTE7XG4gICAgfVxuICAgIGdldEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoKSB7XG4gICAgICAgIGNvbnN0IGdsb2JhbEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlYWRlcigpLmdldEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoKTtcbiAgICAgICAgcmV0dXJuIGdsb2JhbEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuY29uY2F0KEFycmF5LmZyb20odGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuXG50eXBlIEludm9rZUZ1bmN0aW9uQXJncyA9IHtcbiAgICBhcmdzPzogdW5rbm93bltdO1xufTtcbnR5cGUgSW52b2tlRnVuY3Rpb25JbmplY3Rpb25zID0ge1xuICAgIGluamVjdGlvbnM6IElkZW50aWZpZXJbXTtcbn07XG5cbnR5cGUgSW52b2tlRnVuY3Rpb25CYXNpY09wdGlvbnM8VD4gPSB7XG4gICAgY29udGV4dD86IFQ7XG59O1xuXG5leHBvcnQgdHlwZSBJbnZva2VGdW5jdGlvbk9wdGlvbnM8VD4gPVxuICAgIHwgKEludm9rZUZ1bmN0aW9uQmFzaWNPcHRpb25zPFQ+ICYgSW52b2tlRnVuY3Rpb25BcmdzKVxuICAgIHwgKEludm9rZUZ1bmN0aW9uQmFzaWNPcHRpb25zPFQ+ICYgUGFydGlhbDxJbnZva2VGdW5jdGlvbkluamVjdGlvbnM+KTtcblxuZXhwb3J0IGZ1bmN0aW9uIGhhc0FyZ3M8VD4ob3B0aW9uczogSW52b2tlRnVuY3Rpb25PcHRpb25zPFQ+KTogb3B0aW9ucyBpcyBJbnZva2VGdW5jdGlvbkJhc2ljT3B0aW9uczxUPiAmIEludm9rZUZ1bmN0aW9uQXJncyB7XG4gICAgcmV0dXJuICdhcmdzJyBpbiBvcHRpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzSW5qZWN0aW9uczxUPihcbiAgICBvcHRpb25zOiBJbnZva2VGdW5jdGlvbk9wdGlvbnM8VD5cbik6IG9wdGlvbnMgaXMgSW52b2tlRnVuY3Rpb25CYXNpY09wdGlvbnM8VD4gJiBJbnZva2VGdW5jdGlvbkluamVjdGlvbnMge1xuICAgIHJldHVybiAnaW5qZWN0aW9ucycgaW4gb3B0aW9ucztcbn1cbiIsImltcG9ydCB7IEFPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL2FvcC9BT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3InO1xuaW1wb3J0IHsgRmFjdG9yeVJlY29yZGVyIH0gZnJvbSAnLi4vY29tbW9uL0ZhY3RvcnlSZWNvcmRlcic7XG5pbXBvcnQgeyBpc05vZGVKcyB9IGZyb20gJy4uL2NvbW1vbi9pc05vZGVKcyc7XG5pbXBvcnQgeyBBcmd2RXZhbHVhdG9yIH0gZnJvbSAnLi4vZXZhbHVhdG9yL0FyZ3ZFdmFsdWF0b3InO1xuaW1wb3J0IHsgRW52aXJvbm1lbnRFdmFsdWF0b3IgfSBmcm9tICcuLi9ldmFsdWF0b3IvRW52aXJvbm1lbnRFdmFsdWF0b3InO1xuaW1wb3J0IHsgSlNPTkRhdGFFdmFsdWF0b3IgfSBmcm9tICcuLi9ldmFsdWF0b3IvSlNPTkRhdGFFdmFsdWF0b3InO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSwgQ2xhc3NNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgRnVuY3Rpb25NZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0Z1bmN0aW9uTWV0YWRhdGEnO1xuaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9HbG9iYWxNZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IEdsb2JhbFNoYXJlZEluc3RhbmNlUmVzb2x1dGlvbiB9IGZyb20gJy4uL3Jlc29sdXRpb24vR2xvYmFsU2hhcmVkSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IFNpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbiB9IGZyb20gJy4uL3Jlc29sdXRpb24vU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IFRyYW5zaWVudEluc3RhbmNlUmVzb2x1dGlvbiB9IGZyb20gJy4uL3Jlc29sdXRpb24vVHJhbnNpZW50SW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IEFueUZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMvQW55RnVuY3Rpb24nO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0T3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzL0FwcGxpY2F0aW9uQ29udGV4dE9wdGlvbnMnO1xuaW1wb3J0IHsgRXZhbHVhdGlvbk9wdGlvbnMsIEV4cHJlc3Npb25UeXBlIH0gZnJvbSAnLi4vdHlwZXMvRXZhbHVhdGVPcHRpb25zJztcbmltcG9ydCB7IEV2YWx1YXRvciB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRvcic7XG5pbXBvcnQgeyBGYWN0b3J5SWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0ZhY3RvcnlJZGVudGlmaWVyJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IEluc3RhbmNlIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2UnO1xuaW1wb3J0IHsgSW5zdGFuY2VSZXNvbHV0aW9uIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3IgfSBmcm9tICcuLi90eXBlcy9JbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3InO1xuaW1wb3J0IHsgSlNPTkRhdGEgfSBmcm9tICcuLi90eXBlcy9KU09ORGF0YSc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4uL3R5cGVzL1NlcnZpY2VGYWN0b3J5JztcbmltcG9ydCB7IENvbXBvbmVudEluc3RhbmNlQnVpbGRlciB9IGZyb20gJy4vQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciwgRXZlbnRMaXN0ZW5lciB9IGZyb20gJy4vRXZlbnRFbWl0dGVyJztcbmltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuL0luc3RhbmNlU2NvcGUnO1xuaW1wb3J0IHsgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlciB9IGZyb20gJy4vSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlcic7XG5pbXBvcnQgeyBoYXNBcmdzLCBoYXNJbmplY3Rpb25zLCBJbnZva2VGdW5jdGlvbk9wdGlvbnMgfSBmcm9tICcuL0ludm9rZUZ1bmN0aW9uT3B0aW9ucyc7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBMaWZlY3ljbGVNYW5hZ2VyIH0gZnJvbSAnLi9MaWZlY3ljbGVNYW5hZ2VyJztcblxuY29uc3QgUFJFX0RFU1RST1lfRVZFTlRfS0VZID0gJ2NvbnRhaW5lcjpldmVudDpwcmUtZGVzdHJveSc7XG5jb25zdCBQUkVfREVTVFJPWV9USEFUX0VWRU5UX0tFWSA9ICdjb250YWluZXI6ZXZlbnQ6cHJlLWRlc3Ryb3ktdGhhdCc7XG5jb25zdCBJTlNUQU5DRV9QUkVfREVTVFJPWV9NRVRIT0QgPSBTeW1ib2woJ3NvbGlkaXVtOmluc3RhbmNlLXByZS1kZXN0cm95Jyk7XG5cbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbkNvbnRleHQge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcmVzb2x1dGlvbnMgPSBuZXcgTWFwPEluc3RhbmNlU2NvcGUgfCBzdHJpbmcsIEluc3RhbmNlUmVzb2x1dGlvbj4oKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIHByaXZhdGUgcmVhZG9ubHkgZmFjdG9yaWVzID0gbmV3IEZhY3RvcnlSZWNvcmRlcigpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZXZhbHVhdG9yQ2xhc3NlcyA9IG5ldyBNYXA8c3RyaW5nLCBOZXdhYmxlPEV2YWx1YXRvcj4+KCk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBldmVudEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBkZWZhdWx0U2NvcGU6IEluc3RhbmNlU2NvcGU7XG4gICAgcHJpdmF0ZSByZWFkb25seSBsYXp5TW9kZTogYm9vbGVhbjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXI6IEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXI7XG4gICAgcHJpdmF0ZSBpc0Rlc3Ryb3llZCA9IGZhbHNlO1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihvcHRpb25zOiBBcHBsaWNhdGlvbkNvbnRleHRPcHRpb25zID0ge30pIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0U2NvcGUgPSBvcHRpb25zLmRlZmF1bHRTY29wZSB8fCBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTjtcbiAgICAgICAgdGhpcy5sYXp5TW9kZSA9IG9wdGlvbnMubGF6eU1vZGUgPz8gdHJ1ZTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlckluc3RhbmNlU2NvcGVSZXNvbHV0aW9uKEluc3RhbmNlU2NvcGUuU0lOR0xFVE9OLCBTaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24pO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySW5zdGFuY2VTY29wZVJlc29sdXRpb24oSW5zdGFuY2VTY29wZS5HTE9CQUxfU0hBUkVEX1NJTkdMRVRPTiwgR2xvYmFsU2hhcmVkSW5zdGFuY2VSZXNvbHV0aW9uKTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlckluc3RhbmNlU2NvcGVSZXNvbHV0aW9uKEluc3RhbmNlU2NvcGUuVFJBTlNJRU5ULCBUcmFuc2llbnRJbnN0YW5jZVJlc29sdXRpb24pO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZhbHVhdG9yKEV4cHJlc3Npb25UeXBlLkpTT05fUEFUSCwgSlNPTkRhdGFFdmFsdWF0b3IpO1xuICAgICAgICBpZiAoaXNOb2RlSnMpIHtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFdmFsdWF0b3IoRXhwcmVzc2lvblR5cGUuRU5WLCBFbnZpcm9ubWVudEV2YWx1YXRvcik7XG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyRXZhbHVhdG9yKEV4cHJlc3Npb25UeXBlLkFSR1YsIEFyZ3ZFdmFsdWF0b3IpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlciA9IG5ldyBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyKHRoaXMpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySW5zdEF3YXJlUHJvY2Vzc29yKEFPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvci5jcmVhdGUodGhpcykpO1xuICAgIH1cbiAgICBnZXRJbnN0YW5jZTxULCBPPihzeW1ib2w6IE5ld2FibGU8VD4sIG93bmVyPzogTyk6IFQ7XG4gICAgZ2V0SW5zdGFuY2U8VCwgTz4oc3ltYm9sOiBJZGVudGlmaWVyPFQ+LCBvd25lcj86IE8pOiBUIHwgVFtdO1xuICAgIGdldEluc3RhbmNlPFQsIE8+KHN5bWJvbDogSWRlbnRpZmllcjxUPiwgb3duZXI/OiBPKTogVCB8IFRbXSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3ltYm9sID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygc3ltYm9sID09PSAnc3ltYm9sJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2VCeVN5bWJvbChzeW1ib2wsIG93bmVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW5jZUJ5Q2xhc3Moc3ltYm9sLCBvd25lcik7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0SW5zdGFuY2VCeVN5bWJvbDxULCBPPihzeW1ib2w6IHN0cmluZyB8IHN5bWJvbCwgb3duZXI/OiBPKTogVCB8IFRbXSB7XG4gICAgICAgIGNvbnN0IGZhY3RvcnlEZWYgPSB0aGlzLmdldEZhY3Rvcnkoc3ltYm9sKTtcbiAgICAgICAgaWYgKGZhY3RvcnlEZWYpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb2R1Y2VyID0gZmFjdG9yeURlZi5wcm9kdWNlKHRoaXMsIG93bmVyKTtcblxuICAgICAgICAgICAgY29uc3QgcmVzb2x1dGlvbiA9IHRoaXMuZ2V0U2Nyb3BlUmVzb2x1dGlvbkluc3RhbmNlKGZhY3RvcnlEZWYuc2NvcGUpITtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAhcmVzb2x1dGlvbi5zaG91bGRHZW5lcmF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6IHN5bWJvbCxcbiAgICAgICAgICAgICAgICAgICAgb3duZXJcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdXRpb24uZ2V0SW5zdGFuY2Uoe1xuICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiBzeW1ib2wsXG4gICAgICAgICAgICAgICAgICAgIG93bmVyXG4gICAgICAgICAgICAgICAgfSkgYXMgVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlcyA9IHByb2R1Y2VyKCkgYXMgVFtdO1xuXG4gICAgICAgICAgICBjb25zdCByZXN1bHRzID0gaW5zdGFuY2VzLm1hcChpdCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRhY2hQcmVEZXN0cm95SG9vayhpdCk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29uc3RyID0gaXQ/LmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc3RyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudENsYXNzID0gY29uc3RyIGFzIE5ld2FibGU8VD47XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc29sdmVyID0gbmV3IExpZmVjeWNsZU1hbmFnZXI8VD4oY29tcG9uZW50Q2xhc3MsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0luc3RBd2FyZVByb2Nlc3NvciA9IHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5pc0luc3RBd2FyZVByb2Nlc3NvckNsYXNzKGNvbXBvbmVudENsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZXIuaW52b2tlUHJlSW5qZWN0TWV0aG9kKGl0IGFzIEluc3RhbmNlPFQ+KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0luc3RBd2FyZVByb2Nlc3Nvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXQgPSB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuYWZ0ZXJJbnN0YW50aWF0aW9uKGl0IGFzIEluc3RhbmNlPFQ+KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlci5pbnZva2VQb3N0SW5qZWN0TWV0aG9kKGl0IGFzIEluc3RhbmNlPFQ+KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzb2x1dGlvbi5zYXZlSW5zdGFuY2Uoe1xuICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiBzeW1ib2wsXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlOiBpdFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBpdDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHMubGVuZ3RoID09PSAxID8gcmVzdWx0c1swXSA6IHJlc3VsdHM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjbGFzc01ldGFkYXRhID0gR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWFkZXIoKS5nZXRDbGFzc01ldGFkYXRhPFQ+KHN5bWJvbCk7XG4gICAgICAgICAgICBpZiAoIWNsYXNzTWV0YWRhdGEpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENsYXNzIGFsaWFzIG5vdCBmb3VuZDogJHtzeW1ib2wudG9TdHJpbmcoKX1gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2xhenogPSBjbGFzc01ldGFkYXRhLnJlYWRlcigpLmdldENsYXNzKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2VCeUNsYXNzKGNsYXp6LCBvd25lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRJbnN0YW5jZUJ5Q2xhc3M8VCwgTz4oY29tcG9uZW50Q2xhc3M6IE5ld2FibGU8VD4sIG93bmVyPzogTyk6IFQgfCBUW10ge1xuICAgICAgICBpZiAoY29tcG9uZW50Q2xhc3MgPT09IEFwcGxpY2F0aW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMgYXMgdW5rbm93biBhcyBUO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlYWRlciA9IENsYXNzTWV0YWRhdGEuZ2V0SW5zdGFuY2UoY29tcG9uZW50Q2xhc3MpLnJlYWRlcigpO1xuICAgICAgICBjb25zdCBzY29wZSA9IHJlYWRlci5nZXRTY29wZSgpO1xuICAgICAgICBjb25zdCByZXNvbHV0aW9uID0gKHRoaXMucmVzb2x1dGlvbnMuZ2V0KHNjb3BlID8/IHRoaXMuZGVmYXVsdFNjb3BlKSB8fFxuICAgICAgICAgICAgdGhpcy5yZXNvbHV0aW9ucy5nZXQodGhpcy5kZWZhdWx0U2NvcGUpKSBhcyBJbnN0YW5jZVJlc29sdXRpb247XG4gICAgICAgIGNvbnN0IGdldEluc3RhbmNlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGlkZW50aWZpZXI6IGNvbXBvbmVudENsYXNzLFxuICAgICAgICAgICAgb3duZXIsXG4gICAgICAgICAgICBvd25lclByb3BlcnR5S2V5OiB1bmRlZmluZWRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHJlc29sdXRpb24uc2hvdWxkR2VuZXJhdGUoZ2V0SW5zdGFuY2VPcHRpb25zKSkge1xuICAgICAgICAgICAgY29uc3QgYnVpbGRlciA9IHRoaXMuY3JlYXRlQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyKGNvbXBvbmVudENsYXNzKTtcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gYnVpbGRlci5idWlsZCgpO1xuICAgICAgICAgICAgY29uc3Qgc2F2ZUluc3RhbmNlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAuLi5nZXRJbnN0YW5jZU9wdGlvbnMsXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXNvbHV0aW9uLnNhdmVJbnN0YW5jZShzYXZlSW5zdGFuY2VPcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuYXR0YWNoUHJlRGVzdHJveUhvb2soaW5zdGFuY2UpO1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdXRpb24uZ2V0SW5zdGFuY2UoZ2V0SW5zdGFuY2VPcHRpb25zKSBhcyBUO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgYXR0YWNoUHJlRGVzdHJveUhvb2s8VD4oaW5zdGFuY2VzOiBUIHwgVFtdKSB7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlc0FycmF5ID0gQXJyYXkuaXNBcnJheShpbnN0YW5jZXMpID8gaW5zdGFuY2VzIDogW2luc3RhbmNlc107XG4gICAgICAgIGluc3RhbmNlc0FycmF5LmZvckVhY2goaXQgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBpdCBhcyBJbnN0YW5jZTxUPjtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5zdGFuY2UgIT09ICdvYmplY3QnIHx8IGluc3RhbmNlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFJlZmxlY3QuaGFzKGluc3RhbmNlLCBJTlNUQU5DRV9QUkVfREVTVFJPWV9NRVRIT0QpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY2xhenogPSBpbnN0YW5jZS5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgIGlmICghY2xhenopIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGluc3RhbmNlLmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcblxuICAgICAgICAgICAgbWV0YWRhdGEuYWRkTGlmZWN5Y2xlTWV0aG9kKElOU1RBTkNFX1BSRV9ERVNUUk9ZX01FVEhPRCwgTGlmZWN5Y2xlLlBSRV9ERVNUUk9ZKTtcbiAgICAgICAgICAgIFJlZmxlY3Quc2V0KGluc3RhbmNlLCBJTlNUQU5DRV9QUkVfREVTVFJPWV9NRVRIT0QsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KFBSRV9ERVNUUk9ZX0VWRU5UX0tFWSwgaW5zdGFuY2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZUNvbXBvbmVudEluc3RhbmNlQnVpbGRlcjxUPihjb21wb25lbnRDbGFzczogTmV3YWJsZTxUPikge1xuICAgICAgICBjb25zdCBidWlsZGVyID0gbmV3IENvbXBvbmVudEluc3RhbmNlQnVpbGRlcihjb21wb25lbnRDbGFzcywgdGhpcywgdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyKTtcbiAgICAgICAgYnVpbGRlci5hcHBlbmRMYXp5TW9kZSh0aGlzLmxhenlNb2RlKTtcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXI7XG4gICAgfVxuXG4gICAgZ2V0RmFjdG9yeShrZXk6IEZhY3RvcnlJZGVudGlmaWVyKSB7XG4gICAgICAgIGNvbnN0IGZhY3RvcnkgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlYWRlcigpLmdldENvbXBvbmVudEZhY3Rvcnkoa2V5KTtcbiAgICAgICAgaWYgKCFmYWN0b3J5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mYWN0b3JpZXMuZ2V0KGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfVxuICAgIGJpbmRGYWN0b3J5PFQ+KFxuICAgICAgICBzeW1ib2w6IEZhY3RvcnlJZGVudGlmaWVyLFxuICAgICAgICBmYWN0b3J5OiBTZXJ2aWNlRmFjdG9yeTxULCB1bmtub3duPixcbiAgICAgICAgaW5qZWN0aW9ucz86IElkZW50aWZpZXJbXSxcbiAgICAgICAgc2NvcGU6IEluc3RhbmNlU2NvcGUgPSBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTlxuICAgICkge1xuICAgICAgICB0aGlzLmZhY3Rvcmllcy5hcHBlbmQoc3ltYm9sLCBmYWN0b3J5LCBpbmplY3Rpb25zLCBzY29wZSk7XG4gICAgfVxuICAgIGludm9rZTxSLCBDdHg+KGZ1bmM6IEFueUZ1bmN0aW9uPFIsIEN0eD4sIG9wdGlvbnM6IEludm9rZUZ1bmN0aW9uT3B0aW9uczxDdHg+ID0ge30pOiBSIHtcbiAgICAgICAgbGV0IGZuOiBBbnlGdW5jdGlvbjxSPjtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBmbiA9IGZ1bmMuYmluZChvcHRpb25zLmNvbnRleHQgYXMgVGhpc1BhcmFtZXRlclR5cGU8dHlwZW9mIGZ1bmM+KSBhcyBBbnlGdW5jdGlvbjxSPjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZuID0gZnVuYyBhcyBBbnlGdW5jdGlvbjxSPjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGFzQXJncyhvcHRpb25zKSkge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMuYXJncyA/IGZuKC4uLm9wdGlvbnMuYXJncykgOiBmbigpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhcmdzSW5kZW50aWZpZXJzOiBJZGVudGlmaWVyW10gPSBbXTtcbiAgICAgICAgaWYgKGhhc0luamVjdGlvbnMob3B0aW9ucykpIHtcbiAgICAgICAgICAgIGFyZ3NJbmRlbnRpZmllcnMgPSBvcHRpb25zLmluamVjdGlvbnM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGZuLCBGdW5jdGlvbk1ldGFkYXRhKS5yZWFkZXIoKTtcbiAgICAgICAgICAgIGFyZ3NJbmRlbnRpZmllcnMgPSBtZXRhZGF0YS5nZXRQYXJhbWV0ZXJzKCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXJncyA9IGFyZ3NJbmRlbnRpZmllcnMubWFwKChpZGVudGlmaWVyLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEluc3RhbmNlKGlkZW50aWZpZXIpO1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW5zdGFuY2UpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNBcnJheVR5cGUgPSAoaWRlbnRpZmllciBhcyB1bmtub3duKSA9PT0gQXJyYXk7XG4gICAgICAgICAgICAgICAgaWYgKGlzQXJyYXlUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGluc3RhbmNlLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdWx0aXBsZSBtYXRjaGluZyBpbmplY3RhYmxlcyBmb3VuZCBmb3IgcGFyYW1ldGVyIGF0ICR7aW5kZXh9LmApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaW5zdGFuY2VbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYXJncy5sZW5ndGggPiAwID8gZm4oLi4uYXJncykgOiBmbigpO1xuICAgIH1cbiAgICBkZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5pc0Rlc3Ryb3llZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KFBSRV9ERVNUUk9ZX0VWRU5UX0tFWSk7XG4gICAgICAgIHRoaXMucmVzb2x1dGlvbnMuZm9yRWFjaChpdCA9PiB7XG4gICAgICAgICAgICBpdC5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBldmFsdWF0ZTxULCBPLCBBPihleHByZXNzaW9uOiBzdHJpbmcsIG9wdGlvbnM6IEV2YWx1YXRpb25PcHRpb25zPE8sIHN0cmluZywgQT4pOiBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc3QgZXZhbHVhdG9yQ2xhc3MgPSB0aGlzLmV2YWx1YXRvckNsYXNzZXMuZ2V0KG9wdGlvbnMudHlwZSk7XG4gICAgICAgIGlmICghZXZhbHVhdG9yQ2xhc3MpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFVua25vd24gZXZhbHVhdG9yIG5hbWU6ICR7b3B0aW9ucy50eXBlfWApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGV2YWx1YXRvciA9IHRoaXMuZ2V0SW5zdGFuY2UoZXZhbHVhdG9yQ2xhc3MpO1xuICAgICAgICByZXR1cm4gZXZhbHVhdG9yLmV2YWwodGhpcywgZXhwcmVzc2lvbiwgb3B0aW9ucy5leHRlcm5hbEFyZ3MpO1xuICAgIH1cbiAgICByZWNvcmRKU09ORGF0YShuYW1lc3BhY2U6IHN0cmluZywgZGF0YTogSlNPTkRhdGEpIHtcbiAgICAgICAgY29uc3QgZXZhbHVhdG9yID0gdGhpcy5nZXRJbnN0YW5jZShKU09ORGF0YUV2YWx1YXRvcik7XG4gICAgICAgIGV2YWx1YXRvci5yZWNvcmREYXRhKG5hbWVzcGFjZSwgZGF0YSk7XG4gICAgfVxuICAgIGdldEpTT05EYXRhKG5hbWVzcGFjZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGV2YWx1YXRvciA9IHRoaXMuZ2V0SW5zdGFuY2UoSlNPTkRhdGFFdmFsdWF0b3IpO1xuICAgICAgICByZXR1cm4gZXZhbHVhdG9yLmdldEpTT05EYXRhKG5hbWVzcGFjZSk7XG4gICAgfVxuICAgIGJpbmRJbnN0YW5jZTxUPihpZGVudGlmaWVyOiBzdHJpbmcgfCBzeW1ib2wsIGluc3RhbmNlOiBUKSB7XG4gICAgICAgIGNvbnN0IHJlc29sdXRpb24gPSB0aGlzLnJlc29sdXRpb25zLmdldChJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTik7XG4gICAgICAgIHJlc29sdXRpb24/LnNhdmVJbnN0YW5jZSh7XG4gICAgICAgICAgICBpZGVudGlmaWVyLFxuICAgICAgICAgICAgaW5zdGFuY2VcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlZ2lzdGVySW5zdGFuY2VTY29wZVJlc29sdXRpb248VCBleHRlbmRzIE5ld2FibGU8SW5zdGFuY2VSZXNvbHV0aW9uPj4oXG4gICAgICAgIHNjb3BlOiBJbnN0YW5jZVNjb3BlIHwgc3RyaW5nLFxuICAgICAgICByZXNvbHV0aW9uQ29uc3RydWN0b3I6IFQsXG4gICAgICAgIGNvbnN0cnVjdG9yQXJncz86IENvbnN0cnVjdG9yUGFyYW1ldGVyczxUPlxuICAgICkge1xuICAgICAgICB0aGlzLnJlc29sdXRpb25zLnNldChzY29wZSwgbmV3IHJlc29sdXRpb25Db25zdHJ1Y3RvciguLi4oY29uc3RydWN0b3JBcmdzID8/IFtdKSkpO1xuICAgIH1cbiAgICBnZXRTY3JvcGVSZXNvbHV0aW9uSW5zdGFuY2Uoc2NvcGU6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb2x1dGlvbnMuZ2V0KHNjb3BlKSA/PyB0aGlzLnJlc29sdXRpb25zLmdldCh0aGlzLmRlZmF1bHRTY29wZSk7XG4gICAgfVxuICAgIHJlZ2lzdGVyRXZhbHVhdG9yKG5hbWU6IHN0cmluZywgZXZhbHVhdG9yQ2xhc3M6IE5ld2FibGU8RXZhbHVhdG9yPikge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGV2YWx1YXRvckNsYXNzLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgbWV0YWRhdGEuc2V0U2NvcGUoSW5zdGFuY2VTY29wZS5TSU5HTEVUT04pO1xuICAgICAgICB0aGlzLmV2YWx1YXRvckNsYXNzZXMuc2V0KG5hbWUsIGV2YWx1YXRvckNsYXNzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFJlZ2lzdGVycyBhbiBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3IgY2xhc3MgdG8gY3VzdG9taXplXG4gICAgICogICAgICB0aGUgaW5zdGFudGlhdGlvbiBwcm9jZXNzIGF0IHZhcmlvdXMgc3RhZ2VzIHdpdGhpbiB0aGUgSW9DXG4gICAgICogQGRlcHJlY2F0ZWQgUmVwbGFjZWQgd2l0aCB7QGxpbmsgcmVnaXN0ZXJCZWZvcmVJbnN0YW50aWF0aW9uUHJvY2Vzc29yfSBhbmQge0BsaW5rIHJlZ2lzdGVyQWZ0ZXJJbnN0YW50aWF0aW9uUHJvY2Vzc29yfVxuICAgICAqIEBwYXJhbSB7TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPn0gY2xhenpcbiAgICAgKiBAc2VlIEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3NvclxuICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAqL1xuICAgIHJlZ2lzdGVySW5zdEF3YXJlUHJvY2Vzc29yKGNsYXp6OiBOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+KSB7XG4gICAgICAgIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5hcHBlbmRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyhjbGF6eik7XG4gICAgfVxuICAgIHJlZ2lzdGVyQmVmb3JlSW5zdGFudGlhdGlvblByb2Nlc3Nvcihwcm9jZXNzb3I6IDxUPihjb25zdHJ1Y3RvcjogTmV3YWJsZTxUPiwgYXJnczogdW5rbm93bltdKSA9PiBUIHwgdW5kZWZpbmVkIHwgdm9pZCkge1xuICAgICAgICB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuYXBwZW5kSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoXG4gICAgICAgICAgICBjbGFzcyBJbm5lclByb2Nlc3NvciBpbXBsZW1lbnRzIFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3Ige1xuICAgICAgICAgICAgICAgIGJlZm9yZUluc3RhbnRpYXRpb248VD4oY29uc3RydWN0b3I6IE5ld2FibGU8VD4sIGFyZ3M6IHVua25vd25bXSk6IHZvaWQgfCBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3Nvcihjb25zdHJ1Y3RvciwgYXJncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbiAgICByZWdpc3RlckFmdGVySW5zdGFudGlhdGlvblByb2Nlc3Nvcihwcm9jZXNzb3I6IDxUIGV4dGVuZHMgb2JqZWN0PihpbnN0YW5jZTogVCkgPT4gVCkge1xuICAgICAgICB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuYXBwZW5kSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoXG4gICAgICAgICAgICBjbGFzcyBJbm5lclByb2Nlc3NvciBpbXBsZW1lbnRzIFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3Ige1xuICAgICAgICAgICAgICAgIGFmdGVySW5zdGFudGlhdGlvbjxUIGV4dGVuZHMgb2JqZWN0PihpbnN0YW5jZTogVCk6IFQge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvY2Vzc29yKGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuICAgIG9uUHJlRGVzdHJveShsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudEVtaXR0ZXIub24oUFJFX0RFU1RST1lfRVZFTlRfS0VZLCBsaXN0ZW5lcik7XG4gICAgfVxuICAgIG9uUHJlRGVzdHJveVRoYXQobGlzdGVuZXI6IChpbnN0YW5jZTogb2JqZWN0KSA9PiB2b2lkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50RW1pdHRlci5vbihQUkVfREVTVFJPWV9USEFUX0VWRU5UX0tFWSwgbGlzdGVuZXIpO1xuICAgIH1cbiAgICBnZXRDbGFzc01ldGFkYXRhPFQ+KGN0b3I6IE5ld2FibGU8VD4pIHtcbiAgICAgICAgcmV0dXJuIENsYXNzTWV0YWRhdGEuZ2V0UmVhZGVyKGN0b3IpIGFzIENsYXNzTWV0YWRhdGFSZWFkZXI8VD47XG4gICAgfVxuICAgIGRlc3Ryb3lUcmFuc2llbnRJbnN0YW5jZTxUPihpbnN0YW5jZTogVCkge1xuICAgICAgICBjb25zdCByZXNvbHV0aW9uID0gdGhpcy5yZXNvbHV0aW9ucy5nZXQoSW5zdGFuY2VTY29wZS5UUkFOU0lFTlQpO1xuICAgICAgICByZXNvbHV0aW9uPy5kZXN0cm95VGhhdCAmJiByZXNvbHV0aW9uLmRlc3Ryb3lUaGF0KGluc3RhbmNlKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0dsb2JhbE1ldGFkYXRhJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEZhY3RvcnlJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvRmFjdG9yeUlkZW50aWZpZXInO1xuaW1wb3J0IHsgSW5zdGFuY2UgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZSc7XG5pbXBvcnQgeyBpc05vdERlZmluZWQgfSBmcm9tICcuLi9jb21tb24vaXNOb3REZWZpbmVkJztcbmltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uJztcblxuZXhwb3J0IGZ1bmN0aW9uIEZhY3RvcnkocHJvZHVjZUlkZW50aWZpZXI/OiBGYWN0b3J5SWRlbnRpZmllciwgc2NvcGU6IEluc3RhbmNlU2NvcGUgPSBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTik6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuICh0YXJnZXQ6IE9iamVjdCwgcHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCkgPT4ge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IEdsb2JhbE1ldGFkYXRhLmdldEluc3RhbmNlKCk7XG4gICAgICAgIGNvbnN0IGNsYXp6ID0gdGFyZ2V0LmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8SW5zdGFuY2U8dW5rbm93bj4+O1xuXG4gICAgICAgIGlmIChpc05vdERlZmluZWQocHJvZHVjZUlkZW50aWZpZXIpKSB7XG4gICAgICAgICAgICBwcm9kdWNlSWRlbnRpZmllciA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ2Rlc2lnbjpyZXR1cm50eXBlJywgdGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTm90RGVmaW5lZChwcm9kdWNlSWRlbnRpZmllcikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHJldHVybiB0eXBlIG5vdCByZWNvZ25pemVkLCBjYW5ub3QgcGVyZm9ybSBpbnN0YW5jZSBjcmVhdGlvbiEnKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpbmplY3Rpb25zID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnZGVzaWduOnBhcmFtdHlwZXMnLCB0YXJnZXQsIHByb3BlcnR5S2V5KTtcblxuICAgICAgICBtZXRhZGF0YS5yZWNvcmRGYWN0b3J5KFxuICAgICAgICAgICAgcHJvZHVjZUlkZW50aWZpZXIsXG4gICAgICAgICAgICAoY29udGFpbmVyLCBvd25lcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gY29udGFpbmVyLmdldEluc3RhbmNlKGNsYXp6LCBvd25lcik7XG4gICAgICAgICAgICAgICAgY29uc3QgZnVuYyA9IGluc3RhbmNlW3Byb3BlcnR5S2V5XTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZ1bmMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGNvbnRhaW5lci5nZXRJbnN0YW5jZShjbGF6eik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuYy5hcHBseShpbnN0YW5jZSwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IGZ1bmM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluamVjdGlvbnMsXG4gICAgICAgICAgICBzY29wZVxuICAgICAgICApO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuLi9mb3VuZGF0aW9uJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEsIEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBJbmplY3Rpb25UeXBlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9JbmplY3Rpb25UeXBlJztcblxuZXhwb3J0IGZ1bmN0aW9uIEdlbmVyYXRlPFQsIFY+KGdlbmVyYXRvcjogKHRoaXM6IFQsIGFwcEN0eDogQXBwbGljYXRpb25Db250ZXh0KSA9PiBWKTogUHJvcGVydHlEZWNvcmF0b3Ige1xuICAgIHJldHVybiAodGFyZ2V0OiBPYmplY3QsIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wpID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQuY29uc3RydWN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBjb25zdCB2YWx1ZV9zeW1ib2wgPSBTeW1ib2woJycpO1xuICAgICAgICBtZXRhZGF0YS5yZWNvcmRQcm9wZXJ0eVR5cGUocHJvcGVydHlLZXksIEluamVjdGlvblR5cGUub2ZJZGVudGlmaWVyKHZhbHVlX3N5bWJvbCkpO1xuICAgICAgICBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlY29yZEZhY3RvcnkodmFsdWVfc3ltYm9sLCAoY29udGFpbmVyLCBvd25lcikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IGdlbmVyYXRvci5jYWxsKG93bmVyIGFzIFQsIGNvbnRhaW5lcik7XG4gICAgICAgIH0pO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IGlzTm90RGVmaW5lZCB9IGZyb20gJy4uL2NvbW1vbi9pc05vdERlZmluZWQnO1xuaW1wb3J0IHsgSW5qZWN0aW9uVHlwZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vSW5qZWN0aW9uVHlwZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBJbmplY3Q8VD4oaWRlbnRpZmllcj86IElkZW50aWZpZXI8VD4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gPFRhcmdldD4odGFyZ2V0OiBUYXJnZXQsIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wsIHBhcmFtZXRlckluZGV4PzogbnVtYmVyKSB7XG4gICAgICAgIGxldCBpbmplY3RDbGFzczogTmV3YWJsZTx1bmtub3duPiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHBhcmFtZXRlckluZGV4ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgLy8gY29uc3RydWN0b3IgcGFyYW1ldGVyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRDb25zdHIgPSB0YXJnZXQgYXMgTmV3YWJsZTxUPjtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaWRlbnRpZmllciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGluamVjdENsYXNzID0gaWRlbnRpZmllcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5qZWN0Q2xhc3MgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdkZXNpZ246cGFyYW10eXBlcycsIHRhcmdldCwgcHJvcGVydHlLZXkpW3BhcmFtZXRlckluZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc05vdERlZmluZWQoaW5qZWN0Q2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUeXBlIG5vdCByZWNvZ25pemVkLCBpbmplY3Rpb24gY2Fubm90IGJlIHBlcmZvcm1lZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY2xhc3NNZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldENvbnN0ciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBjbGFzc01ldGFkYXRhLnNldENvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZShwYXJhbWV0ZXJJbmRleCwgSW5qZWN0aW9uVHlwZS5vZihpbmplY3RDbGFzcywgaWRlbnRpZmllcikpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdvYmplY3QnICYmIHRhcmdldCAhPT0gbnVsbCAmJiBwcm9wZXJ0eUtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBsZXQgaW5qZWN0Q2xhc3M6IE5ld2FibGU8dW5rbm93bj4gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGlkZW50aWZpZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBpbmplY3RDbGFzcyA9IGlkZW50aWZpZXI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGluamVjdENsYXNzID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnZGVzaWduOnR5cGUnLCB0YXJnZXQsIHByb3BlcnR5S2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc05vdERlZmluZWQoaW5qZWN0Q2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUeXBlIG5vdCByZWNvZ25pemVkLCBpbmplY3Rpb24gY2Fubm90IGJlIHBlcmZvcm1lZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQuY29uc3RydWN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICAgICAgbWV0YWRhdGEucmVjb3JkUHJvcGVydHlUeXBlKHByb3BlcnR5S2V5LCBJbmplY3Rpb25UeXBlLm9mKGluamVjdENsYXNzLCBpZGVudGlmaWVyKSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgSW5zdGFuY2VTY29wZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24nO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSwgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlJztcblxuZXhwb3J0IGludGVyZmFjZSBJbmplY3RhYmxlT3B0aW9ucyB7XG4gICAgcHJvZHVjZTogc3RyaW5nIHwgc3ltYm9sIHwgQXJyYXk8c3RyaW5nIHwgc3ltYm9sPjtcbiAgICBzY29wZT86IEluc3RhbmNlU2NvcGU7XG59XG5cbi8qKlxuICogVGhpcyBkZWNvcmF0b3IgaXMgdHlwaWNhbGx5IHVzZWQgdG8gaWRlbnRpZnkgY2xhc3NlcyB0aGF0IG5lZWQgdG8gYmUgY29uZmlndXJlZCB3aXRoaW4gdGhlIElvQyBjb250YWluZXIuXG4gKiBJbiBtb3N0IGNhc2VzLCBASW5qZWN0YWJsZSBjYW4gYmUgb21pdHRlZCB1bmxlc3MgZXhwbGljaXQgY29uZmlndXJhdGlvbiBpcyByZXF1aXJlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEluamVjdGFibGUob3B0aW9ucz86IEluamVjdGFibGVPcHRpb25zKTogQ2xhc3NEZWNvcmF0b3Ige1xuICAgIHJldHVybiA8VEZ1bmN0aW9uIGV4dGVuZHMgRnVuY3Rpb24+KHRhcmdldDogVEZ1bmN0aW9uKTogVEZ1bmN0aW9uIHwgdm9pZCA9PiB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucz8ucHJvZHVjZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpO1xuICAgICAgICBjb25zdCBwcm9kdWNlcyA9IEFycmF5LmlzQXJyYXkob3B0aW9ucy5wcm9kdWNlKSA/IG9wdGlvbnMucHJvZHVjZSA6IFtvcHRpb25zLnByb2R1Y2VdO1xuICAgICAgICBjb25zdCBjbGFzc01ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGFyZ2V0IGFzIHVua25vd24gYXMgTmV3YWJsZTx1bmtub3duPiwgQ2xhc3NNZXRhZGF0YSk7XG5cbiAgICAgICAgcHJvZHVjZXMuZm9yRWFjaChwcm9kdWNlID0+IHtcbiAgICAgICAgICAgIG1ldGFkYXRhLnJlY29yZEZhY3RvcnkoXG4gICAgICAgICAgICAgICAgcHJvZHVjZSxcbiAgICAgICAgICAgICAgICAoY29udGFpbmVyLCBvd25lcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBjb250YWluZXIuZ2V0SW5zdGFuY2UodGFyZ2V0IGFzIHVua25vd24gYXMgTmV3YWJsZTxJbnN0YW5jZTx1bmtub3duPj4sIG93bmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFtdLFxuICAgICAgICAgICAgICAgIGNsYXNzTWV0YWRhdGEucmVhZGVyKCkuZ2V0U2NvcGUoKSA/PyBvcHRpb25zLnNjb3BlID8/IEluc3RhbmNlU2NvcGUuU0lOR0xFVE9OXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL3R5cGVzL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcic7XG5pbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0dsb2JhbE1ldGFkYXRhJztcblxuZXhwb3J0IGZ1bmN0aW9uIEluc3RBd2FyZVByb2Nlc3NvcigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gPENscyBleHRlbmRzIE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4+KHRhcmdldDogQ2xzKSB7XG4gICAgICAgIEdsb2JhbE1ldGFkYXRhLmdldEluc3RhbmNlKCkucmVjb3JkUHJvY2Vzc29yQ2xhc3ModGFyZ2V0KTtcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgVmFsdWUgfSBmcm9tICcuL1ZhbHVlJztcbmltcG9ydCB7IEV4cHJlc3Npb25UeXBlIH0gZnJvbSAnLi4vdHlwZXMvRXZhbHVhdGVPcHRpb25zJztcblxuZXhwb3J0IGZ1bmN0aW9uIEpTT05EYXRhKG5hbWVzcGFjZTogc3RyaW5nLCBqc29ucGF0aDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIFZhbHVlKGAke25hbWVzcGFjZX06JHtqc29ucGF0aH1gLCBFeHByZXNzaW9uVHlwZS5KU09OX1BBVEgpO1xufVxuIiwiaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IExpZmVjeWNsZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vTGlmZWN5Y2xlJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuXG4vKipcbiAqIFVybiBjYWxscyB0aGUgbWV0aG9kcyBhbm5vdGF0ZWQgd2l0aCBAUG9zdEluamVjdCBvbmx5IG9uY2UsIGp1c3QgYWZ0ZXIgdGhlIGluamVjdGlvbiBvZiBwcm9wZXJ0aWVzLlxuICogQGFubm90YXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IExpZmVjeWNsZURlY29yYXRvciA9IChsaWZlY3ljbGU6IExpZmVjeWNsZSk6IE1ldGhvZERlY29yYXRvciA9PiB7XG4gICAgcmV0dXJuICh0YXJnZXQ6IE9iamVjdCwgcHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCkgPT4ge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldC5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgIG1ldGFkYXRhLmFkZExpZmVjeWNsZU1ldGhvZChwcm9wZXJ0eUtleSwgbGlmZWN5Y2xlKTtcbiAgICB9O1xufTtcbiIsImltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcblxuZXhwb3J0IGZ1bmN0aW9uIE1hcmsoa2V5OiBzdHJpbmcgfCBzeW1ib2wsIHZhbHVlOiB1bmtub3duID0gdHJ1ZSk6IEZ1bmN0aW9uIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKFxuICAgICAgICAuLi5hcmdzOlxuICAgICAgICAgICAgfCBQYXJhbWV0ZXJzPENsYXNzRGVjb3JhdG9yPlxuICAgICAgICAgICAgfCBQYXJhbWV0ZXJzPE1ldGhvZERlY29yYXRvcj5cbiAgICAgICAgICAgIHwgUGFyYW1ldGVyczxQcm9wZXJ0eURlY29yYXRvcj5cbiAgICAgICAgICAgIHwgUGFyYW1ldGVyczxQYXJhbWV0ZXJEZWNvcmF0b3I+XG4gICAgKSB7XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgLy8gY2xhc3MgZGVjb3JhdG9yXG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGFyZ3NbMF0sIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICAgICAgbWV0YWRhdGEubWFya2VyKCkuY3RvcihrZXksIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgLy8gcHJvcGVydHkgZGVjb3JhdG9yXG4gICAgICAgICAgICBjb25zdCBbcHJvdG90eXBlLCBwcm9wZXJ0eUtleV0gPSBhcmdzO1xuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShwcm90b3R5cGUuY29uc3RydWN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICAgICAgbWV0YWRhdGEubWFya2VyKCkubWVtYmVyKHByb3BlcnR5S2V5KS5tYXJrKGtleSwgdmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZ3MubGVuZ3RoID09PSAzICYmIHR5cGVvZiBhcmdzWzJdID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgLy8gcGFyYW1ldGVyIGRlY29yYXRvclxuICAgICAgICAgICAgY29uc3QgW3Byb3RvdHlwZSwgcHJvcGVydHlLZXksIGluZGV4XSA9IGFyZ3MgYXMgW09iamVjdCwgc3RyaW5nIHwgc3ltYm9sLCBudW1iZXJdO1xuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShwcm90b3R5cGUuY29uc3RydWN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICAgICAgbWV0YWRhdGEubWFya2VyKCkucGFyYW1ldGVyKHByb3BlcnR5S2V5LCBpbmRleCkubWFyayhrZXksIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIG1ldGhvZCBkZWNvcmF0b3JcbiAgICAgICAgICAgIGNvbnN0IFtwcm90b3R5cGUsIHByb3BlcnR5S2V5XSA9IGFyZ3MgYXMgUGFyYW1ldGVyczxNZXRob2REZWNvcmF0b3I+O1xuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShwcm90b3R5cGUuY29uc3RydWN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICAgICAgbWV0YWRhdGEubWFya2VyKCkubWVtYmVyKHByb3BlcnR5S2V5KS5tYXJrKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfTtcbn1cbiIsImltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBMaWZlY3ljbGVEZWNvcmF0b3IgfSBmcm9tICcuL0xpZmVjeWNsZURlY29yYXRvcic7XG5cbi8qKlxuICogVXJuIGNhbGxzIHRoZSBtZXRob2RzIGFubm90YXRlZCB3aXRoIEBQb3N0SW5qZWN0IG9ubHkgb25jZSwganVzdCBhZnRlciB0aGUgaW5qZWN0aW9uIG9mIHByb3BlcnRpZXMuXG4gKiBAYW5ub3RhdGlvblxuICovXG5leHBvcnQgY29uc3QgUG9zdEluamVjdCA9ICgpOiBNZXRob2REZWNvcmF0b3IgPT4gTGlmZWN5Y2xlRGVjb3JhdG9yKExpZmVjeWNsZS5QT1NUX0lOSkVDVCk7XG4iLCJpbXBvcnQgeyBMaWZlY3ljbGVEZWNvcmF0b3IgfSBmcm9tICcuL0xpZmVjeWNsZURlY29yYXRvcic7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5cbmV4cG9ydCBjb25zdCBQcmVEZXN0cm95ID0gKCkgPT4gTGlmZWN5Y2xlRGVjb3JhdG9yKExpZmVjeWNsZS5QUkVfREVTVFJPWSk7XG4iLCJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9MaWZlY3ljbGUnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlRGVjb3JhdG9yIH0gZnJvbSAnLi9MaWZlY3ljbGVEZWNvcmF0b3InO1xuXG4vKipcbiAqIFVybiBjYWxscyB0aGUgbWV0aG9kcyBhbm5vdGF0ZWQgd2l0aCBAUG9zdEluamVjdCBvbmx5IG9uY2UsIGp1c3QgYWZ0ZXIgdGhlIGluamVjdGlvbiBvZiBwcm9wZXJ0aWVzLlxuICogQGFubm90YXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IFByZUluamVjdCA9ICgpOiBNZXRob2REZWNvcmF0b3IgPT4gTGlmZWN5Y2xlRGVjb3JhdG9yKExpZmVjeWNsZS5QUkVfSU5KRUNUKTtcbiIsImltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luc3RhbmNlU2NvcGUnO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBTY29wZShzY29wZTogSW5zdGFuY2VTY29wZSB8IHN0cmluZyk6IENsYXNzRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gPFRGdW5jdGlvbiBleHRlbmRzIEZ1bmN0aW9uPih0YXJnZXQ6IFRGdW5jdGlvbikgPT4ge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldCBhcyB1bmtub3duIGFzIE5ld2FibGU8dW5rbm93bj4sIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBtZXRhZGF0YS5zZXRTY29wZShzY29wZSk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IE1ldGFkYXRhLCBNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4uL3R5cGVzL01ldGFkYXRhJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEFzcGVjdCB9IGZyb20gJy4vQXNwZWN0JztcbmltcG9ydCB7IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcCwgRGVmYXVsdFZhbHVlTWFwIH0gZnJvbSAnLi4vY29tbW9uL0RlZmF1bHRWYWx1ZU1hcCc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuL0FkdmljZSc7XG5cbmV4cG9ydCB0eXBlIFVzZUFzcGVjdE1hcCA9IERlZmF1bHRWYWx1ZU1hcDxzdHJpbmcgfCBzeW1ib2wsIERlZmF1bHRWYWx1ZU1hcDxBZHZpY2UsIEFycmF5PE5ld2FibGU8QXNwZWN0Pj4+PjtcblxuZXhwb3J0IGludGVyZmFjZSBVc2VBc3BlY3RNZXRhZGF0YVJlYWRlciBleHRlbmRzIE1ldGFkYXRhUmVhZGVyIHtcbiAgICBnZXRBc3BlY3RzKCk6IFVzZUFzcGVjdE1hcDtcbiAgICBnZXRBc3BlY3RzT2YobWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sLCBhZHZpY2U6IEFkdmljZSk6IEFycmF5PE5ld2FibGU8QXNwZWN0Pj47XG59XG5leHBvcnQgY2xhc3MgQU9QQ2xhc3NNZXRhZGF0YSBpbXBsZW1lbnRzIE1ldGFkYXRhPFVzZUFzcGVjdE1ldGFkYXRhUmVhZGVyLCBOZXdhYmxlPHVua25vd24+PiB7XG4gICAgc3RhdGljIGdldFJlZmxlY3RLZXkoKSB7XG4gICAgICAgIHJldHVybiAnYW9wOnVzZS1hc3BlY3QtbWV0YWRhdGEnO1xuICAgIH1cbiAgICBwcml2YXRlIGFzcGVjdE1hcDogVXNlQXNwZWN0TWFwID0gY3JlYXRlRGVmYXVsdFZhbHVlTWFwKCgpID0+IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcCgoKSA9PiBbXSkpO1xuICAgIGluaXQoKTogdm9pZCB7XG4gICAgICAgIC8vIElHTk9SRVxuICAgIH1cblxuICAgIGFwcGVuZChtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2wsIGFkdmljZTogQWR2aWNlLCBhc3BlY3RzOiBBcnJheTxOZXdhYmxlPEFzcGVjdD4+KSB7XG4gICAgICAgIGNvbnN0IGFkdmljZUFzcGVjdE1hcCA9IHRoaXMuYXNwZWN0TWFwLmdldChtZXRob2ROYW1lKTtcbiAgICAgICAgY29uc3QgZXhpdGluZ0FzcGVjdEFycmF5ID0gYWR2aWNlQXNwZWN0TWFwLmdldChhZHZpY2UpO1xuICAgICAgICBleGl0aW5nQXNwZWN0QXJyYXkucHVzaCguLi5hc3BlY3RzKTtcbiAgICB9XG5cbiAgICByZWFkZXIoKTogVXNlQXNwZWN0TWV0YWRhdGFSZWFkZXIge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0QXNwZWN0czogKCk6IFVzZUFzcGVjdE1hcCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNwZWN0TWFwO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldEFzcGVjdHNPZjogKG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCwgYWR2aWNlOiBBZHZpY2UpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3BlY3RNYXAuZ2V0KG1ldGhvZE5hbWUpLmdldChhZHZpY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcblxuZnVuY3Rpb24gZ2V0TWV0aG9kRGVzY3JpcHRvcnMocHJvdG90eXBlOiBvYmplY3QpOiBSZWNvcmQ8c3RyaW5nLCBQcm9wZXJ0eURlc2NyaXB0b3I+IHtcbiAgICBpZiAoXG4gICAgICAgIHR5cGVvZiBwcm90b3R5cGUgIT09ICdvYmplY3QnIHx8XG4gICAgICAgIHByb3RvdHlwZSA9PT0gbnVsbCB8fFxuICAgICAgICBPYmplY3QucHJvdG90eXBlID09PSBwcm90b3R5cGUgfHxcbiAgICAgICAgRnVuY3Rpb24ucHJvdG90eXBlID09PSBwcm90b3R5cGVcbiAgICApIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBjb25zdCBzdXBlclByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90b3R5cGUpO1xuICAgIGNvbnN0IHN1cGVyRGVzY3JpcHRvcnMgPSBzdXBlclByb3RvdHlwZSA9PT0gcHJvdG90eXBlID8ge30gOiBnZXRNZXRob2REZXNjcmlwdG9ycyhzdXBlclByb3RvdHlwZSk7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oc3VwZXJEZXNjcmlwdG9ycywgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMocHJvdG90eXBlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxNZXRob2RNZW1iZXJOYW1lczxUPihjbHM6IE5ld2FibGU8VD4pIHtcbiAgICBjb25zdCBkZXNjcmlwdG9ycyA9IGdldE1ldGhvZERlc2NyaXB0b3JzKGNscy5wcm90b3R5cGUpO1xuICAgIGRlbGV0ZSBkZXNjcmlwdG9yc1snY29uc3RydWN0b3InXTtcbiAgICBjb25zdCBtZXRob2ROYW1lcyA9IG5ldyBTZXQ8c3RyaW5nIHwgc3ltYm9sPigpO1xuICAgIFJlZmxlY3Qub3duS2V5cyhkZXNjcmlwdG9ycykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBjb25zdCBtZW1iZXIgPSBjbHMucHJvdG90eXBlW2tleV07XG4gICAgICAgIGlmICh0eXBlb2YgbWVtYmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBtZXRob2ROYW1lcy5hZGQoa2V5KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBtZXRob2ROYW1lcztcbn1cbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IGdldEFsbE1ldGhvZE1lbWJlck5hbWVzIH0gZnJvbSAnLi4vY29tbW9uL2dldEFsbE1ldGhvZE1lbWJlck5hbWVzJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcblxudHlwZSBNZW1iZXJJZGVudGlmaWVyID0gc3RyaW5nIHwgc3ltYm9sO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUG9pbnRjdXQge1xuICAgIHN0YXRpYyBjb21iaW5lKC4uLnBvaW50Y3V0czogUG9pbnRjdXRbXSkge1xuICAgICAgICByZXR1cm4gbmV3IE9yUG9pbnRjdXQocG9pbnRjdXRzKTtcbiAgICB9XG4gICAgc3RhdGljIG9mPFQ+KGNsczogTmV3YWJsZTxUPiwgLi4ubWV0aG9kTmFtZXM6IE1lbWJlcklkZW50aWZpZXJbXSkge1xuICAgICAgICBjb25zdCBlbnRyaWVzID0gbmV3IE1hcDxOZXdhYmxlPHVua25vd24+LCBTZXQ8TWVtYmVySWRlbnRpZmllcj4+KCk7XG4gICAgICAgIGNvbnN0IG1ldGhvZHMgPSBuZXcgU2V0PE1lbWJlcklkZW50aWZpZXI+KG1ldGhvZE5hbWVzIGFzIE1lbWJlcklkZW50aWZpZXJbXSk7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBnZXRBbGxNZXRob2RNZW1iZXJOYW1lcyhjbHMpLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgICAgICAgICAgICAgbWV0aG9kcy5hZGQobWV0aG9kTmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbnRyaWVzLnNldChjbHMsIG1ldGhvZHMpO1xuICAgICAgICByZXR1cm4gbmV3IFByZWNpdGVQb2ludGN1dChlbnRyaWVzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWRcbiAgICAgKi9cbiAgICBzdGF0aWMgdGVzdE1hdGNoPFQ+KGNsczogTmV3YWJsZTxUPiwgcmVnZXg6IFJlZ0V4cCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXRjaChjbHMsIHJlZ2V4KTtcbiAgICB9XG4gICAgc3RhdGljIG1hdGNoPFQ+KGNsczogTmV3YWJsZTxUPiwgcmVnZXg6IFJlZ0V4cCkge1xuICAgICAgICByZXR1cm4gbmV3IE1lbWJlck1hdGNoUG9pbnRjdXQoY2xzLCByZWdleCk7XG4gICAgfVxuICAgIHN0YXRpYyBmcm9tKC4uLmNsYXNzZXM6IEFycmF5PE5ld2FibGU8dW5rbm93bj4+KSB7XG4gICAgICAgIGNvbnN0IG9mID0gKC4uLm1ldGhvZE5hbWVzOiBNZW1iZXJJZGVudGlmaWVyW10pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgT3JQb2ludGN1dChjbGFzc2VzLm1hcChjbHMgPT4gUG9pbnRjdXQub2YoY2xzLCAuLi5tZXRob2ROYW1lcykpKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgbWF0Y2ggPSAocmVnZXg6IFJlZ0V4cCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBPclBvaW50Y3V0KFxuICAgICAgICAgICAgICAgIGNsYXNzZXMubWFwKGNscyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTWVtYmVyTWF0Y2hQb2ludGN1dChjbHMsIHJlZ2V4KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9mLFxuICAgICAgICAgICAgbWF0Y2gsXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBkZXByZWNhdGVkXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRlc3RNYXRjaDogbWF0Y2hcbiAgICAgICAgfTtcbiAgICB9XG4gICAgc3RhdGljIG1hcmtlZCh0eXBlOiBzdHJpbmcgfCBzeW1ib2wsIHZhbHVlOiB1bmtub3duID0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gbmV3IE1hcmtlZFBvaW50Y3V0KHR5cGUsIHZhbHVlKTtcbiAgICB9XG4gICAgc3RhdGljIGNsYXNzPFQ+KGNsczogTmV3YWJsZTxUPikge1xuICAgICAgICByZXR1cm4gbmV3IENsYXNzUG9pbnRjdXQoY2xzKTtcbiAgICB9XG4gICAgYWJzdHJhY3QgdGVzdChqcElkZW50aWZpZXI6IElkZW50aWZpZXIsIGpwTWVtYmVyOiBzdHJpbmcgfCBzeW1ib2wpOiBib29sZWFuO1xufVxuXG5jbGFzcyBPclBvaW50Y3V0IGV4dGVuZHMgUG9pbnRjdXQge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcG9pbnRjdXRzOiBQb2ludGN1dFtdKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHRlc3QoanBJZGVudGlmaWVyOiBJZGVudGlmaWVyLCBqcE1lbWJlcjogc3RyaW5nIHwgc3ltYm9sKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvaW50Y3V0cy5zb21lKGl0ID0+IGl0LnRlc3QoanBJZGVudGlmaWVyLCBqcE1lbWJlcikpO1xuICAgIH1cbn1cblxuY2xhc3MgUHJlY2l0ZVBvaW50Y3V0IGV4dGVuZHMgUG9pbnRjdXQge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgbWV0aG9kRW50cmllczogTWFwPElkZW50aWZpZXIsIFNldDxNZW1iZXJJZGVudGlmaWVyPj4pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgdGVzdChqcElkZW50aWZpZXI6IElkZW50aWZpZXIsIGpwTWVtYmVyOiBzdHJpbmcgfCBzeW1ib2wpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgbWVtYmVycyA9IHRoaXMubWV0aG9kRW50cmllcy5nZXQoanBJZGVudGlmaWVyKTtcbiAgICAgICAgcmV0dXJuICEhbWVtYmVycyAmJiBtZW1iZXJzLmhhcyhqcE1lbWJlcik7XG4gICAgfVxufVxuY2xhc3MgTWFya2VkUG9pbnRjdXQgZXh0ZW5kcyBQb2ludGN1dCB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBtYXJrZWRUeXBlOiBzdHJpbmcgfCBzeW1ib2wsIHByaXZhdGUgbWFya2VkVmFsdWU6IHVua25vd24gPSB0cnVlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHRlc3QoanBJZGVudGlmaWVyOiBJZGVudGlmaWVyLCBqcE1lbWJlcjogc3RyaW5nIHwgc3ltYm9sKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0eXBlb2YganBJZGVudGlmaWVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShqcElkZW50aWZpZXIsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBjb25zdCBtYXJrSW5mbyA9IG1ldGFkYXRhLnJlYWRlcigpLmdldE1lbWJlcnNNYXJrSW5mbyhqcE1lbWJlcik7XG4gICAgICAgIHJldHVybiBtYXJrSW5mb1t0aGlzLm1hcmtlZFR5cGVdID09PSB0aGlzLm1hcmtlZFZhbHVlO1xuICAgIH1cbn1cbmNsYXNzIE1lbWJlck1hdGNoUG9pbnRjdXQgZXh0ZW5kcyBQb2ludGN1dCB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjbGF6ejogTmV3YWJsZTx1bmtub3duPiwgcHJpdmF0ZSByZWdleDogUmVnRXhwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHRlc3QoanBJZGVudGlmaWVyOiBJZGVudGlmaWVyLCBqcE1lbWJlcjogc3RyaW5nIHwgc3ltYm9sKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBqcElkZW50aWZpZXIgPT09IHRoaXMuY2xhenogJiYgdHlwZW9mIGpwTWVtYmVyID09PSAnc3RyaW5nJyAmJiAhIXRoaXMucmVnZXgudGVzdChqcE1lbWJlcik7XG4gICAgfVxufVxuY2xhc3MgQ2xhc3NQb2ludGN1dCBleHRlbmRzIFBvaW50Y3V0IHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNsYXp6OiBOZXdhYmxlPHVua25vd24+KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHRlc3QoanBJZGVudGlmaWVyOiBJZGVudGlmaWVyKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBqcElkZW50aWZpZXIgPT09IHRoaXMuY2xheno7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgUG9pbnRjdXQgfSBmcm9tICcuL1BvaW50Y3V0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4vQWR2aWNlJztcbmltcG9ydCB7IEFzcGVjdE1ldGFkYXRhIH0gZnJvbSAnLi9Bc3BlY3RNZXRhZHRhJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFzcGVjdChcbiAgICBjb21wb25lbnRBc3BlY3RDbGFzczogTmV3YWJsZTx1bmtub3duPixcbiAgICBtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2wsXG4gICAgYWR2aWNlOiBBZHZpY2UsXG4gICAgcG9pbnRjdXQ6IFBvaW50Y3V0XG4pIHtcbiAgICBBc3BlY3RNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLmFwcGVuZChjb21wb25lbnRBc3BlY3RDbGFzcywgbWV0aG9kTmFtZSwgYWR2aWNlLCBwb2ludGN1dCk7XG4gICAgLy8gY29uc3QgQXNwZWN0Q2xhc3MgPSBDb21wb25lbnRNZXRob2RBc3BlY3QuY3JlYXRlKGNvbXBvbmVudEFzcGVjdENsYXNzLCBtZXRob2ROYW1lKTtcbiAgICAvLyBwb2ludGN1dC5nZXRNZXRob2RzTWFwKCkuZm9yRWFjaCgoanBNZW1iZXJzLCBqcENsYXNzKSA9PiB7XG4gICAgLy8gICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoanBDbGFzcywgQU9QQ2xhc3NNZXRhZGF0YSk7XG4gICAgLy8gICAgIGpwTWVtYmVycy5mb3JFYWNoKG1ldGhvZE5hbWUgPT4ge1xuICAgIC8vICAgICAgICAgbWV0YWRhdGEuYXBwZW5kKG1ldGhvZE5hbWUsIGFkdmljZSwgW0FzcGVjdENsYXNzXSk7XG4gICAgLy8gICAgIH0pO1xuICAgIC8vIH0pO1xufVxuIiwiaW1wb3J0IHsgUG9pbnRjdXQgfSBmcm9tICcuLi9Qb2ludGN1dCc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuLi9BZHZpY2UnO1xuaW1wb3J0IHsgYWRkQXNwZWN0IH0gZnJvbSAnLi4vYWRkQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi8uLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIEFmdGVyKHBvaW50Y3V0OiBQb2ludGN1dCk6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgIGFkZEFzcGVjdCh0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTx1bmtub3duPiwgcHJvcGVydHlLZXksIEFkdmljZS5BZnRlciwgcG9pbnRjdXQpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBQb2ludGN1dCB9IGZyb20gJy4uL1BvaW50Y3V0JztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4uL0FkdmljZSc7XG5pbXBvcnQgeyBhZGRBc3BlY3QgfSBmcm9tICcuLi9hZGRBc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uLy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gQWZ0ZXJSZXR1cm4ocG9pbnRjdXQ6IFBvaW50Y3V0KTogTWV0aG9kRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgYWRkQXNwZWN0KHRhcmdldC5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPHVua25vd24+LCBwcm9wZXJ0eUtleSwgQWR2aWNlLkFmdGVyUmV0dXJuLCBwb2ludGN1dCk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi4vUG9pbnRjdXQnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi4vQWR2aWNlJztcbmltcG9ydCB7IGFkZEFzcGVjdCB9IGZyb20gJy4uL2FkZEFzcGVjdCc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBBcm91bmQocG9pbnRjdXQ6IFBvaW50Y3V0KTogTWV0aG9kRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgYWRkQXNwZWN0KHRhcmdldC5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPHVua25vd24+LCBwcm9wZXJ0eUtleSwgQWR2aWNlLkFyb3VuZCwgcG9pbnRjdXQpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBQb2ludGN1dCB9IGZyb20gJy4uL1BvaW50Y3V0JztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4uL0FkdmljZSc7XG5pbXBvcnQgeyBhZGRBc3BlY3QgfSBmcm9tICcuLi9hZGRBc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uLy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gQmVmb3JlKHBvaW50Y3V0OiBQb2ludGN1dCk6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgIGFkZEFzcGVjdCh0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTx1bmtub3duPiwgcHJvcGVydHlLZXksIEFkdmljZS5CZWZvcmUsIHBvaW50Y3V0KTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgUG9pbnRjdXQgfSBmcm9tICcuLi9Qb2ludGN1dCc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuLi9BZHZpY2UnO1xuaW1wb3J0IHsgYWRkQXNwZWN0IH0gZnJvbSAnLi4vYWRkQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi8uLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIEZpbmFsbHkocG9pbnRjdXQ6IFBvaW50Y3V0KTogTWV0aG9kRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgYWRkQXNwZWN0KHRhcmdldC5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPHVua25vd24+LCBwcm9wZXJ0eUtleSwgQWR2aWNlLkZpbmFsbHksIHBvaW50Y3V0KTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgUG9pbnRjdXQgfSBmcm9tICcuLi9Qb2ludGN1dCc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuLi9BZHZpY2UnO1xuaW1wb3J0IHsgYWRkQXNwZWN0IH0gZnJvbSAnLi4vYWRkQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi8uLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIFRocm93bihwb2ludGN1dDogUG9pbnRjdXQpOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICBhZGRBc3BlY3QodGFyZ2V0LmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dW5rbm93bj4sIHByb3BlcnR5S2V5LCBBZHZpY2UuVGhyb3duLCBwb2ludGN1dCk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4uL0FkdmljZSc7XG5pbXBvcnQgeyBBc3BlY3QsIFByb2NlZWRpbmdBc3BlY3QgfSBmcm9tICcuLi9Bc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uLy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgYWRkQXNwZWN0IH0gZnJvbSAnLi4vYWRkQXNwZWN0JztcbmltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi4vUG9pbnRjdXQnO1xuXG5mdW5jdGlvbiBVc2VBc3BlY3RzKGFkdmljZTogQWR2aWNlLkFyb3VuZCwgYXNwZWN0czogQXJyYXk8TmV3YWJsZTxQcm9jZWVkaW5nQXNwZWN0Pj4pOiBNZXRob2REZWNvcmF0b3I7XG5mdW5jdGlvbiBVc2VBc3BlY3RzKGFkdmljZTogQWR2aWNlLCBhc3BlY3RzOiBBcnJheTxOZXdhYmxlPEFzcGVjdD4+KTogTWV0aG9kRGVjb3JhdG9yO1xuZnVuY3Rpb24gVXNlQXNwZWN0cyhhZHZpY2U6IEFkdmljZSwgYXNwZWN0czogQXJyYXk8TmV3YWJsZTxBc3BlY3Q+Pik6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgIGNvbnN0IGNsYXp6ID0gdGFyZ2V0LmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dHlwZW9mIHRhcmdldD47XG4gICAgICAgIGFzcGVjdHMuZm9yRWFjaChhc3BlY3RDbGFzcyA9PiB7XG4gICAgICAgICAgICBhZGRBc3BlY3QoYXNwZWN0Q2xhc3MsICdleGVjdXRlJywgYWR2aWNlLCBQb2ludGN1dC5vZihjbGF6eiwgcHJvcGVydHlLZXkpKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn1cblxuZXhwb3J0IHsgVXNlQXNwZWN0cyB9O1xuIiwiaW1wb3J0IHsgRmFjdG9yeSB9IGZyb20gJy4uL2RlY29yYXRvcnMnO1xuaW1wb3J0IHsgRmFjdG9yeUlkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9GYWN0b3J5SWRlbnRpZmllcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVGYWN0b3J5V3JhcHBlcjxUPihwcm9kdWNlSWRlbnRpZmllcjogRmFjdG9yeUlkZW50aWZpZXIsIHByb2R1Y2U6IHVua25vd24sIG93bmVyOiBUKTogVCB7XG4gICAgY2xhc3MgVGhlRmFjdG9yeSB7XG4gICAgICAgIEBGYWN0b3J5KHByb2R1Y2VJZGVudGlmaWVyKVxuICAgICAgICBwcm9kdWNlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHByb2R1Y2U7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGljIHByZXZlbnRUcmVlU2hha2luZygpIHtcbiAgICAgICAgICAgIHJldHVybiBvd25lcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gVGhlRmFjdG9yeS5wcmV2ZW50VHJlZVNoYWtpbmcoKTtcbn0iXSwibmFtZXMiOlsiSW5zdGFuY2VTY29wZSIsIkV4cHJlc3Npb25UeXBlIiwiQWR2aWNlIiwiTGlmZWN5Y2xlIiwi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
