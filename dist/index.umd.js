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
        catch (_e) {
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
                        throw new Error("Multiple matching injectables found for property injection,\nbut property ".concat(key.toString(), " is not an array,\n                        It is ambiguous to determine which object should be injected!"));
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
                }
                else {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudW1kLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29tbW9uL0RlZmF1bHRWYWx1ZU1hcC50cyIsIi4uL3NyYy9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlci50cyIsIi4uL3NyYy9tZXRhZGF0YS9DbGFzc01ldGFkYXRhLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vSW5zdGFuY2VTY29wZS50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL1NlcnZpY2VGYWN0b3J5RGVmLnRzIiwiLi4vc3JjL2NvbW1vbi9GYWN0b3J5UmVjb3JkZXIudHMiLCIuLi9zcmMvbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEudHMiLCIuLi9zcmMvdHlwZXMvRXZhbHVhdGVPcHRpb25zLnRzIiwiLi4vc3JjL2NvbW1vbi9pc05vZGVKcy50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0luamVjdGlvblR5cGUudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9WYWx1ZS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0FyZ3YudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9BbGlhcy50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0JpbmQudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9FbnYudHMiLCIuLi9zcmMvY29tbW9uL2lzTm90RGVmaW5lZC50cyIsIi4uL3NyYy9hb3AvQWR2aWNlLnRzIiwiLi4vc3JjL2FvcC9Bc3BlY3RVdGlscy50cyIsIi4uL3NyYy9hb3AvY3JlYXRlQXNwZWN0LnRzIiwiLi4vc3JjL2FvcC9Db21wb25lbnRNZXRob2RBc3BlY3QudHMiLCIuLi9zcmMvYW9wL0FzcGVjdE1ldGFkdGEudHMiLCIuLi9zcmMvY29tbW9uL1Byb3h5VGFyZ2V0UmVjb3JkZXIudHMiLCIuLi9zcmMvYW9wL0FPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvci50cyIsIi4uL3NyYy9ldmFsdWF0b3IvQXJndkV2YWx1YXRvci50cyIsIi4uL3NyYy9ldmFsdWF0b3IvRW52aXJvbm1lbnRFdmFsdWF0b3IudHMiLCIuLi9zcmMvZXZhbHVhdG9yL0pTT05EYXRhRXZhbHVhdG9yLnRzIiwiLi4vc3JjL21ldGFkYXRhL0Z1bmN0aW9uTWV0YWRhdGEudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9Db21wb25lbnRJbnN0YW5jZVdyYXBwZXIudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9MaWZlY3ljbGUudHMiLCIuLi9zcmMvY29tbW9uL2ludm9rZVByZURlc3Ryb3kudHMiLCIuLi9zcmMvcmVzb2x1dGlvbi9TaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24udHMiLCIuLi9zcmMvcmVzb2x1dGlvbi9HbG9iYWxTaGFyZWRJbnN0YW5jZVJlc29sdXRpb24udHMiLCIuLi9zcmMvcmVzb2x1dGlvbi9UcmFuc2llbnRJbnN0YW5jZVJlc29sdXRpb24udHMiLCIuLi9zcmMvZm91bmRhdGlvbi9MaWZlY3ljbGVNYW5hZ2VyLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vRXZlbnRFbWl0dGVyLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlci50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0ludm9rZUZ1bmN0aW9uT3B0aW9ucy50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0FwcGxpY2F0aW9uQ29udGV4dC50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0ZhY3RvcnkudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9HZW5lcmF0ZS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0luamVjdC50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0luamVjdGFibGUudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9JbnN0QXdhcmVQcm9jZXNzb3IudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9KU09ORGF0YS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0xpZmVjeWNsZURlY29yYXRvci50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL01hcmsudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9Qb3N0SW5qZWN0LnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvUHJlRGVzdHJveS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL1ByZUluamVjdC50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL1Njb3BlLnRzIiwiLi4vc3JjL2FvcC9BT1BDbGFzc01ldGFkYXRhLnRzIiwiLi4vc3JjL2NvbW1vbi9nZXRBbGxNZXRob2RNZW1iZXJOYW1lcy50cyIsIi4uL3NyYy9hb3AvUG9pbnRjdXQudHMiLCIuLi9zcmMvYW9wL2FkZEFzcGVjdC50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9BZnRlci50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9BZnRlclJldHVybi50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9Bcm91bmQudHMiLCIuLi9zcmMvYW9wL2RlY29yYXRvcnMvQmVmb3JlLnRzIiwiLi4vc3JjL2FvcC9kZWNvcmF0b3JzL0ZpbmFsbHkudHMiLCIuLi9zcmMvYW9wL2RlY29yYXRvcnMvVGhyb3duLnRzIiwiLi4vc3JjL2FvcC9kZWNvcmF0b3JzL1VzZUFzcGVjdHMudHMiLCIuLi9zcmMvdXRpbHMvY3JlYXRlRmFjdG9yeVdyYXBwZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURlZmF1bHRWYWx1ZU1hcDxLLCBWPihmYWN0b3J5OiAoa2V5OiBLKSA9PiBWKSB7XG4gICAgY29uc3QgbWFwID0gbmV3IE1hcDxLLCBWPigpO1xuICAgIGNvbnN0IG9yaWdpbkdldCA9IG1hcC5nZXQuYmluZChtYXApO1xuICAgIG1hcC5nZXQgPSBmdW5jdGlvbiAoa2V5OiBLKSB7XG4gICAgICAgIGlmIChtYXAuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiBvcmlnaW5HZXQoa2V5KSBhcyBWO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFZhbHVlID0gZmFjdG9yeShrZXkpO1xuICAgICAgICAgICAgbWFwLnNldChrZXksIGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gbWFwLmdldChrZXkpIGFzIFY7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBtYXAgYXMgRGVmYXVsdFZhbHVlTWFwPEssIFY+O1xufVxuZXhwb3J0IHR5cGUgRGVmYXVsdFZhbHVlTWFwPEssIFY+ID0gT21pdDxNYXA8SywgVj4sICdnZXQnPiAmIHtcbiAgICBnZXQ6IChrZXk6IEspID0+IFY7XG59O1xuIiwiaW1wb3J0IHsgTWV0YWRhdGEsIE1ldGFkYXRhQ2xhc3MsIE1ldGFkYXRhUmVhZGVyIH0gZnJvbSAnLi4vdHlwZXMvTWV0YWRhdGEnO1xuaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcCB9IGZyb20gJy4uL2NvbW1vbi9EZWZhdWx0VmFsdWVNYXAnO1xuXG50eXBlIEFueU1ldGFkYXRhID0gTWV0YWRhdGE8TWV0YWRhdGFSZWFkZXIsIHVua25vd24+O1xudHlwZSBBbnlNZXRhZGF0YUNsYXNzID0gTWV0YWRhdGFDbGFzczxNZXRhZGF0YVJlYWRlciwgdW5rbm93biwgQW55TWV0YWRhdGE+O1xuXG5jb25zdCBtZXRhZGF0YUluc3RhbmNlTWFwID0gY3JlYXRlRGVmYXVsdFZhbHVlTWFwPEFueU1ldGFkYXRhQ2xhc3MsIFNldDxBbnlNZXRhZGF0YT4+KCgpID0+IG5ldyBTZXQoKSk7XG5cbmV4cG9ydCBjbGFzcyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB7XG4gICAgc3RhdGljIGdldE1ldGFkYXRhPFIgZXh0ZW5kcyBNZXRhZGF0YVJlYWRlciwgVCBleHRlbmRzIG9iamVjdCwgTSBleHRlbmRzIE1ldGFkYXRhPFIsIFQ+ID0gTWV0YWRhdGE8UiwgVD4+KFxuICAgICAgICB0YXJnZXQ6IFQsXG4gICAgICAgIG1ldGFkYXRhQ2xhc3M6IE1ldGFkYXRhQ2xhc3M8UiwgVCwgTT5cbiAgICApIHtcbiAgICAgICAgY29uc3Qga2V5ID0gbWV0YWRhdGFDbGFzcy5nZXRSZWZsZWN0S2V5KCk7XG4gICAgICAgIGxldCBtZXRhZGF0YSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoa2V5LCB0YXJnZXQpO1xuICAgICAgICBpZiAoIW1ldGFkYXRhKSB7XG4gICAgICAgICAgICBtZXRhZGF0YSA9IG5ldyBtZXRhZGF0YUNsYXNzKCk7XG4gICAgICAgICAgICBtZXRhZGF0YS5pbml0KHRhcmdldCk7XG4gICAgICAgICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKGtleSwgbWV0YWRhdGEsIHRhcmdldCk7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZVNldCA9IG1ldGFkYXRhSW5zdGFuY2VNYXAuZ2V0KG1ldGFkYXRhQ2xhc3MpO1xuICAgICAgICAgICAgaW5zdGFuY2VTZXQuYWRkKG1ldGFkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWV0YWRhdGEgYXMgTTtcbiAgICB9XG4gICAgc3RhdGljIGdldEFsbEluc3RhbmNlb2Y8TSBleHRlbmRzIEFueU1ldGFkYXRhQ2xhc3M+KG1ldGFkYXRhQ2xhc3M6IE0pIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obWV0YWRhdGFJbnN0YW5jZU1hcC5nZXQobWV0YWRhdGFDbGFzcykpO1xuICAgIH1cbn1cbiIsIi8vIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbmltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luc3RhbmNlU2NvcGUnO1xuaW1wb3J0IHsgSnNTZXJ2aWNlQ2xhc3MgfSBmcm9tICcuLi90eXBlcy9Kc1NlcnZpY2VDbGFzcyc7XG5pbXBvcnQgeyBNZXRhZGF0YSwgTWV0YWRhdGFSZWFkZXIgfSBmcm9tICcuLi90eXBlcy9NZXRhZGF0YSc7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBjcmVhdGVEZWZhdWx0VmFsdWVNYXAgfSBmcm9tICcuLi9jb21tb24vRGVmYXVsdFZhbHVlTWFwJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBNZW1iZXJLZXkgfSBmcm9tICcuLi90eXBlcy9NZW1iZXJLZXknO1xuaW1wb3J0IHsgS2V5T2YgfSBmcm9tICcuLi90eXBlcy9LZXlPZic7XG5pbXBvcnQgeyBJbmplY3Rpb25UeXBlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9JbmplY3Rpb25UeXBlJztcblxuY29uc3QgQ0xBU1NfTUVUQURBVEFfS0VZID0gJ2lvYzpjbGFzcy1tZXRhZGF0YSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFya0luZm8ge1xuICAgIFtrZXk6IHN0cmluZyB8IHN5bWJvbF06IHVua25vd247XG59XG5cbmV4cG9ydCBjbGFzcyBNYXJrSW5mb0NvbnRhaW5lciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBtYXAgPSBjcmVhdGVEZWZhdWx0VmFsdWVNYXA8TWVtYmVyS2V5LCBNYXJrSW5mbz4oKCkgPT4gKHt9KSBhcyBNYXJrSW5mbyk7XG4gICAgZ2V0TWFya0luZm8obWV0aG9kOiBNZW1iZXJLZXkpOiBNYXJrSW5mbyB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcC5nZXQobWV0aG9kKTtcbiAgICB9XG4gICAgbWFyayhtZXRob2Q6IE1lbWJlcktleSwga2V5OiBNZW1iZXJLZXksIHZhbHVlOiB1bmtub3duKSB7XG4gICAgICAgIGNvbnN0IG1hcmtJbmZvID0gdGhpcy5tYXAuZ2V0KG1ldGhvZCk7XG4gICAgICAgIG1hcmtJbmZvW2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgZ2V0TWVtYmVycygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTZXQodGhpcy5tYXAua2V5cygpKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQYXJhbWV0ZXJNYXJrSW5mb0NvbnRhaW5lciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBtYXAgPSBjcmVhdGVEZWZhdWx0VmFsdWVNYXA8TWVtYmVyS2V5LCBSZWNvcmQ8bnVtYmVyLCBNYXJrSW5mbz4+KCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH0pO1xuICAgIGdldE1hcmtJbmZvKG1ldGhvZDogTWVtYmVyS2V5KTogUmVjb3JkPG51bWJlciwgTWFya0luZm8+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwLmdldChtZXRob2QpO1xuICAgIH1cbiAgICBtYXJrKG1ldGhvZDogTWVtYmVyS2V5LCBpbmRleDogbnVtYmVyLCBrZXk6IE1lbWJlcktleSwgdmFsdWU6IHVua25vd24pIHtcbiAgICAgICAgY29uc3QgcGFyYW1zTWFya0luZm8gPSB0aGlzLm1hcC5nZXQobWV0aG9kKTtcbiAgICAgICAgY29uc3QgbWFya0luZm8gPSBwYXJhbXNNYXJrSW5mb1tpbmRleF0gfHwge307XG4gICAgICAgIG1hcmtJbmZvW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgcGFyYW1zTWFya0luZm9baW5kZXhdID0gbWFya0luZm87XG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENsYXNzTWFya0luZm8ge1xuICAgIGN0b3I6IE1hcmtJbmZvO1xuICAgIG1lbWJlcnM6IE1hcmtJbmZvQ29udGFpbmVyO1xuICAgIHBhcmFtczogUGFyYW1ldGVyTWFya0luZm9Db250YWluZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhc3NNZXRhZGF0YVJlYWRlcjxUPiBleHRlbmRzIE1ldGFkYXRhUmVhZGVyIHtcbiAgICBnZXRDbGFzcygpOiBOZXdhYmxlPFQ+O1xuICAgIGdldFNjb3BlKCk6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgZ2V0Q29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlcygpOiBBcnJheTxJbmplY3Rpb25UeXBlPjtcbiAgICBnZXRNZXRob2RzKGxpZmVjeWNsZTogTGlmZWN5Y2xlKTogQXJyYXk8c3RyaW5nIHwgc3ltYm9sPjtcbiAgICBnZXRQcm9wZXJ0eVR5cGVNYXAoKTogTWFwPHN0cmluZyB8IHN5bWJvbCwgSW5qZWN0aW9uVHlwZT47XG4gICAgZ2V0Q3Rvck1hcmtJbmZvKCk6IE1hcmtJbmZvO1xuICAgIGdldEFsbE1hcmtlZE1lbWJlcnMoKTogU2V0PE1lbWJlcktleT47XG4gICAgZ2V0TWVtYmVyc01hcmtJbmZvKG1ldGhvZEtleTogS2V5T2Y8VD4pOiBNYXJrSW5mbztcbiAgICBnZXRQYXJhbWV0ZXJNYXJrSW5mbyhtZXRob2RLZXk6IEtleU9mPFQ+KTogUmVjb3JkPG51bWJlciwgTWFya0luZm8+O1xufVxuXG5leHBvcnQgY2xhc3MgQ2xhc3NNZXRhZGF0YTxUPiBpbXBsZW1lbnRzIE1ldGFkYXRhPENsYXNzTWV0YWRhdGFSZWFkZXI8VD4sIE5ld2FibGU8VD4+IHtcbiAgICBzdGF0aWMgZ2V0UmVmbGVjdEtleSgpIHtcbiAgICAgICAgcmV0dXJuIENMQVNTX01FVEFEQVRBX0tFWTtcbiAgICB9XG4gICAgcHJpdmF0ZSBzY29wZT86IEluc3RhbmNlU2NvcGUgfCBzdHJpbmc7XG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvclBhcmFtZXRlclR5cGVzOiBBcnJheTxJbmplY3Rpb25UeXBlPiA9IFtdO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbGlmZWN5Y2xlTWV0aG9kc01hcDogUmVjb3JkPHN0cmluZyB8IHN5bWJvbCwgU2V0PExpZmVjeWNsZT4+ID0ge307XG4gICAgcHJpdmF0ZSByZWFkb25seSBwcm9wZXJ0eVR5cGVzTWFwID0gbmV3IE1hcDxzdHJpbmcgfCBzeW1ib2wsIEluamVjdGlvblR5cGU+KCk7XG4gICAgcHJpdmF0ZSBjbGF6eiE6IE5ld2FibGU8VD47XG4gICAgcHJpdmF0ZSByZWFkb25seSBtYXJrczogQ2xhc3NNYXJrSW5mbyA9IHtcbiAgICAgICAgY3Rvcjoge30sXG4gICAgICAgIG1lbWJlcnM6IG5ldyBNYXJrSW5mb0NvbnRhaW5lcigpLFxuICAgICAgICBwYXJhbXM6IG5ldyBQYXJhbWV0ZXJNYXJrSW5mb0NvbnRhaW5lcigpXG4gICAgfTtcblxuICAgIHN0YXRpYyBnZXRJbnN0YW5jZTxUPihjdG9yOiBOZXdhYmxlPFQ+KSB7XG4gICAgICAgIHJldHVybiBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICB9XG4gICAgc3RhdGljIGdldFJlYWRlcjxUPihjdG9yOiBOZXdhYmxlPFQ+KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbmNlKGN0b3IpLnJlYWRlcigpO1xuICAgIH1cblxuICAgIGluaXQodGFyZ2V0OiBOZXdhYmxlPFQ+KSB7XG4gICAgICAgIHRoaXMuY2xhenogPSB0YXJnZXQ7XG4gICAgICAgIGNvbnN0IGNvbnN0ciA9IHRhcmdldCBhcyBKc1NlcnZpY2VDbGFzczx1bmtub3duPjtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25zdHIuc2NvcGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U2NvcGUoY29uc3RyLnNjb3BlKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgY29uc3RyLmluamVjdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29uc3QgaW5qZWN0aW9ucyA9IGNvbnN0ci5pbmplY3QoKTtcbiAgICAgICAgICAgIFJlZmxlY3Qub3duS2V5cyhpbmplY3Rpb25zKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWNvcmRQcm9wZXJ0eVR5cGUoa2V5LCBpbmplY3Rpb25zW2tleV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBjb25zdHIubWV0YWRhdGEgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gY29uc3RyLm1ldGFkYXRhKCk7XG4gICAgICAgICAgICBpZiAobWV0YWRhdGEuc2NvcGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNjb3BlKG1ldGFkYXRhLnNjb3BlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGluamVjdGlvbnMgPSBtZXRhZGF0YS5pbmplY3Q7XG4gICAgICAgICAgICBpZiAoaW5qZWN0aW9ucykge1xuICAgICAgICAgICAgICAgIFJlZmxlY3Qub3duS2V5cyhpbmplY3Rpb25zKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVjb3JkUHJvcGVydHlUeXBlKGtleSwgaW5qZWN0aW9uc1trZXldKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1hcmtlcigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGN0b3I6IChrZXk6IHN0cmluZyB8IHN5bWJvbCwgdmFsdWU6IHVua25vd24pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm1hcmtzLmN0b3Jba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1lbWJlcjogKHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wgfCBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBtYXJrOiAoa2V5OiBzdHJpbmcgfCBzeW1ib2wsIHZhbHVlOiB1bmtub3duKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtzLm1lbWJlcnMubWFyayhwcm9wZXJ0eUtleSwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcmFtZXRlcjogKHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBtYXJrOiAoa2V5OiBzdHJpbmcgfCBzeW1ib2wsIHZhbHVlOiB1bmtub3duKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtzLnBhcmFtcy5tYXJrKHByb3BlcnR5S2V5LCBpbmRleCwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBzZXRTY29wZShzY29wZTogSW5zdGFuY2VTY29wZSB8IHN0cmluZykge1xuICAgICAgICB0aGlzLnNjb3BlID0gc2NvcGU7XG4gICAgfVxuICAgIHNldENvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZShpbmRleDogbnVtYmVyLCB0eXBlOiBJbmplY3Rpb25UeXBlKSB7XG4gICAgICAgIHRoaXMuY29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlc1tpbmRleF0gPSB0eXBlO1xuICAgIH1cbiAgICByZWNvcmRQcm9wZXJ0eVR5cGUocHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCwgdHlwZTogSW5qZWN0aW9uVHlwZSkge1xuICAgICAgICB0aGlzLnByb3BlcnR5VHlwZXNNYXAuc2V0KHByb3BlcnR5S2V5LCB0eXBlKTtcbiAgICB9XG4gICAgYWRkTGlmZWN5Y2xlTWV0aG9kKG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCwgbGlmZWN5Y2xlOiBMaWZlY3ljbGUpIHtcbiAgICAgICAgY29uc3QgbGlmZWN5Y2xlcyA9IHRoaXMuZ2V0TGlmZWN5Y2xlcyhtZXRob2ROYW1lKTtcbiAgICAgICAgbGlmZWN5Y2xlcy5hZGQobGlmZWN5Y2xlKTtcbiAgICAgICAgdGhpcy5saWZlY3ljbGVNZXRob2RzTWFwW21ldGhvZE5hbWVdID0gbGlmZWN5Y2xlcztcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRMaWZlY3ljbGVzKG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5saWZlY3ljbGVNZXRob2RzTWFwW21ldGhvZE5hbWVdIHx8IG5ldyBTZXQ8TGlmZWN5Y2xlPigpO1xuICAgIH1cbiAgICBnZXRNZXRob2RzKGxpZmVjeWNsZTogTGlmZWN5Y2xlKTogQXJyYXk8c3RyaW5nIHwgc3ltYm9sPiB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmxpZmVjeWNsZU1ldGhvZHNNYXApLmZpbHRlcihpdCA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaWZlY3ljbGVzID0gdGhpcy5saWZlY3ljbGVNZXRob2RzTWFwW2l0XTtcbiAgICAgICAgICAgIHJldHVybiBsaWZlY3ljbGVzLmhhcyhsaWZlY3ljbGUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRTdXBlckNsYXNzKCkge1xuICAgICAgICBjb25zdCBzdXBlckNsYXNzUHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMuY2xhenopO1xuICAgICAgICBpZiAoIXN1cGVyQ2xhc3NQcm90b3R5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN1cGVyQ2xhc3MgPSBzdXBlckNsYXNzUHJvdG90eXBlLmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dW5rbm93bj47XG4gICAgICAgIGlmIChzdXBlckNsYXNzID09PSB0aGlzLmNsYXp6KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXJDbGFzcztcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRTdXBlckNsYXNzTWV0YWRhdGEoKTogQ2xhc3NNZXRhZGF0YTx1bmtub3duPiB8IG51bGwge1xuICAgICAgICBjb25zdCBzdXBlckNsYXNzID0gdGhpcy5nZXRTdXBlckNsYXNzKCk7XG4gICAgICAgIGlmICghc3VwZXJDbGFzcykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIENsYXNzTWV0YWRhdGEuZ2V0SW5zdGFuY2Uoc3VwZXJDbGFzcyk7XG4gICAgfVxuICAgIHJlYWRlcigpOiBDbGFzc01ldGFkYXRhUmVhZGVyPFQ+IHtcbiAgICAgICAgY29uc3Qgc3VwZXJSZWFkZXIgPSB0aGlzLmdldFN1cGVyQ2xhc3NNZXRhZGF0YSgpPy5yZWFkZXIoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldENsYXNzOiAoKSA9PiB0aGlzLmNsYXp6LFxuICAgICAgICAgICAgZ2V0U2NvcGU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zY29wZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRDb25zdHJ1Y3RvclBhcmFtZXRlclR5cGVzOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlcy5zbGljZSgwKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRNZXRob2RzOiAobGlmZWN5Y2xlOiBMaWZlY3ljbGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdXBlck1ldGhvZHMgPSBzdXBlclJlYWRlcj8uZ2V0TWV0aG9kcyhsaWZlY3ljbGUpIHx8IFtdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNNZXRob2RzID0gdGhpcy5nZXRNZXRob2RzKGxpZmVjeWNsZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChzdXBlck1ldGhvZHMuY29uY2F0KHRoaXNNZXRob2RzKSkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldFByb3BlcnR5VHlwZU1hcDogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1cGVyUHJvcGVydHlUeXBlTWFwID0gc3VwZXJSZWFkZXI/LmdldFByb3BlcnR5VHlwZU1hcCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNQcm9wZXJ0eVR5cGVzTWFwID0gdGhpcy5wcm9wZXJ0eVR5cGVzTWFwO1xuICAgICAgICAgICAgICAgIGlmICghc3VwZXJQcm9wZXJ0eVR5cGVNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXAodGhpc1Byb3BlcnR5VHlwZXNNYXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgTWFwKHN1cGVyUHJvcGVydHlUeXBlTWFwKTtcbiAgICAgICAgICAgICAgICB0aGlzUHJvcGVydHlUeXBlc01hcC5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRDdG9yTWFya0luZm86ICgpOiBNYXJrSW5mbyA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgLi4udGhpcy5tYXJrcy5jdG9yIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0QWxsTWFya2VkTWVtYmVyczogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1cGVyTWV0aG9kcyA9IHN1cGVyUmVhZGVyPy5nZXRBbGxNYXJrZWRNZW1iZXJzKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGhpc01lbWJlcnMgPSB0aGlzLm1hcmtzLm1lbWJlcnMuZ2V0TWVtYmVycygpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyTWV0aG9kcyA/IG5ldyBTZXQoc3VwZXJNZXRob2RzKSA6IG5ldyBTZXQ8TWVtYmVyS2V5PigpO1xuICAgICAgICAgICAgICAgIHRoaXNNZW1iZXJzLmZvckVhY2goaXQgPT4gcmVzdWx0LmFkZChpdCkpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0TWVtYmVyc01hcmtJbmZvOiAoa2V5OiBLZXlPZjxUPik6IE1hcmtJbmZvID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXJrcy5tZW1iZXJzLmdldE1hcmtJbmZvKGtleSBhcyBNZW1iZXJLZXkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldFBhcmFtZXRlck1hcmtJbmZvOiAobWV0aG9kS2V5OiBLZXlPZjxUPik6IFJlY29yZDxudW1iZXIsIE1hcmtJbmZvPiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFya3MucGFyYW1zLmdldE1hcmtJbmZvKG1ldGhvZEtleSBhcyBNZW1iZXJLZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsImV4cG9ydCBlbnVtIEluc3RhbmNlU2NvcGUge1xuICAgIFNJTkdMRVRPTiA9ICdpb2MtcmVzb2x1dGlvbjpjb250YWluZXItc2luZ2xldG9uJyxcbiAgICBUUkFOU0lFTlQgPSAnaW9jLXJlc29sdXRpb246dHJhbnNpZW50JyxcbiAgICBHTE9CQUxfU0hBUkVEX1NJTkdMRVRPTiA9ICdpb2MtcmVzb2x1dGlvbjpnbG9iYWwtc2hhcmVkLXNpbmdsZXRvbidcbn1cbiIsImltcG9ydCB7IFNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi4vdHlwZXMvU2VydmljZUZhY3RvcnknO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHsgSW5zdGFuY2VTY29wZSB9IGZyb20gJy4vSW5zdGFuY2VTY29wZSc7XG5cbmV4cG9ydCBjbGFzcyBTZXJ2aWNlRmFjdG9yeURlZjxUPiB7XG4gICAgc3RhdGljIGNyZWF0ZUZyb21DbGFzc01ldGFkYXRhPFQ+KG1ldGFkYXRhOiBDbGFzc01ldGFkYXRhPFQ+KSB7XG4gICAgICAgIGNvbnN0IGRlZiA9IG5ldyBTZXJ2aWNlRmFjdG9yeURlZihtZXRhZGF0YS5yZWFkZXIoKS5nZXRDbGFzcygpLCBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTik7XG4gICAgICAgIGRlZi5hcHBlbmQoKGNvbnRhaW5lcjogQXBwbGljYXRpb25Db250ZXh0LCBvd25lcjogdW5rbm93bikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWFkZXIgPSBtZXRhZGF0YS5yZWFkZXIoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjbGF6eiA9IHJlYWRlci5nZXRDbGFzcygpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXIuZ2V0SW5zdGFuY2UoY2xhenosIG93bmVyKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGVmO1xuICAgIH1cbiAgICBwdWJsaWMgcmVhZG9ubHkgZmFjdG9yaWVzID0gbmV3IE1hcDxTZXJ2aWNlRmFjdG9yeTxULCB1bmtub3duPiwgSWRlbnRpZmllcltdPigpO1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBpZGVudGlmaWVyIFRoZSB1bmlxdWUgaWRlbnRpZmllciBvZiB0aGlzIGZhY3Rvcmllc1xuICAgICAqIEBwYXJhbSBpc1NpbmdsZSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgaWRlbnRpZmllciBkZWZpbmVzIG9ubHkgb25lIGZhY3RvcnkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyByZWFkb25seSBpZGVudGlmaWVyOiBJZGVudGlmaWVyLFxuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgc2NvcGU6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmdcbiAgICApIHt9XG4gICAgYXBwZW5kKGZhY3Rvcnk6IFNlcnZpY2VGYWN0b3J5PFQsIHVua25vd24+LCBpbmplY3Rpb25zOiBJZGVudGlmaWVyW10gPSBbXSkge1xuICAgICAgICBpZiAodGhpcy5zY29wZSA9PT0gSW5zdGFuY2VTY29wZS5TSU5HTEVUT04gJiYgdGhpcy5mYWN0b3JpZXMuc2l6ZSA9PT0gMSAmJiB0aGlzLmZhY3Rvcmllcy5oYXMoZmFjdG9yeSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLmlkZW50aWZpZXIudG9TdHJpbmcoKX0gaXMgQSBzaW5nbGV0b24hIEJ1dCBtdWx0aXBsZSBmYWN0b3JpZXMgYXJlIGRlZmluZWQhYCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mYWN0b3JpZXMuc2V0KGZhY3RvcnksIGluamVjdGlvbnMpO1xuICAgIH1cbiAgICBwcm9kdWNlKGNvbnRhaW5lcjogQXBwbGljYXRpb25Db250ZXh0LCBvd25lcj86IHVua25vd24pIHtcbiAgICAgICAgLy8gaWYgKHRoaXMuaXNTaW5nbGUpIHtcbiAgICAgICAgLy8gICAgIGNvbnN0IFtmYWN0b3J5LCBpbmplY3Rpb25zXSA9IHRoaXMuZmFjdG9yaWVzLmVudHJpZXMoKS5uZXh0KCkudmFsdWUgYXMgW1NlcnZpY2VGYWN0b3J5PFQsIHVua25vd24+LCBJZGVudGlmaWVyW11dO1xuICAgICAgICAvLyAgICAgY29uc3QgZm4gPSBmYWN0b3J5KGNvbnRhaW5lciwgb3duZXIpO1xuICAgICAgICAvLyAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgLy8gICAgICAgICByZXR1cm4gY29udGFpbmVyLmludm9rZShmbiwge1xuICAgICAgICAvLyAgICAgICAgICAgICBpbmplY3Rpb25zXG4gICAgICAgIC8vICAgICAgICAgfSk7XG4gICAgICAgIC8vICAgICB9O1xuICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAvLyB9XG4gICAgICAgIGNvbnN0IHByb2R1Y2VycyA9IEFycmF5LmZyb20odGhpcy5mYWN0b3JpZXMpLm1hcCgoW2ZhY3RvcnksIGluamVjdGlvbnNdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBmbiA9IGZhY3RvcnkoY29udGFpbmVyLCBvd25lcik7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXIuaW52b2tlKGZuLCB7XG4gICAgICAgICAgICAgICAgICAgIGluamVjdGlvbnNcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHByb2R1Y2Vycy5tYXAoaXQgPT4gaXQoKSk7XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSW5zdGFuY2VTY29wZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vSW5zdGFuY2VTY29wZSc7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeURlZiB9IGZyb20gJy4uL2ZvdW5kYXRpb24vU2VydmljZUZhY3RvcnlEZWYnO1xuaW1wb3J0IHsgRmFjdG9yeUlkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9GYWN0b3J5SWRlbnRpZmllcic7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgdHlwZSB7IFNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi4vdHlwZXMvU2VydmljZUZhY3RvcnknO1xuXG5leHBvcnQgY2xhc3MgRmFjdG9yeVJlY29yZGVyIHtcbiAgICBwcml2YXRlIGZhY3RvcmllcyA9IG5ldyBNYXA8RmFjdG9yeUlkZW50aWZpZXIsIFNlcnZpY2VGYWN0b3J5RGVmPHVua25vd24+PigpO1xuXG4gICAgcHVibGljIGFwcGVuZDxUPihcbiAgICAgICAgaWRlbnRpZmllcjogRmFjdG9yeUlkZW50aWZpZXIsXG4gICAgICAgIGZhY3Rvcnk6IFNlcnZpY2VGYWN0b3J5PFQsIHVua25vd24+LFxuICAgICAgICBpbmplY3Rpb25zOiBJZGVudGlmaWVyW10gPSBbXSxcbiAgICAgICAgc2NvcGU6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmcgPSBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTlxuICAgICkge1xuICAgICAgICBsZXQgZGVmID0gdGhpcy5mYWN0b3JpZXMuZ2V0KGlkZW50aWZpZXIpO1xuICAgICAgICBpZiAoZGVmKSB7XG4gICAgICAgICAgICBkZWYuYXBwZW5kKGZhY3RvcnksIGluamVjdGlvbnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVmID0gbmV3IFNlcnZpY2VGYWN0b3J5RGVmKGlkZW50aWZpZXIsIHNjb3BlKTtcbiAgICAgICAgICAgIGRlZi5hcHBlbmQoZmFjdG9yeSwgaW5qZWN0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mYWN0b3JpZXMuc2V0KGlkZW50aWZpZXIsIGRlZik7XG4gICAgfVxuICAgIHB1YmxpYyBzZXQoaWRlbnRpZmllcjogRmFjdG9yeUlkZW50aWZpZXIsIGZhY3RvcnlEZWY6IFNlcnZpY2VGYWN0b3J5RGVmPHVua25vd24+KSB7XG4gICAgICAgIHRoaXMuZmFjdG9yaWVzLnNldChpZGVudGlmaWVyLCBmYWN0b3J5RGVmKTtcbiAgICB9XG4gICAgcHVibGljIGdldDxUPihpZGVudGlmaWVyOiBGYWN0b3J5SWRlbnRpZmllcik6IFNlcnZpY2VGYWN0b3J5RGVmPFQ+IHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmFjdG9yaWVzLmdldChpZGVudGlmaWVyKSBhcyBTZXJ2aWNlRmFjdG9yeURlZjxUPiB8IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcHVibGljIGl0ZXJhdG9yKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mYWN0b3JpZXMuZW50cmllcygpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE1ldGFkYXRhIH0gZnJvbSAnLi4vdHlwZXMvTWV0YWRhdGEnO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgU2VydmljZUZhY3RvcnkgfSBmcm9tICcuLi90eXBlcy9TZXJ2aWNlRmFjdG9yeSc7XG5pbXBvcnQgeyBGYWN0b3J5SWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0ZhY3RvcnlJZGVudGlmaWVyJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEgfSBmcm9tICcuL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgU2VydmljZUZhY3RvcnlEZWYgfSBmcm9tICcuLi9mb3VuZGF0aW9uL1NlcnZpY2VGYWN0b3J5RGVmJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3IgfSBmcm9tICcuLi90eXBlcy9JbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3InO1xuaW1wb3J0IHsgRmFjdG9yeVJlY29yZGVyIH0gZnJvbSAnLi4vY29tbW9uL0ZhY3RvcnlSZWNvcmRlcic7XG5pbXBvcnQgeyBJbnN0YW5jZVNjb3BlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9JbnN0YW5jZVNjb3BlJztcblxuZXhwb3J0IGludGVyZmFjZSBHbG9iYWxNZXRhZGF0YVJlYWRlciB7XG4gICAgZ2V0Q29tcG9uZW50RmFjdG9yeTxUPihrZXk6IEZhY3RvcnlJZGVudGlmaWVyKTogU2VydmljZUZhY3RvcnlEZWY8VD4gfCB1bmRlZmluZWQ7XG4gICAgZ2V0Q2xhc3NNZXRhZGF0YTxUPihhbGlhc05hbWU6IHN0cmluZyB8IHN5bWJvbCk6IENsYXNzTWV0YWRhdGE8VD4gfCB1bmRlZmluZWQ7XG4gICAgZ2V0SW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcygpOiBBcnJheTxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+Pjtcbn1cbmV4cG9ydCBjbGFzcyBHbG9iYWxNZXRhZGF0YSBpbXBsZW1lbnRzIE1ldGFkYXRhPEdsb2JhbE1ldGFkYXRhUmVhZGVyLCB2b2lkPiB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgSU5TVEFOQ0UgPSBuZXcgR2xvYmFsTWV0YWRhdGEoKTtcbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgICAgIHJldHVybiBHbG9iYWxNZXRhZGF0YS5JTlNUQU5DRTtcbiAgICB9XG4gICAgc3RhdGljIGdldFJlYWRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoKS5yZWFkZXIoKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBjbGFzc0FsaWFzTWV0YWRhdGFNYXAgPSBuZXcgTWFwPHN0cmluZyB8IHN5bWJvbCwgQ2xhc3NNZXRhZGF0YTx1bmtub3duPj4oKTtcbiAgICBwcml2YXRlIGNvbXBvbmVudEZhY3RvcmllcyA9IG5ldyBGYWN0b3J5UmVjb3JkZXIoKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHByb2Nlc3NvckNsYXNzZXM6IFNldDxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+PiA9IG5ldyBTZXQoKTtcbiAgICByZWNvcmRGYWN0b3J5PFQ+KFxuICAgICAgICBzeW1ib2w6IEZhY3RvcnlJZGVudGlmaWVyLFxuICAgICAgICBmYWN0b3J5OiBTZXJ2aWNlRmFjdG9yeTxULCB1bmtub3duPixcbiAgICAgICAgaW5qZWN0aW9uczogSWRlbnRpZmllcltdID0gW10sXG4gICAgICAgIHNjb3BlOiBJbnN0YW5jZVNjb3BlIHwgc3RyaW5nID0gSW5zdGFuY2VTY29wZS5TSU5HTEVUT05cbiAgICApIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnRGYWN0b3JpZXMuYXBwZW5kKHN5bWJvbCwgZmFjdG9yeSwgaW5qZWN0aW9ucywgc2NvcGUpO1xuICAgIH1cbiAgICByZWNvcmRDbGFzc0FsaWFzPFQ+KGFsaWFzTmFtZTogc3RyaW5nIHwgc3ltYm9sLCBtZXRhZGF0YTogQ2xhc3NNZXRhZGF0YTxUPikge1xuICAgICAgICB0aGlzLmNsYXNzQWxpYXNNZXRhZGF0YU1hcC5zZXQoYWxpYXNOYW1lLCBtZXRhZGF0YSk7XG4gICAgfVxuICAgIHJlY29yZFByb2Nlc3NvckNsYXNzKGNsYXp6OiBOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+KSB7XG4gICAgICAgIHRoaXMucHJvY2Vzc29yQ2xhc3Nlcy5hZGQoY2xhenopO1xuICAgIH1cbiAgICBpbml0KCkge1xuICAgICAgICAvLyBQQVNTO1xuICAgIH1cbiAgICByZWFkZXIoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXRDb21wb25lbnRGYWN0b3J5OiA8VD4oa2V5OiBGYWN0b3J5SWRlbnRpZmllcik6IFNlcnZpY2VGYWN0b3J5RGVmPFQ+IHwgdW5kZWZpbmVkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRGYWN0b3JpZXMuZ2V0KGtleSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0Q2xhc3NNZXRhZGF0YTogPFQ+KGFsaWFzTmFtZTogc3RyaW5nIHwgc3ltYm9sKTogQ2xhc3NNZXRhZGF0YTxUPiB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3NBbGlhc01ldGFkYXRhTWFwLmdldChhbGlhc05hbWUpIGFzIENsYXNzTWV0YWRhdGE8VD4gfCB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0SW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlczogKCk6IEFycmF5PE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4+ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLnByb2Nlc3NvckNsYXNzZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsImV4cG9ydCBpbnRlcmZhY2UgRXZhbHVhdGlvbk9wdGlvbnM8TywgRSBleHRlbmRzIHN0cmluZywgQSA9IHVua25vd24+IHtcbiAgICB0eXBlOiBFO1xuICAgIG93bmVyPzogTztcbiAgICBwcm9wZXJ0eU5hbWU/OiBzdHJpbmcgfCBzeW1ib2w7XG4gICAgZXh0ZXJuYWxBcmdzPzogQTtcbn1cblxuZXhwb3J0IGVudW0gRXhwcmVzc2lvblR5cGUge1xuICAgIEVOViA9ICdpbmplY3QtZW52aXJvbm1lbnQtdmFyaWFibGVzJyxcbiAgICBKU09OX1BBVEggPSAnaW5qZWN0LWpzb24tZGF0YScsXG4gICAgQVJHViA9ICdpbmplY3QtYXJndidcbn1cbiIsImV4cG9ydCBjb25zdCBpc05vZGVKcyA9ICgoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHByb2Nlc3MudmVyc2lvbnMubm9kZSAhPT0gbnVsbDtcbiAgICB9IGNhdGNoIChfZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufSkoKTtcbiIsImltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGNsYXNzIEluamVjdGlvblR5cGUge1xuICAgIHN0YXRpYyBvZkNsYXp6KGNsYXp6OiBOZXdhYmxlPHVua25vd24+KSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5qZWN0aW9uVHlwZShjbGF6eik7XG4gICAgfVxuICAgIHN0YXRpYyBvZklkZW50aWZpZXIoaWRlbnRpZmllcjogSWRlbnRpZmllcikge1xuICAgICAgICByZXR1cm4gbmV3IEluamVjdGlvblR5cGUoT2JqZWN0IGFzIHVua25vd24gYXMgTmV3YWJsZTx1bmtub3duPiwgaWRlbnRpZmllcik7XG4gICAgfVxuICAgIHN0YXRpYyBvZihjbGF6ejogTmV3YWJsZTx1bmtub3duPiwgaWRlbnRpZmllcjogSWRlbnRpZmllciA9IGNsYXp6KSB7XG4gICAgICAgIHJldHVybiBuZXcgSW5qZWN0aW9uVHlwZShjbGF6eiwgaWRlbnRpZmllcik7XG4gICAgfVxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyByZWFkb25seSBjbGF6ejogTmV3YWJsZTx1bmtub3duPixcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IGlkZW50aWZpZXI6IElkZW50aWZpZXIgPSBjbGF6elxuICAgICkge31cblxuICAgIGdldCBpc05ld2FibGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkZW50aWZpZXIgPT09IHRoaXMuY2xheno7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9HbG9iYWxNZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IEV4cHJlc3Npb25UeXBlIH0gZnJvbSAnLi4vdHlwZXMvRXZhbHVhdGVPcHRpb25zJztcbmltcG9ydCB7IGlzTm9kZUpzIH0gZnJvbSAnLi4vY29tbW9uL2lzTm9kZUpzJztcbmltcG9ydCB7IEluamVjdGlvblR5cGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luamVjdGlvblR5cGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gVmFsdWU8QSA9IHVua25vd24+KGV4cHJlc3Npb246IHN0cmluZywgdHlwZTogRXhwcmVzc2lvblR5cGUgfCBzdHJpbmcsIGV4dGVybmFsQXJncz86IEEpOiBQcm9wZXJ0eURlY29yYXRvciB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgRXhwcmVzc2lvblR5cGUuRU5WOlxuICAgICAgICBjYXNlIEV4cHJlc3Npb25UeXBlLkFSR1Y6XG4gICAgICAgICAgICBpZiAoIWlzTm9kZUpzKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgXCIke3R5cGV9XCIgZXZhbHVhdG9yIG9ubHkgc3VwcG9ydHMgbm9kZWpzIGVudmlyb25tZW50IWApO1xuICAgICAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gKHRhcmdldDogb2JqZWN0LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sKSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGFyZ2V0LmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgY29uc3QgdmFsdWVfc3ltYm9sID0gU3ltYm9sKCcnKTtcbiAgICAgICAgbWV0YWRhdGEucmVjb3JkUHJvcGVydHlUeXBlKHByb3BlcnR5S2V5LCBJbmplY3Rpb25UeXBlLm9mSWRlbnRpZmllcih2YWx1ZV9zeW1ib2wpKTtcbiAgICAgICAgR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWNvcmRGYWN0b3J5KHZhbHVlX3N5bWJvbCwgKGNvbnRhaW5lciwgb3duZXIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoKSA9PlxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5ldmFsdWF0ZTxzdHJpbmcsIHR5cGVvZiBvd25lciwgQT4oZXhwcmVzc2lvbiBhcyBzdHJpbmcsIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXIsXG4gICAgICAgICAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGV4dGVybmFsQXJnc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgVmFsdWUgfSBmcm9tICcuL1ZhbHVlJztcbmltcG9ydCB7IEV4cHJlc3Npb25UeXBlIH0gZnJvbSAnLi4vdHlwZXMvRXZhbHVhdGVPcHRpb25zJztcblxuZXhwb3J0IGZ1bmN0aW9uIEFyZ3YobmFtZTogc3RyaW5nLCBhcmd2OiBzdHJpbmdbXSA9IHByb2Nlc3MuYXJndikge1xuICAgIHJldHVybiBWYWx1ZShuYW1lLCBFeHByZXNzaW9uVHlwZS5BUkdWLCBhcmd2KTtcbn1cbiIsImltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBBbGlhcyhhbGlhc05hbWU6IHN0cmluZyB8IHN5bWJvbCk6IENsYXNzRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gPFRGdW5jdGlvbiBleHRlbmRzIEZ1bmN0aW9uPih0YXJnZXQ6IFRGdW5jdGlvbikgPT4ge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldCBhcyB1bmtub3duIGFzIE5ld2FibGU8dW5rbm93bj4sIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlY29yZENsYXNzQWxpYXMoYWxpYXNOYW1lLCBtZXRhZGF0YSk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IEFsaWFzIH0gZnJvbSAnLi9BbGlhcyc7XG4vKipcbiAqIEBkZXByZWNhdGVkIHVzZSBAQWxpYXMgaW5zdGVhZFxuICogQHBhcmFtIGFsaWFzTmFtZVxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEJpbmQoYWxpYXNOYW1lOiBzdHJpbmcgfCBzeW1ib2wpOiBDbGFzc0RlY29yYXRvciB7XG4gICAgcmV0dXJuIEFsaWFzKGFsaWFzTmFtZSk7XG59XG4iLCJpbXBvcnQgeyBWYWx1ZSB9IGZyb20gJy4vVmFsdWUnO1xuaW1wb3J0IHsgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gRW52KG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBWYWx1ZShuYW1lLCBFeHByZXNzaW9uVHlwZS5FTlYpO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGlzTnVsbCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIG51bGwge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQ7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNOb3REZWZpbmVkPFQ+KHZhbHVlOiBUIHwgdW5kZWZpbmVkIHwgbnVsbCk6IHZhbHVlIGlzIHVuZGVmaW5lZCB8IG51bGwge1xuICAgIHJldHVybiBpc051bGwodmFsdWUpIHx8IGlzVW5kZWZpbmVkKHZhbHVlKTtcbn1cbiIsImV4cG9ydCBlbnVtIEFkdmljZSB7XG4gICAgQmVmb3JlLFxuICAgIEFmdGVyLFxuICAgIEFyb3VuZCxcbiAgICBBZnRlclJldHVybixcbiAgICBUaHJvd24sXG4gICAgRmluYWxseVxufVxuIiwiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSAqL1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi9BZHZpY2UnO1xuXG50eXBlIEJlZm9yZUhvb2sgPSAoYXJnczogYW55W10pID0+IHZvaWQ7XG50eXBlIEFmdGVySG9vayA9IChhcmdzOiBhbnlbXSkgPT4gdm9pZDtcbnR5cGUgVGhyb3duSG9vayA9IChyZWFzb246IGFueSwgYXJnczogYW55W10pID0+IHZvaWQ7XG50eXBlIEZpbmFsbHlIb29rID0gKGFyZ3M6IGFueVtdKSA9PiB2b2lkO1xudHlwZSBBZnRlclJldHVybkhvb2sgPSAocmV0dXJuVmFsdWU6IGFueSwgYXJnczogYW55W10pID0+IGFueTtcbnR5cGUgQXJvdW5kSG9vayA9ICh0aGlzOiBhbnksIG9yaWdpbmZuOiAoLi4uYXJnczogYW55W10pID0+IHZvaWQsIGFyZ3M6IGFueVtdKSA9PiB2b2lkO1xuXG5leHBvcnQgY2xhc3MgQXNwZWN0VXRpbHMge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgYmVmb3JlSG9va3M6IEFycmF5PEJlZm9yZUhvb2s+ID0gW107XG4gICAgcHJpdmF0ZSByZWFkb25seSBhZnRlckhvb2tzOiBBcnJheTxBZnRlckhvb2s+ID0gW107XG4gICAgcHJpdmF0ZSByZWFkb25seSB0aHJvd25Ib29rczogQXJyYXk8VGhyb3duSG9vaz4gPSBbXTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZpbmFsbHlIb29rczogQXJyYXk8RmluYWxseUhvb2s+ID0gW107XG4gICAgcHJpdmF0ZSByZWFkb25seSBhZnRlclJldHVybkhvb2tzOiBBcnJheTxBZnRlclJldHVybkhvb2s+ID0gW107XG4gICAgcHJpdmF0ZSByZWFkb25seSBhcm91bmRIb29rczogQXJyYXk8QXJvdW5kSG9vaz4gPSBbXTtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGZuOiAoLi4uYXJnczogYW55W10pID0+IGFueSkge31cbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuQmVmb3JlLCBob29rOiBCZWZvcmVIb29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuQWZ0ZXIsIGhvb2s6IEFmdGVySG9vayk6IHZvaWQ7XG4gICAgYXBwZW5kKGFkdmljZTogQWR2aWNlLlRocm93biwgaG9vazogVGhyb3duSG9vayk6IHZvaWQ7XG4gICAgYXBwZW5kKGFkdmljZTogQWR2aWNlLkZpbmFsbHksIGhvb2s6IEZpbmFsbHlIb29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuQWZ0ZXJSZXR1cm4sIGhvb2s6IEFmdGVyUmV0dXJuSG9vayk6IHZvaWQ7XG4gICAgYXBwZW5kKGFkdmljZTogQWR2aWNlLkFyb3VuZCwgaG9vazogQXJvdW5kSG9vayk6IHZvaWQ7XG4gICAgYXBwZW5kKGFkdmljZTogQWR2aWNlLCBob29rOiBGdW5jdGlvbikge1xuICAgICAgICBsZXQgaG9va3NBcnJheTogRnVuY3Rpb25bXSB8IHVuZGVmaW5lZDtcbiAgICAgICAgc3dpdGNoIChhZHZpY2UpIHtcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLkJlZm9yZTpcbiAgICAgICAgICAgICAgICBob29rc0FycmF5ID0gdGhpcy5iZWZvcmVIb29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLkFmdGVyOlxuICAgICAgICAgICAgICAgIGhvb2tzQXJyYXkgPSB0aGlzLmFmdGVySG9va3M7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFkdmljZS5UaHJvd246XG4gICAgICAgICAgICAgICAgaG9va3NBcnJheSA9IHRoaXMudGhyb3duSG9va3M7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFkdmljZS5GaW5hbGx5OlxuICAgICAgICAgICAgICAgIGhvb2tzQXJyYXkgPSB0aGlzLmZpbmFsbHlIb29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLkFmdGVyUmV0dXJuOlxuICAgICAgICAgICAgICAgIGhvb2tzQXJyYXkgPSB0aGlzLmFmdGVyUmV0dXJuSG9va3M7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFkdmljZS5Bcm91bmQ6XG4gICAgICAgICAgICAgICAgaG9va3NBcnJheSA9IHRoaXMuYXJvdW5kSG9va3M7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhvb2tzQXJyYXkpIHtcbiAgICAgICAgICAgIGhvb2tzQXJyYXkucHVzaChob29rKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBleHRyYWN0KCkge1xuICAgICAgICBjb25zdCB7IGFyb3VuZEhvb2tzLCBiZWZvcmVIb29rcywgYWZ0ZXJIb29rcywgYWZ0ZXJSZXR1cm5Ib29rcywgZmluYWxseUhvb2tzLCB0aHJvd25Ib29rcyB9ID0gdGhpcztcbiAgICAgICAgY29uc3QgZm46IHR5cGVvZiB0aGlzLmZuID0gYXJvdW5kSG9va3MucmVkdWNlUmlnaHQoKHByZXYsIG5leHQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAodGhpczogYW55LCAuLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0LmNhbGwodGhpcywgcHJldiwgYXJncyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9LCB0aGlzLmZuKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0aGlzOiBhbnksIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgICAgICBiZWZvcmVIb29rcy5mb3JFYWNoKGhvb2sgPT4ge1xuICAgICAgICAgICAgICAgIGhvb2suY2FsbCh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgaW52b2tlID0gKG9uRXJyb3I6IChyZWFzb246IGFueSkgPT4gdm9pZCwgb25GaW5hbGx5OiAoKSA9PiB2b2lkLCBvbkFmdGVyOiAocmV0dXJuVmFsdWU6IGFueSkgPT4gYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJldHVyblZhbHVlOiBhbnk7XG4gICAgICAgICAgICAgICAgbGV0IGlzUHJvbWlzZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVyblZhbHVlID0gZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXR1cm5WYWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUHJvbWlzZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSA9IHJldHVyblZhbHVlLmNhdGNoKG9uRXJyb3IpLmZpbmFsbHkob25GaW5hbGx5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkZpbmFsbHkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaXNQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXR1cm5WYWx1ZS50aGVuKCh2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb25BZnRlcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvbkFmdGVyKHJldHVyblZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIGludm9rZShcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aHJvd25Ib29rcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvd25Ib29rcy5mb3JFYWNoKGhvb2sgPT4gaG9vay5jYWxsKHRoaXMsIGVycm9yLCBhcmdzKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBmaW5hbGx5SG9va3MuZm9yRWFjaChob29rID0+IGhvb2suY2FsbCh0aGlzLCBhcmdzKSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGFmdGVySG9va3MuZm9yRWFjaChob29rID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2suY2FsbCh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhZnRlclJldHVybkhvb2tzLnJlZHVjZSgocmV0VmFsLCBob29rKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaG9vay5jYWxsKHRoaXMsIHJldFZhbCwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH0sIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9O1xuICAgIH1cbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cbmltcG9ydCB0eXBlIHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi9BZHZpY2UnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQXNwZWN0LCBKb2luUG9pbnQsIFByb2NlZWRpbmdKb2luUG9pbnQgfSBmcm9tICcuL0FzcGVjdCc7XG5pbXBvcnQgeyBBc3BlY3RVdGlscyB9IGZyb20gJy4vQXNwZWN0VXRpbHMnO1xuaW1wb3J0IHsgQXNwZWN0SW5mbyB9IGZyb20gJy4vQXNwZWN0TWV0YWR0YSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBc3BlY3Q8VD4oXG4gICAgYXBwQ3R4OiBBcHBsaWNhdGlvbkNvbnRleHQsXG4gICAgdGFyZ2V0OiBULFxuICAgIG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCxcbiAgICBtZXRob2RGdW5jOiBGdW5jdGlvbixcbiAgICBhc3BlY3RzOiBBc3BlY3RJbmZvW11cbikge1xuICAgIGNvbnN0IGNyZWF0ZUFzcGVjdEN0eCA9IChhZHZpY2U6IEFkdmljZSwgYXJnczogYW55W10sIHJldHVyblZhbHVlOiBhbnkgPSBudWxsLCBlcnJvcjogYW55ID0gbnVsbCk6IEpvaW5Qb2ludCA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0YXJnZXQsXG4gICAgICAgICAgICBtZXRob2ROYW1lLFxuICAgICAgICAgICAgYXJndW1lbnRzOiBhcmdzLFxuICAgICAgICAgICAgcmV0dXJuVmFsdWUsXG4gICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgIGFkdmljZSxcbiAgICAgICAgICAgIGN0eDogYXBwQ3R4XG4gICAgICAgIH07XG4gICAgfTtcbiAgICBjb25zdCBhc3BlY3RVdGlscyA9IG5ldyBBc3BlY3RVdGlscyhtZXRob2RGdW5jIGFzICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTtcbiAgICBjb25zdCBDbGFzc1RvSW5zdGFuY2UgPSAoYXNwZWN0SW5mbzogQXNwZWN0SW5mbykgPT4gYXBwQ3R4LmdldEluc3RhbmNlKGFzcGVjdEluZm8uYXNwZWN0Q2xhc3MpIGFzIEFzcGVjdDtcbiAgICBjb25zdCB0YXJnZXRDb25zdHJ1Y3RvciA9ICh0YXJnZXQgYXMgb2JqZWN0KS5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPFQ+O1xuICAgIGNvbnN0IGFsbE1hdGNoQXNwZWN0cyA9IGFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LnBvaW50Y3V0LnRlc3QodGFyZ2V0Q29uc3RydWN0b3IsIG1ldGhvZE5hbWUpKTtcblxuICAgIGNvbnN0IGJlZm9yZUFkdmljZUFzcGVjdHMgPSBhbGxNYXRjaEFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LmFkdmljZSA9PT0gQWR2aWNlLkJlZm9yZSkubWFwKENsYXNzVG9JbnN0YW5jZSk7XG4gICAgY29uc3QgYWZ0ZXJBZHZpY2VBc3BlY3RzID0gYWxsTWF0Y2hBc3BlY3RzLmZpbHRlcihpdCA9PiBpdC5hZHZpY2UgPT09IEFkdmljZS5BZnRlcikubWFwKENsYXNzVG9JbnN0YW5jZSk7XG4gICAgY29uc3QgdHJ5Q2F0Y2hBZHZpY2VBc3BlY3RzID0gYWxsTWF0Y2hBc3BlY3RzLmZpbHRlcihpdCA9PiBpdC5hZHZpY2UgPT09IEFkdmljZS5UaHJvd24pLm1hcChDbGFzc1RvSW5zdGFuY2UpO1xuICAgIGNvbnN0IHRyeUZpbmFsbHlBZHZpY2VBc3BlY3RzID0gYWxsTWF0Y2hBc3BlY3RzLmZpbHRlcihpdCA9PiBpdC5hZHZpY2UgPT09IEFkdmljZS5GaW5hbGx5KS5tYXAoQ2xhc3NUb0luc3RhbmNlKTtcbiAgICBjb25zdCBhZnRlclJldHVybkFkdmljZUFzcGVjdHMgPSBhbGxNYXRjaEFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LmFkdmljZSA9PT0gQWR2aWNlLkFmdGVyUmV0dXJuKS5tYXAoQ2xhc3NUb0luc3RhbmNlKTtcbiAgICBjb25zdCBhcm91bmRBZHZpY2VBc3BlY3RzID0gYWxsTWF0Y2hBc3BlY3RzLmZpbHRlcihpdCA9PiBpdC5hZHZpY2UgPT09IEFkdmljZS5Bcm91bmQpLm1hcChDbGFzc1RvSW5zdGFuY2UpO1xuXG4gICAgaWYgKGJlZm9yZUFkdmljZUFzcGVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLkJlZm9yZSwgKGFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBqb2luUG9pbnQgPSBjcmVhdGVBc3BlY3RDdHgoQWR2aWNlLkJlZm9yZSwgYXJncyk7XG4gICAgICAgICAgICBiZWZvcmVBZHZpY2VBc3BlY3RzLmZvckVhY2goYXNwZWN0ID0+IHtcbiAgICAgICAgICAgICAgICBhc3BlY3QuZXhlY3V0ZShqb2luUG9pbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoYWZ0ZXJBZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXNwZWN0VXRpbHMuYXBwZW5kKEFkdmljZS5BZnRlciwgKGFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBqb2luUG9pbnQgPSBjcmVhdGVBc3BlY3RDdHgoQWR2aWNlLkFmdGVyLCBhcmdzKTtcbiAgICAgICAgICAgIGFmdGVyQWR2aWNlQXNwZWN0cy5mb3JFYWNoKGFzcGVjdCA9PiB7XG4gICAgICAgICAgICAgICAgYXNwZWN0LmV4ZWN1dGUoam9pblBvaW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHRyeUNhdGNoQWR2aWNlQXNwZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFzcGVjdFV0aWxzLmFwcGVuZChBZHZpY2UuVGhyb3duLCAoZXJyb3IsIGFyZ3MpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGpvaW5Qb2ludCA9IGNyZWF0ZUFzcGVjdEN0eChBZHZpY2UuVGhyb3duLCBhcmdzLCBudWxsLCBlcnJvcik7XG4gICAgICAgICAgICB0cnlDYXRjaEFkdmljZUFzcGVjdHMuZm9yRWFjaChhc3BlY3QgPT4ge1xuICAgICAgICAgICAgICAgIGFzcGVjdC5leGVjdXRlKGpvaW5Qb2ludCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRyeUZpbmFsbHlBZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXNwZWN0VXRpbHMuYXBwZW5kKEFkdmljZS5GaW5hbGx5LCAoYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGpvaW5Qb2ludCA9IGNyZWF0ZUFzcGVjdEN0eChBZHZpY2UuRmluYWxseSwgYXJncyk7XG4gICAgICAgICAgICB0cnlGaW5hbGx5QWR2aWNlQXNwZWN0cy5mb3JFYWNoKGFzcGVjdCA9PiB7XG4gICAgICAgICAgICAgICAgYXNwZWN0LmV4ZWN1dGUoam9pblBvaW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoYWZ0ZXJSZXR1cm5BZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXNwZWN0VXRpbHMuYXBwZW5kKEFkdmljZS5BZnRlclJldHVybiwgKHJldHVyblZhbHVlLCBhcmdzKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYWZ0ZXJSZXR1cm5BZHZpY2VBc3BlY3RzLnJlZHVjZSgocHJldlJldHVyblZhbHVlLCBhc3BlY3QpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBqb2luUG9pbnQgPSBjcmVhdGVBc3BlY3RDdHgoQWR2aWNlLkFmdGVyUmV0dXJuLCBhcmdzLCByZXR1cm5WYWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFzcGVjdC5leGVjdXRlKGpvaW5Qb2ludCk7XG4gICAgICAgICAgICB9LCByZXR1cm5WYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChhcm91bmRBZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXJvdW5kQWR2aWNlQXNwZWN0cy5mb3JFYWNoKGFzcGVjdCA9PiB7XG4gICAgICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLkFyb3VuZCwgKG9yaWdpbkZuLCBhcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgam9pblBvaW50ID0gY3JlYXRlQXNwZWN0Q3R4KEFkdmljZS5Bcm91bmQsIGFyZ3MsIG51bGwpIGFzIFByb2NlZWRpbmdKb2luUG9pbnQ7XG4gICAgICAgICAgICAgICAgam9pblBvaW50LnByb2NlZWQgPSAoanBBcmdzID0gYXJncykgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luRm4oanBBcmdzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBhc3BlY3QuZXhlY3V0ZShqb2luUG9pbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBhc3BlY3RVdGlscy5leHRyYWN0KCk7XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG5pbXBvcnQgeyBBc3BlY3QsIEpvaW5Qb2ludCB9IGZyb20gJy4vQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbXBvbmVudE1ldGhvZEFzcGVjdCBpbXBsZW1lbnRzIEFzcGVjdCB7XG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUoY2xheno6IE5ld2FibGU8dW5rbm93bj4sIG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCk6IE5ld2FibGU8QXNwZWN0PiB7XG4gICAgICAgIHJldHVybiBjbGFzcyBDb21wb25lbnRNZXRob2RBc3BlY3RJbXBsIGV4dGVuZHMgQ29tcG9uZW50TWV0aG9kQXNwZWN0IHtcbiAgICAgICAgICAgIGV4ZWN1dGUoanA6IEpvaW5Qb2ludCk6IGFueSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXNwZWN0SW5zdGFuY2UgPSBqcC5jdHguZ2V0SW5zdGFuY2UoY2xhenopIGFzIGFueTtcbiAgICAgICAgICAgICAgICBjb25zdCBmdW5jID0gYXNwZWN0SW5zdGFuY2VbbWV0aG9kTmFtZV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLmFzcGVjdEluc3RhbmNlLCBqcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIHByb3RlY3RlZCBhc3BlY3RJbnN0YW5jZSE6IGFueTtcbiAgICBhYnN0cmFjdCBleGVjdXRlKGN0eDogSm9pblBvaW50KTogYW55O1xufVxuIiwiaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IE1ldGFkYXRhLCBNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4uL3R5cGVzL01ldGFkYXRhJztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4vQWR2aWNlJztcbmltcG9ydCB7IENvbXBvbmVudE1ldGhvZEFzcGVjdCB9IGZyb20gJy4vQ29tcG9uZW50TWV0aG9kQXNwZWN0JztcbmltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi9Qb2ludGN1dCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXNwZWN0SW5mbyB7XG4gICAgYXNwZWN0Q2xhc3M6IE5ld2FibGU8dW5rbm93bj47XG4gICAgbWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sO1xuICAgIHBvaW50Y3V0OiBQb2ludGN1dDtcbiAgICBhZHZpY2U6IEFkdmljZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBc3BlY3RNZXRhZGF0YVJlYWRlciBleHRlbmRzIE1ldGFkYXRhUmVhZGVyIHtcbiAgICBnZXRBc3BlY3RzKGpwSWRlbnRpZmllcjogSWRlbnRpZmllciwganBNZW1iZXI6IHN0cmluZyB8IHN5bWJvbCk6IEFzcGVjdEluZm9bXTtcbn1cblxuZXhwb3J0IGNsYXNzIEFzcGVjdE1ldGFkYXRhIGltcGxlbWVudHMgTWV0YWRhdGE8QXNwZWN0TWV0YWRhdGFSZWFkZXIsIHZvaWQ+IHtcbiAgICBwcml2YXRlIHN0YXRpYyBJTlNUQU5DRSA9IG5ldyBBc3BlY3RNZXRhZGF0YSgpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgYXNwZWN0czogQXNwZWN0SW5mb1tdID0gW107XG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICAgICAgcmV0dXJuIEFzcGVjdE1ldGFkYXRhLklOU1RBTkNFO1xuICAgIH1cbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvL1xuICAgIH1cbiAgICBpbml0KCk6IHZvaWQge1xuICAgICAgICAvL1xuICAgIH1cbiAgICBhcHBlbmQoY29tcG9uZW50QXNwZWN0Q2xhc3M6IE5ld2FibGU8dW5rbm93bj4sIG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCwgYWR2aWNlOiBBZHZpY2UsIHBvaW50Y3V0OiBQb2ludGN1dCkge1xuICAgICAgICBjb25zdCBBc3BlY3RDbGFzcyA9IENvbXBvbmVudE1ldGhvZEFzcGVjdC5jcmVhdGUoY29tcG9uZW50QXNwZWN0Q2xhc3MsIG1ldGhvZE5hbWUpO1xuICAgICAgICB0aGlzLmFzcGVjdHMucHVzaCh7XG4gICAgICAgICAgICBhc3BlY3RDbGFzczogQXNwZWN0Q2xhc3MsXG4gICAgICAgICAgICBtZXRob2ROYW1lLFxuICAgICAgICAgICAgcG9pbnRjdXQsXG4gICAgICAgICAgICBhZHZpY2VcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlYWRlcigpOiBBc3BlY3RNZXRhZGF0YVJlYWRlciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXRBc3BlY3RzOiAoanBJZGVudGlmaWVyLCBqcE1lbWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzcGVjdHMuZmlsdGVyKCh7IHBvaW50Y3V0IH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBvaW50Y3V0LnRlc3QoanBJZGVudGlmaWVyLCBqcE1lbWJlcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiY29uc3QgUFJPWFlfVEFSR0VUX01BUCA9IG5ldyBXZWFrTWFwPG9iamVjdCwgb2JqZWN0PigpO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVjb3JkUHJveHlUYXJnZXQ8VCBleHRlbmRzIG9iamVjdD4ocHJveHk6IFQsIHRhcmdldDogVCk6IHZvaWQge1xuICAgIFBST1hZX1RBUkdFVF9NQVAuc2V0KHByb3h5LCB0YXJnZXQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJveHlUYXJnZXQ8VCBleHRlbmRzIG9iamVjdD4ocHJveHk6IFQpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gUFJPWFlfVEFSR0VUX01BUC5nZXQocHJveHkpIGFzIFQgfCB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Byb3h5T2Y8VCBleHRlbmRzIG9iamVjdD4ocHJveHk6IFQsIHRhcmdldDogVCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBQUk9YWV9UQVJHRVRfTUFQLmdldChwcm94eSkgPT09IHRhcmdldDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc1Byb3h5UmVjb3JkKG9iajogb2JqZWN0KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIFBST1hZX1RBUkdFVF9NQVAuaGFzKG9iaik7XG59XG4iLCJpbXBvcnQgeyBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yJztcbmltcG9ydCB0eXBlIHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHsgY3JlYXRlQXNwZWN0IH0gZnJvbSAnLi9jcmVhdGVBc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQXNwZWN0TWV0YWRhdGEgfSBmcm9tICcuL0FzcGVjdE1ldGFkdGEnO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgcmVjb3JkUHJveHlUYXJnZXQgfSBmcm9tICcuLi9jb21tb24vUHJveHlUYXJnZXRSZWNvcmRlcic7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3IgaW1wbGVtZW50cyBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yIHtcbiAgICBzdGF0aWMgY3JlYXRlKGFwcEN0eDogQXBwbGljYXRpb25Db250ZXh0KTogTmV3YWJsZTxBT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3I+IHtcbiAgICAgICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgQU9QSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yIHtcbiAgICAgICAgICAgIHByb3RlY3RlZCByZWFkb25seSBhcHBDdHg6IEFwcGxpY2F0aW9uQ29udGV4dCA9IGFwcEN0eDtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IGFwcEN0eDogQXBwbGljYXRpb25Db250ZXh0O1xuICAgIGFmdGVySW5zdGFudGlhdGlvbjxUIGV4dGVuZHMgb2JqZWN0PihpbnN0YW5jZTogVCk6IFQge1xuICAgICAgICBpZiAoIWluc3RhbmNlIHx8IHR5cGVvZiBpbnN0YW5jZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjbGF6eiA9IGluc3RhbmNlLmNvbnN0cnVjdG9yO1xuXG4gICAgICAgIGNvbnN0IGFzcGVjdE1ldGFkYXRhID0gQXNwZWN0TWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWFkZXIoKTtcbiAgICAgICAgLy8gY29uc3QgdXNlQXNwZWN0TWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShjbGF6eiwgQU9QQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgIC8vIGNvbnN0IHVzZUFzcGVjdE1ldGFkYXRhUmVhZGVyID0gdXNlQXNwZWN0TWV0YWRhdGEucmVhZGVyKCk7XG4gICAgICAgIC8vIGNvbnN0IHVzZUFzcGVjdHNNYXAgPSB1c2VBc3BlY3RNZXRhZGF0YVJlYWRlci5nZXRBc3BlY3RzKCk7XG4gICAgICAgIC8vIGlmICh1c2VBc3BlY3RzTWFwLnNpemUgPT09IDApIHtcbiAgICAgICAgLy8gICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIGNvbnN0IGFzcGVjdFN0b3JlTWFwID0gbmV3IFdlYWtNYXA8b2JqZWN0LCBNYXA8c3RyaW5nIHwgc3ltYm9sLCBGdW5jdGlvbj4+KCk7XG4gICAgICAgIGFzcGVjdFN0b3JlTWFwLnNldChpbnN0YW5jZSwgbmV3IE1hcDxzdHJpbmcgfCBzeW1ib2wsIEZ1bmN0aW9uPigpKTtcblxuICAgICAgICBjb25zdCBwcm94eVJlc3VsdCA9IG5ldyBQcm94eShpbnN0YW5jZSwge1xuICAgICAgICAgICAgZ2V0OiAodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpblZhbHVlID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcik7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChwcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NvbnN0cnVjdG9yJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5WYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCkgJiYgdHlwZW9mIG9yaWdpblZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzcGVjdE1hcCA9IGFzcGVjdFN0b3JlTWFwLmdldChpbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghYXNwZWN0TWFwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFzcGVjdE1hcC5oYXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhc3BlY3RNYXAuZ2V0KHByb3ApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzcGVjdHNPZk1ldGhvZCA9IGFzcGVjdE1ldGFkYXRhLmdldEFzcGVjdHMoY2xhenogYXMgSWRlbnRpZmllciwgcHJvcCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzcGVjdEZuID0gY3JlYXRlQXNwZWN0KHRoaXMuYXBwQ3R4LCB0YXJnZXQsIHByb3AsIG9yaWdpblZhbHVlLCBhc3BlY3RzT2ZNZXRob2QpO1xuICAgICAgICAgICAgICAgICAgICBhc3BlY3RNYXAuc2V0KHByb3AsIGFzcGVjdEZuKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFzcGVjdEZuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Rlc3QnKSB7XG4gICAgICAgICAgICByZWNvcmRQcm94eVRhcmdldChwcm94eVJlc3VsdCwgaW5zdGFuY2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHByb3h5UmVzdWx0O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEV2YWx1YXRvciB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRvcic7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5cbmV4cG9ydCBjbGFzcyBBcmd2RXZhbHVhdG9yIGltcGxlbWVudHMgRXZhbHVhdG9yIHtcbiAgICBldmFsPFQsIEEgPSBzdHJpbmdbXT4oY29udGV4dDogQXBwbGljYXRpb25Db250ZXh0LCBleHByZXNzaW9uOiBzdHJpbmcsIGFyZ3M/OiBBKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IGFyZ3YgPSBhcmdzIHx8IHByb2Nlc3MuYXJndjtcblxuICAgICAgICBjb25zdCBtaW5pbWlzdCA9IHJlcXVpcmUoJ21pbmltaXN0Jyk7XG4gICAgICAgIGNvbnN0IG1hcCA9IG1pbmltaXN0KGFyZ3YpO1xuICAgICAgICByZXR1cm4gbWFwW2V4cHJlc3Npb25dO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEV2YWx1YXRvciB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRvcic7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5cbmV4cG9ydCBjbGFzcyBFbnZpcm9ubWVudEV2YWx1YXRvciBpbXBsZW1lbnRzIEV2YWx1YXRvciB7XG4gICAgZXZhbDxUPihjb250ZXh0OiBBcHBsaWNhdGlvbkNvbnRleHQsIGV4cHJlc3Npb246IHN0cmluZyk6IFQgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gcHJvY2Vzcy5lbnZbZXhwcmVzc2lvbl0gYXMgVCB8IHVuZGVmaW5lZDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBFdmFsdWF0b3IgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0b3InO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHsgSlNPTkRhdGEgfSBmcm9tICcuLi90eXBlcy9KU09ORGF0YSc7XG5cbmV4cG9ydCBjbGFzcyBKU09ORGF0YUV2YWx1YXRvciBpbXBsZW1lbnRzIEV2YWx1YXRvciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBuYW1lc3BhY2VEYXRhTWFwID0gbmV3IE1hcDxzdHJpbmcsIEpTT05EYXRhPigpO1xuICAgIGV2YWw8VD4oY29udGV4dDogQXBwbGljYXRpb25Db250ZXh0LCBleHByZXNzaW9uOiBzdHJpbmcpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc3QgY29sb25JbmRleCA9IGV4cHJlc3Npb24uaW5kZXhPZignOicpO1xuICAgICAgICBpZiAoY29sb25JbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW5jb3JyZWN0IGV4cHJlc3Npb24sIG5hbWVzcGFjZSBub3Qgc3BlY2lmaWVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmFtZXNwYWNlID0gZXhwcmVzc2lvbi5zdWJzdHJpbmcoMCwgY29sb25JbmRleCk7XG4gICAgICAgIGNvbnN0IGV4cCA9IGV4cHJlc3Npb24uc3Vic3RyaW5nKGNvbG9uSW5kZXggKyAxKTtcbiAgICAgICAgaWYgKCF0aGlzLm5hbWVzcGFjZURhdGFNYXAuaGFzKG5hbWVzcGFjZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW5jb3JyZWN0IGV4cHJlc3Npb246IG5hbWVzcGFjZSBub3QgcmVjb3JkZWQ6IFwiJHtuYW1lc3BhY2V9XCJgKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5uYW1lc3BhY2VEYXRhTWFwLmdldChuYW1lc3BhY2UpIGFzIEpTT05EYXRhO1xuICAgICAgICByZXR1cm4gcnVuRXhwcmVzc2lvbihleHAsIGRhdGEgYXMgb2JqZWN0KTtcbiAgICB9XG4gICAgcmVjb3JkRGF0YShuYW1lc3BhY2U6IHN0cmluZywgZGF0YTogSlNPTkRhdGEpIHtcbiAgICAgICAgdGhpcy5uYW1lc3BhY2VEYXRhTWFwLnNldChuYW1lc3BhY2UsIGRhdGEpO1xuICAgIH1cbiAgICBnZXRKU09ORGF0YShuYW1lc3BhY2U6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lc3BhY2VEYXRhTWFwLmdldChuYW1lc3BhY2UpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcnVuRXhwcmVzc2lvbihleHByZXNzaW9uOiBzdHJpbmcsIHJvb3RDb250ZXh0OiBvYmplY3QpIHtcbiAgICBjb25zdCBmbiA9IGNvbXBpbGVFeHByZXNzaW9uKGV4cHJlc3Npb24pO1xuICAgIHJldHVybiBmbihyb290Q29udGV4dCk7XG59XG5cbmZ1bmN0aW9uIGNvbXBpbGVFeHByZXNzaW9uKGV4cHJlc3Npb246IHN0cmluZykge1xuICAgIGlmIChleHByZXNzaW9uLmluZGV4T2YoJywnKSA+IC0xKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW5jb3JyZWN0IGV4cHJlc3Npb24gc3ludGF4LCBUaGUgJywnIGlzIG5vdCBhbGxvd2VkIGluIGV4cHJlc3Npb246IFwiJHtleHByZXNzaW9ufVwiYCk7XG4gICAgfVxuICAgIGlmIChleHByZXNzaW9uLmxlbmd0aCA+IDEyMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgSW5jb3JyZWN0IGV4cHJlc3Npb24gc3ludGF4LCBleHByZXNzaW9uIGxlbmd0aCBjYW5ub3QgYmUgZ3JlYXRlciB0aGFuIDEyMCwgYnV0IGFjdHVhbDogJHtleHByZXNzaW9uLmxlbmd0aH1gXG4gICAgICAgICk7XG4gICAgfVxuICAgIGlmICgvXFwoLio/XFwpLy50ZXN0KGV4cHJlc3Npb24pKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW5jb3JyZWN0IGV4cHJlc3Npb24gc3ludGF4LCBwYXJlbnRoZXNlcyBhcmUgbm90IGFsbG93ZWQgaW4gZXhwcmVzc2lvbjogXCIke2V4cHJlc3Npb259XCJgKTtcbiAgICB9XG4gICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24udHJpbSgpO1xuICAgIGlmIChleHByZXNzaW9uID09PSAnJykge1xuICAgICAgICByZXR1cm4gKHJvb3Q6IG9iamVjdCkgPT4gcm9vdDtcbiAgICB9XG5cbiAgICBjb25zdCByb290VmFyTmFtZSA9IHZhck5hbWUoJ2NvbnRleHQnKTtcbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKFxuICAgICAgICByb290VmFyTmFtZSxcbiAgICAgICAgYFxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiAke3Jvb3RWYXJOYW1lfS4ke2V4cHJlc3Npb259O1xuICAgICAgICB9IGNhdGNoKGVycm9yKSB7IHRocm93IGVycm9yIH1cbiAgICBgXG4gICAgKTtcbn1cbmxldCBWQVJfU0VRVUVOQ0UgPSBEYXRlLm5vdygpO1xuZnVuY3Rpb24gdmFyTmFtZShwcmVmaXg6IHN0cmluZykge1xuICAgIHJldHVybiBwcmVmaXggKyAnJyArIChWQVJfU0VRVUVOQ0UrKykudG9TdHJpbmcoMTYpO1xufVxuIiwiaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhIH0gZnJvbSAnLi4vdHlwZXMvTWV0YWRhdGEnO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgSW5zdGFuY2VTY29wZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vSW5zdGFuY2VTY29wZSc7XG5cbmV4cG9ydCBjb25zdCBGVU5DVElPTl9NRVRBREFUQV9LRVkgPSBTeW1ib2woJ2lvYzpmdW5jdGlvbi1tZXRhZGF0YScpO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZ1bmN0aW9uTWV0YWRhdGFSZWFkZXIge1xuICAgIGdldFBhcmFtZXRlcnMoKTogSWRlbnRpZmllcltdO1xuICAgIGlzRmFjdG9yeSgpOiBib29sZWFuO1xuICAgIGdldFNjb3BlKCk6IEluc3RhbmNlU2NvcGUgfCB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBGdW5jdGlvbk1ldGFkYXRhIGltcGxlbWVudHMgTWV0YWRhdGE8RnVuY3Rpb25NZXRhZGF0YVJlYWRlciwgRnVuY3Rpb24+IHtcbiAgICBzdGF0aWMgZ2V0UmVmbGVjdEtleSgpIHtcbiAgICAgICAgcmV0dXJuIEZVTkNUSU9OX01FVEFEQVRBX0tFWTtcbiAgICB9XG4gICAgcHJpdmF0ZSByZWFkb25seSBwYXJhbWV0ZXJzOiBJZGVudGlmaWVyW10gPSBbXTtcbiAgICBwcml2YXRlIHNjb3BlPzogSW5zdGFuY2VTY29wZTtcbiAgICBwcml2YXRlIGlzRmFjdG9yeTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHNldFBhcmFtZXRlclR5cGUoaW5kZXg6IG51bWJlciwgc3ltYm9sOiBJZGVudGlmaWVyKSB7XG4gICAgICAgIHRoaXMucGFyYW1ldGVyc1tpbmRleF0gPSBzeW1ib2w7XG4gICAgfVxuICAgIHNldFNjb3BlKHNjb3BlOiBJbnN0YW5jZVNjb3BlKSB7XG4gICAgICAgIHRoaXMuc2NvcGUgPSBzY29wZTtcbiAgICB9XG4gICAgc2V0SXNGYWN0b3J5KGlzRmFjdG9yeTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLmlzRmFjdG9yeSA9IGlzRmFjdG9yeTtcbiAgICB9XG4gICAgaW5pdCgpIHtcbiAgICAgICAgLy8gUEFTUztcbiAgICB9XG4gICAgcmVhZGVyKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0UGFyYW1ldGVyczogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmFtZXRlcnMuc2xpY2UoMCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaXNGYWN0b3J5OiAoKSA9PiB0aGlzLmlzRmFjdG9yeSxcbiAgICAgICAgICAgIGdldFNjb3BlOiAoKSA9PiB0aGlzLnNjb3BlXG4gICAgICAgIH07XG4gICAgfVxufVxuIiwibGV0IGluc3RhbmNlU2VyaWFsTm8gPSAtMTtcblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudEluc3RhbmNlV3JhcHBlciB7XG4gICAgcHVibGljIHJlYWRvbmx5IHNlcmlhbE5vID0gKytpbnN0YW5jZVNlcmlhbE5vO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGluc3RhbmNlOiB1bmtub3duKSB7fVxuXG4gICAgcHVibGljIGNvbXBhcmVUbyhvdGhlcjogQ29tcG9uZW50SW5zdGFuY2VXcmFwcGVyKTogLTEgfCAwIHwgMSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlcmlhbE5vID4gb3RoZXIuc2VyaWFsTm8gPyAtMSA6IHRoaXMuc2VyaWFsTm8gPCBvdGhlci5zZXJpYWxObyA/IDEgOiAwO1xuICAgIH1cbn1cbiIsImV4cG9ydCBlbnVtIExpZmVjeWNsZSB7XG4gICAgUFJFX0lOSkVDVCA9ICdpb2Mtc2NvcGU6cHJlLWluamVjdCcsXG4gICAgUE9TVF9JTkpFQ1QgPSAnaW9jLXNjb3BlOnBvc3QtaW5qZWN0JyxcbiAgICBQUkVfREVTVFJPWSA9ICdpb2Mtc2NvcGU6cHJlLWRlc3Ryb3knXG59XG4iLCJpbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IExpZmVjeWNsZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vTGlmZWN5Y2xlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGludm9rZVByZURlc3Ryb3koaW5zdGFuY2U6IHVua25vd24pIHtcbiAgICBjb25zdCBjbGF6eiA9IGluc3RhbmNlPy5jb25zdHJ1Y3RvcjtcbiAgICBpZiAoIWNsYXp6KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShjbGF6eiwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgY29uc3QgcHJlRGVzdHJveU1ldGhvZHMgPSBtZXRhZGF0YS5nZXRNZXRob2RzKExpZmVjeWNsZS5QUkVfREVTVFJPWSk7XG4gICAgcHJlRGVzdHJveU1ldGhvZHMuZm9yRWFjaChtZXRob2ROYW1lID0+IHtcbiAgICAgICAgY29uc3QgbWV0aG9kID0gY2xhenoucHJvdG90eXBlW21ldGhvZE5hbWVdO1xuICAgICAgICBpZiAodHlwZW9mIG1ldGhvZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbWV0aG9kLmFwcGx5KGluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuIiwiaW1wb3J0IHsgR2V0SW5zdGFuY2VPcHRpb25zLCBJbnN0YW5jZVJlc29sdXRpb24sIFNhdmVJbnN0YW5jZU9wdGlvbnMgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZVJlc29sdXRpb24nO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgQ29tcG9uZW50SW5zdGFuY2VXcmFwcGVyIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9Db21wb25lbnRJbnN0YW5jZVdyYXBwZXInO1xuaW1wb3J0IHsgaW52b2tlUHJlRGVzdHJveSB9IGZyb20gJy4uL2NvbW1vbi9pbnZva2VQcmVEZXN0cm95JztcblxuZXhwb3J0IGNsYXNzIFNpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbiBpbXBsZW1lbnRzIEluc3RhbmNlUmVzb2x1dGlvbiB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBJTlNUQU5DRV9NQVAgPSBuZXcgTWFwPElkZW50aWZpZXIsIENvbXBvbmVudEluc3RhbmNlV3JhcHBlcj4oKTtcbiAgICBnZXRJbnN0YW5jZTxULCBPPihvcHRpb25zOiBHZXRJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiBUIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuSU5TVEFOQ0VfTUFQLmdldChvcHRpb25zLmlkZW50aWZpZXIpPy5pbnN0YW5jZSBhcyBUO1xuICAgIH1cblxuICAgIHNhdmVJbnN0YW5jZTxULCBPPihvcHRpb25zOiBTYXZlSW5zdGFuY2VPcHRpb25zPFQsIE8+KTogdm9pZCB7XG4gICAgICAgIHRoaXMuSU5TVEFOQ0VfTUFQLnNldChvcHRpb25zLmlkZW50aWZpZXIsIG5ldyBDb21wb25lbnRJbnN0YW5jZVdyYXBwZXIob3B0aW9ucy5pbnN0YW5jZSkpO1xuICAgIH1cblxuICAgIHNob3VsZEdlbmVyYXRlPFQsIE8+KG9wdGlvbnM6IEdldEluc3RhbmNlT3B0aW9uczxULCBPPik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gIXRoaXMuSU5TVEFOQ0VfTUFQLmhhcyhvcHRpb25zLmlkZW50aWZpZXIpO1xuICAgIH1cbiAgICBkZXN0cm95KCkge1xuICAgICAgICBjb25zdCBpbnN0YW5jZVdyYXBwZXJzID0gQXJyYXkuZnJvbSh0aGlzLklOU1RBTkNFX01BUC52YWx1ZXMoKSk7XG4gICAgICAgIGluc3RhbmNlV3JhcHBlcnMuc29ydCgoYSwgYikgPT4gYS5jb21wYXJlVG8oYikpO1xuICAgICAgICBpbnN0YW5jZVdyYXBwZXJzLmZvckVhY2goaW5zdGFuY2VXcmFwcGVyID0+IHtcbiAgICAgICAgICAgIGludm9rZVByZURlc3Ryb3koaW5zdGFuY2VXcmFwcGVyLmluc3RhbmNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuSU5TVEFOQ0VfTUFQLmNsZWFyKCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgR2V0SW5zdGFuY2VPcHRpb25zLCBJbnN0YW5jZVJlc29sdXRpb24sIFNhdmVJbnN0YW5jZU9wdGlvbnMgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZVJlc29sdXRpb24nO1xuaW1wb3J0IHsgU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uIH0gZnJvbSAnLi9TaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24nO1xuXG5jb25zdCBTSU5HTEVUT05fSU5TVEFOQ0VfU0lOR0xFVE9OID0gbmV3IFNpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbigpO1xuXG5leHBvcnQgY2xhc3MgR2xvYmFsU2hhcmVkSW5zdGFuY2VSZXNvbHV0aW9uIGltcGxlbWVudHMgSW5zdGFuY2VSZXNvbHV0aW9uIHtcbiAgICBnZXRJbnN0YW5jZTxULCBPPihvcHRpb25zOiBHZXRJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiBUIHtcbiAgICAgICAgcmV0dXJuIFNJTkdMRVRPTl9JTlNUQU5DRV9TSU5HTEVUT04uZ2V0SW5zdGFuY2Uob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgc2F2ZUluc3RhbmNlPFQsIE8+KG9wdGlvbnM6IFNhdmVJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiB2b2lkIHtcbiAgICAgICAgU0lOR0xFVE9OX0lOU1RBTkNFX1NJTkdMRVRPTi5zYXZlSW5zdGFuY2Uob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgc2hvdWxkR2VuZXJhdGU8VCwgTz4ob3B0aW9uczogR2V0SW5zdGFuY2VPcHRpb25zPFQsIE8+KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBTSU5HTEVUT05fSU5TVEFOQ0VfU0lOR0xFVE9OLnNob3VsZEdlbmVyYXRlKG9wdGlvbnMpO1xuICAgIH1cbiAgICBkZXN0cm95KCkge1xuICAgICAgICAvLyBQQVNTO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEluc3RhbmNlUmVzb2x1dGlvbiwgU2F2ZUluc3RhbmNlT3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlUmVzb2x1dGlvbic7XG5pbXBvcnQgeyBpbnZva2VQcmVEZXN0cm95IH0gZnJvbSAnLi4vY29tbW9uL2ludm9rZVByZURlc3Ryb3knO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNpZW50SW5zdGFuY2VSZXNvbHV0aW9uIGltcGxlbWVudHMgSW5zdGFuY2VSZXNvbHV0aW9uIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGluc3RhbmNlcyA9IG5ldyBTZXQ8dW5rbm93bj4oKTtcbiAgICBzaG91bGRHZW5lcmF0ZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZ2V0SW5zdGFuY2U8VD4oKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzYXZlSW5zdGFuY2U8VCwgTz4ob3B0aW9uczogU2F2ZUluc3RhbmNlT3B0aW9uczxULCBPPik6IHZvaWQge1xuICAgICAgICB0aGlzLmluc3RhbmNlcy5hZGQob3B0aW9ucy5pbnN0YW5jZSk7XG4gICAgfVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuaW5zdGFuY2VzLmZvckVhY2goaXQgPT4ge1xuICAgICAgICAgICAgaWYgKCFpdCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGludm9rZVByZURlc3Ryb3koaXQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5pbnN0YW5jZXMuY2xlYXIoKTtcbiAgICB9XG4gICAgZGVzdHJveVRoYXQ8VD4oaW5zdGFuY2U6IFQpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmluc3RhbmNlcy5oYXMoaW5zdGFuY2UpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaW52b2tlUHJlRGVzdHJveShpbnN0YW5jZSk7XG4gICAgICAgIHRoaXMuaW5zdGFuY2VzLmRlbGV0ZShpbnN0YW5jZSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSwgQ2xhc3NNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlJztcbmltcG9ydCB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4vQXBwbGljYXRpb25Db250ZXh0JztcblxuZXhwb3J0IGNsYXNzIExpZmVjeWNsZU1hbmFnZXI8VCA9IHVua25vd24+IHtcbiAgICBwcml2YXRlIGNsYXNzTWV0YWRhdGFSZWFkZXI6IENsYXNzTWV0YWRhdGFSZWFkZXI8VD47XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY29tcG9uZW50Q2xhc3M6IE5ld2FibGU8VD4sXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY29udGFpbmVyOiBBcHBsaWNhdGlvbkNvbnRleHRcbiAgICApIHtcbiAgICAgICAgdGhpcy5jbGFzc01ldGFkYXRhUmVhZGVyID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGhpcy5jb21wb25lbnRDbGFzcywgQ2xhc3NNZXRhZGF0YSkucmVhZGVyKCk7XG4gICAgfVxuICAgIGludm9rZVByZUluamVjdE1ldGhvZChpbnN0YW5jZTogSW5zdGFuY2U8VD4pIHtcbiAgICAgICAgY29uc3QgbWV0aG9kcyA9IHRoaXMuY2xhc3NNZXRhZGF0YVJlYWRlci5nZXRNZXRob2RzKExpZmVjeWNsZS5QUkVfSU5KRUNUKTtcbiAgICAgICAgdGhpcy5pbnZva2VMaWZlY3ljbGVNZXRob2RzKGluc3RhbmNlLCBtZXRob2RzKTtcbiAgICB9XG4gICAgaW52b2tlUG9zdEluamVjdE1ldGhvZChpbnN0YW5jZTogSW5zdGFuY2U8VD4pIHtcbiAgICAgICAgY29uc3QgbWV0aG9kcyA9IHRoaXMuY2xhc3NNZXRhZGF0YVJlYWRlci5nZXRNZXRob2RzKExpZmVjeWNsZS5QT1NUX0lOSkVDVCk7XG4gICAgICAgIHRoaXMuaW52b2tlTGlmZWN5Y2xlTWV0aG9kcyhpbnN0YW5jZSwgbWV0aG9kcyk7XG4gICAgfVxuICAgIGludm9rZVByZURlc3Ryb3lJbmplY3RNZXRob2QoaW5zdGFuY2U6IEluc3RhbmNlPFQ+KSB7XG4gICAgICAgIGNvbnN0IG1ldGhvZHMgPSB0aGlzLmNsYXNzTWV0YWRhdGFSZWFkZXIuZ2V0TWV0aG9kcyhMaWZlY3ljbGUuUFJFX0RFU1RST1kpO1xuICAgICAgICB0aGlzLmludm9rZUxpZmVjeWNsZU1ldGhvZHMoaW5zdGFuY2UsIG1ldGhvZHMpO1xuICAgIH1cbiAgICBwcml2YXRlIGludm9rZUxpZmVjeWNsZU1ldGhvZHMoaW5zdGFuY2U6IEluc3RhbmNlPFQ+LCBtZXRob2RLZXlzOiBBcnJheTxzdHJpbmcgfCBzeW1ib2w+KSB7XG4gICAgICAgIG1ldGhvZEtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW52b2tlKGluc3RhbmNlW2tleV0sIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0OiBpbnN0YW5jZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEsIENsYXNzTWV0YWRhdGFSZWFkZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4vQXBwbGljYXRpb25Db250ZXh0JztcbmltcG9ydCB7IEluc3RhbmNlIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2UnO1xuaW1wb3J0IHsgU2VydmljZUZhY3RvcnlEZWYgfSBmcm9tICcuL1NlcnZpY2VGYWN0b3J5RGVmJztcbmltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuaW1wb3J0IHsgbGF6eVByb3AgfSBmcm9tICdAdmdlcmJvdC9sYXp5JztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlciB9IGZyb20gJy4vSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlcic7XG5pbXBvcnQgeyBMaWZlY3ljbGVNYW5hZ2VyIH0gZnJvbSAnLi9MaWZlY3ljbGVNYW5hZ2VyJztcbmltcG9ydCB7IEZhY3RvcnlSZWNvcmRlciB9IGZyb20gJy4uL2NvbW1vbi9GYWN0b3J5UmVjb3JkZXInO1xuaW1wb3J0IHsgQW55RnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcy9BbnlGdW5jdGlvbic7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4uL3R5cGVzL1NlcnZpY2VGYWN0b3J5JztcblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudEluc3RhbmNlQnVpbGRlcjxUPiB7XG4gICAgcHJpdmF0ZSBnZXRDb25zdHJ1Y3RvckFyZ3M6ICgpID0+IHVua25vd25bXSA9ICgpID0+IFtdO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcHJvcGVydHlGYWN0b3JpZXMgPSBuZXcgRmFjdG9yeVJlY29yZGVyKCk7XG4gICAgcHJpdmF0ZSBsYXp5TW9kZTogYm9vbGVhbiA9IHRydWU7XG4gICAgcHJpdmF0ZSByZWFkb25seSBsaWZlY3ljbGVSZXNvbHZlcjogTGlmZWN5Y2xlTWFuYWdlcjxUPjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNsYXNzTWV0YWRhdGFSZWFkZXI6IENsYXNzTWV0YWRhdGFSZWFkZXI8VD47XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY29tcG9uZW50Q2xhc3M6IE5ld2FibGU8VD4sXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY29udGFpbmVyOiBBcHBsaWNhdGlvbkNvbnRleHQsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlcjogSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlclxuICAgICkge1xuICAgICAgICB0aGlzLmxpZmVjeWNsZVJlc29sdmVyID0gbmV3IExpZmVjeWNsZU1hbmFnZXI8VD4oY29tcG9uZW50Q2xhc3MsIGNvbnRhaW5lcik7XG4gICAgICAgIGNvbnN0IHJlYWRlciA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGNvbXBvbmVudENsYXNzLCBDbGFzc01ldGFkYXRhKS5yZWFkZXIoKTtcbiAgICAgICAgdGhpcy5jbGFzc01ldGFkYXRhUmVhZGVyID0gcmVhZGVyO1xuICAgICAgICB0aGlzLmFwcGVuZENsYXNzTWV0YWRhdGEocmVhZGVyKTtcbiAgICB9XG4gICAgYXBwZW5kTGF6eU1vZGUobGF6eU1vZGU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5sYXp5TW9kZSA9IGxhenlNb2RlO1xuICAgIH1cbiAgICBwcml2YXRlIGFwcGVuZENsYXNzTWV0YWRhdGE8VD4oY2xhc3NNZXRhZGF0YVJlYWRlcjogQ2xhc3NNZXRhZGF0YVJlYWRlcjxUPikge1xuICAgICAgICBjb25zdCB0eXBlcyA9IGNsYXNzTWV0YWRhdGFSZWFkZXIuZ2V0Q29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlcygpO1xuICAgICAgICB0aGlzLmdldENvbnN0cnVjdG9yQXJncyA9ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlcy5tYXAoaXQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRhaW5lci5nZXRJbnN0YW5jZShpdC5pc05ld2FibGUgPyBpdC5jbGF6eiA6IGl0LmlkZW50aWZpZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGdsb2JhbE1ldGFkYXRhUmVhZGVyID0gR2xvYmFsTWV0YWRhdGEuZ2V0UmVhZGVyKCk7XG4gICAgICAgIGNvbnN0IHByb3BlcnR5VHlwZXMgPSBjbGFzc01ldGFkYXRhUmVhZGVyLmdldFByb3BlcnR5VHlwZU1hcCgpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VHlwZV0gb2YgcHJvcGVydHlUeXBlcykge1xuICAgICAgICAgICAgaWYgKHByb3BlcnR5VHlwZS5pc05ld2FibGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5RmFjdG9yaWVzLmFwcGVuZChwcm9wZXJ0eU5hbWUsIChjb250YWluZXIsIG93bmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiBjb250YWluZXIuZ2V0SW5zdGFuY2UocHJvcGVydHlUeXBlLmNsYXp6LCBvd25lcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpZGVudGlmaWVyID0gcHJvcGVydHlUeXBlLmlkZW50aWZpZXIgYXMgRXhjbHVkZTxJZGVudGlmaWVyLCBOZXdhYmxlPHVua25vd24+PjtcbiAgICAgICAgICAgIGNvbnN0IGZhY3RvcnlEZWYgPSB0aGlzLmNvbnRhaW5lci5nZXRGYWN0b3J5KGlkZW50aWZpZXIpO1xuICAgICAgICAgICAgaWYgKGZhY3RvcnlEZWYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5RmFjdG9yaWVzLnNldChwcm9wZXJ0eU5hbWUsIGZhY3RvcnlEZWYpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcHJvcGVydHlDbGFzc01ldGFkYXRhID0gZ2xvYmFsTWV0YWRhdGFSZWFkZXIuZ2V0Q2xhc3NNZXRhZGF0YShpZGVudGlmaWVyKTtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eUNsYXNzTWV0YWRhdGEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5RmFjdG9yaWVzLnNldChwcm9wZXJ0eU5hbWUsIFNlcnZpY2VGYWN0b3J5RGVmLmNyZWF0ZUZyb21DbGFzc01ldGFkYXRhKHByb3BlcnR5Q2xhc3NNZXRhZGF0YSkpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcHJvcGVydHlGYWN0b3J5RGVmID0gZ2xvYmFsTWV0YWRhdGFSZWFkZXIuZ2V0Q29tcG9uZW50RmFjdG9yeShpZGVudGlmaWVyKTtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eUZhY3RvcnlEZWYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5RmFjdG9yaWVzLnNldChwcm9wZXJ0eU5hbWUsIHByb3BlcnR5RmFjdG9yeURlZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgYnVpbGQoKSB7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmdldENvbnN0cnVjdG9yQXJncygpO1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gdGhpcy5jcmVhdGVQcm9wZXJ0aWVzR2V0dGVyQnVpbGRlcigpO1xuICAgICAgICBjb25zdCBpc0NyZWF0aW5nSW5zdEF3YXJlUHJvY2Vzc29yID0gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyLmlzSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3ModGhpcy5jb21wb25lbnRDbGFzcyk7XG4gICAgICAgIGlmIChpc0NyZWF0aW5nSW5zdEF3YXJlUHJvY2Vzc29yKSB7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyB0aGlzLmNvbXBvbmVudENsYXNzKC4uLmFyZ3MpIGFzIEluc3RhbmNlPFQ+O1xuICAgICAgICAgICAgdGhpcy5saWZlY3ljbGVSZXNvbHZlci5pbnZva2VQcmVJbmplY3RNZXRob2QoaW5zdGFuY2UpO1xuICAgICAgICAgICAgZGVmaW5lUHJvcGVydGllcy5jYWxsKHRoaXMsIGluc3RhbmNlKTtcbiAgICAgICAgICAgIHRoaXMubGlmZWN5Y2xlUmVzb2x2ZXIuaW52b2tlUG9zdEluamVjdE1ldGhvZChpbnN0YW5jZSk7XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgaW5zdGFuY2U6IHVuZGVmaW5lZCB8IEluc3RhbmNlPFQ+ID0gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyLmJlZm9yZUluc3RhbnRpYXRpb24odGhpcy5jb21wb25lbnRDbGFzcywgYXJncyk7XG4gICAgICAgICAgICBpZiAoIWluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2UgPSBuZXcgdGhpcy5jb21wb25lbnRDbGFzcyguLi5hcmdzKSBhcyBJbnN0YW5jZTxUPjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubGlmZWN5Y2xlUmVzb2x2ZXIuaW52b2tlUHJlSW5qZWN0TWV0aG9kKGluc3RhbmNlKTtcbiAgICAgICAgICAgIGRlZmluZVByb3BlcnRpZXMuY2FsbCh0aGlzLCBpbnN0YW5jZSk7XG4gICAgICAgICAgICBpbnN0YW5jZSA9IHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5hZnRlckluc3RhbnRpYXRpb24oaW5zdGFuY2UpO1xuICAgICAgICAgICAgdGhpcy5saWZlY3ljbGVSZXNvbHZlci5pbnZva2VQb3N0SW5qZWN0TWV0aG9kKGluc3RhbmNlKTtcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGhpczogQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyPFQ+LCBpbnN0YW5jZTogSW5zdGFuY2U8VD4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdldHRlciA9IHZhbHVlKGluc3RhbmNlIGFzIFQpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVmaW5lUHJvcGVydHkoaW5zdGFuY2UsIHR5cGVvZiBrZXkgPT09ICdudW1iZXInID8ga2V5ICsgJycgOiBrZXksIGdldHRlcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGRlZmluZVByb3BlcnR5PFQsIFY+KGluc3RhbmNlOiBULCBrZXk6IHN0cmluZyB8IHN5bWJvbCwgZ2V0dGVyOiAoKSA9PiBWKSB7XG4gICAgICAgIGlmICh0aGlzLmxhenlNb2RlKSB7XG4gICAgICAgICAgICBsYXp5UHJvcChpbnN0YW5jZSwga2V5LCBnZXR0ZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgaW5zdGFuY2Vba2V5XSA9IGdldHRlcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgY3JlYXRlUHJvcGVydGllc0dldHRlckJ1aWxkZXIoKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBNYXA8a2V5b2YgVCwgKGluc3RhbmNlOiBUKSA9PiAoKSA9PiB1bmtub3duIHwgdW5rbm93bltdPigpO1xuICAgICAgICBjb25zdCBwcm9wZXJ0eVR5cGVNYXAgPSB0aGlzLmNsYXNzTWV0YWRhdGFSZWFkZXIuZ2V0UHJvcGVydHlUeXBlTWFwKCk7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgZmFjdG9yeURlZl0gb2YgdGhpcy5wcm9wZXJ0eUZhY3Rvcmllcy5pdGVyYXRvcigpKSB7XG4gICAgICAgICAgICBjb25zdCBpbmplY3Rpb25UeXBlID0gcHJvcGVydHlUeXBlTWFwLmdldChrZXkpITtcbiAgICAgICAgICAgIGNvbnN0IGlzQXJyYXkgPSAhaW5qZWN0aW9uVHlwZS5pc05ld2FibGUgJiYgaW5qZWN0aW9uVHlwZS5jbGF6eiA9PT0gKEFycmF5IGFzIHVua25vd24gYXMgTmV3YWJsZTx1bmtub3duPik7XG4gICAgICAgICAgICBpZiAoIWlzQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmFjdG9yeURlZi5mYWN0b3JpZXMuc2l6ZSA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgYE11bHRpcGxlIG1hdGNoaW5nIGluamVjdGFibGVzIGZvdW5kIGZvciBwcm9wZXJ0eSBpbmplY3Rpb24sXFxuYnV0IHByb3BlcnR5ICR7a2V5LnRvU3RyaW5nKCl9IGlzIG5vdCBhbiBhcnJheSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEl0IGlzIGFtYmlndW91cyB0byBkZXRlcm1pbmUgd2hpY2ggb2JqZWN0IHNob3VsZCBiZSBpbmplY3RlZCFgXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IFtmYWN0b3J5LCBpbmplY3Rpb25zXSA9IGZhY3RvcnlEZWYuZmFjdG9yaWVzLmVudHJpZXMoKS5uZXh0KCkudmFsdWUgYXMgW1xuICAgICAgICAgICAgICAgICAgICBTZXJ2aWNlRmFjdG9yeTx1bmtub3duLCB1bmtub3duPixcbiAgICAgICAgICAgICAgICAgICAgSWRlbnRpZmllcltdXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICByZXN1bHQuc2V0KGtleSBhcyBrZXlvZiBULCA8VD4oaW5zdGFuY2U6IFQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvZHVjZXIgPSBmYWN0b3J5KHRoaXMuY29udGFpbmVyLCBpbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb250YWluZXIuaW52b2tlKHByb2R1Y2VyLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5qZWN0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5zZXQoa2V5IGFzIGtleW9mIFQsIDxUPihpbnN0YW5jZTogVCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9kdWNlckFuZEluamVjdGlvbnMgPSBBcnJheS5mcm9tKGZhY3RvcnlEZWYuZmFjdG9yaWVzKS5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAoW2ZhY3RvcnksIGluamVjdGlvbnNdKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtmYWN0b3J5KHRoaXMuY29udGFpbmVyLCBpbnN0YW5jZSksIGluamVjdGlvbnNdIGFzIFtBbnlGdW5jdGlvbjx1bmtub3duPiwgSWRlbnRpZmllcltdXVxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvZHVjZXJBbmRJbmplY3Rpb25zLm1hcCgoW3Byb2R1Y2VyLCBpbmplY3Rpb25zXSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRhaW5lci5pbnZva2UocHJvZHVjZXIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5qZWN0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBbnlGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzL0FueUZ1bmN0aW9uJztcblxuZXhwb3J0IHR5cGUgRXZlbnRMaXN0ZW5lciA9IEFueUZ1bmN0aW9uO1xuZXhwb3J0IGNsYXNzIEV2ZW50RW1pdHRlciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBldmVudHMgPSBuZXcgTWFwPHN0cmluZyB8IHN5bWJvbCwgRXZlbnRMaXN0ZW5lcltdPigpO1xuXG4gICAgb24odHlwZTogc3RyaW5nIHwgc3ltYm9sLCBsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5ldmVudHMuZ2V0KHR5cGUpO1xuICAgICAgICBpZiAobGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGlzdGVuZXJzID0gW2xpc3RlbmVyXTtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLnNldCh0eXBlLCBsaXN0ZW5lcnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBscyA9IGxpc3RlbmVycyBhcyBFdmVudExpc3RlbmVyW107XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGxzLmluZGV4T2YobGlzdGVuZXIpO1xuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICBscy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBlbWl0KHR5cGU6IHN0cmluZyB8IHN5bWJvbCwgLi4uYXJnczogdW5rbm93bltdKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzLmdldCh0eXBlKT8uZm9yRWFjaChmbiA9PiB7XG4gICAgICAgICAgICBmbiguLi5hcmdzKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yLCBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yJztcbmltcG9ydCB7IGxhenlNZW1iZXIgfSBmcm9tICdAdmdlcmJvdC9sYXp5JztcbmltcG9ydCB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4vQXBwbGljYXRpb25Db250ZXh0JztcbmltcG9ydCB7IEluc3RhbmNlIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2UnO1xuaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9HbG9iYWxNZXRhZGF0YSc7XG5cbmV4cG9ydCBjbGFzcyBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyIHtcbiAgICBwcml2YXRlIGluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXM6IFNldDxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+PiA9IG5ldyBTZXQoKTtcbiAgICBAbGF6eU1lbWJlcjxJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyLCBrZXlvZiBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyLCBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yW10+KHtcbiAgICAgICAgZXZhbHVhdGU6IGluc3RhbmNlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGdsb2JhbEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMgPSBHbG9iYWxNZXRhZGF0YS5nZXRSZWFkZXIoKS5nZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKCk7XG4gICAgICAgICAgICBjb25zdCBpbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzID0gZ2xvYmFsSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3Nlcy5jb25jYXQoXG4gICAgICAgICAgICAgICAgQXJyYXkuZnJvbShpbnN0YW5jZS5pbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBpbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLm1hcChpdCA9PiBpbnN0YW5jZS5jb250YWluZXIuZ2V0SW5zdGFuY2U8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvciwgdm9pZD4oaXQpKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVzZXRCeTogW1xuICAgICAgICAgICAgaW5zdGFuY2UgPT4gaW5zdGFuY2UuaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3Nlcy5zaXplLFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdsb2JhbEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMgPSBHbG9iYWxNZXRhZGF0YS5nZXRSZWFkZXIoKS5nZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdsb2JhbEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfSlcbiAgICBwcml2YXRlIGluc3RBd2FyZVByb2Nlc3Nvckluc3RhbmNlcyE6IEFycmF5PFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjb250YWluZXI6IEFwcGxpY2F0aW9uQ29udGV4dCkge31cbiAgICBhcHBlbmRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyhpbnN0QXdhcmVQcm9jZXNzb3JDbGFzczogTmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPikge1xuICAgICAgICB0aGlzLmluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuYWRkKGluc3RBd2FyZVByb2Nlc3NvckNsYXNzKTtcbiAgICB9XG4gICAgYXBwZW5kSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcyhcbiAgICAgICAgaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlczogU2V0PE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4+IHwgQXJyYXk8TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPj5cbiAgICApIHtcbiAgICAgICAgaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3Nlcy5mb3JFYWNoKGl0ID0+IHtcbiAgICAgICAgICAgIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3Nlcy5hZGQoaXQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYmVmb3JlSW5zdGFudGlhdGlvbjxUPihjb21wb25lbnRDbGFzczogTmV3YWJsZTxUPiwgYXJnczogdW5rbm93bltdKSB7XG4gICAgICAgIGNvbnN0IGluc3RBd2FyZVByb2Nlc3NvcnMgPSB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvckluc3RhbmNlcztcbiAgICAgICAgbGV0IGluc3RhbmNlOiB1bmRlZmluZWQgfCBJbnN0YW5jZTxUPjtcbiAgICAgICAgaW5zdEF3YXJlUHJvY2Vzc29ycy5zb21lKHByb2Nlc3NvciA9PiB7XG4gICAgICAgICAgICBpZiAoIXByb2Nlc3Nvci5iZWZvcmVJbnN0YW50aWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5zdGFuY2UgPSBwcm9jZXNzb3IuYmVmb3JlSW5zdGFudGlhdGlvbjxUPihjb21wb25lbnRDbGFzcywgYXJncykgYXMgSW5zdGFuY2U8VD47XG4gICAgICAgICAgICByZXR1cm4gISFpbnN0YW5jZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9XG4gICAgYWZ0ZXJJbnN0YW50aWF0aW9uPFQ+KGluc3RhbmNlOiBJbnN0YW5jZTxUPikge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JJbnN0YW5jZXMucmVkdWNlKChpbnN0YW5jZSwgcHJvY2Vzc29yKSA9PiB7XG4gICAgICAgICAgICBpZiAocHJvY2Vzc29yLmFmdGVySW5zdGFudGlhdGlvbikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHByb2Nlc3Nvci5hZnRlckluc3RhbnRpYXRpb24oaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIGlmICghIXJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0IGFzIEluc3RhbmNlPFQ+O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgfSwgaW5zdGFuY2UpO1xuICAgIH1cbiAgICBpc0luc3RBd2FyZVByb2Nlc3NvckNsYXNzKGNsczogTmV3YWJsZTx1bmtub3duPikge1xuICAgICAgICBjb25zdCBjbGFzc2VzID0gdGhpcy5nZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKCk7XG4gICAgICAgIHJldHVybiBjbGFzc2VzLmluZGV4T2YoY2xzIGFzIE5ld2FibGU8SW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yPikgPiAtMTtcbiAgICB9XG4gICAgZ2V0SW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcygpIHtcbiAgICAgICAgY29uc3QgZ2xvYmFsSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcyA9IEdsb2JhbE1ldGFkYXRhLmdldEluc3RhbmNlKCkucmVhZGVyKCkuZ2V0SW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcygpO1xuICAgICAgICByZXR1cm4gZ2xvYmFsSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3Nlcy5jb25jYXQoQXJyYXkuZnJvbSh0aGlzLmluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMpKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5cbnR5cGUgSW52b2tlRnVuY3Rpb25BcmdzID0ge1xuICAgIGFyZ3M/OiB1bmtub3duW107XG59O1xudHlwZSBJbnZva2VGdW5jdGlvbkluamVjdGlvbnMgPSB7XG4gICAgaW5qZWN0aW9uczogSWRlbnRpZmllcltdO1xufTtcblxudHlwZSBJbnZva2VGdW5jdGlvbkJhc2ljT3B0aW9uczxUPiA9IHtcbiAgICBjb250ZXh0PzogVDtcbn07XG5cbmV4cG9ydCB0eXBlIEludm9rZUZ1bmN0aW9uT3B0aW9uczxUPiA9XG4gICAgfCAoSW52b2tlRnVuY3Rpb25CYXNpY09wdGlvbnM8VD4gJiBJbnZva2VGdW5jdGlvbkFyZ3MpXG4gICAgfCAoSW52b2tlRnVuY3Rpb25CYXNpY09wdGlvbnM8VD4gJiBQYXJ0aWFsPEludm9rZUZ1bmN0aW9uSW5qZWN0aW9ucz4pO1xuXG5leHBvcnQgZnVuY3Rpb24gaGFzQXJnczxUPihvcHRpb25zOiBJbnZva2VGdW5jdGlvbk9wdGlvbnM8VD4pOiBvcHRpb25zIGlzIEludm9rZUZ1bmN0aW9uQmFzaWNPcHRpb25zPFQ+ICYgSW52b2tlRnVuY3Rpb25BcmdzIHtcbiAgICByZXR1cm4gJ2FyZ3MnIGluIG9wdGlvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNJbmplY3Rpb25zPFQ+KFxuICAgIG9wdGlvbnM6IEludm9rZUZ1bmN0aW9uT3B0aW9uczxUPlxuKTogb3B0aW9ucyBpcyBJbnZva2VGdW5jdGlvbkJhc2ljT3B0aW9uczxUPiAmIEludm9rZUZ1bmN0aW9uSW5qZWN0aW9ucyB7XG4gICAgcmV0dXJuICdpbmplY3Rpb25zJyBpbiBvcHRpb25zO1xufVxuIiwiaW1wb3J0IHsgQU9QSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yIH0gZnJvbSAnLi4vYW9wL0FPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcic7XG5pbXBvcnQgeyBGYWN0b3J5UmVjb3JkZXIgfSBmcm9tICcuLi9jb21tb24vRmFjdG9yeVJlY29yZGVyJztcbmltcG9ydCB7IGlzTm9kZUpzIH0gZnJvbSAnLi4vY29tbW9uL2lzTm9kZUpzJztcbmltcG9ydCB7IEFyZ3ZFdmFsdWF0b3IgfSBmcm9tICcuLi9ldmFsdWF0b3IvQXJndkV2YWx1YXRvcic7XG5pbXBvcnQgeyBFbnZpcm9ubWVudEV2YWx1YXRvciB9IGZyb20gJy4uL2V2YWx1YXRvci9FbnZpcm9ubWVudEV2YWx1YXRvcic7XG5pbXBvcnQgeyBKU09ORGF0YUV2YWx1YXRvciB9IGZyb20gJy4uL2V2YWx1YXRvci9KU09ORGF0YUV2YWx1YXRvcic7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhLCBDbGFzc01ldGFkYXRhUmVhZGVyIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBGdW5jdGlvbk1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvRnVuY3Rpb25NZXRhZGF0YSc7XG5pbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0dsb2JhbE1ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgR2xvYmFsU2hhcmVkSW5zdGFuY2VSZXNvbHV0aW9uIH0gZnJvbSAnLi4vcmVzb2x1dGlvbi9HbG9iYWxTaGFyZWRJbnN0YW5jZVJlc29sdXRpb24nO1xuaW1wb3J0IHsgU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uIH0gZnJvbSAnLi4vcmVzb2x1dGlvbi9TaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24nO1xuaW1wb3J0IHsgVHJhbnNpZW50SW5zdGFuY2VSZXNvbHV0aW9uIH0gZnJvbSAnLi4vcmVzb2x1dGlvbi9UcmFuc2llbnRJbnN0YW5jZVJlc29sdXRpb24nO1xuaW1wb3J0IHsgQW55RnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcy9BbnlGdW5jdGlvbic7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHRPcHRpb25zIH0gZnJvbSAnLi4vdHlwZXMvQXBwbGljYXRpb25Db250ZXh0T3B0aW9ucyc7XG5pbXBvcnQgeyBFdmFsdWF0aW9uT3B0aW9ucywgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuaW1wb3J0IHsgRXZhbHVhdG9yIH0gZnJvbSAnLi4vdHlwZXMvRXZhbHVhdG9yJztcbmltcG9ydCB7IEZhY3RvcnlJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvRmFjdG9yeUlkZW50aWZpZXInO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgSW5zdGFuY2UgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZSc7XG5pbXBvcnQgeyBJbnN0YW5jZVJlc29sdXRpb24gfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZVJlc29sdXRpb24nO1xuaW1wb3J0IHsgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL3R5cGVzL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcic7XG5pbXBvcnQgeyBKU09ORGF0YSB9IGZyb20gJy4uL3R5cGVzL0pTT05EYXRhJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IFNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi4vdHlwZXMvU2VydmljZUZhY3RvcnknO1xuaW1wb3J0IHsgQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyIH0gZnJvbSAnLi9Db21wb25lbnRJbnN0YW5jZUJ1aWxkZXInO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBFdmVudExpc3RlbmVyIH0gZnJvbSAnLi9FdmVudEVtaXR0ZXInO1xuaW1wb3J0IHsgSW5zdGFuY2VTY29wZSB9IGZyb20gJy4vSW5zdGFuY2VTY29wZSc7XG5pbXBvcnQgeyBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyIH0gZnJvbSAnLi9JbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyJztcbmltcG9ydCB7IGhhc0FyZ3MsIGhhc0luamVjdGlvbnMsIEludm9rZUZ1bmN0aW9uT3B0aW9ucyB9IGZyb20gJy4vSW52b2tlRnVuY3Rpb25PcHRpb25zJztcbmltcG9ydCB7IExpZmVjeWNsZSB9IGZyb20gJy4vTGlmZWN5Y2xlJztcbmltcG9ydCB7IExpZmVjeWNsZU1hbmFnZXIgfSBmcm9tICcuL0xpZmVjeWNsZU1hbmFnZXInO1xuXG5jb25zdCBQUkVfREVTVFJPWV9FVkVOVF9LRVkgPSAnY29udGFpbmVyOmV2ZW50OnByZS1kZXN0cm95JztcbmNvbnN0IFBSRV9ERVNUUk9ZX1RIQVRfRVZFTlRfS0VZID0gJ2NvbnRhaW5lcjpldmVudDpwcmUtZGVzdHJveS10aGF0JztcbmNvbnN0IElOU1RBTkNFX1BSRV9ERVNUUk9ZX01FVEhPRCA9IFN5bWJvbCgnc29saWRpdW06aW5zdGFuY2UtcHJlLWRlc3Ryb3knKTtcblxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uQ29udGV4dCB7XG4gICAgcHJpdmF0ZSByZWFkb25seSByZXNvbHV0aW9ucyA9IG5ldyBNYXA8SW5zdGFuY2VTY29wZSB8IHN0cmluZywgSW5zdGFuY2VSZXNvbHV0aW9uPigpO1xuXG4gICAgcHJpdmF0ZSByZWFkb25seSBmYWN0b3JpZXMgPSBuZXcgRmFjdG9yeVJlY29yZGVyKCk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBldmFsdWF0b3JDbGFzc2VzID0gbmV3IE1hcDxzdHJpbmcsIE5ld2FibGU8RXZhbHVhdG9yPj4oKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGV2ZW50RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGRlZmF1bHRTY29wZTogSW5zdGFuY2VTY29wZTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxhenlNb2RlOiBib29sZWFuO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlcjogSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlcjtcbiAgICBwcml2YXRlIGlzRGVzdHJveWVkID0gZmFsc2U7XG4gICAgcHVibGljIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEFwcGxpY2F0aW9uQ29udGV4dE9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLmRlZmF1bHRTY29wZSA9IG9wdGlvbnMuZGVmYXVsdFNjb3BlIHx8IEluc3RhbmNlU2NvcGUuU0lOR0xFVE9OO1xuICAgICAgICB0aGlzLmxhenlNb2RlID0gb3B0aW9ucy5sYXp5TW9kZSA/PyB0cnVlO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySW5zdGFuY2VTY29wZVJlc29sdXRpb24oSW5zdGFuY2VTY29wZS5TSU5HTEVUT04sIFNpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbik7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJJbnN0YW5jZVNjb3BlUmVzb2x1dGlvbihJbnN0YW5jZVNjb3BlLkdMT0JBTF9TSEFSRURfU0lOR0xFVE9OLCBHbG9iYWxTaGFyZWRJbnN0YW5jZVJlc29sdXRpb24pO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySW5zdGFuY2VTY29wZVJlc29sdXRpb24oSW5zdGFuY2VTY29wZS5UUkFOU0lFTlQsIFRyYW5zaWVudEluc3RhbmNlUmVzb2x1dGlvbik7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmFsdWF0b3IoRXhwcmVzc2lvblR5cGUuSlNPTl9QQVRILCBKU09ORGF0YUV2YWx1YXRvcik7XG4gICAgICAgIGlmIChpc05vZGVKcykge1xuICAgICAgICAgICAgdGhpcy5yZWdpc3RlckV2YWx1YXRvcihFeHByZXNzaW9uVHlwZS5FTlYsIEVudmlyb25tZW50RXZhbHVhdG9yKTtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFdmFsdWF0b3IoRXhwcmVzc2lvblR5cGUuQVJHViwgQXJndkV2YWx1YXRvcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyID0gbmV3IEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXIodGhpcyk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJJbnN0QXdhcmVQcm9jZXNzb3IoQU9QSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yLmNyZWF0ZSh0aGlzKSk7XG4gICAgfVxuICAgIGdldEluc3RhbmNlPFQsIE8+KHN5bWJvbDogTmV3YWJsZTxUPiwgb3duZXI/OiBPKTogVDtcbiAgICBnZXRJbnN0YW5jZTxULCBPPihzeW1ib2w6IElkZW50aWZpZXI8VD4sIG93bmVyPzogTyk6IFQgfCBUW107XG4gICAgZ2V0SW5zdGFuY2U8VCwgTz4oc3ltYm9sOiBJZGVudGlmaWVyPFQ+LCBvd25lcj86IE8pOiBUIHwgVFtdIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzeW1ib2wgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBzeW1ib2wgPT09ICdzeW1ib2wnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW5jZUJ5U3ltYm9sKHN5bWJvbCwgb3duZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbmNlQnlDbGFzcyhzeW1ib2wsIG93bmVyKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRJbnN0YW5jZUJ5U3ltYm9sPFQsIE8+KHN5bWJvbDogc3RyaW5nIHwgc3ltYm9sLCBvd25lcj86IE8pOiBUIHwgVFtdIHtcbiAgICAgICAgY29uc3QgZmFjdG9yeURlZiA9IHRoaXMuZ2V0RmFjdG9yeShzeW1ib2wpO1xuICAgICAgICBpZiAoZmFjdG9yeURlZikge1xuICAgICAgICAgICAgY29uc3QgcHJvZHVjZXIgPSBmYWN0b3J5RGVmLnByb2R1Y2UodGhpcywgb3duZXIpO1xuXG4gICAgICAgICAgICBjb25zdCByZXNvbHV0aW9uID0gdGhpcy5nZXRTY3JvcGVSZXNvbHV0aW9uSW5zdGFuY2UoZmFjdG9yeURlZi5zY29wZSkhO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICFyZXNvbHV0aW9uLnNob3VsZEdlbmVyYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgaWRlbnRpZmllcjogc3ltYm9sLFxuICAgICAgICAgICAgICAgICAgICBvd25lclxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x1dGlvbi5nZXRJbnN0YW5jZSh7XG4gICAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6IHN5bWJvbCxcbiAgICAgICAgICAgICAgICAgICAgb3duZXJcbiAgICAgICAgICAgICAgICB9KSBhcyBUO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2VzID0gcHJvZHVjZXIoKSBhcyBUW107XG5cbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdHMgPSBpbnN0YW5jZXMubWFwKGl0ID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dGFjaFByZURlc3Ryb3lIb29rKGl0KTtcbiAgICAgICAgICAgICAgICBjb25zdCBjb25zdHIgPSBpdD8uY29uc3RydWN0b3I7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zdHIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29tcG9uZW50Q2xhc3MgPSBjb25zdHIgYXMgTmV3YWJsZTxUPjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzb2x2ZXIgPSBuZXcgTGlmZWN5Y2xlTWFuYWdlcjxUPihjb21wb25lbnRDbGFzcywgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzSW5zdEF3YXJlUHJvY2Vzc29yID0gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyLmlzSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoY29tcG9uZW50Q2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlci5pbnZva2VQcmVJbmplY3RNZXRob2QoaXQgYXMgSW5zdGFuY2U8VD4pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzSW5zdEF3YXJlUHJvY2Vzc29yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdCA9IHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5hZnRlckluc3RhbnRpYXRpb24oaXQgYXMgSW5zdGFuY2U8VD4pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVyLmludm9rZVBvc3RJbmplY3RNZXRob2QoaXQgYXMgSW5zdGFuY2U8VD4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNvbHV0aW9uLnNhdmVJbnN0YW5jZSh7XG4gICAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6IHN5bWJvbCxcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2U6IGl0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cy5sZW5ndGggPT09IDEgPyByZXN1bHRzWzBdIDogcmVzdWx0cztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGNsYXNzTWV0YWRhdGEgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlYWRlcigpLmdldENsYXNzTWV0YWRhdGE8VD4oc3ltYm9sKTtcbiAgICAgICAgICAgIGlmICghY2xhc3NNZXRhZGF0YSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2xhc3MgYWxpYXMgbm90IGZvdW5kOiAke3N5bWJvbC50b1N0cmluZygpfWApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjbGF6eiA9IGNsYXNzTWV0YWRhdGEucmVhZGVyKCkuZ2V0Q2xhc3MoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW5jZUJ5Q2xhc3MoY2xhenosIG93bmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGdldEluc3RhbmNlQnlDbGFzczxULCBPPihjb21wb25lbnRDbGFzczogTmV3YWJsZTxUPiwgb3duZXI/OiBPKTogVCB8IFRbXSB7XG4gICAgICAgIGlmIChjb21wb25lbnRDbGFzcyA9PT0gQXBwbGljYXRpb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcyBhcyB1bmtub3duIGFzIFQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVhZGVyID0gQ2xhc3NNZXRhZGF0YS5nZXRJbnN0YW5jZShjb21wb25lbnRDbGFzcykucmVhZGVyKCk7XG4gICAgICAgIGNvbnN0IHNjb3BlID0gcmVhZGVyLmdldFNjb3BlKCk7XG4gICAgICAgIGNvbnN0IHJlc29sdXRpb24gPSAodGhpcy5yZXNvbHV0aW9ucy5nZXQoc2NvcGUgPz8gdGhpcy5kZWZhdWx0U2NvcGUpIHx8XG4gICAgICAgICAgICB0aGlzLnJlc29sdXRpb25zLmdldCh0aGlzLmRlZmF1bHRTY29wZSkpIGFzIEluc3RhbmNlUmVzb2x1dGlvbjtcbiAgICAgICAgY29uc3QgZ2V0SW5zdGFuY2VPcHRpb25zID0ge1xuICAgICAgICAgICAgaWRlbnRpZmllcjogY29tcG9uZW50Q2xhc3MsXG4gICAgICAgICAgICBvd25lcixcbiAgICAgICAgICAgIG93bmVyUHJvcGVydHlLZXk6IHVuZGVmaW5lZFxuICAgICAgICB9O1xuICAgICAgICBpZiAocmVzb2x1dGlvbi5zaG91bGRHZW5lcmF0ZShnZXRJbnN0YW5jZU9wdGlvbnMpKSB7XG4gICAgICAgICAgICBjb25zdCBidWlsZGVyID0gdGhpcy5jcmVhdGVDb21wb25lbnRJbnN0YW5jZUJ1aWxkZXIoY29tcG9uZW50Q2xhc3MpO1xuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBidWlsZGVyLmJ1aWxkKCk7XG4gICAgICAgICAgICBjb25zdCBzYXZlSW5zdGFuY2VPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIC4uLmdldEluc3RhbmNlT3B0aW9ucyxcbiAgICAgICAgICAgICAgICBpbnN0YW5jZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlc29sdXRpb24uc2F2ZUluc3RhbmNlKHNhdmVJbnN0YW5jZU9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5hdHRhY2hQcmVEZXN0cm95SG9vayhpbnN0YW5jZSk7XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x1dGlvbi5nZXRJbnN0YW5jZShnZXRJbnN0YW5jZU9wdGlvbnMpIGFzIFQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBhdHRhY2hQcmVEZXN0cm95SG9vazxUPihpbnN0YW5jZXM6IFQgfCBUW10pIHtcbiAgICAgICAgY29uc3QgaW5zdGFuY2VzQXJyYXkgPSBBcnJheS5pc0FycmF5KGluc3RhbmNlcykgPyBpbnN0YW5jZXMgOiBbaW5zdGFuY2VzXTtcbiAgICAgICAgaW5zdGFuY2VzQXJyYXkuZm9yRWFjaChpdCA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGl0IGFzIEluc3RhbmNlPFQ+O1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnN0YW5jZSAhPT0gJ29iamVjdCcgfHwgaW5zdGFuY2UgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoUmVmbGVjdC5oYXMoaW5zdGFuY2UsIElOU1RBTkNFX1BSRV9ERVNUUk9ZX01FVEhPRCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBjbGF6eiA9IGluc3RhbmNlLmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgaWYgKCFjbGF6eikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoaW5zdGFuY2UuY29uc3RydWN0b3IsIENsYXNzTWV0YWRhdGEpO1xuXG4gICAgICAgICAgICBtZXRhZGF0YS5hZGRMaWZlY3ljbGVNZXRob2QoSU5TVEFOQ0VfUFJFX0RFU1RST1lfTUVUSE9ELCBMaWZlY3ljbGUuUFJFX0RFU1RST1kpO1xuICAgICAgICAgICAgUmVmbGVjdC5zZXQoaW5zdGFuY2UsIElOU1RBTkNFX1BSRV9ERVNUUk9ZX01FVEhPRCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRFbWl0dGVyLmVtaXQoUFJFX0RFU1RST1lfRVZFTlRfS0VZLCBpbnN0YW5jZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHByaXZhdGUgY3JlYXRlQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyPFQ+KGNvbXBvbmVudENsYXNzOiBOZXdhYmxlPFQ+KSB7XG4gICAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyKGNvbXBvbmVudENsYXNzLCB0aGlzLCB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIpO1xuICAgICAgICBidWlsZGVyLmFwcGVuZExhenlNb2RlKHRoaXMubGF6eU1vZGUpO1xuICAgICAgICByZXR1cm4gYnVpbGRlcjtcbiAgICB9XG5cbiAgICBnZXRGYWN0b3J5KGtleTogRmFjdG9yeUlkZW50aWZpZXIpIHtcbiAgICAgICAgY29uc3QgZmFjdG9yeSA9IEdsb2JhbE1ldGFkYXRhLmdldEluc3RhbmNlKCkucmVhZGVyKCkuZ2V0Q29tcG9uZW50RmFjdG9yeShrZXkpO1xuICAgICAgICBpZiAoIWZhY3RvcnkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZhY3Rvcmllcy5nZXQoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XG4gICAgYmluZEZhY3Rvcnk8VD4oXG4gICAgICAgIHN5bWJvbDogRmFjdG9yeUlkZW50aWZpZXIsXG4gICAgICAgIGZhY3Rvcnk6IFNlcnZpY2VGYWN0b3J5PFQsIHVua25vd24+LFxuICAgICAgICBpbmplY3Rpb25zPzogSWRlbnRpZmllcltdLFxuICAgICAgICBzY29wZTogSW5zdGFuY2VTY29wZSA9IEluc3RhbmNlU2NvcGUuU0lOR0xFVE9OXG4gICAgKSB7XG4gICAgICAgIHRoaXMuZmFjdG9yaWVzLmFwcGVuZChzeW1ib2wsIGZhY3RvcnksIGluamVjdGlvbnMsIHNjb3BlKTtcbiAgICB9XG4gICAgaW52b2tlPFIsIEN0eD4oZnVuYzogQW55RnVuY3Rpb248UiwgQ3R4Piwgb3B0aW9uczogSW52b2tlRnVuY3Rpb25PcHRpb25zPEN0eD4gPSB7fSk6IFIge1xuICAgICAgICBsZXQgZm46IEFueUZ1bmN0aW9uPFI+O1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGZuID0gZnVuYy5iaW5kKG9wdGlvbnMuY29udGV4dCBhcyBUaGlzUGFyYW1ldGVyVHlwZTx0eXBlb2YgZnVuYz4pIGFzIEFueUZ1bmN0aW9uPFI+O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm4gPSBmdW5jIGFzIEFueUZ1bmN0aW9uPFI+O1xuICAgICAgICB9XG4gICAgICAgIGlmIChoYXNBcmdzKG9wdGlvbnMpKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5hcmdzID8gZm4oLi4ub3B0aW9ucy5hcmdzKSA6IGZuKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGFyZ3NJbmRlbnRpZmllcnM6IElkZW50aWZpZXJbXSA9IFtdO1xuICAgICAgICBpZiAoaGFzSW5qZWN0aW9ucyhvcHRpb25zKSkge1xuICAgICAgICAgICAgYXJnc0luZGVudGlmaWVycyA9IG9wdGlvbnMuaW5qZWN0aW9ucztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoZm4sIEZ1bmN0aW9uTWV0YWRhdGEpLnJlYWRlcigpO1xuICAgICAgICAgICAgYXJnc0luZGVudGlmaWVycyA9IG1ldGFkYXRhLmdldFBhcmFtZXRlcnMoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhcmdzID0gYXJnc0luZGVudGlmaWVycy5tYXAoKGlkZW50aWZpZXIsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0SW5zdGFuY2UoaWRlbnRpZmllcik7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnN0YW5jZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0FycmF5VHlwZSA9IChpZGVudGlmaWVyIGFzIHVua25vd24pID09PSBBcnJheTtcbiAgICAgICAgICAgICAgICBpZiAoaXNBcnJheVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIG1hdGNoaW5nIGluamVjdGFibGVzIGZvdW5kIGZvciBwYXJhbWV0ZXIgYXQgJHtpbmRleH0uYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZVswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBhcmdzLmxlbmd0aCA+IDAgPyBmbiguLi5hcmdzKSA6IGZuKCk7XG4gICAgfVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgICAgIHRoaXMuZXZlbnRFbWl0dGVyLmVtaXQoUFJFX0RFU1RST1lfRVZFTlRfS0VZKTtcbiAgICAgICAgdGhpcy5yZXNvbHV0aW9ucy5mb3JFYWNoKGl0ID0+IHtcbiAgICAgICAgICAgIGl0LmRlc3Ryb3koKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGV2YWx1YXRlPFQsIE8sIEE+KGV4cHJlc3Npb246IHN0cmluZywgb3B0aW9uczogRXZhbHVhdGlvbk9wdGlvbnM8Tywgc3RyaW5nLCBBPik6IFQgfCB1bmRlZmluZWQge1xuICAgICAgICBjb25zdCBldmFsdWF0b3JDbGFzcyA9IHRoaXMuZXZhbHVhdG9yQ2xhc3Nlcy5nZXQob3B0aW9ucy50eXBlKTtcbiAgICAgICAgaWYgKCFldmFsdWF0b3JDbGFzcykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgVW5rbm93biBldmFsdWF0b3IgbmFtZTogJHtvcHRpb25zLnR5cGV9YCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZXZhbHVhdG9yID0gdGhpcy5nZXRJbnN0YW5jZShldmFsdWF0b3JDbGFzcyk7XG4gICAgICAgIHJldHVybiBldmFsdWF0b3IuZXZhbCh0aGlzLCBleHByZXNzaW9uLCBvcHRpb25zLmV4dGVybmFsQXJncyk7XG4gICAgfVxuICAgIHJlY29yZEpTT05EYXRhKG5hbWVzcGFjZTogc3RyaW5nLCBkYXRhOiBKU09ORGF0YSkge1xuICAgICAgICBjb25zdCBldmFsdWF0b3IgPSB0aGlzLmdldEluc3RhbmNlKEpTT05EYXRhRXZhbHVhdG9yKTtcbiAgICAgICAgZXZhbHVhdG9yLnJlY29yZERhdGEobmFtZXNwYWNlLCBkYXRhKTtcbiAgICB9XG4gICAgZ2V0SlNPTkRhdGEobmFtZXNwYWNlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgZXZhbHVhdG9yID0gdGhpcy5nZXRJbnN0YW5jZShKU09ORGF0YUV2YWx1YXRvcik7XG4gICAgICAgIHJldHVybiBldmFsdWF0b3IuZ2V0SlNPTkRhdGEobmFtZXNwYWNlKTtcbiAgICB9XG4gICAgYmluZEluc3RhbmNlPFQ+KGlkZW50aWZpZXI6IHN0cmluZyB8IHN5bWJvbCwgaW5zdGFuY2U6IFQpIHtcbiAgICAgICAgY29uc3QgcmVzb2x1dGlvbiA9IHRoaXMucmVzb2x1dGlvbnMuZ2V0KEluc3RhbmNlU2NvcGUuU0lOR0xFVE9OKTtcbiAgICAgICAgcmVzb2x1dGlvbj8uc2F2ZUluc3RhbmNlKHtcbiAgICAgICAgICAgIGlkZW50aWZpZXIsXG4gICAgICAgICAgICBpbnN0YW5jZVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVnaXN0ZXJJbnN0YW5jZVNjb3BlUmVzb2x1dGlvbjxUIGV4dGVuZHMgTmV3YWJsZTxJbnN0YW5jZVJlc29sdXRpb24+PihcbiAgICAgICAgc2NvcGU6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmcsXG4gICAgICAgIHJlc29sdXRpb25Db25zdHJ1Y3RvcjogVCxcbiAgICAgICAgY29uc3RydWN0b3JBcmdzPzogQ29uc3RydWN0b3JQYXJhbWV0ZXJzPFQ+XG4gICAgKSB7XG4gICAgICAgIHRoaXMucmVzb2x1dGlvbnMuc2V0KHNjb3BlLCBuZXcgcmVzb2x1dGlvbkNvbnN0cnVjdG9yKC4uLihjb25zdHJ1Y3RvckFyZ3MgPz8gW10pKSk7XG4gICAgfVxuICAgIGdldFNjcm9wZVJlc29sdXRpb25JbnN0YW5jZShzY29wZTogSW5zdGFuY2VTY29wZSB8IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXNvbHV0aW9ucy5nZXQoc2NvcGUpID8/IHRoaXMucmVzb2x1dGlvbnMuZ2V0KHRoaXMuZGVmYXVsdFNjb3BlKTtcbiAgICB9XG4gICAgcmVnaXN0ZXJFdmFsdWF0b3IobmFtZTogc3RyaW5nLCBldmFsdWF0b3JDbGFzczogTmV3YWJsZTxFdmFsdWF0b3I+KSB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoZXZhbHVhdG9yQ2xhc3MsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBtZXRhZGF0YS5zZXRTY29wZShJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTik7XG4gICAgICAgIHRoaXMuZXZhbHVhdG9yQ2xhc3Nlcy5zZXQobmFtZSwgZXZhbHVhdG9yQ2xhc3MpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gUmVnaXN0ZXJzIGFuIEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3NvciBjbGFzcyB0byBjdXN0b21pemVcbiAgICAgKiAgICAgIHRoZSBpbnN0YW50aWF0aW9uIHByb2Nlc3MgYXQgdmFyaW91cyBzdGFnZXMgd2l0aGluIHRoZSBJb0NcbiAgICAgKiBAZGVwcmVjYXRlZCBSZXBsYWNlZCB3aXRoIHtAbGluayByZWdpc3RlckJlZm9yZUluc3RhbnRpYXRpb25Qcm9jZXNzb3J9IGFuZCB7QGxpbmsgcmVnaXN0ZXJBZnRlckluc3RhbnRpYXRpb25Qcm9jZXNzb3J9XG4gICAgICogQHBhcmFtIHtOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+fSBjbGF6elxuICAgICAqIEBzZWUgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yXG4gICAgICogQHNpbmNlIDEuMC4wXG4gICAgICovXG4gICAgcmVnaXN0ZXJJbnN0QXdhcmVQcm9jZXNzb3IoY2xheno6IE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4pIHtcbiAgICAgICAgdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyLmFwcGVuZEluc3RBd2FyZVByb2Nlc3NvckNsYXNzKGNsYXp6KTtcbiAgICB9XG4gICAgcmVnaXN0ZXJCZWZvcmVJbnN0YW50aWF0aW9uUHJvY2Vzc29yKHByb2Nlc3NvcjogPFQ+KGNvbnN0cnVjdG9yOiBOZXdhYmxlPFQ+LCBhcmdzOiB1bmtub3duW10pID0+IFQgfCB1bmRlZmluZWQgfCB2b2lkKSB7XG4gICAgICAgIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5hcHBlbmRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyhcbiAgICAgICAgICAgIGNsYXNzIElubmVyUHJvY2Vzc29yIGltcGxlbWVudHMgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB7XG4gICAgICAgICAgICAgICAgYmVmb3JlSW5zdGFudGlhdGlvbjxUPihjb25zdHJ1Y3RvcjogTmV3YWJsZTxUPiwgYXJnczogdW5rbm93bltdKTogdm9pZCB8IFQgfCB1bmRlZmluZWQge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvY2Vzc29yKGNvbnN0cnVjdG9yLCBhcmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuICAgIHJlZ2lzdGVyQWZ0ZXJJbnN0YW50aWF0aW9uUHJvY2Vzc29yKHByb2Nlc3NvcjogPFQgZXh0ZW5kcyBvYmplY3Q+KGluc3RhbmNlOiBUKSA9PiBUKSB7XG4gICAgICAgIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5hcHBlbmRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyhcbiAgICAgICAgICAgIGNsYXNzIElubmVyUHJvY2Vzc29yIGltcGxlbWVudHMgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB7XG4gICAgICAgICAgICAgICAgYWZ0ZXJJbnN0YW50aWF0aW9uPFQgZXh0ZW5kcyBvYmplY3Q+KGluc3RhbmNlOiBUKTogVCB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9jZXNzb3IoaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG4gICAgb25QcmVEZXN0cm95KGxpc3RlbmVyOiBFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50RW1pdHRlci5vbihQUkVfREVTVFJPWV9FVkVOVF9LRVksIGxpc3RlbmVyKTtcbiAgICB9XG4gICAgb25QcmVEZXN0cm95VGhhdChsaXN0ZW5lcjogKGluc3RhbmNlOiBvYmplY3QpID0+IHZvaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRFbWl0dGVyLm9uKFBSRV9ERVNUUk9ZX1RIQVRfRVZFTlRfS0VZLCBsaXN0ZW5lcik7XG4gICAgfVxuICAgIGdldENsYXNzTWV0YWRhdGE8VD4oY3RvcjogTmV3YWJsZTxUPikge1xuICAgICAgICByZXR1cm4gQ2xhc3NNZXRhZGF0YS5nZXRSZWFkZXIoY3RvcikgYXMgQ2xhc3NNZXRhZGF0YVJlYWRlcjxUPjtcbiAgICB9XG4gICAgZGVzdHJveVRyYW5zaWVudEluc3RhbmNlPFQ+KGluc3RhbmNlOiBUKSB7XG4gICAgICAgIGNvbnN0IHJlc29sdXRpb24gPSB0aGlzLnJlc29sdXRpb25zLmdldChJbnN0YW5jZVNjb3BlLlRSQU5TSUVOVCk7XG4gICAgICAgIHJlc29sdXRpb24/LmRlc3Ryb3lUaGF0ICYmIHJlc29sdXRpb24uZGVzdHJveVRoYXQoaW5zdGFuY2UpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgRmFjdG9yeUlkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9GYWN0b3J5SWRlbnRpZmllcic7XG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlJztcbmltcG9ydCB7IGlzTm90RGVmaW5lZCB9IGZyb20gJy4uL2NvbW1vbi9pc05vdERlZmluZWQnO1xuaW1wb3J0IHsgSW5zdGFuY2VTY29wZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24nO1xuXG5leHBvcnQgZnVuY3Rpb24gRmFjdG9yeShwcm9kdWNlSWRlbnRpZmllcj86IEZhY3RvcnlJZGVudGlmaWVyLCBzY29wZTogSW5zdGFuY2VTY29wZSA9IEluc3RhbmNlU2NvcGUuU0lOR0xFVE9OKTogTWV0aG9kRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gKHRhcmdldDogb2JqZWN0LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sKSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKTtcbiAgICAgICAgY29uc3QgY2xhenogPSB0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTxJbnN0YW5jZTx1bmtub3duPj47XG5cbiAgICAgICAgaWYgKGlzTm90RGVmaW5lZChwcm9kdWNlSWRlbnRpZmllcikpIHtcbiAgICAgICAgICAgIHByb2R1Y2VJZGVudGlmaWVyID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnZGVzaWduOnJldHVybnR5cGUnLCB0YXJnZXQsIHByb3BlcnR5S2V5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNOb3REZWZpbmVkKHByb2R1Y2VJZGVudGlmaWVyKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgcmV0dXJuIHR5cGUgbm90IHJlY29nbml6ZWQsIGNhbm5vdCBwZXJmb3JtIGluc3RhbmNlIGNyZWF0aW9uIScpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGluamVjdGlvbnMgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdkZXNpZ246cGFyYW10eXBlcycsIHRhcmdldCwgcHJvcGVydHlLZXkpO1xuXG4gICAgICAgIG1ldGFkYXRhLnJlY29yZEZhY3RvcnkoXG4gICAgICAgICAgICBwcm9kdWNlSWRlbnRpZmllcixcbiAgICAgICAgICAgIChjb250YWluZXIsIG93bmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBjb250YWluZXIuZ2V0SW5zdGFuY2UoY2xhenosIG93bmVyKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmdW5jID0gaW5zdGFuY2VbcHJvcGVydHlLZXldO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZnVuYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gY29udGFpbmVyLmdldEluc3RhbmNlKGNsYXp6KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jLmFwcGx5KGluc3RhbmNlLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4gZnVuYztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5qZWN0aW9ucyxcbiAgICAgICAgICAgIHNjb3BlXG4gICAgICAgICk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4uL2ZvdW5kYXRpb24nO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSwgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IEluamVjdGlvblR5cGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luamVjdGlvblR5cGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gR2VuZXJhdGU8VCwgVj4oZ2VuZXJhdG9yOiAodGhpczogVCwgYXBwQ3R4OiBBcHBsaWNhdGlvbkNvbnRleHQpID0+IFYpOiBQcm9wZXJ0eURlY29yYXRvciB7XG4gICAgcmV0dXJuICh0YXJnZXQ6IG9iamVjdCwgcHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCkgPT4ge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldC5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgIGNvbnN0IHZhbHVlX3N5bWJvbCA9IFN5bWJvbCgnJyk7XG4gICAgICAgIG1ldGFkYXRhLnJlY29yZFByb3BlcnR5VHlwZShwcm9wZXJ0eUtleSwgSW5qZWN0aW9uVHlwZS5vZklkZW50aWZpZXIodmFsdWVfc3ltYm9sKSk7XG4gICAgICAgIEdsb2JhbE1ldGFkYXRhLmdldEluc3RhbmNlKCkucmVjb3JkRmFjdG9yeSh2YWx1ZV9zeW1ib2wsIChjb250YWluZXIsIG93bmVyKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4gZ2VuZXJhdG9yLmNhbGwob3duZXIgYXMgVCwgY29udGFpbmVyKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgaXNOb3REZWZpbmVkIH0gZnJvbSAnLi4vY29tbW9uL2lzTm90RGVmaW5lZCc7XG5pbXBvcnQgeyBJbmplY3Rpb25UeXBlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9JbmplY3Rpb25UeXBlJztcbmltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEnO1xuXG5leHBvcnQgZnVuY3Rpb24gSW5qZWN0PFQ+KGlkZW50aWZpZXI/OiBJZGVudGlmaWVyPFQ+KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIDxUYXJnZXQ+KHRhcmdldDogVGFyZ2V0LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sLCBwYXJhbWV0ZXJJbmRleD86IG51bWJlcikge1xuICAgICAgICBsZXQgaW5qZWN0Q2xhc3M6IE5ld2FibGU8dW5rbm93bj4gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBwYXJhbWV0ZXJJbmRleCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIC8vIGNvbnN0cnVjdG9yIHBhcmFtZXRlclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0Q29uc3RyID0gdGFyZ2V0IGFzIE5ld2FibGU8VD47XG4gICAgICAgICAgICBpZiAodHlwZW9mIGlkZW50aWZpZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBpbmplY3RDbGFzcyA9IGlkZW50aWZpZXI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGluamVjdENsYXNzID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnZGVzaWduOnBhcmFtdHlwZXMnLCB0YXJnZXQsIHByb3BlcnR5S2V5KVtwYXJhbWV0ZXJJbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNOb3REZWZpbmVkKGluamVjdENsYXNzKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHlwZSBub3QgcmVjb2duaXplZCwgaW5qZWN0aW9uIGNhbm5vdCBiZSBwZXJmb3JtZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGNsYXNzTWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXRDb25zdHIsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICAgICAgY2xhc3NNZXRhZGF0YS5zZXRDb25zdHJ1Y3RvclBhcmFtZXRlclR5cGUocGFyYW1ldGVySW5kZXgsIEluamVjdGlvblR5cGUub2YoaW5qZWN0Q2xhc3MsIGlkZW50aWZpZXIpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnb2JqZWN0JyAmJiB0YXJnZXQgIT09IG51bGwgJiYgcHJvcGVydHlLZXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbGV0IGluamVjdENsYXNzOiBOZXdhYmxlPHVua25vd24+IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpZGVudGlmaWVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgaW5qZWN0Q2xhc3MgPSBpZGVudGlmaWVyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbmplY3RDbGFzcyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ2Rlc2lnbjp0eXBlJywgdGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldC5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBpZiAoaXNOb3REZWZpbmVkKGluamVjdENsYXNzKSkge1xuICAgICAgICAgICAgICAgIGlmIChpZGVudGlmaWVyICYmIHR5cGVvZiBpZGVudGlmaWVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZhY3RvcnlEZWYgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlYWRlcigpLmdldENvbXBvbmVudEZhY3RvcnkoaWRlbnRpZmllcik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmYWN0b3J5RGVmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhZGF0YS5yZWNvcmRQcm9wZXJ0eVR5cGUocHJvcGVydHlLZXksIEluamVjdGlvblR5cGUub2ZJZGVudGlmaWVyKGlkZW50aWZpZXIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1R5cGUgbm90IHJlY29nbml6ZWQsIGluamVjdGlvbiBjYW5ub3QgYmUgcGVyZm9ybWVkJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1ldGFkYXRhLnJlY29yZFByb3BlcnR5VHlwZShwcm9wZXJ0eUtleSwgSW5qZWN0aW9uVHlwZS5vZihpbmplY3RDbGFzcywgaWRlbnRpZmllcikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEsIEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgSW5zdGFuY2UgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW5qZWN0YWJsZU9wdGlvbnMge1xuICAgIHByb2R1Y2U6IHN0cmluZyB8IHN5bWJvbCB8IEFycmF5PHN0cmluZyB8IHN5bWJvbD47XG4gICAgc2NvcGU/OiBJbnN0YW5jZVNjb3BlO1xufVxuXG4vKipcbiAqIFRoaXMgZGVjb3JhdG9yIGlzIHR5cGljYWxseSB1c2VkIHRvIGlkZW50aWZ5IGNsYXNzZXMgdGhhdCBuZWVkIHRvIGJlIGNvbmZpZ3VyZWQgd2l0aGluIHRoZSBJb0MgY29udGFpbmVyLlxuICogSW4gbW9zdCBjYXNlcywgQEluamVjdGFibGUgY2FuIGJlIG9taXR0ZWQgdW5sZXNzIGV4cGxpY2l0IGNvbmZpZ3VyYXRpb24gaXMgcmVxdWlyZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBJbmplY3RhYmxlKG9wdGlvbnM/OiBJbmplY3RhYmxlT3B0aW9ucyk6IENsYXNzRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gPFRGdW5jdGlvbiBleHRlbmRzIEZ1bmN0aW9uPih0YXJnZXQ6IFRGdW5jdGlvbik6IFRGdW5jdGlvbiB8IHZvaWQgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnM/LnByb2R1Y2UgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKTtcbiAgICAgICAgY29uc3QgcHJvZHVjZXMgPSBBcnJheS5pc0FycmF5KG9wdGlvbnMucHJvZHVjZSkgPyBvcHRpb25zLnByb2R1Y2UgOiBbb3B0aW9ucy5wcm9kdWNlXTtcbiAgICAgICAgY29uc3QgY2xhc3NNZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldCBhcyB1bmtub3duIGFzIE5ld2FibGU8dW5rbm93bj4sIENsYXNzTWV0YWRhdGEpO1xuXG4gICAgICAgIHByb2R1Y2VzLmZvckVhY2gocHJvZHVjZSA9PiB7XG4gICAgICAgICAgICBtZXRhZGF0YS5yZWNvcmRGYWN0b3J5KFxuICAgICAgICAgICAgICAgIHByb2R1Y2UsXG4gICAgICAgICAgICAgICAgKGNvbnRhaW5lciwgb3duZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gY29udGFpbmVyLmdldEluc3RhbmNlKHRhcmdldCBhcyB1bmtub3duIGFzIE5ld2FibGU8SW5zdGFuY2U8dW5rbm93bj4+LCBvd25lcik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBbXSxcbiAgICAgICAgICAgICAgICBjbGFzc01ldGFkYXRhLnJlYWRlcigpLmdldFNjb3BlKCkgPz8gb3B0aW9ucy5zY29wZSA/PyBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3IgfSBmcm9tICcuLi90eXBlcy9JbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3InO1xuaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9HbG9iYWxNZXRhZGF0YSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBJbnN0QXdhcmVQcm9jZXNzb3IoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIDxDbHMgZXh0ZW5kcyBOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+Pih0YXJnZXQ6IENscykge1xuICAgICAgICBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlY29yZFByb2Nlc3NvckNsYXNzKHRhcmdldCk7XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IFZhbHVlIH0gZnJvbSAnLi9WYWx1ZSc7XG5pbXBvcnQgeyBFeHByZXNzaW9uVHlwZSB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRlT3B0aW9ucyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBKU09ORGF0YShuYW1lc3BhY2U6IHN0cmluZywganNvbnBhdGg6IHN0cmluZykge1xuICAgIHJldHVybiBWYWx1ZShgJHtuYW1lc3BhY2V9OiR7anNvbnBhdGh9YCwgRXhwcmVzc2lvblR5cGUuSlNPTl9QQVRIKTtcbn1cbiIsImltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcblxuLyoqXG4gKiBVcm4gY2FsbHMgdGhlIG1ldGhvZHMgYW5ub3RhdGVkIHdpdGggQFBvc3RJbmplY3Qgb25seSBvbmNlLCBqdXN0IGFmdGVyIHRoZSBpbmplY3Rpb24gb2YgcHJvcGVydGllcy5cbiAqIEBhbm5vdGF0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBMaWZlY3ljbGVEZWNvcmF0b3IgPSAobGlmZWN5Y2xlOiBMaWZlY3ljbGUpOiBNZXRob2REZWNvcmF0b3IgPT4ge1xuICAgIHJldHVybiAodGFyZ2V0OiBvYmplY3QsIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wpID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQuY29uc3RydWN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBtZXRhZGF0YS5hZGRMaWZlY3ljbGVNZXRob2QocHJvcGVydHlLZXksIGxpZmVjeWNsZSk7XG4gICAgfTtcbn07XG4iLCJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBNYXJrKGtleTogc3RyaW5nIHwgc3ltYm9sLCB2YWx1ZTogdW5rbm93biA9IHRydWUpOiBGdW5jdGlvbiB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChcbiAgICAgICAgLi4uYXJnczpcbiAgICAgICAgICAgIHwgUGFyYW1ldGVyczxDbGFzc0RlY29yYXRvcj5cbiAgICAgICAgICAgIHwgUGFyYW1ldGVyczxNZXRob2REZWNvcmF0b3I+XG4gICAgICAgICAgICB8IFBhcmFtZXRlcnM8UHJvcGVydHlEZWNvcmF0b3I+XG4gICAgICAgICAgICB8IFBhcmFtZXRlcnM8UGFyYW1ldGVyRGVjb3JhdG9yPlxuICAgICkge1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIC8vIGNsYXNzIGRlY29yYXRvclxuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShhcmdzWzBdLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgICAgIG1ldGFkYXRhLm1hcmtlcigpLmN0b3Ioa2V5LCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJncy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIC8vIHByb3BlcnR5IGRlY29yYXRvclxuICAgICAgICAgICAgY29uc3QgW3Byb3RvdHlwZSwgcHJvcGVydHlLZXldID0gYXJncztcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEocHJvdG90eXBlLmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgICAgIG1ldGFkYXRhLm1hcmtlcigpLm1lbWJlcihwcm9wZXJ0eUtleSkubWFyayhrZXksIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMyAmJiB0eXBlb2YgYXJnc1syXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIC8vIHBhcmFtZXRlciBkZWNvcmF0b3JcbiAgICAgICAgICAgIGNvbnN0IFtwcm90b3R5cGUsIHByb3BlcnR5S2V5LCBpbmRleF0gPSBhcmdzIGFzIFtvYmplY3QsIHN0cmluZyB8IHN5bWJvbCwgbnVtYmVyXTtcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEocHJvdG90eXBlLmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgICAgIG1ldGFkYXRhLm1hcmtlcigpLnBhcmFtZXRlcihwcm9wZXJ0eUtleSwgaW5kZXgpLm1hcmsoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBtZXRob2QgZGVjb3JhdG9yXG4gICAgICAgICAgICBjb25zdCBbcHJvdG90eXBlLCBwcm9wZXJ0eUtleV0gPSBhcmdzIGFzIFBhcmFtZXRlcnM8TWV0aG9kRGVjb3JhdG9yPjtcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEocHJvdG90eXBlLmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgICAgIG1ldGFkYXRhLm1hcmtlcigpLm1lbWJlcihwcm9wZXJ0eUtleSkubWFyayhrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH07XG59XG4iLCJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9MaWZlY3ljbGUnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlRGVjb3JhdG9yIH0gZnJvbSAnLi9MaWZlY3ljbGVEZWNvcmF0b3InO1xuXG4vKipcbiAqIFVybiBjYWxscyB0aGUgbWV0aG9kcyBhbm5vdGF0ZWQgd2l0aCBAUG9zdEluamVjdCBvbmx5IG9uY2UsIGp1c3QgYWZ0ZXIgdGhlIGluamVjdGlvbiBvZiBwcm9wZXJ0aWVzLlxuICogQGFubm90YXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IFBvc3RJbmplY3QgPSAoKTogTWV0aG9kRGVjb3JhdG9yID0+IExpZmVjeWNsZURlY29yYXRvcihMaWZlY3ljbGUuUE9TVF9JTkpFQ1QpO1xuIiwiaW1wb3J0IHsgTGlmZWN5Y2xlRGVjb3JhdG9yIH0gZnJvbSAnLi9MaWZlY3ljbGVEZWNvcmF0b3InO1xuaW1wb3J0IHsgTGlmZWN5Y2xlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9MaWZlY3ljbGUnO1xuXG5leHBvcnQgY29uc3QgUHJlRGVzdHJveSA9ICgpID0+IExpZmVjeWNsZURlY29yYXRvcihMaWZlY3ljbGUuUFJFX0RFU1RST1kpO1xuIiwiaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IExpZmVjeWNsZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vTGlmZWN5Y2xlJztcbmltcG9ydCB7IExpZmVjeWNsZURlY29yYXRvciB9IGZyb20gJy4vTGlmZWN5Y2xlRGVjb3JhdG9yJztcblxuLyoqXG4gKiBVcm4gY2FsbHMgdGhlIG1ldGhvZHMgYW5ub3RhdGVkIHdpdGggQFBvc3RJbmplY3Qgb25seSBvbmNlLCBqdXN0IGFmdGVyIHRoZSBpbmplY3Rpb24gb2YgcHJvcGVydGllcy5cbiAqIEBhbm5vdGF0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBQcmVJbmplY3QgPSAoKTogTWV0aG9kRGVjb3JhdG9yID0+IExpZmVjeWNsZURlY29yYXRvcihMaWZlY3ljbGUuUFJFX0lOSkVDVCk7XG4iLCJpbXBvcnQgeyBJbnN0YW5jZVNjb3BlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9JbnN0YW5jZVNjb3BlJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gU2NvcGUoc2NvcGU6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmcpOiBDbGFzc0RlY29yYXRvciB7XG4gICAgcmV0dXJuIDxURnVuY3Rpb24gZXh0ZW5kcyBGdW5jdGlvbj4odGFyZ2V0OiBURnVuY3Rpb24pID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQgYXMgdW5rbm93biBhcyBOZXdhYmxlPHVua25vd24+LCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgbWV0YWRhdGEuc2V0U2NvcGUoc2NvcGUpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBNZXRhZGF0YSwgTWV0YWRhdGFSZWFkZXIgfSBmcm9tICcuLi90eXBlcy9NZXRhZGF0YSc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBBc3BlY3QgfSBmcm9tICcuL0FzcGVjdCc7XG5pbXBvcnQgeyBjcmVhdGVEZWZhdWx0VmFsdWVNYXAsIERlZmF1bHRWYWx1ZU1hcCB9IGZyb20gJy4uL2NvbW1vbi9EZWZhdWx0VmFsdWVNYXAnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi9BZHZpY2UnO1xuXG5leHBvcnQgdHlwZSBVc2VBc3BlY3RNYXAgPSBEZWZhdWx0VmFsdWVNYXA8c3RyaW5nIHwgc3ltYm9sLCBEZWZhdWx0VmFsdWVNYXA8QWR2aWNlLCBBcnJheTxOZXdhYmxlPEFzcGVjdD4+Pj47XG5cbmV4cG9ydCBpbnRlcmZhY2UgVXNlQXNwZWN0TWV0YWRhdGFSZWFkZXIgZXh0ZW5kcyBNZXRhZGF0YVJlYWRlciB7XG4gICAgZ2V0QXNwZWN0cygpOiBVc2VBc3BlY3RNYXA7XG4gICAgZ2V0QXNwZWN0c09mKG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCwgYWR2aWNlOiBBZHZpY2UpOiBBcnJheTxOZXdhYmxlPEFzcGVjdD4+O1xufVxuZXhwb3J0IGNsYXNzIEFPUENsYXNzTWV0YWRhdGEgaW1wbGVtZW50cyBNZXRhZGF0YTxVc2VBc3BlY3RNZXRhZGF0YVJlYWRlciwgTmV3YWJsZTx1bmtub3duPj4ge1xuICAgIHN0YXRpYyBnZXRSZWZsZWN0S2V5KCkge1xuICAgICAgICByZXR1cm4gJ2FvcDp1c2UtYXNwZWN0LW1ldGFkYXRhJztcbiAgICB9XG4gICAgcHJpdmF0ZSBhc3BlY3RNYXA6IFVzZUFzcGVjdE1hcCA9IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcCgoKSA9PiBjcmVhdGVEZWZhdWx0VmFsdWVNYXAoKCkgPT4gW10pKTtcbiAgICBpbml0KCk6IHZvaWQge1xuICAgICAgICAvLyBJR05PUkVcbiAgICB9XG5cbiAgICBhcHBlbmQobWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sLCBhZHZpY2U6IEFkdmljZSwgYXNwZWN0czogQXJyYXk8TmV3YWJsZTxBc3BlY3Q+Pikge1xuICAgICAgICBjb25zdCBhZHZpY2VBc3BlY3RNYXAgPSB0aGlzLmFzcGVjdE1hcC5nZXQobWV0aG9kTmFtZSk7XG4gICAgICAgIGNvbnN0IGV4aXRpbmdBc3BlY3RBcnJheSA9IGFkdmljZUFzcGVjdE1hcC5nZXQoYWR2aWNlKTtcbiAgICAgICAgZXhpdGluZ0FzcGVjdEFycmF5LnB1c2goLi4uYXNwZWN0cyk7XG4gICAgfVxuXG4gICAgcmVhZGVyKCk6IFVzZUFzcGVjdE1ldGFkYXRhUmVhZGVyIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldEFzcGVjdHM6ICgpOiBVc2VBc3BlY3RNYXAgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzcGVjdE1hcDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRBc3BlY3RzT2Y6IChtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2wsIGFkdmljZTogQWR2aWNlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNwZWN0TWFwLmdldChtZXRob2ROYW1lKS5nZXQoYWR2aWNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmZ1bmN0aW9uIGdldE1ldGhvZERlc2NyaXB0b3JzKHByb3RvdHlwZTogb2JqZWN0KTogUmVjb3JkPHN0cmluZywgUHJvcGVydHlEZXNjcmlwdG9yPiB7XG4gICAgaWYgKFxuICAgICAgICB0eXBlb2YgcHJvdG90eXBlICE9PSAnb2JqZWN0JyB8fFxuICAgICAgICBwcm90b3R5cGUgPT09IG51bGwgfHxcbiAgICAgICAgT2JqZWN0LnByb3RvdHlwZSA9PT0gcHJvdG90eXBlIHx8XG4gICAgICAgIEZ1bmN0aW9uLnByb3RvdHlwZSA9PT0gcHJvdG90eXBlXG4gICAgKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgY29uc3Qgc3VwZXJQcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG90eXBlKTtcbiAgICBjb25zdCBzdXBlckRlc2NyaXB0b3JzID0gc3VwZXJQcm90b3R5cGUgPT09IHByb3RvdHlwZSA/IHt9IDogZ2V0TWV0aG9kRGVzY3JpcHRvcnMoc3VwZXJQcm90b3R5cGUpO1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHN1cGVyRGVzY3JpcHRvcnMsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHByb3RvdHlwZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsTWV0aG9kTWVtYmVyTmFtZXM8VD4oY2xzOiBOZXdhYmxlPFQ+KSB7XG4gICAgY29uc3QgZGVzY3JpcHRvcnMgPSBnZXRNZXRob2REZXNjcmlwdG9ycyhjbHMucHJvdG90eXBlKTtcbiAgICBkZWxldGUgZGVzY3JpcHRvcnNbJ2NvbnN0cnVjdG9yJ107XG4gICAgY29uc3QgbWV0aG9kTmFtZXMgPSBuZXcgU2V0PHN0cmluZyB8IHN5bWJvbD4oKTtcbiAgICBSZWZsZWN0Lm93bktleXMoZGVzY3JpcHRvcnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgY29uc3QgbWVtYmVyID0gY2xzLnByb3RvdHlwZVtrZXldO1xuICAgICAgICBpZiAodHlwZW9mIG1lbWJlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbWV0aG9kTmFtZXMuYWRkKGtleSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbWV0aG9kTmFtZXM7XG59XG4iLCJpbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBnZXRBbGxNZXRob2RNZW1iZXJOYW1lcyB9IGZyb20gJy4uL2NvbW1vbi9nZXRBbGxNZXRob2RNZW1iZXJOYW1lcyc7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5cbnR5cGUgTWVtYmVySWRlbnRpZmllciA9IHN0cmluZyB8IHN5bWJvbDtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBvaW50Y3V0IHtcbiAgICBzdGF0aWMgY29tYmluZSguLi5wb2ludGN1dHM6IFBvaW50Y3V0W10pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBPclBvaW50Y3V0KHBvaW50Y3V0cyk7XG4gICAgfVxuICAgIHN0YXRpYyBvZjxUPihjbHM6IE5ld2FibGU8VD4sIC4uLm1ldGhvZE5hbWVzOiBNZW1iZXJJZGVudGlmaWVyW10pIHtcbiAgICAgICAgY29uc3QgZW50cmllcyA9IG5ldyBNYXA8TmV3YWJsZTx1bmtub3duPiwgU2V0PE1lbWJlcklkZW50aWZpZXI+PigpO1xuICAgICAgICBjb25zdCBtZXRob2RzID0gbmV3IFNldDxNZW1iZXJJZGVudGlmaWVyPihtZXRob2ROYW1lcyBhcyBNZW1iZXJJZGVudGlmaWVyW10pO1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgZ2V0QWxsTWV0aG9kTWVtYmVyTmFtZXMoY2xzKS5mb3JFYWNoKG1ldGhvZE5hbWUgPT4ge1xuICAgICAgICAgICAgICAgIG1ldGhvZHMuYWRkKG1ldGhvZE5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZW50cmllcy5zZXQoY2xzLCBtZXRob2RzKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcmVjaXRlUG9pbnRjdXQoZW50cmllcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkXG4gICAgICovXG4gICAgc3RhdGljIHRlc3RNYXRjaDxUPihjbHM6IE5ld2FibGU8VD4sIHJlZ2V4OiBSZWdFeHApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2goY2xzLCByZWdleCk7XG4gICAgfVxuICAgIHN0YXRpYyBtYXRjaDxUPihjbHM6IE5ld2FibGU8VD4sIHJlZ2V4OiBSZWdFeHApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNZW1iZXJNYXRjaFBvaW50Y3V0KGNscywgcmVnZXgpO1xuICAgIH1cbiAgICBzdGF0aWMgZnJvbSguLi5jbGFzc2VzOiBBcnJheTxOZXdhYmxlPHVua25vd24+Pikge1xuICAgICAgICBjb25zdCBvZiA9ICguLi5tZXRob2ROYW1lczogTWVtYmVySWRlbnRpZmllcltdKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE9yUG9pbnRjdXQoY2xhc3Nlcy5tYXAoY2xzID0+IFBvaW50Y3V0Lm9mKGNscywgLi4ubWV0aG9kTmFtZXMpKSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IG1hdGNoID0gKHJlZ2V4OiBSZWdFeHApID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgT3JQb2ludGN1dChcbiAgICAgICAgICAgICAgICBjbGFzc2VzLm1hcChjbHMgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE1lbWJlck1hdGNoUG9pbnRjdXQoY2xzLCByZWdleCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvZixcbiAgICAgICAgICAgIG1hdGNoLFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0ZXN0TWF0Y2g6IG1hdGNoXG4gICAgICAgIH07XG4gICAgfVxuICAgIHN0YXRpYyBtYXJrZWQodHlwZTogc3RyaW5nIHwgc3ltYm9sLCB2YWx1ZTogdW5rbm93biA9IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNYXJrZWRQb2ludGN1dCh0eXBlLCB2YWx1ZSk7XG4gICAgfVxuICAgIHN0YXRpYyBjbGFzczxUPihjbHM6IE5ld2FibGU8VD4pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDbGFzc1BvaW50Y3V0KGNscyk7XG4gICAgfVxuICAgIGFic3RyYWN0IHRlc3QoanBJZGVudGlmaWVyOiBJZGVudGlmaWVyLCBqcE1lbWJlcjogc3RyaW5nIHwgc3ltYm9sKTogYm9vbGVhbjtcbn1cblxuY2xhc3MgT3JQb2ludGN1dCBleHRlbmRzIFBvaW50Y3V0IHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBvaW50Y3V0czogUG9pbnRjdXRbXSkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICB0ZXN0KGpwSWRlbnRpZmllcjogSWRlbnRpZmllciwganBNZW1iZXI6IHN0cmluZyB8IHN5bWJvbCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb2ludGN1dHMuc29tZShpdCA9PiBpdC50ZXN0KGpwSWRlbnRpZmllciwganBNZW1iZXIpKTtcbiAgICB9XG59XG5cbmNsYXNzIFByZWNpdGVQb2ludGN1dCBleHRlbmRzIFBvaW50Y3V0IHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG1ldGhvZEVudHJpZXM6IE1hcDxJZGVudGlmaWVyLCBTZXQ8TWVtYmVySWRlbnRpZmllcj4+KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHRlc3QoanBJZGVudGlmaWVyOiBJZGVudGlmaWVyLCBqcE1lbWJlcjogc3RyaW5nIHwgc3ltYm9sKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IG1lbWJlcnMgPSB0aGlzLm1ldGhvZEVudHJpZXMuZ2V0KGpwSWRlbnRpZmllcik7XG4gICAgICAgIHJldHVybiAhIW1lbWJlcnMgJiYgbWVtYmVycy5oYXMoanBNZW1iZXIpO1xuICAgIH1cbn1cbmNsYXNzIE1hcmtlZFBvaW50Y3V0IGV4dGVuZHMgUG9pbnRjdXQge1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIG1hcmtlZFR5cGU6IHN0cmluZyB8IHN5bWJvbCxcbiAgICAgICAgcHJpdmF0ZSBtYXJrZWRWYWx1ZTogdW5rbm93biA9IHRydWVcbiAgICApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgdGVzdChqcElkZW50aWZpZXI6IElkZW50aWZpZXIsIGpwTWVtYmVyOiBzdHJpbmcgfCBzeW1ib2wpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHR5cGVvZiBqcElkZW50aWZpZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGpwSWRlbnRpZmllciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgIGNvbnN0IG1hcmtJbmZvID0gbWV0YWRhdGEucmVhZGVyKCkuZ2V0TWVtYmVyc01hcmtJbmZvKGpwTWVtYmVyKTtcbiAgICAgICAgcmV0dXJuIG1hcmtJbmZvW3RoaXMubWFya2VkVHlwZV0gPT09IHRoaXMubWFya2VkVmFsdWU7XG4gICAgfVxufVxuY2xhc3MgTWVtYmVyTWF0Y2hQb2ludGN1dCBleHRlbmRzIFBvaW50Y3V0IHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBjbGF6ejogTmV3YWJsZTx1bmtub3duPixcbiAgICAgICAgcHJpdmF0ZSByZWdleDogUmVnRXhwXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHRlc3QoanBJZGVudGlmaWVyOiBJZGVudGlmaWVyLCBqcE1lbWJlcjogc3RyaW5nIHwgc3ltYm9sKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBqcElkZW50aWZpZXIgPT09IHRoaXMuY2xhenogJiYgdHlwZW9mIGpwTWVtYmVyID09PSAnc3RyaW5nJyAmJiAhIXRoaXMucmVnZXgudGVzdChqcE1lbWJlcik7XG4gICAgfVxufVxuY2xhc3MgQ2xhc3NQb2ludGN1dCBleHRlbmRzIFBvaW50Y3V0IHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNsYXp6OiBOZXdhYmxlPHVua25vd24+KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHRlc3QoanBJZGVudGlmaWVyOiBJZGVudGlmaWVyKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBqcElkZW50aWZpZXIgPT09IHRoaXMuY2xheno7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgUG9pbnRjdXQgfSBmcm9tICcuL1BvaW50Y3V0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4vQWR2aWNlJztcbmltcG9ydCB7IEFzcGVjdE1ldGFkYXRhIH0gZnJvbSAnLi9Bc3BlY3RNZXRhZHRhJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFzcGVjdChcbiAgICBjb21wb25lbnRBc3BlY3RDbGFzczogTmV3YWJsZTx1bmtub3duPixcbiAgICBtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2wsXG4gICAgYWR2aWNlOiBBZHZpY2UsXG4gICAgcG9pbnRjdXQ6IFBvaW50Y3V0XG4pIHtcbiAgICBBc3BlY3RNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLmFwcGVuZChjb21wb25lbnRBc3BlY3RDbGFzcywgbWV0aG9kTmFtZSwgYWR2aWNlLCBwb2ludGN1dCk7XG4gICAgLy8gY29uc3QgQXNwZWN0Q2xhc3MgPSBDb21wb25lbnRNZXRob2RBc3BlY3QuY3JlYXRlKGNvbXBvbmVudEFzcGVjdENsYXNzLCBtZXRob2ROYW1lKTtcbiAgICAvLyBwb2ludGN1dC5nZXRNZXRob2RzTWFwKCkuZm9yRWFjaCgoanBNZW1iZXJzLCBqcENsYXNzKSA9PiB7XG4gICAgLy8gICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoanBDbGFzcywgQU9QQ2xhc3NNZXRhZGF0YSk7XG4gICAgLy8gICAgIGpwTWVtYmVycy5mb3JFYWNoKG1ldGhvZE5hbWUgPT4ge1xuICAgIC8vICAgICAgICAgbWV0YWRhdGEuYXBwZW5kKG1ldGhvZE5hbWUsIGFkdmljZSwgW0FzcGVjdENsYXNzXSk7XG4gICAgLy8gICAgIH0pO1xuICAgIC8vIH0pO1xufVxuIiwiaW1wb3J0IHsgUG9pbnRjdXQgfSBmcm9tICcuLi9Qb2ludGN1dCc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuLi9BZHZpY2UnO1xuaW1wb3J0IHsgYWRkQXNwZWN0IH0gZnJvbSAnLi4vYWRkQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi8uLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIEFmdGVyKHBvaW50Y3V0OiBQb2ludGN1dCk6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgIGFkZEFzcGVjdCh0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTx1bmtub3duPiwgcHJvcGVydHlLZXksIEFkdmljZS5BZnRlciwgcG9pbnRjdXQpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBQb2ludGN1dCB9IGZyb20gJy4uL1BvaW50Y3V0JztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4uL0FkdmljZSc7XG5pbXBvcnQgeyBhZGRBc3BlY3QgfSBmcm9tICcuLi9hZGRBc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uLy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gQWZ0ZXJSZXR1cm4ocG9pbnRjdXQ6IFBvaW50Y3V0KTogTWV0aG9kRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgYWRkQXNwZWN0KHRhcmdldC5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPHVua25vd24+LCBwcm9wZXJ0eUtleSwgQWR2aWNlLkFmdGVyUmV0dXJuLCBwb2ludGN1dCk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi4vUG9pbnRjdXQnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi4vQWR2aWNlJztcbmltcG9ydCB7IGFkZEFzcGVjdCB9IGZyb20gJy4uL2FkZEFzcGVjdCc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBBcm91bmQocG9pbnRjdXQ6IFBvaW50Y3V0KTogTWV0aG9kRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgYWRkQXNwZWN0KHRhcmdldC5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPHVua25vd24+LCBwcm9wZXJ0eUtleSwgQWR2aWNlLkFyb3VuZCwgcG9pbnRjdXQpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBQb2ludGN1dCB9IGZyb20gJy4uL1BvaW50Y3V0JztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4uL0FkdmljZSc7XG5pbXBvcnQgeyBhZGRBc3BlY3QgfSBmcm9tICcuLi9hZGRBc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uLy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gQmVmb3JlKHBvaW50Y3V0OiBQb2ludGN1dCk6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgIGFkZEFzcGVjdCh0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTx1bmtub3duPiwgcHJvcGVydHlLZXksIEFkdmljZS5CZWZvcmUsIHBvaW50Y3V0KTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgUG9pbnRjdXQgfSBmcm9tICcuLi9Qb2ludGN1dCc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuLi9BZHZpY2UnO1xuaW1wb3J0IHsgYWRkQXNwZWN0IH0gZnJvbSAnLi4vYWRkQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi8uLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIEZpbmFsbHkocG9pbnRjdXQ6IFBvaW50Y3V0KTogTWV0aG9kRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgYWRkQXNwZWN0KHRhcmdldC5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPHVua25vd24+LCBwcm9wZXJ0eUtleSwgQWR2aWNlLkZpbmFsbHksIHBvaW50Y3V0KTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgUG9pbnRjdXQgfSBmcm9tICcuLi9Qb2ludGN1dCc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuLi9BZHZpY2UnO1xuaW1wb3J0IHsgYWRkQXNwZWN0IH0gZnJvbSAnLi4vYWRkQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi8uLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIFRocm93bihwb2ludGN1dDogUG9pbnRjdXQpOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICBhZGRBc3BlY3QodGFyZ2V0LmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dW5rbm93bj4sIHByb3BlcnR5S2V5LCBBZHZpY2UuVGhyb3duLCBwb2ludGN1dCk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4uL0FkdmljZSc7XG5pbXBvcnQgeyBBc3BlY3QsIFByb2NlZWRpbmdBc3BlY3QgfSBmcm9tICcuLi9Bc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uLy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgYWRkQXNwZWN0IH0gZnJvbSAnLi4vYWRkQXNwZWN0JztcbmltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi4vUG9pbnRjdXQnO1xuXG5mdW5jdGlvbiBVc2VBc3BlY3RzKGFkdmljZTogQWR2aWNlLkFyb3VuZCwgYXNwZWN0czogQXJyYXk8TmV3YWJsZTxQcm9jZWVkaW5nQXNwZWN0Pj4pOiBNZXRob2REZWNvcmF0b3I7XG5mdW5jdGlvbiBVc2VBc3BlY3RzKGFkdmljZTogQWR2aWNlLCBhc3BlY3RzOiBBcnJheTxOZXdhYmxlPEFzcGVjdD4+KTogTWV0aG9kRGVjb3JhdG9yO1xuZnVuY3Rpb24gVXNlQXNwZWN0cyhhZHZpY2U6IEFkdmljZSwgYXNwZWN0czogQXJyYXk8TmV3YWJsZTxBc3BlY3Q+Pik6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgIGNvbnN0IGNsYXp6ID0gdGFyZ2V0LmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dHlwZW9mIHRhcmdldD47XG4gICAgICAgIGFzcGVjdHMuZm9yRWFjaChhc3BlY3RDbGFzcyA9PiB7XG4gICAgICAgICAgICBhZGRBc3BlY3QoYXNwZWN0Q2xhc3MsICdleGVjdXRlJywgYWR2aWNlLCBQb2ludGN1dC5vZihjbGF6eiwgcHJvcGVydHlLZXkpKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn1cblxuZXhwb3J0IHsgVXNlQXNwZWN0cyB9O1xuIiwiaW1wb3J0IHsgRmFjdG9yeSB9IGZyb20gJy4uL2RlY29yYXRvcnMnO1xuaW1wb3J0IHsgRmFjdG9yeUlkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9GYWN0b3J5SWRlbnRpZmllcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVGYWN0b3J5V3JhcHBlcjxUPihwcm9kdWNlSWRlbnRpZmllcjogRmFjdG9yeUlkZW50aWZpZXIsIHByb2R1Y2U6IHVua25vd24sIG93bmVyOiBUKTogVCB7XG4gICAgY2xhc3MgVGhlRmFjdG9yeSB7XG4gICAgICAgIEBGYWN0b3J5KHByb2R1Y2VJZGVudGlmaWVyKVxuICAgICAgICBwcm9kdWNlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHByb2R1Y2U7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGljIHByZXZlbnRUcmVlU2hha2luZygpIHtcbiAgICAgICAgICAgIHJldHVybiBvd25lcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gVGhlRmFjdG9yeS5wcmV2ZW50VHJlZVNoYWtpbmcoKTtcbn1cbiJdLCJuYW1lcyI6WyJJbnN0YW5jZVNjb3BlIiwiRXhwcmVzc2lvblR5cGUiLCJBZHZpY2UiLCJMaWZlY3ljbGUiLCJsYXp5UHJvcCIsImxhenlNZW1iZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBTSxTQUFVLHFCQUFxQixDQUFPLE9BQXNCLEVBQUE7SUFDOUQsSUFBQSxJQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBUSxDQUFDO1FBQzVCLElBQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLElBQUEsR0FBRyxDQUFDLEdBQUcsR0FBRyxVQUFVLEdBQU0sRUFBQTtJQUN0QixRQUFBLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUNkLFlBQUEsT0FBTyxTQUFTLENBQUMsR0FBRyxDQUFNLENBQUM7SUFDOUIsU0FBQTtJQUFNLGFBQUE7SUFDSCxZQUFBLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJ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LGNBQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDM0YsS0FBQyxDQUFDO0lBQ047O0lDSk0sU0FBVSxXQUFXLENBQUMsUUFBa0IsRUFBQTtRQUMxQyxPQUFPLFVBQVUsTUFBTSxFQUFFLFdBQVcsRUFBQTtJQUNoQyxRQUFBLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBK0IsRUFBRSxXQUFXLEVBQUVBLGNBQU0sQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDakcsS0FBQyxDQUFDO0lBQ047O0lDSk0sU0FBVSxNQUFNLENBQUMsUUFBa0IsRUFBQTtRQUNyQyxPQUFPLFVBQVUsTUFBTSxFQUFFLFdBQVcsRUFBQTtJQUNoQyxRQUFBLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBK0IsRUFBRSxXQUFXLEVBQUVBLGNBQU0sQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDNUYsS0FBQyxDQUFDO0lBQ047O0lDSk0sU0FBVSxNQUFNLENBQUMsUUFBa0IsRUFBQTtRQUNyQyxPQUFPLFVBQVUsTUFBTSxFQUFFLFdBQVcsRUFBQTtJQUNoQyxRQUFBLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBK0IsRUFBRSxXQUFXLEVBQUVBLGNBQU0sQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDNUYsS0FBQyxDQUFDO0lBQ047O0lDSk0sU0FBVSxPQUFPLENBQUMsUUFBa0IsRUFBQTtRQUN0QyxPQUFPLFVBQVUsTUFBTSxFQUFFLFdBQVcsRUFBQTtJQUNoQyxRQUFBLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBK0IsRUFBRSxXQUFXLEVBQUVBLGNBQU0sQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDN0YsS0FBQyxDQUFDO0lBQ047O0lDSk0sU0FBVSxNQUFNLENBQUMsUUFBa0IsRUFBQTtRQUNyQyxPQUFPLFVBQVUsTUFBTSxFQUFFLFdBQVcsRUFBQTtJQUNoQyxRQUFBLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBK0IsRUFBRSxXQUFXLEVBQUVBLGNBQU0sQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDNUYsS0FBQyxDQUFDO0lBQ047O0lDREEsU0FBUyxVQUFVLENBQUMsTUFBYyxFQUFFLE9BQStCLEVBQUE7UUFDL0QsT0FBTyxVQUFVLE1BQU0sRUFBRSxXQUFXLEVBQUE7SUFDaEMsUUFBQSxJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsV0FBcUMsQ0FBQztJQUMzRCxRQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQSxXQUFXLEVBQUE7SUFDdkIsWUFBQSxTQUFTLENBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUMvRSxTQUFDLENBQUMsQ0FBQztJQUNQLEtBQUMsQ0FBQztJQUNOOzthQ1pnQixvQkFBb0IsQ0FBSSxpQkFBb0MsRUFBRSxPQUFnQixFQUFFLEtBQVEsRUFBQTtJQUNwRyxJQUFBLElBQUEsVUFBQSxrQkFBQSxZQUFBO0lBQUEsUUFBQSxTQUFBLFVBQUEsR0FBQTthQVFDO0lBTkcsUUFBQSxVQUFBLENBQUEsU0FBQSxDQUFBLE9BQU8sR0FEUCxZQUFBO0lBRUksWUFBQSxPQUFPLE9BQU8sQ0FBQzthQUNsQixDQUFBO0lBQ00sUUFBQSxVQUFBLENBQUEsa0JBQWtCLEdBQXpCLFlBQUE7SUFDSSxZQUFBLE9BQU8sS0FBSyxDQUFDO2FBQ2hCLENBQUE7SUFORCxRQUFBLFVBQUEsQ0FBQTtnQkFBQyxPQUFPLENBQUMsaUJBQWlCLENBQUM7Ozs7SUFHMUIsU0FBQSxFQUFBLFVBQUEsQ0FBQSxTQUFBLEVBQUEsU0FBQSxFQUFBLElBQUEsQ0FBQSxDQUFBO1lBSUwsT0FBQyxVQUFBLENBQUE7SUFBQSxLQVJELEVBUUMsQ0FBQSxDQUFBO0lBQ0QsSUFBQSxPQUFPLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQzNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
