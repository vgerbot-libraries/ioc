var ServiceFactoryDef = /** @class */ (function () {
    function ServiceFactoryDef(factory, injections) {
        this.factory = factory;
        this.injections = injections;
    }
    ServiceFactoryDef.createFromClassMetadata = function (metadata) {
        return new ServiceFactoryDef(function (container, owner) {
            return function () {
                var reader = metadata.reader();
                var clazz = reader.getClass();
                return container.getInstance(clazz, owner);
            };
        });
    };
    return ServiceFactoryDef;
}());

var GlobalMetadata = /** @class */ (function () {
    function GlobalMetadata() {
        this.classAliasMetadataMap = new Map();
        this.componentFactories = new Map();
        this.processorClasses = new Set();
    }
    GlobalMetadata.getInstance = function () {
        return GlobalMetadata.INSTANCE;
    };
    GlobalMetadata.prototype.recordFactory = function (symbol, factory, injections) {
        this.componentFactories.set(symbol, new ServiceFactoryDef(factory, injections));
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

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var Reflect$1;
(function (Reflect) {
    // Metadata Proposal
    // https://rbuckton.github.io/reflect-metadata/
    (function (factory) {
        var root = typeof commonjsGlobal === "object" ? commonjsGlobal :
            typeof self === "object" ? self :
                typeof this === "object" ? this :
                    Function("return this;")();
        var exporter = makeExporter(Reflect);
        if (typeof root.Reflect === "undefined") {
            root.Reflect = Reflect;
        }
        else {
            exporter = makeExporter(root.Reflect, exporter);
        }
        factory(exporter);
        function makeExporter(target, previous) {
            return function (key, value) {
                if (typeof target[key] !== "function") {
                    Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
                }
                if (previous)
                    previous(key, value);
            };
        }
    })(function (exporter) {
        var hasOwn = Object.prototype.hasOwnProperty;
        // feature test for Symbol support
        var supportsSymbol = typeof Symbol === "function";
        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        var HashMap = {
            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
            create: supportsCreate
                ? function () { return MakeDictionary(Object.create(null)); }
                : supportsProto
                    ? function () { return MakeDictionary({ __proto__: null }); }
                    : function () { return MakeDictionary({}); },
            has: downLevel
                ? function (map, key) { return hasOwn.call(map, key); }
                : function (map, key) { return key in map; },
            get: downLevel
                ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
                : function (map, key) { return map[key]; },
        };
        // Load global or shim versions of Map, Set, and WeakMap
        var functionPrototype = Object.getPrototypeOf(Function);
        var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
        var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
        var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
        var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
        // [[Metadata]] internal slot
        // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
        var Metadata = new _WeakMap();
        /**
         * Applies a set of decorators to a property of a target object.
         * @param decorators An array of decorators.
         * @param target The target object.
         * @param propertyKey (Optional) The property key to decorate.
         * @param attributes (Optional) The property descriptor for the target key.
         * @remarks Decorators are applied in reverse order.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Example = Reflect.decorate(decoratorsArray, Example);
         *
         *     // property (on constructor)
         *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Object.defineProperty(Example, "staticMethod",
         *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
         *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
         *
         *     // method (on prototype)
         *     Object.defineProperty(Example.prototype, "method",
         *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
         *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
         *
         */
        function decorate(decorators, target, propertyKey, attributes) {
            if (!IsUndefined(propertyKey)) {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                    throw new TypeError();
                if (IsNull(attributes))
                    attributes = undefined;
                propertyKey = ToPropertyKey(propertyKey);
                return DecorateProperty(decorators, target, propertyKey, attributes);
            }
            else {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsConstructor(target))
                    throw new TypeError();
                return DecorateConstructor(decorators, target);
            }
        }
        exporter("decorate", decorate);
        // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
        // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
        /**
         * A default metadata decorator factory that can be used on a class, class member, or parameter.
         * @param metadataKey The key for the metadata entry.
         * @param metadataValue The value for the metadata entry.
         * @returns A decorator function.
         * @remarks
         * If `metadataKey` is already defined for the target and target key, the
         * metadataValue for that key will be overwritten.
         * @example
         *
         *     // constructor
         *     @Reflect.metadata(key, value)
         *     class Example {
         *     }
         *
         *     // property (on constructor, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticProperty;
         *     }
         *
         *     // property (on prototype, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         property;
         *     }
         *
         *     // method (on constructor)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticMethod() { }
         *     }
         *
         *     // method (on prototype)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         method() { }
         *     }
         *
         */
        function metadata(metadataKey, metadataValue) {
            function decorator(target, propertyKey) {
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                    throw new TypeError();
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
            }
            return decorator;
        }
        exporter("metadata", metadata);
        /**
         * Define a unique metadata entry on the target.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param metadataValue A value that contains attached metadata.
         * @param target The target object on which to define metadata.
         * @param propertyKey (Optional) The property key for the target.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Reflect.defineMetadata("custom:annotation", options, Example);
         *
         *     // property (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
         *
         *     // method (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
         *
         *     // decorator factory as metadata-producing annotation.
         *     function MyAnnotation(options): Decorator {
         *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
         *     }
         *
         */
        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        exporter("defineMetadata", defineMetadata);
        /**
         * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasMetadata", hasMetadata);
        /**
         * Gets a value indicating whether the target object has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasOwnMetadata", hasOwnMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
        }
        exporter("getMetadata", getMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("getOwnMetadata", getOwnMetadata);
        /**
         * Gets the metadata keys defined on the target object or its prototype chain.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "method");
         *
         */
        function getMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryMetadataKeys(target, propertyKey);
        }
        exporter("getMetadataKeys", getMetadataKeys);
        /**
         * Gets the unique metadata keys defined on the target object.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
         *
         */
        function getOwnMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryOwnMetadataKeys(target, propertyKey);
        }
        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
        /**
         * Deletes the metadata entry from the target object with the provided key.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata entry was found and deleted; otherwise, false.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.deleteMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function deleteMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            if (!metadataMap.delete(metadataKey))
                return false;
            if (metadataMap.size > 0)
                return true;
            var targetMetadata = Metadata.get(target);
            targetMetadata.delete(propertyKey);
            if (targetMetadata.size > 0)
                return true;
            Metadata.delete(target);
            return true;
        }
        exporter("deleteMetadata", deleteMetadata);
        function DecorateConstructor(decorators, target) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsConstructor(decorated))
                        throw new TypeError();
                    target = decorated;
                }
            }
            return target;
        }
        function DecorateProperty(decorators, target, propertyKey, descriptor) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target, propertyKey, descriptor);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsObject(decorated))
                        throw new TypeError();
                    descriptor = decorated;
                }
            }
            return descriptor;
        }
        function GetOrCreateMetadataMap(O, P, Create) {
            var targetMetadata = Metadata.get(O);
            if (IsUndefined(targetMetadata)) {
                if (!Create)
                    return undefined;
                targetMetadata = new _Map();
                Metadata.set(O, targetMetadata);
            }
            var metadataMap = targetMetadata.get(P);
            if (IsUndefined(metadataMap)) {
                if (!Create)
                    return undefined;
                metadataMap = new _Map();
                targetMetadata.set(P, metadataMap);
            }
            return metadataMap;
        }
        // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
        function OrdinaryHasMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return true;
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryHasMetadata(MetadataKey, parent, P);
            return false;
        }
        // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            return ToBoolean(metadataMap.has(MetadataKey));
        }
        // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
        function OrdinaryGetMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryGetMetadata(MetadataKey, parent, P);
            return undefined;
        }
        // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return undefined;
            return metadataMap.get(MetadataKey);
        }
        // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
            metadataMap.set(MetadataKey, MetadataValue);
        }
        // 3.1.6.1 OrdinaryMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
        function OrdinaryMetadataKeys(O, P) {
            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (parent === null)
                return ownKeys;
            var parentKeys = OrdinaryMetadataKeys(parent, P);
            if (parentKeys.length <= 0)
                return ownKeys;
            if (ownKeys.length <= 0)
                return parentKeys;
            var set = new _Set();
            var keys = [];
            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
                var key = ownKeys_1[_i];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
                var key = parentKeys_1[_a];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            return keys;
        }
        // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
        function OrdinaryOwnMetadataKeys(O, P) {
            var keys = [];
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return keys;
            var keysObj = metadataMap.keys();
            var iterator = GetIterator(keysObj);
            var k = 0;
            while (true) {
                var next = IteratorStep(iterator);
                if (!next) {
                    keys.length = k;
                    return keys;
                }
                var nextValue = IteratorValue(next);
                try {
                    keys[k] = nextValue;
                }
                catch (e) {
                    try {
                        IteratorClose(iterator);
                    }
                    finally {
                        throw e;
                    }
                }
                k++;
            }
        }
        // 6 ECMAScript Data Typ0es and Values
        // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
        function Type(x) {
            if (x === null)
                return 1 /* Null */;
            switch (typeof x) {
                case "undefined": return 0 /* Undefined */;
                case "boolean": return 2 /* Boolean */;
                case "string": return 3 /* String */;
                case "symbol": return 4 /* Symbol */;
                case "number": return 5 /* Number */;
                case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
                default: return 6 /* Object */;
            }
        }
        // 6.1.1 The Undefined Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
        function IsUndefined(x) {
            return x === undefined;
        }
        // 6.1.2 The Null Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
        function IsNull(x) {
            return x === null;
        }
        // 6.1.5 The Symbol Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
        function IsSymbol(x) {
            return typeof x === "symbol";
        }
        // 6.1.7 The Object Type
        // https://tc39.github.io/ecma262/#sec-object-type
        function IsObject(x) {
            return typeof x === "object" ? x !== null : typeof x === "function";
        }
        // 7.1 Type Conversion
        // https://tc39.github.io/ecma262/#sec-type-conversion
        // 7.1.1 ToPrimitive(input [, PreferredType])
        // https://tc39.github.io/ecma262/#sec-toprimitive
        function ToPrimitive(input, PreferredType) {
            switch (Type(input)) {
                case 0 /* Undefined */: return input;
                case 1 /* Null */: return input;
                case 2 /* Boolean */: return input;
                case 3 /* String */: return input;
                case 4 /* Symbol */: return input;
                case 5 /* Number */: return input;
            }
            var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
            if (exoticToPrim !== undefined) {
                var result = exoticToPrim.call(input, hint);
                if (IsObject(result))
                    throw new TypeError();
                return result;
            }
            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
        }
        // 7.1.1.1 OrdinaryToPrimitive(O, hint)
        // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
        function OrdinaryToPrimitive(O, hint) {
            if (hint === "string") {
                var toString_1 = O.toString;
                if (IsCallable(toString_1)) {
                    var result = toString_1.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            else {
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var toString_2 = O.toString;
                if (IsCallable(toString_2)) {
                    var result = toString_2.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            throw new TypeError();
        }
        // 7.1.2 ToBoolean(argument)
        // https://tc39.github.io/ecma262/2016/#sec-toboolean
        function ToBoolean(argument) {
            return !!argument;
        }
        // 7.1.12 ToString(argument)
        // https://tc39.github.io/ecma262/#sec-tostring
        function ToString(argument) {
            return "" + argument;
        }
        // 7.1.14 ToPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-topropertykey
        function ToPropertyKey(argument) {
            var key = ToPrimitive(argument, 3 /* String */);
            if (IsSymbol(key))
                return key;
            return ToString(key);
        }
        // 7.2 Testing and Comparison Operations
        // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
        // 7.2.2 IsArray(argument)
        // https://tc39.github.io/ecma262/#sec-isarray
        function IsArray(argument) {
            return Array.isArray
                ? Array.isArray(argument)
                : argument instanceof Object
                    ? argument instanceof Array
                    : Object.prototype.toString.call(argument) === "[object Array]";
        }
        // 7.2.3 IsCallable(argument)
        // https://tc39.github.io/ecma262/#sec-iscallable
        function IsCallable(argument) {
            // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
            return typeof argument === "function";
        }
        // 7.2.4 IsConstructor(argument)
        // https://tc39.github.io/ecma262/#sec-isconstructor
        function IsConstructor(argument) {
            // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
            return typeof argument === "function";
        }
        // 7.2.7 IsPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-ispropertykey
        function IsPropertyKey(argument) {
            switch (Type(argument)) {
                case 3 /* String */: return true;
                case 4 /* Symbol */: return true;
                default: return false;
            }
        }
        // 7.3 Operations on Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-objects
        // 7.3.9 GetMethod(V, P)
        // https://tc39.github.io/ecma262/#sec-getmethod
        function GetMethod(V, P) {
            var func = V[P];
            if (func === undefined || func === null)
                return undefined;
            if (!IsCallable(func))
                throw new TypeError();
            return func;
        }
        // 7.4 Operations on Iterator Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
        function GetIterator(obj) {
            var method = GetMethod(obj, iteratorSymbol);
            if (!IsCallable(method))
                throw new TypeError(); // from Call
            var iterator = method.call(obj);
            if (!IsObject(iterator))
                throw new TypeError();
            return iterator;
        }
        // 7.4.4 IteratorValue(iterResult)
        // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
        function IteratorValue(iterResult) {
            return iterResult.value;
        }
        // 7.4.5 IteratorStep(iterator)
        // https://tc39.github.io/ecma262/#sec-iteratorstep
        function IteratorStep(iterator) {
            var result = iterator.next();
            return result.done ? false : result;
        }
        // 7.4.6 IteratorClose(iterator, completion)
        // https://tc39.github.io/ecma262/#sec-iteratorclose
        function IteratorClose(iterator) {
            var f = iterator["return"];
            if (f)
                f.call(iterator);
        }
        // 9.1 Ordinary Object Internal Methods and Internal Slots
        // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
        // 9.1.1.1 OrdinaryGetPrototypeOf(O)
        // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
        function OrdinaryGetPrototypeOf(O) {
            var proto = Object.getPrototypeOf(O);
            if (typeof O !== "function" || O === functionPrototype)
                return proto;
            // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
            // Try to determine the superclass constructor. Compatible implementations
            // must either set __proto__ on a subclass constructor to the superclass constructor,
            // or ensure each class has a valid `constructor` property on its prototype that
            // points back to the constructor.
            // If this is not the same as Function.[[Prototype]], then this is definately inherited.
            // This is the case when in ES6 or when using __proto__ in a compatible browser.
            if (proto !== functionPrototype)
                return proto;
            // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
            var prototype = O.prototype;
            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
            if (prototypeProto == null || prototypeProto === Object.prototype)
                return proto;
            // If the constructor was not a function, then we cannot determine the heritage.
            var constructor = prototypeProto.constructor;
            if (typeof constructor !== "function")
                return proto;
            // If we have some kind of self-reference, then we cannot determine the heritage.
            if (constructor === O)
                return proto;
            // we have a pretty good guess at the heritage.
            return constructor;
        }
        // naive Map shim
        function CreateMapPolyfill() {
            var cacheSentinel = {};
            var arraySentinel = [];
            var MapIterator = /** @class */ (function () {
                function MapIterator(keys, values, selector) {
                    this._index = 0;
                    this._keys = keys;
                    this._values = values;
                    this._selector = selector;
                }
                MapIterator.prototype["@@iterator"] = function () { return this; };
                MapIterator.prototype[iteratorSymbol] = function () { return this; };
                MapIterator.prototype.next = function () {
                    var index = this._index;
                    if (index >= 0 && index < this._keys.length) {
                        var result = this._selector(this._keys[index], this._values[index]);
                        if (index + 1 >= this._keys.length) {
                            this._index = -1;
                            this._keys = arraySentinel;
                            this._values = arraySentinel;
                        }
                        else {
                            this._index++;
                        }
                        return { value: result, done: false };
                    }
                    return { value: undefined, done: true };
                };
                MapIterator.prototype.throw = function (error) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    throw error;
                };
                MapIterator.prototype.return = function (value) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    return { value: value, done: true };
                };
                return MapIterator;
            }());
            return /** @class */ (function () {
                function Map() {
                    this._keys = [];
                    this._values = [];
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                }
                Object.defineProperty(Map.prototype, "size", {
                    get: function () { return this._keys.length; },
                    enumerable: true,
                    configurable: true
                });
                Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
                Map.prototype.get = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    return index >= 0 ? this._values[index] : undefined;
                };
                Map.prototype.set = function (key, value) {
                    var index = this._find(key, /*insert*/ true);
                    this._values[index] = value;
                    return this;
                };
                Map.prototype.delete = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    if (index >= 0) {
                        var size = this._keys.length;
                        for (var i = index + 1; i < size; i++) {
                            this._keys[i - 1] = this._keys[i];
                            this._values[i - 1] = this._values[i];
                        }
                        this._keys.length--;
                        this._values.length--;
                        if (key === this._cacheKey) {
                            this._cacheKey = cacheSentinel;
                            this._cacheIndex = -2;
                        }
                        return true;
                    }
                    return false;
                };
                Map.prototype.clear = function () {
                    this._keys.length = 0;
                    this._values.length = 0;
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                };
                Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
                Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
                Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
                Map.prototype["@@iterator"] = function () { return this.entries(); };
                Map.prototype[iteratorSymbol] = function () { return this.entries(); };
                Map.prototype._find = function (key, insert) {
                    if (this._cacheKey !== key) {
                        this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                    }
                    if (this._cacheIndex < 0 && insert) {
                        this._cacheIndex = this._keys.length;
                        this._keys.push(key);
                        this._values.push(undefined);
                    }
                    return this._cacheIndex;
                };
                return Map;
            }());
            function getKey(key, _) {
                return key;
            }
            function getValue(_, value) {
                return value;
            }
            function getEntry(key, value) {
                return [key, value];
            }
        }
        // naive Set shim
        function CreateSetPolyfill() {
            return /** @class */ (function () {
                function Set() {
                    this._map = new _Map();
                }
                Object.defineProperty(Set.prototype, "size", {
                    get: function () { return this._map.size; },
                    enumerable: true,
                    configurable: true
                });
                Set.prototype.has = function (value) { return this._map.has(value); };
                Set.prototype.add = function (value) { return this._map.set(value, value), this; };
                Set.prototype.delete = function (value) { return this._map.delete(value); };
                Set.prototype.clear = function () { this._map.clear(); };
                Set.prototype.keys = function () { return this._map.keys(); };
                Set.prototype.values = function () { return this._map.values(); };
                Set.prototype.entries = function () { return this._map.entries(); };
                Set.prototype["@@iterator"] = function () { return this.keys(); };
                Set.prototype[iteratorSymbol] = function () { return this.keys(); };
                return Set;
            }());
        }
        // naive WeakMap shim
        function CreateWeakMapPolyfill() {
            var UUID_SIZE = 16;
            var keys = HashMap.create();
            var rootKey = CreateUniqueKey();
            return /** @class */ (function () {
                function WeakMap() {
                    this._key = CreateUniqueKey();
                }
                WeakMap.prototype.has = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.has(table, this._key) : false;
                };
                WeakMap.prototype.get = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
                };
                WeakMap.prototype.set = function (target, value) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                    table[this._key] = value;
                    return this;
                };
                WeakMap.prototype.delete = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? delete table[this._key] : false;
                };
                WeakMap.prototype.clear = function () {
                    // NOTE: not a real clear, just makes the previous data unreachable
                    this._key = CreateUniqueKey();
                };
                return WeakMap;
            }());
            function CreateUniqueKey() {
                var key;
                do
                    key = "@@WeakMap@@" + CreateUUID();
                while (HashMap.has(keys, key));
                keys[key] = true;
                return key;
            }
            function GetOrCreateWeakMapTable(target, create) {
                if (!hasOwn.call(target, rootKey)) {
                    if (!create)
                        return undefined;
                    Object.defineProperty(target, rootKey, { value: HashMap.create() });
                }
                return target[rootKey];
            }
            function FillRandomBytes(buffer, size) {
                for (var i = 0; i < size; ++i)
                    buffer[i] = Math.random() * 0xff | 0;
                return buffer;
            }
            function GenRandomBytes(size) {
                if (typeof Uint8Array === "function") {
                    if (typeof crypto !== "undefined")
                        return crypto.getRandomValues(new Uint8Array(size));
                    if (typeof msCrypto !== "undefined")
                        return msCrypto.getRandomValues(new Uint8Array(size));
                    return FillRandomBytes(new Uint8Array(size), size);
                }
                return FillRandomBytes(new Array(size), size);
            }
            function CreateUUID() {
                var data = GenRandomBytes(UUID_SIZE);
                // mark as random - RFC 4122 § 4.4
                data[6] = data[6] & 0x4f | 0x40;
                data[8] = data[8] & 0xbf | 0x80;
                var result = "";
                for (var offset = 0; offset < UUID_SIZE; ++offset) {
                    var byte = data[offset];
                    if (offset === 4 || offset === 6 || offset === 8)
                        result += "-";
                    if (byte < 16)
                        result += "0";
                    result += byte.toString(16).toLowerCase();
                }
                return result;
            }
        }
        // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
        function MakeDictionary(obj) {
            obj.__ = undefined;
            delete obj.__;
            return obj;
        }
    });
})(Reflect$1 || (Reflect$1 = {}));

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
    ClassMetadata.prototype.reader = function () {
        var _this = this;
        return {
            getClass: function () { return _this.clazz; },
            getScope: function () {
                return _this.scope;
            },
            getConstructorParameterTypes: function () {
                return _this.constructorParameterTypes.slice(0);
            },
            getMethods: function (lifecycle) {
                return _this.getMethods(lifecycle);
            },
            getPropertyTypeMap: function () { return new Map(_this.propertyTypesMap); },
            getCtorMarkInfo: function () {
                return __assign({}, _this.marks.ctor);
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

function Bind(aliasName) {
    return function (target) {
        var metadata = MetadataInstanceManager.getMetadata(target, ClassMetadata);
        GlobalMetadata.getInstance().recordClassAlias(aliasName, metadata);
    };
}

function Scope(scope) {
    return function (target) {
        var metadata = MetadataInstanceManager.getMetadata(target, ClassMetadata);
        metadata.setScope(scope);
    };
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

function Factory(produceIdentifier) {
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
        }, injections);
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
var LifecycleDecorator = function (lifecycle) {
    return function (target, propertyKey) {
        var metadata = MetadataInstanceManager.getMetadata(target.constructor, ClassMetadata);
        metadata.addLifecycleMethod(propertyKey, lifecycle);
    };
};

/**
 * Urn calls the methods annotated with @PostInject only once, just after the injection of properties.
 * @annotation
 */
var PostInject = function () { return LifecycleDecorator(Lifecycle.POST_INJECT); };

/**
 * Urn calls the methods annotated with @PostInject only once, just after the injection of properties.
 * @annotation
 */
var PreInject = function () { return LifecycleDecorator(Lifecycle.PRE_INJECT); };

var PreDestroy = function () { return LifecycleDecorator(Lifecycle.PRE_DESTROY); };

var ExpressionType;
(function (ExpressionType) {
    ExpressionType["ENV"] = "inject-environment-variables";
    ExpressionType["JSON_PATH"] = "inject-json-data";
    ExpressionType["ARGV"] = "inject-argv";
})(ExpressionType || (ExpressionType = {}));

var isNodeJs = (function () {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        eval('require("os").arch();');
        return true;
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

var index_cjs = {};

var lazyProp;
var lazyMember;
Object.defineProperty(index_cjs,"__esModule",{value:!0});
/*! *****************************************************************************
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
var e=function(){return e=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},e.apply(this,arguments)};function t(){}var r={},n=function(){function e(e){this.evaluateResult=r,this.context=e.target,this.computeFn=e.evaluate,this.resetTester=e.resetTesters;}return e.prototype.release=function(){this.reset(t);},e.prototype.reset=function(e){this.evaluateResult=r,this.computeFn=e||this.computeFn;},e.prototype.evaluate=function(){this.isPresent()&&!this.needReset()||(this.evaluateResult=this.computeFn.call(this.context,this.context));},e.prototype.get=function(){return this.evaluate(),this.evaluateResult},e.prototype.isPresent=function(){return this.evaluateResult!==r},e.prototype.needReset=function(){var e=this;return this.resetTester.some((function(t){return t(e.context)}))},e}();function o(t,r,o){var u;u="function"==typeof o?{evaluate:o}:e({},o);var a=Object.getOwnPropertyDescriptor(t,r);if(a&&!a.configurable)throw new Error("Cannot override override property: "+String(r));var i="boolean"==typeof u.enumerable?u.enumerable:(null==a?void 0:a.enumerable)||!0,s=u.resetBy||[],l=function(){return function(e,t,r,o){e.__lazy__||Object.defineProperty(e,"__lazy__",{value:{},enumerable:!1,writable:!1,configurable:!1});var u=e.__lazy__;if(!u[t]){var a=o.map((function(e){return "string"==typeof e||"number"==typeof e||"symbol"==typeof e?function(e){var t;return function(r){var n=r[e],o=n!==t;return t=n,o}}(e):(t=e,function(e){var n=t(e),o=n!==r;return r=n,o});var t,r;}));u[t]=new n({target:e,evaluate:r,resetTesters:a});}return u[t]}(this,r,u.evaluate,s)};return Object.defineProperty(t,r,{configurable:!0,enumerable:i,get:function(){return l.call(this).get()}}),l}function u(e,t,r){return o(e,t,r).call(e)}lazyMember = index_cjs.lazyMember=function(e){return function(t,r){o(t,r,e);}},index_cjs.lazyMemberOfClass=function(e,t,r){o(e.prototype,t,r);},lazyProp = index_cjs.lazyProp=u,index_cjs.lazyVal=function(e){return u({__val__:null},"__val__",e)};

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
        this.propertyFactories = {};
        this.lazyMode = true;
        this.lifecycleResolver = new LifecycleManager(componentClass, container);
        var reader = MetadataInstanceManager.getMetadata(componentClass, ClassMetadata).reader();
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
        var globalMetadataReader = GlobalMetadata.getInstance().reader();
        var properties = classMetadataReader.getPropertyTypeMap();
        var _loop_1 = function (propertyName, propertyType) {
            if (typeof propertyType === 'function') {
                this_1.propertyFactories[propertyName] = new ServiceFactoryDef(function (container, owner) {
                    return function () { return container.getInstance(propertyType, owner); };
                });
                return "continue";
            }
            var factory = this_1.container.getFactory(propertyType);
            if (factory) {
                this_1.propertyFactories[propertyName] = factory;
                return "continue";
            }
            var propertyClassMetadata = globalMetadataReader.getClassMetadata(propertyType);
            if (propertyClassMetadata) {
                this_1.propertyFactories[propertyName] = ServiceFactoryDef.createFromClassMetadata(propertyClassMetadata);
                return "continue";
            }
            var propertyFactory = globalMetadataReader.getComponentFactory(propertyType);
            if (propertyFactory) {
                this_1.propertyFactories[propertyName] = propertyFactory;
                return "continue";
            }
        };
        var this_1 = this;
        try {
            for (var properties_1 = __values(properties), properties_1_1 = properties_1.next(); !properties_1_1.done; properties_1_1 = properties_1.next()) {
                var _b = __read(properties_1_1.value, 2), propertyName = _b[0], propertyType = _b[1];
                _loop_1(propertyName, propertyType);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (properties_1_1 && !properties_1_1.done && (_a = properties_1.return)) _a.call(properties_1);
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
            lazyProp(instance, key, getter);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            instance[key] = getter();
        }
    };
    ComponentInstanceBuilder.prototype.createPropertiesGetterBuilder = function () {
        var _this = this;
        var result = {};
        var _loop_2 = function (key) {
            var _a = this_2.propertyFactories[key], factory = _a.factory, injections = _a.injections;
            result[key] = function (instance) {
                var fn = factory(_this.container, instance);
                return function () {
                    return _this.container.invoke(fn, {
                        injections: injections
                    });
                };
            };
        };
        var this_2 = this;
        for (var key in this.propertyFactories) {
            _loop_2(key);
        }
        return result;
    };
    return ComponentInstanceBuilder;
}());

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

function createAspect(appCtx, target, methodName, methodFunc, metadata) {
    var createAspectCtx = function (advice, args, returnValue, error) {
        if (returnValue === void 0) { returnValue = null; }
        if (error === void 0) { error = null; }
        return {
            target: target,
            methodName: methodName,
            arguments: args,
            returnValue: returnValue,
            error: error,
            advice: advice
        };
    };
    var aspectUtils = new AspectUtils(methodFunc);
    var ClassToInstance = function (AspectClass) { return appCtx.getInstance(AspectClass); };
    var beforeAdviceAspects = metadata.getAspectsOf(methodName, Advice.Before).map(ClassToInstance);
    var afterAdviceAspects = metadata.getAspectsOf(methodName, Advice.After).map(ClassToInstance);
    var tryCatchAdviceAspects = metadata.getAspectsOf(methodName, Advice.Thrown).map(ClassToInstance);
    var tryFinallyAdviceAspects = metadata.getAspectsOf(methodName, Advice.Finally).map(ClassToInstance);
    var afterReturnAdviceAspects = metadata.getAspectsOf(methodName, Advice.AfterReturn).map(ClassToInstance);
    var aroundAdviceAspects = metadata.getAspectsOf(methodName, Advice.Around).map(ClassToInstance);
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
        var clazz = instance.constructor;
        var useAspectMetadata = MetadataInstanceManager.getMetadata(clazz, AOPClassMetadata);
        var useAspectMetadataReader = useAspectMetadata.reader();
        var useAspectsMap = useAspectMetadataReader.getAspects();
        if (useAspectsMap.size === 0) {
            return instance;
        }
        var aspectStoreMap = new WeakMap();
        aspectStoreMap.set(instance, new Map());
        var proxyResult = new Proxy(instance, {
            get: function (target, prop) {
                var originValue = target[prop];
                if (prop in target && typeof originValue === 'function') {
                    var aspectMap = aspectStoreMap.get(instance);
                    if (!aspectMap) {
                        return originValue;
                    }
                    if (aspectMap.has(prop)) {
                        return aspectMap.get(prop);
                    }
                    var aspectFn = createAspect(_this.appCtx, target, prop, originValue, useAspectMetadataReader);
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
                var globalInstAwareProcessorClasses = GlobalMetadata.getInstance().reader().getInstAwareProcessorClasses();
                var instAwareProcessorClasses = globalInstAwareProcessorClasses.concat(Array.from(instance.instAwareProcessorClasses));
                return instAwareProcessorClasses.map(function (it) { return instance.container.getInstance(it); });
            },
            resetBy: [
                function (instance) { return instance.instAwareProcessorClasses.size; },
                function () {
                    var globalInstAwareProcessorClasses = GlobalMetadata.getInstance().reader().getInstAwareProcessorClasses();
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
        this.factories = new Map();
        this.evaluatorClasses = new Map();
        this.eventEmitter = new EventEmitter();
        this.defaultScope = options.defaultScope || InstanceScope.SINGLETON;
        this.lazyMode = options.lazyMode === undefined ? true : options.lazyMode;
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
        if (symbol === ApplicationContext) {
            return this;
        }
        if (typeof symbol === 'string' || typeof symbol === 'symbol') {
            var factoryDef = this.getFactory(symbol);
            if (factoryDef) {
                var factory = factoryDef.factory, injections = factoryDef.injections;
                var fn = factory(this, owner);
                var result = this.invoke(fn, {
                    injections: injections
                });
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
                    throw new Error('');
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
    ApplicationContext.prototype.bindFactory = function (symbol, factory, injections) {
        this.factories.set(symbol, new ServiceFactoryDef(factory, injections));
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
        if (hasInjections(options)) {
            var args_1 = options.injections ? options.injections.map(function (it) { return _this.getInstance(it); }) : [];
            return args_1.length > 0 ? fn.apply(void 0, __spreadArray([], __read(args_1), false)) : fn();
        }
        var metadata = MetadataInstanceManager.getMetadata(fn, FunctionMetadata).reader();
        var parameterIdentifiers = metadata.getParameters();
        var args = parameterIdentifiers.map(function (identifier) {
            return _this.getInstance(identifier);
        });
        return fn.apply(void 0, __spreadArray([], __read(args), false));
    };
    ApplicationContext.prototype.destroy = function () {
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
    ApplicationContext.prototype.bindInstance = function (identifier, instance) {
        var resolution = this.resolutions.get(InstanceScope.SINGLETON);
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
        metadata.setScope(InstanceScope.SINGLETON);
        this.evaluatorClasses.set(name, evaluatorClass);
    };
    ApplicationContext.prototype.registerInstAwareProcessor = function (clazz) {
        this.instAwareProcessorManager.appendInstAwareProcessorClass(clazz);
    };
    ApplicationContext.prototype.onPreDestroy = function (listener) {
        return this.eventEmitter.on(PRE_DESTROY_EVENT_KEY, listener);
    };
    ApplicationContext.prototype.getClassMetadata = function (ctor) {
        return ClassMetadata.getInstance(ctor).reader();
    };
    return ApplicationContext;
}());

export { ApplicationContext, Bind, ExpressionType, Factory, Inject, InstanceScope, Mark, PostInject, PreDestroy, PreInject, Scope, Value };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguZXNtLmpzIiwic291cmNlcyI6WyIuLi9zcmMvZm91bmRhdGlvbi9TZXJ2aWNlRmFjdG9yeURlZi50cyIsIi4uL3NyYy9tZXRhZGF0YS9HbG9iYWxNZXRhZGF0YS50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0luc3RhbmNlU2NvcGUudHMiLCIuLi9zcmMvY29tbW9uL0RlZmF1bHRWYWx1ZU1hcC50cyIsIi4uL25vZGVfbW9kdWxlcy9yZWZsZWN0LW1ldGFkYXRhL1JlZmxlY3QuanMiLCIuLi9zcmMvbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIudHMiLCIuLi9zcmMvbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0JpbmQudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9TY29wZS50cyIsIi4uL3NyYy9jb21tb24vaXNOb3REZWZpbmVkLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvSW5qZWN0LnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvRmFjdG9yeS50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0xpZmVjeWNsZS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0xpZmVjeWNsZURlY29yYXRvci50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL1Bvc3RJbmplY3QudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9QcmVJbmplY3QudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9QcmVEZXN0cm95LnRzIiwiLi4vc3JjL3R5cGVzL0V2YWx1YXRlT3B0aW9ucy50cyIsIi4uL3NyYy9jb21tb24vaXNOb2RlSnMudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9WYWx1ZS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL01hcmsudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9FdmVudEVtaXR0ZXIudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9JbnZva2VGdW5jdGlvbk9wdGlvbnMudHMiLCIuLi9ub2RlX21vZHVsZXMvQHZnZXJib3QvbGF6eS9kaXN0L2luZGV4LmNqcy5qcyIsIi4uL3NyYy9mb3VuZGF0aW9uL0xpZmVjeWNsZU1hbmFnZXIudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9Db21wb25lbnRJbnN0YW5jZUJ1aWxkZXIudHMiLCIuLi9zcmMvbWV0YWRhdGEvRnVuY3Rpb25NZXRhZGF0YS50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0NvbXBvbmVudEluc3RhbmNlV3JhcHBlci50cyIsIi4uL3NyYy9jb21tb24vaW52b2tlUHJlRGVzdHJveS50cyIsIi4uL3NyYy9yZXNvbHV0aW9uL1NpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbi50cyIsIi4uL3NyYy9yZXNvbHV0aW9uL0dsb2JhbFNoYXJlZEluc3RhbmNlUmVzb2x1dGlvbi50cyIsIi4uL3NyYy9yZXNvbHV0aW9uL1RyYW5zaWVudEluc3RhbmNlUmVzb2x1dGlvbi50cyIsIi4uL3NyYy9ldmFsdWF0b3IvSlNPTkRhdGFFdmFsdWF0b3IudHMiLCIuLi9zcmMvZXZhbHVhdG9yL0Vudmlyb25tZW50RXZhbHVhdG9yLnRzIiwiLi4vc3JjL2V2YWx1YXRvci9Bcmd2RXZhbHVhdG9yLnRzIiwiLi4vc3JjL2FvcC9BZHZpY2UudHMiLCIuLi9zcmMvYW9wL0FzcGVjdFV0aWxzLnRzIiwiLi4vc3JjL2FvcC9jcmVhdGVBc3BlY3QudHMiLCIuLi9zcmMvYW9wL0FPUENsYXNzTWV0YWRhdGEudHMiLCIuLi9zcmMvYW9wL0FPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvci50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXIudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2VydmljZUZhY3RvcnkgfSBmcm9tICcuLi90eXBlcy9TZXJ2aWNlRmFjdG9yeSc7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5cbmV4cG9ydCBjbGFzcyBTZXJ2aWNlRmFjdG9yeURlZjxUPiB7XG4gICAgc3RhdGljIGNyZWF0ZUZyb21DbGFzc01ldGFkYXRhPFQ+KG1ldGFkYXRhOiBDbGFzc01ldGFkYXRhPFQ+KSB7XG4gICAgICAgIHJldHVybiBuZXcgU2VydmljZUZhY3RvcnlEZWYoKGNvbnRhaW5lcjogQXBwbGljYXRpb25Db250ZXh0LCBvd25lcjogdW5rbm93bikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWFkZXIgPSBtZXRhZGF0YS5yZWFkZXIoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjbGF6eiA9IHJlYWRlci5nZXRDbGFzcygpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXIuZ2V0SW5zdGFuY2UoY2xhenosIG93bmVyKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgZmFjdG9yeTogU2VydmljZUZhY3Rvcnk8VCwgdW5rbm93bj4sIHB1YmxpYyByZWFkb25seSBpbmplY3Rpb25zPzogSWRlbnRpZmllcltdKSB7fVxufVxuIiwiaW1wb3J0IHsgTWV0YWRhdGEgfSBmcm9tICcuLi90eXBlcy9NZXRhZGF0YSc7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4uL3R5cGVzL1NlcnZpY2VGYWN0b3J5JztcbmltcG9ydCB7IEZhY3RvcnlJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvRmFjdG9yeUlkZW50aWZpZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4vQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeURlZiB9IGZyb20gJy4uL2ZvdW5kYXRpb24vU2VydmljZUZhY3RvcnlEZWYnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL3R5cGVzL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2xvYmFsTWV0YWRhdGFSZWFkZXIge1xuICAgIGdldENvbXBvbmVudEZhY3Rvcnk8VD4oa2V5OiBGYWN0b3J5SWRlbnRpZmllcik6IFNlcnZpY2VGYWN0b3J5RGVmPFQ+IHwgdW5kZWZpbmVkO1xuICAgIGdldENsYXNzTWV0YWRhdGE8VD4oYWxpYXNOYW1lOiBzdHJpbmcgfCBzeW1ib2wpOiBDbGFzc01ldGFkYXRhPFQ+IHwgdW5kZWZpbmVkO1xuICAgIGdldEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoKTogQXJyYXk8TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPj47XG59XG5leHBvcnQgY2xhc3MgR2xvYmFsTWV0YWRhdGEgaW1wbGVtZW50cyBNZXRhZGF0YTxHbG9iYWxNZXRhZGF0YVJlYWRlciwgdm9pZD4ge1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IElOU1RBTkNFID0gbmV3IEdsb2JhbE1ldGFkYXRhKCk7XG4gICAgc3RhdGljIGdldEluc3RhbmNlKCkge1xuICAgICAgICByZXR1cm4gR2xvYmFsTWV0YWRhdGEuSU5TVEFOQ0U7XG4gICAgfVxuICAgIHByaXZhdGUgY2xhc3NBbGlhc01ldGFkYXRhTWFwID0gbmV3IE1hcDxzdHJpbmcgfCBzeW1ib2wsIENsYXNzTWV0YWRhdGE8dW5rbm93bj4+KCk7XG4gICAgcHJpdmF0ZSBjb21wb25lbnRGYWN0b3JpZXMgPSBuZXcgTWFwPEZhY3RvcnlJZGVudGlmaWVyLCBTZXJ2aWNlRmFjdG9yeURlZjx1bmtub3duPj4oKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHByb2Nlc3NvckNsYXNzZXM6IFNldDxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+PiA9IG5ldyBTZXQoKTtcbiAgICByZWNvcmRGYWN0b3J5PFQ+KHN5bWJvbDogRmFjdG9yeUlkZW50aWZpZXIsIGZhY3Rvcnk6IFNlcnZpY2VGYWN0b3J5PFQsIHVua25vd24+LCBpbmplY3Rpb25zPzogSWRlbnRpZmllcltdKSB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50RmFjdG9yaWVzLnNldChzeW1ib2wsIG5ldyBTZXJ2aWNlRmFjdG9yeURlZihmYWN0b3J5LCBpbmplY3Rpb25zKSk7XG4gICAgfVxuICAgIHJlY29yZENsYXNzQWxpYXM8VD4oYWxpYXNOYW1lOiBzdHJpbmcgfCBzeW1ib2wsIG1ldGFkYXRhOiBDbGFzc01ldGFkYXRhPFQ+KSB7XG4gICAgICAgIHRoaXMuY2xhc3NBbGlhc01ldGFkYXRhTWFwLnNldChhbGlhc05hbWUsIG1ldGFkYXRhKTtcbiAgICB9XG4gICAgcmVjb3JkUHJvY2Vzc29yQ2xhc3MoY2xheno6IE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4pIHtcbiAgICAgICAgdGhpcy5wcm9jZXNzb3JDbGFzc2VzLmFkZChjbGF6eik7XG4gICAgfVxuICAgIGluaXQoKSB7XG4gICAgICAgIC8vIFBBU1M7XG4gICAgfVxuICAgIHJlYWRlcigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldENvbXBvbmVudEZhY3Rvcnk6IDxUPihrZXk6IEZhY3RvcnlJZGVudGlmaWVyKTogU2VydmljZUZhY3RvcnlEZWY8VD4gfCB1bmRlZmluZWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudEZhY3Rvcmllcy5nZXQoa2V5KSBhcyBTZXJ2aWNlRmFjdG9yeURlZjxUPiB8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRDbGFzc01ldGFkYXRhOiA8VD4oYWxpYXNOYW1lOiBzdHJpbmcgfCBzeW1ib2wpOiBDbGFzc01ldGFkYXRhPFQ+IHwgdW5kZWZpbmVkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jbGFzc0FsaWFzTWV0YWRhdGFNYXAuZ2V0KGFsaWFzTmFtZSkgYXMgQ2xhc3NNZXRhZGF0YTxUPiB8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzOiAoKTogQXJyYXk8TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPj4gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMucHJvY2Vzc29yQ2xhc3Nlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiZXhwb3J0IGVudW0gSW5zdGFuY2VTY29wZSB7XG4gICAgU0lOR0xFVE9OID0gJ2lvYy1yZXNvbHV0aW9uOmNvbnRhaW5lci1zaW5nbGV0b24nLFxuICAgIFRSQU5TSUVOVCA9ICdpb2MtcmVzb2x1dGlvbjp0cmFuc2llbnQnLFxuICAgIEdMT0JBTF9TSEFSRURfU0lOR0xFVE9OID0gJ2lvYy1yZXNvbHV0aW9uOmdsb2JhbC1zaGFyZWQtc2luZ2xldG9uJ1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURlZmF1bHRWYWx1ZU1hcDxLLCBWPihmYWN0b3J5OiAoa2V5OiBLKSA9PiBWKSB7XG4gICAgY29uc3QgbWFwID0gbmV3IE1hcDxLLCBWPigpO1xuICAgIGNvbnN0IG9yaWdpbkdldCA9IG1hcC5nZXQuYmluZChtYXApO1xuICAgIG1hcC5nZXQgPSBmdW5jdGlvbiAoa2V5OiBLKSB7XG4gICAgICAgIGlmIChtYXAuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiBvcmlnaW5HZXQoa2V5KSBhcyBWO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFZhbHVlID0gZmFjdG9yeShrZXkpO1xuICAgICAgICAgICAgbWFwLnNldChrZXksIGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gbWFwLmdldChrZXkpIGFzIFY7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBtYXAgYXMgRGVmYXVsdFZhbHVlTWFwPEssIFY+O1xufVxuZXhwb3J0IHR5cGUgRGVmYXVsdFZhbHVlTWFwPEssIFY+ID0gT21pdDxNYXA8SywgVj4sICdnZXQnPiAmIHtcbiAgICBnZXQ6IChrZXk6IEspID0+IFY7XG59O1xuIiwiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5Db3B5cmlnaHQgKEMpIE1pY3Jvc29mdC4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxuXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG52YXIgUmVmbGVjdDtcbihmdW5jdGlvbiAoUmVmbGVjdCkge1xuICAgIC8vIE1ldGFkYXRhIFByb3Bvc2FsXG4gICAgLy8gaHR0cHM6Ly9yYnVja3Rvbi5naXRodWIuaW8vcmVmbGVjdC1tZXRhZGF0YS9cbiAgICAoZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgICAgICAgdmFyIHJvb3QgPSB0eXBlb2YgZ2xvYmFsID09PSBcIm9iamVjdFwiID8gZ2xvYmFsIDpcbiAgICAgICAgICAgIHR5cGVvZiBzZWxmID09PSBcIm9iamVjdFwiID8gc2VsZiA6XG4gICAgICAgICAgICAgICAgdHlwZW9mIHRoaXMgPT09IFwib2JqZWN0XCIgPyB0aGlzIDpcbiAgICAgICAgICAgICAgICAgICAgRnVuY3Rpb24oXCJyZXR1cm4gdGhpcztcIikoKTtcbiAgICAgICAgdmFyIGV4cG9ydGVyID0gbWFrZUV4cG9ydGVyKFJlZmxlY3QpO1xuICAgICAgICBpZiAodHlwZW9mIHJvb3QuUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcm9vdC5SZWZsZWN0ID0gUmVmbGVjdDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGV4cG9ydGVyID0gbWFrZUV4cG9ydGVyKHJvb3QuUmVmbGVjdCwgZXhwb3J0ZXIpO1xuICAgICAgICB9XG4gICAgICAgIGZhY3RvcnkoZXhwb3J0ZXIpO1xuICAgICAgICBmdW5jdGlvbiBtYWtlRXhwb3J0ZXIodGFyZ2V0LCBwcmV2aW91cykge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXRba2V5XSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgeyBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwcmV2aW91cylcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXMoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSkoZnVuY3Rpb24gKGV4cG9ydGVyKSB7XG4gICAgICAgIHZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICAgICAgICAvLyBmZWF0dXJlIHRlc3QgZm9yIFN5bWJvbCBzdXBwb3J0XG4gICAgICAgIHZhciBzdXBwb3J0c1N5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIjtcbiAgICAgICAgdmFyIHRvUHJpbWl0aXZlU3ltYm9sID0gc3VwcG9ydHNTeW1ib2wgJiYgdHlwZW9mIFN5bWJvbC50b1ByaW1pdGl2ZSAhPT0gXCJ1bmRlZmluZWRcIiA/IFN5bWJvbC50b1ByaW1pdGl2ZSA6IFwiQEB0b1ByaW1pdGl2ZVwiO1xuICAgICAgICB2YXIgaXRlcmF0b3JTeW1ib2wgPSBzdXBwb3J0c1N5bWJvbCAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yICE9PSBcInVuZGVmaW5lZFwiID8gU3ltYm9sLml0ZXJhdG9yIDogXCJAQGl0ZXJhdG9yXCI7XG4gICAgICAgIHZhciBzdXBwb3J0c0NyZWF0ZSA9IHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSBcImZ1bmN0aW9uXCI7IC8vIGZlYXR1cmUgdGVzdCBmb3IgT2JqZWN0LmNyZWF0ZSBzdXBwb3J0XG4gICAgICAgIHZhciBzdXBwb3J0c1Byb3RvID0geyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheTsgLy8gZmVhdHVyZSB0ZXN0IGZvciBfX3Byb3RvX18gc3VwcG9ydFxuICAgICAgICB2YXIgZG93bkxldmVsID0gIXN1cHBvcnRzQ3JlYXRlICYmICFzdXBwb3J0c1Byb3RvO1xuICAgICAgICB2YXIgSGFzaE1hcCA9IHtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBhbiBvYmplY3QgaW4gZGljdGlvbmFyeSBtb2RlIChhLmsuYS4gXCJzbG93XCIgbW9kZSBpbiB2OClcbiAgICAgICAgICAgIGNyZWF0ZTogc3VwcG9ydHNDcmVhdGVcbiAgICAgICAgICAgICAgICA/IGZ1bmN0aW9uICgpIHsgcmV0dXJuIE1ha2VEaWN0aW9uYXJ5KE9iamVjdC5jcmVhdGUobnVsbCkpOyB9XG4gICAgICAgICAgICAgICAgOiBzdXBwb3J0c1Byb3RvXG4gICAgICAgICAgICAgICAgICAgID8gZnVuY3Rpb24gKCkgeyByZXR1cm4gTWFrZURpY3Rpb25hcnkoeyBfX3Byb3RvX186IG51bGwgfSk7IH1cbiAgICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbiAoKSB7IHJldHVybiBNYWtlRGljdGlvbmFyeSh7fSk7IH0sXG4gICAgICAgICAgICBoYXM6IGRvd25MZXZlbFxuICAgICAgICAgICAgICAgID8gZnVuY3Rpb24gKG1hcCwga2V5KSB7IHJldHVybiBoYXNPd24uY2FsbChtYXAsIGtleSk7IH1cbiAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uIChtYXAsIGtleSkgeyByZXR1cm4ga2V5IGluIG1hcDsgfSxcbiAgICAgICAgICAgIGdldDogZG93bkxldmVsXG4gICAgICAgICAgICAgICAgPyBmdW5jdGlvbiAobWFwLCBrZXkpIHsgcmV0dXJuIGhhc093bi5jYWxsKG1hcCwga2V5KSA/IG1hcFtrZXldIDogdW5kZWZpbmVkOyB9XG4gICAgICAgICAgICAgICAgOiBmdW5jdGlvbiAobWFwLCBrZXkpIHsgcmV0dXJuIG1hcFtrZXldOyB9LFxuICAgICAgICB9O1xuICAgICAgICAvLyBMb2FkIGdsb2JhbCBvciBzaGltIHZlcnNpb25zIG9mIE1hcCwgU2V0LCBhbmQgV2Vha01hcFxuICAgICAgICB2YXIgZnVuY3Rpb25Qcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoRnVuY3Rpb24pO1xuICAgICAgICB2YXIgdXNlUG9seWZpbGwgPSB0eXBlb2YgcHJvY2VzcyA9PT0gXCJvYmplY3RcIiAmJiBwcm9jZXNzLmVudiAmJiBwcm9jZXNzLmVudltcIlJFRkxFQ1RfTUVUQURBVEFfVVNFX01BUF9QT0xZRklMTFwiXSA9PT0gXCJ0cnVlXCI7XG4gICAgICAgIHZhciBfTWFwID0gIXVzZVBvbHlmaWxsICYmIHR5cGVvZiBNYXAgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgTWFwLnByb3RvdHlwZS5lbnRyaWVzID09PSBcImZ1bmN0aW9uXCIgPyBNYXAgOiBDcmVhdGVNYXBQb2x5ZmlsbCgpO1xuICAgICAgICB2YXIgX1NldCA9ICF1c2VQb2x5ZmlsbCAmJiB0eXBlb2YgU2V0ID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFNldC5wcm90b3R5cGUuZW50cmllcyA9PT0gXCJmdW5jdGlvblwiID8gU2V0IDogQ3JlYXRlU2V0UG9seWZpbGwoKTtcbiAgICAgICAgdmFyIF9XZWFrTWFwID0gIXVzZVBvbHlmaWxsICYmIHR5cGVvZiBXZWFrTWFwID09PSBcImZ1bmN0aW9uXCIgPyBXZWFrTWFwIDogQ3JlYXRlV2Vha01hcFBvbHlmaWxsKCk7XG4gICAgICAgIC8vIFtbTWV0YWRhdGFdXSBpbnRlcm5hbCBzbG90XG4gICAgICAgIC8vIGh0dHBzOi8vcmJ1Y2t0b24uZ2l0aHViLmlvL3JlZmxlY3QtbWV0YWRhdGEvI29yZGluYXJ5LW9iamVjdC1pbnRlcm5hbC1tZXRob2RzLWFuZC1pbnRlcm5hbC1zbG90c1xuICAgICAgICB2YXIgTWV0YWRhdGEgPSBuZXcgX1dlYWtNYXAoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFwcGxpZXMgYSBzZXQgb2YgZGVjb3JhdG9ycyB0byBhIHByb3BlcnR5IG9mIGEgdGFyZ2V0IG9iamVjdC5cbiAgICAgICAgICogQHBhcmFtIGRlY29yYXRvcnMgQW4gYXJyYXkgb2YgZGVjb3JhdG9ycy5cbiAgICAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdC5cbiAgICAgICAgICogQHBhcmFtIHByb3BlcnR5S2V5IChPcHRpb25hbCkgVGhlIHByb3BlcnR5IGtleSB0byBkZWNvcmF0ZS5cbiAgICAgICAgICogQHBhcmFtIGF0dHJpYnV0ZXMgKE9wdGlvbmFsKSBUaGUgcHJvcGVydHkgZGVzY3JpcHRvciBmb3IgdGhlIHRhcmdldCBrZXkuXG4gICAgICAgICAqIEByZW1hcmtzIERlY29yYXRvcnMgYXJlIGFwcGxpZWQgaW4gcmV2ZXJzZSBvcmRlci5cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xuICAgICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5IGRlY2xhcmF0aW9ucyBhcmUgbm90IHBhcnQgb2YgRVM2LCB0aG91Z2ggdGhleSBhcmUgdmFsaWQgaW4gVHlwZVNjcmlwdDpcbiAgICAgICAgICogICAgICAgICAvLyBzdGF0aWMgc3RhdGljUHJvcGVydHk7XG4gICAgICAgICAqICAgICAgICAgLy8gcHJvcGVydHk7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAgICAgY29uc3RydWN0b3IocCkgeyB9XG4gICAgICAgICAqICAgICAgICAgc3RhdGljIHN0YXRpY01ldGhvZChwKSB7IH1cbiAgICAgICAgICogICAgICAgICBtZXRob2QocCkgeyB9XG4gICAgICAgICAqICAgICB9XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBjb25zdHJ1Y3RvclxuICAgICAgICAgKiAgICAgRXhhbXBsZSA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9yc0FycmF5LCBFeGFtcGxlKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBjb25zdHJ1Y3RvcilcbiAgICAgICAgICogICAgIFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9yc0FycmF5LCBFeGFtcGxlLCBcInN0YXRpY1Byb3BlcnR5XCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIHByb3RvdHlwZSlcbiAgICAgICAgICogICAgIFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9yc0FycmF5LCBFeGFtcGxlLnByb3RvdHlwZSwgXCJwcm9wZXJ0eVwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIG1ldGhvZCAob24gY29uc3RydWN0b3IpXG4gICAgICAgICAqICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXhhbXBsZSwgXCJzdGF0aWNNZXRob2RcIixcbiAgICAgICAgICogICAgICAgICBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnNBcnJheSwgRXhhbXBsZSwgXCJzdGF0aWNNZXRob2RcIixcbiAgICAgICAgICogICAgICAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihFeGFtcGxlLCBcInN0YXRpY01ldGhvZFwiKSkpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBwcm90b3R5cGUpXG4gICAgICAgICAqICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXhhbXBsZS5wcm90b3R5cGUsIFwibWV0aG9kXCIsXG4gICAgICAgICAqICAgICAgICAgUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzQXJyYXksIEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiLFxuICAgICAgICAgKiAgICAgICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiKSkpO1xuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBwcm9wZXJ0eUtleSwgYXR0cmlidXRlcykge1xuICAgICAgICAgICAgaWYgKCFJc1VuZGVmaW5lZChwcm9wZXJ0eUtleSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIUlzQXJyYXkoZGVjb3JhdG9ycykpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICBpZiAoIUlzT2JqZWN0KHRhcmdldCkpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICBpZiAoIUlzT2JqZWN0KGF0dHJpYnV0ZXMpICYmICFJc1VuZGVmaW5lZChhdHRyaWJ1dGVzKSAmJiAhSXNOdWxsKGF0dHJpYnV0ZXMpKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICAgICAgaWYgKElzTnVsbChhdHRyaWJ1dGVzKSlcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eUtleSA9IFRvUHJvcGVydHlLZXkocHJvcGVydHlLZXkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBEZWNvcmF0ZVByb3BlcnR5KGRlY29yYXRvcnMsIHRhcmdldCwgcHJvcGVydHlLZXksIGF0dHJpYnV0ZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCFJc0FycmF5KGRlY29yYXRvcnMpKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICAgICAgaWYgKCFJc0NvbnN0cnVjdG9yKHRhcmdldCkpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gRGVjb3JhdGVDb25zdHJ1Y3RvcihkZWNvcmF0b3JzLCB0YXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGV4cG9ydGVyKFwiZGVjb3JhdGVcIiwgZGVjb3JhdGUpO1xuICAgICAgICAvLyA0LjEuMiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKVxuICAgICAgICAvLyBodHRwczovL3JidWNrdG9uLmdpdGh1Yi5pby9yZWZsZWN0LW1ldGFkYXRhLyNyZWZsZWN0Lm1ldGFkYXRhXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGRlZmF1bHQgbWV0YWRhdGEgZGVjb3JhdG9yIGZhY3RvcnkgdGhhdCBjYW4gYmUgdXNlZCBvbiBhIGNsYXNzLCBjbGFzcyBtZW1iZXIsIG9yIHBhcmFtZXRlci5cbiAgICAgICAgICogQHBhcmFtIG1ldGFkYXRhS2V5IFRoZSBrZXkgZm9yIHRoZSBtZXRhZGF0YSBlbnRyeS5cbiAgICAgICAgICogQHBhcmFtIG1ldGFkYXRhVmFsdWUgVGhlIHZhbHVlIGZvciB0aGUgbWV0YWRhdGEgZW50cnkuXG4gICAgICAgICAqIEByZXR1cm5zIEEgZGVjb3JhdG9yIGZ1bmN0aW9uLlxuICAgICAgICAgKiBAcmVtYXJrc1xuICAgICAgICAgKiBJZiBgbWV0YWRhdGFLZXlgIGlzIGFscmVhZHkgZGVmaW5lZCBmb3IgdGhlIHRhcmdldCBhbmQgdGFyZ2V0IGtleSwgdGhlXG4gICAgICAgICAqIG1ldGFkYXRhVmFsdWUgZm9yIHRoYXQga2V5IHdpbGwgYmUgb3ZlcndyaXR0ZW4uXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBjb25zdHJ1Y3RvclxuICAgICAgICAgKiAgICAgQFJlZmxlY3QubWV0YWRhdGEoa2V5LCB2YWx1ZSlcbiAgICAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xuICAgICAgICAgKiAgICAgfVxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIGNvbnN0cnVjdG9yLCBUeXBlU2NyaXB0IG9ubHkpXG4gICAgICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcbiAgICAgICAgICogICAgICAgICBAUmVmbGVjdC5tZXRhZGF0YShrZXksIHZhbHVlKVxuICAgICAgICAgKiAgICAgICAgIHN0YXRpYyBzdGF0aWNQcm9wZXJ0eTtcbiAgICAgICAgICogICAgIH1cbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBwcm90b3R5cGUsIFR5cGVTY3JpcHQgb25seSlcbiAgICAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xuICAgICAgICAgKiAgICAgICAgIEBSZWZsZWN0Lm1ldGFkYXRhKGtleSwgdmFsdWUpXG4gICAgICAgICAqICAgICAgICAgcHJvcGVydHk7XG4gICAgICAgICAqICAgICB9XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBtZXRob2QgKG9uIGNvbnN0cnVjdG9yKVxuICAgICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XG4gICAgICAgICAqICAgICAgICAgQFJlZmxlY3QubWV0YWRhdGEoa2V5LCB2YWx1ZSlcbiAgICAgICAgICogICAgICAgICBzdGF0aWMgc3RhdGljTWV0aG9kKCkgeyB9XG4gICAgICAgICAqICAgICB9XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBtZXRob2QgKG9uIHByb3RvdHlwZSlcbiAgICAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xuICAgICAgICAgKiAgICAgICAgIEBSZWZsZWN0Lm1ldGFkYXRhKGtleSwgdmFsdWUpXG4gICAgICAgICAqICAgICAgICAgbWV0aG9kKCkgeyB9XG4gICAgICAgICAqICAgICB9XG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBtZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xuICAgICAgICAgICAgZnVuY3Rpb24gZGVjb3JhdG9yKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIUlzT2JqZWN0KHRhcmdldCkpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICBpZiAoIUlzVW5kZWZpbmVkKHByb3BlcnR5S2V5KSAmJiAhSXNQcm9wZXJ0eUtleShwcm9wZXJ0eUtleSkpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICBPcmRpbmFyeURlZmluZU93bk1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlLCB0YXJnZXQsIHByb3BlcnR5S2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkZWNvcmF0b3I7XG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0ZXIoXCJtZXRhZGF0YVwiLCBtZXRhZGF0YSk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZpbmUgYSB1bmlxdWUgbWV0YWRhdGEgZW50cnkgb24gdGhlIHRhcmdldC5cbiAgICAgICAgICogQHBhcmFtIG1ldGFkYXRhS2V5IEEga2V5IHVzZWQgdG8gc3RvcmUgYW5kIHJldHJpZXZlIG1ldGFkYXRhLlxuICAgICAgICAgKiBAcGFyYW0gbWV0YWRhdGFWYWx1ZSBBIHZhbHVlIHRoYXQgY29udGFpbnMgYXR0YWNoZWQgbWV0YWRhdGEuXG4gICAgICAgICAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3Qgb24gd2hpY2ggdG8gZGVmaW5lIG1ldGFkYXRhLlxuICAgICAgICAgKiBAcGFyYW0gcHJvcGVydHlLZXkgKE9wdGlvbmFsKSBUaGUgcHJvcGVydHkga2V5IGZvciB0aGUgdGFyZ2V0LlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XG4gICAgICAgICAqICAgICAgICAgLy8gcHJvcGVydHkgZGVjbGFyYXRpb25zIGFyZSBub3QgcGFydCBvZiBFUzYsIHRob3VnaCB0aGV5IGFyZSB2YWxpZCBpbiBUeXBlU2NyaXB0OlxuICAgICAgICAgKiAgICAgICAgIC8vIHN0YXRpYyBzdGF0aWNQcm9wZXJ0eTtcbiAgICAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgICAgICBjb25zdHJ1Y3RvcihwKSB7IH1cbiAgICAgICAgICogICAgICAgICBzdGF0aWMgc3RhdGljTWV0aG9kKHApIHsgfVxuICAgICAgICAgKiAgICAgICAgIG1ldGhvZChwKSB7IH1cbiAgICAgICAgICogICAgIH1cbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgICAgICAqICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgb3B0aW9ucywgRXhhbXBsZSk7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gY29uc3RydWN0b3IpXG4gICAgICAgICAqICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgb3B0aW9ucywgRXhhbXBsZSwgXCJzdGF0aWNQcm9wZXJ0eVwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBwcm90b3R5cGUpXG4gICAgICAgICAqICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgb3B0aW9ucywgRXhhbXBsZS5wcm90b3R5cGUsIFwicHJvcGVydHlcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBtZXRob2QgKG9uIGNvbnN0cnVjdG9yKVxuICAgICAgICAgKiAgICAgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIG9wdGlvbnMsIEV4YW1wbGUsIFwic3RhdGljTWV0aG9kXCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBwcm90b3R5cGUpXG4gICAgICAgICAqICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgb3B0aW9ucywgRXhhbXBsZS5wcm90b3R5cGUsIFwibWV0aG9kXCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gZGVjb3JhdG9yIGZhY3RvcnkgYXMgbWV0YWRhdGEtcHJvZHVjaW5nIGFubm90YXRpb24uXG4gICAgICAgICAqICAgICBmdW5jdGlvbiBNeUFubm90YXRpb24ob3B0aW9ucyk6IERlY29yYXRvciB7XG4gICAgICAgICAqICAgICAgICAgcmV0dXJuICh0YXJnZXQsIGtleT8pID0+IFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBvcHRpb25zLCB0YXJnZXQsIGtleSk7XG4gICAgICAgICAqICAgICB9XG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBkZWZpbmVNZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSwgdGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICAgICAgaWYgKCFJc09iamVjdCh0YXJnZXQpKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgIGlmICghSXNVbmRlZmluZWQocHJvcGVydHlLZXkpKVxuICAgICAgICAgICAgICAgIHByb3BlcnR5S2V5ID0gVG9Qcm9wZXJ0eUtleShwcm9wZXJ0eUtleSk7XG4gICAgICAgICAgICByZXR1cm4gT3JkaW5hcnlEZWZpbmVPd25NZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSwgdGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0ZXIoXCJkZWZpbmVNZXRhZGF0YVwiLCBkZWZpbmVNZXRhZGF0YSk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXRzIGEgdmFsdWUgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSB0YXJnZXQgb2JqZWN0IG9yIGl0cyBwcm90b3R5cGUgY2hhaW4gaGFzIHRoZSBwcm92aWRlZCBtZXRhZGF0YSBrZXkgZGVmaW5lZC5cbiAgICAgICAgICogQHBhcmFtIG1ldGFkYXRhS2V5IEEga2V5IHVzZWQgdG8gc3RvcmUgYW5kIHJldHJpZXZlIG1ldGFkYXRhLlxuICAgICAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IG9uIHdoaWNoIHRoZSBtZXRhZGF0YSBpcyBkZWZpbmVkLlxuICAgICAgICAgKiBAcGFyYW0gcHJvcGVydHlLZXkgKE9wdGlvbmFsKSBUaGUgcHJvcGVydHkga2V5IGZvciB0aGUgdGFyZ2V0LlxuICAgICAgICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG1ldGFkYXRhIGtleSB3YXMgZGVmaW5lZCBvbiB0aGUgdGFyZ2V0IG9iamVjdCBvciBpdHMgcHJvdG90eXBlIGNoYWluOyBvdGhlcndpc2UsIGBmYWxzZWAuXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqXG4gICAgICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcbiAgICAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eSBkZWNsYXJhdGlvbnMgYXJlIG5vdCBwYXJ0IG9mIEVTNiwgdGhvdWdoIHRoZXkgYXJlIHZhbGlkIGluIFR5cGVTY3JpcHQ6XG4gICAgICAgICAqICAgICAgICAgLy8gc3RhdGljIHN0YXRpY1Byb3BlcnR5O1xuICAgICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5O1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgICAgIGNvbnN0cnVjdG9yKHApIHsgfVxuICAgICAgICAgKiAgICAgICAgIHN0YXRpYyBzdGF0aWNNZXRob2QocCkgeyB9XG4gICAgICAgICAqICAgICAgICAgbWV0aG9kKHApIHsgfVxuICAgICAgICAgKiAgICAgfVxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gY29uc3RydWN0b3JcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuaGFzTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBjb25zdHJ1Y3RvcilcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuaGFzTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLCBcInN0YXRpY1Byb3BlcnR5XCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIHByb3RvdHlwZSlcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuaGFzTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLnByb3RvdHlwZSwgXCJwcm9wZXJ0eVwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIG1ldGhvZCAob24gY29uc3RydWN0b3IpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0Lmhhc01ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZSwgXCJzdGF0aWNNZXRob2RcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBtZXRob2QgKG9uIHByb3RvdHlwZSlcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuaGFzTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLnByb3RvdHlwZSwgXCJtZXRob2RcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBoYXNNZXRhZGF0YShtZXRhZGF0YUtleSwgdGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICAgICAgaWYgKCFJc09iamVjdCh0YXJnZXQpKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgIGlmICghSXNVbmRlZmluZWQocHJvcGVydHlLZXkpKVxuICAgICAgICAgICAgICAgIHByb3BlcnR5S2V5ID0gVG9Qcm9wZXJ0eUtleShwcm9wZXJ0eUtleSk7XG4gICAgICAgICAgICByZXR1cm4gT3JkaW5hcnlIYXNNZXRhZGF0YShtZXRhZGF0YUtleSwgdGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0ZXIoXCJoYXNNZXRhZGF0YVwiLCBoYXNNZXRhZGF0YSk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXRzIGEgdmFsdWUgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSB0YXJnZXQgb2JqZWN0IGhhcyB0aGUgcHJvdmlkZWQgbWV0YWRhdGEga2V5IGRlZmluZWQuXG4gICAgICAgICAqIEBwYXJhbSBtZXRhZGF0YUtleSBBIGtleSB1c2VkIHRvIHN0b3JlIGFuZCByZXRyaWV2ZSBtZXRhZGF0YS5cbiAgICAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCBvbiB3aGljaCB0aGUgbWV0YWRhdGEgaXMgZGVmaW5lZC5cbiAgICAgICAgICogQHBhcmFtIHByb3BlcnR5S2V5IChPcHRpb25hbCkgVGhlIHByb3BlcnR5IGtleSBmb3IgdGhlIHRhcmdldC5cbiAgICAgICAgICogQHJldHVybnMgYHRydWVgIGlmIHRoZSBtZXRhZGF0YSBrZXkgd2FzIGRlZmluZWQgb24gdGhlIHRhcmdldCBvYmplY3Q7IG90aGVyd2lzZSwgYGZhbHNlYC5cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xuICAgICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5IGRlY2xhcmF0aW9ucyBhcmUgbm90IHBhcnQgb2YgRVM2LCB0aG91Z2ggdGhleSBhcmUgdmFsaWQgaW4gVHlwZVNjcmlwdDpcbiAgICAgICAgICogICAgICAgICAvLyBzdGF0aWMgc3RhdGljUHJvcGVydHk7XG4gICAgICAgICAqICAgICAgICAgLy8gcHJvcGVydHk7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAgICAgY29uc3RydWN0b3IocCkgeyB9XG4gICAgICAgICAqICAgICAgICAgc3RhdGljIHN0YXRpY01ldGhvZChwKSB7IH1cbiAgICAgICAgICogICAgICAgICBtZXRob2QocCkgeyB9XG4gICAgICAgICAqICAgICB9XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBjb25zdHJ1Y3RvclxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5oYXNPd25NZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIGNvbnN0cnVjdG9yKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5oYXNPd25NZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUsIFwic3RhdGljUHJvcGVydHlcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gcHJvdG90eXBlKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5oYXNPd25NZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUucHJvdG90eXBlLCBcInByb3BlcnR5XCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBjb25zdHJ1Y3RvcilcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuaGFzT3duTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLCBcInN0YXRpY01ldGhvZFwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIG1ldGhvZCAob24gcHJvdG90eXBlKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5oYXNPd25NZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGhhc093bk1ldGFkYXRhKG1ldGFkYXRhS2V5LCB0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgICAgICBpZiAoIUlzT2JqZWN0KHRhcmdldCkpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICAgICAgaWYgKCFJc1VuZGVmaW5lZChwcm9wZXJ0eUtleSkpXG4gICAgICAgICAgICAgICAgcHJvcGVydHlLZXkgPSBUb1Byb3BlcnR5S2V5KHByb3BlcnR5S2V5KTtcbiAgICAgICAgICAgIHJldHVybiBPcmRpbmFyeUhhc093bk1ldGFkYXRhKG1ldGFkYXRhS2V5LCB0YXJnZXQsIHByb3BlcnR5S2V5KTtcbiAgICAgICAgfVxuICAgICAgICBleHBvcnRlcihcImhhc093bk1ldGFkYXRhXCIsIGhhc093bk1ldGFkYXRhKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldHMgdGhlIG1ldGFkYXRhIHZhbHVlIGZvciB0aGUgcHJvdmlkZWQgbWV0YWRhdGEga2V5IG9uIHRoZSB0YXJnZXQgb2JqZWN0IG9yIGl0cyBwcm90b3R5cGUgY2hhaW4uXG4gICAgICAgICAqIEBwYXJhbSBtZXRhZGF0YUtleSBBIGtleSB1c2VkIHRvIHN0b3JlIGFuZCByZXRyaWV2ZSBtZXRhZGF0YS5cbiAgICAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCBvbiB3aGljaCB0aGUgbWV0YWRhdGEgaXMgZGVmaW5lZC5cbiAgICAgICAgICogQHBhcmFtIHByb3BlcnR5S2V5IChPcHRpb25hbCkgVGhlIHByb3BlcnR5IGtleSBmb3IgdGhlIHRhcmdldC5cbiAgICAgICAgICogQHJldHVybnMgVGhlIG1ldGFkYXRhIHZhbHVlIGZvciB0aGUgbWV0YWRhdGEga2V5IGlmIGZvdW5kOyBvdGhlcndpc2UsIGB1bmRlZmluZWRgLlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XG4gICAgICAgICAqICAgICAgICAgLy8gcHJvcGVydHkgZGVjbGFyYXRpb25zIGFyZSBub3QgcGFydCBvZiBFUzYsIHRob3VnaCB0aGV5IGFyZSB2YWxpZCBpbiBUeXBlU2NyaXB0OlxuICAgICAgICAgKiAgICAgICAgIC8vIHN0YXRpYyBzdGF0aWNQcm9wZXJ0eTtcbiAgICAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgICAgICBjb25zdHJ1Y3RvcihwKSB7IH1cbiAgICAgICAgICogICAgICAgICBzdGF0aWMgc3RhdGljTWV0aG9kKHApIHsgfVxuICAgICAgICAgKiAgICAgICAgIG1ldGhvZChwKSB7IH1cbiAgICAgICAgICogICAgIH1cbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZSk7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gY29uc3RydWN0b3IpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZSwgXCJzdGF0aWNQcm9wZXJ0eVwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBwcm90b3R5cGUpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZS5wcm90b3R5cGUsIFwicHJvcGVydHlcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBtZXRob2QgKG9uIGNvbnN0cnVjdG9yKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUsIFwic3RhdGljTWV0aG9kXCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBwcm90b3R5cGUpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZS5wcm90b3R5cGUsIFwibWV0aG9kXCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZ2V0TWV0YWRhdGEobWV0YWRhdGFLZXksIHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgICAgIGlmICghSXNPYmplY3QodGFyZ2V0KSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICBpZiAoIUlzVW5kZWZpbmVkKHByb3BlcnR5S2V5KSlcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eUtleSA9IFRvUHJvcGVydHlLZXkocHJvcGVydHlLZXkpO1xuICAgICAgICAgICAgcmV0dXJuIE9yZGluYXJ5R2V0TWV0YWRhdGEobWV0YWRhdGFLZXksIHRhcmdldCwgcHJvcGVydHlLZXkpO1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydGVyKFwiZ2V0TWV0YWRhdGFcIiwgZ2V0TWV0YWRhdGEpO1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0cyB0aGUgbWV0YWRhdGEgdmFsdWUgZm9yIHRoZSBwcm92aWRlZCBtZXRhZGF0YSBrZXkgb24gdGhlIHRhcmdldCBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSBtZXRhZGF0YUtleSBBIGtleSB1c2VkIHRvIHN0b3JlIGFuZCByZXRyaWV2ZSBtZXRhZGF0YS5cbiAgICAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCBvbiB3aGljaCB0aGUgbWV0YWRhdGEgaXMgZGVmaW5lZC5cbiAgICAgICAgICogQHBhcmFtIHByb3BlcnR5S2V5IChPcHRpb25hbCkgVGhlIHByb3BlcnR5IGtleSBmb3IgdGhlIHRhcmdldC5cbiAgICAgICAgICogQHJldHVybnMgVGhlIG1ldGFkYXRhIHZhbHVlIGZvciB0aGUgbWV0YWRhdGEga2V5IGlmIGZvdW5kOyBvdGhlcndpc2UsIGB1bmRlZmluZWRgLlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XG4gICAgICAgICAqICAgICAgICAgLy8gcHJvcGVydHkgZGVjbGFyYXRpb25zIGFyZSBub3QgcGFydCBvZiBFUzYsIHRob3VnaCB0aGV5IGFyZSB2YWxpZCBpbiBUeXBlU2NyaXB0OlxuICAgICAgICAgKiAgICAgICAgIC8vIHN0YXRpYyBzdGF0aWNQcm9wZXJ0eTtcbiAgICAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgICAgICBjb25zdHJ1Y3RvcihwKSB7IH1cbiAgICAgICAgICogICAgICAgICBzdGF0aWMgc3RhdGljTWV0aG9kKHApIHsgfVxuICAgICAgICAgKiAgICAgICAgIG1ldGhvZChwKSB7IH1cbiAgICAgICAgICogICAgIH1cbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE93bk1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZSk7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gY29uc3RydWN0b3IpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE93bk1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZSwgXCJzdGF0aWNQcm9wZXJ0eVwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBwcm90b3R5cGUpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE93bk1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZS5wcm90b3R5cGUsIFwicHJvcGVydHlcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBtZXRob2QgKG9uIGNvbnN0cnVjdG9yKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRPd25NZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUsIFwic3RhdGljTWV0aG9kXCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBwcm90b3R5cGUpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE93bk1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZS5wcm90b3R5cGUsIFwibWV0aG9kXCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZ2V0T3duTWV0YWRhdGEobWV0YWRhdGFLZXksIHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgICAgIGlmICghSXNPYmplY3QodGFyZ2V0KSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICBpZiAoIUlzVW5kZWZpbmVkKHByb3BlcnR5S2V5KSlcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eUtleSA9IFRvUHJvcGVydHlLZXkocHJvcGVydHlLZXkpO1xuICAgICAgICAgICAgcmV0dXJuIE9yZGluYXJ5R2V0T3duTWV0YWRhdGEobWV0YWRhdGFLZXksIHRhcmdldCwgcHJvcGVydHlLZXkpO1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydGVyKFwiZ2V0T3duTWV0YWRhdGFcIiwgZ2V0T3duTWV0YWRhdGEpO1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0cyB0aGUgbWV0YWRhdGEga2V5cyBkZWZpbmVkIG9uIHRoZSB0YXJnZXQgb2JqZWN0IG9yIGl0cyBwcm90b3R5cGUgY2hhaW4uXG4gICAgICAgICAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3Qgb24gd2hpY2ggdGhlIG1ldGFkYXRhIGlzIGRlZmluZWQuXG4gICAgICAgICAqIEBwYXJhbSBwcm9wZXJ0eUtleSAoT3B0aW9uYWwpIFRoZSBwcm9wZXJ0eSBrZXkgZm9yIHRoZSB0YXJnZXQuXG4gICAgICAgICAqIEByZXR1cm5zIEFuIGFycmF5IG9mIHVuaXF1ZSBtZXRhZGF0YSBrZXlzLlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XG4gICAgICAgICAqICAgICAgICAgLy8gcHJvcGVydHkgZGVjbGFyYXRpb25zIGFyZSBub3QgcGFydCBvZiBFUzYsIHRob3VnaCB0aGV5IGFyZSB2YWxpZCBpbiBUeXBlU2NyaXB0OlxuICAgICAgICAgKiAgICAgICAgIC8vIHN0YXRpYyBzdGF0aWNQcm9wZXJ0eTtcbiAgICAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgICAgICBjb25zdHJ1Y3RvcihwKSB7IH1cbiAgICAgICAgICogICAgICAgICBzdGF0aWMgc3RhdGljTWV0aG9kKHApIHsgfVxuICAgICAgICAgKiAgICAgICAgIG1ldGhvZChwKSB7IH1cbiAgICAgICAgICogICAgIH1cbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE1ldGFkYXRhS2V5cyhFeGFtcGxlKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBjb25zdHJ1Y3RvcilcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0TWV0YWRhdGFLZXlzKEV4YW1wbGUsIFwic3RhdGljUHJvcGVydHlcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gcHJvdG90eXBlKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRNZXRhZGF0YUtleXMoRXhhbXBsZS5wcm90b3R5cGUsIFwicHJvcGVydHlcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBtZXRob2QgKG9uIGNvbnN0cnVjdG9yKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRNZXRhZGF0YUtleXMoRXhhbXBsZSwgXCJzdGF0aWNNZXRob2RcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBtZXRob2QgKG9uIHByb3RvdHlwZSlcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0TWV0YWRhdGFLZXlzKEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldE1ldGFkYXRhS2V5cyh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgICAgICBpZiAoIUlzT2JqZWN0KHRhcmdldCkpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICAgICAgaWYgKCFJc1VuZGVmaW5lZChwcm9wZXJ0eUtleSkpXG4gICAgICAgICAgICAgICAgcHJvcGVydHlLZXkgPSBUb1Byb3BlcnR5S2V5KHByb3BlcnR5S2V5KTtcbiAgICAgICAgICAgIHJldHVybiBPcmRpbmFyeU1ldGFkYXRhS2V5cyh0YXJnZXQsIHByb3BlcnR5S2V5KTtcbiAgICAgICAgfVxuICAgICAgICBleHBvcnRlcihcImdldE1ldGFkYXRhS2V5c1wiLCBnZXRNZXRhZGF0YUtleXMpO1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0cyB0aGUgdW5pcXVlIG1ldGFkYXRhIGtleXMgZGVmaW5lZCBvbiB0aGUgdGFyZ2V0IG9iamVjdC5cbiAgICAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCBvbiB3aGljaCB0aGUgbWV0YWRhdGEgaXMgZGVmaW5lZC5cbiAgICAgICAgICogQHBhcmFtIHByb3BlcnR5S2V5IChPcHRpb25hbCkgVGhlIHByb3BlcnR5IGtleSBmb3IgdGhlIHRhcmdldC5cbiAgICAgICAgICogQHJldHVybnMgQW4gYXJyYXkgb2YgdW5pcXVlIG1ldGFkYXRhIGtleXMuXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqXG4gICAgICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcbiAgICAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eSBkZWNsYXJhdGlvbnMgYXJlIG5vdCBwYXJ0IG9mIEVTNiwgdGhvdWdoIHRoZXkgYXJlIHZhbGlkIGluIFR5cGVTY3JpcHQ6XG4gICAgICAgICAqICAgICAgICAgLy8gc3RhdGljIHN0YXRpY1Byb3BlcnR5O1xuICAgICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5O1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgICAgIGNvbnN0cnVjdG9yKHApIHsgfVxuICAgICAgICAgKiAgICAgICAgIHN0YXRpYyBzdGF0aWNNZXRob2QocCkgeyB9XG4gICAgICAgICAqICAgICAgICAgbWV0aG9kKHApIHsgfVxuICAgICAgICAgKiAgICAgfVxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gY29uc3RydWN0b3JcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0T3duTWV0YWRhdGFLZXlzKEV4YW1wbGUpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIGNvbnN0cnVjdG9yKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRPd25NZXRhZGF0YUtleXMoRXhhbXBsZSwgXCJzdGF0aWNQcm9wZXJ0eVwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBwcm90b3R5cGUpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE93bk1ldGFkYXRhS2V5cyhFeGFtcGxlLnByb3RvdHlwZSwgXCJwcm9wZXJ0eVwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIG1ldGhvZCAob24gY29uc3RydWN0b3IpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE93bk1ldGFkYXRhS2V5cyhFeGFtcGxlLCBcInN0YXRpY01ldGhvZFwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIG1ldGhvZCAob24gcHJvdG90eXBlKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRPd25NZXRhZGF0YUtleXMoRXhhbXBsZS5wcm90b3R5cGUsIFwibWV0aG9kXCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZ2V0T3duTWV0YWRhdGFLZXlzKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgICAgIGlmICghSXNPYmplY3QodGFyZ2V0KSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICBpZiAoIUlzVW5kZWZpbmVkKHByb3BlcnR5S2V5KSlcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eUtleSA9IFRvUHJvcGVydHlLZXkocHJvcGVydHlLZXkpO1xuICAgICAgICAgICAgcmV0dXJuIE9yZGluYXJ5T3duTWV0YWRhdGFLZXlzKHRhcmdldCwgcHJvcGVydHlLZXkpO1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydGVyKFwiZ2V0T3duTWV0YWRhdGFLZXlzXCIsIGdldE93bk1ldGFkYXRhS2V5cyk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWxldGVzIHRoZSBtZXRhZGF0YSBlbnRyeSBmcm9tIHRoZSB0YXJnZXQgb2JqZWN0IHdpdGggdGhlIHByb3ZpZGVkIGtleS5cbiAgICAgICAgICogQHBhcmFtIG1ldGFkYXRhS2V5IEEga2V5IHVzZWQgdG8gc3RvcmUgYW5kIHJldHJpZXZlIG1ldGFkYXRhLlxuICAgICAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IG9uIHdoaWNoIHRoZSBtZXRhZGF0YSBpcyBkZWZpbmVkLlxuICAgICAgICAgKiBAcGFyYW0gcHJvcGVydHlLZXkgKE9wdGlvbmFsKSBUaGUgcHJvcGVydHkga2V5IGZvciB0aGUgdGFyZ2V0LlxuICAgICAgICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG1ldGFkYXRhIGVudHJ5IHdhcyBmb3VuZCBhbmQgZGVsZXRlZDsgb3RoZXJ3aXNlLCBmYWxzZS5cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xuICAgICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5IGRlY2xhcmF0aW9ucyBhcmUgbm90IHBhcnQgb2YgRVM2LCB0aG91Z2ggdGhleSBhcmUgdmFsaWQgaW4gVHlwZVNjcmlwdDpcbiAgICAgICAgICogICAgICAgICAvLyBzdGF0aWMgc3RhdGljUHJvcGVydHk7XG4gICAgICAgICAqICAgICAgICAgLy8gcHJvcGVydHk7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAgICAgY29uc3RydWN0b3IocCkgeyB9XG4gICAgICAgICAqICAgICAgICAgc3RhdGljIHN0YXRpY01ldGhvZChwKSB7IH1cbiAgICAgICAgICogICAgICAgICBtZXRob2QocCkgeyB9XG4gICAgICAgICAqICAgICB9XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBjb25zdHJ1Y3RvclxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5kZWxldGVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIGNvbnN0cnVjdG9yKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5kZWxldGVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUsIFwic3RhdGljUHJvcGVydHlcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gcHJvdG90eXBlKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5kZWxldGVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUucHJvdG90eXBlLCBcInByb3BlcnR5XCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBjb25zdHJ1Y3RvcilcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZGVsZXRlTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLCBcInN0YXRpY01ldGhvZFwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIG1ldGhvZCAob24gcHJvdG90eXBlKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5kZWxldGVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGRlbGV0ZU1ldGFkYXRhKG1ldGFkYXRhS2V5LCB0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgICAgICBpZiAoIUlzT2JqZWN0KHRhcmdldCkpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICAgICAgaWYgKCFJc1VuZGVmaW5lZChwcm9wZXJ0eUtleSkpXG4gICAgICAgICAgICAgICAgcHJvcGVydHlLZXkgPSBUb1Byb3BlcnR5S2V5KHByb3BlcnR5S2V5KTtcbiAgICAgICAgICAgIHZhciBtZXRhZGF0YU1hcCA9IEdldE9yQ3JlYXRlTWV0YWRhdGFNYXAodGFyZ2V0LCBwcm9wZXJ0eUtleSwgLypDcmVhdGUqLyBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoSXNVbmRlZmluZWQobWV0YWRhdGFNYXApKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGlmICghbWV0YWRhdGFNYXAuZGVsZXRlKG1ldGFkYXRhS2V5KSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBpZiAobWV0YWRhdGFNYXAuc2l6ZSA+IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0TWV0YWRhdGEgPSBNZXRhZGF0YS5nZXQodGFyZ2V0KTtcbiAgICAgICAgICAgIHRhcmdldE1ldGFkYXRhLmRlbGV0ZShwcm9wZXJ0eUtleSk7XG4gICAgICAgICAgICBpZiAodGFyZ2V0TWV0YWRhdGEuc2l6ZSA+IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBNZXRhZGF0YS5kZWxldGUodGFyZ2V0KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydGVyKFwiZGVsZXRlTWV0YWRhdGFcIiwgZGVsZXRlTWV0YWRhdGEpO1xuICAgICAgICBmdW5jdGlvbiBEZWNvcmF0ZUNvbnN0cnVjdG9yKGRlY29yYXRvcnMsIHRhcmdldCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVjb3JhdG9yID0gZGVjb3JhdG9yc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgZGVjb3JhdGVkID0gZGVjb3JhdG9yKHRhcmdldCk7XG4gICAgICAgICAgICAgICAgaWYgKCFJc1VuZGVmaW5lZChkZWNvcmF0ZWQpICYmICFJc051bGwoZGVjb3JhdGVkKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIUlzQ29uc3RydWN0b3IoZGVjb3JhdGVkKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gZGVjb3JhdGVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gRGVjb3JhdGVQcm9wZXJ0eShkZWNvcmF0b3JzLCB0YXJnZXQsIHByb3BlcnR5S2V5LCBkZXNjcmlwdG9yKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICAgICAgICAgIHZhciBkZWNvcmF0b3IgPSBkZWNvcmF0b3JzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBkZWNvcmF0ZWQgPSBkZWNvcmF0b3IodGFyZ2V0LCBwcm9wZXJ0eUtleSwgZGVzY3JpcHRvcik7XG4gICAgICAgICAgICAgICAgaWYgKCFJc1VuZGVmaW5lZChkZWNvcmF0ZWQpICYmICFJc051bGwoZGVjb3JhdGVkKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIUlzT2JqZWN0KGRlY29yYXRlZCkpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0b3IgPSBkZWNvcmF0ZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gR2V0T3JDcmVhdGVNZXRhZGF0YU1hcChPLCBQLCBDcmVhdGUpIHtcbiAgICAgICAgICAgIHZhciB0YXJnZXRNZXRhZGF0YSA9IE1ldGFkYXRhLmdldChPKTtcbiAgICAgICAgICAgIGlmIChJc1VuZGVmaW5lZCh0YXJnZXRNZXRhZGF0YSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIUNyZWF0ZSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB0YXJnZXRNZXRhZGF0YSA9IG5ldyBfTWFwKCk7XG4gICAgICAgICAgICAgICAgTWV0YWRhdGEuc2V0KE8sIHRhcmdldE1ldGFkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBtZXRhZGF0YU1hcCA9IHRhcmdldE1ldGFkYXRhLmdldChQKTtcbiAgICAgICAgICAgIGlmIChJc1VuZGVmaW5lZChtZXRhZGF0YU1hcCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIUNyZWF0ZSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBtZXRhZGF0YU1hcCA9IG5ldyBfTWFwKCk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0TWV0YWRhdGEuc2V0KFAsIG1ldGFkYXRhTWFwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtZXRhZGF0YU1hcDtcbiAgICAgICAgfVxuICAgICAgICAvLyAzLjEuMS4xIE9yZGluYXJ5SGFzTWV0YWRhdGEoTWV0YWRhdGFLZXksIE8sIFApXG4gICAgICAgIC8vIGh0dHBzOi8vcmJ1Y2t0b24uZ2l0aHViLmlvL3JlZmxlY3QtbWV0YWRhdGEvI29yZGluYXJ5aGFzbWV0YWRhdGFcbiAgICAgICAgZnVuY3Rpb24gT3JkaW5hcnlIYXNNZXRhZGF0YShNZXRhZGF0YUtleSwgTywgUCkge1xuICAgICAgICAgICAgdmFyIGhhc093biA9IE9yZGluYXJ5SGFzT3duTWV0YWRhdGEoTWV0YWRhdGFLZXksIE8sIFApO1xuICAgICAgICAgICAgaWYgKGhhc093bilcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBPcmRpbmFyeUdldFByb3RvdHlwZU9mKE8pO1xuICAgICAgICAgICAgaWYgKCFJc051bGwocGFyZW50KSlcbiAgICAgICAgICAgICAgICByZXR1cm4gT3JkaW5hcnlIYXNNZXRhZGF0YShNZXRhZGF0YUtleSwgcGFyZW50LCBQKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLyAzLjEuMi4xIE9yZGluYXJ5SGFzT3duTWV0YWRhdGEoTWV0YWRhdGFLZXksIE8sIFApXG4gICAgICAgIC8vIGh0dHBzOi8vcmJ1Y2t0b24uZ2l0aHViLmlvL3JlZmxlY3QtbWV0YWRhdGEvI29yZGluYXJ5aGFzb3dubWV0YWRhdGFcbiAgICAgICAgZnVuY3Rpb24gT3JkaW5hcnlIYXNPd25NZXRhZGF0YShNZXRhZGF0YUtleSwgTywgUCkge1xuICAgICAgICAgICAgdmFyIG1ldGFkYXRhTWFwID0gR2V0T3JDcmVhdGVNZXRhZGF0YU1hcChPLCBQLCAvKkNyZWF0ZSovIGZhbHNlKTtcbiAgICAgICAgICAgIGlmIChJc1VuZGVmaW5lZChtZXRhZGF0YU1hcCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIFRvQm9vbGVhbihtZXRhZGF0YU1hcC5oYXMoTWV0YWRhdGFLZXkpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyAzLjEuMy4xIE9yZGluYXJ5R2V0TWV0YWRhdGEoTWV0YWRhdGFLZXksIE8sIFApXG4gICAgICAgIC8vIGh0dHBzOi8vcmJ1Y2t0b24uZ2l0aHViLmlvL3JlZmxlY3QtbWV0YWRhdGEvI29yZGluYXJ5Z2V0bWV0YWRhdGFcbiAgICAgICAgZnVuY3Rpb24gT3JkaW5hcnlHZXRNZXRhZGF0YShNZXRhZGF0YUtleSwgTywgUCkge1xuICAgICAgICAgICAgdmFyIGhhc093biA9IE9yZGluYXJ5SGFzT3duTWV0YWRhdGEoTWV0YWRhdGFLZXksIE8sIFApO1xuICAgICAgICAgICAgaWYgKGhhc093bilcbiAgICAgICAgICAgICAgICByZXR1cm4gT3JkaW5hcnlHZXRPd25NZXRhZGF0YShNZXRhZGF0YUtleSwgTywgUCk7XG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gT3JkaW5hcnlHZXRQcm90b3R5cGVPZihPKTtcbiAgICAgICAgICAgIGlmICghSXNOdWxsKHBhcmVudCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9yZGluYXJ5R2V0TWV0YWRhdGEoTWV0YWRhdGFLZXksIHBhcmVudCwgUCk7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIC8vIDMuMS40LjEgT3JkaW5hcnlHZXRPd25NZXRhZGF0YShNZXRhZGF0YUtleSwgTywgUClcbiAgICAgICAgLy8gaHR0cHM6Ly9yYnVja3Rvbi5naXRodWIuaW8vcmVmbGVjdC1tZXRhZGF0YS8jb3JkaW5hcnlnZXRvd25tZXRhZGF0YVxuICAgICAgICBmdW5jdGlvbiBPcmRpbmFyeUdldE93bk1ldGFkYXRhKE1ldGFkYXRhS2V5LCBPLCBQKSB7XG4gICAgICAgICAgICB2YXIgbWV0YWRhdGFNYXAgPSBHZXRPckNyZWF0ZU1ldGFkYXRhTWFwKE8sIFAsIC8qQ3JlYXRlKi8gZmFsc2UpO1xuICAgICAgICAgICAgaWYgKElzVW5kZWZpbmVkKG1ldGFkYXRhTWFwKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcmV0dXJuIG1ldGFkYXRhTWFwLmdldChNZXRhZGF0YUtleSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gMy4xLjUuMSBPcmRpbmFyeURlZmluZU93bk1ldGFkYXRhKE1ldGFkYXRhS2V5LCBNZXRhZGF0YVZhbHVlLCBPLCBQKVxuICAgICAgICAvLyBodHRwczovL3JidWNrdG9uLmdpdGh1Yi5pby9yZWZsZWN0LW1ldGFkYXRhLyNvcmRpbmFyeWRlZmluZW93bm1ldGFkYXRhXG4gICAgICAgIGZ1bmN0aW9uIE9yZGluYXJ5RGVmaW5lT3duTWV0YWRhdGEoTWV0YWRhdGFLZXksIE1ldGFkYXRhVmFsdWUsIE8sIFApIHtcbiAgICAgICAgICAgIHZhciBtZXRhZGF0YU1hcCA9IEdldE9yQ3JlYXRlTWV0YWRhdGFNYXAoTywgUCwgLypDcmVhdGUqLyB0cnVlKTtcbiAgICAgICAgICAgIG1ldGFkYXRhTWFwLnNldChNZXRhZGF0YUtleSwgTWV0YWRhdGFWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gMy4xLjYuMSBPcmRpbmFyeU1ldGFkYXRhS2V5cyhPLCBQKVxuICAgICAgICAvLyBodHRwczovL3JidWNrdG9uLmdpdGh1Yi5pby9yZWZsZWN0LW1ldGFkYXRhLyNvcmRpbmFyeW1ldGFkYXRha2V5c1xuICAgICAgICBmdW5jdGlvbiBPcmRpbmFyeU1ldGFkYXRhS2V5cyhPLCBQKSB7XG4gICAgICAgICAgICB2YXIgb3duS2V5cyA9IE9yZGluYXJ5T3duTWV0YWRhdGFLZXlzKE8sIFApO1xuICAgICAgICAgICAgdmFyIHBhcmVudCA9IE9yZGluYXJ5R2V0UHJvdG90eXBlT2YoTyk7XG4gICAgICAgICAgICBpZiAocGFyZW50ID09PSBudWxsKVxuICAgICAgICAgICAgICAgIHJldHVybiBvd25LZXlzO1xuICAgICAgICAgICAgdmFyIHBhcmVudEtleXMgPSBPcmRpbmFyeU1ldGFkYXRhS2V5cyhwYXJlbnQsIFApO1xuICAgICAgICAgICAgaWYgKHBhcmVudEtleXMubGVuZ3RoIDw9IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIG93bktleXM7XG4gICAgICAgICAgICBpZiAob3duS2V5cy5sZW5ndGggPD0gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50S2V5cztcbiAgICAgICAgICAgIHZhciBzZXQgPSBuZXcgX1NldCgpO1xuICAgICAgICAgICAgdmFyIGtleXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgb3duS2V5c18xID0gb3duS2V5czsgX2kgPCBvd25LZXlzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IG93bktleXNfMVtfaV07XG4gICAgICAgICAgICAgICAgdmFyIGhhc0tleSA9IHNldC5oYXMoa2V5KTtcbiAgICAgICAgICAgICAgICBpZiAoIWhhc0tleSkge1xuICAgICAgICAgICAgICAgICAgICBzZXQuYWRkKGtleSk7XG4gICAgICAgICAgICAgICAgICAgIGtleXMucHVzaChrZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIF9hID0gMCwgcGFyZW50S2V5c18xID0gcGFyZW50S2V5czsgX2EgPCBwYXJlbnRLZXlzXzEubGVuZ3RoOyBfYSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IHBhcmVudEtleXNfMVtfYV07XG4gICAgICAgICAgICAgICAgdmFyIGhhc0tleSA9IHNldC5oYXMoa2V5KTtcbiAgICAgICAgICAgICAgICBpZiAoIWhhc0tleSkge1xuICAgICAgICAgICAgICAgICAgICBzZXQuYWRkKGtleSk7XG4gICAgICAgICAgICAgICAgICAgIGtleXMucHVzaChrZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBrZXlzO1xuICAgICAgICB9XG4gICAgICAgIC8vIDMuMS43LjEgT3JkaW5hcnlPd25NZXRhZGF0YUtleXMoTywgUClcbiAgICAgICAgLy8gaHR0cHM6Ly9yYnVja3Rvbi5naXRodWIuaW8vcmVmbGVjdC1tZXRhZGF0YS8jb3JkaW5hcnlvd25tZXRhZGF0YWtleXNcbiAgICAgICAgZnVuY3Rpb24gT3JkaW5hcnlPd25NZXRhZGF0YUtleXMoTywgUCkge1xuICAgICAgICAgICAgdmFyIGtleXMgPSBbXTtcbiAgICAgICAgICAgIHZhciBtZXRhZGF0YU1hcCA9IEdldE9yQ3JlYXRlTWV0YWRhdGFNYXAoTywgUCwgLypDcmVhdGUqLyBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoSXNVbmRlZmluZWQobWV0YWRhdGFNYXApKVxuICAgICAgICAgICAgICAgIHJldHVybiBrZXlzO1xuICAgICAgICAgICAgdmFyIGtleXNPYmogPSBtZXRhZGF0YU1hcC5rZXlzKCk7XG4gICAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBHZXRJdGVyYXRvcihrZXlzT2JqKTtcbiAgICAgICAgICAgIHZhciBrID0gMDtcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5leHQgPSBJdGVyYXRvclN0ZXAoaXRlcmF0b3IpO1xuICAgICAgICAgICAgICAgIGlmICghbmV4dCkge1xuICAgICAgICAgICAgICAgICAgICBrZXlzLmxlbmd0aCA9IGs7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXlzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgbmV4dFZhbHVlID0gSXRlcmF0b3JWYWx1ZShuZXh0KTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBrZXlzW2tdID0gbmV4dFZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgSXRlcmF0b3JDbG9zZShpdGVyYXRvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGsrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyA2IEVDTUFTY3JpcHQgRGF0YSBUeXAwZXMgYW5kIFZhbHVlc1xuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1lY21hc2NyaXB0LWRhdGEtdHlwZXMtYW5kLXZhbHVlc1xuICAgICAgICBmdW5jdGlvbiBUeXBlKHgpIHtcbiAgICAgICAgICAgIGlmICh4ID09PSBudWxsKVxuICAgICAgICAgICAgICAgIHJldHVybiAxIC8qIE51bGwgKi87XG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGVvZiB4KSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcInVuZGVmaW5lZFwiOiByZXR1cm4gMCAvKiBVbmRlZmluZWQgKi87XG4gICAgICAgICAgICAgICAgY2FzZSBcImJvb2xlYW5cIjogcmV0dXJuIDIgLyogQm9vbGVhbiAqLztcbiAgICAgICAgICAgICAgICBjYXNlIFwic3RyaW5nXCI6IHJldHVybiAzIC8qIFN0cmluZyAqLztcbiAgICAgICAgICAgICAgICBjYXNlIFwic3ltYm9sXCI6IHJldHVybiA0IC8qIFN5bWJvbCAqLztcbiAgICAgICAgICAgICAgICBjYXNlIFwibnVtYmVyXCI6IHJldHVybiA1IC8qIE51bWJlciAqLztcbiAgICAgICAgICAgICAgICBjYXNlIFwib2JqZWN0XCI6IHJldHVybiB4ID09PSBudWxsID8gMSAvKiBOdWxsICovIDogNiAvKiBPYmplY3QgKi87XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogcmV0dXJuIDYgLyogT2JqZWN0ICovO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIDYuMS4xIFRoZSBVbmRlZmluZWQgVHlwZVxuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzLXVuZGVmaW5lZC10eXBlXG4gICAgICAgIGZ1bmN0aW9uIElzVW5kZWZpbmVkKHgpIHtcbiAgICAgICAgICAgIHJldHVybiB4ID09PSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gNi4xLjIgVGhlIE51bGwgVHlwZVxuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzLW51bGwtdHlwZVxuICAgICAgICBmdW5jdGlvbiBJc051bGwoeCkge1xuICAgICAgICAgICAgcmV0dXJuIHggPT09IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gNi4xLjUgVGhlIFN5bWJvbCBUeXBlXG4gICAgICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMtc3ltYm9sLXR5cGVcbiAgICAgICAgZnVuY3Rpb24gSXNTeW1ib2woeCkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSBcInN5bWJvbFwiO1xuICAgICAgICB9XG4gICAgICAgIC8vIDYuMS43IFRoZSBPYmplY3QgVHlwZVxuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QtdHlwZVxuICAgICAgICBmdW5jdGlvbiBJc09iamVjdCh4KSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHggPT09IFwib2JqZWN0XCIgPyB4ICE9PSBudWxsIDogdHlwZW9mIHggPT09IFwiZnVuY3Rpb25cIjtcbiAgICAgICAgfVxuICAgICAgICAvLyA3LjEgVHlwZSBDb252ZXJzaW9uXG4gICAgICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXR5cGUtY29udmVyc2lvblxuICAgICAgICAvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbiAgICAgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdG9wcmltaXRpdmVcbiAgICAgICAgZnVuY3Rpb24gVG9QcmltaXRpdmUoaW5wdXQsIFByZWZlcnJlZFR5cGUpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoVHlwZShpbnB1dCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDAgLyogVW5kZWZpbmVkICovOiByZXR1cm4gaW5wdXQ7XG4gICAgICAgICAgICAgICAgY2FzZSAxIC8qIE51bGwgKi86IHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgICAgICBjYXNlIDIgLyogQm9vbGVhbiAqLzogcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgICAgIGNhc2UgMyAvKiBTdHJpbmcgKi86IHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgICAgICBjYXNlIDQgLyogU3ltYm9sICovOiByZXR1cm4gaW5wdXQ7XG4gICAgICAgICAgICAgICAgY2FzZSA1IC8qIE51bWJlciAqLzogcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGhpbnQgPSBQcmVmZXJyZWRUeXBlID09PSAzIC8qIFN0cmluZyAqLyA/IFwic3RyaW5nXCIgOiBQcmVmZXJyZWRUeXBlID09PSA1IC8qIE51bWJlciAqLyA/IFwibnVtYmVyXCIgOiBcImRlZmF1bHRcIjtcbiAgICAgICAgICAgIHZhciBleG90aWNUb1ByaW0gPSBHZXRNZXRob2QoaW5wdXQsIHRvUHJpbWl0aXZlU3ltYm9sKTtcbiAgICAgICAgICAgIGlmIChleG90aWNUb1ByaW0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBleG90aWNUb1ByaW0uY2FsbChpbnB1dCwgaGludCk7XG4gICAgICAgICAgICAgICAgaWYgKElzT2JqZWN0KHJlc3VsdCkpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIE9yZGluYXJ5VG9QcmltaXRpdmUoaW5wdXQsIGhpbnQgPT09IFwiZGVmYXVsdFwiID8gXCJudW1iZXJcIiA6IGhpbnQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIDcuMS4xLjEgT3JkaW5hcnlUb1ByaW1pdGl2ZShPLCBoaW50KVxuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vcmRpbmFyeXRvcHJpbWl0aXZlXG4gICAgICAgIGZ1bmN0aW9uIE9yZGluYXJ5VG9QcmltaXRpdmUoTywgaGludCkge1xuICAgICAgICAgICAgaWYgKGhpbnQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgdG9TdHJpbmdfMSA9IE8udG9TdHJpbmc7XG4gICAgICAgICAgICAgICAgaWYgKElzQ2FsbGFibGUodG9TdHJpbmdfMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRvU3RyaW5nXzEuY2FsbChPKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFJc09iamVjdChyZXN1bHQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlT2YgPSBPLnZhbHVlT2Y7XG4gICAgICAgICAgICAgICAgaWYgKElzQ2FsbGFibGUodmFsdWVPZikpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHZhbHVlT2YuY2FsbChPKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFJc09iamVjdChyZXN1bHQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWVPZiA9IE8udmFsdWVPZjtcbiAgICAgICAgICAgICAgICBpZiAoSXNDYWxsYWJsZSh2YWx1ZU9mKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gdmFsdWVPZi5jYWxsKE8pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIUlzT2JqZWN0KHJlc3VsdCkpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgdG9TdHJpbmdfMiA9IE8udG9TdHJpbmc7XG4gICAgICAgICAgICAgICAgaWYgKElzQ2FsbGFibGUodG9TdHJpbmdfMikpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRvU3RyaW5nXzIuY2FsbChPKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFJc09iamVjdChyZXN1bHQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gNy4xLjIgVG9Cb29sZWFuKGFyZ3VtZW50KVxuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvMjAxNi8jc2VjLXRvYm9vbGVhblxuICAgICAgICBmdW5jdGlvbiBUb0Jvb2xlYW4oYXJndW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiAhIWFyZ3VtZW50O1xuICAgICAgICB9XG4gICAgICAgIC8vIDcuMS4xMiBUb1N0cmluZyhhcmd1bWVudClcbiAgICAgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdG9zdHJpbmdcbiAgICAgICAgZnVuY3Rpb24gVG9TdHJpbmcoYXJndW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiICsgYXJndW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gNy4xLjE0IFRvUHJvcGVydHlLZXkoYXJndW1lbnQpXG4gICAgICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXRvcHJvcGVydHlrZXlcbiAgICAgICAgZnVuY3Rpb24gVG9Qcm9wZXJ0eUtleShhcmd1bWVudCkge1xuICAgICAgICAgICAgdmFyIGtleSA9IFRvUHJpbWl0aXZlKGFyZ3VtZW50LCAzIC8qIFN0cmluZyAqLyk7XG4gICAgICAgICAgICBpZiAoSXNTeW1ib2woa2V5KSlcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgICAgICAgcmV0dXJuIFRvU3RyaW5nKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gNy4yIFRlc3RpbmcgYW5kIENvbXBhcmlzb24gT3BlcmF0aW9uc1xuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy10ZXN0aW5nLWFuZC1jb21wYXJpc29uLW9wZXJhdGlvbnNcbiAgICAgICAgLy8gNy4yLjIgSXNBcnJheShhcmd1bWVudClcbiAgICAgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtaXNhcnJheVxuICAgICAgICBmdW5jdGlvbiBJc0FycmF5KGFyZ3VtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkuaXNBcnJheVxuICAgICAgICAgICAgICAgID8gQXJyYXkuaXNBcnJheShhcmd1bWVudClcbiAgICAgICAgICAgICAgICA6IGFyZ3VtZW50IGluc3RhbmNlb2YgT2JqZWN0XG4gICAgICAgICAgICAgICAgICAgID8gYXJndW1lbnQgaW5zdGFuY2VvZiBBcnJheVxuICAgICAgICAgICAgICAgICAgICA6IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmd1bWVudCkgPT09IFwiW29iamVjdCBBcnJheV1cIjtcbiAgICAgICAgfVxuICAgICAgICAvLyA3LjIuMyBJc0NhbGxhYmxlKGFyZ3VtZW50KVxuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1pc2NhbGxhYmxlXG4gICAgICAgIGZ1bmN0aW9uIElzQ2FsbGFibGUoYXJndW1lbnQpIHtcbiAgICAgICAgICAgIC8vIE5PVEU6IFRoaXMgaXMgYW4gYXBwcm94aW1hdGlvbiBhcyB3ZSBjYW5ub3QgY2hlY2sgZm9yIFtbQ2FsbF1dIGludGVybmFsIG1ldGhvZC5cbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYXJndW1lbnQgPT09IFwiZnVuY3Rpb25cIjtcbiAgICAgICAgfVxuICAgICAgICAvLyA3LjIuNCBJc0NvbnN0cnVjdG9yKGFyZ3VtZW50KVxuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1pc2NvbnN0cnVjdG9yXG4gICAgICAgIGZ1bmN0aW9uIElzQ29uc3RydWN0b3IoYXJndW1lbnQpIHtcbiAgICAgICAgICAgIC8vIE5PVEU6IFRoaXMgaXMgYW4gYXBwcm94aW1hdGlvbiBhcyB3ZSBjYW5ub3QgY2hlY2sgZm9yIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgbWV0aG9kLlxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBhcmd1bWVudCA9PT0gXCJmdW5jdGlvblwiO1xuICAgICAgICB9XG4gICAgICAgIC8vIDcuMi43IElzUHJvcGVydHlLZXkoYXJndW1lbnQpXG4gICAgICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWlzcHJvcGVydHlrZXlcbiAgICAgICAgZnVuY3Rpb24gSXNQcm9wZXJ0eUtleShhcmd1bWVudCkge1xuICAgICAgICAgICAgc3dpdGNoIChUeXBlKGFyZ3VtZW50KSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMyAvKiBTdHJpbmcgKi86IHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNCAvKiBTeW1ib2wgKi86IHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyA3LjMgT3BlcmF0aW9ucyBvbiBPYmplY3RzXG4gICAgICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9wZXJhdGlvbnMtb24tb2JqZWN0c1xuICAgICAgICAvLyA3LjMuOSBHZXRNZXRob2QoViwgUClcbiAgICAgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZ2V0bWV0aG9kXG4gICAgICAgIGZ1bmN0aW9uIEdldE1ldGhvZChWLCBQKSB7XG4gICAgICAgICAgICB2YXIgZnVuYyA9IFZbUF07XG4gICAgICAgICAgICBpZiAoZnVuYyA9PT0gdW5kZWZpbmVkIHx8IGZ1bmMgPT09IG51bGwpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmICghSXNDYWxsYWJsZShmdW5jKSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICByZXR1cm4gZnVuYztcbiAgICAgICAgfVxuICAgICAgICAvLyA3LjQgT3BlcmF0aW9ucyBvbiBJdGVyYXRvciBPYmplY3RzXG4gICAgICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9wZXJhdGlvbnMtb24taXRlcmF0b3Itb2JqZWN0c1xuICAgICAgICBmdW5jdGlvbiBHZXRJdGVyYXRvcihvYmopIHtcbiAgICAgICAgICAgIHZhciBtZXRob2QgPSBHZXRNZXRob2Qob2JqLCBpdGVyYXRvclN5bWJvbCk7XG4gICAgICAgICAgICBpZiAoIUlzQ2FsbGFibGUobWV0aG9kKSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7IC8vIGZyb20gQ2FsbFxuICAgICAgICAgICAgdmFyIGl0ZXJhdG9yID0gbWV0aG9kLmNhbGwob2JqKTtcbiAgICAgICAgICAgIGlmICghSXNPYmplY3QoaXRlcmF0b3IpKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgIHJldHVybiBpdGVyYXRvcjtcbiAgICAgICAgfVxuICAgICAgICAvLyA3LjQuNCBJdGVyYXRvclZhbHVlKGl0ZXJSZXN1bHQpXG4gICAgICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8yMDE2LyNzZWMtaXRlcmF0b3J2YWx1ZVxuICAgICAgICBmdW5jdGlvbiBJdGVyYXRvclZhbHVlKGl0ZXJSZXN1bHQpIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVyUmVzdWx0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIDcuNC41IEl0ZXJhdG9yU3RlcChpdGVyYXRvcilcbiAgICAgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtaXRlcmF0b3JzdGVwXG4gICAgICAgIGZ1bmN0aW9uIEl0ZXJhdG9yU3RlcChpdGVyYXRvcikge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IGZhbHNlIDogcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gICAgICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWl0ZXJhdG9yY2xvc2VcbiAgICAgICAgZnVuY3Rpb24gSXRlcmF0b3JDbG9zZShpdGVyYXRvcikge1xuICAgICAgICAgICAgdmFyIGYgPSBpdGVyYXRvcltcInJldHVyblwiXTtcbiAgICAgICAgICAgIGlmIChmKVxuICAgICAgICAgICAgICAgIGYuY2FsbChpdGVyYXRvcik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gOS4xIE9yZGluYXJ5IE9iamVjdCBJbnRlcm5hbCBNZXRob2RzIGFuZCBJbnRlcm5hbCBTbG90c1xuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vcmRpbmFyeS1vYmplY3QtaW50ZXJuYWwtbWV0aG9kcy1hbmQtaW50ZXJuYWwtc2xvdHNcbiAgICAgICAgLy8gOS4xLjEuMSBPcmRpbmFyeUdldFByb3RvdHlwZU9mKE8pXG4gICAgICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9yZGluYXJ5Z2V0cHJvdG90eXBlb2ZcbiAgICAgICAgZnVuY3Rpb24gT3JkaW5hcnlHZXRQcm90b3R5cGVPZihPKSB7XG4gICAgICAgICAgICB2YXIgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTyk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIE8gIT09IFwiZnVuY3Rpb25cIiB8fCBPID09PSBmdW5jdGlvblByb3RvdHlwZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvdG87XG4gICAgICAgICAgICAvLyBUeXBlU2NyaXB0IGRvZXNuJ3Qgc2V0IF9fcHJvdG9fXyBpbiBFUzUsIGFzIGl0J3Mgbm9uLXN0YW5kYXJkLlxuICAgICAgICAgICAgLy8gVHJ5IHRvIGRldGVybWluZSB0aGUgc3VwZXJjbGFzcyBjb25zdHJ1Y3Rvci4gQ29tcGF0aWJsZSBpbXBsZW1lbnRhdGlvbnNcbiAgICAgICAgICAgIC8vIG11c3QgZWl0aGVyIHNldCBfX3Byb3RvX18gb24gYSBzdWJjbGFzcyBjb25zdHJ1Y3RvciB0byB0aGUgc3VwZXJjbGFzcyBjb25zdHJ1Y3RvcixcbiAgICAgICAgICAgIC8vIG9yIGVuc3VyZSBlYWNoIGNsYXNzIGhhcyBhIHZhbGlkIGBjb25zdHJ1Y3RvcmAgcHJvcGVydHkgb24gaXRzIHByb3RvdHlwZSB0aGF0XG4gICAgICAgICAgICAvLyBwb2ludHMgYmFjayB0byB0aGUgY29uc3RydWN0b3IuXG4gICAgICAgICAgICAvLyBJZiB0aGlzIGlzIG5vdCB0aGUgc2FtZSBhcyBGdW5jdGlvbi5bW1Byb3RvdHlwZV1dLCB0aGVuIHRoaXMgaXMgZGVmaW5hdGVseSBpbmhlcml0ZWQuXG4gICAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBjYXNlIHdoZW4gaW4gRVM2IG9yIHdoZW4gdXNpbmcgX19wcm90b19fIGluIGEgY29tcGF0aWJsZSBicm93c2VyLlxuICAgICAgICAgICAgaWYgKHByb3RvICE9PSBmdW5jdGlvblByb3RvdHlwZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvdG87XG4gICAgICAgICAgICAvLyBJZiB0aGUgc3VwZXIgcHJvdG90eXBlIGlzIE9iamVjdC5wcm90b3R5cGUsIG51bGwsIG9yIHVuZGVmaW5lZCwgdGhlbiB3ZSBjYW5ub3QgZGV0ZXJtaW5lIHRoZSBoZXJpdGFnZS5cbiAgICAgICAgICAgIHZhciBwcm90b3R5cGUgPSBPLnByb3RvdHlwZTtcbiAgICAgICAgICAgIHZhciBwcm90b3R5cGVQcm90byA9IHByb3RvdHlwZSAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG90eXBlKTtcbiAgICAgICAgICAgIGlmIChwcm90b3R5cGVQcm90byA9PSBudWxsIHx8IHByb3RvdHlwZVByb3RvID09PSBPYmplY3QucHJvdG90eXBlKVxuICAgICAgICAgICAgICAgIHJldHVybiBwcm90bztcbiAgICAgICAgICAgIC8vIElmIHRoZSBjb25zdHJ1Y3RvciB3YXMgbm90IGEgZnVuY3Rpb24sIHRoZW4gd2UgY2Fubm90IGRldGVybWluZSB0aGUgaGVyaXRhZ2UuXG4gICAgICAgICAgICB2YXIgY29uc3RydWN0b3IgPSBwcm90b3R5cGVQcm90by5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc3RydWN0b3IgIT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvdG87XG4gICAgICAgICAgICAvLyBJZiB3ZSBoYXZlIHNvbWUga2luZCBvZiBzZWxmLXJlZmVyZW5jZSwgdGhlbiB3ZSBjYW5ub3QgZGV0ZXJtaW5lIHRoZSBoZXJpdGFnZS5cbiAgICAgICAgICAgIGlmIChjb25zdHJ1Y3RvciA9PT0gTylcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvdG87XG4gICAgICAgICAgICAvLyB3ZSBoYXZlIGEgcHJldHR5IGdvb2QgZ3Vlc3MgYXQgdGhlIGhlcml0YWdlLlxuICAgICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yO1xuICAgICAgICB9XG4gICAgICAgIC8vIG5haXZlIE1hcCBzaGltXG4gICAgICAgIGZ1bmN0aW9uIENyZWF0ZU1hcFBvbHlmaWxsKCkge1xuICAgICAgICAgICAgdmFyIGNhY2hlU2VudGluZWwgPSB7fTtcbiAgICAgICAgICAgIHZhciBhcnJheVNlbnRpbmVsID0gW107XG4gICAgICAgICAgICB2YXIgTWFwSXRlcmF0b3IgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gTWFwSXRlcmF0b3Ioa2V5cywgdmFsdWVzLCBzZWxlY3Rvcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleXMgPSBrZXlzO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXMgPSB2YWx1ZXM7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdG9yID0gc2VsZWN0b3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIE1hcEl0ZXJhdG9yLnByb3RvdHlwZVtcIkBAaXRlcmF0b3JcIl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuICAgICAgICAgICAgICAgIE1hcEl0ZXJhdG9yLnByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuICAgICAgICAgICAgICAgIE1hcEl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9pbmRleDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IDAgJiYgaW5kZXggPCB0aGlzLl9rZXlzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuX3NlbGVjdG9yKHRoaXMuX2tleXNbaW5kZXhdLCB0aGlzLl92YWx1ZXNbaW5kZXhdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCArIDEgPj0gdGhpcy5fa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbmRleCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleXMgPSBhcnJheVNlbnRpbmVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlcyA9IGFycmF5U2VudGluZWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IHJlc3VsdCwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBNYXBJdGVyYXRvci5wcm90b3R5cGUudGhyb3cgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2luZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2luZGV4ID0gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXlzID0gYXJyYXlTZW50aW5lbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlcyA9IGFycmF5U2VudGluZWw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBNYXBJdGVyYXRvci5wcm90b3R5cGUucmV0dXJuID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbmRleCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fa2V5cyA9IGFycmF5U2VudGluZWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXMgPSBhcnJheVNlbnRpbmVsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiB2YWx1ZSwgZG9uZTogdHJ1ZSB9O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hcEl0ZXJhdG9yO1xuICAgICAgICAgICAgfSgpKTtcbiAgICAgICAgICAgIHJldHVybiAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gTWFwKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXlzID0gW107XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZUtleSA9IGNhY2hlU2VudGluZWw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlSW5kZXggPSAtMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hcC5wcm90b3R5cGUsIFwic2l6ZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fa2V5cy5sZW5ndGg7IH0sXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gdGhpcy5fZmluZChrZXksIC8qaW5zZXJ0Ki8gZmFsc2UpID49IDA7IH07XG4gICAgICAgICAgICAgICAgTWFwLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuX2ZpbmQoa2V5LCAvKmluc2VydCovIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluZGV4ID49IDAgPyB0aGlzLl92YWx1ZXNbaW5kZXhdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgTWFwLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9maW5kKGtleSwgLyppbnNlcnQqLyB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmFsdWVzW2luZGV4XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9maW5kKGtleSwgLyppbnNlcnQqLyBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2l6ZSA9IHRoaXMuX2tleXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IGluZGV4ICsgMTsgaSA8IHNpemU7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleXNbaSAtIDFdID0gdGhpcy5fa2V5c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXNbaSAtIDFdID0gdGhpcy5fdmFsdWVzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fa2V5cy5sZW5ndGgtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlcy5sZW5ndGgtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IHRoaXMuX2NhY2hlS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FjaGVLZXkgPSBjYWNoZVNlbnRpbmVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlSW5kZXggPSAtMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleXMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmFsdWVzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlS2V5ID0gY2FjaGVTZW50aW5lbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FjaGVJbmRleCA9IC0yO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgTWFwLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IE1hcEl0ZXJhdG9yKHRoaXMuX2tleXMsIHRoaXMuX3ZhbHVlcywgZ2V0S2V5KTsgfTtcbiAgICAgICAgICAgICAgICBNYXAucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBNYXBJdGVyYXRvcih0aGlzLl9rZXlzLCB0aGlzLl92YWx1ZXMsIGdldFZhbHVlKTsgfTtcbiAgICAgICAgICAgICAgICBNYXAucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgTWFwSXRlcmF0b3IodGhpcy5fa2V5cywgdGhpcy5fdmFsdWVzLCBnZXRFbnRyeSk7IH07XG4gICAgICAgICAgICAgICAgTWFwLnByb3RvdHlwZVtcIkBAaXRlcmF0b3JcIl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLmVudHJpZXMoKTsgfTtcbiAgICAgICAgICAgICAgICBNYXAucHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuZW50cmllcygpOyB9O1xuICAgICAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuX2ZpbmQgPSBmdW5jdGlvbiAoa2V5LCBpbnNlcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NhY2hlS2V5ICE9PSBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlSW5kZXggPSB0aGlzLl9rZXlzLmluZGV4T2YodGhpcy5fY2FjaGVLZXkgPSBrZXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jYWNoZUluZGV4IDwgMCAmJiBpbnNlcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlSW5kZXggPSB0aGlzLl9rZXlzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleXMucHVzaChrZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmFsdWVzLnB1c2godW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FjaGVJbmRleDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXA7XG4gICAgICAgICAgICB9KCkpO1xuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0S2V5KGtleSwgXykge1xuICAgICAgICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRWYWx1ZShfLCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldEVudHJ5KGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW2tleSwgdmFsdWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIG5haXZlIFNldCBzaGltXG4gICAgICAgIGZ1bmN0aW9uIENyZWF0ZVNldFBvbHlmaWxsKCkge1xuICAgICAgICAgICAgcmV0dXJuIC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBTZXQoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21hcCA9IG5ldyBfTWFwKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTZXQucHJvdG90eXBlLCBcInNpemVcIiwge1xuICAgICAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX21hcC5zaXplOyB9LFxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBTZXQucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gdGhpcy5fbWFwLmhhcyh2YWx1ZSk7IH07XG4gICAgICAgICAgICAgICAgU2V0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIHRoaXMuX21hcC5zZXQodmFsdWUsIHZhbHVlKSwgdGhpczsgfTtcbiAgICAgICAgICAgICAgICBTZXQucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gdGhpcy5fbWFwLmRlbGV0ZSh2YWx1ZSk7IH07XG4gICAgICAgICAgICAgICAgU2V0LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHsgdGhpcy5fbWFwLmNsZWFyKCk7IH07XG4gICAgICAgICAgICAgICAgU2V0LnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fbWFwLmtleXMoKTsgfTtcbiAgICAgICAgICAgICAgICBTZXQucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX21hcC52YWx1ZXMoKTsgfTtcbiAgICAgICAgICAgICAgICBTZXQucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLl9tYXAuZW50cmllcygpOyB9O1xuICAgICAgICAgICAgICAgIFNldC5wcm90b3R5cGVbXCJAQGl0ZXJhdG9yXCJdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5rZXlzKCk7IH07XG4gICAgICAgICAgICAgICAgU2V0LnByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLmtleXMoKTsgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gU2V0O1xuICAgICAgICAgICAgfSgpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBuYWl2ZSBXZWFrTWFwIHNoaW1cbiAgICAgICAgZnVuY3Rpb24gQ3JlYXRlV2Vha01hcFBvbHlmaWxsKCkge1xuICAgICAgICAgICAgdmFyIFVVSURfU0laRSA9IDE2O1xuICAgICAgICAgICAgdmFyIGtleXMgPSBIYXNoTWFwLmNyZWF0ZSgpO1xuICAgICAgICAgICAgdmFyIHJvb3RLZXkgPSBDcmVhdGVVbmlxdWVLZXkoKTtcbiAgICAgICAgICAgIHJldHVybiAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gV2Vha01hcCgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fa2V5ID0gQ3JlYXRlVW5pcXVlS2V5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFdlYWtNYXAucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlID0gR2V0T3JDcmVhdGVXZWFrTWFwVGFibGUodGFyZ2V0LCAvKmNyZWF0ZSovIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhYmxlICE9PSB1bmRlZmluZWQgPyBIYXNoTWFwLmhhcyh0YWJsZSwgdGhpcy5fa2V5KSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgV2Vha01hcC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGUgPSBHZXRPckNyZWF0ZVdlYWtNYXBUYWJsZSh0YXJnZXQsIC8qY3JlYXRlKi8gZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFibGUgIT09IHVuZGVmaW5lZCA/IEhhc2hNYXAuZ2V0KHRhYmxlLCB0aGlzLl9rZXkpIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgV2Vha01hcC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHRhcmdldCwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlID0gR2V0T3JDcmVhdGVXZWFrTWFwVGFibGUodGFyZ2V0LCAvKmNyZWF0ZSovIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB0YWJsZVt0aGlzLl9rZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgV2Vha01hcC5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGUgPSBHZXRPckNyZWF0ZVdlYWtNYXBUYWJsZSh0YXJnZXQsIC8qY3JlYXRlKi8gZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFibGUgIT09IHVuZGVmaW5lZCA/IGRlbGV0ZSB0YWJsZVt0aGlzLl9rZXldIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBXZWFrTWFwLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTk9URTogbm90IGEgcmVhbCBjbGVhciwganVzdCBtYWtlcyB0aGUgcHJldmlvdXMgZGF0YSB1bnJlYWNoYWJsZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXkgPSBDcmVhdGVVbmlxdWVLZXkoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBXZWFrTWFwO1xuICAgICAgICAgICAgfSgpKTtcbiAgICAgICAgICAgIGZ1bmN0aW9uIENyZWF0ZVVuaXF1ZUtleSgpIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5O1xuICAgICAgICAgICAgICAgIGRvXG4gICAgICAgICAgICAgICAgICAgIGtleSA9IFwiQEBXZWFrTWFwQEBcIiArIENyZWF0ZVVVSUQoKTtcbiAgICAgICAgICAgICAgICB3aGlsZSAoSGFzaE1hcC5oYXMoa2V5cywga2V5KSk7XG4gICAgICAgICAgICAgICAga2V5c1trZXldID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gR2V0T3JDcmVhdGVXZWFrTWFwVGFibGUodGFyZ2V0LCBjcmVhdGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWhhc093bi5jYWxsKHRhcmdldCwgcm9vdEtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjcmVhdGUpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCByb290S2V5LCB7IHZhbHVlOiBIYXNoTWFwLmNyZWF0ZSgpIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Jvb3RLZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gRmlsbFJhbmRvbUJ5dGVzKGJ1ZmZlciwgc2l6ZSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgKytpKVxuICAgICAgICAgICAgICAgICAgICBidWZmZXJbaV0gPSBNYXRoLnJhbmRvbSgpICogMHhmZiB8IDA7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIEdlblJhbmRvbUJ5dGVzKHNpemUpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNyeXB0byAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KHNpemUpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtc0NyeXB0byAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoc2l6ZSkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRmlsbFJhbmRvbUJ5dGVzKG5ldyBVaW50OEFycmF5KHNpemUpLCBzaXplKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIEZpbGxSYW5kb21CeXRlcyhuZXcgQXJyYXkoc2l6ZSksIHNpemUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gQ3JlYXRlVVVJRCgpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IEdlblJhbmRvbUJ5dGVzKFVVSURfU0laRSk7XG4gICAgICAgICAgICAgICAgLy8gbWFyayBhcyByYW5kb20gLSBSRkMgNDEyMiDCpyA0LjRcbiAgICAgICAgICAgICAgICBkYXRhWzZdID0gZGF0YVs2XSAmIDB4NGYgfCAweDQwO1xuICAgICAgICAgICAgICAgIGRhdGFbOF0gPSBkYXRhWzhdICYgMHhiZiB8IDB4ODA7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgb2Zmc2V0ID0gMDsgb2Zmc2V0IDwgVVVJRF9TSVpFOyArK29mZnNldCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYnl0ZSA9IGRhdGFbb2Zmc2V0XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9mZnNldCA9PT0gNCB8fCBvZmZzZXQgPT09IDYgfHwgb2Zmc2V0ID09PSA4KVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IFwiLVwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYnl0ZSA8IDE2KVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IFwiMFwiO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gYnl0ZS50b1N0cmluZygxNikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyB1c2VzIGEgaGV1cmlzdGljIHVzZWQgYnkgdjggYW5kIGNoYWtyYSB0byBmb3JjZSBhbiBvYmplY3QgaW50byBkaWN0aW9uYXJ5IG1vZGUuXG4gICAgICAgIGZ1bmN0aW9uIE1ha2VEaWN0aW9uYXJ5KG9iaikge1xuICAgICAgICAgICAgb2JqLl9fID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgZGVsZXRlIG9iai5fXztcbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pKFJlZmxlY3QgfHwgKFJlZmxlY3QgPSB7fSkpO1xuIiwiaW1wb3J0IHsgTWV0YWRhdGEsIE1ldGFkYXRhQ2xhc3MsIE1ldGFkYXRhUmVhZGVyIH0gZnJvbSAnLi4vdHlwZXMvTWV0YWRhdGEnO1xuaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcCB9IGZyb20gJy4uL2NvbW1vbi9EZWZhdWx0VmFsdWVNYXAnO1xuXG50eXBlIEFueU1ldGFkYXRhID0gTWV0YWRhdGE8TWV0YWRhdGFSZWFkZXIsIHVua25vd24+O1xudHlwZSBBbnlNZXRhZGF0YUNsYXNzID0gTWV0YWRhdGFDbGFzczxNZXRhZGF0YVJlYWRlciwgdW5rbm93biwgQW55TWV0YWRhdGE+O1xuXG5jb25zdCBtZXRhZGF0YUluc3RhbmNlTWFwID0gY3JlYXRlRGVmYXVsdFZhbHVlTWFwPEFueU1ldGFkYXRhQ2xhc3MsIFNldDxBbnlNZXRhZGF0YT4+KCgpID0+IG5ldyBTZXQoKSk7XG5cbmV4cG9ydCBjbGFzcyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB7XG4gICAgc3RhdGljIGdldE1ldGFkYXRhPFIgZXh0ZW5kcyBNZXRhZGF0YVJlYWRlciwgVCBleHRlbmRzIE9iamVjdCwgTSBleHRlbmRzIE1ldGFkYXRhPFIsIFQ+ID0gTWV0YWRhdGE8UiwgVD4+KFxuICAgICAgICB0YXJnZXQ6IFQsXG4gICAgICAgIG1ldGFkYXRhQ2xhc3M6IE1ldGFkYXRhQ2xhc3M8UiwgVCwgTT5cbiAgICApIHtcbiAgICAgICAgY29uc3Qga2V5ID0gbWV0YWRhdGFDbGFzcy5nZXRSZWZsZWN0S2V5KCk7XG4gICAgICAgIGxldCBtZXRhZGF0YSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoa2V5LCB0YXJnZXQpO1xuICAgICAgICBpZiAoIW1ldGFkYXRhKSB7XG4gICAgICAgICAgICBtZXRhZGF0YSA9IG5ldyBtZXRhZGF0YUNsYXNzKCk7XG4gICAgICAgICAgICBtZXRhZGF0YS5pbml0KHRhcmdldCk7XG4gICAgICAgICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKGtleSwgbWV0YWRhdGEsIHRhcmdldCk7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZVNldCA9IG1ldGFkYXRhSW5zdGFuY2VNYXAuZ2V0KG1ldGFkYXRhQ2xhc3MpO1xuICAgICAgICAgICAgaW5zdGFuY2VTZXQuYWRkKG1ldGFkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWV0YWRhdGEgYXMgTTtcbiAgICB9XG4gICAgc3RhdGljIGdldEFsbEluc3RhbmNlb2Y8TSBleHRlbmRzIEFueU1ldGFkYXRhQ2xhc3M+KG1ldGFkYXRhQ2xhc3M6IE0pIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obWV0YWRhdGFJbnN0YW5jZU1hcC5nZXQobWV0YWRhdGFDbGFzcykpO1xuICAgIH1cbn1cbiIsIi8vIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbmltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luc3RhbmNlU2NvcGUnO1xuaW1wb3J0IHsgSnNTZXJ2aWNlQ2xhc3MgfSBmcm9tICcuLi90eXBlcy9Kc1NlcnZpY2VDbGFzcyc7XG5pbXBvcnQgeyBNZXRhZGF0YSwgTWV0YWRhdGFSZWFkZXIgfSBmcm9tICcuLi90eXBlcy9NZXRhZGF0YSc7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBjcmVhdGVEZWZhdWx0VmFsdWVNYXAgfSBmcm9tICcuLi9jb21tb24vRGVmYXVsdFZhbHVlTWFwJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBNZW1iZXJLZXkgfSBmcm9tICcuLi90eXBlcy9NZW1iZXJLZXknO1xuXG5jb25zdCBDTEFTU19NRVRBREFUQV9LRVkgPSAnaW9jOmNsYXNzLW1ldGFkYXRhJztcblxuZXhwb3J0IGludGVyZmFjZSBNYXJrSW5mbyB7XG4gICAgW2tleTogc3RyaW5nIHwgc3ltYm9sXTogdW5rbm93bjtcbn1cblxuZXhwb3J0IGNsYXNzIE1hcmtJbmZvQ29udGFpbmVyIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IG1hcCA9IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcDxNZW1iZXJLZXksIE1hcmtJbmZvPigoKSA9PiAoe30gYXMgTWFya0luZm8pKTtcbiAgICBnZXRNYXJrSW5mbyhtZXRob2Q6IE1lbWJlcktleSk6IE1hcmtJbmZvIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwLmdldChtZXRob2QpO1xuICAgIH1cbiAgICBtYXJrKG1ldGhvZDogTWVtYmVyS2V5LCBrZXk6IE1lbWJlcktleSwgdmFsdWU6IHVua25vd24pIHtcbiAgICAgICAgY29uc3QgbWFya0luZm8gPSB0aGlzLm1hcC5nZXQobWV0aG9kKTtcbiAgICAgICAgbWFya0luZm9ba2V5XSA9IHZhbHVlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBhcmFtZXRlck1hcmtJbmZvQ29udGFpbmVyIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IG1hcCA9IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcDxNZW1iZXJLZXksIFJlY29yZDxudW1iZXIsIE1hcmtJbmZvPj4oKCkgPT4ge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfSk7XG4gICAgZ2V0TWFya0luZm8obWV0aG9kOiBNZW1iZXJLZXkpOiBSZWNvcmQ8bnVtYmVyLCBNYXJrSW5mbz4ge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXAuZ2V0KG1ldGhvZCk7XG4gICAgfVxuICAgIG1hcmsobWV0aG9kOiBNZW1iZXJLZXksIGluZGV4OiBudW1iZXIsIGtleTogTWVtYmVyS2V5LCB2YWx1ZTogdW5rbm93bikge1xuICAgICAgICBjb25zdCBwYXJhbXNNYXJrSW5mbyA9IHRoaXMubWFwLmdldChtZXRob2QpO1xuICAgICAgICBjb25zdCBtYXJrSW5mbyA9IHBhcmFtc01hcmtJbmZvW2luZGV4XSB8fCB7fTtcbiAgICAgICAgbWFya0luZm9ba2V5XSA9IHZhbHVlO1xuICAgICAgICBwYXJhbXNNYXJrSW5mb1tpbmRleF0gPSBtYXJrSW5mbztcbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhc3NNYXJrSW5mbyB7XG4gICAgY3RvcjogTWFya0luZm87XG4gICAgbWVtYmVyczogTWFya0luZm9Db250YWluZXI7XG4gICAgcGFyYW1zOiBQYXJhbWV0ZXJNYXJrSW5mb0NvbnRhaW5lcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDbGFzc01ldGFkYXRhUmVhZGVyPFQ+IGV4dGVuZHMgTWV0YWRhdGFSZWFkZXIge1xuICAgIGdldENsYXNzKCk6IE5ld2FibGU8VD47XG4gICAgZ2V0U2NvcGUoKTogSW5zdGFuY2VTY29wZSB8IHN0cmluZztcbiAgICBnZXRDb25zdHJ1Y3RvclBhcmFtZXRlclR5cGVzKCk6IEFycmF5PElkZW50aWZpZXI+O1xuICAgIGdldE1ldGhvZHMobGlmZWN5Y2xlOiBMaWZlY3ljbGUpOiBBcnJheTxzdHJpbmcgfCBzeW1ib2w+O1xuICAgIGdldFByb3BlcnR5VHlwZU1hcCgpOiBNYXA8c3RyaW5nIHwgc3ltYm9sLCBJZGVudGlmaWVyPjtcbiAgICBnZXRDdG9yTWFya0luZm8oKTogTWFya0luZm87XG4gICAgZ2V0TWVtYmVyc01hcmtJbmZvKG1ldGhvZEtleToga2V5b2YgVCk6IE1hcmtJbmZvO1xuICAgIGdldFBhcmFtZXRlck1hcmtJbmZvKG1ldGhvZEtleToga2V5b2YgVCk6IFJlY29yZDxudW1iZXIsIE1hcmtJbmZvPjtcbn1cblxuZXhwb3J0IGNsYXNzIENsYXNzTWV0YWRhdGE8VD4gaW1wbGVtZW50cyBNZXRhZGF0YTxDbGFzc01ldGFkYXRhUmVhZGVyPFQ+LCBOZXdhYmxlPFQ+PiB7XG4gICAgc3RhdGljIGdldFJlZmxlY3RLZXkoKSB7XG4gICAgICAgIHJldHVybiBDTEFTU19NRVRBREFUQV9LRVk7XG4gICAgfVxuICAgIHByaXZhdGUgc2NvcGU6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmcgPSBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTjtcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZXM6IEFycmF5PElkZW50aWZpZXI+ID0gW107XG4gICAgcHJpdmF0ZSByZWFkb25seSBsaWZlY3ljbGVNZXRob2RzTWFwOiBSZWNvcmQ8c3RyaW5nIHwgc3ltYm9sLCBTZXQ8TGlmZWN5Y2xlPj4gPSB7fTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHByb3BlcnR5VHlwZXNNYXAgPSBuZXcgTWFwPHN0cmluZyB8IHN5bWJvbCwgSWRlbnRpZmllcj4oKTtcbiAgICBwcml2YXRlIGNsYXp6ITogTmV3YWJsZTxUPjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IG1hcmtzOiBDbGFzc01hcmtJbmZvID0ge1xuICAgICAgICBjdG9yOiB7fSxcbiAgICAgICAgbWVtYmVyczogbmV3IE1hcmtJbmZvQ29udGFpbmVyKCksXG4gICAgICAgIHBhcmFtczogbmV3IFBhcmFtZXRlck1hcmtJbmZvQ29udGFpbmVyKClcbiAgICB9O1xuXG4gICAgc3RhdGljIGdldEluc3RhbmNlPFQ+KGN0b3I6IE5ld2FibGU8VD4pIHtcbiAgICAgICAgcmV0dXJuIE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgIH1cblxuICAgIGluaXQodGFyZ2V0OiBOZXdhYmxlPFQ+KSB7XG4gICAgICAgIHRoaXMuY2xhenogPSB0YXJnZXQ7XG4gICAgICAgIGNvbnN0IGNvbnN0ciA9IHRhcmdldCBhcyBKc1NlcnZpY2VDbGFzczx1bmtub3duPjtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25zdHIuc2NvcGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U2NvcGUoY29uc3RyLnNjb3BlKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgY29uc3RyLmluamVjdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29uc3QgaW5qZWN0aW9ucyA9IGNvbnN0ci5pbmplY3QoKTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIGluamVjdGlvbnMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlY29yZFByb3BlcnR5VHlwZShrZXksIGluamVjdGlvbnNba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBjb25zdHIubWV0YWRhdGEgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gY29uc3RyLm1ldGFkYXRhKCk7XG4gICAgICAgICAgICBpZiAobWV0YWRhdGEuc2NvcGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNjb3BlKG1ldGFkYXRhLnNjb3BlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGluamVjdGlvbnMgPSBtZXRhZGF0YS5pbmplY3Q7XG4gICAgICAgICAgICBpZiAoaW5qZWN0aW9ucykge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIGluamVjdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWNvcmRQcm9wZXJ0eVR5cGUoa2V5LCBpbmplY3Rpb25zW2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1hcmtlcigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGN0b3I6IChrZXk6IHN0cmluZyB8IHN5bWJvbCwgdmFsdWU6IHVua25vd24pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm1hcmtzLmN0b3Jba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1lbWJlcjogKHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wgfCBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBtYXJrOiAoa2V5OiBzdHJpbmcgfCBzeW1ib2wsIHZhbHVlOiB1bmtub3duKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtzLm1lbWJlcnMubWFyayhwcm9wZXJ0eUtleSwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcmFtZXRlcjogKHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBtYXJrOiAoa2V5OiBzdHJpbmcgfCBzeW1ib2wsIHZhbHVlOiB1bmtub3duKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtzLnBhcmFtcy5tYXJrKHByb3BlcnR5S2V5LCBpbmRleCwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBzZXRTY29wZShzY29wZTogSW5zdGFuY2VTY29wZSB8IHN0cmluZykge1xuICAgICAgICB0aGlzLnNjb3BlID0gc2NvcGU7XG4gICAgfVxuICAgIHNldENvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZShpbmRleDogbnVtYmVyLCBjbHM6IElkZW50aWZpZXIpIHtcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3RvclBhcmFtZXRlclR5cGVzW2luZGV4XSA9IGNscztcbiAgICB9XG4gICAgcmVjb3JkUHJvcGVydHlUeXBlKHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wsIHR5cGU6IElkZW50aWZpZXIpIHtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eVR5cGVzTWFwLnNldChwcm9wZXJ0eUtleSwgdHlwZSk7XG4gICAgfVxuICAgIGFkZExpZmVjeWNsZU1ldGhvZChtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2wsIGxpZmVjeWNsZTogTGlmZWN5Y2xlKSB7XG4gICAgICAgIGNvbnN0IGxpZmVjeWNsZXMgPSB0aGlzLmdldExpZmVjeWNsZXMobWV0aG9kTmFtZSk7XG4gICAgICAgIGxpZmVjeWNsZXMuYWRkKGxpZmVjeWNsZSk7XG4gICAgICAgIHRoaXMubGlmZWN5Y2xlTWV0aG9kc01hcFttZXRob2ROYW1lXSA9IGxpZmVjeWNsZXM7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0TGlmZWN5Y2xlcyhtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2wpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGlmZWN5Y2xlTWV0aG9kc01hcFttZXRob2ROYW1lXSB8fCBuZXcgU2V0PExpZmVjeWNsZT4oKTtcbiAgICB9XG4gICAgZ2V0TWV0aG9kcyhsaWZlY3ljbGU6IExpZmVjeWNsZSk6IEFycmF5PHN0cmluZyB8IHN5bWJvbD4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5saWZlY3ljbGVNZXRob2RzTWFwKS5maWx0ZXIoaXQgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGlmZWN5Y2xlcyA9IHRoaXMubGlmZWN5Y2xlTWV0aG9kc01hcFtpdF07XG4gICAgICAgICAgICByZXR1cm4gbGlmZWN5Y2xlcy5oYXMobGlmZWN5Y2xlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlYWRlcigpOiBDbGFzc01ldGFkYXRhUmVhZGVyPFQ+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldENsYXNzOiAoKSA9PiB0aGlzLmNsYXp6LFxuICAgICAgICAgICAgZ2V0U2NvcGU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zY29wZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRDb25zdHJ1Y3RvclBhcmFtZXRlclR5cGVzOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlcy5zbGljZSgwKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRNZXRob2RzOiAobGlmZWN5Y2xlOiBMaWZlY3ljbGUpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRNZXRob2RzKGxpZmVjeWNsZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0UHJvcGVydHlUeXBlTWFwOiAoKSA9PiBuZXcgTWFwKHRoaXMucHJvcGVydHlUeXBlc01hcCksXG4gICAgICAgICAgICBnZXRDdG9yTWFya0luZm86ICgpOiBNYXJrSW5mbyA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgLi4udGhpcy5tYXJrcy5jdG9yIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0TWVtYmVyc01hcmtJbmZvOiAoa2V5OiBrZXlvZiBUKTogTWFya0luZm8gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hcmtzLm1lbWJlcnMuZ2V0TWFya0luZm8oa2V5KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRQYXJhbWV0ZXJNYXJrSW5mbzogKG1ldGhvZEtleToga2V5b2YgVCk6IFJlY29yZDxudW1iZXIsIE1hcmtJbmZvPiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFya3MucGFyYW1zLmdldE1hcmtJbmZvKG1ldGhvZEtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9HbG9iYWxNZXRhZGF0YSc7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIEJpbmQoYWxpYXNOYW1lOiBzdHJpbmcgfCBzeW1ib2wpOiBDbGFzc0RlY29yYXRvciB7XG4gICAgcmV0dXJuIDxURnVuY3Rpb24gZXh0ZW5kcyBGdW5jdGlvbj4odGFyZ2V0OiBURnVuY3Rpb24pID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQgYXMgdW5rbm93biBhcyBOZXdhYmxlPHVua25vd24+LCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWNvcmRDbGFzc0FsaWFzKGFsaWFzTmFtZSwgbWV0YWRhdGEpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBJbnN0YW5jZVNjb3BlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9JbnN0YW5jZVNjb3BlJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gU2NvcGUoc2NvcGU6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmcpOiBDbGFzc0RlY29yYXRvciB7XG4gICAgcmV0dXJuIDxURnVuY3Rpb24gZXh0ZW5kcyBGdW5jdGlvbj4odGFyZ2V0OiBURnVuY3Rpb24pID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQgYXMgdW5rbm93biBhcyBOZXdhYmxlPHVua25vd24+LCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgbWV0YWRhdGEuc2V0U2NvcGUoc2NvcGUpO1xuICAgIH07XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gaXNOdWxsKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgbnVsbCB7XG4gICAgcmV0dXJuIHZhbHVlID09PSBudWxsO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc05vdERlZmluZWQ8VD4odmFsdWU6IFQgfCB1bmRlZmluZWQgfCBudWxsKTogdmFsdWUgaXMgdW5kZWZpbmVkIHwgbnVsbCB7XG4gICAgcmV0dXJuIGlzTnVsbCh2YWx1ZSkgfHwgaXNVbmRlZmluZWQodmFsdWUpO1xufVxuIiwiaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBpc05vdERlZmluZWQgfSBmcm9tICcuLi9jb21tb24vaXNOb3REZWZpbmVkJztcblxuZXhwb3J0IGZ1bmN0aW9uIEluamVjdDxUPihjb25zdHI/OiBJZGVudGlmaWVyPFQ+KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIDxUYXJnZXQ+KHRhcmdldDogVGFyZ2V0LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sLCBwYXJhbWV0ZXJJbmRleD86IG51bWJlcikge1xuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgcGFyYW1ldGVySW5kZXggPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAvLyBjb25zdHJ1Y3RvciBwYXJhbWV0ZXJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldENvbnN0ciA9IHRhcmdldCBhcyBOZXdhYmxlPFQ+O1xuICAgICAgICAgICAgaWYgKGlzTm90RGVmaW5lZChjb25zdHIpKSB7XG4gICAgICAgICAgICAgICAgY29uc3RyID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnZGVzaWduOnBhcmFtdHlwZXMnLCB0YXJnZXQsIHByb3BlcnR5S2V5KVtwYXJhbWV0ZXJJbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNOb3REZWZpbmVkKGNvbnN0cikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1R5cGUgbm90IHJlY29nbml6ZWQsIGluamVjdGlvbiBjYW5ub3QgYmUgcGVyZm9ybWVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBjbGFzc01ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGFyZ2V0Q29uc3RyLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgICAgIGNsYXNzTWV0YWRhdGEuc2V0Q29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlKHBhcmFtZXRlckluZGV4LCBjb25zdHIpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdvYmplY3QnICYmIHRhcmdldCAhPT0gbnVsbCAmJiBwcm9wZXJ0eUtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBwcm9wZXJ0eVxuICAgICAgICAgICAgaWYgKGlzTm90RGVmaW5lZChjb25zdHIpKSB7XG4gICAgICAgICAgICAgICAgY29uc3RyID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnZGVzaWduOnR5cGUnLCB0YXJnZXQsIHByb3BlcnR5S2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc05vdERlZmluZWQoY29uc3RyKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHlwZSBub3QgcmVjb2duaXplZCwgaW5qZWN0aW9uIGNhbm5vdCBiZSBwZXJmb3JtZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGFyZ2V0LmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgICAgIG1ldGFkYXRhLnJlY29yZFByb3BlcnR5VHlwZShwcm9wZXJ0eUtleSwgY29uc3RyKTtcbiAgICAgICAgfVxuICAgIH07XG59XG4iLCJpbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0dsb2JhbE1ldGFkYXRhJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEZhY3RvcnlJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvRmFjdG9yeUlkZW50aWZpZXInO1xuaW1wb3J0IHsgSW5zdGFuY2UgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZSc7XG5pbXBvcnQgeyBpc05vdERlZmluZWQgfSBmcm9tICcuLi9jb21tb24vaXNOb3REZWZpbmVkJztcblxuZXhwb3J0IGZ1bmN0aW9uIEZhY3RvcnkocHJvZHVjZUlkZW50aWZpZXI/OiBGYWN0b3J5SWRlbnRpZmllcik6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuICh0YXJnZXQ6IE9iamVjdCwgcHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCkgPT4ge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IEdsb2JhbE1ldGFkYXRhLmdldEluc3RhbmNlKCk7XG4gICAgICAgIGNvbnN0IGNsYXp6ID0gdGFyZ2V0LmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8SW5zdGFuY2U8dW5rbm93bj4+O1xuXG4gICAgICAgIGlmIChpc05vdERlZmluZWQocHJvZHVjZUlkZW50aWZpZXIpKSB7XG4gICAgICAgICAgICBwcm9kdWNlSWRlbnRpZmllciA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ2Rlc2lnbjpyZXR1cm50eXBlJywgdGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTm90RGVmaW5lZChwcm9kdWNlSWRlbnRpZmllcikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHJldHVybiB0eXBlIG5vdCByZWNvZ25pemVkLCBjYW5ub3QgcGVyZm9ybSBpbnN0YW5jZSBjcmVhdGlvbiEnKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpbmplY3Rpb25zID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnZGVzaWduOnBhcmFtdHlwZXMnLCB0YXJnZXQsIHByb3BlcnR5S2V5KTtcblxuICAgICAgICBtZXRhZGF0YS5yZWNvcmRGYWN0b3J5KFxuICAgICAgICAgICAgcHJvZHVjZUlkZW50aWZpZXIsXG4gICAgICAgICAgICAoY29udGFpbmVyLCBvd25lcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gY29udGFpbmVyLmdldEluc3RhbmNlKGNsYXp6LCBvd25lcik7XG4gICAgICAgICAgICAgICAgY29uc3QgZnVuYyA9IGluc3RhbmNlW3Byb3BlcnR5S2V5XTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZ1bmMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGNvbnRhaW5lci5nZXRJbnN0YW5jZShjbGF6eik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuYy5hcHBseShpbnN0YW5jZSwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IGZ1bmM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluamVjdGlvbnNcbiAgICAgICAgKTtcbiAgICB9O1xufVxuIiwiZXhwb3J0IGVudW0gTGlmZWN5Y2xlIHtcbiAgICBQUkVfSU5KRUNUID0gJ2lvYy1zY29wZTpwcmUtaW5qZWN0JyxcbiAgICBQT1NUX0lOSkVDVCA9ICdpb2Mtc2NvcGU6cG9zdC1pbmplY3QnLFxuICAgIFBSRV9ERVNUUk9ZID0gJ2lvYy1zY29wZTpwcmUtZGVzdHJveSdcbn1cbiIsImltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcblxuLyoqXG4gKiBVcm4gY2FsbHMgdGhlIG1ldGhvZHMgYW5ub3RhdGVkIHdpdGggQFBvc3RJbmplY3Qgb25seSBvbmNlLCBqdXN0IGFmdGVyIHRoZSBpbmplY3Rpb24gb2YgcHJvcGVydGllcy5cbiAqIEBhbm5vdGF0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBMaWZlY3ljbGVEZWNvcmF0b3IgPSAobGlmZWN5Y2xlOiBMaWZlY3ljbGUpOiBNZXRob2REZWNvcmF0b3IgPT4ge1xuICAgIHJldHVybiAodGFyZ2V0OiBPYmplY3QsIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wpID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQuY29uc3RydWN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBtZXRhZGF0YS5hZGRMaWZlY3ljbGVNZXRob2QocHJvcGVydHlLZXksIGxpZmVjeWNsZSk7XG4gICAgfTtcbn07XG4iLCJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9MaWZlY3ljbGUnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlRGVjb3JhdG9yIH0gZnJvbSAnLi9MaWZlY3ljbGVEZWNvcmF0b3InO1xuXG4vKipcbiAqIFVybiBjYWxscyB0aGUgbWV0aG9kcyBhbm5vdGF0ZWQgd2l0aCBAUG9zdEluamVjdCBvbmx5IG9uY2UsIGp1c3QgYWZ0ZXIgdGhlIGluamVjdGlvbiBvZiBwcm9wZXJ0aWVzLlxuICogQGFubm90YXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IFBvc3RJbmplY3QgPSAoKTogTWV0aG9kRGVjb3JhdG9yID0+IExpZmVjeWNsZURlY29yYXRvcihMaWZlY3ljbGUuUE9TVF9JTkpFQ1QpO1xuIiwiaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IExpZmVjeWNsZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vTGlmZWN5Y2xlJztcbmltcG9ydCB7IExpZmVjeWNsZURlY29yYXRvciB9IGZyb20gJy4vTGlmZWN5Y2xlRGVjb3JhdG9yJztcblxuLyoqXG4gKiBVcm4gY2FsbHMgdGhlIG1ldGhvZHMgYW5ub3RhdGVkIHdpdGggQFBvc3RJbmplY3Qgb25seSBvbmNlLCBqdXN0IGFmdGVyIHRoZSBpbmplY3Rpb24gb2YgcHJvcGVydGllcy5cbiAqIEBhbm5vdGF0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBQcmVJbmplY3QgPSAoKTogTWV0aG9kRGVjb3JhdG9yID0+IExpZmVjeWNsZURlY29yYXRvcihMaWZlY3ljbGUuUFJFX0lOSkVDVCk7XG4iLCJpbXBvcnQgeyBMaWZlY3ljbGVEZWNvcmF0b3IgfSBmcm9tICcuL0xpZmVjeWNsZURlY29yYXRvcic7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5cbmV4cG9ydCBjb25zdCBQcmVEZXN0cm95ID0gKCkgPT4gTGlmZWN5Y2xlRGVjb3JhdG9yKExpZmVjeWNsZS5QUkVfREVTVFJPWSk7XG4iLCJleHBvcnQgaW50ZXJmYWNlIEV2YWx1YXRpb25PcHRpb25zPE8sIEUgZXh0ZW5kcyBzdHJpbmcsIEEgPSB1bmtub3duPiB7XG4gICAgdHlwZTogRTtcbiAgICBvd25lcj86IE87XG4gICAgcHJvcGVydHlOYW1lPzogc3RyaW5nIHwgc3ltYm9sO1xuICAgIGV4dGVybmFsQXJncz86IEE7XG59XG5cbmV4cG9ydCBlbnVtIEV4cHJlc3Npb25UeXBlIHtcbiAgICBFTlYgPSAnaW5qZWN0LWVudmlyb25tZW50LXZhcmlhYmxlcycsXG4gICAgSlNPTl9QQVRIID0gJ2luamVjdC1qc29uLWRhdGEnLFxuICAgIEFSR1YgPSAnaW5qZWN0LWFyZ3YnXG59XG4iLCJleHBvcnQgY29uc3QgaXNOb2RlSnMgPSAoKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdmFyLXJlcXVpcmVzXG4gICAgICAgIGV2YWwoJ3JlcXVpcmUoXCJvc1wiKS5hcmNoKCk7Jyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn0pKCk7XG4iLCJpbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0dsb2JhbE1ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuaW1wb3J0IHsgaXNOb2RlSnMgfSBmcm9tICcuLi9jb21tb24vaXNOb2RlSnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gVmFsdWU8QSA9IHVua25vd24+KGV4cHJlc3Npb246IHN0cmluZywgdHlwZTogRXhwcmVzc2lvblR5cGUgfCBzdHJpbmcsIGV4dGVybmFsQXJncz86IEEpOiBQcm9wZXJ0eURlY29yYXRvciB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgRXhwcmVzc2lvblR5cGUuRU5WOlxuICAgICAgICBjYXNlIEV4cHJlc3Npb25UeXBlLkFSR1Y6XG4gICAgICAgICAgICBpZiAoIWlzTm9kZUpzKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgXCIke3R5cGV9XCIgZXZhbHVhdG9yIG9ubHkgc3VwcG9ydHMgbm9kZWpzIGVudmlyb25tZW50IWApO1xuICAgICAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gKHRhcmdldDogT2JqZWN0LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sKSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGFyZ2V0LmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgY29uc3QgdmFsdWVfc3ltYm9sID0gU3ltYm9sKCcnKTtcbiAgICAgICAgbWV0YWRhdGEucmVjb3JkUHJvcGVydHlUeXBlKHByb3BlcnR5S2V5LCB2YWx1ZV9zeW1ib2wpO1xuICAgICAgICBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlY29yZEZhY3RvcnkodmFsdWVfc3ltYm9sLCAoY29udGFpbmVyLCBvd25lcikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICgpID0+XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmV2YWx1YXRlPHN0cmluZywgdHlwZW9mIG93bmVyLCBBPihleHByZXNzaW9uIGFzIHN0cmluZywge1xuICAgICAgICAgICAgICAgICAgICBvd25lcixcbiAgICAgICAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgZXh0ZXJuYWxBcmdzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG59XG4iLCJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBNYXJrKGtleTogc3RyaW5nIHwgc3ltYm9sLCB2YWx1ZTogdW5rbm93biA9IHRydWUpOiBGdW5jdGlvbiB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChcbiAgICAgICAgLi4uYXJnczpcbiAgICAgICAgICAgIHwgUGFyYW1ldGVyczxDbGFzc0RlY29yYXRvcj5cbiAgICAgICAgICAgIHwgUGFyYW1ldGVyczxNZXRob2REZWNvcmF0b3I+XG4gICAgICAgICAgICB8IFBhcmFtZXRlcnM8UHJvcGVydHlEZWNvcmF0b3I+XG4gICAgICAgICAgICB8IFBhcmFtZXRlcnM8UGFyYW1ldGVyRGVjb3JhdG9yPlxuICAgICkge1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIC8vIGNsYXNzIGRlY29yYXRvclxuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShhcmdzWzBdLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgICAgIG1ldGFkYXRhLm1hcmtlcigpLmN0b3Ioa2V5LCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJncy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIC8vIHByb3BlcnR5IGRlY29yYXRvclxuICAgICAgICAgICAgY29uc3QgW3Byb3RvdHlwZSwgcHJvcGVydHlLZXldID0gYXJncztcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEocHJvdG90eXBlLmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgICAgIG1ldGFkYXRhLm1hcmtlcigpLm1lbWJlcihwcm9wZXJ0eUtleSkubWFyayhrZXksIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMyAmJiB0eXBlb2YgYXJnc1syXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIC8vIHBhcmFtZXRlciBkZWNvcmF0b3JcbiAgICAgICAgICAgIGNvbnN0IFtwcm90b3R5cGUsIHByb3BlcnR5S2V5LCBpbmRleF0gPSBhcmdzO1xuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShwcm90b3R5cGUuY29uc3RydWN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICAgICAgbWV0YWRhdGEubWFya2VyKCkucGFyYW1ldGVyKHByb3BlcnR5S2V5LCBpbmRleCkubWFyayhrZXksIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIG1ldGhvZCBkZWNvcmF0b3JcbiAgICAgICAgICAgIGNvbnN0IFtwcm90b3R5cGUsIHByb3BlcnR5S2V5XSA9IGFyZ3M7XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHByb3RvdHlwZS5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBtZXRhZGF0YS5tYXJrZXIoKS5tZW1iZXIocHJvcGVydHlLZXkpLm1hcmsoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgQW55RnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcy9BbnlGdW5jdGlvbic7XG5cbmV4cG9ydCB0eXBlIEV2ZW50TGlzdGVuZXIgPSBBbnlGdW5jdGlvbjtcbmV4cG9ydCBjbGFzcyBFdmVudEVtaXR0ZXIge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZXZlbnRzID0gbmV3IE1hcDxzdHJpbmcgfCBzeW1ib2wsIEV2ZW50TGlzdGVuZXJbXT4oKTtcblxuICAgIG9uKHR5cGU6IHN0cmluZyB8IHN5bWJvbCwgbGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgbGV0IGxpc3RlbmVycyA9IHRoaXMuZXZlbnRzLmdldCh0eXBlKTtcbiAgICAgICAgaWYgKGxpc3RlbmVycykge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpc3RlbmVycyA9IFtsaXN0ZW5lcl07XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5zZXQodHlwZSwgbGlzdGVuZXJzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbHMgPSBsaXN0ZW5lcnMgYXMgRXZlbnRMaXN0ZW5lcltdO1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBscy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgbHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgZW1pdCh0eXBlOiBzdHJpbmcgfCBzeW1ib2wsIC4uLmFyZ3M6IHVua25vd25bXSkge1xuICAgICAgICB0aGlzLmV2ZW50cy5nZXQodHlwZSk/LmZvckVhY2goZm4gPT4ge1xuICAgICAgICAgICAgZm4oLi4uYXJncyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcblxudHlwZSBJbnZva2VGdW5jdGlvbkFyZ3MgPSB7XG4gICAgYXJncz86IHVua25vd25bXTtcbn07XG50eXBlIEludm9rZUZ1bmN0aW9uSW5qZWN0aW9ucyA9IHtcbiAgICBpbmplY3Rpb25zPzogSWRlbnRpZmllcltdO1xufTtcblxudHlwZSBJbnZva2VGdW5jdGlvbkJhc2ljT3B0aW9uczxUPiA9IHtcbiAgICBjb250ZXh0PzogVDtcbn07XG5cbmV4cG9ydCB0eXBlIEludm9rZUZ1bmN0aW9uT3B0aW9uczxUPiA9XG4gICAgfCAoSW52b2tlRnVuY3Rpb25CYXNpY09wdGlvbnM8VD4gJiBJbnZva2VGdW5jdGlvbkFyZ3MpXG4gICAgfCAoSW52b2tlRnVuY3Rpb25CYXNpY09wdGlvbnM8VD4gJiBJbnZva2VGdW5jdGlvbkluamVjdGlvbnMpO1xuXG5leHBvcnQgZnVuY3Rpb24gaGFzQXJnczxUPihvcHRpb25zOiBJbnZva2VGdW5jdGlvbk9wdGlvbnM8VD4pOiBvcHRpb25zIGlzIEludm9rZUZ1bmN0aW9uQmFzaWNPcHRpb25zPFQ+ICYgSW52b2tlRnVuY3Rpb25BcmdzIHtcbiAgICByZXR1cm4gJ2FyZ3MnIGluIG9wdGlvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNJbmplY3Rpb25zPFQ+KFxuICAgIG9wdGlvbnM6IEludm9rZUZ1bmN0aW9uT3B0aW9uczxUPlxuKTogb3B0aW9ucyBpcyBJbnZva2VGdW5jdGlvbkJhc2ljT3B0aW9uczxUPiAmIEludm9rZUZ1bmN0aW9uSW5qZWN0aW9ucyB7XG4gICAgcmV0dXJuICdpbmplY3Rpb25zJyBpbiBvcHRpb25zO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7XG4vKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbnZhciBlPWZ1bmN0aW9uKCl7cmV0dXJuIGU9T2JqZWN0LmFzc2lnbnx8ZnVuY3Rpb24oZSl7Zm9yKHZhciB0LHI9MSxuPWFyZ3VtZW50cy5sZW5ndGg7cjxuO3IrKylmb3IodmFyIG8gaW4gdD1hcmd1bWVudHNbcl0pT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykmJihlW29dPXRbb10pO3JldHVybiBlfSxlLmFwcGx5KHRoaXMsYXJndW1lbnRzKX07ZnVuY3Rpb24gdCgpe312YXIgcj17fSxuPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlKXt0aGlzLmV2YWx1YXRlUmVzdWx0PXIsdGhpcy5jb250ZXh0PWUudGFyZ2V0LHRoaXMuY29tcHV0ZUZuPWUuZXZhbHVhdGUsdGhpcy5yZXNldFRlc3Rlcj1lLnJlc2V0VGVzdGVyc31yZXR1cm4gZS5wcm90b3R5cGUucmVsZWFzZT1mdW5jdGlvbigpe3RoaXMucmVzZXQodCl9LGUucHJvdG90eXBlLnJlc2V0PWZ1bmN0aW9uKGUpe3RoaXMuZXZhbHVhdGVSZXN1bHQ9cix0aGlzLmNvbXB1dGVGbj1lfHx0aGlzLmNvbXB1dGVGbn0sZS5wcm90b3R5cGUuZXZhbHVhdGU9ZnVuY3Rpb24oKXt0aGlzLmlzUHJlc2VudCgpJiYhdGhpcy5uZWVkUmVzZXQoKXx8KHRoaXMuZXZhbHVhdGVSZXN1bHQ9dGhpcy5jb21wdXRlRm4uY2FsbCh0aGlzLmNvbnRleHQsdGhpcy5jb250ZXh0KSl9LGUucHJvdG90eXBlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmV2YWx1YXRlKCksdGhpcy5ldmFsdWF0ZVJlc3VsdH0sZS5wcm90b3R5cGUuaXNQcmVzZW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZXZhbHVhdGVSZXN1bHQhPT1yfSxlLnByb3RvdHlwZS5uZWVkUmVzZXQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO3JldHVybiB0aGlzLnJlc2V0VGVzdGVyLnNvbWUoKGZ1bmN0aW9uKHQpe3JldHVybiB0KGUuY29udGV4dCl9KSl9LGV9KCk7ZnVuY3Rpb24gbyh0LHIsbyl7dmFyIHU7dT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBvP3tldmFsdWF0ZTpvfTplKHt9LG8pO3ZhciBhPU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxyKTtpZihhJiYhYS5jb25maWd1cmFibGUpdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IG92ZXJyaWRlIG92ZXJyaWRlIHByb3BlcnR5OiBcIitTdHJpbmcocikpO3ZhciBpPVwiYm9vbGVhblwiPT10eXBlb2YgdS5lbnVtZXJhYmxlP3UuZW51bWVyYWJsZToobnVsbD09YT92b2lkIDA6YS5lbnVtZXJhYmxlKXx8ITAscz11LnJlc2V0Qnl8fFtdLGw9ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24oZSx0LHIsbyl7ZS5fX2xhenlfX3x8T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2xhenlfX1wiLHt2YWx1ZTp7fSxlbnVtZXJhYmxlOiExLHdyaXRhYmxlOiExLGNvbmZpZ3VyYWJsZTohMX0pO3ZhciB1PWUuX19sYXp5X187aWYoIXVbdF0pe3ZhciBhPW8ubWFwKChmdW5jdGlvbihlKXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgZXx8XCJudW1iZXJcIj09dHlwZW9mIGV8fFwic3ltYm9sXCI9PXR5cGVvZiBlP2Z1bmN0aW9uKGUpe3ZhciB0O3JldHVybiBmdW5jdGlvbihyKXt2YXIgbj1yW2VdLG89biE9PXQ7cmV0dXJuIHQ9bixvfX0oZSk6KHQ9ZSxmdW5jdGlvbihlKXt2YXIgbj10KGUpLG89biE9PXI7cmV0dXJuIHI9bixvfSk7dmFyIHQscn0pKTt1W3RdPW5ldyBuKHt0YXJnZXQ6ZSxldmFsdWF0ZTpyLHJlc2V0VGVzdGVyczphfSl9cmV0dXJuIHVbdF19KHRoaXMscix1LmV2YWx1YXRlLHMpfTtyZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHQscix7Y29uZmlndXJhYmxlOiEwLGVudW1lcmFibGU6aSxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbC5jYWxsKHRoaXMpLmdldCgpfX0pLGx9ZnVuY3Rpb24gdShlLHQscil7cmV0dXJuIG8oZSx0LHIpLmNhbGwoZSl9ZXhwb3J0cy5sYXp5TWVtYmVyPWZ1bmN0aW9uKGUpe3JldHVybiBmdW5jdGlvbih0LHIpe28odCxyLGUpfX0sZXhwb3J0cy5sYXp5TWVtYmVyT2ZDbGFzcz1mdW5jdGlvbihlLHQscil7byhlLnByb3RvdHlwZSx0LHIpfSxleHBvcnRzLmxhenlQcm9wPXUsZXhwb3J0cy5sYXp5VmFsPWZ1bmN0aW9uKGUpe3JldHVybiB1KHtfX3ZhbF9fOm51bGx9LFwiX192YWxfX1wiLGUpfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmNqcy5qcy5tYXBcbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEsIENsYXNzTWV0YWRhdGFSZWFkZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgTGlmZWN5Y2xlIH0gZnJvbSAnLi9MaWZlY3ljbGUnO1xuaW1wb3J0IHsgSW5zdGFuY2UgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZSc7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5cbmV4cG9ydCBjbGFzcyBMaWZlY3ljbGVNYW5hZ2VyPFQgPSB1bmtub3duPiB7XG4gICAgcHJpdmF0ZSBjbGFzc01ldGFkYXRhUmVhZGVyOiBDbGFzc01ldGFkYXRhUmVhZGVyPFQ+O1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY29tcG9uZW50Q2xhc3M6IE5ld2FibGU8VD4sIHByaXZhdGUgcmVhZG9ubHkgY29udGFpbmVyOiBBcHBsaWNhdGlvbkNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5jbGFzc01ldGFkYXRhUmVhZGVyID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGhpcy5jb21wb25lbnRDbGFzcywgQ2xhc3NNZXRhZGF0YSkucmVhZGVyKCk7XG4gICAgfVxuICAgIGludm9rZVByZUluamVjdE1ldGhvZChpbnN0YW5jZTogSW5zdGFuY2U8VD4pIHtcbiAgICAgICAgY29uc3QgbWV0aG9kcyA9IHRoaXMuY2xhc3NNZXRhZGF0YVJlYWRlci5nZXRNZXRob2RzKExpZmVjeWNsZS5QUkVfSU5KRUNUKTtcbiAgICAgICAgdGhpcy5pbnZva2VMaWZlY3ljbGVNZXRob2RzKGluc3RhbmNlLCBtZXRob2RzKTtcbiAgICB9XG4gICAgaW52b2tlUG9zdEluamVjdE1ldGhvZChpbnN0YW5jZTogSW5zdGFuY2U8VD4pIHtcbiAgICAgICAgY29uc3QgbWV0aG9kcyA9IHRoaXMuY2xhc3NNZXRhZGF0YVJlYWRlci5nZXRNZXRob2RzKExpZmVjeWNsZS5QT1NUX0lOSkVDVCk7XG4gICAgICAgIHRoaXMuaW52b2tlTGlmZWN5Y2xlTWV0aG9kcyhpbnN0YW5jZSwgbWV0aG9kcyk7XG4gICAgfVxuICAgIGludm9rZVByZURlc3Ryb3lJbmplY3RNZXRob2QoaW5zdGFuY2U6IEluc3RhbmNlPFQ+KSB7XG4gICAgICAgIGNvbnN0IG1ldGhvZHMgPSB0aGlzLmNsYXNzTWV0YWRhdGFSZWFkZXIuZ2V0TWV0aG9kcyhMaWZlY3ljbGUuUFJFX0RFU1RST1kpO1xuICAgICAgICB0aGlzLmludm9rZUxpZmVjeWNsZU1ldGhvZHMoaW5zdGFuY2UsIG1ldGhvZHMpO1xuICAgIH1cbiAgICBwcml2YXRlIGludm9rZUxpZmVjeWNsZU1ldGhvZHMoaW5zdGFuY2U6IEluc3RhbmNlPFQ+LCBtZXRob2RLZXlzOiBBcnJheTxzdHJpbmcgfCBzeW1ib2w+KSB7XG4gICAgICAgIG1ldGhvZEtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW52b2tlKGluc3RhbmNlW2tleV0sIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0OiBpbnN0YW5jZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEsIENsYXNzTWV0YWRhdGFSZWFkZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4vQXBwbGljYXRpb25Db250ZXh0JztcbmltcG9ydCB7IEluc3RhbmNlIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2UnO1xuaW1wb3J0IHsgU2VydmljZUZhY3RvcnlEZWYgfSBmcm9tICcuL1NlcnZpY2VGYWN0b3J5RGVmJztcbmltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuaW1wb3J0IHsgbGF6eVByb3AgfSBmcm9tICdAdmdlcmJvdC9sYXp5JztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlciB9IGZyb20gJy4vSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlcic7XG5pbXBvcnQgeyBMaWZlY3ljbGVNYW5hZ2VyIH0gZnJvbSAnLi9MaWZlY3ljbGVNYW5hZ2VyJztcblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudEluc3RhbmNlQnVpbGRlcjxUPiB7XG4gICAgcHJpdmF0ZSBnZXRDb25zdHJ1Y3RvckFyZ3M6ICgpID0+IHVua25vd25bXSA9ICgpID0+IFtdO1xuICAgIHByaXZhdGUgcHJvcGVydHlGYWN0b3JpZXM6IFJlY29yZDxzdHJpbmcgfCBzeW1ib2wsIFNlcnZpY2VGYWN0b3J5RGVmPHVua25vd24+PiA9IHt9O1xuICAgIHByaXZhdGUgbGF6eU1vZGU6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHByaXZhdGUgbGlmZWN5Y2xlUmVzb2x2ZXI6IExpZmVjeWNsZU1hbmFnZXI8VD47XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY29tcG9uZW50Q2xhc3M6IE5ld2FibGU8VD4sXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY29udGFpbmVyOiBBcHBsaWNhdGlvbkNvbnRleHQsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlcjogSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlclxuICAgICkge1xuICAgICAgICB0aGlzLmxpZmVjeWNsZVJlc29sdmVyID0gbmV3IExpZmVjeWNsZU1hbmFnZXI8VD4oY29tcG9uZW50Q2xhc3MsIGNvbnRhaW5lcik7XG4gICAgICAgIGNvbnN0IHJlYWRlciA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGNvbXBvbmVudENsYXNzLCBDbGFzc01ldGFkYXRhKS5yZWFkZXIoKTtcbiAgICAgICAgdGhpcy5hcHBlbmRDbGFzc01ldGFkYXRhKHJlYWRlcik7XG4gICAgfVxuICAgIGFwcGVuZExhenlNb2RlKGxhenlNb2RlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMubGF6eU1vZGUgPSBsYXp5TW9kZTtcbiAgICB9XG4gICAgcHJpdmF0ZSBhcHBlbmRDbGFzc01ldGFkYXRhPFQ+KGNsYXNzTWV0YWRhdGFSZWFkZXI6IENsYXNzTWV0YWRhdGFSZWFkZXI8VD4pIHtcbiAgICAgICAgY29uc3QgdHlwZXMgPSBjbGFzc01ldGFkYXRhUmVhZGVyLmdldENvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZXMoKTtcbiAgICAgICAgdGhpcy5nZXRDb25zdHJ1Y3RvckFyZ3MgPSAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZXMubWFwKGl0ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb250YWluZXIuZ2V0SW5zdGFuY2UoaXQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGdsb2JhbE1ldGFkYXRhUmVhZGVyID0gR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWFkZXIoKTtcbiAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IGNsYXNzTWV0YWRhdGFSZWFkZXIuZ2V0UHJvcGVydHlUeXBlTWFwKCk7XG4gICAgICAgIGZvciAoY29uc3QgW3Byb3BlcnR5TmFtZSwgcHJvcGVydHlUeXBlXSBvZiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHByb3BlcnR5VHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydHlGYWN0b3JpZXNbcHJvcGVydHlOYW1lXSA9IG5ldyBTZXJ2aWNlRmFjdG9yeURlZigoY29udGFpbmVyLCBvd25lcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4gY29udGFpbmVyLmdldEluc3RhbmNlKHByb3BlcnR5VHlwZSwgb3duZXIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZmFjdG9yeSA9IHRoaXMuY29udGFpbmVyLmdldEZhY3RvcnkocHJvcGVydHlUeXBlKTtcbiAgICAgICAgICAgIGlmIChmYWN0b3J5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eUZhY3Rvcmllc1twcm9wZXJ0eU5hbWVdID0gZmFjdG9yeTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHByb3BlcnR5Q2xhc3NNZXRhZGF0YSA9IGdsb2JhbE1ldGFkYXRhUmVhZGVyLmdldENsYXNzTWV0YWRhdGEocHJvcGVydHlUeXBlKTtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eUNsYXNzTWV0YWRhdGEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5RmFjdG9yaWVzW3Byb3BlcnR5TmFtZV0gPSBTZXJ2aWNlRmFjdG9yeURlZi5jcmVhdGVGcm9tQ2xhc3NNZXRhZGF0YShwcm9wZXJ0eUNsYXNzTWV0YWRhdGEpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcHJvcGVydHlGYWN0b3J5ID0gZ2xvYmFsTWV0YWRhdGFSZWFkZXIuZ2V0Q29tcG9uZW50RmFjdG9yeShwcm9wZXJ0eVR5cGUpO1xuICAgICAgICAgICAgaWYgKHByb3BlcnR5RmFjdG9yeSkge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydHlGYWN0b3JpZXNbcHJvcGVydHlOYW1lXSA9IHByb3BlcnR5RmFjdG9yeTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBidWlsZCgpIHtcbiAgICAgICAgY29uc3QgYXJncyA9IHRoaXMuZ2V0Q29uc3RydWN0b3JBcmdzKCk7XG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSB0aGlzLmNyZWF0ZVByb3BlcnRpZXNHZXR0ZXJCdWlsZGVyKCk7XG4gICAgICAgIGNvbnN0IGlzQ3JlYXRpbmdJbnN0QXdhcmVQcm9jZXNzb3IgPSB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuaXNJbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyh0aGlzLmNvbXBvbmVudENsYXNzKTtcbiAgICAgICAgaWYgKGlzQ3JlYXRpbmdJbnN0QXdhcmVQcm9jZXNzb3IpIHtcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IHRoaXMuY29tcG9uZW50Q2xhc3MoLi4uYXJncykgYXMgSW5zdGFuY2U8VD47XG4gICAgICAgICAgICB0aGlzLmxpZmVjeWNsZVJlc29sdmVyLmludm9rZVByZUluamVjdE1ldGhvZChpbnN0YW5jZSk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2V0dGVyID0gcHJvcGVydGllc1trZXldKGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmluZVByb3BlcnR5KGluc3RhbmNlLCBrZXksIGdldHRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmxpZmVjeWNsZVJlc29sdmVyLmludm9rZVBvc3RJbmplY3RNZXRob2QoaW5zdGFuY2UpO1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGluc3RhbmNlOiB1bmRlZmluZWQgfCBJbnN0YW5jZTxUPiA9IHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5iZWZvcmVJbnN0YW50aWF0aW9uKHRoaXMuY29tcG9uZW50Q2xhc3MsIGFyZ3MpO1xuICAgICAgICAgICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlID0gbmV3IHRoaXMuY29tcG9uZW50Q2xhc3MoLi4uYXJncykgYXMgSW5zdGFuY2U8VD47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmxpZmVjeWNsZVJlc29sdmVyLmludm9rZVByZUluamVjdE1ldGhvZChpbnN0YW5jZSk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2V0dGVyID0gcHJvcGVydGllc1trZXldKGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmluZVByb3BlcnR5KGluc3RhbmNlLCBrZXksIGdldHRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbnN0YW5jZSA9IHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5hZnRlckluc3RhbnRpYXRpb24oaW5zdGFuY2UpO1xuICAgICAgICAgICAgdGhpcy5saWZlY3ljbGVSZXNvbHZlci5pbnZva2VQb3N0SW5qZWN0TWV0aG9kKGluc3RhbmNlKTtcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGRlZmluZVByb3BlcnR5PFQsIFY+KGluc3RhbmNlOiBULCBrZXk6IHN0cmluZyB8IHN5bWJvbCwgZ2V0dGVyOiAoKSA9PiBWKSB7XG4gICAgICAgIGlmICh0aGlzLmxhenlNb2RlKSB7XG4gICAgICAgICAgICBsYXp5UHJvcChpbnN0YW5jZSwga2V5LCBnZXR0ZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgaW5zdGFuY2Vba2V5XSA9IGdldHRlcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgY3JlYXRlUHJvcGVydGllc0dldHRlckJ1aWxkZXIoKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHt9IGFzIFJlY29yZDxrZXlvZiBULCAoaW5zdGFuY2U6IFQpID0+ICgpID0+IHVua25vd24+O1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLnByb3BlcnR5RmFjdG9yaWVzKSB7XG4gICAgICAgICAgICBjb25zdCB7IGZhY3RvcnksIGluamVjdGlvbnMgfSA9IHRoaXMucHJvcGVydHlGYWN0b3JpZXNba2V5XTtcbiAgICAgICAgICAgIHJlc3VsdFtrZXkgYXMga2V5b2YgVF0gPSA8VD4oaW5zdGFuY2U6IFQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmbiA9IGZhY3RvcnkodGhpcy5jb250YWluZXIsIGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb250YWluZXIuaW52b2tlKGZuLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmplY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuIiwiaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhIH0gZnJvbSAnLi4vdHlwZXMvTWV0YWRhdGEnO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgSW5zdGFuY2VTY29wZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vSW5zdGFuY2VTY29wZSc7XG5cbmV4cG9ydCBjb25zdCBGVU5DVElPTl9NRVRBREFUQV9LRVkgPSBTeW1ib2woJ2lvYzpmdW5jdGlvbi1tZXRhZGF0YScpO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZ1bmN0aW9uTWV0YWRhdGFSZWFkZXIge1xuICAgIGdldFBhcmFtZXRlcnMoKTogSWRlbnRpZmllcltdO1xuICAgIGlzRmFjdG9yeSgpOiBib29sZWFuO1xuICAgIGdldFNjb3BlKCk6IEluc3RhbmNlU2NvcGUgfCB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBGdW5jdGlvbk1ldGFkYXRhIGltcGxlbWVudHMgTWV0YWRhdGE8RnVuY3Rpb25NZXRhZGF0YVJlYWRlciwgRnVuY3Rpb24+IHtcbiAgICBzdGF0aWMgZ2V0UmVmbGVjdEtleSgpIHtcbiAgICAgICAgcmV0dXJuIEZVTkNUSU9OX01FVEFEQVRBX0tFWTtcbiAgICB9XG4gICAgcHJpdmF0ZSByZWFkb25seSBwYXJhbWV0ZXJzOiBJZGVudGlmaWVyW10gPSBbXTtcbiAgICBwcml2YXRlIHNjb3BlPzogSW5zdGFuY2VTY29wZTtcbiAgICBwcml2YXRlIGlzRmFjdG9yeTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHNldFBhcmFtZXRlclR5cGUoaW5kZXg6IG51bWJlciwgc3ltYm9sOiBJZGVudGlmaWVyKSB7XG4gICAgICAgIHRoaXMucGFyYW1ldGVyc1tpbmRleF0gPSBzeW1ib2w7XG4gICAgfVxuICAgIHNldFNjb3BlKHNjb3BlOiBJbnN0YW5jZVNjb3BlKSB7XG4gICAgICAgIHRoaXMuc2NvcGUgPSBzY29wZTtcbiAgICB9XG4gICAgc2V0SXNGYWN0b3J5KGlzRmFjdG9yeTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLmlzRmFjdG9yeSA9IGlzRmFjdG9yeTtcbiAgICB9XG4gICAgaW5pdCgpIHtcbiAgICAgICAgLy8gUEFTUztcbiAgICB9XG4gICAgcmVhZGVyKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0UGFyYW1ldGVyczogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmFtZXRlcnMuc2xpY2UoMCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaXNGYWN0b3J5OiAoKSA9PiB0aGlzLmlzRmFjdG9yeSxcbiAgICAgICAgICAgIGdldFNjb3BlOiAoKSA9PiB0aGlzLnNjb3BlXG4gICAgICAgIH07XG4gICAgfVxufVxuIiwibGV0IGluc3RhbmNlU2VyaWFsTm8gPSAtMTtcblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudEluc3RhbmNlV3JhcHBlciB7XG4gICAgcHVibGljIHJlYWRvbmx5IHNlcmlhbE5vID0gKytpbnN0YW5jZVNlcmlhbE5vO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGluc3RhbmNlOiB1bmtub3duKSB7fVxuXG4gICAgcHVibGljIGNvbXBhcmVUbyhvdGhlcjogQ29tcG9uZW50SW5zdGFuY2VXcmFwcGVyKTogLTEgfCAwIHwgMSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlcmlhbE5vID4gb3RoZXIuc2VyaWFsTm8gPyAtMSA6IHRoaXMuc2VyaWFsTm8gPCBvdGhlci5zZXJpYWxObyA/IDEgOiAwO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9MaWZlY3ljbGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gaW52b2tlUHJlRGVzdHJveShpbnN0YW5jZTogdW5rbm93bikge1xuICAgIGNvbnN0IGNsYXp6ID0gaW5zdGFuY2U/LmNvbnN0cnVjdG9yO1xuICAgIGlmICghY2xhenopIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGNsYXp6LCBDbGFzc01ldGFkYXRhKTtcbiAgICBjb25zdCBwcmVEZXN0cm95TWV0aG9kcyA9IG1ldGFkYXRhLmdldE1ldGhvZHMoTGlmZWN5Y2xlLlBSRV9ERVNUUk9ZKTtcbiAgICBwcmVEZXN0cm95TWV0aG9kcy5mb3JFYWNoKG1ldGhvZE5hbWUgPT4ge1xuICAgICAgICBjb25zdCBtZXRob2QgPSBjbGF6ei5wcm90b3R5cGVbbWV0aG9kTmFtZV07XG4gICAgICAgIGlmICh0eXBlb2YgbWV0aG9kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBtZXRob2QuYXBwbHkoaW5zdGFuY2UpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgeyBHZXRJbnN0YW5jZU9wdGlvbnMsIEluc3RhbmNlUmVzb2x1dGlvbiwgU2F2ZUluc3RhbmNlT3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlUmVzb2x1dGlvbic7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBDb21wb25lbnRJbnN0YW5jZVdyYXBwZXIgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0NvbXBvbmVudEluc3RhbmNlV3JhcHBlcic7XG5pbXBvcnQgeyBpbnZva2VQcmVEZXN0cm95IH0gZnJvbSAnLi4vY29tbW9uL2ludm9rZVByZURlc3Ryb3knO1xuXG5leHBvcnQgY2xhc3MgU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uIGltcGxlbWVudHMgSW5zdGFuY2VSZXNvbHV0aW9uIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IElOU1RBTkNFX01BUCA9IG5ldyBNYXA8SWRlbnRpZmllciwgQ29tcG9uZW50SW5zdGFuY2VXcmFwcGVyPigpO1xuICAgIGdldEluc3RhbmNlPFQsIE8+KG9wdGlvbnM6IEdldEluc3RhbmNlT3B0aW9uczxULCBPPik6IFQge1xuICAgICAgICByZXR1cm4gdGhpcy5JTlNUQU5DRV9NQVAuZ2V0KG9wdGlvbnMuaWRlbnRpZmllcik/Lmluc3RhbmNlIGFzIFQ7XG4gICAgfVxuXG4gICAgc2F2ZUluc3RhbmNlPFQsIE8+KG9wdGlvbnM6IFNhdmVJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5JTlNUQU5DRV9NQVAuc2V0KG9wdGlvbnMuaWRlbnRpZmllciwgbmV3IENvbXBvbmVudEluc3RhbmNlV3JhcHBlcihvcHRpb25zLmluc3RhbmNlKSk7XG4gICAgfVxuXG4gICAgc2hvdWxkR2VuZXJhdGU8VCwgTz4ob3B0aW9uczogR2V0SW5zdGFuY2VPcHRpb25zPFQsIE8+KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAhdGhpcy5JTlNUQU5DRV9NQVAuaGFzKG9wdGlvbnMuaWRlbnRpZmllcik7XG4gICAgfVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlV3JhcHBlcnMgPSBBcnJheS5mcm9tKHRoaXMuSU5TVEFOQ0VfTUFQLnZhbHVlcygpKTtcbiAgICAgICAgaW5zdGFuY2VXcmFwcGVycy5zb3J0KChhLCBiKSA9PiBhLmNvbXBhcmVUbyhiKSk7XG4gICAgICAgIGluc3RhbmNlV3JhcHBlcnMuZm9yRWFjaChpbnN0YW5jZVdyYXBwZXIgPT4ge1xuICAgICAgICAgICAgaW52b2tlUHJlRGVzdHJveShpbnN0YW5jZVdyYXBwZXIuaW5zdGFuY2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5JTlNUQU5DRV9NQVAuY2xlYXIoKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBHZXRJbnN0YW5jZU9wdGlvbnMsIEluc3RhbmNlUmVzb2x1dGlvbiwgU2F2ZUluc3RhbmNlT3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlUmVzb2x1dGlvbic7XG5pbXBvcnQgeyBTaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24gfSBmcm9tICcuL1NpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbic7XG5cbmNvbnN0IFNJTkdMRVRPTl9JTlNUQU5DRV9TSU5HTEVUT04gPSBuZXcgU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uKCk7XG5cbmV4cG9ydCBjbGFzcyBHbG9iYWxTaGFyZWRJbnN0YW5jZVJlc29sdXRpb24gaW1wbGVtZW50cyBJbnN0YW5jZVJlc29sdXRpb24ge1xuICAgIGdldEluc3RhbmNlPFQsIE8+KG9wdGlvbnM6IEdldEluc3RhbmNlT3B0aW9uczxULCBPPik6IFQge1xuICAgICAgICByZXR1cm4gU0lOR0xFVE9OX0lOU1RBTkNFX1NJTkdMRVRPTi5nZXRJbnN0YW5jZShvcHRpb25zKTtcbiAgICB9XG5cbiAgICBzYXZlSW5zdGFuY2U8VCwgTz4ob3B0aW9uczogU2F2ZUluc3RhbmNlT3B0aW9uczxULCBPPik6IHZvaWQge1xuICAgICAgICBTSU5HTEVUT05fSU5TVEFOQ0VfU0lOR0xFVE9OLnNhdmVJbnN0YW5jZShvcHRpb25zKTtcbiAgICB9XG5cbiAgICBzaG91bGRHZW5lcmF0ZTxULCBPPihvcHRpb25zOiBHZXRJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIFNJTkdMRVRPTl9JTlNUQU5DRV9TSU5HTEVUT04uc2hvdWxkR2VuZXJhdGUob3B0aW9ucyk7XG4gICAgfVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIC8vIFBBU1M7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSW5zdGFuY2VSZXNvbHV0aW9uLCBTYXZlSW5zdGFuY2VPcHRpb25zIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IGludm9rZVByZURlc3Ryb3kgfSBmcm9tICcuLi9jb21tb24vaW52b2tlUHJlRGVzdHJveSc7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2llbnRJbnN0YW5jZVJlc29sdXRpb24gaW1wbGVtZW50cyBJbnN0YW5jZVJlc29sdXRpb24ge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgaW5zdGFuY2VzID0gbmV3IFNldDx1bmtub3duPigpO1xuICAgIHNob3VsZEdlbmVyYXRlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBnZXRJbnN0YW5jZTxUPigpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNhdmVJbnN0YW5jZTxULCBPPihvcHRpb25zOiBTYXZlSW5zdGFuY2VPcHRpb25zPFQsIE8+KTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW5zdGFuY2VzLmFkZChvcHRpb25zLmluc3RhbmNlKTtcbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZXMuZm9yRWFjaChpdCA9PiB7XG4gICAgICAgICAgICBpZiAoIWl0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW52b2tlUHJlRGVzdHJveShpdCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmluc3RhbmNlcy5jbGVhcigpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEV2YWx1YXRvciB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRvcic7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5pbXBvcnQgeyBKU09ORGF0YSB9IGZyb20gJy4uL3R5cGVzL0pTT05EYXRhJztcblxuZXhwb3J0IGNsYXNzIEpTT05EYXRhRXZhbHVhdG9yIGltcGxlbWVudHMgRXZhbHVhdG9yIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IG5hbWVzcGFjZURhdGFNYXAgPSBuZXcgTWFwPHN0cmluZywgSlNPTkRhdGE+KCk7XG4gICAgZXZhbDxUPihjb250ZXh0OiBBcHBsaWNhdGlvbkNvbnRleHQsIGV4cHJlc3Npb246IHN0cmluZyk6IFQgfCB1bmRlZmluZWQge1xuICAgICAgICBjb25zdCBjb2xvbkluZGV4ID0gZXhwcmVzc2lvbi5pbmRleE9mKCc6Jyk7XG4gICAgICAgIGlmIChjb2xvbkluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbmNvcnJlY3QgZXhwcmVzc2lvbiwgbmFtZXNwYWNlIG5vdCBzcGVjaWZpZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuYW1lc3BhY2UgPSBleHByZXNzaW9uLnN1YnN0cmluZygwLCBjb2xvbkluZGV4KTtcbiAgICAgICAgY29uc3QgZXhwID0gZXhwcmVzc2lvbi5zdWJzdHJpbmcoY29sb25JbmRleCArIDEpO1xuICAgICAgICBpZiAoIXRoaXMubmFtZXNwYWNlRGF0YU1hcC5oYXMobmFtZXNwYWNlKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbmNvcnJlY3QgZXhwcmVzc2lvbjogbmFtZXNwYWNlIG5vdCByZWNvcmRlZDogXCIke25hbWVzcGFjZX1cImApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLm5hbWVzcGFjZURhdGFNYXAuZ2V0KG5hbWVzcGFjZSkgYXMgSlNPTkRhdGE7XG4gICAgICAgIHJldHVybiBydW5FeHByZXNzaW9uKGV4cCwgZGF0YSBhcyBPYmplY3QpO1xuICAgIH1cbiAgICByZWNvcmREYXRhKG5hbWVzcGFjZTogc3RyaW5nLCBkYXRhOiBKU09ORGF0YSkge1xuICAgICAgICB0aGlzLm5hbWVzcGFjZURhdGFNYXAuc2V0KG5hbWVzcGFjZSwgZGF0YSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBydW5FeHByZXNzaW9uKGV4cHJlc3Npb246IHN0cmluZywgcm9vdENvbnRleHQ6IE9iamVjdCkge1xuICAgIGNvbnN0IGZuID0gY29tcGlsZUV4cHJlc3Npb24oZXhwcmVzc2lvbik7XG4gICAgcmV0dXJuIGZuKHJvb3RDb250ZXh0KTtcbn1cblxuZnVuY3Rpb24gY29tcGlsZUV4cHJlc3Npb24oZXhwcmVzc2lvbjogc3RyaW5nKSB7XG4gICAgaWYgKGV4cHJlc3Npb24uaW5kZXhPZignLCcpID4gLTEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbmNvcnJlY3QgZXhwcmVzc2lvbiBzeW50YXgsIFRoZSAnLCcgaXMgbm90IGFsbG93ZWQgaW4gZXhwcmVzc2lvbjogXCIke2V4cHJlc3Npb259XCJgKTtcbiAgICB9XG4gICAgaWYgKGV4cHJlc3Npb24ubGVuZ3RoID4gMTIwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBJbmNvcnJlY3QgZXhwcmVzc2lvbiBzeW50YXgsIGV4cHJlc3Npb24gbGVuZ3RoIGNhbm5vdCBiZSBncmVhdGVyIHRoYW4gMTIwLCBidXQgYWN0dWFsOiAke2V4cHJlc3Npb24ubGVuZ3RofWBcbiAgICAgICAgKTtcbiAgICB9XG4gICAgaWYgKC9cXCguKj9cXCkvLnRlc3QoZXhwcmVzc2lvbikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbmNvcnJlY3QgZXhwcmVzc2lvbiBzeW50YXgsIHBhcmVudGhlc2VzIGFyZSBub3QgYWxsb3dlZCBpbiBleHByZXNzaW9uOiBcIiR7ZXhwcmVzc2lvbn1cImApO1xuICAgIH1cbiAgICBleHByZXNzaW9uID0gZXhwcmVzc2lvbi50cmltKCk7XG4gICAgaWYgKGV4cHJlc3Npb24gPT09ICcnKSB7XG4gICAgICAgIHJldHVybiAocm9vdDogT2JqZWN0KSA9PiByb290O1xuICAgIH1cblxuICAgIGNvbnN0IHJvb3RWYXJOYW1lID0gdmFyTmFtZSgnY29udGV4dCcpO1xuICAgIHJldHVybiBuZXcgRnVuY3Rpb24oXG4gICAgICAgIHJvb3RWYXJOYW1lLFxuICAgICAgICBgXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuICR7cm9vdFZhck5hbWV9LiR7ZXhwcmVzc2lvbn07XG4gICAgICAgIH0gY2F0Y2goZXJyb3IpIHsgdGhyb3cgZXJyb3IgfVxuICAgIGBcbiAgICApO1xufVxubGV0IFZBUl9TRVFVRU5DRSA9IERhdGUubm93KCk7XG5mdW5jdGlvbiB2YXJOYW1lKHByZWZpeDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHByZWZpeCArICcnICsgKFZBUl9TRVFVRU5DRSsrKS50b1N0cmluZygxNik7XG59XG4iLCJpbXBvcnQgeyBFdmFsdWF0b3IgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0b3InO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuXG5leHBvcnQgY2xhc3MgRW52aXJvbm1lbnRFdmFsdWF0b3IgaW1wbGVtZW50cyBFdmFsdWF0b3Ige1xuICAgIGV2YWw8VD4oY29udGV4dDogQXBwbGljYXRpb25Db250ZXh0LCBleHByZXNzaW9uOiBzdHJpbmcpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHByb2Nlc3MuZW52W2V4cHJlc3Npb25dIGFzIFQgfCB1bmRlZmluZWQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgRXZhbHVhdG9yIH0gZnJvbSAnLi4vdHlwZXMvRXZhbHVhdG9yJztcbmltcG9ydCB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4uL2ZvdW5kYXRpb24vQXBwbGljYXRpb25Db250ZXh0JztcblxuZXhwb3J0IGNsYXNzIEFyZ3ZFdmFsdWF0b3IgaW1wbGVtZW50cyBFdmFsdWF0b3Ige1xuICAgIGV2YWw8VCwgQSA9IHN0cmluZ1tdPihjb250ZXh0OiBBcHBsaWNhdGlvbkNvbnRleHQsIGV4cHJlc3Npb246IHN0cmluZywgYXJncz86IEEpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc3QgYXJndiA9IGFyZ3MgfHwgcHJvY2Vzcy5hcmd2O1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXZhci1yZXF1aXJlc1xuICAgICAgICBjb25zdCBtaW5pbWlzdCA9IHJlcXVpcmUoJ21pbmltaXN0Jyk7XG4gICAgICAgIGNvbnN0IG1hcCA9IG1pbmltaXN0KGFyZ3YpO1xuICAgICAgICByZXR1cm4gbWFwW2V4cHJlc3Npb25dO1xuICAgIH1cbn1cbiIsImV4cG9ydCBlbnVtIEFkdmljZSB7XG4gICAgQmVmb3JlLFxuICAgIEFmdGVyLFxuICAgIEFyb3VuZCxcbiAgICBBZnRlclJldHVybixcbiAgICBUaHJvd24sXG4gICAgRmluYWxseVxufVxuIiwiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSAqL1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi9BZHZpY2UnO1xuXG50eXBlIEJlZm9yZUhvb2sgPSAoYXJnczogYW55W10pID0+IHZvaWQ7XG50eXBlIEFmdGVySG9vayA9IChhcmdzOiBhbnlbXSkgPT4gdm9pZDtcbnR5cGUgVGhyb3duSG9vayA9IChyZWFzb246IGFueSwgYXJnczogYW55W10pID0+IHZvaWQ7XG50eXBlIEZpbmFsbHlIb29rID0gKGFyZ3M6IGFueVtdKSA9PiB2b2lkO1xudHlwZSBBZnRlclJldHVybkhvb2sgPSAocmV0dXJuVmFsdWU6IGFueSwgYXJnczogYW55W10pID0+IGFueTtcbnR5cGUgQXJvdW5kSG9vayA9ICh0aGlzOiBhbnksIG9yaWdpbmZuOiAoLi4uYXJnczogYW55W10pID0+IHZvaWQsIGFyZ3M6IGFueVtdKSA9PiB2b2lkO1xuXG5leHBvcnQgY2xhc3MgQXNwZWN0VXRpbHMge1xuICAgIHByaXZhdGUgYmVmb3JlSG9va3M6IEFycmF5PEJlZm9yZUhvb2s+ID0gW107XG4gICAgcHJpdmF0ZSBhZnRlckhvb2tzOiBBcnJheTxBZnRlckhvb2s+ID0gW107XG4gICAgcHJpdmF0ZSB0aHJvd25Ib29rczogQXJyYXk8VGhyb3duSG9vaz4gPSBbXTtcbiAgICBwcml2YXRlIGZpbmFsbHlIb29rczogQXJyYXk8RmluYWxseUhvb2s+ID0gW107XG4gICAgcHJpdmF0ZSBhZnRlclJldHVybkhvb2tzOiBBcnJheTxBZnRlclJldHVybkhvb2s+ID0gW107XG4gICAgcHJpdmF0ZSBhcm91bmRIb29rczogQXJyYXk8QXJvdW5kSG9vaz4gPSBbXTtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZuOiAoLi4uYXJnczogYW55W10pID0+IGFueSkge31cbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuQmVmb3JlLCBob29rOiBCZWZvcmVIb29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuQWZ0ZXIsIGhvb2s6IEFmdGVySG9vayk6IHZvaWQ7XG4gICAgYXBwZW5kKGFkdmljZTogQWR2aWNlLlRocm93biwgaG9vazogVGhyb3duSG9vayk6IHZvaWQ7XG4gICAgYXBwZW5kKGFkdmljZTogQWR2aWNlLkZpbmFsbHksIGhvb2s6IEZpbmFsbHlIb29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuQWZ0ZXJSZXR1cm4sIGhvb2s6IEFmdGVyUmV0dXJuSG9vayk6IHZvaWQ7XG4gICAgYXBwZW5kKGFkdmljZTogQWR2aWNlLkFyb3VuZCwgaG9vazogQXJvdW5kSG9vayk6IHZvaWQ7XG4gICAgYXBwZW5kKGFkdmljZTogQWR2aWNlLCBob29rOiBGdW5jdGlvbikge1xuICAgICAgICBsZXQgaG9va3NBcnJheTogRnVuY3Rpb25bXSB8IHVuZGVmaW5lZDtcbiAgICAgICAgc3dpdGNoIChhZHZpY2UpIHtcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLkJlZm9yZTpcbiAgICAgICAgICAgICAgICBob29rc0FycmF5ID0gdGhpcy5iZWZvcmVIb29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLkFmdGVyOlxuICAgICAgICAgICAgICAgIGhvb2tzQXJyYXkgPSB0aGlzLmFmdGVySG9va3M7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFkdmljZS5UaHJvd246XG4gICAgICAgICAgICAgICAgaG9va3NBcnJheSA9IHRoaXMudGhyb3duSG9va3M7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFkdmljZS5GaW5hbGx5OlxuICAgICAgICAgICAgICAgIGhvb2tzQXJyYXkgPSB0aGlzLmZpbmFsbHlIb29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLkFmdGVyUmV0dXJuOlxuICAgICAgICAgICAgICAgIGhvb2tzQXJyYXkgPSB0aGlzLmFmdGVyUmV0dXJuSG9va3M7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFkdmljZS5Bcm91bmQ6XG4gICAgICAgICAgICAgICAgaG9va3NBcnJheSA9IHRoaXMuYXJvdW5kSG9va3M7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhvb2tzQXJyYXkpIHtcbiAgICAgICAgICAgIGhvb2tzQXJyYXkucHVzaChob29rKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBleHRyYWN0KCkge1xuICAgICAgICBjb25zdCB7IGFyb3VuZEhvb2tzLCBiZWZvcmVIb29rcywgYWZ0ZXJIb29rcywgYWZ0ZXJSZXR1cm5Ib29rcywgZmluYWxseUhvb2tzLCB0aHJvd25Ib29rcyB9ID0gdGhpcztcbiAgICAgICAgY29uc3QgZm4gPSBhcm91bmRIb29rcy5yZWR1Y2VSaWdodCgocHJldiwgbmV4dCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQuY2FsbCh0aGlzLCBwcmV2LCBhcmdzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sIHRoaXMuZm4pIGFzIHR5cGVvZiB0aGlzLmZuO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHRoaXM6IGFueSwgLi4uYXJnczogYW55W10pIHtcbiAgICAgICAgICAgIGJlZm9yZUhvb2tzLmZvckVhY2goaG9vayA9PiB7XG4gICAgICAgICAgICAgICAgaG9vay5jYWxsKHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBpbnZva2UgPSAob25FcnJvcjogKHJlYXNvbjogYW55KSA9PiB2b2lkLCBvbkZpbmFsbHk6ICgpID0+IHZvaWQsIG9uQWZ0ZXI6IChyZXR1cm5WYWx1ZTogYW55KSA9PiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmV0dXJuVmFsdWU6IGFueTtcbiAgICAgICAgICAgICAgICBsZXQgaXNQcm9taXNlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSBmbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJldHVyblZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNQcm9taXNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblZhbHVlID0gcmV0dXJuVmFsdWUuY2F0Y2gob25FcnJvcikuZmluYWxseShvbkZpbmFsbHkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1Byb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRmluYWxseSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChpc1Byb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlLnRoZW4oKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvbkFmdGVyKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9uQWZ0ZXIocmV0dXJuVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gaW52b2tlKFxuICAgICAgICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRocm93bkhvb2tzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93bkhvb2tzLmZvckVhY2goaG9vayA9PiBob29rLmNhbGwodGhpcywgZXJyb3IsIGFyZ3MpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGZpbmFsbHlIb29rcy5mb3JFYWNoKGhvb2sgPT4gaG9vay5jYWxsKHRoaXMsIGFyZ3MpKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHZhbHVlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYWZ0ZXJIb29rcy5mb3JFYWNoKGhvb2sgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaG9vay5jYWxsKHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFmdGVyUmV0dXJuSG9va3MucmVkdWNlKChyZXRWYWwsIGhvb2spID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBob29rLmNhbGwodGhpcywgcmV0VmFsLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSAqL1xuaW1wb3J0IHR5cGUgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuL0FkdmljZSc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBBc3BlY3QsIEpvaW5Qb2ludCwgUHJvY2VlZGluZ0pvaW5Qb2ludCB9IGZyb20gJy4vQXNwZWN0JztcbmltcG9ydCB7IEFzcGVjdFV0aWxzIH0gZnJvbSAnLi9Bc3BlY3RVdGlscyc7XG5pbXBvcnQgeyBVc2VBc3BlY3RNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4vQU9QQ2xhc3NNZXRhZGF0YSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBc3BlY3Q8VD4oXG4gICAgYXBwQ3R4OiBBcHBsaWNhdGlvbkNvbnRleHQsXG4gICAgdGFyZ2V0OiBULFxuICAgIG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCxcbiAgICBtZXRob2RGdW5jOiBGdW5jdGlvbixcbiAgICBtZXRhZGF0YTogVXNlQXNwZWN0TWV0YWRhdGFSZWFkZXJcbikge1xuICAgIGNvbnN0IGNyZWF0ZUFzcGVjdEN0eCA9IChhZHZpY2U6IEFkdmljZSwgYXJnczogYW55W10sIHJldHVyblZhbHVlOiBhbnkgPSBudWxsLCBlcnJvcjogYW55ID0gbnVsbCk6IEpvaW5Qb2ludCA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0YXJnZXQsXG4gICAgICAgICAgICBtZXRob2ROYW1lLFxuICAgICAgICAgICAgYXJndW1lbnRzOiBhcmdzLFxuICAgICAgICAgICAgcmV0dXJuVmFsdWUsXG4gICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgIGFkdmljZVxuICAgICAgICB9O1xuICAgIH07XG4gICAgY29uc3QgYXNwZWN0VXRpbHMgPSBuZXcgQXNwZWN0VXRpbHMobWV0aG9kRnVuYyBhcyAoLi4uYXJnczogYW55W10pID0+IGFueSk7XG4gICAgY29uc3QgQ2xhc3NUb0luc3RhbmNlID0gKEFzcGVjdENsYXNzOiBOZXdhYmxlPEFzcGVjdD4pID0+IGFwcEN0eC5nZXRJbnN0YW5jZShBc3BlY3RDbGFzcyk7XG4gICAgY29uc3QgYmVmb3JlQWR2aWNlQXNwZWN0cyA9IG1ldGFkYXRhLmdldEFzcGVjdHNPZihtZXRob2ROYW1lLCBBZHZpY2UuQmVmb3JlKS5tYXAoQ2xhc3NUb0luc3RhbmNlKTtcbiAgICBjb25zdCBhZnRlckFkdmljZUFzcGVjdHMgPSBtZXRhZGF0YS5nZXRBc3BlY3RzT2YobWV0aG9kTmFtZSwgQWR2aWNlLkFmdGVyKS5tYXAoQ2xhc3NUb0luc3RhbmNlKTtcbiAgICBjb25zdCB0cnlDYXRjaEFkdmljZUFzcGVjdHMgPSBtZXRhZGF0YS5nZXRBc3BlY3RzT2YobWV0aG9kTmFtZSwgQWR2aWNlLlRocm93bikubWFwKENsYXNzVG9JbnN0YW5jZSk7XG4gICAgY29uc3QgdHJ5RmluYWxseUFkdmljZUFzcGVjdHMgPSBtZXRhZGF0YS5nZXRBc3BlY3RzT2YobWV0aG9kTmFtZSwgQWR2aWNlLkZpbmFsbHkpLm1hcChDbGFzc1RvSW5zdGFuY2UpO1xuICAgIGNvbnN0IGFmdGVyUmV0dXJuQWR2aWNlQXNwZWN0cyA9IG1ldGFkYXRhLmdldEFzcGVjdHNPZihtZXRob2ROYW1lLCBBZHZpY2UuQWZ0ZXJSZXR1cm4pLm1hcChDbGFzc1RvSW5zdGFuY2UpO1xuICAgIGNvbnN0IGFyb3VuZEFkdmljZUFzcGVjdHMgPSBtZXRhZGF0YS5nZXRBc3BlY3RzT2YobWV0aG9kTmFtZSwgQWR2aWNlLkFyb3VuZCkubWFwKENsYXNzVG9JbnN0YW5jZSk7XG5cbiAgICBpZiAoYmVmb3JlQWR2aWNlQXNwZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFzcGVjdFV0aWxzLmFwcGVuZChBZHZpY2UuQmVmb3JlLCAoYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGpvaW5Qb2ludCA9IGNyZWF0ZUFzcGVjdEN0eChBZHZpY2UuQmVmb3JlLCBhcmdzKTtcbiAgICAgICAgICAgIGJlZm9yZUFkdmljZUFzcGVjdHMuZm9yRWFjaChhc3BlY3QgPT4ge1xuICAgICAgICAgICAgICAgIGFzcGVjdC5leGVjdXRlKGpvaW5Qb2ludCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChhZnRlckFkdmljZUFzcGVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLkFmdGVyLCAoYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGpvaW5Qb2ludCA9IGNyZWF0ZUFzcGVjdEN0eChBZHZpY2UuQWZ0ZXIsIGFyZ3MpO1xuICAgICAgICAgICAgYWZ0ZXJBZHZpY2VBc3BlY3RzLmZvckVhY2goYXNwZWN0ID0+IHtcbiAgICAgICAgICAgICAgICBhc3BlY3QuZXhlY3V0ZShqb2luUG9pbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodHJ5Q2F0Y2hBZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXNwZWN0VXRpbHMuYXBwZW5kKEFkdmljZS5UaHJvd24sIChlcnJvciwgYXJncykgPT4ge1xuICAgICAgICAgICAgY29uc3Qgam9pblBvaW50ID0gY3JlYXRlQXNwZWN0Q3R4KEFkdmljZS5UaHJvd24sIGFyZ3MsIG51bGwsIGVycm9yKTtcbiAgICAgICAgICAgIHRyeUNhdGNoQWR2aWNlQXNwZWN0cy5mb3JFYWNoKGFzcGVjdCA9PiB7XG4gICAgICAgICAgICAgICAgYXNwZWN0LmV4ZWN1dGUoam9pblBvaW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodHJ5RmluYWxseUFkdmljZUFzcGVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLkZpbmFsbHksIChhcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgam9pblBvaW50ID0gY3JlYXRlQXNwZWN0Q3R4KEFkdmljZS5GaW5hbGx5LCBhcmdzKTtcbiAgICAgICAgICAgIHRyeUZpbmFsbHlBZHZpY2VBc3BlY3RzLmZvckVhY2goYXNwZWN0ID0+IHtcbiAgICAgICAgICAgICAgICBhc3BlY3QuZXhlY3V0ZShqb2luUG9pbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChhZnRlclJldHVybkFkdmljZUFzcGVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLkFmdGVyUmV0dXJuLCAocmV0dXJuVmFsdWUsIGFyZ3MpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhZnRlclJldHVybkFkdmljZUFzcGVjdHMucmVkdWNlKChwcmV2UmV0dXJuVmFsdWUsIGFzcGVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGpvaW5Qb2ludCA9IGNyZWF0ZUFzcGVjdEN0eChBZHZpY2UuQWZ0ZXJSZXR1cm4sIGFyZ3MsIHJldHVyblZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXNwZWN0LmV4ZWN1dGUoam9pblBvaW50KTtcbiAgICAgICAgICAgIH0sIHJldHVyblZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGFyb3VuZEFkdmljZUFzcGVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhcm91bmRBZHZpY2VBc3BlY3RzLmZvckVhY2goYXNwZWN0ID0+IHtcbiAgICAgICAgICAgIGFzcGVjdFV0aWxzLmFwcGVuZChBZHZpY2UuQXJvdW5kLCAob3JpZ2luRm4sIGFyZ3MpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBqb2luUG9pbnQgPSBjcmVhdGVBc3BlY3RDdHgoQWR2aWNlLkFyb3VuZCwgYXJncywgbnVsbCkgYXMgUHJvY2VlZGluZ0pvaW5Qb2ludDtcbiAgICAgICAgICAgICAgICBqb2luUG9pbnQucHJvY2VlZCA9IChqcEFyZ3MgPSBhcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5GbihqcEFyZ3MpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFzcGVjdC5leGVjdXRlKGpvaW5Qb2ludCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFzcGVjdFV0aWxzLmV4dHJhY3QoKTtcbn1cbiIsImltcG9ydCB7IE1ldGFkYXRhLCBNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4uL3R5cGVzL01ldGFkYXRhJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEFzcGVjdCB9IGZyb20gJy4vQXNwZWN0JztcbmltcG9ydCB7IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcCwgRGVmYXVsdFZhbHVlTWFwIH0gZnJvbSAnLi4vY29tbW9uL0RlZmF1bHRWYWx1ZU1hcCc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuL0FkdmljZSc7XG5cbmV4cG9ydCB0eXBlIFVzZUFzcGVjdE1hcCA9IERlZmF1bHRWYWx1ZU1hcDxzdHJpbmcgfCBzeW1ib2wsIERlZmF1bHRWYWx1ZU1hcDxBZHZpY2UsIEFycmF5PE5ld2FibGU8QXNwZWN0Pj4+PjtcblxuZXhwb3J0IGludGVyZmFjZSBVc2VBc3BlY3RNZXRhZGF0YVJlYWRlciBleHRlbmRzIE1ldGFkYXRhUmVhZGVyIHtcbiAgICBnZXRBc3BlY3RzKCk6IFVzZUFzcGVjdE1hcDtcbiAgICBnZXRBc3BlY3RzT2YobWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sLCBhZHZpY2U6IEFkdmljZSk6IEFycmF5PE5ld2FibGU8QXNwZWN0Pj47XG59XG5leHBvcnQgY2xhc3MgQU9QQ2xhc3NNZXRhZGF0YSBpbXBsZW1lbnRzIE1ldGFkYXRhPFVzZUFzcGVjdE1ldGFkYXRhUmVhZGVyLCBOZXdhYmxlPHVua25vd24+PiB7XG4gICAgc3RhdGljIGdldFJlZmxlY3RLZXkoKSB7XG4gICAgICAgIHJldHVybiAnYW9wOnVzZS1hc3BlY3QtbWV0YWRhdGEnO1xuICAgIH1cbiAgICBwcml2YXRlIGFzcGVjdE1hcDogVXNlQXNwZWN0TWFwID0gY3JlYXRlRGVmYXVsdFZhbHVlTWFwKCgpID0+IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcCgoKSA9PiBbXSkpO1xuICAgIGluaXQoKTogdm9pZCB7XG4gICAgICAgIC8vIElHTk9SRVxuICAgIH1cblxuICAgIGFwcGVuZChtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2wsIGFkdmljZTogQWR2aWNlLCBhc3BlY3RzOiBBcnJheTxOZXdhYmxlPEFzcGVjdD4+KSB7XG4gICAgICAgIGNvbnN0IGFkdmljZUFzcGVjdE1hcCA9IHRoaXMuYXNwZWN0TWFwLmdldChtZXRob2ROYW1lKTtcbiAgICAgICAgY29uc3QgZXhpdGluZ0FzcGVjdEFycmF5ID0gYWR2aWNlQXNwZWN0TWFwLmdldChhZHZpY2UpO1xuICAgICAgICBleGl0aW5nQXNwZWN0QXJyYXkucHVzaCguLi5hc3BlY3RzKTtcbiAgICB9XG5cbiAgICByZWFkZXIoKTogVXNlQXNwZWN0TWV0YWRhdGFSZWFkZXIge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0QXNwZWN0czogKCk6IFVzZUFzcGVjdE1hcCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNwZWN0TWFwO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldEFzcGVjdHNPZjogKG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCwgYWR2aWNlOiBBZHZpY2UpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3BlY3RNYXAuZ2V0KG1ldGhvZE5hbWUpLmdldChhZHZpY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3IgfSBmcm9tICcuLi90eXBlcy9JbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3InO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgdHlwZSB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4uL2ZvdW5kYXRpb24vQXBwbGljYXRpb25Db250ZXh0JztcbmltcG9ydCB7IGNyZWF0ZUFzcGVjdCB9IGZyb20gJy4vY3JlYXRlQXNwZWN0JztcbmltcG9ydCB7IEFPUENsYXNzTWV0YWRhdGEgfSBmcm9tICcuL0FPUENsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQU9QSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yIGltcGxlbWVudHMgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB7XG4gICAgc3RhdGljIGNyZWF0ZShhcHBDdHg6IEFwcGxpY2F0aW9uQ29udGV4dCk6IE5ld2FibGU8QU9QSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yPiB7XG4gICAgICAgIHJldHVybiBjbGFzcyBleHRlbmRzIEFPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3NvciB7XG4gICAgICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgYXBwQ3R4OiBBcHBsaWNhdGlvbkNvbnRleHQgPSBhcHBDdHg7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSBhcHBDdHg6IEFwcGxpY2F0aW9uQ29udGV4dDtcbiAgICBhZnRlckluc3RhbnRpYXRpb248VCBleHRlbmRzIG9iamVjdD4oaW5zdGFuY2U6IFQpOiBUIHtcbiAgICAgICAgY29uc3QgY2xhenogPSBpbnN0YW5jZS5jb25zdHJ1Y3RvcjtcblxuICAgICAgICBjb25zdCB1c2VBc3BlY3RNZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGNsYXp6LCBBT1BDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgY29uc3QgdXNlQXNwZWN0TWV0YWRhdGFSZWFkZXIgPSB1c2VBc3BlY3RNZXRhZGF0YS5yZWFkZXIoKTtcbiAgICAgICAgY29uc3QgdXNlQXNwZWN0c01hcCA9IHVzZUFzcGVjdE1ldGFkYXRhUmVhZGVyLmdldEFzcGVjdHMoKTtcbiAgICAgICAgaWYgKHVzZUFzcGVjdHNNYXAuc2l6ZSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYXNwZWN0U3RvcmVNYXAgPSBuZXcgV2Vha01hcDxvYmplY3QsIE1hcDxzdHJpbmcgfCBzeW1ib2wsIEZ1bmN0aW9uPj4oKTtcbiAgICAgICAgYXNwZWN0U3RvcmVNYXAuc2V0KGluc3RhbmNlLCBuZXcgTWFwPHN0cmluZyB8IHN5bWJvbCwgRnVuY3Rpb24+KCkpO1xuXG4gICAgICAgIGNvbnN0IHByb3h5UmVzdWx0ID0gbmV3IFByb3h5KGluc3RhbmNlLCB7XG4gICAgICAgICAgICBnZXQ6ICh0YXJnZXQsIHByb3ApID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5WYWx1ZSA9ICh0YXJnZXQgYXMgUmVjb3JkPHN0cmluZyB8IHN5bWJvbCwgdW5rbm93bj4pW3Byb3BdO1xuICAgICAgICAgICAgICAgIGlmIChwcm9wIGluIHRhcmdldCAmJiB0eXBlb2Ygb3JpZ2luVmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXNwZWN0TWFwID0gYXNwZWN0U3RvcmVNYXAuZ2V0KGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhc3BlY3RNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5WYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoYXNwZWN0TWFwLmhhcyhwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFzcGVjdE1hcC5nZXQocHJvcCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXNwZWN0Rm4gPSBjcmVhdGVBc3BlY3QodGhpcy5hcHBDdHgsIHRhcmdldCwgcHJvcCwgb3JpZ2luVmFsdWUsIHVzZUFzcGVjdE1ldGFkYXRhUmVhZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgYXNwZWN0TWFwLnNldChwcm9wLCBhc3BlY3RGbik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhc3BlY3RGbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpblZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb3h5UmVzdWx0O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3NvciwgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL3R5cGVzL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcic7XG5pbXBvcnQgeyBsYXp5TWVtYmVyIH0gZnJvbSAnQHZnZXJib3QvbGF6eSc7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlJztcbmltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuXG5leHBvcnQgY2xhc3MgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlciB7XG4gICAgcHJpdmF0ZSBpbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzOiBTZXQ8TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPj4gPSBuZXcgU2V0KCk7XG4gICAgQGxhenlNZW1iZXI8SW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlciwga2V5b2YgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlciwgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvcltdPih7XG4gICAgICAgIGV2YWx1YXRlOiBpbnN0YW5jZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBnbG9iYWxJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzID0gR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWFkZXIoKS5nZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKCk7XG4gICAgICAgICAgICBjb25zdCBpbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzID0gZ2xvYmFsSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3Nlcy5jb25jYXQoXG4gICAgICAgICAgICAgICAgQXJyYXkuZnJvbShpbnN0YW5jZS5pbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBpbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLm1hcChpdCA9PiBpbnN0YW5jZS5jb250YWluZXIuZ2V0SW5zdGFuY2U8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvciwgdm9pZD4oaXQpKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVzZXRCeTogW1xuICAgICAgICAgICAgaW5zdGFuY2UgPT4gaW5zdGFuY2UuaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3Nlcy5zaXplLFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdsb2JhbEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlYWRlcigpLmdldEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2xvYmFsSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3Nlcy5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9KVxuICAgIHByaXZhdGUgaW5zdEF3YXJlUHJvY2Vzc29ySW5zdGFuY2VzITogQXJyYXk8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj47XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGNvbnRhaW5lcjogQXBwbGljYXRpb25Db250ZXh0KSB7fVxuICAgIGFwcGVuZEluc3RBd2FyZVByb2Nlc3NvckNsYXNzKGluc3RBd2FyZVByb2Nlc3NvckNsYXNzOiBOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+KSB7XG4gICAgICAgIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3Nlcy5hZGQoaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MpO1xuICAgIH1cbiAgICBhcHBlbmRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKFxuICAgICAgICBpbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzOiBTZXQ8TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPj4gfCBBcnJheTxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+PlxuICAgICkge1xuICAgICAgICBpbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLmZvckVhY2goaXQgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLmFkZChpdCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBiZWZvcmVJbnN0YW50aWF0aW9uPFQ+KGNvbXBvbmVudENsYXNzOiBOZXdhYmxlPFQ+LCBhcmdzOiB1bmtub3duW10pIHtcbiAgICAgICAgY29uc3QgaW5zdEF3YXJlUHJvY2Vzc29ycyA9IHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29ySW5zdGFuY2VzO1xuICAgICAgICBsZXQgaW5zdGFuY2U6IHVuZGVmaW5lZCB8IEluc3RhbmNlPFQ+O1xuICAgICAgICBpbnN0QXdhcmVQcm9jZXNzb3JzLnNvbWUocHJvY2Vzc29yID0+IHtcbiAgICAgICAgICAgIGlmICghcHJvY2Vzc29yLmJlZm9yZUluc3RhbnRpYXRpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbnN0YW5jZSA9IHByb2Nlc3Nvci5iZWZvcmVJbnN0YW50aWF0aW9uPFQ+KGNvbXBvbmVudENsYXNzLCBhcmdzKSBhcyBJbnN0YW5jZTxUPjtcbiAgICAgICAgICAgIHJldHVybiAhIWluc3RhbmNlO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH1cbiAgICBhZnRlckluc3RhbnRpYXRpb248VD4oaW5zdGFuY2U6IEluc3RhbmNlPFQ+KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvckluc3RhbmNlcy5yZWR1Y2UoKGluc3RhbmNlLCBwcm9jZXNzb3IpID0+IHtcbiAgICAgICAgICAgIGlmIChwcm9jZXNzb3IuYWZ0ZXJJbnN0YW50aWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gcHJvY2Vzc29yLmFmdGVySW5zdGFudGlhdGlvbihpbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgaWYgKCEhcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgYXMgSW5zdGFuY2U8VD47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9LCBpbnN0YW5jZSk7XG4gICAgfVxuICAgIGlzSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoY2xzOiBOZXdhYmxlPHVua25vd24+KSB7XG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSB0aGlzLmdldEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoKTtcbiAgICAgICAgcmV0dXJuIGNsYXNzZXMuaW5kZXhPZihjbHMgYXMgTmV3YWJsZTxJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3I+KSA+IC0xO1xuICAgIH1cbiAgICBnZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKCkge1xuICAgICAgICBjb25zdCBnbG9iYWxJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzID0gR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWFkZXIoKS5nZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKCk7XG4gICAgICAgIHJldHVybiBnbG9iYWxJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLmNvbmNhdChBcnJheS5mcm9tKHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcykpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuL0luc3RhbmNlU2NvcGUnO1xuaW1wb3J0IHsgSW5zdGFuY2VSZXNvbHV0aW9uIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IFNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi4vdHlwZXMvU2VydmljZUZhY3RvcnknO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBFdmVudExpc3RlbmVyIH0gZnJvbSAnLi9FdmVudEVtaXR0ZXInO1xuaW1wb3J0IHsgQW55RnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcy9BbnlGdW5jdGlvbic7XG5pbXBvcnQgeyBoYXNBcmdzLCBoYXNJbmplY3Rpb25zLCBJbnZva2VGdW5jdGlvbk9wdGlvbnMgfSBmcm9tICcuL0ludm9rZUZ1bmN0aW9uT3B0aW9ucyc7XG5pbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0dsb2JhbE1ldGFkYXRhJztcbmltcG9ydCB7IEZhY3RvcnlJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvRmFjdG9yeUlkZW50aWZpZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSwgQ2xhc3NNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyIH0gZnJvbSAnLi9Db21wb25lbnRJbnN0YW5jZUJ1aWxkZXInO1xuaW1wb3J0IHsgRnVuY3Rpb25NZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0Z1bmN0aW9uTWV0YWRhdGEnO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0T3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzL0FwcGxpY2F0aW9uQ29udGV4dE9wdGlvbnMnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeURlZiB9IGZyb20gJy4vU2VydmljZUZhY3RvcnlEZWYnO1xuaW1wb3J0IHsgU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uIH0gZnJvbSAnLi4vcmVzb2x1dGlvbi9TaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24nO1xuaW1wb3J0IHsgR2xvYmFsU2hhcmVkSW5zdGFuY2VSZXNvbHV0aW9uIH0gZnJvbSAnLi4vcmVzb2x1dGlvbi9HbG9iYWxTaGFyZWRJbnN0YW5jZVJlc29sdXRpb24nO1xuaW1wb3J0IHsgVHJhbnNpZW50SW5zdGFuY2VSZXNvbHV0aW9uIH0gZnJvbSAnLi4vcmVzb2x1dGlvbi9UcmFuc2llbnRJbnN0YW5jZVJlc29sdXRpb24nO1xuaW1wb3J0IHsgRXZhbHVhdGlvbk9wdGlvbnMsIEV4cHJlc3Npb25UeXBlIH0gZnJvbSAnLi4vdHlwZXMvRXZhbHVhdGVPcHRpb25zJztcbmltcG9ydCB7IEpTT05EYXRhIH0gZnJvbSAnLi4vdHlwZXMvSlNPTkRhdGEnO1xuaW1wb3J0IHsgRXZhbHVhdG9yIH0gZnJvbSAnLi4vdHlwZXMvRXZhbHVhdG9yJztcbmltcG9ydCB7IEpTT05EYXRhRXZhbHVhdG9yIH0gZnJvbSAnLi4vZXZhbHVhdG9yL0pTT05EYXRhRXZhbHVhdG9yJztcbmltcG9ydCB7IEVudmlyb25tZW50RXZhbHVhdG9yIH0gZnJvbSAnLi4vZXZhbHVhdG9yL0Vudmlyb25tZW50RXZhbHVhdG9yJztcbmltcG9ydCB7IEFyZ3ZFdmFsdWF0b3IgfSBmcm9tICcuLi9ldmFsdWF0b3IvQXJndkV2YWx1YXRvcic7XG5pbXBvcnQgeyBpc05vZGVKcyB9IGZyb20gJy4uL2NvbW1vbi9pc05vZGVKcyc7XG5pbXBvcnQgeyBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yJztcbmltcG9ydCB7IEFPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL2FvcC9BT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3InO1xuaW1wb3J0IHsgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlciB9IGZyb20gJy4vSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlcic7XG5pbXBvcnQgeyBMaWZlY3ljbGVNYW5hZ2VyIH0gZnJvbSAnLi9MaWZlY3ljbGVNYW5hZ2VyJztcbmltcG9ydCB7IEluc3RhbmNlIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2UnO1xuXG5jb25zdCBQUkVfREVTVFJPWV9FVkVOVF9LRVkgPSAnY29udGFpbmVyOmV2ZW50OnByZS1kZXN0cm95JztcblxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uQ29udGV4dCB7XG4gICAgcHJpdmF0ZSByZXNvbHV0aW9ucyA9IG5ldyBNYXA8SW5zdGFuY2VTY29wZSB8IHN0cmluZywgSW5zdGFuY2VSZXNvbHV0aW9uPigpO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgcHJpdmF0ZSBmYWN0b3JpZXMgPSBuZXcgTWFwPEZhY3RvcnlJZGVudGlmaWVyLCBTZXJ2aWNlRmFjdG9yeURlZjxhbnk+PigpO1xuICAgIHByaXZhdGUgZXZhbHVhdG9yQ2xhc3NlcyA9IG5ldyBNYXA8c3RyaW5nLCBOZXdhYmxlPEV2YWx1YXRvcj4+KCk7XG4gICAgcHJpdmF0ZSBldmVudEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBkZWZhdWx0U2NvcGU6IEluc3RhbmNlU2NvcGU7XG4gICAgcHJpdmF0ZSByZWFkb25seSBsYXp5TW9kZTogYm9vbGVhbjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXI6IEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXI7XG4gICAgcHVibGljIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEFwcGxpY2F0aW9uQ29udGV4dE9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLmRlZmF1bHRTY29wZSA9IG9wdGlvbnMuZGVmYXVsdFNjb3BlIHx8IEluc3RhbmNlU2NvcGUuU0lOR0xFVE9OO1xuICAgICAgICB0aGlzLmxhenlNb2RlID0gb3B0aW9ucy5sYXp5TW9kZSA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IG9wdGlvbnMubGF6eU1vZGU7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJJbnN0YW5jZVNjb3BlUmVzb2x1dGlvbihJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTiwgU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uKTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlckluc3RhbmNlU2NvcGVSZXNvbHV0aW9uKEluc3RhbmNlU2NvcGUuR0xPQkFMX1NIQVJFRF9TSU5HTEVUT04sIEdsb2JhbFNoYXJlZEluc3RhbmNlUmVzb2x1dGlvbik7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJJbnN0YW5jZVNjb3BlUmVzb2x1dGlvbihJbnN0YW5jZVNjb3BlLlRSQU5TSUVOVCwgVHJhbnNpZW50SW5zdGFuY2VSZXNvbHV0aW9uKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2YWx1YXRvcihFeHByZXNzaW9uVHlwZS5KU09OX1BBVEgsIEpTT05EYXRhRXZhbHVhdG9yKTtcbiAgICAgICAgaWYgKGlzTm9kZUpzKSB7XG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyRXZhbHVhdG9yKEV4cHJlc3Npb25UeXBlLkVOViwgRW52aXJvbm1lbnRFdmFsdWF0b3IpO1xuICAgICAgICAgICAgdGhpcy5yZWdpc3RlckV2YWx1YXRvcihFeHByZXNzaW9uVHlwZS5BUkdWLCBBcmd2RXZhbHVhdG9yKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIgPSBuZXcgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlcih0aGlzKTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlckluc3RBd2FyZVByb2Nlc3NvcihBT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3IuY3JlYXRlKHRoaXMpKTtcbiAgICB9XG4gICAgZ2V0SW5zdGFuY2U8VCwgTz4oc3ltYm9sOiBJZGVudGlmaWVyPFQ+LCBvd25lcj86IE8pOiBUIHtcbiAgICAgICAgaWYgKHN5bWJvbCA9PT0gQXBwbGljYXRpb25Db250ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcyBhcyB1bmtub3duIGFzIFQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBzeW1ib2wgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBzeW1ib2wgPT09ICdzeW1ib2wnKSB7XG4gICAgICAgICAgICBjb25zdCBmYWN0b3J5RGVmID0gdGhpcy5nZXRGYWN0b3J5KHN5bWJvbCk7XG4gICAgICAgICAgICBpZiAoZmFjdG9yeURlZikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZmFjdG9yeSwgaW5qZWN0aW9ucyB9ID0gZmFjdG9yeURlZjtcbiAgICAgICAgICAgICAgICBjb25zdCBmbiA9IGZhY3RvcnkodGhpcywgb3duZXIpO1xuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSB0aGlzLmludm9rZShmbiwge1xuICAgICAgICAgICAgICAgICAgICBpbmplY3Rpb25zXG4gICAgICAgICAgICAgICAgfSkgYXMgVDtcbiAgICAgICAgICAgICAgICBjb25zdCBjb25zdHIgPSByZXN1bHQ/LmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc3RyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudENsYXNzID0gY29uc3RyIGFzIE5ld2FibGU8VD47XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc29sdmVyID0gbmV3IExpZmVjeWNsZU1hbmFnZXI8VD4oY29tcG9uZW50Q2xhc3MsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0luc3RBd2FyZVByb2Nlc3NvciA9IHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5pc0luc3RBd2FyZVByb2Nlc3NvckNsYXNzKGNvbXBvbmVudENsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZXIuaW52b2tlUHJlSW5qZWN0TWV0aG9kKHJlc3VsdCBhcyBJbnN0YW5jZTxUPik7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNJbnN0QXdhcmVQcm9jZXNzb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5hZnRlckluc3RhbnRpYXRpb24ocmVzdWx0IGFzIEluc3RhbmNlPFQ+KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlci5pbnZva2VQb3N0SW5qZWN0TWV0aG9kKHJlc3VsdCBhcyBJbnN0YW5jZTxUPik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNsYXNzTWV0YWRhdGEgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlYWRlcigpLmdldENsYXNzTWV0YWRhdGE8VD4oc3ltYm9sKTtcbiAgICAgICAgICAgICAgICBpZiAoIWNsYXNzTWV0YWRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCcnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzeW1ib2wgPSBjbGFzc01ldGFkYXRhLnJlYWRlcigpLmdldENsYXNzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudENsYXNzID0gc3ltYm9sO1xuICAgICAgICBjb25zdCByZWFkZXIgPSBDbGFzc01ldGFkYXRhLmdldEluc3RhbmNlKGNvbXBvbmVudENsYXNzKS5yZWFkZXIoKTtcbiAgICAgICAgY29uc3Qgc2NvcGUgPSByZWFkZXIuZ2V0U2NvcGUoKTtcbiAgICAgICAgY29uc3QgcmVzb2x1dGlvbiA9ICh0aGlzLnJlc29sdXRpb25zLmdldChzY29wZSkgfHwgdGhpcy5yZXNvbHV0aW9ucy5nZXQodGhpcy5kZWZhdWx0U2NvcGUpKSBhcyBJbnN0YW5jZVJlc29sdXRpb247XG4gICAgICAgIGNvbnN0IGdldEluc3RhbmNlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGlkZW50aWZpZXI6IGNvbXBvbmVudENsYXNzLFxuICAgICAgICAgICAgb3duZXIsXG4gICAgICAgICAgICBvd25lclByb3BlcnR5S2V5OiB1bmRlZmluZWRcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHJlc29sdXRpb24uc2hvdWxkR2VuZXJhdGUoZ2V0SW5zdGFuY2VPcHRpb25zKSkge1xuICAgICAgICAgICAgY29uc3QgYnVpbGRlciA9IHRoaXMuY3JlYXRlQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyKGNvbXBvbmVudENsYXNzKTtcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gYnVpbGRlci5idWlsZCgpO1xuICAgICAgICAgICAgY29uc3Qgc2F2ZUluc3RhbmNlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAuLi5nZXRJbnN0YW5jZU9wdGlvbnMsXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXNvbHV0aW9uLnNhdmVJbnN0YW5jZShzYXZlSW5zdGFuY2VPcHRpb25zKTtcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHV0aW9uLmdldEluc3RhbmNlKGdldEluc3RhbmNlT3B0aW9ucykgYXMgVDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyPFQ+KGNvbXBvbmVudENsYXNzOiBOZXdhYmxlPFQ+KSB7XG4gICAgICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyKGNvbXBvbmVudENsYXNzLCB0aGlzLCB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIpO1xuICAgICAgICBidWlsZGVyLmFwcGVuZExhenlNb2RlKHRoaXMubGF6eU1vZGUpO1xuICAgICAgICByZXR1cm4gYnVpbGRlcjtcbiAgICB9XG5cbiAgICBnZXRGYWN0b3J5KGtleTogRmFjdG9yeUlkZW50aWZpZXIpIHtcbiAgICAgICAgY29uc3QgZmFjdG9yeSA9IEdsb2JhbE1ldGFkYXRhLmdldEluc3RhbmNlKCkucmVhZGVyKCkuZ2V0Q29tcG9uZW50RmFjdG9yeShrZXkpO1xuICAgICAgICBpZiAoIWZhY3RvcnkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZhY3Rvcmllcy5nZXQoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9XG4gICAgYmluZEZhY3Rvcnk8VD4oc3ltYm9sOiBGYWN0b3J5SWRlbnRpZmllciwgZmFjdG9yeTogU2VydmljZUZhY3Rvcnk8VCwgdW5rbm93bj4sIGluamVjdGlvbnM/OiBJZGVudGlmaWVyW10pIHtcbiAgICAgICAgdGhpcy5mYWN0b3JpZXMuc2V0KHN5bWJvbCwgbmV3IFNlcnZpY2VGYWN0b3J5RGVmKGZhY3RvcnksIGluamVjdGlvbnMpKTtcbiAgICB9XG4gICAgaW52b2tlPFIsIEN0eD4oZnVuYzogQW55RnVuY3Rpb248UiwgQ3R4Piwgb3B0aW9uczogSW52b2tlRnVuY3Rpb25PcHRpb25zPEN0eD4gPSB7fSk6IFIge1xuICAgICAgICBsZXQgZm46IEFueUZ1bmN0aW9uPFI+O1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGZuID0gZnVuYy5iaW5kKG9wdGlvbnMuY29udGV4dCBhcyBUaGlzUGFyYW1ldGVyVHlwZTx0eXBlb2YgZnVuYz4pIGFzIEFueUZ1bmN0aW9uPFI+O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm4gPSBmdW5jIGFzIEFueUZ1bmN0aW9uPFI+O1xuICAgICAgICB9XG4gICAgICAgIGlmIChoYXNBcmdzKG9wdGlvbnMpKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5hcmdzID8gZm4oLi4ub3B0aW9ucy5hcmdzKSA6IGZuKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhhc0luamVjdGlvbnMob3B0aW9ucykpIHtcbiAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSBvcHRpb25zLmluamVjdGlvbnMgPyBvcHRpb25zLmluamVjdGlvbnMubWFwKGl0ID0+IHRoaXMuZ2V0SW5zdGFuY2UoaXQpKSA6IFtdO1xuICAgICAgICAgICAgcmV0dXJuIGFyZ3MubGVuZ3RoID4gMCA/IGZuKC4uLmFyZ3MpIDogZm4oKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGZuLCBGdW5jdGlvbk1ldGFkYXRhKS5yZWFkZXIoKTtcbiAgICAgICAgY29uc3QgcGFyYW1ldGVySWRlbnRpZmllcnMgPSBtZXRhZGF0YS5nZXRQYXJhbWV0ZXJzKCk7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSBwYXJhbWV0ZXJJZGVudGlmaWVycy5tYXAoaWRlbnRpZmllciA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW5jZShpZGVudGlmaWVyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmbiguLi5hcmdzKTtcbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5ldmVudEVtaXR0ZXIuZW1pdChQUkVfREVTVFJPWV9FVkVOVF9LRVkpO1xuICAgICAgICB0aGlzLnJlc29sdXRpb25zLmZvckVhY2goaXQgPT4ge1xuICAgICAgICAgICAgaXQuZGVzdHJveSgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZXZhbHVhdGU8VCwgTywgQT4oZXhwcmVzc2lvbjogc3RyaW5nLCBvcHRpb25zOiBFdmFsdWF0aW9uT3B0aW9uczxPLCBzdHJpbmcsIEE+KTogVCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IGV2YWx1YXRvckNsYXNzID0gdGhpcy5ldmFsdWF0b3JDbGFzc2VzLmdldChvcHRpb25zLnR5cGUpO1xuICAgICAgICBpZiAoIWV2YWx1YXRvckNsYXNzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBVbmtub3duIGV2YWx1YXRvciBuYW1lOiAke29wdGlvbnMudHlwZX1gKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBldmFsdWF0b3IgPSB0aGlzLmdldEluc3RhbmNlKGV2YWx1YXRvckNsYXNzKTtcbiAgICAgICAgcmV0dXJuIGV2YWx1YXRvci5ldmFsKHRoaXMsIGV4cHJlc3Npb24sIG9wdGlvbnMuZXh0ZXJuYWxBcmdzKTtcbiAgICB9XG4gICAgcmVjb3JkSlNPTkRhdGEobmFtZXNwYWNlOiBzdHJpbmcsIGRhdGE6IEpTT05EYXRhKSB7XG4gICAgICAgIGNvbnN0IGV2YWx1YXRvciA9IHRoaXMuZ2V0SW5zdGFuY2UoSlNPTkRhdGFFdmFsdWF0b3IpO1xuICAgICAgICBldmFsdWF0b3IucmVjb3JkRGF0YShuYW1lc3BhY2UsIGRhdGEpO1xuICAgIH1cbiAgICBiaW5kSW5zdGFuY2U8VD4oaWRlbnRpZmllcjogc3RyaW5nIHwgc3ltYm9sLCBpbnN0YW5jZTogVCkge1xuICAgICAgICBjb25zdCByZXNvbHV0aW9uID0gdGhpcy5yZXNvbHV0aW9ucy5nZXQoSW5zdGFuY2VTY29wZS5TSU5HTEVUT04pO1xuICAgICAgICByZXNvbHV0aW9uPy5zYXZlSW5zdGFuY2Uoe1xuICAgICAgICAgICAgaWRlbnRpZmllcixcbiAgICAgICAgICAgIGluc3RhbmNlXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZWdpc3Rlckluc3RhbmNlU2NvcGVSZXNvbHV0aW9uPFQgZXh0ZW5kcyBOZXdhYmxlPEluc3RhbmNlUmVzb2x1dGlvbj4+KFxuICAgICAgICBzY29wZTogSW5zdGFuY2VTY29wZSB8IHN0cmluZyxcbiAgICAgICAgcmVzb2x1dGlvbkNvbnN0cnVjdG9yOiBULFxuICAgICAgICBjb25zdHJ1Y3RvckFyZ3M/OiBDb25zdHJ1Y3RvclBhcmFtZXRlcnM8VD5cbiAgICApIHtcbiAgICAgICAgdGhpcy5yZXNvbHV0aW9ucy5zZXQoc2NvcGUsIG5ldyByZXNvbHV0aW9uQ29uc3RydWN0b3IoLi4uKGNvbnN0cnVjdG9yQXJncyB8fCBbXSkpKTtcbiAgICB9XG4gICAgcmVnaXN0ZXJFdmFsdWF0b3IobmFtZTogc3RyaW5nLCBldmFsdWF0b3JDbGFzczogTmV3YWJsZTxFdmFsdWF0b3I+KSB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoZXZhbHVhdG9yQ2xhc3MsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBtZXRhZGF0YS5zZXRTY29wZShJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTik7XG4gICAgICAgIHRoaXMuZXZhbHVhdG9yQ2xhc3Nlcy5zZXQobmFtZSwgZXZhbHVhdG9yQ2xhc3MpO1xuICAgIH1cbiAgICByZWdpc3Rlckluc3RBd2FyZVByb2Nlc3NvcihjbGF6ejogTmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPikge1xuICAgICAgICB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuYXBwZW5kSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoY2xhenopO1xuICAgIH1cbiAgICBvblByZURlc3Ryb3kobGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRFbWl0dGVyLm9uKFBSRV9ERVNUUk9ZX0VWRU5UX0tFWSwgbGlzdGVuZXIpO1xuICAgIH1cbiAgICBnZXRDbGFzc01ldGFkYXRhPFQ+KGN0b3I6IE5ld2FibGU8VD4pIHtcbiAgICAgICAgcmV0dXJuIENsYXNzTWV0YWRhdGEuZ2V0SW5zdGFuY2UoY3RvcikucmVhZGVyKCkgYXMgQ2xhc3NNZXRhZGF0YVJlYWRlcjxUPjtcbiAgICB9XG59XG4iXSwibmFtZXMiOlsiUmVmbGVjdCIsImdsb2JhbCJdLCJtYXBwaW5ncyI6IkFBS0EsSUFBQSxpQkFBQSxrQkFBQSxZQUFBO0lBVUksU0FBNEIsaUJBQUEsQ0FBQSxPQUFtQyxFQUFrQixVQUF5QixFQUFBO1FBQTlFLElBQU8sQ0FBQSxPQUFBLEdBQVAsT0FBTyxDQUE0QjtRQUFrQixJQUFVLENBQUEsVUFBQSxHQUFWLFVBQVUsQ0FBZTtLQUFJO0lBVHZHLGlCQUF1QixDQUFBLHVCQUFBLEdBQTlCLFVBQWtDLFFBQTBCLEVBQUE7QUFDeEQsUUFBQSxPQUFPLElBQUksaUJBQWlCLENBQUMsVUFBQyxTQUE2QixFQUFFLEtBQWMsRUFBQTtZQUN2RSxPQUFPLFlBQUE7QUFDSCxnQkFBQSxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDakMsZ0JBQUEsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNoQyxPQUFPLFNBQVMsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQy9DLGFBQUMsQ0FBQztBQUNOLFNB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QyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLGFBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU0sUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQWtCLEdBQUEsU0FBQSxDQUFBLFVBQUEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLFNBQUEsQ0FBQSxpQkFBeUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsUUFBZ0IsR0FBQSxTQUFBLENBQUEsUUFBQSxDQUFDLENBQUMsQ0FBQyxTQUFBLENBQUEsT0FBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQ1IzK0QsSUFBQSxnQkFBQSxrQkFBQSxZQUFBO0lBRUksU0FBNkIsZ0JBQUEsQ0FBQSxjQUEwQixFQUFtQixTQUE2QixFQUFBO1FBQTFFLElBQWMsQ0FBQSxjQUFBLEdBQWQsY0FBYyxDQUFZO1FBQW1CLElBQVMsQ0FBQSxTQUFBLEdBQVQsU0FBUyxDQUFvQjtBQUNuRyxRQUFBLElBQUksQ0FBQyxtQkFBbUIsR0FBRyx1QkFBdUIsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxhQUFhLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUMvRztJQUNELGdCQUFxQixDQUFBLFNBQUEsQ0FBQSxxQkFBQSxHQUFyQixVQUFzQixRQUFxQixFQUFBO0FBQ3ZDLFFBQUEsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDMUUsUUFBQSxJQUFJLENBQUMsc0JBQXNCLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ2xELENBQUE7SUFDRCxnQkFBc0IsQ0FBQSxTQUFBLENBQUEsc0JBQUEsR0FBdEIsVUFBdUIsUUFBcUIsRUFBQTtBQUN4QyxRQUFBLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzNFLFFBQUEsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUNsRCxDQUFBO0lBQ0QsZ0JBQTRCLENBQUEsU0FBQSxDQUFBLDRCQUFBLEdBQTVCLFVBQTZCLFFBQXFCLEVBQUE7QUFDOUMsUUFBQSxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUMzRSxRQUFBLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDbEQsQ0FBQTtBQUNPLElBQUEsZ0JBQUEsQ0FBQSxTQUFBLENBQUEsc0JBQXNCLEdBQTlCLFVBQStCLFFBQXFCLEVBQUUsVUFBa0MsRUFBQTtRQUF4RixJQU1DLEtBQUEsR0FBQSxJQUFBLENBQUE7QUFMRyxRQUFBLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHLEVBQUE7WUFDbEIsS0FBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ2pDLGdCQUFBLE9BQU8sRUFBRSxRQUFRO0FBQ3BCLGFBQUEsQ0FBQyxDQUFDO0FBQ1AsU0FBQyxDQUFDLENBQUM7S0FDTixDQUFBO0lBQ0wsT0FBQyxnQkFBQSxDQUFBO0FBQUQsQ0FBQyxFQUFBLENBQUE7O0FDcEJELElBQUEsd0JBQUEsa0JBQUEsWUFBQTtBQUtJLElBQUEsU0FBQSx3QkFBQSxDQUNxQixjQUEwQixFQUMxQixTQUE2QixFQUM3Qix5QkFBNkQsRUFBQTtRQUY3RCxJQUFjLENBQUEsY0FBQSxHQUFkLGNBQWMsQ0FBWTtRQUMxQixJQUFTLENBQUEsU0FBQSxHQUFULFNBQVMsQ0FBb0I7UUFDN0IsSUFBeUIsQ0FBQSx5QkFBQSxHQUF6Qix5QkFBeUIsQ0FBb0M7QUFQMUUsUUFBQSxJQUFBLENBQUEsa0JBQWtCLEdBQW9CLFlBQU0sRUFBQSxPQUFBLEVBQUUsQ0FBQSxFQUFBLENBQUM7UUFDL0MsSUFBaUIsQ0FBQSxpQkFBQSxHQUF3RCxFQUFFLENBQUM7UUFDNUUsSUFBUSxDQUFBLFFBQUEsR0FBWSxJQUFJLENBQUM7UUFPN0IsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksZ0JBQWdCLENBQUksY0FBYyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzVFLFFBQUEsSUFBTSxNQUFNLEdBQUcsdUJBQXVCLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxhQUFhLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMzRixRQUFBLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNwQztJQUNELHdCQUFjLENBQUEsU0FBQSxDQUFBLGNBQUEsR0FBZCxVQUFlLFFBQWlCLEVBQUE7QUFDNUIsUUFBQSxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztLQUM1QixDQUFBO0lBQ08sd0JBQW1CLENBQUEsU0FBQSxDQUFBLG1CQUFBLEdBQTNCLFVBQStCLG1CQUEyQyxFQUFBOztRQUExRSxJQWdDQyxLQUFBLEdBQUEsSUFBQSxDQUFBO0FBL0JHLFFBQUEsSUFBTSxLQUFLLEdBQUcsbUJBQW1CLENBQUMsNEJBQTRCLEVBQUUsQ0FBQztRQUNqRSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsWUFBQTtBQUN0QixZQUFBLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEVBQUUsRUFBQTtnQkFDZixPQUFPLEtBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzFDLGFBQUMsQ0FBQyxDQUFDO0FBQ1AsU0FBQyxDQUFDO1FBQ0YsSUFBTSxvQkFBb0IsR0FBRyxjQUFjLENBQUMsV0FBVyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbkUsUUFBQSxJQUFNLFVBQVUsR0FBRyxtQkFBbUIsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0FBQ2hELFFBQUEsSUFBQSxPQUFBLEdBQUEsVUFBQSxZQUFZLEVBQUUsWUFBWSxFQUFBO0FBQ2xDLFlBQUEsSUFBSSxPQUFPLFlBQVksS0FBSyxVQUFVLEVBQUU7Z0JBQ3BDLE1BQUssQ0FBQSxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsR0FBRyxJQUFJLGlCQUFpQixDQUFDLFVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQTtBQUMxRSxvQkFBQSxPQUFPLFlBQU0sRUFBQSxPQUFBLFNBQVMsQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUExQyxFQUEwQyxDQUFDO0FBQzVELGlCQUFDLENBQUMsQ0FBQzs7QUFFTixhQUFBO1lBQ0QsSUFBTSxPQUFPLEdBQUcsTUFBSyxDQUFBLFNBQVMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDeEQsWUFBQSxJQUFJLE9BQU8sRUFBRTtBQUNULGdCQUFBLE1BQUEsQ0FBSyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsR0FBRyxPQUFPLENBQUM7O0FBRWxELGFBQUE7WUFDRCxJQUFNLHFCQUFxQixHQUFHLG9CQUFvQixDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2xGLFlBQUEsSUFBSSxxQkFBcUIsRUFBRTtnQkFDdkIsTUFBSyxDQUFBLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxHQUFHLGlCQUFpQixDQUFDLHVCQUF1QixDQUFDLHFCQUFxQixDQUFDLENBQUM7O0FBRTNHLGFBQUE7WUFDRCxJQUFNLGVBQWUsR0FBRyxvQkFBb0IsQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMvRSxZQUFBLElBQUksZUFBZSxFQUFFO0FBQ2pCLGdCQUFBLE1BQUEsQ0FBSyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsR0FBRyxlQUFlLENBQUM7O0FBRTFELGFBQUE7Ozs7QUFyQkwsWUFBQSxLQUEyQyxJQUFBLFlBQUEsR0FBQSxRQUFBLENBQUEsVUFBVSxDQUFBLEVBQUEsY0FBQSxHQUFBLFlBQUEsQ0FBQSxJQUFBLEVBQUEsRUFBQSxDQUFBLGNBQUEsQ0FBQSxJQUFBLEVBQUEsY0FBQSxHQUFBLFlBQUEsQ0FBQSxJQUFBLEVBQUEsRUFBQTtBQUExQyxnQkFBQSxJQUFBLEtBQUEsTUFBNEIsQ0FBQSxjQUFBLENBQUEsS0FBQSxFQUFBLENBQUEsQ0FBQSxFQUEzQixZQUFZLEdBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxFQUFFLFlBQVksR0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLENBQUE7QUFBMUIsZ0JBQUEsT0FBQSxDQUFBLFlBQVksRUFBRSxZQUFZLENBQUEsQ0FBQTtBQXNCckMsYUFBQTs7Ozs7Ozs7O0tBQ0osQ0FBQTtBQUNELElBQUEsd0JBQUEsQ0FBQSxTQUFBLENBQUEsS0FBSyxHQUFMLFlBQUE7O0FBQ0ksUUFBQSxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztBQUN2QyxRQUFBLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxDQUFDO0FBQ3hELFFBQUEsSUFBTSw0QkFBNEIsR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25ILFFBQUEsSUFBSSw0QkFBNEIsRUFBRTtBQUM5QixZQUFBLElBQU0sUUFBUSxHQUFHLEtBQUksQ0FBQSxFQUFBLEdBQUEsSUFBSSxDQUFDLGNBQWMsRUFBQSxJQUFBLENBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxhQUFBLENBQUEsQ0FBQSxLQUFBLENBQUEsQ0FBQSxFQUFBLE1BQUEsQ0FBSSxJQUFJLENBQUEsRUFBQSxLQUFBLENBQUEsQ0FBQSxHQUFnQixDQUFDO0FBQ2pFLFlBQUEsSUFBSSxDQUFDLGlCQUFpQixDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZELFlBQUEsS0FBSyxJQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUU7Z0JBQzFCLElBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDekMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzlDLGFBQUE7QUFDRCxZQUFBLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN4RCxZQUFBLE9BQU8sUUFBUSxDQUFDO0FBQ25CLFNBQUE7QUFBTSxhQUFBO0FBQ0gsWUFBQSxJQUFJLFFBQVEsR0FBNEIsSUFBSSxDQUFDLHlCQUF5QixDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdEgsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDWCxRQUFRLEdBQUcsS0FBSSxDQUFBLEVBQUEsR0FBQSxJQUFJLENBQUMsY0FBYyxFQUFBLElBQUEsQ0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLGFBQUEsQ0FBQSxDQUFBLEtBQUEsQ0FBQSxDQUFBLEVBQUEsTUFBQSxDQUFJLElBQUksQ0FBQSxFQUFBLEtBQUEsQ0FBQSxDQUFBLEdBQWdCLENBQUM7QUFDOUQsYUFBQTtBQUNELFlBQUEsSUFBSSxDQUFDLGlCQUFpQixDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZELFlBQUEsS0FBSyxJQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUU7Z0JBQzFCLElBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDekMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzlDLGFBQUE7WUFDRCxRQUFRLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZFLFlBQUEsSUFBSSxDQUFDLGlCQUFpQixDQUFDLHNCQUFzQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3hELFlBQUEsT0FBTyxRQUFRLENBQUM7QUFDbkIsU0FBQTtLQUNKLENBQUE7QUFDTyxJQUFBLHdCQUFBLENBQUEsU0FBQSxDQUFBLGNBQWMsR0FBdEIsVUFBNkIsUUFBVyxFQUFFLEdBQW9CLEVBQUUsTUFBZSxFQUFBO1FBQzNFLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNmLFlBQUEsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbkMsU0FBQTtBQUFNLGFBQUE7OztBQUdILFlBQUEsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDO0FBQzVCLFNBQUE7S0FDSixDQUFBO0FBQ08sSUFBQSx3QkFBQSxDQUFBLFNBQUEsQ0FBQSw2QkFBNkIsR0FBckMsWUFBQTtRQUFBLElBY0MsS0FBQSxHQUFBLElBQUEsQ0FBQTtRQWJHLElBQU0sTUFBTSxHQUFHLEVBQXFELENBQUM7Z0NBQzFELEdBQUcsRUFBQTtBQUNKLFlBQUEsSUFBQSxFQUEwQixHQUFBLE1BQUEsQ0FBSyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBbkQsT0FBTyxHQUFBLEVBQUEsQ0FBQSxPQUFBLEVBQUUsVUFBVSxHQUFBLEVBQUEsQ0FBQSxVQUFnQyxDQUFDO0FBQzVELFlBQUEsTUFBTSxDQUFDLEdBQWMsQ0FBQyxHQUFHLFVBQUksUUFBVyxFQUFBO2dCQUNwQyxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsS0FBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDN0MsT0FBTyxZQUFBO0FBQ0gsb0JBQUEsT0FBTyxLQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUU7QUFDN0Isd0JBQUEsVUFBVSxFQUFBLFVBQUE7QUFDYixxQkFBQSxDQUFDLENBQUM7QUFDUCxpQkFBQyxDQUFDO0FBQ04sYUFBQyxDQUFDOzs7QUFUTixRQUFBLEtBQUssSUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFBO29CQUE3QixHQUFHLENBQUEsQ0FBQTtBQVViLFNBQUE7QUFDRCxRQUFBLE9BQU8sTUFBTSxDQUFDO0tBQ2pCLENBQUE7SUFDTCxPQUFDLHdCQUFBLENBQUE7QUFBRCxDQUFDLEVBQUEsQ0FBQTs7QUM1R00sSUFBTSxxQkFBcUIsR0FBRyxNQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQVFyRSxJQUFBLGdCQUFBLGtCQUFBLFlBQUE7QUFBQSxJQUFBLFNBQUEsZ0JBQUEsR0FBQTtRQUlxQixJQUFVLENBQUEsVUFBQSxHQUFpQixFQUFFLENBQUM7UUFFdkMsSUFBUyxDQUFBLFNBQUEsR0FBWSxLQUFLLENBQUM7S0FzQnRDO0FBM0JVLElBQUEsZ0JBQUEsQ0FBQSxhQUFhLEdBQXBCLFlBQUE7QUFDSSxRQUFBLE9BQU8scUJBQXFCLENBQUM7S0FDaEMsQ0FBQTtBQUlELElBQUEsZ0JBQUEsQ0FBQSxTQUFBLENBQUEsZ0JBQWdCLEdBQWhCLFVBQWlCLEtBQWEsRUFBRSxNQUFrQixFQUFBO0FBQzlDLFFBQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUM7S0FDbkMsQ0FBQTtJQUNELGdCQUFRLENBQUEsU0FBQSxDQUFBLFFBQUEsR0FBUixVQUFTLEtBQW9CLEVBQUE7QUFDekIsUUFBQSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUN0QixDQUFBO0lBQ0QsZ0JBQVksQ0FBQSxTQUFBLENBQUEsWUFBQSxHQUFaLFVBQWEsU0FBa0IsRUFBQTtBQUMzQixRQUFBLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0tBQzlCLENBQUE7QUFDRCxJQUFBLGdCQUFBLENBQUEsU0FBQSxDQUFBLElBQUksR0FBSixZQUFBOztLQUVDLENBQUE7QUFDRCxJQUFBLGdCQUFBLENBQUEsU0FBQSxDQUFBLE1BQU0sR0FBTixZQUFBO1FBQUEsSUFRQyxLQUFBLEdBQUEsSUFBQSxDQUFBO1FBUEcsT0FBTztBQUNILFlBQUEsYUFBYSxFQUFFLFlBQUE7Z0JBQ1gsT0FBTyxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNuQztBQUNELFlBQUEsU0FBUyxFQUFFLFlBQU0sRUFBQSxPQUFBLEtBQUksQ0FBQyxTQUFTLEdBQUE7QUFDL0IsWUFBQSxRQUFRLEVBQUUsWUFBTSxFQUFBLE9BQUEsS0FBSSxDQUFDLEtBQUssR0FBQTtTQUM3QixDQUFDO0tBQ0wsQ0FBQTtJQUNMLE9BQUMsZ0JBQUEsQ0FBQTtBQUFELENBQUMsRUFBQSxDQUFBOztBQ3pDRCxJQUFJLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxDQUFDO0FBRTFCLElBQUEsd0JBQUEsa0JBQUEsWUFBQTtBQUdJLElBQUEsU0FBQSx3QkFBQSxDQUE0QixRQUFpQixFQUFBO1FBQWpCLElBQVEsQ0FBQSxRQUFBLEdBQVIsUUFBUSxDQUFTO1FBRjdCLElBQVEsQ0FBQSxRQUFBLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQztLQUVHO0lBRTFDLHdCQUFTLENBQUEsU0FBQSxDQUFBLFNBQUEsR0FBaEIsVUFBaUIsS0FBK0IsRUFBQTtBQUM1QyxRQUFBLE9BQU8sSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3ZGLENBQUE7SUFDTCxPQUFDLHdCQUFBLENBQUE7QUFBRCxDQUFDLEVBQUEsQ0FBQTs7QUNOSyxTQUFVLGdCQUFnQixDQUFDLFFBQWlCLEVBQUE7SUFDOUMsSUFBTSxLQUFLLEdBQUcsUUFBUSxLQUFBLElBQUEsSUFBUixRQUFRLEtBQVIsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsUUFBUSxDQUFFLFdBQVcsQ0FBQztJQUNwQyxJQUFJLENBQUMsS0FBSyxFQUFFO1FBQ1IsT0FBTztBQUNWLEtBQUE7SUFDRCxJQUFNLFFBQVEsR0FBRyx1QkFBdUIsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQzNFLElBQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDckUsSUFBQSxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsVUFBQSxVQUFVLEVBQUE7UUFDaEMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMzQyxRQUFBLElBQUksT0FBTyxNQUFNLEtBQUssVUFBVSxFQUFFO0FBQzlCLFlBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQixTQUFBO0FBQ0wsS0FBQyxDQUFDLENBQUM7QUFDUDs7QUNaQSxJQUFBLDJCQUFBLGtCQUFBLFlBQUE7QUFBQSxJQUFBLFNBQUEsMkJBQUEsR0FBQTtBQUNxQixRQUFBLElBQUEsQ0FBQSxZQUFZLEdBQUcsSUFBSSxHQUFHLEVBQXdDLENBQUM7S0FvQm5GO0lBbkJHLDJCQUFXLENBQUEsU0FBQSxDQUFBLFdBQUEsR0FBWCxVQUFrQixPQUFpQyxFQUFBOztBQUMvQyxRQUFBLE9BQU8sQ0FBQSxFQUFBLEdBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFFLFFBQWEsQ0FBQztLQUNuRSxDQUFBO0lBRUQsMkJBQVksQ0FBQSxTQUFBLENBQUEsWUFBQSxHQUFaLFVBQW1CLE9BQWtDLEVBQUE7QUFDakQsUUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksd0JBQXdCLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7S0FDN0YsQ0FBQTtJQUVELDJCQUFjLENBQUEsU0FBQSxDQUFBLGNBQUEsR0FBZCxVQUFxQixPQUFpQyxFQUFBO1FBQ2xELE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDckQsQ0FBQTtBQUNELElBQUEsMkJBQUEsQ0FBQSxTQUFBLENBQUEsT0FBTyxHQUFQLFlBQUE7QUFDSSxRQUFBLElBQU0sZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDaEUsUUFBQSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFLLEVBQUEsT0FBQSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFkLEVBQWMsQ0FBQyxDQUFDO0FBQ2hELFFBQUEsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFVBQUEsZUFBZSxFQUFBO0FBQ3BDLFlBQUEsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9DLFNBQUMsQ0FBQyxDQUFDO0FBQ0gsUUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQzdCLENBQUE7SUFDTCxPQUFDLDJCQUFBLENBQUE7QUFBRCxDQUFDLEVBQUEsQ0FBQTs7QUN2QkQsSUFBTSw0QkFBNEIsR0FBRyxJQUFJLDJCQUEyQixFQUFFLENBQUM7QUFFdkUsSUFBQSw4QkFBQSxrQkFBQSxZQUFBO0FBQUEsSUFBQSxTQUFBLDhCQUFBLEdBQUE7S0FlQztJQWRHLDhCQUFXLENBQUEsU0FBQSxDQUFBLFdBQUEsR0FBWCxVQUFrQixPQUFpQyxFQUFBO0FBQy9DLFFBQUEsT0FBTyw0QkFBNEIsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDNUQsQ0FBQTtJQUVELDhCQUFZLENBQUEsU0FBQSxDQUFBLFlBQUEsR0FBWixVQUFtQixPQUFrQyxFQUFBO0FBQ2pELFFBQUEsNEJBQTRCLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3RELENBQUE7SUFFRCw4QkFBYyxDQUFBLFNBQUEsQ0FBQSxjQUFBLEdBQWQsVUFBcUIsT0FBaUMsRUFBQTtBQUNsRCxRQUFBLE9BQU8sNEJBQTRCLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQy9ELENBQUE7QUFDRCxJQUFBLDhCQUFBLENBQUEsU0FBQSxDQUFBLE9BQU8sR0FBUCxZQUFBOztLQUVDLENBQUE7SUFDTCxPQUFDLDhCQUFBLENBQUE7QUFBRCxDQUFDLEVBQUEsQ0FBQTs7QUNqQkQsSUFBQSwyQkFBQSxrQkFBQSxZQUFBO0FBQUEsSUFBQSxTQUFBLDJCQUFBLEdBQUE7QUFDcUIsUUFBQSxJQUFBLENBQUEsU0FBUyxHQUFHLElBQUksR0FBRyxFQUFXLENBQUM7S0FxQm5EO0FBcEJHLElBQUEsMkJBQUEsQ0FBQSxTQUFBLENBQUEsY0FBYyxHQUFkLFlBQUE7QUFDSSxRQUFBLE9BQU8sSUFBSSxDQUFDO0tBQ2YsQ0FBQTtBQUVELElBQUEsMkJBQUEsQ0FBQSxTQUFBLENBQUEsV0FBVyxHQUFYLFlBQUE7UUFDSSxPQUFPO0tBQ1YsQ0FBQTtJQUVELDJCQUFZLENBQUEsU0FBQSxDQUFBLFlBQUEsR0FBWixVQUFtQixPQUFrQyxFQUFBO1FBQ2pELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUN4QyxDQUFBO0FBQ0QsSUFBQSwyQkFBQSxDQUFBLFNBQUEsQ0FBQSxPQUFPLEdBQVAsWUFBQTtBQUNJLFFBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQSxFQUFFLEVBQUE7WUFDckIsSUFBSSxDQUFDLEVBQUUsRUFBRTtnQkFDTCxPQUFPO0FBQ1YsYUFBQTtZQUNELGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3pCLFNBQUMsQ0FBQyxDQUFDO0FBQ0gsUUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQzFCLENBQUE7SUFDTCxPQUFDLDJCQUFBLENBQUE7QUFBRCxDQUFDLEVBQUEsQ0FBQTs7QUNyQkQsSUFBQSxpQkFBQSxrQkFBQSxZQUFBO0FBQUEsSUFBQSxTQUFBLGlCQUFBLEdBQUE7QUFDcUIsUUFBQSxJQUFBLENBQUEsZ0JBQWdCLEdBQUcsSUFBSSxHQUFHLEVBQW9CLENBQUM7S0FpQm5FO0FBaEJHLElBQUEsaUJBQUEsQ0FBQSxTQUFBLENBQUEsSUFBSSxHQUFKLFVBQVEsT0FBMkIsRUFBRSxVQUFrQixFQUFBO1FBQ25ELElBQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0MsUUFBQSxJQUFJLFVBQVUsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNuQixZQUFBLE1BQU0sSUFBSSxLQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQztBQUNwRSxTQUFBO1FBQ0QsSUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDdEQsSUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUU7QUFDdkMsWUFBQSxNQUFNLElBQUksS0FBSyxDQUFDLDBEQUFrRCxTQUFTLEVBQUEsSUFBQSxDQUFHLENBQUMsQ0FBQztBQUNuRixTQUFBO1FBQ0QsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQWEsQ0FBQztBQUM5RCxRQUFBLE9BQU8sYUFBYSxDQUFDLEdBQUcsRUFBRSxJQUFjLENBQUMsQ0FBQztLQUM3QyxDQUFBO0FBQ0QsSUFBQSxpQkFBQSxDQUFBLFNBQUEsQ0FBQSxVQUFVLEdBQVYsVUFBVyxTQUFpQixFQUFFLElBQWMsRUFBQTtRQUN4QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUM5QyxDQUFBO0lBQ0wsT0FBQyxpQkFBQSxDQUFBO0FBQUQsQ0FBQyxFQUFBLENBQUEsQ0FBQTtBQUVELFNBQVMsYUFBYSxDQUFDLFVBQWtCLEVBQUUsV0FBbUIsRUFBQTtBQUMxRCxJQUFBLElBQU0sRUFBRSxHQUFHLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3pDLElBQUEsT0FBTyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDM0IsQ0FBQztBQUVELFNBQVMsaUJBQWlCLENBQUMsVUFBa0IsRUFBQTtJQUN6QyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDOUIsUUFBQSxNQUFNLElBQUksS0FBSyxDQUFDLCtFQUF1RSxVQUFVLEVBQUEsSUFBQSxDQUFHLENBQUMsQ0FBQztBQUN6RyxLQUFBO0FBQ0QsSUFBQSxJQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFO1FBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQ1gseUZBQUEsQ0FBQSxNQUFBLENBQTBGLFVBQVUsQ0FBQyxNQUFNLENBQUUsQ0FDaEgsQ0FBQztBQUNMLEtBQUE7QUFDRCxJQUFBLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUM1QixRQUFBLE1BQU0sSUFBSSxLQUFLLENBQUMsb0ZBQTRFLFVBQVUsRUFBQSxJQUFBLENBQUcsQ0FBQyxDQUFDO0FBQzlHLEtBQUE7QUFDRCxJQUFBLFVBQVUsR0FBRyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDL0IsSUFBSSxVQUFVLEtBQUssRUFBRSxFQUFFO0FBQ25CLFFBQUEsT0FBTyxVQUFDLElBQVksRUFBQSxFQUFLLE9BQUEsSUFBSSxDQUFBLEVBQUEsQ0FBQztBQUNqQyxLQUFBO0FBRUQsSUFBQSxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDdkMsT0FBTyxJQUFJLFFBQVEsQ0FDZixXQUFXLEVBQ1gsK0RBR2EsQ0FBQSxNQUFBLENBQUEsV0FBVyxFQUFJLEdBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFVLEVBRXpDLGlEQUFBLENBQUEsQ0FDQSxDQUFDO0FBQ04sQ0FBQztBQUNELElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUM5QixTQUFTLE9BQU8sQ0FBQyxNQUFjLEVBQUE7QUFDM0IsSUFBQSxPQUFPLE1BQU0sR0FBRyxFQUFFLEdBQUcsQ0FBQyxZQUFZLEVBQUUsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDdkQ7O0FDekRBLElBQUEsb0JBQUEsa0JBQUEsWUFBQTtBQUFBLElBQUEsU0FBQSxvQkFBQSxHQUFBO0tBSUM7QUFIRyxJQUFBLG9CQUFBLENBQUEsU0FBQSxDQUFBLElBQUksR0FBSixVQUFRLE9BQTJCLEVBQUUsVUFBa0IsRUFBQTtBQUNuRCxRQUFBLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQWtCLENBQUM7S0FDbkQsQ0FBQTtJQUNMLE9BQUMsb0JBQUEsQ0FBQTtBQUFELENBQUMsRUFBQSxDQUFBOztBQ0pELElBQUEsYUFBQSxrQkFBQSxZQUFBO0FBQUEsSUFBQSxTQUFBLGFBQUEsR0FBQTtLQVFDO0FBUEcsSUFBQSxhQUFBLENBQUEsU0FBQSxDQUFBLElBQUksR0FBSixVQUFzQixPQUEyQixFQUFFLFVBQWtCLEVBQUUsSUFBUSxFQUFBO0FBQzNFLFFBQUEsSUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUM7O0FBRWxDLFFBQUEsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3JDLFFBQUEsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNCLFFBQUEsT0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDMUIsQ0FBQTtJQUNMLE9BQUMsYUFBQSxDQUFBO0FBQUQsQ0FBQyxFQUFBLENBQUE7O0FDWEQsSUFBWSxNQU9YLENBQUE7QUFQRCxDQUFBLFVBQVksTUFBTSxFQUFBO0FBQ2QsSUFBQSxNQUFBLENBQUEsTUFBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLFFBQU0sQ0FBQTtBQUNOLElBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxPQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxPQUFLLENBQUE7QUFDTCxJQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsUUFBTSxDQUFBO0FBQ04sSUFBQSxNQUFBLENBQUEsTUFBQSxDQUFBLGFBQUEsQ0FBQSxHQUFBLENBQUEsQ0FBQSxHQUFBLGFBQVcsQ0FBQTtBQUNYLElBQUEsTUFBQSxDQUFBLE1BQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxDQUFBLENBQUEsR0FBQSxRQUFNLENBQUE7QUFDTixJQUFBLE1BQUEsQ0FBQSxNQUFBLENBQUEsU0FBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBLEdBQUEsU0FBTyxDQUFBO0FBQ1gsQ0FBQyxFQVBXLE1BQU0sS0FBTixNQUFNLEdBT2pCLEVBQUEsQ0FBQSxDQUFBOztBQ1BEO0FBVUEsSUFBQSxXQUFBLGtCQUFBLFlBQUE7QUFPSSxJQUFBLFNBQUEsV0FBQSxDQUFvQixFQUEyQixFQUFBO1FBQTNCLElBQUUsQ0FBQSxFQUFBLEdBQUYsRUFBRSxDQUF5QjtRQU52QyxJQUFXLENBQUEsV0FBQSxHQUFzQixFQUFFLENBQUM7UUFDcEMsSUFBVSxDQUFBLFVBQUEsR0FBcUIsRUFBRSxDQUFDO1FBQ2xDLElBQVcsQ0FBQSxXQUFBLEdBQXNCLEVBQUUsQ0FBQztRQUNwQyxJQUFZLENBQUEsWUFBQSxHQUF1QixFQUFFLENBQUM7UUFDdEMsSUFBZ0IsQ0FBQSxnQkFBQSxHQUEyQixFQUFFLENBQUM7UUFDOUMsSUFBVyxDQUFBLFdBQUEsR0FBc0IsRUFBRSxDQUFDO0tBQ087QUFPbkQsSUFBQSxXQUFBLENBQUEsU0FBQSxDQUFBLE1BQU0sR0FBTixVQUFPLE1BQWMsRUFBRSxJQUFjLEVBQUE7QUFDakMsUUFBQSxJQUFJLFVBQWtDLENBQUM7QUFDdkMsUUFBQSxRQUFRLE1BQU07WUFDVixLQUFLLE1BQU0sQ0FBQyxNQUFNO0FBQ2QsZ0JBQUEsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQzlCLE1BQU07WUFDVixLQUFLLE1BQU0sQ0FBQyxLQUFLO0FBQ2IsZ0JBQUEsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQzdCLE1BQU07WUFDVixLQUFLLE1BQU0sQ0FBQyxNQUFNO0FBQ2QsZ0JBQUEsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQzlCLE1BQU07WUFDVixLQUFLLE1BQU0sQ0FBQyxPQUFPO0FBQ2YsZ0JBQUEsVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQy9CLE1BQU07WUFDVixLQUFLLE1BQU0sQ0FBQyxXQUFXO0FBQ25CLGdCQUFBLFVBQVUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7Z0JBQ25DLE1BQU07WUFDVixLQUFLLE1BQU0sQ0FBQyxNQUFNO0FBQ2QsZ0JBQUEsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQzlCLE1BQU07QUFDYixTQUFBO0FBQ0QsUUFBQSxJQUFJLFVBQVUsRUFBRTtBQUNaLFlBQUEsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QixTQUFBO0tBQ0osQ0FBQTtBQUNELElBQUEsV0FBQSxDQUFBLFNBQUEsQ0FBQSxPQUFPLEdBQVAsWUFBQTtRQUNVLElBQUEsRUFBQSxHQUF3RixJQUFJLEVBQTFGLFdBQVcsaUJBQUEsRUFBRSxXQUFXLGlCQUFBLEVBQUUsVUFBVSxnQkFBQSxFQUFFLGdCQUFnQixzQkFBQSxFQUFFLFlBQVksa0JBQUEsRUFBRSxXQUFXLGlCQUFTLENBQUM7UUFDbkcsSUFBTSxFQUFFLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxVQUFDLElBQUksRUFBRSxJQUFJLEVBQUE7WUFDMUMsT0FBTyxZQUFBO2dCQUFVLElBQU8sSUFBQSxHQUFBLEVBQUEsQ0FBQTtxQkFBUCxJQUFPLEVBQUEsR0FBQSxDQUFBLEVBQVAsRUFBTyxHQUFBLFNBQUEsQ0FBQSxNQUFBLEVBQVAsRUFBTyxFQUFBLEVBQUE7b0JBQVAsSUFBTyxDQUFBLEVBQUEsQ0FBQSxHQUFBLFNBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQTs7Z0JBQ3BCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLGFBQUMsQ0FBQztBQUNOLFNBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFtQixDQUFDO1FBQzlCLE9BQU8sWUFBQTtZQUFBLElBZ0ROLEtBQUEsR0FBQSxJQUFBLENBQUE7WUFoRDJCLElBQWMsSUFBQSxHQUFBLEVBQUEsQ0FBQTtpQkFBZCxJQUFjLEVBQUEsR0FBQSxDQUFBLEVBQWQsRUFBYyxHQUFBLFNBQUEsQ0FBQSxNQUFBLEVBQWQsRUFBYyxFQUFBLEVBQUE7Z0JBQWQsSUFBYyxDQUFBLEVBQUEsQ0FBQSxHQUFBLFNBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQTs7QUFDdEMsWUFBQSxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSSxFQUFBO0FBQ3BCLGdCQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzFCLGFBQUMsQ0FBQyxDQUFDO0FBQ0gsWUFBQSxJQUFNLE1BQU0sR0FBRyxVQUFDLE9BQThCLEVBQUUsU0FBcUIsRUFBRSxPQUFrQyxFQUFBO0FBQ3JHLGdCQUFBLElBQUksV0FBZ0IsQ0FBQztnQkFDckIsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO2dCQUN0QixJQUFJO29CQUNBLFdBQVcsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDbkMsSUFBSSxXQUFXLFlBQVksT0FBTyxFQUFFO3dCQUNoQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLHdCQUFBLFdBQVcsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMvRCxxQkFBQTtBQUNKLGlCQUFBO0FBQUMsZ0JBQUEsT0FBTyxLQUFLLEVBQUU7b0JBQ1osT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2xCLGlCQUFBO0FBQVMsd0JBQUE7b0JBQ04sSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNaLHdCQUFBLFNBQVMsRUFBRSxDQUFDO0FBQ2YscUJBQUE7QUFDSixpQkFBQTtBQUNELGdCQUFBLElBQUksU0FBUyxFQUFFO0FBQ1gsb0JBQUEsT0FBTyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQUMsS0FBVSxFQUFBO0FBQy9CLHdCQUFBLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFCLHFCQUFDLENBQUMsQ0FBQztBQUNOLGlCQUFBO0FBQU0scUJBQUE7QUFDSCxvQkFBQSxPQUFPLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUMvQixpQkFBQTtBQUNMLGFBQUMsQ0FBQztZQUNGLE9BQU8sTUFBTSxDQUNULFVBQUEsS0FBSyxFQUFBO0FBQ0QsZ0JBQUEsSUFBSSxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDeEIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUksRUFBSSxFQUFBLE9BQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUE1QixFQUE0QixDQUFDLENBQUM7QUFDN0QsaUJBQUE7QUFBTSxxQkFBQTtBQUNILG9CQUFBLE1BQU0sS0FBSyxDQUFDO0FBQ2YsaUJBQUE7QUFDTCxhQUFDLEVBQ0QsWUFBQTtBQUNJLGdCQUFBLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLEVBQUEsRUFBSSxPQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSSxFQUFFLElBQUksQ0FBQyxDQUFyQixFQUFxQixDQUFDLENBQUM7YUFDdkQsRUFDRCxVQUFBLEtBQUssRUFBQTtBQUNELGdCQUFBLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLEVBQUE7QUFDbkIsb0JBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDMUIsaUJBQUMsQ0FBQyxDQUFDO0FBQ0gsZ0JBQUEsT0FBTyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsVUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFBO29CQUN4QyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDeEMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNkLGFBQUMsQ0FDSixDQUFDO0FBQ04sU0FBQyxDQUFDO0tBQ0wsQ0FBQTtJQUNMLE9BQUMsV0FBQSxDQUFBO0FBQUQsQ0FBQyxFQUFBLENBQUE7O0FDbkdLLFNBQVUsWUFBWSxDQUN4QixNQUEwQixFQUMxQixNQUFTLEVBQ1QsVUFBMkIsRUFDM0IsVUFBb0IsRUFDcEIsUUFBaUMsRUFBQTtJQUVqQyxJQUFNLGVBQWUsR0FBRyxVQUFDLE1BQWMsRUFBRSxJQUFXLEVBQUUsV0FBdUIsRUFBRSxLQUFpQixFQUFBO0FBQTFDLFFBQUEsSUFBQSxXQUFBLEtBQUEsS0FBQSxDQUFBLEVBQUEsRUFBQSxXQUF1QixHQUFBLElBQUEsQ0FBQSxFQUFBO0FBQUUsUUFBQSxJQUFBLEtBQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLEtBQWlCLEdBQUEsSUFBQSxDQUFBLEVBQUE7UUFDNUYsT0FBTztBQUNILFlBQUEsTUFBTSxFQUFBLE1BQUE7QUFDTixZQUFBLFVBQVUsRUFBQSxVQUFBO0FBQ1YsWUFBQSxTQUFTLEVBQUUsSUFBSTtBQUNmLFlBQUEsV0FBVyxFQUFBLFdBQUE7QUFDWCxZQUFBLEtBQUssRUFBQSxLQUFBO0FBQ0wsWUFBQSxNQUFNLEVBQUEsTUFBQTtTQUNULENBQUM7QUFDTixLQUFDLENBQUM7QUFDRixJQUFBLElBQU0sV0FBVyxHQUFHLElBQUksV0FBVyxDQUFDLFVBQXFDLENBQUMsQ0FBQztBQUMzRSxJQUFBLElBQU0sZUFBZSxHQUFHLFVBQUMsV0FBNEIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUEsRUFBQSxDQUFDO0FBQzFGLElBQUEsSUFBTSxtQkFBbUIsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ2xHLElBQUEsSUFBTSxrQkFBa0IsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ2hHLElBQUEsSUFBTSxxQkFBcUIsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3BHLElBQUEsSUFBTSx1QkFBdUIsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3ZHLElBQUEsSUFBTSx3QkFBd0IsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzVHLElBQUEsSUFBTSxtQkFBbUIsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRWxHLElBQUEsSUFBSSxtQkFBbUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ2hDLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFDLElBQVcsRUFBQTtZQUMxQyxJQUFNLFNBQVMsR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN2RCxZQUFBLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxVQUFBLE1BQU0sRUFBQTtBQUM5QixnQkFBQSxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzlCLGFBQUMsQ0FBQyxDQUFDO0FBQ1AsU0FBQyxDQUFDLENBQUM7QUFDTixLQUFBO0FBQ0QsSUFBQSxJQUFJLGtCQUFrQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDL0IsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFVBQUMsSUFBVyxFQUFBO1lBQ3pDLElBQU0sU0FBUyxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3RELFlBQUEsa0JBQWtCLENBQUMsT0FBTyxDQUFDLFVBQUEsTUFBTSxFQUFBO0FBQzdCLGdCQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDOUIsYUFBQyxDQUFDLENBQUM7QUFDUCxTQUFDLENBQUMsQ0FBQztBQUNOLEtBQUE7QUFDRCxJQUFBLElBQUkscUJBQXFCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUNsQyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFBO0FBQzFDLFlBQUEsSUFBTSxTQUFTLEdBQUcsZUFBZSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNwRSxZQUFBLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxVQUFBLE1BQU0sRUFBQTtBQUNoQyxnQkFBQSxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzlCLGFBQUMsQ0FBQyxDQUFDO0FBQ1AsU0FBQyxDQUFDLENBQUM7QUFDTixLQUFBO0FBRUQsSUFBQSxJQUFJLHVCQUF1QixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDcEMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLFVBQUMsSUFBVyxFQUFBO1lBQzNDLElBQU0sU0FBUyxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3hELFlBQUEsdUJBQXVCLENBQUMsT0FBTyxDQUFDLFVBQUEsTUFBTSxFQUFBO0FBQ2xDLGdCQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDOUIsYUFBQyxDQUFDLENBQUM7QUFDUCxTQUFDLENBQUMsQ0FBQztBQUNOLEtBQUE7QUFFRCxJQUFBLElBQUksd0JBQXdCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUNyQyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsVUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFBO0FBQ3JELFlBQUEsT0FBTyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsVUFBQyxlQUFlLEVBQUUsTUFBTSxFQUFBO0FBQzNELGdCQUFBLElBQU0sU0FBUyxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztBQUN6RSxnQkFBQSxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDcEMsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUNwQixTQUFDLENBQUMsQ0FBQztBQUNOLEtBQUE7QUFFRCxJQUFBLElBQUksbUJBQW1CLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNoQyxRQUFBLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxVQUFBLE1BQU0sRUFBQTtZQUM5QixXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFBO0FBQzdDLGdCQUFBLElBQU0sU0FBUyxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQXdCLENBQUM7QUFDcEYsZ0JBQUEsU0FBUyxDQUFDLE9BQU8sR0FBRyxVQUFDLE1BQWEsRUFBQTtBQUFiLG9CQUFBLElBQUEsTUFBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsTUFBYSxHQUFBLElBQUEsQ0FBQSxFQUFBO0FBQzlCLG9CQUFBLE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVCLGlCQUFDLENBQUM7QUFDRixnQkFBQSxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDckMsYUFBQyxDQUFDLENBQUM7QUFDUCxTQUFDLENBQUMsQ0FBQztBQUNOLEtBQUE7QUFFRCxJQUFBLE9BQU8sV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2pDOztBQzlFQSxJQUFBLGdCQUFBLGtCQUFBLFlBQUE7QUFBQSxJQUFBLFNBQUEsZ0JBQUEsR0FBQTtBQUlZLFFBQUEsSUFBQSxDQUFBLFNBQVMsR0FBaUIscUJBQXFCLENBQUMsWUFBTSxFQUFBLE9BQUEscUJBQXFCLENBQUMsWUFBQSxFQUFNLE9BQUEsRUFBRSxHQUFBLENBQUMsQ0FBL0IsRUFBK0IsQ0FBQyxDQUFDO0tBcUJsRztBQXhCVSxJQUFBLGdCQUFBLENBQUEsYUFBYSxHQUFwQixZQUFBO0FBQ0ksUUFBQSxPQUFPLHlCQUF5QixDQUFDO0tBQ3BDLENBQUE7QUFFRCxJQUFBLGdCQUFBLENBQUEsU0FBQSxDQUFBLElBQUksR0FBSixZQUFBOztLQUVDLENBQUE7QUFFRCxJQUFBLGdCQUFBLENBQUEsU0FBQSxDQUFBLE1BQU0sR0FBTixVQUFPLFVBQTJCLEVBQUUsTUFBYyxFQUFFLE9BQStCLEVBQUE7UUFDL0UsSUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdkQsSUFBTSxrQkFBa0IsR0FBRyxlQUFlLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZELFFBQUEsa0JBQWtCLENBQUMsSUFBSSxDQUFBLEtBQUEsQ0FBdkIsa0JBQWtCLEVBQUEsYUFBQSxDQUFBLEVBQUEsRUFBQSxNQUFBLENBQVMsT0FBTyxDQUFFLEVBQUEsS0FBQSxDQUFBLENBQUEsQ0FBQTtLQUN2QyxDQUFBO0FBRUQsSUFBQSxnQkFBQSxDQUFBLFNBQUEsQ0FBQSxNQUFNLEdBQU4sWUFBQTtRQUFBLElBU0MsS0FBQSxHQUFBLElBQUEsQ0FBQTtRQVJHLE9BQU87QUFDSCxZQUFBLFVBQVUsRUFBRSxZQUFBO2dCQUNSLE9BQU8sS0FBSSxDQUFDLFNBQVMsQ0FBQzthQUN6QjtBQUNELFlBQUEsWUFBWSxFQUFFLFVBQUMsVUFBMkIsRUFBRSxNQUFjLEVBQUE7QUFDdEQsZ0JBQUEsT0FBTyxLQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDckQ7U0FDSixDQUFDO0tBQ0wsQ0FBQTtJQUNMLE9BQUMsZ0JBQUEsQ0FBQTtBQUFELENBQUMsRUFBQSxDQUFBOztBQzlCRCxJQUFBLDhCQUFBLGtCQUFBLFlBQUE7QUFBQSxJQUFBLFNBQUEsOEJBQUEsR0FBQTtLQXdDQztJQXZDVSw4QkFBTSxDQUFBLE1BQUEsR0FBYixVQUFjLE1BQTBCLEVBQUE7QUFDcEMsUUFBQSxzQkFBQSxVQUFBLE1BQUEsRUFBQTtZQUFxQixTQUE4QixDQUFBLE9BQUEsRUFBQSxNQUFBLENBQUEsQ0FBQTtBQUE1QyxZQUFBLFNBQUEsT0FBQSxHQUFBO2dCQUFBLElBRU4sS0FBQSxHQUFBLE1BQUEsS0FBQSxJQUFBLElBQUEsTUFBQSxDQUFBLEtBQUEsQ0FBQSxJQUFBLEVBQUEsU0FBQSxDQUFBLElBQUEsSUFBQSxDQUFBO2dCQURzQixLQUFNLENBQUEsTUFBQSxHQUF1QixNQUFNLENBQUM7O2FBQzFEO1lBQUQsT0FBQyxPQUFBLENBQUE7U0FGTSxDQUFjLDhCQUE4QixDQUVqRCxFQUFBO0tBQ0wsQ0FBQTtJQUVELDhCQUFrQixDQUFBLFNBQUEsQ0FBQSxrQkFBQSxHQUFsQixVQUFxQyxRQUFXLEVBQUE7UUFBaEQsSUFnQ0MsS0FBQSxHQUFBLElBQUEsQ0FBQTtBQS9CRyxRQUFBLElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUM7UUFFbkMsSUFBTSxpQkFBaUIsR0FBRyx1QkFBdUIsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLENBQUM7QUFDdkYsUUFBQSxJQUFNLHVCQUF1QixHQUFHLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQzNELFFBQUEsSUFBTSxhQUFhLEdBQUcsdUJBQXVCLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDM0QsUUFBQSxJQUFJLGFBQWEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFO0FBQzFCLFlBQUEsT0FBTyxRQUFRLENBQUM7QUFDbkIsU0FBQTtBQUVELFFBQUEsSUFBTSxjQUFjLEdBQUcsSUFBSSxPQUFPLEVBQTBDLENBQUM7UUFDN0UsY0FBYyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxHQUFHLEVBQTZCLENBQUMsQ0FBQztBQUVuRSxRQUFBLElBQU0sV0FBVyxHQUFHLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtBQUNwQyxZQUFBLEdBQUcsRUFBRSxVQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUE7QUFDZCxnQkFBQSxJQUFNLFdBQVcsR0FBSSxNQUEyQyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2RSxJQUFJLElBQUksSUFBSSxNQUFNLElBQUksT0FBTyxXQUFXLEtBQUssVUFBVSxFQUFFO29CQUNyRCxJQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUMvQyxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ1osd0JBQUEsT0FBTyxXQUFXLENBQUM7QUFDdEIscUJBQUE7QUFDRCxvQkFBQSxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDckIsd0JBQUEsT0FBTyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLHFCQUFBO0FBQ0Qsb0JBQUEsSUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLEtBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztBQUMvRixvQkFBQSxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM5QixvQkFBQSxPQUFPLFFBQVEsQ0FBQztBQUNuQixpQkFBQTtBQUNELGdCQUFBLE9BQU8sV0FBVyxDQUFDO2FBQ3RCO0FBQ0osU0FBQSxDQUFDLENBQUM7QUFDSCxRQUFBLE9BQU8sV0FBVyxDQUFDO0tBQ3RCLENBQUE7SUFDTCxPQUFDLDhCQUFBLENBQUE7QUFBRCxDQUFDLEVBQUEsQ0FBQTs7QUN4Q0QsSUFBQSxrQ0FBQSxrQkFBQSxZQUFBO0FBb0JJLElBQUEsU0FBQSxrQ0FBQSxDQUE2QixTQUE2QixFQUFBO1FBQTdCLElBQVMsQ0FBQSxTQUFBLEdBQVQsU0FBUyxDQUFvQjtBQW5CbEQsUUFBQSxJQUFBLENBQUEseUJBQXlCLEdBQTRDLElBQUksR0FBRyxFQUFFLENBQUM7S0FtQnpCO0lBQzlELGtDQUE2QixDQUFBLFNBQUEsQ0FBQSw2QkFBQSxHQUE3QixVQUE4Qix1QkFBMkQsRUFBQTtBQUNyRixRQUFBLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztLQUMvRCxDQUFBO0lBQ0Qsa0NBQStCLENBQUEsU0FBQSxDQUFBLCtCQUFBLEdBQS9CLFVBQ0kseUJBQThHLEVBQUE7UUFEbEgsSUFNQyxLQUFBLEdBQUEsSUFBQSxDQUFBO0FBSEcsUUFBQSx5QkFBeUIsQ0FBQyxPQUFPLENBQUMsVUFBQSxFQUFFLEVBQUE7QUFDaEMsWUFBQSxLQUFJLENBQUMseUJBQXlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzNDLFNBQUMsQ0FBQyxDQUFDO0tBQ04sQ0FBQTtBQUNELElBQUEsa0NBQUEsQ0FBQSxTQUFBLENBQUEsbUJBQW1CLEdBQW5CLFVBQXVCLGNBQTBCLEVBQUUsSUFBZSxFQUFBO0FBQzlELFFBQUEsSUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUM7QUFDN0QsUUFBQSxJQUFJLFFBQWlDLENBQUM7QUFDdEMsUUFBQSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsVUFBQSxTQUFTLEVBQUE7QUFDOUIsWUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFO0FBQ2hDLGdCQUFBLE9BQU8sS0FBSyxDQUFDO0FBQ2hCLGFBQUE7WUFDRCxRQUFRLEdBQUcsU0FBUyxDQUFDLG1CQUFtQixDQUFJLGNBQWMsRUFBRSxJQUFJLENBQWdCLENBQUM7WUFDakYsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDO0FBQ3RCLFNBQUMsQ0FBQyxDQUFDO0FBQ0gsUUFBQSxPQUFPLFFBQVEsQ0FBQztLQUNuQixDQUFBO0lBQ0Qsa0NBQWtCLENBQUEsU0FBQSxDQUFBLGtCQUFBLEdBQWxCLFVBQXNCLFFBQXFCLEVBQUE7UUFDdkMsT0FBTyxJQUFJLENBQUMsMkJBQTJCLENBQUMsTUFBTSxDQUFDLFVBQUMsUUFBUSxFQUFFLFNBQVMsRUFBQTtZQUMvRCxJQUFJLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRTtnQkFDOUIsSUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN0RCxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFDVixvQkFBQSxPQUFPLE1BQXFCLENBQUM7QUFDaEMsaUJBQUE7QUFDSixhQUFBO0FBQ0QsWUFBQSxPQUFPLFFBQVEsQ0FBQztTQUNuQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ2hCLENBQUE7SUFDRCxrQ0FBeUIsQ0FBQSxTQUFBLENBQUEseUJBQUEsR0FBekIsVUFBMEIsR0FBcUIsRUFBQTtBQUMzQyxRQUFBLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO1FBQ3BELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUEyQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDNUUsQ0FBQTtBQUNELElBQUEsa0NBQUEsQ0FBQSxTQUFBLENBQUEsNEJBQTRCLEdBQTVCLFlBQUE7QUFDSSxRQUFBLElBQU0sK0JBQStCLEdBQUcsY0FBYyxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLDRCQUE0QixFQUFFLENBQUM7QUFDN0csUUFBQSxPQUFPLCtCQUErQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUM7S0FDN0YsQ0FBQTtBQTNERCxJQUFBLFVBQUEsQ0FBQTtBQUFDLFFBQUEsVUFBVSxDQUE0RztZQUNuSCxRQUFRLEVBQUUsVUFBQSxRQUFRLEVBQUE7QUFDZCxnQkFBQSxJQUFNLCtCQUErQixHQUFHLGNBQWMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO0FBQzdHLGdCQUFBLElBQU0seUJBQXlCLEdBQUcsK0JBQStCLENBQUMsTUFBTSxDQUNwRSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxDQUNqRCxDQUFDO0FBQ0YsZ0JBQUEsT0FBTyx5QkFBeUIsQ0FBQyxHQUFHLENBQUMsVUFBQSxFQUFFLElBQUksT0FBQSxRQUFRLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBa0MsRUFBRSxDQUFDLENBQW5FLEVBQW1FLENBQUMsQ0FBQzthQUNuSDtBQUNELFlBQUEsT0FBTyxFQUFFO2dCQUNMLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQSxFQUFBO0FBQ25ELGdCQUFBLFlBQUE7QUFDSSxvQkFBQSxJQUFNLCtCQUErQixHQUFHLGNBQWMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO29CQUM3RyxPQUFPLCtCQUErQixDQUFDLE1BQU0sQ0FBQztpQkFDakQ7QUFDSixhQUFBO1NBQ0osQ0FBQztrQ0FDb0MsS0FBSyxDQUFBO0FBQTRCLEtBQUEsRUFBQSxrQ0FBQSxDQUFBLFNBQUEsRUFBQSw2QkFBQSxFQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUE7SUE0QzNFLE9BQUMsa0NBQUEsQ0FBQTtBQUFBLENBOURELEVBOERDLENBQUE7O0FDckNELElBQU0scUJBQXFCLEdBQUcsNkJBQTZCLENBQUM7QUFFNUQsSUFBQSxrQkFBQSxrQkFBQSxZQUFBO0FBU0ksSUFBQSxTQUFBLGtCQUFBLENBQW1CLE9BQXVDLEVBQUE7QUFBdkMsUUFBQSxJQUFBLE9BQUEsS0FBQSxLQUFBLENBQUEsRUFBQSxFQUFBLE9BQXVDLEdBQUEsRUFBQSxDQUFBLEVBQUE7QUFSbEQsUUFBQSxJQUFBLENBQUEsV0FBVyxHQUFHLElBQUksR0FBRyxFQUE4QyxDQUFDOztBQUVwRSxRQUFBLElBQUEsQ0FBQSxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQTZDLENBQUM7QUFDakUsUUFBQSxJQUFBLENBQUEsZ0JBQWdCLEdBQUcsSUFBSSxHQUFHLEVBQThCLENBQUM7QUFDekQsUUFBQSxJQUFBLENBQUEsWUFBWSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFLdEMsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxJQUFJLGFBQWEsQ0FBQyxTQUFTLENBQUM7QUFDcEUsUUFBQSxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLEtBQUssU0FBUyxHQUFHLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBQ3pFLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLDJCQUEyQixDQUFDLENBQUM7UUFDM0YsSUFBSSxDQUFDLCtCQUErQixDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO1FBQzVHLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLDJCQUEyQixDQUFDLENBQUM7UUFDM0YsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUNwRSxRQUFBLElBQUksUUFBUSxFQUFFO1lBQ1YsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztZQUNqRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztBQUM5RCxTQUFBO1FBQ0QsSUFBSSxDQUFDLHlCQUF5QixHQUFHLElBQUksa0NBQWtDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUUsSUFBSSxDQUFDLDBCQUEwQixDQUFDLDhCQUE4QixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQ2hGO0FBQ0QsSUFBQSxrQkFBQSxDQUFBLFNBQUEsQ0FBQSxXQUFXLEdBQVgsVUFBa0IsTUFBcUIsRUFBRSxLQUFTLEVBQUE7UUFDOUMsSUFBSSxNQUFNLEtBQUssa0JBQWtCLEVBQUU7QUFDL0IsWUFBQSxPQUFPLElBQW9CLENBQUM7QUFDL0IsU0FBQTtRQUNELElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtZQUMxRCxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNDLFlBQUEsSUFBSSxVQUFVLEVBQUU7Z0JBQ0osSUFBQSxPQUFPLEdBQWlCLFVBQVUsQ0FBQSxPQUEzQixFQUFFLFVBQVUsR0FBSyxVQUFVLENBQUEsVUFBZixDQUFnQjtnQkFDM0MsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNoQyxnQkFBQSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRTtBQUN6QixvQkFBQSxVQUFVLEVBQUEsVUFBQTtBQUNiLGlCQUFBLENBQU0sQ0FBQztnQkFDUixJQUFNLE1BQU0sR0FBRyxNQUFNLEtBQUEsSUFBQSxJQUFOLE1BQU0sS0FBTixLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxNQUFNLENBQUUsV0FBVyxDQUFDO0FBQ25DLGdCQUFBLElBQUksT0FBTyxNQUFNLEtBQUssVUFBVSxFQUFFO29CQUM5QixJQUFNLGdCQUFjLEdBQUcsTUFBb0IsQ0FBQztvQkFDNUMsSUFBTSxRQUFRLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBSSxnQkFBYyxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUMvRCxJQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyx5QkFBeUIsQ0FBQyxnQkFBYyxDQUFDLENBQUM7QUFDdEcsb0JBQUEsUUFBUSxDQUFDLHFCQUFxQixDQUFDLE1BQXFCLENBQUMsQ0FBQztvQkFDdEQsSUFBSSxDQUFDLG9CQUFvQixFQUFFO3dCQUN2QixNQUFNLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixDQUFDLGtCQUFrQixDQUFDLE1BQXFCLENBQUMsQ0FBQztBQUNyRixxQkFBQTtBQUNELG9CQUFBLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxNQUFxQixDQUFDLENBQUM7QUFDMUQsaUJBQUE7QUFDRCxnQkFBQSxPQUFPLE1BQU0sQ0FBQztBQUNqQixhQUFBO0FBQU0saUJBQUE7QUFDSCxnQkFBQSxJQUFNLGFBQWEsR0FBRyxjQUFjLENBQUMsV0FBVyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsZ0JBQWdCLENBQUksTUFBTSxDQUFDLENBQUM7Z0JBQ3hGLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDaEIsb0JBQUEsTUFBTSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN2QixpQkFBQTtBQUFNLHFCQUFBO29CQUNILE1BQU0sR0FBRyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDOUMsaUJBQUE7QUFDSixhQUFBO0FBQ0osU0FBQTtRQUNELElBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQztRQUM5QixJQUFNLE1BQU0sR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xFLFFBQUEsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hDLElBQU0sVUFBVSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBdUIsQ0FBQztBQUNsSCxRQUFBLElBQU0sa0JBQWtCLEdBQUc7QUFDdkIsWUFBQSxVQUFVLEVBQUUsY0FBYztBQUMxQixZQUFBLEtBQUssRUFBQSxLQUFBO0FBQ0wsWUFBQSxnQkFBZ0IsRUFBRSxTQUFTO1NBQzlCLENBQUM7QUFDRixRQUFBLElBQUksVUFBVSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFO1lBQy9DLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNwRSxZQUFBLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNqQyxZQUFBLElBQU0sbUJBQW1CLEdBQ2xCLFFBQUEsQ0FBQSxRQUFBLENBQUEsRUFBQSxFQUFBLGtCQUFrQixLQUNyQixRQUFRLEVBQUEsUUFBQSxHQUNYLENBQUM7QUFDRixZQUFBLFVBQVUsQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUM3QyxZQUFBLE9BQU8sUUFBUSxDQUFDO0FBQ25CLFNBQUE7QUFBTSxhQUFBO0FBQ0gsWUFBQSxPQUFPLFVBQVUsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQU0sQ0FBQztBQUMxRCxTQUFBO0tBQ0osQ0FBQTtJQUVPLGtCQUE4QixDQUFBLFNBQUEsQ0FBQSw4QkFBQSxHQUF0QyxVQUEwQyxjQUEwQixFQUFBO0FBQ2hFLFFBQUEsSUFBTSxPQUFPLEdBQUcsSUFBSSx3QkFBd0IsQ0FBQyxjQUFjLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ25HLFFBQUEsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdEMsUUFBQSxPQUFPLE9BQU8sQ0FBQztLQUNsQixDQUFBO0lBRUQsa0JBQVUsQ0FBQSxTQUFBLENBQUEsVUFBQSxHQUFWLFVBQVcsR0FBc0IsRUFBQTtBQUM3QixRQUFBLElBQU0sT0FBTyxHQUFHLGNBQWMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvRSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxTQUFBO0FBQ0QsUUFBQSxPQUFPLE9BQU8sQ0FBQztLQUNsQixDQUFBO0FBQ0QsSUFBQSxrQkFBQSxDQUFBLFNBQUEsQ0FBQSxXQUFXLEdBQVgsVUFBZSxNQUF5QixFQUFFLE9BQW1DLEVBQUUsVUFBeUIsRUFBQTtBQUNwRyxRQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO0tBQzFFLENBQUE7QUFDRCxJQUFBLGtCQUFBLENBQUEsU0FBQSxDQUFBLE1BQU0sR0FBTixVQUFlLElBQXlCLEVBQUUsT0FBd0MsRUFBQTtRQUFsRixJQW9CQyxLQUFBLEdBQUEsSUFBQSxDQUFBO0FBcEJ5QyxRQUFBLElBQUEsT0FBQSxLQUFBLEtBQUEsQ0FBQSxFQUFBLEVBQUEsT0FBd0MsR0FBQSxFQUFBLENBQUEsRUFBQTtBQUM5RSxRQUFBLElBQUksRUFBa0IsQ0FBQztBQUN2QixRQUFBLElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDdEIsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQXlDLENBQW1CLENBQUM7QUFDdkYsU0FBQTtBQUFNLGFBQUE7WUFDSCxFQUFFLEdBQUcsSUFBc0IsQ0FBQztBQUMvQixTQUFBO0FBQ0QsUUFBQSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNsQixZQUFBLE9BQU8sT0FBTyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUEsS0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFBLGFBQUEsQ0FBQSxFQUFBLEVBQUEsTUFBQSxDQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUUsRUFBQSxLQUFBLENBQUEsQ0FBQSxHQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ3BELFNBQUE7QUFDRCxRQUFBLElBQUksYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ3hCLFlBQUEsSUFBTSxNQUFJLEdBQUcsT0FBTyxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEVBQUUsRUFBQSxFQUFJLE9BQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBcEIsRUFBb0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxRixZQUFBLE9BQU8sTUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFBLEtBQUEsQ0FBQSxLQUFBLENBQUEsRUFBQSxhQUFBLENBQUEsRUFBQSxFQUFBLE1BQUEsQ0FBSSxNQUFJLENBQUUsRUFBQSxLQUFBLENBQUEsQ0FBQSxHQUFFLEVBQUUsRUFBRSxDQUFDO0FBQy9DLFNBQUE7QUFDRCxRQUFBLElBQU0sUUFBUSxHQUFHLHVCQUF1QixDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNwRixRQUFBLElBQU0sb0JBQW9CLEdBQUcsUUFBUSxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQ3RELFFBQUEsSUFBTSxJQUFJLEdBQUcsb0JBQW9CLENBQUMsR0FBRyxDQUFDLFVBQUEsVUFBVSxFQUFBO0FBQzVDLFlBQUEsT0FBTyxLQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3hDLFNBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxFQUFFLENBQUksS0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFBLGFBQUEsQ0FBQSxFQUFBLEVBQUEsTUFBQSxDQUFBLElBQUksQ0FBRSxFQUFBLEtBQUEsQ0FBQSxDQUFBLENBQUE7S0FDdEIsQ0FBQTtBQUNELElBQUEsa0JBQUEsQ0FBQSxTQUFBLENBQUEsT0FBTyxHQUFQLFlBQUE7QUFDSSxRQUFBLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDOUMsUUFBQSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEVBQUUsRUFBQTtZQUN2QixFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDakIsU0FBQyxDQUFDLENBQUM7S0FDTixDQUFBO0FBQ0QsSUFBQSxrQkFBQSxDQUFBLFNBQUEsQ0FBQSxRQUFRLEdBQVIsVUFBa0IsVUFBa0IsRUFBRSxPQUF3QyxFQUFBO0FBQzFFLFFBQUEsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNqQixNQUFNLElBQUksU0FBUyxDQUFDLDBCQUFBLENBQUEsTUFBQSxDQUEyQixPQUFPLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBQztBQUNsRSxTQUFBO1FBQ0QsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNuRCxRQUFBLE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUNqRSxDQUFBO0FBQ0QsSUFBQSxrQkFBQSxDQUFBLFNBQUEsQ0FBQSxjQUFjLEdBQWQsVUFBZSxTQUFpQixFQUFFLElBQWMsRUFBQTtRQUM1QyxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDdEQsUUFBQSxTQUFTLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUN6QyxDQUFBO0FBQ0QsSUFBQSxrQkFBQSxDQUFBLFNBQUEsQ0FBQSxZQUFZLEdBQVosVUFBZ0IsVUFBMkIsRUFBRSxRQUFXLEVBQUE7QUFDcEQsUUFBQSxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakUsUUFBQSxVQUFVLGFBQVYsVUFBVSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFWLFVBQVUsQ0FBRSxZQUFZLENBQUM7QUFDckIsWUFBQSxVQUFVLEVBQUEsVUFBQTtBQUNWLFlBQUEsUUFBUSxFQUFBLFFBQUE7QUFDWCxTQUFBLENBQUMsQ0FBQztLQUNOLENBQUE7QUFDRCxJQUFBLGtCQUFBLENBQUEsU0FBQSxDQUFBLCtCQUErQixHQUEvQixVQUNJLEtBQTZCLEVBQzdCLHFCQUF3QixFQUN4QixlQUEwQyxFQUFBO0FBRTFDLFFBQUEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFNLEtBQUEscUJBQXFCLENBQXJCLElBQUEsQ0FBQSxLQUFBLENBQUEscUJBQXFCLGtDQUFLLGVBQWUsSUFBSSxFQUFFLGVBQUcsQ0FBQztLQUN0RixDQUFBO0FBQ0QsSUFBQSxrQkFBQSxDQUFBLFNBQUEsQ0FBQSxpQkFBaUIsR0FBakIsVUFBa0IsSUFBWSxFQUFFLGNBQWtDLEVBQUE7UUFDOUQsSUFBTSxRQUFRLEdBQUcsdUJBQXVCLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUNwRixRQUFBLFFBQVEsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0tBQ25ELENBQUE7SUFDRCxrQkFBMEIsQ0FBQSxTQUFBLENBQUEsMEJBQUEsR0FBMUIsVUFBMkIsS0FBeUMsRUFBQTtBQUNoRSxRQUFBLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyw2QkFBNkIsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN2RSxDQUFBO0lBQ0Qsa0JBQVksQ0FBQSxTQUFBLENBQUEsWUFBQSxHQUFaLFVBQWEsUUFBdUIsRUFBQTtRQUNoQyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLHFCQUFxQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ2hFLENBQUE7SUFDRCxrQkFBZ0IsQ0FBQSxTQUFBLENBQUEsZ0JBQUEsR0FBaEIsVUFBb0IsSUFBZ0IsRUFBQTtRQUNoQyxPQUFPLGFBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUE0QixDQUFDO0tBQzdFLENBQUE7SUFDTCxPQUFDLGtCQUFBLENBQUE7QUFBRCxDQUFDLEVBQUE7Ozs7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzQsMjNdfQ==
