import 'reflect-metadata';
import { lazyProp, lazyMember } from '@vgerbot/lazy';

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

var InstanceScope;
(function (InstanceScope) {
    InstanceScope["SINGLETON"] = "ioc-resolution:container-singleton";
    InstanceScope["TRANSIENT"] = "ioc-resolution:transient";
    InstanceScope["GLOBAL_SHARED_SINGLETON"] = "ioc-resolution:global-shared-singleton";
})(InstanceScope || (InstanceScope = {}));

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
        var def = new ServiceFactoryDef(metadata.reader().getClass(), InstanceScope.SINGLETON);
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
        if (this.scope === InstanceScope.SINGLETON && this.factories.size === 1 && this.factories.has(factory)) {
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
        if (scope === void 0) { scope = InstanceScope.SINGLETON; }
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
        if (scope === void 0) { scope = InstanceScope.SINGLETON; }
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

var ExpressionType;
(function (ExpressionType) {
    ExpressionType["ENV"] = "inject-environment-variables";
    ExpressionType["JSON_PATH"] = "inject-json-data";
    ExpressionType["ARGV"] = "inject-argv";
})(ExpressionType || (ExpressionType = {}));

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
        case ExpressionType.ENV:
        case ExpressionType.ARGV:
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
    return Value(name, ExpressionType.ARGV, argv);
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
    return Value(name, ExpressionType.ENV);
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

var Advice;
(function (Advice) {
    Advice[Advice["Before"] = 0] = "Before";
    Advice[Advice["After"] = 1] = "After";
    Advice[Advice["Around"] = 2] = "Around";
    Advice[Advice["AfterReturn"] = 3] = "AfterReturn";
    Advice[Advice["Thrown"] = 4] = "Thrown";
    Advice[Advice["Finally"] = 5] = "Finally";
})(Advice || (Advice = {}));

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
            case Advice.Before:
                hooksArray = this.beforeHooks;
                break;
            case Advice.After:
                hooksArray = this.afterHooks;
                break;
            case Advice.Thrown:
                hooksArray = this.thrownHooks;
                break;
            case Advice.Finally:
                hooksArray = this.finallyHooks;
                break;
            case Advice.AfterReturn:
                hooksArray = this.afterReturnHooks;
                break;
            case Advice.Around:
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
    var beforeAdviceAspects = allMatchAspects.filter(function (it) { return it.advice === Advice.Before; }).map(ClassToInstance);
    var afterAdviceAspects = allMatchAspects.filter(function (it) { return it.advice === Advice.After; }).map(ClassToInstance);
    var tryCatchAdviceAspects = allMatchAspects.filter(function (it) { return it.advice === Advice.Thrown; }).map(ClassToInstance);
    var tryFinallyAdviceAspects = allMatchAspects.filter(function (it) { return it.advice === Advice.Finally; }).map(ClassToInstance);
    var afterReturnAdviceAspects = allMatchAspects.filter(function (it) { return it.advice === Advice.AfterReturn; }).map(ClassToInstance);
    var aroundAdviceAspects = allMatchAspects.filter(function (it) { return it.advice === Advice.Around; }).map(ClassToInstance);
    if (beforeAdviceAspects.length > 0) {
        aspectUtils.append(Advice.Before, function (args) {
            var joinPoint = createAspectCtx(Advice.Before, args);
            beforeAdviceAspects.forEach(function (aspect) {
                aspect.execute(joinPoint);
            });
        });
    }
    if (afterAdviceAspects.length > 0) {
        aspectUtils.append(Advice.After, function (args) {
            var joinPoint = createAspectCtx(Advice.After, args);
            afterAdviceAspects.forEach(function (aspect) {
                aspect.execute(joinPoint);
            });
        });
    }
    if (tryCatchAdviceAspects.length > 0) {
        aspectUtils.append(Advice.Thrown, function (error, args) {
            var joinPoint = createAspectCtx(Advice.Thrown, args, null, error);
            tryCatchAdviceAspects.forEach(function (aspect) {
                aspect.execute(joinPoint);
            });
        });
    }
    if (tryFinallyAdviceAspects.length > 0) {
        aspectUtils.append(Advice.Finally, function (args) {
            var joinPoint = createAspectCtx(Advice.Finally, args);
            tryFinallyAdviceAspects.forEach(function (aspect) {
                aspect.execute(joinPoint);
            });
        });
    }
    if (afterReturnAdviceAspects.length > 0) {
        aspectUtils.append(Advice.AfterReturn, function (returnValue, args) {
            return afterReturnAdviceAspects.reduce(function (prevReturnValue, aspect) {
                var joinPoint = createAspectCtx(Advice.AfterReturn, args, returnValue);
                return aspect.execute(joinPoint);
            }, returnValue);
        });
    }
    if (aroundAdviceAspects.length > 0) {
        aroundAdviceAspects.forEach(function (aspect) {
            aspectUtils.append(Advice.Around, function (originFn, args) {
                var joinPoint = createAspectCtx(Advice.Around, args, null);
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

var Lifecycle;
(function (Lifecycle) {
    Lifecycle["PRE_INJECT"] = "ioc-scope:pre-inject";
    Lifecycle["POST_INJECT"] = "ioc-scope:post-inject";
    Lifecycle["PRE_DESTROY"] = "ioc-scope:pre-destroy";
})(Lifecycle || (Lifecycle = {}));

function invokePreDestroy(instance) {
    var clazz = instance === null || instance === void 0 ? void 0 : instance.constructor;
    if (!clazz) {
        return;
    }
    var metadata = MetadataInstanceManager.getMetadata(clazz, ClassMetadata);
    var preDestroyMethods = metadata.getMethods(Lifecycle.PRE_DESTROY);
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
        var methods = this.classMetadataReader.getMethods(Lifecycle.PRE_INJECT);
        this.invokeLifecycleMethods(instance, methods);
    };
    LifecycleManager.prototype.invokePostInjectMethod = function (instance) {
        var methods = this.classMetadataReader.getMethods(Lifecycle.POST_INJECT);
        this.invokeLifecycleMethods(instance, methods);
    };
    LifecycleManager.prototype.invokePreDestroyInjectMethod = function (instance) {
        var methods = this.classMetadataReader.getMethods(Lifecycle.PRE_DESTROY);
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
            lazyProp(instance, key, getter);
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
        lazyMember({
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
        this.defaultScope = options.defaultScope || InstanceScope.SINGLETON;
        this.lazyMode = (_a = options.lazyMode) !== null && _a !== void 0 ? _a : true;
        this.registerInstanceScopeResolution(InstanceScope.SINGLETON, SingletonInstanceResolution);
        this.registerInstanceScopeResolution(InstanceScope.GLOBAL_SHARED_SINGLETON, GlobalSharedInstanceResolution);
        this.registerInstanceScopeResolution(InstanceScope.TRANSIENT, TransientInstanceResolution);
        this.registerEvaluator(ExpressionType.JSON_PATH, JSONDataEvaluator);
        if (isNodeJs) {
            this.registerEvaluator(ExpressionType.ENV, EnvironmentEvaluator);
            this.registerEvaluator(ExpressionType.ARGV, ArgvEvaluator);
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
            metadata.addLifecycleMethod(INSTANCE_PRE_DESTROY_METHOD, Lifecycle.PRE_DESTROY);
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
        if (scope === void 0) { scope = InstanceScope.SINGLETON; }
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
        var resolution = this.resolutions.get(InstanceScope.SINGLETON);
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
        metadata.setScope(InstanceScope.SINGLETON);
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
        var resolution = this.resolutions.get(InstanceScope.TRANSIENT);
        (resolution === null || resolution === void 0 ? void 0 : resolution.destroyThat) && resolution.destroyThat(instance);
    };
    return ApplicationContext;
}());

function Factory(produceIdentifier, scope) {
    if (scope === void 0) { scope = InstanceScope.SINGLETON; }
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
            }, [], (_b = (_a = classMetadata.reader().getScope()) !== null && _a !== void 0 ? _a : options.scope) !== null && _b !== void 0 ? _b : InstanceScope.SINGLETON);
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
    return Value("".concat(namespace, ":").concat(jsonpath), ExpressionType.JSON_PATH);
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
var PostInject = function () { return LifecycleDecorator(Lifecycle.POST_INJECT); };

var PreDestroy = function () { return LifecycleDecorator(Lifecycle.PRE_DESTROY); };

/**
 * Urn calls the methods annotated with @PostInject only once, just after the injection of properties.
 * @annotation
 */
var PreInject = function () { return LifecycleDecorator(Lifecycle.PRE_INJECT); };

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
        addAspect(target.constructor, propertyKey, Advice.After, pointcut);
    };
}

function AfterReturn(pointcut) {
    return function (target, propertyKey) {
        addAspect(target.constructor, propertyKey, Advice.AfterReturn, pointcut);
    };
}

function Around(pointcut) {
    return function (target, propertyKey) {
        addAspect(target.constructor, propertyKey, Advice.Around, pointcut);
    };
}

function Before(pointcut) {
    return function (target, propertyKey) {
        addAspect(target.constructor, propertyKey, Advice.Before, pointcut);
    };
}

function Finally(pointcut) {
    return function (target, propertyKey) {
        addAspect(target.constructor, propertyKey, Advice.Finally, pointcut);
    };
}

function Thrown(pointcut) {
    return function (target, propertyKey) {
        addAspect(target.constructor, propertyKey, Advice.Thrown, pointcut);
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

export { AOPClassMetadata, Advice, After, AfterReturn, Alias, ApplicationContext, Argv, Around, Before, Bind, ClassMetadata, ComponentMethodAspect, Env, ExpressionType, FUNCTION_METADATA_KEY, Factory, Finally, FunctionMetadata, Generate, GlobalMetadata, Inject, Injectable, InjectionType, InstAwareProcessor, InstanceScope, JSONData, Lifecycle, LifecycleDecorator, Mark, MarkInfoContainer, ParameterMarkInfoContainer, Pointcut, PostInject, PreDestroy, PreInject, Scope, Thrown, UseAspects, Value, createFactoryWrapper };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguZXNtLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29tbW9uL0RlZmF1bHRWYWx1ZU1hcC50cyIsIi4uL3NyYy9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlci50cyIsIi4uL3NyYy9tZXRhZGF0YS9DbGFzc01ldGFkYXRhLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vSW5zdGFuY2VTY29wZS50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL1NlcnZpY2VGYWN0b3J5RGVmLnRzIiwiLi4vc3JjL2NvbW1vbi9GYWN0b3J5UmVjb3JkZXIudHMiLCIuLi9zcmMvbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEudHMiLCIuLi9zcmMvdHlwZXMvRXZhbHVhdGVPcHRpb25zLnRzIiwiLi4vc3JjL2NvbW1vbi9pc05vZGVKcy50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0luamVjdGlvblR5cGUudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9WYWx1ZS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0FyZ3YudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9BbGlhcy50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0JpbmQudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9FbnYudHMiLCIuLi9zcmMvY29tbW9uL2lzTm90RGVmaW5lZC50cyIsIi4uL3NyYy9hb3AvQWR2aWNlLnRzIiwiLi4vc3JjL2FvcC9Bc3BlY3RVdGlscy50cyIsIi4uL3NyYy9hb3AvY3JlYXRlQXNwZWN0LnRzIiwiLi4vc3JjL2FvcC9Db21wb25lbnRNZXRob2RBc3BlY3QudHMiLCIuLi9zcmMvYW9wL0FzcGVjdE1ldGFkdGEudHMiLCIuLi9zcmMvY29tbW9uL1Byb3h5VGFyZ2V0UmVjb3JkZXIudHMiLCIuLi9zcmMvYW9wL0FPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvci50cyIsIi4uL3NyYy9ldmFsdWF0b3IvQXJndkV2YWx1YXRvci50cyIsIi4uL3NyYy9ldmFsdWF0b3IvRW52aXJvbm1lbnRFdmFsdWF0b3IudHMiLCIuLi9zcmMvZXZhbHVhdG9yL0pTT05EYXRhRXZhbHVhdG9yLnRzIiwiLi4vc3JjL21ldGFkYXRhL0Z1bmN0aW9uTWV0YWRhdGEudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9Db21wb25lbnRJbnN0YW5jZVdyYXBwZXIudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9MaWZlY3ljbGUudHMiLCIuLi9zcmMvY29tbW9uL2ludm9rZVByZURlc3Ryb3kudHMiLCIuLi9zcmMvcmVzb2x1dGlvbi9TaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24udHMiLCIuLi9zcmMvcmVzb2x1dGlvbi9HbG9iYWxTaGFyZWRJbnN0YW5jZVJlc29sdXRpb24udHMiLCIuLi9zcmMvcmVzb2x1dGlvbi9UcmFuc2llbnRJbnN0YW5jZVJlc29sdXRpb24udHMiLCIuLi9zcmMvZm91bmRhdGlvbi9MaWZlY3ljbGVNYW5hZ2VyLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vRXZlbnRFbWl0dGVyLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlci50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0ludm9rZUZ1bmN0aW9uT3B0aW9ucy50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0FwcGxpY2F0aW9uQ29udGV4dC50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0ZhY3RvcnkudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9HZW5lcmF0ZS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0luamVjdC50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0luamVjdGFibGUudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9JbnN0QXdhcmVQcm9jZXNzb3IudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9KU09ORGF0YS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0xpZmVjeWNsZURlY29yYXRvci50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL01hcmsudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9Qb3N0SW5qZWN0LnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvUHJlRGVzdHJveS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL1ByZUluamVjdC50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL1Njb3BlLnRzIiwiLi4vc3JjL2FvcC9BT1BDbGFzc01ldGFkYXRhLnRzIiwiLi4vc3JjL2NvbW1vbi9nZXRBbGxNZXRob2RNZW1iZXJOYW1lcy50cyIsIi4uL3NyYy9hb3AvUG9pbnRjdXQudHMiLCIuLi9zcmMvYW9wL2FkZEFzcGVjdC50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9BZnRlci50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9BZnRlclJldHVybi50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9Bcm91bmQudHMiLCIuLi9zcmMvYW9wL2RlY29yYXRvcnMvQmVmb3JlLnRzIiwiLi4vc3JjL2FvcC9kZWNvcmF0b3JzL0ZpbmFsbHkudHMiLCIuLi9zcmMvYW9wL2RlY29yYXRvcnMvVGhyb3duLnRzIiwiLi4vc3JjL2FvcC9kZWNvcmF0b3JzL1VzZUFzcGVjdHMudHMiLCIuLi9zcmMvdXRpbHMvY3JlYXRlRmFjdG9yeVdyYXBwZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURlZmF1bHRWYWx1ZU1hcDxLLCBWPihmYWN0b3J5OiAoa2V5OiBLKSA9PiBWKSB7XG4gICAgY29uc3QgbWFwID0gbmV3IE1hcDxLLCBWPigpO1xuICAgIGNvbnN0IG9yaWdpbkdldCA9IG1hcC5nZXQuYmluZChtYXApO1xuICAgIG1hcC5nZXQgPSBmdW5jdGlvbiAoa2V5OiBLKSB7XG4gICAgICAgIGlmIChtYXAuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiBvcmlnaW5HZXQoa2V5KSBhcyBWO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFZhbHVlID0gZmFjdG9yeShrZXkpO1xuICAgICAgICAgICAgbWFwLnNldChrZXksIGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gbWFwLmdldChrZXkpIGFzIFY7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBtYXAgYXMgRGVmYXVsdFZhbHVlTWFwPEssIFY+O1xufVxuZXhwb3J0IHR5cGUgRGVmYXVsdFZhbHVlTWFwPEssIFY+ID0gT21pdDxNYXA8SywgVj4sICdnZXQnPiAmIHtcbiAgICBnZXQ6IChrZXk6IEspID0+IFY7XG59O1xuIiwiaW1wb3J0IHsgTWV0YWRhdGEsIE1ldGFkYXRhQ2xhc3MsIE1ldGFkYXRhUmVhZGVyIH0gZnJvbSAnLi4vdHlwZXMvTWV0YWRhdGEnO1xuaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcCB9IGZyb20gJy4uL2NvbW1vbi9EZWZhdWx0VmFsdWVNYXAnO1xuXG50eXBlIEFueU1ldGFkYXRhID0gTWV0YWRhdGE8TWV0YWRhdGFSZWFkZXIsIHVua25vd24+O1xudHlwZSBBbnlNZXRhZGF0YUNsYXNzID0gTWV0YWRhdGFDbGFzczxNZXRhZGF0YVJlYWRlciwgdW5rbm93biwgQW55TWV0YWRhdGE+O1xuXG5jb25zdCBtZXRhZGF0YUluc3RhbmNlTWFwID0gY3JlYXRlRGVmYXVsdFZhbHVlTWFwPEFueU1ldGFkYXRhQ2xhc3MsIFNldDxBbnlNZXRhZGF0YT4+KCgpID0+IG5ldyBTZXQoKSk7XG5cbmV4cG9ydCBjbGFzcyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB7XG4gICAgc3RhdGljIGdldE1ldGFkYXRhPFIgZXh0ZW5kcyBNZXRhZGF0YVJlYWRlciwgVCBleHRlbmRzIE9iamVjdCwgTSBleHRlbmRzIE1ldGFkYXRhPFIsIFQ+ID0gTWV0YWRhdGE8UiwgVD4+KFxuICAgICAgICB0YXJnZXQ6IFQsXG4gICAgICAgIG1ldGFkYXRhQ2xhc3M6IE1ldGFkYXRhQ2xhc3M8UiwgVCwgTT5cbiAgICApIHtcbiAgICAgICAgY29uc3Qga2V5ID0gbWV0YWRhdGFDbGFzcy5nZXRSZWZsZWN0S2V5KCk7XG4gICAgICAgIGxldCBtZXRhZGF0YSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoa2V5LCB0YXJnZXQpO1xuICAgICAgICBpZiAoIW1ldGFkYXRhKSB7XG4gICAgICAgICAgICBtZXRhZGF0YSA9IG5ldyBtZXRhZGF0YUNsYXNzKCk7XG4gICAgICAgICAgICBtZXRhZGF0YS5pbml0KHRhcmdldCk7XG4gICAgICAgICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKGtleSwgbWV0YWRhdGEsIHRhcmdldCk7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZVNldCA9IG1ldGFkYXRhSW5zdGFuY2VNYXAuZ2V0KG1ldGFkYXRhQ2xhc3MpO1xuICAgICAgICAgICAgaW5zdGFuY2VTZXQuYWRkKG1ldGFkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWV0YWRhdGEgYXMgTTtcbiAgICB9XG4gICAgc3RhdGljIGdldEFsbEluc3RhbmNlb2Y8TSBleHRlbmRzIEFueU1ldGFkYXRhQ2xhc3M+KG1ldGFkYXRhQ2xhc3M6IE0pIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obWV0YWRhdGFJbnN0YW5jZU1hcC5nZXQobWV0YWRhdGFDbGFzcykpO1xuICAgIH1cbn1cbiIsIi8vIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbmltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luc3RhbmNlU2NvcGUnO1xuaW1wb3J0IHsgSnNTZXJ2aWNlQ2xhc3MgfSBmcm9tICcuLi90eXBlcy9Kc1NlcnZpY2VDbGFzcyc7XG5pbXBvcnQgeyBNZXRhZGF0YSwgTWV0YWRhdGFSZWFkZXIgfSBmcm9tICcuLi90eXBlcy9NZXRhZGF0YSc7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBjcmVhdGVEZWZhdWx0VmFsdWVNYXAgfSBmcm9tICcuLi9jb21tb24vRGVmYXVsdFZhbHVlTWFwJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBNZW1iZXJLZXkgfSBmcm9tICcuLi90eXBlcy9NZW1iZXJLZXknO1xuaW1wb3J0IHsgS2V5T2YgfSBmcm9tICcuLi90eXBlcy9LZXlPZic7XG5pbXBvcnQgeyBJbmplY3Rpb25UeXBlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9JbmplY3Rpb25UeXBlJztcblxuY29uc3QgQ0xBU1NfTUVUQURBVEFfS0VZID0gJ2lvYzpjbGFzcy1tZXRhZGF0YSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFya0luZm8ge1xuICAgIFtrZXk6IHN0cmluZyB8IHN5bWJvbF06IHVua25vd247XG59XG5cbmV4cG9ydCBjbGFzcyBNYXJrSW5mb0NvbnRhaW5lciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBtYXAgPSBjcmVhdGVEZWZhdWx0VmFsdWVNYXA8TWVtYmVyS2V5LCBNYXJrSW5mbz4oKCkgPT4gKHt9IGFzIE1hcmtJbmZvKSk7XG4gICAgZ2V0TWFya0luZm8obWV0aG9kOiBNZW1iZXJLZXkpOiBNYXJrSW5mbyB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcC5nZXQobWV0aG9kKTtcbiAgICB9XG4gICAgbWFyayhtZXRob2Q6IE1lbWJlcktleSwga2V5OiBNZW1iZXJLZXksIHZhbHVlOiB1bmtub3duKSB7XG4gICAgICAgIGNvbnN0IG1hcmtJbmZvID0gdGhpcy5tYXAuZ2V0KG1ldGhvZCk7XG4gICAgICAgIG1hcmtJbmZvW2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgZ2V0TWVtYmVycygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTZXQodGhpcy5tYXAua2V5cygpKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQYXJhbWV0ZXJNYXJrSW5mb0NvbnRhaW5lciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBtYXAgPSBjcmVhdGVEZWZhdWx0VmFsdWVNYXA8TWVtYmVyS2V5LCBSZWNvcmQ8bnVtYmVyLCBNYXJrSW5mbz4+KCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH0pO1xuICAgIGdldE1hcmtJbmZvKG1ldGhvZDogTWVtYmVyS2V5KTogUmVjb3JkPG51bWJlciwgTWFya0luZm8+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwLmdldChtZXRob2QpO1xuICAgIH1cbiAgICBtYXJrKG1ldGhvZDogTWVtYmVyS2V5LCBpbmRleDogbnVtYmVyLCBrZXk6IE1lbWJlcktleSwgdmFsdWU6IHVua25vd24pIHtcbiAgICAgICAgY29uc3QgcGFyYW1zTWFya0luZm8gPSB0aGlzLm1hcC5nZXQobWV0aG9kKTtcbiAgICAgICAgY29uc3QgbWFya0luZm8gPSBwYXJhbXNNYXJrSW5mb1tpbmRleF0gfHwge307XG4gICAgICAgIG1hcmtJbmZvW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgcGFyYW1zTWFya0luZm9baW5kZXhdID0gbWFya0luZm87XG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENsYXNzTWFya0luZm8ge1xuICAgIGN0b3I6IE1hcmtJbmZvO1xuICAgIG1lbWJlcnM6IE1hcmtJbmZvQ29udGFpbmVyO1xuICAgIHBhcmFtczogUGFyYW1ldGVyTWFya0luZm9Db250YWluZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhc3NNZXRhZGF0YVJlYWRlcjxUPiBleHRlbmRzIE1ldGFkYXRhUmVhZGVyIHtcbiAgICBnZXRDbGFzcygpOiBOZXdhYmxlPFQ+O1xuICAgIGdldFNjb3BlKCk6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgZ2V0Q29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlcygpOiBBcnJheTxJbmplY3Rpb25UeXBlPjtcbiAgICBnZXRNZXRob2RzKGxpZmVjeWNsZTogTGlmZWN5Y2xlKTogQXJyYXk8c3RyaW5nIHwgc3ltYm9sPjtcbiAgICBnZXRQcm9wZXJ0eVR5cGVNYXAoKTogTWFwPHN0cmluZyB8IHN5bWJvbCwgSW5qZWN0aW9uVHlwZT47XG4gICAgZ2V0Q3Rvck1hcmtJbmZvKCk6IE1hcmtJbmZvO1xuICAgIGdldEFsbE1hcmtlZE1lbWJlcnMoKTogU2V0PE1lbWJlcktleT47XG4gICAgZ2V0TWVtYmVyc01hcmtJbmZvKG1ldGhvZEtleTogS2V5T2Y8VD4pOiBNYXJrSW5mbztcbiAgICBnZXRQYXJhbWV0ZXJNYXJrSW5mbyhtZXRob2RLZXk6IEtleU9mPFQ+KTogUmVjb3JkPG51bWJlciwgTWFya0luZm8+O1xufVxuXG5leHBvcnQgY2xhc3MgQ2xhc3NNZXRhZGF0YTxUPiBpbXBsZW1lbnRzIE1ldGFkYXRhPENsYXNzTWV0YWRhdGFSZWFkZXI8VD4sIE5ld2FibGU8VD4+IHtcbiAgICBzdGF0aWMgZ2V0UmVmbGVjdEtleSgpIHtcbiAgICAgICAgcmV0dXJuIENMQVNTX01FVEFEQVRBX0tFWTtcbiAgICB9XG4gICAgcHJpdmF0ZSBzY29wZT86IEluc3RhbmNlU2NvcGUgfCBzdHJpbmc7XG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvclBhcmFtZXRlclR5cGVzOiBBcnJheTxJbmplY3Rpb25UeXBlPiA9IFtdO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbGlmZWN5Y2xlTWV0aG9kc01hcDogUmVjb3JkPHN0cmluZyB8IHN5bWJvbCwgU2V0PExpZmVjeWNsZT4+ID0ge307XG4gICAgcHJpdmF0ZSByZWFkb25seSBwcm9wZXJ0eVR5cGVzTWFwID0gbmV3IE1hcDxzdHJpbmcgfCBzeW1ib2wsIEluamVjdGlvblR5cGU+KCk7XG4gICAgcHJpdmF0ZSBjbGF6eiE6IE5ld2FibGU8VD47XG4gICAgcHJpdmF0ZSByZWFkb25seSBtYXJrczogQ2xhc3NNYXJrSW5mbyA9IHtcbiAgICAgICAgY3Rvcjoge30sXG4gICAgICAgIG1lbWJlcnM6IG5ldyBNYXJrSW5mb0NvbnRhaW5lcigpLFxuICAgICAgICBwYXJhbXM6IG5ldyBQYXJhbWV0ZXJNYXJrSW5mb0NvbnRhaW5lcigpXG4gICAgfTtcblxuICAgIHN0YXRpYyBnZXRJbnN0YW5jZTxUPihjdG9yOiBOZXdhYmxlPFQ+KSB7XG4gICAgICAgIHJldHVybiBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICB9XG4gICAgc3RhdGljIGdldFJlYWRlcjxUPihjdG9yOiBOZXdhYmxlPFQ+KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbmNlKGN0b3IpLnJlYWRlcigpO1xuICAgIH1cblxuICAgIGluaXQodGFyZ2V0OiBOZXdhYmxlPFQ+KSB7XG4gICAgICAgIHRoaXMuY2xhenogPSB0YXJnZXQ7XG4gICAgICAgIGNvbnN0IGNvbnN0ciA9IHRhcmdldCBhcyBKc1NlcnZpY2VDbGFzczx1bmtub3duPjtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25zdHIuc2NvcGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U2NvcGUoY29uc3RyLnNjb3BlKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgY29uc3RyLmluamVjdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29uc3QgaW5qZWN0aW9ucyA9IGNvbnN0ci5pbmplY3QoKTtcbiAgICAgICAgICAgIFJlZmxlY3Qub3duS2V5cyhpbmplY3Rpb25zKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWNvcmRQcm9wZXJ0eVR5cGUoa2V5LCBpbmplY3Rpb25zW2tleV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBjb25zdHIubWV0YWRhdGEgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gY29uc3RyLm1ldGFkYXRhKCk7XG4gICAgICAgICAgICBpZiAobWV0YWRhdGEuc2NvcGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNjb3BlKG1ldGFkYXRhLnNjb3BlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGluamVjdGlvbnMgPSBtZXRhZGF0YS5pbmplY3Q7XG4gICAgICAgICAgICBpZiAoaW5qZWN0aW9ucykge1xuICAgICAgICAgICAgICAgIFJlZmxlY3Qub3duS2V5cyhpbmplY3Rpb25zKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVjb3JkUHJvcGVydHlUeXBlKGtleSwgaW5qZWN0aW9uc1trZXldKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1hcmtlcigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGN0b3I6IChrZXk6IHN0cmluZyB8IHN5bWJvbCwgdmFsdWU6IHVua25vd24pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm1hcmtzLmN0b3Jba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1lbWJlcjogKHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wgfCBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBtYXJrOiAoa2V5OiBzdHJpbmcgfCBzeW1ib2wsIHZhbHVlOiB1bmtub3duKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtzLm1lbWJlcnMubWFyayhwcm9wZXJ0eUtleSwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcmFtZXRlcjogKHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBtYXJrOiAoa2V5OiBzdHJpbmcgfCBzeW1ib2wsIHZhbHVlOiB1bmtub3duKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtzLnBhcmFtcy5tYXJrKHByb3BlcnR5S2V5LCBpbmRleCwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBzZXRTY29wZShzY29wZTogSW5zdGFuY2VTY29wZSB8IHN0cmluZykge1xuICAgICAgICB0aGlzLnNjb3BlID0gc2NvcGU7XG4gICAgfVxuICAgIHNldENvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZShpbmRleDogbnVtYmVyLCB0eXBlOiBJbmplY3Rpb25UeXBlKSB7XG4gICAgICAgIHRoaXMuY29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlc1tpbmRleF0gPSB0eXBlO1xuICAgIH1cbiAgICByZWNvcmRQcm9wZXJ0eVR5cGUocHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCwgdHlwZTogSW5qZWN0aW9uVHlwZSkge1xuICAgICAgICB0aGlzLnByb3BlcnR5VHlwZXNNYXAuc2V0KHByb3BlcnR5S2V5LCB0eXBlKTtcbiAgICB9XG4gICAgYWRkTGlmZWN5Y2xlTWV0aG9kKG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCwgbGlmZWN5Y2xlOiBMaWZlY3ljbGUpIHtcbiAgICAgICAgY29uc3QgbGlmZWN5Y2xlcyA9IHRoaXMuZ2V0TGlmZWN5Y2xlcyhtZXRob2ROYW1lKTtcbiAgICAgICAgbGlmZWN5Y2xlcy5hZGQobGlmZWN5Y2xlKTtcbiAgICAgICAgdGhpcy5saWZlY3ljbGVNZXRob2RzTWFwW21ldGhvZE5hbWVdID0gbGlmZWN5Y2xlcztcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRMaWZlY3ljbGVzKG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5saWZlY3ljbGVNZXRob2RzTWFwW21ldGhvZE5hbWVdIHx8IG5ldyBTZXQ8TGlmZWN5Y2xlPigpO1xuICAgIH1cbiAgICBnZXRNZXRob2RzKGxpZmVjeWNsZTogTGlmZWN5Y2xlKTogQXJyYXk8c3RyaW5nIHwgc3ltYm9sPiB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmxpZmVjeWNsZU1ldGhvZHNNYXApLmZpbHRlcihpdCA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaWZlY3ljbGVzID0gdGhpcy5saWZlY3ljbGVNZXRob2RzTWFwW2l0XTtcbiAgICAgICAgICAgIHJldHVybiBsaWZlY3ljbGVzLmhhcyhsaWZlY3ljbGUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRTdXBlckNsYXNzKCkge1xuICAgICAgICBjb25zdCBzdXBlckNsYXNzUHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMuY2xhenopO1xuICAgICAgICBpZiAoIXN1cGVyQ2xhc3NQcm90b3R5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN1cGVyQ2xhc3MgPSBzdXBlckNsYXNzUHJvdG90eXBlLmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dW5rbm93bj47XG4gICAgICAgIGlmIChzdXBlckNsYXNzID09PSB0aGlzLmNsYXp6KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXJDbGFzcztcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRTdXBlckNsYXNzTWV0YWRhdGEoKTogQ2xhc3NNZXRhZGF0YTx1bmtub3duPiB8IG51bGwge1xuICAgICAgICBjb25zdCBzdXBlckNsYXNzID0gdGhpcy5nZXRTdXBlckNsYXNzKCk7XG4gICAgICAgIGlmICghc3VwZXJDbGFzcykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIENsYXNzTWV0YWRhdGEuZ2V0SW5zdGFuY2Uoc3VwZXJDbGFzcyk7XG4gICAgfVxuICAgIHJlYWRlcigpOiBDbGFzc01ldGFkYXRhUmVhZGVyPFQ+IHtcbiAgICAgICAgY29uc3Qgc3VwZXJSZWFkZXIgPSB0aGlzLmdldFN1cGVyQ2xhc3NNZXRhZGF0YSgpPy5yZWFkZXIoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldENsYXNzOiAoKSA9PiB0aGlzLmNsYXp6LFxuICAgICAgICAgICAgZ2V0U2NvcGU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zY29wZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRDb25zdHJ1Y3RvclBhcmFtZXRlclR5cGVzOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlcy5zbGljZSgwKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRNZXRob2RzOiAobGlmZWN5Y2xlOiBMaWZlY3ljbGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdXBlck1ldGhvZHMgPSBzdXBlclJlYWRlcj8uZ2V0TWV0aG9kcyhsaWZlY3ljbGUpIHx8IFtdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNNZXRob2RzID0gdGhpcy5nZXRNZXRob2RzKGxpZmVjeWNsZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChzdXBlck1ldGhvZHMuY29uY2F0KHRoaXNNZXRob2RzKSkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldFByb3BlcnR5VHlwZU1hcDogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1cGVyUHJvcGVydHlUeXBlTWFwID0gc3VwZXJSZWFkZXI/LmdldFByb3BlcnR5VHlwZU1hcCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNQcm9wZXJ0eVR5cGVzTWFwID0gdGhpcy5wcm9wZXJ0eVR5cGVzTWFwO1xuICAgICAgICAgICAgICAgIGlmICghc3VwZXJQcm9wZXJ0eVR5cGVNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXAodGhpc1Byb3BlcnR5VHlwZXNNYXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgTWFwKHN1cGVyUHJvcGVydHlUeXBlTWFwKTtcbiAgICAgICAgICAgICAgICB0aGlzUHJvcGVydHlUeXBlc01hcC5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRDdG9yTWFya0luZm86ICgpOiBNYXJrSW5mbyA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgLi4udGhpcy5tYXJrcy5jdG9yIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0QWxsTWFya2VkTWVtYmVyczogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1cGVyTWV0aG9kcyA9IHN1cGVyUmVhZGVyPy5nZXRBbGxNYXJrZWRNZW1iZXJzKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGhpc01lbWJlcnMgPSB0aGlzLm1hcmtzLm1lbWJlcnMuZ2V0TWVtYmVycygpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyTWV0aG9kcyA/IG5ldyBTZXQoc3VwZXJNZXRob2RzKSA6IG5ldyBTZXQ8TWVtYmVyS2V5PigpO1xuICAgICAgICAgICAgICAgIHRoaXNNZW1iZXJzLmZvckVhY2goaXQgPT4gcmVzdWx0LmFkZChpdCkpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0TWVtYmVyc01hcmtJbmZvOiAoa2V5OiBLZXlPZjxUPik6IE1hcmtJbmZvID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXJrcy5tZW1iZXJzLmdldE1hcmtJbmZvKGtleSBhcyBNZW1iZXJLZXkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldFBhcmFtZXRlck1hcmtJbmZvOiAobWV0aG9kS2V5OiBLZXlPZjxUPik6IFJlY29yZDxudW1iZXIsIE1hcmtJbmZvPiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFya3MucGFyYW1zLmdldE1hcmtJbmZvKG1ldGhvZEtleSBhcyBNZW1iZXJLZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsImV4cG9ydCBlbnVtIEluc3RhbmNlU2NvcGUge1xuICAgIFNJTkdMRVRPTiA9ICdpb2MtcmVzb2x1dGlvbjpjb250YWluZXItc2luZ2xldG9uJyxcbiAgICBUUkFOU0lFTlQgPSAnaW9jLXJlc29sdXRpb246dHJhbnNpZW50JyxcbiAgICBHTE9CQUxfU0hBUkVEX1NJTkdMRVRPTiA9ICdpb2MtcmVzb2x1dGlvbjpnbG9iYWwtc2hhcmVkLXNpbmdsZXRvbidcbn1cbiIsImltcG9ydCB7IFNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi4vdHlwZXMvU2VydmljZUZhY3RvcnknO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHsgSW5zdGFuY2VTY29wZSB9IGZyb20gJy4vSW5zdGFuY2VTY29wZSc7XG5cbmV4cG9ydCBjbGFzcyBTZXJ2aWNlRmFjdG9yeURlZjxUPiB7XG4gICAgc3RhdGljIGNyZWF0ZUZyb21DbGFzc01ldGFkYXRhPFQ+KG1ldGFkYXRhOiBDbGFzc01ldGFkYXRhPFQ+KSB7XG4gICAgICAgIGNvbnN0IGRlZiA9IG5ldyBTZXJ2aWNlRmFjdG9yeURlZihtZXRhZGF0YS5yZWFkZXIoKS5nZXRDbGFzcygpLCBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTik7XG4gICAgICAgIGRlZi5hcHBlbmQoKGNvbnRhaW5lcjogQXBwbGljYXRpb25Db250ZXh0LCBvd25lcjogdW5rbm93bikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWFkZXIgPSBtZXRhZGF0YS5yZWFkZXIoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjbGF6eiA9IHJlYWRlci5nZXRDbGFzcygpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXIuZ2V0SW5zdGFuY2UoY2xhenosIG93bmVyKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGVmO1xuICAgIH1cbiAgICBwdWJsaWMgcmVhZG9ubHkgZmFjdG9yaWVzID0gbmV3IE1hcDxTZXJ2aWNlRmFjdG9yeTxULCB1bmtub3duPiwgSWRlbnRpZmllcltdPigpO1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBpZGVudGlmaWVyIFRoZSB1bmlxdWUgaWRlbnRpZmllciBvZiB0aGlzIGZhY3Rvcmllc1xuICAgICAqIEBwYXJhbSBpc1NpbmdsZSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgaWRlbnRpZmllciBkZWZpbmVzIG9ubHkgb25lIGZhY3RvcnkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGlkZW50aWZpZXI6IElkZW50aWZpZXIsIHB1YmxpYyByZWFkb25seSBzY29wZTogSW5zdGFuY2VTY29wZSB8IHN0cmluZykge31cbiAgICBhcHBlbmQoZmFjdG9yeTogU2VydmljZUZhY3Rvcnk8VCwgdW5rbm93bj4sIGluamVjdGlvbnM6IElkZW50aWZpZXJbXSA9IFtdKSB7XG4gICAgICAgIGlmICh0aGlzLnNjb3BlID09PSBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTiAmJiB0aGlzLmZhY3Rvcmllcy5zaXplID09PSAxICYmIHRoaXMuZmFjdG9yaWVzLmhhcyhmYWN0b3J5KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMuaWRlbnRpZmllci50b1N0cmluZygpfSBpcyBBIHNpbmdsZXRvbiEgQnV0IG11bHRpcGxlIGZhY3RvcmllcyBhcmUgZGVmaW5lZCFgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZhY3Rvcmllcy5zZXQoZmFjdG9yeSwgaW5qZWN0aW9ucyk7XG4gICAgfVxuICAgIHByb2R1Y2UoY29udGFpbmVyOiBBcHBsaWNhdGlvbkNvbnRleHQsIG93bmVyPzogdW5rbm93bikge1xuICAgICAgICAvLyBpZiAodGhpcy5pc1NpbmdsZSkge1xuICAgICAgICAvLyAgICAgY29uc3QgW2ZhY3RvcnksIGluamVjdGlvbnNdID0gdGhpcy5mYWN0b3JpZXMuZW50cmllcygpLm5leHQoKS52YWx1ZSBhcyBbU2VydmljZUZhY3Rvcnk8VCwgdW5rbm93bj4sIElkZW50aWZpZXJbXV07XG4gICAgICAgIC8vICAgICBjb25zdCBmbiA9IGZhY3RvcnkoY29udGFpbmVyLCBvd25lcik7XG4gICAgICAgIC8vICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAvLyAgICAgICAgIHJldHVybiBjb250YWluZXIuaW52b2tlKGZuLCB7XG4gICAgICAgIC8vICAgICAgICAgICAgIGluamVjdGlvbnNcbiAgICAgICAgLy8gICAgICAgICB9KTtcbiAgICAgICAgLy8gICAgIH07XG4gICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgIC8vIH1cbiAgICAgICAgY29uc3QgcHJvZHVjZXJzID0gQXJyYXkuZnJvbSh0aGlzLmZhY3RvcmllcykubWFwKChbZmFjdG9yeSwgaW5qZWN0aW9uc10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZuID0gZmFjdG9yeShjb250YWluZXIsIG93bmVyKTtcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRhaW5lci5pbnZva2UoZm4sIHtcbiAgICAgICAgICAgICAgICAgICAgaW5qZWN0aW9uc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcHJvZHVjZXJzLm1hcChpdCA9PiBpdCgpKTtcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJbnN0YW5jZVNjb3BlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9JbnN0YW5jZVNjb3BlJztcbmltcG9ydCB7IFNlcnZpY2VGYWN0b3J5RGVmIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9TZXJ2aWNlRmFjdG9yeURlZic7XG5pbXBvcnQgeyBGYWN0b3J5SWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0ZhY3RvcnlJZGVudGlmaWVyJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB0eXBlIHsgU2VydmljZUZhY3RvcnkgfSBmcm9tICcuLi90eXBlcy9TZXJ2aWNlRmFjdG9yeSc7XG5cbmV4cG9ydCBjbGFzcyBGYWN0b3J5UmVjb3JkZXIge1xuICAgIHByaXZhdGUgZmFjdG9yaWVzID0gbmV3IE1hcDxGYWN0b3J5SWRlbnRpZmllciwgU2VydmljZUZhY3RvcnlEZWY8dW5rbm93bj4+KCk7XG5cbiAgICBwdWJsaWMgYXBwZW5kPFQ+KFxuICAgICAgICBpZGVudGlmaWVyOiBGYWN0b3J5SWRlbnRpZmllcixcbiAgICAgICAgZmFjdG9yeTogU2VydmljZUZhY3Rvcnk8VCwgdW5rbm93bj4sXG4gICAgICAgIGluamVjdGlvbnM6IElkZW50aWZpZXJbXSA9IFtdLFxuICAgICAgICBzY29wZTogSW5zdGFuY2VTY29wZSB8IHN0cmluZyA9IEluc3RhbmNlU2NvcGUuU0lOR0xFVE9OXG4gICAgKSB7XG4gICAgICAgIGxldCBkZWYgPSB0aGlzLmZhY3Rvcmllcy5nZXQoaWRlbnRpZmllcik7XG4gICAgICAgIGlmIChkZWYpIHtcbiAgICAgICAgICAgIGRlZi5hcHBlbmQoZmFjdG9yeSwgaW5qZWN0aW9ucyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWYgPSBuZXcgU2VydmljZUZhY3RvcnlEZWYoaWRlbnRpZmllciwgc2NvcGUpO1xuICAgICAgICAgICAgZGVmLmFwcGVuZChmYWN0b3J5LCBpbmplY3Rpb25zKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZhY3Rvcmllcy5zZXQoaWRlbnRpZmllciwgZGVmKTtcbiAgICB9XG4gICAgcHVibGljIHNldChpZGVudGlmaWVyOiBGYWN0b3J5SWRlbnRpZmllciwgZmFjdG9yeURlZjogU2VydmljZUZhY3RvcnlEZWY8dW5rbm93bj4pIHtcbiAgICAgICAgdGhpcy5mYWN0b3JpZXMuc2V0KGlkZW50aWZpZXIsIGZhY3RvcnlEZWYpO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0PFQ+KGlkZW50aWZpZXI6IEZhY3RvcnlJZGVudGlmaWVyKTogU2VydmljZUZhY3RvcnlEZWY8VD4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5mYWN0b3JpZXMuZ2V0KGlkZW50aWZpZXIpIGFzIFNlcnZpY2VGYWN0b3J5RGVmPFQ+IHwgdW5kZWZpbmVkO1xuICAgIH1cbiAgICBwdWJsaWMgaXRlcmF0b3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZhY3Rvcmllcy5lbnRyaWVzKCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTWV0YWRhdGEgfSBmcm9tICcuLi90eXBlcy9NZXRhZGF0YSc7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4uL3R5cGVzL1NlcnZpY2VGYWN0b3J5JztcbmltcG9ydCB7IEZhY3RvcnlJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvRmFjdG9yeUlkZW50aWZpZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4vQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeURlZiB9IGZyb20gJy4uL2ZvdW5kYXRpb24vU2VydmljZUZhY3RvcnlEZWYnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL3R5cGVzL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcic7XG5pbXBvcnQgeyBGYWN0b3J5UmVjb3JkZXIgfSBmcm9tICcuLi9jb21tb24vRmFjdG9yeVJlY29yZGVyJztcbmltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luc3RhbmNlU2NvcGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEdsb2JhbE1ldGFkYXRhUmVhZGVyIHtcbiAgICBnZXRDb21wb25lbnRGYWN0b3J5PFQ+KGtleTogRmFjdG9yeUlkZW50aWZpZXIpOiBTZXJ2aWNlRmFjdG9yeURlZjxUPiB8IHVuZGVmaW5lZDtcbiAgICBnZXRDbGFzc01ldGFkYXRhPFQ+KGFsaWFzTmFtZTogc3RyaW5nIHwgc3ltYm9sKTogQ2xhc3NNZXRhZGF0YTxUPiB8IHVuZGVmaW5lZDtcbiAgICBnZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKCk6IEFycmF5PE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4+O1xufVxuZXhwb3J0IGNsYXNzIEdsb2JhbE1ldGFkYXRhIGltcGxlbWVudHMgTWV0YWRhdGE8R2xvYmFsTWV0YWRhdGFSZWFkZXIsIHZvaWQ+IHtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBJTlNUQU5DRSA9IG5ldyBHbG9iYWxNZXRhZGF0YSgpO1xuICAgIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICAgICAgcmV0dXJuIEdsb2JhbE1ldGFkYXRhLklOU1RBTkNFO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0UmVhZGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW5jZSgpLnJlYWRlcigpO1xuICAgIH1cbiAgICBwcml2YXRlIGNsYXNzQWxpYXNNZXRhZGF0YU1hcCA9IG5ldyBNYXA8c3RyaW5nIHwgc3ltYm9sLCBDbGFzc01ldGFkYXRhPHVua25vd24+PigpO1xuICAgIHByaXZhdGUgY29tcG9uZW50RmFjdG9yaWVzID0gbmV3IEZhY3RvcnlSZWNvcmRlcigpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcHJvY2Vzc29yQ2xhc3NlczogU2V0PE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4+ID0gbmV3IFNldCgpO1xuICAgIHJlY29yZEZhY3Rvcnk8VD4oXG4gICAgICAgIHN5bWJvbDogRmFjdG9yeUlkZW50aWZpZXIsXG4gICAgICAgIGZhY3Rvcnk6IFNlcnZpY2VGYWN0b3J5PFQsIHVua25vd24+LFxuICAgICAgICBpbmplY3Rpb25zOiBJZGVudGlmaWVyW10gPSBbXSxcbiAgICAgICAgc2NvcGU6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmcgPSBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTlxuICAgICkge1xuICAgICAgICB0aGlzLmNvbXBvbmVudEZhY3Rvcmllcy5hcHBlbmQoc3ltYm9sLCBmYWN0b3J5LCBpbmplY3Rpb25zLCBzY29wZSk7XG4gICAgfVxuICAgIHJlY29yZENsYXNzQWxpYXM8VD4oYWxpYXNOYW1lOiBzdHJpbmcgfCBzeW1ib2wsIG1ldGFkYXRhOiBDbGFzc01ldGFkYXRhPFQ+KSB7XG4gICAgICAgIHRoaXMuY2xhc3NBbGlhc01ldGFkYXRhTWFwLnNldChhbGlhc05hbWUsIG1ldGFkYXRhKTtcbiAgICB9XG4gICAgcmVjb3JkUHJvY2Vzc29yQ2xhc3MoY2xheno6IE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4pIHtcbiAgICAgICAgdGhpcy5wcm9jZXNzb3JDbGFzc2VzLmFkZChjbGF6eik7XG4gICAgfVxuICAgIGluaXQoKSB7XG4gICAgICAgIC8vIFBBU1M7XG4gICAgfVxuICAgIHJlYWRlcigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldENvbXBvbmVudEZhY3Rvcnk6IDxUPihrZXk6IEZhY3RvcnlJZGVudGlmaWVyKTogU2VydmljZUZhY3RvcnlEZWY8VD4gfCB1bmRlZmluZWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudEZhY3Rvcmllcy5nZXQoa2V5KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRDbGFzc01ldGFkYXRhOiA8VD4oYWxpYXNOYW1lOiBzdHJpbmcgfCBzeW1ib2wpOiBDbGFzc01ldGFkYXRhPFQ+IHwgdW5kZWZpbmVkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jbGFzc0FsaWFzTWV0YWRhdGFNYXAuZ2V0KGFsaWFzTmFtZSkgYXMgQ2xhc3NNZXRhZGF0YTxUPiB8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzOiAoKTogQXJyYXk8TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPj4gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMucHJvY2Vzc29yQ2xhc3Nlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiZXhwb3J0IGludGVyZmFjZSBFdmFsdWF0aW9uT3B0aW9uczxPLCBFIGV4dGVuZHMgc3RyaW5nLCBBID0gdW5rbm93bj4ge1xuICAgIHR5cGU6IEU7XG4gICAgb3duZXI/OiBPO1xuICAgIHByb3BlcnR5TmFtZT86IHN0cmluZyB8IHN5bWJvbDtcbiAgICBleHRlcm5hbEFyZ3M/OiBBO1xufVxuXG5leHBvcnQgZW51bSBFeHByZXNzaW9uVHlwZSB7XG4gICAgRU5WID0gJ2luamVjdC1lbnZpcm9ubWVudC12YXJpYWJsZXMnLFxuICAgIEpTT05fUEFUSCA9ICdpbmplY3QtanNvbi1kYXRhJyxcbiAgICBBUkdWID0gJ2luamVjdC1hcmd2J1xufVxuIiwiZXhwb3J0IGNvbnN0IGlzTm9kZUpzID0gKCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gcHJvY2Vzcy52ZXJzaW9ucy5ub2RlICE9PSBudWxsO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn0pKCk7XG4iLCJpbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBjbGFzcyBJbmplY3Rpb25UeXBlIHtcbiAgICBzdGF0aWMgb2ZDbGF6eihjbGF6ejogTmV3YWJsZTx1bmtub3duPikge1xuICAgICAgICByZXR1cm4gbmV3IEluamVjdGlvblR5cGUoY2xhenopO1xuICAgIH1cbiAgICBzdGF0aWMgb2ZJZGVudGlmaWVyKGlkZW50aWZpZXI6IElkZW50aWZpZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbmplY3Rpb25UeXBlKE9iamVjdCBhcyB1bmtub3duIGFzIE5ld2FibGU8dW5rbm93bj4sIGlkZW50aWZpZXIpO1xuICAgIH1cbiAgICBzdGF0aWMgb2YoY2xheno6IE5ld2FibGU8dW5rbm93bj4sIGlkZW50aWZpZXI6IElkZW50aWZpZXIgPSBjbGF6eikge1xuICAgICAgICByZXR1cm4gbmV3IEluamVjdGlvblR5cGUoY2xhenosIGlkZW50aWZpZXIpO1xuICAgIH1cbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBjbGF6ejogTmV3YWJsZTx1bmtub3duPiwgcHVibGljIHJlYWRvbmx5IGlkZW50aWZpZXI6IElkZW50aWZpZXIgPSBjbGF6eikge31cblxuICAgIGdldCBpc05ld2FibGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkZW50aWZpZXIgPT09IHRoaXMuY2xheno7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9HbG9iYWxNZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IEV4cHJlc3Npb25UeXBlIH0gZnJvbSAnLi4vdHlwZXMvRXZhbHVhdGVPcHRpb25zJztcbmltcG9ydCB7IGlzTm9kZUpzIH0gZnJvbSAnLi4vY29tbW9uL2lzTm9kZUpzJztcbmltcG9ydCB7IEluamVjdGlvblR5cGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luamVjdGlvblR5cGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gVmFsdWU8QSA9IHVua25vd24+KGV4cHJlc3Npb246IHN0cmluZywgdHlwZTogRXhwcmVzc2lvblR5cGUgfCBzdHJpbmcsIGV4dGVybmFsQXJncz86IEEpOiBQcm9wZXJ0eURlY29yYXRvciB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgRXhwcmVzc2lvblR5cGUuRU5WOlxuICAgICAgICBjYXNlIEV4cHJlc3Npb25UeXBlLkFSR1Y6XG4gICAgICAgICAgICBpZiAoIWlzTm9kZUpzKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgXCIke3R5cGV9XCIgZXZhbHVhdG9yIG9ubHkgc3VwcG9ydHMgbm9kZWpzIGVudmlyb25tZW50IWApO1xuICAgICAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gKHRhcmdldDogT2JqZWN0LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sKSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGFyZ2V0LmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgY29uc3QgdmFsdWVfc3ltYm9sID0gU3ltYm9sKCcnKTtcbiAgICAgICAgbWV0YWRhdGEucmVjb3JkUHJvcGVydHlUeXBlKHByb3BlcnR5S2V5LCBJbmplY3Rpb25UeXBlLm9mSWRlbnRpZmllcih2YWx1ZV9zeW1ib2wpKTtcbiAgICAgICAgR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWNvcmRGYWN0b3J5KHZhbHVlX3N5bWJvbCwgKGNvbnRhaW5lciwgb3duZXIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoKSA9PlxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5ldmFsdWF0ZTxzdHJpbmcsIHR5cGVvZiBvd25lciwgQT4oZXhwcmVzc2lvbiBhcyBzdHJpbmcsIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXIsXG4gICAgICAgICAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGV4dGVybmFsQXJnc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgVmFsdWUgfSBmcm9tICcuL1ZhbHVlJztcbmltcG9ydCB7IEV4cHJlc3Npb25UeXBlIH0gZnJvbSAnLi4vdHlwZXMvRXZhbHVhdGVPcHRpb25zJztcblxuZXhwb3J0IGZ1bmN0aW9uIEFyZ3YobmFtZTogc3RyaW5nLCBhcmd2OiBzdHJpbmdbXSA9IHByb2Nlc3MuYXJndikge1xuICAgIHJldHVybiBWYWx1ZShuYW1lLCBFeHByZXNzaW9uVHlwZS5BUkdWLCBhcmd2KTtcbn1cbiIsImltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBBbGlhcyhhbGlhc05hbWU6IHN0cmluZyB8IHN5bWJvbCk6IENsYXNzRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gPFRGdW5jdGlvbiBleHRlbmRzIEZ1bmN0aW9uPih0YXJnZXQ6IFRGdW5jdGlvbikgPT4ge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldCBhcyB1bmtub3duIGFzIE5ld2FibGU8dW5rbm93bj4sIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlY29yZENsYXNzQWxpYXMoYWxpYXNOYW1lLCBtZXRhZGF0YSk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IEFsaWFzIH0gZnJvbSAnLi9BbGlhcyc7XG4vKipcbiAqIEBkZXByZWNhdGVkIHVzZSBAQWxpYXMgaW5zdGVhZFxuICogQHBhcmFtIGFsaWFzTmFtZVxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEJpbmQoYWxpYXNOYW1lOiBzdHJpbmcgfCBzeW1ib2wpOiBDbGFzc0RlY29yYXRvciB7XG4gICAgcmV0dXJuIEFsaWFzKGFsaWFzTmFtZSk7XG59XG4iLCJpbXBvcnQgeyBWYWx1ZSB9IGZyb20gJy4vVmFsdWUnO1xuaW1wb3J0IHsgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gRW52KG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBWYWx1ZShuYW1lLCBFeHByZXNzaW9uVHlwZS5FTlYpO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGlzTnVsbCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIG51bGwge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQ7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNOb3REZWZpbmVkPFQ+KHZhbHVlOiBUIHwgdW5kZWZpbmVkIHwgbnVsbCk6IHZhbHVlIGlzIHVuZGVmaW5lZCB8IG51bGwge1xuICAgIHJldHVybiBpc051bGwodmFsdWUpIHx8IGlzVW5kZWZpbmVkKHZhbHVlKTtcbn1cbiIsImV4cG9ydCBlbnVtIEFkdmljZSB7XG4gICAgQmVmb3JlLFxuICAgIEFmdGVyLFxuICAgIEFyb3VuZCxcbiAgICBBZnRlclJldHVybixcbiAgICBUaHJvd24sXG4gICAgRmluYWxseVxufVxuIiwiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSAqL1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi9BZHZpY2UnO1xuXG50eXBlIEJlZm9yZUhvb2sgPSAoYXJnczogYW55W10pID0+IHZvaWQ7XG50eXBlIEFmdGVySG9vayA9IChhcmdzOiBhbnlbXSkgPT4gdm9pZDtcbnR5cGUgVGhyb3duSG9vayA9IChyZWFzb246IGFueSwgYXJnczogYW55W10pID0+IHZvaWQ7XG50eXBlIEZpbmFsbHlIb29rID0gKGFyZ3M6IGFueVtdKSA9PiB2b2lkO1xudHlwZSBBZnRlclJldHVybkhvb2sgPSAocmV0dXJuVmFsdWU6IGFueSwgYXJnczogYW55W10pID0+IGFueTtcbnR5cGUgQXJvdW5kSG9vayA9ICh0aGlzOiBhbnksIG9yaWdpbmZuOiAoLi4uYXJnczogYW55W10pID0+IHZvaWQsIGFyZ3M6IGFueVtdKSA9PiB2b2lkO1xuXG5leHBvcnQgY2xhc3MgQXNwZWN0VXRpbHMge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgYmVmb3JlSG9va3M6IEFycmF5PEJlZm9yZUhvb2s+ID0gW107XG4gICAgcHJpdmF0ZSByZWFkb25seSBhZnRlckhvb2tzOiBBcnJheTxBZnRlckhvb2s+ID0gW107XG4gICAgcHJpdmF0ZSByZWFkb25seSB0aHJvd25Ib29rczogQXJyYXk8VGhyb3duSG9vaz4gPSBbXTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZpbmFsbHlIb29rczogQXJyYXk8RmluYWxseUhvb2s+ID0gW107XG4gICAgcHJpdmF0ZSByZWFkb25seSBhZnRlclJldHVybkhvb2tzOiBBcnJheTxBZnRlclJldHVybkhvb2s+ID0gW107XG4gICAgcHJpdmF0ZSByZWFkb25seSBhcm91bmRIb29rczogQXJyYXk8QXJvdW5kSG9vaz4gPSBbXTtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGZuOiAoLi4uYXJnczogYW55W10pID0+IGFueSkge31cbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuQmVmb3JlLCBob29rOiBCZWZvcmVIb29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuQWZ0ZXIsIGhvb2s6IEFmdGVySG9vayk6IHZvaWQ7XG4gICAgYXBwZW5kKGFkdmljZTogQWR2aWNlLlRocm93biwgaG9vazogVGhyb3duSG9vayk6IHZvaWQ7XG4gICAgYXBwZW5kKGFkdmljZTogQWR2aWNlLkZpbmFsbHksIGhvb2s6IEZpbmFsbHlIb29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuQWZ0ZXJSZXR1cm4sIGhvb2s6IEFmdGVyUmV0dXJuSG9vayk6IHZvaWQ7XG4gICAgYXBwZW5kKGFkdmljZTogQWR2aWNlLkFyb3VuZCwgaG9vazogQXJvdW5kSG9vayk6IHZvaWQ7XG4gICAgYXBwZW5kKGFkdmljZTogQWR2aWNlLCBob29rOiBGdW5jdGlvbikge1xuICAgICAgICBsZXQgaG9va3NBcnJheTogRnVuY3Rpb25bXSB8IHVuZGVmaW5lZDtcbiAgICAgICAgc3dpdGNoIChhZHZpY2UpIHtcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLkJlZm9yZTpcbiAgICAgICAgICAgICAgICBob29rc0FycmF5ID0gdGhpcy5iZWZvcmVIb29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLkFmdGVyOlxuICAgICAgICAgICAgICAgIGhvb2tzQXJyYXkgPSB0aGlzLmFmdGVySG9va3M7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFkdmljZS5UaHJvd246XG4gICAgICAgICAgICAgICAgaG9va3NBcnJheSA9IHRoaXMudGhyb3duSG9va3M7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFkdmljZS5GaW5hbGx5OlxuICAgICAgICAgICAgICAgIGhvb2tzQXJyYXkgPSB0aGlzLmZpbmFsbHlIb29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLkFmdGVyUmV0dXJuOlxuICAgICAgICAgICAgICAgIGhvb2tzQXJyYXkgPSB0aGlzLmFmdGVyUmV0dXJuSG9va3M7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFkdmljZS5Bcm91bmQ6XG4gICAgICAgICAgICAgICAgaG9va3NBcnJheSA9IHRoaXMuYXJvdW5kSG9va3M7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhvb2tzQXJyYXkpIHtcbiAgICAgICAgICAgIGhvb2tzQXJyYXkucHVzaChob29rKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBleHRyYWN0KCkge1xuICAgICAgICBjb25zdCB7IGFyb3VuZEhvb2tzLCBiZWZvcmVIb29rcywgYWZ0ZXJIb29rcywgYWZ0ZXJSZXR1cm5Ib29rcywgZmluYWxseUhvb2tzLCB0aHJvd25Ib29rcyB9ID0gdGhpcztcbiAgICAgICAgY29uc3QgZm46IHR5cGVvZiB0aGlzLmZuID0gYXJvdW5kSG9va3MucmVkdWNlUmlnaHQoKHByZXYsIG5leHQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAodGhpczogYW55LCAuLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0LmNhbGwodGhpcywgcHJldiwgYXJncyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9LCB0aGlzLmZuKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0aGlzOiBhbnksIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgICAgICBiZWZvcmVIb29rcy5mb3JFYWNoKGhvb2sgPT4ge1xuICAgICAgICAgICAgICAgIGhvb2suY2FsbCh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgaW52b2tlID0gKG9uRXJyb3I6IChyZWFzb246IGFueSkgPT4gdm9pZCwgb25GaW5hbGx5OiAoKSA9PiB2b2lkLCBvbkFmdGVyOiAocmV0dXJuVmFsdWU6IGFueSkgPT4gYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJldHVyblZhbHVlOiBhbnk7XG4gICAgICAgICAgICAgICAgbGV0IGlzUHJvbWlzZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVyblZhbHVlID0gZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXR1cm5WYWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUHJvbWlzZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSA9IHJldHVyblZhbHVlLmNhdGNoKG9uRXJyb3IpLmZpbmFsbHkob25GaW5hbGx5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkZpbmFsbHkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaXNQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXR1cm5WYWx1ZS50aGVuKCh2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb25BZnRlcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvbkFmdGVyKHJldHVyblZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIGludm9rZShcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aHJvd25Ib29rcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvd25Ib29rcy5mb3JFYWNoKGhvb2sgPT4gaG9vay5jYWxsKHRoaXMsIGVycm9yLCBhcmdzKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBmaW5hbGx5SG9va3MuZm9yRWFjaChob29rID0+IGhvb2suY2FsbCh0aGlzLCBhcmdzKSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGFmdGVySG9va3MuZm9yRWFjaChob29rID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2suY2FsbCh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhZnRlclJldHVybkhvb2tzLnJlZHVjZSgocmV0VmFsLCBob29rKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaG9vay5jYWxsKHRoaXMsIHJldFZhbCwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH0sIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9O1xuICAgIH1cbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cbmltcG9ydCB0eXBlIHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi9BZHZpY2UnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQXNwZWN0LCBKb2luUG9pbnQsIFByb2NlZWRpbmdKb2luUG9pbnQgfSBmcm9tICcuL0FzcGVjdCc7XG5pbXBvcnQgeyBBc3BlY3RVdGlscyB9IGZyb20gJy4vQXNwZWN0VXRpbHMnO1xuaW1wb3J0IHsgQXNwZWN0SW5mbyB9IGZyb20gJy4vQXNwZWN0TWV0YWR0YSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBc3BlY3Q8VD4oXG4gICAgYXBwQ3R4OiBBcHBsaWNhdGlvbkNvbnRleHQsXG4gICAgdGFyZ2V0OiBULFxuICAgIG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCxcbiAgICBtZXRob2RGdW5jOiBGdW5jdGlvbixcbiAgICBhc3BlY3RzOiBBc3BlY3RJbmZvW11cbikge1xuICAgIGNvbnN0IGNyZWF0ZUFzcGVjdEN0eCA9IChhZHZpY2U6IEFkdmljZSwgYXJnczogYW55W10sIHJldHVyblZhbHVlOiBhbnkgPSBudWxsLCBlcnJvcjogYW55ID0gbnVsbCk6IEpvaW5Qb2ludCA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0YXJnZXQsXG4gICAgICAgICAgICBtZXRob2ROYW1lLFxuICAgICAgICAgICAgYXJndW1lbnRzOiBhcmdzLFxuICAgICAgICAgICAgcmV0dXJuVmFsdWUsXG4gICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgIGFkdmljZSxcbiAgICAgICAgICAgIGN0eDogYXBwQ3R4XG4gICAgICAgIH07XG4gICAgfTtcbiAgICBjb25zdCBhc3BlY3RVdGlscyA9IG5ldyBBc3BlY3RVdGlscyhtZXRob2RGdW5jIGFzICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTtcbiAgICBjb25zdCBDbGFzc1RvSW5zdGFuY2UgPSAoYXNwZWN0SW5mbzogQXNwZWN0SW5mbykgPT4gYXBwQ3R4LmdldEluc3RhbmNlKGFzcGVjdEluZm8uYXNwZWN0Q2xhc3MpIGFzIEFzcGVjdDtcbiAgICBjb25zdCB0YXJnZXRDb25zdHJ1Y3RvciA9ICh0YXJnZXQgYXMgb2JqZWN0KS5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPFQ+O1xuICAgIGNvbnN0IGFsbE1hdGNoQXNwZWN0cyA9IGFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LnBvaW50Y3V0LnRlc3QodGFyZ2V0Q29uc3RydWN0b3IsIG1ldGhvZE5hbWUpKTtcblxuICAgIGNvbnN0IGJlZm9yZUFkdmljZUFzcGVjdHMgPSBhbGxNYXRjaEFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LmFkdmljZSA9PT0gQWR2aWNlLkJlZm9yZSkubWFwKENsYXNzVG9JbnN0YW5jZSk7XG4gICAgY29uc3QgYWZ0ZXJBZHZpY2VBc3BlY3RzID0gYWxsTWF0Y2hBc3BlY3RzLmZpbHRlcihpdCA9PiBpdC5hZHZpY2UgPT09IEFkdmljZS5BZnRlcikubWFwKENsYXNzVG9JbnN0YW5jZSk7XG4gICAgY29uc3QgdHJ5Q2F0Y2hBZHZpY2VBc3BlY3RzID0gYWxsTWF0Y2hBc3BlY3RzLmZpbHRlcihpdCA9PiBpdC5hZHZpY2UgPT09IEFkdmljZS5UaHJvd24pLm1hcChDbGFzc1RvSW5zdGFuY2UpO1xuICAgIGNvbnN0IHRyeUZpbmFsbHlBZHZpY2VBc3BlY3RzID0gYWxsTWF0Y2hBc3BlY3RzLmZpbHRlcihpdCA9PiBpdC5hZHZpY2UgPT09IEFkdmljZS5GaW5hbGx5KS5tYXAoQ2xhc3NUb0luc3RhbmNlKTtcbiAgICBjb25zdCBhZnRlclJldHVybkFkdmljZUFzcGVjdHMgPSBhbGxNYXRjaEFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LmFkdmljZSA9PT0gQWR2aWNlLkFmdGVyUmV0dXJuKS5tYXAoQ2xhc3NUb0luc3RhbmNlKTtcbiAgICBjb25zdCBhcm91bmRBZHZpY2VBc3BlY3RzID0gYWxsTWF0Y2hBc3BlY3RzLmZpbHRlcihpdCA9PiBpdC5hZHZpY2UgPT09IEFkdmljZS5Bcm91bmQpLm1hcChDbGFzc1RvSW5zdGFuY2UpO1xuXG4gICAgaWYgKGJlZm9yZUFkdmljZUFzcGVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLkJlZm9yZSwgKGFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBqb2luUG9pbnQgPSBjcmVhdGVBc3BlY3RDdHgoQWR2aWNlLkJlZm9yZSwgYXJncyk7XG4gICAgICAgICAgICBiZWZvcmVBZHZpY2VBc3BlY3RzLmZvckVhY2goYXNwZWN0ID0+IHtcbiAgICAgICAgICAgICAgICBhc3BlY3QuZXhlY3V0ZShqb2luUG9pbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoYWZ0ZXJBZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXNwZWN0VXRpbHMuYXBwZW5kKEFkdmljZS5BZnRlciwgKGFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBqb2luUG9pbnQgPSBjcmVhdGVBc3BlY3RDdHgoQWR2aWNlLkFmdGVyLCBhcmdzKTtcbiAgICAgICAgICAgIGFmdGVyQWR2aWNlQXNwZWN0cy5mb3JFYWNoKGFzcGVjdCA9PiB7XG4gICAgICAgICAgICAgICAgYXNwZWN0LmV4ZWN1dGUoam9pblBvaW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHRyeUNhdGNoQWR2aWNlQXNwZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFzcGVjdFV0aWxzLmFwcGVuZChBZHZpY2UuVGhyb3duLCAoZXJyb3IsIGFyZ3MpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGpvaW5Qb2ludCA9IGNyZWF0ZUFzcGVjdEN0eChBZHZpY2UuVGhyb3duLCBhcmdzLCBudWxsLCBlcnJvcik7XG4gICAgICAgICAgICB0cnlDYXRjaEFkdmljZUFzcGVjdHMuZm9yRWFjaChhc3BlY3QgPT4ge1xuICAgICAgICAgICAgICAgIGFzcGVjdC5leGVjdXRlKGpvaW5Qb2ludCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRyeUZpbmFsbHlBZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXNwZWN0VXRpbHMuYXBwZW5kKEFkdmljZS5GaW5hbGx5LCAoYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGpvaW5Qb2ludCA9IGNyZWF0ZUFzcGVjdEN0eChBZHZpY2UuRmluYWxseSwgYXJncyk7XG4gICAgICAgICAgICB0cnlGaW5hbGx5QWR2aWNlQXNwZWN0cy5mb3JFYWNoKGFzcGVjdCA9PiB7XG4gICAgICAgICAgICAgICAgYXNwZWN0LmV4ZWN1dGUoam9pblBvaW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoYWZ0ZXJSZXR1cm5BZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXNwZWN0VXRpbHMuYXBwZW5kKEFkdmljZS5BZnRlclJldHVybiwgKHJldHVyblZhbHVlLCBhcmdzKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYWZ0ZXJSZXR1cm5BZHZpY2VBc3BlY3RzLnJlZHVjZSgocHJldlJldHVyblZhbHVlLCBhc3BlY3QpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBqb2luUG9pbnQgPSBjcmVhdGVBc3BlY3RDdHgoQWR2aWNlLkFmdGVyUmV0dXJuLCBhcmdzLCByZXR1cm5WYWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFzcGVjdC5leGVjdXRlKGpvaW5Qb2ludCk7XG4gICAgICAgICAgICB9LCByZXR1cm5WYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChhcm91bmRBZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXJvdW5kQWR2aWNlQXNwZWN0cy5mb3JFYWNoKGFzcGVjdCA9PiB7XG4gICAgICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLkFyb3VuZCwgKG9yaWdpbkZuLCBhcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgam9pblBvaW50ID0gY3JlYXRlQXNwZWN0Q3R4KEFkdmljZS5Bcm91bmQsIGFyZ3MsIG51bGwpIGFzIFByb2NlZWRpbmdKb2luUG9pbnQ7XG4gICAgICAgICAgICAgICAgam9pblBvaW50LnByb2NlZWQgPSAoanBBcmdzID0gYXJncykgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luRm4oanBBcmdzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBhc3BlY3QuZXhlY3V0ZShqb2luUG9pbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBhc3BlY3RVdGlscy5leHRyYWN0KCk7XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG5pbXBvcnQgeyBBc3BlY3QsIEpvaW5Qb2ludCB9IGZyb20gJy4vQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbXBvbmVudE1ldGhvZEFzcGVjdCBpbXBsZW1lbnRzIEFzcGVjdCB7XG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUoY2xheno6IE5ld2FibGU8dW5rbm93bj4sIG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCk6IE5ld2FibGU8QXNwZWN0PiB7XG4gICAgICAgIHJldHVybiBjbGFzcyBDb21wb25lbnRNZXRob2RBc3BlY3RJbXBsIGV4dGVuZHMgQ29tcG9uZW50TWV0aG9kQXNwZWN0IHtcbiAgICAgICAgICAgIGV4ZWN1dGUoanA6IEpvaW5Qb2ludCk6IGFueSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXNwZWN0SW5zdGFuY2UgPSBqcC5jdHguZ2V0SW5zdGFuY2UoY2xhenopIGFzIGFueTtcbiAgICAgICAgICAgICAgICBjb25zdCBmdW5jID0gYXNwZWN0SW5zdGFuY2VbbWV0aG9kTmFtZV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLmFzcGVjdEluc3RhbmNlLCBqcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIHByb3RlY3RlZCBhc3BlY3RJbnN0YW5jZSE6IGFueTtcbiAgICBhYnN0cmFjdCBleGVjdXRlKGN0eDogSm9pblBvaW50KTogYW55O1xufVxuIiwiaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IE1ldGFkYXRhLCBNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4uL3R5cGVzL01ldGFkYXRhJztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4vQWR2aWNlJztcbmltcG9ydCB7IENvbXBvbmVudE1ldGhvZEFzcGVjdCB9IGZyb20gJy4vQ29tcG9uZW50TWV0aG9kQXNwZWN0JztcbmltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi9Qb2ludGN1dCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXNwZWN0SW5mbyB7XG4gICAgYXNwZWN0Q2xhc3M6IE5ld2FibGU8dW5rbm93bj47XG4gICAgbWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sO1xuICAgIHBvaW50Y3V0OiBQb2ludGN1dDtcbiAgICBhZHZpY2U6IEFkdmljZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBc3BlY3RNZXRhZGF0YVJlYWRlciBleHRlbmRzIE1ldGFkYXRhUmVhZGVyIHtcbiAgICBnZXRBc3BlY3RzKGpwSWRlbnRpZmllcjogSWRlbnRpZmllciwganBNZW1iZXI6IHN0cmluZyB8IHN5bWJvbCk6IEFzcGVjdEluZm9bXTtcbn1cblxuZXhwb3J0IGNsYXNzIEFzcGVjdE1ldGFkYXRhIGltcGxlbWVudHMgTWV0YWRhdGE8QXNwZWN0TWV0YWRhdGFSZWFkZXIsIHZvaWQ+IHtcbiAgICBwcml2YXRlIHN0YXRpYyBJTlNUQU5DRSA9IG5ldyBBc3BlY3RNZXRhZGF0YSgpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgYXNwZWN0czogQXNwZWN0SW5mb1tdID0gW107XG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICAgICAgcmV0dXJuIEFzcGVjdE1ldGFkYXRhLklOU1RBTkNFO1xuICAgIH1cbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvL1xuICAgIH1cbiAgICBpbml0KCk6IHZvaWQge1xuICAgICAgICAvL1xuICAgIH1cbiAgICBhcHBlbmQoY29tcG9uZW50QXNwZWN0Q2xhc3M6IE5ld2FibGU8dW5rbm93bj4sIG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCwgYWR2aWNlOiBBZHZpY2UsIHBvaW50Y3V0OiBQb2ludGN1dCkge1xuICAgICAgICBjb25zdCBBc3BlY3RDbGFzcyA9IENvbXBvbmVudE1ldGhvZEFzcGVjdC5jcmVhdGUoY29tcG9uZW50QXNwZWN0Q2xhc3MsIG1ldGhvZE5hbWUpO1xuICAgICAgICB0aGlzLmFzcGVjdHMucHVzaCh7XG4gICAgICAgICAgICBhc3BlY3RDbGFzczogQXNwZWN0Q2xhc3MsXG4gICAgICAgICAgICBtZXRob2ROYW1lLFxuICAgICAgICAgICAgcG9pbnRjdXQsXG4gICAgICAgICAgICBhZHZpY2VcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlYWRlcigpOiBBc3BlY3RNZXRhZGF0YVJlYWRlciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXRBc3BlY3RzOiAoanBJZGVudGlmaWVyLCBqcE1lbWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzcGVjdHMuZmlsdGVyKCh7IHBvaW50Y3V0IH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBvaW50Y3V0LnRlc3QoanBJZGVudGlmaWVyLCBqcE1lbWJlcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiY29uc3QgUFJPWFlfVEFSR0VUX01BUCA9IG5ldyBXZWFrTWFwPG9iamVjdCwgb2JqZWN0PigpO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVjb3JkUHJveHlUYXJnZXQ8VCBleHRlbmRzIG9iamVjdD4ocHJveHk6IFQsIHRhcmdldDogVCk6IHZvaWQge1xuICAgIFBST1hZX1RBUkdFVF9NQVAuc2V0KHByb3h5LCB0YXJnZXQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJveHlUYXJnZXQ8VCBleHRlbmRzIG9iamVjdD4ocHJveHk6IFQpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gUFJPWFlfVEFSR0VUX01BUC5nZXQocHJveHkpIGFzIFQgfCB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Byb3h5T2Y8VCBleHRlbmRzIG9iamVjdD4ocHJveHk6IFQsIHRhcmdldDogVCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBQUk9YWV9UQVJHRVRfTUFQLmdldChwcm94eSkgPT09IHRhcmdldDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc1Byb3h5UmVjb3JkKG9iajogb2JqZWN0KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIFBST1hZX1RBUkdFVF9NQVAuaGFzKG9iaik7XG59XG4iLCJpbXBvcnQgeyBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yJztcbmltcG9ydCB0eXBlIHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHsgY3JlYXRlQXNwZWN0IH0gZnJvbSAnLi9jcmVhdGVBc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQXNwZWN0TWV0YWRhdGEgfSBmcm9tICcuL0FzcGVjdE1ldGFkdGEnO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgcmVjb3JkUHJveHlUYXJnZXQgfSBmcm9tICcuLi9jb21tb24vUHJveHlUYXJnZXRSZWNvcmRlcic7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3IgaW1wbGVtZW50cyBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yIHtcbiAgICBzdGF0aWMgY3JlYXRlKGFwcEN0eDogQXBwbGljYXRpb25Db250ZXh0KTogTmV3YWJsZTxBT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3I+IHtcbiAgICAgICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgQU9QSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yIHtcbiAgICAgICAgICAgIHByb3RlY3RlZCByZWFkb25seSBhcHBDdHg6IEFwcGxpY2F0aW9uQ29udGV4dCA9IGFwcEN0eDtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IGFwcEN0eDogQXBwbGljYXRpb25Db250ZXh0O1xuICAgIGFmdGVySW5zdGFudGlhdGlvbjxUIGV4dGVuZHMgb2JqZWN0PihpbnN0YW5jZTogVCk6IFQge1xuICAgICAgICBpZiAoIWluc3RhbmNlIHx8IHR5cGVvZiBpbnN0YW5jZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjbGF6eiA9IGluc3RhbmNlLmNvbnN0cnVjdG9yO1xuXG4gICAgICAgIGNvbnN0IGFzcGVjdE1ldGFkYXRhID0gQXNwZWN0TWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWFkZXIoKTtcbiAgICAgICAgLy8gY29uc3QgdXNlQXNwZWN0TWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShjbGF6eiwgQU9QQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgIC8vIGNvbnN0IHVzZUFzcGVjdE1ldGFkYXRhUmVhZGVyID0gdXNlQXNwZWN0TWV0YWRhdGEucmVhZGVyKCk7XG4gICAgICAgIC8vIGNvbnN0IHVzZUFzcGVjdHNNYXAgPSB1c2VBc3BlY3RNZXRhZGF0YVJlYWRlci5nZXRBc3BlY3RzKCk7XG4gICAgICAgIC8vIGlmICh1c2VBc3BlY3RzTWFwLnNpemUgPT09IDApIHtcbiAgICAgICAgLy8gICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIGNvbnN0IGFzcGVjdFN0b3JlTWFwID0gbmV3IFdlYWtNYXA8b2JqZWN0LCBNYXA8c3RyaW5nIHwgc3ltYm9sLCBGdW5jdGlvbj4+KCk7XG4gICAgICAgIGFzcGVjdFN0b3JlTWFwLnNldChpbnN0YW5jZSwgbmV3IE1hcDxzdHJpbmcgfCBzeW1ib2wsIEZ1bmN0aW9uPigpKTtcblxuICAgICAgICBjb25zdCBwcm94eVJlc3VsdCA9IG5ldyBQcm94eShpbnN0YW5jZSwge1xuICAgICAgICAgICAgZ2V0OiAodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpblZhbHVlID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcik7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChwcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NvbnN0cnVjdG9yJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5WYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCkgJiYgdHlwZW9mIG9yaWdpblZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzcGVjdE1hcCA9IGFzcGVjdFN0b3JlTWFwLmdldChpbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghYXNwZWN0TWFwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFzcGVjdE1hcC5oYXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhc3BlY3RNYXAuZ2V0KHByb3ApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzcGVjdHNPZk1ldGhvZCA9IGFzcGVjdE1ldGFkYXRhLmdldEFzcGVjdHMoY2xhenogYXMgSWRlbnRpZmllciwgcHJvcCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzcGVjdEZuID0gY3JlYXRlQXNwZWN0KHRoaXMuYXBwQ3R4LCB0YXJnZXQsIHByb3AsIG9yaWdpblZhbHVlLCBhc3BlY3RzT2ZNZXRob2QpO1xuICAgICAgICAgICAgICAgICAgICBhc3BlY3RNYXAuc2V0KHByb3AsIGFzcGVjdEZuKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFzcGVjdEZuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Rlc3QnKSB7XG4gICAgICAgICAgICByZWNvcmRQcm94eVRhcmdldChwcm94eVJlc3VsdCwgaW5zdGFuY2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHByb3h5UmVzdWx0O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEV2YWx1YXRvciB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRvcic7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5cbmV4cG9ydCBjbGFzcyBBcmd2RXZhbHVhdG9yIGltcGxlbWVudHMgRXZhbHVhdG9yIHtcbiAgICBldmFsPFQsIEEgPSBzdHJpbmdbXT4oY29udGV4dDogQXBwbGljYXRpb25Db250ZXh0LCBleHByZXNzaW9uOiBzdHJpbmcsIGFyZ3M/OiBBKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IGFyZ3YgPSBhcmdzIHx8IHByb2Nlc3MuYXJndjtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby12YXItcmVxdWlyZXNcbiAgICAgICAgY29uc3QgbWluaW1pc3QgPSByZXF1aXJlKCdtaW5pbWlzdCcpO1xuICAgICAgICBjb25zdCBtYXAgPSBtaW5pbWlzdChhcmd2KTtcbiAgICAgICAgcmV0dXJuIG1hcFtleHByZXNzaW9uXTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBFdmFsdWF0b3IgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0b3InO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuXG5leHBvcnQgY2xhc3MgRW52aXJvbm1lbnRFdmFsdWF0b3IgaW1wbGVtZW50cyBFdmFsdWF0b3Ige1xuICAgIGV2YWw8VD4oY29udGV4dDogQXBwbGljYXRpb25Db250ZXh0LCBleHByZXNzaW9uOiBzdHJpbmcpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHByb2Nlc3MuZW52W2V4cHJlc3Npb25dIGFzIFQgfCB1bmRlZmluZWQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgRXZhbHVhdG9yIH0gZnJvbSAnLi4vdHlwZXMvRXZhbHVhdG9yJztcbmltcG9ydCB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4uL2ZvdW5kYXRpb24vQXBwbGljYXRpb25Db250ZXh0JztcbmltcG9ydCB7IEpTT05EYXRhIH0gZnJvbSAnLi4vdHlwZXMvSlNPTkRhdGEnO1xuXG5leHBvcnQgY2xhc3MgSlNPTkRhdGFFdmFsdWF0b3IgaW1wbGVtZW50cyBFdmFsdWF0b3Ige1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbmFtZXNwYWNlRGF0YU1hcCA9IG5ldyBNYXA8c3RyaW5nLCBKU09ORGF0YT4oKTtcbiAgICBldmFsPFQ+KGNvbnRleHQ6IEFwcGxpY2F0aW9uQ29udGV4dCwgZXhwcmVzc2lvbjogc3RyaW5nKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IGNvbG9uSW5kZXggPSBleHByZXNzaW9uLmluZGV4T2YoJzonKTtcbiAgICAgICAgaWYgKGNvbG9uSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luY29ycmVjdCBleHByZXNzaW9uLCBuYW1lc3BhY2Ugbm90IHNwZWNpZmllZCcpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5hbWVzcGFjZSA9IGV4cHJlc3Npb24uc3Vic3RyaW5nKDAsIGNvbG9uSW5kZXgpO1xuICAgICAgICBjb25zdCBleHAgPSBleHByZXNzaW9uLnN1YnN0cmluZyhjb2xvbkluZGV4ICsgMSk7XG4gICAgICAgIGlmICghdGhpcy5uYW1lc3BhY2VEYXRhTWFwLmhhcyhuYW1lc3BhY2UpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEluY29ycmVjdCBleHByZXNzaW9uOiBuYW1lc3BhY2Ugbm90IHJlY29yZGVkOiBcIiR7bmFtZXNwYWNlfVwiYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMubmFtZXNwYWNlRGF0YU1hcC5nZXQobmFtZXNwYWNlKSBhcyBKU09ORGF0YTtcbiAgICAgICAgcmV0dXJuIHJ1bkV4cHJlc3Npb24oZXhwLCBkYXRhIGFzIE9iamVjdCk7XG4gICAgfVxuICAgIHJlY29yZERhdGEobmFtZXNwYWNlOiBzdHJpbmcsIGRhdGE6IEpTT05EYXRhKSB7XG4gICAgICAgIHRoaXMubmFtZXNwYWNlRGF0YU1hcC5zZXQobmFtZXNwYWNlLCBkYXRhKTtcbiAgICB9XG4gICAgZ2V0SlNPTkRhdGEobmFtZXNwYWNlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZXNwYWNlRGF0YU1hcC5nZXQobmFtZXNwYWNlKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJ1bkV4cHJlc3Npb24oZXhwcmVzc2lvbjogc3RyaW5nLCByb290Q29udGV4dDogT2JqZWN0KSB7XG4gICAgY29uc3QgZm4gPSBjb21waWxlRXhwcmVzc2lvbihleHByZXNzaW9uKTtcbiAgICByZXR1cm4gZm4ocm9vdENvbnRleHQpO1xufVxuXG5mdW5jdGlvbiBjb21waWxlRXhwcmVzc2lvbihleHByZXNzaW9uOiBzdHJpbmcpIHtcbiAgICBpZiAoZXhwcmVzc2lvbi5pbmRleE9mKCcsJykgPiAtMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEluY29ycmVjdCBleHByZXNzaW9uIHN5bnRheCwgVGhlICcsJyBpcyBub3QgYWxsb3dlZCBpbiBleHByZXNzaW9uOiBcIiR7ZXhwcmVzc2lvbn1cImApO1xuICAgIH1cbiAgICBpZiAoZXhwcmVzc2lvbi5sZW5ndGggPiAxMjApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYEluY29ycmVjdCBleHByZXNzaW9uIHN5bnRheCwgZXhwcmVzc2lvbiBsZW5ndGggY2Fubm90IGJlIGdyZWF0ZXIgdGhhbiAxMjAsIGJ1dCBhY3R1YWw6ICR7ZXhwcmVzc2lvbi5sZW5ndGh9YFxuICAgICAgICApO1xuICAgIH1cbiAgICBpZiAoL1xcKC4qP1xcKS8udGVzdChleHByZXNzaW9uKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEluY29ycmVjdCBleHByZXNzaW9uIHN5bnRheCwgcGFyZW50aGVzZXMgYXJlIG5vdCBhbGxvd2VkIGluIGV4cHJlc3Npb246IFwiJHtleHByZXNzaW9ufVwiYCk7XG4gICAgfVxuICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnRyaW0oKTtcbiAgICBpZiAoZXhwcmVzc2lvbiA9PT0gJycpIHtcbiAgICAgICAgcmV0dXJuIChyb290OiBPYmplY3QpID0+IHJvb3Q7XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdFZhck5hbWUgPSB2YXJOYW1lKCdjb250ZXh0Jyk7XG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbihcbiAgICAgICAgcm9vdFZhck5hbWUsXG4gICAgICAgIGBcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gJHtyb290VmFyTmFtZX0uJHtleHByZXNzaW9ufTtcbiAgICAgICAgfSBjYXRjaChlcnJvcikgeyB0aHJvdyBlcnJvciB9XG4gICAgYFxuICAgICk7XG59XG5sZXQgVkFSX1NFUVVFTkNFID0gRGF0ZS5ub3coKTtcbmZ1bmN0aW9uIHZhck5hbWUocHJlZml4OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gcHJlZml4ICsgJycgKyAoVkFSX1NFUVVFTkNFKyspLnRvU3RyaW5nKDE2KTtcbn1cbiIsImltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YSB9IGZyb20gJy4uL3R5cGVzL01ldGFkYXRhJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luc3RhbmNlU2NvcGUnO1xuXG5leHBvcnQgY29uc3QgRlVOQ1RJT05fTUVUQURBVEFfS0VZID0gU3ltYm9sKCdpb2M6ZnVuY3Rpb24tbWV0YWRhdGEnKTtcblxuZXhwb3J0IGludGVyZmFjZSBGdW5jdGlvbk1ldGFkYXRhUmVhZGVyIHtcbiAgICBnZXRQYXJhbWV0ZXJzKCk6IElkZW50aWZpZXJbXTtcbiAgICBpc0ZhY3RvcnkoKTogYm9vbGVhbjtcbiAgICBnZXRTY29wZSgpOiBJbnN0YW5jZVNjb3BlIHwgdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgY2xhc3MgRnVuY3Rpb25NZXRhZGF0YSBpbXBsZW1lbnRzIE1ldGFkYXRhPEZ1bmN0aW9uTWV0YWRhdGFSZWFkZXIsIEZ1bmN0aW9uPiB7XG4gICAgc3RhdGljIGdldFJlZmxlY3RLZXkoKSB7XG4gICAgICAgIHJldHVybiBGVU5DVElPTl9NRVRBREFUQV9LRVk7XG4gICAgfVxuICAgIHByaXZhdGUgcmVhZG9ubHkgcGFyYW1ldGVyczogSWRlbnRpZmllcltdID0gW107XG4gICAgcHJpdmF0ZSBzY29wZT86IEluc3RhbmNlU2NvcGU7XG4gICAgcHJpdmF0ZSBpc0ZhY3Rvcnk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBzZXRQYXJhbWV0ZXJUeXBlKGluZGV4OiBudW1iZXIsIHN5bWJvbDogSWRlbnRpZmllcikge1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnNbaW5kZXhdID0gc3ltYm9sO1xuICAgIH1cbiAgICBzZXRTY29wZShzY29wZTogSW5zdGFuY2VTY29wZSkge1xuICAgICAgICB0aGlzLnNjb3BlID0gc2NvcGU7XG4gICAgfVxuICAgIHNldElzRmFjdG9yeShpc0ZhY3Rvcnk6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5pc0ZhY3RvcnkgPSBpc0ZhY3Rvcnk7XG4gICAgfVxuICAgIGluaXQoKSB7XG4gICAgICAgIC8vIFBBU1M7XG4gICAgfVxuICAgIHJlYWRlcigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldFBhcmFtZXRlcnM6ICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJhbWV0ZXJzLnNsaWNlKDApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzRmFjdG9yeTogKCkgPT4gdGhpcy5pc0ZhY3RvcnksXG4gICAgICAgICAgICBnZXRTY29wZTogKCkgPT4gdGhpcy5zY29wZVxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsImxldCBpbnN0YW5jZVNlcmlhbE5vID0gLTE7XG5cbmV4cG9ydCBjbGFzcyBDb21wb25lbnRJbnN0YW5jZVdyYXBwZXIge1xuICAgIHB1YmxpYyByZWFkb25seSBzZXJpYWxObyA9ICsraW5zdGFuY2VTZXJpYWxObztcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBpbnN0YW5jZTogdW5rbm93bikge31cblxuICAgIHB1YmxpYyBjb21wYXJlVG8ob3RoZXI6IENvbXBvbmVudEluc3RhbmNlV3JhcHBlcik6IC0xIHwgMCB8IDEge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXJpYWxObyA+IG90aGVyLnNlcmlhbE5vID8gLTEgOiB0aGlzLnNlcmlhbE5vIDwgb3RoZXIuc2VyaWFsTm8gPyAxIDogMDtcbiAgICB9XG59XG4iLCJleHBvcnQgZW51bSBMaWZlY3ljbGUge1xuICAgIFBSRV9JTkpFQ1QgPSAnaW9jLXNjb3BlOnByZS1pbmplY3QnLFxuICAgIFBPU1RfSU5KRUNUID0gJ2lvYy1zY29wZTpwb3N0LWluamVjdCcsXG4gICAgUFJFX0RFU1RST1kgPSAnaW9jLXNjb3BlOnByZS1kZXN0cm95J1xufVxuIiwiaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZva2VQcmVEZXN0cm95KGluc3RhbmNlOiB1bmtub3duKSB7XG4gICAgY29uc3QgY2xhenogPSBpbnN0YW5jZT8uY29uc3RydWN0b3I7XG4gICAgaWYgKCFjbGF6eikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoY2xhenosIENsYXNzTWV0YWRhdGEpO1xuICAgIGNvbnN0IHByZURlc3Ryb3lNZXRob2RzID0gbWV0YWRhdGEuZ2V0TWV0aG9kcyhMaWZlY3ljbGUuUFJFX0RFU1RST1kpO1xuICAgIHByZURlc3Ryb3lNZXRob2RzLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IGNsYXp6LnByb3RvdHlwZVttZXRob2ROYW1lXTtcbiAgICAgICAgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIG1ldGhvZC5hcHBseShpbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbiIsImltcG9ydCB7IEdldEluc3RhbmNlT3B0aW9ucywgSW5zdGFuY2VSZXNvbHV0aW9uLCBTYXZlSW5zdGFuY2VPcHRpb25zIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IENvbXBvbmVudEluc3RhbmNlV3JhcHBlciB9IGZyb20gJy4uL2ZvdW5kYXRpb24vQ29tcG9uZW50SW5zdGFuY2VXcmFwcGVyJztcbmltcG9ydCB7IGludm9rZVByZURlc3Ryb3kgfSBmcm9tICcuLi9jb21tb24vaW52b2tlUHJlRGVzdHJveSc7XG5cbmV4cG9ydCBjbGFzcyBTaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24gaW1wbGVtZW50cyBJbnN0YW5jZVJlc29sdXRpb24ge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgSU5TVEFOQ0VfTUFQID0gbmV3IE1hcDxJZGVudGlmaWVyLCBDb21wb25lbnRJbnN0YW5jZVdyYXBwZXI+KCk7XG4gICAgZ2V0SW5zdGFuY2U8VCwgTz4ob3B0aW9uczogR2V0SW5zdGFuY2VPcHRpb25zPFQsIE8+KTogVCB7XG4gICAgICAgIHJldHVybiB0aGlzLklOU1RBTkNFX01BUC5nZXQob3B0aW9ucy5pZGVudGlmaWVyKT8uaW5zdGFuY2UgYXMgVDtcbiAgICB9XG5cbiAgICBzYXZlSW5zdGFuY2U8VCwgTz4ob3B0aW9uczogU2F2ZUluc3RhbmNlT3B0aW9uczxULCBPPik6IHZvaWQge1xuICAgICAgICB0aGlzLklOU1RBTkNFX01BUC5zZXQob3B0aW9ucy5pZGVudGlmaWVyLCBuZXcgQ29tcG9uZW50SW5zdGFuY2VXcmFwcGVyKG9wdGlvbnMuaW5zdGFuY2UpKTtcbiAgICB9XG5cbiAgICBzaG91bGRHZW5lcmF0ZTxULCBPPihvcHRpb25zOiBHZXRJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLklOU1RBTkNFX01BUC5oYXMob3B0aW9ucy5pZGVudGlmaWVyKTtcbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgY29uc3QgaW5zdGFuY2VXcmFwcGVycyA9IEFycmF5LmZyb20odGhpcy5JTlNUQU5DRV9NQVAudmFsdWVzKCkpO1xuICAgICAgICBpbnN0YW5jZVdyYXBwZXJzLnNvcnQoKGEsIGIpID0+IGEuY29tcGFyZVRvKGIpKTtcbiAgICAgICAgaW5zdGFuY2VXcmFwcGVycy5mb3JFYWNoKGluc3RhbmNlV3JhcHBlciA9PiB7XG4gICAgICAgICAgICBpbnZva2VQcmVEZXN0cm95KGluc3RhbmNlV3JhcHBlci5pbnN0YW5jZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLklOU1RBTkNFX01BUC5jbGVhcigpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEdldEluc3RhbmNlT3B0aW9ucywgSW5zdGFuY2VSZXNvbHV0aW9uLCBTYXZlSW5zdGFuY2VPcHRpb25zIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IFNpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbiB9IGZyb20gJy4vU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uJztcblxuY29uc3QgU0lOR0xFVE9OX0lOU1RBTkNFX1NJTkdMRVRPTiA9IG5ldyBTaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24oKTtcblxuZXhwb3J0IGNsYXNzIEdsb2JhbFNoYXJlZEluc3RhbmNlUmVzb2x1dGlvbiBpbXBsZW1lbnRzIEluc3RhbmNlUmVzb2x1dGlvbiB7XG4gICAgZ2V0SW5zdGFuY2U8VCwgTz4ob3B0aW9uczogR2V0SW5zdGFuY2VPcHRpb25zPFQsIE8+KTogVCB7XG4gICAgICAgIHJldHVybiBTSU5HTEVUT05fSU5TVEFOQ0VfU0lOR0xFVE9OLmdldEluc3RhbmNlKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHNhdmVJbnN0YW5jZTxULCBPPihvcHRpb25zOiBTYXZlSW5zdGFuY2VPcHRpb25zPFQsIE8+KTogdm9pZCB7XG4gICAgICAgIFNJTkdMRVRPTl9JTlNUQU5DRV9TSU5HTEVUT04uc2F2ZUluc3RhbmNlKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHNob3VsZEdlbmVyYXRlPFQsIE8+KG9wdGlvbnM6IEdldEluc3RhbmNlT3B0aW9uczxULCBPPik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gU0lOR0xFVE9OX0lOU1RBTkNFX1NJTkdMRVRPTi5zaG91bGRHZW5lcmF0ZShvcHRpb25zKTtcbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgLy8gUEFTUztcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJbnN0YW5jZVJlc29sdXRpb24sIFNhdmVJbnN0YW5jZU9wdGlvbnMgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZVJlc29sdXRpb24nO1xuaW1wb3J0IHsgaW52b2tlUHJlRGVzdHJveSB9IGZyb20gJy4uL2NvbW1vbi9pbnZva2VQcmVEZXN0cm95JztcblxuZXhwb3J0IGNsYXNzIFRyYW5zaWVudEluc3RhbmNlUmVzb2x1dGlvbiBpbXBsZW1lbnRzIEluc3RhbmNlUmVzb2x1dGlvbiB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBpbnN0YW5jZXMgPSBuZXcgU2V0PHVua25vd24+KCk7XG4gICAgc2hvdWxkR2VuZXJhdGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGdldEluc3RhbmNlPFQ+KCk6IFQgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2F2ZUluc3RhbmNlPFQsIE8+KG9wdGlvbnM6IFNhdmVJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZXMuYWRkKG9wdGlvbnMuaW5zdGFuY2UpO1xuICAgIH1cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLmluc3RhbmNlcy5mb3JFYWNoKGl0ID0+IHtcbiAgICAgICAgICAgIGlmICghaXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbnZva2VQcmVEZXN0cm95KGl0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaW5zdGFuY2VzLmNsZWFyKCk7XG4gICAgfVxuICAgIGRlc3Ryb3lUaGF0PFQ+KGluc3RhbmNlOiBUKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5pbnN0YW5jZXMuaGFzKGluc3RhbmNlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGludm9rZVByZURlc3Ryb3koaW5zdGFuY2UpO1xuICAgICAgICB0aGlzLmluc3RhbmNlcy5kZWxldGUoaW5zdGFuY2UpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEsIENsYXNzTWV0YWRhdGFSZWFkZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgTGlmZWN5Y2xlIH0gZnJvbSAnLi9MaWZlY3ljbGUnO1xuaW1wb3J0IHsgSW5zdGFuY2UgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZSc7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5cbmV4cG9ydCBjbGFzcyBMaWZlY3ljbGVNYW5hZ2VyPFQgPSB1bmtub3duPiB7XG4gICAgcHJpdmF0ZSBjbGFzc01ldGFkYXRhUmVhZGVyOiBDbGFzc01ldGFkYXRhUmVhZGVyPFQ+O1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY29tcG9uZW50Q2xhc3M6IE5ld2FibGU8VD4sIHByaXZhdGUgcmVhZG9ubHkgY29udGFpbmVyOiBBcHBsaWNhdGlvbkNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5jbGFzc01ldGFkYXRhUmVhZGVyID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGhpcy5jb21wb25lbnRDbGFzcywgQ2xhc3NNZXRhZGF0YSkucmVhZGVyKCk7XG4gICAgfVxuICAgIGludm9rZVByZUluamVjdE1ldGhvZChpbnN0YW5jZTogSW5zdGFuY2U8VD4pIHtcbiAgICAgICAgY29uc3QgbWV0aG9kcyA9IHRoaXMuY2xhc3NNZXRhZGF0YVJlYWRlci5nZXRNZXRob2RzKExpZmVjeWNsZS5QUkVfSU5KRUNUKTtcbiAgICAgICAgdGhpcy5pbnZva2VMaWZlY3ljbGVNZXRob2RzKGluc3RhbmNlLCBtZXRob2RzKTtcbiAgICB9XG4gICAgaW52b2tlUG9zdEluamVjdE1ldGhvZChpbnN0YW5jZTogSW5zdGFuY2U8VD4pIHtcbiAgICAgICAgY29uc3QgbWV0aG9kcyA9IHRoaXMuY2xhc3NNZXRhZGF0YVJlYWRlci5nZXRNZXRob2RzKExpZmVjeWNsZS5QT1NUX0lOSkVDVCk7XG4gICAgICAgIHRoaXMuaW52b2tlTGlmZWN5Y2xlTWV0aG9kcyhpbnN0YW5jZSwgbWV0aG9kcyk7XG4gICAgfVxuICAgIGludm9rZVByZURlc3Ryb3lJbmplY3RNZXRob2QoaW5zdGFuY2U6IEluc3RhbmNlPFQ+KSB7XG4gICAgICAgIGNvbnN0IG1ldGhvZHMgPSB0aGlzLmNsYXNzTWV0YWRhdGFSZWFkZXIuZ2V0TWV0aG9kcyhMaWZlY3ljbGUuUFJFX0RFU1RST1kpO1xuICAgICAgICB0aGlzLmludm9rZUxpZmVjeWNsZU1ldGhvZHMoaW5zdGFuY2UsIG1ldGhvZHMpO1xuICAgIH1cbiAgICBwcml2YXRlIGludm9rZUxpZmVjeWNsZU1ldGhvZHMoaW5zdGFuY2U6IEluc3RhbmNlPFQ+LCBtZXRob2RLZXlzOiBBcnJheTxzdHJpbmcgfCBzeW1ib2w+KSB7XG4gICAgICAgIG1ldGhvZEtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW52b2tlKGluc3RhbmNlW2tleV0sIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0OiBpbnN0YW5jZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEsIENsYXNzTWV0YWRhdGFSZWFkZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4vQXBwbGljYXRpb25Db250ZXh0JztcbmltcG9ydCB7IEluc3RhbmNlIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2UnO1xuaW1wb3J0IHsgU2VydmljZUZhY3RvcnlEZWYgfSBmcm9tICcuL1NlcnZpY2VGYWN0b3J5RGVmJztcbmltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuaW1wb3J0IHsgbGF6eVByb3AgfSBmcm9tICdAdmdlcmJvdC9sYXp5JztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlciB9IGZyb20gJy4vSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlcic7XG5pbXBvcnQgeyBMaWZlY3ljbGVNYW5hZ2VyIH0gZnJvbSAnLi9MaWZlY3ljbGVNYW5hZ2VyJztcbmltcG9ydCB7IEZhY3RvcnlSZWNvcmRlciB9IGZyb20gJy4uL2NvbW1vbi9GYWN0b3J5UmVjb3JkZXInO1xuaW1wb3J0IHsgQW55RnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcy9BbnlGdW5jdGlvbic7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4uL3R5cGVzL1NlcnZpY2VGYWN0b3J5JztcblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudEluc3RhbmNlQnVpbGRlcjxUPiB7XG4gICAgcHJpdmF0ZSBnZXRDb25zdHJ1Y3RvckFyZ3M6ICgpID0+IHVua25vd25bXSA9ICgpID0+IFtdO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcHJvcGVydHlGYWN0b3JpZXMgPSBuZXcgRmFjdG9yeVJlY29yZGVyKCk7XG4gICAgcHJpdmF0ZSBsYXp5TW9kZTogYm9vbGVhbiA9IHRydWU7XG4gICAgcHJpdmF0ZSByZWFkb25seSBsaWZlY3ljbGVSZXNvbHZlcjogTGlmZWN5Y2xlTWFuYWdlcjxUPjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNsYXNzTWV0YWRhdGFSZWFkZXI6IENsYXNzTWV0YWRhdGFSZWFkZXI8VD47XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY29tcG9uZW50Q2xhc3M6IE5ld2FibGU8VD4sXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY29udGFpbmVyOiBBcHBsaWNhdGlvbkNvbnRleHQsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlcjogSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlclxuICAgICkge1xuICAgICAgICB0aGlzLmxpZmVjeWNsZVJlc29sdmVyID0gbmV3IExpZmVjeWNsZU1hbmFnZXI8VD4oY29tcG9uZW50Q2xhc3MsIGNvbnRhaW5lcik7XG4gICAgICAgIGNvbnN0IHJlYWRlciA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGNvbXBvbmVudENsYXNzLCBDbGFzc01ldGFkYXRhKS5yZWFkZXIoKTtcbiAgICAgICAgdGhpcy5jbGFzc01ldGFkYXRhUmVhZGVyID0gcmVhZGVyO1xuICAgICAgICB0aGlzLmFwcGVuZENsYXNzTWV0YWRhdGEocmVhZGVyKTtcbiAgICB9XG4gICAgYXBwZW5kTGF6eU1vZGUobGF6eU1vZGU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5sYXp5TW9kZSA9IGxhenlNb2RlO1xuICAgIH1cbiAgICBwcml2YXRlIGFwcGVuZENsYXNzTWV0YWRhdGE8VD4oY2xhc3NNZXRhZGF0YVJlYWRlcjogQ2xhc3NNZXRhZGF0YVJlYWRlcjxUPikge1xuICAgICAgICBjb25zdCB0eXBlcyA9IGNsYXNzTWV0YWRhdGFSZWFkZXIuZ2V0Q29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlcygpO1xuICAgICAgICB0aGlzLmdldENvbnN0cnVjdG9yQXJncyA9ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlcy5tYXAoaXQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRhaW5lci5nZXRJbnN0YW5jZShpdC5pc05ld2FibGUgPyBpdC5jbGF6eiA6IGl0LmlkZW50aWZpZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGdsb2JhbE1ldGFkYXRhUmVhZGVyID0gR2xvYmFsTWV0YWRhdGEuZ2V0UmVhZGVyKCk7XG4gICAgICAgIGNvbnN0IHByb3BlcnR5VHlwZXMgPSBjbGFzc01ldGFkYXRhUmVhZGVyLmdldFByb3BlcnR5VHlwZU1hcCgpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VHlwZV0gb2YgcHJvcGVydHlUeXBlcykge1xuICAgICAgICAgICAgaWYgKHByb3BlcnR5VHlwZS5pc05ld2FibGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5RmFjdG9yaWVzLmFwcGVuZChwcm9wZXJ0eU5hbWUsIChjb250YWluZXIsIG93bmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiBjb250YWluZXIuZ2V0SW5zdGFuY2UocHJvcGVydHlUeXBlLmNsYXp6LCBvd25lcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpZGVudGlmaWVyID0gcHJvcGVydHlUeXBlLmlkZW50aWZpZXIgYXMgRXhjbHVkZTxJZGVudGlmaWVyLCBOZXdhYmxlPHVua25vd24+PjtcbiAgICAgICAgICAgIGNvbnN0IGZhY3RvcnlEZWYgPSB0aGlzLmNvbnRhaW5lci5nZXRGYWN0b3J5KGlkZW50aWZpZXIpO1xuICAgICAgICAgICAgaWYgKGZhY3RvcnlEZWYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5RmFjdG9yaWVzLnNldChwcm9wZXJ0eU5hbWUsIGZhY3RvcnlEZWYpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcHJvcGVydHlDbGFzc01ldGFkYXRhID0gZ2xvYmFsTWV0YWRhdGFSZWFkZXIuZ2V0Q2xhc3NNZXRhZGF0YShpZGVudGlmaWVyKTtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eUNsYXNzTWV0YWRhdGEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5RmFjdG9yaWVzLnNldChwcm9wZXJ0eU5hbWUsIFNlcnZpY2VGYWN0b3J5RGVmLmNyZWF0ZUZyb21DbGFzc01ldGFkYXRhKHByb3BlcnR5Q2xhc3NNZXRhZGF0YSkpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcHJvcGVydHlGYWN0b3J5RGVmID0gZ2xvYmFsTWV0YWRhdGFSZWFkZXIuZ2V0Q29tcG9uZW50RmFjdG9yeShpZGVudGlmaWVyKTtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eUZhY3RvcnlEZWYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5RmFjdG9yaWVzLnNldChwcm9wZXJ0eU5hbWUsIHByb3BlcnR5RmFjdG9yeURlZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgYnVpbGQoKSB7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmdldENvbnN0cnVjdG9yQXJncygpO1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gdGhpcy5jcmVhdGVQcm9wZXJ0aWVzR2V0dGVyQnVpbGRlcigpO1xuICAgICAgICBjb25zdCBpc0NyZWF0aW5nSW5zdEF3YXJlUHJvY2Vzc29yID0gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyLmlzSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3ModGhpcy5jb21wb25lbnRDbGFzcyk7XG4gICAgICAgIGlmIChpc0NyZWF0aW5nSW5zdEF3YXJlUHJvY2Vzc29yKSB7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyB0aGlzLmNvbXBvbmVudENsYXNzKC4uLmFyZ3MpIGFzIEluc3RhbmNlPFQ+O1xuICAgICAgICAgICAgdGhpcy5saWZlY3ljbGVSZXNvbHZlci5pbnZva2VQcmVJbmplY3RNZXRob2QoaW5zdGFuY2UpO1xuICAgICAgICAgICAgZGVmaW5lUHJvcGVydGllcy5jYWxsKHRoaXMsIGluc3RhbmNlKTtcbiAgICAgICAgICAgIHRoaXMubGlmZWN5Y2xlUmVzb2x2ZXIuaW52b2tlUG9zdEluamVjdE1ldGhvZChpbnN0YW5jZSk7XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgaW5zdGFuY2U6IHVuZGVmaW5lZCB8IEluc3RhbmNlPFQ+ID0gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyLmJlZm9yZUluc3RhbnRpYXRpb24odGhpcy5jb21wb25lbnRDbGFzcywgYXJncyk7XG4gICAgICAgICAgICBpZiAoIWluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2UgPSBuZXcgdGhpcy5jb21wb25lbnRDbGFzcyguLi5hcmdzKSBhcyBJbnN0YW5jZTxUPjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubGlmZWN5Y2xlUmVzb2x2ZXIuaW52b2tlUHJlSW5qZWN0TWV0aG9kKGluc3RhbmNlKTtcbiAgICAgICAgICAgIGRlZmluZVByb3BlcnRpZXMuY2FsbCh0aGlzLCBpbnN0YW5jZSk7XG4gICAgICAgICAgICBpbnN0YW5jZSA9IHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5hZnRlckluc3RhbnRpYXRpb24oaW5zdGFuY2UpO1xuICAgICAgICAgICAgdGhpcy5saWZlY3ljbGVSZXNvbHZlci5pbnZva2VQb3N0SW5qZWN0TWV0aG9kKGluc3RhbmNlKTtcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGhpczogQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyPFQ+LCBpbnN0YW5jZTogSW5zdGFuY2U8VD4gfCB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdldHRlciA9IHZhbHVlKGluc3RhbmNlIGFzIFQpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVmaW5lUHJvcGVydHkoaW5zdGFuY2UsIHR5cGVvZiBrZXkgPT09ICdudW1iZXInID8ga2V5ICsgJycgOiBrZXksIGdldHRlcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGRlZmluZVByb3BlcnR5PFQsIFY+KGluc3RhbmNlOiBULCBrZXk6IHN0cmluZyB8IHN5bWJvbCwgZ2V0dGVyOiAoKSA9PiBWKSB7XG4gICAgICAgIGlmICh0aGlzLmxhenlNb2RlKSB7XG4gICAgICAgICAgICBsYXp5UHJvcChpbnN0YW5jZSwga2V5LCBnZXR0ZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgaW5zdGFuY2Vba2V5XSA9IGdldHRlcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgY3JlYXRlUHJvcGVydGllc0dldHRlckJ1aWxkZXIoKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBNYXA8a2V5b2YgVCwgKGluc3RhbmNlOiBUKSA9PiAoKSA9PiB1bmtub3duIHwgdW5rbm93bltdPigpO1xuICAgICAgICBjb25zdCBwcm9wZXJ0eVR5cGVNYXAgPSB0aGlzLmNsYXNzTWV0YWRhdGFSZWFkZXIuZ2V0UHJvcGVydHlUeXBlTWFwKCk7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgZmFjdG9yeURlZl0gb2YgdGhpcy5wcm9wZXJ0eUZhY3Rvcmllcy5pdGVyYXRvcigpKSB7XG4gICAgICAgICAgICBjb25zdCBpbmplY3Rpb25UeXBlID0gcHJvcGVydHlUeXBlTWFwLmdldChrZXkpITtcbiAgICAgICAgICAgIGNvbnN0IGlzQXJyYXkgPSAhaW5qZWN0aW9uVHlwZS5pc05ld2FibGUgJiYgaW5qZWN0aW9uVHlwZS5jbGF6eiA9PT0gKEFycmF5IGFzIHVua25vd24gYXMgTmV3YWJsZTx1bmtub3duPik7XG4gICAgICAgICAgICBpZiAoIWlzQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmFjdG9yeURlZi5mYWN0b3JpZXMuc2l6ZSA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgICAgICAgICAgICAgICAgICAgIGBNdWx0aXBsZSBtYXRjaGluZyBpbmplY3RhYmxlcyBmb3VuZCBmb3IgcHJvcGVydHkgaW5qZWN0aW9uLFxcbmJ1dCBwcm9wZXJ0eSAke2tleS50b1N0cmluZygpfSBpcyBub3QgYW4gYXJyYXksXG4gICAgICAgICAgICAgICAgICAgICAgICBJdCBpcyBhbWJpZ3VvdXMgdG8gZGV0ZXJtaW5lIHdoaWNoIG9iamVjdCBzaG91bGQgYmUgaW5qZWN0ZWQhYFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBbZmFjdG9yeSwgaW5qZWN0aW9uc10gPSBmYWN0b3J5RGVmLmZhY3Rvcmllcy5lbnRyaWVzKCkubmV4dCgpLnZhbHVlIGFzIFtcbiAgICAgICAgICAgICAgICAgICAgU2VydmljZUZhY3Rvcnk8dW5rbm93biwgdW5rbm93bj4sXG4gICAgICAgICAgICAgICAgICAgIElkZW50aWZpZXJbXVxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgcmVzdWx0LnNldChrZXkgYXMga2V5b2YgVCwgPFQ+KGluc3RhbmNlOiBUKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2R1Y2VyID0gZmFjdG9yeSh0aGlzLmNvbnRhaW5lciwgaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGFpbmVyLmludm9rZShwcm9kdWNlciwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluamVjdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuc2V0KGtleSBhcyBrZXlvZiBULCA8VD4oaW5zdGFuY2U6IFQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvZHVjZXJBbmRJbmplY3Rpb25zID0gQXJyYXkuZnJvbShmYWN0b3J5RGVmLmZhY3RvcmllcykubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgKFtmYWN0b3J5LCBpbmplY3Rpb25zXSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZmFjdG9yeSh0aGlzLmNvbnRhaW5lciwgaW5zdGFuY2UpLCBpbmplY3Rpb25zXSBhcyBbQW55RnVuY3Rpb248dW5rbm93bj4sIElkZW50aWZpZXJbXV1cbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2R1Y2VyQW5kSW5qZWN0aW9ucy5tYXAoKFtwcm9kdWNlciwgaW5qZWN0aW9uc10pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb250YWluZXIuaW52b2tlKHByb2R1Y2VyLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluamVjdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQW55RnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcy9BbnlGdW5jdGlvbic7XG5cbmV4cG9ydCB0eXBlIEV2ZW50TGlzdGVuZXIgPSBBbnlGdW5jdGlvbjtcbmV4cG9ydCBjbGFzcyBFdmVudEVtaXR0ZXIge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZXZlbnRzID0gbmV3IE1hcDxzdHJpbmcgfCBzeW1ib2wsIEV2ZW50TGlzdGVuZXJbXT4oKTtcblxuICAgIG9uKHR5cGU6IHN0cmluZyB8IHN5bWJvbCwgbGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgbGV0IGxpc3RlbmVycyA9IHRoaXMuZXZlbnRzLmdldCh0eXBlKTtcbiAgICAgICAgaWYgKGxpc3RlbmVycykge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpc3RlbmVycyA9IFtsaXN0ZW5lcl07XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5zZXQodHlwZSwgbGlzdGVuZXJzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbHMgPSBsaXN0ZW5lcnMgYXMgRXZlbnRMaXN0ZW5lcltdO1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBscy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgbHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgZW1pdCh0eXBlOiBzdHJpbmcgfCBzeW1ib2wsIC4uLmFyZ3M6IHVua25vd25bXSkge1xuICAgICAgICB0aGlzLmV2ZW50cy5nZXQodHlwZSk/LmZvckVhY2goZm4gPT4ge1xuICAgICAgICAgICAgZm4oLi4uYXJncyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3NvciwgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL3R5cGVzL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcic7XG5pbXBvcnQgeyBsYXp5TWVtYmVyIH0gZnJvbSAnQHZnZXJib3QvbGF6eSc7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlJztcbmltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuXG5leHBvcnQgY2xhc3MgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlciB7XG4gICAgcHJpdmF0ZSBpbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzOiBTZXQ8TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPj4gPSBuZXcgU2V0KCk7XG4gICAgQGxhenlNZW1iZXI8SW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlciwga2V5b2YgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlciwgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvcltdPih7XG4gICAgICAgIGV2YWx1YXRlOiBpbnN0YW5jZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBnbG9iYWxJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzID0gR2xvYmFsTWV0YWRhdGEuZ2V0UmVhZGVyKCkuZ2V0SW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcygpO1xuICAgICAgICAgICAgY29uc3QgaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcyA9IGdsb2JhbEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuY29uY2F0KFxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oaW5zdGFuY2UuaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcylcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3Nlcy5tYXAoaXQgPT4gaW5zdGFuY2UuY29udGFpbmVyLmdldEluc3RhbmNlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3IsIHZvaWQ+KGl0KSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlc2V0Qnk6IFtcbiAgICAgICAgICAgIGluc3RhbmNlID0+IGluc3RhbmNlLmluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuc2l6ZSxcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBnbG9iYWxJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzID0gR2xvYmFsTWV0YWRhdGEuZ2V0UmVhZGVyKCkuZ2V0SW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcygpO1xuICAgICAgICAgICAgICAgIHJldHVybiBnbG9iYWxJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH0pXG4gICAgcHJpdmF0ZSBpbnN0QXdhcmVQcm9jZXNzb3JJbnN0YW5jZXMhOiBBcnJheTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY29udGFpbmVyOiBBcHBsaWNhdGlvbkNvbnRleHQpIHt9XG4gICAgYXBwZW5kSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3M6IE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4pIHtcbiAgICAgICAgdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLmFkZChpbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyk7XG4gICAgfVxuICAgIGFwcGVuZEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoXG4gICAgICAgIGluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXM6IFNldDxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+PiB8IEFycmF5PE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4+XG4gICAgKSB7XG4gICAgICAgIGluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuZm9yRWFjaChpdCA9PiB7XG4gICAgICAgICAgICB0aGlzLmluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuYWRkKGl0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGJlZm9yZUluc3RhbnRpYXRpb248VD4oY29tcG9uZW50Q2xhc3M6IE5ld2FibGU8VD4sIGFyZ3M6IHVua25vd25bXSkge1xuICAgICAgICBjb25zdCBpbnN0QXdhcmVQcm9jZXNzb3JzID0gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JJbnN0YW5jZXM7XG4gICAgICAgIGxldCBpbnN0YW5jZTogdW5kZWZpbmVkIHwgSW5zdGFuY2U8VD47XG4gICAgICAgIGluc3RBd2FyZVByb2Nlc3NvcnMuc29tZShwcm9jZXNzb3IgPT4ge1xuICAgICAgICAgICAgaWYgKCFwcm9jZXNzb3IuYmVmb3JlSW5zdGFudGlhdGlvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluc3RhbmNlID0gcHJvY2Vzc29yLmJlZm9yZUluc3RhbnRpYXRpb248VD4oY29tcG9uZW50Q2xhc3MsIGFyZ3MpIGFzIEluc3RhbmNlPFQ+O1xuICAgICAgICAgICAgcmV0dXJuICEhaW5zdGFuY2U7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfVxuICAgIGFmdGVySW5zdGFudGlhdGlvbjxUPihpbnN0YW5jZTogSW5zdGFuY2U8VD4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29ySW5zdGFuY2VzLnJlZHVjZSgoaW5zdGFuY2UsIHByb2Nlc3NvcikgPT4ge1xuICAgICAgICAgICAgaWYgKHByb2Nlc3Nvci5hZnRlckluc3RhbnRpYXRpb24pIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBwcm9jZXNzb3IuYWZ0ZXJJbnN0YW50aWF0aW9uKGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICBpZiAoISFyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdCBhcyBJbnN0YW5jZTxUPjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIH0sIGluc3RhbmNlKTtcbiAgICB9XG4gICAgaXNJbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyhjbHM6IE5ld2FibGU8dW5rbm93bj4pIHtcbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IHRoaXMuZ2V0SW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcygpO1xuICAgICAgICByZXR1cm4gY2xhc3Nlcy5pbmRleE9mKGNscyBhcyBOZXdhYmxlPEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcj4pID4gLTE7XG4gICAgfVxuICAgIGdldEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoKSB7XG4gICAgICAgIGNvbnN0IGdsb2JhbEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlYWRlcigpLmdldEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoKTtcbiAgICAgICAgcmV0dXJuIGdsb2JhbEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuY29uY2F0KEFycmF5LmZyb20odGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuXG50eXBlIEludm9rZUZ1bmN0aW9uQXJncyA9IHtcbiAgICBhcmdzPzogdW5rbm93bltdO1xufTtcbnR5cGUgSW52b2tlRnVuY3Rpb25JbmplY3Rpb25zID0ge1xuICAgIGluamVjdGlvbnM6IElkZW50aWZpZXJbXTtcbn07XG5cbnR5cGUgSW52b2tlRnVuY3Rpb25CYXNpY09wdGlvbnM8VD4gPSB7XG4gICAgY29udGV4dD86IFQ7XG59O1xuXG5leHBvcnQgdHlwZSBJbnZva2VGdW5jdGlvbk9wdGlvbnM8VD4gPVxuICAgIHwgKEludm9rZUZ1bmN0aW9uQmFzaWNPcHRpb25zPFQ+ICYgSW52b2tlRnVuY3Rpb25BcmdzKVxuICAgIHwgKEludm9rZUZ1bmN0aW9uQmFzaWNPcHRpb25zPFQ+ICYgUGFydGlhbDxJbnZva2VGdW5jdGlvbkluamVjdGlvbnM+KTtcblxuZXhwb3J0IGZ1bmN0aW9uIGhhc0FyZ3M8VD4ob3B0aW9uczogSW52b2tlRnVuY3Rpb25PcHRpb25zPFQ+KTogb3B0aW9ucyBpcyBJbnZva2VGdW5jdGlvbkJhc2ljT3B0aW9uczxUPiAmIEludm9rZUZ1bmN0aW9uQXJncyB7XG4gICAgcmV0dXJuICdhcmdzJyBpbiBvcHRpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzSW5qZWN0aW9uczxUPihcbiAgICBvcHRpb25zOiBJbnZva2VGdW5jdGlvbk9wdGlvbnM8VD5cbik6IG9wdGlvbnMgaXMgSW52b2tlRnVuY3Rpb25CYXNpY09wdGlvbnM8VD4gJiBJbnZva2VGdW5jdGlvbkluamVjdGlvbnMge1xuICAgIHJldHVybiAnaW5qZWN0aW9ucycgaW4gb3B0aW9ucztcbn1cbiIsImltcG9ydCB7IEFPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL2FvcC9BT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3InO1xuaW1wb3J0IHsgRmFjdG9yeVJlY29yZGVyIH0gZnJvbSAnLi4vY29tbW9uL0ZhY3RvcnlSZWNvcmRlcic7XG5pbXBvcnQgeyBpc05vZGVKcyB9IGZyb20gJy4uL2NvbW1vbi9pc05vZGVKcyc7XG5pbXBvcnQgeyBBcmd2RXZhbHVhdG9yIH0gZnJvbSAnLi4vZXZhbHVhdG9yL0FyZ3ZFdmFsdWF0b3InO1xuaW1wb3J0IHsgRW52aXJvbm1lbnRFdmFsdWF0b3IgfSBmcm9tICcuLi9ldmFsdWF0b3IvRW52aXJvbm1lbnRFdmFsdWF0b3InO1xuaW1wb3J0IHsgSlNPTkRhdGFFdmFsdWF0b3IgfSBmcm9tICcuLi9ldmFsdWF0b3IvSlNPTkRhdGFFdmFsdWF0b3InO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSwgQ2xhc3NNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgRnVuY3Rpb25NZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0Z1bmN0aW9uTWV0YWRhdGEnO1xuaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9HbG9iYWxNZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IEdsb2JhbFNoYXJlZEluc3RhbmNlUmVzb2x1dGlvbiB9IGZyb20gJy4uL3Jlc29sdXRpb24vR2xvYmFsU2hhcmVkSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IFNpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbiB9IGZyb20gJy4uL3Jlc29sdXRpb24vU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IFRyYW5zaWVudEluc3RhbmNlUmVzb2x1dGlvbiB9IGZyb20gJy4uL3Jlc29sdXRpb24vVHJhbnNpZW50SW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IEFueUZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMvQW55RnVuY3Rpb24nO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0T3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzL0FwcGxpY2F0aW9uQ29udGV4dE9wdGlvbnMnO1xuaW1wb3J0IHsgRXZhbHVhdGlvbk9wdGlvbnMsIEV4cHJlc3Npb25UeXBlIH0gZnJvbSAnLi4vdHlwZXMvRXZhbHVhdGVPcHRpb25zJztcbmltcG9ydCB7IEV2YWx1YXRvciB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRvcic7XG5pbXBvcnQgeyBGYWN0b3J5SWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0ZhY3RvcnlJZGVudGlmaWVyJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IEluc3RhbmNlIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2UnO1xuaW1wb3J0IHsgSW5zdGFuY2VSZXNvbHV0aW9uIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3IgfSBmcm9tICcuLi90eXBlcy9JbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3InO1xuaW1wb3J0IHsgSlNPTkRhdGEgfSBmcm9tICcuLi90eXBlcy9KU09ORGF0YSc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4uL3R5cGVzL1NlcnZpY2VGYWN0b3J5JztcbmltcG9ydCB7IENvbXBvbmVudEluc3RhbmNlQnVpbGRlciB9IGZyb20gJy4vQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciwgRXZlbnRMaXN0ZW5lciB9IGZyb20gJy4vRXZlbnRFbWl0dGVyJztcbmltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuL0luc3RhbmNlU2NvcGUnO1xuaW1wb3J0IHsgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlciB9IGZyb20gJy4vSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlcic7XG5pbXBvcnQgeyBoYXNBcmdzLCBoYXNJbmplY3Rpb25zLCBJbnZva2VGdW5jdGlvbk9wdGlvbnMgfSBmcm9tICcuL0ludm9rZUZ1bmN0aW9uT3B0aW9ucyc7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBMaWZlY3ljbGVNYW5hZ2VyIH0gZnJvbSAnLi9MaWZlY3ljbGVNYW5hZ2VyJztcblxuY29uc3QgUFJFX0RFU1RST1lfRVZFTlRfS0VZID0gJ2NvbnRhaW5lcjpldmVudDpwcmUtZGVzdHJveSc7XG5jb25zdCBQUkVfREVTVFJPWV9USEFUX0VWRU5UX0tFWSA9ICdjb250YWluZXI6ZXZlbnQ6cHJlLWRlc3Ryb3ktdGhhdCc7XG5jb25zdCBJTlNUQU5DRV9QUkVfREVTVFJPWV9NRVRIT0QgPSBTeW1ib2woJ3NvbGlkaXVtOmluc3RhbmNlLXByZS1kZXN0cm95Jyk7XG5cbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbkNvbnRleHQge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcmVzb2x1dGlvbnMgPSBuZXcgTWFwPEluc3RhbmNlU2NvcGUgfCBzdHJpbmcsIEluc3RhbmNlUmVzb2x1dGlvbj4oKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIHByaXZhdGUgcmVhZG9ubHkgZmFjdG9yaWVzID0gbmV3IEZhY3RvcnlSZWNvcmRlcigpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZXZhbHVhdG9yQ2xhc3NlcyA9IG5ldyBNYXA8c3RyaW5nLCBOZXdhYmxlPEV2YWx1YXRvcj4+KCk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBldmVudEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBkZWZhdWx0U2NvcGU6IEluc3RhbmNlU2NvcGU7XG4gICAgcHJpdmF0ZSByZWFkb25seSBsYXp5TW9kZTogYm9vbGVhbjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXI6IEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXI7XG4gICAgcHJpdmF0ZSBpc0Rlc3Ryb3llZCA9IGZhbHNlO1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihvcHRpb25zOiBBcHBsaWNhdGlvbkNvbnRleHRPcHRpb25zID0ge30pIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0U2NvcGUgPSBvcHRpb25zLmRlZmF1bHRTY29wZSB8fCBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTjtcbiAgICAgICAgdGhpcy5sYXp5TW9kZSA9IG9wdGlvbnMubGF6eU1vZGUgPz8gdHJ1ZTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlckluc3RhbmNlU2NvcGVSZXNvbHV0aW9uKEluc3RhbmNlU2NvcGUuU0lOR0xFVE9OLCBTaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24pO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySW5zdGFuY2VTY29wZVJlc29sdXRpb24oSW5zdGFuY2VTY29wZS5HTE9CQUxfU0hBUkVEX1NJTkdMRVRPTiwgR2xvYmFsU2hhcmVkSW5zdGFuY2VSZXNvbHV0aW9uKTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlckluc3RhbmNlU2NvcGVSZXNvbHV0aW9uKEluc3RhbmNlU2NvcGUuVFJBTlNJRU5ULCBUcmFuc2llbnRJbnN0YW5jZVJlc29sdXRpb24pO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZhbHVhdG9yKEV4cHJlc3Npb25UeXBlLkpTT05fUEFUSCwgSlNPTkRhdGFFdmFsdWF0b3IpO1xuICAgICAgICBpZiAoaXNOb2RlSnMpIHtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFdmFsdWF0b3IoRXhwcmVzc2lvblR5cGUuRU5WLCBFbnZpcm9ubWVudEV2YWx1YXRvcik7XG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyRXZhbHVhdG9yKEV4cHJlc3Npb25UeXBlLkFSR1YsIEFyZ3ZFdmFsdWF0b3IpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlciA9IG5ldyBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyKHRoaXMpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySW5zdEF3YXJlUHJvY2Vzc29yKEFPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvci5jcmVhdGUodGhpcykpO1xuICAgIH1cbiAgICBnZXRJbnN0YW5jZTxULCBPPihzeW1ib2w6IE5ld2FibGU8VD4sIG93bmVyPzogTyk6IFQ7XG4gICAgZ2V0SW5zdGFuY2U8VCwgTz4oc3ltYm9sOiBJZGVudGlmaWVyPFQ+LCBvd25lcj86IE8pOiBUIHwgVFtdO1xuICAgIGdldEluc3RhbmNlPFQsIE8+KHN5bWJvbDogSWRlbnRpZmllcjxUPiwgb3duZXI/OiBPKTogVCB8IFRbXSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3ltYm9sID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygc3ltYm9sID09PSAnc3ltYm9sJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2VCeVN5bWJvbChzeW1ib2wsIG93bmVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW5jZUJ5Q2xhc3Moc3ltYm9sLCBvd25lcik7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0SW5zdGFuY2VCeVN5bWJvbDxULCBPPihzeW1ib2w6IHN0cmluZyB8IHN5bWJvbCwgb3duZXI/OiBPKTogVCB8IFRbXSB7XG4gICAgICAgIGNvbnN0IGZhY3RvcnlEZWYgPSB0aGlzLmdldEZhY3Rvcnkoc3ltYm9sKTtcbiAgICAgICAgaWYgKGZhY3RvcnlEZWYpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb2R1Y2VyID0gZmFjdG9yeURlZi5wcm9kdWNlKHRoaXMsIG93bmVyKTtcblxuICAgICAgICAgICAgY29uc3QgcmVzb2x1dGlvbiA9IHRoaXMuZ2V0U2Nyb3BlUmVzb2x1dGlvbkluc3RhbmNlKGZhY3RvcnlEZWYuc2NvcGUpITtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAhcmVzb2x1dGlvbi5zaG91bGRHZW5lcmF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6IHN5bWJvbCxcbiAgICAgICAgICAgICAgICAgICAgb3duZXJcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdXRpb24uZ2V0SW5zdGFuY2Uoe1xuICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiBzeW1ib2wsXG4gICAgICAgICAgICAgICAgICAgIG93bmVyXG4gICAgICAgICAgICAgICAgfSkgYXMgVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlcyA9IHByb2R1Y2VyKCkgYXMgVFtdO1xuXG4gICAgICAgICAgICBjb25zdCByZXN1bHRzID0gaW5zdGFuY2VzLm1hcChpdCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRhY2hQcmVEZXN0cm95SG9vayhpdCk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29uc3RyID0gaXQ/LmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc3RyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudENsYXNzID0gY29uc3RyIGFzIE5ld2FibGU8VD47XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc29sdmVyID0gbmV3IExpZmVjeWNsZU1hbmFnZXI8VD4oY29tcG9uZW50Q2xhc3MsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0luc3RBd2FyZVByb2Nlc3NvciA9IHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5pc0luc3RBd2FyZVByb2Nlc3NvckNsYXNzKGNvbXBvbmVudENsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZXIuaW52b2tlUHJlSW5qZWN0TWV0aG9kKGl0IGFzIEluc3RhbmNlPFQ+KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0luc3RBd2FyZVByb2Nlc3Nvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXQgPSB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuYWZ0ZXJJbnN0YW50aWF0aW9uKGl0IGFzIEluc3RhbmNlPFQ+KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlci5pbnZva2VQb3N0SW5qZWN0TWV0aG9kKGl0IGFzIEluc3RhbmNlPFQ+KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzb2x1dGlvbi5zYXZlSW5zdGFuY2Uoe1xuICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiBzeW1ib2wsXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlOiBpdFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBpdDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHMubGVuZ3RoID09PSAxID8gcmVzdWx0c1swXSA6IHJlc3VsdHM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjbGFzc01ldGFkYXRhID0gR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWFkZXIoKS5nZXRDbGFzc01ldGFkYXRhPFQ+KHN5bWJvbCk7XG4gICAgICAgICAgICBpZiAoIWNsYXNzTWV0YWRhdGEpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENsYXNzIGFsaWFzIG5vdCBmb3VuZDogJHtzeW1ib2wudG9TdHJpbmcoKX1gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2xhenogPSBjbGFzc01ldGFkYXRhLnJlYWRlcigpLmdldENsYXNzKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2VCeUNsYXNzKGNsYXp6LCBvd25lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRJbnN0YW5jZUJ5Q2xhc3M8VCwgTz4oY29tcG9uZW50Q2xhc3M6IE5ld2FibGU8VD4sIG93bmVyPzogTyk6IFQgfCBUW10ge1xuICAgICAgICBpZiAoY29tcG9uZW50Q2xhc3MgPT09IEFwcGxpY2F0aW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMgYXMgdW5rbm93biBhcyBUO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlYWRlciA9IENsYXNzTWV0YWRhdGEuZ2V0SW5zdGFuY2UoY29tcG9uZW50Q2xhc3MpLnJlYWRlcigpO1xuICAgICAgICBjb25zdCBzY29wZSA9IHJlYWRlci5nZXRTY29wZSgpO1xuICAgICAgICBjb25zdCByZXNvbHV0aW9uID0gKHRoaXMucmVzb2x1dGlvbnMuZ2V0KHNjb3BlID8/IHRoaXMuZGVmYXVsdFNjb3BlKSB8fFxuICAgICAgICAgICAgdGhpcy5yZXNvbHV0aW9ucy5nZXQodGhpcy5kZWZhdWx0U2NvcGUpKSBhcyBJbnN0YW5jZVJlc29sdXRpb247XG4gICAgICAgIGNvbnN0IGdldEluc3RhbmNlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGlkZW50aWZpZXI6IGNvbXBvbmVudENsYXNzLFxuICAgICAgICAgICAgb3duZXIsXG4gICAgICAgICAgICBvd25lclByb3BlcnR5S2V5OiB1bmRlZmluZWRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHJlc29sdXRpb24uc2hvdWxkR2VuZXJhdGUoZ2V0SW5zdGFuY2VPcHRpb25zKSkge1xuICAgICAgICAgICAgY29uc3QgYnVpbGRlciA9IHRoaXMuY3JlYXRlQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyKGNvbXBvbmVudENsYXNzKTtcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gYnVpbGRlci5idWlsZCgpO1xuICAgICAgICAgICAgY29uc3Qgc2F2ZUluc3RhbmNlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAuLi5nZXRJbnN0YW5jZU9wdGlvbnMsXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXNvbHV0aW9uLnNhdmVJbnN0YW5jZShzYXZlSW5zdGFuY2VPcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuYXR0YWNoUHJlRGVzdHJveUhvb2soaW5zdGFuY2UpO1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdXRpb24uZ2V0SW5zdGFuY2UoZ2V0SW5zdGFuY2VPcHRpb25zKSBhcyBUO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgYXR0YWNoUHJlRGVzdHJveUhvb2s8VD4oaW5zdGFuY2VzOiBUIHwgVFtdKSB7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlc0FycmF5ID0gQXJyYXkuaXNBcnJheShpbnN0YW5jZXMpID8gaW5zdGFuY2VzIDogW2luc3RhbmNlc107XG4gICAgICAgIGluc3RhbmNlc0FycmF5LmZvckVhY2goaXQgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBpdCBhcyBJbnN0YW5jZTxUPjtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5zdGFuY2UgIT09ICdvYmplY3QnIHx8IGluc3RhbmNlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFJlZmxlY3QuaGFzKGluc3RhbmNlLCBJTlNUQU5DRV9QUkVfREVTVFJPWV9NRVRIT0QpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY2xhenogPSBpbnN0YW5jZS5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgIGlmICghY2xhenopIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGluc3RhbmNlLmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcblxuICAgICAgICAgICAgbWV0YWRhdGEuYWRkTGlmZWN5Y2xlTWV0aG9kKElOU1RBTkNFX1BSRV9ERVNUUk9ZX01FVEhPRCwgTGlmZWN5Y2xlLlBSRV9ERVNUUk9ZKTtcbiAgICAgICAgICAgIFJlZmxlY3Quc2V0KGluc3RhbmNlLCBJTlNUQU5DRV9QUkVfREVTVFJPWV9NRVRIT0QsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KFBSRV9ERVNUUk9ZX0VWRU5UX0tFWSwgaW5zdGFuY2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZUNvbXBvbmVudEluc3RhbmNlQnVpbGRlcjxUPihjb21wb25lbnRDbGFzczogTmV3YWJsZTxUPikge1xuICAgICAgICBjb25zdCBidWlsZGVyID0gbmV3IENvbXBvbmVudEluc3RhbmNlQnVpbGRlcihjb21wb25lbnRDbGFzcywgdGhpcywgdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyKTtcbiAgICAgICAgYnVpbGRlci5hcHBlbmRMYXp5TW9kZSh0aGlzLmxhenlNb2RlKTtcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXI7XG4gICAgfVxuXG4gICAgZ2V0RmFjdG9yeShrZXk6IEZhY3RvcnlJZGVudGlmaWVyKSB7XG4gICAgICAgIGNvbnN0IGZhY3RvcnkgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlYWRlcigpLmdldENvbXBvbmVudEZhY3Rvcnkoa2V5KTtcbiAgICAgICAgaWYgKCFmYWN0b3J5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mYWN0b3JpZXMuZ2V0KGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfVxuICAgIGJpbmRGYWN0b3J5PFQ+KFxuICAgICAgICBzeW1ib2w6IEZhY3RvcnlJZGVudGlmaWVyLFxuICAgICAgICBmYWN0b3J5OiBTZXJ2aWNlRmFjdG9yeTxULCB1bmtub3duPixcbiAgICAgICAgaW5qZWN0aW9ucz86IElkZW50aWZpZXJbXSxcbiAgICAgICAgc2NvcGU6IEluc3RhbmNlU2NvcGUgPSBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTlxuICAgICkge1xuICAgICAgICB0aGlzLmZhY3Rvcmllcy5hcHBlbmQoc3ltYm9sLCBmYWN0b3J5LCBpbmplY3Rpb25zLCBzY29wZSk7XG4gICAgfVxuICAgIGludm9rZTxSLCBDdHg+KGZ1bmM6IEFueUZ1bmN0aW9uPFIsIEN0eD4sIG9wdGlvbnM6IEludm9rZUZ1bmN0aW9uT3B0aW9uczxDdHg+ID0ge30pOiBSIHtcbiAgICAgICAgbGV0IGZuOiBBbnlGdW5jdGlvbjxSPjtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBmbiA9IGZ1bmMuYmluZChvcHRpb25zLmNvbnRleHQgYXMgVGhpc1BhcmFtZXRlclR5cGU8dHlwZW9mIGZ1bmM+KSBhcyBBbnlGdW5jdGlvbjxSPjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZuID0gZnVuYyBhcyBBbnlGdW5jdGlvbjxSPjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGFzQXJncyhvcHRpb25zKSkge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMuYXJncyA/IGZuKC4uLm9wdGlvbnMuYXJncykgOiBmbigpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhcmdzSW5kZW50aWZpZXJzOiBJZGVudGlmaWVyW10gPSBbXTtcbiAgICAgICAgaWYgKGhhc0luamVjdGlvbnMob3B0aW9ucykpIHtcbiAgICAgICAgICAgIGFyZ3NJbmRlbnRpZmllcnMgPSBvcHRpb25zLmluamVjdGlvbnM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGZuLCBGdW5jdGlvbk1ldGFkYXRhKS5yZWFkZXIoKTtcbiAgICAgICAgICAgIGFyZ3NJbmRlbnRpZmllcnMgPSBtZXRhZGF0YS5nZXRQYXJhbWV0ZXJzKCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXJncyA9IGFyZ3NJbmRlbnRpZmllcnMubWFwKChpZGVudGlmaWVyLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldEluc3RhbmNlKGlkZW50aWZpZXIpO1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaW5zdGFuY2UpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNBcnJheVR5cGUgPSAoaWRlbnRpZmllciBhcyB1bmtub3duKSA9PT0gQXJyYXk7XG4gICAgICAgICAgICAgICAgaWYgKGlzQXJyYXlUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGluc3RhbmNlLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdWx0aXBsZSBtYXRjaGluZyBpbmplY3RhYmxlcyBmb3VuZCBmb3IgcGFyYW1ldGVyIGF0ICR7aW5kZXh9LmApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaW5zdGFuY2VbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYXJncy5sZW5ndGggPiAwID8gZm4oLi4uYXJncykgOiBmbigpO1xuICAgIH1cbiAgICBkZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy5pc0Rlc3Ryb3llZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KFBSRV9ERVNUUk9ZX0VWRU5UX0tFWSk7XG4gICAgICAgIHRoaXMucmVzb2x1dGlvbnMuZm9yRWFjaChpdCA9PiB7XG4gICAgICAgICAgICBpdC5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBldmFsdWF0ZTxULCBPLCBBPihleHByZXNzaW9uOiBzdHJpbmcsIG9wdGlvbnM6IEV2YWx1YXRpb25PcHRpb25zPE8sIHN0cmluZywgQT4pOiBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc3QgZXZhbHVhdG9yQ2xhc3MgPSB0aGlzLmV2YWx1YXRvckNsYXNzZXMuZ2V0KG9wdGlvbnMudHlwZSk7XG4gICAgICAgIGlmICghZXZhbHVhdG9yQ2xhc3MpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFVua25vd24gZXZhbHVhdG9yIG5hbWU6ICR7b3B0aW9ucy50eXBlfWApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGV2YWx1YXRvciA9IHRoaXMuZ2V0SW5zdGFuY2UoZXZhbHVhdG9yQ2xhc3MpO1xuICAgICAgICByZXR1cm4gZXZhbHVhdG9yLmV2YWwodGhpcywgZXhwcmVzc2lvbiwgb3B0aW9ucy5leHRlcm5hbEFyZ3MpO1xuICAgIH1cbiAgICByZWNvcmRKU09ORGF0YShuYW1lc3BhY2U6IHN0cmluZywgZGF0YTogSlNPTkRhdGEpIHtcbiAgICAgICAgY29uc3QgZXZhbHVhdG9yID0gdGhpcy5nZXRJbnN0YW5jZShKU09ORGF0YUV2YWx1YXRvcik7XG4gICAgICAgIGV2YWx1YXRvci5yZWNvcmREYXRhKG5hbWVzcGFjZSwgZGF0YSk7XG4gICAgfVxuICAgIGdldEpTT05EYXRhKG5hbWVzcGFjZTogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGV2YWx1YXRvciA9IHRoaXMuZ2V0SW5zdGFuY2UoSlNPTkRhdGFFdmFsdWF0b3IpO1xuICAgICAgICByZXR1cm4gZXZhbHVhdG9yLmdldEpTT05EYXRhKG5hbWVzcGFjZSk7XG4gICAgfVxuICAgIGJpbmRJbnN0YW5jZTxUPihpZGVudGlmaWVyOiBzdHJpbmcgfCBzeW1ib2wsIGluc3RhbmNlOiBUKSB7XG4gICAgICAgIGNvbnN0IHJlc29sdXRpb24gPSB0aGlzLnJlc29sdXRpb25zLmdldChJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTik7XG4gICAgICAgIHJlc29sdXRpb24/LnNhdmVJbnN0YW5jZSh7XG4gICAgICAgICAgICBpZGVudGlmaWVyLFxuICAgICAgICAgICAgaW5zdGFuY2VcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlZ2lzdGVySW5zdGFuY2VTY29wZVJlc29sdXRpb248VCBleHRlbmRzIE5ld2FibGU8SW5zdGFuY2VSZXNvbHV0aW9uPj4oXG4gICAgICAgIHNjb3BlOiBJbnN0YW5jZVNjb3BlIHwgc3RyaW5nLFxuICAgICAgICByZXNvbHV0aW9uQ29uc3RydWN0b3I6IFQsXG4gICAgICAgIGNvbnN0cnVjdG9yQXJncz86IENvbnN0cnVjdG9yUGFyYW1ldGVyczxUPlxuICAgICkge1xuICAgICAgICB0aGlzLnJlc29sdXRpb25zLnNldChzY29wZSwgbmV3IHJlc29sdXRpb25Db25zdHJ1Y3RvciguLi4oY29uc3RydWN0b3JBcmdzID8/IFtdKSkpO1xuICAgIH1cbiAgICBnZXRTY3JvcGVSZXNvbHV0aW9uSW5zdGFuY2Uoc2NvcGU6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb2x1dGlvbnMuZ2V0KHNjb3BlKSA/PyB0aGlzLnJlc29sdXRpb25zLmdldCh0aGlzLmRlZmF1bHRTY29wZSk7XG4gICAgfVxuICAgIHJlZ2lzdGVyRXZhbHVhdG9yKG5hbWU6IHN0cmluZywgZXZhbHVhdG9yQ2xhc3M6IE5ld2FibGU8RXZhbHVhdG9yPikge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGV2YWx1YXRvckNsYXNzLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgbWV0YWRhdGEuc2V0U2NvcGUoSW5zdGFuY2VTY29wZS5TSU5HTEVUT04pO1xuICAgICAgICB0aGlzLmV2YWx1YXRvckNsYXNzZXMuc2V0KG5hbWUsIGV2YWx1YXRvckNsYXNzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFJlZ2lzdGVycyBhbiBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3IgY2xhc3MgdG8gY3VzdG9taXplXG4gICAgICogICAgICB0aGUgaW5zdGFudGlhdGlvbiBwcm9jZXNzIGF0IHZhcmlvdXMgc3RhZ2VzIHdpdGhpbiB0aGUgSW9DXG4gICAgICogQGRlcHJlY2F0ZWQgUmVwbGFjZWQgd2l0aCB7QGxpbmsgcmVnaXN0ZXJCZWZvcmVJbnN0YW50aWF0aW9uUHJvY2Vzc29yfSBhbmQge0BsaW5rIHJlZ2lzdGVyQWZ0ZXJJbnN0YW50aWF0aW9uUHJvY2Vzc29yfVxuICAgICAqIEBwYXJhbSB7TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPn0gY2xhenpcbiAgICAgKiBAc2VlIEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3NvclxuICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAqL1xuICAgIHJlZ2lzdGVySW5zdEF3YXJlUHJvY2Vzc29yKGNsYXp6OiBOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+KSB7XG4gICAgICAgIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5hcHBlbmRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyhjbGF6eik7XG4gICAgfVxuICAgIHJlZ2lzdGVyQmVmb3JlSW5zdGFudGlhdGlvblByb2Nlc3Nvcihwcm9jZXNzb3I6IDxUPihjb25zdHJ1Y3RvcjogTmV3YWJsZTxUPiwgYXJnczogdW5rbm93bltdKSA9PiBUIHwgdW5kZWZpbmVkIHwgdm9pZCkge1xuICAgICAgICB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuYXBwZW5kSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoXG4gICAgICAgICAgICBjbGFzcyBJbm5lclByb2Nlc3NvciBpbXBsZW1lbnRzIFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3Ige1xuICAgICAgICAgICAgICAgIGJlZm9yZUluc3RhbnRpYXRpb248VD4oY29uc3RydWN0b3I6IE5ld2FibGU8VD4sIGFyZ3M6IHVua25vd25bXSk6IHZvaWQgfCBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3Nvcihjb25zdHJ1Y3RvciwgYXJncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbiAgICByZWdpc3RlckFmdGVySW5zdGFudGlhdGlvblByb2Nlc3Nvcihwcm9jZXNzb3I6IDxUIGV4dGVuZHMgb2JqZWN0PihpbnN0YW5jZTogVCkgPT4gVCkge1xuICAgICAgICB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuYXBwZW5kSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoXG4gICAgICAgICAgICBjbGFzcyBJbm5lclByb2Nlc3NvciBpbXBsZW1lbnRzIFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3Ige1xuICAgICAgICAgICAgICAgIGFmdGVySW5zdGFudGlhdGlvbjxUIGV4dGVuZHMgb2JqZWN0PihpbnN0YW5jZTogVCk6IFQge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvY2Vzc29yKGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuICAgIG9uUHJlRGVzdHJveShsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudEVtaXR0ZXIub24oUFJFX0RFU1RST1lfRVZFTlRfS0VZLCBsaXN0ZW5lcik7XG4gICAgfVxuICAgIG9uUHJlRGVzdHJveVRoYXQobGlzdGVuZXI6IChpbnN0YW5jZTogb2JqZWN0KSA9PiB2b2lkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50RW1pdHRlci5vbihQUkVfREVTVFJPWV9USEFUX0VWRU5UX0tFWSwgbGlzdGVuZXIpO1xuICAgIH1cbiAgICBnZXRDbGFzc01ldGFkYXRhPFQ+KGN0b3I6IE5ld2FibGU8VD4pIHtcbiAgICAgICAgcmV0dXJuIENsYXNzTWV0YWRhdGEuZ2V0UmVhZGVyKGN0b3IpIGFzIENsYXNzTWV0YWRhdGFSZWFkZXI8VD47XG4gICAgfVxuICAgIGRlc3Ryb3lUcmFuc2llbnRJbnN0YW5jZTxUPihpbnN0YW5jZTogVCkge1xuICAgICAgICBjb25zdCByZXNvbHV0aW9uID0gdGhpcy5yZXNvbHV0aW9ucy5nZXQoSW5zdGFuY2VTY29wZS5UUkFOU0lFTlQpO1xuICAgICAgICByZXNvbHV0aW9uPy5kZXN0cm95VGhhdCAmJiByZXNvbHV0aW9uLmRlc3Ryb3lUaGF0KGluc3RhbmNlKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0dsb2JhbE1ldGFkYXRhJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEZhY3RvcnlJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvRmFjdG9yeUlkZW50aWZpZXInO1xuaW1wb3J0IHsgSW5zdGFuY2UgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZSc7XG5pbXBvcnQgeyBpc05vdERlZmluZWQgfSBmcm9tICcuLi9jb21tb24vaXNOb3REZWZpbmVkJztcbmltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uJztcblxuZXhwb3J0IGZ1bmN0aW9uIEZhY3RvcnkocHJvZHVjZUlkZW50aWZpZXI/OiBGYWN0b3J5SWRlbnRpZmllciwgc2NvcGU6IEluc3RhbmNlU2NvcGUgPSBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTik6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuICh0YXJnZXQ6IE9iamVjdCwgcHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCkgPT4ge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IEdsb2JhbE1ldGFkYXRhLmdldEluc3RhbmNlKCk7XG4gICAgICAgIGNvbnN0IGNsYXp6ID0gdGFyZ2V0LmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8SW5zdGFuY2U8dW5rbm93bj4+O1xuXG4gICAgICAgIGlmIChpc05vdERlZmluZWQocHJvZHVjZUlkZW50aWZpZXIpKSB7XG4gICAgICAgICAgICBwcm9kdWNlSWRlbnRpZmllciA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ2Rlc2lnbjpyZXR1cm50eXBlJywgdGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTm90RGVmaW5lZChwcm9kdWNlSWRlbnRpZmllcikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHJldHVybiB0eXBlIG5vdCByZWNvZ25pemVkLCBjYW5ub3QgcGVyZm9ybSBpbnN0YW5jZSBjcmVhdGlvbiEnKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpbmplY3Rpb25zID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnZGVzaWduOnBhcmFtdHlwZXMnLCB0YXJnZXQsIHByb3BlcnR5S2V5KTtcblxuICAgICAgICBtZXRhZGF0YS5yZWNvcmRGYWN0b3J5KFxuICAgICAgICAgICAgcHJvZHVjZUlkZW50aWZpZXIsXG4gICAgICAgICAgICAoY29udGFpbmVyLCBvd25lcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gY29udGFpbmVyLmdldEluc3RhbmNlKGNsYXp6LCBvd25lcik7XG4gICAgICAgICAgICAgICAgY29uc3QgZnVuYyA9IGluc3RhbmNlW3Byb3BlcnR5S2V5XTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZ1bmMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGNvbnRhaW5lci5nZXRJbnN0YW5jZShjbGF6eik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuYy5hcHBseShpbnN0YW5jZSwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IGZ1bmM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluamVjdGlvbnMsXG4gICAgICAgICAgICBzY29wZVxuICAgICAgICApO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuLi9mb3VuZGF0aW9uJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEsIEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBJbmplY3Rpb25UeXBlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9JbmplY3Rpb25UeXBlJztcblxuZXhwb3J0IGZ1bmN0aW9uIEdlbmVyYXRlPFQsIFY+KGdlbmVyYXRvcjogKHRoaXM6IFQsIGFwcEN0eDogQXBwbGljYXRpb25Db250ZXh0KSA9PiBWKTogUHJvcGVydHlEZWNvcmF0b3Ige1xuICAgIHJldHVybiAodGFyZ2V0OiBPYmplY3QsIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wpID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQuY29uc3RydWN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBjb25zdCB2YWx1ZV9zeW1ib2wgPSBTeW1ib2woJycpO1xuICAgICAgICBtZXRhZGF0YS5yZWNvcmRQcm9wZXJ0eVR5cGUocHJvcGVydHlLZXksIEluamVjdGlvblR5cGUub2ZJZGVudGlmaWVyKHZhbHVlX3N5bWJvbCkpO1xuICAgICAgICBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlY29yZEZhY3RvcnkodmFsdWVfc3ltYm9sLCAoY29udGFpbmVyLCBvd25lcikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IGdlbmVyYXRvci5jYWxsKG93bmVyIGFzIFQsIGNvbnRhaW5lcik7XG4gICAgICAgIH0pO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IGlzTm90RGVmaW5lZCB9IGZyb20gJy4uL2NvbW1vbi9pc05vdERlZmluZWQnO1xuaW1wb3J0IHsgSW5qZWN0aW9uVHlwZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vSW5qZWN0aW9uVHlwZSc7XG5pbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhJztcblxuZXhwb3J0IGZ1bmN0aW9uIEluamVjdDxUPihpZGVudGlmaWVyPzogSWRlbnRpZmllcjxUPikge1xuICAgIHJldHVybiBmdW5jdGlvbiA8VGFyZ2V0Pih0YXJnZXQ6IFRhcmdldCwgcHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCwgcGFyYW1ldGVySW5kZXg/OiBudW1iZXIpIHtcbiAgICAgICAgbGV0IGluamVjdENsYXNzOiBOZXdhYmxlPHVua25vd24+IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgcGFyYW1ldGVySW5kZXggPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAvLyBjb25zdHJ1Y3RvciBwYXJhbWV0ZXJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldENvbnN0ciA9IHRhcmdldCBhcyBOZXdhYmxlPFQ+O1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpZGVudGlmaWVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgaW5qZWN0Q2xhc3MgPSBpZGVudGlmaWVyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbmplY3RDbGFzcyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ2Rlc2lnbjpwYXJhbXR5cGVzJywgdGFyZ2V0LCBwcm9wZXJ0eUtleSlbcGFyYW1ldGVySW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzTm90RGVmaW5lZChpbmplY3RDbGFzcykpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1R5cGUgbm90IHJlY29nbml6ZWQsIGluamVjdGlvbiBjYW5ub3QgYmUgcGVyZm9ybWVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBjbGFzc01ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGFyZ2V0Q29uc3RyLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgICAgIGNsYXNzTWV0YWRhdGEuc2V0Q29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlKHBhcmFtZXRlckluZGV4LCBJbmplY3Rpb25UeXBlLm9mKGluamVjdENsYXNzLCBpZGVudGlmaWVyKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ29iamVjdCcgJiYgdGFyZ2V0ICE9PSBudWxsICYmIHByb3BlcnR5S2V5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGxldCBpbmplY3RDbGFzczogTmV3YWJsZTx1bmtub3duPiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaWRlbnRpZmllciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGluamVjdENsYXNzID0gaWRlbnRpZmllcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5qZWN0Q2xhc3MgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdkZXNpZ246dHlwZScsIHRhcmdldCwgcHJvcGVydHlLZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQuY29uc3RydWN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICAgICAgaWYgKGlzTm90RGVmaW5lZChpbmplY3RDbGFzcykpIHtcbiAgICAgICAgICAgICAgICBpZiAoaWRlbnRpZmllciAmJiB0eXBlb2YgaWRlbnRpZmllciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmYWN0b3J5RGVmID0gR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWFkZXIoKS5nZXRDb21wb25lbnRGYWN0b3J5KGlkZW50aWZpZXIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmFjdG9yeURlZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGEucmVjb3JkUHJvcGVydHlUeXBlKHByb3BlcnR5S2V5LCBJbmplY3Rpb25UeXBlLm9mSWRlbnRpZmllcihpZGVudGlmaWVyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUeXBlIG5vdCByZWNvZ25pemVkLCBpbmplY3Rpb24gY2Fubm90IGJlIHBlcmZvcm1lZCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5yZWNvcmRQcm9wZXJ0eVR5cGUocHJvcGVydHlLZXksIEluamVjdGlvblR5cGUub2YoaW5qZWN0Q2xhc3MsIGlkZW50aWZpZXIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG4iLCJpbXBvcnQgeyBJbnN0YW5jZVNjb3BlIH0gZnJvbSAnLi4vZm91bmRhdGlvbic7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhLCBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IEluc3RhbmNlIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2UnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEluamVjdGFibGVPcHRpb25zIHtcbiAgICBwcm9kdWNlOiBzdHJpbmcgfCBzeW1ib2wgfCBBcnJheTxzdHJpbmcgfCBzeW1ib2w+O1xuICAgIHNjb3BlPzogSW5zdGFuY2VTY29wZTtcbn1cblxuLyoqXG4gKiBUaGlzIGRlY29yYXRvciBpcyB0eXBpY2FsbHkgdXNlZCB0byBpZGVudGlmeSBjbGFzc2VzIHRoYXQgbmVlZCB0byBiZSBjb25maWd1cmVkIHdpdGhpbiB0aGUgSW9DIGNvbnRhaW5lci5cbiAqIEluIG1vc3QgY2FzZXMsIEBJbmplY3RhYmxlIGNhbiBiZSBvbWl0dGVkIHVubGVzcyBleHBsaWNpdCBjb25maWd1cmF0aW9uIGlzIHJlcXVpcmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gSW5qZWN0YWJsZShvcHRpb25zPzogSW5qZWN0YWJsZU9wdGlvbnMpOiBDbGFzc0RlY29yYXRvciB7XG4gICAgcmV0dXJuIDxURnVuY3Rpb24gZXh0ZW5kcyBGdW5jdGlvbj4odGFyZ2V0OiBURnVuY3Rpb24pOiBURnVuY3Rpb24gfCB2b2lkID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zPy5wcm9kdWNlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IEdsb2JhbE1ldGFkYXRhLmdldEluc3RhbmNlKCk7XG4gICAgICAgIGNvbnN0IHByb2R1Y2VzID0gQXJyYXkuaXNBcnJheShvcHRpb25zLnByb2R1Y2UpID8gb3B0aW9ucy5wcm9kdWNlIDogW29wdGlvbnMucHJvZHVjZV07XG4gICAgICAgIGNvbnN0IGNsYXNzTWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQgYXMgdW5rbm93biBhcyBOZXdhYmxlPHVua25vd24+LCBDbGFzc01ldGFkYXRhKTtcblxuICAgICAgICBwcm9kdWNlcy5mb3JFYWNoKHByb2R1Y2UgPT4ge1xuICAgICAgICAgICAgbWV0YWRhdGEucmVjb3JkRmFjdG9yeShcbiAgICAgICAgICAgICAgICBwcm9kdWNlLFxuICAgICAgICAgICAgICAgIChjb250YWluZXIsIG93bmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGNvbnRhaW5lci5nZXRJbnN0YW5jZSh0YXJnZXQgYXMgdW5rbm93biBhcyBOZXdhYmxlPEluc3RhbmNlPHVua25vd24+Piwgb3duZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgW10sXG4gICAgICAgICAgICAgICAgY2xhc3NNZXRhZGF0YS5yZWFkZXIoKS5nZXRTY29wZSgpID8/IG9wdGlvbnMuc2NvcGUgPz8gSW5zdGFuY2VTY29wZS5TSU5HTEVUT05cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yJztcbmltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuXG5leHBvcnQgZnVuY3Rpb24gSW5zdEF3YXJlUHJvY2Vzc29yKCkge1xuICAgIHJldHVybiBmdW5jdGlvbiA8Q2xzIGV4dGVuZHMgTmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPj4odGFyZ2V0OiBDbHMpIHtcbiAgICAgICAgR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWNvcmRQcm9jZXNzb3JDbGFzcyh0YXJnZXQpO1xuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBWYWx1ZSB9IGZyb20gJy4vVmFsdWUnO1xuaW1wb3J0IHsgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gSlNPTkRhdGEobmFtZXNwYWNlOiBzdHJpbmcsIGpzb25wYXRoOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gVmFsdWUoYCR7bmFtZXNwYWNlfToke2pzb25wYXRofWAsIEV4cHJlc3Npb25UeXBlLkpTT05fUEFUSCk7XG59XG4iLCJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9MaWZlY3ljbGUnO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5cbi8qKlxuICogVXJuIGNhbGxzIHRoZSBtZXRob2RzIGFubm90YXRlZCB3aXRoIEBQb3N0SW5qZWN0IG9ubHkgb25jZSwganVzdCBhZnRlciB0aGUgaW5qZWN0aW9uIG9mIHByb3BlcnRpZXMuXG4gKiBAYW5ub3RhdGlvblxuICovXG5leHBvcnQgY29uc3QgTGlmZWN5Y2xlRGVjb3JhdG9yID0gKGxpZmVjeWNsZTogTGlmZWN5Y2xlKTogTWV0aG9kRGVjb3JhdG9yID0+IHtcbiAgICByZXR1cm4gKHRhcmdldDogT2JqZWN0LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sKSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGFyZ2V0LmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgbWV0YWRhdGEuYWRkTGlmZWN5Y2xlTWV0aG9kKHByb3BlcnR5S2V5LCBsaWZlY3ljbGUpO1xuICAgIH07XG59O1xuIiwiaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuXG5leHBvcnQgZnVuY3Rpb24gTWFyayhrZXk6IHN0cmluZyB8IHN5bWJvbCwgdmFsdWU6IHVua25vd24gPSB0cnVlKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiBmdW5jdGlvbiAoXG4gICAgICAgIC4uLmFyZ3M6XG4gICAgICAgICAgICB8IFBhcmFtZXRlcnM8Q2xhc3NEZWNvcmF0b3I+XG4gICAgICAgICAgICB8IFBhcmFtZXRlcnM8TWV0aG9kRGVjb3JhdG9yPlxuICAgICAgICAgICAgfCBQYXJhbWV0ZXJzPFByb3BlcnR5RGVjb3JhdG9yPlxuICAgICAgICAgICAgfCBQYXJhbWV0ZXJzPFBhcmFtZXRlckRlY29yYXRvcj5cbiAgICApIHtcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAvLyBjbGFzcyBkZWNvcmF0b3JcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoYXJnc1swXSwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBtZXRhZGF0YS5tYXJrZXIoKS5jdG9yKGtleSwgdmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZ3MubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAvLyBwcm9wZXJ0eSBkZWNvcmF0b3JcbiAgICAgICAgICAgIGNvbnN0IFtwcm90b3R5cGUsIHByb3BlcnR5S2V5XSA9IGFyZ3M7XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHByb3RvdHlwZS5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBtZXRhZGF0YS5tYXJrZXIoKS5tZW1iZXIocHJvcGVydHlLZXkpLm1hcmsoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJncy5sZW5ndGggPT09IDMgJiYgdHlwZW9mIGFyZ3NbMl0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAvLyBwYXJhbWV0ZXIgZGVjb3JhdG9yXG4gICAgICAgICAgICBjb25zdCBbcHJvdG90eXBlLCBwcm9wZXJ0eUtleSwgaW5kZXhdID0gYXJncyBhcyBbT2JqZWN0LCBzdHJpbmcgfCBzeW1ib2wsIG51bWJlcl07XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHByb3RvdHlwZS5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBtZXRhZGF0YS5tYXJrZXIoKS5wYXJhbWV0ZXIocHJvcGVydHlLZXksIGluZGV4KS5tYXJrKGtleSwgdmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gbWV0aG9kIGRlY29yYXRvclxuICAgICAgICAgICAgY29uc3QgW3Byb3RvdHlwZSwgcHJvcGVydHlLZXldID0gYXJncyBhcyBQYXJhbWV0ZXJzPE1ldGhvZERlY29yYXRvcj47XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHByb3RvdHlwZS5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBtZXRhZGF0YS5tYXJrZXIoKS5tZW1iZXIocHJvcGVydHlLZXkpLm1hcmsoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuIiwiaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IExpZmVjeWNsZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vTGlmZWN5Y2xlJztcbmltcG9ydCB7IExpZmVjeWNsZURlY29yYXRvciB9IGZyb20gJy4vTGlmZWN5Y2xlRGVjb3JhdG9yJztcblxuLyoqXG4gKiBVcm4gY2FsbHMgdGhlIG1ldGhvZHMgYW5ub3RhdGVkIHdpdGggQFBvc3RJbmplY3Qgb25seSBvbmNlLCBqdXN0IGFmdGVyIHRoZSBpbmplY3Rpb24gb2YgcHJvcGVydGllcy5cbiAqIEBhbm5vdGF0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBQb3N0SW5qZWN0ID0gKCk6IE1ldGhvZERlY29yYXRvciA9PiBMaWZlY3ljbGVEZWNvcmF0b3IoTGlmZWN5Y2xlLlBPU1RfSU5KRUNUKTtcbiIsImltcG9ydCB7IExpZmVjeWNsZURlY29yYXRvciB9IGZyb20gJy4vTGlmZWN5Y2xlRGVjb3JhdG9yJztcbmltcG9ydCB7IExpZmVjeWNsZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vTGlmZWN5Y2xlJztcblxuZXhwb3J0IGNvbnN0IFByZURlc3Ryb3kgPSAoKSA9PiBMaWZlY3ljbGVEZWNvcmF0b3IoTGlmZWN5Y2xlLlBSRV9ERVNUUk9ZKTtcbiIsImltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBMaWZlY3ljbGVEZWNvcmF0b3IgfSBmcm9tICcuL0xpZmVjeWNsZURlY29yYXRvcic7XG5cbi8qKlxuICogVXJuIGNhbGxzIHRoZSBtZXRob2RzIGFubm90YXRlZCB3aXRoIEBQb3N0SW5qZWN0IG9ubHkgb25jZSwganVzdCBhZnRlciB0aGUgaW5qZWN0aW9uIG9mIHByb3BlcnRpZXMuXG4gKiBAYW5ub3RhdGlvblxuICovXG5leHBvcnQgY29uc3QgUHJlSW5qZWN0ID0gKCk6IE1ldGhvZERlY29yYXRvciA9PiBMaWZlY3ljbGVEZWNvcmF0b3IoTGlmZWN5Y2xlLlBSRV9JTkpFQ1QpO1xuIiwiaW1wb3J0IHsgSW5zdGFuY2VTY29wZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vSW5zdGFuY2VTY29wZSc7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIFNjb3BlKHNjb3BlOiBJbnN0YW5jZVNjb3BlIHwgc3RyaW5nKTogQ2xhc3NEZWNvcmF0b3Ige1xuICAgIHJldHVybiA8VEZ1bmN0aW9uIGV4dGVuZHMgRnVuY3Rpb24+KHRhcmdldDogVEZ1bmN0aW9uKSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGFyZ2V0IGFzIHVua25vd24gYXMgTmV3YWJsZTx1bmtub3duPiwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgIG1ldGFkYXRhLnNldFNjb3BlKHNjb3BlKTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgTWV0YWRhdGEsIE1ldGFkYXRhUmVhZGVyIH0gZnJvbSAnLi4vdHlwZXMvTWV0YWRhdGEnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQXNwZWN0IH0gZnJvbSAnLi9Bc3BlY3QnO1xuaW1wb3J0IHsgY3JlYXRlRGVmYXVsdFZhbHVlTWFwLCBEZWZhdWx0VmFsdWVNYXAgfSBmcm9tICcuLi9jb21tb24vRGVmYXVsdFZhbHVlTWFwJztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4vQWR2aWNlJztcblxuZXhwb3J0IHR5cGUgVXNlQXNwZWN0TWFwID0gRGVmYXVsdFZhbHVlTWFwPHN0cmluZyB8IHN5bWJvbCwgRGVmYXVsdFZhbHVlTWFwPEFkdmljZSwgQXJyYXk8TmV3YWJsZTxBc3BlY3Q+Pj4+O1xuXG5leHBvcnQgaW50ZXJmYWNlIFVzZUFzcGVjdE1ldGFkYXRhUmVhZGVyIGV4dGVuZHMgTWV0YWRhdGFSZWFkZXIge1xuICAgIGdldEFzcGVjdHMoKTogVXNlQXNwZWN0TWFwO1xuICAgIGdldEFzcGVjdHNPZihtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2wsIGFkdmljZTogQWR2aWNlKTogQXJyYXk8TmV3YWJsZTxBc3BlY3Q+Pjtcbn1cbmV4cG9ydCBjbGFzcyBBT1BDbGFzc01ldGFkYXRhIGltcGxlbWVudHMgTWV0YWRhdGE8VXNlQXNwZWN0TWV0YWRhdGFSZWFkZXIsIE5ld2FibGU8dW5rbm93bj4+IHtcbiAgICBzdGF0aWMgZ2V0UmVmbGVjdEtleSgpIHtcbiAgICAgICAgcmV0dXJuICdhb3A6dXNlLWFzcGVjdC1tZXRhZGF0YSc7XG4gICAgfVxuICAgIHByaXZhdGUgYXNwZWN0TWFwOiBVc2VBc3BlY3RNYXAgPSBjcmVhdGVEZWZhdWx0VmFsdWVNYXAoKCkgPT4gY3JlYXRlRGVmYXVsdFZhbHVlTWFwKCgpID0+IFtdKSk7XG4gICAgaW5pdCgpOiB2b2lkIHtcbiAgICAgICAgLy8gSUdOT1JFXG4gICAgfVxuXG4gICAgYXBwZW5kKG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCwgYWR2aWNlOiBBZHZpY2UsIGFzcGVjdHM6IEFycmF5PE5ld2FibGU8QXNwZWN0Pj4pIHtcbiAgICAgICAgY29uc3QgYWR2aWNlQXNwZWN0TWFwID0gdGhpcy5hc3BlY3RNYXAuZ2V0KG1ldGhvZE5hbWUpO1xuICAgICAgICBjb25zdCBleGl0aW5nQXNwZWN0QXJyYXkgPSBhZHZpY2VBc3BlY3RNYXAuZ2V0KGFkdmljZSk7XG4gICAgICAgIGV4aXRpbmdBc3BlY3RBcnJheS5wdXNoKC4uLmFzcGVjdHMpO1xuICAgIH1cblxuICAgIHJlYWRlcigpOiBVc2VBc3BlY3RNZXRhZGF0YVJlYWRlciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXRBc3BlY3RzOiAoKTogVXNlQXNwZWN0TWFwID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3BlY3RNYXA7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0QXNwZWN0c09mOiAobWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sLCBhZHZpY2U6IEFkdmljZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzcGVjdE1hcC5nZXQobWV0aG9kTmFtZSkuZ2V0KGFkdmljZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuXG5mdW5jdGlvbiBnZXRNZXRob2REZXNjcmlwdG9ycyhwcm90b3R5cGU6IG9iamVjdCk6IFJlY29yZDxzdHJpbmcsIFByb3BlcnR5RGVzY3JpcHRvcj4ge1xuICAgIGlmIChcbiAgICAgICAgdHlwZW9mIHByb3RvdHlwZSAhPT0gJ29iamVjdCcgfHxcbiAgICAgICAgcHJvdG90eXBlID09PSBudWxsIHx8XG4gICAgICAgIE9iamVjdC5wcm90b3R5cGUgPT09IHByb3RvdHlwZSB8fFxuICAgICAgICBGdW5jdGlvbi5wcm90b3R5cGUgPT09IHByb3RvdHlwZVxuICAgICkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGNvbnN0IHN1cGVyUHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvdHlwZSk7XG4gICAgY29uc3Qgc3VwZXJEZXNjcmlwdG9ycyA9IHN1cGVyUHJvdG90eXBlID09PSBwcm90b3R5cGUgPyB7fSA6IGdldE1ldGhvZERlc2NyaXB0b3JzKHN1cGVyUHJvdG90eXBlKTtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihzdXBlckRlc2NyaXB0b3JzLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhwcm90b3R5cGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFsbE1ldGhvZE1lbWJlck5hbWVzPFQ+KGNsczogTmV3YWJsZTxUPikge1xuICAgIGNvbnN0IGRlc2NyaXB0b3JzID0gZ2V0TWV0aG9kRGVzY3JpcHRvcnMoY2xzLnByb3RvdHlwZSk7XG4gICAgZGVsZXRlIGRlc2NyaXB0b3JzWydjb25zdHJ1Y3RvciddO1xuICAgIGNvbnN0IG1ldGhvZE5hbWVzID0gbmV3IFNldDxzdHJpbmcgfCBzeW1ib2w+KCk7XG4gICAgUmVmbGVjdC5vd25LZXlzKGRlc2NyaXB0b3JzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGNvbnN0IG1lbWJlciA9IGNscy5wcm90b3R5cGVba2V5XTtcbiAgICAgICAgaWYgKHR5cGVvZiBtZW1iZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIG1ldGhvZE5hbWVzLmFkZChrZXkpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG1ldGhvZE5hbWVzO1xufVxuIiwiaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgZ2V0QWxsTWV0aG9kTWVtYmVyTmFtZXMgfSBmcm9tICcuLi9jb21tb24vZ2V0QWxsTWV0aG9kTWVtYmVyTmFtZXMnO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuXG50eXBlIE1lbWJlcklkZW50aWZpZXIgPSBzdHJpbmcgfCBzeW1ib2w7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQb2ludGN1dCB7XG4gICAgc3RhdGljIGNvbWJpbmUoLi4ucG9pbnRjdXRzOiBQb2ludGN1dFtdKSB7XG4gICAgICAgIHJldHVybiBuZXcgT3JQb2ludGN1dChwb2ludGN1dHMpO1xuICAgIH1cbiAgICBzdGF0aWMgb2Y8VD4oY2xzOiBOZXdhYmxlPFQ+LCAuLi5tZXRob2ROYW1lczogTWVtYmVySWRlbnRpZmllcltdKSB7XG4gICAgICAgIGNvbnN0IGVudHJpZXMgPSBuZXcgTWFwPE5ld2FibGU8dW5rbm93bj4sIFNldDxNZW1iZXJJZGVudGlmaWVyPj4oKTtcbiAgICAgICAgY29uc3QgbWV0aG9kcyA9IG5ldyBTZXQ8TWVtYmVySWRlbnRpZmllcj4obWV0aG9kTmFtZXMgYXMgTWVtYmVySWRlbnRpZmllcltdKTtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGdldEFsbE1ldGhvZE1lbWJlck5hbWVzKGNscykuZm9yRWFjaChtZXRob2ROYW1lID0+IHtcbiAgICAgICAgICAgICAgICBtZXRob2RzLmFkZChtZXRob2ROYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVudHJpZXMuc2V0KGNscywgbWV0aG9kcyk7XG4gICAgICAgIHJldHVybiBuZXcgUHJlY2l0ZVBvaW50Y3V0KGVudHJpZXMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAqL1xuICAgIHN0YXRpYyB0ZXN0TWF0Y2g8VD4oY2xzOiBOZXdhYmxlPFQ+LCByZWdleDogUmVnRXhwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hdGNoKGNscywgcmVnZXgpO1xuICAgIH1cbiAgICBzdGF0aWMgbWF0Y2g8VD4oY2xzOiBOZXdhYmxlPFQ+LCByZWdleDogUmVnRXhwKSB7XG4gICAgICAgIHJldHVybiBuZXcgTWVtYmVyTWF0Y2hQb2ludGN1dChjbHMsIHJlZ2V4KTtcbiAgICB9XG4gICAgc3RhdGljIGZyb20oLi4uY2xhc3NlczogQXJyYXk8TmV3YWJsZTx1bmtub3duPj4pIHtcbiAgICAgICAgY29uc3Qgb2YgPSAoLi4ubWV0aG9kTmFtZXM6IE1lbWJlcklkZW50aWZpZXJbXSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBPclBvaW50Y3V0KGNsYXNzZXMubWFwKGNscyA9PiBQb2ludGN1dC5vZihjbHMsIC4uLm1ldGhvZE5hbWVzKSkpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBtYXRjaCA9IChyZWdleDogUmVnRXhwKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE9yUG9pbnRjdXQoXG4gICAgICAgICAgICAgICAgY2xhc3Nlcy5tYXAoY2xzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBNZW1iZXJNYXRjaFBvaW50Y3V0KGNscywgcmVnZXgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb2YsXG4gICAgICAgICAgICBtYXRjaCxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQGRlcHJlY2F0ZWRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGVzdE1hdGNoOiBtYXRjaFxuICAgICAgICB9O1xuICAgIH1cbiAgICBzdGF0aWMgbWFya2VkKHR5cGU6IHN0cmluZyB8IHN5bWJvbCwgdmFsdWU6IHVua25vd24gPSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBuZXcgTWFya2VkUG9pbnRjdXQodHlwZSwgdmFsdWUpO1xuICAgIH1cbiAgICBzdGF0aWMgY2xhc3M8VD4oY2xzOiBOZXdhYmxlPFQ+KSB7XG4gICAgICAgIHJldHVybiBuZXcgQ2xhc3NQb2ludGN1dChjbHMpO1xuICAgIH1cbiAgICBhYnN0cmFjdCB0ZXN0KGpwSWRlbnRpZmllcjogSWRlbnRpZmllciwganBNZW1iZXI6IHN0cmluZyB8IHN5bWJvbCk6IGJvb2xlYW47XG59XG5cbmNsYXNzIE9yUG9pbnRjdXQgZXh0ZW5kcyBQb2ludGN1dCB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwb2ludGN1dHM6IFBvaW50Y3V0W10pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgdGVzdChqcElkZW50aWZpZXI6IElkZW50aWZpZXIsIGpwTWVtYmVyOiBzdHJpbmcgfCBzeW1ib2wpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9pbnRjdXRzLnNvbWUoaXQgPT4gaXQudGVzdChqcElkZW50aWZpZXIsIGpwTWVtYmVyKSk7XG4gICAgfVxufVxuXG5jbGFzcyBQcmVjaXRlUG9pbnRjdXQgZXh0ZW5kcyBQb2ludGN1dCB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBtZXRob2RFbnRyaWVzOiBNYXA8SWRlbnRpZmllciwgU2V0PE1lbWJlcklkZW50aWZpZXI+Pikge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICB0ZXN0KGpwSWRlbnRpZmllcjogSWRlbnRpZmllciwganBNZW1iZXI6IHN0cmluZyB8IHN5bWJvbCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBtZW1iZXJzID0gdGhpcy5tZXRob2RFbnRyaWVzLmdldChqcElkZW50aWZpZXIpO1xuICAgICAgICByZXR1cm4gISFtZW1iZXJzICYmIG1lbWJlcnMuaGFzKGpwTWVtYmVyKTtcbiAgICB9XG59XG5jbGFzcyBNYXJrZWRQb2ludGN1dCBleHRlbmRzIFBvaW50Y3V0IHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1hcmtlZFR5cGU6IHN0cmluZyB8IHN5bWJvbCwgcHJpdmF0ZSBtYXJrZWRWYWx1ZTogdW5rbm93biA9IHRydWUpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgdGVzdChqcElkZW50aWZpZXI6IElkZW50aWZpZXIsIGpwTWVtYmVyOiBzdHJpbmcgfCBzeW1ib2wpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHR5cGVvZiBqcElkZW50aWZpZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGpwSWRlbnRpZmllciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgIGNvbnN0IG1hcmtJbmZvID0gbWV0YWRhdGEucmVhZGVyKCkuZ2V0TWVtYmVyc01hcmtJbmZvKGpwTWVtYmVyKTtcbiAgICAgICAgcmV0dXJuIG1hcmtJbmZvW3RoaXMubWFya2VkVHlwZV0gPT09IHRoaXMubWFya2VkVmFsdWU7XG4gICAgfVxufVxuY2xhc3MgTWVtYmVyTWF0Y2hQb2ludGN1dCBleHRlbmRzIFBvaW50Y3V0IHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNsYXp6OiBOZXdhYmxlPHVua25vd24+LCBwcml2YXRlIHJlZ2V4OiBSZWdFeHApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgdGVzdChqcElkZW50aWZpZXI6IElkZW50aWZpZXIsIGpwTWVtYmVyOiBzdHJpbmcgfCBzeW1ib2wpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGpwSWRlbnRpZmllciA9PT0gdGhpcy5jbGF6eiAmJiB0eXBlb2YganBNZW1iZXIgPT09ICdzdHJpbmcnICYmICEhdGhpcy5yZWdleC50ZXN0KGpwTWVtYmVyKTtcbiAgICB9XG59XG5jbGFzcyBDbGFzc1BvaW50Y3V0IGV4dGVuZHMgUG9pbnRjdXQge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY2xheno6IE5ld2FibGU8dW5rbm93bj4pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgdGVzdChqcElkZW50aWZpZXI6IElkZW50aWZpZXIpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGpwSWRlbnRpZmllciA9PT0gdGhpcy5jbGF6ejtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBQb2ludGN1dCB9IGZyb20gJy4vUG9pbnRjdXQnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi9BZHZpY2UnO1xuaW1wb3J0IHsgQXNwZWN0TWV0YWRhdGEgfSBmcm9tICcuL0FzcGVjdE1ldGFkdGEnO1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkQXNwZWN0KFxuICAgIGNvbXBvbmVudEFzcGVjdENsYXNzOiBOZXdhYmxlPHVua25vd24+LFxuICAgIG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCxcbiAgICBhZHZpY2U6IEFkdmljZSxcbiAgICBwb2ludGN1dDogUG9pbnRjdXRcbikge1xuICAgIEFzcGVjdE1ldGFkYXRhLmdldEluc3RhbmNlKCkuYXBwZW5kKGNvbXBvbmVudEFzcGVjdENsYXNzLCBtZXRob2ROYW1lLCBhZHZpY2UsIHBvaW50Y3V0KTtcbiAgICAvLyBjb25zdCBBc3BlY3RDbGFzcyA9IENvbXBvbmVudE1ldGhvZEFzcGVjdC5jcmVhdGUoY29tcG9uZW50QXNwZWN0Q2xhc3MsIG1ldGhvZE5hbWUpO1xuICAgIC8vIHBvaW50Y3V0LmdldE1ldGhvZHNNYXAoKS5mb3JFYWNoKChqcE1lbWJlcnMsIGpwQ2xhc3MpID0+IHtcbiAgICAvLyAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShqcENsYXNzLCBBT1BDbGFzc01ldGFkYXRhKTtcbiAgICAvLyAgICAganBNZW1iZXJzLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgLy8gICAgICAgICBtZXRhZGF0YS5hcHBlbmQobWV0aG9kTmFtZSwgYWR2aWNlLCBbQXNwZWN0Q2xhc3NdKTtcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gfSk7XG59XG4iLCJpbXBvcnQgeyBQb2ludGN1dCB9IGZyb20gJy4uL1BvaW50Y3V0JztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4uL0FkdmljZSc7XG5pbXBvcnQgeyBhZGRBc3BlY3QgfSBmcm9tICcuLi9hZGRBc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uLy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gQWZ0ZXIocG9pbnRjdXQ6IFBvaW50Y3V0KTogTWV0aG9kRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgYWRkQXNwZWN0KHRhcmdldC5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPHVua25vd24+LCBwcm9wZXJ0eUtleSwgQWR2aWNlLkFmdGVyLCBwb2ludGN1dCk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi4vUG9pbnRjdXQnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi4vQWR2aWNlJztcbmltcG9ydCB7IGFkZEFzcGVjdCB9IGZyb20gJy4uL2FkZEFzcGVjdCc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBBZnRlclJldHVybihwb2ludGN1dDogUG9pbnRjdXQpOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICBhZGRBc3BlY3QodGFyZ2V0LmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dW5rbm93bj4sIHByb3BlcnR5S2V5LCBBZHZpY2UuQWZ0ZXJSZXR1cm4sIHBvaW50Y3V0KTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgUG9pbnRjdXQgfSBmcm9tICcuLi9Qb2ludGN1dCc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuLi9BZHZpY2UnO1xuaW1wb3J0IHsgYWRkQXNwZWN0IH0gZnJvbSAnLi4vYWRkQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi8uLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIEFyb3VuZChwb2ludGN1dDogUG9pbnRjdXQpOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICBhZGRBc3BlY3QodGFyZ2V0LmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dW5rbm93bj4sIHByb3BlcnR5S2V5LCBBZHZpY2UuQXJvdW5kLCBwb2ludGN1dCk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi4vUG9pbnRjdXQnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi4vQWR2aWNlJztcbmltcG9ydCB7IGFkZEFzcGVjdCB9IGZyb20gJy4uL2FkZEFzcGVjdCc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBCZWZvcmUocG9pbnRjdXQ6IFBvaW50Y3V0KTogTWV0aG9kRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgYWRkQXNwZWN0KHRhcmdldC5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPHVua25vd24+LCBwcm9wZXJ0eUtleSwgQWR2aWNlLkJlZm9yZSwgcG9pbnRjdXQpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBQb2ludGN1dCB9IGZyb20gJy4uL1BvaW50Y3V0JztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4uL0FkdmljZSc7XG5pbXBvcnQgeyBhZGRBc3BlY3QgfSBmcm9tICcuLi9hZGRBc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uLy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gRmluYWxseShwb2ludGN1dDogUG9pbnRjdXQpOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICBhZGRBc3BlY3QodGFyZ2V0LmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dW5rbm93bj4sIHByb3BlcnR5S2V5LCBBZHZpY2UuRmluYWxseSwgcG9pbnRjdXQpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBQb2ludGN1dCB9IGZyb20gJy4uL1BvaW50Y3V0JztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4uL0FkdmljZSc7XG5pbXBvcnQgeyBhZGRBc3BlY3QgfSBmcm9tICcuLi9hZGRBc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uLy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gVGhyb3duKHBvaW50Y3V0OiBQb2ludGN1dCk6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgIGFkZEFzcGVjdCh0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTx1bmtub3duPiwgcHJvcGVydHlLZXksIEFkdmljZS5UaHJvd24sIHBvaW50Y3V0KTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi4vQWR2aWNlJztcbmltcG9ydCB7IEFzcGVjdCwgUHJvY2VlZGluZ0FzcGVjdCB9IGZyb20gJy4uL0FzcGVjdCc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBhZGRBc3BlY3QgfSBmcm9tICcuLi9hZGRBc3BlY3QnO1xuaW1wb3J0IHsgUG9pbnRjdXQgfSBmcm9tICcuLi9Qb2ludGN1dCc7XG5cbmZ1bmN0aW9uIFVzZUFzcGVjdHMoYWR2aWNlOiBBZHZpY2UuQXJvdW5kLCBhc3BlY3RzOiBBcnJheTxOZXdhYmxlPFByb2NlZWRpbmdBc3BlY3Q+Pik6IE1ldGhvZERlY29yYXRvcjtcbmZ1bmN0aW9uIFVzZUFzcGVjdHMoYWR2aWNlOiBBZHZpY2UsIGFzcGVjdHM6IEFycmF5PE5ld2FibGU8QXNwZWN0Pj4pOiBNZXRob2REZWNvcmF0b3I7XG5mdW5jdGlvbiBVc2VBc3BlY3RzKGFkdmljZTogQWR2aWNlLCBhc3BlY3RzOiBBcnJheTxOZXdhYmxlPEFzcGVjdD4+KTogTWV0aG9kRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgY29uc3QgY2xhenogPSB0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTx0eXBlb2YgdGFyZ2V0PjtcbiAgICAgICAgYXNwZWN0cy5mb3JFYWNoKGFzcGVjdENsYXNzID0+IHtcbiAgICAgICAgICAgIGFkZEFzcGVjdChhc3BlY3RDbGFzcywgJ2V4ZWN1dGUnLCBhZHZpY2UsIFBvaW50Y3V0Lm9mKGNsYXp6LCBwcm9wZXJ0eUtleSkpO1xuICAgICAgICB9KTtcbiAgICB9O1xufVxuXG5leHBvcnQgeyBVc2VBc3BlY3RzIH07XG4iLCJpbXBvcnQgeyBGYWN0b3J5IH0gZnJvbSAnLi4vZGVjb3JhdG9ycyc7XG5pbXBvcnQgeyBGYWN0b3J5SWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0ZhY3RvcnlJZGVudGlmaWVyJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUZhY3RvcnlXcmFwcGVyPFQ+KHByb2R1Y2VJZGVudGlmaWVyOiBGYWN0b3J5SWRlbnRpZmllciwgcHJvZHVjZTogdW5rbm93biwgb3duZXI6IFQpOiBUIHtcbiAgICBjbGFzcyBUaGVGYWN0b3J5IHtcbiAgICAgICAgQEZhY3RvcnkocHJvZHVjZUlkZW50aWZpZXIpXG4gICAgICAgIHByb2R1Y2UoKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvZHVjZTtcbiAgICAgICAgfVxuICAgICAgICBzdGF0aWMgcHJldmVudFRyZWVTaGFraW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIG93bmVyO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBUaGVGYWN0b3J5LnByZXZlbnRUcmVlU2hha2luZygpO1xufSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQU0sU0FBVSxxQkFBcUIsQ0FBTyxPQUFzQixFQUFBO0FBQzlELElBQUEsSUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLEVBQVEsQ0FBQztJQUM1QixJQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwQyxJQUFBLEdBQUcsQ0FBQyxHQUFHLEdBQUcsVUFBVSxHQUFNLEVBQUE7QUFDdEIsUUFBQSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDZCxZQUFBLE9BQU8sU0FBUyxDQUFDLEdBQUcsQ0FBTSxDQUFDO0FBQzlCLFNBQUE7QUFBTSxhQUFBO0FBQ0gsWUFBQSxJQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEMsWUFBQSxH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
