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

var InstanceScope;
(function (InstanceScope) {
    InstanceScope["SINGLETON"] = "ioc-resolution:container-singleton";
    InstanceScope["TRANSIENT"] = "ioc-resolution:transient";
    InstanceScope["GLOBAL_SHARED_SINGLETON"] = "ioc-resolution:global-shared-singleton";
})(InstanceScope || (InstanceScope = {}));

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
        this.scope = InstanceScope.SINGLETON;
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
    ClassMetadata.prototype.setConstructorParameterType = function (index, cls) {
        this.constructorParameterTypes[index] = cls;
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

var ServiceFactoryDef = /** @class */ (function () {
    /**
     * @param identifier The unique identifier of this factories
     * @param isSingle Indicates whether the identifier defines only one factory.
     */
    function ServiceFactoryDef(identifier, isSingle) {
        this.identifier = identifier;
        this.isSingle = isSingle;
        this.factories = new Map();
    }
    ServiceFactoryDef.createFromClassMetadata = function (metadata) {
        var def = new ServiceFactoryDef(metadata.reader().getClass(), true);
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
        if (this.isSingle && this.factories.size === 1 && !this.factories.has(factory)) {
            throw new Error("".concat(this.identifier.toString(), " is A singleton! But multiple factories are defined!"));
        }
        this.factories.set(factory, injections);
    };
    ServiceFactoryDef.prototype.produce = function (container, owner) {
        if (this.isSingle) {
            var _a = __read(this.factories.entries().next().value, 2), factory = _a[0], injections_1 = _a[1];
            var fn_1 = factory(container, owner);
            return function () {
                return container.invoke(fn_1, {
                    injections: injections_1
                });
            };
        }
        else {
            var producers_1 = Array.from(this.factories).map(function (_a) {
                var _b = __read(_a, 2), factory = _b[0], injections = _b[1];
                var fn = factory(container, owner);
                return function () {
                    return container.invoke(fn, {
                        injections: injections
                    });
                };
            });
            return function () {
                return producers_1.map(function (it) { return it(); });
            };
        }
    };
    return ServiceFactoryDef;
}());

var FactoryRecorder = /** @class */ (function () {
    function FactoryRecorder() {
        this.factories = new Map();
    }
    FactoryRecorder.prototype.append = function (identifier, factory, injections, isSingle) {
        if (injections === void 0) { injections = []; }
        if (isSingle === void 0) { isSingle = true; }
        var def = this.factories.get(identifier);
        if (def) {
            def.append(factory, injections);
        }
        else {
            def = new ServiceFactoryDef(identifier, isSingle);
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
    GlobalMetadata.prototype.recordFactory = function (symbol, factory, injections, isSingle) {
        if (injections === void 0) { injections = []; }
        if (isSingle === void 0) { isSingle = true; }
        this.componentFactories.append(symbol, factory, injections, isSingle);
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
        metadata.recordPropertyType(propertyKey, value_symbol);
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

function Factory(produceIdentifier, isSingle) {
    if (isSingle === void 0) { isSingle = true; }
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
        }, injections, isSingle);
    };
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

function Generate(generator) {
    return function (target, propertyKey) {
        var metadata = MetadataInstanceManager.getMetadata(target.constructor, ClassMetadata);
        var value_symbol = Symbol('');
        metadata.recordPropertyType(propertyKey, value_symbol);
        GlobalMetadata.getInstance().recordFactory(value_symbol, function (container, owner) {
            return function () { return generator.call(owner, container); };
        });
    };
}

function Inject(constr) {
    return function (target, propertyKey, parameterIndex) {
        if (typeof target === 'function' && typeof parameterIndex === 'number') {
            // constructor parameter
            var targetConstr = target;
            if (isNotDefined(constr)) {
                constr = Reflect.getMetadata('design:paramtypes', target, propertyKey)[parameterIndex];
            }
            if (isNotDefined(constr)) {
                throw new Error('Type not recognized, injection cannot be performed');
            }
            var classMetadata = MetadataInstanceManager.getMetadata(targetConstr, ClassMetadata);
            classMetadata.setConstructorParameterType(parameterIndex, constr);
        }
        else if (typeof target === 'object' && target !== null && propertyKey !== undefined) {
            // property
            if (isNotDefined(constr)) {
                constr = Reflect.getMetadata('design:type', target, propertyKey);
            }
            if (isNotDefined(constr)) {
                throw new Error('Type not recognized, injection cannot be performed');
            }
            var metadata = MetadataInstanceManager.getMetadata(target.constructor, ClassMetadata);
            metadata.recordPropertyType(propertyKey, constr);
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
        produces.forEach(function (produce) {
            metadata.recordFactory(produce, function (container, owner) {
                return function () {
                    var instance = container.getInstance(target, owner);
                    return instance;
                };
            }, [], false);
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

var Lifecycle;
(function (Lifecycle) {
    Lifecycle["PRE_INJECT"] = "ioc-scope:pre-inject";
    Lifecycle["POST_INJECT"] = "ioc-scope:post-inject";
    Lifecycle["PRE_DESTROY"] = "ioc-scope:pre-destroy";
})(Lifecycle || (Lifecycle = {}));

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

function hasArgs(options) {
    return 'args' in options;
}
function hasInjections(options) {
    return 'injections' in options;
}

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
                return _this.container.getInstance(it);
            });
        };
        var globalMetadataReader = GlobalMetadata.getReader();
        var propertyTypes = classMetadataReader.getPropertyTypeMap();
        var _loop_1 = function (propertyName, propertyType) {
            if (typeof propertyType === 'function') {
                this_1.propertyFactories.append(propertyName, function (container, owner) {
                    return function () { return container.getInstance(propertyType, owner); };
                });
                return "continue";
            }
            var factoryDef = this_1.container.getFactory(propertyType);
            if (factoryDef) {
                this_1.propertyFactories.set(propertyName, factoryDef);
                return "continue";
            }
            var propertyClassMetadata = globalMetadataReader.getClassMetadata(propertyType);
            if (propertyClassMetadata) {
                this_1.propertyFactories.set(propertyName, ServiceFactoryDef.createFromClassMetadata(propertyClassMetadata));
                return "continue";
            }
            var propertyFactoryDef = globalMetadataReader.getComponentFactory(propertyType);
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
            var isArray = propertyTypeMap.get(key) === Array;
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

var EnvironmentEvaluator = /** @class */ (function () {
    function EnvironmentEvaluator() {
    }
    EnvironmentEvaluator.prototype.eval = function (context, expression) {
        return process.env[expression];
    };
    return EnvironmentEvaluator;
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
        return proxyResult;
    };
    return AOPInstantiationAwareProcessor;
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
        var factoryDef = this.getFactory(symbol);
        if (factoryDef) {
            var producer = factoryDef.produce(this, owner);
            var result = producer();
            this.attachPreDestroyHook(result);
            var constr = result === null || result === void 0 ? void 0 : result.constructor;
            if (typeof constr === 'function') {
                var componentClass = constr;
                var resolver = new LifecycleManager(componentClass, this);
                var isInstAwareProcessor = this.instAwareProcessorManager.isInstAwareProcessorClass(componentClass);
                resolver.invokePreInjectMethod(result);
                if (!isInstAwareProcessor) {
                    result = this.instAwareProcessorManager.afterInstantiation(result);
                }
                resolver.invokePostInjectMethod(result);
            }
            return result;
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
        var resolution = (this.resolutions.get(scope) || this.resolutions.get(this.defaultScope));
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
    ApplicationContext.prototype.bindFactory = function (symbol, factory, injections, isSingle) {
        this.factories.append(symbol, factory, injections, isSingle);
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

export { AOPClassMetadata, Advice, After, AfterReturn, Alias, ApplicationContext, Argv, Around, Before, Bind, ClassMetadata, ComponentMethodAspect, Env, ExpressionType, FUNCTION_METADATA_KEY, Factory, Finally, FunctionMetadata, Generate, GlobalMetadata, Inject, Injectable, InstAwareProcessor, InstanceScope, JSONData, Lifecycle, LifecycleDecorator, Mark, MarkInfoContainer, ParameterMarkInfoContainer, Pointcut, PostInject, PreDestroy, PreInject, Scope, Thrown, UseAspects, Value, createFactoryWrapper };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguZXNtLmpzIiwic291cmNlcyI6WyIuLi9zcmMvZm91bmRhdGlvbi9JbnN0YW5jZVNjb3BlLnRzIiwiLi4vc3JjL2NvbW1vbi9EZWZhdWx0VmFsdWVNYXAudHMiLCIuLi9zcmMvbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIudHMiLCIuLi9zcmMvbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YS50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL1NlcnZpY2VGYWN0b3J5RGVmLnRzIiwiLi4vc3JjL2NvbW1vbi9GYWN0b3J5UmVjb3JkZXIudHMiLCIuLi9zcmMvbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEudHMiLCIuLi9zcmMvdHlwZXMvRXZhbHVhdGVPcHRpb25zLnRzIiwiLi4vc3JjL2NvbW1vbi9pc05vZGVKcy50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL1ZhbHVlLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvQXJndi50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0FsaWFzLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvQmluZC50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0Vudi50cyIsIi4uL3NyYy9jb21tb24vaXNOb3REZWZpbmVkLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvRmFjdG9yeS50cyIsIi4uL3NyYy9tZXRhZGF0YS9GdW5jdGlvbk1ldGFkYXRhLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvR2VuZXJhdGUudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9JbmplY3QudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9JbmplY3RhYmxlLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvSW5zdEF3YXJlUHJvY2Vzc29yLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvSlNPTkRhdGEudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9MaWZlY3ljbGVEZWNvcmF0b3IudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9NYXJrLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vTGlmZWN5Y2xlLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvUG9zdEluamVjdC50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL1ByZURlc3Ryb3kudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9QcmVJbmplY3QudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9TY29wZS50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0V2ZW50RW1pdHRlci50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0ludm9rZUZ1bmN0aW9uT3B0aW9ucy50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0xpZmVjeWNsZU1hbmFnZXIudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9Db21wb25lbnRJbnN0YW5jZUJ1aWxkZXIudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9Db21wb25lbnRJbnN0YW5jZVdyYXBwZXIudHMiLCIuLi9zcmMvY29tbW9uL2ludm9rZVByZURlc3Ryb3kudHMiLCIuLi9zcmMvcmVzb2x1dGlvbi9TaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24udHMiLCIuLi9zcmMvcmVzb2x1dGlvbi9HbG9iYWxTaGFyZWRJbnN0YW5jZVJlc29sdXRpb24udHMiLCIuLi9zcmMvcmVzb2x1dGlvbi9UcmFuc2llbnRJbnN0YW5jZVJlc29sdXRpb24udHMiLCIuLi9zcmMvZXZhbHVhdG9yL0pTT05EYXRhRXZhbHVhdG9yLnRzIiwiLi4vc3JjL2V2YWx1YXRvci9FbnZpcm9ubWVudEV2YWx1YXRvci50cyIsIi4uL3NyYy9ldmFsdWF0b3IvQXJndkV2YWx1YXRvci50cyIsIi4uL3NyYy9hb3AvQWR2aWNlLnRzIiwiLi4vc3JjL2FvcC9Bc3BlY3RVdGlscy50cyIsIi4uL3NyYy9hb3AvY3JlYXRlQXNwZWN0LnRzIiwiLi4vc3JjL2FvcC9Db21wb25lbnRNZXRob2RBc3BlY3QudHMiLCIuLi9zcmMvYW9wL0FzcGVjdE1ldGFkdGEudHMiLCIuLi9zcmMvYW9wL0FPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvci50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXIudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQudHMiLCIuLi9zcmMvYW9wL0FPUENsYXNzTWV0YWRhdGEudHMiLCIuLi9zcmMvY29tbW9uL2dldEFsbE1ldGhvZE1lbWJlck5hbWVzLnRzIiwiLi4vc3JjL2FvcC9Qb2ludGN1dC50cyIsIi4uL3NyYy9hb3AvYWRkQXNwZWN0LnRzIiwiLi4vc3JjL2FvcC9kZWNvcmF0b3JzL0FmdGVyLnRzIiwiLi4vc3JjL2FvcC9kZWNvcmF0b3JzL0FmdGVyUmV0dXJuLnRzIiwiLi4vc3JjL2FvcC9kZWNvcmF0b3JzL0Fyb3VuZC50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9CZWZvcmUudHMiLCIuLi9zcmMvYW9wL2RlY29yYXRvcnMvRmluYWxseS50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9UaHJvd24udHMiLCIuLi9zcmMvYW9wL2RlY29yYXRvcnMvVXNlQXNwZWN0cy50cyIsIi4uL3NyYy91dGlscy9jcmVhdGVGYWN0b3J5V3JhcHBlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZW51bSBJbnN0YW5jZVNjb3BlIHtcbiAgICBTSU5HTEVUT04gPSAnaW9jLXJlc29sdXRpb246Y29udGFpbmVyLXNpbmdsZXRvbicsXG4gICAgVFJBTlNJRU5UID0gJ2lvYy1yZXNvbHV0aW9uOnRyYW5zaWVudCcsXG4gICAgR0xPQkFMX1NIQVJFRF9TSU5HTEVUT04gPSAnaW9jLXJlc29sdXRpb246Z2xvYmFsLXNoYXJlZC1zaW5nbGV0b24nXG59XG4iLCJleHBvcnQgZnVuY3Rpb24gY3JlYXRlRGVmYXVsdFZhbHVlTWFwPEssIFY+KGZhY3Rvcnk6IChrZXk6IEspID0+IFYpIHtcbiAgICBjb25zdCBtYXAgPSBuZXcgTWFwPEssIFY+KCk7XG4gICAgY29uc3Qgb3JpZ2luR2V0ID0gbWFwLmdldC5iaW5kKG1hcCk7XG4gICAgbWFwLmdldCA9IGZ1bmN0aW9uIChrZXk6IEspIHtcbiAgICAgICAgaWYgKG1hcC5oYXMoa2V5KSkge1xuICAgICAgICAgICAgcmV0dXJuIG9yaWdpbkdldChrZXkpIGFzIFY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0VmFsdWUgPSBmYWN0b3J5KGtleSk7XG4gICAgICAgICAgICBtYXAuc2V0KGtleSwgZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBtYXAuZ2V0KGtleSkgYXMgVjtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIG1hcCBhcyBEZWZhdWx0VmFsdWVNYXA8SywgVj47XG59XG5leHBvcnQgdHlwZSBEZWZhdWx0VmFsdWVNYXA8SywgVj4gPSBPbWl0PE1hcDxLLCBWPiwgJ2dldCc+ICYge1xuICAgIGdldDogKGtleTogSykgPT4gVjtcbn07XG4iLCJpbXBvcnQgeyBNZXRhZGF0YSwgTWV0YWRhdGFDbGFzcywgTWV0YWRhdGFSZWFkZXIgfSBmcm9tICcuLi90eXBlcy9NZXRhZGF0YSc7XG5pbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IHsgY3JlYXRlRGVmYXVsdFZhbHVlTWFwIH0gZnJvbSAnLi4vY29tbW9uL0RlZmF1bHRWYWx1ZU1hcCc7XG5cbnR5cGUgQW55TWV0YWRhdGEgPSBNZXRhZGF0YTxNZXRhZGF0YVJlYWRlciwgdW5rbm93bj47XG50eXBlIEFueU1ldGFkYXRhQ2xhc3MgPSBNZXRhZGF0YUNsYXNzPE1ldGFkYXRhUmVhZGVyLCB1bmtub3duLCBBbnlNZXRhZGF0YT47XG5cbmNvbnN0IG1ldGFkYXRhSW5zdGFuY2VNYXAgPSBjcmVhdGVEZWZhdWx0VmFsdWVNYXA8QW55TWV0YWRhdGFDbGFzcywgU2V0PEFueU1ldGFkYXRhPj4oKCkgPT4gbmV3IFNldCgpKTtcblxuZXhwb3J0IGNsYXNzIE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIHtcbiAgICBzdGF0aWMgZ2V0TWV0YWRhdGE8UiBleHRlbmRzIE1ldGFkYXRhUmVhZGVyLCBUIGV4dGVuZHMgT2JqZWN0LCBNIGV4dGVuZHMgTWV0YWRhdGE8UiwgVD4gPSBNZXRhZGF0YTxSLCBUPj4oXG4gICAgICAgIHRhcmdldDogVCxcbiAgICAgICAgbWV0YWRhdGFDbGFzczogTWV0YWRhdGFDbGFzczxSLCBULCBNPlxuICAgICkge1xuICAgICAgICBjb25zdCBrZXkgPSBtZXRhZGF0YUNsYXNzLmdldFJlZmxlY3RLZXkoKTtcbiAgICAgICAgbGV0IG1ldGFkYXRhID0gUmVmbGVjdC5nZXRNZXRhZGF0YShrZXksIHRhcmdldCk7XG4gICAgICAgIGlmICghbWV0YWRhdGEpIHtcbiAgICAgICAgICAgIG1ldGFkYXRhID0gbmV3IG1ldGFkYXRhQ2xhc3MoKTtcbiAgICAgICAgICAgIG1ldGFkYXRhLmluaXQodGFyZ2V0KTtcbiAgICAgICAgICAgIFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoa2V5LCBtZXRhZGF0YSwgdGFyZ2V0KTtcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlU2V0ID0gbWV0YWRhdGFJbnN0YW5jZU1hcC5nZXQobWV0YWRhdGFDbGFzcyk7XG4gICAgICAgICAgICBpbnN0YW5jZVNldC5hZGQobWV0YWRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZXRhZGF0YSBhcyBNO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0QWxsSW5zdGFuY2VvZjxNIGV4dGVuZHMgQW55TWV0YWRhdGFDbGFzcz4obWV0YWRhdGFDbGFzczogTSkge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShtZXRhZGF0YUluc3RhbmNlTWFwLmdldChtZXRhZGF0YUNsYXNzKSk7XG4gICAgfVxufVxuIiwiLy8gZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuaW1wb3J0IHsgSW5zdGFuY2VTY29wZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vSW5zdGFuY2VTY29wZSc7XG5pbXBvcnQgeyBKc1NlcnZpY2VDbGFzcyB9IGZyb20gJy4uL3R5cGVzL0pzU2VydmljZUNsYXNzJztcbmltcG9ydCB7IE1ldGFkYXRhLCBNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4uL3R5cGVzL01ldGFkYXRhJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IExpZmVjeWNsZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vTGlmZWN5Y2xlJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcCB9IGZyb20gJy4uL2NvbW1vbi9EZWZhdWx0VmFsdWVNYXAnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IE1lbWJlcktleSB9IGZyb20gJy4uL3R5cGVzL01lbWJlcktleSc7XG5pbXBvcnQgeyBLZXlPZiB9IGZyb20gJy4uL3R5cGVzL0tleU9mJztcblxuY29uc3QgQ0xBU1NfTUVUQURBVEFfS0VZID0gJ2lvYzpjbGFzcy1tZXRhZGF0YSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFya0luZm8ge1xuICAgIFtrZXk6IHN0cmluZyB8IHN5bWJvbF06IHVua25vd247XG59XG5cbmV4cG9ydCBjbGFzcyBNYXJrSW5mb0NvbnRhaW5lciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBtYXAgPSBjcmVhdGVEZWZhdWx0VmFsdWVNYXA8TWVtYmVyS2V5LCBNYXJrSW5mbz4oKCkgPT4gKHt9IGFzIE1hcmtJbmZvKSk7XG4gICAgZ2V0TWFya0luZm8obWV0aG9kOiBNZW1iZXJLZXkpOiBNYXJrSW5mbyB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcC5nZXQobWV0aG9kKTtcbiAgICB9XG4gICAgbWFyayhtZXRob2Q6IE1lbWJlcktleSwga2V5OiBNZW1iZXJLZXksIHZhbHVlOiB1bmtub3duKSB7XG4gICAgICAgIGNvbnN0IG1hcmtJbmZvID0gdGhpcy5tYXAuZ2V0KG1ldGhvZCk7XG4gICAgICAgIG1hcmtJbmZvW2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgZ2V0TWVtYmVycygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTZXQodGhpcy5tYXAua2V5cygpKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQYXJhbWV0ZXJNYXJrSW5mb0NvbnRhaW5lciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBtYXAgPSBjcmVhdGVEZWZhdWx0VmFsdWVNYXA8TWVtYmVyS2V5LCBSZWNvcmQ8bnVtYmVyLCBNYXJrSW5mbz4+KCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH0pO1xuICAgIGdldE1hcmtJbmZvKG1ldGhvZDogTWVtYmVyS2V5KTogUmVjb3JkPG51bWJlciwgTWFya0luZm8+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwLmdldChtZXRob2QpO1xuICAgIH1cbiAgICBtYXJrKG1ldGhvZDogTWVtYmVyS2V5LCBpbmRleDogbnVtYmVyLCBrZXk6IE1lbWJlcktleSwgdmFsdWU6IHVua25vd24pIHtcbiAgICAgICAgY29uc3QgcGFyYW1zTWFya0luZm8gPSB0aGlzLm1hcC5nZXQobWV0aG9kKTtcbiAgICAgICAgY29uc3QgbWFya0luZm8gPSBwYXJhbXNNYXJrSW5mb1tpbmRleF0gfHwge307XG4gICAgICAgIG1hcmtJbmZvW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgcGFyYW1zTWFya0luZm9baW5kZXhdID0gbWFya0luZm87XG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENsYXNzTWFya0luZm8ge1xuICAgIGN0b3I6IE1hcmtJbmZvO1xuICAgIG1lbWJlcnM6IE1hcmtJbmZvQ29udGFpbmVyO1xuICAgIHBhcmFtczogUGFyYW1ldGVyTWFya0luZm9Db250YWluZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhc3NNZXRhZGF0YVJlYWRlcjxUPiBleHRlbmRzIE1ldGFkYXRhUmVhZGVyIHtcbiAgICBnZXRDbGFzcygpOiBOZXdhYmxlPFQ+O1xuICAgIGdldFNjb3BlKCk6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmc7XG4gICAgZ2V0Q29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlcygpOiBBcnJheTxJZGVudGlmaWVyPjtcbiAgICBnZXRNZXRob2RzKGxpZmVjeWNsZTogTGlmZWN5Y2xlKTogQXJyYXk8c3RyaW5nIHwgc3ltYm9sPjtcbiAgICBnZXRQcm9wZXJ0eVR5cGVNYXAoKTogTWFwPHN0cmluZyB8IHN5bWJvbCwgSWRlbnRpZmllcj47XG4gICAgZ2V0Q3Rvck1hcmtJbmZvKCk6IE1hcmtJbmZvO1xuICAgIGdldEFsbE1hcmtlZE1lbWJlcnMoKTogU2V0PE1lbWJlcktleT47XG4gICAgZ2V0TWVtYmVyc01hcmtJbmZvKG1ldGhvZEtleTogS2V5T2Y8VD4pOiBNYXJrSW5mbztcbiAgICBnZXRQYXJhbWV0ZXJNYXJrSW5mbyhtZXRob2RLZXk6IEtleU9mPFQ+KTogUmVjb3JkPG51bWJlciwgTWFya0luZm8+O1xufVxuXG5leHBvcnQgY2xhc3MgQ2xhc3NNZXRhZGF0YTxUPiBpbXBsZW1lbnRzIE1ldGFkYXRhPENsYXNzTWV0YWRhdGFSZWFkZXI8VD4sIE5ld2FibGU8VD4+IHtcbiAgICBzdGF0aWMgZ2V0UmVmbGVjdEtleSgpIHtcbiAgICAgICAgcmV0dXJuIENMQVNTX01FVEFEQVRBX0tFWTtcbiAgICB9XG4gICAgcHJpdmF0ZSBzY29wZTogSW5zdGFuY2VTY29wZSB8IHN0cmluZyA9IEluc3RhbmNlU2NvcGUuU0lOR0xFVE9OO1xuICAgIHByaXZhdGUgY29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlczogQXJyYXk8SWRlbnRpZmllcj4gPSBbXTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxpZmVjeWNsZU1ldGhvZHNNYXA6IFJlY29yZDxzdHJpbmcgfCBzeW1ib2wsIFNldDxMaWZlY3ljbGU+PiA9IHt9O1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcHJvcGVydHlUeXBlc01hcCA9IG5ldyBNYXA8c3RyaW5nIHwgc3ltYm9sLCBJZGVudGlmaWVyPigpO1xuICAgIHByaXZhdGUgY2xhenohOiBOZXdhYmxlPFQ+O1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbWFya3M6IENsYXNzTWFya0luZm8gPSB7XG4gICAgICAgIGN0b3I6IHt9LFxuICAgICAgICBtZW1iZXJzOiBuZXcgTWFya0luZm9Db250YWluZXIoKSxcbiAgICAgICAgcGFyYW1zOiBuZXcgUGFyYW1ldGVyTWFya0luZm9Db250YWluZXIoKVxuICAgIH07XG5cbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2U8VD4oY3RvcjogTmV3YWJsZTxUPikge1xuICAgICAgICByZXR1cm4gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoY3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgfVxuICAgIHN0YXRpYyBnZXRSZWFkZXI8VD4oY3RvcjogTmV3YWJsZTxUPikge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW5jZShjdG9yKS5yZWFkZXIoKTtcbiAgICB9XG5cbiAgICBpbml0KHRhcmdldDogTmV3YWJsZTxUPikge1xuICAgICAgICB0aGlzLmNsYXp6ID0gdGFyZ2V0O1xuICAgICAgICBjb25zdCBjb25zdHIgPSB0YXJnZXQgYXMgSnNTZXJ2aWNlQ2xhc3M8dW5rbm93bj47XG4gICAgICAgIGlmICh0eXBlb2YgY29uc3RyLnNjb3BlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnNldFNjb3BlKGNvbnN0ci5zY29wZSgpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGNvbnN0ci5pbmplY3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNvbnN0IGluamVjdGlvbnMgPSBjb25zdHIuaW5qZWN0KCk7XG4gICAgICAgICAgICBSZWZsZWN0Lm93bktleXMoaW5qZWN0aW9ucykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucmVjb3JkUHJvcGVydHlUeXBlKGtleSwgaW5qZWN0aW9uc1trZXldKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgY29uc3RyLm1ldGFkYXRhID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IGNvbnN0ci5tZXRhZGF0YSgpO1xuICAgICAgICAgICAgaWYgKG1ldGFkYXRhLnNjb3BlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTY29wZShtZXRhZGF0YS5zY29wZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpbmplY3Rpb25zID0gbWV0YWRhdGEuaW5qZWN0O1xuICAgICAgICAgICAgaWYgKGluamVjdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBSZWZsZWN0Lm93bktleXMoaW5qZWN0aW9ucykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlY29yZFByb3BlcnR5VHlwZShrZXksIGluamVjdGlvbnNba2V5XSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtYXJrZXIoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjdG9yOiAoa2V5OiBzdHJpbmcgfCBzeW1ib2wsIHZhbHVlOiB1bmtub3duKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXJrcy5jdG9yW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtZW1iZXI6IChwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sIHwgbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgbWFyazogKGtleTogc3RyaW5nIHwgc3ltYm9sLCB2YWx1ZTogdW5rbm93bikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXJrcy5tZW1iZXJzLm1hcmsocHJvcGVydHlLZXksIGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJhbWV0ZXI6IChwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgbWFyazogKGtleTogc3RyaW5nIHwgc3ltYm9sLCB2YWx1ZTogdW5rbm93bikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXJrcy5wYXJhbXMubWFyayhwcm9wZXJ0eUtleSwgaW5kZXgsIGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgc2V0U2NvcGUoc2NvcGU6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zY29wZSA9IHNjb3BlO1xuICAgIH1cbiAgICBzZXRDb25zdHJ1Y3RvclBhcmFtZXRlclR5cGUoaW5kZXg6IG51bWJlciwgY2xzOiBJZGVudGlmaWVyKSB7XG4gICAgICAgIHRoaXMuY29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlc1tpbmRleF0gPSBjbHM7XG4gICAgfVxuICAgIHJlY29yZFByb3BlcnR5VHlwZShwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sLCB0eXBlOiBJZGVudGlmaWVyKSB7XG4gICAgICAgIHRoaXMucHJvcGVydHlUeXBlc01hcC5zZXQocHJvcGVydHlLZXksIHR5cGUpO1xuICAgIH1cbiAgICBhZGRMaWZlY3ljbGVNZXRob2QobWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sLCBsaWZlY3ljbGU6IExpZmVjeWNsZSkge1xuICAgICAgICBjb25zdCBsaWZlY3ljbGVzID0gdGhpcy5nZXRMaWZlY3ljbGVzKG1ldGhvZE5hbWUpO1xuICAgICAgICBsaWZlY3ljbGVzLmFkZChsaWZlY3ljbGUpO1xuICAgICAgICB0aGlzLmxpZmVjeWNsZU1ldGhvZHNNYXBbbWV0aG9kTmFtZV0gPSBsaWZlY3ljbGVzO1xuICAgIH1cbiAgICBwcml2YXRlIGdldExpZmVjeWNsZXMobWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxpZmVjeWNsZU1ldGhvZHNNYXBbbWV0aG9kTmFtZV0gfHwgbmV3IFNldDxMaWZlY3ljbGU+KCk7XG4gICAgfVxuICAgIGdldE1ldGhvZHMobGlmZWN5Y2xlOiBMaWZlY3ljbGUpOiBBcnJheTxzdHJpbmcgfCBzeW1ib2w+IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMubGlmZWN5Y2xlTWV0aG9kc01hcCkuZmlsdGVyKGl0ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxpZmVjeWNsZXMgPSB0aGlzLmxpZmVjeWNsZU1ldGhvZHNNYXBbaXRdO1xuICAgICAgICAgICAgcmV0dXJuIGxpZmVjeWNsZXMuaGFzKGxpZmVjeWNsZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwcml2YXRlIGdldFN1cGVyQ2xhc3MoKSB7XG4gICAgICAgIGNvbnN0IHN1cGVyQ2xhc3NQcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcy5jbGF6eik7XG4gICAgICAgIGlmICghc3VwZXJDbGFzc1Byb3RvdHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3VwZXJDbGFzcyA9IHN1cGVyQ2xhc3NQcm90b3R5cGUuY29uc3RydWN0b3IgYXMgTmV3YWJsZTx1bmtub3duPjtcbiAgICAgICAgaWYgKHN1cGVyQ2xhc3MgPT09IHRoaXMuY2xhenopIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlckNsYXNzO1xuICAgIH1cbiAgICBwcml2YXRlIGdldFN1cGVyQ2xhc3NNZXRhZGF0YSgpOiBDbGFzc01ldGFkYXRhPHVua25vd24+IHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IHN1cGVyQ2xhc3MgPSB0aGlzLmdldFN1cGVyQ2xhc3MoKTtcbiAgICAgICAgaWYgKCFzdXBlckNsYXNzKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQ2xhc3NNZXRhZGF0YS5nZXRJbnN0YW5jZShzdXBlckNsYXNzKTtcbiAgICB9XG4gICAgcmVhZGVyKCk6IENsYXNzTWV0YWRhdGFSZWFkZXI8VD4ge1xuICAgICAgICBjb25zdCBzdXBlclJlYWRlciA9IHRoaXMuZ2V0U3VwZXJDbGFzc01ldGFkYXRhKCk/LnJlYWRlcigpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0Q2xhc3M6ICgpID0+IHRoaXMuY2xhenosXG4gICAgICAgICAgICBnZXRTY29wZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNjb3BlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldENvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZXM6ICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3RvclBhcmFtZXRlclR5cGVzLnNsaWNlKDApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldE1ldGhvZHM6IChsaWZlY3ljbGU6IExpZmVjeWNsZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1cGVyTWV0aG9kcyA9IHN1cGVyUmVhZGVyPy5nZXRNZXRob2RzKGxpZmVjeWNsZSkgfHwgW107XG4gICAgICAgICAgICAgICAgY29uc3QgdGhpc01ldGhvZHMgPSB0aGlzLmdldE1ldGhvZHMobGlmZWN5Y2xlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KHN1cGVyTWV0aG9kcy5jb25jYXQodGhpc01ldGhvZHMpKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0UHJvcGVydHlUeXBlTWFwOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3VwZXJQcm9wZXJ0eVR5cGVNYXAgPSBzdXBlclJlYWRlcj8uZ2V0UHJvcGVydHlUeXBlTWFwKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGhpc1Byb3BlcnR5VHlwZXNNYXAgPSB0aGlzLnByb3BlcnR5VHlwZXNNYXA7XG4gICAgICAgICAgICAgICAgaWYgKCFzdXBlclByb3BlcnR5VHlwZU1hcCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE1hcCh0aGlzUHJvcGVydHlUeXBlc01hcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBNYXAoc3VwZXJQcm9wZXJ0eVR5cGVNYXApO1xuICAgICAgICAgICAgICAgIHRoaXNQcm9wZXJ0eVR5cGVzTWFwLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldEN0b3JNYXJrSW5mbzogKCk6IE1hcmtJbmZvID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyAuLi50aGlzLm1hcmtzLmN0b3IgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRBbGxNYXJrZWRNZW1iZXJzOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3VwZXJNZXRob2RzID0gc3VwZXJSZWFkZXI/LmdldEFsbE1hcmtlZE1lbWJlcnMoKTtcbiAgICAgICAgICAgICAgICBjb25zdCB0aGlzTWVtYmVycyA9IHRoaXMubWFya3MubWVtYmVycy5nZXRNZW1iZXJzKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gc3VwZXJNZXRob2RzID8gbmV3IFNldChzdXBlck1ldGhvZHMpIDogbmV3IFNldDxNZW1iZXJLZXk+KCk7XG4gICAgICAgICAgICAgICAgdGhpc01lbWJlcnMuZm9yRWFjaChpdCA9PiByZXN1bHQuYWRkKGl0KSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRNZW1iZXJzTWFya0luZm86IChrZXk6IEtleU9mPFQ+KTogTWFya0luZm8gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hcmtzLm1lbWJlcnMuZ2V0TWFya0luZm8oa2V5IGFzIE1lbWJlcktleSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0UGFyYW1ldGVyTWFya0luZm86IChtZXRob2RLZXk6IEtleU9mPFQ+KTogUmVjb3JkPG51bWJlciwgTWFya0luZm8+ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXJrcy5wYXJhbXMuZ2V0TWFya0luZm8obWV0aG9kS2V5IGFzIE1lbWJlcktleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgU2VydmljZUZhY3RvcnkgfSBmcm9tICcuLi90eXBlcy9TZXJ2aWNlRmFjdG9yeSc7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5cbmV4cG9ydCBjbGFzcyBTZXJ2aWNlRmFjdG9yeURlZjxUPiB7XG4gICAgc3RhdGljIGNyZWF0ZUZyb21DbGFzc01ldGFkYXRhPFQ+KG1ldGFkYXRhOiBDbGFzc01ldGFkYXRhPFQ+KSB7XG4gICAgICAgIGNvbnN0IGRlZiA9IG5ldyBTZXJ2aWNlRmFjdG9yeURlZihtZXRhZGF0YS5yZWFkZXIoKS5nZXRDbGFzcygpLCB0cnVlKTtcbiAgICAgICAgZGVmLmFwcGVuZCgoY29udGFpbmVyOiBBcHBsaWNhdGlvbkNvbnRleHQsIG93bmVyOiB1bmtub3duKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlYWRlciA9IG1ldGFkYXRhLnJlYWRlcigpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNsYXp6ID0gcmVhZGVyLmdldENsYXNzKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRhaW5lci5nZXRJbnN0YW5jZShjbGF6eiwgb3duZXIpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkZWY7XG4gICAgfVxuICAgIHB1YmxpYyByZWFkb25seSBmYWN0b3JpZXMgPSBuZXcgTWFwPFNlcnZpY2VGYWN0b3J5PFQsIHVua25vd24+LCBJZGVudGlmaWVyW10+KCk7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIGlkZW50aWZpZXIgVGhlIHVuaXF1ZSBpZGVudGlmaWVyIG9mIHRoaXMgZmFjdG9yaWVzXG4gICAgICogQHBhcmFtIGlzU2luZ2xlIEluZGljYXRlcyB3aGV0aGVyIHRoZSBpZGVudGlmaWVyIGRlZmluZXMgb25seSBvbmUgZmFjdG9yeS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgaWRlbnRpZmllcjogSWRlbnRpZmllciwgcHVibGljIHJlYWRvbmx5IGlzU2luZ2xlOiBib29sZWFuKSB7fVxuICAgIGFwcGVuZChmYWN0b3J5OiBTZXJ2aWNlRmFjdG9yeTxULCB1bmtub3duPiwgaW5qZWN0aW9uczogSWRlbnRpZmllcltdID0gW10pIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTaW5nbGUgJiYgdGhpcy5mYWN0b3JpZXMuc2l6ZSA9PT0gMSAmJiAhdGhpcy5mYWN0b3JpZXMuaGFzKGZhY3RvcnkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpcy5pZGVudGlmaWVyLnRvU3RyaW5nKCl9IGlzIEEgc2luZ2xldG9uISBCdXQgbXVsdGlwbGUgZmFjdG9yaWVzIGFyZSBkZWZpbmVkIWApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmFjdG9yaWVzLnNldChmYWN0b3J5LCBpbmplY3Rpb25zKTtcbiAgICB9XG4gICAgcHJvZHVjZShjb250YWluZXI6IEFwcGxpY2F0aW9uQ29udGV4dCwgb3duZXI/OiB1bmtub3duKSB7XG4gICAgICAgIGlmICh0aGlzLmlzU2luZ2xlKSB7XG4gICAgICAgICAgICBjb25zdCBbZmFjdG9yeSwgaW5qZWN0aW9uc10gPSB0aGlzLmZhY3Rvcmllcy5lbnRyaWVzKCkubmV4dCgpLnZhbHVlIGFzIFtTZXJ2aWNlRmFjdG9yeTxULCB1bmtub3duPiwgSWRlbnRpZmllcltdXTtcbiAgICAgICAgICAgIGNvbnN0IGZuID0gZmFjdG9yeShjb250YWluZXIsIG93bmVyKTtcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRhaW5lci5pbnZva2UoZm4sIHtcbiAgICAgICAgICAgICAgICAgICAgaW5qZWN0aW9uc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHByb2R1Y2VycyA9IEFycmF5LmZyb20odGhpcy5mYWN0b3JpZXMpLm1hcCgoW2ZhY3RvcnksIGluamVjdGlvbnNdKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZm4gPSBmYWN0b3J5KGNvbnRhaW5lciwgb3duZXIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXIuaW52b2tlKGZuLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmplY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb2R1Y2Vycy5tYXAoaXQgPT4gaXQoKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgU2VydmljZUZhY3RvcnlEZWYgfSBmcm9tICcuLi9mb3VuZGF0aW9uL1NlcnZpY2VGYWN0b3J5RGVmJztcbmltcG9ydCB7IEZhY3RvcnlJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvRmFjdG9yeUlkZW50aWZpZXInO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgU2VydmljZUZhY3RvcnkgfSBmcm9tICcuLi90eXBlcy9TZXJ2aWNlRmFjdG9yeSc7XG5cbmV4cG9ydCBjbGFzcyBGYWN0b3J5UmVjb3JkZXIge1xuICAgIHByaXZhdGUgZmFjdG9yaWVzID0gbmV3IE1hcDxGYWN0b3J5SWRlbnRpZmllciwgU2VydmljZUZhY3RvcnlEZWY8dW5rbm93bj4+KCk7XG5cbiAgICBwdWJsaWMgYXBwZW5kPFQ+KFxuICAgICAgICBpZGVudGlmaWVyOiBGYWN0b3J5SWRlbnRpZmllcixcbiAgICAgICAgZmFjdG9yeTogU2VydmljZUZhY3Rvcnk8VCwgdW5rbm93bj4sXG4gICAgICAgIGluamVjdGlvbnM6IElkZW50aWZpZXJbXSA9IFtdLFxuICAgICAgICBpc1NpbmdsZTogYm9vbGVhbiA9IHRydWVcbiAgICApIHtcbiAgICAgICAgbGV0IGRlZiA9IHRoaXMuZmFjdG9yaWVzLmdldChpZGVudGlmaWVyKTtcbiAgICAgICAgaWYgKGRlZikge1xuICAgICAgICAgICAgZGVmLmFwcGVuZChmYWN0b3J5LCBpbmplY3Rpb25zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlZiA9IG5ldyBTZXJ2aWNlRmFjdG9yeURlZihpZGVudGlmaWVyLCBpc1NpbmdsZSk7XG4gICAgICAgICAgICBkZWYuYXBwZW5kKGZhY3RvcnksIGluamVjdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmFjdG9yaWVzLnNldChpZGVudGlmaWVyLCBkZWYpO1xuICAgIH1cbiAgICBwdWJsaWMgc2V0KGlkZW50aWZpZXI6IEZhY3RvcnlJZGVudGlmaWVyLCBmYWN0b3J5RGVmOiBTZXJ2aWNlRmFjdG9yeURlZjx1bmtub3duPikge1xuICAgICAgICB0aGlzLmZhY3Rvcmllcy5zZXQoaWRlbnRpZmllciwgZmFjdG9yeURlZik7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQ8VD4oaWRlbnRpZmllcjogRmFjdG9yeUlkZW50aWZpZXIpOiBTZXJ2aWNlRmFjdG9yeURlZjxUPiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLmZhY3Rvcmllcy5nZXQoaWRlbnRpZmllcikgYXMgU2VydmljZUZhY3RvcnlEZWY8VD4gfCB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHB1YmxpYyBpdGVyYXRvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmFjdG9yaWVzLmVudHJpZXMoKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBNZXRhZGF0YSB9IGZyb20gJy4uL3R5cGVzL01ldGFkYXRhJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IFNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi4vdHlwZXMvU2VydmljZUZhY3RvcnknO1xuaW1wb3J0IHsgRmFjdG9yeUlkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9GYWN0b3J5SWRlbnRpZmllcic7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IFNlcnZpY2VGYWN0b3J5RGVmIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9TZXJ2aWNlRmFjdG9yeURlZic7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yJztcbmltcG9ydCB7IEZhY3RvcnlSZWNvcmRlciB9IGZyb20gJy4uL2NvbW1vbi9GYWN0b3J5UmVjb3JkZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIEdsb2JhbE1ldGFkYXRhUmVhZGVyIHtcbiAgICBnZXRDb21wb25lbnRGYWN0b3J5PFQ+KGtleTogRmFjdG9yeUlkZW50aWZpZXIpOiBTZXJ2aWNlRmFjdG9yeURlZjxUPiB8IHVuZGVmaW5lZDtcbiAgICBnZXRDbGFzc01ldGFkYXRhPFQ+KGFsaWFzTmFtZTogc3RyaW5nIHwgc3ltYm9sKTogQ2xhc3NNZXRhZGF0YTxUPiB8IHVuZGVmaW5lZDtcbiAgICBnZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKCk6IEFycmF5PE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4+O1xufVxuZXhwb3J0IGNsYXNzIEdsb2JhbE1ldGFkYXRhIGltcGxlbWVudHMgTWV0YWRhdGE8R2xvYmFsTWV0YWRhdGFSZWFkZXIsIHZvaWQ+IHtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBJTlNUQU5DRSA9IG5ldyBHbG9iYWxNZXRhZGF0YSgpO1xuICAgIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICAgICAgcmV0dXJuIEdsb2JhbE1ldGFkYXRhLklOU1RBTkNFO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0UmVhZGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW5jZSgpLnJlYWRlcigpO1xuICAgIH1cbiAgICBwcml2YXRlIGNsYXNzQWxpYXNNZXRhZGF0YU1hcCA9IG5ldyBNYXA8c3RyaW5nIHwgc3ltYm9sLCBDbGFzc01ldGFkYXRhPHVua25vd24+PigpO1xuICAgIHByaXZhdGUgY29tcG9uZW50RmFjdG9yaWVzID0gbmV3IEZhY3RvcnlSZWNvcmRlcigpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcHJvY2Vzc29yQ2xhc3NlczogU2V0PE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4+ID0gbmV3IFNldCgpO1xuICAgIHJlY29yZEZhY3Rvcnk8VD4oXG4gICAgICAgIHN5bWJvbDogRmFjdG9yeUlkZW50aWZpZXIsXG4gICAgICAgIGZhY3Rvcnk6IFNlcnZpY2VGYWN0b3J5PFQsIHVua25vd24+LFxuICAgICAgICBpbmplY3Rpb25zOiBJZGVudGlmaWVyW10gPSBbXSxcbiAgICAgICAgaXNTaW5nbGU6IGJvb2xlYW4gPSB0cnVlXG4gICAgKSB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50RmFjdG9yaWVzLmFwcGVuZChzeW1ib2wsIGZhY3RvcnksIGluamVjdGlvbnMsIGlzU2luZ2xlKTtcbiAgICB9XG4gICAgcmVjb3JkQ2xhc3NBbGlhczxUPihhbGlhc05hbWU6IHN0cmluZyB8IHN5bWJvbCwgbWV0YWRhdGE6IENsYXNzTWV0YWRhdGE8VD4pIHtcbiAgICAgICAgdGhpcy5jbGFzc0FsaWFzTWV0YWRhdGFNYXAuc2V0KGFsaWFzTmFtZSwgbWV0YWRhdGEpO1xuICAgIH1cbiAgICByZWNvcmRQcm9jZXNzb3JDbGFzcyhjbGF6ejogTmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPikge1xuICAgICAgICB0aGlzLnByb2Nlc3NvckNsYXNzZXMuYWRkKGNsYXp6KTtcbiAgICB9XG4gICAgaW5pdCgpIHtcbiAgICAgICAgLy8gUEFTUztcbiAgICB9XG4gICAgcmVhZGVyKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0Q29tcG9uZW50RmFjdG9yeTogPFQ+KGtleTogRmFjdG9yeUlkZW50aWZpZXIpOiBTZXJ2aWNlRmFjdG9yeURlZjxUPiB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50RmFjdG9yaWVzLmdldChrZXkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldENsYXNzTWV0YWRhdGE6IDxUPihhbGlhc05hbWU6IHN0cmluZyB8IHN5bWJvbCk6IENsYXNzTWV0YWRhdGE8VD4gfCB1bmRlZmluZWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNsYXNzQWxpYXNNZXRhZGF0YU1hcC5nZXQoYWxpYXNOYW1lKSBhcyBDbGFzc01ldGFkYXRhPFQ+IHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXM6ICgpOiBBcnJheTxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+PiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5wcm9jZXNzb3JDbGFzc2VzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJleHBvcnQgaW50ZXJmYWNlIEV2YWx1YXRpb25PcHRpb25zPE8sIEUgZXh0ZW5kcyBzdHJpbmcsIEEgPSB1bmtub3duPiB7XG4gICAgdHlwZTogRTtcbiAgICBvd25lcj86IE87XG4gICAgcHJvcGVydHlOYW1lPzogc3RyaW5nIHwgc3ltYm9sO1xuICAgIGV4dGVybmFsQXJncz86IEE7XG59XG5cbmV4cG9ydCBlbnVtIEV4cHJlc3Npb25UeXBlIHtcbiAgICBFTlYgPSAnaW5qZWN0LWVudmlyb25tZW50LXZhcmlhYmxlcycsXG4gICAgSlNPTl9QQVRIID0gJ2luamVjdC1qc29uLWRhdGEnLFxuICAgIEFSR1YgPSAnaW5qZWN0LWFyZ3YnXG59XG4iLCJleHBvcnQgY29uc3QgaXNOb2RlSnMgPSAoKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBwcm9jZXNzLnZlcnNpb25zLm5vZGUgIT09IG51bGw7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufSkoKTtcbiIsImltcG9ydCB7IENsYXNzTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBFeHByZXNzaW9uVHlwZSB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRlT3B0aW9ucyc7XG5pbXBvcnQgeyBpc05vZGVKcyB9IGZyb20gJy4uL2NvbW1vbi9pc05vZGVKcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBWYWx1ZTxBID0gdW5rbm93bj4oZXhwcmVzc2lvbjogc3RyaW5nLCB0eXBlOiBFeHByZXNzaW9uVHlwZSB8IHN0cmluZywgZXh0ZXJuYWxBcmdzPzogQSk6IFByb3BlcnR5RGVjb3JhdG9yIHtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSBFeHByZXNzaW9uVHlwZS5FTlY6XG4gICAgICAgIGNhc2UgRXhwcmVzc2lvblR5cGUuQVJHVjpcbiAgICAgICAgICAgIGlmICghaXNOb2RlSnMpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBcIiR7dHlwZX1cIiBldmFsdWF0b3Igb25seSBzdXBwb3J0cyBub2RlanMgZW52aXJvbm1lbnQhYCk7XG4gICAgICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAodGFyZ2V0OiBPYmplY3QsIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wpID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQuY29uc3RydWN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBjb25zdCB2YWx1ZV9zeW1ib2wgPSBTeW1ib2woJycpO1xuICAgICAgICBtZXRhZGF0YS5yZWNvcmRQcm9wZXJ0eVR5cGUocHJvcGVydHlLZXksIHZhbHVlX3N5bWJvbCk7XG4gICAgICAgIEdsb2JhbE1ldGFkYXRhLmdldEluc3RhbmNlKCkucmVjb3JkRmFjdG9yeSh2YWx1ZV9zeW1ib2wsIChjb250YWluZXIsIG93bmVyKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT5cbiAgICAgICAgICAgICAgICBjb250YWluZXIuZXZhbHVhdGU8c3RyaW5nLCB0eXBlb2Ygb3duZXIsIEE+KGV4cHJlc3Npb24gYXMgc3RyaW5nLCB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyLFxuICAgICAgICAgICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgICAgICAgICBleHRlcm5hbEFyZ3NcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IFZhbHVlIH0gZnJvbSAnLi9WYWx1ZSc7XG5pbXBvcnQgeyBFeHByZXNzaW9uVHlwZSB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRlT3B0aW9ucyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBBcmd2KG5hbWU6IHN0cmluZywgYXJndjogc3RyaW5nW10gPSBwcm9jZXNzLmFyZ3YpIHtcbiAgICByZXR1cm4gVmFsdWUobmFtZSwgRXhwcmVzc2lvblR5cGUuQVJHViwgYXJndik7XG59XG4iLCJpbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0dsb2JhbE1ldGFkYXRhJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gQWxpYXMoYWxpYXNOYW1lOiBzdHJpbmcgfCBzeW1ib2wpOiBDbGFzc0RlY29yYXRvciB7XG4gICAgcmV0dXJuIDxURnVuY3Rpb24gZXh0ZW5kcyBGdW5jdGlvbj4odGFyZ2V0OiBURnVuY3Rpb24pID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQgYXMgdW5rbm93biBhcyBOZXdhYmxlPHVua25vd24+LCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWNvcmRDbGFzc0FsaWFzKGFsaWFzTmFtZSwgbWV0YWRhdGEpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBBbGlhcyB9IGZyb20gJy4vQWxpYXMnO1xuLyoqXG4gKiBAZGVwcmVjYXRlZCB1c2UgQEFsaWFzIGluc3RlYWRcbiAqIEBwYXJhbSBhbGlhc05hbWVcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBCaW5kKGFsaWFzTmFtZTogc3RyaW5nIHwgc3ltYm9sKTogQ2xhc3NEZWNvcmF0b3Ige1xuICAgIHJldHVybiBBbGlhcyhhbGlhc05hbWUpO1xufVxuIiwiaW1wb3J0IHsgVmFsdWUgfSBmcm9tICcuL1ZhbHVlJztcbmltcG9ydCB7IEV4cHJlc3Npb25UeXBlIH0gZnJvbSAnLi4vdHlwZXMvRXZhbHVhdGVPcHRpb25zJztcblxuZXhwb3J0IGZ1bmN0aW9uIEVudihuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gVmFsdWUobmFtZSwgRXhwcmVzc2lvblR5cGUuRU5WKTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBpc051bGwodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyBudWxsIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IG51bGw7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsdWU6IHVua25vd24pOiB2YWx1ZSBpcyB1bmRlZmluZWQge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzTm90RGVmaW5lZDxUPih2YWx1ZTogVCB8IHVuZGVmaW5lZCB8IG51bGwpOiB2YWx1ZSBpcyB1bmRlZmluZWQgfCBudWxsIHtcbiAgICByZXR1cm4gaXNOdWxsKHZhbHVlKSB8fCBpc1VuZGVmaW5lZCh2YWx1ZSk7XG59XG4iLCJpbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0dsb2JhbE1ldGFkYXRhJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEZhY3RvcnlJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvRmFjdG9yeUlkZW50aWZpZXInO1xuaW1wb3J0IHsgSW5zdGFuY2UgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZSc7XG5pbXBvcnQgeyBpc05vdERlZmluZWQgfSBmcm9tICcuLi9jb21tb24vaXNOb3REZWZpbmVkJztcblxuZXhwb3J0IGZ1bmN0aW9uIEZhY3RvcnkocHJvZHVjZUlkZW50aWZpZXI/OiBGYWN0b3J5SWRlbnRpZmllciwgaXNTaW5nbGU6IGJvb2xlYW4gPSB0cnVlKTogTWV0aG9kRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gKHRhcmdldDogT2JqZWN0LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sKSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKTtcbiAgICAgICAgY29uc3QgY2xhenogPSB0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTxJbnN0YW5jZTx1bmtub3duPj47XG5cbiAgICAgICAgaWYgKGlzTm90RGVmaW5lZChwcm9kdWNlSWRlbnRpZmllcikpIHtcbiAgICAgICAgICAgIHByb2R1Y2VJZGVudGlmaWVyID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnZGVzaWduOnJldHVybnR5cGUnLCB0YXJnZXQsIHByb3BlcnR5S2V5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNOb3REZWZpbmVkKHByb2R1Y2VJZGVudGlmaWVyKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgcmV0dXJuIHR5cGUgbm90IHJlY29nbml6ZWQsIGNhbm5vdCBwZXJmb3JtIGluc3RhbmNlIGNyZWF0aW9uIScpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGluamVjdGlvbnMgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdkZXNpZ246cGFyYW10eXBlcycsIHRhcmdldCwgcHJvcGVydHlLZXkpO1xuXG4gICAgICAgIG1ldGFkYXRhLnJlY29yZEZhY3RvcnkoXG4gICAgICAgICAgICBwcm9kdWNlSWRlbnRpZmllcixcbiAgICAgICAgICAgIChjb250YWluZXIsIG93bmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBjb250YWluZXIuZ2V0SW5zdGFuY2UoY2xhenosIG93bmVyKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmdW5jID0gaW5zdGFuY2VbcHJvcGVydHlLZXldO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZnVuYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gY29udGFpbmVyLmdldEluc3RhbmNlKGNsYXp6KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jLmFwcGx5KGluc3RhbmNlLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4gZnVuYztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5qZWN0aW9ucyxcbiAgICAgICAgICAgIGlzU2luZ2xlXG4gICAgICAgICk7XG4gICAgfTtcbn1cbiIsImltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YSB9IGZyb20gJy4uL3R5cGVzL01ldGFkYXRhJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luc3RhbmNlU2NvcGUnO1xuXG5leHBvcnQgY29uc3QgRlVOQ1RJT05fTUVUQURBVEFfS0VZID0gU3ltYm9sKCdpb2M6ZnVuY3Rpb24tbWV0YWRhdGEnKTtcblxuZXhwb3J0IGludGVyZmFjZSBGdW5jdGlvbk1ldGFkYXRhUmVhZGVyIHtcbiAgICBnZXRQYXJhbWV0ZXJzKCk6IElkZW50aWZpZXJbXTtcbiAgICBpc0ZhY3RvcnkoKTogYm9vbGVhbjtcbiAgICBnZXRTY29wZSgpOiBJbnN0YW5jZVNjb3BlIHwgdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgY2xhc3MgRnVuY3Rpb25NZXRhZGF0YSBpbXBsZW1lbnRzIE1ldGFkYXRhPEZ1bmN0aW9uTWV0YWRhdGFSZWFkZXIsIEZ1bmN0aW9uPiB7XG4gICAgc3RhdGljIGdldFJlZmxlY3RLZXkoKSB7XG4gICAgICAgIHJldHVybiBGVU5DVElPTl9NRVRBREFUQV9LRVk7XG4gICAgfVxuICAgIHByaXZhdGUgcmVhZG9ubHkgcGFyYW1ldGVyczogSWRlbnRpZmllcltdID0gW107XG4gICAgcHJpdmF0ZSBzY29wZT86IEluc3RhbmNlU2NvcGU7XG4gICAgcHJpdmF0ZSBpc0ZhY3Rvcnk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBzZXRQYXJhbWV0ZXJUeXBlKGluZGV4OiBudW1iZXIsIHN5bWJvbDogSWRlbnRpZmllcikge1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnNbaW5kZXhdID0gc3ltYm9sO1xuICAgIH1cbiAgICBzZXRTY29wZShzY29wZTogSW5zdGFuY2VTY29wZSkge1xuICAgICAgICB0aGlzLnNjb3BlID0gc2NvcGU7XG4gICAgfVxuICAgIHNldElzRmFjdG9yeShpc0ZhY3Rvcnk6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5pc0ZhY3RvcnkgPSBpc0ZhY3Rvcnk7XG4gICAgfVxuICAgIGluaXQoKSB7XG4gICAgICAgIC8vIFBBU1M7XG4gICAgfVxuICAgIHJlYWRlcigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldFBhcmFtZXRlcnM6ICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJhbWV0ZXJzLnNsaWNlKDApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzRmFjdG9yeTogKCkgPT4gdGhpcy5pc0ZhY3RvcnksXG4gICAgICAgICAgICBnZXRTY29wZTogKCkgPT4gdGhpcy5zY29wZVxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4uL2ZvdW5kYXRpb24nO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSwgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcblxuZXhwb3J0IGZ1bmN0aW9uIEdlbmVyYXRlPFQsIFY+KGdlbmVyYXRvcjogKHRoaXM6IFQsIGFwcEN0eDogQXBwbGljYXRpb25Db250ZXh0KSA9PiBWKTogUHJvcGVydHlEZWNvcmF0b3Ige1xuICAgIHJldHVybiAodGFyZ2V0OiBPYmplY3QsIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wpID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQuY29uc3RydWN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBjb25zdCB2YWx1ZV9zeW1ib2wgPSBTeW1ib2woJycpO1xuICAgICAgICBtZXRhZGF0YS5yZWNvcmRQcm9wZXJ0eVR5cGUocHJvcGVydHlLZXksIHZhbHVlX3N5bWJvbCk7XG4gICAgICAgIEdsb2JhbE1ldGFkYXRhLmdldEluc3RhbmNlKCkucmVjb3JkRmFjdG9yeSh2YWx1ZV9zeW1ib2wsIChjb250YWluZXIsIG93bmVyKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4gZ2VuZXJhdG9yLmNhbGwob3duZXIgYXMgVCwgY29udGFpbmVyKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgaXNOb3REZWZpbmVkIH0gZnJvbSAnLi4vY29tbW9uL2lzTm90RGVmaW5lZCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBJbmplY3Q8VD4oY29uc3RyPzogSWRlbnRpZmllcjxUPikge1xuICAgIHJldHVybiBmdW5jdGlvbiA8VGFyZ2V0Pih0YXJnZXQ6IFRhcmdldCwgcHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCwgcGFyYW1ldGVySW5kZXg/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHBhcmFtZXRlckluZGV4ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgLy8gY29uc3RydWN0b3IgcGFyYW1ldGVyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRDb25zdHIgPSB0YXJnZXQgYXMgTmV3YWJsZTxUPjtcbiAgICAgICAgICAgIGlmIChpc05vdERlZmluZWQoY29uc3RyKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0ciA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ2Rlc2lnbjpwYXJhbXR5cGVzJywgdGFyZ2V0LCBwcm9wZXJ0eUtleSlbcGFyYW1ldGVySW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzTm90RGVmaW5lZChjb25zdHIpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUeXBlIG5vdCByZWNvZ25pemVkLCBpbmplY3Rpb24gY2Fubm90IGJlIHBlcmZvcm1lZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY2xhc3NNZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldENvbnN0ciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBjbGFzc01ldGFkYXRhLnNldENvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZShwYXJhbWV0ZXJJbmRleCwgY29uc3RyKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnb2JqZWN0JyAmJiB0YXJnZXQgIT09IG51bGwgJiYgcHJvcGVydHlLZXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gcHJvcGVydHlcbiAgICAgICAgICAgIGlmIChpc05vdERlZmluZWQoY29uc3RyKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0ciA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ2Rlc2lnbjp0eXBlJywgdGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNOb3REZWZpbmVkKGNvbnN0cikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1R5cGUgbm90IHJlY29nbml6ZWQsIGluamVjdGlvbiBjYW5ub3QgYmUgcGVyZm9ybWVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldC5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBtZXRhZGF0YS5yZWNvcmRQcm9wZXJ0eVR5cGUocHJvcGVydHlLZXksIGNvbnN0cik7XG4gICAgICAgIH1cbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YSc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgSW5zdGFuY2UgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW5qZWN0YWJsZU9wdGlvbnMge1xuICAgIHByb2R1Y2U6IHN0cmluZyB8IHN5bWJvbCB8IEFycmF5PHN0cmluZyB8IHN5bWJvbD47XG59XG5cbi8qKlxuICogVGhpcyBkZWNvcmF0b3IgaXMgdHlwaWNhbGx5IHVzZWQgdG8gaWRlbnRpZnkgY2xhc3NlcyB0aGF0IG5lZWQgdG8gYmUgY29uZmlndXJlZCB3aXRoaW4gdGhlIElvQyBjb250YWluZXIuXG4gKiBJbiBtb3N0IGNhc2VzLCBASW5qZWN0YWJsZSBjYW4gYmUgb21pdHRlZCB1bmxlc3MgZXhwbGljaXQgY29uZmlndXJhdGlvbiBpcyByZXF1aXJlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEluamVjdGFibGUob3B0aW9ucz86IEluamVjdGFibGVPcHRpb25zKTogQ2xhc3NEZWNvcmF0b3Ige1xuICAgIHJldHVybiA8VEZ1bmN0aW9uIGV4dGVuZHMgRnVuY3Rpb24+KHRhcmdldDogVEZ1bmN0aW9uKTogVEZ1bmN0aW9uIHwgdm9pZCA9PiB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucz8ucHJvZHVjZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpO1xuICAgICAgICBjb25zdCBwcm9kdWNlcyA9IEFycmF5LmlzQXJyYXkob3B0aW9ucy5wcm9kdWNlKSA/IG9wdGlvbnMucHJvZHVjZSA6IFtvcHRpb25zLnByb2R1Y2VdO1xuICAgICAgICBwcm9kdWNlcy5mb3JFYWNoKHByb2R1Y2UgPT4ge1xuICAgICAgICAgICAgbWV0YWRhdGEucmVjb3JkRmFjdG9yeShcbiAgICAgICAgICAgICAgICBwcm9kdWNlLFxuICAgICAgICAgICAgICAgIChjb250YWluZXIsIG93bmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGNvbnRhaW5lci5nZXRJbnN0YW5jZSh0YXJnZXQgYXMgdW5rbm93biBhcyBOZXdhYmxlPEluc3RhbmNlPHVua25vd24+Piwgb3duZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgW10sXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yJztcbmltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuXG5leHBvcnQgZnVuY3Rpb24gSW5zdEF3YXJlUHJvY2Vzc29yKCkge1xuICAgIHJldHVybiBmdW5jdGlvbiA8Q2xzIGV4dGVuZHMgTmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPj4odGFyZ2V0OiBDbHMpIHtcbiAgICAgICAgR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWNvcmRQcm9jZXNzb3JDbGFzcyh0YXJnZXQpO1xuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBWYWx1ZSB9IGZyb20gJy4vVmFsdWUnO1xuaW1wb3J0IHsgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gSlNPTkRhdGEobmFtZXNwYWNlOiBzdHJpbmcsIGpzb25wYXRoOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gVmFsdWUoYCR7bmFtZXNwYWNlfToke2pzb25wYXRofWAsIEV4cHJlc3Npb25UeXBlLkpTT05fUEFUSCk7XG59XG4iLCJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9MaWZlY3ljbGUnO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5cbi8qKlxuICogVXJuIGNhbGxzIHRoZSBtZXRob2RzIGFubm90YXRlZCB3aXRoIEBQb3N0SW5qZWN0IG9ubHkgb25jZSwganVzdCBhZnRlciB0aGUgaW5qZWN0aW9uIG9mIHByb3BlcnRpZXMuXG4gKiBAYW5ub3RhdGlvblxuICovXG5leHBvcnQgY29uc3QgTGlmZWN5Y2xlRGVjb3JhdG9yID0gKGxpZmVjeWNsZTogTGlmZWN5Y2xlKTogTWV0aG9kRGVjb3JhdG9yID0+IHtcbiAgICByZXR1cm4gKHRhcmdldDogT2JqZWN0LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sKSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGFyZ2V0LmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgbWV0YWRhdGEuYWRkTGlmZWN5Y2xlTWV0aG9kKHByb3BlcnR5S2V5LCBsaWZlY3ljbGUpO1xuICAgIH07XG59O1xuIiwiaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuXG5leHBvcnQgZnVuY3Rpb24gTWFyayhrZXk6IHN0cmluZyB8IHN5bWJvbCwgdmFsdWU6IHVua25vd24gPSB0cnVlKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiBmdW5jdGlvbiAoXG4gICAgICAgIC4uLmFyZ3M6XG4gICAgICAgICAgICB8IFBhcmFtZXRlcnM8Q2xhc3NEZWNvcmF0b3I+XG4gICAgICAgICAgICB8IFBhcmFtZXRlcnM8TWV0aG9kRGVjb3JhdG9yPlxuICAgICAgICAgICAgfCBQYXJhbWV0ZXJzPFByb3BlcnR5RGVjb3JhdG9yPlxuICAgICAgICAgICAgfCBQYXJhbWV0ZXJzPFBhcmFtZXRlckRlY29yYXRvcj5cbiAgICApIHtcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAvLyBjbGFzcyBkZWNvcmF0b3JcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoYXJnc1swXSwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBtZXRhZGF0YS5tYXJrZXIoKS5jdG9yKGtleSwgdmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZ3MubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAvLyBwcm9wZXJ0eSBkZWNvcmF0b3JcbiAgICAgICAgICAgIGNvbnN0IFtwcm90b3R5cGUsIHByb3BlcnR5S2V5XSA9IGFyZ3M7XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHByb3RvdHlwZS5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBtZXRhZGF0YS5tYXJrZXIoKS5tZW1iZXIocHJvcGVydHlLZXkpLm1hcmsoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJncy5sZW5ndGggPT09IDMgJiYgdHlwZW9mIGFyZ3NbMl0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAvLyBwYXJhbWV0ZXIgZGVjb3JhdG9yXG4gICAgICAgICAgICBjb25zdCBbcHJvdG90eXBlLCBwcm9wZXJ0eUtleSwgaW5kZXhdID0gYXJncyBhcyBbT2JqZWN0LCBzdHJpbmcgfCBzeW1ib2wsIG51bWJlcl07XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHByb3RvdHlwZS5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBtZXRhZGF0YS5tYXJrZXIoKS5wYXJhbWV0ZXIocHJvcGVydHlLZXksIGluZGV4KS5tYXJrKGtleSwgdmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gbWV0aG9kIGRlY29yYXRvclxuICAgICAgICAgICAgY29uc3QgW3Byb3RvdHlwZSwgcHJvcGVydHlLZXldID0gYXJncyBhcyBQYXJhbWV0ZXJzPE1ldGhvZERlY29yYXRvcj47XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHByb3RvdHlwZS5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBtZXRhZGF0YS5tYXJrZXIoKS5tZW1iZXIocHJvcGVydHlLZXkpLm1hcmsoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuIiwiZXhwb3J0IGVudW0gTGlmZWN5Y2xlIHtcbiAgICBQUkVfSU5KRUNUID0gJ2lvYy1zY29wZTpwcmUtaW5qZWN0JyxcbiAgICBQT1NUX0lOSkVDVCA9ICdpb2Mtc2NvcGU6cG9zdC1pbmplY3QnLFxuICAgIFBSRV9ERVNUUk9ZID0gJ2lvYy1zY29wZTpwcmUtZGVzdHJveSdcbn1cbiIsImltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBMaWZlY3ljbGVEZWNvcmF0b3IgfSBmcm9tICcuL0xpZmVjeWNsZURlY29yYXRvcic7XG5cbi8qKlxuICogVXJuIGNhbGxzIHRoZSBtZXRob2RzIGFubm90YXRlZCB3aXRoIEBQb3N0SW5qZWN0IG9ubHkgb25jZSwganVzdCBhZnRlciB0aGUgaW5qZWN0aW9uIG9mIHByb3BlcnRpZXMuXG4gKiBAYW5ub3RhdGlvblxuICovXG5leHBvcnQgY29uc3QgUG9zdEluamVjdCA9ICgpOiBNZXRob2REZWNvcmF0b3IgPT4gTGlmZWN5Y2xlRGVjb3JhdG9yKExpZmVjeWNsZS5QT1NUX0lOSkVDVCk7XG4iLCJpbXBvcnQgeyBMaWZlY3ljbGVEZWNvcmF0b3IgfSBmcm9tICcuL0xpZmVjeWNsZURlY29yYXRvcic7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5cbmV4cG9ydCBjb25zdCBQcmVEZXN0cm95ID0gKCkgPT4gTGlmZWN5Y2xlRGVjb3JhdG9yKExpZmVjeWNsZS5QUkVfREVTVFJPWSk7XG4iLCJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9MaWZlY3ljbGUnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlRGVjb3JhdG9yIH0gZnJvbSAnLi9MaWZlY3ljbGVEZWNvcmF0b3InO1xuXG4vKipcbiAqIFVybiBjYWxscyB0aGUgbWV0aG9kcyBhbm5vdGF0ZWQgd2l0aCBAUG9zdEluamVjdCBvbmx5IG9uY2UsIGp1c3QgYWZ0ZXIgdGhlIGluamVjdGlvbiBvZiBwcm9wZXJ0aWVzLlxuICogQGFubm90YXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IFByZUluamVjdCA9ICgpOiBNZXRob2REZWNvcmF0b3IgPT4gTGlmZWN5Y2xlRGVjb3JhdG9yKExpZmVjeWNsZS5QUkVfSU5KRUNUKTtcbiIsImltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luc3RhbmNlU2NvcGUnO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBTY29wZShzY29wZTogSW5zdGFuY2VTY29wZSB8IHN0cmluZyk6IENsYXNzRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gPFRGdW5jdGlvbiBleHRlbmRzIEZ1bmN0aW9uPih0YXJnZXQ6IFRGdW5jdGlvbikgPT4ge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldCBhcyB1bmtub3duIGFzIE5ld2FibGU8dW5rbm93bj4sIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBtZXRhZGF0YS5zZXRTY29wZShzY29wZSk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IEFueUZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMvQW55RnVuY3Rpb24nO1xuXG5leHBvcnQgdHlwZSBFdmVudExpc3RlbmVyID0gQW55RnVuY3Rpb247XG5leHBvcnQgY2xhc3MgRXZlbnRFbWl0dGVyIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGV2ZW50cyA9IG5ldyBNYXA8c3RyaW5nIHwgc3ltYm9sLCBFdmVudExpc3RlbmVyW10+KCk7XG5cbiAgICBvbih0eXBlOiBzdHJpbmcgfCBzeW1ib2wsIGxpc3RlbmVyOiBFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLmV2ZW50cy5nZXQodHlwZSk7XG4gICAgICAgIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcikgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMgPSBbbGlzdGVuZXJdO1xuICAgICAgICAgICAgdGhpcy5ldmVudHMuc2V0KHR5cGUsIGxpc3RlbmVycyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxzID0gbGlzdGVuZXJzIGFzIEV2ZW50TGlzdGVuZXJbXTtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gbHMuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIGxzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIGVtaXQodHlwZTogc3RyaW5nIHwgc3ltYm9sLCAuLi5hcmdzOiB1bmtub3duW10pIHtcbiAgICAgICAgdGhpcy5ldmVudHMuZ2V0KHR5cGUpPy5mb3JFYWNoKGZuID0+IHtcbiAgICAgICAgICAgIGZuKC4uLmFyZ3MpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5cbnR5cGUgSW52b2tlRnVuY3Rpb25BcmdzID0ge1xuICAgIGFyZ3M/OiB1bmtub3duW107XG59O1xudHlwZSBJbnZva2VGdW5jdGlvbkluamVjdGlvbnMgPSB7XG4gICAgaW5qZWN0aW9uczogSWRlbnRpZmllcltdO1xufTtcblxudHlwZSBJbnZva2VGdW5jdGlvbkJhc2ljT3B0aW9uczxUPiA9IHtcbiAgICBjb250ZXh0PzogVDtcbn07XG5cbmV4cG9ydCB0eXBlIEludm9rZUZ1bmN0aW9uT3B0aW9uczxUPiA9XG4gICAgfCAoSW52b2tlRnVuY3Rpb25CYXNpY09wdGlvbnM8VD4gJiBJbnZva2VGdW5jdGlvbkFyZ3MpXG4gICAgfCAoSW52b2tlRnVuY3Rpb25CYXNpY09wdGlvbnM8VD4gJiBQYXJ0aWFsPEludm9rZUZ1bmN0aW9uSW5qZWN0aW9ucz4pO1xuXG5leHBvcnQgZnVuY3Rpb24gaGFzQXJnczxUPihvcHRpb25zOiBJbnZva2VGdW5jdGlvbk9wdGlvbnM8VD4pOiBvcHRpb25zIGlzIEludm9rZUZ1bmN0aW9uQmFzaWNPcHRpb25zPFQ+ICYgSW52b2tlRnVuY3Rpb25BcmdzIHtcbiAgICByZXR1cm4gJ2FyZ3MnIGluIG9wdGlvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNJbmplY3Rpb25zPFQ+KFxuICAgIG9wdGlvbnM6IEludm9rZUZ1bmN0aW9uT3B0aW9uczxUPlxuKTogb3B0aW9ucyBpcyBJbnZva2VGdW5jdGlvbkJhc2ljT3B0aW9uczxUPiAmIEludm9rZUZ1bmN0aW9uSW5qZWN0aW9ucyB7XG4gICAgcmV0dXJuICdpbmplY3Rpb25zJyBpbiBvcHRpb25zO1xufVxuIiwiaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSwgQ2xhc3NNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlJztcbmltcG9ydCB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4vQXBwbGljYXRpb25Db250ZXh0JztcblxuZXhwb3J0IGNsYXNzIExpZmVjeWNsZU1hbmFnZXI8VCA9IHVua25vd24+IHtcbiAgICBwcml2YXRlIGNsYXNzTWV0YWRhdGFSZWFkZXI6IENsYXNzTWV0YWRhdGFSZWFkZXI8VD47XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjb21wb25lbnRDbGFzczogTmV3YWJsZTxUPiwgcHJpdmF0ZSByZWFkb25seSBjb250YWluZXI6IEFwcGxpY2F0aW9uQ29udGV4dCkge1xuICAgICAgICB0aGlzLmNsYXNzTWV0YWRhdGFSZWFkZXIgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0aGlzLmNvbXBvbmVudENsYXNzLCBDbGFzc01ldGFkYXRhKS5yZWFkZXIoKTtcbiAgICB9XG4gICAgaW52b2tlUHJlSW5qZWN0TWV0aG9kKGluc3RhbmNlOiBJbnN0YW5jZTxUPikge1xuICAgICAgICBjb25zdCBtZXRob2RzID0gdGhpcy5jbGFzc01ldGFkYXRhUmVhZGVyLmdldE1ldGhvZHMoTGlmZWN5Y2xlLlBSRV9JTkpFQ1QpO1xuICAgICAgICB0aGlzLmludm9rZUxpZmVjeWNsZU1ldGhvZHMoaW5zdGFuY2UsIG1ldGhvZHMpO1xuICAgIH1cbiAgICBpbnZva2VQb3N0SW5qZWN0TWV0aG9kKGluc3RhbmNlOiBJbnN0YW5jZTxUPikge1xuICAgICAgICBjb25zdCBtZXRob2RzID0gdGhpcy5jbGFzc01ldGFkYXRhUmVhZGVyLmdldE1ldGhvZHMoTGlmZWN5Y2xlLlBPU1RfSU5KRUNUKTtcbiAgICAgICAgdGhpcy5pbnZva2VMaWZlY3ljbGVNZXRob2RzKGluc3RhbmNlLCBtZXRob2RzKTtcbiAgICB9XG4gICAgaW52b2tlUHJlRGVzdHJveUluamVjdE1ldGhvZChpbnN0YW5jZTogSW5zdGFuY2U8VD4pIHtcbiAgICAgICAgY29uc3QgbWV0aG9kcyA9IHRoaXMuY2xhc3NNZXRhZGF0YVJlYWRlci5nZXRNZXRob2RzKExpZmVjeWNsZS5QUkVfREVTVFJPWSk7XG4gICAgICAgIHRoaXMuaW52b2tlTGlmZWN5Y2xlTWV0aG9kcyhpbnN0YW5jZSwgbWV0aG9kcyk7XG4gICAgfVxuICAgIHByaXZhdGUgaW52b2tlTGlmZWN5Y2xlTWV0aG9kcyhpbnN0YW5jZTogSW5zdGFuY2U8VD4sIG1ldGhvZEtleXM6IEFycmF5PHN0cmluZyB8IHN5bWJvbD4pIHtcbiAgICAgICAgbWV0aG9kS2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnZva2UoaW5zdGFuY2Vba2V5XSwge1xuICAgICAgICAgICAgICAgIGNvbnRleHQ6IGluc3RhbmNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSwgQ2xhc3NNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHsgSW5zdGFuY2UgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZSc7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeURlZiB9IGZyb20gJy4vU2VydmljZUZhY3RvcnlEZWYnO1xuaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9HbG9iYWxNZXRhZGF0YSc7XG5pbXBvcnQgeyBsYXp5UHJvcCB9IGZyb20gJ0B2Z2VyYm90L2xhenknO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyIH0gZnJvbSAnLi9JbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyJztcbmltcG9ydCB7IExpZmVjeWNsZU1hbmFnZXIgfSBmcm9tICcuL0xpZmVjeWNsZU1hbmFnZXInO1xuaW1wb3J0IHsgRmFjdG9yeVJlY29yZGVyIH0gZnJvbSAnLi4vY29tbW9uL0ZhY3RvcnlSZWNvcmRlcic7XG5pbXBvcnQgeyBBbnlGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzL0FueUZ1bmN0aW9uJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IFNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi4vdHlwZXMvU2VydmljZUZhY3RvcnknO1xuXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyPFQ+IHtcbiAgICBwcml2YXRlIGdldENvbnN0cnVjdG9yQXJnczogKCkgPT4gdW5rbm93bltdID0gKCkgPT4gW107XG4gICAgcHJpdmF0ZSByZWFkb25seSBwcm9wZXJ0eUZhY3RvcmllcyA9IG5ldyBGYWN0b3J5UmVjb3JkZXIoKTtcbiAgICBwcml2YXRlIGxhenlNb2RlOiBib29sZWFuID0gdHJ1ZTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxpZmVjeWNsZVJlc29sdmVyOiBMaWZlY3ljbGVNYW5hZ2VyPFQ+O1xuICAgIHByaXZhdGUgcmVhZG9ubHkgY2xhc3NNZXRhZGF0YVJlYWRlcjogQ2xhc3NNZXRhZGF0YVJlYWRlcjxUPjtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBjb21wb25lbnRDbGFzczogTmV3YWJsZTxUPixcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBjb250YWluZXI6IEFwcGxpY2F0aW9uQ29udGV4dCxcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBpbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyOiBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyXG4gICAgKSB7XG4gICAgICAgIHRoaXMubGlmZWN5Y2xlUmVzb2x2ZXIgPSBuZXcgTGlmZWN5Y2xlTWFuYWdlcjxUPihjb21wb25lbnRDbGFzcywgY29udGFpbmVyKTtcbiAgICAgICAgY29uc3QgcmVhZGVyID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoY29tcG9uZW50Q2xhc3MsIENsYXNzTWV0YWRhdGEpLnJlYWRlcigpO1xuICAgICAgICB0aGlzLmNsYXNzTWV0YWRhdGFSZWFkZXIgPSByZWFkZXI7XG4gICAgICAgIHRoaXMuYXBwZW5kQ2xhc3NNZXRhZGF0YShyZWFkZXIpO1xuICAgIH1cbiAgICBhcHBlbmRMYXp5TW9kZShsYXp5TW9kZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLmxhenlNb2RlID0gbGF6eU1vZGU7XG4gICAgfVxuICAgIHByaXZhdGUgYXBwZW5kQ2xhc3NNZXRhZGF0YTxUPihjbGFzc01ldGFkYXRhUmVhZGVyOiBDbGFzc01ldGFkYXRhUmVhZGVyPFQ+KSB7XG4gICAgICAgIGNvbnN0IHR5cGVzID0gY2xhc3NNZXRhZGF0YVJlYWRlci5nZXRDb25zdHJ1Y3RvclBhcmFtZXRlclR5cGVzKCk7XG4gICAgICAgIHRoaXMuZ2V0Q29uc3RydWN0b3JBcmdzID0gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVzLm1hcChpdCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGFpbmVyLmdldEluc3RhbmNlKGl0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBnbG9iYWxNZXRhZGF0YVJlYWRlciA9IEdsb2JhbE1ldGFkYXRhLmdldFJlYWRlcigpO1xuICAgICAgICBjb25zdCBwcm9wZXJ0eVR5cGVzID0gY2xhc3NNZXRhZGF0YVJlYWRlci5nZXRQcm9wZXJ0eVR5cGVNYXAoKTtcbiAgICAgICAgZm9yIChjb25zdCBbcHJvcGVydHlOYW1lLCBwcm9wZXJ0eVR5cGVdIG9mIHByb3BlcnR5VHlwZXMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcGVydHlUeXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eUZhY3Rvcmllcy5hcHBlbmQocHJvcGVydHlOYW1lLCAoY29udGFpbmVyLCBvd25lcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4gY29udGFpbmVyLmdldEluc3RhbmNlKHByb3BlcnR5VHlwZSwgb3duZXIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZmFjdG9yeURlZiA9IHRoaXMuY29udGFpbmVyLmdldEZhY3RvcnkocHJvcGVydHlUeXBlKTtcbiAgICAgICAgICAgIGlmIChmYWN0b3J5RGVmKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eUZhY3Rvcmllcy5zZXQocHJvcGVydHlOYW1lLCBmYWN0b3J5RGVmKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHByb3BlcnR5Q2xhc3NNZXRhZGF0YSA9IGdsb2JhbE1ldGFkYXRhUmVhZGVyLmdldENsYXNzTWV0YWRhdGEocHJvcGVydHlUeXBlKTtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eUNsYXNzTWV0YWRhdGEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5RmFjdG9yaWVzLnNldChwcm9wZXJ0eU5hbWUsIFNlcnZpY2VGYWN0b3J5RGVmLmNyZWF0ZUZyb21DbGFzc01ldGFkYXRhKHByb3BlcnR5Q2xhc3NNZXRhZGF0YSkpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcHJvcGVydHlGYWN0b3J5RGVmID0gZ2xvYmFsTWV0YWRhdGFSZWFkZXIuZ2V0Q29tcG9uZW50RmFjdG9yeShwcm9wZXJ0eVR5cGUpO1xuICAgICAgICAgICAgaWYgKHByb3BlcnR5RmFjdG9yeURlZikge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydHlGYWN0b3JpZXMuc2V0KHByb3BlcnR5TmFtZSwgcHJvcGVydHlGYWN0b3J5RGVmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBidWlsZCgpIHtcbiAgICAgICAgY29uc3QgYXJncyA9IHRoaXMuZ2V0Q29uc3RydWN0b3JBcmdzKCk7XG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSB0aGlzLmNyZWF0ZVByb3BlcnRpZXNHZXR0ZXJCdWlsZGVyKCk7XG4gICAgICAgIGNvbnN0IGlzQ3JlYXRpbmdJbnN0QXdhcmVQcm9jZXNzb3IgPSB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuaXNJbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyh0aGlzLmNvbXBvbmVudENsYXNzKTtcbiAgICAgICAgaWYgKGlzQ3JlYXRpbmdJbnN0QXdhcmVQcm9jZXNzb3IpIHtcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IHRoaXMuY29tcG9uZW50Q2xhc3MoLi4uYXJncykgYXMgSW5zdGFuY2U8VD47XG4gICAgICAgICAgICB0aGlzLmxpZmVjeWNsZVJlc29sdmVyLmludm9rZVByZUluamVjdE1ldGhvZChpbnN0YW5jZSk7XG4gICAgICAgICAgICBkZWZpbmVQcm9wZXJ0aWVzLmNhbGwodGhpcywgaW5zdGFuY2UpO1xuICAgICAgICAgICAgdGhpcy5saWZlY3ljbGVSZXNvbHZlci5pbnZva2VQb3N0SW5qZWN0TWV0aG9kKGluc3RhbmNlKTtcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBpbnN0YW5jZTogdW5kZWZpbmVkIHwgSW5zdGFuY2U8VD4gPSB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuYmVmb3JlSW5zdGFudGlhdGlvbih0aGlzLmNvbXBvbmVudENsYXNzLCBhcmdzKTtcbiAgICAgICAgICAgIGlmICghaW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZSA9IG5ldyB0aGlzLmNvbXBvbmVudENsYXNzKC4uLmFyZ3MpIGFzIEluc3RhbmNlPFQ+O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5saWZlY3ljbGVSZXNvbHZlci5pbnZva2VQcmVJbmplY3RNZXRob2QoaW5zdGFuY2UpO1xuICAgICAgICAgICAgZGVmaW5lUHJvcGVydGllcy5jYWxsKHRoaXMsIGluc3RhbmNlKTtcbiAgICAgICAgICAgIGluc3RhbmNlID0gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyLmFmdGVySW5zdGFudGlhdGlvbihpbnN0YW5jZSk7XG4gICAgICAgICAgICB0aGlzLmxpZmVjeWNsZVJlc29sdmVyLmludm9rZVBvc3RJbmplY3RNZXRob2QoaW5zdGFuY2UpO1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0aGlzOiBDb21wb25lbnRJbnN0YW5jZUJ1aWxkZXI8VD4sIGluc3RhbmNlOiBJbnN0YW5jZTxUPiB8IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcHJvcGVydGllcy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2V0dGVyID0gdmFsdWUoaW5zdGFuY2UgYXMgVCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWZpbmVQcm9wZXJ0eShpbnN0YW5jZSwgdHlwZW9mIGtleSA9PT0gJ251bWJlcicgPyBrZXkgKyAnJyA6IGtleSwgZ2V0dGVyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgZGVmaW5lUHJvcGVydHk8VCwgVj4oaW5zdGFuY2U6IFQsIGtleTogc3RyaW5nIHwgc3ltYm9sLCBnZXR0ZXI6ICgpID0+IFYpIHtcbiAgICAgICAgaWYgKHRoaXMubGF6eU1vZGUpIHtcbiAgICAgICAgICAgIGxhenlQcm9wKGluc3RhbmNlLCBrZXksIGdldHRlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBpbnN0YW5jZVtrZXldID0gZ2V0dGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBjcmVhdGVQcm9wZXJ0aWVzR2V0dGVyQnVpbGRlcigpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gbmV3IE1hcDxrZXlvZiBULCAoaW5zdGFuY2U6IFQpID0+ICgpID0+IHVua25vd24gfCB1bmtub3duW10+KCk7XG4gICAgICAgIGNvbnN0IHByb3BlcnR5VHlwZU1hcCA9IHRoaXMuY2xhc3NNZXRhZGF0YVJlYWRlci5nZXRQcm9wZXJ0eVR5cGVNYXAoKTtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCBmYWN0b3J5RGVmXSBvZiB0aGlzLnByb3BlcnR5RmFjdG9yaWVzLml0ZXJhdG9yKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzQXJyYXkgPSAocHJvcGVydHlUeXBlTWFwLmdldChrZXkpIGFzIHVua25vd24pID09PSBBcnJheTtcbiAgICAgICAgICAgIGlmICghaXNBcnJheSkge1xuICAgICAgICAgICAgICAgIGlmIChmYWN0b3J5RGVmLmZhY3Rvcmllcy5zaXplID4gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgICAgICAgICAgICAgICAgICAgYE11bHRpcGxlIG1hdGNoaW5nIGluamVjdGFibGVzIGZvdW5kIGZvciBwcm9wZXJ0eSBpbmplY3Rpb24sXFxuYnV0IHByb3BlcnR5ICR7a2V5LnRvU3RyaW5nKCl9IGlzIG5vdCBhbiBhcnJheSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEl0IGlzIGFtYmlndW91cyB0byBkZXRlcm1pbmUgd2hpY2ggb2JqZWN0IHNob3VsZCBiZSBpbmplY3RlZCFgXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IFtmYWN0b3J5LCBpbmplY3Rpb25zXSA9IGZhY3RvcnlEZWYuZmFjdG9yaWVzLmVudHJpZXMoKS5uZXh0KCkudmFsdWUgYXMgW1xuICAgICAgICAgICAgICAgICAgICBTZXJ2aWNlRmFjdG9yeTx1bmtub3duLCB1bmtub3duPixcbiAgICAgICAgICAgICAgICAgICAgSWRlbnRpZmllcltdXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICByZXN1bHQuc2V0KGtleSBhcyBrZXlvZiBULCA8VD4oaW5zdGFuY2U6IFQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvZHVjZXIgPSBmYWN0b3J5KHRoaXMuY29udGFpbmVyLCBpbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb250YWluZXIuaW52b2tlKHByb2R1Y2VyLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5qZWN0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5zZXQoa2V5IGFzIGtleW9mIFQsIDxUPihpbnN0YW5jZTogVCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9kdWNlckFuZEluamVjdGlvbnMgPSBBcnJheS5mcm9tKGZhY3RvcnlEZWYuZmFjdG9yaWVzKS5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAoW2ZhY3RvcnksIGluamVjdGlvbnNdKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtmYWN0b3J5KHRoaXMuY29udGFpbmVyLCBpbnN0YW5jZSksIGluamVjdGlvbnNdIGFzIFtBbnlGdW5jdGlvbjx1bmtub3duPiwgSWRlbnRpZmllcltdXVxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvZHVjZXJBbmRJbmplY3Rpb25zLm1hcCgoW3Byb2R1Y2VyLCBpbmplY3Rpb25zXSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRhaW5lci5pbnZva2UocHJvZHVjZXIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5qZWN0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59XG4iLCJsZXQgaW5zdGFuY2VTZXJpYWxObyA9IC0xO1xuXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50SW5zdGFuY2VXcmFwcGVyIHtcbiAgICBwdWJsaWMgcmVhZG9ubHkgc2VyaWFsTm8gPSArK2luc3RhbmNlU2VyaWFsTm87XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgaW5zdGFuY2U6IHVua25vd24pIHt9XG5cbiAgICBwdWJsaWMgY29tcGFyZVRvKG90aGVyOiBDb21wb25lbnRJbnN0YW5jZVdyYXBwZXIpOiAtMSB8IDAgfCAxIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VyaWFsTm8gPiBvdGhlci5zZXJpYWxObyA/IC0xIDogdGhpcy5zZXJpYWxObyA8IG90aGVyLnNlcmlhbE5vID8gMSA6IDA7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZva2VQcmVEZXN0cm95KGluc3RhbmNlOiB1bmtub3duKSB7XG4gICAgY29uc3QgY2xhenogPSBpbnN0YW5jZT8uY29uc3RydWN0b3I7XG4gICAgaWYgKCFjbGF6eikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoY2xhenosIENsYXNzTWV0YWRhdGEpO1xuICAgIGNvbnN0IHByZURlc3Ryb3lNZXRob2RzID0gbWV0YWRhdGEuZ2V0TWV0aG9kcyhMaWZlY3ljbGUuUFJFX0RFU1RST1kpO1xuICAgIHByZURlc3Ryb3lNZXRob2RzLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IGNsYXp6LnByb3RvdHlwZVttZXRob2ROYW1lXTtcbiAgICAgICAgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIG1ldGhvZC5hcHBseShpbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbiIsImltcG9ydCB7IEdldEluc3RhbmNlT3B0aW9ucywgSW5zdGFuY2VSZXNvbHV0aW9uLCBTYXZlSW5zdGFuY2VPcHRpb25zIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IENvbXBvbmVudEluc3RhbmNlV3JhcHBlciB9IGZyb20gJy4uL2ZvdW5kYXRpb24vQ29tcG9uZW50SW5zdGFuY2VXcmFwcGVyJztcbmltcG9ydCB7IGludm9rZVByZURlc3Ryb3kgfSBmcm9tICcuLi9jb21tb24vaW52b2tlUHJlRGVzdHJveSc7XG5cbmV4cG9ydCBjbGFzcyBTaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24gaW1wbGVtZW50cyBJbnN0YW5jZVJlc29sdXRpb24ge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgSU5TVEFOQ0VfTUFQID0gbmV3IE1hcDxJZGVudGlmaWVyLCBDb21wb25lbnRJbnN0YW5jZVdyYXBwZXI+KCk7XG4gICAgZ2V0SW5zdGFuY2U8VCwgTz4ob3B0aW9uczogR2V0SW5zdGFuY2VPcHRpb25zPFQsIE8+KTogVCB7XG4gICAgICAgIHJldHVybiB0aGlzLklOU1RBTkNFX01BUC5nZXQob3B0aW9ucy5pZGVudGlmaWVyKT8uaW5zdGFuY2UgYXMgVDtcbiAgICB9XG5cbiAgICBzYXZlSW5zdGFuY2U8VCwgTz4ob3B0aW9uczogU2F2ZUluc3RhbmNlT3B0aW9uczxULCBPPik6IHZvaWQge1xuICAgICAgICB0aGlzLklOU1RBTkNFX01BUC5zZXQob3B0aW9ucy5pZGVudGlmaWVyLCBuZXcgQ29tcG9uZW50SW5zdGFuY2VXcmFwcGVyKG9wdGlvbnMuaW5zdGFuY2UpKTtcbiAgICB9XG5cbiAgICBzaG91bGRHZW5lcmF0ZTxULCBPPihvcHRpb25zOiBHZXRJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLklOU1RBTkNFX01BUC5oYXMob3B0aW9ucy5pZGVudGlmaWVyKTtcbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgY29uc3QgaW5zdGFuY2VXcmFwcGVycyA9IEFycmF5LmZyb20odGhpcy5JTlNUQU5DRV9NQVAudmFsdWVzKCkpO1xuICAgICAgICBpbnN0YW5jZVdyYXBwZXJzLnNvcnQoKGEsIGIpID0+IGEuY29tcGFyZVRvKGIpKTtcbiAgICAgICAgaW5zdGFuY2VXcmFwcGVycy5mb3JFYWNoKGluc3RhbmNlV3JhcHBlciA9PiB7XG4gICAgICAgICAgICBpbnZva2VQcmVEZXN0cm95KGluc3RhbmNlV3JhcHBlci5pbnN0YW5jZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLklOU1RBTkNFX01BUC5jbGVhcigpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEdldEluc3RhbmNlT3B0aW9ucywgSW5zdGFuY2VSZXNvbHV0aW9uLCBTYXZlSW5zdGFuY2VPcHRpb25zIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IFNpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbiB9IGZyb20gJy4vU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uJztcblxuY29uc3QgU0lOR0xFVE9OX0lOU1RBTkNFX1NJTkdMRVRPTiA9IG5ldyBTaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24oKTtcblxuZXhwb3J0IGNsYXNzIEdsb2JhbFNoYXJlZEluc3RhbmNlUmVzb2x1dGlvbiBpbXBsZW1lbnRzIEluc3RhbmNlUmVzb2x1dGlvbiB7XG4gICAgZ2V0SW5zdGFuY2U8VCwgTz4ob3B0aW9uczogR2V0SW5zdGFuY2VPcHRpb25zPFQsIE8+KTogVCB7XG4gICAgICAgIHJldHVybiBTSU5HTEVUT05fSU5TVEFOQ0VfU0lOR0xFVE9OLmdldEluc3RhbmNlKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHNhdmVJbnN0YW5jZTxULCBPPihvcHRpb25zOiBTYXZlSW5zdGFuY2VPcHRpb25zPFQsIE8+KTogdm9pZCB7XG4gICAgICAgIFNJTkdMRVRPTl9JTlNUQU5DRV9TSU5HTEVUT04uc2F2ZUluc3RhbmNlKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHNob3VsZEdlbmVyYXRlPFQsIE8+KG9wdGlvbnM6IEdldEluc3RhbmNlT3B0aW9uczxULCBPPik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gU0lOR0xFVE9OX0lOU1RBTkNFX1NJTkdMRVRPTi5zaG91bGRHZW5lcmF0ZShvcHRpb25zKTtcbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgLy8gUEFTUztcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJbnN0YW5jZVJlc29sdXRpb24sIFNhdmVJbnN0YW5jZU9wdGlvbnMgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZVJlc29sdXRpb24nO1xuaW1wb3J0IHsgaW52b2tlUHJlRGVzdHJveSB9IGZyb20gJy4uL2NvbW1vbi9pbnZva2VQcmVEZXN0cm95JztcblxuZXhwb3J0IGNsYXNzIFRyYW5zaWVudEluc3RhbmNlUmVzb2x1dGlvbiBpbXBsZW1lbnRzIEluc3RhbmNlUmVzb2x1dGlvbiB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBpbnN0YW5jZXMgPSBuZXcgU2V0PHVua25vd24+KCk7XG4gICAgc2hvdWxkR2VuZXJhdGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGdldEluc3RhbmNlPFQ+KCk6IFQgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2F2ZUluc3RhbmNlPFQsIE8+KG9wdGlvbnM6IFNhdmVJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZXMuYWRkKG9wdGlvbnMuaW5zdGFuY2UpO1xuICAgIH1cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLmluc3RhbmNlcy5mb3JFYWNoKGl0ID0+IHtcbiAgICAgICAgICAgIGlmICghaXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbnZva2VQcmVEZXN0cm95KGl0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaW5zdGFuY2VzLmNsZWFyKCk7XG4gICAgfVxuICAgIGRlc3Ryb3lUaGF0PFQ+KGluc3RhbmNlOiBUKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5pbnN0YW5jZXMuaGFzKGluc3RhbmNlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGludm9rZVByZURlc3Ryb3koaW5zdGFuY2UpO1xuICAgICAgICB0aGlzLmluc3RhbmNlcy5kZWxldGUoaW5zdGFuY2UpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEV2YWx1YXRvciB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRvcic7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5pbXBvcnQgeyBKU09ORGF0YSB9IGZyb20gJy4uL3R5cGVzL0pTT05EYXRhJztcblxuZXhwb3J0IGNsYXNzIEpTT05EYXRhRXZhbHVhdG9yIGltcGxlbWVudHMgRXZhbHVhdG9yIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IG5hbWVzcGFjZURhdGFNYXAgPSBuZXcgTWFwPHN0cmluZywgSlNPTkRhdGE+KCk7XG4gICAgZXZhbDxUPihjb250ZXh0OiBBcHBsaWNhdGlvbkNvbnRleHQsIGV4cHJlc3Npb246IHN0cmluZyk6IFQgfCB1bmRlZmluZWQge1xuICAgICAgICBjb25zdCBjb2xvbkluZGV4ID0gZXhwcmVzc2lvbi5pbmRleE9mKCc6Jyk7XG4gICAgICAgIGlmIChjb2xvbkluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbmNvcnJlY3QgZXhwcmVzc2lvbiwgbmFtZXNwYWNlIG5vdCBzcGVjaWZpZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuYW1lc3BhY2UgPSBleHByZXNzaW9uLnN1YnN0cmluZygwLCBjb2xvbkluZGV4KTtcbiAgICAgICAgY29uc3QgZXhwID0gZXhwcmVzc2lvbi5zdWJzdHJpbmcoY29sb25JbmRleCArIDEpO1xuICAgICAgICBpZiAoIXRoaXMubmFtZXNwYWNlRGF0YU1hcC5oYXMobmFtZXNwYWNlKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbmNvcnJlY3QgZXhwcmVzc2lvbjogbmFtZXNwYWNlIG5vdCByZWNvcmRlZDogXCIke25hbWVzcGFjZX1cImApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLm5hbWVzcGFjZURhdGFNYXAuZ2V0KG5hbWVzcGFjZSkgYXMgSlNPTkRhdGE7XG4gICAgICAgIHJldHVybiBydW5FeHByZXNzaW9uKGV4cCwgZGF0YSBhcyBPYmplY3QpO1xuICAgIH1cbiAgICByZWNvcmREYXRhKG5hbWVzcGFjZTogc3RyaW5nLCBkYXRhOiBKU09ORGF0YSkge1xuICAgICAgICB0aGlzLm5hbWVzcGFjZURhdGFNYXAuc2V0KG5hbWVzcGFjZSwgZGF0YSk7XG4gICAgfVxuICAgIGdldEpTT05EYXRhKG5hbWVzcGFjZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWVzcGFjZURhdGFNYXAuZ2V0KG5hbWVzcGFjZSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBydW5FeHByZXNzaW9uKGV4cHJlc3Npb246IHN0cmluZywgcm9vdENvbnRleHQ6IE9iamVjdCkge1xuICAgIGNvbnN0IGZuID0gY29tcGlsZUV4cHJlc3Npb24oZXhwcmVzc2lvbik7XG4gICAgcmV0dXJuIGZuKHJvb3RDb250ZXh0KTtcbn1cblxuZnVuY3Rpb24gY29tcGlsZUV4cHJlc3Npb24oZXhwcmVzc2lvbjogc3RyaW5nKSB7XG4gICAgaWYgKGV4cHJlc3Npb24uaW5kZXhPZignLCcpID4gLTEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbmNvcnJlY3QgZXhwcmVzc2lvbiBzeW50YXgsIFRoZSAnLCcgaXMgbm90IGFsbG93ZWQgaW4gZXhwcmVzc2lvbjogXCIke2V4cHJlc3Npb259XCJgKTtcbiAgICB9XG4gICAgaWYgKGV4cHJlc3Npb24ubGVuZ3RoID4gMTIwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBJbmNvcnJlY3QgZXhwcmVzc2lvbiBzeW50YXgsIGV4cHJlc3Npb24gbGVuZ3RoIGNhbm5vdCBiZSBncmVhdGVyIHRoYW4gMTIwLCBidXQgYWN0dWFsOiAke2V4cHJlc3Npb24ubGVuZ3RofWBcbiAgICAgICAgKTtcbiAgICB9XG4gICAgaWYgKC9cXCguKj9cXCkvLnRlc3QoZXhwcmVzc2lvbikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbmNvcnJlY3QgZXhwcmVzc2lvbiBzeW50YXgsIHBhcmVudGhlc2VzIGFyZSBub3QgYWxsb3dlZCBpbiBleHByZXNzaW9uOiBcIiR7ZXhwcmVzc2lvbn1cImApO1xuICAgIH1cbiAgICBleHByZXNzaW9uID0gZXhwcmVzc2lvbi50cmltKCk7XG4gICAgaWYgKGV4cHJlc3Npb24gPT09ICcnKSB7XG4gICAgICAgIHJldHVybiAocm9vdDogT2JqZWN0KSA9PiByb290O1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3RWYXJOYW1lID0gdmFyTmFtZSgnY29udGV4dCcpO1xuICAgIHJldHVybiBuZXcgRnVuY3Rpb24oXG4gICAgICAgIHJvb3RWYXJOYW1lLFxuICAgICAgICBgXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuICR7cm9vdFZhck5hbWV9LiR7ZXhwcmVzc2lvbn07XG4gICAgICAgIH0gY2F0Y2goZXJyb3IpIHsgdGhyb3cgZXJyb3IgfVxuICAgIGBcbiAgICApO1xufVxubGV0IFZBUl9TRVFVRU5DRSA9IERhdGUubm93KCk7XG5mdW5jdGlvbiB2YXJOYW1lKHByZWZpeDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHByZWZpeCArICcnICsgKFZBUl9TRVFVRU5DRSsrKS50b1N0cmluZygxNik7XG59XG4iLCJpbXBvcnQgeyBFdmFsdWF0b3IgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0b3InO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuXG5leHBvcnQgY2xhc3MgRW52aXJvbm1lbnRFdmFsdWF0b3IgaW1wbGVtZW50cyBFdmFsdWF0b3Ige1xuICAgIGV2YWw8VD4oY29udGV4dDogQXBwbGljYXRpb25Db250ZXh0LCBleHByZXNzaW9uOiBzdHJpbmcpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHByb2Nlc3MuZW52W2V4cHJlc3Npb25dIGFzIFQgfCB1bmRlZmluZWQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgRXZhbHVhdG9yIH0gZnJvbSAnLi4vdHlwZXMvRXZhbHVhdG9yJztcbmltcG9ydCB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4uL2ZvdW5kYXRpb24vQXBwbGljYXRpb25Db250ZXh0JztcblxuZXhwb3J0IGNsYXNzIEFyZ3ZFdmFsdWF0b3IgaW1wbGVtZW50cyBFdmFsdWF0b3Ige1xuICAgIGV2YWw8VCwgQSA9IHN0cmluZ1tdPihjb250ZXh0OiBBcHBsaWNhdGlvbkNvbnRleHQsIGV4cHJlc3Npb246IHN0cmluZywgYXJncz86IEEpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc3QgYXJndiA9IGFyZ3MgfHwgcHJvY2Vzcy5hcmd2O1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXZhci1yZXF1aXJlc1xuICAgICAgICBjb25zdCBtaW5pbWlzdCA9IHJlcXVpcmUoJ21pbmltaXN0Jyk7XG4gICAgICAgIGNvbnN0IG1hcCA9IG1pbmltaXN0KGFyZ3YpO1xuICAgICAgICByZXR1cm4gbWFwW2V4cHJlc3Npb25dO1xuICAgIH1cbn1cbiIsImV4cG9ydCBlbnVtIEFkdmljZSB7XG4gICAgQmVmb3JlLFxuICAgIEFmdGVyLFxuICAgIEFyb3VuZCxcbiAgICBBZnRlclJldHVybixcbiAgICBUaHJvd24sXG4gICAgRmluYWxseVxufVxuIiwiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSAqL1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi9BZHZpY2UnO1xuXG50eXBlIEJlZm9yZUhvb2sgPSAoYXJnczogYW55W10pID0+IHZvaWQ7XG50eXBlIEFmdGVySG9vayA9IChhcmdzOiBhbnlbXSkgPT4gdm9pZDtcbnR5cGUgVGhyb3duSG9vayA9IChyZWFzb246IGFueSwgYXJnczogYW55W10pID0+IHZvaWQ7XG50eXBlIEZpbmFsbHlIb29rID0gKGFyZ3M6IGFueVtdKSA9PiB2b2lkO1xudHlwZSBBZnRlclJldHVybkhvb2sgPSAocmV0dXJuVmFsdWU6IGFueSwgYXJnczogYW55W10pID0+IGFueTtcbnR5cGUgQXJvdW5kSG9vayA9ICh0aGlzOiBhbnksIG9yaWdpbmZuOiAoLi4uYXJnczogYW55W10pID0+IHZvaWQsIGFyZ3M6IGFueVtdKSA9PiB2b2lkO1xuXG5leHBvcnQgY2xhc3MgQXNwZWN0VXRpbHMge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgYmVmb3JlSG9va3M6IEFycmF5PEJlZm9yZUhvb2s+ID0gW107XG4gICAgcHJpdmF0ZSByZWFkb25seSBhZnRlckhvb2tzOiBBcnJheTxBZnRlckhvb2s+ID0gW107XG4gICAgcHJpdmF0ZSByZWFkb25seSB0aHJvd25Ib29rczogQXJyYXk8VGhyb3duSG9vaz4gPSBbXTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZpbmFsbHlIb29rczogQXJyYXk8RmluYWxseUhvb2s+ID0gW107XG4gICAgcHJpdmF0ZSByZWFkb25seSBhZnRlclJldHVybkhvb2tzOiBBcnJheTxBZnRlclJldHVybkhvb2s+ID0gW107XG4gICAgcHJpdmF0ZSByZWFkb25seSBhcm91bmRIb29rczogQXJyYXk8QXJvdW5kSG9vaz4gPSBbXTtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGZuOiAoLi4uYXJnczogYW55W10pID0+IGFueSkge31cbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuQmVmb3JlLCBob29rOiBCZWZvcmVIb29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuQWZ0ZXIsIGhvb2s6IEFmdGVySG9vayk6IHZvaWQ7XG4gICAgYXBwZW5kKGFkdmljZTogQWR2aWNlLlRocm93biwgaG9vazogVGhyb3duSG9vayk6IHZvaWQ7XG4gICAgYXBwZW5kKGFkdmljZTogQWR2aWNlLkZpbmFsbHksIGhvb2s6IEZpbmFsbHlIb29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuQWZ0ZXJSZXR1cm4sIGhvb2s6IEFmdGVyUmV0dXJuSG9vayk6IHZvaWQ7XG4gICAgYXBwZW5kKGFkdmljZTogQWR2aWNlLkFyb3VuZCwgaG9vazogQXJvdW5kSG9vayk6IHZvaWQ7XG4gICAgYXBwZW5kKGFkdmljZTogQWR2aWNlLCBob29rOiBGdW5jdGlvbikge1xuICAgICAgICBsZXQgaG9va3NBcnJheTogRnVuY3Rpb25bXSB8IHVuZGVmaW5lZDtcbiAgICAgICAgc3dpdGNoIChhZHZpY2UpIHtcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLkJlZm9yZTpcbiAgICAgICAgICAgICAgICBob29rc0FycmF5ID0gdGhpcy5iZWZvcmVIb29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLkFmdGVyOlxuICAgICAgICAgICAgICAgIGhvb2tzQXJyYXkgPSB0aGlzLmFmdGVySG9va3M7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFkdmljZS5UaHJvd246XG4gICAgICAgICAgICAgICAgaG9va3NBcnJheSA9IHRoaXMudGhyb3duSG9va3M7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFkdmljZS5GaW5hbGx5OlxuICAgICAgICAgICAgICAgIGhvb2tzQXJyYXkgPSB0aGlzLmZpbmFsbHlIb29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLkFmdGVyUmV0dXJuOlxuICAgICAgICAgICAgICAgIGhvb2tzQXJyYXkgPSB0aGlzLmFmdGVyUmV0dXJuSG9va3M7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFkdmljZS5Bcm91bmQ6XG4gICAgICAgICAgICAgICAgaG9va3NBcnJheSA9IHRoaXMuYXJvdW5kSG9va3M7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhvb2tzQXJyYXkpIHtcbiAgICAgICAgICAgIGhvb2tzQXJyYXkucHVzaChob29rKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBleHRyYWN0KCkge1xuICAgICAgICBjb25zdCB7IGFyb3VuZEhvb2tzLCBiZWZvcmVIb29rcywgYWZ0ZXJIb29rcywgYWZ0ZXJSZXR1cm5Ib29rcywgZmluYWxseUhvb2tzLCB0aHJvd25Ib29rcyB9ID0gdGhpcztcbiAgICAgICAgY29uc3QgZm46IHR5cGVvZiB0aGlzLmZuID0gYXJvdW5kSG9va3MucmVkdWNlUmlnaHQoKHByZXYsIG5leHQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAodGhpczogYW55LCAuLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0LmNhbGwodGhpcywgcHJldiwgYXJncyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9LCB0aGlzLmZuKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0aGlzOiBhbnksIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgICAgICBiZWZvcmVIb29rcy5mb3JFYWNoKGhvb2sgPT4ge1xuICAgICAgICAgICAgICAgIGhvb2suY2FsbCh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgaW52b2tlID0gKG9uRXJyb3I6IChyZWFzb246IGFueSkgPT4gdm9pZCwgb25GaW5hbGx5OiAoKSA9PiB2b2lkLCBvbkFmdGVyOiAocmV0dXJuVmFsdWU6IGFueSkgPT4gYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJldHVyblZhbHVlOiBhbnk7XG4gICAgICAgICAgICAgICAgbGV0IGlzUHJvbWlzZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVyblZhbHVlID0gZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXR1cm5WYWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUHJvbWlzZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSA9IHJldHVyblZhbHVlLmNhdGNoKG9uRXJyb3IpLmZpbmFsbHkob25GaW5hbGx5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkZpbmFsbHkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaXNQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXR1cm5WYWx1ZS50aGVuKCh2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb25BZnRlcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvbkFmdGVyKHJldHVyblZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIGludm9rZShcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aHJvd25Ib29rcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvd25Ib29rcy5mb3JFYWNoKGhvb2sgPT4gaG9vay5jYWxsKHRoaXMsIGVycm9yLCBhcmdzKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBmaW5hbGx5SG9va3MuZm9yRWFjaChob29rID0+IGhvb2suY2FsbCh0aGlzLCBhcmdzKSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGFmdGVySG9va3MuZm9yRWFjaChob29rID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2suY2FsbCh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhZnRlclJldHVybkhvb2tzLnJlZHVjZSgocmV0VmFsLCBob29rKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaG9vay5jYWxsKHRoaXMsIHJldFZhbCwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH0sIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9O1xuICAgIH1cbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cbmltcG9ydCB0eXBlIHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi9BZHZpY2UnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQXNwZWN0LCBKb2luUG9pbnQsIFByb2NlZWRpbmdKb2luUG9pbnQgfSBmcm9tICcuL0FzcGVjdCc7XG5pbXBvcnQgeyBBc3BlY3RVdGlscyB9IGZyb20gJy4vQXNwZWN0VXRpbHMnO1xuaW1wb3J0IHsgQXNwZWN0SW5mbyB9IGZyb20gJy4vQXNwZWN0TWV0YWR0YSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBc3BlY3Q8VD4oXG4gICAgYXBwQ3R4OiBBcHBsaWNhdGlvbkNvbnRleHQsXG4gICAgdGFyZ2V0OiBULFxuICAgIG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCxcbiAgICBtZXRob2RGdW5jOiBGdW5jdGlvbixcbiAgICBhc3BlY3RzOiBBc3BlY3RJbmZvW11cbikge1xuICAgIGNvbnN0IGNyZWF0ZUFzcGVjdEN0eCA9IChhZHZpY2U6IEFkdmljZSwgYXJnczogYW55W10sIHJldHVyblZhbHVlOiBhbnkgPSBudWxsLCBlcnJvcjogYW55ID0gbnVsbCk6IEpvaW5Qb2ludCA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0YXJnZXQsXG4gICAgICAgICAgICBtZXRob2ROYW1lLFxuICAgICAgICAgICAgYXJndW1lbnRzOiBhcmdzLFxuICAgICAgICAgICAgcmV0dXJuVmFsdWUsXG4gICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgIGFkdmljZSxcbiAgICAgICAgICAgIGN0eDogYXBwQ3R4XG4gICAgICAgIH07XG4gICAgfTtcbiAgICBjb25zdCBhc3BlY3RVdGlscyA9IG5ldyBBc3BlY3RVdGlscyhtZXRob2RGdW5jIGFzICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTtcbiAgICBjb25zdCBDbGFzc1RvSW5zdGFuY2UgPSAoYXNwZWN0SW5mbzogQXNwZWN0SW5mbykgPT4gYXBwQ3R4LmdldEluc3RhbmNlKGFzcGVjdEluZm8uYXNwZWN0Q2xhc3MpIGFzIEFzcGVjdDtcbiAgICBjb25zdCB0YXJnZXRDb25zdHJ1Y3RvciA9ICh0YXJnZXQgYXMgb2JqZWN0KS5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPFQ+O1xuICAgIGNvbnN0IGFsbE1hdGNoQXNwZWN0cyA9IGFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LnBvaW50Y3V0LnRlc3QodGFyZ2V0Q29uc3RydWN0b3IsIG1ldGhvZE5hbWUpKTtcblxuICAgIGNvbnN0IGJlZm9yZUFkdmljZUFzcGVjdHMgPSBhbGxNYXRjaEFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LmFkdmljZSA9PT0gQWR2aWNlLkJlZm9yZSkubWFwKENsYXNzVG9JbnN0YW5jZSk7XG4gICAgY29uc3QgYWZ0ZXJBZHZpY2VBc3BlY3RzID0gYWxsTWF0Y2hBc3BlY3RzLmZpbHRlcihpdCA9PiBpdC5hZHZpY2UgPT09IEFkdmljZS5BZnRlcikubWFwKENsYXNzVG9JbnN0YW5jZSk7XG4gICAgY29uc3QgdHJ5Q2F0Y2hBZHZpY2VBc3BlY3RzID0gYWxsTWF0Y2hBc3BlY3RzLmZpbHRlcihpdCA9PiBpdC5hZHZpY2UgPT09IEFkdmljZS5UaHJvd24pLm1hcChDbGFzc1RvSW5zdGFuY2UpO1xuICAgIGNvbnN0IHRyeUZpbmFsbHlBZHZpY2VBc3BlY3RzID0gYWxsTWF0Y2hBc3BlY3RzLmZpbHRlcihpdCA9PiBpdC5hZHZpY2UgPT09IEFkdmljZS5GaW5hbGx5KS5tYXAoQ2xhc3NUb0luc3RhbmNlKTtcbiAgICBjb25zdCBhZnRlclJldHVybkFkdmljZUFzcGVjdHMgPSBhbGxNYXRjaEFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LmFkdmljZSA9PT0gQWR2aWNlLkFmdGVyUmV0dXJuKS5tYXAoQ2xhc3NUb0luc3RhbmNlKTtcbiAgICBjb25zdCBhcm91bmRBZHZpY2VBc3BlY3RzID0gYWxsTWF0Y2hBc3BlY3RzLmZpbHRlcihpdCA9PiBpdC5hZHZpY2UgPT09IEFkdmljZS5Bcm91bmQpLm1hcChDbGFzc1RvSW5zdGFuY2UpO1xuXG4gICAgaWYgKGJlZm9yZUFkdmljZUFzcGVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLkJlZm9yZSwgKGFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBqb2luUG9pbnQgPSBjcmVhdGVBc3BlY3RDdHgoQWR2aWNlLkJlZm9yZSwgYXJncyk7XG4gICAgICAgICAgICBiZWZvcmVBZHZpY2VBc3BlY3RzLmZvckVhY2goYXNwZWN0ID0+IHtcbiAgICAgICAgICAgICAgICBhc3BlY3QuZXhlY3V0ZShqb2luUG9pbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoYWZ0ZXJBZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXNwZWN0VXRpbHMuYXBwZW5kKEFkdmljZS5BZnRlciwgKGFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBqb2luUG9pbnQgPSBjcmVhdGVBc3BlY3RDdHgoQWR2aWNlLkFmdGVyLCBhcmdzKTtcbiAgICAgICAgICAgIGFmdGVyQWR2aWNlQXNwZWN0cy5mb3JFYWNoKGFzcGVjdCA9PiB7XG4gICAgICAgICAgICAgICAgYXNwZWN0LmV4ZWN1dGUoam9pblBvaW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHRyeUNhdGNoQWR2aWNlQXNwZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFzcGVjdFV0aWxzLmFwcGVuZChBZHZpY2UuVGhyb3duLCAoZXJyb3IsIGFyZ3MpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGpvaW5Qb2ludCA9IGNyZWF0ZUFzcGVjdEN0eChBZHZpY2UuVGhyb3duLCBhcmdzLCBudWxsLCBlcnJvcik7XG4gICAgICAgICAgICB0cnlDYXRjaEFkdmljZUFzcGVjdHMuZm9yRWFjaChhc3BlY3QgPT4ge1xuICAgICAgICAgICAgICAgIGFzcGVjdC5leGVjdXRlKGpvaW5Qb2ludCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRyeUZpbmFsbHlBZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXNwZWN0VXRpbHMuYXBwZW5kKEFkdmljZS5GaW5hbGx5LCAoYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGpvaW5Qb2ludCA9IGNyZWF0ZUFzcGVjdEN0eChBZHZpY2UuRmluYWxseSwgYXJncyk7XG4gICAgICAgICAgICB0cnlGaW5hbGx5QWR2aWNlQXNwZWN0cy5mb3JFYWNoKGFzcGVjdCA9PiB7XG4gICAgICAgICAgICAgICAgYXNwZWN0LmV4ZWN1dGUoam9pblBvaW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoYWZ0ZXJSZXR1cm5BZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXNwZWN0VXRpbHMuYXBwZW5kKEFkdmljZS5BZnRlclJldHVybiwgKHJldHVyblZhbHVlLCBhcmdzKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYWZ0ZXJSZXR1cm5BZHZpY2VBc3BlY3RzLnJlZHVjZSgocHJldlJldHVyblZhbHVlLCBhc3BlY3QpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBqb2luUG9pbnQgPSBjcmVhdGVBc3BlY3RDdHgoQWR2aWNlLkFmdGVyUmV0dXJuLCBhcmdzLCByZXR1cm5WYWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFzcGVjdC5leGVjdXRlKGpvaW5Qb2ludCk7XG4gICAgICAgICAgICB9LCByZXR1cm5WYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChhcm91bmRBZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXJvdW5kQWR2aWNlQXNwZWN0cy5mb3JFYWNoKGFzcGVjdCA9PiB7XG4gICAgICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLkFyb3VuZCwgKG9yaWdpbkZuLCBhcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgam9pblBvaW50ID0gY3JlYXRlQXNwZWN0Q3R4KEFkdmljZS5Bcm91bmQsIGFyZ3MsIG51bGwpIGFzIFByb2NlZWRpbmdKb2luUG9pbnQ7XG4gICAgICAgICAgICAgICAgam9pblBvaW50LnByb2NlZWQgPSAoanBBcmdzID0gYXJncykgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luRm4oanBBcmdzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBhc3BlY3QuZXhlY3V0ZShqb2luUG9pbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBhc3BlY3RVdGlscy5leHRyYWN0KCk7XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG5pbXBvcnQgeyBBc3BlY3QsIEpvaW5Qb2ludCB9IGZyb20gJy4vQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbXBvbmVudE1ldGhvZEFzcGVjdCBpbXBsZW1lbnRzIEFzcGVjdCB7XG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUoY2xheno6IE5ld2FibGU8dW5rbm93bj4sIG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCk6IE5ld2FibGU8QXNwZWN0PiB7XG4gICAgICAgIHJldHVybiBjbGFzcyBDb21wb25lbnRNZXRob2RBc3BlY3RJbXBsIGV4dGVuZHMgQ29tcG9uZW50TWV0aG9kQXNwZWN0IHtcbiAgICAgICAgICAgIGV4ZWN1dGUoanA6IEpvaW5Qb2ludCk6IGFueSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXNwZWN0SW5zdGFuY2UgPSBqcC5jdHguZ2V0SW5zdGFuY2UoY2xhenopIGFzIGFueTtcbiAgICAgICAgICAgICAgICBjb25zdCBmdW5jID0gYXNwZWN0SW5zdGFuY2VbbWV0aG9kTmFtZV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLmFzcGVjdEluc3RhbmNlLCBqcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIHByb3RlY3RlZCBhc3BlY3RJbnN0YW5jZSE6IGFueTtcbiAgICBhYnN0cmFjdCBleGVjdXRlKGN0eDogSm9pblBvaW50KTogYW55O1xufVxuIiwiaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IE1ldGFkYXRhLCBNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4uL3R5cGVzL01ldGFkYXRhJztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4vQWR2aWNlJztcbmltcG9ydCB7IENvbXBvbmVudE1ldGhvZEFzcGVjdCB9IGZyb20gJy4vQ29tcG9uZW50TWV0aG9kQXNwZWN0JztcbmltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi9Qb2ludGN1dCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXNwZWN0SW5mbyB7XG4gICAgYXNwZWN0Q2xhc3M6IE5ld2FibGU8dW5rbm93bj47XG4gICAgbWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sO1xuICAgIHBvaW50Y3V0OiBQb2ludGN1dDtcbiAgICBhZHZpY2U6IEFkdmljZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBc3BlY3RNZXRhZGF0YVJlYWRlciBleHRlbmRzIE1ldGFkYXRhUmVhZGVyIHtcbiAgICBnZXRBc3BlY3RzKGpwSWRlbnRpZmllcjogSWRlbnRpZmllciwganBNZW1iZXI6IHN0cmluZyB8IHN5bWJvbCk6IEFzcGVjdEluZm9bXTtcbn1cblxuZXhwb3J0IGNsYXNzIEFzcGVjdE1ldGFkYXRhIGltcGxlbWVudHMgTWV0YWRhdGE8QXNwZWN0TWV0YWRhdGFSZWFkZXIsIHZvaWQ+IHtcbiAgICBwcml2YXRlIHN0YXRpYyBJTlNUQU5DRSA9IG5ldyBBc3BlY3RNZXRhZGF0YSgpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgYXNwZWN0czogQXNwZWN0SW5mb1tdID0gW107XG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICAgICAgcmV0dXJuIEFzcGVjdE1ldGFkYXRhLklOU1RBTkNFO1xuICAgIH1cbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvL1xuICAgIH1cbiAgICBpbml0KCk6IHZvaWQge1xuICAgICAgICAvL1xuICAgIH1cbiAgICBhcHBlbmQoY29tcG9uZW50QXNwZWN0Q2xhc3M6IE5ld2FibGU8dW5rbm93bj4sIG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCwgYWR2aWNlOiBBZHZpY2UsIHBvaW50Y3V0OiBQb2ludGN1dCkge1xuICAgICAgICBjb25zdCBBc3BlY3RDbGFzcyA9IENvbXBvbmVudE1ldGhvZEFzcGVjdC5jcmVhdGUoY29tcG9uZW50QXNwZWN0Q2xhc3MsIG1ldGhvZE5hbWUpO1xuICAgICAgICB0aGlzLmFzcGVjdHMucHVzaCh7XG4gICAgICAgICAgICBhc3BlY3RDbGFzczogQXNwZWN0Q2xhc3MsXG4gICAgICAgICAgICBtZXRob2ROYW1lLFxuICAgICAgICAgICAgcG9pbnRjdXQsXG4gICAgICAgICAgICBhZHZpY2VcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlYWRlcigpOiBBc3BlY3RNZXRhZGF0YVJlYWRlciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXRBc3BlY3RzOiAoanBJZGVudGlmaWVyLCBqcE1lbWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzcGVjdHMuZmlsdGVyKCh7IHBvaW50Y3V0IH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBvaW50Y3V0LnRlc3QoanBJZGVudGlmaWVyLCBqcE1lbWJlcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL3R5cGVzL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcic7XG5pbXBvcnQgdHlwZSB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4uL2ZvdW5kYXRpb24vQXBwbGljYXRpb25Db250ZXh0JztcbmltcG9ydCB7IGNyZWF0ZUFzcGVjdCB9IGZyb20gJy4vY3JlYXRlQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEFzcGVjdE1ldGFkYXRhIH0gZnJvbSAnLi9Bc3BlY3RNZXRhZHRhJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3NvciBpbXBsZW1lbnRzIFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3Ige1xuICAgIHN0YXRpYyBjcmVhdGUoYXBwQ3R4OiBBcHBsaWNhdGlvbkNvbnRleHQpOiBOZXdhYmxlPEFPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcj4ge1xuICAgICAgICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBBT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3Ige1xuICAgICAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGFwcEN0eDogQXBwbGljYXRpb25Db250ZXh0ID0gYXBwQ3R4O1xuICAgICAgICB9O1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgYXBwQ3R4OiBBcHBsaWNhdGlvbkNvbnRleHQ7XG4gICAgYWZ0ZXJJbnN0YW50aWF0aW9uPFQgZXh0ZW5kcyBvYmplY3Q+KGluc3RhbmNlOiBUKTogVCB7XG4gICAgICAgIGlmICghaW5zdGFuY2UgfHwgdHlwZW9mIGluc3RhbmNlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNsYXp6ID0gaW5zdGFuY2UuY29uc3RydWN0b3I7XG5cbiAgICAgICAgY29uc3QgYXNwZWN0TWV0YWRhdGEgPSBBc3BlY3RNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlYWRlcigpO1xuICAgICAgICAvLyBjb25zdCB1c2VBc3BlY3RNZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGNsYXp6LCBBT1BDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgLy8gY29uc3QgdXNlQXNwZWN0TWV0YWRhdGFSZWFkZXIgPSB1c2VBc3BlY3RNZXRhZGF0YS5yZWFkZXIoKTtcbiAgICAgICAgLy8gY29uc3QgdXNlQXNwZWN0c01hcCA9IHVzZUFzcGVjdE1ldGFkYXRhUmVhZGVyLmdldEFzcGVjdHMoKTtcbiAgICAgICAgLy8gaWYgKHVzZUFzcGVjdHNNYXAuc2l6ZSA9PT0gMCkge1xuICAgICAgICAvLyAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgY29uc3QgYXNwZWN0U3RvcmVNYXAgPSBuZXcgV2Vha01hcDxvYmplY3QsIE1hcDxzdHJpbmcgfCBzeW1ib2wsIEZ1bmN0aW9uPj4oKTtcbiAgICAgICAgYXNwZWN0U3RvcmVNYXAuc2V0KGluc3RhbmNlLCBuZXcgTWFwPHN0cmluZyB8IHN5bWJvbCwgRnVuY3Rpb24+KCkpO1xuXG4gICAgICAgIGNvbnN0IHByb3h5UmVzdWx0ID0gbmV3IFByb3h5KGluc3RhbmNlLCB7XG4gICAgICAgICAgICBnZXQ6ICh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luVmFsdWUgPSBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnY29uc3RydWN0b3InOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpblZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoUmVmbGVjdC5oYXModGFyZ2V0LCBwcm9wKSAmJiB0eXBlb2Ygb3JpZ2luVmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXNwZWN0TWFwID0gYXNwZWN0U3RvcmVNYXAuZ2V0KGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhc3BlY3RNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5WYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoYXNwZWN0TWFwLmhhcyhwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFzcGVjdE1hcC5nZXQocHJvcCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXNwZWN0c09mTWV0aG9kID0gYXNwZWN0TWV0YWRhdGEuZ2V0QXNwZWN0cyhjbGF6eiBhcyBJZGVudGlmaWVyLCBwcm9wKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXNwZWN0Rm4gPSBjcmVhdGVBc3BlY3QodGhpcy5hcHBDdHgsIHRhcmdldCwgcHJvcCwgb3JpZ2luVmFsdWUsIGFzcGVjdHNPZk1ldGhvZCk7XG4gICAgICAgICAgICAgICAgICAgIGFzcGVjdE1hcC5zZXQocHJvcCwgYXNwZWN0Rm4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXNwZWN0Rm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5WYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm94eVJlc3VsdDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3IsIFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3IgfSBmcm9tICcuLi90eXBlcy9JbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3InO1xuaW1wb3J0IHsgbGF6eU1lbWJlciB9IGZyb20gJ0B2Z2VyYm90L2xhenknO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHsgSW5zdGFuY2UgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZSc7XG5pbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0dsb2JhbE1ldGFkYXRhJztcblxuZXhwb3J0IGNsYXNzIEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXIge1xuICAgIHByaXZhdGUgaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlczogU2V0PE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4+ID0gbmV3IFNldCgpO1xuICAgIEBsYXp5TWVtYmVyPEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXIsIGtleW9mIEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXIsIFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3JbXT4oe1xuICAgICAgICBldmFsdWF0ZTogaW5zdGFuY2UgPT4ge1xuICAgICAgICAgICAgY29uc3QgZ2xvYmFsSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcyA9IEdsb2JhbE1ldGFkYXRhLmdldFJlYWRlcigpLmdldEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoKTtcbiAgICAgICAgICAgIGNvbnN0IGluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMgPSBnbG9iYWxJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLmNvbmNhdChcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKGluc3RhbmNlLmluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMubWFwKGl0ID0+IGluc3RhbmNlLmNvbnRhaW5lci5nZXRJbnN0YW5jZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yLCB2b2lkPihpdCkpO1xuICAgICAgICB9LFxuICAgICAgICByZXNldEJ5OiBbXG4gICAgICAgICAgICBpbnN0YW5jZSA9PiBpbnN0YW5jZS5pbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLnNpemUsXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2xvYmFsSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcyA9IEdsb2JhbE1ldGFkYXRhLmdldFJlYWRlcigpLmdldEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2xvYmFsSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3Nlcy5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9KVxuICAgIHByaXZhdGUgaW5zdEF3YXJlUHJvY2Vzc29ySW5zdGFuY2VzITogQXJyYXk8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj47XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGNvbnRhaW5lcjogQXBwbGljYXRpb25Db250ZXh0KSB7fVxuICAgIGFwcGVuZEluc3RBd2FyZVByb2Nlc3NvckNsYXNzKGluc3RBd2FyZVByb2Nlc3NvckNsYXNzOiBOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+KSB7XG4gICAgICAgIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3Nlcy5hZGQoaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MpO1xuICAgIH1cbiAgICBhcHBlbmRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKFxuICAgICAgICBpbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzOiBTZXQ8TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPj4gfCBBcnJheTxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+PlxuICAgICkge1xuICAgICAgICBpbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLmZvckVhY2goaXQgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLmFkZChpdCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBiZWZvcmVJbnN0YW50aWF0aW9uPFQ+KGNvbXBvbmVudENsYXNzOiBOZXdhYmxlPFQ+LCBhcmdzOiB1bmtub3duW10pIHtcbiAgICAgICAgY29uc3QgaW5zdEF3YXJlUHJvY2Vzc29ycyA9IHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29ySW5zdGFuY2VzO1xuICAgICAgICBsZXQgaW5zdGFuY2U6IHVuZGVmaW5lZCB8IEluc3RhbmNlPFQ+O1xuICAgICAgICBpbnN0QXdhcmVQcm9jZXNzb3JzLnNvbWUocHJvY2Vzc29yID0+IHtcbiAgICAgICAgICAgIGlmICghcHJvY2Vzc29yLmJlZm9yZUluc3RhbnRpYXRpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbnN0YW5jZSA9IHByb2Nlc3Nvci5iZWZvcmVJbnN0YW50aWF0aW9uPFQ+KGNvbXBvbmVudENsYXNzLCBhcmdzKSBhcyBJbnN0YW5jZTxUPjtcbiAgICAgICAgICAgIHJldHVybiAhIWluc3RhbmNlO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH1cbiAgICBhZnRlckluc3RhbnRpYXRpb248VD4oaW5zdGFuY2U6IEluc3RhbmNlPFQ+KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvckluc3RhbmNlcy5yZWR1Y2UoKGluc3RhbmNlLCBwcm9jZXNzb3IpID0+IHtcbiAgICAgICAgICAgIGlmIChwcm9jZXNzb3IuYWZ0ZXJJbnN0YW50aWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gcHJvY2Vzc29yLmFmdGVySW5zdGFudGlhdGlvbihpbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgaWYgKCEhcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgYXMgSW5zdGFuY2U8VD47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9LCBpbnN0YW5jZSk7XG4gICAgfVxuICAgIGlzSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoY2xzOiBOZXdhYmxlPHVua25vd24+KSB7XG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSB0aGlzLmdldEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoKTtcbiAgICAgICAgcmV0dXJuIGNsYXNzZXMuaW5kZXhPZihjbHMgYXMgTmV3YWJsZTxJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3I+KSA+IC0xO1xuICAgIH1cbiAgICBnZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKCkge1xuICAgICAgICBjb25zdCBnbG9iYWxJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzID0gR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWFkZXIoKS5nZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKCk7XG4gICAgICAgIHJldHVybiBnbG9iYWxJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLmNvbmNhdChBcnJheS5mcm9tKHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcykpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuL0luc3RhbmNlU2NvcGUnO1xuaW1wb3J0IHsgSW5zdGFuY2VSZXNvbHV0aW9uIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IFNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi4vdHlwZXMvU2VydmljZUZhY3RvcnknO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBFdmVudExpc3RlbmVyIH0gZnJvbSAnLi9FdmVudEVtaXR0ZXInO1xuaW1wb3J0IHsgQW55RnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcy9BbnlGdW5jdGlvbic7XG5pbXBvcnQgeyBoYXNBcmdzLCBoYXNJbmplY3Rpb25zLCBJbnZva2VGdW5jdGlvbk9wdGlvbnMgfSBmcm9tICcuL0ludm9rZUZ1bmN0aW9uT3B0aW9ucyc7XG5pbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0dsb2JhbE1ldGFkYXRhJztcbmltcG9ydCB7IEZhY3RvcnlJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvRmFjdG9yeUlkZW50aWZpZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSwgQ2xhc3NNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyIH0gZnJvbSAnLi9Db21wb25lbnRJbnN0YW5jZUJ1aWxkZXInO1xuaW1wb3J0IHsgRnVuY3Rpb25NZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0Z1bmN0aW9uTWV0YWRhdGEnO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0T3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzL0FwcGxpY2F0aW9uQ29udGV4dE9wdGlvbnMnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBTaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24gfSBmcm9tICcuLi9yZXNvbHV0aW9uL1NpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbic7XG5pbXBvcnQgeyBHbG9iYWxTaGFyZWRJbnN0YW5jZVJlc29sdXRpb24gfSBmcm9tICcuLi9yZXNvbHV0aW9uL0dsb2JhbFNoYXJlZEluc3RhbmNlUmVzb2x1dGlvbic7XG5pbXBvcnQgeyBUcmFuc2llbnRJbnN0YW5jZVJlc29sdXRpb24gfSBmcm9tICcuLi9yZXNvbHV0aW9uL1RyYW5zaWVudEluc3RhbmNlUmVzb2x1dGlvbic7XG5pbXBvcnQgeyBFdmFsdWF0aW9uT3B0aW9ucywgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuaW1wb3J0IHsgSlNPTkRhdGEgfSBmcm9tICcuLi90eXBlcy9KU09ORGF0YSc7XG5pbXBvcnQgeyBFdmFsdWF0b3IgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0b3InO1xuaW1wb3J0IHsgSlNPTkRhdGFFdmFsdWF0b3IgfSBmcm9tICcuLi9ldmFsdWF0b3IvSlNPTkRhdGFFdmFsdWF0b3InO1xuaW1wb3J0IHsgRW52aXJvbm1lbnRFdmFsdWF0b3IgfSBmcm9tICcuLi9ldmFsdWF0b3IvRW52aXJvbm1lbnRFdmFsdWF0b3InO1xuaW1wb3J0IHsgQXJndkV2YWx1YXRvciB9IGZyb20gJy4uL2V2YWx1YXRvci9Bcmd2RXZhbHVhdG9yJztcbmltcG9ydCB7IGlzTm9kZUpzIH0gZnJvbSAnLi4vY29tbW9uL2lzTm9kZUpzJztcbmltcG9ydCB7IFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3IgfSBmcm9tICcuLi90eXBlcy9JbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3InO1xuaW1wb3J0IHsgQU9QSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yIH0gZnJvbSAnLi4vYW9wL0FPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcic7XG5pbXBvcnQgeyBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyIH0gZnJvbSAnLi9JbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyJztcbmltcG9ydCB7IExpZmVjeWNsZU1hbmFnZXIgfSBmcm9tICcuL0xpZmVjeWNsZU1hbmFnZXInO1xuaW1wb3J0IHsgSW5zdGFuY2UgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZSc7XG5pbXBvcnQgeyBGYWN0b3J5UmVjb3JkZXIgfSBmcm9tICcuLi9jb21tb24vRmFjdG9yeVJlY29yZGVyJztcbmltcG9ydCB7IExpZmVjeWNsZSB9IGZyb20gJy4vTGlmZWN5Y2xlJztcblxuY29uc3QgUFJFX0RFU1RST1lfRVZFTlRfS0VZID0gJ2NvbnRhaW5lcjpldmVudDpwcmUtZGVzdHJveSc7XG5jb25zdCBQUkVfREVTVFJPWV9USEFUX0VWRU5UX0tFWSA9ICdjb250YWluZXI6ZXZlbnQ6cHJlLWRlc3Ryb3ktdGhhdCc7XG5jb25zdCBJTlNUQU5DRV9QUkVfREVTVFJPWV9NRVRIT0QgPSBTeW1ib2woJ3NvbGlkaXVtOmluc3RhbmNlLXByZS1kZXN0cm95Jyk7XG5cbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbkNvbnRleHQge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcmVzb2x1dGlvbnMgPSBuZXcgTWFwPEluc3RhbmNlU2NvcGUgfCBzdHJpbmcsIEluc3RhbmNlUmVzb2x1dGlvbj4oKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIHByaXZhdGUgcmVhZG9ubHkgZmFjdG9yaWVzID0gbmV3IEZhY3RvcnlSZWNvcmRlcigpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZXZhbHVhdG9yQ2xhc3NlcyA9IG5ldyBNYXA8c3RyaW5nLCBOZXdhYmxlPEV2YWx1YXRvcj4+KCk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBldmVudEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBkZWZhdWx0U2NvcGU6IEluc3RhbmNlU2NvcGU7XG4gICAgcHJpdmF0ZSByZWFkb25seSBsYXp5TW9kZTogYm9vbGVhbjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXI6IEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXI7XG4gICAgcHJpdmF0ZSBpc0Rlc3Ryb3llZCA9IGZhbHNlO1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihvcHRpb25zOiBBcHBsaWNhdGlvbkNvbnRleHRPcHRpb25zID0ge30pIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0U2NvcGUgPSBvcHRpb25zLmRlZmF1bHRTY29wZSB8fCBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTjtcbiAgICAgICAgdGhpcy5sYXp5TW9kZSA9IG9wdGlvbnMubGF6eU1vZGUgPz8gdHJ1ZTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlckluc3RhbmNlU2NvcGVSZXNvbHV0aW9uKEluc3RhbmNlU2NvcGUuU0lOR0xFVE9OLCBTaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24pO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySW5zdGFuY2VTY29wZVJlc29sdXRpb24oSW5zdGFuY2VTY29wZS5HTE9CQUxfU0hBUkVEX1NJTkdMRVRPTiwgR2xvYmFsU2hhcmVkSW5zdGFuY2VSZXNvbHV0aW9uKTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlckluc3RhbmNlU2NvcGVSZXNvbHV0aW9uKEluc3RhbmNlU2NvcGUuVFJBTlNJRU5ULCBUcmFuc2llbnRJbnN0YW5jZVJlc29sdXRpb24pO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZhbHVhdG9yKEV4cHJlc3Npb25UeXBlLkpTT05fUEFUSCwgSlNPTkRhdGFFdmFsdWF0b3IpO1xuICAgICAgICBpZiAoaXNOb2RlSnMpIHtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFdmFsdWF0b3IoRXhwcmVzc2lvblR5cGUuRU5WLCBFbnZpcm9ubWVudEV2YWx1YXRvcik7XG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyRXZhbHVhdG9yKEV4cHJlc3Npb25UeXBlLkFSR1YsIEFyZ3ZFdmFsdWF0b3IpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlciA9IG5ldyBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyKHRoaXMpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySW5zdEF3YXJlUHJvY2Vzc29yKEFPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvci5jcmVhdGUodGhpcykpO1xuICAgIH1cbiAgICBnZXRJbnN0YW5jZTxULCBPPihzeW1ib2w6IE5ld2FibGU8VD4sIG93bmVyPzogTyk6IFQ7XG4gICAgZ2V0SW5zdGFuY2U8VCwgTz4oc3ltYm9sOiBJZGVudGlmaWVyPFQ+LCBvd25lcj86IE8pOiBUIHwgVFtdO1xuICAgIGdldEluc3RhbmNlPFQsIE8+KHN5bWJvbDogSWRlbnRpZmllcjxUPiwgb3duZXI/OiBPKTogVCB8IFRbXSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3ltYm9sID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygc3ltYm9sID09PSAnc3ltYm9sJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2VCeVN5bWJvbChzeW1ib2wsIG93bmVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW5jZUJ5Q2xhc3Moc3ltYm9sLCBvd25lcik7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0SW5zdGFuY2VCeVN5bWJvbDxULCBPPihzeW1ib2w6IHN0cmluZyB8IHN5bWJvbCwgb3duZXI/OiBPKTogVCB8IFRbXSB7XG4gICAgICAgIGNvbnN0IGZhY3RvcnlEZWYgPSB0aGlzLmdldEZhY3Rvcnkoc3ltYm9sKTtcbiAgICAgICAgaWYgKGZhY3RvcnlEZWYpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb2R1Y2VyID0gZmFjdG9yeURlZi5wcm9kdWNlKHRoaXMsIG93bmVyKTtcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBwcm9kdWNlcigpIGFzIFQgfCBUW107XG4gICAgICAgICAgICB0aGlzLmF0dGFjaFByZURlc3Ryb3lIb29rKHJlc3VsdCk7XG4gICAgICAgICAgICBjb25zdCBjb25zdHIgPSByZXN1bHQ/LmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zdHIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wb25lbnRDbGFzcyA9IGNvbnN0ciBhcyBOZXdhYmxlPFQ+O1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc29sdmVyID0gbmV3IExpZmVjeWNsZU1hbmFnZXI8VD4oY29tcG9uZW50Q2xhc3MsIHRoaXMpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzSW5zdEF3YXJlUHJvY2Vzc29yID0gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyLmlzSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoY29tcG9uZW50Q2xhc3MpO1xuICAgICAgICAgICAgICAgIHJlc29sdmVyLmludm9rZVByZUluamVjdE1ldGhvZChyZXN1bHQgYXMgSW5zdGFuY2U8VD4pO1xuICAgICAgICAgICAgICAgIGlmICghaXNJbnN0QXdhcmVQcm9jZXNzb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyLmFmdGVySW5zdGFudGlhdGlvbihyZXN1bHQgYXMgSW5zdGFuY2U8VD4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNvbHZlci5pbnZva2VQb3N0SW5qZWN0TWV0aG9kKHJlc3VsdCBhcyBJbnN0YW5jZTxUPik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgY2xhc3NNZXRhZGF0YSA9IEdsb2JhbE1ldGFkYXRhLmdldEluc3RhbmNlKCkucmVhZGVyKCkuZ2V0Q2xhc3NNZXRhZGF0YTxUPihzeW1ib2wpO1xuICAgICAgICAgICAgaWYgKCFjbGFzc01ldGFkYXRhKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDbGFzcyBhbGlhcyBub3QgZm91bmQ6ICR7c3ltYm9sLnRvU3RyaW5nKCl9YCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNsYXp6ID0gY2xhc3NNZXRhZGF0YS5yZWFkZXIoKS5nZXRDbGFzcygpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbmNlQnlDbGFzcyhjbGF6eiwgb3duZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0SW5zdGFuY2VCeUNsYXNzPFQsIE8+KGNvbXBvbmVudENsYXNzOiBOZXdhYmxlPFQ+LCBvd25lcj86IE8pOiBUIHwgVFtdIHtcbiAgICAgICAgaWYgKGNvbXBvbmVudENsYXNzID09PSBBcHBsaWNhdGlvbkNvbnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzIGFzIHVua25vd24gYXMgVDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZWFkZXIgPSBDbGFzc01ldGFkYXRhLmdldEluc3RhbmNlKGNvbXBvbmVudENsYXNzKS5yZWFkZXIoKTtcbiAgICAgICAgY29uc3Qgc2NvcGUgPSByZWFkZXIuZ2V0U2NvcGUoKTtcbiAgICAgICAgY29uc3QgcmVzb2x1dGlvbiA9ICh0aGlzLnJlc29sdXRpb25zLmdldChzY29wZSkgfHwgdGhpcy5yZXNvbHV0aW9ucy5nZXQodGhpcy5kZWZhdWx0U2NvcGUpKSBhcyBJbnN0YW5jZVJlc29sdXRpb247XG4gICAgICAgIGNvbnN0IGdldEluc3RhbmNlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGlkZW50aWZpZXI6IGNvbXBvbmVudENsYXNzLFxuICAgICAgICAgICAgb3duZXIsXG4gICAgICAgICAgICBvd25lclByb3BlcnR5S2V5OiB1bmRlZmluZWRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHJlc29sdXRpb24uc2hvdWxkR2VuZXJhdGUoZ2V0SW5zdGFuY2VPcHRpb25zKSkge1xuICAgICAgICAgICAgY29uc3QgYnVpbGRlciA9IHRoaXMuY3JlYXRlQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyKGNvbXBvbmVudENsYXNzKTtcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gYnVpbGRlci5idWlsZCgpO1xuICAgICAgICAgICAgY29uc3Qgc2F2ZUluc3RhbmNlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAuLi5nZXRJbnN0YW5jZU9wdGlvbnMsXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXNvbHV0aW9uLnNhdmVJbnN0YW5jZShzYXZlSW5zdGFuY2VPcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuYXR0YWNoUHJlRGVzdHJveUhvb2soaW5zdGFuY2UpO1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdXRpb24uZ2V0SW5zdGFuY2UoZ2V0SW5zdGFuY2VPcHRpb25zKSBhcyBUO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgYXR0YWNoUHJlRGVzdHJveUhvb2s8VD4oaW5zdGFuY2VzOiBUIHwgVFtdKSB7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlc0FycmF5ID0gQXJyYXkuaXNBcnJheShpbnN0YW5jZXMpID8gaW5zdGFuY2VzIDogW2luc3RhbmNlc107XG4gICAgICAgIGluc3RhbmNlc0FycmF5LmZvckVhY2goaXQgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBpdCBhcyBJbnN0YW5jZTxUPjtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5zdGFuY2UgIT09ICdvYmplY3QnIHx8IGluc3RhbmNlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFJlZmxlY3QuaGFzKGluc3RhbmNlLCBJTlNUQU5DRV9QUkVfREVTVFJPWV9NRVRIT0QpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY2xhenogPSBpbnN0YW5jZS5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgIGlmICghY2xhenopIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGluc3RhbmNlLmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcblxuICAgICAgICAgICAgbWV0YWRhdGEuYWRkTGlmZWN5Y2xlTWV0aG9kKElOU1RBTkNFX1BSRV9ERVNUUk9ZX01FVEhPRCwgTGlmZWN5Y2xlLlBSRV9ERVNUUk9ZKTtcbiAgICAgICAgICAgIFJlZmxlY3Quc2V0KGluc3RhbmNlLCBJTlNUQU5DRV9QUkVfREVTVFJPWV9NRVRIT0QsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KFBSRV9ERVNUUk9ZX0VWRU5UX0tFWSwgaW5zdGFuY2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZUNvbXBvbmVudEluc3RhbmNlQnVpbGRlcjxUPihjb21wb25lbnRDbGFzczogTmV3YWJsZTxUPikge1xuICAgICAgICBjb25zdCBidWlsZGVyID0gbmV3IENvbXBvbmVudEluc3RhbmNlQnVpbGRlcihjb21wb25lbnRDbGFzcywgdGhpcywgdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyKTtcbiAgICAgICAgYnVpbGRlci5hcHBlbmRMYXp5TW9kZSh0aGlzLmxhenlNb2RlKTtcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXI7XG4gICAgfVxuXG4gICAgZ2V0RmFjdG9yeShrZXk6IEZhY3RvcnlJZGVudGlmaWVyKSB7XG4gICAgICAgIGNvbnN0IGZhY3RvcnkgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlYWRlcigpLmdldENvbXBvbmVudEZhY3Rvcnkoa2V5KTtcbiAgICAgICAgaWYgKCFmYWN0b3J5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mYWN0b3JpZXMuZ2V0KGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfVxuICAgIGJpbmRGYWN0b3J5PFQ+KFxuICAgICAgICBzeW1ib2w6IEZhY3RvcnlJZGVudGlmaWVyLFxuICAgICAgICBmYWN0b3J5OiBTZXJ2aWNlRmFjdG9yeTxULCB1bmtub3duPixcbiAgICAgICAgaW5qZWN0aW9ucz86IElkZW50aWZpZXJbXSxcbiAgICAgICAgaXNTaW5nbGU/OiBib29sZWFuXG4gICAgKSB7XG4gICAgICAgIHRoaXMuZmFjdG9yaWVzLmFwcGVuZChzeW1ib2wsIGZhY3RvcnksIGluamVjdGlvbnMsIGlzU2luZ2xlKTtcbiAgICB9XG4gICAgaW52b2tlPFIsIEN0eD4oZnVuYzogQW55RnVuY3Rpb248UiwgQ3R4Piwgb3B0aW9uczogSW52b2tlRnVuY3Rpb25PcHRpb25zPEN0eD4gPSB7fSk6IFIge1xuICAgICAgICBsZXQgZm46IEFueUZ1bmN0aW9uPFI+O1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGZuID0gZnVuYy5iaW5kKG9wdGlvbnMuY29udGV4dCBhcyBUaGlzUGFyYW1ldGVyVHlwZTx0eXBlb2YgZnVuYz4pIGFzIEFueUZ1bmN0aW9uPFI+O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm4gPSBmdW5jIGFzIEFueUZ1bmN0aW9uPFI+O1xuICAgICAgICB9XG4gICAgICAgIGlmIChoYXNBcmdzKG9wdGlvbnMpKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5hcmdzID8gZm4oLi4ub3B0aW9ucy5hcmdzKSA6IGZuKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGFyZ3NJbmRlbnRpZmllcnM6IElkZW50aWZpZXJbXSA9IFtdO1xuICAgICAgICBpZiAoaGFzSW5qZWN0aW9ucyhvcHRpb25zKSkge1xuICAgICAgICAgICAgYXJnc0luZGVudGlmaWVycyA9IG9wdGlvbnMuaW5qZWN0aW9ucztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoZm4sIEZ1bmN0aW9uTWV0YWRhdGEpLnJlYWRlcigpO1xuICAgICAgICAgICAgYXJnc0luZGVudGlmaWVycyA9IG1ldGFkYXRhLmdldFBhcmFtZXRlcnMoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhcmdzID0gYXJnc0luZGVudGlmaWVycy5tYXAoKGlkZW50aWZpZXIsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0SW5zdGFuY2UoaWRlbnRpZmllcik7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnN0YW5jZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0FycmF5VHlwZSA9IChpZGVudGlmaWVyIGFzIHVua25vd24pID09PSBBcnJheTtcbiAgICAgICAgICAgICAgICBpZiAoaXNBcnJheVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIG1hdGNoaW5nIGluamVjdGFibGVzIGZvdW5kIGZvciBwYXJhbWV0ZXIgYXQgJHtpbmRleH0uYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZVswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBhcmdzLmxlbmd0aCA+IDAgPyBmbiguLi5hcmdzKSA6IGZuKCk7XG4gICAgfVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgICAgIHRoaXMuZXZlbnRFbWl0dGVyLmVtaXQoUFJFX0RFU1RST1lfRVZFTlRfS0VZKTtcbiAgICAgICAgdGhpcy5yZXNvbHV0aW9ucy5mb3JFYWNoKGl0ID0+IHtcbiAgICAgICAgICAgIGl0LmRlc3Ryb3koKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGV2YWx1YXRlPFQsIE8sIEE+KGV4cHJlc3Npb246IHN0cmluZywgb3B0aW9uczogRXZhbHVhdGlvbk9wdGlvbnM8Tywgc3RyaW5nLCBBPik6IFQgfCB1bmRlZmluZWQge1xuICAgICAgICBjb25zdCBldmFsdWF0b3JDbGFzcyA9IHRoaXMuZXZhbHVhdG9yQ2xhc3Nlcy5nZXQob3B0aW9ucy50eXBlKTtcbiAgICAgICAgaWYgKCFldmFsdWF0b3JDbGFzcykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgVW5rbm93biBldmFsdWF0b3IgbmFtZTogJHtvcHRpb25zLnR5cGV9YCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZXZhbHVhdG9yID0gdGhpcy5nZXRJbnN0YW5jZShldmFsdWF0b3JDbGFzcyk7XG4gICAgICAgIHJldHVybiBldmFsdWF0b3IuZXZhbCh0aGlzLCBleHByZXNzaW9uLCBvcHRpb25zLmV4dGVybmFsQXJncyk7XG4gICAgfVxuICAgIHJlY29yZEpTT05EYXRhKG5hbWVzcGFjZTogc3RyaW5nLCBkYXRhOiBKU09ORGF0YSkge1xuICAgICAgICBjb25zdCBldmFsdWF0b3IgPSB0aGlzLmdldEluc3RhbmNlKEpTT05EYXRhRXZhbHVhdG9yKTtcbiAgICAgICAgZXZhbHVhdG9yLnJlY29yZERhdGEobmFtZXNwYWNlLCBkYXRhKTtcbiAgICB9XG4gICAgZ2V0SlNPTkRhdGEobmFtZXNwYWNlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgZXZhbHVhdG9yID0gdGhpcy5nZXRJbnN0YW5jZShKU09ORGF0YUV2YWx1YXRvcik7XG4gICAgICAgIHJldHVybiBldmFsdWF0b3IuZ2V0SlNPTkRhdGEobmFtZXNwYWNlKTtcbiAgICB9XG4gICAgYmluZEluc3RhbmNlPFQ+KGlkZW50aWZpZXI6IHN0cmluZyB8IHN5bWJvbCwgaW5zdGFuY2U6IFQpIHtcbiAgICAgICAgY29uc3QgcmVzb2x1dGlvbiA9IHRoaXMucmVzb2x1dGlvbnMuZ2V0KEluc3RhbmNlU2NvcGUuU0lOR0xFVE9OKTtcbiAgICAgICAgcmVzb2x1dGlvbj8uc2F2ZUluc3RhbmNlKHtcbiAgICAgICAgICAgIGlkZW50aWZpZXIsXG4gICAgICAgICAgICBpbnN0YW5jZVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVnaXN0ZXJJbnN0YW5jZVNjb3BlUmVzb2x1dGlvbjxUIGV4dGVuZHMgTmV3YWJsZTxJbnN0YW5jZVJlc29sdXRpb24+PihcbiAgICAgICAgc2NvcGU6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmcsXG4gICAgICAgIHJlc29sdXRpb25Db25zdHJ1Y3RvcjogVCxcbiAgICAgICAgY29uc3RydWN0b3JBcmdzPzogQ29uc3RydWN0b3JQYXJhbWV0ZXJzPFQ+XG4gICAgKSB7XG4gICAgICAgIHRoaXMucmVzb2x1dGlvbnMuc2V0KHNjb3BlLCBuZXcgcmVzb2x1dGlvbkNvbnN0cnVjdG9yKC4uLihjb25zdHJ1Y3RvckFyZ3MgPz8gW10pKSk7XG4gICAgfVxuICAgIHJlZ2lzdGVyRXZhbHVhdG9yKG5hbWU6IHN0cmluZywgZXZhbHVhdG9yQ2xhc3M6IE5ld2FibGU8RXZhbHVhdG9yPikge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGV2YWx1YXRvckNsYXNzLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgbWV0YWRhdGEuc2V0U2NvcGUoSW5zdGFuY2VTY29wZS5TSU5HTEVUT04pO1xuICAgICAgICB0aGlzLmV2YWx1YXRvckNsYXNzZXMuc2V0KG5hbWUsIGV2YWx1YXRvckNsYXNzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFJlZ2lzdGVycyBhbiBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3IgY2xhc3MgdG8gY3VzdG9taXplXG4gICAgICogICAgICB0aGUgaW5zdGFudGlhdGlvbiBwcm9jZXNzIGF0IHZhcmlvdXMgc3RhZ2VzIHdpdGhpbiB0aGUgSW9DXG4gICAgICogQGRlcHJlY2F0ZWQgUmVwbGFjZWQgd2l0aCB7QGxpbmsgcmVnaXN0ZXJCZWZvcmVJbnN0YW50aWF0aW9uUHJvY2Vzc29yfSBhbmQge0BsaW5rIHJlZ2lzdGVyQWZ0ZXJJbnN0YW50aWF0aW9uUHJvY2Vzc29yfVxuICAgICAqIEBwYXJhbSB7TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPn0gY2xhenpcbiAgICAgKiBAc2VlIEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3NvclxuICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAqL1xuICAgIHJlZ2lzdGVySW5zdEF3YXJlUHJvY2Vzc29yKGNsYXp6OiBOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+KSB7XG4gICAgICAgIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5hcHBlbmRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyhjbGF6eik7XG4gICAgfVxuICAgIHJlZ2lzdGVyQmVmb3JlSW5zdGFudGlhdGlvblByb2Nlc3Nvcihwcm9jZXNzb3I6IDxUPihjb25zdHJ1Y3RvcjogTmV3YWJsZTxUPiwgYXJnczogdW5rbm93bltdKSA9PiBUIHwgdW5kZWZpbmVkIHwgdm9pZCkge1xuICAgICAgICB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuYXBwZW5kSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoXG4gICAgICAgICAgICBjbGFzcyBJbm5lclByb2Nlc3NvciBpbXBsZW1lbnRzIFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3Ige1xuICAgICAgICAgICAgICAgIGJlZm9yZUluc3RhbnRpYXRpb248VD4oY29uc3RydWN0b3I6IE5ld2FibGU8VD4sIGFyZ3M6IHVua25vd25bXSk6IHZvaWQgfCBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3Nvcihjb25zdHJ1Y3RvciwgYXJncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbiAgICByZWdpc3RlckFmdGVySW5zdGFudGlhdGlvblByb2Nlc3Nvcihwcm9jZXNzb3I6IDxUIGV4dGVuZHMgb2JqZWN0PihpbnN0YW5jZTogVCkgPT4gVCkge1xuICAgICAgICB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuYXBwZW5kSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoXG4gICAgICAgICAgICBjbGFzcyBJbm5lclByb2Nlc3NvciBpbXBsZW1lbnRzIFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3Ige1xuICAgICAgICAgICAgICAgIGFmdGVySW5zdGFudGlhdGlvbjxUIGV4dGVuZHMgb2JqZWN0PihpbnN0YW5jZTogVCk6IFQge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvY2Vzc29yKGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuICAgIG9uUHJlRGVzdHJveShsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudEVtaXR0ZXIub24oUFJFX0RFU1RST1lfRVZFTlRfS0VZLCBsaXN0ZW5lcik7XG4gICAgfVxuICAgIG9uUHJlRGVzdHJveVRoYXQobGlzdGVuZXI6IChpbnN0YW5jZTogb2JqZWN0KSA9PiB2b2lkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50RW1pdHRlci5vbihQUkVfREVTVFJPWV9USEFUX0VWRU5UX0tFWSwgbGlzdGVuZXIpO1xuICAgIH1cbiAgICBnZXRDbGFzc01ldGFkYXRhPFQ+KGN0b3I6IE5ld2FibGU8VD4pIHtcbiAgICAgICAgcmV0dXJuIENsYXNzTWV0YWRhdGEuZ2V0UmVhZGVyKGN0b3IpIGFzIENsYXNzTWV0YWRhdGFSZWFkZXI8VD47XG4gICAgfVxuICAgIGRlc3Ryb3lUcmFuc2llbnRJbnN0YW5jZTxUPihpbnN0YW5jZTogVCkge1xuICAgICAgICBjb25zdCByZXNvbHV0aW9uID0gdGhpcy5yZXNvbHV0aW9ucy5nZXQoSW5zdGFuY2VTY29wZS5UUkFOU0lFTlQpO1xuICAgICAgICByZXNvbHV0aW9uPy5kZXN0cm95VGhhdCAmJiByZXNvbHV0aW9uLmRlc3Ryb3lUaGF0KGluc3RhbmNlKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBNZXRhZGF0YSwgTWV0YWRhdGFSZWFkZXIgfSBmcm9tICcuLi90eXBlcy9NZXRhZGF0YSc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBBc3BlY3QgfSBmcm9tICcuL0FzcGVjdCc7XG5pbXBvcnQgeyBjcmVhdGVEZWZhdWx0VmFsdWVNYXAsIERlZmF1bHRWYWx1ZU1hcCB9IGZyb20gJy4uL2NvbW1vbi9EZWZhdWx0VmFsdWVNYXAnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi9BZHZpY2UnO1xuXG5leHBvcnQgdHlwZSBVc2VBc3BlY3RNYXAgPSBEZWZhdWx0VmFsdWVNYXA8c3RyaW5nIHwgc3ltYm9sLCBEZWZhdWx0VmFsdWVNYXA8QWR2aWNlLCBBcnJheTxOZXdhYmxlPEFzcGVjdD4+Pj47XG5cbmV4cG9ydCBpbnRlcmZhY2UgVXNlQXNwZWN0TWV0YWRhdGFSZWFkZXIgZXh0ZW5kcyBNZXRhZGF0YVJlYWRlciB7XG4gICAgZ2V0QXNwZWN0cygpOiBVc2VBc3BlY3RNYXA7XG4gICAgZ2V0QXNwZWN0c09mKG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCwgYWR2aWNlOiBBZHZpY2UpOiBBcnJheTxOZXdhYmxlPEFzcGVjdD4+O1xufVxuZXhwb3J0IGNsYXNzIEFPUENsYXNzTWV0YWRhdGEgaW1wbGVtZW50cyBNZXRhZGF0YTxVc2VBc3BlY3RNZXRhZGF0YVJlYWRlciwgTmV3YWJsZTx1bmtub3duPj4ge1xuICAgIHN0YXRpYyBnZXRSZWZsZWN0S2V5KCkge1xuICAgICAgICByZXR1cm4gJ2FvcDp1c2UtYXNwZWN0LW1ldGFkYXRhJztcbiAgICB9XG4gICAgcHJpdmF0ZSBhc3BlY3RNYXA6IFVzZUFzcGVjdE1hcCA9IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcCgoKSA9PiBjcmVhdGVEZWZhdWx0VmFsdWVNYXAoKCkgPT4gW10pKTtcbiAgICBpbml0KCk6IHZvaWQge1xuICAgICAgICAvLyBJR05PUkVcbiAgICB9XG5cbiAgICBhcHBlbmQobWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sLCBhZHZpY2U6IEFkdmljZSwgYXNwZWN0czogQXJyYXk8TmV3YWJsZTxBc3BlY3Q+Pikge1xuICAgICAgICBjb25zdCBhZHZpY2VBc3BlY3RNYXAgPSB0aGlzLmFzcGVjdE1hcC5nZXQobWV0aG9kTmFtZSk7XG4gICAgICAgIGNvbnN0IGV4aXRpbmdBc3BlY3RBcnJheSA9IGFkdmljZUFzcGVjdE1hcC5nZXQoYWR2aWNlKTtcbiAgICAgICAgZXhpdGluZ0FzcGVjdEFycmF5LnB1c2goLi4uYXNwZWN0cyk7XG4gICAgfVxuXG4gICAgcmVhZGVyKCk6IFVzZUFzcGVjdE1ldGFkYXRhUmVhZGVyIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldEFzcGVjdHM6ICgpOiBVc2VBc3BlY3RNYXAgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzcGVjdE1hcDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRBc3BlY3RzT2Y6IChtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2wsIGFkdmljZTogQWR2aWNlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNwZWN0TWFwLmdldChtZXRob2ROYW1lKS5nZXQoYWR2aWNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmZ1bmN0aW9uIGdldE1ldGhvZERlc2NyaXB0b3JzKHByb3RvdHlwZTogb2JqZWN0KTogUmVjb3JkPHN0cmluZywgUHJvcGVydHlEZXNjcmlwdG9yPiB7XG4gICAgaWYgKFxuICAgICAgICB0eXBlb2YgcHJvdG90eXBlICE9PSAnb2JqZWN0JyB8fFxuICAgICAgICBwcm90b3R5cGUgPT09IG51bGwgfHxcbiAgICAgICAgT2JqZWN0LnByb3RvdHlwZSA9PT0gcHJvdG90eXBlIHx8XG4gICAgICAgIEZ1bmN0aW9uLnByb3RvdHlwZSA9PT0gcHJvdG90eXBlXG4gICAgKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgY29uc3Qgc3VwZXJQcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG90eXBlKTtcbiAgICBjb25zdCBzdXBlckRlc2NyaXB0b3JzID0gc3VwZXJQcm90b3R5cGUgPT09IHByb3RvdHlwZSA/IHt9IDogZ2V0TWV0aG9kRGVzY3JpcHRvcnMoc3VwZXJQcm90b3R5cGUpO1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHN1cGVyRGVzY3JpcHRvcnMsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHByb3RvdHlwZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsTWV0aG9kTWVtYmVyTmFtZXM8VD4oY2xzOiBOZXdhYmxlPFQ+KSB7XG4gICAgY29uc3QgZGVzY3JpcHRvcnMgPSBnZXRNZXRob2REZXNjcmlwdG9ycyhjbHMucHJvdG90eXBlKTtcbiAgICBkZWxldGUgZGVzY3JpcHRvcnNbJ2NvbnN0cnVjdG9yJ107XG4gICAgY29uc3QgbWV0aG9kTmFtZXMgPSBuZXcgU2V0PHN0cmluZyB8IHN5bWJvbD4oKTtcbiAgICBSZWZsZWN0Lm93bktleXMoZGVzY3JpcHRvcnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgY29uc3QgbWVtYmVyID0gY2xzLnByb3RvdHlwZVtrZXldO1xuICAgICAgICBpZiAodHlwZW9mIG1lbWJlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbWV0aG9kTmFtZXMuYWRkKGtleSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbWV0aG9kTmFtZXM7XG59XG4iLCJpbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBnZXRBbGxNZXRob2RNZW1iZXJOYW1lcyB9IGZyb20gJy4uL2NvbW1vbi9nZXRBbGxNZXRob2RNZW1iZXJOYW1lcyc7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5cbnR5cGUgTWVtYmVySWRlbnRpZmllciA9IHN0cmluZyB8IHN5bWJvbDtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBvaW50Y3V0IHtcbiAgICBzdGF0aWMgY29tYmluZSguLi5wb2ludGN1dHM6IFBvaW50Y3V0W10pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBPclBvaW50Y3V0KHBvaW50Y3V0cyk7XG4gICAgfVxuICAgIHN0YXRpYyBvZjxUPihjbHM6IE5ld2FibGU8VD4sIC4uLm1ldGhvZE5hbWVzOiBNZW1iZXJJZGVudGlmaWVyW10pIHtcbiAgICAgICAgY29uc3QgZW50cmllcyA9IG5ldyBNYXA8TmV3YWJsZTx1bmtub3duPiwgU2V0PE1lbWJlcklkZW50aWZpZXI+PigpO1xuICAgICAgICBjb25zdCBtZXRob2RzID0gbmV3IFNldDxNZW1iZXJJZGVudGlmaWVyPihtZXRob2ROYW1lcyBhcyBNZW1iZXJJZGVudGlmaWVyW10pO1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgZ2V0QWxsTWV0aG9kTWVtYmVyTmFtZXMoY2xzKS5mb3JFYWNoKG1ldGhvZE5hbWUgPT4ge1xuICAgICAgICAgICAgICAgIG1ldGhvZHMuYWRkKG1ldGhvZE5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZW50cmllcy5zZXQoY2xzLCBtZXRob2RzKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcmVjaXRlUG9pbnRjdXQoZW50cmllcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkXG4gICAgICovXG4gICAgc3RhdGljIHRlc3RNYXRjaDxUPihjbHM6IE5ld2FibGU8VD4sIHJlZ2V4OiBSZWdFeHApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2goY2xzLCByZWdleCk7XG4gICAgfVxuICAgIHN0YXRpYyBtYXRjaDxUPihjbHM6IE5ld2FibGU8VD4sIHJlZ2V4OiBSZWdFeHApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNZW1iZXJNYXRjaFBvaW50Y3V0KGNscywgcmVnZXgpO1xuICAgIH1cbiAgICBzdGF0aWMgZnJvbSguLi5jbGFzc2VzOiBBcnJheTxOZXdhYmxlPHVua25vd24+Pikge1xuICAgICAgICBjb25zdCBvZiA9ICguLi5tZXRob2ROYW1lczogTWVtYmVySWRlbnRpZmllcltdKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE9yUG9pbnRjdXQoY2xhc3Nlcy5tYXAoY2xzID0+IFBvaW50Y3V0Lm9mKGNscywgLi4ubWV0aG9kTmFtZXMpKSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IG1hdGNoID0gKHJlZ2V4OiBSZWdFeHApID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgT3JQb2ludGN1dChcbiAgICAgICAgICAgICAgICBjbGFzc2VzLm1hcChjbHMgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE1lbWJlck1hdGNoUG9pbnRjdXQoY2xzLCByZWdleCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvZixcbiAgICAgICAgICAgIG1hdGNoLFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0ZXN0TWF0Y2g6IG1hdGNoXG4gICAgICAgIH07XG4gICAgfVxuICAgIHN0YXRpYyBtYXJrZWQodHlwZTogc3RyaW5nIHwgc3ltYm9sLCB2YWx1ZTogdW5rbm93biA9IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNYXJrZWRQb2ludGN1dCh0eXBlLCB2YWx1ZSk7XG4gICAgfVxuICAgIHN0YXRpYyBjbGFzczxUPihjbHM6IE5ld2FibGU8VD4pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDbGFzc1BvaW50Y3V0KGNscyk7XG4gICAgfVxuICAgIGFic3RyYWN0IHRlc3QoanBJZGVudGlmaWVyOiBJZGVudGlmaWVyLCBqcE1lbWJlcjogc3RyaW5nIHwgc3ltYm9sKTogYm9vbGVhbjtcbn1cblxuY2xhc3MgT3JQb2ludGN1dCBleHRlbmRzIFBvaW50Y3V0IHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBvaW50Y3V0czogUG9pbnRjdXRbXSkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICB0ZXN0KGpwSWRlbnRpZmllcjogSWRlbnRpZmllciwganBNZW1iZXI6IHN0cmluZyB8IHN5bWJvbCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb2ludGN1dHMuc29tZShpdCA9PiBpdC50ZXN0KGpwSWRlbnRpZmllciwganBNZW1iZXIpKTtcbiAgICB9XG59XG5cbmNsYXNzIFByZWNpdGVQb2ludGN1dCBleHRlbmRzIFBvaW50Y3V0IHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG1ldGhvZEVudHJpZXM6IE1hcDxJZGVudGlmaWVyLCBTZXQ8TWVtYmVySWRlbnRpZmllcj4+KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHRlc3QoanBJZGVudGlmaWVyOiBJZGVudGlmaWVyLCBqcE1lbWJlcjogc3RyaW5nIHwgc3ltYm9sKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IG1lbWJlcnMgPSB0aGlzLm1ldGhvZEVudHJpZXMuZ2V0KGpwSWRlbnRpZmllcik7XG4gICAgICAgIHJldHVybiAhIW1lbWJlcnMgJiYgbWVtYmVycy5oYXMoanBNZW1iZXIpO1xuICAgIH1cbn1cbmNsYXNzIE1hcmtlZFBvaW50Y3V0IGV4dGVuZHMgUG9pbnRjdXQge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbWFya2VkVHlwZTogc3RyaW5nIHwgc3ltYm9sLCBwcml2YXRlIG1hcmtlZFZhbHVlOiB1bmtub3duID0gdHJ1ZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICB0ZXN0KGpwSWRlbnRpZmllcjogSWRlbnRpZmllciwganBNZW1iZXI6IHN0cmluZyB8IHN5bWJvbCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodHlwZW9mIGpwSWRlbnRpZmllciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoanBJZGVudGlmaWVyLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgY29uc3QgbWFya0luZm8gPSBtZXRhZGF0YS5yZWFkZXIoKS5nZXRNZW1iZXJzTWFya0luZm8oanBNZW1iZXIpO1xuICAgICAgICByZXR1cm4gbWFya0luZm9bdGhpcy5tYXJrZWRUeXBlXSA9PT0gdGhpcy5tYXJrZWRWYWx1ZTtcbiAgICB9XG59XG5jbGFzcyBNZW1iZXJNYXRjaFBvaW50Y3V0IGV4dGVuZHMgUG9pbnRjdXQge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY2xheno6IE5ld2FibGU8dW5rbm93bj4sIHByaXZhdGUgcmVnZXg6IFJlZ0V4cCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICB0ZXN0KGpwSWRlbnRpZmllcjogSWRlbnRpZmllciwganBNZW1iZXI6IHN0cmluZyB8IHN5bWJvbCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4ganBJZGVudGlmaWVyID09PSB0aGlzLmNsYXp6ICYmIHR5cGVvZiBqcE1lbWJlciA9PT0gJ3N0cmluZycgJiYgISF0aGlzLnJlZ2V4LnRlc3QoanBNZW1iZXIpO1xuICAgIH1cbn1cbmNsYXNzIENsYXNzUG9pbnRjdXQgZXh0ZW5kcyBQb2ludGN1dCB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjbGF6ejogTmV3YWJsZTx1bmtub3duPikge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICB0ZXN0KGpwSWRlbnRpZmllcjogSWRlbnRpZmllcik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4ganBJZGVudGlmaWVyID09PSB0aGlzLmNsYXp6O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi9Qb2ludGN1dCc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuL0FkdmljZSc7XG5pbXBvcnQgeyBBc3BlY3RNZXRhZGF0YSB9IGZyb20gJy4vQXNwZWN0TWV0YWR0YSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRBc3BlY3QoXG4gICAgY29tcG9uZW50QXNwZWN0Q2xhc3M6IE5ld2FibGU8dW5rbm93bj4sXG4gICAgbWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sLFxuICAgIGFkdmljZTogQWR2aWNlLFxuICAgIHBvaW50Y3V0OiBQb2ludGN1dFxuKSB7XG4gICAgQXNwZWN0TWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5hcHBlbmQoY29tcG9uZW50QXNwZWN0Q2xhc3MsIG1ldGhvZE5hbWUsIGFkdmljZSwgcG9pbnRjdXQpO1xuICAgIC8vIGNvbnN0IEFzcGVjdENsYXNzID0gQ29tcG9uZW50TWV0aG9kQXNwZWN0LmNyZWF0ZShjb21wb25lbnRBc3BlY3RDbGFzcywgbWV0aG9kTmFtZSk7XG4gICAgLy8gcG9pbnRjdXQuZ2V0TWV0aG9kc01hcCgpLmZvckVhY2goKGpwTWVtYmVycywganBDbGFzcykgPT4ge1xuICAgIC8vICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGpwQ2xhc3MsIEFPUENsYXNzTWV0YWRhdGEpO1xuICAgIC8vICAgICBqcE1lbWJlcnMuZm9yRWFjaChtZXRob2ROYW1lID0+IHtcbiAgICAvLyAgICAgICAgIG1ldGFkYXRhLmFwcGVuZChtZXRob2ROYW1lLCBhZHZpY2UsIFtBc3BlY3RDbGFzc10pO1xuICAgIC8vICAgICB9KTtcbiAgICAvLyB9KTtcbn1cbiIsImltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi4vUG9pbnRjdXQnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi4vQWR2aWNlJztcbmltcG9ydCB7IGFkZEFzcGVjdCB9IGZyb20gJy4uL2FkZEFzcGVjdCc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBBZnRlcihwb2ludGN1dDogUG9pbnRjdXQpOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICBhZGRBc3BlY3QodGFyZ2V0LmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dW5rbm93bj4sIHByb3BlcnR5S2V5LCBBZHZpY2UuQWZ0ZXIsIHBvaW50Y3V0KTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgUG9pbnRjdXQgfSBmcm9tICcuLi9Qb2ludGN1dCc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuLi9BZHZpY2UnO1xuaW1wb3J0IHsgYWRkQXNwZWN0IH0gZnJvbSAnLi4vYWRkQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi8uLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIEFmdGVyUmV0dXJuKHBvaW50Y3V0OiBQb2ludGN1dCk6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgIGFkZEFzcGVjdCh0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTx1bmtub3duPiwgcHJvcGVydHlLZXksIEFkdmljZS5BZnRlclJldHVybiwgcG9pbnRjdXQpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBQb2ludGN1dCB9IGZyb20gJy4uL1BvaW50Y3V0JztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4uL0FkdmljZSc7XG5pbXBvcnQgeyBhZGRBc3BlY3QgfSBmcm9tICcuLi9hZGRBc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uLy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gQXJvdW5kKHBvaW50Y3V0OiBQb2ludGN1dCk6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgIGFkZEFzcGVjdCh0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTx1bmtub3duPiwgcHJvcGVydHlLZXksIEFkdmljZS5Bcm91bmQsIHBvaW50Y3V0KTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgUG9pbnRjdXQgfSBmcm9tICcuLi9Qb2ludGN1dCc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuLi9BZHZpY2UnO1xuaW1wb3J0IHsgYWRkQXNwZWN0IH0gZnJvbSAnLi4vYWRkQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi8uLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIEJlZm9yZShwb2ludGN1dDogUG9pbnRjdXQpOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICBhZGRBc3BlY3QodGFyZ2V0LmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dW5rbm93bj4sIHByb3BlcnR5S2V5LCBBZHZpY2UuQmVmb3JlLCBwb2ludGN1dCk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi4vUG9pbnRjdXQnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi4vQWR2aWNlJztcbmltcG9ydCB7IGFkZEFzcGVjdCB9IGZyb20gJy4uL2FkZEFzcGVjdCc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBGaW5hbGx5KHBvaW50Y3V0OiBQb2ludGN1dCk6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgIGFkZEFzcGVjdCh0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTx1bmtub3duPiwgcHJvcGVydHlLZXksIEFkdmljZS5GaW5hbGx5LCBwb2ludGN1dCk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi4vUG9pbnRjdXQnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi4vQWR2aWNlJztcbmltcG9ydCB7IGFkZEFzcGVjdCB9IGZyb20gJy4uL2FkZEFzcGVjdCc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBUaHJvd24ocG9pbnRjdXQ6IFBvaW50Y3V0KTogTWV0aG9kRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgYWRkQXNwZWN0KHRhcmdldC5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPHVua25vd24+LCBwcm9wZXJ0eUtleSwgQWR2aWNlLlRocm93biwgcG9pbnRjdXQpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuLi9BZHZpY2UnO1xuaW1wb3J0IHsgQXNwZWN0LCBQcm9jZWVkaW5nQXNwZWN0IH0gZnJvbSAnLi4vQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi8uLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IGFkZEFzcGVjdCB9IGZyb20gJy4uL2FkZEFzcGVjdCc7XG5pbXBvcnQgeyBQb2ludGN1dCB9IGZyb20gJy4uL1BvaW50Y3V0JztcblxuZnVuY3Rpb24gVXNlQXNwZWN0cyhhZHZpY2U6IEFkdmljZS5Bcm91bmQsIGFzcGVjdHM6IEFycmF5PE5ld2FibGU8UHJvY2VlZGluZ0FzcGVjdD4+KTogTWV0aG9kRGVjb3JhdG9yO1xuZnVuY3Rpb24gVXNlQXNwZWN0cyhhZHZpY2U6IEFkdmljZSwgYXNwZWN0czogQXJyYXk8TmV3YWJsZTxBc3BlY3Q+Pik6IE1ldGhvZERlY29yYXRvcjtcbmZ1bmN0aW9uIFVzZUFzcGVjdHMoYWR2aWNlOiBBZHZpY2UsIGFzcGVjdHM6IEFycmF5PE5ld2FibGU8QXNwZWN0Pj4pOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICBjb25zdCBjbGF6eiA9IHRhcmdldC5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPHR5cGVvZiB0YXJnZXQ+O1xuICAgICAgICBhc3BlY3RzLmZvckVhY2goYXNwZWN0Q2xhc3MgPT4ge1xuICAgICAgICAgICAgYWRkQXNwZWN0KGFzcGVjdENsYXNzLCAnZXhlY3V0ZScsIGFkdmljZSwgUG9pbnRjdXQub2YoY2xhenosIHByb3BlcnR5S2V5KSk7XG4gICAgICAgIH0pO1xuICAgIH07XG59XG5cbmV4cG9ydCB7IFVzZUFzcGVjdHMgfTtcbiIsImltcG9ydCB7IEZhY3RvcnkgfSBmcm9tICcuLi9kZWNvcmF0b3JzJztcbmltcG9ydCB7IEZhY3RvcnlJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvRmFjdG9yeUlkZW50aWZpZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRmFjdG9yeVdyYXBwZXI8VD4ocHJvZHVjZUlkZW50aWZpZXI6IEZhY3RvcnlJZGVudGlmaWVyLCBwcm9kdWNlOiB1bmtub3duLCBvd25lcjogVCk6IFQge1xuICAgIGNsYXNzIFRoZUZhY3Rvcnkge1xuICAgICAgICBARmFjdG9yeShwcm9kdWNlSWRlbnRpZmllcilcbiAgICAgICAgcHJvZHVjZSgpIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9kdWNlO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRpYyBwcmV2ZW50VHJlZVNoYWtpbmcoKSB7XG4gICAgICAgICAgICByZXR1cm4gb3duZXI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFRoZUZhY3RvcnkucHJldmVudFRyZWVTaGFraW5nKCk7XG59Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBWSxjQUlYO0FBSkQsQ0FBQSxVQUFZLGFBQWEsRUFBQTtBQUNyQixJQUFBLGFBQUEsQ0FBQSxXQUFBLENBQUEsR0FBQSxvQ0FBZ0QsQ0FBQTtBQUNoRCxJQUFBLGFBQUEsQ0FBQSxXQUFBLENBQUEsR0FBQSwwQkFBc0MsQ0FBQTtBQUN0QyxJQUFBLGFBQUEsQ0FBQSx5QkFBQSxDQUFBLEdBQUEsd0NBQWtFLENBQUE7QUFDdEUsQ0FBQyxFQUpXLGFBQWEsS0FBYixhQUFhLEdBSXhCLEVBQUEsQ0FBQSxDQUFBOztBQ0pLLFNBQVUscUJBQXFCLENBQU8sT0FBc0IsRUFBQTtBQUM5RCxJQUFBLElBQU0sR0FBRyxHQUFHLElBQUksR0FBRyxFQUFRLENBQUM7SUFDNUIsSUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FB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
