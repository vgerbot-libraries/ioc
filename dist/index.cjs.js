'use strict';

require('reflect-metadata');
var lazy = require('@vgerbot/lazy');

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

exports.InstanceScope = void 0;
(function (InstanceScope) {
    InstanceScope["SINGLETON"] = "ioc-resolution:container-singleton";
    InstanceScope["TRANSIENT"] = "ioc-resolution:transient";
    InstanceScope["GLOBAL_SHARED_SINGLETON"] = "ioc-resolution:global-shared-singleton";
})(exports.InstanceScope || (exports.InstanceScope = {}));

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
        this.scope = exports.InstanceScope.SINGLETON;
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
    return Value(name, exports.ExpressionType.ARGV, argv);
}

function Bind(aliasName) {
    return function (target) {
        var metadata = MetadataInstanceManager.getMetadata(target, ClassMetadata);
        GlobalMetadata.getInstance().recordClassAlias(aliasName, metadata);
    };
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

exports.Lifecycle = void 0;
(function (Lifecycle) {
    Lifecycle["PRE_INJECT"] = "ioc-scope:pre-inject";
    Lifecycle["POST_INJECT"] = "ioc-scope:post-inject";
    Lifecycle["PRE_DESTROY"] = "ioc-scope:pre-destroy";
})(exports.Lifecycle || (exports.Lifecycle = {}));

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
        var resolution = this.resolutions.get(exports.InstanceScope.SINGLETON);
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

exports.AOPClassMetadata = AOPClassMetadata;
exports.After = After;
exports.AfterReturn = AfterReturn;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguY2pzLmpzIiwic291cmNlcyI6WyIuLi9zcmMvZm91bmRhdGlvbi9JbnN0YW5jZVNjb3BlLnRzIiwiLi4vc3JjL2NvbW1vbi9EZWZhdWx0VmFsdWVNYXAudHMiLCIuLi9zcmMvbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIudHMiLCIuLi9zcmMvbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YS50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL1NlcnZpY2VGYWN0b3J5RGVmLnRzIiwiLi4vc3JjL2NvbW1vbi9GYWN0b3J5UmVjb3JkZXIudHMiLCIuLi9zcmMvbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEudHMiLCIuLi9zcmMvdHlwZXMvRXZhbHVhdGVPcHRpb25zLnRzIiwiLi4vc3JjL2NvbW1vbi9pc05vZGVKcy50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL1ZhbHVlLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvQXJndi50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0JpbmQudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9FbnYudHMiLCIuLi9zcmMvY29tbW9uL2lzTm90RGVmaW5lZC50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0ZhY3RvcnkudHMiLCIuLi9zcmMvbWV0YWRhdGEvRnVuY3Rpb25NZXRhZGF0YS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0dlbmVyYXRlLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvSW5qZWN0LnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvSW5qZWN0YWJsZS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0luc3RBd2FyZVByb2Nlc3Nvci50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0pTT05EYXRhLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvTGlmZWN5Y2xlRGVjb3JhdG9yLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvTWFyay50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0xpZmVjeWNsZS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL1Bvc3RJbmplY3QudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9QcmVEZXN0cm95LnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvUHJlSW5qZWN0LnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvU2NvcGUudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9FdmVudEVtaXR0ZXIudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9JbnZva2VGdW5jdGlvbk9wdGlvbnMudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9MaWZlY3ljbGVNYW5hZ2VyLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vQ29tcG9uZW50SW5zdGFuY2VXcmFwcGVyLnRzIiwiLi4vc3JjL2NvbW1vbi9pbnZva2VQcmVEZXN0cm95LnRzIiwiLi4vc3JjL3Jlc29sdXRpb24vU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uLnRzIiwiLi4vc3JjL3Jlc29sdXRpb24vR2xvYmFsU2hhcmVkSW5zdGFuY2VSZXNvbHV0aW9uLnRzIiwiLi4vc3JjL3Jlc29sdXRpb24vVHJhbnNpZW50SW5zdGFuY2VSZXNvbHV0aW9uLnRzIiwiLi4vc3JjL2V2YWx1YXRvci9KU09ORGF0YUV2YWx1YXRvci50cyIsIi4uL3NyYy9ldmFsdWF0b3IvRW52aXJvbm1lbnRFdmFsdWF0b3IudHMiLCIuLi9zcmMvZXZhbHVhdG9yL0FyZ3ZFdmFsdWF0b3IudHMiLCIuLi9zcmMvYW9wL0FkdmljZS50cyIsIi4uL3NyYy9hb3AvQXNwZWN0VXRpbHMudHMiLCIuLi9zcmMvYW9wL2NyZWF0ZUFzcGVjdC50cyIsIi4uL3NyYy9hb3AvQ29tcG9uZW50TWV0aG9kQXNwZWN0LnRzIiwiLi4vc3JjL2FvcC9Bc3BlY3RNZXRhZHRhLnRzIiwiLi4vc3JjL2FvcC9BT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3IudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9JbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vQXBwbGljYXRpb25Db250ZXh0LnRzIiwiLi4vc3JjL2FvcC9BT1BDbGFzc01ldGFkYXRhLnRzIiwiLi4vc3JjL2NvbW1vbi9nZXRBbGxNZXRob2RNZW1iZXJOYW1lcy50cyIsIi4uL3NyYy9hb3AvUG9pbnRjdXQudHMiLCIuLi9zcmMvYW9wL2FkZEFzcGVjdC50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9BZnRlci50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9BZnRlclJldHVybi50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9Bcm91bmQudHMiLCIuLi9zcmMvYW9wL2RlY29yYXRvcnMvQmVmb3JlLnRzIiwiLi4vc3JjL2FvcC9kZWNvcmF0b3JzL0ZpbmFsbHkudHMiLCIuLi9zcmMvYW9wL2RlY29yYXRvcnMvVGhyb3duLnRzIiwiLi4vc3JjL2FvcC9kZWNvcmF0b3JzL1VzZUFzcGVjdHMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGVudW0gSW5zdGFuY2VTY29wZSB7XG4gICAgU0lOR0xFVE9OID0gJ2lvYy1yZXNvbHV0aW9uOmNvbnRhaW5lci1zaW5nbGV0b24nLFxuICAgIFRSQU5TSUVOVCA9ICdpb2MtcmVzb2x1dGlvbjp0cmFuc2llbnQnLFxuICAgIEdMT0JBTF9TSEFSRURfU0lOR0xFVE9OID0gJ2lvYy1yZXNvbHV0aW9uOmdsb2JhbC1zaGFyZWQtc2luZ2xldG9uJ1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURlZmF1bHRWYWx1ZU1hcDxLLCBWPihmYWN0b3J5OiAoa2V5OiBLKSA9PiBWKSB7XG4gICAgY29uc3QgbWFwID0gbmV3IE1hcDxLLCBWPigpO1xuICAgIGNvbnN0IG9yaWdpbkdldCA9IG1hcC5nZXQuYmluZChtYXApO1xuICAgIG1hcC5nZXQgPSBmdW5jdGlvbiAoa2V5OiBLKSB7XG4gICAgICAgIGlmIChtYXAuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiBvcmlnaW5HZXQoa2V5KSBhcyBWO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFZhbHVlID0gZmFjdG9yeShrZXkpO1xuICAgICAgICAgICAgbWFwLnNldChrZXksIGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gbWFwLmdldChrZXkpIGFzIFY7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBtYXAgYXMgRGVmYXVsdFZhbHVlTWFwPEssIFY+O1xufVxuZXhwb3J0IHR5cGUgRGVmYXVsdFZhbHVlTWFwPEssIFY+ID0gT21pdDxNYXA8SywgVj4sICdnZXQnPiAmIHtcbiAgICBnZXQ6IChrZXk6IEspID0+IFY7XG59O1xuIiwiaW1wb3J0IHsgTWV0YWRhdGEsIE1ldGFkYXRhQ2xhc3MsIE1ldGFkYXRhUmVhZGVyIH0gZnJvbSAnLi4vdHlwZXMvTWV0YWRhdGEnO1xuaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcCB9IGZyb20gJy4uL2NvbW1vbi9EZWZhdWx0VmFsdWVNYXAnO1xuXG50eXBlIEFueU1ldGFkYXRhID0gTWV0YWRhdGE8TWV0YWRhdGFSZWFkZXIsIHVua25vd24+O1xudHlwZSBBbnlNZXRhZGF0YUNsYXNzID0gTWV0YWRhdGFDbGFzczxNZXRhZGF0YVJlYWRlciwgdW5rbm93biwgQW55TWV0YWRhdGE+O1xuXG5jb25zdCBtZXRhZGF0YUluc3RhbmNlTWFwID0gY3JlYXRlRGVmYXVsdFZhbHVlTWFwPEFueU1ldGFkYXRhQ2xhc3MsIFNldDxBbnlNZXRhZGF0YT4+KCgpID0+IG5ldyBTZXQoKSk7XG5cbmV4cG9ydCBjbGFzcyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB7XG4gICAgc3RhdGljIGdldE1ldGFkYXRhPFIgZXh0ZW5kcyBNZXRhZGF0YVJlYWRlciwgVCBleHRlbmRzIE9iamVjdCwgTSBleHRlbmRzIE1ldGFkYXRhPFIsIFQ+ID0gTWV0YWRhdGE8UiwgVD4+KFxuICAgICAgICB0YXJnZXQ6IFQsXG4gICAgICAgIG1ldGFkYXRhQ2xhc3M6IE1ldGFkYXRhQ2xhc3M8UiwgVCwgTT5cbiAgICApIHtcbiAgICAgICAgY29uc3Qga2V5ID0gbWV0YWRhdGFDbGFzcy5nZXRSZWZsZWN0S2V5KCk7XG4gICAgICAgIGxldCBtZXRhZGF0YSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoa2V5LCB0YXJnZXQpO1xuICAgICAgICBpZiAoIW1ldGFkYXRhKSB7XG4gICAgICAgICAgICBtZXRhZGF0YSA9IG5ldyBtZXRhZGF0YUNsYXNzKCk7XG4gICAgICAgICAgICBtZXRhZGF0YS5pbml0KHRhcmdldCk7XG4gICAgICAgICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKGtleSwgbWV0YWRhdGEsIHRhcmdldCk7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZVNldCA9IG1ldGFkYXRhSW5zdGFuY2VNYXAuZ2V0KG1ldGFkYXRhQ2xhc3MpO1xuICAgICAgICAgICAgaW5zdGFuY2VTZXQuYWRkKG1ldGFkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWV0YWRhdGEgYXMgTTtcbiAgICB9XG4gICAgc3RhdGljIGdldEFsbEluc3RhbmNlb2Y8TSBleHRlbmRzIEFueU1ldGFkYXRhQ2xhc3M+KG1ldGFkYXRhQ2xhc3M6IE0pIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obWV0YWRhdGFJbnN0YW5jZU1hcC5nZXQobWV0YWRhdGFDbGFzcykpO1xuICAgIH1cbn1cbiIsIi8vIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbmltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luc3RhbmNlU2NvcGUnO1xuaW1wb3J0IHsgSnNTZXJ2aWNlQ2xhc3MgfSBmcm9tICcuLi90eXBlcy9Kc1NlcnZpY2VDbGFzcyc7XG5pbXBvcnQgeyBNZXRhZGF0YSwgTWV0YWRhdGFSZWFkZXIgfSBmcm9tICcuLi90eXBlcy9NZXRhZGF0YSc7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBjcmVhdGVEZWZhdWx0VmFsdWVNYXAgfSBmcm9tICcuLi9jb21tb24vRGVmYXVsdFZhbHVlTWFwJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBNZW1iZXJLZXkgfSBmcm9tICcuLi90eXBlcy9NZW1iZXJLZXknO1xuaW1wb3J0IHsgS2V5T2YgfSBmcm9tICcuLi90eXBlcy9LZXlPZic7XG5cbmNvbnN0IENMQVNTX01FVEFEQVRBX0tFWSA9ICdpb2M6Y2xhc3MtbWV0YWRhdGEnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1hcmtJbmZvIHtcbiAgICBba2V5OiBzdHJpbmcgfCBzeW1ib2xdOiB1bmtub3duO1xufVxuXG5leHBvcnQgY2xhc3MgTWFya0luZm9Db250YWluZXIge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbWFwID0gY3JlYXRlRGVmYXVsdFZhbHVlTWFwPE1lbWJlcktleSwgTWFya0luZm8+KCgpID0+ICh7fSBhcyBNYXJrSW5mbykpO1xuICAgIGdldE1hcmtJbmZvKG1ldGhvZDogTWVtYmVyS2V5KTogTWFya0luZm8ge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXAuZ2V0KG1ldGhvZCk7XG4gICAgfVxuICAgIG1hcmsobWV0aG9kOiBNZW1iZXJLZXksIGtleTogTWVtYmVyS2V5LCB2YWx1ZTogdW5rbm93bikge1xuICAgICAgICBjb25zdCBtYXJrSW5mbyA9IHRoaXMubWFwLmdldChtZXRob2QpO1xuICAgICAgICBtYXJrSW5mb1trZXldID0gdmFsdWU7XG4gICAgfVxuICAgIGdldE1lbWJlcnMoKSB7XG4gICAgICAgIHJldHVybiBuZXcgU2V0KHRoaXMubWFwLmtleXMoKSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGFyYW1ldGVyTWFya0luZm9Db250YWluZXIge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbWFwID0gY3JlYXRlRGVmYXVsdFZhbHVlTWFwPE1lbWJlcktleSwgUmVjb3JkPG51bWJlciwgTWFya0luZm8+PigoKSA9PiB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9KTtcbiAgICBnZXRNYXJrSW5mbyhtZXRob2Q6IE1lbWJlcktleSk6IFJlY29yZDxudW1iZXIsIE1hcmtJbmZvPiB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcC5nZXQobWV0aG9kKTtcbiAgICB9XG4gICAgbWFyayhtZXRob2Q6IE1lbWJlcktleSwgaW5kZXg6IG51bWJlciwga2V5OiBNZW1iZXJLZXksIHZhbHVlOiB1bmtub3duKSB7XG4gICAgICAgIGNvbnN0IHBhcmFtc01hcmtJbmZvID0gdGhpcy5tYXAuZ2V0KG1ldGhvZCk7XG4gICAgICAgIGNvbnN0IG1hcmtJbmZvID0gcGFyYW1zTWFya0luZm9baW5kZXhdIHx8IHt9O1xuICAgICAgICBtYXJrSW5mb1trZXldID0gdmFsdWU7XG4gICAgICAgIHBhcmFtc01hcmtJbmZvW2luZGV4XSA9IG1hcmtJbmZvO1xuICAgIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBDbGFzc01hcmtJbmZvIHtcbiAgICBjdG9yOiBNYXJrSW5mbztcbiAgICBtZW1iZXJzOiBNYXJrSW5mb0NvbnRhaW5lcjtcbiAgICBwYXJhbXM6IFBhcmFtZXRlck1hcmtJbmZvQ29udGFpbmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENsYXNzTWV0YWRhdGFSZWFkZXI8VD4gZXh0ZW5kcyBNZXRhZGF0YVJlYWRlciB7XG4gICAgZ2V0Q2xhc3MoKTogTmV3YWJsZTxUPjtcbiAgICBnZXRTY29wZSgpOiBJbnN0YW5jZVNjb3BlIHwgc3RyaW5nO1xuICAgIGdldENvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZXMoKTogQXJyYXk8SWRlbnRpZmllcj47XG4gICAgZ2V0TWV0aG9kcyhsaWZlY3ljbGU6IExpZmVjeWNsZSk6IEFycmF5PHN0cmluZyB8IHN5bWJvbD47XG4gICAgZ2V0UHJvcGVydHlUeXBlTWFwKCk6IE1hcDxzdHJpbmcgfCBzeW1ib2wsIElkZW50aWZpZXI+O1xuICAgIGdldEN0b3JNYXJrSW5mbygpOiBNYXJrSW5mbztcbiAgICBnZXRBbGxNYXJrZWRNZW1iZXJzKCk6IFNldDxNZW1iZXJLZXk+O1xuICAgIGdldE1lbWJlcnNNYXJrSW5mbyhtZXRob2RLZXk6IEtleU9mPFQ+KTogTWFya0luZm87XG4gICAgZ2V0UGFyYW1ldGVyTWFya0luZm8obWV0aG9kS2V5OiBLZXlPZjxUPik6IFJlY29yZDxudW1iZXIsIE1hcmtJbmZvPjtcbn1cblxuZXhwb3J0IGNsYXNzIENsYXNzTWV0YWRhdGE8VD4gaW1wbGVtZW50cyBNZXRhZGF0YTxDbGFzc01ldGFkYXRhUmVhZGVyPFQ+LCBOZXdhYmxlPFQ+PiB7XG4gICAgc3RhdGljIGdldFJlZmxlY3RLZXkoKSB7XG4gICAgICAgIHJldHVybiBDTEFTU19NRVRBREFUQV9LRVk7XG4gICAgfVxuICAgIHByaXZhdGUgc2NvcGU6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmcgPSBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTjtcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZXM6IEFycmF5PElkZW50aWZpZXI+ID0gW107XG4gICAgcHJpdmF0ZSByZWFkb25seSBsaWZlY3ljbGVNZXRob2RzTWFwOiBSZWNvcmQ8c3RyaW5nIHwgc3ltYm9sLCBTZXQ8TGlmZWN5Y2xlPj4gPSB7fTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHByb3BlcnR5VHlwZXNNYXAgPSBuZXcgTWFwPHN0cmluZyB8IHN5bWJvbCwgSWRlbnRpZmllcj4oKTtcbiAgICBwcml2YXRlIGNsYXp6ITogTmV3YWJsZTxUPjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IG1hcmtzOiBDbGFzc01hcmtJbmZvID0ge1xuICAgICAgICBjdG9yOiB7fSxcbiAgICAgICAgbWVtYmVyczogbmV3IE1hcmtJbmZvQ29udGFpbmVyKCksXG4gICAgICAgIHBhcmFtczogbmV3IFBhcmFtZXRlck1hcmtJbmZvQ29udGFpbmVyKClcbiAgICB9O1xuXG4gICAgc3RhdGljIGdldEluc3RhbmNlPFQ+KGN0b3I6IE5ld2FibGU8VD4pIHtcbiAgICAgICAgcmV0dXJuIE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0UmVhZGVyPFQ+KGN0b3I6IE5ld2FibGU8VD4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoY3RvcikucmVhZGVyKCk7XG4gICAgfVxuXG4gICAgaW5pdCh0YXJnZXQ6IE5ld2FibGU8VD4pIHtcbiAgICAgICAgdGhpcy5jbGF6eiA9IHRhcmdldDtcbiAgICAgICAgY29uc3QgY29uc3RyID0gdGFyZ2V0IGFzIEpzU2VydmljZUNsYXNzPHVua25vd24+O1xuICAgICAgICBpZiAodHlwZW9mIGNvbnN0ci5zY29wZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5zZXRTY29wZShjb25zdHIuc2NvcGUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBjb25zdHIuaW5qZWN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zdCBpbmplY3Rpb25zID0gY29uc3RyLmluamVjdCgpO1xuICAgICAgICAgICAgUmVmbGVjdC5vd25LZXlzKGluamVjdGlvbnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlY29yZFByb3BlcnR5VHlwZShrZXksIGluamVjdGlvbnNba2V5XSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGNvbnN0ci5tZXRhZGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBjb25zdHIubWV0YWRhdGEoKTtcbiAgICAgICAgICAgIGlmIChtZXRhZGF0YS5zY29wZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2NvcGUobWV0YWRhdGEuc2NvcGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaW5qZWN0aW9ucyA9IG1ldGFkYXRhLmluamVjdDtcbiAgICAgICAgICAgIGlmIChpbmplY3Rpb25zKSB7XG4gICAgICAgICAgICAgICAgUmVmbGVjdC5vd25LZXlzKGluamVjdGlvbnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWNvcmRQcm9wZXJ0eVR5cGUoa2V5LCBpbmplY3Rpb25zW2tleV0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWFya2VyKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY3RvcjogKGtleTogc3RyaW5nIHwgc3ltYm9sLCB2YWx1ZTogdW5rbm93bikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubWFya3MuY3RvcltrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWVtYmVyOiAocHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCB8IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcms6IChrZXk6IHN0cmluZyB8IHN5bWJvbCwgdmFsdWU6IHVua25vd24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFya3MubWVtYmVycy5tYXJrKHByb3BlcnR5S2V5LCBrZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyYW1ldGVyOiAocHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcms6IChrZXk6IHN0cmluZyB8IHN5bWJvbCwgdmFsdWU6IHVua25vd24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFya3MucGFyYW1zLm1hcmsocHJvcGVydHlLZXksIGluZGV4LCBrZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIHNldFNjb3BlKHNjb3BlOiBJbnN0YW5jZVNjb3BlIHwgc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2NvcGUgPSBzY29wZTtcbiAgICB9XG4gICAgc2V0Q29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlKGluZGV4OiBudW1iZXIsIGNsczogSWRlbnRpZmllcikge1xuICAgICAgICB0aGlzLmNvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZXNbaW5kZXhdID0gY2xzO1xuICAgIH1cbiAgICByZWNvcmRQcm9wZXJ0eVR5cGUocHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCwgdHlwZTogSWRlbnRpZmllcikge1xuICAgICAgICB0aGlzLnByb3BlcnR5VHlwZXNNYXAuc2V0KHByb3BlcnR5S2V5LCB0eXBlKTtcbiAgICB9XG4gICAgYWRkTGlmZWN5Y2xlTWV0aG9kKG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCwgbGlmZWN5Y2xlOiBMaWZlY3ljbGUpIHtcbiAgICAgICAgY29uc3QgbGlmZWN5Y2xlcyA9IHRoaXMuZ2V0TGlmZWN5Y2xlcyhtZXRob2ROYW1lKTtcbiAgICAgICAgbGlmZWN5Y2xlcy5hZGQobGlmZWN5Y2xlKTtcbiAgICAgICAgdGhpcy5saWZlY3ljbGVNZXRob2RzTWFwW21ldGhvZE5hbWVdID0gbGlmZWN5Y2xlcztcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRMaWZlY3ljbGVzKG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5saWZlY3ljbGVNZXRob2RzTWFwW21ldGhvZE5hbWVdIHx8IG5ldyBTZXQ8TGlmZWN5Y2xlPigpO1xuICAgIH1cbiAgICBnZXRNZXRob2RzKGxpZmVjeWNsZTogTGlmZWN5Y2xlKTogQXJyYXk8c3RyaW5nIHwgc3ltYm9sPiB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmxpZmVjeWNsZU1ldGhvZHNNYXApLmZpbHRlcihpdCA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaWZlY3ljbGVzID0gdGhpcy5saWZlY3ljbGVNZXRob2RzTWFwW2l0XTtcbiAgICAgICAgICAgIHJldHVybiBsaWZlY3ljbGVzLmhhcyhsaWZlY3ljbGUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRTdXBlckNsYXNzKCkge1xuICAgICAgICBjb25zdCBzdXBlckNsYXNzUHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMuY2xhenopO1xuICAgICAgICBpZiAoIXN1cGVyQ2xhc3NQcm90b3R5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN1cGVyQ2xhc3MgPSBzdXBlckNsYXNzUHJvdG90eXBlLmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dW5rbm93bj47XG4gICAgICAgIGlmIChzdXBlckNsYXNzID09PSB0aGlzLmNsYXp6KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXJDbGFzcztcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRTdXBlckNsYXNzTWV0YWRhdGEoKTogQ2xhc3NNZXRhZGF0YTx1bmtub3duPiB8IG51bGwge1xuICAgICAgICBjb25zdCBzdXBlckNsYXNzID0gdGhpcy5nZXRTdXBlckNsYXNzKCk7XG4gICAgICAgIGlmICghc3VwZXJDbGFzcykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIENsYXNzTWV0YWRhdGEuZ2V0SW5zdGFuY2Uoc3VwZXJDbGFzcyk7XG4gICAgfVxuICAgIHJlYWRlcigpOiBDbGFzc01ldGFkYXRhUmVhZGVyPFQ+IHtcbiAgICAgICAgY29uc3Qgc3VwZXJSZWFkZXIgPSB0aGlzLmdldFN1cGVyQ2xhc3NNZXRhZGF0YSgpPy5yZWFkZXIoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldENsYXNzOiAoKSA9PiB0aGlzLmNsYXp6LFxuICAgICAgICAgICAgZ2V0U2NvcGU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zY29wZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRDb25zdHJ1Y3RvclBhcmFtZXRlclR5cGVzOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlcy5zbGljZSgwKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRNZXRob2RzOiAobGlmZWN5Y2xlOiBMaWZlY3ljbGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdXBlck1ldGhvZHMgPSBzdXBlclJlYWRlcj8uZ2V0TWV0aG9kcyhsaWZlY3ljbGUpIHx8IFtdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNNZXRob2RzID0gdGhpcy5nZXRNZXRob2RzKGxpZmVjeWNsZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChzdXBlck1ldGhvZHMuY29uY2F0KHRoaXNNZXRob2RzKSkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldFByb3BlcnR5VHlwZU1hcDogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1cGVyUHJvcGVydHlUeXBlTWFwID0gc3VwZXJSZWFkZXI/LmdldFByb3BlcnR5VHlwZU1hcCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNQcm9wZXJ0eVR5cGVzTWFwID0gdGhpcy5wcm9wZXJ0eVR5cGVzTWFwO1xuICAgICAgICAgICAgICAgIGlmICghc3VwZXJQcm9wZXJ0eVR5cGVNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXAodGhpc1Byb3BlcnR5VHlwZXNNYXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgTWFwKHN1cGVyUHJvcGVydHlUeXBlTWFwKTtcbiAgICAgICAgICAgICAgICB0aGlzUHJvcGVydHlUeXBlc01hcC5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRDdG9yTWFya0luZm86ICgpOiBNYXJrSW5mbyA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgLi4udGhpcy5tYXJrcy5jdG9yIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0QWxsTWFya2VkTWVtYmVyczogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1cGVyTWV0aG9kcyA9IHN1cGVyUmVhZGVyPy5nZXRBbGxNYXJrZWRNZW1iZXJzKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGhpc01lbWJlcnMgPSB0aGlzLm1hcmtzLm1lbWJlcnMuZ2V0TWVtYmVycygpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyTWV0aG9kcyA/IG5ldyBTZXQoc3VwZXJNZXRob2RzKSA6IG5ldyBTZXQ8TWVtYmVyS2V5PigpO1xuICAgICAgICAgICAgICAgIHRoaXNNZW1iZXJzLmZvckVhY2goaXQgPT4gcmVzdWx0LmFkZChpdCkpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0TWVtYmVyc01hcmtJbmZvOiAoa2V5OiBLZXlPZjxUPik6IE1hcmtJbmZvID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXJrcy5tZW1iZXJzLmdldE1hcmtJbmZvKGtleSBhcyBNZW1iZXJLZXkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldFBhcmFtZXRlck1hcmtJbmZvOiAobWV0aG9kS2V5OiBLZXlPZjxUPik6IFJlY29yZDxudW1iZXIsIE1hcmtJbmZvPiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFya3MucGFyYW1zLmdldE1hcmtJbmZvKG1ldGhvZEtleSBhcyBNZW1iZXJLZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi4vdHlwZXMvU2VydmljZUZhY3RvcnknO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuXG5leHBvcnQgY2xhc3MgU2VydmljZUZhY3RvcnlEZWY8VD4ge1xuICAgIHN0YXRpYyBjcmVhdGVGcm9tQ2xhc3NNZXRhZGF0YTxUPihtZXRhZGF0YTogQ2xhc3NNZXRhZGF0YTxUPikge1xuICAgICAgICBjb25zdCBkZWYgPSBuZXcgU2VydmljZUZhY3RvcnlEZWYobWV0YWRhdGEucmVhZGVyKCkuZ2V0Q2xhc3MoKSwgdHJ1ZSk7XG4gICAgICAgIGRlZi5hcHBlbmQoKGNvbnRhaW5lcjogQXBwbGljYXRpb25Db250ZXh0LCBvd25lcjogdW5rbm93bikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWFkZXIgPSBtZXRhZGF0YS5yZWFkZXIoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjbGF6eiA9IHJlYWRlci5nZXRDbGFzcygpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXIuZ2V0SW5zdGFuY2UoY2xhenosIG93bmVyKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGVmO1xuICAgIH1cbiAgICBwdWJsaWMgcmVhZG9ubHkgZmFjdG9yaWVzID0gbmV3IE1hcDxTZXJ2aWNlRmFjdG9yeTxULCB1bmtub3duPiwgSWRlbnRpZmllcltdPigpO1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBpZGVudGlmaWVyIFRoZSB1bmlxdWUgaWRlbnRpZmllciBvZiB0aGlzIGZhY3Rvcmllc1xuICAgICAqIEBwYXJhbSBpc1NpbmdsZSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgaWRlbnRpZmllciBkZWZpbmVzIG9ubHkgb25lIGZhY3RvcnkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGlkZW50aWZpZXI6IElkZW50aWZpZXIsIHB1YmxpYyByZWFkb25seSBpc1NpbmdsZTogYm9vbGVhbikge31cbiAgICBhcHBlbmQoZmFjdG9yeTogU2VydmljZUZhY3Rvcnk8VCwgdW5rbm93bj4sIGluamVjdGlvbnM6IElkZW50aWZpZXJbXSA9IFtdKSB7XG4gICAgICAgIGlmICh0aGlzLmlzU2luZ2xlICYmIHRoaXMuZmFjdG9yaWVzLnNpemUgPT09IDEgJiYgIXRoaXMuZmFjdG9yaWVzLmhhcyhmYWN0b3J5KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMuaWRlbnRpZmllci50b1N0cmluZygpfSBpcyBBIHNpbmdsZXRvbiEgQnV0IG11bHRpcGxlIGZhY3RvcmllcyBhcmUgZGVmaW5lZCFgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZhY3Rvcmllcy5zZXQoZmFjdG9yeSwgaW5qZWN0aW9ucyk7XG4gICAgfVxuICAgIHByb2R1Y2UoY29udGFpbmVyOiBBcHBsaWNhdGlvbkNvbnRleHQsIG93bmVyPzogdW5rbm93bikge1xuICAgICAgICBpZiAodGhpcy5pc1NpbmdsZSkge1xuICAgICAgICAgICAgY29uc3QgW2ZhY3RvcnksIGluamVjdGlvbnNdID0gdGhpcy5mYWN0b3JpZXMuZW50cmllcygpLm5leHQoKS52YWx1ZSBhcyBbU2VydmljZUZhY3Rvcnk8VCwgdW5rbm93bj4sIElkZW50aWZpZXJbXV07XG4gICAgICAgICAgICBjb25zdCBmbiA9IGZhY3RvcnkoY29udGFpbmVyLCBvd25lcik7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXIuaW52b2tlKGZuLCB7XG4gICAgICAgICAgICAgICAgICAgIGluamVjdGlvbnNcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBwcm9kdWNlcnMgPSBBcnJheS5mcm9tKHRoaXMuZmFjdG9yaWVzKS5tYXAoKFtmYWN0b3J5LCBpbmplY3Rpb25zXSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZuID0gZmFjdG9yeShjb250YWluZXIsIG93bmVyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGFpbmVyLmludm9rZShmbiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5qZWN0aW9uc1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9kdWNlcnMubWFwKGl0ID0+IGl0KCkpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IFNlcnZpY2VGYWN0b3J5RGVmIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9TZXJ2aWNlRmFjdG9yeURlZic7XG5pbXBvcnQgeyBGYWN0b3J5SWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0ZhY3RvcnlJZGVudGlmaWVyJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IFNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi4vdHlwZXMvU2VydmljZUZhY3RvcnknO1xuXG5leHBvcnQgY2xhc3MgRmFjdG9yeVJlY29yZGVyIHtcbiAgICBwcml2YXRlIGZhY3RvcmllcyA9IG5ldyBNYXA8RmFjdG9yeUlkZW50aWZpZXIsIFNlcnZpY2VGYWN0b3J5RGVmPHVua25vd24+PigpO1xuXG4gICAgcHVibGljIGFwcGVuZDxUPihcbiAgICAgICAgaWRlbnRpZmllcjogRmFjdG9yeUlkZW50aWZpZXIsXG4gICAgICAgIGZhY3Rvcnk6IFNlcnZpY2VGYWN0b3J5PFQsIHVua25vd24+LFxuICAgICAgICBpbmplY3Rpb25zOiBJZGVudGlmaWVyW10gPSBbXSxcbiAgICAgICAgaXNTaW5nbGU6IGJvb2xlYW4gPSB0cnVlXG4gICAgKSB7XG4gICAgICAgIGxldCBkZWYgPSB0aGlzLmZhY3Rvcmllcy5nZXQoaWRlbnRpZmllcik7XG4gICAgICAgIGlmIChkZWYpIHtcbiAgICAgICAgICAgIGRlZi5hcHBlbmQoZmFjdG9yeSwgaW5qZWN0aW9ucyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWYgPSBuZXcgU2VydmljZUZhY3RvcnlEZWYoaWRlbnRpZmllciwgaXNTaW5nbGUpO1xuICAgICAgICAgICAgZGVmLmFwcGVuZChmYWN0b3J5LCBpbmplY3Rpb25zKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZhY3Rvcmllcy5zZXQoaWRlbnRpZmllciwgZGVmKTtcbiAgICB9XG4gICAgcHVibGljIHNldChpZGVudGlmaWVyOiBGYWN0b3J5SWRlbnRpZmllciwgZmFjdG9yeURlZjogU2VydmljZUZhY3RvcnlEZWY8dW5rbm93bj4pIHtcbiAgICAgICAgdGhpcy5mYWN0b3JpZXMuc2V0KGlkZW50aWZpZXIsIGZhY3RvcnlEZWYpO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0PFQ+KGlkZW50aWZpZXI6IEZhY3RvcnlJZGVudGlmaWVyKTogU2VydmljZUZhY3RvcnlEZWY8VD4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5mYWN0b3JpZXMuZ2V0KGlkZW50aWZpZXIpIGFzIFNlcnZpY2VGYWN0b3J5RGVmPFQ+IHwgdW5kZWZpbmVkO1xuICAgIH1cbiAgICBwdWJsaWMgaXRlcmF0b3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZhY3Rvcmllcy5lbnRyaWVzKCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTWV0YWRhdGEgfSBmcm9tICcuLi90eXBlcy9NZXRhZGF0YSc7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4uL3R5cGVzL1NlcnZpY2VGYWN0b3J5JztcbmltcG9ydCB7IEZhY3RvcnlJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvRmFjdG9yeUlkZW50aWZpZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4vQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeURlZiB9IGZyb20gJy4uL2ZvdW5kYXRpb24vU2VydmljZUZhY3RvcnlEZWYnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL3R5cGVzL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcic7XG5pbXBvcnQgeyBGYWN0b3J5UmVjb3JkZXIgfSBmcm9tICcuLi9jb21tb24vRmFjdG9yeVJlY29yZGVyJztcblxuZXhwb3J0IGludGVyZmFjZSBHbG9iYWxNZXRhZGF0YVJlYWRlciB7XG4gICAgZ2V0Q29tcG9uZW50RmFjdG9yeTxUPihrZXk6IEZhY3RvcnlJZGVudGlmaWVyKTogU2VydmljZUZhY3RvcnlEZWY8VD4gfCB1bmRlZmluZWQ7XG4gICAgZ2V0Q2xhc3NNZXRhZGF0YTxUPihhbGlhc05hbWU6IHN0cmluZyB8IHN5bWJvbCk6IENsYXNzTWV0YWRhdGE8VD4gfCB1bmRlZmluZWQ7XG4gICAgZ2V0SW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcygpOiBBcnJheTxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+Pjtcbn1cbmV4cG9ydCBjbGFzcyBHbG9iYWxNZXRhZGF0YSBpbXBsZW1lbnRzIE1ldGFkYXRhPEdsb2JhbE1ldGFkYXRhUmVhZGVyLCB2b2lkPiB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgSU5TVEFOQ0UgPSBuZXcgR2xvYmFsTWV0YWRhdGEoKTtcbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgICAgIHJldHVybiBHbG9iYWxNZXRhZGF0YS5JTlNUQU5DRTtcbiAgICB9XG4gICAgc3RhdGljIGdldFJlYWRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoKS5yZWFkZXIoKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBjbGFzc0FsaWFzTWV0YWRhdGFNYXAgPSBuZXcgTWFwPHN0cmluZyB8IHN5bWJvbCwgQ2xhc3NNZXRhZGF0YTx1bmtub3duPj4oKTtcbiAgICBwcml2YXRlIGNvbXBvbmVudEZhY3RvcmllcyA9IG5ldyBGYWN0b3J5UmVjb3JkZXIoKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHByb2Nlc3NvckNsYXNzZXM6IFNldDxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+PiA9IG5ldyBTZXQoKTtcbiAgICByZWNvcmRGYWN0b3J5PFQ+KFxuICAgICAgICBzeW1ib2w6IEZhY3RvcnlJZGVudGlmaWVyLFxuICAgICAgICBmYWN0b3J5OiBTZXJ2aWNlRmFjdG9yeTxULCB1bmtub3duPixcbiAgICAgICAgaW5qZWN0aW9uczogSWRlbnRpZmllcltdID0gW10sXG4gICAgICAgIGlzU2luZ2xlOiBib29sZWFuID0gdHJ1ZVxuICAgICkge1xuICAgICAgICB0aGlzLmNvbXBvbmVudEZhY3Rvcmllcy5hcHBlbmQoc3ltYm9sLCBmYWN0b3J5LCBpbmplY3Rpb25zLCBpc1NpbmdsZSk7XG4gICAgfVxuICAgIHJlY29yZENsYXNzQWxpYXM8VD4oYWxpYXNOYW1lOiBzdHJpbmcgfCBzeW1ib2wsIG1ldGFkYXRhOiBDbGFzc01ldGFkYXRhPFQ+KSB7XG4gICAgICAgIHRoaXMuY2xhc3NBbGlhc01ldGFkYXRhTWFwLnNldChhbGlhc05hbWUsIG1ldGFkYXRhKTtcbiAgICB9XG4gICAgcmVjb3JkUHJvY2Vzc29yQ2xhc3MoY2xheno6IE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4pIHtcbiAgICAgICAgdGhpcy5wcm9jZXNzb3JDbGFzc2VzLmFkZChjbGF6eik7XG4gICAgfVxuICAgIGluaXQoKSB7XG4gICAgICAgIC8vIFBBU1M7XG4gICAgfVxuICAgIHJlYWRlcigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldENvbXBvbmVudEZhY3Rvcnk6IDxUPihrZXk6IEZhY3RvcnlJZGVudGlmaWVyKTogU2VydmljZUZhY3RvcnlEZWY8VD4gfCB1bmRlZmluZWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudEZhY3Rvcmllcy5nZXQoa2V5KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRDbGFzc01ldGFkYXRhOiA8VD4oYWxpYXNOYW1lOiBzdHJpbmcgfCBzeW1ib2wpOiBDbGFzc01ldGFkYXRhPFQ+IHwgdW5kZWZpbmVkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jbGFzc0FsaWFzTWV0YWRhdGFNYXAuZ2V0KGFsaWFzTmFtZSkgYXMgQ2xhc3NNZXRhZGF0YTxUPiB8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzOiAoKTogQXJyYXk8TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPj4gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMucHJvY2Vzc29yQ2xhc3Nlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiZXhwb3J0IGludGVyZmFjZSBFdmFsdWF0aW9uT3B0aW9uczxPLCBFIGV4dGVuZHMgc3RyaW5nLCBBID0gdW5rbm93bj4ge1xuICAgIHR5cGU6IEU7XG4gICAgb3duZXI/OiBPO1xuICAgIHByb3BlcnR5TmFtZT86IHN0cmluZyB8IHN5bWJvbDtcbiAgICBleHRlcm5hbEFyZ3M/OiBBO1xufVxuXG5leHBvcnQgZW51bSBFeHByZXNzaW9uVHlwZSB7XG4gICAgRU5WID0gJ2luamVjdC1lbnZpcm9ubWVudC12YXJpYWJsZXMnLFxuICAgIEpTT05fUEFUSCA9ICdpbmplY3QtanNvbi1kYXRhJyxcbiAgICBBUkdWID0gJ2luamVjdC1hcmd2J1xufVxuIiwiZXhwb3J0IGNvbnN0IGlzTm9kZUpzID0gKCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gcHJvY2Vzcy52ZXJzaW9ucy5ub2RlICE9PSBudWxsO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn0pKCk7XG4iLCJpbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0dsb2JhbE1ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuaW1wb3J0IHsgaXNOb2RlSnMgfSBmcm9tICcuLi9jb21tb24vaXNOb2RlSnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gVmFsdWU8QSA9IHVua25vd24+KGV4cHJlc3Npb246IHN0cmluZywgdHlwZTogRXhwcmVzc2lvblR5cGUgfCBzdHJpbmcsIGV4dGVybmFsQXJncz86IEEpOiBQcm9wZXJ0eURlY29yYXRvciB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgRXhwcmVzc2lvblR5cGUuRU5WOlxuICAgICAgICBjYXNlIEV4cHJlc3Npb25UeXBlLkFSR1Y6XG4gICAgICAgICAgICBpZiAoIWlzTm9kZUpzKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgXCIke3R5cGV9XCIgZXZhbHVhdG9yIG9ubHkgc3VwcG9ydHMgbm9kZWpzIGVudmlyb25tZW50IWApO1xuICAgICAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gKHRhcmdldDogT2JqZWN0LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sKSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGFyZ2V0LmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgY29uc3QgdmFsdWVfc3ltYm9sID0gU3ltYm9sKCcnKTtcbiAgICAgICAgbWV0YWRhdGEucmVjb3JkUHJvcGVydHlUeXBlKHByb3BlcnR5S2V5LCB2YWx1ZV9zeW1ib2wpO1xuICAgICAgICBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlY29yZEZhY3RvcnkodmFsdWVfc3ltYm9sLCAoY29udGFpbmVyLCBvd25lcikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICgpID0+XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmV2YWx1YXRlPHN0cmluZywgdHlwZW9mIG93bmVyLCBBPihleHByZXNzaW9uIGFzIHN0cmluZywge1xuICAgICAgICAgICAgICAgICAgICBvd25lcixcbiAgICAgICAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgZXh0ZXJuYWxBcmdzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBWYWx1ZSB9IGZyb20gJy4vVmFsdWUnO1xuaW1wb3J0IHsgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gQXJndihuYW1lOiBzdHJpbmcsIGFyZ3Y6IHN0cmluZ1tdID0gcHJvY2Vzcy5hcmd2KSB7XG4gICAgcmV0dXJuIFZhbHVlKG5hbWUsIEV4cHJlc3Npb25UeXBlLkFSR1YsIGFyZ3YpO1xufVxuIiwiaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9HbG9iYWxNZXRhZGF0YSc7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIEJpbmQoYWxpYXNOYW1lOiBzdHJpbmcgfCBzeW1ib2wpOiBDbGFzc0RlY29yYXRvciB7XG4gICAgcmV0dXJuIDxURnVuY3Rpb24gZXh0ZW5kcyBGdW5jdGlvbj4odGFyZ2V0OiBURnVuY3Rpb24pID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQgYXMgdW5rbm93biBhcyBOZXdhYmxlPHVua25vd24+LCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWNvcmRDbGFzc0FsaWFzKGFsaWFzTmFtZSwgbWV0YWRhdGEpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBWYWx1ZSB9IGZyb20gJy4vVmFsdWUnO1xuaW1wb3J0IHsgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gRW52KG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBWYWx1ZShuYW1lLCBFeHByZXNzaW9uVHlwZS5FTlYpO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGlzTnVsbCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIG51bGwge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQ7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNOb3REZWZpbmVkPFQ+KHZhbHVlOiBUIHwgdW5kZWZpbmVkIHwgbnVsbCk6IHZhbHVlIGlzIHVuZGVmaW5lZCB8IG51bGwge1xuICAgIHJldHVybiBpc051bGwodmFsdWUpIHx8IGlzVW5kZWZpbmVkKHZhbHVlKTtcbn1cbiIsImltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgRmFjdG9yeUlkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9GYWN0b3J5SWRlbnRpZmllcic7XG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlJztcbmltcG9ydCB7IGlzTm90RGVmaW5lZCB9IGZyb20gJy4uL2NvbW1vbi9pc05vdERlZmluZWQnO1xuXG5leHBvcnQgZnVuY3Rpb24gRmFjdG9yeShwcm9kdWNlSWRlbnRpZmllcj86IEZhY3RvcnlJZGVudGlmaWVyLCBpc1NpbmdsZTogYm9vbGVhbiA9IHRydWUpOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiAodGFyZ2V0OiBPYmplY3QsIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wpID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpO1xuICAgICAgICBjb25zdCBjbGF6eiA9IHRhcmdldC5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPEluc3RhbmNlPHVua25vd24+PjtcblxuICAgICAgICBpZiAoaXNOb3REZWZpbmVkKHByb2R1Y2VJZGVudGlmaWVyKSkge1xuICAgICAgICAgICAgcHJvZHVjZUlkZW50aWZpZXIgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdkZXNpZ246cmV0dXJudHlwZScsIHRhcmdldCwgcHJvcGVydHlLZXkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc05vdERlZmluZWQocHJvZHVjZUlkZW50aWZpZXIpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSByZXR1cm4gdHlwZSBub3QgcmVjb2duaXplZCwgY2Fubm90IHBlcmZvcm0gaW5zdGFuY2UgY3JlYXRpb24hJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaW5qZWN0aW9ucyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ2Rlc2lnbjpwYXJhbXR5cGVzJywgdGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG5cbiAgICAgICAgbWV0YWRhdGEucmVjb3JkRmFjdG9yeShcbiAgICAgICAgICAgIHByb2R1Y2VJZGVudGlmaWVyLFxuICAgICAgICAgICAgKGNvbnRhaW5lciwgb3duZXIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGNvbnRhaW5lci5nZXRJbnN0YW5jZShjbGF6eiwgb3duZXIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZ1bmMgPSBpbnN0YW5jZVtwcm9wZXJ0eUtleV07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmdW5jID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBjb250YWluZXIuZ2V0SW5zdGFuY2UoY2xhenopO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiBmdW5jO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmplY3Rpb25zLFxuICAgICAgICAgICAgaXNTaW5nbGVcbiAgICAgICAgKTtcbiAgICB9O1xufVxuIiwiaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhIH0gZnJvbSAnLi4vdHlwZXMvTWV0YWRhdGEnO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgSW5zdGFuY2VTY29wZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vSW5zdGFuY2VTY29wZSc7XG5cbmV4cG9ydCBjb25zdCBGVU5DVElPTl9NRVRBREFUQV9LRVkgPSBTeW1ib2woJ2lvYzpmdW5jdGlvbi1tZXRhZGF0YScpO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZ1bmN0aW9uTWV0YWRhdGFSZWFkZXIge1xuICAgIGdldFBhcmFtZXRlcnMoKTogSWRlbnRpZmllcltdO1xuICAgIGlzRmFjdG9yeSgpOiBib29sZWFuO1xuICAgIGdldFNjb3BlKCk6IEluc3RhbmNlU2NvcGUgfCB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBGdW5jdGlvbk1ldGFkYXRhIGltcGxlbWVudHMgTWV0YWRhdGE8RnVuY3Rpb25NZXRhZGF0YVJlYWRlciwgRnVuY3Rpb24+IHtcbiAgICBzdGF0aWMgZ2V0UmVmbGVjdEtleSgpIHtcbiAgICAgICAgcmV0dXJuIEZVTkNUSU9OX01FVEFEQVRBX0tFWTtcbiAgICB9XG4gICAgcHJpdmF0ZSByZWFkb25seSBwYXJhbWV0ZXJzOiBJZGVudGlmaWVyW10gPSBbXTtcbiAgICBwcml2YXRlIHNjb3BlPzogSW5zdGFuY2VTY29wZTtcbiAgICBwcml2YXRlIGlzRmFjdG9yeTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHNldFBhcmFtZXRlclR5cGUoaW5kZXg6IG51bWJlciwgc3ltYm9sOiBJZGVudGlmaWVyKSB7XG4gICAgICAgIHRoaXMucGFyYW1ldGVyc1tpbmRleF0gPSBzeW1ib2w7XG4gICAgfVxuICAgIHNldFNjb3BlKHNjb3BlOiBJbnN0YW5jZVNjb3BlKSB7XG4gICAgICAgIHRoaXMuc2NvcGUgPSBzY29wZTtcbiAgICB9XG4gICAgc2V0SXNGYWN0b3J5KGlzRmFjdG9yeTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLmlzRmFjdG9yeSA9IGlzRmFjdG9yeTtcbiAgICB9XG4gICAgaW5pdCgpIHtcbiAgICAgICAgLy8gUEFTUztcbiAgICB9XG4gICAgcmVhZGVyKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0UGFyYW1ldGVyczogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmFtZXRlcnMuc2xpY2UoMCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaXNGYWN0b3J5OiAoKSA9PiB0aGlzLmlzRmFjdG9yeSxcbiAgICAgICAgICAgIGdldFNjb3BlOiAoKSA9PiB0aGlzLnNjb3BlXG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbic7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhLCBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gR2VuZXJhdGU8VCwgVj4oZ2VuZXJhdG9yOiAodGhpczogVCwgYXBwQ3R4OiBBcHBsaWNhdGlvbkNvbnRleHQpID0+IFYpOiBQcm9wZXJ0eURlY29yYXRvciB7XG4gICAgcmV0dXJuICh0YXJnZXQ6IE9iamVjdCwgcHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCkgPT4ge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldC5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgIGNvbnN0IHZhbHVlX3N5bWJvbCA9IFN5bWJvbCgnJyk7XG4gICAgICAgIG1ldGFkYXRhLnJlY29yZFByb3BlcnR5VHlwZShwcm9wZXJ0eUtleSwgdmFsdWVfc3ltYm9sKTtcbiAgICAgICAgR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWNvcmRGYWN0b3J5KHZhbHVlX3N5bWJvbCwgKGNvbnRhaW5lciwgb3duZXIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiBnZW5lcmF0b3IuY2FsbChvd25lciBhcyBULCBjb250YWluZXIpO1xuICAgICAgICB9KTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBpc05vdERlZmluZWQgfSBmcm9tICcuLi9jb21tb24vaXNOb3REZWZpbmVkJztcblxuZXhwb3J0IGZ1bmN0aW9uIEluamVjdDxUPihjb25zdHI/OiBJZGVudGlmaWVyPFQ+KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIDxUYXJnZXQ+KHRhcmdldDogVGFyZ2V0LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sLCBwYXJhbWV0ZXJJbmRleD86IG51bWJlcikge1xuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgcGFyYW1ldGVySW5kZXggPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAvLyBjb25zdHJ1Y3RvciBwYXJhbWV0ZXJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldENvbnN0ciA9IHRhcmdldCBhcyBOZXdhYmxlPFQ+O1xuICAgICAgICAgICAgaWYgKGlzTm90RGVmaW5lZChjb25zdHIpKSB7XG4gICAgICAgICAgICAgICAgY29uc3RyID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnZGVzaWduOnBhcmFtdHlwZXMnLCB0YXJnZXQsIHByb3BlcnR5S2V5KVtwYXJhbWV0ZXJJbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNOb3REZWZpbmVkKGNvbnN0cikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1R5cGUgbm90IHJlY29nbml6ZWQsIGluamVjdGlvbiBjYW5ub3QgYmUgcGVyZm9ybWVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBjbGFzc01ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGFyZ2V0Q29uc3RyLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgICAgIGNsYXNzTWV0YWRhdGEuc2V0Q29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlKHBhcmFtZXRlckluZGV4LCBjb25zdHIpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdvYmplY3QnICYmIHRhcmdldCAhPT0gbnVsbCAmJiBwcm9wZXJ0eUtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBwcm9wZXJ0eVxuICAgICAgICAgICAgaWYgKGlzTm90RGVmaW5lZChjb25zdHIpKSB7XG4gICAgICAgICAgICAgICAgY29uc3RyID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnZGVzaWduOnR5cGUnLCB0YXJnZXQsIHByb3BlcnR5S2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc05vdERlZmluZWQoY29uc3RyKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHlwZSBub3QgcmVjb2duaXplZCwgaW5qZWN0aW9uIGNhbm5vdCBiZSBwZXJmb3JtZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGFyZ2V0LmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgICAgIG1ldGFkYXRhLnJlY29yZFByb3BlcnR5VHlwZShwcm9wZXJ0eUtleSwgY29uc3RyKTtcbiAgICAgICAgfVxuICAgIH07XG59XG4iLCJpbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlJztcblxuZXhwb3J0IGludGVyZmFjZSBJbmplY3RhYmxlT3B0aW9ucyB7XG4gICAgcHJvZHVjZTogc3RyaW5nIHwgc3ltYm9sIHwgQXJyYXk8c3RyaW5nIHwgc3ltYm9sPjtcbn1cblxuLyoqXG4gKiBUaGlzIGRlY29yYXRvciBpcyB0eXBpY2FsbHkgdXNlZCB0byBpZGVudGlmeSBjbGFzc2VzIHRoYXQgbmVlZCB0byBiZSBjb25maWd1cmVkIHdpdGhpbiB0aGUgSW9DIGNvbnRhaW5lci5cbiAqIEluIG1vc3QgY2FzZXMsIEBJbmplY3RhYmxlIGNhbiBiZSBvbWl0dGVkIHVubGVzcyBleHBsaWNpdCBjb25maWd1cmF0aW9uIGlzIHJlcXVpcmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gSW5qZWN0YWJsZShvcHRpb25zPzogSW5qZWN0YWJsZU9wdGlvbnMpOiBDbGFzc0RlY29yYXRvciB7XG4gICAgcmV0dXJuIDxURnVuY3Rpb24gZXh0ZW5kcyBGdW5jdGlvbj4odGFyZ2V0OiBURnVuY3Rpb24pOiBURnVuY3Rpb24gfCB2b2lkID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zPy5wcm9kdWNlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IEdsb2JhbE1ldGFkYXRhLmdldEluc3RhbmNlKCk7XG4gICAgICAgIGNvbnN0IHByb2R1Y2VzID0gQXJyYXkuaXNBcnJheShvcHRpb25zLnByb2R1Y2UpID8gb3B0aW9ucy5wcm9kdWNlIDogW29wdGlvbnMucHJvZHVjZV07XG4gICAgICAgIHByb2R1Y2VzLmZvckVhY2gocHJvZHVjZSA9PiB7XG4gICAgICAgICAgICBtZXRhZGF0YS5yZWNvcmRGYWN0b3J5KFxuICAgICAgICAgICAgICAgIHByb2R1Y2UsXG4gICAgICAgICAgICAgICAgKGNvbnRhaW5lciwgb3duZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gY29udGFpbmVyLmdldEluc3RhbmNlKHRhcmdldCBhcyB1bmtub3duIGFzIE5ld2FibGU8SW5zdGFuY2U8dW5rbm93bj4+LCBvd25lcik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBbXSxcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3IgfSBmcm9tICcuLi90eXBlcy9JbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3InO1xuaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9HbG9iYWxNZXRhZGF0YSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBJbnN0QXdhcmVQcm9jZXNzb3IoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIDxDbHMgZXh0ZW5kcyBOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+Pih0YXJnZXQ6IENscykge1xuICAgICAgICBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlY29yZFByb2Nlc3NvckNsYXNzKHRhcmdldCk7XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IFZhbHVlIH0gZnJvbSAnLi9WYWx1ZSc7XG5pbXBvcnQgeyBFeHByZXNzaW9uVHlwZSB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRlT3B0aW9ucyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBKU09ORGF0YShuYW1lc3BhY2U6IHN0cmluZywganNvbnBhdGg6IHN0cmluZykge1xuICAgIHJldHVybiBWYWx1ZShgJHtuYW1lc3BhY2V9OiR7anNvbnBhdGh9YCwgRXhwcmVzc2lvblR5cGUuSlNPTl9QQVRIKTtcbn1cbiIsImltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcblxuLyoqXG4gKiBVcm4gY2FsbHMgdGhlIG1ldGhvZHMgYW5ub3RhdGVkIHdpdGggQFBvc3RJbmplY3Qgb25seSBvbmNlLCBqdXN0IGFmdGVyIHRoZSBpbmplY3Rpb24gb2YgcHJvcGVydGllcy5cbiAqIEBhbm5vdGF0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBMaWZlY3ljbGVEZWNvcmF0b3IgPSAobGlmZWN5Y2xlOiBMaWZlY3ljbGUpOiBNZXRob2REZWNvcmF0b3IgPT4ge1xuICAgIHJldHVybiAodGFyZ2V0OiBPYmplY3QsIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wpID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQuY29uc3RydWN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBtZXRhZGF0YS5hZGRMaWZlY3ljbGVNZXRob2QocHJvcGVydHlLZXksIGxpZmVjeWNsZSk7XG4gICAgfTtcbn07XG4iLCJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBNYXJrKGtleTogc3RyaW5nIHwgc3ltYm9sLCB2YWx1ZTogdW5rbm93biA9IHRydWUpOiBGdW5jdGlvbiB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChcbiAgICAgICAgLi4uYXJnczpcbiAgICAgICAgICAgIHwgUGFyYW1ldGVyczxDbGFzc0RlY29yYXRvcj5cbiAgICAgICAgICAgIHwgUGFyYW1ldGVyczxNZXRob2REZWNvcmF0b3I+XG4gICAgICAgICAgICB8IFBhcmFtZXRlcnM8UHJvcGVydHlEZWNvcmF0b3I+XG4gICAgICAgICAgICB8IFBhcmFtZXRlcnM8UGFyYW1ldGVyRGVjb3JhdG9yPlxuICAgICkge1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIC8vIGNsYXNzIGRlY29yYXRvclxuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShhcmdzWzBdLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgICAgIG1ldGFkYXRhLm1hcmtlcigpLmN0b3Ioa2V5LCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJncy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIC8vIHByb3BlcnR5IGRlY29yYXRvclxuICAgICAgICAgICAgY29uc3QgW3Byb3RvdHlwZSwgcHJvcGVydHlLZXldID0gYXJncztcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEocHJvdG90eXBlLmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgICAgIG1ldGFkYXRhLm1hcmtlcigpLm1lbWJlcihwcm9wZXJ0eUtleSkubWFyayhrZXksIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMyAmJiB0eXBlb2YgYXJnc1syXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIC8vIHBhcmFtZXRlciBkZWNvcmF0b3JcbiAgICAgICAgICAgIGNvbnN0IFtwcm90b3R5cGUsIHByb3BlcnR5S2V5LCBpbmRleF0gPSBhcmdzIGFzIFtPYmplY3QsIHN0cmluZyB8IHN5bWJvbCwgbnVtYmVyXTtcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEocHJvdG90eXBlLmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgICAgIG1ldGFkYXRhLm1hcmtlcigpLnBhcmFtZXRlcihwcm9wZXJ0eUtleSwgaW5kZXgpLm1hcmsoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBtZXRob2QgZGVjb3JhdG9yXG4gICAgICAgICAgICBjb25zdCBbcHJvdG90eXBlLCBwcm9wZXJ0eUtleV0gPSBhcmdzIGFzIFBhcmFtZXRlcnM8TWV0aG9kRGVjb3JhdG9yPjtcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEocHJvdG90eXBlLmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgICAgIG1ldGFkYXRhLm1hcmtlcigpLm1lbWJlcihwcm9wZXJ0eUtleSkubWFyayhrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH07XG59XG4iLCJleHBvcnQgZW51bSBMaWZlY3ljbGUge1xuICAgIFBSRV9JTkpFQ1QgPSAnaW9jLXNjb3BlOnByZS1pbmplY3QnLFxuICAgIFBPU1RfSU5KRUNUID0gJ2lvYy1zY29wZTpwb3N0LWluamVjdCcsXG4gICAgUFJFX0RFU1RST1kgPSAnaW9jLXNjb3BlOnByZS1kZXN0cm95J1xufVxuIiwiaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IExpZmVjeWNsZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vTGlmZWN5Y2xlJztcbmltcG9ydCB7IExpZmVjeWNsZURlY29yYXRvciB9IGZyb20gJy4vTGlmZWN5Y2xlRGVjb3JhdG9yJztcblxuLyoqXG4gKiBVcm4gY2FsbHMgdGhlIG1ldGhvZHMgYW5ub3RhdGVkIHdpdGggQFBvc3RJbmplY3Qgb25seSBvbmNlLCBqdXN0IGFmdGVyIHRoZSBpbmplY3Rpb24gb2YgcHJvcGVydGllcy5cbiAqIEBhbm5vdGF0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBQb3N0SW5qZWN0ID0gKCk6IE1ldGhvZERlY29yYXRvciA9PiBMaWZlY3ljbGVEZWNvcmF0b3IoTGlmZWN5Y2xlLlBPU1RfSU5KRUNUKTtcbiIsImltcG9ydCB7IExpZmVjeWNsZURlY29yYXRvciB9IGZyb20gJy4vTGlmZWN5Y2xlRGVjb3JhdG9yJztcbmltcG9ydCB7IExpZmVjeWNsZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vTGlmZWN5Y2xlJztcblxuZXhwb3J0IGNvbnN0IFByZURlc3Ryb3kgPSAoKSA9PiBMaWZlY3ljbGVEZWNvcmF0b3IoTGlmZWN5Y2xlLlBSRV9ERVNUUk9ZKTtcbiIsImltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBMaWZlY3ljbGVEZWNvcmF0b3IgfSBmcm9tICcuL0xpZmVjeWNsZURlY29yYXRvcic7XG5cbi8qKlxuICogVXJuIGNhbGxzIHRoZSBtZXRob2RzIGFubm90YXRlZCB3aXRoIEBQb3N0SW5qZWN0IG9ubHkgb25jZSwganVzdCBhZnRlciB0aGUgaW5qZWN0aW9uIG9mIHByb3BlcnRpZXMuXG4gKiBAYW5ub3RhdGlvblxuICovXG5leHBvcnQgY29uc3QgUHJlSW5qZWN0ID0gKCk6IE1ldGhvZERlY29yYXRvciA9PiBMaWZlY3ljbGVEZWNvcmF0b3IoTGlmZWN5Y2xlLlBSRV9JTkpFQ1QpO1xuIiwiaW1wb3J0IHsgSW5zdGFuY2VTY29wZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vSW5zdGFuY2VTY29wZSc7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIFNjb3BlKHNjb3BlOiBJbnN0YW5jZVNjb3BlIHwgc3RyaW5nKTogQ2xhc3NEZWNvcmF0b3Ige1xuICAgIHJldHVybiA8VEZ1bmN0aW9uIGV4dGVuZHMgRnVuY3Rpb24+KHRhcmdldDogVEZ1bmN0aW9uKSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGFyZ2V0IGFzIHVua25vd24gYXMgTmV3YWJsZTx1bmtub3duPiwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgIG1ldGFkYXRhLnNldFNjb3BlKHNjb3BlKTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgQW55RnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcy9BbnlGdW5jdGlvbic7XG5cbmV4cG9ydCB0eXBlIEV2ZW50TGlzdGVuZXIgPSBBbnlGdW5jdGlvbjtcbmV4cG9ydCBjbGFzcyBFdmVudEVtaXR0ZXIge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZXZlbnRzID0gbmV3IE1hcDxzdHJpbmcgfCBzeW1ib2wsIEV2ZW50TGlzdGVuZXJbXT4oKTtcblxuICAgIG9uKHR5cGU6IHN0cmluZyB8IHN5bWJvbCwgbGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgbGV0IGxpc3RlbmVycyA9IHRoaXMuZXZlbnRzLmdldCh0eXBlKTtcbiAgICAgICAgaWYgKGxpc3RlbmVycykge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpc3RlbmVycyA9IFtsaXN0ZW5lcl07XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5zZXQodHlwZSwgbGlzdGVuZXJzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbHMgPSBsaXN0ZW5lcnMgYXMgRXZlbnRMaXN0ZW5lcltdO1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBscy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgbHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgZW1pdCh0eXBlOiBzdHJpbmcgfCBzeW1ib2wsIC4uLmFyZ3M6IHVua25vd25bXSkge1xuICAgICAgICB0aGlzLmV2ZW50cy5nZXQodHlwZSk/LmZvckVhY2goZm4gPT4ge1xuICAgICAgICAgICAgZm4oLi4uYXJncyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcblxudHlwZSBJbnZva2VGdW5jdGlvbkFyZ3MgPSB7XG4gICAgYXJncz86IHVua25vd25bXTtcbn07XG50eXBlIEludm9rZUZ1bmN0aW9uSW5qZWN0aW9ucyA9IHtcbiAgICBpbmplY3Rpb25zOiBJZGVudGlmaWVyW107XG59O1xuXG50eXBlIEludm9rZUZ1bmN0aW9uQmFzaWNPcHRpb25zPFQ+ID0ge1xuICAgIGNvbnRleHQ/OiBUO1xufTtcblxuZXhwb3J0IHR5cGUgSW52b2tlRnVuY3Rpb25PcHRpb25zPFQ+ID1cbiAgICB8IChJbnZva2VGdW5jdGlvbkJhc2ljT3B0aW9uczxUPiAmIEludm9rZUZ1bmN0aW9uQXJncylcbiAgICB8IChJbnZva2VGdW5jdGlvbkJhc2ljT3B0aW9uczxUPiAmIFBhcnRpYWw8SW52b2tlRnVuY3Rpb25JbmplY3Rpb25zPik7XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNBcmdzPFQ+KG9wdGlvbnM6IEludm9rZUZ1bmN0aW9uT3B0aW9uczxUPik6IG9wdGlvbnMgaXMgSW52b2tlRnVuY3Rpb25CYXNpY09wdGlvbnM8VD4gJiBJbnZva2VGdW5jdGlvbkFyZ3Mge1xuICAgIHJldHVybiAnYXJncycgaW4gb3B0aW9ucztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc0luamVjdGlvbnM8VD4oXG4gICAgb3B0aW9uczogSW52b2tlRnVuY3Rpb25PcHRpb25zPFQ+XG4pOiBvcHRpb25zIGlzIEludm9rZUZ1bmN0aW9uQmFzaWNPcHRpb25zPFQ+ICYgSW52b2tlRnVuY3Rpb25JbmplY3Rpb25zIHtcbiAgICByZXR1cm4gJ2luamVjdGlvbnMnIGluIG9wdGlvbnM7XG59XG4iLCJpbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhLCBDbGFzc01ldGFkYXRhUmVhZGVyIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IExpZmVjeWNsZSB9IGZyb20gJy4vTGlmZWN5Y2xlJztcbmltcG9ydCB7IEluc3RhbmNlIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2UnO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuXG5leHBvcnQgY2xhc3MgTGlmZWN5Y2xlTWFuYWdlcjxUID0gdW5rbm93bj4ge1xuICAgIHByaXZhdGUgY2xhc3NNZXRhZGF0YVJlYWRlcjogQ2xhc3NNZXRhZGF0YVJlYWRlcjxUPjtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGNvbXBvbmVudENsYXNzOiBOZXdhYmxlPFQ+LCBwcml2YXRlIHJlYWRvbmx5IGNvbnRhaW5lcjogQXBwbGljYXRpb25Db250ZXh0KSB7XG4gICAgICAgIHRoaXMuY2xhc3NNZXRhZGF0YVJlYWRlciA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRoaXMuY29tcG9uZW50Q2xhc3MsIENsYXNzTWV0YWRhdGEpLnJlYWRlcigpO1xuICAgIH1cbiAgICBpbnZva2VQcmVJbmplY3RNZXRob2QoaW5zdGFuY2U6IEluc3RhbmNlPFQ+KSB7XG4gICAgICAgIGNvbnN0IG1ldGhvZHMgPSB0aGlzLmNsYXNzTWV0YWRhdGFSZWFkZXIuZ2V0TWV0aG9kcyhMaWZlY3ljbGUuUFJFX0lOSkVDVCk7XG4gICAgICAgIHRoaXMuaW52b2tlTGlmZWN5Y2xlTWV0aG9kcyhpbnN0YW5jZSwgbWV0aG9kcyk7XG4gICAgfVxuICAgIGludm9rZVBvc3RJbmplY3RNZXRob2QoaW5zdGFuY2U6IEluc3RhbmNlPFQ+KSB7XG4gICAgICAgIGNvbnN0IG1ldGhvZHMgPSB0aGlzLmNsYXNzTWV0YWRhdGFSZWFkZXIuZ2V0TWV0aG9kcyhMaWZlY3ljbGUuUE9TVF9JTkpFQ1QpO1xuICAgICAgICB0aGlzLmludm9rZUxpZmVjeWNsZU1ldGhvZHMoaW5zdGFuY2UsIG1ldGhvZHMpO1xuICAgIH1cbiAgICBpbnZva2VQcmVEZXN0cm95SW5qZWN0TWV0aG9kKGluc3RhbmNlOiBJbnN0YW5jZTxUPikge1xuICAgICAgICBjb25zdCBtZXRob2RzID0gdGhpcy5jbGFzc01ldGFkYXRhUmVhZGVyLmdldE1ldGhvZHMoTGlmZWN5Y2xlLlBSRV9ERVNUUk9ZKTtcbiAgICAgICAgdGhpcy5pbnZva2VMaWZlY3ljbGVNZXRob2RzKGluc3RhbmNlLCBtZXRob2RzKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBpbnZva2VMaWZlY3ljbGVNZXRob2RzKGluc3RhbmNlOiBJbnN0YW5jZTxUPiwgbWV0aG9kS2V5czogQXJyYXk8c3RyaW5nIHwgc3ltYm9sPikge1xuICAgICAgICBtZXRob2RLZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmludm9rZShpbnN0YW5jZVtrZXldLCB7XG4gICAgICAgICAgICAgICAgY29udGV4dDogaW5zdGFuY2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhLCBDbGFzc01ldGFkYXRhUmVhZGVyIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlJztcbmltcG9ydCB7IFNlcnZpY2VGYWN0b3J5RGVmIH0gZnJvbSAnLi9TZXJ2aWNlRmFjdG9yeURlZic7XG5pbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0dsb2JhbE1ldGFkYXRhJztcbmltcG9ydCB7IGxhenlQcm9wIH0gZnJvbSAnQHZnZXJib3QvbGF6eSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXIgfSBmcm9tICcuL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXInO1xuaW1wb3J0IHsgTGlmZWN5Y2xlTWFuYWdlciB9IGZyb20gJy4vTGlmZWN5Y2xlTWFuYWdlcic7XG5pbXBvcnQgeyBGYWN0b3J5UmVjb3JkZXIgfSBmcm9tICcuLi9jb21tb24vRmFjdG9yeVJlY29yZGVyJztcbmltcG9ydCB7IEFueUZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMvQW55RnVuY3Rpb24nO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgU2VydmljZUZhY3RvcnkgfSBmcm9tICcuLi90eXBlcy9TZXJ2aWNlRmFjdG9yeSc7XG5cbmV4cG9ydCBjbGFzcyBDb21wb25lbnRJbnN0YW5jZUJ1aWxkZXI8VD4ge1xuICAgIHByaXZhdGUgZ2V0Q29uc3RydWN0b3JBcmdzOiAoKSA9PiB1bmtub3duW10gPSAoKSA9PiBbXTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHByb3BlcnR5RmFjdG9yaWVzID0gbmV3IEZhY3RvcnlSZWNvcmRlcigpO1xuICAgIHByaXZhdGUgbGF6eU1vZGU6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbGlmZWN5Y2xlUmVzb2x2ZXI6IExpZmVjeWNsZU1hbmFnZXI8VD47XG4gICAgcHJpdmF0ZSByZWFkb25seSBjbGFzc01ldGFkYXRhUmVhZGVyOiBDbGFzc01ldGFkYXRhUmVhZGVyPFQ+O1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGNvbXBvbmVudENsYXNzOiBOZXdhYmxlPFQ+LFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGNvbnRhaW5lcjogQXBwbGljYXRpb25Db250ZXh0LFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXI6IEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXJcbiAgICApIHtcbiAgICAgICAgdGhpcy5saWZlY3ljbGVSZXNvbHZlciA9IG5ldyBMaWZlY3ljbGVNYW5hZ2VyPFQ+KGNvbXBvbmVudENsYXNzLCBjb250YWluZXIpO1xuICAgICAgICBjb25zdCByZWFkZXIgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShjb21wb25lbnRDbGFzcywgQ2xhc3NNZXRhZGF0YSkucmVhZGVyKCk7XG4gICAgICAgIHRoaXMuY2xhc3NNZXRhZGF0YVJlYWRlciA9IHJlYWRlcjtcbiAgICAgICAgdGhpcy5hcHBlbmRDbGFzc01ldGFkYXRhKHJlYWRlcik7XG4gICAgfVxuICAgIGFwcGVuZExhenlNb2RlKGxhenlNb2RlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMubGF6eU1vZGUgPSBsYXp5TW9kZTtcbiAgICB9XG4gICAgcHJpdmF0ZSBhcHBlbmRDbGFzc01ldGFkYXRhPFQ+KGNsYXNzTWV0YWRhdGFSZWFkZXI6IENsYXNzTWV0YWRhdGFSZWFkZXI8VD4pIHtcbiAgICAgICAgY29uc3QgdHlwZXMgPSBjbGFzc01ldGFkYXRhUmVhZGVyLmdldENvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZXMoKTtcbiAgICAgICAgdGhpcy5nZXRDb25zdHJ1Y3RvckFyZ3MgPSAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZXMubWFwKGl0ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb250YWluZXIuZ2V0SW5zdGFuY2UoaXQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGdsb2JhbE1ldGFkYXRhUmVhZGVyID0gR2xvYmFsTWV0YWRhdGEuZ2V0UmVhZGVyKCk7XG4gICAgICAgIGNvbnN0IHByb3BlcnR5VHlwZXMgPSBjbGFzc01ldGFkYXRhUmVhZGVyLmdldFByb3BlcnR5VHlwZU1hcCgpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VHlwZV0gb2YgcHJvcGVydHlUeXBlcykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9wZXJ0eVR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5RmFjdG9yaWVzLmFwcGVuZChwcm9wZXJ0eU5hbWUsIChjb250YWluZXIsIG93bmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiBjb250YWluZXIuZ2V0SW5zdGFuY2UocHJvcGVydHlUeXBlLCBvd25lcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBmYWN0b3J5RGVmID0gdGhpcy5jb250YWluZXIuZ2V0RmFjdG9yeShwcm9wZXJ0eVR5cGUpO1xuICAgICAgICAgICAgaWYgKGZhY3RvcnlEZWYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5RmFjdG9yaWVzLnNldChwcm9wZXJ0eU5hbWUsIGZhY3RvcnlEZWYpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcHJvcGVydHlDbGFzc01ldGFkYXRhID0gZ2xvYmFsTWV0YWRhdGFSZWFkZXIuZ2V0Q2xhc3NNZXRhZGF0YShwcm9wZXJ0eVR5cGUpO1xuICAgICAgICAgICAgaWYgKHByb3BlcnR5Q2xhc3NNZXRhZGF0YSkge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydHlGYWN0b3JpZXMuc2V0KHByb3BlcnR5TmFtZSwgU2VydmljZUZhY3RvcnlEZWYuY3JlYXRlRnJvbUNsYXNzTWV0YWRhdGEocHJvcGVydHlDbGFzc01ldGFkYXRhKSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwcm9wZXJ0eUZhY3RvcnlEZWYgPSBnbG9iYWxNZXRhZGF0YVJlYWRlci5nZXRDb21wb25lbnRGYWN0b3J5KHByb3BlcnR5VHlwZSk7XG4gICAgICAgICAgICBpZiAocHJvcGVydHlGYWN0b3J5RGVmKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eUZhY3Rvcmllcy5zZXQocHJvcGVydHlOYW1lLCBwcm9wZXJ0eUZhY3RvcnlEZWYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGJ1aWxkKCkge1xuICAgICAgICBjb25zdCBhcmdzID0gdGhpcy5nZXRDb25zdHJ1Y3RvckFyZ3MoKTtcbiAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHRoaXMuY3JlYXRlUHJvcGVydGllc0dldHRlckJ1aWxkZXIoKTtcbiAgICAgICAgY29uc3QgaXNDcmVhdGluZ0luc3RBd2FyZVByb2Nlc3NvciA9IHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5pc0luc3RBd2FyZVByb2Nlc3NvckNsYXNzKHRoaXMuY29tcG9uZW50Q2xhc3MpO1xuICAgICAgICBpZiAoaXNDcmVhdGluZ0luc3RBd2FyZVByb2Nlc3Nvcikge1xuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgdGhpcy5jb21wb25lbnRDbGFzcyguLi5hcmdzKSBhcyBJbnN0YW5jZTxUPjtcbiAgICAgICAgICAgIHRoaXMubGlmZWN5Y2xlUmVzb2x2ZXIuaW52b2tlUHJlSW5qZWN0TWV0aG9kKGluc3RhbmNlKTtcbiAgICAgICAgICAgIGRlZmluZVByb3BlcnRpZXMuY2FsbCh0aGlzLCBpbnN0YW5jZSk7XG4gICAgICAgICAgICB0aGlzLmxpZmVjeWNsZVJlc29sdmVyLmludm9rZVBvc3RJbmplY3RNZXRob2QoaW5zdGFuY2UpO1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGluc3RhbmNlOiB1bmRlZmluZWQgfCBJbnN0YW5jZTxUPiA9IHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5iZWZvcmVJbnN0YW50aWF0aW9uKHRoaXMuY29tcG9uZW50Q2xhc3MsIGFyZ3MpO1xuICAgICAgICAgICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlID0gbmV3IHRoaXMuY29tcG9uZW50Q2xhc3MoLi4uYXJncykgYXMgSW5zdGFuY2U8VD47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmxpZmVjeWNsZVJlc29sdmVyLmludm9rZVByZUluamVjdE1ldGhvZChpbnN0YW5jZSk7XG4gICAgICAgICAgICBkZWZpbmVQcm9wZXJ0aWVzLmNhbGwodGhpcywgaW5zdGFuY2UpO1xuICAgICAgICAgICAgaW5zdGFuY2UgPSB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuYWZ0ZXJJbnN0YW50aWF0aW9uKGluc3RhbmNlKTtcbiAgICAgICAgICAgIHRoaXMubGlmZWN5Y2xlUmVzb2x2ZXIuaW52b2tlUG9zdEluamVjdE1ldGhvZChpbnN0YW5jZSk7XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRoaXM6IENvbXBvbmVudEluc3RhbmNlQnVpbGRlcjxUPiwgaW5zdGFuY2U6IEluc3RhbmNlPFQ+IHwgdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBnZXR0ZXIgPSB2YWx1ZShpbnN0YW5jZSBhcyBUKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmluZVByb3BlcnR5KGluc3RhbmNlLCB0eXBlb2Yga2V5ID09PSAnbnVtYmVyJyA/IGtleSArICcnIDoga2V5LCBnZXR0ZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBkZWZpbmVQcm9wZXJ0eTxULCBWPihpbnN0YW5jZTogVCwga2V5OiBzdHJpbmcgfCBzeW1ib2wsIGdldHRlcjogKCkgPT4gVikge1xuICAgICAgICBpZiAodGhpcy5sYXp5TW9kZSkge1xuICAgICAgICAgICAgbGF6eVByb3AoaW5zdGFuY2UsIGtleSwgZ2V0dGVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGluc3RhbmNlW2tleV0gPSBnZXR0ZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZVByb3BlcnRpZXNHZXR0ZXJCdWlsZGVyKCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgTWFwPGtleW9mIFQsIChpbnN0YW5jZTogVCkgPT4gKCkgPT4gdW5rbm93biB8IHVua25vd25bXT4oKTtcbiAgICAgICAgY29uc3QgcHJvcGVydHlUeXBlTWFwID0gdGhpcy5jbGFzc01ldGFkYXRhUmVhZGVyLmdldFByb3BlcnR5VHlwZU1hcCgpO1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIGZhY3RvcnlEZWZdIG9mIHRoaXMucHJvcGVydHlGYWN0b3JpZXMuaXRlcmF0b3IoKSkge1xuICAgICAgICAgICAgY29uc3QgaXNBcnJheSA9IChwcm9wZXJ0eVR5cGVNYXAuZ2V0KGtleSkgYXMgdW5rbm93bikgPT09IEFycmF5O1xuICAgICAgICAgICAgaWYgKCFpc0FycmF5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGZhY3RvcnlEZWYuZmFjdG9yaWVzLnNpemUgPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICAgICAgICAgICAgICAgICAgICBgTXVsdGlwbGUgbWF0Y2hpbmcgaW5qZWN0YWJsZXMgZm91bmQgZm9yIHByb3BlcnR5IGluamVjdGlvbixcXG5idXQgcHJvcGVydHkgJHtrZXkudG9TdHJpbmcoKX0gaXMgbm90IGFuIGFycmF5LFxuICAgICAgICAgICAgICAgICAgICAgICAgSXQgaXMgYW1iaWd1b3VzIHRvIGRldGVybWluZSB3aGljaCBvYmplY3Qgc2hvdWxkIGJlIGluamVjdGVkIWBcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgW2ZhY3RvcnksIGluamVjdGlvbnNdID0gZmFjdG9yeURlZi5mYWN0b3JpZXMuZW50cmllcygpLm5leHQoKS52YWx1ZSBhcyBbXG4gICAgICAgICAgICAgICAgICAgIFNlcnZpY2VGYWN0b3J5PHVua25vd24sIHVua25vd24+LFxuICAgICAgICAgICAgICAgICAgICBJZGVudGlmaWVyW11cbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5zZXQoa2V5IGFzIGtleW9mIFQsIDxUPihpbnN0YW5jZTogVCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9kdWNlciA9IGZhY3RvcnkodGhpcy5jb250YWluZXIsIGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRhaW5lci5pbnZva2UocHJvZHVjZXIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmplY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnNldChrZXkgYXMga2V5b2YgVCwgPFQ+KGluc3RhbmNlOiBUKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2R1Y2VyQW5kSW5qZWN0aW9ucyA9IEFycmF5LmZyb20oZmFjdG9yeURlZi5mYWN0b3JpZXMpLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAgIChbZmFjdG9yeSwgaW5qZWN0aW9uc10pID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2ZhY3RvcnkodGhpcy5jb250YWluZXIsIGluc3RhbmNlKSwgaW5qZWN0aW9uc10gYXMgW0FueUZ1bmN0aW9uPHVua25vd24+LCBJZGVudGlmaWVyW11dXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9kdWNlckFuZEluamVjdGlvbnMubWFwKChbcHJvZHVjZXIsIGluamVjdGlvbnNdKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGFpbmVyLmludm9rZShwcm9kdWNlciwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmplY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cbiIsImxldCBpbnN0YW5jZVNlcmlhbE5vID0gLTE7XG5cbmV4cG9ydCBjbGFzcyBDb21wb25lbnRJbnN0YW5jZVdyYXBwZXIge1xuICAgIHB1YmxpYyByZWFkb25seSBzZXJpYWxObyA9ICsraW5zdGFuY2VTZXJpYWxObztcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBpbnN0YW5jZTogdW5rbm93bikge31cblxuICAgIHB1YmxpYyBjb21wYXJlVG8ob3RoZXI6IENvbXBvbmVudEluc3RhbmNlV3JhcHBlcik6IC0xIHwgMCB8IDEge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXJpYWxObyA+IG90aGVyLnNlcmlhbE5vID8gLTEgOiB0aGlzLnNlcmlhbE5vIDwgb3RoZXIuc2VyaWFsTm8gPyAxIDogMDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IExpZmVjeWNsZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vTGlmZWN5Y2xlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGludm9rZVByZURlc3Ryb3koaW5zdGFuY2U6IHVua25vd24pIHtcbiAgICBjb25zdCBjbGF6eiA9IGluc3RhbmNlPy5jb25zdHJ1Y3RvcjtcbiAgICBpZiAoIWNsYXp6KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShjbGF6eiwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgY29uc3QgcHJlRGVzdHJveU1ldGhvZHMgPSBtZXRhZGF0YS5nZXRNZXRob2RzKExpZmVjeWNsZS5QUkVfREVTVFJPWSk7XG4gICAgcHJlRGVzdHJveU1ldGhvZHMuZm9yRWFjaChtZXRob2ROYW1lID0+IHtcbiAgICAgICAgY29uc3QgbWV0aG9kID0gY2xhenoucHJvdG90eXBlW21ldGhvZE5hbWVdO1xuICAgICAgICBpZiAodHlwZW9mIG1ldGhvZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbWV0aG9kLmFwcGx5KGluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuIiwiaW1wb3J0IHsgR2V0SW5zdGFuY2VPcHRpb25zLCBJbnN0YW5jZVJlc29sdXRpb24sIFNhdmVJbnN0YW5jZU9wdGlvbnMgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZVJlc29sdXRpb24nO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgQ29tcG9uZW50SW5zdGFuY2VXcmFwcGVyIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9Db21wb25lbnRJbnN0YW5jZVdyYXBwZXInO1xuaW1wb3J0IHsgaW52b2tlUHJlRGVzdHJveSB9IGZyb20gJy4uL2NvbW1vbi9pbnZva2VQcmVEZXN0cm95JztcblxuZXhwb3J0IGNsYXNzIFNpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbiBpbXBsZW1lbnRzIEluc3RhbmNlUmVzb2x1dGlvbiB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBJTlNUQU5DRV9NQVAgPSBuZXcgTWFwPElkZW50aWZpZXIsIENvbXBvbmVudEluc3RhbmNlV3JhcHBlcj4oKTtcbiAgICBnZXRJbnN0YW5jZTxULCBPPihvcHRpb25zOiBHZXRJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiBUIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuSU5TVEFOQ0VfTUFQLmdldChvcHRpb25zLmlkZW50aWZpZXIpPy5pbnN0YW5jZSBhcyBUO1xuICAgIH1cblxuICAgIHNhdmVJbnN0YW5jZTxULCBPPihvcHRpb25zOiBTYXZlSW5zdGFuY2VPcHRpb25zPFQsIE8+KTogdm9pZCB7XG4gICAgICAgIHRoaXMuSU5TVEFOQ0VfTUFQLnNldChvcHRpb25zLmlkZW50aWZpZXIsIG5ldyBDb21wb25lbnRJbnN0YW5jZVdyYXBwZXIob3B0aW9ucy5pbnN0YW5jZSkpO1xuICAgIH1cblxuICAgIHNob3VsZEdlbmVyYXRlPFQsIE8+KG9wdGlvbnM6IEdldEluc3RhbmNlT3B0aW9uczxULCBPPik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gIXRoaXMuSU5TVEFOQ0VfTUFQLmhhcyhvcHRpb25zLmlkZW50aWZpZXIpO1xuICAgIH1cbiAgICBkZXN0cm95KCkge1xuICAgICAgICBjb25zdCBpbnN0YW5jZVdyYXBwZXJzID0gQXJyYXkuZnJvbSh0aGlzLklOU1RBTkNFX01BUC52YWx1ZXMoKSk7XG4gICAgICAgIGluc3RhbmNlV3JhcHBlcnMuc29ydCgoYSwgYikgPT4gYS5jb21wYXJlVG8oYikpO1xuICAgICAgICBpbnN0YW5jZVdyYXBwZXJzLmZvckVhY2goaW5zdGFuY2VXcmFwcGVyID0+IHtcbiAgICAgICAgICAgIGludm9rZVByZURlc3Ryb3koaW5zdGFuY2VXcmFwcGVyLmluc3RhbmNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuSU5TVEFOQ0VfTUFQLmNsZWFyKCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgR2V0SW5zdGFuY2VPcHRpb25zLCBJbnN0YW5jZVJlc29sdXRpb24sIFNhdmVJbnN0YW5jZU9wdGlvbnMgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZVJlc29sdXRpb24nO1xuaW1wb3J0IHsgU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uIH0gZnJvbSAnLi9TaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24nO1xuXG5jb25zdCBTSU5HTEVUT05fSU5TVEFOQ0VfU0lOR0xFVE9OID0gbmV3IFNpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbigpO1xuXG5leHBvcnQgY2xhc3MgR2xvYmFsU2hhcmVkSW5zdGFuY2VSZXNvbHV0aW9uIGltcGxlbWVudHMgSW5zdGFuY2VSZXNvbHV0aW9uIHtcbiAgICBnZXRJbnN0YW5jZTxULCBPPihvcHRpb25zOiBHZXRJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiBUIHtcbiAgICAgICAgcmV0dXJuIFNJTkdMRVRPTl9JTlNUQU5DRV9TSU5HTEVUT04uZ2V0SW5zdGFuY2Uob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgc2F2ZUluc3RhbmNlPFQsIE8+KG9wdGlvbnM6IFNhdmVJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiB2b2lkIHtcbiAgICAgICAgU0lOR0xFVE9OX0lOU1RBTkNFX1NJTkdMRVRPTi5zYXZlSW5zdGFuY2Uob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgc2hvdWxkR2VuZXJhdGU8VCwgTz4ob3B0aW9uczogR2V0SW5zdGFuY2VPcHRpb25zPFQsIE8+KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBTSU5HTEVUT05fSU5TVEFOQ0VfU0lOR0xFVE9OLnNob3VsZEdlbmVyYXRlKG9wdGlvbnMpO1xuICAgIH1cbiAgICBkZXN0cm95KCkge1xuICAgICAgICAvLyBQQVNTO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEluc3RhbmNlUmVzb2x1dGlvbiwgU2F2ZUluc3RhbmNlT3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlUmVzb2x1dGlvbic7XG5pbXBvcnQgeyBpbnZva2VQcmVEZXN0cm95IH0gZnJvbSAnLi4vY29tbW9uL2ludm9rZVByZURlc3Ryb3knO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNpZW50SW5zdGFuY2VSZXNvbHV0aW9uIGltcGxlbWVudHMgSW5zdGFuY2VSZXNvbHV0aW9uIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGluc3RhbmNlcyA9IG5ldyBTZXQ8dW5rbm93bj4oKTtcbiAgICBzaG91bGRHZW5lcmF0ZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZ2V0SW5zdGFuY2U8VD4oKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzYXZlSW5zdGFuY2U8VCwgTz4ob3B0aW9uczogU2F2ZUluc3RhbmNlT3B0aW9uczxULCBPPik6IHZvaWQge1xuICAgICAgICB0aGlzLmluc3RhbmNlcy5hZGQob3B0aW9ucy5pbnN0YW5jZSk7XG4gICAgfVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuaW5zdGFuY2VzLmZvckVhY2goaXQgPT4ge1xuICAgICAgICAgICAgaWYgKCFpdCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGludm9rZVByZURlc3Ryb3koaXQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5pbnN0YW5jZXMuY2xlYXIoKTtcbiAgICB9XG4gICAgZGVzdHJveVRoYXQ8VD4oaW5zdGFuY2U6IFQpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmluc3RhbmNlcy5oYXMoaW5zdGFuY2UpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaW52b2tlUHJlRGVzdHJveShpbnN0YW5jZSk7XG4gICAgICAgIHRoaXMuaW5zdGFuY2VzLmRlbGV0ZShpbnN0YW5jZSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgRXZhbHVhdG9yIH0gZnJvbSAnLi4vdHlwZXMvRXZhbHVhdG9yJztcbmltcG9ydCB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4uL2ZvdW5kYXRpb24vQXBwbGljYXRpb25Db250ZXh0JztcbmltcG9ydCB7IEpTT05EYXRhIH0gZnJvbSAnLi4vdHlwZXMvSlNPTkRhdGEnO1xuXG5leHBvcnQgY2xhc3MgSlNPTkRhdGFFdmFsdWF0b3IgaW1wbGVtZW50cyBFdmFsdWF0b3Ige1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbmFtZXNwYWNlRGF0YU1hcCA9IG5ldyBNYXA8c3RyaW5nLCBKU09ORGF0YT4oKTtcbiAgICBldmFsPFQ+KGNvbnRleHQ6IEFwcGxpY2F0aW9uQ29udGV4dCwgZXhwcmVzc2lvbjogc3RyaW5nKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IGNvbG9uSW5kZXggPSBleHByZXNzaW9uLmluZGV4T2YoJzonKTtcbiAgICAgICAgaWYgKGNvbG9uSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luY29ycmVjdCBleHByZXNzaW9uLCBuYW1lc3BhY2Ugbm90IHNwZWNpZmllZCcpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5hbWVzcGFjZSA9IGV4cHJlc3Npb24uc3Vic3RyaW5nKDAsIGNvbG9uSW5kZXgpO1xuICAgICAgICBjb25zdCBleHAgPSBleHByZXNzaW9uLnN1YnN0cmluZyhjb2xvbkluZGV4ICsgMSk7XG4gICAgICAgIGlmICghdGhpcy5uYW1lc3BhY2VEYXRhTWFwLmhhcyhuYW1lc3BhY2UpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEluY29ycmVjdCBleHByZXNzaW9uOiBuYW1lc3BhY2Ugbm90IHJlY29yZGVkOiBcIiR7bmFtZXNwYWNlfVwiYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMubmFtZXNwYWNlRGF0YU1hcC5nZXQobmFtZXNwYWNlKSBhcyBKU09ORGF0YTtcbiAgICAgICAgcmV0dXJuIHJ1bkV4cHJlc3Npb24oZXhwLCBkYXRhIGFzIE9iamVjdCk7XG4gICAgfVxuICAgIHJlY29yZERhdGEobmFtZXNwYWNlOiBzdHJpbmcsIGRhdGE6IEpTT05EYXRhKSB7XG4gICAgICAgIHRoaXMubmFtZXNwYWNlRGF0YU1hcC5zZXQobmFtZXNwYWNlLCBkYXRhKTtcbiAgICB9XG4gICAgZ2V0SlNPTkRhdGEobmFtZXNwYWNlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZXNwYWNlRGF0YU1hcC5nZXQobmFtZXNwYWNlKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJ1bkV4cHJlc3Npb24oZXhwcmVzc2lvbjogc3RyaW5nLCByb290Q29udGV4dDogT2JqZWN0KSB7XG4gICAgY29uc3QgZm4gPSBjb21waWxlRXhwcmVzc2lvbihleHByZXNzaW9uKTtcbiAgICByZXR1cm4gZm4ocm9vdENvbnRleHQpO1xufVxuXG5mdW5jdGlvbiBjb21waWxlRXhwcmVzc2lvbihleHByZXNzaW9uOiBzdHJpbmcpIHtcbiAgICBpZiAoZXhwcmVzc2lvbi5pbmRleE9mKCcsJykgPiAtMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEluY29ycmVjdCBleHByZXNzaW9uIHN5bnRheCwgVGhlICcsJyBpcyBub3QgYWxsb3dlZCBpbiBleHByZXNzaW9uOiBcIiR7ZXhwcmVzc2lvbn1cImApO1xuICAgIH1cbiAgICBpZiAoZXhwcmVzc2lvbi5sZW5ndGggPiAxMjApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYEluY29ycmVjdCBleHByZXNzaW9uIHN5bnRheCwgZXhwcmVzc2lvbiBsZW5ndGggY2Fubm90IGJlIGdyZWF0ZXIgdGhhbiAxMjAsIGJ1dCBhY3R1YWw6ICR7ZXhwcmVzc2lvbi5sZW5ndGh9YFxuICAgICAgICApO1xuICAgIH1cbiAgICBpZiAoL1xcKC4qP1xcKS8udGVzdChleHByZXNzaW9uKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEluY29ycmVjdCBleHByZXNzaW9uIHN5bnRheCwgcGFyZW50aGVzZXMgYXJlIG5vdCBhbGxvd2VkIGluIGV4cHJlc3Npb246IFwiJHtleHByZXNzaW9ufVwiYCk7XG4gICAgfVxuICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnRyaW0oKTtcbiAgICBpZiAoZXhwcmVzc2lvbiA9PT0gJycpIHtcbiAgICAgICAgcmV0dXJuIChyb290OiBPYmplY3QpID0+IHJvb3Q7XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdFZhck5hbWUgPSB2YXJOYW1lKCdjb250ZXh0Jyk7XG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbihcbiAgICAgICAgcm9vdFZhck5hbWUsXG4gICAgICAgIGBcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gJHtyb290VmFyTmFtZX0uJHtleHByZXNzaW9ufTtcbiAgICAgICAgfSBjYXRjaChlcnJvcikgeyB0aHJvdyBlcnJvciB9XG4gICAgYFxuICAgICk7XG59XG5sZXQgVkFSX1NFUVVFTkNFID0gRGF0ZS5ub3coKTtcbmZ1bmN0aW9uIHZhck5hbWUocHJlZml4OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gcHJlZml4ICsgJycgKyAoVkFSX1NFUVVFTkNFKyspLnRvU3RyaW5nKDE2KTtcbn1cbiIsImltcG9ydCB7IEV2YWx1YXRvciB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRvcic7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5cbmV4cG9ydCBjbGFzcyBFbnZpcm9ubWVudEV2YWx1YXRvciBpbXBsZW1lbnRzIEV2YWx1YXRvciB7XG4gICAgZXZhbDxUPihjb250ZXh0OiBBcHBsaWNhdGlvbkNvbnRleHQsIGV4cHJlc3Npb246IHN0cmluZyk6IFQgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gcHJvY2Vzcy5lbnZbZXhwcmVzc2lvbl0gYXMgVCB8IHVuZGVmaW5lZDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBFdmFsdWF0b3IgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0b3InO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuXG5leHBvcnQgY2xhc3MgQXJndkV2YWx1YXRvciBpbXBsZW1lbnRzIEV2YWx1YXRvciB7XG4gICAgZXZhbDxULCBBID0gc3RyaW5nW10+KGNvbnRleHQ6IEFwcGxpY2F0aW9uQ29udGV4dCwgZXhwcmVzc2lvbjogc3RyaW5nLCBhcmdzPzogQSk6IFQgfCB1bmRlZmluZWQge1xuICAgICAgICBjb25zdCBhcmd2ID0gYXJncyB8fCBwcm9jZXNzLmFyZ3Y7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdmFyLXJlcXVpcmVzXG4gICAgICAgIGNvbnN0IG1pbmltaXN0ID0gcmVxdWlyZSgnbWluaW1pc3QnKTtcbiAgICAgICAgY29uc3QgbWFwID0gbWluaW1pc3QoYXJndik7XG4gICAgICAgIHJldHVybiBtYXBbZXhwcmVzc2lvbl07XG4gICAgfVxufVxuIiwiZXhwb3J0IGVudW0gQWR2aWNlIHtcbiAgICBCZWZvcmUsXG4gICAgQWZ0ZXIsXG4gICAgQXJvdW5kLFxuICAgIEFmdGVyUmV0dXJuLFxuICAgIFRocm93bixcbiAgICBGaW5hbGx5XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuL0FkdmljZSc7XG5cbnR5cGUgQmVmb3JlSG9vayA9IChhcmdzOiBhbnlbXSkgPT4gdm9pZDtcbnR5cGUgQWZ0ZXJIb29rID0gKGFyZ3M6IGFueVtdKSA9PiB2b2lkO1xudHlwZSBUaHJvd25Ib29rID0gKHJlYXNvbjogYW55LCBhcmdzOiBhbnlbXSkgPT4gdm9pZDtcbnR5cGUgRmluYWxseUhvb2sgPSAoYXJnczogYW55W10pID0+IHZvaWQ7XG50eXBlIEFmdGVyUmV0dXJuSG9vayA9IChyZXR1cm5WYWx1ZTogYW55LCBhcmdzOiBhbnlbXSkgPT4gYW55O1xudHlwZSBBcm91bmRIb29rID0gKHRoaXM6IGFueSwgb3JpZ2luZm46ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCwgYXJnczogYW55W10pID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBBc3BlY3RVdGlscyB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBiZWZvcmVIb29rczogQXJyYXk8QmVmb3JlSG9vaz4gPSBbXTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGFmdGVySG9va3M6IEFycmF5PEFmdGVySG9vaz4gPSBbXTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHRocm93bkhvb2tzOiBBcnJheTxUaHJvd25Ib29rPiA9IFtdO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZmluYWxseUhvb2tzOiBBcnJheTxGaW5hbGx5SG9vaz4gPSBbXTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGFmdGVyUmV0dXJuSG9va3M6IEFycmF5PEFmdGVyUmV0dXJuSG9vaz4gPSBbXTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGFyb3VuZEhvb2tzOiBBcnJheTxBcm91bmRIb29rPiA9IFtdO1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZm46ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KSB7fVxuICAgIGFwcGVuZChhZHZpY2U6IEFkdmljZS5CZWZvcmUsIGhvb2s6IEJlZm9yZUhvb2spOiB2b2lkO1xuICAgIGFwcGVuZChhZHZpY2U6IEFkdmljZS5BZnRlciwgaG9vazogQWZ0ZXJIb29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuVGhyb3duLCBob29rOiBUaHJvd25Ib29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuRmluYWxseSwgaG9vazogRmluYWxseUhvb2spOiB2b2lkO1xuICAgIGFwcGVuZChhZHZpY2U6IEFkdmljZS5BZnRlclJldHVybiwgaG9vazogQWZ0ZXJSZXR1cm5Ib29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuQXJvdW5kLCBob29rOiBBcm91bmRIb29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UsIGhvb2s6IEZ1bmN0aW9uKSB7XG4gICAgICAgIGxldCBob29rc0FycmF5OiBGdW5jdGlvbltdIHwgdW5kZWZpbmVkO1xuICAgICAgICBzd2l0Y2ggKGFkdmljZSkge1xuICAgICAgICAgICAgY2FzZSBBZHZpY2UuQmVmb3JlOlxuICAgICAgICAgICAgICAgIGhvb2tzQXJyYXkgPSB0aGlzLmJlZm9yZUhvb2tzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBZHZpY2UuQWZ0ZXI6XG4gICAgICAgICAgICAgICAgaG9va3NBcnJheSA9IHRoaXMuYWZ0ZXJIb29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLlRocm93bjpcbiAgICAgICAgICAgICAgICBob29rc0FycmF5ID0gdGhpcy50aHJvd25Ib29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLkZpbmFsbHk6XG4gICAgICAgICAgICAgICAgaG9va3NBcnJheSA9IHRoaXMuZmluYWxseUhvb2tzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBZHZpY2UuQWZ0ZXJSZXR1cm46XG4gICAgICAgICAgICAgICAgaG9va3NBcnJheSA9IHRoaXMuYWZ0ZXJSZXR1cm5Ib29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLkFyb3VuZDpcbiAgICAgICAgICAgICAgICBob29rc0FycmF5ID0gdGhpcy5hcm91bmRIb29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaG9va3NBcnJheSkge1xuICAgICAgICAgICAgaG9va3NBcnJheS5wdXNoKGhvb2spO1xuICAgICAgICB9XG4gICAgfVxuICAgIGV4dHJhY3QoKSB7XG4gICAgICAgIGNvbnN0IHsgYXJvdW5kSG9va3MsIGJlZm9yZUhvb2tzLCBhZnRlckhvb2tzLCBhZnRlclJldHVybkhvb2tzLCBmaW5hbGx5SG9va3MsIHRocm93bkhvb2tzIH0gPSB0aGlzO1xuICAgICAgICBjb25zdCBmbjogdHlwZW9mIHRoaXMuZm4gPSBhcm91bmRIb29rcy5yZWR1Y2VSaWdodCgocHJldiwgbmV4dCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0aGlzOiBhbnksIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQuY2FsbCh0aGlzLCBwcmV2LCBhcmdzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sIHRoaXMuZm4pO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHRoaXM6IGFueSwgLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgICAgIGJlZm9yZUhvb2tzLmZvckVhY2goaG9vayA9PiB7XG4gICAgICAgICAgICAgICAgaG9vay5jYWxsKHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBpbnZva2UgPSAob25FcnJvcjogKHJlYXNvbjogYW55KSA9PiB2b2lkLCBvbkZpbmFsbHk6ICgpID0+IHZvaWQsIG9uQWZ0ZXI6IChyZXR1cm5WYWx1ZTogYW55KSA9PiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmV0dXJuVmFsdWU6IGFueTtcbiAgICAgICAgICAgICAgICBsZXQgaXNQcm9taXNlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSBmbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJldHVyblZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNQcm9taXNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblZhbHVlID0gcmV0dXJuVmFsdWUuY2F0Y2gob25FcnJvcikuZmluYWxseShvbkZpbmFsbHkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1Byb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRmluYWxseSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpc1Byb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlLnRoZW4oKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvbkFmdGVyKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9uQWZ0ZXIocmV0dXJuVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gaW52b2tlKFxuICAgICAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRocm93bkhvb2tzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93bkhvb2tzLmZvckVhY2goaG9vayA9PiBob29rLmNhbGwodGhpcywgZXJyb3IsIGFyZ3MpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGZpbmFsbHlIb29rcy5mb3JFYWNoKGhvb2sgPT4gaG9vay5jYWxsKHRoaXMsIGFyZ3MpKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHZhbHVlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYWZ0ZXJIb29rcy5mb3JFYWNoKGhvb2sgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaG9vay5jYWxsKHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFmdGVyUmV0dXJuSG9va3MucmVkdWNlKChyZXRWYWwsIGhvb2spID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBob29rLmNhbGwodGhpcywgcmV0VmFsLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSAqL1xuaW1wb3J0IHR5cGUgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuL0FkdmljZSc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBBc3BlY3QsIEpvaW5Qb2ludCwgUHJvY2VlZGluZ0pvaW5Qb2ludCB9IGZyb20gJy4vQXNwZWN0JztcbmltcG9ydCB7IEFzcGVjdFV0aWxzIH0gZnJvbSAnLi9Bc3BlY3RVdGlscyc7XG5pbXBvcnQgeyBBc3BlY3RJbmZvIH0gZnJvbSAnLi9Bc3BlY3RNZXRhZHRhJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFzcGVjdDxUPihcbiAgICBhcHBDdHg6IEFwcGxpY2F0aW9uQ29udGV4dCxcbiAgICB0YXJnZXQ6IFQsXG4gICAgbWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sLFxuICAgIG1ldGhvZEZ1bmM6IEZ1bmN0aW9uLFxuICAgIGFzcGVjdHM6IEFzcGVjdEluZm9bXVxuKSB7XG4gICAgY29uc3QgY3JlYXRlQXNwZWN0Q3R4ID0gKGFkdmljZTogQWR2aWNlLCBhcmdzOiBhbnlbXSwgcmV0dXJuVmFsdWU6IGFueSA9IG51bGwsIGVycm9yOiBhbnkgPSBudWxsKTogSm9pblBvaW50ID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRhcmdldCxcbiAgICAgICAgICAgIG1ldGhvZE5hbWUsXG4gICAgICAgICAgICBhcmd1bWVudHM6IGFyZ3MsXG4gICAgICAgICAgICByZXR1cm5WYWx1ZSxcbiAgICAgICAgICAgIGVycm9yLFxuICAgICAgICAgICAgYWR2aWNlLFxuICAgICAgICAgICAgY3R4OiBhcHBDdHhcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIGNvbnN0IGFzcGVjdFV0aWxzID0gbmV3IEFzcGVjdFV0aWxzKG1ldGhvZEZ1bmMgYXMgKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpO1xuICAgIGNvbnN0IENsYXNzVG9JbnN0YW5jZSA9IChhc3BlY3RJbmZvOiBBc3BlY3RJbmZvKSA9PiBhcHBDdHguZ2V0SW5zdGFuY2UoYXNwZWN0SW5mby5hc3BlY3RDbGFzcykgYXMgQXNwZWN0O1xuICAgIGNvbnN0IHRhcmdldENvbnN0cnVjdG9yID0gKHRhcmdldCBhcyBvYmplY3QpLmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8VD47XG4gICAgY29uc3QgYWxsTWF0Y2hBc3BlY3RzID0gYXNwZWN0cy5maWx0ZXIoaXQgPT4gaXQucG9pbnRjdXQudGVzdCh0YXJnZXRDb25zdHJ1Y3RvciwgbWV0aG9kTmFtZSkpO1xuXG4gICAgY29uc3QgYmVmb3JlQWR2aWNlQXNwZWN0cyA9IGFsbE1hdGNoQXNwZWN0cy5maWx0ZXIoaXQgPT4gaXQuYWR2aWNlID09PSBBZHZpY2UuQmVmb3JlKS5tYXAoQ2xhc3NUb0luc3RhbmNlKTtcbiAgICBjb25zdCBhZnRlckFkdmljZUFzcGVjdHMgPSBhbGxNYXRjaEFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LmFkdmljZSA9PT0gQWR2aWNlLkFmdGVyKS5tYXAoQ2xhc3NUb0luc3RhbmNlKTtcbiAgICBjb25zdCB0cnlDYXRjaEFkdmljZUFzcGVjdHMgPSBhbGxNYXRjaEFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LmFkdmljZSA9PT0gQWR2aWNlLlRocm93bikubWFwKENsYXNzVG9JbnN0YW5jZSk7XG4gICAgY29uc3QgdHJ5RmluYWxseUFkdmljZUFzcGVjdHMgPSBhbGxNYXRjaEFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LmFkdmljZSA9PT0gQWR2aWNlLkZpbmFsbHkpLm1hcChDbGFzc1RvSW5zdGFuY2UpO1xuICAgIGNvbnN0IGFmdGVyUmV0dXJuQWR2aWNlQXNwZWN0cyA9IGFsbE1hdGNoQXNwZWN0cy5maWx0ZXIoaXQgPT4gaXQuYWR2aWNlID09PSBBZHZpY2UuQWZ0ZXJSZXR1cm4pLm1hcChDbGFzc1RvSW5zdGFuY2UpO1xuICAgIGNvbnN0IGFyb3VuZEFkdmljZUFzcGVjdHMgPSBhbGxNYXRjaEFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LmFkdmljZSA9PT0gQWR2aWNlLkFyb3VuZCkubWFwKENsYXNzVG9JbnN0YW5jZSk7XG5cbiAgICBpZiAoYmVmb3JlQWR2aWNlQXNwZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFzcGVjdFV0aWxzLmFwcGVuZChBZHZpY2UuQmVmb3JlLCAoYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGpvaW5Qb2ludCA9IGNyZWF0ZUFzcGVjdEN0eChBZHZpY2UuQmVmb3JlLCBhcmdzKTtcbiAgICAgICAgICAgIGJlZm9yZUFkdmljZUFzcGVjdHMuZm9yRWFjaChhc3BlY3QgPT4ge1xuICAgICAgICAgICAgICAgIGFzcGVjdC5leGVjdXRlKGpvaW5Qb2ludCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChhZnRlckFkdmljZUFzcGVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLkFmdGVyLCAoYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGpvaW5Qb2ludCA9IGNyZWF0ZUFzcGVjdEN0eChBZHZpY2UuQWZ0ZXIsIGFyZ3MpO1xuICAgICAgICAgICAgYWZ0ZXJBZHZpY2VBc3BlY3RzLmZvckVhY2goYXNwZWN0ID0+IHtcbiAgICAgICAgICAgICAgICBhc3BlY3QuZXhlY3V0ZShqb2luUG9pbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodHJ5Q2F0Y2hBZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXNwZWN0VXRpbHMuYXBwZW5kKEFkdmljZS5UaHJvd24sIChlcnJvciwgYXJncykgPT4ge1xuICAgICAgICAgICAgY29uc3Qgam9pblBvaW50ID0gY3JlYXRlQXNwZWN0Q3R4KEFkdmljZS5UaHJvd24sIGFyZ3MsIG51bGwsIGVycm9yKTtcbiAgICAgICAgICAgIHRyeUNhdGNoQWR2aWNlQXNwZWN0cy5mb3JFYWNoKGFzcGVjdCA9PiB7XG4gICAgICAgICAgICAgICAgYXNwZWN0LmV4ZWN1dGUoam9pblBvaW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodHJ5RmluYWxseUFkdmljZUFzcGVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLkZpbmFsbHksIChhcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgam9pblBvaW50ID0gY3JlYXRlQXNwZWN0Q3R4KEFkdmljZS5GaW5hbGx5LCBhcmdzKTtcbiAgICAgICAgICAgIHRyeUZpbmFsbHlBZHZpY2VBc3BlY3RzLmZvckVhY2goYXNwZWN0ID0+IHtcbiAgICAgICAgICAgICAgICBhc3BlY3QuZXhlY3V0ZShqb2luUG9pbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChhZnRlclJldHVybkFkdmljZUFzcGVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLkFmdGVyUmV0dXJuLCAocmV0dXJuVmFsdWUsIGFyZ3MpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhZnRlclJldHVybkFkdmljZUFzcGVjdHMucmVkdWNlKChwcmV2UmV0dXJuVmFsdWUsIGFzcGVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGpvaW5Qb2ludCA9IGNyZWF0ZUFzcGVjdEN0eChBZHZpY2UuQWZ0ZXJSZXR1cm4sIGFyZ3MsIHJldHVyblZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXNwZWN0LmV4ZWN1dGUoam9pblBvaW50KTtcbiAgICAgICAgICAgIH0sIHJldHVyblZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGFyb3VuZEFkdmljZUFzcGVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhcm91bmRBZHZpY2VBc3BlY3RzLmZvckVhY2goYXNwZWN0ID0+IHtcbiAgICAgICAgICAgIGFzcGVjdFV0aWxzLmFwcGVuZChBZHZpY2UuQXJvdW5kLCAob3JpZ2luRm4sIGFyZ3MpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBqb2luUG9pbnQgPSBjcmVhdGVBc3BlY3RDdHgoQWR2aWNlLkFyb3VuZCwgYXJncywgbnVsbCkgYXMgUHJvY2VlZGluZ0pvaW5Qb2ludDtcbiAgICAgICAgICAgICAgICBqb2luUG9pbnQucHJvY2VlZCA9IChqcEFyZ3MgPSBhcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5GbihqcEFyZ3MpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFzcGVjdC5leGVjdXRlKGpvaW5Qb2ludCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFzcGVjdFV0aWxzLmV4dHJhY3QoKTtcbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cbmltcG9ydCB7IEFzcGVjdCwgSm9pblBvaW50IH0gZnJvbSAnLi9Bc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ29tcG9uZW50TWV0aG9kQXNwZWN0IGltcGxlbWVudHMgQXNwZWN0IHtcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZShjbGF6ejogTmV3YWJsZTx1bmtub3duPiwgbWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sKTogTmV3YWJsZTxBc3BlY3Q+IHtcbiAgICAgICAgcmV0dXJuIGNsYXNzIENvbXBvbmVudE1ldGhvZEFzcGVjdEltcGwgZXh0ZW5kcyBDb21wb25lbnRNZXRob2RBc3BlY3Qge1xuICAgICAgICAgICAgZXhlY3V0ZShqcDogSm9pblBvaW50KTogYW55IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhc3BlY3RJbnN0YW5jZSA9IGpwLmN0eC5nZXRJbnN0YW5jZShjbGF6eikgYXMgYW55O1xuICAgICAgICAgICAgICAgIGNvbnN0IGZ1bmMgPSBhc3BlY3RJbnN0YW5jZVttZXRob2ROYW1lXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXMuYXNwZWN0SW5zdGFuY2UsIGpwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIGFzcGVjdEluc3RhbmNlITogYW55O1xuICAgIGFic3RyYWN0IGV4ZWN1dGUoY3R4OiBKb2luUG9pbnQpOiBhbnk7XG59XG4iLCJpbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgTWV0YWRhdGEsIE1ldGFkYXRhUmVhZGVyIH0gZnJvbSAnLi4vdHlwZXMvTWV0YWRhdGEnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi9BZHZpY2UnO1xuaW1wb3J0IHsgQ29tcG9uZW50TWV0aG9kQXNwZWN0IH0gZnJvbSAnLi9Db21wb25lbnRNZXRob2RBc3BlY3QnO1xuaW1wb3J0IHsgUG9pbnRjdXQgfSBmcm9tICcuL1BvaW50Y3V0JztcblxuZXhwb3J0IGludGVyZmFjZSBBc3BlY3RJbmZvIHtcbiAgICBhc3BlY3RDbGFzczogTmV3YWJsZTx1bmtub3duPjtcbiAgICBtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2w7XG4gICAgcG9pbnRjdXQ6IFBvaW50Y3V0O1xuICAgIGFkdmljZTogQWR2aWNlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFzcGVjdE1ldGFkYXRhUmVhZGVyIGV4dGVuZHMgTWV0YWRhdGFSZWFkZXIge1xuICAgIGdldEFzcGVjdHMoanBJZGVudGlmaWVyOiBJZGVudGlmaWVyLCBqcE1lbWJlcjogc3RyaW5nIHwgc3ltYm9sKTogQXNwZWN0SW5mb1tdO1xufVxuXG5leHBvcnQgY2xhc3MgQXNwZWN0TWV0YWRhdGEgaW1wbGVtZW50cyBNZXRhZGF0YTxBc3BlY3RNZXRhZGF0YVJlYWRlciwgdm9pZD4ge1xuICAgIHByaXZhdGUgc3RhdGljIElOU1RBTkNFID0gbmV3IEFzcGVjdE1ldGFkYXRhKCk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBhc3BlY3RzOiBBc3BlY3RJbmZvW10gPSBbXTtcbiAgICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCkge1xuICAgICAgICByZXR1cm4gQXNwZWN0TWV0YWRhdGEuSU5TVEFOQ0U7XG4gICAgfVxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8vXG4gICAgfVxuICAgIGluaXQoKTogdm9pZCB7XG4gICAgICAgIC8vXG4gICAgfVxuICAgIGFwcGVuZChjb21wb25lbnRBc3BlY3RDbGFzczogTmV3YWJsZTx1bmtub3duPiwgbWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sLCBhZHZpY2U6IEFkdmljZSwgcG9pbnRjdXQ6IFBvaW50Y3V0KSB7XG4gICAgICAgIGNvbnN0IEFzcGVjdENsYXNzID0gQ29tcG9uZW50TWV0aG9kQXNwZWN0LmNyZWF0ZShjb21wb25lbnRBc3BlY3RDbGFzcywgbWV0aG9kTmFtZSk7XG4gICAgICAgIHRoaXMuYXNwZWN0cy5wdXNoKHtcbiAgICAgICAgICAgIGFzcGVjdENsYXNzOiBBc3BlY3RDbGFzcyxcbiAgICAgICAgICAgIG1ldGhvZE5hbWUsXG4gICAgICAgICAgICBwb2ludGN1dCxcbiAgICAgICAgICAgIGFkdmljZVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVhZGVyKCk6IEFzcGVjdE1ldGFkYXRhUmVhZGVyIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldEFzcGVjdHM6IChqcElkZW50aWZpZXIsIGpwTWVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNwZWN0cy5maWx0ZXIoKHsgcG9pbnRjdXQgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnRjdXQudGVzdChqcElkZW50aWZpZXIsIGpwTWVtYmVyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yJztcbmltcG9ydCB0eXBlIHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHsgY3JlYXRlQXNwZWN0IH0gZnJvbSAnLi9jcmVhdGVBc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQXNwZWN0TWV0YWRhdGEgfSBmcm9tICcuL0FzcGVjdE1ldGFkdGEnO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQU9QSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yIGltcGxlbWVudHMgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB7XG4gICAgc3RhdGljIGNyZWF0ZShhcHBDdHg6IEFwcGxpY2F0aW9uQ29udGV4dCk6IE5ld2FibGU8QU9QSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yPiB7XG4gICAgICAgIHJldHVybiBjbGFzcyBleHRlbmRzIEFPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3NvciB7XG4gICAgICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgYXBwQ3R4OiBBcHBsaWNhdGlvbkNvbnRleHQgPSBhcHBDdHg7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSBhcHBDdHg6IEFwcGxpY2F0aW9uQ29udGV4dDtcbiAgICBhZnRlckluc3RhbnRpYXRpb248VCBleHRlbmRzIG9iamVjdD4oaW5zdGFuY2U6IFQpOiBUIHtcbiAgICAgICAgaWYgKCFpbnN0YW5jZSB8fCB0eXBlb2YgaW5zdGFuY2UgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY2xhenogPSBpbnN0YW5jZS5jb25zdHJ1Y3RvcjtcblxuICAgICAgICBjb25zdCBhc3BlY3RNZXRhZGF0YSA9IEFzcGVjdE1ldGFkYXRhLmdldEluc3RhbmNlKCkucmVhZGVyKCk7XG4gICAgICAgIC8vIGNvbnN0IHVzZUFzcGVjdE1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoY2xhenosIEFPUENsYXNzTWV0YWRhdGEpO1xuICAgICAgICAvLyBjb25zdCB1c2VBc3BlY3RNZXRhZGF0YVJlYWRlciA9IHVzZUFzcGVjdE1ldGFkYXRhLnJlYWRlcigpO1xuICAgICAgICAvLyBjb25zdCB1c2VBc3BlY3RzTWFwID0gdXNlQXNwZWN0TWV0YWRhdGFSZWFkZXIuZ2V0QXNwZWN0cygpO1xuICAgICAgICAvLyBpZiAodXNlQXNwZWN0c01hcC5zaXplID09PSAwKSB7XG4gICAgICAgIC8vICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIC8vIH1cblxuICAgICAgICBjb25zdCBhc3BlY3RTdG9yZU1hcCA9IG5ldyBXZWFrTWFwPG9iamVjdCwgTWFwPHN0cmluZyB8IHN5bWJvbCwgRnVuY3Rpb24+PigpO1xuICAgICAgICBhc3BlY3RTdG9yZU1hcC5zZXQoaW5zdGFuY2UsIG5ldyBNYXA8c3RyaW5nIHwgc3ltYm9sLCBGdW5jdGlvbj4oKSk7XG5cbiAgICAgICAgY29uc3QgcHJveHlSZXN1bHQgPSBuZXcgUHJveHkoaW5zdGFuY2UsIHtcbiAgICAgICAgICAgIGdldDogKHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5WYWx1ZSA9IFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpO1xuICAgICAgICAgICAgICAgIHN3aXRjaCAocHJvcCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdjb25zdHJ1Y3Rvcic6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luVmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChSZWZsZWN0Lmhhcyh0YXJnZXQsIHByb3ApICYmIHR5cGVvZiBvcmlnaW5WYWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhc3BlY3RNYXAgPSBhc3BlY3RTdG9yZU1hcC5nZXQoaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWFzcGVjdE1hcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpblZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChhc3BlY3RNYXAuaGFzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXNwZWN0TWFwLmdldChwcm9wKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhc3BlY3RzT2ZNZXRob2QgPSBhc3BlY3RNZXRhZGF0YS5nZXRBc3BlY3RzKGNsYXp6IGFzIElkZW50aWZpZXIsIHByb3ApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhc3BlY3RGbiA9IGNyZWF0ZUFzcGVjdCh0aGlzLmFwcEN0eCwgdGFyZ2V0LCBwcm9wLCBvcmlnaW5WYWx1ZSwgYXNwZWN0c09mTWV0aG9kKTtcbiAgICAgICAgICAgICAgICAgICAgYXNwZWN0TWFwLnNldChwcm9wLCBhc3BlY3RGbik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhc3BlY3RGbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpblZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb3h5UmVzdWx0O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3NvciwgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL3R5cGVzL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcic7XG5pbXBvcnQgeyBsYXp5TWVtYmVyIH0gZnJvbSAnQHZnZXJib3QvbGF6eSc7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlJztcbmltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuXG5leHBvcnQgY2xhc3MgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlciB7XG4gICAgcHJpdmF0ZSBpbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzOiBTZXQ8TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPj4gPSBuZXcgU2V0KCk7XG4gICAgQGxhenlNZW1iZXI8SW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlciwga2V5b2YgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlciwgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvcltdPih7XG4gICAgICAgIGV2YWx1YXRlOiBpbnN0YW5jZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBnbG9iYWxJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzID0gR2xvYmFsTWV0YWRhdGEuZ2V0UmVhZGVyKCkuZ2V0SW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcygpO1xuICAgICAgICAgICAgY29uc3QgaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcyA9IGdsb2JhbEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuY29uY2F0KFxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oaW5zdGFuY2UuaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcylcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3Nlcy5tYXAoaXQgPT4gaW5zdGFuY2UuY29udGFpbmVyLmdldEluc3RhbmNlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3IsIHZvaWQ+KGl0KSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlc2V0Qnk6IFtcbiAgICAgICAgICAgIGluc3RhbmNlID0+IGluc3RhbmNlLmluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuc2l6ZSxcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBnbG9iYWxJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzID0gR2xvYmFsTWV0YWRhdGEuZ2V0UmVhZGVyKCkuZ2V0SW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcygpO1xuICAgICAgICAgICAgICAgIHJldHVybiBnbG9iYWxJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH0pXG4gICAgcHJpdmF0ZSBpbnN0QXdhcmVQcm9jZXNzb3JJbnN0YW5jZXMhOiBBcnJheTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY29udGFpbmVyOiBBcHBsaWNhdGlvbkNvbnRleHQpIHt9XG4gICAgYXBwZW5kSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3M6IE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4pIHtcbiAgICAgICAgdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLmFkZChpbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyk7XG4gICAgfVxuICAgIGFwcGVuZEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoXG4gICAgICAgIGluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXM6IFNldDxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+PiB8IEFycmF5PE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4+XG4gICAgKSB7XG4gICAgICAgIGluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuZm9yRWFjaChpdCA9PiB7XG4gICAgICAgICAgICB0aGlzLmluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuYWRkKGl0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGJlZm9yZUluc3RhbnRpYXRpb248VD4oY29tcG9uZW50Q2xhc3M6IE5ld2FibGU8VD4sIGFyZ3M6IHVua25vd25bXSkge1xuICAgICAgICBjb25zdCBpbnN0QXdhcmVQcm9jZXNzb3JzID0gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JJbnN0YW5jZXM7XG4gICAgICAgIGxldCBpbnN0YW5jZTogdW5kZWZpbmVkIHwgSW5zdGFuY2U8VD47XG4gICAgICAgIGluc3RBd2FyZVByb2Nlc3NvcnMuc29tZShwcm9jZXNzb3IgPT4ge1xuICAgICAgICAgICAgaWYgKCFwcm9jZXNzb3IuYmVmb3JlSW5zdGFudGlhdGlvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluc3RhbmNlID0gcHJvY2Vzc29yLmJlZm9yZUluc3RhbnRpYXRpb248VD4oY29tcG9uZW50Q2xhc3MsIGFyZ3MpIGFzIEluc3RhbmNlPFQ+O1xuICAgICAgICAgICAgcmV0dXJuICEhaW5zdGFuY2U7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfVxuICAgIGFmdGVySW5zdGFudGlhdGlvbjxUPihpbnN0YW5jZTogSW5zdGFuY2U8VD4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29ySW5zdGFuY2VzLnJlZHVjZSgoaW5zdGFuY2UsIHByb2Nlc3NvcikgPT4ge1xuICAgICAgICAgICAgaWYgKHByb2Nlc3Nvci5hZnRlckluc3RhbnRpYXRpb24pIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBwcm9jZXNzb3IuYWZ0ZXJJbnN0YW50aWF0aW9uKGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICBpZiAoISFyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdCBhcyBJbnN0YW5jZTxUPjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIH0sIGluc3RhbmNlKTtcbiAgICB9XG4gICAgaXNJbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyhjbHM6IE5ld2FibGU8dW5rbm93bj4pIHtcbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IHRoaXMuZ2V0SW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcygpO1xuICAgICAgICByZXR1cm4gY2xhc3Nlcy5pbmRleE9mKGNscyBhcyBOZXdhYmxlPEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcj4pID4gLTE7XG4gICAgfVxuICAgIGdldEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoKSB7XG4gICAgICAgIGNvbnN0IGdsb2JhbEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlYWRlcigpLmdldEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoKTtcbiAgICAgICAgcmV0dXJuIGdsb2JhbEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuY29uY2F0KEFycmF5LmZyb20odGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSW5zdGFuY2VTY29wZSB9IGZyb20gJy4vSW5zdGFuY2VTY29wZSc7XG5pbXBvcnQgeyBJbnN0YW5jZVJlc29sdXRpb24gfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZVJlc29sdXRpb24nO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgU2VydmljZUZhY3RvcnkgfSBmcm9tICcuLi90eXBlcy9TZXJ2aWNlRmFjdG9yeSc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIsIEV2ZW50TGlzdGVuZXIgfSBmcm9tICcuL0V2ZW50RW1pdHRlcic7XG5pbXBvcnQgeyBBbnlGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzL0FueUZ1bmN0aW9uJztcbmltcG9ydCB7IGhhc0FyZ3MsIGhhc0luamVjdGlvbnMsIEludm9rZUZ1bmN0aW9uT3B0aW9ucyB9IGZyb20gJy4vSW52b2tlRnVuY3Rpb25PcHRpb25zJztcbmltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuaW1wb3J0IHsgRmFjdG9yeUlkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9GYWN0b3J5SWRlbnRpZmllcic7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhLCBDbGFzc01ldGFkYXRhUmVhZGVyIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBDb21wb25lbnRJbnN0YW5jZUJ1aWxkZXIgfSBmcm9tICcuL0NvbXBvbmVudEluc3RhbmNlQnVpbGRlcic7XG5pbXBvcnQgeyBGdW5jdGlvbk1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvRnVuY3Rpb25NZXRhZGF0YSc7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHRPcHRpb25zIH0gZnJvbSAnLi4vdHlwZXMvQXBwbGljYXRpb25Db250ZXh0T3B0aW9ucyc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IFNpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbiB9IGZyb20gJy4uL3Jlc29sdXRpb24vU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IEdsb2JhbFNoYXJlZEluc3RhbmNlUmVzb2x1dGlvbiB9IGZyb20gJy4uL3Jlc29sdXRpb24vR2xvYmFsU2hhcmVkSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IFRyYW5zaWVudEluc3RhbmNlUmVzb2x1dGlvbiB9IGZyb20gJy4uL3Jlc29sdXRpb24vVHJhbnNpZW50SW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IEV2YWx1YXRpb25PcHRpb25zLCBFeHByZXNzaW9uVHlwZSB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRlT3B0aW9ucyc7XG5pbXBvcnQgeyBKU09ORGF0YSB9IGZyb20gJy4uL3R5cGVzL0pTT05EYXRhJztcbmltcG9ydCB7IEV2YWx1YXRvciB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRvcic7XG5pbXBvcnQgeyBKU09ORGF0YUV2YWx1YXRvciB9IGZyb20gJy4uL2V2YWx1YXRvci9KU09ORGF0YUV2YWx1YXRvcic7XG5pbXBvcnQgeyBFbnZpcm9ubWVudEV2YWx1YXRvciB9IGZyb20gJy4uL2V2YWx1YXRvci9FbnZpcm9ubWVudEV2YWx1YXRvcic7XG5pbXBvcnQgeyBBcmd2RXZhbHVhdG9yIH0gZnJvbSAnLi4vZXZhbHVhdG9yL0FyZ3ZFdmFsdWF0b3InO1xuaW1wb3J0IHsgaXNOb2RlSnMgfSBmcm9tICcuLi9jb21tb24vaXNOb2RlSnMnO1xuaW1wb3J0IHsgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL3R5cGVzL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcic7XG5pbXBvcnQgeyBBT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3IgfSBmcm9tICcuLi9hb3AvQU9QSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yJztcbmltcG9ydCB7IEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXIgfSBmcm9tICcuL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXInO1xuaW1wb3J0IHsgTGlmZWN5Y2xlTWFuYWdlciB9IGZyb20gJy4vTGlmZWN5Y2xlTWFuYWdlcic7XG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlJztcbmltcG9ydCB7IEZhY3RvcnlSZWNvcmRlciB9IGZyb20gJy4uL2NvbW1vbi9GYWN0b3J5UmVjb3JkZXInO1xuaW1wb3J0IHsgTGlmZWN5Y2xlIH0gZnJvbSAnLi9MaWZlY3ljbGUnO1xuXG5jb25zdCBQUkVfREVTVFJPWV9FVkVOVF9LRVkgPSAnY29udGFpbmVyOmV2ZW50OnByZS1kZXN0cm95JztcbmNvbnN0IFBSRV9ERVNUUk9ZX1RIQVRfRVZFTlRfS0VZID0gJ2NvbnRhaW5lcjpldmVudDpwcmUtZGVzdHJveS10aGF0JztcbmNvbnN0IElOU1RBTkNFX1BSRV9ERVNUUk9ZX01FVEhPRCA9IFN5bWJvbCgnc29saWRpdW06aW5zdGFuY2UtcHJlLWRlc3Ryb3knKTtcblxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uQ29udGV4dCB7XG4gICAgcHJpdmF0ZSByZWFkb25seSByZXNvbHV0aW9ucyA9IG5ldyBNYXA8SW5zdGFuY2VTY29wZSB8IHN0cmluZywgSW5zdGFuY2VSZXNvbHV0aW9uPigpO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgcHJpdmF0ZSByZWFkb25seSBmYWN0b3JpZXMgPSBuZXcgRmFjdG9yeVJlY29yZGVyKCk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBldmFsdWF0b3JDbGFzc2VzID0gbmV3IE1hcDxzdHJpbmcsIE5ld2FibGU8RXZhbHVhdG9yPj4oKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGV2ZW50RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGRlZmF1bHRTY29wZTogSW5zdGFuY2VTY29wZTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxhenlNb2RlOiBib29sZWFuO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlcjogSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlcjtcbiAgICBwcml2YXRlIGlzRGVzdHJveWVkID0gZmFsc2U7XG4gICAgcHVibGljIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEFwcGxpY2F0aW9uQ29udGV4dE9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLmRlZmF1bHRTY29wZSA9IG9wdGlvbnMuZGVmYXVsdFNjb3BlIHx8IEluc3RhbmNlU2NvcGUuU0lOR0xFVE9OO1xuICAgICAgICB0aGlzLmxhenlNb2RlID0gb3B0aW9ucy5sYXp5TW9kZSA/PyB0cnVlO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySW5zdGFuY2VTY29wZVJlc29sdXRpb24oSW5zdGFuY2VTY29wZS5TSU5HTEVUT04sIFNpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbik7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJJbnN0YW5jZVNjb3BlUmVzb2x1dGlvbihJbnN0YW5jZVNjb3BlLkdMT0JBTF9TSEFSRURfU0lOR0xFVE9OLCBHbG9iYWxTaGFyZWRJbnN0YW5jZVJlc29sdXRpb24pO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySW5zdGFuY2VTY29wZVJlc29sdXRpb24oSW5zdGFuY2VTY29wZS5UUkFOU0lFTlQsIFRyYW5zaWVudEluc3RhbmNlUmVzb2x1dGlvbik7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmFsdWF0b3IoRXhwcmVzc2lvblR5cGUuSlNPTl9QQVRILCBKU09ORGF0YUV2YWx1YXRvcik7XG4gICAgICAgIGlmIChpc05vZGVKcykge1xuICAgICAgICAgICAgdGhpcy5yZWdpc3RlckV2YWx1YXRvcihFeHByZXNzaW9uVHlwZS5FTlYsIEVudmlyb25tZW50RXZhbHVhdG9yKTtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFdmFsdWF0b3IoRXhwcmVzc2lvblR5cGUuQVJHViwgQXJndkV2YWx1YXRvcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyID0gbmV3IEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXIodGhpcyk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJJbnN0QXdhcmVQcm9jZXNzb3IoQU9QSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yLmNyZWF0ZSh0aGlzKSk7XG4gICAgfVxuICAgIGdldEluc3RhbmNlPFQsIE8+KHN5bWJvbDogTmV3YWJsZTxUPiwgb3duZXI/OiBPKTogVDtcbiAgICBnZXRJbnN0YW5jZTxULCBPPihzeW1ib2w6IElkZW50aWZpZXI8VD4sIG93bmVyPzogTyk6IFQgfCBUW107XG4gICAgZ2V0SW5zdGFuY2U8VCwgTz4oc3ltYm9sOiBJZGVudGlmaWVyPFQ+LCBvd25lcj86IE8pOiBUIHwgVFtdIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzeW1ib2wgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBzeW1ib2wgPT09ICdzeW1ib2wnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW5jZUJ5U3ltYm9sKHN5bWJvbCwgb3duZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbmNlQnlDbGFzcyhzeW1ib2wsIG93bmVyKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRJbnN0YW5jZUJ5U3ltYm9sPFQsIE8+KHN5bWJvbDogc3RyaW5nIHwgc3ltYm9sLCBvd25lcj86IE8pOiBUIHwgVFtdIHtcbiAgICAgICAgY29uc3QgZmFjdG9yeURlZiA9IHRoaXMuZ2V0RmFjdG9yeShzeW1ib2wpO1xuICAgICAgICBpZiAoZmFjdG9yeURlZikge1xuICAgICAgICAgICAgY29uc3QgcHJvZHVjZXIgPSBmYWN0b3J5RGVmLnByb2R1Y2UodGhpcywgb3duZXIpO1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHByb2R1Y2VyKCkgYXMgVCB8IFRbXTtcbiAgICAgICAgICAgIHRoaXMuYXR0YWNoUHJlRGVzdHJveUhvb2socmVzdWx0KTtcbiAgICAgICAgICAgIGNvbnN0IGNvbnN0ciA9IHJlc3VsdD8uY29uc3RydWN0b3I7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbnN0ciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudENsYXNzID0gY29uc3RyIGFzIE5ld2FibGU8VD47XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzb2x2ZXIgPSBuZXcgTGlmZWN5Y2xlTWFuYWdlcjxUPihjb21wb25lbnRDbGFzcywgdGhpcyk7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNJbnN0QXdhcmVQcm9jZXNzb3IgPSB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuaXNJbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyhjb21wb25lbnRDbGFzcyk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZXIuaW52b2tlUHJlSW5qZWN0TWV0aG9kKHJlc3VsdCBhcyBJbnN0YW5jZTxUPik7XG4gICAgICAgICAgICAgICAgaWYgKCFpc0luc3RBd2FyZVByb2Nlc3Nvcikge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuYWZ0ZXJJbnN0YW50aWF0aW9uKHJlc3VsdCBhcyBJbnN0YW5jZTxUPik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlc29sdmVyLmludm9rZVBvc3RJbmplY3RNZXRob2QocmVzdWx0IGFzIEluc3RhbmNlPFQ+KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjbGFzc01ldGFkYXRhID0gR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWFkZXIoKS5nZXRDbGFzc01ldGFkYXRhPFQ+KHN5bWJvbCk7XG4gICAgICAgICAgICBpZiAoIWNsYXNzTWV0YWRhdGEpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENsYXNzIGFsaWFzIG5vdCBmb3VuZDogJHtzeW1ib2wudG9TdHJpbmcoKX1gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2xhenogPSBjbGFzc01ldGFkYXRhLnJlYWRlcigpLmdldENsYXNzKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2VCeUNsYXNzKGNsYXp6LCBvd25lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRJbnN0YW5jZUJ5Q2xhc3M8VCwgTz4oY29tcG9uZW50Q2xhc3M6IE5ld2FibGU8VD4sIG93bmVyPzogTyk6IFQgfCBUW10ge1xuICAgICAgICBpZiAoY29tcG9uZW50Q2xhc3MgPT09IEFwcGxpY2F0aW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMgYXMgdW5rbm93biBhcyBUO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlYWRlciA9IENsYXNzTWV0YWRhdGEuZ2V0SW5zdGFuY2UoY29tcG9uZW50Q2xhc3MpLnJlYWRlcigpO1xuICAgICAgICBjb25zdCBzY29wZSA9IHJlYWRlci5nZXRTY29wZSgpO1xuICAgICAgICBjb25zdCByZXNvbHV0aW9uID0gKHRoaXMucmVzb2x1dGlvbnMuZ2V0KHNjb3BlKSB8fCB0aGlzLnJlc29sdXRpb25zLmdldCh0aGlzLmRlZmF1bHRTY29wZSkpIGFzIEluc3RhbmNlUmVzb2x1dGlvbjtcbiAgICAgICAgY29uc3QgZ2V0SW5zdGFuY2VPcHRpb25zID0ge1xuICAgICAgICAgICAgaWRlbnRpZmllcjogY29tcG9uZW50Q2xhc3MsXG4gICAgICAgICAgICBvd25lcixcbiAgICAgICAgICAgIG93bmVyUHJvcGVydHlLZXk6IHVuZGVmaW5lZFxuICAgICAgICB9O1xuICAgICAgICBpZiAocmVzb2x1dGlvbi5zaG91bGRHZW5lcmF0ZShnZXRJbnN0YW5jZU9wdGlvbnMpKSB7XG4gICAgICAgICAgICBjb25zdCBidWlsZGVyID0gdGhpcy5jcmVhdGVDb21wb25lbnRJbnN0YW5jZUJ1aWxkZXIoY29tcG9uZW50Q2xhc3MpO1xuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBidWlsZGVyLmJ1aWxkKCk7XG4gICAgICAgICAgICBjb25zdCBzYXZlSW5zdGFuY2VPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIC4uLmdldEluc3RhbmNlT3B0aW9ucyxcbiAgICAgICAgICAgICAgICBpbnN0YW5jZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlc29sdXRpb24uc2F2ZUluc3RhbmNlKHNhdmVJbnN0YW5jZU9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5hdHRhY2hQcmVEZXN0cm95SG9vayhpbnN0YW5jZSk7XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x1dGlvbi5nZXRJbnN0YW5jZShnZXRJbnN0YW5jZU9wdGlvbnMpIGFzIFQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBhdHRhY2hQcmVEZXN0cm95SG9vazxUPihpbnN0YW5jZXM6IFQgfCBUW10pIHtcbiAgICAgICAgY29uc3QgaW5zdGFuY2VzQXJyYXkgPSBBcnJheS5pc0FycmF5KGluc3RhbmNlcykgPyBpbnN0YW5jZXMgOiBbaW5zdGFuY2VzXTtcbiAgICAgICAgaW5zdGFuY2VzQXJyYXkuZm9yRWFjaChpdCA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGl0IGFzIEluc3RhbmNlPFQ+O1xuICAgICAgICAgICAgaWYgKFJlZmxlY3QuaGFzKGluc3RhbmNlLCBJTlNUQU5DRV9QUkVfREVTVFJPWV9NRVRIT0QpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY2xhenogPSBpbnN0YW5jZS5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgIGlmICghY2xhenopIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGluc3RhbmNlLmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcblxuICAgICAgICAgICAgbWV0YWRhdGEuYWRkTGlmZWN5Y2xlTWV0aG9kKElOU1RBTkNFX1BSRV9ERVNUUk9ZX01FVEhPRCwgTGlmZWN5Y2xlLlBSRV9ERVNUUk9ZKTtcbiAgICAgICAgICAgIFJlZmxlY3Quc2V0KGluc3RhbmNlLCBJTlNUQU5DRV9QUkVfREVTVFJPWV9NRVRIT0QsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KFBSRV9ERVNUUk9ZX0VWRU5UX0tFWSwgaW5zdGFuY2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZUNvbXBvbmVudEluc3RhbmNlQnVpbGRlcjxUPihjb21wb25lbnRDbGFzczogTmV3YWJsZTxUPikge1xuICAgICAgICBjb25zdCBidWlsZGVyID0gbmV3IENvbXBvbmVudEluc3RhbmNlQnVpbGRlcihjb21wb25lbnRDbGFzcywgdGhpcywgdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyKTtcbiAgICAgICAgYnVpbGRlci5hcHBlbmRMYXp5TW9kZSh0aGlzLmxhenlNb2RlKTtcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXI7XG4gICAgfVxuXG4gICAgZ2V0RmFjdG9yeShrZXk6IEZhY3RvcnlJZGVudGlmaWVyKSB7XG4gICAgICAgIGNvbnN0IGZhY3RvcnkgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlYWRlcigpLmdldENvbXBvbmVudEZhY3Rvcnkoa2V5KTtcbiAgICAgICAgaWYgKCFmYWN0b3J5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mYWN0b3JpZXMuZ2V0KGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfVxuICAgIGJpbmRGYWN0b3J5PFQ+KFxuICAgICAgICBzeW1ib2w6IEZhY3RvcnlJZGVudGlmaWVyLFxuICAgICAgICBmYWN0b3J5OiBTZXJ2aWNlRmFjdG9yeTxULCB1bmtub3duPixcbiAgICAgICAgaW5qZWN0aW9ucz86IElkZW50aWZpZXJbXSxcbiAgICAgICAgaXNTaW5nbGU/OiBib29sZWFuXG4gICAgKSB7XG4gICAgICAgIHRoaXMuZmFjdG9yaWVzLmFwcGVuZChzeW1ib2wsIGZhY3RvcnksIGluamVjdGlvbnMsIGlzU2luZ2xlKTtcbiAgICB9XG4gICAgaW52b2tlPFIsIEN0eD4oZnVuYzogQW55RnVuY3Rpb248UiwgQ3R4Piwgb3B0aW9uczogSW52b2tlRnVuY3Rpb25PcHRpb25zPEN0eD4gPSB7fSk6IFIge1xuICAgICAgICBsZXQgZm46IEFueUZ1bmN0aW9uPFI+O1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGZuID0gZnVuYy5iaW5kKG9wdGlvbnMuY29udGV4dCBhcyBUaGlzUGFyYW1ldGVyVHlwZTx0eXBlb2YgZnVuYz4pIGFzIEFueUZ1bmN0aW9uPFI+O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm4gPSBmdW5jIGFzIEFueUZ1bmN0aW9uPFI+O1xuICAgICAgICB9XG4gICAgICAgIGlmIChoYXNBcmdzKG9wdGlvbnMpKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5hcmdzID8gZm4oLi4ub3B0aW9ucy5hcmdzKSA6IGZuKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGFyZ3NJbmRlbnRpZmllcnM6IElkZW50aWZpZXJbXSA9IFtdO1xuICAgICAgICBpZiAoaGFzSW5qZWN0aW9ucyhvcHRpb25zKSkge1xuICAgICAgICAgICAgYXJnc0luZGVudGlmaWVycyA9IG9wdGlvbnMuaW5qZWN0aW9ucztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoZm4sIEZ1bmN0aW9uTWV0YWRhdGEpLnJlYWRlcigpO1xuICAgICAgICAgICAgYXJnc0luZGVudGlmaWVycyA9IG1ldGFkYXRhLmdldFBhcmFtZXRlcnMoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhcmdzID0gYXJnc0luZGVudGlmaWVycy5tYXAoKGlkZW50aWZpZXIsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0SW5zdGFuY2UoaWRlbnRpZmllcik7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnN0YW5jZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0FycmF5VHlwZSA9IChpZGVudGlmaWVyIGFzIHVua25vd24pID09PSBBcnJheTtcbiAgICAgICAgICAgICAgICBpZiAoaXNBcnJheVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIG1hdGNoaW5nIGluamVjdGFibGVzIGZvdW5kIGZvciBwYXJhbWV0ZXIgYXQgJHtpbmRleH0uYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZVswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBhcmdzLmxlbmd0aCA+IDAgPyBmbiguLi5hcmdzKSA6IGZuKCk7XG4gICAgfVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgICAgIHRoaXMuZXZlbnRFbWl0dGVyLmVtaXQoUFJFX0RFU1RST1lfRVZFTlRfS0VZKTtcbiAgICAgICAgdGhpcy5yZXNvbHV0aW9ucy5mb3JFYWNoKGl0ID0+IHtcbiAgICAgICAgICAgIGl0LmRlc3Ryb3koKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGV2YWx1YXRlPFQsIE8sIEE+KGV4cHJlc3Npb246IHN0cmluZywgb3B0aW9uczogRXZhbHVhdGlvbk9wdGlvbnM8Tywgc3RyaW5nLCBBPik6IFQgfCB1bmRlZmluZWQge1xuICAgICAgICBjb25zdCBldmFsdWF0b3JDbGFzcyA9IHRoaXMuZXZhbHVhdG9yQ2xhc3Nlcy5nZXQob3B0aW9ucy50eXBlKTtcbiAgICAgICAgaWYgKCFldmFsdWF0b3JDbGFzcykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgVW5rbm93biBldmFsdWF0b3IgbmFtZTogJHtvcHRpb25zLnR5cGV9YCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZXZhbHVhdG9yID0gdGhpcy5nZXRJbnN0YW5jZShldmFsdWF0b3JDbGFzcyk7XG4gICAgICAgIHJldHVybiBldmFsdWF0b3IuZXZhbCh0aGlzLCBleHByZXNzaW9uLCBvcHRpb25zLmV4dGVybmFsQXJncyk7XG4gICAgfVxuICAgIHJlY29yZEpTT05EYXRhKG5hbWVzcGFjZTogc3RyaW5nLCBkYXRhOiBKU09ORGF0YSkge1xuICAgICAgICBjb25zdCBldmFsdWF0b3IgPSB0aGlzLmdldEluc3RhbmNlKEpTT05EYXRhRXZhbHVhdG9yKTtcbiAgICAgICAgZXZhbHVhdG9yLnJlY29yZERhdGEobmFtZXNwYWNlLCBkYXRhKTtcbiAgICB9XG4gICAgZ2V0SlNPTkRhdGEobmFtZXNwYWNlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgZXZhbHVhdG9yID0gdGhpcy5nZXRJbnN0YW5jZShKU09ORGF0YUV2YWx1YXRvcik7XG4gICAgICAgIHJldHVybiBldmFsdWF0b3IuZ2V0SlNPTkRhdGEobmFtZXNwYWNlKTtcbiAgICB9XG4gICAgYmluZEluc3RhbmNlPFQ+KGlkZW50aWZpZXI6IHN0cmluZyB8IHN5bWJvbCwgaW5zdGFuY2U6IFQpIHtcbiAgICAgICAgY29uc3QgcmVzb2x1dGlvbiA9IHRoaXMucmVzb2x1dGlvbnMuZ2V0KEluc3RhbmNlU2NvcGUuU0lOR0xFVE9OKTtcbiAgICAgICAgcmVzb2x1dGlvbj8uc2F2ZUluc3RhbmNlKHtcbiAgICAgICAgICAgIGlkZW50aWZpZXIsXG4gICAgICAgICAgICBpbnN0YW5jZVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVnaXN0ZXJJbnN0YW5jZVNjb3BlUmVzb2x1dGlvbjxUIGV4dGVuZHMgTmV3YWJsZTxJbnN0YW5jZVJlc29sdXRpb24+PihcbiAgICAgICAgc2NvcGU6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmcsXG4gICAgICAgIHJlc29sdXRpb25Db25zdHJ1Y3RvcjogVCxcbiAgICAgICAgY29uc3RydWN0b3JBcmdzPzogQ29uc3RydWN0b3JQYXJhbWV0ZXJzPFQ+XG4gICAgKSB7XG4gICAgICAgIHRoaXMucmVzb2x1dGlvbnMuc2V0KHNjb3BlLCBuZXcgcmVzb2x1dGlvbkNvbnN0cnVjdG9yKC4uLihjb25zdHJ1Y3RvckFyZ3MgPz8gW10pKSk7XG4gICAgfVxuICAgIHJlZ2lzdGVyRXZhbHVhdG9yKG5hbWU6IHN0cmluZywgZXZhbHVhdG9yQ2xhc3M6IE5ld2FibGU8RXZhbHVhdG9yPikge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGV2YWx1YXRvckNsYXNzLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgbWV0YWRhdGEuc2V0U2NvcGUoSW5zdGFuY2VTY29wZS5TSU5HTEVUT04pO1xuICAgICAgICB0aGlzLmV2YWx1YXRvckNsYXNzZXMuc2V0KG5hbWUsIGV2YWx1YXRvckNsYXNzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFJlZ2lzdGVycyBhbiBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3IgY2xhc3MgdG8gY3VzdG9taXplXG4gICAgICogICAgICB0aGUgaW5zdGFudGlhdGlvbiBwcm9jZXNzIGF0IHZhcmlvdXMgc3RhZ2VzIHdpdGhpbiB0aGUgSW9DXG4gICAgICogQGRlcHJlY2F0ZWQgUmVwbGFjZWQgd2l0aCB7QGxpbmsgcmVnaXN0ZXJCZWZvcmVJbnN0YW50aWF0aW9uUHJvY2Vzc29yfSBhbmQge0BsaW5rIHJlZ2lzdGVyQWZ0ZXJJbnN0YW50aWF0aW9uUHJvY2Vzc29yfVxuICAgICAqIEBwYXJhbSB7TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPn0gY2xhenpcbiAgICAgKiBAc2VlIEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3NvclxuICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAqL1xuICAgIHJlZ2lzdGVySW5zdEF3YXJlUHJvY2Vzc29yKGNsYXp6OiBOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+KSB7XG4gICAgICAgIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5hcHBlbmRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyhjbGF6eik7XG4gICAgfVxuICAgIHJlZ2lzdGVyQmVmb3JlSW5zdGFudGlhdGlvblByb2Nlc3Nvcihwcm9jZXNzb3I6IDxUPihjb25zdHJ1Y3RvcjogTmV3YWJsZTxUPiwgYXJnczogdW5rbm93bltdKSA9PiBUIHwgdW5kZWZpbmVkIHwgdm9pZCkge1xuICAgICAgICB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuYXBwZW5kSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoXG4gICAgICAgICAgICBjbGFzcyBJbm5lclByb2Nlc3NvciBpbXBsZW1lbnRzIFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3Ige1xuICAgICAgICAgICAgICAgIGJlZm9yZUluc3RhbnRpYXRpb248VD4oY29uc3RydWN0b3I6IE5ld2FibGU8VD4sIGFyZ3M6IHVua25vd25bXSk6IHZvaWQgfCBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3Nvcihjb25zdHJ1Y3RvciwgYXJncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbiAgICByZWdpc3RlckFmdGVySW5zdGFudGlhdGlvblByb2Nlc3Nvcihwcm9jZXNzb3I6IDxUIGV4dGVuZHMgb2JqZWN0PihpbnN0YW5jZTogVCkgPT4gVCkge1xuICAgICAgICB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuYXBwZW5kSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoXG4gICAgICAgICAgICBjbGFzcyBJbm5lclByb2Nlc3NvciBpbXBsZW1lbnRzIFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3Ige1xuICAgICAgICAgICAgICAgIGFmdGVySW5zdGFudGlhdGlvbjxUIGV4dGVuZHMgb2JqZWN0PihpbnN0YW5jZTogVCk6IFQge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvY2Vzc29yKGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuICAgIG9uUHJlRGVzdHJveShsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudEVtaXR0ZXIub24oUFJFX0RFU1RST1lfRVZFTlRfS0VZLCBsaXN0ZW5lcik7XG4gICAgfVxuICAgIG9uUHJlRGVzdHJveVRoYXQobGlzdGVuZXI6IChpbnN0YW5jZTogb2JqZWN0KSA9PiB2b2lkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50RW1pdHRlci5vbihQUkVfREVTVFJPWV9USEFUX0VWRU5UX0tFWSwgbGlzdGVuZXIpO1xuICAgIH1cbiAgICBnZXRDbGFzc01ldGFkYXRhPFQ+KGN0b3I6IE5ld2FibGU8VD4pIHtcbiAgICAgICAgcmV0dXJuIENsYXNzTWV0YWRhdGEuZ2V0UmVhZGVyKGN0b3IpIGFzIENsYXNzTWV0YWRhdGFSZWFkZXI8VD47XG4gICAgfVxuICAgIGRlc3Ryb3lUcmFuc2llbnRJbnN0YW5jZTxUPihpbnN0YW5jZTogVCkge1xuICAgICAgICBjb25zdCByZXNvbHV0aW9uID0gdGhpcy5yZXNvbHV0aW9ucy5nZXQoSW5zdGFuY2VTY29wZS5UUkFOU0lFTlQpO1xuICAgICAgICByZXNvbHV0aW9uPy5kZXN0cm95VGhhdCAmJiByZXNvbHV0aW9uLmRlc3Ryb3lUaGF0KGluc3RhbmNlKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBNZXRhZGF0YSwgTWV0YWRhdGFSZWFkZXIgfSBmcm9tICcuLi90eXBlcy9NZXRhZGF0YSc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBBc3BlY3QgfSBmcm9tICcuL0FzcGVjdCc7XG5pbXBvcnQgeyBjcmVhdGVEZWZhdWx0VmFsdWVNYXAsIERlZmF1bHRWYWx1ZU1hcCB9IGZyb20gJy4uL2NvbW1vbi9EZWZhdWx0VmFsdWVNYXAnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi9BZHZpY2UnO1xuXG5leHBvcnQgdHlwZSBVc2VBc3BlY3RNYXAgPSBEZWZhdWx0VmFsdWVNYXA8c3RyaW5nIHwgc3ltYm9sLCBEZWZhdWx0VmFsdWVNYXA8QWR2aWNlLCBBcnJheTxOZXdhYmxlPEFzcGVjdD4+Pj47XG5cbmV4cG9ydCBpbnRlcmZhY2UgVXNlQXNwZWN0TWV0YWRhdGFSZWFkZXIgZXh0ZW5kcyBNZXRhZGF0YVJlYWRlciB7XG4gICAgZ2V0QXNwZWN0cygpOiBVc2VBc3BlY3RNYXA7XG4gICAgZ2V0QXNwZWN0c09mKG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCwgYWR2aWNlOiBBZHZpY2UpOiBBcnJheTxOZXdhYmxlPEFzcGVjdD4+O1xufVxuZXhwb3J0IGNsYXNzIEFPUENsYXNzTWV0YWRhdGEgaW1wbGVtZW50cyBNZXRhZGF0YTxVc2VBc3BlY3RNZXRhZGF0YVJlYWRlciwgTmV3YWJsZTx1bmtub3duPj4ge1xuICAgIHN0YXRpYyBnZXRSZWZsZWN0S2V5KCkge1xuICAgICAgICByZXR1cm4gJ2FvcDp1c2UtYXNwZWN0LW1ldGFkYXRhJztcbiAgICB9XG4gICAgcHJpdmF0ZSBhc3BlY3RNYXA6IFVzZUFzcGVjdE1hcCA9IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcCgoKSA9PiBjcmVhdGVEZWZhdWx0VmFsdWVNYXAoKCkgPT4gW10pKTtcbiAgICBpbml0KCk6IHZvaWQge1xuICAgICAgICAvLyBJR05PUkVcbiAgICB9XG5cbiAgICBhcHBlbmQobWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sLCBhZHZpY2U6IEFkdmljZSwgYXNwZWN0czogQXJyYXk8TmV3YWJsZTxBc3BlY3Q+Pikge1xuICAgICAgICBjb25zdCBhZHZpY2VBc3BlY3RNYXAgPSB0aGlzLmFzcGVjdE1hcC5nZXQobWV0aG9kTmFtZSk7XG4gICAgICAgIGNvbnN0IGV4aXRpbmdBc3BlY3RBcnJheSA9IGFkdmljZUFzcGVjdE1hcC5nZXQoYWR2aWNlKTtcbiAgICAgICAgZXhpdGluZ0FzcGVjdEFycmF5LnB1c2goLi4uYXNwZWN0cyk7XG4gICAgfVxuXG4gICAgcmVhZGVyKCk6IFVzZUFzcGVjdE1ldGFkYXRhUmVhZGVyIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldEFzcGVjdHM6ICgpOiBVc2VBc3BlY3RNYXAgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzcGVjdE1hcDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRBc3BlY3RzT2Y6IChtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2wsIGFkdmljZTogQWR2aWNlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNwZWN0TWFwLmdldChtZXRob2ROYW1lKS5nZXQoYWR2aWNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmZ1bmN0aW9uIGdldE1ldGhvZERlc2NyaXB0b3JzKHByb3RvdHlwZTogb2JqZWN0KTogUmVjb3JkPHN0cmluZywgUHJvcGVydHlEZXNjcmlwdG9yPiB7XG4gICAgaWYgKFxuICAgICAgICB0eXBlb2YgcHJvdG90eXBlICE9PSAnb2JqZWN0JyB8fFxuICAgICAgICBwcm90b3R5cGUgPT09IG51bGwgfHxcbiAgICAgICAgT2JqZWN0LnByb3RvdHlwZSA9PT0gcHJvdG90eXBlIHx8XG4gICAgICAgIEZ1bmN0aW9uLnByb3RvdHlwZSA9PT0gcHJvdG90eXBlXG4gICAgKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgY29uc3Qgc3VwZXJQcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG90eXBlKTtcbiAgICBjb25zdCBzdXBlckRlc2NyaXB0b3JzID0gc3VwZXJQcm90b3R5cGUgPT09IHByb3RvdHlwZSA/IHt9IDogZ2V0TWV0aG9kRGVzY3JpcHRvcnMoc3VwZXJQcm90b3R5cGUpO1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHN1cGVyRGVzY3JpcHRvcnMsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHByb3RvdHlwZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsTWV0aG9kTWVtYmVyTmFtZXM8VD4oY2xzOiBOZXdhYmxlPFQ+KSB7XG4gICAgY29uc3QgZGVzY3JpcHRvcnMgPSBnZXRNZXRob2REZXNjcmlwdG9ycyhjbHMucHJvdG90eXBlKTtcbiAgICBkZWxldGUgZGVzY3JpcHRvcnNbJ2NvbnN0cnVjdG9yJ107XG4gICAgY29uc3QgbWV0aG9kTmFtZXMgPSBuZXcgU2V0PHN0cmluZyB8IHN5bWJvbD4oKTtcbiAgICBSZWZsZWN0Lm93bktleXMoZGVzY3JpcHRvcnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgY29uc3QgbWVtYmVyID0gY2xzLnByb3RvdHlwZVtrZXldO1xuICAgICAgICBpZiAodHlwZW9mIG1lbWJlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbWV0aG9kTmFtZXMuYWRkKGtleSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbWV0aG9kTmFtZXM7XG59XG4iLCJpbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBnZXRBbGxNZXRob2RNZW1iZXJOYW1lcyB9IGZyb20gJy4uL2NvbW1vbi9nZXRBbGxNZXRob2RNZW1iZXJOYW1lcyc7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5cbnR5cGUgTWVtYmVySWRlbnRpZmllciA9IHN0cmluZyB8IHN5bWJvbDtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFBvaW50Y3V0IHtcbiAgICBzdGF0aWMgY29tYmluZSguLi5wb2ludGN1dHM6IFBvaW50Y3V0W10pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBPclBvaW50Y3V0KHBvaW50Y3V0cyk7XG4gICAgfVxuICAgIHN0YXRpYyBvZjxUPihjbHM6IE5ld2FibGU8VD4sIC4uLm1ldGhvZE5hbWVzOiBNZW1iZXJJZGVudGlmaWVyW10pIHtcbiAgICAgICAgY29uc3QgZW50cmllcyA9IG5ldyBNYXA8TmV3YWJsZTx1bmtub3duPiwgU2V0PE1lbWJlcklkZW50aWZpZXI+PigpO1xuICAgICAgICBjb25zdCBtZXRob2RzID0gbmV3IFNldDxNZW1iZXJJZGVudGlmaWVyPihtZXRob2ROYW1lcyBhcyBNZW1iZXJJZGVudGlmaWVyW10pO1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgZ2V0QWxsTWV0aG9kTWVtYmVyTmFtZXMoY2xzKS5mb3JFYWNoKG1ldGhvZE5hbWUgPT4ge1xuICAgICAgICAgICAgICAgIG1ldGhvZHMuYWRkKG1ldGhvZE5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZW50cmllcy5zZXQoY2xzLCBtZXRob2RzKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcmVjaXRlUG9pbnRjdXQoZW50cmllcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkXG4gICAgICovXG4gICAgc3RhdGljIHRlc3RNYXRjaDxUPihjbHM6IE5ld2FibGU8VD4sIHJlZ2V4OiBSZWdFeHApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2goY2xzLCByZWdleCk7XG4gICAgfVxuICAgIHN0YXRpYyBtYXRjaDxUPihjbHM6IE5ld2FibGU8VD4sIHJlZ2V4OiBSZWdFeHApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNZW1iZXJNYXRjaFBvaW50Y3V0KGNscywgcmVnZXgpO1xuICAgIH1cbiAgICBzdGF0aWMgZnJvbSguLi5jbGFzc2VzOiBBcnJheTxOZXdhYmxlPHVua25vd24+Pikge1xuICAgICAgICBjb25zdCBvZiA9ICguLi5tZXRob2ROYW1lczogTWVtYmVySWRlbnRpZmllcltdKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE9yUG9pbnRjdXQoY2xhc3Nlcy5tYXAoY2xzID0+IFBvaW50Y3V0Lm9mKGNscywgLi4ubWV0aG9kTmFtZXMpKSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IG1hdGNoID0gKHJlZ2V4OiBSZWdFeHApID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgT3JQb2ludGN1dChcbiAgICAgICAgICAgICAgICBjbGFzc2VzLm1hcChjbHMgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IE1lbWJlck1hdGNoUG9pbnRjdXQoY2xzLCByZWdleCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvZixcbiAgICAgICAgICAgIG1hdGNoLFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0ZXN0TWF0Y2g6IG1hdGNoXG4gICAgICAgIH07XG4gICAgfVxuICAgIHN0YXRpYyBtYXJrZWQodHlwZTogc3RyaW5nIHwgc3ltYm9sLCB2YWx1ZTogdW5rbm93biA9IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNYXJrZWRQb2ludGN1dCh0eXBlLCB2YWx1ZSk7XG4gICAgfVxuICAgIHN0YXRpYyBjbGFzczxUPihjbHM6IE5ld2FibGU8VD4pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDbGFzc1BvaW50Y3V0KGNscyk7XG4gICAgfVxuICAgIGFic3RyYWN0IHRlc3QoanBJZGVudGlmaWVyOiBJZGVudGlmaWVyLCBqcE1lbWJlcjogc3RyaW5nIHwgc3ltYm9sKTogYm9vbGVhbjtcbn1cblxuY2xhc3MgT3JQb2ludGN1dCBleHRlbmRzIFBvaW50Y3V0IHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBvaW50Y3V0czogUG9pbnRjdXRbXSkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICB0ZXN0KGpwSWRlbnRpZmllcjogSWRlbnRpZmllciwganBNZW1iZXI6IHN0cmluZyB8IHN5bWJvbCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb2ludGN1dHMuc29tZShpdCA9PiBpdC50ZXN0KGpwSWRlbnRpZmllciwganBNZW1iZXIpKTtcbiAgICB9XG59XG5cbmNsYXNzIFByZWNpdGVQb2ludGN1dCBleHRlbmRzIFBvaW50Y3V0IHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IG1ldGhvZEVudHJpZXM6IE1hcDxJZGVudGlmaWVyLCBTZXQ8TWVtYmVySWRlbnRpZmllcj4+KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHRlc3QoanBJZGVudGlmaWVyOiBJZGVudGlmaWVyLCBqcE1lbWJlcjogc3RyaW5nIHwgc3ltYm9sKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IG1lbWJlcnMgPSB0aGlzLm1ldGhvZEVudHJpZXMuZ2V0KGpwSWRlbnRpZmllcik7XG4gICAgICAgIHJldHVybiAhIW1lbWJlcnMgJiYgbWVtYmVycy5oYXMoanBNZW1iZXIpO1xuICAgIH1cbn1cbmNsYXNzIE1hcmtlZFBvaW50Y3V0IGV4dGVuZHMgUG9pbnRjdXQge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbWFya2VkVHlwZTogc3RyaW5nIHwgc3ltYm9sLCBwcml2YXRlIG1hcmtlZFZhbHVlOiB1bmtub3duID0gdHJ1ZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICB0ZXN0KGpwSWRlbnRpZmllcjogSWRlbnRpZmllciwganBNZW1iZXI6IHN0cmluZyB8IHN5bWJvbCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodHlwZW9mIGpwSWRlbnRpZmllciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoanBJZGVudGlmaWVyLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgY29uc3QgbWFya0luZm8gPSBtZXRhZGF0YS5yZWFkZXIoKS5nZXRNZW1iZXJzTWFya0luZm8oanBNZW1iZXIpO1xuICAgICAgICByZXR1cm4gbWFya0luZm9bdGhpcy5tYXJrZWRUeXBlXSA9PT0gdGhpcy5tYXJrZWRWYWx1ZTtcbiAgICB9XG59XG5jbGFzcyBNZW1iZXJNYXRjaFBvaW50Y3V0IGV4dGVuZHMgUG9pbnRjdXQge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY2xheno6IE5ld2FibGU8dW5rbm93bj4sIHByaXZhdGUgcmVnZXg6IFJlZ0V4cCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICB0ZXN0KGpwSWRlbnRpZmllcjogSWRlbnRpZmllciwganBNZW1iZXI6IHN0cmluZyB8IHN5bWJvbCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4ganBJZGVudGlmaWVyID09PSB0aGlzLmNsYXp6ICYmIHR5cGVvZiBqcE1lbWJlciA9PT0gJ3N0cmluZycgJiYgISF0aGlzLnJlZ2V4LnRlc3QoanBNZW1iZXIpO1xuICAgIH1cbn1cbmNsYXNzIENsYXNzUG9pbnRjdXQgZXh0ZW5kcyBQb2ludGN1dCB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjbGF6ejogTmV3YWJsZTx1bmtub3duPikge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICB0ZXN0KGpwSWRlbnRpZmllcjogSWRlbnRpZmllcik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4ganBJZGVudGlmaWVyID09PSB0aGlzLmNsYXp6O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi9Qb2ludGN1dCc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuL0FkdmljZSc7XG5pbXBvcnQgeyBBc3BlY3RNZXRhZGF0YSB9IGZyb20gJy4vQXNwZWN0TWV0YWR0YSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRBc3BlY3QoXG4gICAgY29tcG9uZW50QXNwZWN0Q2xhc3M6IE5ld2FibGU8dW5rbm93bj4sXG4gICAgbWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sLFxuICAgIGFkdmljZTogQWR2aWNlLFxuICAgIHBvaW50Y3V0OiBQb2ludGN1dFxuKSB7XG4gICAgQXNwZWN0TWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5hcHBlbmQoY29tcG9uZW50QXNwZWN0Q2xhc3MsIG1ldGhvZE5hbWUsIGFkdmljZSwgcG9pbnRjdXQpO1xuICAgIC8vIGNvbnN0IEFzcGVjdENsYXNzID0gQ29tcG9uZW50TWV0aG9kQXNwZWN0LmNyZWF0ZShjb21wb25lbnRBc3BlY3RDbGFzcywgbWV0aG9kTmFtZSk7XG4gICAgLy8gcG9pbnRjdXQuZ2V0TWV0aG9kc01hcCgpLmZvckVhY2goKGpwTWVtYmVycywganBDbGFzcykgPT4ge1xuICAgIC8vICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGpwQ2xhc3MsIEFPUENsYXNzTWV0YWRhdGEpO1xuICAgIC8vICAgICBqcE1lbWJlcnMuZm9yRWFjaChtZXRob2ROYW1lID0+IHtcbiAgICAvLyAgICAgICAgIG1ldGFkYXRhLmFwcGVuZChtZXRob2ROYW1lLCBhZHZpY2UsIFtBc3BlY3RDbGFzc10pO1xuICAgIC8vICAgICB9KTtcbiAgICAvLyB9KTtcbn1cbiIsImltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi4vUG9pbnRjdXQnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi4vQWR2aWNlJztcbmltcG9ydCB7IGFkZEFzcGVjdCB9IGZyb20gJy4uL2FkZEFzcGVjdCc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBBZnRlcihwb2ludGN1dDogUG9pbnRjdXQpOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICBhZGRBc3BlY3QodGFyZ2V0LmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dW5rbm93bj4sIHByb3BlcnR5S2V5LCBBZHZpY2UuQWZ0ZXIsIHBvaW50Y3V0KTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgUG9pbnRjdXQgfSBmcm9tICcuLi9Qb2ludGN1dCc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuLi9BZHZpY2UnO1xuaW1wb3J0IHsgYWRkQXNwZWN0IH0gZnJvbSAnLi4vYWRkQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi8uLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIEFmdGVyUmV0dXJuKHBvaW50Y3V0OiBQb2ludGN1dCk6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgIGFkZEFzcGVjdCh0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTx1bmtub3duPiwgcHJvcGVydHlLZXksIEFkdmljZS5BZnRlclJldHVybiwgcG9pbnRjdXQpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBQb2ludGN1dCB9IGZyb20gJy4uL1BvaW50Y3V0JztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4uL0FkdmljZSc7XG5pbXBvcnQgeyBhZGRBc3BlY3QgfSBmcm9tICcuLi9hZGRBc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uLy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gQXJvdW5kKHBvaW50Y3V0OiBQb2ludGN1dCk6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgIGFkZEFzcGVjdCh0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTx1bmtub3duPiwgcHJvcGVydHlLZXksIEFkdmljZS5Bcm91bmQsIHBvaW50Y3V0KTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgUG9pbnRjdXQgfSBmcm9tICcuLi9Qb2ludGN1dCc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuLi9BZHZpY2UnO1xuaW1wb3J0IHsgYWRkQXNwZWN0IH0gZnJvbSAnLi4vYWRkQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi8uLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIEJlZm9yZShwb2ludGN1dDogUG9pbnRjdXQpOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICBhZGRBc3BlY3QodGFyZ2V0LmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dW5rbm93bj4sIHByb3BlcnR5S2V5LCBBZHZpY2UuQmVmb3JlLCBwb2ludGN1dCk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi4vUG9pbnRjdXQnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi4vQWR2aWNlJztcbmltcG9ydCB7IGFkZEFzcGVjdCB9IGZyb20gJy4uL2FkZEFzcGVjdCc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBGaW5hbGx5KHBvaW50Y3V0OiBQb2ludGN1dCk6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgIGFkZEFzcGVjdCh0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTx1bmtub3duPiwgcHJvcGVydHlLZXksIEFkdmljZS5GaW5hbGx5LCBwb2ludGN1dCk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi4vUG9pbnRjdXQnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi4vQWR2aWNlJztcbmltcG9ydCB7IGFkZEFzcGVjdCB9IGZyb20gJy4uL2FkZEFzcGVjdCc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBUaHJvd24ocG9pbnRjdXQ6IFBvaW50Y3V0KTogTWV0aG9kRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgYWRkQXNwZWN0KHRhcmdldC5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPHVua25vd24+LCBwcm9wZXJ0eUtleSwgQWR2aWNlLlRocm93biwgcG9pbnRjdXQpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuLi9BZHZpY2UnO1xuaW1wb3J0IHsgQXNwZWN0LCBQcm9jZWVkaW5nQXNwZWN0IH0gZnJvbSAnLi4vQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi8uLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IGFkZEFzcGVjdCB9IGZyb20gJy4uL2FkZEFzcGVjdCc7XG5pbXBvcnQgeyBQb2ludGN1dCB9IGZyb20gJy4uL1BvaW50Y3V0JztcblxuZnVuY3Rpb24gVXNlQXNwZWN0cyhhZHZpY2U6IEFkdmljZS5Bcm91bmQsIGFzcGVjdHM6IEFycmF5PE5ld2FibGU8UHJvY2VlZGluZ0FzcGVjdD4+KTogTWV0aG9kRGVjb3JhdG9yO1xuZnVuY3Rpb24gVXNlQXNwZWN0cyhhZHZpY2U6IEFkdmljZSwgYXNwZWN0czogQXJyYXk8TmV3YWJsZTxBc3BlY3Q+Pik6IE1ldGhvZERlY29yYXRvcjtcbmZ1bmN0aW9uIFVzZUFzcGVjdHMoYWR2aWNlOiBBZHZpY2UsIGFzcGVjdHM6IEFycmF5PE5ld2FibGU8QXNwZWN0Pj4pOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICBjb25zdCBjbGF6eiA9IHRhcmdldC5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPHR5cGVvZiB0YXJnZXQ+O1xuICAgICAgICBhc3BlY3RzLmZvckVhY2goYXNwZWN0Q2xhc3MgPT4ge1xuICAgICAgICAgICAgYWRkQXNwZWN0KGFzcGVjdENsYXNzLCAnZXhlY3V0ZScsIGFkdmljZSwgUG9pbnRjdXQub2YoY2xhenosIHByb3BlcnR5S2V5KSk7XG4gICAgICAgIH0pO1xuICAgIH07XG59XG5cbmV4cG9ydCB7IFVzZUFzcGVjdHMgfTtcbiJdLCJuYW1lcyI6WyJJbnN0YW5jZVNjb3BlIiwiRXhwcmVzc2lvblR5cGUiLCJMaWZlY3ljbGUiLCJsYXp5UHJvcCIsIkFkdmljZSIsImxhenlNZW1iZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFZQSwrQkFJWDtBQUpELENBQUEsVUFBWSxhQUFhLEVBQUE7QUFDckIsSUFBQSxhQUFBLENBQUEsV0FBQSxDQUFBLEdBQUEsb0NBQWdELENBQUE7QUFDaEQsSUFBQSxhQUFBLENBQUEsV0FBQSxDQUFBLEdBQUEsMEJBQXNDLENBQUE7QUFDdEMsSUFBQSxhQUFBLENBQUEseUJBQUEsQ0FBQSxHQUFBLHdDQUFrRSxDQUFBO0FBQ3RFLENBQUMsRUFKV0EscUJBQWEsS0FBYkEscUJBQWEsR0FJeEIsRUFBQSxDQUFBLENBQUE7O0FDSkssU0FBVSxxQkFBcUIsQ0FB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
