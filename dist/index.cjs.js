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
/* global Reflect, Promise */

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
        this.clazz = target;
        var constr = target;
        if (typeof constr.scope === 'function') {
            this.setScope(constr.scope());
        }
        if (typeof constr.inject === 'function') {
            var injections = constr.inject();
            for (var key in injections) {
                this.recordPropertyType(key, injections[key]);
            }
        }
        if (typeof constr.metadata === 'function') {
            var metadata = constr.metadata();
            if (metadata.scope) {
                this.setScope(metadata.scope);
            }
            var injections = metadata.inject;
            if (injections) {
                for (var key in injections) {
                    this.recordPropertyType(key, injections[key]);
                }
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
                return "continue";
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
            for (var key in properties) {
                var getter = properties[key](instance);
                this.defineProperty(instance, key, getter);
            }
            this.lifecycleResolver.invokePostInjectMethod(instance);
            return instance;
        }
        else {
            var instance = this.instAwareProcessorManager.beforeInstantiation(this.componentClass, args);
            if (!instance) {
                instance = new ((_b = this.componentClass).bind.apply(_b, __spreadArray([void 0], __read(args), false)))();
            }
            this.lifecycleResolver.invokePreInjectMethod(instance);
            for (var key in properties) {
                var getter = properties[key](instance);
                this.defineProperty(instance, key, getter);
            }
            instance = this.instAwareProcessorManager.afterInstantiation(instance);
            this.lifecycleResolver.invokePostInjectMethod(instance);
            return instance;
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
        var result = {};
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
                result[key] = function (instance) {
                    var producer = factory_1(_this.container, instance);
                    return function () {
                        return _this.container.invoke(producer, {
                            injections: injections_1
                        });
                    };
                };
            }
            else {
                result[key] = function (instance) {
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
                };
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
var ApplicationContext = /** @class */ (function () {
    function ApplicationContext(options) {
        if (options === void 0) { options = {}; }
        this.resolutions = new Map();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.factories = new FactoryRecorder();
        this.evaluatorClasses = new Map();
        this.eventEmitter = new EventEmitter();
        this.isDestroyed = false;
        this.defaultScope = options.defaultScope || exports.InstanceScope.SINGLETON;
        this.lazyMode = options.lazyMode === undefined ? true : options.lazyMode;
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
        if (symbol === ApplicationContext) {
            return this;
        }
        if (typeof symbol === 'string' || typeof symbol === 'symbol') {
            var factoryDef = this.getFactory(symbol);
            if (factoryDef) {
                var producer = factoryDef.produce(this, owner);
                var result = producer();
                var constr = result === null || result === void 0 ? void 0 : result.constructor;
                if (typeof constr === 'function') {
                    var componentClass_1 = constr;
                    var resolver = new LifecycleManager(componentClass_1, this);
                    var isInstAwareProcessor = this.instAwareProcessorManager.isInstAwareProcessorClass(componentClass_1);
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
                    symbol = classMetadata.reader().getClass();
                }
            }
        }
        var componentClass = symbol;
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
            return instance;
        }
        else {
            return resolution.getInstance(getInstanceOptions);
        }
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
        this.resolutions.set(scope, new (resolutionConstructor.bind.apply(resolutionConstructor, __spreadArray([void 0], __read((constructorArgs || [])), false)))());
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
    for (var key in descriptors) {
        var member = cls.prototype[key];
        if (typeof member === 'function') {
            methodNames.add(key);
        }
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguY2pzLmpzIiwic291cmNlcyI6WyIuLi9zcmMvZm91bmRhdGlvbi9JbnN0YW5jZVNjb3BlLnRzIiwiLi4vc3JjL2NvbW1vbi9EZWZhdWx0VmFsdWVNYXAudHMiLCIuLi9zcmMvbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIudHMiLCIuLi9zcmMvbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YS50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL1NlcnZpY2VGYWN0b3J5RGVmLnRzIiwiLi4vc3JjL2NvbW1vbi9GYWN0b3J5UmVjb3JkZXIudHMiLCIuLi9zcmMvbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEudHMiLCIuLi9zcmMvdHlwZXMvRXZhbHVhdGVPcHRpb25zLnRzIiwiLi4vc3JjL2NvbW1vbi9pc05vZGVKcy50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL1ZhbHVlLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvQXJndi50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0JpbmQudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9FbnYudHMiLCIuLi9zcmMvY29tbW9uL2lzTm90RGVmaW5lZC50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0ZhY3RvcnkudHMiLCIuLi9zcmMvbWV0YWRhdGEvRnVuY3Rpb25NZXRhZGF0YS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0dlbmVyYXRlLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvSW5qZWN0LnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvSW5qZWN0YWJsZS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0luc3RBd2FyZVByb2Nlc3Nvci50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0pTT05EYXRhLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvTGlmZWN5Y2xlRGVjb3JhdG9yLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvTWFyay50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0xpZmVjeWNsZS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL1Bvc3RJbmplY3QudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9QcmVEZXN0cm95LnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvUHJlSW5qZWN0LnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvU2NvcGUudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9FdmVudEVtaXR0ZXIudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9JbnZva2VGdW5jdGlvbk9wdGlvbnMudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9MaWZlY3ljbGVNYW5hZ2VyLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vQ29tcG9uZW50SW5zdGFuY2VXcmFwcGVyLnRzIiwiLi4vc3JjL2NvbW1vbi9pbnZva2VQcmVEZXN0cm95LnRzIiwiLi4vc3JjL3Jlc29sdXRpb24vU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uLnRzIiwiLi4vc3JjL3Jlc29sdXRpb24vR2xvYmFsU2hhcmVkSW5zdGFuY2VSZXNvbHV0aW9uLnRzIiwiLi4vc3JjL3Jlc29sdXRpb24vVHJhbnNpZW50SW5zdGFuY2VSZXNvbHV0aW9uLnRzIiwiLi4vc3JjL2V2YWx1YXRvci9KU09ORGF0YUV2YWx1YXRvci50cyIsIi4uL3NyYy9ldmFsdWF0b3IvRW52aXJvbm1lbnRFdmFsdWF0b3IudHMiLCIuLi9zcmMvZXZhbHVhdG9yL0FyZ3ZFdmFsdWF0b3IudHMiLCIuLi9zcmMvYW9wL0FkdmljZS50cyIsIi4uL3NyYy9hb3AvQXNwZWN0VXRpbHMudHMiLCIuLi9zcmMvYW9wL2NyZWF0ZUFzcGVjdC50cyIsIi4uL3NyYy9hb3AvQ29tcG9uZW50TWV0aG9kQXNwZWN0LnRzIiwiLi4vc3JjL2FvcC9Bc3BlY3RNZXRhZHRhLnRzIiwiLi4vc3JjL2FvcC9BT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3IudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9JbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vQXBwbGljYXRpb25Db250ZXh0LnRzIiwiLi4vc3JjL2FvcC9BT1BDbGFzc01ldGFkYXRhLnRzIiwiLi4vc3JjL2NvbW1vbi9nZXRBbGxNZXRob2RNZW1iZXJOYW1lcy50cyIsIi4uL3NyYy9hb3AvUG9pbnRjdXQudHMiLCIuLi9zcmMvYW9wL2FkZEFzcGVjdC50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9BZnRlci50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9BZnRlclJldHVybi50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9Bcm91bmQudHMiLCIuLi9zcmMvYW9wL2RlY29yYXRvcnMvQmVmb3JlLnRzIiwiLi4vc3JjL2FvcC9kZWNvcmF0b3JzL0ZpbmFsbHkudHMiLCIuLi9zcmMvYW9wL2RlY29yYXRvcnMvVGhyb3duLnRzIiwiLi4vc3JjL2FvcC9kZWNvcmF0b3JzL1VzZUFzcGVjdHMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGVudW0gSW5zdGFuY2VTY29wZSB7XG4gICAgU0lOR0xFVE9OID0gJ2lvYy1yZXNvbHV0aW9uOmNvbnRhaW5lci1zaW5nbGV0b24nLFxuICAgIFRSQU5TSUVOVCA9ICdpb2MtcmVzb2x1dGlvbjp0cmFuc2llbnQnLFxuICAgIEdMT0JBTF9TSEFSRURfU0lOR0xFVE9OID0gJ2lvYy1yZXNvbHV0aW9uOmdsb2JhbC1zaGFyZWQtc2luZ2xldG9uJ1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURlZmF1bHRWYWx1ZU1hcDxLLCBWPihmYWN0b3J5OiAoa2V5OiBLKSA9PiBWKSB7XG4gICAgY29uc3QgbWFwID0gbmV3IE1hcDxLLCBWPigpO1xuICAgIGNvbnN0IG9yaWdpbkdldCA9IG1hcC5nZXQuYmluZChtYXApO1xuICAgIG1hcC5nZXQgPSBmdW5jdGlvbiAoa2V5OiBLKSB7XG4gICAgICAgIGlmIChtYXAuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiBvcmlnaW5HZXQoa2V5KSBhcyBWO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFZhbHVlID0gZmFjdG9yeShrZXkpO1xuICAgICAgICAgICAgbWFwLnNldChrZXksIGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gbWFwLmdldChrZXkpIGFzIFY7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBtYXAgYXMgRGVmYXVsdFZhbHVlTWFwPEssIFY+O1xufVxuZXhwb3J0IHR5cGUgRGVmYXVsdFZhbHVlTWFwPEssIFY+ID0gT21pdDxNYXA8SywgVj4sICdnZXQnPiAmIHtcbiAgICBnZXQ6IChrZXk6IEspID0+IFY7XG59O1xuIiwiaW1wb3J0IHsgTWV0YWRhdGEsIE1ldGFkYXRhQ2xhc3MsIE1ldGFkYXRhUmVhZGVyIH0gZnJvbSAnLi4vdHlwZXMvTWV0YWRhdGEnO1xuaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcCB9IGZyb20gJy4uL2NvbW1vbi9EZWZhdWx0VmFsdWVNYXAnO1xuXG50eXBlIEFueU1ldGFkYXRhID0gTWV0YWRhdGE8TWV0YWRhdGFSZWFkZXIsIHVua25vd24+O1xudHlwZSBBbnlNZXRhZGF0YUNsYXNzID0gTWV0YWRhdGFDbGFzczxNZXRhZGF0YVJlYWRlciwgdW5rbm93biwgQW55TWV0YWRhdGE+O1xuXG5jb25zdCBtZXRhZGF0YUluc3RhbmNlTWFwID0gY3JlYXRlRGVmYXVsdFZhbHVlTWFwPEFueU1ldGFkYXRhQ2xhc3MsIFNldDxBbnlNZXRhZGF0YT4+KCgpID0+IG5ldyBTZXQoKSk7XG5cbmV4cG9ydCBjbGFzcyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB7XG4gICAgc3RhdGljIGdldE1ldGFkYXRhPFIgZXh0ZW5kcyBNZXRhZGF0YVJlYWRlciwgVCBleHRlbmRzIE9iamVjdCwgTSBleHRlbmRzIE1ldGFkYXRhPFIsIFQ+ID0gTWV0YWRhdGE8UiwgVD4+KFxuICAgICAgICB0YXJnZXQ6IFQsXG4gICAgICAgIG1ldGFkYXRhQ2xhc3M6IE1ldGFkYXRhQ2xhc3M8UiwgVCwgTT5cbiAgICApIHtcbiAgICAgICAgY29uc3Qga2V5ID0gbWV0YWRhdGFDbGFzcy5nZXRSZWZsZWN0S2V5KCk7XG4gICAgICAgIGxldCBtZXRhZGF0YSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoa2V5LCB0YXJnZXQpO1xuICAgICAgICBpZiAoIW1ldGFkYXRhKSB7XG4gICAgICAgICAgICBtZXRhZGF0YSA9IG5ldyBtZXRhZGF0YUNsYXNzKCk7XG4gICAgICAgICAgICBtZXRhZGF0YS5pbml0KHRhcmdldCk7XG4gICAgICAgICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKGtleSwgbWV0YWRhdGEsIHRhcmdldCk7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZVNldCA9IG1ldGFkYXRhSW5zdGFuY2VNYXAuZ2V0KG1ldGFkYXRhQ2xhc3MpO1xuICAgICAgICAgICAgaW5zdGFuY2VTZXQuYWRkKG1ldGFkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWV0YWRhdGEgYXMgTTtcbiAgICB9XG4gICAgc3RhdGljIGdldEFsbEluc3RhbmNlb2Y8TSBleHRlbmRzIEFueU1ldGFkYXRhQ2xhc3M+KG1ldGFkYXRhQ2xhc3M6IE0pIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obWV0YWRhdGFJbnN0YW5jZU1hcC5nZXQobWV0YWRhdGFDbGFzcykpO1xuICAgIH1cbn1cbiIsIi8vIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbmltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luc3RhbmNlU2NvcGUnO1xuaW1wb3J0IHsgSnNTZXJ2aWNlQ2xhc3MgfSBmcm9tICcuLi90eXBlcy9Kc1NlcnZpY2VDbGFzcyc7XG5pbXBvcnQgeyBNZXRhZGF0YSwgTWV0YWRhdGFSZWFkZXIgfSBmcm9tICcuLi90eXBlcy9NZXRhZGF0YSc7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBjcmVhdGVEZWZhdWx0VmFsdWVNYXAgfSBmcm9tICcuLi9jb21tb24vRGVmYXVsdFZhbHVlTWFwJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBNZW1iZXJLZXkgfSBmcm9tICcuLi90eXBlcy9NZW1iZXJLZXknO1xuaW1wb3J0IHsgS2V5T2YgfSBmcm9tICcuLi90eXBlcy9LZXlPZic7XG5cbmNvbnN0IENMQVNTX01FVEFEQVRBX0tFWSA9ICdpb2M6Y2xhc3MtbWV0YWRhdGEnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1hcmtJbmZvIHtcbiAgICBba2V5OiBzdHJpbmcgfCBzeW1ib2xdOiB1bmtub3duO1xufVxuXG5leHBvcnQgY2xhc3MgTWFya0luZm9Db250YWluZXIge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbWFwID0gY3JlYXRlRGVmYXVsdFZhbHVlTWFwPE1lbWJlcktleSwgTWFya0luZm8+KCgpID0+ICh7fSBhcyBNYXJrSW5mbykpO1xuICAgIGdldE1hcmtJbmZvKG1ldGhvZDogTWVtYmVyS2V5KTogTWFya0luZm8ge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXAuZ2V0KG1ldGhvZCk7XG4gICAgfVxuICAgIG1hcmsobWV0aG9kOiBNZW1iZXJLZXksIGtleTogTWVtYmVyS2V5LCB2YWx1ZTogdW5rbm93bikge1xuICAgICAgICBjb25zdCBtYXJrSW5mbyA9IHRoaXMubWFwLmdldChtZXRob2QpO1xuICAgICAgICBtYXJrSW5mb1trZXldID0gdmFsdWU7XG4gICAgfVxuICAgIGdldE1lbWJlcnMoKSB7XG4gICAgICAgIHJldHVybiBuZXcgU2V0KHRoaXMubWFwLmtleXMoKSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGFyYW1ldGVyTWFya0luZm9Db250YWluZXIge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbWFwID0gY3JlYXRlRGVmYXVsdFZhbHVlTWFwPE1lbWJlcktleSwgUmVjb3JkPG51bWJlciwgTWFya0luZm8+PigoKSA9PiB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9KTtcbiAgICBnZXRNYXJrSW5mbyhtZXRob2Q6IE1lbWJlcktleSk6IFJlY29yZDxudW1iZXIsIE1hcmtJbmZvPiB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcC5nZXQobWV0aG9kKTtcbiAgICB9XG4gICAgbWFyayhtZXRob2Q6IE1lbWJlcktleSwgaW5kZXg6IG51bWJlciwga2V5OiBNZW1iZXJLZXksIHZhbHVlOiB1bmtub3duKSB7XG4gICAgICAgIGNvbnN0IHBhcmFtc01hcmtJbmZvID0gdGhpcy5tYXAuZ2V0KG1ldGhvZCk7XG4gICAgICAgIGNvbnN0IG1hcmtJbmZvID0gcGFyYW1zTWFya0luZm9baW5kZXhdIHx8IHt9O1xuICAgICAgICBtYXJrSW5mb1trZXldID0gdmFsdWU7XG4gICAgICAgIHBhcmFtc01hcmtJbmZvW2luZGV4XSA9IG1hcmtJbmZvO1xuICAgIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBDbGFzc01hcmtJbmZvIHtcbiAgICBjdG9yOiBNYXJrSW5mbztcbiAgICBtZW1iZXJzOiBNYXJrSW5mb0NvbnRhaW5lcjtcbiAgICBwYXJhbXM6IFBhcmFtZXRlck1hcmtJbmZvQ29udGFpbmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENsYXNzTWV0YWRhdGFSZWFkZXI8VD4gZXh0ZW5kcyBNZXRhZGF0YVJlYWRlciB7XG4gICAgZ2V0Q2xhc3MoKTogTmV3YWJsZTxUPjtcbiAgICBnZXRTY29wZSgpOiBJbnN0YW5jZVNjb3BlIHwgc3RyaW5nO1xuICAgIGdldENvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZXMoKTogQXJyYXk8SWRlbnRpZmllcj47XG4gICAgZ2V0TWV0aG9kcyhsaWZlY3ljbGU6IExpZmVjeWNsZSk6IEFycmF5PHN0cmluZyB8IHN5bWJvbD47XG4gICAgZ2V0UHJvcGVydHlUeXBlTWFwKCk6IE1hcDxzdHJpbmcgfCBzeW1ib2wsIElkZW50aWZpZXI+O1xuICAgIGdldEN0b3JNYXJrSW5mbygpOiBNYXJrSW5mbztcbiAgICBnZXRBbGxNYXJrZWRNZW1iZXJzKCk6IFNldDxNZW1iZXJLZXk+O1xuICAgIGdldE1lbWJlcnNNYXJrSW5mbyhtZXRob2RLZXk6IEtleU9mPFQ+KTogTWFya0luZm87XG4gICAgZ2V0UGFyYW1ldGVyTWFya0luZm8obWV0aG9kS2V5OiBLZXlPZjxUPik6IFJlY29yZDxudW1iZXIsIE1hcmtJbmZvPjtcbn1cblxuZXhwb3J0IGNsYXNzIENsYXNzTWV0YWRhdGE8VD4gaW1wbGVtZW50cyBNZXRhZGF0YTxDbGFzc01ldGFkYXRhUmVhZGVyPFQ+LCBOZXdhYmxlPFQ+PiB7XG4gICAgc3RhdGljIGdldFJlZmxlY3RLZXkoKSB7XG4gICAgICAgIHJldHVybiBDTEFTU19NRVRBREFUQV9LRVk7XG4gICAgfVxuICAgIHByaXZhdGUgc2NvcGU6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmcgPSBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTjtcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZXM6IEFycmF5PElkZW50aWZpZXI+ID0gW107XG4gICAgcHJpdmF0ZSByZWFkb25seSBsaWZlY3ljbGVNZXRob2RzTWFwOiBSZWNvcmQ8c3RyaW5nIHwgc3ltYm9sLCBTZXQ8TGlmZWN5Y2xlPj4gPSB7fTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHByb3BlcnR5VHlwZXNNYXAgPSBuZXcgTWFwPHN0cmluZyB8IHN5bWJvbCwgSWRlbnRpZmllcj4oKTtcbiAgICBwcml2YXRlIGNsYXp6ITogTmV3YWJsZTxUPjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IG1hcmtzOiBDbGFzc01hcmtJbmZvID0ge1xuICAgICAgICBjdG9yOiB7fSxcbiAgICAgICAgbWVtYmVyczogbmV3IE1hcmtJbmZvQ29udGFpbmVyKCksXG4gICAgICAgIHBhcmFtczogbmV3IFBhcmFtZXRlck1hcmtJbmZvQ29udGFpbmVyKClcbiAgICB9O1xuXG4gICAgc3RhdGljIGdldEluc3RhbmNlPFQ+KGN0b3I6IE5ld2FibGU8VD4pIHtcbiAgICAgICAgcmV0dXJuIE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0UmVhZGVyPFQ+KGN0b3I6IE5ld2FibGU8VD4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoY3RvcikucmVhZGVyKCk7XG4gICAgfVxuXG4gICAgaW5pdCh0YXJnZXQ6IE5ld2FibGU8VD4pIHtcbiAgICAgICAgdGhpcy5jbGF6eiA9IHRhcmdldDtcbiAgICAgICAgY29uc3QgY29uc3RyID0gdGFyZ2V0IGFzIEpzU2VydmljZUNsYXNzPHVua25vd24+O1xuICAgICAgICBpZiAodHlwZW9mIGNvbnN0ci5zY29wZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5zZXRTY29wZShjb25zdHIuc2NvcGUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBjb25zdHIuaW5qZWN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zdCBpbmplY3Rpb25zID0gY29uc3RyLmluamVjdCgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gaW5qZWN0aW9ucykge1xuICAgICAgICAgICAgICAgIHRoaXMucmVjb3JkUHJvcGVydHlUeXBlKGtleSwgaW5qZWN0aW9uc1trZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGNvbnN0ci5tZXRhZGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBjb25zdHIubWV0YWRhdGEoKTtcbiAgICAgICAgICAgIGlmIChtZXRhZGF0YS5zY29wZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2NvcGUobWV0YWRhdGEuc2NvcGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaW5qZWN0aW9ucyA9IG1ldGFkYXRhLmluamVjdDtcbiAgICAgICAgICAgIGlmIChpbmplY3Rpb25zKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gaW5qZWN0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlY29yZFByb3BlcnR5VHlwZShrZXksIGluamVjdGlvbnNba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWFya2VyKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY3RvcjogKGtleTogc3RyaW5nIHwgc3ltYm9sLCB2YWx1ZTogdW5rbm93bikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubWFya3MuY3RvcltrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWVtYmVyOiAocHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCB8IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcms6IChrZXk6IHN0cmluZyB8IHN5bWJvbCwgdmFsdWU6IHVua25vd24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFya3MubWVtYmVycy5tYXJrKHByb3BlcnR5S2V5LCBrZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyYW1ldGVyOiAocHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcms6IChrZXk6IHN0cmluZyB8IHN5bWJvbCwgdmFsdWU6IHVua25vd24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFya3MucGFyYW1zLm1hcmsocHJvcGVydHlLZXksIGluZGV4LCBrZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIHNldFNjb3BlKHNjb3BlOiBJbnN0YW5jZVNjb3BlIHwgc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2NvcGUgPSBzY29wZTtcbiAgICB9XG4gICAgc2V0Q29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlKGluZGV4OiBudW1iZXIsIGNsczogSWRlbnRpZmllcikge1xuICAgICAgICB0aGlzLmNvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZXNbaW5kZXhdID0gY2xzO1xuICAgIH1cbiAgICByZWNvcmRQcm9wZXJ0eVR5cGUocHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCwgdHlwZTogSWRlbnRpZmllcikge1xuICAgICAgICB0aGlzLnByb3BlcnR5VHlwZXNNYXAuc2V0KHByb3BlcnR5S2V5LCB0eXBlKTtcbiAgICB9XG4gICAgYWRkTGlmZWN5Y2xlTWV0aG9kKG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCwgbGlmZWN5Y2xlOiBMaWZlY3ljbGUpIHtcbiAgICAgICAgY29uc3QgbGlmZWN5Y2xlcyA9IHRoaXMuZ2V0TGlmZWN5Y2xlcyhtZXRob2ROYW1lKTtcbiAgICAgICAgbGlmZWN5Y2xlcy5hZGQobGlmZWN5Y2xlKTtcbiAgICAgICAgdGhpcy5saWZlY3ljbGVNZXRob2RzTWFwW21ldGhvZE5hbWVdID0gbGlmZWN5Y2xlcztcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRMaWZlY3ljbGVzKG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5saWZlY3ljbGVNZXRob2RzTWFwW21ldGhvZE5hbWVdIHx8IG5ldyBTZXQ8TGlmZWN5Y2xlPigpO1xuICAgIH1cbiAgICBnZXRNZXRob2RzKGxpZmVjeWNsZTogTGlmZWN5Y2xlKTogQXJyYXk8c3RyaW5nIHwgc3ltYm9sPiB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmxpZmVjeWNsZU1ldGhvZHNNYXApLmZpbHRlcihpdCA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaWZlY3ljbGVzID0gdGhpcy5saWZlY3ljbGVNZXRob2RzTWFwW2l0XTtcbiAgICAgICAgICAgIHJldHVybiBsaWZlY3ljbGVzLmhhcyhsaWZlY3ljbGUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRTdXBlckNsYXNzKCkge1xuICAgICAgICBjb25zdCBzdXBlckNsYXNzUHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMuY2xhenopO1xuICAgICAgICBpZiAoIXN1cGVyQ2xhc3NQcm90b3R5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN1cGVyQ2xhc3MgPSBzdXBlckNsYXNzUHJvdG90eXBlLmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dW5rbm93bj47XG4gICAgICAgIGlmIChzdXBlckNsYXNzID09PSB0aGlzLmNsYXp6KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXJDbGFzcztcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRTdXBlckNsYXNzTWV0YWRhdGEoKTogQ2xhc3NNZXRhZGF0YTx1bmtub3duPiB8IG51bGwge1xuICAgICAgICBjb25zdCBzdXBlckNsYXNzID0gdGhpcy5nZXRTdXBlckNsYXNzKCk7XG4gICAgICAgIGlmICghc3VwZXJDbGFzcykge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIENsYXNzTWV0YWRhdGEuZ2V0SW5zdGFuY2Uoc3VwZXJDbGFzcyk7XG4gICAgfVxuICAgIHJlYWRlcigpOiBDbGFzc01ldGFkYXRhUmVhZGVyPFQ+IHtcbiAgICAgICAgY29uc3Qgc3VwZXJSZWFkZXIgPSB0aGlzLmdldFN1cGVyQ2xhc3NNZXRhZGF0YSgpPy5yZWFkZXIoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldENsYXNzOiAoKSA9PiB0aGlzLmNsYXp6LFxuICAgICAgICAgICAgZ2V0U2NvcGU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zY29wZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRDb25zdHJ1Y3RvclBhcmFtZXRlclR5cGVzOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlcy5zbGljZSgwKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRNZXRob2RzOiAobGlmZWN5Y2xlOiBMaWZlY3ljbGUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdXBlck1ldGhvZHMgPSBzdXBlclJlYWRlcj8uZ2V0TWV0aG9kcyhsaWZlY3ljbGUpIHx8IFtdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNNZXRob2RzID0gdGhpcy5nZXRNZXRob2RzKGxpZmVjeWNsZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChzdXBlck1ldGhvZHMuY29uY2F0KHRoaXNNZXRob2RzKSkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldFByb3BlcnR5VHlwZU1hcDogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1cGVyUHJvcGVydHlUeXBlTWFwID0gc3VwZXJSZWFkZXI/LmdldFByb3BlcnR5VHlwZU1hcCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNQcm9wZXJ0eVR5cGVzTWFwID0gdGhpcy5wcm9wZXJ0eVR5cGVzTWFwO1xuICAgICAgICAgICAgICAgIGlmICghc3VwZXJQcm9wZXJ0eVR5cGVNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXAodGhpc1Byb3BlcnR5VHlwZXNNYXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgTWFwKHN1cGVyUHJvcGVydHlUeXBlTWFwKTtcbiAgICAgICAgICAgICAgICB0aGlzUHJvcGVydHlUeXBlc01hcC5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRDdG9yTWFya0luZm86ICgpOiBNYXJrSW5mbyA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgLi4udGhpcy5tYXJrcy5jdG9yIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0QWxsTWFya2VkTWVtYmVyczogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1cGVyTWV0aG9kcyA9IHN1cGVyUmVhZGVyPy5nZXRBbGxNYXJrZWRNZW1iZXJzKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGhpc01lbWJlcnMgPSB0aGlzLm1hcmtzLm1lbWJlcnMuZ2V0TWVtYmVycygpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyTWV0aG9kcyA/IG5ldyBTZXQoc3VwZXJNZXRob2RzKSA6IG5ldyBTZXQ8TWVtYmVyS2V5PigpO1xuICAgICAgICAgICAgICAgIHRoaXNNZW1iZXJzLmZvckVhY2goaXQgPT4gcmVzdWx0LmFkZChpdCkpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0TWVtYmVyc01hcmtJbmZvOiAoa2V5OiBLZXlPZjxUPik6IE1hcmtJbmZvID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXJrcy5tZW1iZXJzLmdldE1hcmtJbmZvKGtleSBhcyBNZW1iZXJLZXkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldFBhcmFtZXRlck1hcmtJbmZvOiAobWV0aG9kS2V5OiBLZXlPZjxUPik6IFJlY29yZDxudW1iZXIsIE1hcmtJbmZvPiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFya3MucGFyYW1zLmdldE1hcmtJbmZvKG1ldGhvZEtleSBhcyBNZW1iZXJLZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi4vdHlwZXMvU2VydmljZUZhY3RvcnknO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuXG5leHBvcnQgY2xhc3MgU2VydmljZUZhY3RvcnlEZWY8VD4ge1xuICAgIHN0YXRpYyBjcmVhdGVGcm9tQ2xhc3NNZXRhZGF0YTxUPihtZXRhZGF0YTogQ2xhc3NNZXRhZGF0YTxUPikge1xuICAgICAgICBjb25zdCBkZWYgPSBuZXcgU2VydmljZUZhY3RvcnlEZWYobWV0YWRhdGEucmVhZGVyKCkuZ2V0Q2xhc3MoKSwgdHJ1ZSk7XG4gICAgICAgIGRlZi5hcHBlbmQoKGNvbnRhaW5lcjogQXBwbGljYXRpb25Db250ZXh0LCBvd25lcjogdW5rbm93bikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWFkZXIgPSBtZXRhZGF0YS5yZWFkZXIoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjbGF6eiA9IHJlYWRlci5nZXRDbGFzcygpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXIuZ2V0SW5zdGFuY2UoY2xhenosIG93bmVyKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGVmO1xuICAgIH1cbiAgICBwdWJsaWMgcmVhZG9ubHkgZmFjdG9yaWVzID0gbmV3IE1hcDxTZXJ2aWNlRmFjdG9yeTxULCB1bmtub3duPiwgSWRlbnRpZmllcltdPigpO1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBpZGVudGlmaWVyIFRoZSB1bmlxdWUgaWRlbnRpZmllciBvZiB0aGlzIGZhY3Rvcmllc1xuICAgICAqIEBwYXJhbSBpc1NpbmdsZSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgaWRlbnRpZmllciBkZWZpbmVzIG9ubHkgb25lIGZhY3RvcnkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGlkZW50aWZpZXI6IElkZW50aWZpZXIsIHB1YmxpYyByZWFkb25seSBpc1NpbmdsZTogYm9vbGVhbikge31cbiAgICBhcHBlbmQoZmFjdG9yeTogU2VydmljZUZhY3Rvcnk8VCwgdW5rbm93bj4sIGluamVjdGlvbnM6IElkZW50aWZpZXJbXSA9IFtdKSB7XG4gICAgICAgIGlmICh0aGlzLmlzU2luZ2xlICYmIHRoaXMuZmFjdG9yaWVzLnNpemUgPT09IDEgJiYgIXRoaXMuZmFjdG9yaWVzLmhhcyhmYWN0b3J5KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMuaWRlbnRpZmllci50b1N0cmluZygpfSBpcyBBIHNpbmdsZXRvbiEgQnV0IG11bHRpcGxlIGZhY3RvcmllcyBhcmUgZGVmaW5lZCFgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZhY3Rvcmllcy5zZXQoZmFjdG9yeSwgaW5qZWN0aW9ucyk7XG4gICAgfVxuICAgIHByb2R1Y2UoY29udGFpbmVyOiBBcHBsaWNhdGlvbkNvbnRleHQsIG93bmVyPzogdW5rbm93bikge1xuICAgICAgICBpZiAodGhpcy5pc1NpbmdsZSkge1xuICAgICAgICAgICAgY29uc3QgW2ZhY3RvcnksIGluamVjdGlvbnNdID0gdGhpcy5mYWN0b3JpZXMuZW50cmllcygpLm5leHQoKS52YWx1ZSBhcyBbU2VydmljZUZhY3Rvcnk8VCwgdW5rbm93bj4sIElkZW50aWZpZXJbXV07XG4gICAgICAgICAgICBjb25zdCBmbiA9IGZhY3RvcnkoY29udGFpbmVyLCBvd25lcik7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXIuaW52b2tlKGZuLCB7XG4gICAgICAgICAgICAgICAgICAgIGluamVjdGlvbnNcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBwcm9kdWNlcnMgPSBBcnJheS5mcm9tKHRoaXMuZmFjdG9yaWVzKS5tYXAoKFtmYWN0b3J5LCBpbmplY3Rpb25zXSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZuID0gZmFjdG9yeShjb250YWluZXIsIG93bmVyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGFpbmVyLmludm9rZShmbiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5qZWN0aW9uc1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9kdWNlcnMubWFwKGl0ID0+IGl0KCkpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IFNlcnZpY2VGYWN0b3J5RGVmIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9TZXJ2aWNlRmFjdG9yeURlZic7XG5pbXBvcnQgeyBGYWN0b3J5SWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0ZhY3RvcnlJZGVudGlmaWVyJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IFNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi4vdHlwZXMvU2VydmljZUZhY3RvcnknO1xuXG5leHBvcnQgY2xhc3MgRmFjdG9yeVJlY29yZGVyIHtcbiAgICBwcml2YXRlIGZhY3RvcmllcyA9IG5ldyBNYXA8RmFjdG9yeUlkZW50aWZpZXIsIFNlcnZpY2VGYWN0b3J5RGVmPHVua25vd24+PigpO1xuXG4gICAgcHVibGljIGFwcGVuZDxUPihcbiAgICAgICAgaWRlbnRpZmllcjogRmFjdG9yeUlkZW50aWZpZXIsXG4gICAgICAgIGZhY3Rvcnk6IFNlcnZpY2VGYWN0b3J5PFQsIHVua25vd24+LFxuICAgICAgICBpbmplY3Rpb25zOiBJZGVudGlmaWVyW10gPSBbXSxcbiAgICAgICAgaXNTaW5nbGU6IGJvb2xlYW4gPSB0cnVlXG4gICAgKSB7XG4gICAgICAgIGxldCBkZWYgPSB0aGlzLmZhY3Rvcmllcy5nZXQoaWRlbnRpZmllcik7XG4gICAgICAgIGlmIChkZWYpIHtcbiAgICAgICAgICAgIGRlZi5hcHBlbmQoZmFjdG9yeSwgaW5qZWN0aW9ucyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWYgPSBuZXcgU2VydmljZUZhY3RvcnlEZWYoaWRlbnRpZmllciwgaXNTaW5nbGUpO1xuICAgICAgICAgICAgZGVmLmFwcGVuZChmYWN0b3J5LCBpbmplY3Rpb25zKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZhY3Rvcmllcy5zZXQoaWRlbnRpZmllciwgZGVmKTtcbiAgICB9XG4gICAgcHVibGljIHNldChpZGVudGlmaWVyOiBGYWN0b3J5SWRlbnRpZmllciwgZmFjdG9yeURlZjogU2VydmljZUZhY3RvcnlEZWY8dW5rbm93bj4pIHtcbiAgICAgICAgdGhpcy5mYWN0b3JpZXMuc2V0KGlkZW50aWZpZXIsIGZhY3RvcnlEZWYpO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0PFQ+KGlkZW50aWZpZXI6IEZhY3RvcnlJZGVudGlmaWVyKTogU2VydmljZUZhY3RvcnlEZWY8VD4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5mYWN0b3JpZXMuZ2V0KGlkZW50aWZpZXIpIGFzIFNlcnZpY2VGYWN0b3J5RGVmPFQ+IHwgdW5kZWZpbmVkO1xuICAgIH1cbiAgICBwdWJsaWMgaXRlcmF0b3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZhY3Rvcmllcy5lbnRyaWVzKCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTWV0YWRhdGEgfSBmcm9tICcuLi90eXBlcy9NZXRhZGF0YSc7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4uL3R5cGVzL1NlcnZpY2VGYWN0b3J5JztcbmltcG9ydCB7IEZhY3RvcnlJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvRmFjdG9yeUlkZW50aWZpZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4vQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeURlZiB9IGZyb20gJy4uL2ZvdW5kYXRpb24vU2VydmljZUZhY3RvcnlEZWYnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL3R5cGVzL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcic7XG5pbXBvcnQgeyBGYWN0b3J5UmVjb3JkZXIgfSBmcm9tICcuLi9jb21tb24vRmFjdG9yeVJlY29yZGVyJztcblxuZXhwb3J0IGludGVyZmFjZSBHbG9iYWxNZXRhZGF0YVJlYWRlciB7XG4gICAgZ2V0Q29tcG9uZW50RmFjdG9yeTxUPihrZXk6IEZhY3RvcnlJZGVudGlmaWVyKTogU2VydmljZUZhY3RvcnlEZWY8VD4gfCB1bmRlZmluZWQ7XG4gICAgZ2V0Q2xhc3NNZXRhZGF0YTxUPihhbGlhc05hbWU6IHN0cmluZyB8IHN5bWJvbCk6IENsYXNzTWV0YWRhdGE8VD4gfCB1bmRlZmluZWQ7XG4gICAgZ2V0SW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcygpOiBBcnJheTxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+Pjtcbn1cbmV4cG9ydCBjbGFzcyBHbG9iYWxNZXRhZGF0YSBpbXBsZW1lbnRzIE1ldGFkYXRhPEdsb2JhbE1ldGFkYXRhUmVhZGVyLCB2b2lkPiB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgSU5TVEFOQ0UgPSBuZXcgR2xvYmFsTWV0YWRhdGEoKTtcbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgICAgIHJldHVybiBHbG9iYWxNZXRhZGF0YS5JTlNUQU5DRTtcbiAgICB9XG4gICAgc3RhdGljIGdldFJlYWRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoKS5yZWFkZXIoKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBjbGFzc0FsaWFzTWV0YWRhdGFNYXAgPSBuZXcgTWFwPHN0cmluZyB8IHN5bWJvbCwgQ2xhc3NNZXRhZGF0YTx1bmtub3duPj4oKTtcbiAgICBwcml2YXRlIGNvbXBvbmVudEZhY3RvcmllcyA9IG5ldyBGYWN0b3J5UmVjb3JkZXIoKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHByb2Nlc3NvckNsYXNzZXM6IFNldDxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+PiA9IG5ldyBTZXQoKTtcbiAgICByZWNvcmRGYWN0b3J5PFQ+KFxuICAgICAgICBzeW1ib2w6IEZhY3RvcnlJZGVudGlmaWVyLFxuICAgICAgICBmYWN0b3J5OiBTZXJ2aWNlRmFjdG9yeTxULCB1bmtub3duPixcbiAgICAgICAgaW5qZWN0aW9uczogSWRlbnRpZmllcltdID0gW10sXG4gICAgICAgIGlzU2luZ2xlOiBib29sZWFuID0gdHJ1ZVxuICAgICkge1xuICAgICAgICB0aGlzLmNvbXBvbmVudEZhY3Rvcmllcy5hcHBlbmQoc3ltYm9sLCBmYWN0b3J5LCBpbmplY3Rpb25zLCBpc1NpbmdsZSk7XG4gICAgfVxuICAgIHJlY29yZENsYXNzQWxpYXM8VD4oYWxpYXNOYW1lOiBzdHJpbmcgfCBzeW1ib2wsIG1ldGFkYXRhOiBDbGFzc01ldGFkYXRhPFQ+KSB7XG4gICAgICAgIHRoaXMuY2xhc3NBbGlhc01ldGFkYXRhTWFwLnNldChhbGlhc05hbWUsIG1ldGFkYXRhKTtcbiAgICB9XG4gICAgcmVjb3JkUHJvY2Vzc29yQ2xhc3MoY2xheno6IE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4pIHtcbiAgICAgICAgdGhpcy5wcm9jZXNzb3JDbGFzc2VzLmFkZChjbGF6eik7XG4gICAgfVxuICAgIGluaXQoKSB7XG4gICAgICAgIC8vIFBBU1M7XG4gICAgfVxuICAgIHJlYWRlcigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldENvbXBvbmVudEZhY3Rvcnk6IDxUPihrZXk6IEZhY3RvcnlJZGVudGlmaWVyKTogU2VydmljZUZhY3RvcnlEZWY8VD4gfCB1bmRlZmluZWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudEZhY3Rvcmllcy5nZXQoa2V5KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRDbGFzc01ldGFkYXRhOiA8VD4oYWxpYXNOYW1lOiBzdHJpbmcgfCBzeW1ib2wpOiBDbGFzc01ldGFkYXRhPFQ+IHwgdW5kZWZpbmVkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jbGFzc0FsaWFzTWV0YWRhdGFNYXAuZ2V0KGFsaWFzTmFtZSkgYXMgQ2xhc3NNZXRhZGF0YTxUPiB8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzOiAoKTogQXJyYXk8TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPj4gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMucHJvY2Vzc29yQ2xhc3Nlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiZXhwb3J0IGludGVyZmFjZSBFdmFsdWF0aW9uT3B0aW9uczxPLCBFIGV4dGVuZHMgc3RyaW5nLCBBID0gdW5rbm93bj4ge1xuICAgIHR5cGU6IEU7XG4gICAgb3duZXI/OiBPO1xuICAgIHByb3BlcnR5TmFtZT86IHN0cmluZyB8IHN5bWJvbDtcbiAgICBleHRlcm5hbEFyZ3M/OiBBO1xufVxuXG5leHBvcnQgZW51bSBFeHByZXNzaW9uVHlwZSB7XG4gICAgRU5WID0gJ2luamVjdC1lbnZpcm9ubWVudC12YXJpYWJsZXMnLFxuICAgIEpTT05fUEFUSCA9ICdpbmplY3QtanNvbi1kYXRhJyxcbiAgICBBUkdWID0gJ2luamVjdC1hcmd2J1xufVxuIiwiZXhwb3J0IGNvbnN0IGlzTm9kZUpzID0gKCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gcHJvY2Vzcy52ZXJzaW9ucy5ub2RlICE9PSBudWxsO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn0pKCk7XG4iLCJpbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0dsb2JhbE1ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuaW1wb3J0IHsgaXNOb2RlSnMgfSBmcm9tICcuLi9jb21tb24vaXNOb2RlSnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gVmFsdWU8QSA9IHVua25vd24+KGV4cHJlc3Npb246IHN0cmluZywgdHlwZTogRXhwcmVzc2lvblR5cGUgfCBzdHJpbmcsIGV4dGVybmFsQXJncz86IEEpOiBQcm9wZXJ0eURlY29yYXRvciB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgRXhwcmVzc2lvblR5cGUuRU5WOlxuICAgICAgICBjYXNlIEV4cHJlc3Npb25UeXBlLkFSR1Y6XG4gICAgICAgICAgICBpZiAoIWlzTm9kZUpzKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgXCIke3R5cGV9XCIgZXZhbHVhdG9yIG9ubHkgc3VwcG9ydHMgbm9kZWpzIGVudmlyb25tZW50IWApO1xuICAgICAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gKHRhcmdldDogT2JqZWN0LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sKSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGFyZ2V0LmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgY29uc3QgdmFsdWVfc3ltYm9sID0gU3ltYm9sKCcnKTtcbiAgICAgICAgbWV0YWRhdGEucmVjb3JkUHJvcGVydHlUeXBlKHByb3BlcnR5S2V5LCB2YWx1ZV9zeW1ib2wpO1xuICAgICAgICBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlY29yZEZhY3RvcnkodmFsdWVfc3ltYm9sLCAoY29udGFpbmVyLCBvd25lcikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICgpID0+XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmV2YWx1YXRlPHN0cmluZywgdHlwZW9mIG93bmVyLCBBPihleHByZXNzaW9uIGFzIHN0cmluZywge1xuICAgICAgICAgICAgICAgICAgICBvd25lcixcbiAgICAgICAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgZXh0ZXJuYWxBcmdzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBWYWx1ZSB9IGZyb20gJy4vVmFsdWUnO1xuaW1wb3J0IHsgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gQXJndihuYW1lOiBzdHJpbmcsIGFyZ3Y6IHN0cmluZ1tdID0gcHJvY2Vzcy5hcmd2KSB7XG4gICAgcmV0dXJuIFZhbHVlKG5hbWUsIEV4cHJlc3Npb25UeXBlLkFSR1YsIGFyZ3YpO1xufVxuIiwiaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9HbG9iYWxNZXRhZGF0YSc7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIEJpbmQoYWxpYXNOYW1lOiBzdHJpbmcgfCBzeW1ib2wpOiBDbGFzc0RlY29yYXRvciB7XG4gICAgcmV0dXJuIDxURnVuY3Rpb24gZXh0ZW5kcyBGdW5jdGlvbj4odGFyZ2V0OiBURnVuY3Rpb24pID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQgYXMgdW5rbm93biBhcyBOZXdhYmxlPHVua25vd24+LCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWNvcmRDbGFzc0FsaWFzKGFsaWFzTmFtZSwgbWV0YWRhdGEpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBWYWx1ZSB9IGZyb20gJy4vVmFsdWUnO1xuaW1wb3J0IHsgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gRW52KG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBWYWx1ZShuYW1lLCBFeHByZXNzaW9uVHlwZS5FTlYpO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGlzTnVsbCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIG51bGwge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQ7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNOb3REZWZpbmVkPFQ+KHZhbHVlOiBUIHwgdW5kZWZpbmVkIHwgbnVsbCk6IHZhbHVlIGlzIHVuZGVmaW5lZCB8IG51bGwge1xuICAgIHJldHVybiBpc051bGwodmFsdWUpIHx8IGlzVW5kZWZpbmVkKHZhbHVlKTtcbn1cbiIsImltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgRmFjdG9yeUlkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9GYWN0b3J5SWRlbnRpZmllcic7XG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlJztcbmltcG9ydCB7IGlzTm90RGVmaW5lZCB9IGZyb20gJy4uL2NvbW1vbi9pc05vdERlZmluZWQnO1xuXG5leHBvcnQgZnVuY3Rpb24gRmFjdG9yeShwcm9kdWNlSWRlbnRpZmllcj86IEZhY3RvcnlJZGVudGlmaWVyLCBpc1NpbmdsZTogYm9vbGVhbiA9IHRydWUpOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiAodGFyZ2V0OiBPYmplY3QsIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wpID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpO1xuICAgICAgICBjb25zdCBjbGF6eiA9IHRhcmdldC5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPEluc3RhbmNlPHVua25vd24+PjtcblxuICAgICAgICBpZiAoaXNOb3REZWZpbmVkKHByb2R1Y2VJZGVudGlmaWVyKSkge1xuICAgICAgICAgICAgcHJvZHVjZUlkZW50aWZpZXIgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdkZXNpZ246cmV0dXJudHlwZScsIHRhcmdldCwgcHJvcGVydHlLZXkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc05vdERlZmluZWQocHJvZHVjZUlkZW50aWZpZXIpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSByZXR1cm4gdHlwZSBub3QgcmVjb2duaXplZCwgY2Fubm90IHBlcmZvcm0gaW5zdGFuY2UgY3JlYXRpb24hJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaW5qZWN0aW9ucyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ2Rlc2lnbjpwYXJhbXR5cGVzJywgdGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG5cbiAgICAgICAgbWV0YWRhdGEucmVjb3JkRmFjdG9yeShcbiAgICAgICAgICAgIHByb2R1Y2VJZGVudGlmaWVyLFxuICAgICAgICAgICAgKGNvbnRhaW5lciwgb3duZXIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGNvbnRhaW5lci5nZXRJbnN0YW5jZShjbGF6eiwgb3duZXIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZ1bmMgPSBpbnN0YW5jZVtwcm9wZXJ0eUtleV07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmdW5jID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBjb250YWluZXIuZ2V0SW5zdGFuY2UoY2xhenopO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiBmdW5jO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmplY3Rpb25zLFxuICAgICAgICAgICAgaXNTaW5nbGVcbiAgICAgICAgKTtcbiAgICB9O1xufVxuIiwiaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhIH0gZnJvbSAnLi4vdHlwZXMvTWV0YWRhdGEnO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgSW5zdGFuY2VTY29wZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vSW5zdGFuY2VTY29wZSc7XG5cbmV4cG9ydCBjb25zdCBGVU5DVElPTl9NRVRBREFUQV9LRVkgPSBTeW1ib2woJ2lvYzpmdW5jdGlvbi1tZXRhZGF0YScpO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZ1bmN0aW9uTWV0YWRhdGFSZWFkZXIge1xuICAgIGdldFBhcmFtZXRlcnMoKTogSWRlbnRpZmllcltdO1xuICAgIGlzRmFjdG9yeSgpOiBib29sZWFuO1xuICAgIGdldFNjb3BlKCk6IEluc3RhbmNlU2NvcGUgfCB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBGdW5jdGlvbk1ldGFkYXRhIGltcGxlbWVudHMgTWV0YWRhdGE8RnVuY3Rpb25NZXRhZGF0YVJlYWRlciwgRnVuY3Rpb24+IHtcbiAgICBzdGF0aWMgZ2V0UmVmbGVjdEtleSgpIHtcbiAgICAgICAgcmV0dXJuIEZVTkNUSU9OX01FVEFEQVRBX0tFWTtcbiAgICB9XG4gICAgcHJpdmF0ZSByZWFkb25seSBwYXJhbWV0ZXJzOiBJZGVudGlmaWVyW10gPSBbXTtcbiAgICBwcml2YXRlIHNjb3BlPzogSW5zdGFuY2VTY29wZTtcbiAgICBwcml2YXRlIGlzRmFjdG9yeTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHNldFBhcmFtZXRlclR5cGUoaW5kZXg6IG51bWJlciwgc3ltYm9sOiBJZGVudGlmaWVyKSB7XG4gICAgICAgIHRoaXMucGFyYW1ldGVyc1tpbmRleF0gPSBzeW1ib2w7XG4gICAgfVxuICAgIHNldFNjb3BlKHNjb3BlOiBJbnN0YW5jZVNjb3BlKSB7XG4gICAgICAgIHRoaXMuc2NvcGUgPSBzY29wZTtcbiAgICB9XG4gICAgc2V0SXNGYWN0b3J5KGlzRmFjdG9yeTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLmlzRmFjdG9yeSA9IGlzRmFjdG9yeTtcbiAgICB9XG4gICAgaW5pdCgpIHtcbiAgICAgICAgLy8gUEFTUztcbiAgICB9XG4gICAgcmVhZGVyKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0UGFyYW1ldGVyczogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmFtZXRlcnMuc2xpY2UoMCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaXNGYWN0b3J5OiAoKSA9PiB0aGlzLmlzRmFjdG9yeSxcbiAgICAgICAgICAgIGdldFNjb3BlOiAoKSA9PiB0aGlzLnNjb3BlXG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbic7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhLCBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gR2VuZXJhdGU8Vj4oZ2VuZXJhdG9yOiA8VD4odGhpczogVCwgYXBwQ3R4OiBBcHBsaWNhdGlvbkNvbnRleHQpID0+IFYpOiBQcm9wZXJ0eURlY29yYXRvciB7XG4gICAgcmV0dXJuICh0YXJnZXQ6IE9iamVjdCwgcHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCkgPT4ge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldC5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgIGNvbnN0IHZhbHVlX3N5bWJvbCA9IFN5bWJvbCgnJyk7XG4gICAgICAgIG1ldGFkYXRhLnJlY29yZFByb3BlcnR5VHlwZShwcm9wZXJ0eUtleSwgdmFsdWVfc3ltYm9sKTtcbiAgICAgICAgR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWNvcmRGYWN0b3J5KHZhbHVlX3N5bWJvbCwgKGNvbnRhaW5lciwgb3duZXIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiBnZW5lcmF0b3IuY2FsbChvd25lciwgY29udGFpbmVyKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgaXNOb3REZWZpbmVkIH0gZnJvbSAnLi4vY29tbW9uL2lzTm90RGVmaW5lZCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBJbmplY3Q8VD4oY29uc3RyPzogSWRlbnRpZmllcjxUPikge1xuICAgIHJldHVybiBmdW5jdGlvbiA8VGFyZ2V0Pih0YXJnZXQ6IFRhcmdldCwgcHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCwgcGFyYW1ldGVySW5kZXg/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHBhcmFtZXRlckluZGV4ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgLy8gY29uc3RydWN0b3IgcGFyYW1ldGVyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRDb25zdHIgPSB0YXJnZXQgYXMgTmV3YWJsZTxUPjtcbiAgICAgICAgICAgIGlmIChpc05vdERlZmluZWQoY29uc3RyKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0ciA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ2Rlc2lnbjpwYXJhbXR5cGVzJywgdGFyZ2V0LCBwcm9wZXJ0eUtleSlbcGFyYW1ldGVySW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzTm90RGVmaW5lZChjb25zdHIpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUeXBlIG5vdCByZWNvZ25pemVkLCBpbmplY3Rpb24gY2Fubm90IGJlIHBlcmZvcm1lZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY2xhc3NNZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldENvbnN0ciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBjbGFzc01ldGFkYXRhLnNldENvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZShwYXJhbWV0ZXJJbmRleCwgY29uc3RyKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnb2JqZWN0JyAmJiB0YXJnZXQgIT09IG51bGwgJiYgcHJvcGVydHlLZXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gcHJvcGVydHlcbiAgICAgICAgICAgIGlmIChpc05vdERlZmluZWQoY29uc3RyKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0ciA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ2Rlc2lnbjp0eXBlJywgdGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNOb3REZWZpbmVkKGNvbnN0cikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1R5cGUgbm90IHJlY29nbml6ZWQsIGluamVjdGlvbiBjYW5ub3QgYmUgcGVyZm9ybWVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldC5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBtZXRhZGF0YS5yZWNvcmRQcm9wZXJ0eVR5cGUocHJvcGVydHlLZXksIGNvbnN0cik7XG4gICAgICAgIH1cbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YSc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgSW5zdGFuY2UgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW5qZWN0YWJsZU9wdGlvbnMge1xuICAgIHByb2R1Y2U6IHN0cmluZyB8IHN5bWJvbCB8IEFycmF5PHN0cmluZyB8IHN5bWJvbD47XG59XG5cbi8qKlxuICogVGhpcyBkZWNvcmF0b3IgaXMgdHlwaWNhbGx5IHVzZWQgdG8gaWRlbnRpZnkgY2xhc3NlcyB0aGF0IG5lZWQgdG8gYmUgY29uZmlndXJlZCB3aXRoaW4gdGhlIElvQyBjb250YWluZXIuXG4gKiBJbiBtb3N0IGNhc2VzLCBASW5qZWN0YWJsZSBjYW4gYmUgb21pdHRlZCB1bmxlc3MgZXhwbGljaXQgY29uZmlndXJhdGlvbiBpcyByZXF1aXJlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEluamVjdGFibGUob3B0aW9ucz86IEluamVjdGFibGVPcHRpb25zKTogQ2xhc3NEZWNvcmF0b3Ige1xuICAgIHJldHVybiA8VEZ1bmN0aW9uIGV4dGVuZHMgRnVuY3Rpb24+KHRhcmdldDogVEZ1bmN0aW9uKTogVEZ1bmN0aW9uIHwgdm9pZCA9PiB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucz8ucHJvZHVjZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpO1xuICAgICAgICBjb25zdCBwcm9kdWNlcyA9IEFycmF5LmlzQXJyYXkob3B0aW9ucy5wcm9kdWNlKSA/IG9wdGlvbnMucHJvZHVjZSA6IFtvcHRpb25zLnByb2R1Y2VdO1xuICAgICAgICBwcm9kdWNlcy5mb3JFYWNoKHByb2R1Y2UgPT4ge1xuICAgICAgICAgICAgbWV0YWRhdGEucmVjb3JkRmFjdG9yeShcbiAgICAgICAgICAgICAgICBwcm9kdWNlLFxuICAgICAgICAgICAgICAgIChjb250YWluZXIsIG93bmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGNvbnRhaW5lci5nZXRJbnN0YW5jZSh0YXJnZXQgYXMgdW5rbm93biBhcyBOZXdhYmxlPEluc3RhbmNlPHVua25vd24+Piwgb3duZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgW10sXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yJztcbmltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuXG5leHBvcnQgZnVuY3Rpb24gSW5zdEF3YXJlUHJvY2Vzc29yKCkge1xuICAgIHJldHVybiBmdW5jdGlvbiA8Q2xzIGV4dGVuZHMgTmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPj4odGFyZ2V0OiBDbHMpIHtcbiAgICAgICAgR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWNvcmRQcm9jZXNzb3JDbGFzcyh0YXJnZXQpO1xuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBWYWx1ZSB9IGZyb20gJy4vVmFsdWUnO1xuaW1wb3J0IHsgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gSlNPTkRhdGEobmFtZXNwYWNlOiBzdHJpbmcsIGpzb25wYXRoOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gVmFsdWUoYCR7bmFtZXNwYWNlfToke2pzb25wYXRofWAsIEV4cHJlc3Npb25UeXBlLkpTT05fUEFUSCk7XG59XG4iLCJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9MaWZlY3ljbGUnO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5cbi8qKlxuICogVXJuIGNhbGxzIHRoZSBtZXRob2RzIGFubm90YXRlZCB3aXRoIEBQb3N0SW5qZWN0IG9ubHkgb25jZSwganVzdCBhZnRlciB0aGUgaW5qZWN0aW9uIG9mIHByb3BlcnRpZXMuXG4gKiBAYW5ub3RhdGlvblxuICovXG5leHBvcnQgY29uc3QgTGlmZWN5Y2xlRGVjb3JhdG9yID0gKGxpZmVjeWNsZTogTGlmZWN5Y2xlKTogTWV0aG9kRGVjb3JhdG9yID0+IHtcbiAgICByZXR1cm4gKHRhcmdldDogT2JqZWN0LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sKSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGFyZ2V0LmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgbWV0YWRhdGEuYWRkTGlmZWN5Y2xlTWV0aG9kKHByb3BlcnR5S2V5LCBsaWZlY3ljbGUpO1xuICAgIH07XG59O1xuIiwiaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuXG5leHBvcnQgZnVuY3Rpb24gTWFyayhrZXk6IHN0cmluZyB8IHN5bWJvbCwgdmFsdWU6IHVua25vd24gPSB0cnVlKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiBmdW5jdGlvbiAoXG4gICAgICAgIC4uLmFyZ3M6XG4gICAgICAgICAgICB8IFBhcmFtZXRlcnM8Q2xhc3NEZWNvcmF0b3I+XG4gICAgICAgICAgICB8IFBhcmFtZXRlcnM8TWV0aG9kRGVjb3JhdG9yPlxuICAgICAgICAgICAgfCBQYXJhbWV0ZXJzPFByb3BlcnR5RGVjb3JhdG9yPlxuICAgICAgICAgICAgfCBQYXJhbWV0ZXJzPFBhcmFtZXRlckRlY29yYXRvcj5cbiAgICApIHtcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAvLyBjbGFzcyBkZWNvcmF0b3JcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoYXJnc1swXSwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBtZXRhZGF0YS5tYXJrZXIoKS5jdG9yKGtleSwgdmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZ3MubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAvLyBwcm9wZXJ0eSBkZWNvcmF0b3JcbiAgICAgICAgICAgIGNvbnN0IFtwcm90b3R5cGUsIHByb3BlcnR5S2V5XSA9IGFyZ3M7XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHByb3RvdHlwZS5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBtZXRhZGF0YS5tYXJrZXIoKS5tZW1iZXIocHJvcGVydHlLZXkpLm1hcmsoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJncy5sZW5ndGggPT09IDMgJiYgdHlwZW9mIGFyZ3NbMl0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAvLyBwYXJhbWV0ZXIgZGVjb3JhdG9yXG4gICAgICAgICAgICBjb25zdCBbcHJvdG90eXBlLCBwcm9wZXJ0eUtleSwgaW5kZXhdID0gYXJncyBhcyBbT2JqZWN0LCBzdHJpbmcgfCBzeW1ib2wsIG51bWJlcl07XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHByb3RvdHlwZS5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBtZXRhZGF0YS5tYXJrZXIoKS5wYXJhbWV0ZXIocHJvcGVydHlLZXksIGluZGV4KS5tYXJrKGtleSwgdmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gbWV0aG9kIGRlY29yYXRvclxuICAgICAgICAgICAgY29uc3QgW3Byb3RvdHlwZSwgcHJvcGVydHlLZXldID0gYXJncyBhcyBQYXJhbWV0ZXJzPE1ldGhvZERlY29yYXRvcj47XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHByb3RvdHlwZS5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBtZXRhZGF0YS5tYXJrZXIoKS5tZW1iZXIocHJvcGVydHlLZXkpLm1hcmsoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuIiwiZXhwb3J0IGVudW0gTGlmZWN5Y2xlIHtcbiAgICBQUkVfSU5KRUNUID0gJ2lvYy1zY29wZTpwcmUtaW5qZWN0JyxcbiAgICBQT1NUX0lOSkVDVCA9ICdpb2Mtc2NvcGU6cG9zdC1pbmplY3QnLFxuICAgIFBSRV9ERVNUUk9ZID0gJ2lvYy1zY29wZTpwcmUtZGVzdHJveSdcbn1cbiIsImltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBMaWZlY3ljbGVEZWNvcmF0b3IgfSBmcm9tICcuL0xpZmVjeWNsZURlY29yYXRvcic7XG5cbi8qKlxuICogVXJuIGNhbGxzIHRoZSBtZXRob2RzIGFubm90YXRlZCB3aXRoIEBQb3N0SW5qZWN0IG9ubHkgb25jZSwganVzdCBhZnRlciB0aGUgaW5qZWN0aW9uIG9mIHByb3BlcnRpZXMuXG4gKiBAYW5ub3RhdGlvblxuICovXG5leHBvcnQgY29uc3QgUG9zdEluamVjdCA9ICgpOiBNZXRob2REZWNvcmF0b3IgPT4gTGlmZWN5Y2xlRGVjb3JhdG9yKExpZmVjeWNsZS5QT1NUX0lOSkVDVCk7XG4iLCJpbXBvcnQgeyBMaWZlY3ljbGVEZWNvcmF0b3IgfSBmcm9tICcuL0xpZmVjeWNsZURlY29yYXRvcic7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5cbmV4cG9ydCBjb25zdCBQcmVEZXN0cm95ID0gKCkgPT4gTGlmZWN5Y2xlRGVjb3JhdG9yKExpZmVjeWNsZS5QUkVfREVTVFJPWSk7XG4iLCJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9MaWZlY3ljbGUnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlRGVjb3JhdG9yIH0gZnJvbSAnLi9MaWZlY3ljbGVEZWNvcmF0b3InO1xuXG4vKipcbiAqIFVybiBjYWxscyB0aGUgbWV0aG9kcyBhbm5vdGF0ZWQgd2l0aCBAUG9zdEluamVjdCBvbmx5IG9uY2UsIGp1c3QgYWZ0ZXIgdGhlIGluamVjdGlvbiBvZiBwcm9wZXJ0aWVzLlxuICogQGFubm90YXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IFByZUluamVjdCA9ICgpOiBNZXRob2REZWNvcmF0b3IgPT4gTGlmZWN5Y2xlRGVjb3JhdG9yKExpZmVjeWNsZS5QUkVfSU5KRUNUKTtcbiIsImltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luc3RhbmNlU2NvcGUnO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBTY29wZShzY29wZTogSW5zdGFuY2VTY29wZSB8IHN0cmluZyk6IENsYXNzRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gPFRGdW5jdGlvbiBleHRlbmRzIEZ1bmN0aW9uPih0YXJnZXQ6IFRGdW5jdGlvbikgPT4ge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldCBhcyB1bmtub3duIGFzIE5ld2FibGU8dW5rbm93bj4sIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBtZXRhZGF0YS5zZXRTY29wZShzY29wZSk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IEFueUZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMvQW55RnVuY3Rpb24nO1xuXG5leHBvcnQgdHlwZSBFdmVudExpc3RlbmVyID0gQW55RnVuY3Rpb247XG5leHBvcnQgY2xhc3MgRXZlbnRFbWl0dGVyIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGV2ZW50cyA9IG5ldyBNYXA8c3RyaW5nIHwgc3ltYm9sLCBFdmVudExpc3RlbmVyW10+KCk7XG5cbiAgICBvbih0eXBlOiBzdHJpbmcgfCBzeW1ib2wsIGxpc3RlbmVyOiBFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLmV2ZW50cy5nZXQodHlwZSk7XG4gICAgICAgIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcikgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMgPSBbbGlzdGVuZXJdO1xuICAgICAgICAgICAgdGhpcy5ldmVudHMuc2V0KHR5cGUsIGxpc3RlbmVycyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxzID0gbGlzdGVuZXJzIGFzIEV2ZW50TGlzdGVuZXJbXTtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gbHMuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIGxzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIGVtaXQodHlwZTogc3RyaW5nIHwgc3ltYm9sLCAuLi5hcmdzOiB1bmtub3duW10pIHtcbiAgICAgICAgdGhpcy5ldmVudHMuZ2V0KHR5cGUpPy5mb3JFYWNoKGZuID0+IHtcbiAgICAgICAgICAgIGZuKC4uLmFyZ3MpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5cbnR5cGUgSW52b2tlRnVuY3Rpb25BcmdzID0ge1xuICAgIGFyZ3M/OiB1bmtub3duW107XG59O1xudHlwZSBJbnZva2VGdW5jdGlvbkluamVjdGlvbnMgPSB7XG4gICAgaW5qZWN0aW9uczogSWRlbnRpZmllcltdO1xufTtcblxudHlwZSBJbnZva2VGdW5jdGlvbkJhc2ljT3B0aW9uczxUPiA9IHtcbiAgICBjb250ZXh0PzogVDtcbn07XG5cbmV4cG9ydCB0eXBlIEludm9rZUZ1bmN0aW9uT3B0aW9uczxUPiA9XG4gICAgfCAoSW52b2tlRnVuY3Rpb25CYXNpY09wdGlvbnM8VD4gJiBJbnZva2VGdW5jdGlvbkFyZ3MpXG4gICAgfCAoSW52b2tlRnVuY3Rpb25CYXNpY09wdGlvbnM8VD4gJiBQYXJ0aWFsPEludm9rZUZ1bmN0aW9uSW5qZWN0aW9ucz4pO1xuXG5leHBvcnQgZnVuY3Rpb24gaGFzQXJnczxUPihvcHRpb25zOiBJbnZva2VGdW5jdGlvbk9wdGlvbnM8VD4pOiBvcHRpb25zIGlzIEludm9rZUZ1bmN0aW9uQmFzaWNPcHRpb25zPFQ+ICYgSW52b2tlRnVuY3Rpb25BcmdzIHtcbiAgICByZXR1cm4gJ2FyZ3MnIGluIG9wdGlvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNJbmplY3Rpb25zPFQ+KFxuICAgIG9wdGlvbnM6IEludm9rZUZ1bmN0aW9uT3B0aW9uczxUPlxuKTogb3B0aW9ucyBpcyBJbnZva2VGdW5jdGlvbkJhc2ljT3B0aW9uczxUPiAmIEludm9rZUZ1bmN0aW9uSW5qZWN0aW9ucyB7XG4gICAgcmV0dXJuICdpbmplY3Rpb25zJyBpbiBvcHRpb25zO1xufVxuIiwiaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSwgQ2xhc3NNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlJztcbmltcG9ydCB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4vQXBwbGljYXRpb25Db250ZXh0JztcblxuZXhwb3J0IGNsYXNzIExpZmVjeWNsZU1hbmFnZXI8VCA9IHVua25vd24+IHtcbiAgICBwcml2YXRlIGNsYXNzTWV0YWRhdGFSZWFkZXI6IENsYXNzTWV0YWRhdGFSZWFkZXI8VD47XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjb21wb25lbnRDbGFzczogTmV3YWJsZTxUPiwgcHJpdmF0ZSByZWFkb25seSBjb250YWluZXI6IEFwcGxpY2F0aW9uQ29udGV4dCkge1xuICAgICAgICB0aGlzLmNsYXNzTWV0YWRhdGFSZWFkZXIgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0aGlzLmNvbXBvbmVudENsYXNzLCBDbGFzc01ldGFkYXRhKS5yZWFkZXIoKTtcbiAgICB9XG4gICAgaW52b2tlUHJlSW5qZWN0TWV0aG9kKGluc3RhbmNlOiBJbnN0YW5jZTxUPikge1xuICAgICAgICBjb25zdCBtZXRob2RzID0gdGhpcy5jbGFzc01ldGFkYXRhUmVhZGVyLmdldE1ldGhvZHMoTGlmZWN5Y2xlLlBSRV9JTkpFQ1QpO1xuICAgICAgICB0aGlzLmludm9rZUxpZmVjeWNsZU1ldGhvZHMoaW5zdGFuY2UsIG1ldGhvZHMpO1xuICAgIH1cbiAgICBpbnZva2VQb3N0SW5qZWN0TWV0aG9kKGluc3RhbmNlOiBJbnN0YW5jZTxUPikge1xuICAgICAgICBjb25zdCBtZXRob2RzID0gdGhpcy5jbGFzc01ldGFkYXRhUmVhZGVyLmdldE1ldGhvZHMoTGlmZWN5Y2xlLlBPU1RfSU5KRUNUKTtcbiAgICAgICAgdGhpcy5pbnZva2VMaWZlY3ljbGVNZXRob2RzKGluc3RhbmNlLCBtZXRob2RzKTtcbiAgICB9XG4gICAgaW52b2tlUHJlRGVzdHJveUluamVjdE1ldGhvZChpbnN0YW5jZTogSW5zdGFuY2U8VD4pIHtcbiAgICAgICAgY29uc3QgbWV0aG9kcyA9IHRoaXMuY2xhc3NNZXRhZGF0YVJlYWRlci5nZXRNZXRob2RzKExpZmVjeWNsZS5QUkVfREVTVFJPWSk7XG4gICAgICAgIHRoaXMuaW52b2tlTGlmZWN5Y2xlTWV0aG9kcyhpbnN0YW5jZSwgbWV0aG9kcyk7XG4gICAgfVxuICAgIHByaXZhdGUgaW52b2tlTGlmZWN5Y2xlTWV0aG9kcyhpbnN0YW5jZTogSW5zdGFuY2U8VD4sIG1ldGhvZEtleXM6IEFycmF5PHN0cmluZyB8IHN5bWJvbD4pIHtcbiAgICAgICAgbWV0aG9kS2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnZva2UoaW5zdGFuY2Vba2V5XSwge1xuICAgICAgICAgICAgICAgIGNvbnRleHQ6IGluc3RhbmNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSwgQ2xhc3NNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHsgSW5zdGFuY2UgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZSc7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeURlZiB9IGZyb20gJy4vU2VydmljZUZhY3RvcnlEZWYnO1xuaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9HbG9iYWxNZXRhZGF0YSc7XG5pbXBvcnQgeyBsYXp5UHJvcCB9IGZyb20gJ0B2Z2VyYm90L2xhenknO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyIH0gZnJvbSAnLi9JbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyJztcbmltcG9ydCB7IExpZmVjeWNsZU1hbmFnZXIgfSBmcm9tICcuL0xpZmVjeWNsZU1hbmFnZXInO1xuaW1wb3J0IHsgRmFjdG9yeVJlY29yZGVyIH0gZnJvbSAnLi4vY29tbW9uL0ZhY3RvcnlSZWNvcmRlcic7XG5pbXBvcnQgeyBBbnlGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzL0FueUZ1bmN0aW9uJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IFNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi4vdHlwZXMvU2VydmljZUZhY3RvcnknO1xuXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyPFQ+IHtcbiAgICBwcml2YXRlIGdldENvbnN0cnVjdG9yQXJnczogKCkgPT4gdW5rbm93bltdID0gKCkgPT4gW107XG4gICAgcHJpdmF0ZSBwcm9wZXJ0eUZhY3RvcmllcyA9IG5ldyBGYWN0b3J5UmVjb3JkZXIoKTtcbiAgICBwcml2YXRlIGxhenlNb2RlOiBib29sZWFuID0gdHJ1ZTtcbiAgICBwcml2YXRlIGxpZmVjeWNsZVJlc29sdmVyOiBMaWZlY3ljbGVNYW5hZ2VyPFQ+O1xuICAgIHByaXZhdGUgY2xhc3NNZXRhZGF0YVJlYWRlcjogQ2xhc3NNZXRhZGF0YVJlYWRlcjxUPjtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBjb21wb25lbnRDbGFzczogTmV3YWJsZTxUPixcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBjb250YWluZXI6IEFwcGxpY2F0aW9uQ29udGV4dCxcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBpbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyOiBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyXG4gICAgKSB7XG4gICAgICAgIHRoaXMubGlmZWN5Y2xlUmVzb2x2ZXIgPSBuZXcgTGlmZWN5Y2xlTWFuYWdlcjxUPihjb21wb25lbnRDbGFzcywgY29udGFpbmVyKTtcbiAgICAgICAgY29uc3QgcmVhZGVyID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoY29tcG9uZW50Q2xhc3MsIENsYXNzTWV0YWRhdGEpLnJlYWRlcigpO1xuICAgICAgICB0aGlzLmNsYXNzTWV0YWRhdGFSZWFkZXIgPSByZWFkZXI7XG4gICAgICAgIHRoaXMuYXBwZW5kQ2xhc3NNZXRhZGF0YShyZWFkZXIpO1xuICAgIH1cbiAgICBhcHBlbmRMYXp5TW9kZShsYXp5TW9kZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLmxhenlNb2RlID0gbGF6eU1vZGU7XG4gICAgfVxuICAgIHByaXZhdGUgYXBwZW5kQ2xhc3NNZXRhZGF0YTxUPihjbGFzc01ldGFkYXRhUmVhZGVyOiBDbGFzc01ldGFkYXRhUmVhZGVyPFQ+KSB7XG4gICAgICAgIGNvbnN0IHR5cGVzID0gY2xhc3NNZXRhZGF0YVJlYWRlci5nZXRDb25zdHJ1Y3RvclBhcmFtZXRlclR5cGVzKCk7XG4gICAgICAgIHRoaXMuZ2V0Q29uc3RydWN0b3JBcmdzID0gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVzLm1hcChpdCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGFpbmVyLmdldEluc3RhbmNlKGl0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBnbG9iYWxNZXRhZGF0YVJlYWRlciA9IEdsb2JhbE1ldGFkYXRhLmdldFJlYWRlcigpO1xuICAgICAgICBjb25zdCBwcm9wZXJ0eVR5cGVzID0gY2xhc3NNZXRhZGF0YVJlYWRlci5nZXRQcm9wZXJ0eVR5cGVNYXAoKTtcbiAgICAgICAgZm9yIChjb25zdCBbcHJvcGVydHlOYW1lLCBwcm9wZXJ0eVR5cGVdIG9mIHByb3BlcnR5VHlwZXMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcGVydHlUeXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eUZhY3Rvcmllcy5hcHBlbmQocHJvcGVydHlOYW1lLCAoY29udGFpbmVyLCBvd25lcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4gY29udGFpbmVyLmdldEluc3RhbmNlKHByb3BlcnR5VHlwZSwgb3duZXIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZmFjdG9yeURlZiA9IHRoaXMuY29udGFpbmVyLmdldEZhY3RvcnkocHJvcGVydHlUeXBlKTtcbiAgICAgICAgICAgIGlmIChmYWN0b3J5RGVmKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eUZhY3Rvcmllcy5zZXQocHJvcGVydHlOYW1lLCBmYWN0b3J5RGVmKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHByb3BlcnR5Q2xhc3NNZXRhZGF0YSA9IGdsb2JhbE1ldGFkYXRhUmVhZGVyLmdldENsYXNzTWV0YWRhdGEocHJvcGVydHlUeXBlKTtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eUNsYXNzTWV0YWRhdGEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5RmFjdG9yaWVzLnNldChwcm9wZXJ0eU5hbWUsIFNlcnZpY2VGYWN0b3J5RGVmLmNyZWF0ZUZyb21DbGFzc01ldGFkYXRhKHByb3BlcnR5Q2xhc3NNZXRhZGF0YSkpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcHJvcGVydHlGYWN0b3J5RGVmID0gZ2xvYmFsTWV0YWRhdGFSZWFkZXIuZ2V0Q29tcG9uZW50RmFjdG9yeShwcm9wZXJ0eVR5cGUpO1xuICAgICAgICAgICAgaWYgKHByb3BlcnR5RmFjdG9yeURlZikge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydHlGYWN0b3JpZXMuc2V0KHByb3BlcnR5TmFtZSwgcHJvcGVydHlGYWN0b3J5RGVmKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBidWlsZCgpIHtcbiAgICAgICAgY29uc3QgYXJncyA9IHRoaXMuZ2V0Q29uc3RydWN0b3JBcmdzKCk7XG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSB0aGlzLmNyZWF0ZVByb3BlcnRpZXNHZXR0ZXJCdWlsZGVyKCk7XG4gICAgICAgIGNvbnN0IGlzQ3JlYXRpbmdJbnN0QXdhcmVQcm9jZXNzb3IgPSB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuaXNJbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyh0aGlzLmNvbXBvbmVudENsYXNzKTtcbiAgICAgICAgaWYgKGlzQ3JlYXRpbmdJbnN0QXdhcmVQcm9jZXNzb3IpIHtcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IHRoaXMuY29tcG9uZW50Q2xhc3MoLi4uYXJncykgYXMgSW5zdGFuY2U8VD47XG4gICAgICAgICAgICB0aGlzLmxpZmVjeWNsZVJlc29sdmVyLmludm9rZVByZUluamVjdE1ldGhvZChpbnN0YW5jZSk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2V0dGVyID0gcHJvcGVydGllc1trZXldKGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmluZVByb3BlcnR5KGluc3RhbmNlLCBrZXksIGdldHRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmxpZmVjeWNsZVJlc29sdmVyLmludm9rZVBvc3RJbmplY3RNZXRob2QoaW5zdGFuY2UpO1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGluc3RhbmNlOiB1bmRlZmluZWQgfCBJbnN0YW5jZTxUPiA9IHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5iZWZvcmVJbnN0YW50aWF0aW9uKHRoaXMuY29tcG9uZW50Q2xhc3MsIGFyZ3MpO1xuICAgICAgICAgICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlID0gbmV3IHRoaXMuY29tcG9uZW50Q2xhc3MoLi4uYXJncykgYXMgSW5zdGFuY2U8VD47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmxpZmVjeWNsZVJlc29sdmVyLmludm9rZVByZUluamVjdE1ldGhvZChpbnN0YW5jZSk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2V0dGVyID0gcHJvcGVydGllc1trZXldKGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmluZVByb3BlcnR5KGluc3RhbmNlLCBrZXksIGdldHRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbnN0YW5jZSA9IHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5hZnRlckluc3RhbnRpYXRpb24oaW5zdGFuY2UpO1xuICAgICAgICAgICAgdGhpcy5saWZlY3ljbGVSZXNvbHZlci5pbnZva2VQb3N0SW5qZWN0TWV0aG9kKGluc3RhbmNlKTtcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGRlZmluZVByb3BlcnR5PFQsIFY+KGluc3RhbmNlOiBULCBrZXk6IHN0cmluZyB8IHN5bWJvbCwgZ2V0dGVyOiAoKSA9PiBWKSB7XG4gICAgICAgIGlmICh0aGlzLmxhenlNb2RlKSB7XG4gICAgICAgICAgICBsYXp5UHJvcChpbnN0YW5jZSwga2V5LCBnZXR0ZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgaW5zdGFuY2Vba2V5XSA9IGdldHRlcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgY3JlYXRlUHJvcGVydGllc0dldHRlckJ1aWxkZXIoKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHt9IGFzIFJlY29yZDxrZXlvZiBULCAoaW5zdGFuY2U6IFQpID0+ICgpID0+IHVua25vd24gfCB1bmtub3duW10+O1xuICAgICAgICBjb25zdCBwcm9wZXJ0eVR5cGVNYXAgPSB0aGlzLmNsYXNzTWV0YWRhdGFSZWFkZXIuZ2V0UHJvcGVydHlUeXBlTWFwKCk7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgZmFjdG9yeURlZl0gb2YgdGhpcy5wcm9wZXJ0eUZhY3Rvcmllcy5pdGVyYXRvcigpKSB7XG4gICAgICAgICAgICBjb25zdCBpc0FycmF5ID0gKHByb3BlcnR5VHlwZU1hcC5nZXQoa2V5KSBhcyB1bmtub3duKSA9PT0gQXJyYXk7XG4gICAgICAgICAgICBpZiAoIWlzQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmFjdG9yeURlZi5mYWN0b3JpZXMuc2l6ZSA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgICAgICAgICAgICAgICAgICAgIGBNdWx0aXBsZSBtYXRjaGluZyBpbmplY3RhYmxlcyBmb3VuZCBmb3IgcHJvcGVydHkgaW5qZWN0aW9uLFxcbmJ1dCBwcm9wZXJ0eSAke2tleS50b1N0cmluZygpfSBpcyBub3QgYW4gYXJyYXksXG4gICAgICAgICAgICAgICAgICAgICAgICBJdCBpcyBhbWJpZ3VvdXMgdG8gZGV0ZXJtaW5lIHdoaWNoIG9iamVjdCBzaG91bGQgYmUgaW5qZWN0ZWQhYFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBbZmFjdG9yeSwgaW5qZWN0aW9uc10gPSBmYWN0b3J5RGVmLmZhY3Rvcmllcy5lbnRyaWVzKCkubmV4dCgpLnZhbHVlIGFzIFtcbiAgICAgICAgICAgICAgICAgICAgU2VydmljZUZhY3Rvcnk8dW5rbm93biwgdW5rbm93bj4sXG4gICAgICAgICAgICAgICAgICAgIElkZW50aWZpZXJbXVxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgcmVzdWx0W2tleSBhcyBrZXlvZiBUXSA9IDxUPihpbnN0YW5jZTogVCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9kdWNlciA9IGZhY3RvcnkodGhpcy5jb250YWluZXIsIGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRhaW5lci5pbnZva2UocHJvZHVjZXIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmplY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHRba2V5IGFzIGtleW9mIFRdID0gPFQ+KGluc3RhbmNlOiBUKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2R1Y2VyQW5kSW5qZWN0aW9ucyA9IEFycmF5LmZyb20oZmFjdG9yeURlZi5mYWN0b3JpZXMpLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAgIChbZmFjdG9yeSwgaW5qZWN0aW9uc10pID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2ZhY3RvcnkodGhpcy5jb250YWluZXIsIGluc3RhbmNlKSwgaW5qZWN0aW9uc10gYXMgW0FueUZ1bmN0aW9uPHVua25vd24+LCBJZGVudGlmaWVyW11dXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9kdWNlckFuZEluamVjdGlvbnMubWFwKChbcHJvZHVjZXIsIGluamVjdGlvbnNdKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGFpbmVyLmludm9rZShwcm9kdWNlciwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmplY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuIiwibGV0IGluc3RhbmNlU2VyaWFsTm8gPSAtMTtcblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudEluc3RhbmNlV3JhcHBlciB7XG4gICAgcHVibGljIHJlYWRvbmx5IHNlcmlhbE5vID0gKytpbnN0YW5jZVNlcmlhbE5vO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGluc3RhbmNlOiB1bmtub3duKSB7fVxuXG4gICAgcHVibGljIGNvbXBhcmVUbyhvdGhlcjogQ29tcG9uZW50SW5zdGFuY2VXcmFwcGVyKTogLTEgfCAwIHwgMSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlcmlhbE5vID4gb3RoZXIuc2VyaWFsTm8gPyAtMSA6IHRoaXMuc2VyaWFsTm8gPCBvdGhlci5zZXJpYWxObyA/IDEgOiAwO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9MaWZlY3ljbGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gaW52b2tlUHJlRGVzdHJveShpbnN0YW5jZTogdW5rbm93bikge1xuICAgIGNvbnN0IGNsYXp6ID0gaW5zdGFuY2U/LmNvbnN0cnVjdG9yO1xuICAgIGlmICghY2xhenopIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGNsYXp6LCBDbGFzc01ldGFkYXRhKTtcbiAgICBjb25zdCBwcmVEZXN0cm95TWV0aG9kcyA9IG1ldGFkYXRhLmdldE1ldGhvZHMoTGlmZWN5Y2xlLlBSRV9ERVNUUk9ZKTtcbiAgICBwcmVEZXN0cm95TWV0aG9kcy5mb3JFYWNoKG1ldGhvZE5hbWUgPT4ge1xuICAgICAgICBjb25zdCBtZXRob2QgPSBjbGF6ei5wcm90b3R5cGVbbWV0aG9kTmFtZV07XG4gICAgICAgIGlmICh0eXBlb2YgbWV0aG9kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBtZXRob2QuYXBwbHkoaW5zdGFuY2UpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgeyBHZXRJbnN0YW5jZU9wdGlvbnMsIEluc3RhbmNlUmVzb2x1dGlvbiwgU2F2ZUluc3RhbmNlT3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlUmVzb2x1dGlvbic7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBDb21wb25lbnRJbnN0YW5jZVdyYXBwZXIgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0NvbXBvbmVudEluc3RhbmNlV3JhcHBlcic7XG5pbXBvcnQgeyBpbnZva2VQcmVEZXN0cm95IH0gZnJvbSAnLi4vY29tbW9uL2ludm9rZVByZURlc3Ryb3knO1xuXG5leHBvcnQgY2xhc3MgU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uIGltcGxlbWVudHMgSW5zdGFuY2VSZXNvbHV0aW9uIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IElOU1RBTkNFX01BUCA9IG5ldyBNYXA8SWRlbnRpZmllciwgQ29tcG9uZW50SW5zdGFuY2VXcmFwcGVyPigpO1xuICAgIGdldEluc3RhbmNlPFQsIE8+KG9wdGlvbnM6IEdldEluc3RhbmNlT3B0aW9uczxULCBPPik6IFQge1xuICAgICAgICByZXR1cm4gdGhpcy5JTlNUQU5DRV9NQVAuZ2V0KG9wdGlvbnMuaWRlbnRpZmllcik/Lmluc3RhbmNlIGFzIFQ7XG4gICAgfVxuXG4gICAgc2F2ZUluc3RhbmNlPFQsIE8+KG9wdGlvbnM6IFNhdmVJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5JTlNUQU5DRV9NQVAuc2V0KG9wdGlvbnMuaWRlbnRpZmllciwgbmV3IENvbXBvbmVudEluc3RhbmNlV3JhcHBlcihvcHRpb25zLmluc3RhbmNlKSk7XG4gICAgfVxuXG4gICAgc2hvdWxkR2VuZXJhdGU8VCwgTz4ob3B0aW9uczogR2V0SW5zdGFuY2VPcHRpb25zPFQsIE8+KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhdGhpcy5JTlNUQU5DRV9NQVAuaGFzKG9wdGlvbnMuaWRlbnRpZmllcik7XG4gICAgfVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlV3JhcHBlcnMgPSBBcnJheS5mcm9tKHRoaXMuSU5TVEFOQ0VfTUFQLnZhbHVlcygpKTtcbiAgICAgICAgaW5zdGFuY2VXcmFwcGVycy5zb3J0KChhLCBiKSA9PiBhLmNvbXBhcmVUbyhiKSk7XG4gICAgICAgIGluc3RhbmNlV3JhcHBlcnMuZm9yRWFjaChpbnN0YW5jZVdyYXBwZXIgPT4ge1xuICAgICAgICAgICAgaW52b2tlUHJlRGVzdHJveShpbnN0YW5jZVdyYXBwZXIuaW5zdGFuY2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5JTlNUQU5DRV9NQVAuY2xlYXIoKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBHZXRJbnN0YW5jZU9wdGlvbnMsIEluc3RhbmNlUmVzb2x1dGlvbiwgU2F2ZUluc3RhbmNlT3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlUmVzb2x1dGlvbic7XG5pbXBvcnQgeyBTaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24gfSBmcm9tICcuL1NpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbic7XG5cbmNvbnN0IFNJTkdMRVRPTl9JTlNUQU5DRV9TSU5HTEVUT04gPSBuZXcgU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uKCk7XG5cbmV4cG9ydCBjbGFzcyBHbG9iYWxTaGFyZWRJbnN0YW5jZVJlc29sdXRpb24gaW1wbGVtZW50cyBJbnN0YW5jZVJlc29sdXRpb24ge1xuICAgIGdldEluc3RhbmNlPFQsIE8+KG9wdGlvbnM6IEdldEluc3RhbmNlT3B0aW9uczxULCBPPik6IFQge1xuICAgICAgICByZXR1cm4gU0lOR0xFVE9OX0lOU1RBTkNFX1NJTkdMRVRPTi5nZXRJbnN0YW5jZShvcHRpb25zKTtcbiAgICB9XG5cbiAgICBzYXZlSW5zdGFuY2U8VCwgTz4ob3B0aW9uczogU2F2ZUluc3RhbmNlT3B0aW9uczxULCBPPik6IHZvaWQge1xuICAgICAgICBTSU5HTEVUT05fSU5TVEFOQ0VfU0lOR0xFVE9OLnNhdmVJbnN0YW5jZShvcHRpb25zKTtcbiAgICB9XG5cbiAgICBzaG91bGRHZW5lcmF0ZTxULCBPPihvcHRpb25zOiBHZXRJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIFNJTkdMRVRPTl9JTlNUQU5DRV9TSU5HTEVUT04uc2hvdWxkR2VuZXJhdGUob3B0aW9ucyk7XG4gICAgfVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIC8vIFBBU1M7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSW5zdGFuY2VSZXNvbHV0aW9uLCBTYXZlSW5zdGFuY2VPcHRpb25zIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IGludm9rZVByZURlc3Ryb3kgfSBmcm9tICcuLi9jb21tb24vaW52b2tlUHJlRGVzdHJveSc7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2llbnRJbnN0YW5jZVJlc29sdXRpb24gaW1wbGVtZW50cyBJbnN0YW5jZVJlc29sdXRpb24ge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgaW5zdGFuY2VzID0gbmV3IFNldDx1bmtub3duPigpO1xuICAgIHNob3VsZEdlbmVyYXRlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBnZXRJbnN0YW5jZTxUPigpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNhdmVJbnN0YW5jZTxULCBPPihvcHRpb25zOiBTYXZlSW5zdGFuY2VPcHRpb25zPFQsIE8+KTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW5zdGFuY2VzLmFkZChvcHRpb25zLmluc3RhbmNlKTtcbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZXMuZm9yRWFjaChpdCA9PiB7XG4gICAgICAgICAgICBpZiAoIWl0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW52b2tlUHJlRGVzdHJveShpdCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmluc3RhbmNlcy5jbGVhcigpO1xuICAgIH1cbiAgICBkZXN0cm95VGhhdDxUPihpbnN0YW5jZTogVCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuaW5zdGFuY2VzLmhhcyhpbnN0YW5jZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpbnZva2VQcmVEZXN0cm95KGluc3RhbmNlKTtcbiAgICAgICAgdGhpcy5pbnN0YW5jZXMuZGVsZXRlKGluc3RhbmNlKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBFdmFsdWF0b3IgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0b3InO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHsgSlNPTkRhdGEgfSBmcm9tICcuLi90eXBlcy9KU09ORGF0YSc7XG5cbmV4cG9ydCBjbGFzcyBKU09ORGF0YUV2YWx1YXRvciBpbXBsZW1lbnRzIEV2YWx1YXRvciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBuYW1lc3BhY2VEYXRhTWFwID0gbmV3IE1hcDxzdHJpbmcsIEpTT05EYXRhPigpO1xuICAgIGV2YWw8VD4oY29udGV4dDogQXBwbGljYXRpb25Db250ZXh0LCBleHByZXNzaW9uOiBzdHJpbmcpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc3QgY29sb25JbmRleCA9IGV4cHJlc3Npb24uaW5kZXhPZignOicpO1xuICAgICAgICBpZiAoY29sb25JbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW5jb3JyZWN0IGV4cHJlc3Npb24sIG5hbWVzcGFjZSBub3Qgc3BlY2lmaWVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmFtZXNwYWNlID0gZXhwcmVzc2lvbi5zdWJzdHJpbmcoMCwgY29sb25JbmRleCk7XG4gICAgICAgIGNvbnN0IGV4cCA9IGV4cHJlc3Npb24uc3Vic3RyaW5nKGNvbG9uSW5kZXggKyAxKTtcbiAgICAgICAgaWYgKCF0aGlzLm5hbWVzcGFjZURhdGFNYXAuaGFzKG5hbWVzcGFjZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW5jb3JyZWN0IGV4cHJlc3Npb246IG5hbWVzcGFjZSBub3QgcmVjb3JkZWQ6IFwiJHtuYW1lc3BhY2V9XCJgKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5uYW1lc3BhY2VEYXRhTWFwLmdldChuYW1lc3BhY2UpIGFzIEpTT05EYXRhO1xuICAgICAgICByZXR1cm4gcnVuRXhwcmVzc2lvbihleHAsIGRhdGEgYXMgT2JqZWN0KTtcbiAgICB9XG4gICAgcmVjb3JkRGF0YShuYW1lc3BhY2U6IHN0cmluZywgZGF0YTogSlNPTkRhdGEpIHtcbiAgICAgICAgdGhpcy5uYW1lc3BhY2VEYXRhTWFwLnNldChuYW1lc3BhY2UsIGRhdGEpO1xuICAgIH1cbiAgICBnZXRKU09ORGF0YShuYW1lc3BhY2U6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lc3BhY2VEYXRhTWFwLmdldChuYW1lc3BhY2UpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcnVuRXhwcmVzc2lvbihleHByZXNzaW9uOiBzdHJpbmcsIHJvb3RDb250ZXh0OiBPYmplY3QpIHtcbiAgICBjb25zdCBmbiA9IGNvbXBpbGVFeHByZXNzaW9uKGV4cHJlc3Npb24pO1xuICAgIHJldHVybiBmbihyb290Q29udGV4dCk7XG59XG5cbmZ1bmN0aW9uIGNvbXBpbGVFeHByZXNzaW9uKGV4cHJlc3Npb246IHN0cmluZykge1xuICAgIGlmIChleHByZXNzaW9uLmluZGV4T2YoJywnKSA+IC0xKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW5jb3JyZWN0IGV4cHJlc3Npb24gc3ludGF4LCBUaGUgJywnIGlzIG5vdCBhbGxvd2VkIGluIGV4cHJlc3Npb246IFwiJHtleHByZXNzaW9ufVwiYCk7XG4gICAgfVxuICAgIGlmIChleHByZXNzaW9uLmxlbmd0aCA+IDEyMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgSW5jb3JyZWN0IGV4cHJlc3Npb24gc3ludGF4LCBleHByZXNzaW9uIGxlbmd0aCBjYW5ub3QgYmUgZ3JlYXRlciB0aGFuIDEyMCwgYnV0IGFjdHVhbDogJHtleHByZXNzaW9uLmxlbmd0aH1gXG4gICAgICAgICk7XG4gICAgfVxuICAgIGlmICgvXFwoLio/XFwpLy50ZXN0KGV4cHJlc3Npb24pKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW5jb3JyZWN0IGV4cHJlc3Npb24gc3ludGF4LCBwYXJlbnRoZXNlcyBhcmUgbm90IGFsbG93ZWQgaW4gZXhwcmVzc2lvbjogXCIke2V4cHJlc3Npb259XCJgKTtcbiAgICB9XG4gICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24udHJpbSgpO1xuICAgIGlmIChleHByZXNzaW9uID09PSAnJykge1xuICAgICAgICByZXR1cm4gKHJvb3Q6IE9iamVjdCkgPT4gcm9vdDtcbiAgICB9XG5cbiAgICBjb25zdCByb290VmFyTmFtZSA9IHZhck5hbWUoJ2NvbnRleHQnKTtcbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKFxuICAgICAgICByb290VmFyTmFtZSxcbiAgICAgICAgYFxuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiAke3Jvb3RWYXJOYW1lfS4ke2V4cHJlc3Npb259O1xuICAgICAgICB9IGNhdGNoKGVycm9yKSB7IHRocm93IGVycm9yIH1cbiAgICBgXG4gICAgKTtcbn1cbmxldCBWQVJfU0VRVUVOQ0UgPSBEYXRlLm5vdygpO1xuZnVuY3Rpb24gdmFyTmFtZShwcmVmaXg6IHN0cmluZykge1xuICAgIHJldHVybiBwcmVmaXggKyAnJyArIChWQVJfU0VRVUVOQ0UrKykudG9TdHJpbmcoMTYpO1xufVxuIiwiaW1wb3J0IHsgRXZhbHVhdG9yIH0gZnJvbSAnLi4vdHlwZXMvRXZhbHVhdG9yJztcbmltcG9ydCB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4uL2ZvdW5kYXRpb24vQXBwbGljYXRpb25Db250ZXh0JztcblxuZXhwb3J0IGNsYXNzIEVudmlyb25tZW50RXZhbHVhdG9yIGltcGxlbWVudHMgRXZhbHVhdG9yIHtcbiAgICBldmFsPFQ+KGNvbnRleHQ6IEFwcGxpY2F0aW9uQ29udGV4dCwgZXhwcmVzc2lvbjogc3RyaW5nKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiBwcm9jZXNzLmVudltleHByZXNzaW9uXSBhcyBUIHwgdW5kZWZpbmVkO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEV2YWx1YXRvciB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRvcic7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5cbmV4cG9ydCBjbGFzcyBBcmd2RXZhbHVhdG9yIGltcGxlbWVudHMgRXZhbHVhdG9yIHtcbiAgICBldmFsPFQsIEEgPSBzdHJpbmdbXT4oY29udGV4dDogQXBwbGljYXRpb25Db250ZXh0LCBleHByZXNzaW9uOiBzdHJpbmcsIGFyZ3M/OiBBKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IGFyZ3YgPSBhcmdzIHx8IHByb2Nlc3MuYXJndjtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby12YXItcmVxdWlyZXNcbiAgICAgICAgY29uc3QgbWluaW1pc3QgPSByZXF1aXJlKCdtaW5pbWlzdCcpO1xuICAgICAgICBjb25zdCBtYXAgPSBtaW5pbWlzdChhcmd2KTtcbiAgICAgICAgcmV0dXJuIG1hcFtleHByZXNzaW9uXTtcbiAgICB9XG59XG4iLCJleHBvcnQgZW51bSBBZHZpY2Uge1xuICAgIEJlZm9yZSxcbiAgICBBZnRlcixcbiAgICBBcm91bmQsXG4gICAgQWZ0ZXJSZXR1cm4sXG4gICAgVGhyb3duLFxuICAgIEZpbmFsbHlcbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4vQWR2aWNlJztcblxudHlwZSBCZWZvcmVIb29rID0gKGFyZ3M6IGFueVtdKSA9PiB2b2lkO1xudHlwZSBBZnRlckhvb2sgPSAoYXJnczogYW55W10pID0+IHZvaWQ7XG50eXBlIFRocm93bkhvb2sgPSAocmVhc29uOiBhbnksIGFyZ3M6IGFueVtdKSA9PiB2b2lkO1xudHlwZSBGaW5hbGx5SG9vayA9IChhcmdzOiBhbnlbXSkgPT4gdm9pZDtcbnR5cGUgQWZ0ZXJSZXR1cm5Ib29rID0gKHJldHVyblZhbHVlOiBhbnksIGFyZ3M6IGFueVtdKSA9PiBhbnk7XG50eXBlIEFyb3VuZEhvb2sgPSAodGhpczogYW55LCBvcmlnaW5mbjogKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkLCBhcmdzOiBhbnlbXSkgPT4gdm9pZDtcblxuZXhwb3J0IGNsYXNzIEFzcGVjdFV0aWxzIHtcbiAgICBwcml2YXRlIGJlZm9yZUhvb2tzOiBBcnJheTxCZWZvcmVIb29rPiA9IFtdO1xuICAgIHByaXZhdGUgYWZ0ZXJIb29rczogQXJyYXk8QWZ0ZXJIb29rPiA9IFtdO1xuICAgIHByaXZhdGUgdGhyb3duSG9va3M6IEFycmF5PFRocm93bkhvb2s+ID0gW107XG4gICAgcHJpdmF0ZSBmaW5hbGx5SG9va3M6IEFycmF5PEZpbmFsbHlIb29rPiA9IFtdO1xuICAgIHByaXZhdGUgYWZ0ZXJSZXR1cm5Ib29rczogQXJyYXk8QWZ0ZXJSZXR1cm5Ib29rPiA9IFtdO1xuICAgIHByaXZhdGUgYXJvdW5kSG9va3M6IEFycmF5PEFyb3VuZEhvb2s+ID0gW107XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBmbjogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpIHt9XG4gICAgYXBwZW5kKGFkdmljZTogQWR2aWNlLkJlZm9yZSwgaG9vazogQmVmb3JlSG9vayk6IHZvaWQ7XG4gICAgYXBwZW5kKGFkdmljZTogQWR2aWNlLkFmdGVyLCBob29rOiBBZnRlckhvb2spOiB2b2lkO1xuICAgIGFwcGVuZChhZHZpY2U6IEFkdmljZS5UaHJvd24sIGhvb2s6IFRocm93bkhvb2spOiB2b2lkO1xuICAgIGFwcGVuZChhZHZpY2U6IEFkdmljZS5GaW5hbGx5LCBob29rOiBGaW5hbGx5SG9vayk6IHZvaWQ7XG4gICAgYXBwZW5kKGFkdmljZTogQWR2aWNlLkFmdGVyUmV0dXJuLCBob29rOiBBZnRlclJldHVybkhvb2spOiB2b2lkO1xuICAgIGFwcGVuZChhZHZpY2U6IEFkdmljZS5Bcm91bmQsIGhvb2s6IEFyb3VuZEhvb2spOiB2b2lkO1xuICAgIGFwcGVuZChhZHZpY2U6IEFkdmljZSwgaG9vazogRnVuY3Rpb24pIHtcbiAgICAgICAgbGV0IGhvb2tzQXJyYXk6IEZ1bmN0aW9uW10gfCB1bmRlZmluZWQ7XG4gICAgICAgIHN3aXRjaCAoYWR2aWNlKSB7XG4gICAgICAgICAgICBjYXNlIEFkdmljZS5CZWZvcmU6XG4gICAgICAgICAgICAgICAgaG9va3NBcnJheSA9IHRoaXMuYmVmb3JlSG9va3M7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFkdmljZS5BZnRlcjpcbiAgICAgICAgICAgICAgICBob29rc0FycmF5ID0gdGhpcy5hZnRlckhvb2tzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBZHZpY2UuVGhyb3duOlxuICAgICAgICAgICAgICAgIGhvb2tzQXJyYXkgPSB0aGlzLnRocm93bkhvb2tzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBZHZpY2UuRmluYWxseTpcbiAgICAgICAgICAgICAgICBob29rc0FycmF5ID0gdGhpcy5maW5hbGx5SG9va3M7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFkdmljZS5BZnRlclJldHVybjpcbiAgICAgICAgICAgICAgICBob29rc0FycmF5ID0gdGhpcy5hZnRlclJldHVybkhvb2tzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBZHZpY2UuQXJvdW5kOlxuICAgICAgICAgICAgICAgIGhvb2tzQXJyYXkgPSB0aGlzLmFyb3VuZEhvb2tzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChob29rc0FycmF5KSB7XG4gICAgICAgICAgICBob29rc0FycmF5LnB1c2goaG9vayk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZXh0cmFjdCgpIHtcbiAgICAgICAgY29uc3QgeyBhcm91bmRIb29rcywgYmVmb3JlSG9va3MsIGFmdGVySG9va3MsIGFmdGVyUmV0dXJuSG9va3MsIGZpbmFsbHlIb29rcywgdGhyb3duSG9va3MgfSA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGZuID0gYXJvdW5kSG9va3MucmVkdWNlUmlnaHQoKHByZXYsIG5leHQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0LmNhbGwodGhpcywgcHJldiwgYXJncyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9LCB0aGlzLmZuKSBhcyB0eXBlb2YgdGhpcy5mbjtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0aGlzOiBhbnksIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgICAgICBiZWZvcmVIb29rcy5mb3JFYWNoKGhvb2sgPT4ge1xuICAgICAgICAgICAgICAgIGhvb2suY2FsbCh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgaW52b2tlID0gKG9uRXJyb3I6IChyZWFzb246IGFueSkgPT4gdm9pZCwgb25GaW5hbGx5OiAoKSA9PiB2b2lkLCBvbkFmdGVyOiAocmV0dXJuVmFsdWU6IGFueSkgPT4gYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJldHVyblZhbHVlOiBhbnk7XG4gICAgICAgICAgICAgICAgbGV0IGlzUHJvbWlzZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVyblZhbHVlID0gZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXR1cm5WYWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUHJvbWlzZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSA9IHJldHVyblZhbHVlLmNhdGNoKG9uRXJyb3IpLmZpbmFsbHkob25GaW5hbGx5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkZpbmFsbHkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaXNQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXR1cm5WYWx1ZS50aGVuKCh2YWx1ZTogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb25BZnRlcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvbkFmdGVyKHJldHVyblZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIGludm9rZShcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aHJvd25Ib29rcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvd25Ib29rcy5mb3JFYWNoKGhvb2sgPT4gaG9vay5jYWxsKHRoaXMsIGVycm9yLCBhcmdzKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBmaW5hbGx5SG9va3MuZm9yRWFjaChob29rID0+IGhvb2suY2FsbCh0aGlzLCBhcmdzKSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGFmdGVySG9va3MuZm9yRWFjaChob29rID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2suY2FsbCh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhZnRlclJldHVybkhvb2tzLnJlZHVjZSgocmV0VmFsLCBob29rKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaG9vay5jYWxsKHRoaXMsIHJldFZhbCwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH0sIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9O1xuICAgIH1cbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cbmltcG9ydCB0eXBlIHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi9BZHZpY2UnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQXNwZWN0LCBKb2luUG9pbnQsIFByb2NlZWRpbmdKb2luUG9pbnQgfSBmcm9tICcuL0FzcGVjdCc7XG5pbXBvcnQgeyBBc3BlY3RVdGlscyB9IGZyb20gJy4vQXNwZWN0VXRpbHMnO1xuaW1wb3J0IHsgQXNwZWN0SW5mbyB9IGZyb20gJy4vQXNwZWN0TWV0YWR0YSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBc3BlY3Q8VD4oXG4gICAgYXBwQ3R4OiBBcHBsaWNhdGlvbkNvbnRleHQsXG4gICAgdGFyZ2V0OiBULFxuICAgIG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCxcbiAgICBtZXRob2RGdW5jOiBGdW5jdGlvbixcbiAgICBhc3BlY3RzOiBBc3BlY3RJbmZvW11cbikge1xuICAgIGNvbnN0IGNyZWF0ZUFzcGVjdEN0eCA9IChhZHZpY2U6IEFkdmljZSwgYXJnczogYW55W10sIHJldHVyblZhbHVlOiBhbnkgPSBudWxsLCBlcnJvcjogYW55ID0gbnVsbCk6IEpvaW5Qb2ludCA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0YXJnZXQsXG4gICAgICAgICAgICBtZXRob2ROYW1lLFxuICAgICAgICAgICAgYXJndW1lbnRzOiBhcmdzLFxuICAgICAgICAgICAgcmV0dXJuVmFsdWUsXG4gICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgIGFkdmljZSxcbiAgICAgICAgICAgIGN0eDogYXBwQ3R4XG4gICAgICAgIH07XG4gICAgfTtcbiAgICBjb25zdCBhc3BlY3RVdGlscyA9IG5ldyBBc3BlY3RVdGlscyhtZXRob2RGdW5jIGFzICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTtcbiAgICBjb25zdCBDbGFzc1RvSW5zdGFuY2UgPSAoYXNwZWN0SW5mbzogQXNwZWN0SW5mbykgPT4gYXBwQ3R4LmdldEluc3RhbmNlKGFzcGVjdEluZm8uYXNwZWN0Q2xhc3MpIGFzIEFzcGVjdDtcbiAgICBjb25zdCB0YXJnZXRDb25zdHJ1Y3RvciA9ICh0YXJnZXQgYXMgb2JqZWN0KS5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPFQ+O1xuICAgIGNvbnN0IGFsbE1hdGNoQXNwZWN0cyA9IGFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LnBvaW50Y3V0LnRlc3QodGFyZ2V0Q29uc3RydWN0b3IsIG1ldGhvZE5hbWUpKTtcblxuICAgIGNvbnN0IGJlZm9yZUFkdmljZUFzcGVjdHMgPSBhbGxNYXRjaEFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LmFkdmljZSA9PT0gQWR2aWNlLkJlZm9yZSkubWFwKENsYXNzVG9JbnN0YW5jZSk7XG4gICAgY29uc3QgYWZ0ZXJBZHZpY2VBc3BlY3RzID0gYWxsTWF0Y2hBc3BlY3RzLmZpbHRlcihpdCA9PiBpdC5hZHZpY2UgPT09IEFkdmljZS5BZnRlcikubWFwKENsYXNzVG9JbnN0YW5jZSk7XG4gICAgY29uc3QgdHJ5Q2F0Y2hBZHZpY2VBc3BlY3RzID0gYWxsTWF0Y2hBc3BlY3RzLmZpbHRlcihpdCA9PiBpdC5hZHZpY2UgPT09IEFkdmljZS5UaHJvd24pLm1hcChDbGFzc1RvSW5zdGFuY2UpO1xuICAgIGNvbnN0IHRyeUZpbmFsbHlBZHZpY2VBc3BlY3RzID0gYWxsTWF0Y2hBc3BlY3RzLmZpbHRlcihpdCA9PiBpdC5hZHZpY2UgPT09IEFkdmljZS5GaW5hbGx5KS5tYXAoQ2xhc3NUb0luc3RhbmNlKTtcbiAgICBjb25zdCBhZnRlclJldHVybkFkdmljZUFzcGVjdHMgPSBhbGxNYXRjaEFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LmFkdmljZSA9PT0gQWR2aWNlLkFmdGVyUmV0dXJuKS5tYXAoQ2xhc3NUb0luc3RhbmNlKTtcbiAgICBjb25zdCBhcm91bmRBZHZpY2VBc3BlY3RzID0gYWxsTWF0Y2hBc3BlY3RzLmZpbHRlcihpdCA9PiBpdC5hZHZpY2UgPT09IEFkdmljZS5Bcm91bmQpLm1hcChDbGFzc1RvSW5zdGFuY2UpO1xuXG4gICAgaWYgKGJlZm9yZUFkdmljZUFzcGVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLkJlZm9yZSwgKGFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBqb2luUG9pbnQgPSBjcmVhdGVBc3BlY3RDdHgoQWR2aWNlLkJlZm9yZSwgYXJncyk7XG4gICAgICAgICAgICBiZWZvcmVBZHZpY2VBc3BlY3RzLmZvckVhY2goYXNwZWN0ID0+IHtcbiAgICAgICAgICAgICAgICBhc3BlY3QuZXhlY3V0ZShqb2luUG9pbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoYWZ0ZXJBZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXNwZWN0VXRpbHMuYXBwZW5kKEFkdmljZS5BZnRlciwgKGFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBqb2luUG9pbnQgPSBjcmVhdGVBc3BlY3RDdHgoQWR2aWNlLkFmdGVyLCBhcmdzKTtcbiAgICAgICAgICAgIGFmdGVyQWR2aWNlQXNwZWN0cy5mb3JFYWNoKGFzcGVjdCA9PiB7XG4gICAgICAgICAgICAgICAgYXNwZWN0LmV4ZWN1dGUoam9pblBvaW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHRyeUNhdGNoQWR2aWNlQXNwZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFzcGVjdFV0aWxzLmFwcGVuZChBZHZpY2UuVGhyb3duLCAoZXJyb3IsIGFyZ3MpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGpvaW5Qb2ludCA9IGNyZWF0ZUFzcGVjdEN0eChBZHZpY2UuVGhyb3duLCBhcmdzLCBudWxsLCBlcnJvcik7XG4gICAgICAgICAgICB0cnlDYXRjaEFkdmljZUFzcGVjdHMuZm9yRWFjaChhc3BlY3QgPT4ge1xuICAgICAgICAgICAgICAgIGFzcGVjdC5leGVjdXRlKGpvaW5Qb2ludCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRyeUZpbmFsbHlBZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXNwZWN0VXRpbHMuYXBwZW5kKEFkdmljZS5GaW5hbGx5LCAoYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGpvaW5Qb2ludCA9IGNyZWF0ZUFzcGVjdEN0eChBZHZpY2UuRmluYWxseSwgYXJncyk7XG4gICAgICAgICAgICB0cnlGaW5hbGx5QWR2aWNlQXNwZWN0cy5mb3JFYWNoKGFzcGVjdCA9PiB7XG4gICAgICAgICAgICAgICAgYXNwZWN0LmV4ZWN1dGUoam9pblBvaW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoYWZ0ZXJSZXR1cm5BZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXNwZWN0VXRpbHMuYXBwZW5kKEFkdmljZS5BZnRlclJldHVybiwgKHJldHVyblZhbHVlLCBhcmdzKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYWZ0ZXJSZXR1cm5BZHZpY2VBc3BlY3RzLnJlZHVjZSgocHJldlJldHVyblZhbHVlLCBhc3BlY3QpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBqb2luUG9pbnQgPSBjcmVhdGVBc3BlY3RDdHgoQWR2aWNlLkFmdGVyUmV0dXJuLCBhcmdzLCByZXR1cm5WYWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFzcGVjdC5leGVjdXRlKGpvaW5Qb2ludCk7XG4gICAgICAgICAgICB9LCByZXR1cm5WYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChhcm91bmRBZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXJvdW5kQWR2aWNlQXNwZWN0cy5mb3JFYWNoKGFzcGVjdCA9PiB7XG4gICAgICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLkFyb3VuZCwgKG9yaWdpbkZuLCBhcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgam9pblBvaW50ID0gY3JlYXRlQXNwZWN0Q3R4KEFkdmljZS5Bcm91bmQsIGFyZ3MsIG51bGwpIGFzIFByb2NlZWRpbmdKb2luUG9pbnQ7XG4gICAgICAgICAgICAgICAgam9pblBvaW50LnByb2NlZWQgPSAoanBBcmdzID0gYXJncykgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luRm4oanBBcmdzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBhc3BlY3QuZXhlY3V0ZShqb2luUG9pbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBhc3BlY3RVdGlscy5leHRyYWN0KCk7XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG5pbXBvcnQgeyBBc3BlY3QsIEpvaW5Qb2ludCB9IGZyb20gJy4vQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbXBvbmVudE1ldGhvZEFzcGVjdCBpbXBsZW1lbnRzIEFzcGVjdCB7XG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUoY2xheno6IE5ld2FibGU8dW5rbm93bj4sIG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCk6IE5ld2FibGU8QXNwZWN0PiB7XG4gICAgICAgIHJldHVybiBjbGFzcyBDb21wb25lbnRNZXRob2RBc3BlY3RJbXBsIGV4dGVuZHMgQ29tcG9uZW50TWV0aG9kQXNwZWN0IHtcbiAgICAgICAgICAgIGV4ZWN1dGUoanA6IEpvaW5Qb2ludCk6IGFueSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXNwZWN0SW5zdGFuY2UgPSBqcC5jdHguZ2V0SW5zdGFuY2UoY2xhenopIGFzIGFueTtcbiAgICAgICAgICAgICAgICBjb25zdCBmdW5jID0gYXNwZWN0SW5zdGFuY2VbbWV0aG9kTmFtZV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLmFzcGVjdEluc3RhbmNlLCBqcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIHByb3RlY3RlZCBhc3BlY3RJbnN0YW5jZSE6IGFueTtcbiAgICBhYnN0cmFjdCBleGVjdXRlKGN0eDogSm9pblBvaW50KTogYW55O1xufVxuIiwiaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IE1ldGFkYXRhLCBNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4uL3R5cGVzL01ldGFkYXRhJztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4vQWR2aWNlJztcbmltcG9ydCB7IENvbXBvbmVudE1ldGhvZEFzcGVjdCB9IGZyb20gJy4vQ29tcG9uZW50TWV0aG9kQXNwZWN0JztcbmltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi9Qb2ludGN1dCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXNwZWN0SW5mbyB7XG4gICAgYXNwZWN0Q2xhc3M6IE5ld2FibGU8dW5rbm93bj47XG4gICAgbWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sO1xuICAgIHBvaW50Y3V0OiBQb2ludGN1dDtcbiAgICBhZHZpY2U6IEFkdmljZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBc3BlY3RNZXRhZGF0YVJlYWRlciBleHRlbmRzIE1ldGFkYXRhUmVhZGVyIHtcbiAgICBnZXRBc3BlY3RzKGpwSWRlbnRpZmllcjogSWRlbnRpZmllciwganBNZW1iZXI6IHN0cmluZyB8IHN5bWJvbCk6IEFzcGVjdEluZm9bXTtcbn1cblxuZXhwb3J0IGNsYXNzIEFzcGVjdE1ldGFkYXRhIGltcGxlbWVudHMgTWV0YWRhdGE8QXNwZWN0TWV0YWRhdGFSZWFkZXIsIHZvaWQ+IHtcbiAgICBwcml2YXRlIHN0YXRpYyBJTlNUQU5DRSA9IG5ldyBBc3BlY3RNZXRhZGF0YSgpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgYXNwZWN0czogQXNwZWN0SW5mb1tdID0gW107XG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICAgICAgcmV0dXJuIEFzcGVjdE1ldGFkYXRhLklOU1RBTkNFO1xuICAgIH1cbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvL1xuICAgIH1cbiAgICBpbml0KCk6IHZvaWQge1xuICAgICAgICAvL1xuICAgIH1cbiAgICBhcHBlbmQoY29tcG9uZW50QXNwZWN0Q2xhc3M6IE5ld2FibGU8dW5rbm93bj4sIG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCwgYWR2aWNlOiBBZHZpY2UsIHBvaW50Y3V0OiBQb2ludGN1dCkge1xuICAgICAgICBjb25zdCBBc3BlY3RDbGFzcyA9IENvbXBvbmVudE1ldGhvZEFzcGVjdC5jcmVhdGUoY29tcG9uZW50QXNwZWN0Q2xhc3MsIG1ldGhvZE5hbWUpO1xuICAgICAgICB0aGlzLmFzcGVjdHMucHVzaCh7XG4gICAgICAgICAgICBhc3BlY3RDbGFzczogQXNwZWN0Q2xhc3MsXG4gICAgICAgICAgICBtZXRob2ROYW1lLFxuICAgICAgICAgICAgcG9pbnRjdXQsXG4gICAgICAgICAgICBhZHZpY2VcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlYWRlcigpOiBBc3BlY3RNZXRhZGF0YVJlYWRlciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXRBc3BlY3RzOiAoanBJZGVudGlmaWVyLCBqcE1lbWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzcGVjdHMuZmlsdGVyKCh7IHBvaW50Y3V0IH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBvaW50Y3V0LnRlc3QoanBJZGVudGlmaWVyLCBqcE1lbWJlcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL3R5cGVzL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcic7XG5pbXBvcnQgdHlwZSB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4uL2ZvdW5kYXRpb24vQXBwbGljYXRpb25Db250ZXh0JztcbmltcG9ydCB7IGNyZWF0ZUFzcGVjdCB9IGZyb20gJy4vY3JlYXRlQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEFzcGVjdE1ldGFkYXRhIH0gZnJvbSAnLi9Bc3BlY3RNZXRhZHRhJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3NvciBpbXBsZW1lbnRzIFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3Ige1xuICAgIHN0YXRpYyBjcmVhdGUoYXBwQ3R4OiBBcHBsaWNhdGlvbkNvbnRleHQpOiBOZXdhYmxlPEFPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcj4ge1xuICAgICAgICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBBT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3Ige1xuICAgICAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGFwcEN0eDogQXBwbGljYXRpb25Db250ZXh0ID0gYXBwQ3R4O1xuICAgICAgICB9O1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgcmVhZG9ubHkgYXBwQ3R4OiBBcHBsaWNhdGlvbkNvbnRleHQ7XG4gICAgYWZ0ZXJJbnN0YW50aWF0aW9uPFQgZXh0ZW5kcyBvYmplY3Q+KGluc3RhbmNlOiBUKTogVCB7XG4gICAgICAgIGlmICghaW5zdGFuY2UgfHwgdHlwZW9mIGluc3RhbmNlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNsYXp6ID0gaW5zdGFuY2UuY29uc3RydWN0b3I7XG5cbiAgICAgICAgY29uc3QgYXNwZWN0TWV0YWRhdGEgPSBBc3BlY3RNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlYWRlcigpO1xuICAgICAgICAvLyBjb25zdCB1c2VBc3BlY3RNZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGNsYXp6LCBBT1BDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgLy8gY29uc3QgdXNlQXNwZWN0TWV0YWRhdGFSZWFkZXIgPSB1c2VBc3BlY3RNZXRhZGF0YS5yZWFkZXIoKTtcbiAgICAgICAgLy8gY29uc3QgdXNlQXNwZWN0c01hcCA9IHVzZUFzcGVjdE1ldGFkYXRhUmVhZGVyLmdldEFzcGVjdHMoKTtcbiAgICAgICAgLy8gaWYgKHVzZUFzcGVjdHNNYXAuc2l6ZSA9PT0gMCkge1xuICAgICAgICAvLyAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgY29uc3QgYXNwZWN0U3RvcmVNYXAgPSBuZXcgV2Vha01hcDxvYmplY3QsIE1hcDxzdHJpbmcgfCBzeW1ib2wsIEZ1bmN0aW9uPj4oKTtcbiAgICAgICAgYXNwZWN0U3RvcmVNYXAuc2V0KGluc3RhbmNlLCBuZXcgTWFwPHN0cmluZyB8IHN5bWJvbCwgRnVuY3Rpb24+KCkpO1xuXG4gICAgICAgIGNvbnN0IHByb3h5UmVzdWx0ID0gbmV3IFByb3h5KGluc3RhbmNlLCB7XG4gICAgICAgICAgICBnZXQ6ICh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luVmFsdWUgPSBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnY29uc3RydWN0b3InOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpblZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoUmVmbGVjdC5oYXModGFyZ2V0LCBwcm9wKSAmJiB0eXBlb2Ygb3JpZ2luVmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXNwZWN0TWFwID0gYXNwZWN0U3RvcmVNYXAuZ2V0KGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhc3BlY3RNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5WYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoYXNwZWN0TWFwLmhhcyhwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFzcGVjdE1hcC5nZXQocHJvcCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXNwZWN0c09mTWV0aG9kID0gYXNwZWN0TWV0YWRhdGEuZ2V0QXNwZWN0cyhjbGF6eiBhcyBJZGVudGlmaWVyLCBwcm9wKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXNwZWN0Rm4gPSBjcmVhdGVBc3BlY3QodGhpcy5hcHBDdHgsIHRhcmdldCwgcHJvcCwgb3JpZ2luVmFsdWUsIGFzcGVjdHNPZk1ldGhvZCk7XG4gICAgICAgICAgICAgICAgICAgIGFzcGVjdE1hcC5zZXQocHJvcCwgYXNwZWN0Rm4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXNwZWN0Rm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5WYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm94eVJlc3VsdDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3IsIFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3IgfSBmcm9tICcuLi90eXBlcy9JbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3InO1xuaW1wb3J0IHsgbGF6eU1lbWJlciB9IGZyb20gJ0B2Z2VyYm90L2xhenknO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHsgSW5zdGFuY2UgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZSc7XG5pbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0dsb2JhbE1ldGFkYXRhJztcblxuZXhwb3J0IGNsYXNzIEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXIge1xuICAgIHByaXZhdGUgaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlczogU2V0PE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4+ID0gbmV3IFNldCgpO1xuICAgIEBsYXp5TWVtYmVyPEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXIsIGtleW9mIEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXIsIFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3JbXT4oe1xuICAgICAgICBldmFsdWF0ZTogaW5zdGFuY2UgPT4ge1xuICAgICAgICAgICAgY29uc3QgZ2xvYmFsSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcyA9IEdsb2JhbE1ldGFkYXRhLmdldFJlYWRlcigpLmdldEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoKTtcbiAgICAgICAgICAgIGNvbnN0IGluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMgPSBnbG9iYWxJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLmNvbmNhdChcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKGluc3RhbmNlLmluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMubWFwKGl0ID0+IGluc3RhbmNlLmNvbnRhaW5lci5nZXRJbnN0YW5jZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yLCB2b2lkPihpdCkpO1xuICAgICAgICB9LFxuICAgICAgICByZXNldEJ5OiBbXG4gICAgICAgICAgICBpbnN0YW5jZSA9PiBpbnN0YW5jZS5pbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLnNpemUsXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2xvYmFsSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcyA9IEdsb2JhbE1ldGFkYXRhLmdldFJlYWRlcigpLmdldEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2xvYmFsSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3Nlcy5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9KVxuICAgIHByaXZhdGUgaW5zdEF3YXJlUHJvY2Vzc29ySW5zdGFuY2VzITogQXJyYXk8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj47XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGNvbnRhaW5lcjogQXBwbGljYXRpb25Db250ZXh0KSB7fVxuICAgIGFwcGVuZEluc3RBd2FyZVByb2Nlc3NvckNsYXNzKGluc3RBd2FyZVByb2Nlc3NvckNsYXNzOiBOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+KSB7XG4gICAgICAgIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3Nlcy5hZGQoaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MpO1xuICAgIH1cbiAgICBhcHBlbmRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKFxuICAgICAgICBpbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzOiBTZXQ8TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPj4gfCBBcnJheTxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+PlxuICAgICkge1xuICAgICAgICBpbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLmZvckVhY2goaXQgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLmFkZChpdCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBiZWZvcmVJbnN0YW50aWF0aW9uPFQ+KGNvbXBvbmVudENsYXNzOiBOZXdhYmxlPFQ+LCBhcmdzOiB1bmtub3duW10pIHtcbiAgICAgICAgY29uc3QgaW5zdEF3YXJlUHJvY2Vzc29ycyA9IHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29ySW5zdGFuY2VzO1xuICAgICAgICBsZXQgaW5zdGFuY2U6IHVuZGVmaW5lZCB8IEluc3RhbmNlPFQ+O1xuICAgICAgICBpbnN0QXdhcmVQcm9jZXNzb3JzLnNvbWUocHJvY2Vzc29yID0+IHtcbiAgICAgICAgICAgIGlmICghcHJvY2Vzc29yLmJlZm9yZUluc3RhbnRpYXRpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbnN0YW5jZSA9IHByb2Nlc3Nvci5iZWZvcmVJbnN0YW50aWF0aW9uPFQ+KGNvbXBvbmVudENsYXNzLCBhcmdzKSBhcyBJbnN0YW5jZTxUPjtcbiAgICAgICAgICAgIHJldHVybiAhIWluc3RhbmNlO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH1cbiAgICBhZnRlckluc3RhbnRpYXRpb248VD4oaW5zdGFuY2U6IEluc3RhbmNlPFQ+KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvckluc3RhbmNlcy5yZWR1Y2UoKGluc3RhbmNlLCBwcm9jZXNzb3IpID0+IHtcbiAgICAgICAgICAgIGlmIChwcm9jZXNzb3IuYWZ0ZXJJbnN0YW50aWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gcHJvY2Vzc29yLmFmdGVySW5zdGFudGlhdGlvbihpbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgaWYgKCEhcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgYXMgSW5zdGFuY2U8VD47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9LCBpbnN0YW5jZSk7XG4gICAgfVxuICAgIGlzSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoY2xzOiBOZXdhYmxlPHVua25vd24+KSB7XG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSB0aGlzLmdldEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoKTtcbiAgICAgICAgcmV0dXJuIGNsYXNzZXMuaW5kZXhPZihjbHMgYXMgTmV3YWJsZTxJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3I+KSA+IC0xO1xuICAgIH1cbiAgICBnZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKCkge1xuICAgICAgICBjb25zdCBnbG9iYWxJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzID0gR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWFkZXIoKS5nZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKCk7XG4gICAgICAgIHJldHVybiBnbG9iYWxJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLmNvbmNhdChBcnJheS5mcm9tKHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcykpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuL0luc3RhbmNlU2NvcGUnO1xuaW1wb3J0IHsgSW5zdGFuY2VSZXNvbHV0aW9uIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IFNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi4vdHlwZXMvU2VydmljZUZhY3RvcnknO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBFdmVudExpc3RlbmVyIH0gZnJvbSAnLi9FdmVudEVtaXR0ZXInO1xuaW1wb3J0IHsgQW55RnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcy9BbnlGdW5jdGlvbic7XG5pbXBvcnQgeyBoYXNBcmdzLCBoYXNJbmplY3Rpb25zLCBJbnZva2VGdW5jdGlvbk9wdGlvbnMgfSBmcm9tICcuL0ludm9rZUZ1bmN0aW9uT3B0aW9ucyc7XG5pbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0dsb2JhbE1ldGFkYXRhJztcbmltcG9ydCB7IEZhY3RvcnlJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvRmFjdG9yeUlkZW50aWZpZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSwgQ2xhc3NNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyIH0gZnJvbSAnLi9Db21wb25lbnRJbnN0YW5jZUJ1aWxkZXInO1xuaW1wb3J0IHsgRnVuY3Rpb25NZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0Z1bmN0aW9uTWV0YWRhdGEnO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0T3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzL0FwcGxpY2F0aW9uQ29udGV4dE9wdGlvbnMnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBTaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24gfSBmcm9tICcuLi9yZXNvbHV0aW9uL1NpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbic7XG5pbXBvcnQgeyBHbG9iYWxTaGFyZWRJbnN0YW5jZVJlc29sdXRpb24gfSBmcm9tICcuLi9yZXNvbHV0aW9uL0dsb2JhbFNoYXJlZEluc3RhbmNlUmVzb2x1dGlvbic7XG5pbXBvcnQgeyBUcmFuc2llbnRJbnN0YW5jZVJlc29sdXRpb24gfSBmcm9tICcuLi9yZXNvbHV0aW9uL1RyYW5zaWVudEluc3RhbmNlUmVzb2x1dGlvbic7XG5pbXBvcnQgeyBFdmFsdWF0aW9uT3B0aW9ucywgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuaW1wb3J0IHsgSlNPTkRhdGEgfSBmcm9tICcuLi90eXBlcy9KU09ORGF0YSc7XG5pbXBvcnQgeyBFdmFsdWF0b3IgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0b3InO1xuaW1wb3J0IHsgSlNPTkRhdGFFdmFsdWF0b3IgfSBmcm9tICcuLi9ldmFsdWF0b3IvSlNPTkRhdGFFdmFsdWF0b3InO1xuaW1wb3J0IHsgRW52aXJvbm1lbnRFdmFsdWF0b3IgfSBmcm9tICcuLi9ldmFsdWF0b3IvRW52aXJvbm1lbnRFdmFsdWF0b3InO1xuaW1wb3J0IHsgQXJndkV2YWx1YXRvciB9IGZyb20gJy4uL2V2YWx1YXRvci9Bcmd2RXZhbHVhdG9yJztcbmltcG9ydCB7IGlzTm9kZUpzIH0gZnJvbSAnLi4vY29tbW9uL2lzTm9kZUpzJztcbmltcG9ydCB7IFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3IgfSBmcm9tICcuLi90eXBlcy9JbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3InO1xuaW1wb3J0IHsgQU9QSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yIH0gZnJvbSAnLi4vYW9wL0FPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcic7XG5pbXBvcnQgeyBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyIH0gZnJvbSAnLi9JbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyJztcbmltcG9ydCB7IExpZmVjeWNsZU1hbmFnZXIgfSBmcm9tICcuL0xpZmVjeWNsZU1hbmFnZXInO1xuaW1wb3J0IHsgSW5zdGFuY2UgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZSc7XG5pbXBvcnQgeyBGYWN0b3J5UmVjb3JkZXIgfSBmcm9tICcuLi9jb21tb24vRmFjdG9yeVJlY29yZGVyJztcblxuY29uc3QgUFJFX0RFU1RST1lfRVZFTlRfS0VZID0gJ2NvbnRhaW5lcjpldmVudDpwcmUtZGVzdHJveSc7XG5cbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbkNvbnRleHQge1xuICAgIHByaXZhdGUgcmVzb2x1dGlvbnMgPSBuZXcgTWFwPEluc3RhbmNlU2NvcGUgfCBzdHJpbmcsIEluc3RhbmNlUmVzb2x1dGlvbj4oKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIHByaXZhdGUgZmFjdG9yaWVzID0gbmV3IEZhY3RvcnlSZWNvcmRlcigpO1xuICAgIHByaXZhdGUgZXZhbHVhdG9yQ2xhc3NlcyA9IG5ldyBNYXA8c3RyaW5nLCBOZXdhYmxlPEV2YWx1YXRvcj4+KCk7XG4gICAgcHJpdmF0ZSBldmVudEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBkZWZhdWx0U2NvcGU6IEluc3RhbmNlU2NvcGU7XG4gICAgcHJpdmF0ZSByZWFkb25seSBsYXp5TW9kZTogYm9vbGVhbjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXI6IEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXI7XG4gICAgcHJpdmF0ZSBpc0Rlc3Ryb3llZCA9IGZhbHNlO1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihvcHRpb25zOiBBcHBsaWNhdGlvbkNvbnRleHRPcHRpb25zID0ge30pIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0U2NvcGUgPSBvcHRpb25zLmRlZmF1bHRTY29wZSB8fCBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTjtcbiAgICAgICAgdGhpcy5sYXp5TW9kZSA9IG9wdGlvbnMubGF6eU1vZGUgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBvcHRpb25zLmxhenlNb2RlO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySW5zdGFuY2VTY29wZVJlc29sdXRpb24oSW5zdGFuY2VTY29wZS5TSU5HTEVUT04sIFNpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbik7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJJbnN0YW5jZVNjb3BlUmVzb2x1dGlvbihJbnN0YW5jZVNjb3BlLkdMT0JBTF9TSEFSRURfU0lOR0xFVE9OLCBHbG9iYWxTaGFyZWRJbnN0YW5jZVJlc29sdXRpb24pO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySW5zdGFuY2VTY29wZVJlc29sdXRpb24oSW5zdGFuY2VTY29wZS5UUkFOU0lFTlQsIFRyYW5zaWVudEluc3RhbmNlUmVzb2x1dGlvbik7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmFsdWF0b3IoRXhwcmVzc2lvblR5cGUuSlNPTl9QQVRILCBKU09ORGF0YUV2YWx1YXRvcik7XG4gICAgICAgIGlmIChpc05vZGVKcykge1xuICAgICAgICAgICAgdGhpcy5yZWdpc3RlckV2YWx1YXRvcihFeHByZXNzaW9uVHlwZS5FTlYsIEVudmlyb25tZW50RXZhbHVhdG9yKTtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFdmFsdWF0b3IoRXhwcmVzc2lvblR5cGUuQVJHViwgQXJndkV2YWx1YXRvcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyID0gbmV3IEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXIodGhpcyk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJJbnN0QXdhcmVQcm9jZXNzb3IoQU9QSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yLmNyZWF0ZSh0aGlzKSk7XG4gICAgfVxuICAgIGdldEluc3RhbmNlPFQsIE8+KHN5bWJvbDogTmV3YWJsZTxUPiwgb3duZXI/OiBPKTogVDtcbiAgICBnZXRJbnN0YW5jZTxULCBPPihzeW1ib2w6IElkZW50aWZpZXI8VD4sIG93bmVyPzogTyk6IFQgfCBUW107XG4gICAgZ2V0SW5zdGFuY2U8VCwgTz4oc3ltYm9sOiBJZGVudGlmaWVyPFQ+LCBvd25lcj86IE8pOiBUIHwgVFtdIHtcbiAgICAgICAgaWYgKHN5bWJvbCA9PT0gQXBwbGljYXRpb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcyBhcyB1bmtub3duIGFzIFQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBzeW1ib2wgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBzeW1ib2wgPT09ICdzeW1ib2wnKSB7XG4gICAgICAgICAgICBjb25zdCBmYWN0b3J5RGVmID0gdGhpcy5nZXRGYWN0b3J5KHN5bWJvbCk7XG4gICAgICAgICAgICBpZiAoZmFjdG9yeURlZikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByb2R1Y2VyID0gZmFjdG9yeURlZi5wcm9kdWNlKHRoaXMsIG93bmVyKTtcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gcHJvZHVjZXIoKSBhcyBUIHwgVFtdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnN0ciA9IHJlc3VsdD8uY29uc3RydWN0b3I7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zdHIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29tcG9uZW50Q2xhc3MgPSBjb25zdHIgYXMgTmV3YWJsZTxUPjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzb2x2ZXIgPSBuZXcgTGlmZWN5Y2xlTWFuYWdlcjxUPihjb21wb25lbnRDbGFzcywgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzSW5zdEF3YXJlUHJvY2Vzc29yID0gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyLmlzSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoY29tcG9uZW50Q2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlci5pbnZva2VQcmVJbmplY3RNZXRob2QocmVzdWx0IGFzIEluc3RhbmNlPFQ+KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0luc3RBd2FyZVByb2Nlc3Nvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyLmFmdGVySW5zdGFudGlhdGlvbihyZXN1bHQgYXMgSW5zdGFuY2U8VD4pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVyLmludm9rZVBvc3RJbmplY3RNZXRob2QocmVzdWx0IGFzIEluc3RhbmNlPFQ+KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2xhc3NNZXRhZGF0YSA9IEdsb2JhbE1ldGFkYXRhLmdldEluc3RhbmNlKCkucmVhZGVyKCkuZ2V0Q2xhc3NNZXRhZGF0YTxUPihzeW1ib2wpO1xuICAgICAgICAgICAgICAgIGlmICghY2xhc3NNZXRhZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENsYXNzIGFsaWFzIG5vdCBmb3VuZDogJHtzeW1ib2wudG9TdHJpbmcoKX1gKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzeW1ib2wgPSBjbGFzc01ldGFkYXRhLnJlYWRlcigpLmdldENsYXNzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudENsYXNzID0gc3ltYm9sO1xuICAgICAgICBjb25zdCByZWFkZXIgPSBDbGFzc01ldGFkYXRhLmdldEluc3RhbmNlKGNvbXBvbmVudENsYXNzKS5yZWFkZXIoKTtcbiAgICAgICAgY29uc3Qgc2NvcGUgPSByZWFkZXIuZ2V0U2NvcGUoKTtcbiAgICAgICAgY29uc3QgcmVzb2x1dGlvbiA9ICh0aGlzLnJlc29sdXRpb25zLmdldChzY29wZSkgfHwgdGhpcy5yZXNvbHV0aW9ucy5nZXQodGhpcy5kZWZhdWx0U2NvcGUpKSBhcyBJbnN0YW5jZVJlc29sdXRpb247XG4gICAgICAgIGNvbnN0IGdldEluc3RhbmNlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGlkZW50aWZpZXI6IGNvbXBvbmVudENsYXNzLFxuICAgICAgICAgICAgb3duZXIsXG4gICAgICAgICAgICBvd25lclByb3BlcnR5S2V5OiB1bmRlZmluZWRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHJlc29sdXRpb24uc2hvdWxkR2VuZXJhdGUoZ2V0SW5zdGFuY2VPcHRpb25zKSkge1xuICAgICAgICAgICAgY29uc3QgYnVpbGRlciA9IHRoaXMuY3JlYXRlQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyKGNvbXBvbmVudENsYXNzKTtcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gYnVpbGRlci5idWlsZCgpO1xuICAgICAgICAgICAgY29uc3Qgc2F2ZUluc3RhbmNlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAuLi5nZXRJbnN0YW5jZU9wdGlvbnMsXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXNvbHV0aW9uLnNhdmVJbnN0YW5jZShzYXZlSW5zdGFuY2VPcHRpb25zKTtcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHV0aW9uLmdldEluc3RhbmNlKGdldEluc3RhbmNlT3B0aW9ucykgYXMgVDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyPFQ+KGNvbXBvbmVudENsYXNzOiBOZXdhYmxlPFQ+KSB7XG4gICAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyKGNvbXBvbmVudENsYXNzLCB0aGlzLCB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIpO1xuICAgICAgICBidWlsZGVyLmFwcGVuZExhenlNb2RlKHRoaXMubGF6eU1vZGUpO1xuICAgICAgICByZXR1cm4gYnVpbGRlcjtcbiAgICB9XG5cbiAgICBnZXRGYWN0b3J5KGtleTogRmFjdG9yeUlkZW50aWZpZXIpIHtcbiAgICAgICAgY29uc3QgZmFjdG9yeSA9IEdsb2JhbE1ldGFkYXRhLmdldEluc3RhbmNlKCkucmVhZGVyKCkuZ2V0Q29tcG9uZW50RmFjdG9yeShrZXkpO1xuICAgICAgICBpZiAoIWZhY3RvcnkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZhY3Rvcmllcy5nZXQoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XG4gICAgYmluZEZhY3Rvcnk8VD4oXG4gICAgICAgIHN5bWJvbDogRmFjdG9yeUlkZW50aWZpZXIsXG4gICAgICAgIGZhY3Rvcnk6IFNlcnZpY2VGYWN0b3J5PFQsIHVua25vd24+LFxuICAgICAgICBpbmplY3Rpb25zPzogSWRlbnRpZmllcltdLFxuICAgICAgICBpc1NpbmdsZT86IGJvb2xlYW5cbiAgICApIHtcbiAgICAgICAgdGhpcy5mYWN0b3JpZXMuYXBwZW5kKHN5bWJvbCwgZmFjdG9yeSwgaW5qZWN0aW9ucywgaXNTaW5nbGUpO1xuICAgIH1cbiAgICBpbnZva2U8UiwgQ3R4PihmdW5jOiBBbnlGdW5jdGlvbjxSLCBDdHg+LCBvcHRpb25zOiBJbnZva2VGdW5jdGlvbk9wdGlvbnM8Q3R4PiA9IHt9KTogUiB7XG4gICAgICAgIGxldCBmbjogQW55RnVuY3Rpb248Uj47XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgZm4gPSBmdW5jLmJpbmQob3B0aW9ucy5jb250ZXh0IGFzIFRoaXNQYXJhbWV0ZXJUeXBlPHR5cGVvZiBmdW5jPikgYXMgQW55RnVuY3Rpb248Uj47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmbiA9IGZ1bmMgYXMgQW55RnVuY3Rpb248Uj47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhhc0FyZ3Mob3B0aW9ucykpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmFyZ3MgPyBmbiguLi5vcHRpb25zLmFyZ3MpIDogZm4oKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYXJnc0luZGVudGlmaWVyczogSWRlbnRpZmllcltdID0gW107XG4gICAgICAgIGlmIChoYXNJbmplY3Rpb25zKG9wdGlvbnMpKSB7XG4gICAgICAgICAgICBhcmdzSW5kZW50aWZpZXJzID0gb3B0aW9ucy5pbmplY3Rpb25zO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShmbiwgRnVuY3Rpb25NZXRhZGF0YSkucmVhZGVyKCk7XG4gICAgICAgICAgICBhcmdzSW5kZW50aWZpZXJzID0gbWV0YWRhdGEuZ2V0UGFyYW1ldGVycygpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFyZ3MgPSBhcmdzSW5kZW50aWZpZXJzLm1hcCgoaWRlbnRpZmllciwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRJbnN0YW5jZShpZGVudGlmaWVyKTtcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGluc3RhbmNlKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzQXJyYXlUeXBlID0gKGlkZW50aWZpZXIgYXMgdW5rbm93bikgPT09IEFycmF5O1xuICAgICAgICAgICAgICAgIGlmIChpc0FycmF5VHlwZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpbnN0YW5jZS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTXVsdGlwbGUgbWF0Y2hpbmcgaW5qZWN0YWJsZXMgZm91bmQgZm9yIHBhcmFtZXRlciBhdCAke2luZGV4fS5gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGFyZ3MubGVuZ3RoID4gMCA/IGZuKC4uLmFyZ3MpIDogZm4oKTtcbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNEZXN0cm95ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ldmVudEVtaXR0ZXIuZW1pdChQUkVfREVTVFJPWV9FVkVOVF9LRVkpO1xuICAgICAgICB0aGlzLnJlc29sdXRpb25zLmZvckVhY2goaXQgPT4ge1xuICAgICAgICAgICAgaXQuZGVzdHJveSgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZXZhbHVhdGU8VCwgTywgQT4oZXhwcmVzc2lvbjogc3RyaW5nLCBvcHRpb25zOiBFdmFsdWF0aW9uT3B0aW9uczxPLCBzdHJpbmcsIEE+KTogVCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IGV2YWx1YXRvckNsYXNzID0gdGhpcy5ldmFsdWF0b3JDbGFzc2VzLmdldChvcHRpb25zLnR5cGUpO1xuICAgICAgICBpZiAoIWV2YWx1YXRvckNsYXNzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBVbmtub3duIGV2YWx1YXRvciBuYW1lOiAke29wdGlvbnMudHlwZX1gKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBldmFsdWF0b3IgPSB0aGlzLmdldEluc3RhbmNlKGV2YWx1YXRvckNsYXNzKTtcbiAgICAgICAgcmV0dXJuIGV2YWx1YXRvci5ldmFsKHRoaXMsIGV4cHJlc3Npb24sIG9wdGlvbnMuZXh0ZXJuYWxBcmdzKTtcbiAgICB9XG4gICAgcmVjb3JkSlNPTkRhdGEobmFtZXNwYWNlOiBzdHJpbmcsIGRhdGE6IEpTT05EYXRhKSB7XG4gICAgICAgIGNvbnN0IGV2YWx1YXRvciA9IHRoaXMuZ2V0SW5zdGFuY2UoSlNPTkRhdGFFdmFsdWF0b3IpO1xuICAgICAgICBldmFsdWF0b3IucmVjb3JkRGF0YShuYW1lc3BhY2UsIGRhdGEpO1xuICAgIH1cbiAgICBnZXRKU09ORGF0YShuYW1lc3BhY2U6IHN0cmluZykge1xuICAgICAgICBjb25zdCBldmFsdWF0b3IgPSB0aGlzLmdldEluc3RhbmNlKEpTT05EYXRhRXZhbHVhdG9yKTtcbiAgICAgICAgcmV0dXJuIGV2YWx1YXRvci5nZXRKU09ORGF0YShuYW1lc3BhY2UpO1xuICAgIH1cbiAgICBiaW5kSW5zdGFuY2U8VD4oaWRlbnRpZmllcjogc3RyaW5nIHwgc3ltYm9sLCBpbnN0YW5jZTogVCkge1xuICAgICAgICBjb25zdCByZXNvbHV0aW9uID0gdGhpcy5yZXNvbHV0aW9ucy5nZXQoSW5zdGFuY2VTY29wZS5TSU5HTEVUT04pO1xuICAgICAgICByZXNvbHV0aW9uPy5zYXZlSW5zdGFuY2Uoe1xuICAgICAgICAgICAgaWRlbnRpZmllcixcbiAgICAgICAgICAgIGluc3RhbmNlXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZWdpc3Rlckluc3RhbmNlU2NvcGVSZXNvbHV0aW9uPFQgZXh0ZW5kcyBOZXdhYmxlPEluc3RhbmNlUmVzb2x1dGlvbj4+KFxuICAgICAgICBzY29wZTogSW5zdGFuY2VTY29wZSB8IHN0cmluZyxcbiAgICAgICAgcmVzb2x1dGlvbkNvbnN0cnVjdG9yOiBULFxuICAgICAgICBjb25zdHJ1Y3RvckFyZ3M/OiBDb25zdHJ1Y3RvclBhcmFtZXRlcnM8VD5cbiAgICApIHtcbiAgICAgICAgdGhpcy5yZXNvbHV0aW9ucy5zZXQoc2NvcGUsIG5ldyByZXNvbHV0aW9uQ29uc3RydWN0b3IoLi4uKGNvbnN0cnVjdG9yQXJncyB8fCBbXSkpKTtcbiAgICB9XG4gICAgcmVnaXN0ZXJFdmFsdWF0b3IobmFtZTogc3RyaW5nLCBldmFsdWF0b3JDbGFzczogTmV3YWJsZTxFdmFsdWF0b3I+KSB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoZXZhbHVhdG9yQ2xhc3MsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBtZXRhZGF0YS5zZXRTY29wZShJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTik7XG4gICAgICAgIHRoaXMuZXZhbHVhdG9yQ2xhc3Nlcy5zZXQobmFtZSwgZXZhbHVhdG9yQ2xhc3MpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gUmVnaXN0ZXJzIGFuIEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3NvciBjbGFzcyB0byBjdXN0b21pemVcbiAgICAgKiAgICAgIHRoZSBpbnN0YW50aWF0aW9uIHByb2Nlc3MgYXQgdmFyaW91cyBzdGFnZXMgd2l0aGluIHRoZSBJb0NcbiAgICAgKiBAZGVwcmVjYXRlZCBSZXBsYWNlZCB3aXRoIHtAbGluayByZWdpc3RlckJlZm9yZUluc3RhbnRpYXRpb25Qcm9jZXNzb3J9IGFuZCB7QGxpbmsgcmVnaXN0ZXJBZnRlckluc3RhbnRpYXRpb25Qcm9jZXNzb3J9XG4gICAgICogQHBhcmFtIHtOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+fSBjbGF6elxuICAgICAqIEBzZWUgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yXG4gICAgICogQHNpbmNlIDEuMC4wXG4gICAgICovXG4gICAgcmVnaXN0ZXJJbnN0QXdhcmVQcm9jZXNzb3IoY2xheno6IE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4pIHtcbiAgICAgICAgdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyLmFwcGVuZEluc3RBd2FyZVByb2Nlc3NvckNsYXNzKGNsYXp6KTtcbiAgICB9XG4gICAgcmVnaXN0ZXJCZWZvcmVJbnN0YW50aWF0aW9uUHJvY2Vzc29yKHByb2Nlc3NvcjogPFQ+KGNvbnN0cnVjdG9yOiBOZXdhYmxlPFQ+LCBhcmdzOiB1bmtub3duW10pID0+IFQgfCB1bmRlZmluZWQgfCB2b2lkKSB7XG4gICAgICAgIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5hcHBlbmRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyhcbiAgICAgICAgICAgIGNsYXNzIElubmVyUHJvY2Vzc29yIGltcGxlbWVudHMgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB7XG4gICAgICAgICAgICAgICAgYmVmb3JlSW5zdGFudGlhdGlvbjxUPihjb25zdHJ1Y3RvcjogTmV3YWJsZTxUPiwgYXJnczogdW5rbm93bltdKTogdm9pZCB8IFQgfCB1bmRlZmluZWQge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvY2Vzc29yKGNvbnN0cnVjdG9yLCBhcmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuICAgIHJlZ2lzdGVyQWZ0ZXJJbnN0YW50aWF0aW9uUHJvY2Vzc29yKHByb2Nlc3NvcjogPFQgZXh0ZW5kcyBvYmplY3Q+KGluc3RhbmNlOiBUKSA9PiBUKSB7XG4gICAgICAgIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5hcHBlbmRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyhcbiAgICAgICAgICAgIGNsYXNzIElubmVyUHJvY2Vzc29yIGltcGxlbWVudHMgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB7XG4gICAgICAgICAgICAgICAgYWZ0ZXJJbnN0YW50aWF0aW9uPFQgZXh0ZW5kcyBvYmplY3Q+KGluc3RhbmNlOiBUKTogVCB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9jZXNzb3IoaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG4gICAgb25QcmVEZXN0cm95KGxpc3RlbmVyOiBFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50RW1pdHRlci5vbihQUkVfREVTVFJPWV9FVkVOVF9LRVksIGxpc3RlbmVyKTtcbiAgICB9XG4gICAgZ2V0Q2xhc3NNZXRhZGF0YTxUPihjdG9yOiBOZXdhYmxlPFQ+KSB7XG4gICAgICAgIHJldHVybiBDbGFzc01ldGFkYXRhLmdldFJlYWRlcihjdG9yKSBhcyBDbGFzc01ldGFkYXRhUmVhZGVyPFQ+O1xuICAgIH1cbiAgICBkZXN0cm95VHJhbnNpZW50SW5zdGFuY2U8VD4oaW5zdGFuY2U6IFQpIHtcbiAgICAgICAgY29uc3QgcmVzb2x1dGlvbiA9IHRoaXMucmVzb2x1dGlvbnMuZ2V0KEluc3RhbmNlU2NvcGUuVFJBTlNJRU5UKTtcbiAgICAgICAgcmVzb2x1dGlvbj8uZGVzdHJveVRoYXQgJiYgcmVzb2x1dGlvbi5kZXN0cm95VGhhdChpbnN0YW5jZSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTWV0YWRhdGEsIE1ldGFkYXRhUmVhZGVyIH0gZnJvbSAnLi4vdHlwZXMvTWV0YWRhdGEnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQXNwZWN0IH0gZnJvbSAnLi9Bc3BlY3QnO1xuaW1wb3J0IHsgY3JlYXRlRGVmYXVsdFZhbHVlTWFwLCBEZWZhdWx0VmFsdWVNYXAgfSBmcm9tICcuLi9jb21tb24vRGVmYXVsdFZhbHVlTWFwJztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4vQWR2aWNlJztcblxuZXhwb3J0IHR5cGUgVXNlQXNwZWN0TWFwID0gRGVmYXVsdFZhbHVlTWFwPHN0cmluZyB8IHN5bWJvbCwgRGVmYXVsdFZhbHVlTWFwPEFkdmljZSwgQXJyYXk8TmV3YWJsZTxBc3BlY3Q+Pj4+O1xuXG5leHBvcnQgaW50ZXJmYWNlIFVzZUFzcGVjdE1ldGFkYXRhUmVhZGVyIGV4dGVuZHMgTWV0YWRhdGFSZWFkZXIge1xuICAgIGdldEFzcGVjdHMoKTogVXNlQXNwZWN0TWFwO1xuICAgIGdldEFzcGVjdHNPZihtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2wsIGFkdmljZTogQWR2aWNlKTogQXJyYXk8TmV3YWJsZTxBc3BlY3Q+Pjtcbn1cbmV4cG9ydCBjbGFzcyBBT1BDbGFzc01ldGFkYXRhIGltcGxlbWVudHMgTWV0YWRhdGE8VXNlQXNwZWN0TWV0YWRhdGFSZWFkZXIsIE5ld2FibGU8dW5rbm93bj4+IHtcbiAgICBzdGF0aWMgZ2V0UmVmbGVjdEtleSgpIHtcbiAgICAgICAgcmV0dXJuICdhb3A6dXNlLWFzcGVjdC1tZXRhZGF0YSc7XG4gICAgfVxuICAgIHByaXZhdGUgYXNwZWN0TWFwOiBVc2VBc3BlY3RNYXAgPSBjcmVhdGVEZWZhdWx0VmFsdWVNYXAoKCkgPT4gY3JlYXRlRGVmYXVsdFZhbHVlTWFwKCgpID0+IFtdKSk7XG4gICAgaW5pdCgpOiB2b2lkIHtcbiAgICAgICAgLy8gSUdOT1JFXG4gICAgfVxuXG4gICAgYXBwZW5kKG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCwgYWR2aWNlOiBBZHZpY2UsIGFzcGVjdHM6IEFycmF5PE5ld2FibGU8QXNwZWN0Pj4pIHtcbiAgICAgICAgY29uc3QgYWR2aWNlQXNwZWN0TWFwID0gdGhpcy5hc3BlY3RNYXAuZ2V0KG1ldGhvZE5hbWUpO1xuICAgICAgICBjb25zdCBleGl0aW5nQXNwZWN0QXJyYXkgPSBhZHZpY2VBc3BlY3RNYXAuZ2V0KGFkdmljZSk7XG4gICAgICAgIGV4aXRpbmdBc3BlY3RBcnJheS5wdXNoKC4uLmFzcGVjdHMpO1xuICAgIH1cblxuICAgIHJlYWRlcigpOiBVc2VBc3BlY3RNZXRhZGF0YVJlYWRlciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXRBc3BlY3RzOiAoKTogVXNlQXNwZWN0TWFwID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3BlY3RNYXA7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0QXNwZWN0c09mOiAobWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sLCBhZHZpY2U6IEFkdmljZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzcGVjdE1hcC5nZXQobWV0aG9kTmFtZSkuZ2V0KGFkdmljZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuXG5mdW5jdGlvbiBnZXRNZXRob2REZXNjcmlwdG9ycyhwcm90b3R5cGU6IG9iamVjdCk6IFJlY29yZDxzdHJpbmcsIFByb3BlcnR5RGVzY3JpcHRvcj4ge1xuICAgIGlmIChcbiAgICAgICAgdHlwZW9mIHByb3RvdHlwZSAhPT0gJ29iamVjdCcgfHxcbiAgICAgICAgcHJvdG90eXBlID09PSBudWxsIHx8XG4gICAgICAgIE9iamVjdC5wcm90b3R5cGUgPT09IHByb3RvdHlwZSB8fFxuICAgICAgICBGdW5jdGlvbi5wcm90b3R5cGUgPT09IHByb3RvdHlwZVxuICAgICkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGNvbnN0IHN1cGVyUHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvdHlwZSk7XG4gICAgY29uc3Qgc3VwZXJEZXNjcmlwdG9ycyA9IHN1cGVyUHJvdG90eXBlID09PSBwcm90b3R5cGUgPyB7fSA6IGdldE1ldGhvZERlc2NyaXB0b3JzKHN1cGVyUHJvdG90eXBlKTtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihzdXBlckRlc2NyaXB0b3JzLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhwcm90b3R5cGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFsbE1ldGhvZE1lbWJlck5hbWVzPFQ+KGNsczogTmV3YWJsZTxUPikge1xuICAgIGNvbnN0IGRlc2NyaXB0b3JzID0gZ2V0TWV0aG9kRGVzY3JpcHRvcnMoY2xzLnByb3RvdHlwZSk7XG4gICAgZGVsZXRlIGRlc2NyaXB0b3JzWydjb25zdHJ1Y3RvciddO1xuICAgIGNvbnN0IG1ldGhvZE5hbWVzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gZGVzY3JpcHRvcnMpIHtcbiAgICAgICAgY29uc3QgbWVtYmVyID0gY2xzLnByb3RvdHlwZVtrZXldO1xuICAgICAgICBpZiAodHlwZW9mIG1lbWJlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbWV0aG9kTmFtZXMuYWRkKGtleSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1ldGhvZE5hbWVzO1xufVxuIiwiaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgZ2V0QWxsTWV0aG9kTWVtYmVyTmFtZXMgfSBmcm9tICcuLi9jb21tb24vZ2V0QWxsTWV0aG9kTWVtYmVyTmFtZXMnO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuXG50eXBlIE1lbWJlcklkZW50aWZpZXIgPSBzdHJpbmcgfCBzeW1ib2w7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQb2ludGN1dCB7XG4gICAgc3RhdGljIGNvbWJpbmUoLi4ucG9pbnRjdXRzOiBQb2ludGN1dFtdKSB7XG4gICAgICAgIHJldHVybiBuZXcgT3JQb2ludGN1dChwb2ludGN1dHMpO1xuICAgIH1cbiAgICBzdGF0aWMgb2Y8VD4oY2xzOiBOZXdhYmxlPFQ+LCAuLi5tZXRob2ROYW1lczogTWVtYmVySWRlbnRpZmllcltdKSB7XG4gICAgICAgIGNvbnN0IGVudHJpZXMgPSBuZXcgTWFwPE5ld2FibGU8dW5rbm93bj4sIFNldDxNZW1iZXJJZGVudGlmaWVyPj4oKTtcbiAgICAgICAgY29uc3QgbWV0aG9kcyA9IG5ldyBTZXQ8TWVtYmVySWRlbnRpZmllcj4obWV0aG9kTmFtZXMgYXMgTWVtYmVySWRlbnRpZmllcltdKTtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGdldEFsbE1ldGhvZE1lbWJlck5hbWVzKGNscykuZm9yRWFjaChtZXRob2ROYW1lID0+IHtcbiAgICAgICAgICAgICAgICBtZXRob2RzLmFkZChtZXRob2ROYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVudHJpZXMuc2V0KGNscywgbWV0aG9kcyk7XG4gICAgICAgIHJldHVybiBuZXcgUHJlY2l0ZVBvaW50Y3V0KGVudHJpZXMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAqL1xuICAgIHN0YXRpYyB0ZXN0TWF0Y2g8VD4oY2xzOiBOZXdhYmxlPFQ+LCByZWdleDogUmVnRXhwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hdGNoKGNscywgcmVnZXgpO1xuICAgIH1cbiAgICBzdGF0aWMgbWF0Y2g8VD4oY2xzOiBOZXdhYmxlPFQ+LCByZWdleDogUmVnRXhwKSB7XG4gICAgICAgIHJldHVybiBuZXcgTWVtYmVyTWF0Y2hQb2ludGN1dChjbHMsIHJlZ2V4KTtcbiAgICB9XG4gICAgc3RhdGljIGZyb20oLi4uY2xhc3NlczogQXJyYXk8TmV3YWJsZTx1bmtub3duPj4pIHtcbiAgICAgICAgY29uc3Qgb2YgPSAoLi4ubWV0aG9kTmFtZXM6IE1lbWJlcklkZW50aWZpZXJbXSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBPclBvaW50Y3V0KGNsYXNzZXMubWFwKGNscyA9PiBQb2ludGN1dC5vZihjbHMsIC4uLm1ldGhvZE5hbWVzKSkpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBtYXRjaCA9IChyZWdleDogUmVnRXhwKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE9yUG9pbnRjdXQoXG4gICAgICAgICAgICAgICAgY2xhc3Nlcy5tYXAoY2xzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBNZW1iZXJNYXRjaFBvaW50Y3V0KGNscywgcmVnZXgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgb2YsXG4gICAgICAgICAgICBtYXRjaCxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQGRlcHJlY2F0ZWRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGVzdE1hdGNoOiBtYXRjaFxuICAgICAgICB9O1xuICAgIH1cbiAgICBzdGF0aWMgbWFya2VkKHR5cGU6IHN0cmluZyB8IHN5bWJvbCwgdmFsdWU6IHVua25vd24gPSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBuZXcgTWFya2VkUG9pbnRjdXQodHlwZSwgdmFsdWUpO1xuICAgIH1cbiAgICBzdGF0aWMgY2xhc3M8VD4oY2xzOiBOZXdhYmxlPFQ+KSB7XG4gICAgICAgIHJldHVybiBuZXcgQ2xhc3NQb2ludGN1dChjbHMpO1xuICAgIH1cbiAgICBhYnN0cmFjdCB0ZXN0KGpwSWRlbnRpZmllcjogSWRlbnRpZmllciwganBNZW1iZXI6IHN0cmluZyB8IHN5bWJvbCk6IGJvb2xlYW47XG59XG5cbmNsYXNzIE9yUG9pbnRjdXQgZXh0ZW5kcyBQb2ludGN1dCB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwb2ludGN1dHM6IFBvaW50Y3V0W10pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgdGVzdChqcElkZW50aWZpZXI6IElkZW50aWZpZXIsIGpwTWVtYmVyOiBzdHJpbmcgfCBzeW1ib2wpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9pbnRjdXRzLnNvbWUoaXQgPT4gaXQudGVzdChqcElkZW50aWZpZXIsIGpwTWVtYmVyKSk7XG4gICAgfVxufVxuXG5jbGFzcyBQcmVjaXRlUG9pbnRjdXQgZXh0ZW5kcyBQb2ludGN1dCB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBtZXRob2RFbnRyaWVzOiBNYXA8SWRlbnRpZmllciwgU2V0PE1lbWJlcklkZW50aWZpZXI+Pikge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICB0ZXN0KGpwSWRlbnRpZmllcjogSWRlbnRpZmllciwganBNZW1iZXI6IHN0cmluZyB8IHN5bWJvbCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBtZW1iZXJzID0gdGhpcy5tZXRob2RFbnRyaWVzLmdldChqcElkZW50aWZpZXIpO1xuICAgICAgICByZXR1cm4gISFtZW1iZXJzICYmIG1lbWJlcnMuaGFzKGpwTWVtYmVyKTtcbiAgICB9XG59XG5jbGFzcyBNYXJrZWRQb2ludGN1dCBleHRlbmRzIFBvaW50Y3V0IHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1hcmtlZFR5cGU6IHN0cmluZyB8IHN5bWJvbCwgcHJpdmF0ZSBtYXJrZWRWYWx1ZTogdW5rbm93biA9IHRydWUpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgdGVzdChqcElkZW50aWZpZXI6IElkZW50aWZpZXIsIGpwTWVtYmVyOiBzdHJpbmcgfCBzeW1ib2wpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHR5cGVvZiBqcElkZW50aWZpZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGpwSWRlbnRpZmllciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgIGNvbnN0IG1hcmtJbmZvID0gbWV0YWRhdGEucmVhZGVyKCkuZ2V0TWVtYmVyc01hcmtJbmZvKGpwTWVtYmVyKTtcbiAgICAgICAgcmV0dXJuIG1hcmtJbmZvW3RoaXMubWFya2VkVHlwZV0gPT09IHRoaXMubWFya2VkVmFsdWU7XG4gICAgfVxufVxuY2xhc3MgTWVtYmVyTWF0Y2hQb2ludGN1dCBleHRlbmRzIFBvaW50Y3V0IHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNsYXp6OiBOZXdhYmxlPHVua25vd24+LCBwcml2YXRlIHJlZ2V4OiBSZWdFeHApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgdGVzdChqcElkZW50aWZpZXI6IElkZW50aWZpZXIsIGpwTWVtYmVyOiBzdHJpbmcgfCBzeW1ib2wpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGpwSWRlbnRpZmllciA9PT0gdGhpcy5jbGF6eiAmJiB0eXBlb2YganBNZW1iZXIgPT09ICdzdHJpbmcnICYmICEhdGhpcy5yZWdleC50ZXN0KGpwTWVtYmVyKTtcbiAgICB9XG59XG5jbGFzcyBDbGFzc1BvaW50Y3V0IGV4dGVuZHMgUG9pbnRjdXQge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY2xheno6IE5ld2FibGU8dW5rbm93bj4pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgdGVzdChqcElkZW50aWZpZXI6IElkZW50aWZpZXIpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGpwSWRlbnRpZmllciA9PT0gdGhpcy5jbGF6ejtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBQb2ludGN1dCB9IGZyb20gJy4vUG9pbnRjdXQnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi9BZHZpY2UnO1xuaW1wb3J0IHsgQXNwZWN0TWV0YWRhdGEgfSBmcm9tICcuL0FzcGVjdE1ldGFkdGEnO1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkQXNwZWN0KFxuICAgIGNvbXBvbmVudEFzcGVjdENsYXNzOiBOZXdhYmxlPHVua25vd24+LFxuICAgIG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCxcbiAgICBhZHZpY2U6IEFkdmljZSxcbiAgICBwb2ludGN1dDogUG9pbnRjdXRcbikge1xuICAgIEFzcGVjdE1ldGFkYXRhLmdldEluc3RhbmNlKCkuYXBwZW5kKGNvbXBvbmVudEFzcGVjdENsYXNzLCBtZXRob2ROYW1lLCBhZHZpY2UsIHBvaW50Y3V0KTtcbiAgICAvLyBjb25zdCBBc3BlY3RDbGFzcyA9IENvbXBvbmVudE1ldGhvZEFzcGVjdC5jcmVhdGUoY29tcG9uZW50QXNwZWN0Q2xhc3MsIG1ldGhvZE5hbWUpO1xuICAgIC8vIHBvaW50Y3V0LmdldE1ldGhvZHNNYXAoKS5mb3JFYWNoKChqcE1lbWJlcnMsIGpwQ2xhc3MpID0+IHtcbiAgICAvLyAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShqcENsYXNzLCBBT1BDbGFzc01ldGFkYXRhKTtcbiAgICAvLyAgICAganBNZW1iZXJzLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgLy8gICAgICAgICBtZXRhZGF0YS5hcHBlbmQobWV0aG9kTmFtZSwgYWR2aWNlLCBbQXNwZWN0Q2xhc3NdKTtcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gfSk7XG59XG4iLCJpbXBvcnQgeyBQb2ludGN1dCB9IGZyb20gJy4uL1BvaW50Y3V0JztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4uL0FkdmljZSc7XG5pbXBvcnQgeyBhZGRBc3BlY3QgfSBmcm9tICcuLi9hZGRBc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uLy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gQWZ0ZXIocG9pbnRjdXQ6IFBvaW50Y3V0KTogTWV0aG9kRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgYWRkQXNwZWN0KHRhcmdldC5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPHVua25vd24+LCBwcm9wZXJ0eUtleSwgQWR2aWNlLkFmdGVyLCBwb2ludGN1dCk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi4vUG9pbnRjdXQnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi4vQWR2aWNlJztcbmltcG9ydCB7IGFkZEFzcGVjdCB9IGZyb20gJy4uL2FkZEFzcGVjdCc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBBZnRlclJldHVybihwb2ludGN1dDogUG9pbnRjdXQpOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICBhZGRBc3BlY3QodGFyZ2V0LmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dW5rbm93bj4sIHByb3BlcnR5S2V5LCBBZHZpY2UuQWZ0ZXJSZXR1cm4sIHBvaW50Y3V0KTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgUG9pbnRjdXQgfSBmcm9tICcuLi9Qb2ludGN1dCc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuLi9BZHZpY2UnO1xuaW1wb3J0IHsgYWRkQXNwZWN0IH0gZnJvbSAnLi4vYWRkQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi8uLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIEFyb3VuZChwb2ludGN1dDogUG9pbnRjdXQpOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICBhZGRBc3BlY3QodGFyZ2V0LmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dW5rbm93bj4sIHByb3BlcnR5S2V5LCBBZHZpY2UuQXJvdW5kLCBwb2ludGN1dCk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi4vUG9pbnRjdXQnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi4vQWR2aWNlJztcbmltcG9ydCB7IGFkZEFzcGVjdCB9IGZyb20gJy4uL2FkZEFzcGVjdCc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBCZWZvcmUocG9pbnRjdXQ6IFBvaW50Y3V0KTogTWV0aG9kRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgYWRkQXNwZWN0KHRhcmdldC5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPHVua25vd24+LCBwcm9wZXJ0eUtleSwgQWR2aWNlLkJlZm9yZSwgcG9pbnRjdXQpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBQb2ludGN1dCB9IGZyb20gJy4uL1BvaW50Y3V0JztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4uL0FkdmljZSc7XG5pbXBvcnQgeyBhZGRBc3BlY3QgfSBmcm9tICcuLi9hZGRBc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uLy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gRmluYWxseShwb2ludGN1dDogUG9pbnRjdXQpOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICBhZGRBc3BlY3QodGFyZ2V0LmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dW5rbm93bj4sIHByb3BlcnR5S2V5LCBBZHZpY2UuRmluYWxseSwgcG9pbnRjdXQpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBQb2ludGN1dCB9IGZyb20gJy4uL1BvaW50Y3V0JztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4uL0FkdmljZSc7XG5pbXBvcnQgeyBhZGRBc3BlY3QgfSBmcm9tICcuLi9hZGRBc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uLy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gVGhyb3duKHBvaW50Y3V0OiBQb2ludGN1dCk6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgIGFkZEFzcGVjdCh0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTx1bmtub3duPiwgcHJvcGVydHlLZXksIEFkdmljZS5UaHJvd24sIHBvaW50Y3V0KTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi4vQWR2aWNlJztcbmltcG9ydCB7IEFzcGVjdCwgUHJvY2VlZGluZ0FzcGVjdCB9IGZyb20gJy4uL0FzcGVjdCc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBhZGRBc3BlY3QgfSBmcm9tICcuLi9hZGRBc3BlY3QnO1xuaW1wb3J0IHsgUG9pbnRjdXQgfSBmcm9tICcuLi9Qb2ludGN1dCc7XG5cbmZ1bmN0aW9uIFVzZUFzcGVjdHMoYWR2aWNlOiBBZHZpY2UuQXJvdW5kLCBhc3BlY3RzOiBBcnJheTxOZXdhYmxlPFByb2NlZWRpbmdBc3BlY3Q+Pik6IE1ldGhvZERlY29yYXRvcjtcbmZ1bmN0aW9uIFVzZUFzcGVjdHMoYWR2aWNlOiBBZHZpY2UsIGFzcGVjdHM6IEFycmF5PE5ld2FibGU8QXNwZWN0Pj4pOiBNZXRob2REZWNvcmF0b3I7XG5mdW5jdGlvbiBVc2VBc3BlY3RzKGFkdmljZTogQWR2aWNlLCBhc3BlY3RzOiBBcnJheTxOZXdhYmxlPEFzcGVjdD4+KTogTWV0aG9kRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgY29uc3QgY2xhenogPSB0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTx0eXBlb2YgdGFyZ2V0PjtcbiAgICAgICAgYXNwZWN0cy5mb3JFYWNoKGFzcGVjdENsYXNzID0+IHtcbiAgICAgICAgICAgIGFkZEFzcGVjdChhc3BlY3RDbGFzcywgJ2V4ZWN1dGUnLCBhZHZpY2UsIFBvaW50Y3V0Lm9mKGNsYXp6LCBwcm9wZXJ0eUtleSkpO1xuICAgICAgICB9KTtcbiAgICB9O1xufVxuXG5leHBvcnQgeyBVc2VBc3BlY3RzIH07XG4iXSwibmFtZXMiOlsiSW5zdGFuY2VTY29wZSIsIkV4cHJlc3Npb25UeXBlIiwiTGlmZWN5Y2xlIiwibGF6eVByb3AiLCJBZHZpY2UiLCJsYXp5TWVtYmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQVlBLCtCQUlYO0FBSkQsQ0FBQSxVQUFZLGFBQWEsRUFBQTtBQUNyQixJQUFBLGFBQUEsQ0FBQSxXQUFBLENBQUEsR0FBQSxvQ0FBZ0QsQ0FBQTtBQUNoRCxJQUFBLGFBQUEsQ0FBQSxXQUFBLENBQUEsR0FBQSwwQkFBc0MsQ0FBQTtBQUN0QyxJQUFBLGFBQUEsQ0FBQSx5QkFBQSxDQUFBLEdBQUEsd0NBQWtFLENBQUE7QUFDdEUsQ0FBQyxFQUpXQSxxQkFBYSxLQUFiQSxx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
