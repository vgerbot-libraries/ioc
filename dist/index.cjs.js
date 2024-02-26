'use strict';

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
            getAllMarkedMembers: function () {
                return _this.marks.members.getMembers();
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
            advice: advice
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
                var _this = _super.call(this) || this;
                lazyProp(_this, 'aspectInstance', {
                    evaluate: function () { return _this.appCtx.getInstance(clazz); }
                });
                return _this;
            }
            ComponentMethodAspectImpl.prototype.execute = function (ctx) {
                var func = this.aspectInstance[methodName];
                return func.call(this.aspectInstance, ctx);
            };
            return ComponentMethodAspectImpl;
        }(ComponentMethodAspect));
    };
    __decorate([
        Inject(ApplicationContext),
        __metadata("design:type", ApplicationContext)
    ], ComponentMethodAspect.prototype, "appCtx", void 0);
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
var ApplicationContext = /** @class */ (function () {
    function ApplicationContext(options) {
        if (options === void 0) { options = {}; }
        this.resolutions = new Map();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.factories = new FactoryRecorder();
        this.evaluatorClasses = new Map();
        this.eventEmitter = new EventEmitter();
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
        var metadata = MetadataInstanceManager.getMetadata(clazz, AOPClassMetadata);
        metadata.append(propertyKey, advice, aspects);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguY2pzLmpzIiwic291cmNlcyI6WyIuLi9zcmMvZm91bmRhdGlvbi9JbnN0YW5jZVNjb3BlLnRzIiwiLi4vc3JjL2NvbW1vbi9EZWZhdWx0VmFsdWVNYXAudHMiLCIuLi9ub2RlX21vZHVsZXMvcmVmbGVjdC1tZXRhZGF0YS9SZWZsZWN0LmpzIiwiLi4vc3JjL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLnRzIiwiLi4vc3JjL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9TZXJ2aWNlRmFjdG9yeURlZi50cyIsIi4uL3NyYy9jb21tb24vRmFjdG9yeVJlY29yZGVyLnRzIiwiLi4vc3JjL21ldGFkYXRhL0dsb2JhbE1ldGFkYXRhLnRzIiwiLi4vc3JjL3R5cGVzL0V2YWx1YXRlT3B0aW9ucy50cyIsIi4uL3NyYy9jb21tb24vaXNOb2RlSnMudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9WYWx1ZS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0FyZ3YudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9CaW5kLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvRW52LnRzIiwiLi4vc3JjL2NvbW1vbi9pc05vdERlZmluZWQudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9GYWN0b3J5LnRzIiwiLi4vc3JjL21ldGFkYXRhL0Z1bmN0aW9uTWV0YWRhdGEudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9HZW5lcmF0ZS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0luamVjdC50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0luamVjdGFibGUudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9JbnN0QXdhcmVQcm9jZXNzb3IudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9KU09ORGF0YS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0xpZmVjeWNsZURlY29yYXRvci50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL01hcmsudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9MaWZlY3ljbGUudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9Qb3N0SW5qZWN0LnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvUHJlRGVzdHJveS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL1ByZUluamVjdC50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL1Njb3BlLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vRXZlbnRFbWl0dGVyLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vSW52b2tlRnVuY3Rpb25PcHRpb25zLnRzIiwiLi4vbm9kZV9tb2R1bGVzL0B2Z2VyYm90L2xhenkvZGlzdC9pbmRleC5janMuanMiLCIuLi9zcmMvZm91bmRhdGlvbi9MaWZlY3ljbGVNYW5hZ2VyLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vQ29tcG9uZW50SW5zdGFuY2VXcmFwcGVyLnRzIiwiLi4vc3JjL2NvbW1vbi9pbnZva2VQcmVEZXN0cm95LnRzIiwiLi4vc3JjL3Jlc29sdXRpb24vU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uLnRzIiwiLi4vc3JjL3Jlc29sdXRpb24vR2xvYmFsU2hhcmVkSW5zdGFuY2VSZXNvbHV0aW9uLnRzIiwiLi4vc3JjL3Jlc29sdXRpb24vVHJhbnNpZW50SW5zdGFuY2VSZXNvbHV0aW9uLnRzIiwiLi4vc3JjL2V2YWx1YXRvci9KU09ORGF0YUV2YWx1YXRvci50cyIsIi4uL3NyYy9ldmFsdWF0b3IvRW52aXJvbm1lbnRFdmFsdWF0b3IudHMiLCIuLi9zcmMvZXZhbHVhdG9yL0FyZ3ZFdmFsdWF0b3IudHMiLCIuLi9zcmMvYW9wL0FkdmljZS50cyIsIi4uL3NyYy9hb3AvQXNwZWN0VXRpbHMudHMiLCIuLi9zcmMvYW9wL2NyZWF0ZUFzcGVjdC50cyIsIi4uL3NyYy9hb3AvQ29tcG9uZW50TWV0aG9kQXNwZWN0LnRzIiwiLi4vc3JjL2FvcC9Bc3BlY3RNZXRhZHRhLnRzIiwiLi4vc3JjL2FvcC9BT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3IudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9JbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyLnRzIiwiLi4vc3JjL2ZvdW5kYXRpb24vQXBwbGljYXRpb25Db250ZXh0LnRzIiwiLi4vc3JjL2FvcC9BT1BDbGFzc01ldGFkYXRhLnRzIiwiLi4vc3JjL2NvbW1vbi9nZXRBbGxNZXRob2RNZW1iZXJOYW1lcy50cyIsIi4uL3NyYy9hb3AvUG9pbnRjdXQudHMiLCIuLi9zcmMvYW9wL2FkZEFzcGVjdC50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9BZnRlci50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9BZnRlclJldHVybi50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9Bcm91bmQudHMiLCIuLi9zcmMvYW9wL2RlY29yYXRvcnMvQmVmb3JlLnRzIiwiLi4vc3JjL2FvcC9kZWNvcmF0b3JzL0ZpbmFsbHkudHMiLCIuLi9zcmMvYW9wL2RlY29yYXRvcnMvVGhyb3duLnRzIiwiLi4vc3JjL2FvcC9kZWNvcmF0b3JzL1VzZUFzcGVjdHMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGVudW0gSW5zdGFuY2VTY29wZSB7XG4gICAgU0lOR0xFVE9OID0gJ2lvYy1yZXNvbHV0aW9uOmNvbnRhaW5lci1zaW5nbGV0b24nLFxuICAgIFRSQU5TSUVOVCA9ICdpb2MtcmVzb2x1dGlvbjp0cmFuc2llbnQnLFxuICAgIEdMT0JBTF9TSEFSRURfU0lOR0xFVE9OID0gJ2lvYy1yZXNvbHV0aW9uOmdsb2JhbC1zaGFyZWQtc2luZ2xldG9uJ1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURlZmF1bHRWYWx1ZU1hcDxLLCBWPihmYWN0b3J5OiAoa2V5OiBLKSA9PiBWKSB7XG4gICAgY29uc3QgbWFwID0gbmV3IE1hcDxLLCBWPigpO1xuICAgIGNvbnN0IG9yaWdpbkdldCA9IG1hcC5nZXQuYmluZChtYXApO1xuICAgIG1hcC5nZXQgPSBmdW5jdGlvbiAoa2V5OiBLKSB7XG4gICAgICAgIGlmIChtYXAuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiBvcmlnaW5HZXQoa2V5KSBhcyBWO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFZhbHVlID0gZmFjdG9yeShrZXkpO1xuICAgICAgICAgICAgbWFwLnNldChrZXksIGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gbWFwLmdldChrZXkpIGFzIFY7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBtYXAgYXMgRGVmYXVsdFZhbHVlTWFwPEssIFY+O1xufVxuZXhwb3J0IHR5cGUgRGVmYXVsdFZhbHVlTWFwPEssIFY+ID0gT21pdDxNYXA8SywgVj4sICdnZXQnPiAmIHtcbiAgICBnZXQ6IChrZXk6IEspID0+IFY7XG59O1xuIiwiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5Db3B5cmlnaHQgKEMpIE1pY3Jvc29mdC4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxuXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG52YXIgUmVmbGVjdDtcbihmdW5jdGlvbiAoUmVmbGVjdCkge1xuICAgIC8vIE1ldGFkYXRhIFByb3Bvc2FsXG4gICAgLy8gaHR0cHM6Ly9yYnVja3Rvbi5naXRodWIuaW8vcmVmbGVjdC1tZXRhZGF0YS9cbiAgICAoZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgICAgICAgdmFyIHJvb3QgPSB0eXBlb2YgZ2xvYmFsID09PSBcIm9iamVjdFwiID8gZ2xvYmFsIDpcbiAgICAgICAgICAgIHR5cGVvZiBzZWxmID09PSBcIm9iamVjdFwiID8gc2VsZiA6XG4gICAgICAgICAgICAgICAgdHlwZW9mIHRoaXMgPT09IFwib2JqZWN0XCIgPyB0aGlzIDpcbiAgICAgICAgICAgICAgICAgICAgRnVuY3Rpb24oXCJyZXR1cm4gdGhpcztcIikoKTtcbiAgICAgICAgdmFyIGV4cG9ydGVyID0gbWFrZUV4cG9ydGVyKFJlZmxlY3QpO1xuICAgICAgICBpZiAodHlwZW9mIHJvb3QuUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcm9vdC5SZWZsZWN0ID0gUmVmbGVjdDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGV4cG9ydGVyID0gbWFrZUV4cG9ydGVyKHJvb3QuUmVmbGVjdCwgZXhwb3J0ZXIpO1xuICAgICAgICB9XG4gICAgICAgIGZhY3RvcnkoZXhwb3J0ZXIpO1xuICAgICAgICBmdW5jdGlvbiBtYWtlRXhwb3J0ZXIodGFyZ2V0LCBwcmV2aW91cykge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXRba2V5XSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgeyBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwcmV2aW91cylcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXMoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSkoZnVuY3Rpb24gKGV4cG9ydGVyKSB7XG4gICAgICAgIHZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICAgICAgICAvLyBmZWF0dXJlIHRlc3QgZm9yIFN5bWJvbCBzdXBwb3J0XG4gICAgICAgIHZhciBzdXBwb3J0c1N5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIjtcbiAgICAgICAgdmFyIHRvUHJpbWl0aXZlU3ltYm9sID0gc3VwcG9ydHNTeW1ib2wgJiYgdHlwZW9mIFN5bWJvbC50b1ByaW1pdGl2ZSAhPT0gXCJ1bmRlZmluZWRcIiA/IFN5bWJvbC50b1ByaW1pdGl2ZSA6IFwiQEB0b1ByaW1pdGl2ZVwiO1xuICAgICAgICB2YXIgaXRlcmF0b3JTeW1ib2wgPSBzdXBwb3J0c1N5bWJvbCAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yICE9PSBcInVuZGVmaW5lZFwiID8gU3ltYm9sLml0ZXJhdG9yIDogXCJAQGl0ZXJhdG9yXCI7XG4gICAgICAgIHZhciBzdXBwb3J0c0NyZWF0ZSA9IHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSBcImZ1bmN0aW9uXCI7IC8vIGZlYXR1cmUgdGVzdCBmb3IgT2JqZWN0LmNyZWF0ZSBzdXBwb3J0XG4gICAgICAgIHZhciBzdXBwb3J0c1Byb3RvID0geyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheTsgLy8gZmVhdHVyZSB0ZXN0IGZvciBfX3Byb3RvX18gc3VwcG9ydFxuICAgICAgICB2YXIgZG93bkxldmVsID0gIXN1cHBvcnRzQ3JlYXRlICYmICFzdXBwb3J0c1Byb3RvO1xuICAgICAgICB2YXIgSGFzaE1hcCA9IHtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBhbiBvYmplY3QgaW4gZGljdGlvbmFyeSBtb2RlIChhLmsuYS4gXCJzbG93XCIgbW9kZSBpbiB2OClcbiAgICAgICAgICAgIGNyZWF0ZTogc3VwcG9ydHNDcmVhdGVcbiAgICAgICAgICAgICAgICA/IGZ1bmN0aW9uICgpIHsgcmV0dXJuIE1ha2VEaWN0aW9uYXJ5KE9iamVjdC5jcmVhdGUobnVsbCkpOyB9XG4gICAgICAgICAgICAgICAgOiBzdXBwb3J0c1Byb3RvXG4gICAgICAgICAgICAgICAgICAgID8gZnVuY3Rpb24gKCkgeyByZXR1cm4gTWFrZURpY3Rpb25hcnkoeyBfX3Byb3RvX186IG51bGwgfSk7IH1cbiAgICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbiAoKSB7IHJldHVybiBNYWtlRGljdGlvbmFyeSh7fSk7IH0sXG4gICAgICAgICAgICBoYXM6IGRvd25MZXZlbFxuICAgICAgICAgICAgICAgID8gZnVuY3Rpb24gKG1hcCwga2V5KSB7IHJldHVybiBoYXNPd24uY2FsbChtYXAsIGtleSk7IH1cbiAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uIChtYXAsIGtleSkgeyByZXR1cm4ga2V5IGluIG1hcDsgfSxcbiAgICAgICAgICAgIGdldDogZG93bkxldmVsXG4gICAgICAgICAgICAgICAgPyBmdW5jdGlvbiAobWFwLCBrZXkpIHsgcmV0dXJuIGhhc093bi5jYWxsKG1hcCwga2V5KSA/IG1hcFtrZXldIDogdW5kZWZpbmVkOyB9XG4gICAgICAgICAgICAgICAgOiBmdW5jdGlvbiAobWFwLCBrZXkpIHsgcmV0dXJuIG1hcFtrZXldOyB9LFxuICAgICAgICB9O1xuICAgICAgICAvLyBMb2FkIGdsb2JhbCBvciBzaGltIHZlcnNpb25zIG9mIE1hcCwgU2V0LCBhbmQgV2Vha01hcFxuICAgICAgICB2YXIgZnVuY3Rpb25Qcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoRnVuY3Rpb24pO1xuICAgICAgICB2YXIgdXNlUG9seWZpbGwgPSB0eXBlb2YgcHJvY2VzcyA9PT0gXCJvYmplY3RcIiAmJiBwcm9jZXNzLmVudiAmJiBwcm9jZXNzLmVudltcIlJFRkxFQ1RfTUVUQURBVEFfVVNFX01BUF9QT0xZRklMTFwiXSA9PT0gXCJ0cnVlXCI7XG4gICAgICAgIHZhciBfTWFwID0gIXVzZVBvbHlmaWxsICYmIHR5cGVvZiBNYXAgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgTWFwLnByb3RvdHlwZS5lbnRyaWVzID09PSBcImZ1bmN0aW9uXCIgPyBNYXAgOiBDcmVhdGVNYXBQb2x5ZmlsbCgpO1xuICAgICAgICB2YXIgX1NldCA9ICF1c2VQb2x5ZmlsbCAmJiB0eXBlb2YgU2V0ID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFNldC5wcm90b3R5cGUuZW50cmllcyA9PT0gXCJmdW5jdGlvblwiID8gU2V0IDogQ3JlYXRlU2V0UG9seWZpbGwoKTtcbiAgICAgICAgdmFyIF9XZWFrTWFwID0gIXVzZVBvbHlmaWxsICYmIHR5cGVvZiBXZWFrTWFwID09PSBcImZ1bmN0aW9uXCIgPyBXZWFrTWFwIDogQ3JlYXRlV2Vha01hcFBvbHlmaWxsKCk7XG4gICAgICAgIC8vIFtbTWV0YWRhdGFdXSBpbnRlcm5hbCBzbG90XG4gICAgICAgIC8vIGh0dHBzOi8vcmJ1Y2t0b24uZ2l0aHViLmlvL3JlZmxlY3QtbWV0YWRhdGEvI29yZGluYXJ5LW9iamVjdC1pbnRlcm5hbC1tZXRob2RzLWFuZC1pbnRlcm5hbC1zbG90c1xuICAgICAgICB2YXIgTWV0YWRhdGEgPSBuZXcgX1dlYWtNYXAoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFwcGxpZXMgYSBzZXQgb2YgZGVjb3JhdG9ycyB0byBhIHByb3BlcnR5IG9mIGEgdGFyZ2V0IG9iamVjdC5cbiAgICAgICAgICogQHBhcmFtIGRlY29yYXRvcnMgQW4gYXJyYXkgb2YgZGVjb3JhdG9ycy5cbiAgICAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdC5cbiAgICAgICAgICogQHBhcmFtIHByb3BlcnR5S2V5IChPcHRpb25hbCkgVGhlIHByb3BlcnR5IGtleSB0byBkZWNvcmF0ZS5cbiAgICAgICAgICogQHBhcmFtIGF0dHJpYnV0ZXMgKE9wdGlvbmFsKSBUaGUgcHJvcGVydHkgZGVzY3JpcHRvciBmb3IgdGhlIHRhcmdldCBrZXkuXG4gICAgICAgICAqIEByZW1hcmtzIERlY29yYXRvcnMgYXJlIGFwcGxpZWQgaW4gcmV2ZXJzZSBvcmRlci5cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xuICAgICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5IGRlY2xhcmF0aW9ucyBhcmUgbm90IHBhcnQgb2YgRVM2LCB0aG91Z2ggdGhleSBhcmUgdmFsaWQgaW4gVHlwZVNjcmlwdDpcbiAgICAgICAgICogICAgICAgICAvLyBzdGF0aWMgc3RhdGljUHJvcGVydHk7XG4gICAgICAgICAqICAgICAgICAgLy8gcHJvcGVydHk7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAgICAgY29uc3RydWN0b3IocCkgeyB9XG4gICAgICAgICAqICAgICAgICAgc3RhdGljIHN0YXRpY01ldGhvZChwKSB7IH1cbiAgICAgICAgICogICAgICAgICBtZXRob2QocCkgeyB9XG4gICAgICAgICAqICAgICB9XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBjb25zdHJ1Y3RvclxuICAgICAgICAgKiAgICAgRXhhbXBsZSA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9yc0FycmF5LCBFeGFtcGxlKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBjb25zdHJ1Y3RvcilcbiAgICAgICAgICogICAgIFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9yc0FycmF5LCBFeGFtcGxlLCBcInN0YXRpY1Byb3BlcnR5XCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIHByb3RvdHlwZSlcbiAgICAgICAgICogICAgIFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9yc0FycmF5LCBFeGFtcGxlLnByb3RvdHlwZSwgXCJwcm9wZXJ0eVwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIG1ldGhvZCAob24gY29uc3RydWN0b3IpXG4gICAgICAgICAqICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXhhbXBsZSwgXCJzdGF0aWNNZXRob2RcIixcbiAgICAgICAgICogICAgICAgICBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnNBcnJheSwgRXhhbXBsZSwgXCJzdGF0aWNNZXRob2RcIixcbiAgICAgICAgICogICAgICAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihFeGFtcGxlLCBcInN0YXRpY01ldGhvZFwiKSkpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBwcm90b3R5cGUpXG4gICAgICAgICAqICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXhhbXBsZS5wcm90b3R5cGUsIFwibWV0aG9kXCIsXG4gICAgICAgICAqICAgICAgICAgUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzQXJyYXksIEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiLFxuICAgICAgICAgKiAgICAgICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiKSkpO1xuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBwcm9wZXJ0eUtleSwgYXR0cmlidXRlcykge1xuICAgICAgICAgICAgaWYgKCFJc1VuZGVmaW5lZChwcm9wZXJ0eUtleSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIUlzQXJyYXkoZGVjb3JhdG9ycykpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICBpZiAoIUlzT2JqZWN0KHRhcmdldCkpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICBpZiAoIUlzT2JqZWN0KGF0dHJpYnV0ZXMpICYmICFJc1VuZGVmaW5lZChhdHRyaWJ1dGVzKSAmJiAhSXNOdWxsKGF0dHJpYnV0ZXMpKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICAgICAgaWYgKElzTnVsbChhdHRyaWJ1dGVzKSlcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eUtleSA9IFRvUHJvcGVydHlLZXkocHJvcGVydHlLZXkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBEZWNvcmF0ZVByb3BlcnR5KGRlY29yYXRvcnMsIHRhcmdldCwgcHJvcGVydHlLZXksIGF0dHJpYnV0ZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCFJc0FycmF5KGRlY29yYXRvcnMpKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICAgICAgaWYgKCFJc0NvbnN0cnVjdG9yKHRhcmdldCkpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gRGVjb3JhdGVDb25zdHJ1Y3RvcihkZWNvcmF0b3JzLCB0YXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGV4cG9ydGVyKFwiZGVjb3JhdGVcIiwgZGVjb3JhdGUpO1xuICAgICAgICAvLyA0LjEuMiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKVxuICAgICAgICAvLyBodHRwczovL3JidWNrdG9uLmdpdGh1Yi5pby9yZWZsZWN0LW1ldGFkYXRhLyNyZWZsZWN0Lm1ldGFkYXRhXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGRlZmF1bHQgbWV0YWRhdGEgZGVjb3JhdG9yIGZhY3RvcnkgdGhhdCBjYW4gYmUgdXNlZCBvbiBhIGNsYXNzLCBjbGFzcyBtZW1iZXIsIG9yIHBhcmFtZXRlci5cbiAgICAgICAgICogQHBhcmFtIG1ldGFkYXRhS2V5IFRoZSBrZXkgZm9yIHRoZSBtZXRhZGF0YSBlbnRyeS5cbiAgICAgICAgICogQHBhcmFtIG1ldGFkYXRhVmFsdWUgVGhlIHZhbHVlIGZvciB0aGUgbWV0YWRhdGEgZW50cnkuXG4gICAgICAgICAqIEByZXR1cm5zIEEgZGVjb3JhdG9yIGZ1bmN0aW9uLlxuICAgICAgICAgKiBAcmVtYXJrc1xuICAgICAgICAgKiBJZiBgbWV0YWRhdGFLZXlgIGlzIGFscmVhZHkgZGVmaW5lZCBmb3IgdGhlIHRhcmdldCBhbmQgdGFyZ2V0IGtleSwgdGhlXG4gICAgICAgICAqIG1ldGFkYXRhVmFsdWUgZm9yIHRoYXQga2V5IHdpbGwgYmUgb3ZlcndyaXR0ZW4uXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBjb25zdHJ1Y3RvclxuICAgICAgICAgKiAgICAgQFJlZmxlY3QubWV0YWRhdGEoa2V5LCB2YWx1ZSlcbiAgICAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xuICAgICAgICAgKiAgICAgfVxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIGNvbnN0cnVjdG9yLCBUeXBlU2NyaXB0IG9ubHkpXG4gICAgICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcbiAgICAgICAgICogICAgICAgICBAUmVmbGVjdC5tZXRhZGF0YShrZXksIHZhbHVlKVxuICAgICAgICAgKiAgICAgICAgIHN0YXRpYyBzdGF0aWNQcm9wZXJ0eTtcbiAgICAgICAgICogICAgIH1cbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBwcm90b3R5cGUsIFR5cGVTY3JpcHQgb25seSlcbiAgICAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xuICAgICAgICAgKiAgICAgICAgIEBSZWZsZWN0Lm1ldGFkYXRhKGtleSwgdmFsdWUpXG4gICAgICAgICAqICAgICAgICAgcHJvcGVydHk7XG4gICAgICAgICAqICAgICB9XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBtZXRob2QgKG9uIGNvbnN0cnVjdG9yKVxuICAgICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XG4gICAgICAgICAqICAgICAgICAgQFJlZmxlY3QubWV0YWRhdGEoa2V5LCB2YWx1ZSlcbiAgICAgICAgICogICAgICAgICBzdGF0aWMgc3RhdGljTWV0aG9kKCkgeyB9XG4gICAgICAgICAqICAgICB9XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBtZXRob2QgKG9uIHByb3RvdHlwZSlcbiAgICAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xuICAgICAgICAgKiAgICAgICAgIEBSZWZsZWN0Lm1ldGFkYXRhKGtleSwgdmFsdWUpXG4gICAgICAgICAqICAgICAgICAgbWV0aG9kKCkgeyB9XG4gICAgICAgICAqICAgICB9XG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBtZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xuICAgICAgICAgICAgZnVuY3Rpb24gZGVjb3JhdG9yKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIUlzT2JqZWN0KHRhcmdldCkpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICBpZiAoIUlzVW5kZWZpbmVkKHByb3BlcnR5S2V5KSAmJiAhSXNQcm9wZXJ0eUtleShwcm9wZXJ0eUtleSkpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICBPcmRpbmFyeURlZmluZU93bk1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlLCB0YXJnZXQsIHByb3BlcnR5S2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkZWNvcmF0b3I7XG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0ZXIoXCJtZXRhZGF0YVwiLCBtZXRhZGF0YSk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZpbmUgYSB1bmlxdWUgbWV0YWRhdGEgZW50cnkgb24gdGhlIHRhcmdldC5cbiAgICAgICAgICogQHBhcmFtIG1ldGFkYXRhS2V5IEEga2V5IHVzZWQgdG8gc3RvcmUgYW5kIHJldHJpZXZlIG1ldGFkYXRhLlxuICAgICAgICAgKiBAcGFyYW0gbWV0YWRhdGFWYWx1ZSBBIHZhbHVlIHRoYXQgY29udGFpbnMgYXR0YWNoZWQgbWV0YWRhdGEuXG4gICAgICAgICAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3Qgb24gd2hpY2ggdG8gZGVmaW5lIG1ldGFkYXRhLlxuICAgICAgICAgKiBAcGFyYW0gcHJvcGVydHlLZXkgKE9wdGlvbmFsKSBUaGUgcHJvcGVydHkga2V5IGZvciB0aGUgdGFyZ2V0LlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XG4gICAgICAgICAqICAgICAgICAgLy8gcHJvcGVydHkgZGVjbGFyYXRpb25zIGFyZSBub3QgcGFydCBvZiBFUzYsIHRob3VnaCB0aGV5IGFyZSB2YWxpZCBpbiBUeXBlU2NyaXB0OlxuICAgICAgICAgKiAgICAgICAgIC8vIHN0YXRpYyBzdGF0aWNQcm9wZXJ0eTtcbiAgICAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgICAgICBjb25zdHJ1Y3RvcihwKSB7IH1cbiAgICAgICAgICogICAgICAgICBzdGF0aWMgc3RhdGljTWV0aG9kKHApIHsgfVxuICAgICAgICAgKiAgICAgICAgIG1ldGhvZChwKSB7IH1cbiAgICAgICAgICogICAgIH1cbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgICAgICAqICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgb3B0aW9ucywgRXhhbXBsZSk7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gY29uc3RydWN0b3IpXG4gICAgICAgICAqICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgb3B0aW9ucywgRXhhbXBsZSwgXCJzdGF0aWNQcm9wZXJ0eVwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBwcm90b3R5cGUpXG4gICAgICAgICAqICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgb3B0aW9ucywgRXhhbXBsZS5wcm90b3R5cGUsIFwicHJvcGVydHlcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBtZXRob2QgKG9uIGNvbnN0cnVjdG9yKVxuICAgICAgICAgKiAgICAgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIG9wdGlvbnMsIEV4YW1wbGUsIFwic3RhdGljTWV0aG9kXCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBwcm90b3R5cGUpXG4gICAgICAgICAqICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgb3B0aW9ucywgRXhhbXBsZS5wcm90b3R5cGUsIFwibWV0aG9kXCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gZGVjb3JhdG9yIGZhY3RvcnkgYXMgbWV0YWRhdGEtcHJvZHVjaW5nIGFubm90YXRpb24uXG4gICAgICAgICAqICAgICBmdW5jdGlvbiBNeUFubm90YXRpb24ob3B0aW9ucyk6IERlY29yYXRvciB7XG4gICAgICAgICAqICAgICAgICAgcmV0dXJuICh0YXJnZXQsIGtleT8pID0+IFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBvcHRpb25zLCB0YXJnZXQsIGtleSk7XG4gICAgICAgICAqICAgICB9XG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBkZWZpbmVNZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSwgdGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICAgICAgaWYgKCFJc09iamVjdCh0YXJnZXQpKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgIGlmICghSXNVbmRlZmluZWQocHJvcGVydHlLZXkpKVxuICAgICAgICAgICAgICAgIHByb3BlcnR5S2V5ID0gVG9Qcm9wZXJ0eUtleShwcm9wZXJ0eUtleSk7XG4gICAgICAgICAgICByZXR1cm4gT3JkaW5hcnlEZWZpbmVPd25NZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSwgdGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0ZXIoXCJkZWZpbmVNZXRhZGF0YVwiLCBkZWZpbmVNZXRhZGF0YSk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXRzIGEgdmFsdWUgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSB0YXJnZXQgb2JqZWN0IG9yIGl0cyBwcm90b3R5cGUgY2hhaW4gaGFzIHRoZSBwcm92aWRlZCBtZXRhZGF0YSBrZXkgZGVmaW5lZC5cbiAgICAgICAgICogQHBhcmFtIG1ldGFkYXRhS2V5IEEga2V5IHVzZWQgdG8gc3RvcmUgYW5kIHJldHJpZXZlIG1ldGFkYXRhLlxuICAgICAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IG9uIHdoaWNoIHRoZSBtZXRhZGF0YSBpcyBkZWZpbmVkLlxuICAgICAgICAgKiBAcGFyYW0gcHJvcGVydHlLZXkgKE9wdGlvbmFsKSBUaGUgcHJvcGVydHkga2V5IGZvciB0aGUgdGFyZ2V0LlxuICAgICAgICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG1ldGFkYXRhIGtleSB3YXMgZGVmaW5lZCBvbiB0aGUgdGFyZ2V0IG9iamVjdCBvciBpdHMgcHJvdG90eXBlIGNoYWluOyBvdGhlcndpc2UsIGBmYWxzZWAuXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqXG4gICAgICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcbiAgICAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eSBkZWNsYXJhdGlvbnMgYXJlIG5vdCBwYXJ0IG9mIEVTNiwgdGhvdWdoIHRoZXkgYXJlIHZhbGlkIGluIFR5cGVTY3JpcHQ6XG4gICAgICAgICAqICAgICAgICAgLy8gc3RhdGljIHN0YXRpY1Byb3BlcnR5O1xuICAgICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5O1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgICAgIGNvbnN0cnVjdG9yKHApIHsgfVxuICAgICAgICAgKiAgICAgICAgIHN0YXRpYyBzdGF0aWNNZXRob2QocCkgeyB9XG4gICAgICAgICAqICAgICAgICAgbWV0aG9kKHApIHsgfVxuICAgICAgICAgKiAgICAgfVxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gY29uc3RydWN0b3JcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuaGFzTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBjb25zdHJ1Y3RvcilcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuaGFzTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLCBcInN0YXRpY1Byb3BlcnR5XCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIHByb3RvdHlwZSlcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuaGFzTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLnByb3RvdHlwZSwgXCJwcm9wZXJ0eVwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIG1ldGhvZCAob24gY29uc3RydWN0b3IpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0Lmhhc01ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZSwgXCJzdGF0aWNNZXRob2RcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBtZXRob2QgKG9uIHByb3RvdHlwZSlcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuaGFzTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLnByb3RvdHlwZSwgXCJtZXRob2RcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBoYXNNZXRhZGF0YShtZXRhZGF0YUtleSwgdGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICAgICAgaWYgKCFJc09iamVjdCh0YXJnZXQpKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgIGlmICghSXNVbmRlZmluZWQocHJvcGVydHlLZXkpKVxuICAgICAgICAgICAgICAgIHByb3BlcnR5S2V5ID0gVG9Qcm9wZXJ0eUtleShwcm9wZXJ0eUtleSk7XG4gICAgICAgICAgICByZXR1cm4gT3JkaW5hcnlIYXNNZXRhZGF0YShtZXRhZGF0YUtleSwgdGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0ZXIoXCJoYXNNZXRhZGF0YVwiLCBoYXNNZXRhZGF0YSk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXRzIGEgdmFsdWUgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSB0YXJnZXQgb2JqZWN0IGhhcyB0aGUgcHJvdmlkZWQgbWV0YWRhdGEga2V5IGRlZmluZWQuXG4gICAgICAgICAqIEBwYXJhbSBtZXRhZGF0YUtleSBBIGtleSB1c2VkIHRvIHN0b3JlIGFuZCByZXRyaWV2ZSBtZXRhZGF0YS5cbiAgICAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCBvbiB3aGljaCB0aGUgbWV0YWRhdGEgaXMgZGVmaW5lZC5cbiAgICAgICAgICogQHBhcmFtIHByb3BlcnR5S2V5IChPcHRpb25hbCkgVGhlIHByb3BlcnR5IGtleSBmb3IgdGhlIHRhcmdldC5cbiAgICAgICAgICogQHJldHVybnMgYHRydWVgIGlmIHRoZSBtZXRhZGF0YSBrZXkgd2FzIGRlZmluZWQgb24gdGhlIHRhcmdldCBvYmplY3Q7IG90aGVyd2lzZSwgYGZhbHNlYC5cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xuICAgICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5IGRlY2xhcmF0aW9ucyBhcmUgbm90IHBhcnQgb2YgRVM2LCB0aG91Z2ggdGhleSBhcmUgdmFsaWQgaW4gVHlwZVNjcmlwdDpcbiAgICAgICAgICogICAgICAgICAvLyBzdGF0aWMgc3RhdGljUHJvcGVydHk7XG4gICAgICAgICAqICAgICAgICAgLy8gcHJvcGVydHk7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAgICAgY29uc3RydWN0b3IocCkgeyB9XG4gICAgICAgICAqICAgICAgICAgc3RhdGljIHN0YXRpY01ldGhvZChwKSB7IH1cbiAgICAgICAgICogICAgICAgICBtZXRob2QocCkgeyB9XG4gICAgICAgICAqICAgICB9XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBjb25zdHJ1Y3RvclxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5oYXNPd25NZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIGNvbnN0cnVjdG9yKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5oYXNPd25NZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUsIFwic3RhdGljUHJvcGVydHlcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gcHJvdG90eXBlKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5oYXNPd25NZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUucHJvdG90eXBlLCBcInByb3BlcnR5XCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBjb25zdHJ1Y3RvcilcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuaGFzT3duTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLCBcInN0YXRpY01ldGhvZFwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIG1ldGhvZCAob24gcHJvdG90eXBlKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5oYXNPd25NZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGhhc093bk1ldGFkYXRhKG1ldGFkYXRhS2V5LCB0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgICAgICBpZiAoIUlzT2JqZWN0KHRhcmdldCkpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICAgICAgaWYgKCFJc1VuZGVmaW5lZChwcm9wZXJ0eUtleSkpXG4gICAgICAgICAgICAgICAgcHJvcGVydHlLZXkgPSBUb1Byb3BlcnR5S2V5KHByb3BlcnR5S2V5KTtcbiAgICAgICAgICAgIHJldHVybiBPcmRpbmFyeUhhc093bk1ldGFkYXRhKG1ldGFkYXRhS2V5LCB0YXJnZXQsIHByb3BlcnR5S2V5KTtcbiAgICAgICAgfVxuICAgICAgICBleHBvcnRlcihcImhhc093bk1ldGFkYXRhXCIsIGhhc093bk1ldGFkYXRhKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldHMgdGhlIG1ldGFkYXRhIHZhbHVlIGZvciB0aGUgcHJvdmlkZWQgbWV0YWRhdGEga2V5IG9uIHRoZSB0YXJnZXQgb2JqZWN0IG9yIGl0cyBwcm90b3R5cGUgY2hhaW4uXG4gICAgICAgICAqIEBwYXJhbSBtZXRhZGF0YUtleSBBIGtleSB1c2VkIHRvIHN0b3JlIGFuZCByZXRyaWV2ZSBtZXRhZGF0YS5cbiAgICAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCBvbiB3aGljaCB0aGUgbWV0YWRhdGEgaXMgZGVmaW5lZC5cbiAgICAgICAgICogQHBhcmFtIHByb3BlcnR5S2V5IChPcHRpb25hbCkgVGhlIHByb3BlcnR5IGtleSBmb3IgdGhlIHRhcmdldC5cbiAgICAgICAgICogQHJldHVybnMgVGhlIG1ldGFkYXRhIHZhbHVlIGZvciB0aGUgbWV0YWRhdGEga2V5IGlmIGZvdW5kOyBvdGhlcndpc2UsIGB1bmRlZmluZWRgLlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XG4gICAgICAgICAqICAgICAgICAgLy8gcHJvcGVydHkgZGVjbGFyYXRpb25zIGFyZSBub3QgcGFydCBvZiBFUzYsIHRob3VnaCB0aGV5IGFyZSB2YWxpZCBpbiBUeXBlU2NyaXB0OlxuICAgICAgICAgKiAgICAgICAgIC8vIHN0YXRpYyBzdGF0aWNQcm9wZXJ0eTtcbiAgICAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgICAgICBjb25zdHJ1Y3RvcihwKSB7IH1cbiAgICAgICAgICogICAgICAgICBzdGF0aWMgc3RhdGljTWV0aG9kKHApIHsgfVxuICAgICAgICAgKiAgICAgICAgIG1ldGhvZChwKSB7IH1cbiAgICAgICAgICogICAgIH1cbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZSk7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gY29uc3RydWN0b3IpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZSwgXCJzdGF0aWNQcm9wZXJ0eVwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBwcm90b3R5cGUpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZS5wcm90b3R5cGUsIFwicHJvcGVydHlcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBtZXRob2QgKG9uIGNvbnN0cnVjdG9yKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUsIFwic3RhdGljTWV0aG9kXCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBwcm90b3R5cGUpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZS5wcm90b3R5cGUsIFwibWV0aG9kXCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZ2V0TWV0YWRhdGEobWV0YWRhdGFLZXksIHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgICAgIGlmICghSXNPYmplY3QodGFyZ2V0KSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICBpZiAoIUlzVW5kZWZpbmVkKHByb3BlcnR5S2V5KSlcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eUtleSA9IFRvUHJvcGVydHlLZXkocHJvcGVydHlLZXkpO1xuICAgICAgICAgICAgcmV0dXJuIE9yZGluYXJ5R2V0TWV0YWRhdGEobWV0YWRhdGFLZXksIHRhcmdldCwgcHJvcGVydHlLZXkpO1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydGVyKFwiZ2V0TWV0YWRhdGFcIiwgZ2V0TWV0YWRhdGEpO1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0cyB0aGUgbWV0YWRhdGEgdmFsdWUgZm9yIHRoZSBwcm92aWRlZCBtZXRhZGF0YSBrZXkgb24gdGhlIHRhcmdldCBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSBtZXRhZGF0YUtleSBBIGtleSB1c2VkIHRvIHN0b3JlIGFuZCByZXRyaWV2ZSBtZXRhZGF0YS5cbiAgICAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCBvbiB3aGljaCB0aGUgbWV0YWRhdGEgaXMgZGVmaW5lZC5cbiAgICAgICAgICogQHBhcmFtIHByb3BlcnR5S2V5IChPcHRpb25hbCkgVGhlIHByb3BlcnR5IGtleSBmb3IgdGhlIHRhcmdldC5cbiAgICAgICAgICogQHJldHVybnMgVGhlIG1ldGFkYXRhIHZhbHVlIGZvciB0aGUgbWV0YWRhdGEga2V5IGlmIGZvdW5kOyBvdGhlcndpc2UsIGB1bmRlZmluZWRgLlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XG4gICAgICAgICAqICAgICAgICAgLy8gcHJvcGVydHkgZGVjbGFyYXRpb25zIGFyZSBub3QgcGFydCBvZiBFUzYsIHRob3VnaCB0aGV5IGFyZSB2YWxpZCBpbiBUeXBlU2NyaXB0OlxuICAgICAgICAgKiAgICAgICAgIC8vIHN0YXRpYyBzdGF0aWNQcm9wZXJ0eTtcbiAgICAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgICAgICBjb25zdHJ1Y3RvcihwKSB7IH1cbiAgICAgICAgICogICAgICAgICBzdGF0aWMgc3RhdGljTWV0aG9kKHApIHsgfVxuICAgICAgICAgKiAgICAgICAgIG1ldGhvZChwKSB7IH1cbiAgICAgICAgICogICAgIH1cbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE93bk1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZSk7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gY29uc3RydWN0b3IpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE93bk1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZSwgXCJzdGF0aWNQcm9wZXJ0eVwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBwcm90b3R5cGUpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE93bk1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZS5wcm90b3R5cGUsIFwicHJvcGVydHlcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBtZXRob2QgKG9uIGNvbnN0cnVjdG9yKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRPd25NZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUsIFwic3RhdGljTWV0aG9kXCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBwcm90b3R5cGUpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE93bk1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZS5wcm90b3R5cGUsIFwibWV0aG9kXCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZ2V0T3duTWV0YWRhdGEobWV0YWRhdGFLZXksIHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgICAgIGlmICghSXNPYmplY3QodGFyZ2V0KSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICBpZiAoIUlzVW5kZWZpbmVkKHByb3BlcnR5S2V5KSlcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eUtleSA9IFRvUHJvcGVydHlLZXkocHJvcGVydHlLZXkpO1xuICAgICAgICAgICAgcmV0dXJuIE9yZGluYXJ5R2V0T3duTWV0YWRhdGEobWV0YWRhdGFLZXksIHRhcmdldCwgcHJvcGVydHlLZXkpO1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydGVyKFwiZ2V0T3duTWV0YWRhdGFcIiwgZ2V0T3duTWV0YWRhdGEpO1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0cyB0aGUgbWV0YWRhdGEga2V5cyBkZWZpbmVkIG9uIHRoZSB0YXJnZXQgb2JqZWN0IG9yIGl0cyBwcm90b3R5cGUgY2hhaW4uXG4gICAgICAgICAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3Qgb24gd2hpY2ggdGhlIG1ldGFkYXRhIGlzIGRlZmluZWQuXG4gICAgICAgICAqIEBwYXJhbSBwcm9wZXJ0eUtleSAoT3B0aW9uYWwpIFRoZSBwcm9wZXJ0eSBrZXkgZm9yIHRoZSB0YXJnZXQuXG4gICAgICAgICAqIEByZXR1cm5zIEFuIGFycmF5IG9mIHVuaXF1ZSBtZXRhZGF0YSBrZXlzLlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XG4gICAgICAgICAqICAgICAgICAgLy8gcHJvcGVydHkgZGVjbGFyYXRpb25zIGFyZSBub3QgcGFydCBvZiBFUzYsIHRob3VnaCB0aGV5IGFyZSB2YWxpZCBpbiBUeXBlU2NyaXB0OlxuICAgICAgICAgKiAgICAgICAgIC8vIHN0YXRpYyBzdGF0aWNQcm9wZXJ0eTtcbiAgICAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgICAgICBjb25zdHJ1Y3RvcihwKSB7IH1cbiAgICAgICAgICogICAgICAgICBzdGF0aWMgc3RhdGljTWV0aG9kKHApIHsgfVxuICAgICAgICAgKiAgICAgICAgIG1ldGhvZChwKSB7IH1cbiAgICAgICAgICogICAgIH1cbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE1ldGFkYXRhS2V5cyhFeGFtcGxlKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBjb25zdHJ1Y3RvcilcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0TWV0YWRhdGFLZXlzKEV4YW1wbGUsIFwic3RhdGljUHJvcGVydHlcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gcHJvdG90eXBlKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRNZXRhZGF0YUtleXMoRXhhbXBsZS5wcm90b3R5cGUsIFwicHJvcGVydHlcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBtZXRob2QgKG9uIGNvbnN0cnVjdG9yKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRNZXRhZGF0YUtleXMoRXhhbXBsZSwgXCJzdGF0aWNNZXRob2RcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBtZXRob2QgKG9uIHByb3RvdHlwZSlcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0TWV0YWRhdGFLZXlzKEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldE1ldGFkYXRhS2V5cyh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgICAgICBpZiAoIUlzT2JqZWN0KHRhcmdldCkpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICAgICAgaWYgKCFJc1VuZGVmaW5lZChwcm9wZXJ0eUtleSkpXG4gICAgICAgICAgICAgICAgcHJvcGVydHlLZXkgPSBUb1Byb3BlcnR5S2V5KHByb3BlcnR5S2V5KTtcbiAgICAgICAgICAgIHJldHVybiBPcmRpbmFyeU1ldGFkYXRhS2V5cyh0YXJnZXQsIHByb3BlcnR5S2V5KTtcbiAgICAgICAgfVxuICAgICAgICBleHBvcnRlcihcImdldE1ldGFkYXRhS2V5c1wiLCBnZXRNZXRhZGF0YUtleXMpO1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0cyB0aGUgdW5pcXVlIG1ldGFkYXRhIGtleXMgZGVmaW5lZCBvbiB0aGUgdGFyZ2V0IG9iamVjdC5cbiAgICAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCBvbiB3aGljaCB0aGUgbWV0YWRhdGEgaXMgZGVmaW5lZC5cbiAgICAgICAgICogQHBhcmFtIHByb3BlcnR5S2V5IChPcHRpb25hbCkgVGhlIHByb3BlcnR5IGtleSBmb3IgdGhlIHRhcmdldC5cbiAgICAgICAgICogQHJldHVybnMgQW4gYXJyYXkgb2YgdW5pcXVlIG1ldGFkYXRhIGtleXMuXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqXG4gICAgICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcbiAgICAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eSBkZWNsYXJhdGlvbnMgYXJlIG5vdCBwYXJ0IG9mIEVTNiwgdGhvdWdoIHRoZXkgYXJlIHZhbGlkIGluIFR5cGVTY3JpcHQ6XG4gICAgICAgICAqICAgICAgICAgLy8gc3RhdGljIHN0YXRpY1Byb3BlcnR5O1xuICAgICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5O1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgICAgIGNvbnN0cnVjdG9yKHApIHsgfVxuICAgICAgICAgKiAgICAgICAgIHN0YXRpYyBzdGF0aWNNZXRob2QocCkgeyB9XG4gICAgICAgICAqICAgICAgICAgbWV0aG9kKHApIHsgfVxuICAgICAgICAgKiAgICAgfVxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gY29uc3RydWN0b3JcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0T3duTWV0YWRhdGFLZXlzKEV4YW1wbGUpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIGNvbnN0cnVjdG9yKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRPd25NZXRhZGF0YUtleXMoRXhhbXBsZSwgXCJzdGF0aWNQcm9wZXJ0eVwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBwcm90b3R5cGUpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE93bk1ldGFkYXRhS2V5cyhFeGFtcGxlLnByb3RvdHlwZSwgXCJwcm9wZXJ0eVwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIG1ldGhvZCAob24gY29uc3RydWN0b3IpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE93bk1ldGFkYXRhS2V5cyhFeGFtcGxlLCBcInN0YXRpY01ldGhvZFwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIG1ldGhvZCAob24gcHJvdG90eXBlKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRPd25NZXRhZGF0YUtleXMoRXhhbXBsZS5wcm90b3R5cGUsIFwibWV0aG9kXCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZ2V0T3duTWV0YWRhdGFLZXlzKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgICAgIGlmICghSXNPYmplY3QodGFyZ2V0KSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICBpZiAoIUlzVW5kZWZpbmVkKHByb3BlcnR5S2V5KSlcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eUtleSA9IFRvUHJvcGVydHlLZXkocHJvcGVydHlLZXkpO1xuICAgICAgICAgICAgcmV0dXJuIE9yZGluYXJ5T3duTWV0YWRhdGFLZXlzKHRhcmdldCwgcHJvcGVydHlLZXkpO1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydGVyKFwiZ2V0T3duTWV0YWRhdGFLZXlzXCIsIGdldE93bk1ldGFkYXRhS2V5cyk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWxldGVzIHRoZSBtZXRhZGF0YSBlbnRyeSBmcm9tIHRoZSB0YXJnZXQgb2JqZWN0IHdpdGggdGhlIHByb3ZpZGVkIGtleS5cbiAgICAgICAgICogQHBhcmFtIG1ldGFkYXRhS2V5IEEga2V5IHVzZWQgdG8gc3RvcmUgYW5kIHJldHJpZXZlIG1ldGFkYXRhLlxuICAgICAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IG9uIHdoaWNoIHRoZSBtZXRhZGF0YSBpcyBkZWZpbmVkLlxuICAgICAgICAgKiBAcGFyYW0gcHJvcGVydHlLZXkgKE9wdGlvbmFsKSBUaGUgcHJvcGVydHkga2V5IGZvciB0aGUgdGFyZ2V0LlxuICAgICAgICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG1ldGFkYXRhIGVudHJ5IHdhcyBmb3VuZCBhbmQgZGVsZXRlZDsgb3RoZXJ3aXNlLCBmYWxzZS5cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xuICAgICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5IGRlY2xhcmF0aW9ucyBhcmUgbm90IHBhcnQgb2YgRVM2LCB0aG91Z2ggdGhleSBhcmUgdmFsaWQgaW4gVHlwZVNjcmlwdDpcbiAgICAgICAgICogICAgICAgICAvLyBzdGF0aWMgc3RhdGljUHJvcGVydHk7XG4gICAgICAgICAqICAgICAgICAgLy8gcHJvcGVydHk7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAgICAgY29uc3RydWN0b3IocCkgeyB9XG4gICAgICAgICAqICAgICAgICAgc3RhdGljIHN0YXRpY01ldGhvZChwKSB7IH1cbiAgICAgICAgICogICAgICAgICBtZXRob2QocCkgeyB9XG4gICAgICAgICAqICAgICB9XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBjb25zdHJ1Y3RvclxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5kZWxldGVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIGNvbnN0cnVjdG9yKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5kZWxldGVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUsIFwic3RhdGljUHJvcGVydHlcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gcHJvdG90eXBlKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5kZWxldGVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUucHJvdG90eXBlLCBcInByb3BlcnR5XCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBjb25zdHJ1Y3RvcilcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZGVsZXRlTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLCBcInN0YXRpY01ldGhvZFwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIG1ldGhvZCAob24gcHJvdG90eXBlKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5kZWxldGVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGRlbGV0ZU1ldGFkYXRhKG1ldGFkYXRhS2V5LCB0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgICAgICBpZiAoIUlzT2JqZWN0KHRhcmdldCkpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICAgICAgaWYgKCFJc1VuZGVmaW5lZChwcm9wZXJ0eUtleSkpXG4gICAgICAgICAgICAgICAgcHJvcGVydHlLZXkgPSBUb1Byb3BlcnR5S2V5KHByb3BlcnR5S2V5KTtcbiAgICAgICAgICAgIHZhciBtZXRhZGF0YU1hcCA9IEdldE9yQ3JlYXRlTWV0YWRhdGFNYXAodGFyZ2V0LCBwcm9wZXJ0eUtleSwgLypDcmVhdGUqLyBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoSXNVbmRlZmluZWQobWV0YWRhdGFNYXApKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGlmICghbWV0YWRhdGFNYXAuZGVsZXRlKG1ldGFkYXRhS2V5KSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBpZiAobWV0YWRhdGFNYXAuc2l6ZSA+IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0TWV0YWRhdGEgPSBNZXRhZGF0YS5nZXQodGFyZ2V0KTtcbiAgICAgICAgICAgIHRhcmdldE1ldGFkYXRhLmRlbGV0ZShwcm9wZXJ0eUtleSk7XG4gICAgICAgICAgICBpZiAodGFyZ2V0TWV0YWRhdGEuc2l6ZSA+IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBNZXRhZGF0YS5kZWxldGUodGFyZ2V0KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydGVyKFwiZGVsZXRlTWV0YWRhdGFcIiwgZGVsZXRlTWV0YWRhdGEpO1xuICAgICAgICBmdW5jdGlvbiBEZWNvcmF0ZUNvbnN0cnVjdG9yKGRlY29yYXRvcnMsIHRhcmdldCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVjb3JhdG9yID0gZGVjb3JhdG9yc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgZGVjb3JhdGVkID0gZGVjb3JhdG9yKHRhcmdldCk7XG4gICAgICAgICAgICAgICAgaWYgKCFJc1VuZGVmaW5lZChkZWNvcmF0ZWQpICYmICFJc051bGwoZGVjb3JhdGVkKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIUlzQ29uc3RydWN0b3IoZGVjb3JhdGVkKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gZGVjb3JhdGVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gRGVjb3JhdGVQcm9wZXJ0eShkZWNvcmF0b3JzLCB0YXJnZXQsIHByb3BlcnR5S2V5LCBkZXNjcmlwdG9yKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICAgICAgICAgIHZhciBkZWNvcmF0b3IgPSBkZWNvcmF0b3JzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBkZWNvcmF0ZWQgPSBkZWNvcmF0b3IodGFyZ2V0LCBwcm9wZXJ0eUtleSwgZGVzY3JpcHRvcik7XG4gICAgICAgICAgICAgICAgaWYgKCFJc1VuZGVmaW5lZChkZWNvcmF0ZWQpICYmICFJc051bGwoZGVjb3JhdGVkKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIUlzT2JqZWN0KGRlY29yYXRlZCkpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0b3IgPSBkZWNvcmF0ZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gR2V0T3JDcmVhdGVNZXRhZGF0YU1hcChPLCBQLCBDcmVhdGUpIHtcbiAgICAgICAgICAgIHZhciB0YXJnZXRNZXRhZGF0YSA9IE1ldGFkYXRhLmdldChPKTtcbiAgICAgICAgICAgIGlmIChJc1VuZGVmaW5lZCh0YXJnZXRNZXRhZGF0YSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIUNyZWF0ZSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB0YXJnZXRNZXRhZGF0YSA9IG5ldyBfTWFwKCk7XG4gICAgICAgICAgICAgICAgTWV0YWRhdGEuc2V0KE8sIHRhcmdldE1ldGFkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBtZXRhZGF0YU1hcCA9IHRhcmdldE1ldGFkYXRhLmdldChQKTtcbiAgICAgICAgICAgIGlmIChJc1VuZGVmaW5lZChtZXRhZGF0YU1hcCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIUNyZWF0ZSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBtZXRhZGF0YU1hcCA9IG5ldyBfTWFwKCk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0TWV0YWRhdGEuc2V0KFAsIG1ldGFkYXRhTWFwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtZXRhZGF0YU1hcDtcbiAgICAgICAgfVxuICAgICAgICAvLyAzLjEuMS4xIE9yZGluYXJ5SGFzTWV0YWRhdGEoTWV0YWRhdGFLZXksIE8sIFApXG4gICAgICAgIC8vIGh0dHBzOi8vcmJ1Y2t0b24uZ2l0aHViLmlvL3JlZmxlY3QtbWV0YWRhdGEvI29yZGluYXJ5aGFzbWV0YWRhdGFcbiAgICAgICAgZnVuY3Rpb24gT3JkaW5hcnlIYXNNZXRhZGF0YShNZXRhZGF0YUtleSwgTywgUCkge1xuICAgICAgICAgICAgdmFyIGhhc093biA9IE9yZGluYXJ5SGFzT3duTWV0YWRhdGEoTWV0YWRhdGFLZXksIE8sIFApO1xuICAgICAgICAgICAgaWYgKGhhc093bilcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBPcmRpbmFyeUdldFByb3RvdHlwZU9mKE8pO1xuICAgICAgICAgICAgaWYgKCFJc051bGwocGFyZW50KSlcbiAgICAgICAgICAgICAgICByZXR1cm4gT3JkaW5hcnlIYXNNZXRhZGF0YShNZXRhZGF0YUtleSwgcGFyZW50LCBQKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLyAzLjEuMi4xIE9yZGluYXJ5SGFzT3duTWV0YWRhdGEoTWV0YWRhdGFLZXksIE8sIFApXG4gICAgICAgIC8vIGh0dHBzOi8vcmJ1Y2t0b24uZ2l0aHViLmlvL3JlZmxlY3QtbWV0YWRhdGEvI29yZGluYXJ5aGFzb3dubWV0YWRhdGFcbiAgICAgICAgZnVuY3Rpb24gT3JkaW5hcnlIYXNPd25NZXRhZGF0YShNZXRhZGF0YUtleSwgTywgUCkge1xuICAgICAgICAgICAgdmFyIG1ldGFkYXRhTWFwID0gR2V0T3JDcmVhdGVNZXRhZGF0YU1hcChPLCBQLCAvKkNyZWF0ZSovIGZhbHNlKTtcbiAgICAgICAgICAgIGlmIChJc1VuZGVmaW5lZChtZXRhZGF0YU1hcCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIFRvQm9vbGVhbihtZXRhZGF0YU1hcC5oYXMoTWV0YWRhdGFLZXkpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyAzLjEuMy4xIE9yZGluYXJ5R2V0TWV0YWRhdGEoTWV0YWRhdGFLZXksIE8sIFApXG4gICAgICAgIC8vIGh0dHBzOi8vcmJ1Y2t0b24uZ2l0aHViLmlvL3JlZmxlY3QtbWV0YWRhdGEvI29yZGluYXJ5Z2V0bWV0YWRhdGFcbiAgICAgICAgZnVuY3Rpb24gT3JkaW5hcnlHZXRNZXRhZGF0YShNZXRhZGF0YUtleSwgTywgUCkge1xuICAgICAgICAgICAgdmFyIGhhc093biA9IE9yZGluYXJ5SGFzT3duTWV0YWRhdGEoTWV0YWRhdGFLZXksIE8sIFApO1xuICAgICAgICAgICAgaWYgKGhhc093bilcbiAgICAgICAgICAgICAgICByZXR1cm4gT3JkaW5hcnlHZXRPd25NZXRhZGF0YShNZXRhZGF0YUtleSwgTywgUCk7XG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gT3JkaW5hcnlHZXRQcm90b3R5cGVPZihPKTtcbiAgICAgICAgICAgIGlmICghSXNOdWxsKHBhcmVudCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9yZGluYXJ5R2V0TWV0YWRhdGEoTWV0YWRhdGFLZXksIHBhcmVudCwgUCk7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIC8vIDMuMS40LjEgT3JkaW5hcnlHZXRPd25NZXRhZGF0YShNZXRhZGF0YUtleSwgTywgUClcbiAgICAgICAgLy8gaHR0cHM6Ly9yYnVja3Rvbi5naXRodWIuaW8vcmVmbGVjdC1tZXRhZGF0YS8jb3JkaW5hcnlnZXRvd25tZXRhZGF0YVxuICAgICAgICBmdW5jdGlvbiBPcmRpbmFyeUdldE93bk1ldGFkYXRhKE1ldGFkYXRhS2V5LCBPLCBQKSB7XG4gICAgICAgICAgICB2YXIgbWV0YWRhdGFNYXAgPSBHZXRPckNyZWF0ZU1ldGFkYXRhTWFwKE8sIFAsIC8qQ3JlYXRlKi8gZmFsc2UpO1xuICAgICAgICAgICAgaWYgKElzVW5kZWZpbmVkKG1ldGFkYXRhTWFwKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgcmV0dXJuIG1ldGFkYXRhTWFwLmdldChNZXRhZGF0YUtleSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gMy4xLjUuMSBPcmRpbmFyeURlZmluZU93bk1ldGFkYXRhKE1ldGFkYXRhS2V5LCBNZXRhZGF0YVZhbHVlLCBPLCBQKVxuICAgICAgICAvLyBodHRwczovL3JidWNrdG9uLmdpdGh1Yi5pby9yZWZsZWN0LW1ldGFkYXRhLyNvcmRpbmFyeWRlZmluZW93bm1ldGFkYXRhXG4gICAgICAgIGZ1bmN0aW9uIE9yZGluYXJ5RGVmaW5lT3duTWV0YWRhdGEoTWV0YWRhdGFLZXksIE1ldGFkYXRhVmFsdWUsIE8sIFApIHtcbiAgICAgICAgICAgIHZhciBtZXRhZGF0YU1hcCA9IEdldE9yQ3JlYXRlTWV0YWRhdGFNYXAoTywgUCwgLypDcmVhdGUqLyB0cnVlKTtcbiAgICAgICAgICAgIG1ldGFkYXRhTWFwLnNldChNZXRhZGF0YUtleSwgTWV0YWRhdGFWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gMy4xLjYuMSBPcmRpbmFyeU1ldGFkYXRhS2V5cyhPLCBQKVxuICAgICAgICAvLyBodHRwczovL3JidWNrdG9uLmdpdGh1Yi5pby9yZWZsZWN0LW1ldGFkYXRhLyNvcmRpbmFyeW1ldGFkYXRha2V5c1xuICAgICAgICBmdW5jdGlvbiBPcmRpbmFyeU1ldGFkYXRhS2V5cyhPLCBQKSB7XG4gICAgICAgICAgICB2YXIgb3duS2V5cyA9IE9yZGluYXJ5T3duTWV0YWRhdGFLZXlzKE8sIFApO1xuICAgICAgICAgICAgdmFyIHBhcmVudCA9IE9yZGluYXJ5R2V0UHJvdG90eXBlT2YoTyk7XG4gICAgICAgICAgICBpZiAocGFyZW50ID09PSBudWxsKVxuICAgICAgICAgICAgICAgIHJldHVybiBvd25LZXlzO1xuICAgICAgICAgICAgdmFyIHBhcmVudEtleXMgPSBPcmRpbmFyeU1ldGFkYXRhS2V5cyhwYXJlbnQsIFApO1xuICAgICAgICAgICAgaWYgKHBhcmVudEtleXMubGVuZ3RoIDw9IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIG93bktleXM7XG4gICAgICAgICAgICBpZiAob3duS2V5cy5sZW5ndGggPD0gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50S2V5cztcbiAgICAgICAgICAgIHZhciBzZXQgPSBuZXcgX1NldCgpO1xuICAgICAgICAgICAgdmFyIGtleXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgb3duS2V5c18xID0gb3duS2V5czsgX2kgPCBvd25LZXlzXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IG93bktleXNfMVtfaV07XG4gICAgICAgICAgICAgICAgdmFyIGhhc0tleSA9IHNldC5oYXMoa2V5KTtcbiAgICAgICAgICAgICAgICBpZiAoIWhhc0tleSkge1xuICAgICAgICAgICAgICAgICAgICBzZXQuYWRkKGtleSk7XG4gICAgICAgICAgICAgICAgICAgIGtleXMucHVzaChrZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIF9hID0gMCwgcGFyZW50S2V5c18xID0gcGFyZW50S2V5czsgX2EgPCBwYXJlbnRLZXlzXzEubGVuZ3RoOyBfYSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IHBhcmVudEtleXNfMVtfYV07XG4gICAgICAgICAgICAgICAgdmFyIGhhc0tleSA9IHNldC5oYXMoa2V5KTtcbiAgICAgICAgICAgICAgICBpZiAoIWhhc0tleSkge1xuICAgICAgICAgICAgICAgICAgICBzZXQuYWRkKGtleSk7XG4gICAgICAgICAgICAgICAgICAgIGtleXMucHVzaChrZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBrZXlzO1xuICAgICAgICB9XG4gICAgICAgIC8vIDMuMS43LjEgT3JkaW5hcnlPd25NZXRhZGF0YUtleXMoTywgUClcbiAgICAgICAgLy8gaHR0cHM6Ly9yYnVja3Rvbi5naXRodWIuaW8vcmVmbGVjdC1tZXRhZGF0YS8jb3JkaW5hcnlvd25tZXRhZGF0YWtleXNcbiAgICAgICAgZnVuY3Rpb24gT3JkaW5hcnlPd25NZXRhZGF0YUtleXMoTywgUCkge1xuICAgICAgICAgICAgdmFyIGtleXMgPSBbXTtcbiAgICAgICAgICAgIHZhciBtZXRhZGF0YU1hcCA9IEdldE9yQ3JlYXRlTWV0YWRhdGFNYXAoTywgUCwgLypDcmVhdGUqLyBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoSXNVbmRlZmluZWQobWV0YWRhdGFNYXApKVxuICAgICAgICAgICAgICAgIHJldHVybiBrZXlzO1xuICAgICAgICAgICAgdmFyIGtleXNPYmogPSBtZXRhZGF0YU1hcC5rZXlzKCk7XG4gICAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBHZXRJdGVyYXRvcihrZXlzT2JqKTtcbiAgICAgICAgICAgIHZhciBrID0gMDtcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5leHQgPSBJdGVyYXRvclN0ZXAoaXRlcmF0b3IpO1xuICAgICAgICAgICAgICAgIGlmICghbmV4dCkge1xuICAgICAgICAgICAgICAgICAgICBrZXlzLmxlbmd0aCA9IGs7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXlzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgbmV4dFZhbHVlID0gSXRlcmF0b3JWYWx1ZShuZXh0KTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBrZXlzW2tdID0gbmV4dFZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgSXRlcmF0b3JDbG9zZShpdGVyYXRvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGsrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyA2IEVDTUFTY3JpcHQgRGF0YSBUeXAwZXMgYW5kIFZhbHVlc1xuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1lY21hc2NyaXB0LWRhdGEtdHlwZXMtYW5kLXZhbHVlc1xuICAgICAgICBmdW5jdGlvbiBUeXBlKHgpIHtcbiAgICAgICAgICAgIGlmICh4ID09PSBudWxsKVxuICAgICAgICAgICAgICAgIHJldHVybiAxIC8qIE51bGwgKi87XG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGVvZiB4KSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcInVuZGVmaW5lZFwiOiByZXR1cm4gMCAvKiBVbmRlZmluZWQgKi87XG4gICAgICAgICAgICAgICAgY2FzZSBcImJvb2xlYW5cIjogcmV0dXJuIDIgLyogQm9vbGVhbiAqLztcbiAgICAgICAgICAgICAgICBjYXNlIFwic3RyaW5nXCI6IHJldHVybiAzIC8qIFN0cmluZyAqLztcbiAgICAgICAgICAgICAgICBjYXNlIFwic3ltYm9sXCI6IHJldHVybiA0IC8qIFN5bWJvbCAqLztcbiAgICAgICAgICAgICAgICBjYXNlIFwibnVtYmVyXCI6IHJldHVybiA1IC8qIE51bWJlciAqLztcbiAgICAgICAgICAgICAgICBjYXNlIFwib2JqZWN0XCI6IHJldHVybiB4ID09PSBudWxsID8gMSAvKiBOdWxsICovIDogNiAvKiBPYmplY3QgKi87XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogcmV0dXJuIDYgLyogT2JqZWN0ICovO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIDYuMS4xIFRoZSBVbmRlZmluZWQgVHlwZVxuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzLXVuZGVmaW5lZC10eXBlXG4gICAgICAgIGZ1bmN0aW9uIElzVW5kZWZpbmVkKHgpIHtcbiAgICAgICAgICAgIHJldHVybiB4ID09PSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gNi4xLjIgVGhlIE51bGwgVHlwZVxuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzLW51bGwtdHlwZVxuICAgICAgICBmdW5jdGlvbiBJc051bGwoeCkge1xuICAgICAgICAgICAgcmV0dXJuIHggPT09IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gNi4xLjUgVGhlIFN5bWJvbCBUeXBlXG4gICAgICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMtc3ltYm9sLXR5cGVcbiAgICAgICAgZnVuY3Rpb24gSXNTeW1ib2woeCkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSBcInN5bWJvbFwiO1xuICAgICAgICB9XG4gICAgICAgIC8vIDYuMS43IFRoZSBPYmplY3QgVHlwZVxuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QtdHlwZVxuICAgICAgICBmdW5jdGlvbiBJc09iamVjdCh4KSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHggPT09IFwib2JqZWN0XCIgPyB4ICE9PSBudWxsIDogdHlwZW9mIHggPT09IFwiZnVuY3Rpb25cIjtcbiAgICAgICAgfVxuICAgICAgICAvLyA3LjEgVHlwZSBDb252ZXJzaW9uXG4gICAgICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXR5cGUtY29udmVyc2lvblxuICAgICAgICAvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbiAgICAgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdG9wcmltaXRpdmVcbiAgICAgICAgZnVuY3Rpb24gVG9QcmltaXRpdmUoaW5wdXQsIFByZWZlcnJlZFR5cGUpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoVHlwZShpbnB1dCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDAgLyogVW5kZWZpbmVkICovOiByZXR1cm4gaW5wdXQ7XG4gICAgICAgICAgICAgICAgY2FzZSAxIC8qIE51bGwgKi86IHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgICAgICBjYXNlIDIgLyogQm9vbGVhbiAqLzogcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgICAgIGNhc2UgMyAvKiBTdHJpbmcgKi86IHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgICAgICBjYXNlIDQgLyogU3ltYm9sICovOiByZXR1cm4gaW5wdXQ7XG4gICAgICAgICAgICAgICAgY2FzZSA1IC8qIE51bWJlciAqLzogcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGhpbnQgPSBQcmVmZXJyZWRUeXBlID09PSAzIC8qIFN0cmluZyAqLyA/IFwic3RyaW5nXCIgOiBQcmVmZXJyZWRUeXBlID09PSA1IC8qIE51bWJlciAqLyA/IFwibnVtYmVyXCIgOiBcImRlZmF1bHRcIjtcbiAgICAgICAgICAgIHZhciBleG90aWNUb1ByaW0gPSBHZXRNZXRob2QoaW5wdXQsIHRvUHJpbWl0aXZlU3ltYm9sKTtcbiAgICAgICAgICAgIGlmIChleG90aWNUb1ByaW0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBleG90aWNUb1ByaW0uY2FsbChpbnB1dCwgaGludCk7XG4gICAgICAgICAgICAgICAgaWYgKElzT2JqZWN0KHJlc3VsdCkpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIE9yZGluYXJ5VG9QcmltaXRpdmUoaW5wdXQsIGhpbnQgPT09IFwiZGVmYXVsdFwiID8gXCJudW1iZXJcIiA6IGhpbnQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIDcuMS4xLjEgT3JkaW5hcnlUb1ByaW1pdGl2ZShPLCBoaW50KVxuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vcmRpbmFyeXRvcHJpbWl0aXZlXG4gICAgICAgIGZ1bmN0aW9uIE9yZGluYXJ5VG9QcmltaXRpdmUoTywgaGludCkge1xuICAgICAgICAgICAgaWYgKGhpbnQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICB2YXIgdG9TdHJpbmdfMSA9IE8udG9TdHJpbmc7XG4gICAgICAgICAgICAgICAgaWYgKElzQ2FsbGFibGUodG9TdHJpbmdfMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRvU3RyaW5nXzEuY2FsbChPKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFJc09iamVjdChyZXN1bHQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlT2YgPSBPLnZhbHVlT2Y7XG4gICAgICAgICAgICAgICAgaWYgKElzQ2FsbGFibGUodmFsdWVPZikpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHZhbHVlT2YuY2FsbChPKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFJc09iamVjdChyZXN1bHQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWVPZiA9IE8udmFsdWVPZjtcbiAgICAgICAgICAgICAgICBpZiAoSXNDYWxsYWJsZSh2YWx1ZU9mKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gdmFsdWVPZi5jYWxsKE8pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIUlzT2JqZWN0KHJlc3VsdCkpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgdG9TdHJpbmdfMiA9IE8udG9TdHJpbmc7XG4gICAgICAgICAgICAgICAgaWYgKElzQ2FsbGFibGUodG9TdHJpbmdfMikpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRvU3RyaW5nXzIuY2FsbChPKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFJc09iamVjdChyZXN1bHQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gNy4xLjIgVG9Cb29sZWFuKGFyZ3VtZW50KVxuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvMjAxNi8jc2VjLXRvYm9vbGVhblxuICAgICAgICBmdW5jdGlvbiBUb0Jvb2xlYW4oYXJndW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiAhIWFyZ3VtZW50O1xuICAgICAgICB9XG4gICAgICAgIC8vIDcuMS4xMiBUb1N0cmluZyhhcmd1bWVudClcbiAgICAgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdG9zdHJpbmdcbiAgICAgICAgZnVuY3Rpb24gVG9TdHJpbmcoYXJndW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiICsgYXJndW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gNy4xLjE0IFRvUHJvcGVydHlLZXkoYXJndW1lbnQpXG4gICAgICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXRvcHJvcGVydHlrZXlcbiAgICAgICAgZnVuY3Rpb24gVG9Qcm9wZXJ0eUtleShhcmd1bWVudCkge1xuICAgICAgICAgICAgdmFyIGtleSA9IFRvUHJpbWl0aXZlKGFyZ3VtZW50LCAzIC8qIFN0cmluZyAqLyk7XG4gICAgICAgICAgICBpZiAoSXNTeW1ib2woa2V5KSlcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgICAgICAgcmV0dXJuIFRvU3RyaW5nKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gNy4yIFRlc3RpbmcgYW5kIENvbXBhcmlzb24gT3BlcmF0aW9uc1xuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy10ZXN0aW5nLWFuZC1jb21wYXJpc29uLW9wZXJhdGlvbnNcbiAgICAgICAgLy8gNy4yLjIgSXNBcnJheShhcmd1bWVudClcbiAgICAgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtaXNhcnJheVxuICAgICAgICBmdW5jdGlvbiBJc0FycmF5KGFyZ3VtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkuaXNBcnJheVxuICAgICAgICAgICAgICAgID8gQXJyYXkuaXNBcnJheShhcmd1bWVudClcbiAgICAgICAgICAgICAgICA6IGFyZ3VtZW50IGluc3RhbmNlb2YgT2JqZWN0XG4gICAgICAgICAgICAgICAgICAgID8gYXJndW1lbnQgaW5zdGFuY2VvZiBBcnJheVxuICAgICAgICAgICAgICAgICAgICA6IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmd1bWVudCkgPT09IFwiW29iamVjdCBBcnJheV1cIjtcbiAgICAgICAgfVxuICAgICAgICAvLyA3LjIuMyBJc0NhbGxhYmxlKGFyZ3VtZW50KVxuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1pc2NhbGxhYmxlXG4gICAgICAgIGZ1bmN0aW9uIElzQ2FsbGFibGUoYXJndW1lbnQpIHtcbiAgICAgICAgICAgIC8vIE5PVEU6IFRoaXMgaXMgYW4gYXBwcm94aW1hdGlvbiBhcyB3ZSBjYW5ub3QgY2hlY2sgZm9yIFtbQ2FsbF1dIGludGVybmFsIG1ldGhvZC5cbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYXJndW1lbnQgPT09IFwiZnVuY3Rpb25cIjtcbiAgICAgICAgfVxuICAgICAgICAvLyA3LjIuNCBJc0NvbnN0cnVjdG9yKGFyZ3VtZW50KVxuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1pc2NvbnN0cnVjdG9yXG4gICAgICAgIGZ1bmN0aW9uIElzQ29uc3RydWN0b3IoYXJndW1lbnQpIHtcbiAgICAgICAgICAgIC8vIE5PVEU6IFRoaXMgaXMgYW4gYXBwcm94aW1hdGlvbiBhcyB3ZSBjYW5ub3QgY2hlY2sgZm9yIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgbWV0aG9kLlxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBhcmd1bWVudCA9PT0gXCJmdW5jdGlvblwiO1xuICAgICAgICB9XG4gICAgICAgIC8vIDcuMi43IElzUHJvcGVydHlLZXkoYXJndW1lbnQpXG4gICAgICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWlzcHJvcGVydHlrZXlcbiAgICAgICAgZnVuY3Rpb24gSXNQcm9wZXJ0eUtleShhcmd1bWVudCkge1xuICAgICAgICAgICAgc3dpdGNoIChUeXBlKGFyZ3VtZW50KSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMyAvKiBTdHJpbmcgKi86IHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNCAvKiBTeW1ib2wgKi86IHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyA3LjMgT3BlcmF0aW9ucyBvbiBPYmplY3RzXG4gICAgICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9wZXJhdGlvbnMtb24tb2JqZWN0c1xuICAgICAgICAvLyA3LjMuOSBHZXRNZXRob2QoViwgUClcbiAgICAgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZ2V0bWV0aG9kXG4gICAgICAgIGZ1bmN0aW9uIEdldE1ldGhvZChWLCBQKSB7XG4gICAgICAgICAgICB2YXIgZnVuYyA9IFZbUF07XG4gICAgICAgICAgICBpZiAoZnVuYyA9PT0gdW5kZWZpbmVkIHx8IGZ1bmMgPT09IG51bGwpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGlmICghSXNDYWxsYWJsZShmdW5jKSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICByZXR1cm4gZnVuYztcbiAgICAgICAgfVxuICAgICAgICAvLyA3LjQgT3BlcmF0aW9ucyBvbiBJdGVyYXRvciBPYmplY3RzXG4gICAgICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9wZXJhdGlvbnMtb24taXRlcmF0b3Itb2JqZWN0c1xuICAgICAgICBmdW5jdGlvbiBHZXRJdGVyYXRvcihvYmopIHtcbiAgICAgICAgICAgIHZhciBtZXRob2QgPSBHZXRNZXRob2Qob2JqLCBpdGVyYXRvclN5bWJvbCk7XG4gICAgICAgICAgICBpZiAoIUlzQ2FsbGFibGUobWV0aG9kKSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7IC8vIGZyb20gQ2FsbFxuICAgICAgICAgICAgdmFyIGl0ZXJhdG9yID0gbWV0aG9kLmNhbGwob2JqKTtcbiAgICAgICAgICAgIGlmICghSXNPYmplY3QoaXRlcmF0b3IpKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgIHJldHVybiBpdGVyYXRvcjtcbiAgICAgICAgfVxuICAgICAgICAvLyA3LjQuNCBJdGVyYXRvclZhbHVlKGl0ZXJSZXN1bHQpXG4gICAgICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8yMDE2LyNzZWMtaXRlcmF0b3J2YWx1ZVxuICAgICAgICBmdW5jdGlvbiBJdGVyYXRvclZhbHVlKGl0ZXJSZXN1bHQpIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVyUmVzdWx0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIDcuNC41IEl0ZXJhdG9yU3RlcChpdGVyYXRvcilcbiAgICAgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtaXRlcmF0b3JzdGVwXG4gICAgICAgIGZ1bmN0aW9uIEl0ZXJhdG9yU3RlcChpdGVyYXRvcikge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IGZhbHNlIDogcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gICAgICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWl0ZXJhdG9yY2xvc2VcbiAgICAgICAgZnVuY3Rpb24gSXRlcmF0b3JDbG9zZShpdGVyYXRvcikge1xuICAgICAgICAgICAgdmFyIGYgPSBpdGVyYXRvcltcInJldHVyblwiXTtcbiAgICAgICAgICAgIGlmIChmKVxuICAgICAgICAgICAgICAgIGYuY2FsbChpdGVyYXRvcik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gOS4xIE9yZGluYXJ5IE9iamVjdCBJbnRlcm5hbCBNZXRob2RzIGFuZCBJbnRlcm5hbCBTbG90c1xuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vcmRpbmFyeS1vYmplY3QtaW50ZXJuYWwtbWV0aG9kcy1hbmQtaW50ZXJuYWwtc2xvdHNcbiAgICAgICAgLy8gOS4xLjEuMSBPcmRpbmFyeUdldFByb3RvdHlwZU9mKE8pXG4gICAgICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9yZGluYXJ5Z2V0cHJvdG90eXBlb2ZcbiAgICAgICAgZnVuY3Rpb24gT3JkaW5hcnlHZXRQcm90b3R5cGVPZihPKSB7XG4gICAgICAgICAgICB2YXIgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTyk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIE8gIT09IFwiZnVuY3Rpb25cIiB8fCBPID09PSBmdW5jdGlvblByb3RvdHlwZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvdG87XG4gICAgICAgICAgICAvLyBUeXBlU2NyaXB0IGRvZXNuJ3Qgc2V0IF9fcHJvdG9fXyBpbiBFUzUsIGFzIGl0J3Mgbm9uLXN0YW5kYXJkLlxuICAgICAgICAgICAgLy8gVHJ5IHRvIGRldGVybWluZSB0aGUgc3VwZXJjbGFzcyBjb25zdHJ1Y3Rvci4gQ29tcGF0aWJsZSBpbXBsZW1lbnRhdGlvbnNcbiAgICAgICAgICAgIC8vIG11c3QgZWl0aGVyIHNldCBfX3Byb3RvX18gb24gYSBzdWJjbGFzcyBjb25zdHJ1Y3RvciB0byB0aGUgc3VwZXJjbGFzcyBjb25zdHJ1Y3RvcixcbiAgICAgICAgICAgIC8vIG9yIGVuc3VyZSBlYWNoIGNsYXNzIGhhcyBhIHZhbGlkIGBjb25zdHJ1Y3RvcmAgcHJvcGVydHkgb24gaXRzIHByb3RvdHlwZSB0aGF0XG4gICAgICAgICAgICAvLyBwb2ludHMgYmFjayB0byB0aGUgY29uc3RydWN0b3IuXG4gICAgICAgICAgICAvLyBJZiB0aGlzIGlzIG5vdCB0aGUgc2FtZSBhcyBGdW5jdGlvbi5bW1Byb3RvdHlwZV1dLCB0aGVuIHRoaXMgaXMgZGVmaW5hdGVseSBpbmhlcml0ZWQuXG4gICAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBjYXNlIHdoZW4gaW4gRVM2IG9yIHdoZW4gdXNpbmcgX19wcm90b19fIGluIGEgY29tcGF0aWJsZSBicm93c2VyLlxuICAgICAgICAgICAgaWYgKHByb3RvICE9PSBmdW5jdGlvblByb3RvdHlwZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvdG87XG4gICAgICAgICAgICAvLyBJZiB0aGUgc3VwZXIgcHJvdG90eXBlIGlzIE9iamVjdC5wcm90b3R5cGUsIG51bGwsIG9yIHVuZGVmaW5lZCwgdGhlbiB3ZSBjYW5ub3QgZGV0ZXJtaW5lIHRoZSBoZXJpdGFnZS5cbiAgICAgICAgICAgIHZhciBwcm90b3R5cGUgPSBPLnByb3RvdHlwZTtcbiAgICAgICAgICAgIHZhciBwcm90b3R5cGVQcm90byA9IHByb3RvdHlwZSAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG90eXBlKTtcbiAgICAgICAgICAgIGlmIChwcm90b3R5cGVQcm90byA9PSBudWxsIHx8IHByb3RvdHlwZVByb3RvID09PSBPYmplY3QucHJvdG90eXBlKVxuICAgICAgICAgICAgICAgIHJldHVybiBwcm90bztcbiAgICAgICAgICAgIC8vIElmIHRoZSBjb25zdHJ1Y3RvciB3YXMgbm90IGEgZnVuY3Rpb24sIHRoZW4gd2UgY2Fubm90IGRldGVybWluZSB0aGUgaGVyaXRhZ2UuXG4gICAgICAgICAgICB2YXIgY29uc3RydWN0b3IgPSBwcm90b3R5cGVQcm90by5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc3RydWN0b3IgIT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvdG87XG4gICAgICAgICAgICAvLyBJZiB3ZSBoYXZlIHNvbWUga2luZCBvZiBzZWxmLXJlZmVyZW5jZSwgdGhlbiB3ZSBjYW5ub3QgZGV0ZXJtaW5lIHRoZSBoZXJpdGFnZS5cbiAgICAgICAgICAgIGlmIChjb25zdHJ1Y3RvciA9PT0gTylcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvdG87XG4gICAgICAgICAgICAvLyB3ZSBoYXZlIGEgcHJldHR5IGdvb2QgZ3Vlc3MgYXQgdGhlIGhlcml0YWdlLlxuICAgICAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yO1xuICAgICAgICB9XG4gICAgICAgIC8vIG5haXZlIE1hcCBzaGltXG4gICAgICAgIGZ1bmN0aW9uIENyZWF0ZU1hcFBvbHlmaWxsKCkge1xuICAgICAgICAgICAgdmFyIGNhY2hlU2VudGluZWwgPSB7fTtcbiAgICAgICAgICAgIHZhciBhcnJheVNlbnRpbmVsID0gW107XG4gICAgICAgICAgICB2YXIgTWFwSXRlcmF0b3IgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gTWFwSXRlcmF0b3Ioa2V5cywgdmFsdWVzLCBzZWxlY3Rvcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleXMgPSBrZXlzO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXMgPSB2YWx1ZXM7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdG9yID0gc2VsZWN0b3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIE1hcEl0ZXJhdG9yLnByb3RvdHlwZVtcIkBAaXRlcmF0b3JcIl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuICAgICAgICAgICAgICAgIE1hcEl0ZXJhdG9yLnByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuICAgICAgICAgICAgICAgIE1hcEl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9pbmRleDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IDAgJiYgaW5kZXggPCB0aGlzLl9rZXlzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuX3NlbGVjdG9yKHRoaXMuX2tleXNbaW5kZXhdLCB0aGlzLl92YWx1ZXNbaW5kZXhdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCArIDEgPj0gdGhpcy5fa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbmRleCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleXMgPSBhcnJheVNlbnRpbmVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlcyA9IGFycmF5U2VudGluZWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IHJlc3VsdCwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBNYXBJdGVyYXRvci5wcm90b3R5cGUudGhyb3cgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2luZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2luZGV4ID0gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXlzID0gYXJyYXlTZW50aW5lbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlcyA9IGFycmF5U2VudGluZWw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBNYXBJdGVyYXRvci5wcm90b3R5cGUucmV0dXJuID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbmRleCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fa2V5cyA9IGFycmF5U2VudGluZWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXMgPSBhcnJheVNlbnRpbmVsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiB2YWx1ZSwgZG9uZTogdHJ1ZSB9O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hcEl0ZXJhdG9yO1xuICAgICAgICAgICAgfSgpKTtcbiAgICAgICAgICAgIHJldHVybiAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gTWFwKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXlzID0gW107XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZUtleSA9IGNhY2hlU2VudGluZWw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlSW5kZXggPSAtMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE1hcC5wcm90b3R5cGUsIFwic2l6ZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fa2V5cy5sZW5ndGg7IH0sXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gdGhpcy5fZmluZChrZXksIC8qaW5zZXJ0Ki8gZmFsc2UpID49IDA7IH07XG4gICAgICAgICAgICAgICAgTWFwLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuX2ZpbmQoa2V5LCAvKmluc2VydCovIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluZGV4ID49IDAgPyB0aGlzLl92YWx1ZXNbaW5kZXhdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgTWFwLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9maW5kKGtleSwgLyppbnNlcnQqLyB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmFsdWVzW2luZGV4XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9maW5kKGtleSwgLyppbnNlcnQqLyBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2l6ZSA9IHRoaXMuX2tleXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IGluZGV4ICsgMTsgaSA8IHNpemU7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleXNbaSAtIDFdID0gdGhpcy5fa2V5c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXNbaSAtIDFdID0gdGhpcy5fdmFsdWVzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fa2V5cy5sZW5ndGgtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlcy5sZW5ndGgtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IHRoaXMuX2NhY2hlS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FjaGVLZXkgPSBjYWNoZVNlbnRpbmVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlSW5kZXggPSAtMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleXMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmFsdWVzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlS2V5ID0gY2FjaGVTZW50aW5lbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FjaGVJbmRleCA9IC0yO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgTWFwLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IE1hcEl0ZXJhdG9yKHRoaXMuX2tleXMsIHRoaXMuX3ZhbHVlcywgZ2V0S2V5KTsgfTtcbiAgICAgICAgICAgICAgICBNYXAucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBNYXBJdGVyYXRvcih0aGlzLl9rZXlzLCB0aGlzLl92YWx1ZXMsIGdldFZhbHVlKTsgfTtcbiAgICAgICAgICAgICAgICBNYXAucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgTWFwSXRlcmF0b3IodGhpcy5fa2V5cywgdGhpcy5fdmFsdWVzLCBnZXRFbnRyeSk7IH07XG4gICAgICAgICAgICAgICAgTWFwLnByb3RvdHlwZVtcIkBAaXRlcmF0b3JcIl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLmVudHJpZXMoKTsgfTtcbiAgICAgICAgICAgICAgICBNYXAucHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuZW50cmllcygpOyB9O1xuICAgICAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuX2ZpbmQgPSBmdW5jdGlvbiAoa2V5LCBpbnNlcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NhY2hlS2V5ICE9PSBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlSW5kZXggPSB0aGlzLl9rZXlzLmluZGV4T2YodGhpcy5fY2FjaGVLZXkgPSBrZXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jYWNoZUluZGV4IDwgMCAmJiBpbnNlcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlSW5kZXggPSB0aGlzLl9rZXlzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleXMucHVzaChrZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmFsdWVzLnB1c2godW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FjaGVJbmRleDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXA7XG4gICAgICAgICAgICB9KCkpO1xuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0S2V5KGtleSwgXykge1xuICAgICAgICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRWYWx1ZShfLCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldEVudHJ5KGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW2tleSwgdmFsdWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIG5haXZlIFNldCBzaGltXG4gICAgICAgIGZ1bmN0aW9uIENyZWF0ZVNldFBvbHlmaWxsKCkge1xuICAgICAgICAgICAgcmV0dXJuIC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBTZXQoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21hcCA9IG5ldyBfTWFwKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTZXQucHJvdG90eXBlLCBcInNpemVcIiwge1xuICAgICAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX21hcC5zaXplOyB9LFxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBTZXQucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gdGhpcy5fbWFwLmhhcyh2YWx1ZSk7IH07XG4gICAgICAgICAgICAgICAgU2V0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIHRoaXMuX21hcC5zZXQodmFsdWUsIHZhbHVlKSwgdGhpczsgfTtcbiAgICAgICAgICAgICAgICBTZXQucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gdGhpcy5fbWFwLmRlbGV0ZSh2YWx1ZSk7IH07XG4gICAgICAgICAgICAgICAgU2V0LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHsgdGhpcy5fbWFwLmNsZWFyKCk7IH07XG4gICAgICAgICAgICAgICAgU2V0LnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fbWFwLmtleXMoKTsgfTtcbiAgICAgICAgICAgICAgICBTZXQucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX21hcC52YWx1ZXMoKTsgfTtcbiAgICAgICAgICAgICAgICBTZXQucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLl9tYXAuZW50cmllcygpOyB9O1xuICAgICAgICAgICAgICAgIFNldC5wcm90b3R5cGVbXCJAQGl0ZXJhdG9yXCJdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5rZXlzKCk7IH07XG4gICAgICAgICAgICAgICAgU2V0LnByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLmtleXMoKTsgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gU2V0O1xuICAgICAgICAgICAgfSgpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBuYWl2ZSBXZWFrTWFwIHNoaW1cbiAgICAgICAgZnVuY3Rpb24gQ3JlYXRlV2Vha01hcFBvbHlmaWxsKCkge1xuICAgICAgICAgICAgdmFyIFVVSURfU0laRSA9IDE2O1xuICAgICAgICAgICAgdmFyIGtleXMgPSBIYXNoTWFwLmNyZWF0ZSgpO1xuICAgICAgICAgICAgdmFyIHJvb3RLZXkgPSBDcmVhdGVVbmlxdWVLZXkoKTtcbiAgICAgICAgICAgIHJldHVybiAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gV2Vha01hcCgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fa2V5ID0gQ3JlYXRlVW5pcXVlS2V5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFdlYWtNYXAucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlID0gR2V0T3JDcmVhdGVXZWFrTWFwVGFibGUodGFyZ2V0LCAvKmNyZWF0ZSovIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhYmxlICE9PSB1bmRlZmluZWQgPyBIYXNoTWFwLmhhcyh0YWJsZSwgdGhpcy5fa2V5KSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgV2Vha01hcC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGUgPSBHZXRPckNyZWF0ZVdlYWtNYXBUYWJsZSh0YXJnZXQsIC8qY3JlYXRlKi8gZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFibGUgIT09IHVuZGVmaW5lZCA/IEhhc2hNYXAuZ2V0KHRhYmxlLCB0aGlzLl9rZXkpIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgV2Vha01hcC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHRhcmdldCwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlID0gR2V0T3JDcmVhdGVXZWFrTWFwVGFibGUodGFyZ2V0LCAvKmNyZWF0ZSovIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB0YWJsZVt0aGlzLl9rZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgV2Vha01hcC5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFibGUgPSBHZXRPckNyZWF0ZVdlYWtNYXBUYWJsZSh0YXJnZXQsIC8qY3JlYXRlKi8gZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFibGUgIT09IHVuZGVmaW5lZCA/IGRlbGV0ZSB0YWJsZVt0aGlzLl9rZXldIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBXZWFrTWFwLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTk9URTogbm90IGEgcmVhbCBjbGVhciwganVzdCBtYWtlcyB0aGUgcHJldmlvdXMgZGF0YSB1bnJlYWNoYWJsZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXkgPSBDcmVhdGVVbmlxdWVLZXkoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBXZWFrTWFwO1xuICAgICAgICAgICAgfSgpKTtcbiAgICAgICAgICAgIGZ1bmN0aW9uIENyZWF0ZVVuaXF1ZUtleSgpIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5O1xuICAgICAgICAgICAgICAgIGRvXG4gICAgICAgICAgICAgICAgICAgIGtleSA9IFwiQEBXZWFrTWFwQEBcIiArIENyZWF0ZVVVSUQoKTtcbiAgICAgICAgICAgICAgICB3aGlsZSAoSGFzaE1hcC5oYXMoa2V5cywga2V5KSk7XG4gICAgICAgICAgICAgICAga2V5c1trZXldID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gR2V0T3JDcmVhdGVXZWFrTWFwVGFibGUodGFyZ2V0LCBjcmVhdGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWhhc093bi5jYWxsKHRhcmdldCwgcm9vdEtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjcmVhdGUpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCByb290S2V5LCB7IHZhbHVlOiBIYXNoTWFwLmNyZWF0ZSgpIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Jvb3RLZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gRmlsbFJhbmRvbUJ5dGVzKGJ1ZmZlciwgc2l6ZSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgKytpKVxuICAgICAgICAgICAgICAgICAgICBidWZmZXJbaV0gPSBNYXRoLnJhbmRvbSgpICogMHhmZiB8IDA7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIEdlblJhbmRvbUJ5dGVzKHNpemUpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNyeXB0byAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KHNpemUpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtc0NyeXB0byAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoc2l6ZSkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRmlsbFJhbmRvbUJ5dGVzKG5ldyBVaW50OEFycmF5KHNpemUpLCBzaXplKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIEZpbGxSYW5kb21CeXRlcyhuZXcgQXJyYXkoc2l6ZSksIHNpemUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gQ3JlYXRlVVVJRCgpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IEdlblJhbmRvbUJ5dGVzKFVVSURfU0laRSk7XG4gICAgICAgICAgICAgICAgLy8gbWFyayBhcyByYW5kb20gLSBSRkMgNDEyMiDCpyA0LjRcbiAgICAgICAgICAgICAgICBkYXRhWzZdID0gZGF0YVs2XSAmIDB4NGYgfCAweDQwO1xuICAgICAgICAgICAgICAgIGRhdGFbOF0gPSBkYXRhWzhdICYgMHhiZiB8IDB4ODA7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgb2Zmc2V0ID0gMDsgb2Zmc2V0IDwgVVVJRF9TSVpFOyArK29mZnNldCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYnl0ZSA9IGRhdGFbb2Zmc2V0XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9mZnNldCA9PT0gNCB8fCBvZmZzZXQgPT09IDYgfHwgb2Zmc2V0ID09PSA4KVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IFwiLVwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYnl0ZSA8IDE2KVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IFwiMFwiO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gYnl0ZS50b1N0cmluZygxNikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyB1c2VzIGEgaGV1cmlzdGljIHVzZWQgYnkgdjggYW5kIGNoYWtyYSB0byBmb3JjZSBhbiBvYmplY3QgaW50byBkaWN0aW9uYXJ5IG1vZGUuXG4gICAgICAgIGZ1bmN0aW9uIE1ha2VEaWN0aW9uYXJ5KG9iaikge1xuICAgICAgICAgICAgb2JqLl9fID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgZGVsZXRlIG9iai5fXztcbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pKFJlZmxlY3QgfHwgKFJlZmxlY3QgPSB7fSkpO1xuIiwiaW1wb3J0IHsgTWV0YWRhdGEsIE1ldGFkYXRhQ2xhc3MsIE1ldGFkYXRhUmVhZGVyIH0gZnJvbSAnLi4vdHlwZXMvTWV0YWRhdGEnO1xuaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcCB9IGZyb20gJy4uL2NvbW1vbi9EZWZhdWx0VmFsdWVNYXAnO1xuXG50eXBlIEFueU1ldGFkYXRhID0gTWV0YWRhdGE8TWV0YWRhdGFSZWFkZXIsIHVua25vd24+O1xudHlwZSBBbnlNZXRhZGF0YUNsYXNzID0gTWV0YWRhdGFDbGFzczxNZXRhZGF0YVJlYWRlciwgdW5rbm93biwgQW55TWV0YWRhdGE+O1xuXG5jb25zdCBtZXRhZGF0YUluc3RhbmNlTWFwID0gY3JlYXRlRGVmYXVsdFZhbHVlTWFwPEFueU1ldGFkYXRhQ2xhc3MsIFNldDxBbnlNZXRhZGF0YT4+KCgpID0+IG5ldyBTZXQoKSk7XG5cbmV4cG9ydCBjbGFzcyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB7XG4gICAgc3RhdGljIGdldE1ldGFkYXRhPFIgZXh0ZW5kcyBNZXRhZGF0YVJlYWRlciwgVCBleHRlbmRzIE9iamVjdCwgTSBleHRlbmRzIE1ldGFkYXRhPFIsIFQ+ID0gTWV0YWRhdGE8UiwgVD4+KFxuICAgICAgICB0YXJnZXQ6IFQsXG4gICAgICAgIG1ldGFkYXRhQ2xhc3M6IE1ldGFkYXRhQ2xhc3M8UiwgVCwgTT5cbiAgICApIHtcbiAgICAgICAgY29uc3Qga2V5ID0gbWV0YWRhdGFDbGFzcy5nZXRSZWZsZWN0S2V5KCk7XG4gICAgICAgIGxldCBtZXRhZGF0YSA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoa2V5LCB0YXJnZXQpO1xuICAgICAgICBpZiAoIW1ldGFkYXRhKSB7XG4gICAgICAgICAgICBtZXRhZGF0YSA9IG5ldyBtZXRhZGF0YUNsYXNzKCk7XG4gICAgICAgICAgICBtZXRhZGF0YS5pbml0KHRhcmdldCk7XG4gICAgICAgICAgICBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKGtleSwgbWV0YWRhdGEsIHRhcmdldCk7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZVNldCA9IG1ldGFkYXRhSW5zdGFuY2VNYXAuZ2V0KG1ldGFkYXRhQ2xhc3MpO1xuICAgICAgICAgICAgaW5zdGFuY2VTZXQuYWRkKG1ldGFkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWV0YWRhdGEgYXMgTTtcbiAgICB9XG4gICAgc3RhdGljIGdldEFsbEluc3RhbmNlb2Y8TSBleHRlbmRzIEFueU1ldGFkYXRhQ2xhc3M+KG1ldGFkYXRhQ2xhc3M6IE0pIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obWV0YWRhdGFJbnN0YW5jZU1hcC5nZXQobWV0YWRhdGFDbGFzcykpO1xuICAgIH1cbn1cbiIsIi8vIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbmltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luc3RhbmNlU2NvcGUnO1xuaW1wb3J0IHsgSnNTZXJ2aWNlQ2xhc3MgfSBmcm9tICcuLi90eXBlcy9Kc1NlcnZpY2VDbGFzcyc7XG5pbXBvcnQgeyBNZXRhZGF0YSwgTWV0YWRhdGFSZWFkZXIgfSBmcm9tICcuLi90eXBlcy9NZXRhZGF0YSc7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBjcmVhdGVEZWZhdWx0VmFsdWVNYXAgfSBmcm9tICcuLi9jb21tb24vRGVmYXVsdFZhbHVlTWFwJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBNZW1iZXJLZXkgfSBmcm9tICcuLi90eXBlcy9NZW1iZXJLZXknO1xuaW1wb3J0IHsgS2V5T2YgfSBmcm9tICcuLi90eXBlcy9LZXlPZic7XG5cbmNvbnN0IENMQVNTX01FVEFEQVRBX0tFWSA9ICdpb2M6Y2xhc3MtbWV0YWRhdGEnO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1hcmtJbmZvIHtcbiAgICBba2V5OiBzdHJpbmcgfCBzeW1ib2xdOiB1bmtub3duO1xufVxuXG5leHBvcnQgY2xhc3MgTWFya0luZm9Db250YWluZXIge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbWFwID0gY3JlYXRlRGVmYXVsdFZhbHVlTWFwPE1lbWJlcktleSwgTWFya0luZm8+KCgpID0+ICh7fSBhcyBNYXJrSW5mbykpO1xuICAgIGdldE1hcmtJbmZvKG1ldGhvZDogTWVtYmVyS2V5KTogTWFya0luZm8ge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXAuZ2V0KG1ldGhvZCk7XG4gICAgfVxuICAgIG1hcmsobWV0aG9kOiBNZW1iZXJLZXksIGtleTogTWVtYmVyS2V5LCB2YWx1ZTogdW5rbm93bikge1xuICAgICAgICBjb25zdCBtYXJrSW5mbyA9IHRoaXMubWFwLmdldChtZXRob2QpO1xuICAgICAgICBtYXJrSW5mb1trZXldID0gdmFsdWU7XG4gICAgfVxuICAgIGdldE1lbWJlcnMoKSB7XG4gICAgICAgIHJldHVybiBuZXcgU2V0KHRoaXMubWFwLmtleXMoKSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGFyYW1ldGVyTWFya0luZm9Db250YWluZXIge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbWFwID0gY3JlYXRlRGVmYXVsdFZhbHVlTWFwPE1lbWJlcktleSwgUmVjb3JkPG51bWJlciwgTWFya0luZm8+PigoKSA9PiB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9KTtcbiAgICBnZXRNYXJrSW5mbyhtZXRob2Q6IE1lbWJlcktleSk6IFJlY29yZDxudW1iZXIsIE1hcmtJbmZvPiB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcC5nZXQobWV0aG9kKTtcbiAgICB9XG4gICAgbWFyayhtZXRob2Q6IE1lbWJlcktleSwgaW5kZXg6IG51bWJlciwga2V5OiBNZW1iZXJLZXksIHZhbHVlOiB1bmtub3duKSB7XG4gICAgICAgIGNvbnN0IHBhcmFtc01hcmtJbmZvID0gdGhpcy5tYXAuZ2V0KG1ldGhvZCk7XG4gICAgICAgIGNvbnN0IG1hcmtJbmZvID0gcGFyYW1zTWFya0luZm9baW5kZXhdIHx8IHt9O1xuICAgICAgICBtYXJrSW5mb1trZXldID0gdmFsdWU7XG4gICAgICAgIHBhcmFtc01hcmtJbmZvW2luZGV4XSA9IG1hcmtJbmZvO1xuICAgIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBDbGFzc01hcmtJbmZvIHtcbiAgICBjdG9yOiBNYXJrSW5mbztcbiAgICBtZW1iZXJzOiBNYXJrSW5mb0NvbnRhaW5lcjtcbiAgICBwYXJhbXM6IFBhcmFtZXRlck1hcmtJbmZvQ29udGFpbmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENsYXNzTWV0YWRhdGFSZWFkZXI8VD4gZXh0ZW5kcyBNZXRhZGF0YVJlYWRlciB7XG4gICAgZ2V0Q2xhc3MoKTogTmV3YWJsZTxUPjtcbiAgICBnZXRTY29wZSgpOiBJbnN0YW5jZVNjb3BlIHwgc3RyaW5nO1xuICAgIGdldENvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZXMoKTogQXJyYXk8SWRlbnRpZmllcj47XG4gICAgZ2V0TWV0aG9kcyhsaWZlY3ljbGU6IExpZmVjeWNsZSk6IEFycmF5PHN0cmluZyB8IHN5bWJvbD47XG4gICAgZ2V0UHJvcGVydHlUeXBlTWFwKCk6IE1hcDxzdHJpbmcgfCBzeW1ib2wsIElkZW50aWZpZXI+O1xuICAgIGdldEN0b3JNYXJrSW5mbygpOiBNYXJrSW5mbztcbiAgICBnZXRBbGxNYXJrZWRNZW1iZXJzKCk6IFNldDxNZW1iZXJLZXk+O1xuICAgIGdldE1lbWJlcnNNYXJrSW5mbyhtZXRob2RLZXk6IEtleU9mPFQ+KTogTWFya0luZm87XG4gICAgZ2V0UGFyYW1ldGVyTWFya0luZm8obWV0aG9kS2V5OiBLZXlPZjxUPik6IFJlY29yZDxudW1iZXIsIE1hcmtJbmZvPjtcbn1cblxuZXhwb3J0IGNsYXNzIENsYXNzTWV0YWRhdGE8VD4gaW1wbGVtZW50cyBNZXRhZGF0YTxDbGFzc01ldGFkYXRhUmVhZGVyPFQ+LCBOZXdhYmxlPFQ+PiB7XG4gICAgc3RhdGljIGdldFJlZmxlY3RLZXkoKSB7XG4gICAgICAgIHJldHVybiBDTEFTU19NRVRBREFUQV9LRVk7XG4gICAgfVxuICAgIHByaXZhdGUgc2NvcGU6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmcgPSBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTjtcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZXM6IEFycmF5PElkZW50aWZpZXI+ID0gW107XG4gICAgcHJpdmF0ZSByZWFkb25seSBsaWZlY3ljbGVNZXRob2RzTWFwOiBSZWNvcmQ8c3RyaW5nIHwgc3ltYm9sLCBTZXQ8TGlmZWN5Y2xlPj4gPSB7fTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHByb3BlcnR5VHlwZXNNYXAgPSBuZXcgTWFwPHN0cmluZyB8IHN5bWJvbCwgSWRlbnRpZmllcj4oKTtcbiAgICBwcml2YXRlIGNsYXp6ITogTmV3YWJsZTxUPjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IG1hcmtzOiBDbGFzc01hcmtJbmZvID0ge1xuICAgICAgICBjdG9yOiB7fSxcbiAgICAgICAgbWVtYmVyczogbmV3IE1hcmtJbmZvQ29udGFpbmVyKCksXG4gICAgICAgIHBhcmFtczogbmV3IFBhcmFtZXRlck1hcmtJbmZvQ29udGFpbmVyKClcbiAgICB9O1xuXG4gICAgc3RhdGljIGdldEluc3RhbmNlPFQ+KGN0b3I6IE5ld2FibGU8VD4pIHtcbiAgICAgICAgcmV0dXJuIE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0UmVhZGVyPFQ+KGN0b3I6IE5ld2FibGU8VD4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoY3RvcikucmVhZGVyKCk7XG4gICAgfVxuXG4gICAgaW5pdCh0YXJnZXQ6IE5ld2FibGU8VD4pIHtcbiAgICAgICAgdGhpcy5jbGF6eiA9IHRhcmdldDtcbiAgICAgICAgY29uc3QgY29uc3RyID0gdGFyZ2V0IGFzIEpzU2VydmljZUNsYXNzPHVua25vd24+O1xuICAgICAgICBpZiAodHlwZW9mIGNvbnN0ci5zY29wZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5zZXRTY29wZShjb25zdHIuc2NvcGUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBjb25zdHIuaW5qZWN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zdCBpbmplY3Rpb25zID0gY29uc3RyLmluamVjdCgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gaW5qZWN0aW9ucykge1xuICAgICAgICAgICAgICAgIHRoaXMucmVjb3JkUHJvcGVydHlUeXBlKGtleSwgaW5qZWN0aW9uc1trZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGNvbnN0ci5tZXRhZGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBjb25zdHIubWV0YWRhdGEoKTtcbiAgICAgICAgICAgIGlmIChtZXRhZGF0YS5zY29wZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2NvcGUobWV0YWRhdGEuc2NvcGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaW5qZWN0aW9ucyA9IG1ldGFkYXRhLmluamVjdDtcbiAgICAgICAgICAgIGlmIChpbmplY3Rpb25zKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gaW5qZWN0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlY29yZFByb3BlcnR5VHlwZShrZXksIGluamVjdGlvbnNba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWFya2VyKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY3RvcjogKGtleTogc3RyaW5nIHwgc3ltYm9sLCB2YWx1ZTogdW5rbm93bikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubWFya3MuY3RvcltrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWVtYmVyOiAocHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCB8IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcms6IChrZXk6IHN0cmluZyB8IHN5bWJvbCwgdmFsdWU6IHVua25vd24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFya3MubWVtYmVycy5tYXJrKHByb3BlcnR5S2V5LCBrZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyYW1ldGVyOiAocHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcms6IChrZXk6IHN0cmluZyB8IHN5bWJvbCwgdmFsdWU6IHVua25vd24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFya3MucGFyYW1zLm1hcmsocHJvcGVydHlLZXksIGluZGV4LCBrZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIHNldFNjb3BlKHNjb3BlOiBJbnN0YW5jZVNjb3BlIHwgc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc2NvcGUgPSBzY29wZTtcbiAgICB9XG4gICAgc2V0Q29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlKGluZGV4OiBudW1iZXIsIGNsczogSWRlbnRpZmllcikge1xuICAgICAgICB0aGlzLmNvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZXNbaW5kZXhdID0gY2xzO1xuICAgIH1cbiAgICByZWNvcmRQcm9wZXJ0eVR5cGUocHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCwgdHlwZTogSWRlbnRpZmllcikge1xuICAgICAgICB0aGlzLnByb3BlcnR5VHlwZXNNYXAuc2V0KHByb3BlcnR5S2V5LCB0eXBlKTtcbiAgICB9XG4gICAgYWRkTGlmZWN5Y2xlTWV0aG9kKG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCwgbGlmZWN5Y2xlOiBMaWZlY3ljbGUpIHtcbiAgICAgICAgY29uc3QgbGlmZWN5Y2xlcyA9IHRoaXMuZ2V0TGlmZWN5Y2xlcyhtZXRob2ROYW1lKTtcbiAgICAgICAgbGlmZWN5Y2xlcy5hZGQobGlmZWN5Y2xlKTtcbiAgICAgICAgdGhpcy5saWZlY3ljbGVNZXRob2RzTWFwW21ldGhvZE5hbWVdID0gbGlmZWN5Y2xlcztcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRMaWZlY3ljbGVzKG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5saWZlY3ljbGVNZXRob2RzTWFwW21ldGhvZE5hbWVdIHx8IG5ldyBTZXQ8TGlmZWN5Y2xlPigpO1xuICAgIH1cbiAgICBnZXRNZXRob2RzKGxpZmVjeWNsZTogTGlmZWN5Y2xlKTogQXJyYXk8c3RyaW5nIHwgc3ltYm9sPiB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmxpZmVjeWNsZU1ldGhvZHNNYXApLmZpbHRlcihpdCA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaWZlY3ljbGVzID0gdGhpcy5saWZlY3ljbGVNZXRob2RzTWFwW2l0XTtcbiAgICAgICAgICAgIHJldHVybiBsaWZlY3ljbGVzLmhhcyhsaWZlY3ljbGUpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVhZGVyKCk6IENsYXNzTWV0YWRhdGFSZWFkZXI8VD4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0Q2xhc3M6ICgpID0+IHRoaXMuY2xhenosXG4gICAgICAgICAgICBnZXRTY29wZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNjb3BlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldENvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZXM6ICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3RvclBhcmFtZXRlclR5cGVzLnNsaWNlKDApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldE1ldGhvZHM6IChsaWZlY3ljbGU6IExpZmVjeWNsZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldE1ldGhvZHMobGlmZWN5Y2xlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRQcm9wZXJ0eVR5cGVNYXA6ICgpID0+IG5ldyBNYXAodGhpcy5wcm9wZXJ0eVR5cGVzTWFwKSxcbiAgICAgICAgICAgIGdldEN0b3JNYXJrSW5mbzogKCk6IE1hcmtJbmZvID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyAuLi50aGlzLm1hcmtzLmN0b3IgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRBbGxNYXJrZWRNZW1iZXJzOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFya3MubWVtYmVycy5nZXRNZW1iZXJzKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0TWVtYmVyc01hcmtJbmZvOiAoa2V5OiBLZXlPZjxUPik6IE1hcmtJbmZvID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYXJrcy5tZW1iZXJzLmdldE1hcmtJbmZvKGtleSBhcyBNZW1iZXJLZXkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldFBhcmFtZXRlck1hcmtJbmZvOiAobWV0aG9kS2V5OiBLZXlPZjxUPik6IFJlY29yZDxudW1iZXIsIE1hcmtJbmZvPiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFya3MucGFyYW1zLmdldE1hcmtJbmZvKG1ldGhvZEtleSBhcyBNZW1iZXJLZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi4vdHlwZXMvU2VydmljZUZhY3RvcnknO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuXG5leHBvcnQgY2xhc3MgU2VydmljZUZhY3RvcnlEZWY8VD4ge1xuICAgIHN0YXRpYyBjcmVhdGVGcm9tQ2xhc3NNZXRhZGF0YTxUPihtZXRhZGF0YTogQ2xhc3NNZXRhZGF0YTxUPikge1xuICAgICAgICBjb25zdCBkZWYgPSBuZXcgU2VydmljZUZhY3RvcnlEZWYobWV0YWRhdGEucmVhZGVyKCkuZ2V0Q2xhc3MoKSwgdHJ1ZSk7XG4gICAgICAgIGRlZi5hcHBlbmQoKGNvbnRhaW5lcjogQXBwbGljYXRpb25Db250ZXh0LCBvd25lcjogdW5rbm93bikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWFkZXIgPSBtZXRhZGF0YS5yZWFkZXIoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjbGF6eiA9IHJlYWRlci5nZXRDbGFzcygpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXIuZ2V0SW5zdGFuY2UoY2xhenosIG93bmVyKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGVmO1xuICAgIH1cbiAgICBwdWJsaWMgcmVhZG9ubHkgZmFjdG9yaWVzID0gbmV3IE1hcDxTZXJ2aWNlRmFjdG9yeTxULCB1bmtub3duPiwgSWRlbnRpZmllcltdPigpO1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBpZGVudGlmaWVyIFRoZSB1bmlxdWUgaWRlbnRpZmllciBvZiB0aGlzIGZhY3Rvcmllc1xuICAgICAqIEBwYXJhbSBpc1NpbmdsZSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgaWRlbnRpZmllciBkZWZpbmVzIG9ubHkgb25lIGZhY3RvcnkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGlkZW50aWZpZXI6IElkZW50aWZpZXIsIHB1YmxpYyByZWFkb25seSBpc1NpbmdsZTogYm9vbGVhbikge31cbiAgICBhcHBlbmQoZmFjdG9yeTogU2VydmljZUZhY3Rvcnk8VCwgdW5rbm93bj4sIGluamVjdGlvbnM6IElkZW50aWZpZXJbXSA9IFtdKSB7XG4gICAgICAgIGlmICh0aGlzLmlzU2luZ2xlICYmIHRoaXMuZmFjdG9yaWVzLnNpemUgPT09IDEgJiYgIXRoaXMuZmFjdG9yaWVzLmhhcyhmYWN0b3J5KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMuaWRlbnRpZmllci50b1N0cmluZygpfSBpcyBBIHNpbmdsZXRvbiEgQnV0IG11bHRpcGxlIGZhY3RvcmllcyBhcmUgZGVmaW5lZCFgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZhY3Rvcmllcy5zZXQoZmFjdG9yeSwgaW5qZWN0aW9ucyk7XG4gICAgfVxuICAgIHByb2R1Y2UoY29udGFpbmVyOiBBcHBsaWNhdGlvbkNvbnRleHQsIG93bmVyPzogdW5rbm93bikge1xuICAgICAgICBpZiAodGhpcy5pc1NpbmdsZSkge1xuICAgICAgICAgICAgY29uc3QgW2ZhY3RvcnksIGluamVjdGlvbnNdID0gdGhpcy5mYWN0b3JpZXMuZW50cmllcygpLm5leHQoKS52YWx1ZSBhcyBbU2VydmljZUZhY3Rvcnk8VCwgdW5rbm93bj4sIElkZW50aWZpZXJbXV07XG4gICAgICAgICAgICBjb25zdCBmbiA9IGZhY3RvcnkoY29udGFpbmVyLCBvd25lcik7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXIuaW52b2tlKGZuLCB7XG4gICAgICAgICAgICAgICAgICAgIGluamVjdGlvbnNcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBwcm9kdWNlcnMgPSBBcnJheS5mcm9tKHRoaXMuZmFjdG9yaWVzKS5tYXAoKFtmYWN0b3J5LCBpbmplY3Rpb25zXSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZuID0gZmFjdG9yeShjb250YWluZXIsIG93bmVyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGFpbmVyLmludm9rZShmbiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5qZWN0aW9uc1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9kdWNlcnMubWFwKGl0ID0+IGl0KCkpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IFNlcnZpY2VGYWN0b3J5RGVmIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9TZXJ2aWNlRmFjdG9yeURlZic7XG5pbXBvcnQgeyBGYWN0b3J5SWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0ZhY3RvcnlJZGVudGlmaWVyJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IFNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi4vdHlwZXMvU2VydmljZUZhY3RvcnknO1xuXG5leHBvcnQgY2xhc3MgRmFjdG9yeVJlY29yZGVyIHtcbiAgICBwcml2YXRlIGZhY3RvcmllcyA9IG5ldyBNYXA8RmFjdG9yeUlkZW50aWZpZXIsIFNlcnZpY2VGYWN0b3J5RGVmPHVua25vd24+PigpO1xuXG4gICAgcHVibGljIGFwcGVuZDxUPihcbiAgICAgICAgaWRlbnRpZmllcjogRmFjdG9yeUlkZW50aWZpZXIsXG4gICAgICAgIGZhY3Rvcnk6IFNlcnZpY2VGYWN0b3J5PFQsIHVua25vd24+LFxuICAgICAgICBpbmplY3Rpb25zOiBJZGVudGlmaWVyW10gPSBbXSxcbiAgICAgICAgaXNTaW5nbGU6IGJvb2xlYW4gPSB0cnVlXG4gICAgKSB7XG4gICAgICAgIGxldCBkZWYgPSB0aGlzLmZhY3Rvcmllcy5nZXQoaWRlbnRpZmllcik7XG4gICAgICAgIGlmIChkZWYpIHtcbiAgICAgICAgICAgIGRlZi5hcHBlbmQoZmFjdG9yeSwgaW5qZWN0aW9ucyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWYgPSBuZXcgU2VydmljZUZhY3RvcnlEZWYoaWRlbnRpZmllciwgaXNTaW5nbGUpO1xuICAgICAgICAgICAgZGVmLmFwcGVuZChmYWN0b3J5LCBpbmplY3Rpb25zKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZhY3Rvcmllcy5zZXQoaWRlbnRpZmllciwgZGVmKTtcbiAgICB9XG4gICAgcHVibGljIHNldChpZGVudGlmaWVyOiBGYWN0b3J5SWRlbnRpZmllciwgZmFjdG9yeURlZjogU2VydmljZUZhY3RvcnlEZWY8dW5rbm93bj4pIHtcbiAgICAgICAgdGhpcy5mYWN0b3JpZXMuc2V0KGlkZW50aWZpZXIsIGZhY3RvcnlEZWYpO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0PFQ+KGlkZW50aWZpZXI6IEZhY3RvcnlJZGVudGlmaWVyKTogU2VydmljZUZhY3RvcnlEZWY8VD4gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5mYWN0b3JpZXMuZ2V0KGlkZW50aWZpZXIpIGFzIFNlcnZpY2VGYWN0b3J5RGVmPFQ+IHwgdW5kZWZpbmVkO1xuICAgIH1cbiAgICBwdWJsaWMgaXRlcmF0b3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZhY3Rvcmllcy5lbnRyaWVzKCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTWV0YWRhdGEgfSBmcm9tICcuLi90eXBlcy9NZXRhZGF0YSc7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4uL3R5cGVzL1NlcnZpY2VGYWN0b3J5JztcbmltcG9ydCB7IEZhY3RvcnlJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvRmFjdG9yeUlkZW50aWZpZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4vQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeURlZiB9IGZyb20gJy4uL2ZvdW5kYXRpb24vU2VydmljZUZhY3RvcnlEZWYnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL3R5cGVzL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcic7XG5pbXBvcnQgeyBGYWN0b3J5UmVjb3JkZXIgfSBmcm9tICcuLi9jb21tb24vRmFjdG9yeVJlY29yZGVyJztcblxuZXhwb3J0IGludGVyZmFjZSBHbG9iYWxNZXRhZGF0YVJlYWRlciB7XG4gICAgZ2V0Q29tcG9uZW50RmFjdG9yeTxUPihrZXk6IEZhY3RvcnlJZGVudGlmaWVyKTogU2VydmljZUZhY3RvcnlEZWY8VD4gfCB1bmRlZmluZWQ7XG4gICAgZ2V0Q2xhc3NNZXRhZGF0YTxUPihhbGlhc05hbWU6IHN0cmluZyB8IHN5bWJvbCk6IENsYXNzTWV0YWRhdGE8VD4gfCB1bmRlZmluZWQ7XG4gICAgZ2V0SW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcygpOiBBcnJheTxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+Pjtcbn1cbmV4cG9ydCBjbGFzcyBHbG9iYWxNZXRhZGF0YSBpbXBsZW1lbnRzIE1ldGFkYXRhPEdsb2JhbE1ldGFkYXRhUmVhZGVyLCB2b2lkPiB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgSU5TVEFOQ0UgPSBuZXcgR2xvYmFsTWV0YWRhdGEoKTtcbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgICAgIHJldHVybiBHbG9iYWxNZXRhZGF0YS5JTlNUQU5DRTtcbiAgICB9XG4gICAgc3RhdGljIGdldFJlYWRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoKS5yZWFkZXIoKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBjbGFzc0FsaWFzTWV0YWRhdGFNYXAgPSBuZXcgTWFwPHN0cmluZyB8IHN5bWJvbCwgQ2xhc3NNZXRhZGF0YTx1bmtub3duPj4oKTtcbiAgICBwcml2YXRlIGNvbXBvbmVudEZhY3RvcmllcyA9IG5ldyBGYWN0b3J5UmVjb3JkZXIoKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHByb2Nlc3NvckNsYXNzZXM6IFNldDxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+PiA9IG5ldyBTZXQoKTtcbiAgICByZWNvcmRGYWN0b3J5PFQ+KFxuICAgICAgICBzeW1ib2w6IEZhY3RvcnlJZGVudGlmaWVyLFxuICAgICAgICBmYWN0b3J5OiBTZXJ2aWNlRmFjdG9yeTxULCB1bmtub3duPixcbiAgICAgICAgaW5qZWN0aW9uczogSWRlbnRpZmllcltdID0gW10sXG4gICAgICAgIGlzU2luZ2xlOiBib29sZWFuID0gdHJ1ZVxuICAgICkge1xuICAgICAgICB0aGlzLmNvbXBvbmVudEZhY3Rvcmllcy5hcHBlbmQoc3ltYm9sLCBmYWN0b3J5LCBpbmplY3Rpb25zLCBpc1NpbmdsZSk7XG4gICAgfVxuICAgIHJlY29yZENsYXNzQWxpYXM8VD4oYWxpYXNOYW1lOiBzdHJpbmcgfCBzeW1ib2wsIG1ldGFkYXRhOiBDbGFzc01ldGFkYXRhPFQ+KSB7XG4gICAgICAgIHRoaXMuY2xhc3NBbGlhc01ldGFkYXRhTWFwLnNldChhbGlhc05hbWUsIG1ldGFkYXRhKTtcbiAgICB9XG4gICAgcmVjb3JkUHJvY2Vzc29yQ2xhc3MoY2xheno6IE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4pIHtcbiAgICAgICAgdGhpcy5wcm9jZXNzb3JDbGFzc2VzLmFkZChjbGF6eik7XG4gICAgfVxuICAgIGluaXQoKSB7XG4gICAgICAgIC8vIFBBU1M7XG4gICAgfVxuICAgIHJlYWRlcigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldENvbXBvbmVudEZhY3Rvcnk6IDxUPihrZXk6IEZhY3RvcnlJZGVudGlmaWVyKTogU2VydmljZUZhY3RvcnlEZWY8VD4gfCB1bmRlZmluZWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudEZhY3Rvcmllcy5nZXQoa2V5KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRDbGFzc01ldGFkYXRhOiA8VD4oYWxpYXNOYW1lOiBzdHJpbmcgfCBzeW1ib2wpOiBDbGFzc01ldGFkYXRhPFQ+IHwgdW5kZWZpbmVkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jbGFzc0FsaWFzTWV0YWRhdGFNYXAuZ2V0KGFsaWFzTmFtZSkgYXMgQ2xhc3NNZXRhZGF0YTxUPiB8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzOiAoKTogQXJyYXk8TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPj4gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMucHJvY2Vzc29yQ2xhc3Nlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiZXhwb3J0IGludGVyZmFjZSBFdmFsdWF0aW9uT3B0aW9uczxPLCBFIGV4dGVuZHMgc3RyaW5nLCBBID0gdW5rbm93bj4ge1xuICAgIHR5cGU6IEU7XG4gICAgb3duZXI/OiBPO1xuICAgIHByb3BlcnR5TmFtZT86IHN0cmluZyB8IHN5bWJvbDtcbiAgICBleHRlcm5hbEFyZ3M/OiBBO1xufVxuXG5leHBvcnQgZW51bSBFeHByZXNzaW9uVHlwZSB7XG4gICAgRU5WID0gJ2luamVjdC1lbnZpcm9ubWVudC12YXJpYWJsZXMnLFxuICAgIEpTT05fUEFUSCA9ICdpbmplY3QtanNvbi1kYXRhJyxcbiAgICBBUkdWID0gJ2luamVjdC1hcmd2J1xufVxuIiwiZXhwb3J0IGNvbnN0IGlzTm9kZUpzID0gKCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gcHJvY2Vzcy52ZXJzaW9ucy5ub2RlICE9PSBudWxsO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn0pKCk7XG4iLCJpbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0dsb2JhbE1ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuaW1wb3J0IHsgaXNOb2RlSnMgfSBmcm9tICcuLi9jb21tb24vaXNOb2RlSnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gVmFsdWU8QSA9IHVua25vd24+KGV4cHJlc3Npb246IHN0cmluZywgdHlwZTogRXhwcmVzc2lvblR5cGUgfCBzdHJpbmcsIGV4dGVybmFsQXJncz86IEEpOiBQcm9wZXJ0eURlY29yYXRvciB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgRXhwcmVzc2lvblR5cGUuRU5WOlxuICAgICAgICBjYXNlIEV4cHJlc3Npb25UeXBlLkFSR1Y6XG4gICAgICAgICAgICBpZiAoIWlzTm9kZUpzKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgXCIke3R5cGV9XCIgZXZhbHVhdG9yIG9ubHkgc3VwcG9ydHMgbm9kZWpzIGVudmlyb25tZW50IWApO1xuICAgICAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gKHRhcmdldDogT2JqZWN0LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sKSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGFyZ2V0LmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgY29uc3QgdmFsdWVfc3ltYm9sID0gU3ltYm9sKCcnKTtcbiAgICAgICAgbWV0YWRhdGEucmVjb3JkUHJvcGVydHlUeXBlKHByb3BlcnR5S2V5LCB2YWx1ZV9zeW1ib2wpO1xuICAgICAgICBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlY29yZEZhY3RvcnkodmFsdWVfc3ltYm9sLCAoY29udGFpbmVyLCBvd25lcikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICgpID0+XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmV2YWx1YXRlPHN0cmluZywgdHlwZW9mIG93bmVyLCBBPihleHByZXNzaW9uIGFzIHN0cmluZywge1xuICAgICAgICAgICAgICAgICAgICBvd25lcixcbiAgICAgICAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgZXh0ZXJuYWxBcmdzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBWYWx1ZSB9IGZyb20gJy4vVmFsdWUnO1xuaW1wb3J0IHsgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gQXJndihuYW1lOiBzdHJpbmcsIGFyZ3Y6IHN0cmluZ1tdID0gcHJvY2Vzcy5hcmd2KSB7XG4gICAgcmV0dXJuIFZhbHVlKG5hbWUsIEV4cHJlc3Npb25UeXBlLkFSR1YsIGFyZ3YpO1xufVxuIiwiaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9HbG9iYWxNZXRhZGF0YSc7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIEJpbmQoYWxpYXNOYW1lOiBzdHJpbmcgfCBzeW1ib2wpOiBDbGFzc0RlY29yYXRvciB7XG4gICAgcmV0dXJuIDxURnVuY3Rpb24gZXh0ZW5kcyBGdW5jdGlvbj4odGFyZ2V0OiBURnVuY3Rpb24pID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQgYXMgdW5rbm93biBhcyBOZXdhYmxlPHVua25vd24+LCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWNvcmRDbGFzc0FsaWFzKGFsaWFzTmFtZSwgbWV0YWRhdGEpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBWYWx1ZSB9IGZyb20gJy4vVmFsdWUnO1xuaW1wb3J0IHsgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gRW52KG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBWYWx1ZShuYW1lLCBFeHByZXNzaW9uVHlwZS5FTlYpO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGlzTnVsbCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIG51bGwge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQ7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNOb3REZWZpbmVkPFQ+KHZhbHVlOiBUIHwgdW5kZWZpbmVkIHwgbnVsbCk6IHZhbHVlIGlzIHVuZGVmaW5lZCB8IG51bGwge1xuICAgIHJldHVybiBpc051bGwodmFsdWUpIHx8IGlzVW5kZWZpbmVkKHZhbHVlKTtcbn1cbiIsImltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgRmFjdG9yeUlkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9GYWN0b3J5SWRlbnRpZmllcic7XG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlJztcbmltcG9ydCB7IGlzTm90RGVmaW5lZCB9IGZyb20gJy4uL2NvbW1vbi9pc05vdERlZmluZWQnO1xuXG5leHBvcnQgZnVuY3Rpb24gRmFjdG9yeShwcm9kdWNlSWRlbnRpZmllcj86IEZhY3RvcnlJZGVudGlmaWVyLCBpc1NpbmdsZTogYm9vbGVhbiA9IHRydWUpOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiAodGFyZ2V0OiBPYmplY3QsIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wpID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpO1xuICAgICAgICBjb25zdCBjbGF6eiA9IHRhcmdldC5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPEluc3RhbmNlPHVua25vd24+PjtcblxuICAgICAgICBpZiAoaXNOb3REZWZpbmVkKHByb2R1Y2VJZGVudGlmaWVyKSkge1xuICAgICAgICAgICAgcHJvZHVjZUlkZW50aWZpZXIgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdkZXNpZ246cmV0dXJudHlwZScsIHRhcmdldCwgcHJvcGVydHlLZXkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc05vdERlZmluZWQocHJvZHVjZUlkZW50aWZpZXIpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSByZXR1cm4gdHlwZSBub3QgcmVjb2duaXplZCwgY2Fubm90IHBlcmZvcm0gaW5zdGFuY2UgY3JlYXRpb24hJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaW5qZWN0aW9ucyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ2Rlc2lnbjpwYXJhbXR5cGVzJywgdGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG5cbiAgICAgICAgbWV0YWRhdGEucmVjb3JkRmFjdG9yeShcbiAgICAgICAgICAgIHByb2R1Y2VJZGVudGlmaWVyLFxuICAgICAgICAgICAgKGNvbnRhaW5lciwgb3duZXIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGNvbnRhaW5lci5nZXRJbnN0YW5jZShjbGF6eiwgb3duZXIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZ1bmMgPSBpbnN0YW5jZVtwcm9wZXJ0eUtleV07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmdW5jID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBjb250YWluZXIuZ2V0SW5zdGFuY2UoY2xhenopO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiBmdW5jO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmplY3Rpb25zLFxuICAgICAgICAgICAgaXNTaW5nbGVcbiAgICAgICAgKTtcbiAgICB9O1xufVxuIiwiaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhIH0gZnJvbSAnLi4vdHlwZXMvTWV0YWRhdGEnO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgSW5zdGFuY2VTY29wZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vSW5zdGFuY2VTY29wZSc7XG5cbmV4cG9ydCBjb25zdCBGVU5DVElPTl9NRVRBREFUQV9LRVkgPSBTeW1ib2woJ2lvYzpmdW5jdGlvbi1tZXRhZGF0YScpO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZ1bmN0aW9uTWV0YWRhdGFSZWFkZXIge1xuICAgIGdldFBhcmFtZXRlcnMoKTogSWRlbnRpZmllcltdO1xuICAgIGlzRmFjdG9yeSgpOiBib29sZWFuO1xuICAgIGdldFNjb3BlKCk6IEluc3RhbmNlU2NvcGUgfCB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBGdW5jdGlvbk1ldGFkYXRhIGltcGxlbWVudHMgTWV0YWRhdGE8RnVuY3Rpb25NZXRhZGF0YVJlYWRlciwgRnVuY3Rpb24+IHtcbiAgICBzdGF0aWMgZ2V0UmVmbGVjdEtleSgpIHtcbiAgICAgICAgcmV0dXJuIEZVTkNUSU9OX01FVEFEQVRBX0tFWTtcbiAgICB9XG4gICAgcHJpdmF0ZSByZWFkb25seSBwYXJhbWV0ZXJzOiBJZGVudGlmaWVyW10gPSBbXTtcbiAgICBwcml2YXRlIHNjb3BlPzogSW5zdGFuY2VTY29wZTtcbiAgICBwcml2YXRlIGlzRmFjdG9yeTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHNldFBhcmFtZXRlclR5cGUoaW5kZXg6IG51bWJlciwgc3ltYm9sOiBJZGVudGlmaWVyKSB7XG4gICAgICAgIHRoaXMucGFyYW1ldGVyc1tpbmRleF0gPSBzeW1ib2w7XG4gICAgfVxuICAgIHNldFNjb3BlKHNjb3BlOiBJbnN0YW5jZVNjb3BlKSB7XG4gICAgICAgIHRoaXMuc2NvcGUgPSBzY29wZTtcbiAgICB9XG4gICAgc2V0SXNGYWN0b3J5KGlzRmFjdG9yeTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLmlzRmFjdG9yeSA9IGlzRmFjdG9yeTtcbiAgICB9XG4gICAgaW5pdCgpIHtcbiAgICAgICAgLy8gUEFTUztcbiAgICB9XG4gICAgcmVhZGVyKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0UGFyYW1ldGVyczogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmFtZXRlcnMuc2xpY2UoMCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaXNGYWN0b3J5OiAoKSA9PiB0aGlzLmlzRmFjdG9yeSxcbiAgICAgICAgICAgIGdldFNjb3BlOiAoKSA9PiB0aGlzLnNjb3BlXG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbic7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhLCBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gR2VuZXJhdGU8Vj4oZ2VuZXJhdG9yOiA8VD4odGhpczogVCwgYXBwQ3R4OiBBcHBsaWNhdGlvbkNvbnRleHQpID0+IFYpOiBQcm9wZXJ0eURlY29yYXRvciB7XG4gICAgcmV0dXJuICh0YXJnZXQ6IE9iamVjdCwgcHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCkgPT4ge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldC5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgIGNvbnN0IHZhbHVlX3N5bWJvbCA9IFN5bWJvbCgnJyk7XG4gICAgICAgIG1ldGFkYXRhLnJlY29yZFByb3BlcnR5VHlwZShwcm9wZXJ0eUtleSwgdmFsdWVfc3ltYm9sKTtcbiAgICAgICAgR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWNvcmRGYWN0b3J5KHZhbHVlX3N5bWJvbCwgKGNvbnRhaW5lciwgb3duZXIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiBnZW5lcmF0b3IuY2FsbChvd25lciwgY29udGFpbmVyKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgaXNOb3REZWZpbmVkIH0gZnJvbSAnLi4vY29tbW9uL2lzTm90RGVmaW5lZCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBJbmplY3Q8VD4oY29uc3RyPzogSWRlbnRpZmllcjxUPikge1xuICAgIHJldHVybiBmdW5jdGlvbiA8VGFyZ2V0Pih0YXJnZXQ6IFRhcmdldCwgcHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCwgcGFyYW1ldGVySW5kZXg/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHBhcmFtZXRlckluZGV4ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgLy8gY29uc3RydWN0b3IgcGFyYW1ldGVyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRDb25zdHIgPSB0YXJnZXQgYXMgTmV3YWJsZTxUPjtcbiAgICAgICAgICAgIGlmIChpc05vdERlZmluZWQoY29uc3RyKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0ciA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ2Rlc2lnbjpwYXJhbXR5cGVzJywgdGFyZ2V0LCBwcm9wZXJ0eUtleSlbcGFyYW1ldGVySW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzTm90RGVmaW5lZChjb25zdHIpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUeXBlIG5vdCByZWNvZ25pemVkLCBpbmplY3Rpb24gY2Fubm90IGJlIHBlcmZvcm1lZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY2xhc3NNZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldENvbnN0ciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBjbGFzc01ldGFkYXRhLnNldENvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZShwYXJhbWV0ZXJJbmRleCwgY29uc3RyKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnb2JqZWN0JyAmJiB0YXJnZXQgIT09IG51bGwgJiYgcHJvcGVydHlLZXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gcHJvcGVydHlcbiAgICAgICAgICAgIGlmIChpc05vdERlZmluZWQoY29uc3RyKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0ciA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ2Rlc2lnbjp0eXBlJywgdGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNOb3REZWZpbmVkKGNvbnN0cikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1R5cGUgbm90IHJlY29nbml6ZWQsIGluamVjdGlvbiBjYW5ub3QgYmUgcGVyZm9ybWVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldC5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBtZXRhZGF0YS5yZWNvcmRQcm9wZXJ0eVR5cGUocHJvcGVydHlLZXksIGNvbnN0cik7XG4gICAgICAgIH1cbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YSc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgSW5zdGFuY2UgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW5qZWN0YWJsZU9wdGlvbnMge1xuICAgIHByb2R1Y2U6IHN0cmluZyB8IHN5bWJvbCB8IEFycmF5PHN0cmluZyB8IHN5bWJvbD47XG59XG5cbi8qKlxuICogVGhpcyBkZWNvcmF0b3IgaXMgdHlwaWNhbGx5IHVzZWQgdG8gaWRlbnRpZnkgY2xhc3NlcyB0aGF0IG5lZWQgdG8gYmUgY29uZmlndXJlZCB3aXRoaW4gdGhlIElvQyBjb250YWluZXIuXG4gKiBJbiBtb3N0IGNhc2VzLCBASW5qZWN0YWJsZSBjYW4gYmUgb21pdHRlZCB1bmxlc3MgZXhwbGljaXQgY29uZmlndXJhdGlvbiBpcyByZXF1aXJlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEluamVjdGFibGUob3B0aW9ucz86IEluamVjdGFibGVPcHRpb25zKTogQ2xhc3NEZWNvcmF0b3Ige1xuICAgIHJldHVybiA8VEZ1bmN0aW9uIGV4dGVuZHMgRnVuY3Rpb24+KHRhcmdldDogVEZ1bmN0aW9uKTogVEZ1bmN0aW9uIHwgdm9pZCA9PiB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucz8ucHJvZHVjZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpO1xuICAgICAgICBjb25zdCBwcm9kdWNlcyA9IEFycmF5LmlzQXJyYXkob3B0aW9ucy5wcm9kdWNlKSA/IG9wdGlvbnMucHJvZHVjZSA6IFtvcHRpb25zLnByb2R1Y2VdO1xuICAgICAgICBwcm9kdWNlcy5mb3JFYWNoKHByb2R1Y2UgPT4ge1xuICAgICAgICAgICAgbWV0YWRhdGEucmVjb3JkRmFjdG9yeShcbiAgICAgICAgICAgICAgICBwcm9kdWNlLFxuICAgICAgICAgICAgICAgIChjb250YWluZXIsIG93bmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGNvbnRhaW5lci5nZXRJbnN0YW5jZSh0YXJnZXQgYXMgdW5rbm93biBhcyBOZXdhYmxlPEluc3RhbmNlPHVua25vd24+Piwgb3duZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgW10sXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yJztcbmltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuXG5leHBvcnQgZnVuY3Rpb24gSW5zdEF3YXJlUHJvY2Vzc29yKCkge1xuICAgIHJldHVybiBmdW5jdGlvbiA8Q2xzIGV4dGVuZHMgTmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPj4odGFyZ2V0OiBDbHMpIHtcbiAgICAgICAgR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWNvcmRQcm9jZXNzb3JDbGFzcyh0YXJnZXQpO1xuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBWYWx1ZSB9IGZyb20gJy4vVmFsdWUnO1xuaW1wb3J0IHsgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gSlNPTkRhdGEobmFtZXNwYWNlOiBzdHJpbmcsIGpzb25wYXRoOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gVmFsdWUoYCR7bmFtZXNwYWNlfToke2pzb25wYXRofWAsIEV4cHJlc3Npb25UeXBlLkpTT05fUEFUSCk7XG59XG4iLCJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9MaWZlY3ljbGUnO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5cbi8qKlxuICogVXJuIGNhbGxzIHRoZSBtZXRob2RzIGFubm90YXRlZCB3aXRoIEBQb3N0SW5qZWN0IG9ubHkgb25jZSwganVzdCBhZnRlciB0aGUgaW5qZWN0aW9uIG9mIHByb3BlcnRpZXMuXG4gKiBAYW5ub3RhdGlvblxuICovXG5leHBvcnQgY29uc3QgTGlmZWN5Y2xlRGVjb3JhdG9yID0gKGxpZmVjeWNsZTogTGlmZWN5Y2xlKTogTWV0aG9kRGVjb3JhdG9yID0+IHtcbiAgICByZXR1cm4gKHRhcmdldDogT2JqZWN0LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sKSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGFyZ2V0LmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgbWV0YWRhdGEuYWRkTGlmZWN5Y2xlTWV0aG9kKHByb3BlcnR5S2V5LCBsaWZlY3ljbGUpO1xuICAgIH07XG59O1xuIiwiaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuXG5leHBvcnQgZnVuY3Rpb24gTWFyayhrZXk6IHN0cmluZyB8IHN5bWJvbCwgdmFsdWU6IHVua25vd24gPSB0cnVlKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiBmdW5jdGlvbiAoXG4gICAgICAgIC4uLmFyZ3M6XG4gICAgICAgICAgICB8IFBhcmFtZXRlcnM8Q2xhc3NEZWNvcmF0b3I+XG4gICAgICAgICAgICB8IFBhcmFtZXRlcnM8TWV0aG9kRGVjb3JhdG9yPlxuICAgICAgICAgICAgfCBQYXJhbWV0ZXJzPFByb3BlcnR5RGVjb3JhdG9yPlxuICAgICAgICAgICAgfCBQYXJhbWV0ZXJzPFBhcmFtZXRlckRlY29yYXRvcj5cbiAgICApIHtcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAvLyBjbGFzcyBkZWNvcmF0b3JcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoYXJnc1swXSwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBtZXRhZGF0YS5tYXJrZXIoKS5jdG9yKGtleSwgdmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZ3MubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAvLyBwcm9wZXJ0eSBkZWNvcmF0b3JcbiAgICAgICAgICAgIGNvbnN0IFtwcm90b3R5cGUsIHByb3BlcnR5S2V5XSA9IGFyZ3M7XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHByb3RvdHlwZS5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBtZXRhZGF0YS5tYXJrZXIoKS5tZW1iZXIocHJvcGVydHlLZXkpLm1hcmsoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJncy5sZW5ndGggPT09IDMgJiYgdHlwZW9mIGFyZ3NbMl0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAvLyBwYXJhbWV0ZXIgZGVjb3JhdG9yXG4gICAgICAgICAgICBjb25zdCBbcHJvdG90eXBlLCBwcm9wZXJ0eUtleSwgaW5kZXhdID0gYXJncyBhcyBbT2JqZWN0LCBzdHJpbmcgfCBzeW1ib2wsIG51bWJlcl07XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHByb3RvdHlwZS5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBtZXRhZGF0YS5tYXJrZXIoKS5wYXJhbWV0ZXIocHJvcGVydHlLZXksIGluZGV4KS5tYXJrKGtleSwgdmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gbWV0aG9kIGRlY29yYXRvclxuICAgICAgICAgICAgY29uc3QgW3Byb3RvdHlwZSwgcHJvcGVydHlLZXldID0gYXJncyBhcyBQYXJhbWV0ZXJzPE1ldGhvZERlY29yYXRvcj47XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHByb3RvdHlwZS5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBtZXRhZGF0YS5tYXJrZXIoKS5tZW1iZXIocHJvcGVydHlLZXkpLm1hcmsoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuIiwiZXhwb3J0IGVudW0gTGlmZWN5Y2xlIHtcbiAgICBQUkVfSU5KRUNUID0gJ2lvYy1zY29wZTpwcmUtaW5qZWN0JyxcbiAgICBQT1NUX0lOSkVDVCA9ICdpb2Mtc2NvcGU6cG9zdC1pbmplY3QnLFxuICAgIFBSRV9ERVNUUk9ZID0gJ2lvYy1zY29wZTpwcmUtZGVzdHJveSdcbn1cbiIsImltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBMaWZlY3ljbGVEZWNvcmF0b3IgfSBmcm9tICcuL0xpZmVjeWNsZURlY29yYXRvcic7XG5cbi8qKlxuICogVXJuIGNhbGxzIHRoZSBtZXRob2RzIGFubm90YXRlZCB3aXRoIEBQb3N0SW5qZWN0IG9ubHkgb25jZSwganVzdCBhZnRlciB0aGUgaW5qZWN0aW9uIG9mIHByb3BlcnRpZXMuXG4gKiBAYW5ub3RhdGlvblxuICovXG5leHBvcnQgY29uc3QgUG9zdEluamVjdCA9ICgpOiBNZXRob2REZWNvcmF0b3IgPT4gTGlmZWN5Y2xlRGVjb3JhdG9yKExpZmVjeWNsZS5QT1NUX0lOSkVDVCk7XG4iLCJpbXBvcnQgeyBMaWZlY3ljbGVEZWNvcmF0b3IgfSBmcm9tICcuL0xpZmVjeWNsZURlY29yYXRvcic7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5cbmV4cG9ydCBjb25zdCBQcmVEZXN0cm95ID0gKCkgPT4gTGlmZWN5Y2xlRGVjb3JhdG9yKExpZmVjeWNsZS5QUkVfREVTVFJPWSk7XG4iLCJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9MaWZlY3ljbGUnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlRGVjb3JhdG9yIH0gZnJvbSAnLi9MaWZlY3ljbGVEZWNvcmF0b3InO1xuXG4vKipcbiAqIFVybiBjYWxscyB0aGUgbWV0aG9kcyBhbm5vdGF0ZWQgd2l0aCBAUG9zdEluamVjdCBvbmx5IG9uY2UsIGp1c3QgYWZ0ZXIgdGhlIGluamVjdGlvbiBvZiBwcm9wZXJ0aWVzLlxuICogQGFubm90YXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IFByZUluamVjdCA9ICgpOiBNZXRob2REZWNvcmF0b3IgPT4gTGlmZWN5Y2xlRGVjb3JhdG9yKExpZmVjeWNsZS5QUkVfSU5KRUNUKTtcbiIsImltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luc3RhbmNlU2NvcGUnO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBTY29wZShzY29wZTogSW5zdGFuY2VTY29wZSB8IHN0cmluZyk6IENsYXNzRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gPFRGdW5jdGlvbiBleHRlbmRzIEZ1bmN0aW9uPih0YXJnZXQ6IFRGdW5jdGlvbikgPT4ge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldCBhcyB1bmtub3duIGFzIE5ld2FibGU8dW5rbm93bj4sIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBtZXRhZGF0YS5zZXRTY29wZShzY29wZSk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IEFueUZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMvQW55RnVuY3Rpb24nO1xuXG5leHBvcnQgdHlwZSBFdmVudExpc3RlbmVyID0gQW55RnVuY3Rpb247XG5leHBvcnQgY2xhc3MgRXZlbnRFbWl0dGVyIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGV2ZW50cyA9IG5ldyBNYXA8c3RyaW5nIHwgc3ltYm9sLCBFdmVudExpc3RlbmVyW10+KCk7XG5cbiAgICBvbih0eXBlOiBzdHJpbmcgfCBzeW1ib2wsIGxpc3RlbmVyOiBFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLmV2ZW50cy5nZXQodHlwZSk7XG4gICAgICAgIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcikgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMgPSBbbGlzdGVuZXJdO1xuICAgICAgICAgICAgdGhpcy5ldmVudHMuc2V0KHR5cGUsIGxpc3RlbmVycyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxzID0gbGlzdGVuZXJzIGFzIEV2ZW50TGlzdGVuZXJbXTtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gbHMuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIGxzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIGVtaXQodHlwZTogc3RyaW5nIHwgc3ltYm9sLCAuLi5hcmdzOiB1bmtub3duW10pIHtcbiAgICAgICAgdGhpcy5ldmVudHMuZ2V0KHR5cGUpPy5mb3JFYWNoKGZuID0+IHtcbiAgICAgICAgICAgIGZuKC4uLmFyZ3MpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5cbnR5cGUgSW52b2tlRnVuY3Rpb25BcmdzID0ge1xuICAgIGFyZ3M/OiB1bmtub3duW107XG59O1xudHlwZSBJbnZva2VGdW5jdGlvbkluamVjdGlvbnMgPSB7XG4gICAgaW5qZWN0aW9uczogSWRlbnRpZmllcltdO1xufTtcblxudHlwZSBJbnZva2VGdW5jdGlvbkJhc2ljT3B0aW9uczxUPiA9IHtcbiAgICBjb250ZXh0PzogVDtcbn07XG5cbmV4cG9ydCB0eXBlIEludm9rZUZ1bmN0aW9uT3B0aW9uczxUPiA9XG4gICAgfCAoSW52b2tlRnVuY3Rpb25CYXNpY09wdGlvbnM8VD4gJiBJbnZva2VGdW5jdGlvbkFyZ3MpXG4gICAgfCAoSW52b2tlRnVuY3Rpb25CYXNpY09wdGlvbnM8VD4gJiBQYXJ0aWFsPEludm9rZUZ1bmN0aW9uSW5qZWN0aW9ucz4pO1xuXG5leHBvcnQgZnVuY3Rpb24gaGFzQXJnczxUPihvcHRpb25zOiBJbnZva2VGdW5jdGlvbk9wdGlvbnM8VD4pOiBvcHRpb25zIGlzIEludm9rZUZ1bmN0aW9uQmFzaWNPcHRpb25zPFQ+ICYgSW52b2tlRnVuY3Rpb25BcmdzIHtcbiAgICByZXR1cm4gJ2FyZ3MnIGluIG9wdGlvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNJbmplY3Rpb25zPFQ+KFxuICAgIG9wdGlvbnM6IEludm9rZUZ1bmN0aW9uT3B0aW9uczxUPlxuKTogb3B0aW9ucyBpcyBJbnZva2VGdW5jdGlvbkJhc2ljT3B0aW9uczxUPiAmIEludm9rZUZ1bmN0aW9uSW5qZWN0aW9ucyB7XG4gICAgcmV0dXJuICdpbmplY3Rpb25zJyBpbiBvcHRpb25zO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7XG4vKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxuXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbnZhciBlPWZ1bmN0aW9uKCl7cmV0dXJuIGU9T2JqZWN0LmFzc2lnbnx8ZnVuY3Rpb24oZSl7Zm9yKHZhciB0LHI9MSxuPWFyZ3VtZW50cy5sZW5ndGg7cjxuO3IrKylmb3IodmFyIG8gaW4gdD1hcmd1bWVudHNbcl0pT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykmJihlW29dPXRbb10pO3JldHVybiBlfSxlLmFwcGx5KHRoaXMsYXJndW1lbnRzKX07ZnVuY3Rpb24gdCgpe312YXIgcj17fSxuPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlKXt0aGlzLmV2YWx1YXRlUmVzdWx0PXIsdGhpcy5jb250ZXh0PWUudGFyZ2V0LHRoaXMuY29tcHV0ZUZuPWUuZXZhbHVhdGUsdGhpcy5yZXNldFRlc3Rlcj1lLnJlc2V0VGVzdGVyc31yZXR1cm4gZS5wcm90b3R5cGUucmVsZWFzZT1mdW5jdGlvbigpe3RoaXMucmVzZXQodCl9LGUucHJvdG90eXBlLnJlc2V0PWZ1bmN0aW9uKGUpe3RoaXMuZXZhbHVhdGVSZXN1bHQ9cix0aGlzLmNvbXB1dGVGbj1lfHx0aGlzLmNvbXB1dGVGbn0sZS5wcm90b3R5cGUuZXZhbHVhdGU9ZnVuY3Rpb24oKXt0aGlzLmlzUHJlc2VudCgpJiYhdGhpcy5uZWVkUmVzZXQoKXx8KHRoaXMuZXZhbHVhdGVSZXN1bHQ9dGhpcy5jb21wdXRlRm4uY2FsbCh0aGlzLmNvbnRleHQsdGhpcy5jb250ZXh0KSl9LGUucHJvdG90eXBlLmdldD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmV2YWx1YXRlKCksdGhpcy5ldmFsdWF0ZVJlc3VsdH0sZS5wcm90b3R5cGUuaXNQcmVzZW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZXZhbHVhdGVSZXN1bHQhPT1yfSxlLnByb3RvdHlwZS5uZWVkUmVzZXQ9ZnVuY3Rpb24oKXt2YXIgZT10aGlzO3JldHVybiB0aGlzLnJlc2V0VGVzdGVyLnNvbWUoKGZ1bmN0aW9uKHQpe3JldHVybiB0KGUuY29udGV4dCl9KSl9LGV9KCk7ZnVuY3Rpb24gbyh0LHIsbyl7dmFyIHU7dT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBvP3tldmFsdWF0ZTpvfTplKHt9LG8pO3ZhciBhPU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxyKTtpZihhJiYhYS5jb25maWd1cmFibGUpdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IG92ZXJyaWRlIG92ZXJyaWRlIHByb3BlcnR5OiBcIitTdHJpbmcocikpO3ZhciBpPVwiYm9vbGVhblwiPT10eXBlb2YgdS5lbnVtZXJhYmxlP3UuZW51bWVyYWJsZToobnVsbD09YT92b2lkIDA6YS5lbnVtZXJhYmxlKXx8ITAscz11LnJlc2V0Qnl8fFtdLGw9ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24oZSx0LHIsbyl7ZS5fX2xhenlfX3x8T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2xhenlfX1wiLHt2YWx1ZTp7fSxlbnVtZXJhYmxlOiExLHdyaXRhYmxlOiExLGNvbmZpZ3VyYWJsZTohMX0pO3ZhciB1PWUuX19sYXp5X187aWYoIXVbdF0pe3ZhciBhPW8ubWFwKChmdW5jdGlvbihlKXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgZXx8XCJudW1iZXJcIj09dHlwZW9mIGV8fFwic3ltYm9sXCI9PXR5cGVvZiBlP2Z1bmN0aW9uKGUpe3ZhciB0O3JldHVybiBmdW5jdGlvbihyKXt2YXIgbj1yW2VdLG89biE9PXQ7cmV0dXJuIHQ9bixvfX0oZSk6KHQ9ZSxmdW5jdGlvbihlKXt2YXIgbj10KGUpLG89biE9PXI7cmV0dXJuIHI9bixvfSk7dmFyIHQscn0pKTt1W3RdPW5ldyBuKHt0YXJnZXQ6ZSxldmFsdWF0ZTpyLHJlc2V0VGVzdGVyczphfSl9cmV0dXJuIHVbdF19KHRoaXMscix1LmV2YWx1YXRlLHMpfTtyZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHQscix7Y29uZmlndXJhYmxlOiEwLGVudW1lcmFibGU6aSxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbC5jYWxsKHRoaXMpLmdldCgpfX0pLGx9ZnVuY3Rpb24gdShlLHQscil7cmV0dXJuIG8oZSx0LHIpLmNhbGwoZSl9ZXhwb3J0cy5sYXp5TWVtYmVyPWZ1bmN0aW9uKGUpe3JldHVybiBmdW5jdGlvbih0LHIpe28odCxyLGUpfX0sZXhwb3J0cy5sYXp5TWVtYmVyT2ZDbGFzcz1mdW5jdGlvbihlLHQscil7byhlLnByb3RvdHlwZSx0LHIpfSxleHBvcnRzLmxhenlQcm9wPXUsZXhwb3J0cy5sYXp5VmFsPWZ1bmN0aW9uKGUpe3JldHVybiB1KHtfX3ZhbF9fOm51bGx9LFwiX192YWxfX1wiLGUpfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmNqcy5qcy5tYXBcbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEsIENsYXNzTWV0YWRhdGFSZWFkZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgTGlmZWN5Y2xlIH0gZnJvbSAnLi9MaWZlY3ljbGUnO1xuaW1wb3J0IHsgSW5zdGFuY2UgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZSc7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5cbmV4cG9ydCBjbGFzcyBMaWZlY3ljbGVNYW5hZ2VyPFQgPSB1bmtub3duPiB7XG4gICAgcHJpdmF0ZSBjbGFzc01ldGFkYXRhUmVhZGVyOiBDbGFzc01ldGFkYXRhUmVhZGVyPFQ+O1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY29tcG9uZW50Q2xhc3M6IE5ld2FibGU8VD4sIHByaXZhdGUgcmVhZG9ubHkgY29udGFpbmVyOiBBcHBsaWNhdGlvbkNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5jbGFzc01ldGFkYXRhUmVhZGVyID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGhpcy5jb21wb25lbnRDbGFzcywgQ2xhc3NNZXRhZGF0YSkucmVhZGVyKCk7XG4gICAgfVxuICAgIGludm9rZVByZUluamVjdE1ldGhvZChpbnN0YW5jZTogSW5zdGFuY2U8VD4pIHtcbiAgICAgICAgY29uc3QgbWV0aG9kcyA9IHRoaXMuY2xhc3NNZXRhZGF0YVJlYWRlci5nZXRNZXRob2RzKExpZmVjeWNsZS5QUkVfSU5KRUNUKTtcbiAgICAgICAgdGhpcy5pbnZva2VMaWZlY3ljbGVNZXRob2RzKGluc3RhbmNlLCBtZXRob2RzKTtcbiAgICB9XG4gICAgaW52b2tlUG9zdEluamVjdE1ldGhvZChpbnN0YW5jZTogSW5zdGFuY2U8VD4pIHtcbiAgICAgICAgY29uc3QgbWV0aG9kcyA9IHRoaXMuY2xhc3NNZXRhZGF0YVJlYWRlci5nZXRNZXRob2RzKExpZmVjeWNsZS5QT1NUX0lOSkVDVCk7XG4gICAgICAgIHRoaXMuaW52b2tlTGlmZWN5Y2xlTWV0aG9kcyhpbnN0YW5jZSwgbWV0aG9kcyk7XG4gICAgfVxuICAgIGludm9rZVByZURlc3Ryb3lJbmplY3RNZXRob2QoaW5zdGFuY2U6IEluc3RhbmNlPFQ+KSB7XG4gICAgICAgIGNvbnN0IG1ldGhvZHMgPSB0aGlzLmNsYXNzTWV0YWRhdGFSZWFkZXIuZ2V0TWV0aG9kcyhMaWZlY3ljbGUuUFJFX0RFU1RST1kpO1xuICAgICAgICB0aGlzLmludm9rZUxpZmVjeWNsZU1ldGhvZHMoaW5zdGFuY2UsIG1ldGhvZHMpO1xuICAgIH1cbiAgICBwcml2YXRlIGludm9rZUxpZmVjeWNsZU1ldGhvZHMoaW5zdGFuY2U6IEluc3RhbmNlPFQ+LCBtZXRob2RLZXlzOiBBcnJheTxzdHJpbmcgfCBzeW1ib2w+KSB7XG4gICAgICAgIG1ldGhvZEtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW52b2tlKGluc3RhbmNlW2tleV0sIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0OiBpbnN0YW5jZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEsIENsYXNzTWV0YWRhdGFSZWFkZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4vQXBwbGljYXRpb25Db250ZXh0JztcbmltcG9ydCB7IEluc3RhbmNlIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2UnO1xuaW1wb3J0IHsgU2VydmljZUZhY3RvcnlEZWYgfSBmcm9tICcuL1NlcnZpY2VGYWN0b3J5RGVmJztcbmltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuaW1wb3J0IHsgbGF6eVByb3AgfSBmcm9tICdAdmdlcmJvdC9sYXp5JztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlciB9IGZyb20gJy4vSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlcic7XG5pbXBvcnQgeyBMaWZlY3ljbGVNYW5hZ2VyIH0gZnJvbSAnLi9MaWZlY3ljbGVNYW5hZ2VyJztcbmltcG9ydCB7IEZhY3RvcnlSZWNvcmRlciB9IGZyb20gJy4uL2NvbW1vbi9GYWN0b3J5UmVjb3JkZXInO1xuaW1wb3J0IHsgQW55RnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcy9BbnlGdW5jdGlvbic7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4uL3R5cGVzL1NlcnZpY2VGYWN0b3J5JztcblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudEluc3RhbmNlQnVpbGRlcjxUPiB7XG4gICAgcHJpdmF0ZSBnZXRDb25zdHJ1Y3RvckFyZ3M6ICgpID0+IHVua25vd25bXSA9ICgpID0+IFtdO1xuICAgIHByaXZhdGUgcHJvcGVydHlGYWN0b3JpZXMgPSBuZXcgRmFjdG9yeVJlY29yZGVyKCk7XG4gICAgcHJpdmF0ZSBsYXp5TW9kZTogYm9vbGVhbiA9IHRydWU7XG4gICAgcHJpdmF0ZSBsaWZlY3ljbGVSZXNvbHZlcjogTGlmZWN5Y2xlTWFuYWdlcjxUPjtcbiAgICBwcml2YXRlIGNsYXNzTWV0YWRhdGFSZWFkZXI6IENsYXNzTWV0YWRhdGFSZWFkZXI8VD47XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY29tcG9uZW50Q2xhc3M6IE5ld2FibGU8VD4sXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY29udGFpbmVyOiBBcHBsaWNhdGlvbkNvbnRleHQsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlcjogSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlclxuICAgICkge1xuICAgICAgICB0aGlzLmxpZmVjeWNsZVJlc29sdmVyID0gbmV3IExpZmVjeWNsZU1hbmFnZXI8VD4oY29tcG9uZW50Q2xhc3MsIGNvbnRhaW5lcik7XG4gICAgICAgIGNvbnN0IHJlYWRlciA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGNvbXBvbmVudENsYXNzLCBDbGFzc01ldGFkYXRhKS5yZWFkZXIoKTtcbiAgICAgICAgdGhpcy5jbGFzc01ldGFkYXRhUmVhZGVyID0gcmVhZGVyO1xuICAgICAgICB0aGlzLmFwcGVuZENsYXNzTWV0YWRhdGEocmVhZGVyKTtcbiAgICB9XG4gICAgYXBwZW5kTGF6eU1vZGUobGF6eU1vZGU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5sYXp5TW9kZSA9IGxhenlNb2RlO1xuICAgIH1cbiAgICBwcml2YXRlIGFwcGVuZENsYXNzTWV0YWRhdGE8VD4oY2xhc3NNZXRhZGF0YVJlYWRlcjogQ2xhc3NNZXRhZGF0YVJlYWRlcjxUPikge1xuICAgICAgICBjb25zdCB0eXBlcyA9IGNsYXNzTWV0YWRhdGFSZWFkZXIuZ2V0Q29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlcygpO1xuICAgICAgICB0aGlzLmdldENvbnN0cnVjdG9yQXJncyA9ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlcy5tYXAoaXQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRhaW5lci5nZXRJbnN0YW5jZShpdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZ2xvYmFsTWV0YWRhdGFSZWFkZXIgPSBHbG9iYWxNZXRhZGF0YS5nZXRSZWFkZXIoKTtcbiAgICAgICAgY29uc3QgcHJvcGVydHlUeXBlcyA9IGNsYXNzTWV0YWRhdGFSZWFkZXIuZ2V0UHJvcGVydHlUeXBlTWFwKCk7XG4gICAgICAgIGZvciAoY29uc3QgW3Byb3BlcnR5TmFtZSwgcHJvcGVydHlUeXBlXSBvZiBwcm9wZXJ0eVR5cGVzKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHByb3BlcnR5VHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydHlGYWN0b3JpZXMuYXBwZW5kKHByb3BlcnR5TmFtZSwgKGNvbnRhaW5lciwgb3duZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IGNvbnRhaW5lci5nZXRJbnN0YW5jZShwcm9wZXJ0eVR5cGUsIG93bmVyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGZhY3RvcnlEZWYgPSB0aGlzLmNvbnRhaW5lci5nZXRGYWN0b3J5KHByb3BlcnR5VHlwZSk7XG4gICAgICAgICAgICBpZiAoZmFjdG9yeURlZikge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydHlGYWN0b3JpZXMuc2V0KHByb3BlcnR5TmFtZSwgZmFjdG9yeURlZik7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwcm9wZXJ0eUNsYXNzTWV0YWRhdGEgPSBnbG9iYWxNZXRhZGF0YVJlYWRlci5nZXRDbGFzc01ldGFkYXRhKHByb3BlcnR5VHlwZSk7XG4gICAgICAgICAgICBpZiAocHJvcGVydHlDbGFzc01ldGFkYXRhKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eUZhY3Rvcmllcy5zZXQocHJvcGVydHlOYW1lLCBTZXJ2aWNlRmFjdG9yeURlZi5jcmVhdGVGcm9tQ2xhc3NNZXRhZGF0YShwcm9wZXJ0eUNsYXNzTWV0YWRhdGEpKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHByb3BlcnR5RmFjdG9yeURlZiA9IGdsb2JhbE1ldGFkYXRhUmVhZGVyLmdldENvbXBvbmVudEZhY3RvcnkocHJvcGVydHlUeXBlKTtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eUZhY3RvcnlEZWYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5RmFjdG9yaWVzLnNldChwcm9wZXJ0eU5hbWUsIHByb3BlcnR5RmFjdG9yeURlZik7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgYnVpbGQoKSB7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmdldENvbnN0cnVjdG9yQXJncygpO1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gdGhpcy5jcmVhdGVQcm9wZXJ0aWVzR2V0dGVyQnVpbGRlcigpO1xuICAgICAgICBjb25zdCBpc0NyZWF0aW5nSW5zdEF3YXJlUHJvY2Vzc29yID0gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyLmlzSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3ModGhpcy5jb21wb25lbnRDbGFzcyk7XG4gICAgICAgIGlmIChpc0NyZWF0aW5nSW5zdEF3YXJlUHJvY2Vzc29yKSB7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyB0aGlzLmNvbXBvbmVudENsYXNzKC4uLmFyZ3MpIGFzIEluc3RhbmNlPFQ+O1xuICAgICAgICAgICAgdGhpcy5saWZlY3ljbGVSZXNvbHZlci5pbnZva2VQcmVJbmplY3RNZXRob2QoaW5zdGFuY2UpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdldHRlciA9IHByb3BlcnRpZXNba2V5XShpbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWZpbmVQcm9wZXJ0eShpbnN0YW5jZSwga2V5LCBnZXR0ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5saWZlY3ljbGVSZXNvbHZlci5pbnZva2VQb3N0SW5qZWN0TWV0aG9kKGluc3RhbmNlKTtcbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBpbnN0YW5jZTogdW5kZWZpbmVkIHwgSW5zdGFuY2U8VD4gPSB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuYmVmb3JlSW5zdGFudGlhdGlvbih0aGlzLmNvbXBvbmVudENsYXNzLCBhcmdzKTtcbiAgICAgICAgICAgIGlmICghaW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZSA9IG5ldyB0aGlzLmNvbXBvbmVudENsYXNzKC4uLmFyZ3MpIGFzIEluc3RhbmNlPFQ+O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5saWZlY3ljbGVSZXNvbHZlci5pbnZva2VQcmVJbmplY3RNZXRob2QoaW5zdGFuY2UpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdldHRlciA9IHByb3BlcnRpZXNba2V5XShpbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWZpbmVQcm9wZXJ0eShpbnN0YW5jZSwga2V5LCBnZXR0ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5zdGFuY2UgPSB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuYWZ0ZXJJbnN0YW50aWF0aW9uKGluc3RhbmNlKTtcbiAgICAgICAgICAgIHRoaXMubGlmZWN5Y2xlUmVzb2x2ZXIuaW52b2tlUG9zdEluamVjdE1ldGhvZChpbnN0YW5jZSk7XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBkZWZpbmVQcm9wZXJ0eTxULCBWPihpbnN0YW5jZTogVCwga2V5OiBzdHJpbmcgfCBzeW1ib2wsIGdldHRlcjogKCkgPT4gVikge1xuICAgICAgICBpZiAodGhpcy5sYXp5TW9kZSkge1xuICAgICAgICAgICAgbGF6eVByb3AoaW5zdGFuY2UsIGtleSwgZ2V0dGVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGluc3RhbmNlW2tleV0gPSBnZXR0ZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZVByb3BlcnRpZXNHZXR0ZXJCdWlsZGVyKCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB7fSBhcyBSZWNvcmQ8a2V5b2YgVCwgKGluc3RhbmNlOiBUKSA9PiAoKSA9PiB1bmtub3duIHwgdW5rbm93bltdPjtcbiAgICAgICAgY29uc3QgcHJvcGVydHlUeXBlTWFwID0gdGhpcy5jbGFzc01ldGFkYXRhUmVhZGVyLmdldFByb3BlcnR5VHlwZU1hcCgpO1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIGZhY3RvcnlEZWZdIG9mIHRoaXMucHJvcGVydHlGYWN0b3JpZXMuaXRlcmF0b3IoKSkge1xuICAgICAgICAgICAgY29uc3QgaXNBcnJheSA9IChwcm9wZXJ0eVR5cGVNYXAuZ2V0KGtleSkgYXMgdW5rbm93bikgPT09IEFycmF5O1xuICAgICAgICAgICAgaWYgKCFpc0FycmF5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGZhY3RvcnlEZWYuZmFjdG9yaWVzLnNpemUgPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICAgICAgICAgICAgICAgICAgICBgTXVsdGlwbGUgbWF0Y2hpbmcgaW5qZWN0YWJsZXMgZm91bmQgZm9yIHByb3BlcnR5IGluamVjdGlvbixcXG5idXQgcHJvcGVydHkgJHtrZXkudG9TdHJpbmcoKX0gaXMgbm90IGFuIGFycmF5LFxuICAgICAgICAgICAgICAgICAgICAgICAgSXQgaXMgYW1iaWd1b3VzIHRvIGRldGVybWluZSB3aGljaCBvYmplY3Qgc2hvdWxkIGJlIGluamVjdGVkIWBcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgW2ZhY3RvcnksIGluamVjdGlvbnNdID0gZmFjdG9yeURlZi5mYWN0b3JpZXMuZW50cmllcygpLm5leHQoKS52YWx1ZSBhcyBbXG4gICAgICAgICAgICAgICAgICAgIFNlcnZpY2VGYWN0b3J5PHVua25vd24sIHVua25vd24+LFxuICAgICAgICAgICAgICAgICAgICBJZGVudGlmaWVyW11cbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIHJlc3VsdFtrZXkgYXMga2V5b2YgVF0gPSA8VD4oaW5zdGFuY2U6IFQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvZHVjZXIgPSBmYWN0b3J5KHRoaXMuY29udGFpbmVyLCBpbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb250YWluZXIuaW52b2tlKHByb2R1Y2VyLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5qZWN0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W2tleSBhcyBrZXlvZiBUXSA9IDxUPihpbnN0YW5jZTogVCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9kdWNlckFuZEluamVjdGlvbnMgPSBBcnJheS5mcm9tKGZhY3RvcnlEZWYuZmFjdG9yaWVzKS5tYXAoXG4gICAgICAgICAgICAgICAgICAgICAgICAoW2ZhY3RvcnksIGluamVjdGlvbnNdKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtmYWN0b3J5KHRoaXMuY29udGFpbmVyLCBpbnN0YW5jZSksIGluamVjdGlvbnNdIGFzIFtBbnlGdW5jdGlvbjx1bmtub3duPiwgSWRlbnRpZmllcltdXVxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvZHVjZXJBbmRJbmplY3Rpb25zLm1hcCgoW3Byb2R1Y2VyLCBpbmplY3Rpb25zXSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRhaW5lci5pbnZva2UocHJvZHVjZXIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5qZWN0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cbiIsImxldCBpbnN0YW5jZVNlcmlhbE5vID0gLTE7XG5cbmV4cG9ydCBjbGFzcyBDb21wb25lbnRJbnN0YW5jZVdyYXBwZXIge1xuICAgIHB1YmxpYyByZWFkb25seSBzZXJpYWxObyA9ICsraW5zdGFuY2VTZXJpYWxObztcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBpbnN0YW5jZTogdW5rbm93bikge31cblxuICAgIHB1YmxpYyBjb21wYXJlVG8ob3RoZXI6IENvbXBvbmVudEluc3RhbmNlV3JhcHBlcik6IC0xIHwgMCB8IDEge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXJpYWxObyA+IG90aGVyLnNlcmlhbE5vID8gLTEgOiB0aGlzLnNlcmlhbE5vIDwgb3RoZXIuc2VyaWFsTm8gPyAxIDogMDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IExpZmVjeWNsZSB9IGZyb20gJy4uL2ZvdW5kYXRpb24vTGlmZWN5Y2xlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGludm9rZVByZURlc3Ryb3koaW5zdGFuY2U6IHVua25vd24pIHtcbiAgICBjb25zdCBjbGF6eiA9IGluc3RhbmNlPy5jb25zdHJ1Y3RvcjtcbiAgICBpZiAoIWNsYXp6KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShjbGF6eiwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgY29uc3QgcHJlRGVzdHJveU1ldGhvZHMgPSBtZXRhZGF0YS5nZXRNZXRob2RzKExpZmVjeWNsZS5QUkVfREVTVFJPWSk7XG4gICAgcHJlRGVzdHJveU1ldGhvZHMuZm9yRWFjaChtZXRob2ROYW1lID0+IHtcbiAgICAgICAgY29uc3QgbWV0aG9kID0gY2xhenoucHJvdG90eXBlW21ldGhvZE5hbWVdO1xuICAgICAgICBpZiAodHlwZW9mIG1ldGhvZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbWV0aG9kLmFwcGx5KGluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuIiwiaW1wb3J0IHsgR2V0SW5zdGFuY2VPcHRpb25zLCBJbnN0YW5jZVJlc29sdXRpb24sIFNhdmVJbnN0YW5jZU9wdGlvbnMgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZVJlc29sdXRpb24nO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgQ29tcG9uZW50SW5zdGFuY2VXcmFwcGVyIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9Db21wb25lbnRJbnN0YW5jZVdyYXBwZXInO1xuaW1wb3J0IHsgaW52b2tlUHJlRGVzdHJveSB9IGZyb20gJy4uL2NvbW1vbi9pbnZva2VQcmVEZXN0cm95JztcblxuZXhwb3J0IGNsYXNzIFNpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbiBpbXBsZW1lbnRzIEluc3RhbmNlUmVzb2x1dGlvbiB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBJTlNUQU5DRV9NQVAgPSBuZXcgTWFwPElkZW50aWZpZXIsIENvbXBvbmVudEluc3RhbmNlV3JhcHBlcj4oKTtcbiAgICBnZXRJbnN0YW5jZTxULCBPPihvcHRpb25zOiBHZXRJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiBUIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuSU5TVEFOQ0VfTUFQLmdldChvcHRpb25zLmlkZW50aWZpZXIpPy5pbnN0YW5jZSBhcyBUO1xuICAgIH1cblxuICAgIHNhdmVJbnN0YW5jZTxULCBPPihvcHRpb25zOiBTYXZlSW5zdGFuY2VPcHRpb25zPFQsIE8+KTogdm9pZCB7XG4gICAgICAgIHRoaXMuSU5TVEFOQ0VfTUFQLnNldChvcHRpb25zLmlkZW50aWZpZXIsIG5ldyBDb21wb25lbnRJbnN0YW5jZVdyYXBwZXIob3B0aW9ucy5pbnN0YW5jZSkpO1xuICAgIH1cblxuICAgIHNob3VsZEdlbmVyYXRlPFQsIE8+KG9wdGlvbnM6IEdldEluc3RhbmNlT3B0aW9uczxULCBPPik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gIXRoaXMuSU5TVEFOQ0VfTUFQLmhhcyhvcHRpb25zLmlkZW50aWZpZXIpO1xuICAgIH1cbiAgICBkZXN0cm95KCkge1xuICAgICAgICBjb25zdCBpbnN0YW5jZVdyYXBwZXJzID0gQXJyYXkuZnJvbSh0aGlzLklOU1RBTkNFX01BUC52YWx1ZXMoKSk7XG4gICAgICAgIGluc3RhbmNlV3JhcHBlcnMuc29ydCgoYSwgYikgPT4gYS5jb21wYXJlVG8oYikpO1xuICAgICAgICBpbnN0YW5jZVdyYXBwZXJzLmZvckVhY2goaW5zdGFuY2VXcmFwcGVyID0+IHtcbiAgICAgICAgICAgIGludm9rZVByZURlc3Ryb3koaW5zdGFuY2VXcmFwcGVyLmluc3RhbmNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuSU5TVEFOQ0VfTUFQLmNsZWFyKCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgR2V0SW5zdGFuY2VPcHRpb25zLCBJbnN0YW5jZVJlc29sdXRpb24sIFNhdmVJbnN0YW5jZU9wdGlvbnMgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZVJlc29sdXRpb24nO1xuaW1wb3J0IHsgU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uIH0gZnJvbSAnLi9TaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24nO1xuXG5jb25zdCBTSU5HTEVUT05fSU5TVEFOQ0VfU0lOR0xFVE9OID0gbmV3IFNpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbigpO1xuXG5leHBvcnQgY2xhc3MgR2xvYmFsU2hhcmVkSW5zdGFuY2VSZXNvbHV0aW9uIGltcGxlbWVudHMgSW5zdGFuY2VSZXNvbHV0aW9uIHtcbiAgICBnZXRJbnN0YW5jZTxULCBPPihvcHRpb25zOiBHZXRJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiBUIHtcbiAgICAgICAgcmV0dXJuIFNJTkdMRVRPTl9JTlNUQU5DRV9TSU5HTEVUT04uZ2V0SW5zdGFuY2Uob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgc2F2ZUluc3RhbmNlPFQsIE8+KG9wdGlvbnM6IFNhdmVJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiB2b2lkIHtcbiAgICAgICAgU0lOR0xFVE9OX0lOU1RBTkNFX1NJTkdMRVRPTi5zYXZlSW5zdGFuY2Uob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgc2hvdWxkR2VuZXJhdGU8VCwgTz4ob3B0aW9uczogR2V0SW5zdGFuY2VPcHRpb25zPFQsIE8+KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBTSU5HTEVUT05fSU5TVEFOQ0VfU0lOR0xFVE9OLnNob3VsZEdlbmVyYXRlKG9wdGlvbnMpO1xuICAgIH1cbiAgICBkZXN0cm95KCkge1xuICAgICAgICAvLyBQQVNTO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEluc3RhbmNlUmVzb2x1dGlvbiwgU2F2ZUluc3RhbmNlT3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlUmVzb2x1dGlvbic7XG5pbXBvcnQgeyBpbnZva2VQcmVEZXN0cm95IH0gZnJvbSAnLi4vY29tbW9uL2ludm9rZVByZURlc3Ryb3knO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNpZW50SW5zdGFuY2VSZXNvbHV0aW9uIGltcGxlbWVudHMgSW5zdGFuY2VSZXNvbHV0aW9uIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGluc3RhbmNlcyA9IG5ldyBTZXQ8dW5rbm93bj4oKTtcbiAgICBzaG91bGRHZW5lcmF0ZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZ2V0SW5zdGFuY2U8VD4oKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzYXZlSW5zdGFuY2U8VCwgTz4ob3B0aW9uczogU2F2ZUluc3RhbmNlT3B0aW9uczxULCBPPik6IHZvaWQge1xuICAgICAgICB0aGlzLmluc3RhbmNlcy5hZGQob3B0aW9ucy5pbnN0YW5jZSk7XG4gICAgfVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuaW5zdGFuY2VzLmZvckVhY2goaXQgPT4ge1xuICAgICAgICAgICAgaWYgKCFpdCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGludm9rZVByZURlc3Ryb3koaXQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5pbnN0YW5jZXMuY2xlYXIoKTtcbiAgICB9XG4gICAgZGVzdHJveVRoYXQ8VD4oaW5zdGFuY2U6IFQpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmluc3RhbmNlcy5oYXMoaW5zdGFuY2UpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaW52b2tlUHJlRGVzdHJveShpbnN0YW5jZSk7XG4gICAgICAgIHRoaXMuaW5zdGFuY2VzLmRlbGV0ZShpbnN0YW5jZSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgRXZhbHVhdG9yIH0gZnJvbSAnLi4vdHlwZXMvRXZhbHVhdG9yJztcbmltcG9ydCB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4uL2ZvdW5kYXRpb24vQXBwbGljYXRpb25Db250ZXh0JztcbmltcG9ydCB7IEpTT05EYXRhIH0gZnJvbSAnLi4vdHlwZXMvSlNPTkRhdGEnO1xuXG5leHBvcnQgY2xhc3MgSlNPTkRhdGFFdmFsdWF0b3IgaW1wbGVtZW50cyBFdmFsdWF0b3Ige1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbmFtZXNwYWNlRGF0YU1hcCA9IG5ldyBNYXA8c3RyaW5nLCBKU09ORGF0YT4oKTtcbiAgICBldmFsPFQ+KGNvbnRleHQ6IEFwcGxpY2F0aW9uQ29udGV4dCwgZXhwcmVzc2lvbjogc3RyaW5nKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IGNvbG9uSW5kZXggPSBleHByZXNzaW9uLmluZGV4T2YoJzonKTtcbiAgICAgICAgaWYgKGNvbG9uSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luY29ycmVjdCBleHByZXNzaW9uLCBuYW1lc3BhY2Ugbm90IHNwZWNpZmllZCcpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5hbWVzcGFjZSA9IGV4cHJlc3Npb24uc3Vic3RyaW5nKDAsIGNvbG9uSW5kZXgpO1xuICAgICAgICBjb25zdCBleHAgPSBleHByZXNzaW9uLnN1YnN0cmluZyhjb2xvbkluZGV4ICsgMSk7XG4gICAgICAgIGlmICghdGhpcy5uYW1lc3BhY2VEYXRhTWFwLmhhcyhuYW1lc3BhY2UpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEluY29ycmVjdCBleHByZXNzaW9uOiBuYW1lc3BhY2Ugbm90IHJlY29yZGVkOiBcIiR7bmFtZXNwYWNlfVwiYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMubmFtZXNwYWNlRGF0YU1hcC5nZXQobmFtZXNwYWNlKSBhcyBKU09ORGF0YTtcbiAgICAgICAgcmV0dXJuIHJ1bkV4cHJlc3Npb24oZXhwLCBkYXRhIGFzIE9iamVjdCk7XG4gICAgfVxuICAgIHJlY29yZERhdGEobmFtZXNwYWNlOiBzdHJpbmcsIGRhdGE6IEpTT05EYXRhKSB7XG4gICAgICAgIHRoaXMubmFtZXNwYWNlRGF0YU1hcC5zZXQobmFtZXNwYWNlLCBkYXRhKTtcbiAgICB9XG4gICAgZ2V0SlNPTkRhdGEobmFtZXNwYWNlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZXNwYWNlRGF0YU1hcC5nZXQobmFtZXNwYWNlKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJ1bkV4cHJlc3Npb24oZXhwcmVzc2lvbjogc3RyaW5nLCByb290Q29udGV4dDogT2JqZWN0KSB7XG4gICAgY29uc3QgZm4gPSBjb21waWxlRXhwcmVzc2lvbihleHByZXNzaW9uKTtcbiAgICByZXR1cm4gZm4ocm9vdENvbnRleHQpO1xufVxuXG5mdW5jdGlvbiBjb21waWxlRXhwcmVzc2lvbihleHByZXNzaW9uOiBzdHJpbmcpIHtcbiAgICBpZiAoZXhwcmVzc2lvbi5pbmRleE9mKCcsJykgPiAtMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEluY29ycmVjdCBleHByZXNzaW9uIHN5bnRheCwgVGhlICcsJyBpcyBub3QgYWxsb3dlZCBpbiBleHByZXNzaW9uOiBcIiR7ZXhwcmVzc2lvbn1cImApO1xuICAgIH1cbiAgICBpZiAoZXhwcmVzc2lvbi5sZW5ndGggPiAxMjApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYEluY29ycmVjdCBleHByZXNzaW9uIHN5bnRheCwgZXhwcmVzc2lvbiBsZW5ndGggY2Fubm90IGJlIGdyZWF0ZXIgdGhhbiAxMjAsIGJ1dCBhY3R1YWw6ICR7ZXhwcmVzc2lvbi5sZW5ndGh9YFxuICAgICAgICApO1xuICAgIH1cbiAgICBpZiAoL1xcKC4qP1xcKS8udGVzdChleHByZXNzaW9uKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEluY29ycmVjdCBleHByZXNzaW9uIHN5bnRheCwgcGFyZW50aGVzZXMgYXJlIG5vdCBhbGxvd2VkIGluIGV4cHJlc3Npb246IFwiJHtleHByZXNzaW9ufVwiYCk7XG4gICAgfVxuICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnRyaW0oKTtcbiAgICBpZiAoZXhwcmVzc2lvbiA9PT0gJycpIHtcbiAgICAgICAgcmV0dXJuIChyb290OiBPYmplY3QpID0+IHJvb3Q7XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdFZhck5hbWUgPSB2YXJOYW1lKCdjb250ZXh0Jyk7XG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbihcbiAgICAgICAgcm9vdFZhck5hbWUsXG4gICAgICAgIGBcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gJHtyb290VmFyTmFtZX0uJHtleHByZXNzaW9ufTtcbiAgICAgICAgfSBjYXRjaChlcnJvcikgeyB0aHJvdyBlcnJvciB9XG4gICAgYFxuICAgICk7XG59XG5sZXQgVkFSX1NFUVVFTkNFID0gRGF0ZS5ub3coKTtcbmZ1bmN0aW9uIHZhck5hbWUocHJlZml4OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gcHJlZml4ICsgJycgKyAoVkFSX1NFUVVFTkNFKyspLnRvU3RyaW5nKDE2KTtcbn1cbiIsImltcG9ydCB7IEV2YWx1YXRvciB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRvcic7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5cbmV4cG9ydCBjbGFzcyBFbnZpcm9ubWVudEV2YWx1YXRvciBpbXBsZW1lbnRzIEV2YWx1YXRvciB7XG4gICAgZXZhbDxUPihjb250ZXh0OiBBcHBsaWNhdGlvbkNvbnRleHQsIGV4cHJlc3Npb246IHN0cmluZyk6IFQgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gcHJvY2Vzcy5lbnZbZXhwcmVzc2lvbl0gYXMgVCB8IHVuZGVmaW5lZDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBFdmFsdWF0b3IgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0b3InO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuXG5leHBvcnQgY2xhc3MgQXJndkV2YWx1YXRvciBpbXBsZW1lbnRzIEV2YWx1YXRvciB7XG4gICAgZXZhbDxULCBBID0gc3RyaW5nW10+KGNvbnRleHQ6IEFwcGxpY2F0aW9uQ29udGV4dCwgZXhwcmVzc2lvbjogc3RyaW5nLCBhcmdzPzogQSk6IFQgfCB1bmRlZmluZWQge1xuICAgICAgICBjb25zdCBhcmd2ID0gYXJncyB8fCBwcm9jZXNzLmFyZ3Y7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdmFyLXJlcXVpcmVzXG4gICAgICAgIGNvbnN0IG1pbmltaXN0ID0gcmVxdWlyZSgnbWluaW1pc3QnKTtcbiAgICAgICAgY29uc3QgbWFwID0gbWluaW1pc3QoYXJndik7XG4gICAgICAgIHJldHVybiBtYXBbZXhwcmVzc2lvbl07XG4gICAgfVxufVxuIiwiZXhwb3J0IGVudW0gQWR2aWNlIHtcbiAgICBCZWZvcmUsXG4gICAgQWZ0ZXIsXG4gICAgQXJvdW5kLFxuICAgIEFmdGVyUmV0dXJuLFxuICAgIFRocm93bixcbiAgICBGaW5hbGx5XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuL0FkdmljZSc7XG5cbnR5cGUgQmVmb3JlSG9vayA9IChhcmdzOiBhbnlbXSkgPT4gdm9pZDtcbnR5cGUgQWZ0ZXJIb29rID0gKGFyZ3M6IGFueVtdKSA9PiB2b2lkO1xudHlwZSBUaHJvd25Ib29rID0gKHJlYXNvbjogYW55LCBhcmdzOiBhbnlbXSkgPT4gdm9pZDtcbnR5cGUgRmluYWxseUhvb2sgPSAoYXJnczogYW55W10pID0+IHZvaWQ7XG50eXBlIEFmdGVyUmV0dXJuSG9vayA9IChyZXR1cm5WYWx1ZTogYW55LCBhcmdzOiBhbnlbXSkgPT4gYW55O1xudHlwZSBBcm91bmRIb29rID0gKHRoaXM6IGFueSwgb3JpZ2luZm46ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCwgYXJnczogYW55W10pID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBBc3BlY3RVdGlscyB7XG4gICAgcHJpdmF0ZSBiZWZvcmVIb29rczogQXJyYXk8QmVmb3JlSG9vaz4gPSBbXTtcbiAgICBwcml2YXRlIGFmdGVySG9va3M6IEFycmF5PEFmdGVySG9vaz4gPSBbXTtcbiAgICBwcml2YXRlIHRocm93bkhvb2tzOiBBcnJheTxUaHJvd25Ib29rPiA9IFtdO1xuICAgIHByaXZhdGUgZmluYWxseUhvb2tzOiBBcnJheTxGaW5hbGx5SG9vaz4gPSBbXTtcbiAgICBwcml2YXRlIGFmdGVyUmV0dXJuSG9va3M6IEFycmF5PEFmdGVyUmV0dXJuSG9vaz4gPSBbXTtcbiAgICBwcml2YXRlIGFyb3VuZEhvb2tzOiBBcnJheTxBcm91bmRIb29rPiA9IFtdO1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZm46ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KSB7fVxuICAgIGFwcGVuZChhZHZpY2U6IEFkdmljZS5CZWZvcmUsIGhvb2s6IEJlZm9yZUhvb2spOiB2b2lkO1xuICAgIGFwcGVuZChhZHZpY2U6IEFkdmljZS5BZnRlciwgaG9vazogQWZ0ZXJIb29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuVGhyb3duLCBob29rOiBUaHJvd25Ib29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuRmluYWxseSwgaG9vazogRmluYWxseUhvb2spOiB2b2lkO1xuICAgIGFwcGVuZChhZHZpY2U6IEFkdmljZS5BZnRlclJldHVybiwgaG9vazogQWZ0ZXJSZXR1cm5Ib29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuQXJvdW5kLCBob29rOiBBcm91bmRIb29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UsIGhvb2s6IEZ1bmN0aW9uKSB7XG4gICAgICAgIGxldCBob29rc0FycmF5OiBGdW5jdGlvbltdIHwgdW5kZWZpbmVkO1xuICAgICAgICBzd2l0Y2ggKGFkdmljZSkge1xuICAgICAgICAgICAgY2FzZSBBZHZpY2UuQmVmb3JlOlxuICAgICAgICAgICAgICAgIGhvb2tzQXJyYXkgPSB0aGlzLmJlZm9yZUhvb2tzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBZHZpY2UuQWZ0ZXI6XG4gICAgICAgICAgICAgICAgaG9va3NBcnJheSA9IHRoaXMuYWZ0ZXJIb29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLlRocm93bjpcbiAgICAgICAgICAgICAgICBob29rc0FycmF5ID0gdGhpcy50aHJvd25Ib29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLkZpbmFsbHk6XG4gICAgICAgICAgICAgICAgaG9va3NBcnJheSA9IHRoaXMuZmluYWxseUhvb2tzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBZHZpY2UuQWZ0ZXJSZXR1cm46XG4gICAgICAgICAgICAgICAgaG9va3NBcnJheSA9IHRoaXMuYWZ0ZXJSZXR1cm5Ib29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLkFyb3VuZDpcbiAgICAgICAgICAgICAgICBob29rc0FycmF5ID0gdGhpcy5hcm91bmRIb29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaG9va3NBcnJheSkge1xuICAgICAgICAgICAgaG9va3NBcnJheS5wdXNoKGhvb2spO1xuICAgICAgICB9XG4gICAgfVxuICAgIGV4dHJhY3QoKSB7XG4gICAgICAgIGNvbnN0IHsgYXJvdW5kSG9va3MsIGJlZm9yZUhvb2tzLCBhZnRlckhvb2tzLCBhZnRlclJldHVybkhvb2tzLCBmaW5hbGx5SG9va3MsIHRocm93bkhvb2tzIH0gPSB0aGlzO1xuICAgICAgICBjb25zdCBmbiA9IGFyb3VuZEhvb2tzLnJlZHVjZVJpZ2h0KChwcmV2LCBuZXh0KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dC5jYWxsKHRoaXMsIHByZXYsIGFyZ3MpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSwgdGhpcy5mbikgYXMgdHlwZW9mIHRoaXMuZm47XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodGhpczogYW55LCAuLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICAgICAgYmVmb3JlSG9va3MuZm9yRWFjaChob29rID0+IHtcbiAgICAgICAgICAgICAgICBob29rLmNhbGwodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGludm9rZSA9IChvbkVycm9yOiAocmVhc29uOiBhbnkpID0+IHZvaWQsIG9uRmluYWxseTogKCkgPT4gdm9pZCwgb25BZnRlcjogKHJldHVyblZhbHVlOiBhbnkpID0+IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCByZXR1cm5WYWx1ZTogYW55O1xuICAgICAgICAgICAgICAgIGxldCBpc1Byb21pc2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSA9IGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmV0dXJuVmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc1Byb21pc2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSByZXR1cm5WYWx1ZS5jYXRjaChvbkVycm9yKS5maW5hbGx5KG9uRmluYWxseSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25GaW5hbGx5KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGlzUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWUudGhlbigodmFsdWU6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9uQWZ0ZXIodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb25BZnRlcihyZXR1cm5WYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBpbnZva2UoXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhyb3duSG9va3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3duSG9va3MuZm9yRWFjaChob29rID0+IGhvb2suY2FsbCh0aGlzLCBlcnJvciwgYXJncykpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZmluYWxseUhvb2tzLmZvckVhY2goaG9vayA9PiBob29rLmNhbGwodGhpcywgYXJncykpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdmFsdWUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBhZnRlckhvb2tzLmZvckVhY2goaG9vayA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBob29rLmNhbGwodGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWZ0ZXJSZXR1cm5Ib29rcy5yZWR1Y2UoKHJldFZhbCwgaG9vaykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhvb2suY2FsbCh0aGlzLCByZXRWYWwsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG5pbXBvcnQgdHlwZSB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4uL2ZvdW5kYXRpb24vQXBwbGljYXRpb25Db250ZXh0JztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4vQWR2aWNlJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEFzcGVjdCwgSm9pblBvaW50LCBQcm9jZWVkaW5nSm9pblBvaW50IH0gZnJvbSAnLi9Bc3BlY3QnO1xuaW1wb3J0IHsgQXNwZWN0VXRpbHMgfSBmcm9tICcuL0FzcGVjdFV0aWxzJztcbmltcG9ydCB7IEFzcGVjdEluZm8gfSBmcm9tICcuL0FzcGVjdE1ldGFkdGEnO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQXNwZWN0PFQ+KFxuICAgIGFwcEN0eDogQXBwbGljYXRpb25Db250ZXh0LFxuICAgIHRhcmdldDogVCxcbiAgICBtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2wsXG4gICAgbWV0aG9kRnVuYzogRnVuY3Rpb24sXG4gICAgYXNwZWN0czogQXNwZWN0SW5mb1tdXG4pIHtcbiAgICBjb25zdCBjcmVhdGVBc3BlY3RDdHggPSAoYWR2aWNlOiBBZHZpY2UsIGFyZ3M6IGFueVtdLCByZXR1cm5WYWx1ZTogYW55ID0gbnVsbCwgZXJyb3I6IGFueSA9IG51bGwpOiBKb2luUG9pbnQgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdGFyZ2V0LFxuICAgICAgICAgICAgbWV0aG9kTmFtZSxcbiAgICAgICAgICAgIGFyZ3VtZW50czogYXJncyxcbiAgICAgICAgICAgIHJldHVyblZhbHVlLFxuICAgICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgICBhZHZpY2VcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIGNvbnN0IGFzcGVjdFV0aWxzID0gbmV3IEFzcGVjdFV0aWxzKG1ldGhvZEZ1bmMgYXMgKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpO1xuICAgIGNvbnN0IENsYXNzVG9JbnN0YW5jZSA9IChhc3BlY3RJbmZvOiBBc3BlY3RJbmZvKSA9PiBhcHBDdHguZ2V0SW5zdGFuY2UoYXNwZWN0SW5mby5hc3BlY3RDbGFzcykgYXMgQXNwZWN0O1xuICAgIGNvbnN0IHRhcmdldENvbnN0cnVjdG9yID0gKHRhcmdldCBhcyBvYmplY3QpLmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8VD47XG4gICAgY29uc3QgYWxsTWF0Y2hBc3BlY3RzID0gYXNwZWN0cy5maWx0ZXIoaXQgPT4gaXQucG9pbnRjdXQudGVzdCh0YXJnZXRDb25zdHJ1Y3RvciwgbWV0aG9kTmFtZSkpO1xuXG4gICAgY29uc3QgYmVmb3JlQWR2aWNlQXNwZWN0cyA9IGFsbE1hdGNoQXNwZWN0cy5maWx0ZXIoaXQgPT4gaXQuYWR2aWNlID09PSBBZHZpY2UuQmVmb3JlKS5tYXAoQ2xhc3NUb0luc3RhbmNlKTtcbiAgICBjb25zdCBhZnRlckFkdmljZUFzcGVjdHMgPSBhbGxNYXRjaEFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LmFkdmljZSA9PT0gQWR2aWNlLkFmdGVyKS5tYXAoQ2xhc3NUb0luc3RhbmNlKTtcbiAgICBjb25zdCB0cnlDYXRjaEFkdmljZUFzcGVjdHMgPSBhbGxNYXRjaEFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LmFkdmljZSA9PT0gQWR2aWNlLlRocm93bikubWFwKENsYXNzVG9JbnN0YW5jZSk7XG4gICAgY29uc3QgdHJ5RmluYWxseUFkdmljZUFzcGVjdHMgPSBhbGxNYXRjaEFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LmFkdmljZSA9PT0gQWR2aWNlLkZpbmFsbHkpLm1hcChDbGFzc1RvSW5zdGFuY2UpO1xuICAgIGNvbnN0IGFmdGVyUmV0dXJuQWR2aWNlQXNwZWN0cyA9IGFsbE1hdGNoQXNwZWN0cy5maWx0ZXIoaXQgPT4gaXQuYWR2aWNlID09PSBBZHZpY2UuQWZ0ZXJSZXR1cm4pLm1hcChDbGFzc1RvSW5zdGFuY2UpO1xuICAgIGNvbnN0IGFyb3VuZEFkdmljZUFzcGVjdHMgPSBhbGxNYXRjaEFzcGVjdHMuZmlsdGVyKGl0ID0+IGl0LmFkdmljZSA9PT0gQWR2aWNlLkFyb3VuZCkubWFwKENsYXNzVG9JbnN0YW5jZSk7XG5cbiAgICBpZiAoYmVmb3JlQWR2aWNlQXNwZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFzcGVjdFV0aWxzLmFwcGVuZChBZHZpY2UuQmVmb3JlLCAoYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGpvaW5Qb2ludCA9IGNyZWF0ZUFzcGVjdEN0eChBZHZpY2UuQmVmb3JlLCBhcmdzKTtcbiAgICAgICAgICAgIGJlZm9yZUFkdmljZUFzcGVjdHMuZm9yRWFjaChhc3BlY3QgPT4ge1xuICAgICAgICAgICAgICAgIGFzcGVjdC5leGVjdXRlKGpvaW5Qb2ludCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChhZnRlckFkdmljZUFzcGVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLkFmdGVyLCAoYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGpvaW5Qb2ludCA9IGNyZWF0ZUFzcGVjdEN0eChBZHZpY2UuQWZ0ZXIsIGFyZ3MpO1xuICAgICAgICAgICAgYWZ0ZXJBZHZpY2VBc3BlY3RzLmZvckVhY2goYXNwZWN0ID0+IHtcbiAgICAgICAgICAgICAgICBhc3BlY3QuZXhlY3V0ZShqb2luUG9pbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodHJ5Q2F0Y2hBZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXNwZWN0VXRpbHMuYXBwZW5kKEFkdmljZS5UaHJvd24sIChlcnJvciwgYXJncykgPT4ge1xuICAgICAgICAgICAgY29uc3Qgam9pblBvaW50ID0gY3JlYXRlQXNwZWN0Q3R4KEFkdmljZS5UaHJvd24sIGFyZ3MsIG51bGwsIGVycm9yKTtcbiAgICAgICAgICAgIHRyeUNhdGNoQWR2aWNlQXNwZWN0cy5mb3JFYWNoKGFzcGVjdCA9PiB7XG4gICAgICAgICAgICAgICAgYXNwZWN0LmV4ZWN1dGUoam9pblBvaW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodHJ5RmluYWxseUFkdmljZUFzcGVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLkZpbmFsbHksIChhcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgam9pblBvaW50ID0gY3JlYXRlQXNwZWN0Q3R4KEFkdmljZS5GaW5hbGx5LCBhcmdzKTtcbiAgICAgICAgICAgIHRyeUZpbmFsbHlBZHZpY2VBc3BlY3RzLmZvckVhY2goYXNwZWN0ID0+IHtcbiAgICAgICAgICAgICAgICBhc3BlY3QuZXhlY3V0ZShqb2luUG9pbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChhZnRlclJldHVybkFkdmljZUFzcGVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLkFmdGVyUmV0dXJuLCAocmV0dXJuVmFsdWUsIGFyZ3MpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhZnRlclJldHVybkFkdmljZUFzcGVjdHMucmVkdWNlKChwcmV2UmV0dXJuVmFsdWUsIGFzcGVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGpvaW5Qb2ludCA9IGNyZWF0ZUFzcGVjdEN0eChBZHZpY2UuQWZ0ZXJSZXR1cm4sIGFyZ3MsIHJldHVyblZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXNwZWN0LmV4ZWN1dGUoam9pblBvaW50KTtcbiAgICAgICAgICAgIH0sIHJldHVyblZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGFyb3VuZEFkdmljZUFzcGVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhcm91bmRBZHZpY2VBc3BlY3RzLmZvckVhY2goYXNwZWN0ID0+IHtcbiAgICAgICAgICAgIGFzcGVjdFV0aWxzLmFwcGVuZChBZHZpY2UuQXJvdW5kLCAob3JpZ2luRm4sIGFyZ3MpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBqb2luUG9pbnQgPSBjcmVhdGVBc3BlY3RDdHgoQWR2aWNlLkFyb3VuZCwgYXJncywgbnVsbCkgYXMgUHJvY2VlZGluZ0pvaW5Qb2ludDtcbiAgICAgICAgICAgICAgICBqb2luUG9pbnQucHJvY2VlZCA9IChqcEFyZ3MgPSBhcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5GbihqcEFyZ3MpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFzcGVjdC5leGVjdXRlKGpvaW5Qb2ludCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFzcGVjdFV0aWxzLmV4dHJhY3QoKTtcbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cbmltcG9ydCB7IEFzcGVjdCwgSm9pblBvaW50IH0gZnJvbSAnLi9Bc3BlY3QnO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgSW5qZWN0IH0gZnJvbSAnLi4vZGVjb3JhdG9ycy9JbmplY3QnO1xuaW1wb3J0IHsgbGF6eVByb3AgfSBmcm9tICdAdmdlcmJvdC9sYXp5JztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIENvbXBvbmVudE1ldGhvZEFzcGVjdCBpbXBsZW1lbnRzIEFzcGVjdCB7XG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUoY2xheno6IE5ld2FibGU8dW5rbm93bj4sIG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCk6IE5ld2FibGU8QXNwZWN0PiB7XG4gICAgICAgIHJldHVybiBjbGFzcyBDb21wb25lbnRNZXRob2RBc3BlY3RJbXBsIGV4dGVuZHMgQ29tcG9uZW50TWV0aG9kQXNwZWN0IHtcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgICAgICAgbGF6eVByb3AodGhpcywgJ2FzcGVjdEluc3RhbmNlJywge1xuICAgICAgICAgICAgICAgICAgICBldmFsdWF0ZTogKCkgPT4gdGhpcy5hcHBDdHguZ2V0SW5zdGFuY2UoY2xhenopXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBleGVjdXRlKGN0eDogSm9pblBvaW50KTogYW55IHtcbiAgICAgICAgICAgICAgICBjb25zdCBmdW5jID0gdGhpcy5hc3BlY3RJbnN0YW5jZVttZXRob2ROYW1lXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXMuYXNwZWN0SW5zdGFuY2UsIGN0eCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIHByb3RlY3RlZCBhc3BlY3RJbnN0YW5jZSE6IGFueTtcbiAgICBASW5qZWN0KEFwcGxpY2F0aW9uQ29udGV4dClcbiAgICBwcm90ZWN0ZWQgYXBwQ3R4ITogQXBwbGljYXRpb25Db250ZXh0O1xuICAgIGFic3RyYWN0IGV4ZWN1dGUoY3R4OiBKb2luUG9pbnQpOiBhbnk7XG59XG4iLCJpbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgTWV0YWRhdGEsIE1ldGFkYXRhUmVhZGVyIH0gZnJvbSAnLi4vdHlwZXMvTWV0YWRhdGEnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi9BZHZpY2UnO1xuaW1wb3J0IHsgQ29tcG9uZW50TWV0aG9kQXNwZWN0IH0gZnJvbSAnLi9Db21wb25lbnRNZXRob2RBc3BlY3QnO1xuaW1wb3J0IHsgUG9pbnRjdXQgfSBmcm9tICcuL1BvaW50Y3V0JztcblxuZXhwb3J0IGludGVyZmFjZSBBc3BlY3RJbmZvIHtcbiAgICBhc3BlY3RDbGFzczogTmV3YWJsZTx1bmtub3duPjtcbiAgICBtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2w7XG4gICAgcG9pbnRjdXQ6IFBvaW50Y3V0O1xuICAgIGFkdmljZTogQWR2aWNlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFzcGVjdE1ldGFkYXRhUmVhZGVyIGV4dGVuZHMgTWV0YWRhdGFSZWFkZXIge1xuICAgIGdldEFzcGVjdHMoanBJZGVudGlmaWVyOiBJZGVudGlmaWVyLCBqcE1lbWJlcjogc3RyaW5nIHwgc3ltYm9sKTogQXNwZWN0SW5mb1tdO1xufVxuXG5leHBvcnQgY2xhc3MgQXNwZWN0TWV0YWRhdGEgaW1wbGVtZW50cyBNZXRhZGF0YTxBc3BlY3RNZXRhZGF0YVJlYWRlciwgdm9pZD4ge1xuICAgIHByaXZhdGUgc3RhdGljIElOU1RBTkNFID0gbmV3IEFzcGVjdE1ldGFkYXRhKCk7XG4gICAgcHJpdmF0ZSByZWFkb25seSBhc3BlY3RzOiBBc3BlY3RJbmZvW10gPSBbXTtcbiAgICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCkge1xuICAgICAgICByZXR1cm4gQXNwZWN0TWV0YWRhdGEuSU5TVEFOQ0U7XG4gICAgfVxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8vXG4gICAgfVxuICAgIGluaXQoKTogdm9pZCB7XG4gICAgICAgIC8vXG4gICAgfVxuICAgIGFwcGVuZChjb21wb25lbnRBc3BlY3RDbGFzczogTmV3YWJsZTx1bmtub3duPiwgbWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sLCBhZHZpY2U6IEFkdmljZSwgcG9pbnRjdXQ6IFBvaW50Y3V0KSB7XG4gICAgICAgIGNvbnN0IEFzcGVjdENsYXNzID0gQ29tcG9uZW50TWV0aG9kQXNwZWN0LmNyZWF0ZShjb21wb25lbnRBc3BlY3RDbGFzcywgbWV0aG9kTmFtZSk7XG4gICAgICAgIHRoaXMuYXNwZWN0cy5wdXNoKHtcbiAgICAgICAgICAgIGFzcGVjdENsYXNzOiBBc3BlY3RDbGFzcyxcbiAgICAgICAgICAgIG1ldGhvZE5hbWUsXG4gICAgICAgICAgICBwb2ludGN1dCxcbiAgICAgICAgICAgIGFkdmljZVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVhZGVyKCk6IEFzcGVjdE1ldGFkYXRhUmVhZGVyIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldEFzcGVjdHM6IChqcElkZW50aWZpZXIsIGpwTWVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNwZWN0cy5maWx0ZXIoKHsgcG9pbnRjdXQgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcG9pbnRjdXQudGVzdChqcElkZW50aWZpZXIsIGpwTWVtYmVyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yJztcbmltcG9ydCB0eXBlIHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHsgY3JlYXRlQXNwZWN0IH0gZnJvbSAnLi9jcmVhdGVBc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQXNwZWN0TWV0YWRhdGEgfSBmcm9tICcuL0FzcGVjdE1ldGFkdGEnO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQU9QSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yIGltcGxlbWVudHMgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB7XG4gICAgc3RhdGljIGNyZWF0ZShhcHBDdHg6IEFwcGxpY2F0aW9uQ29udGV4dCk6IE5ld2FibGU8QU9QSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yPiB7XG4gICAgICAgIHJldHVybiBjbGFzcyBleHRlbmRzIEFPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3NvciB7XG4gICAgICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgYXBwQ3R4OiBBcHBsaWNhdGlvbkNvbnRleHQgPSBhcHBDdHg7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSBhcHBDdHg6IEFwcGxpY2F0aW9uQ29udGV4dDtcbiAgICBhZnRlckluc3RhbnRpYXRpb248VCBleHRlbmRzIG9iamVjdD4oaW5zdGFuY2U6IFQpOiBUIHtcbiAgICAgICAgY29uc3QgY2xhenogPSBpbnN0YW5jZS5jb25zdHJ1Y3RvcjtcblxuICAgICAgICBjb25zdCBhc3BlY3RNZXRhZGF0YSA9IEFzcGVjdE1ldGFkYXRhLmdldEluc3RhbmNlKCkucmVhZGVyKCk7XG4gICAgICAgIC8vIGNvbnN0IHVzZUFzcGVjdE1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoY2xhenosIEFPUENsYXNzTWV0YWRhdGEpO1xuICAgICAgICAvLyBjb25zdCB1c2VBc3BlY3RNZXRhZGF0YVJlYWRlciA9IHVzZUFzcGVjdE1ldGFkYXRhLnJlYWRlcigpO1xuICAgICAgICAvLyBjb25zdCB1c2VBc3BlY3RzTWFwID0gdXNlQXNwZWN0TWV0YWRhdGFSZWFkZXIuZ2V0QXNwZWN0cygpO1xuICAgICAgICAvLyBpZiAodXNlQXNwZWN0c01hcC5zaXplID09PSAwKSB7XG4gICAgICAgIC8vICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIC8vIH1cblxuICAgICAgICBjb25zdCBhc3BlY3RTdG9yZU1hcCA9IG5ldyBXZWFrTWFwPG9iamVjdCwgTWFwPHN0cmluZyB8IHN5bWJvbCwgRnVuY3Rpb24+PigpO1xuICAgICAgICBhc3BlY3RTdG9yZU1hcC5zZXQoaW5zdGFuY2UsIG5ldyBNYXA8c3RyaW5nIHwgc3ltYm9sLCBGdW5jdGlvbj4oKSk7XG5cbiAgICAgICAgY29uc3QgcHJveHlSZXN1bHQgPSBuZXcgUHJveHkoaW5zdGFuY2UsIHtcbiAgICAgICAgICAgIGdldDogKHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5WYWx1ZSA9IFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpO1xuICAgICAgICAgICAgICAgIGlmIChSZWZsZWN0Lmhhcyh0YXJnZXQsIHByb3ApICYmIHR5cGVvZiBvcmlnaW5WYWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhc3BlY3RNYXAgPSBhc3BlY3RTdG9yZU1hcC5nZXQoaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWFzcGVjdE1hcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpblZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChhc3BlY3RNYXAuaGFzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXNwZWN0TWFwLmdldChwcm9wKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhc3BlY3RzT2ZNZXRob2QgPSBhc3BlY3RNZXRhZGF0YS5nZXRBc3BlY3RzKGNsYXp6IGFzIElkZW50aWZpZXIsIHByb3ApO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhc3BlY3RGbiA9IGNyZWF0ZUFzcGVjdCh0aGlzLmFwcEN0eCwgdGFyZ2V0LCBwcm9wLCBvcmlnaW5WYWx1ZSwgYXNwZWN0c09mTWV0aG9kKTtcbiAgICAgICAgICAgICAgICAgICAgYXNwZWN0TWFwLnNldChwcm9wLCBhc3BlY3RGbik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhc3BlY3RGbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpblZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb3h5UmVzdWx0O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3NvciwgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL3R5cGVzL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcic7XG5pbXBvcnQgeyBsYXp5TWVtYmVyIH0gZnJvbSAnQHZnZXJib3QvbGF6eSc7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlJztcbmltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuXG5leHBvcnQgY2xhc3MgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlciB7XG4gICAgcHJpdmF0ZSBpbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzOiBTZXQ8TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPj4gPSBuZXcgU2V0KCk7XG4gICAgQGxhenlNZW1iZXI8SW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlciwga2V5b2YgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlciwgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvcltdPih7XG4gICAgICAgIGV2YWx1YXRlOiBpbnN0YW5jZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBnbG9iYWxJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzID0gR2xvYmFsTWV0YWRhdGEuZ2V0UmVhZGVyKCkuZ2V0SW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcygpO1xuICAgICAgICAgICAgY29uc3QgaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcyA9IGdsb2JhbEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuY29uY2F0KFxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oaW5zdGFuY2UuaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcylcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3Nlcy5tYXAoaXQgPT4gaW5zdGFuY2UuY29udGFpbmVyLmdldEluc3RhbmNlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3IsIHZvaWQ+KGl0KSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlc2V0Qnk6IFtcbiAgICAgICAgICAgIGluc3RhbmNlID0+IGluc3RhbmNlLmluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuc2l6ZSxcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBnbG9iYWxJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzID0gR2xvYmFsTWV0YWRhdGEuZ2V0UmVhZGVyKCkuZ2V0SW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcygpO1xuICAgICAgICAgICAgICAgIHJldHVybiBnbG9iYWxJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH0pXG4gICAgcHJpdmF0ZSBpbnN0QXdhcmVQcm9jZXNzb3JJbnN0YW5jZXMhOiBBcnJheTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY29udGFpbmVyOiBBcHBsaWNhdGlvbkNvbnRleHQpIHt9XG4gICAgYXBwZW5kSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3M6IE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4pIHtcbiAgICAgICAgdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLmFkZChpbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyk7XG4gICAgfVxuICAgIGFwcGVuZEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoXG4gICAgICAgIGluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXM6IFNldDxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+PiB8IEFycmF5PE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4+XG4gICAgKSB7XG4gICAgICAgIGluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuZm9yRWFjaChpdCA9PiB7XG4gICAgICAgICAgICB0aGlzLmluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuYWRkKGl0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGJlZm9yZUluc3RhbnRpYXRpb248VD4oY29tcG9uZW50Q2xhc3M6IE5ld2FibGU8VD4sIGFyZ3M6IHVua25vd25bXSkge1xuICAgICAgICBjb25zdCBpbnN0QXdhcmVQcm9jZXNzb3JzID0gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JJbnN0YW5jZXM7XG4gICAgICAgIGxldCBpbnN0YW5jZTogdW5kZWZpbmVkIHwgSW5zdGFuY2U8VD47XG4gICAgICAgIGluc3RBd2FyZVByb2Nlc3NvcnMuc29tZShwcm9jZXNzb3IgPT4ge1xuICAgICAgICAgICAgaWYgKCFwcm9jZXNzb3IuYmVmb3JlSW5zdGFudGlhdGlvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluc3RhbmNlID0gcHJvY2Vzc29yLmJlZm9yZUluc3RhbnRpYXRpb248VD4oY29tcG9uZW50Q2xhc3MsIGFyZ3MpIGFzIEluc3RhbmNlPFQ+O1xuICAgICAgICAgICAgcmV0dXJuICEhaW5zdGFuY2U7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfVxuICAgIGFmdGVySW5zdGFudGlhdGlvbjxUPihpbnN0YW5jZTogSW5zdGFuY2U8VD4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29ySW5zdGFuY2VzLnJlZHVjZSgoaW5zdGFuY2UsIHByb2Nlc3NvcikgPT4ge1xuICAgICAgICAgICAgaWYgKHByb2Nlc3Nvci5hZnRlckluc3RhbnRpYXRpb24pIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBwcm9jZXNzb3IuYWZ0ZXJJbnN0YW50aWF0aW9uKGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICBpZiAoISFyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdCBhcyBJbnN0YW5jZTxUPjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIH0sIGluc3RhbmNlKTtcbiAgICB9XG4gICAgaXNJbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyhjbHM6IE5ld2FibGU8dW5rbm93bj4pIHtcbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IHRoaXMuZ2V0SW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcygpO1xuICAgICAgICByZXR1cm4gY2xhc3Nlcy5pbmRleE9mKGNscyBhcyBOZXdhYmxlPEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcj4pID4gLTE7XG4gICAgfVxuICAgIGdldEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoKSB7XG4gICAgICAgIGNvbnN0IGdsb2JhbEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlYWRlcigpLmdldEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMoKTtcbiAgICAgICAgcmV0dXJuIGdsb2JhbEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuY29uY2F0KEFycmF5LmZyb20odGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSW5zdGFuY2VTY29wZSB9IGZyb20gJy4vSW5zdGFuY2VTY29wZSc7XG5pbXBvcnQgeyBJbnN0YW5jZVJlc29sdXRpb24gfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZVJlc29sdXRpb24nO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgU2VydmljZUZhY3RvcnkgfSBmcm9tICcuLi90eXBlcy9TZXJ2aWNlRmFjdG9yeSc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIsIEV2ZW50TGlzdGVuZXIgfSBmcm9tICcuL0V2ZW50RW1pdHRlcic7XG5pbXBvcnQgeyBBbnlGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzL0FueUZ1bmN0aW9uJztcbmltcG9ydCB7IGhhc0FyZ3MsIGhhc0luamVjdGlvbnMsIEludm9rZUZ1bmN0aW9uT3B0aW9ucyB9IGZyb20gJy4vSW52b2tlRnVuY3Rpb25PcHRpb25zJztcbmltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuaW1wb3J0IHsgRmFjdG9yeUlkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9GYWN0b3J5SWRlbnRpZmllcic7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhLCBDbGFzc01ldGFkYXRhUmVhZGVyIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBDb21wb25lbnRJbnN0YW5jZUJ1aWxkZXIgfSBmcm9tICcuL0NvbXBvbmVudEluc3RhbmNlQnVpbGRlcic7XG5pbXBvcnQgeyBGdW5jdGlvbk1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvRnVuY3Rpb25NZXRhZGF0YSc7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHRPcHRpb25zIH0gZnJvbSAnLi4vdHlwZXMvQXBwbGljYXRpb25Db250ZXh0T3B0aW9ucyc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IFNpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbiB9IGZyb20gJy4uL3Jlc29sdXRpb24vU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IEdsb2JhbFNoYXJlZEluc3RhbmNlUmVzb2x1dGlvbiB9IGZyb20gJy4uL3Jlc29sdXRpb24vR2xvYmFsU2hhcmVkSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IFRyYW5zaWVudEluc3RhbmNlUmVzb2x1dGlvbiB9IGZyb20gJy4uL3Jlc29sdXRpb24vVHJhbnNpZW50SW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IEV2YWx1YXRpb25PcHRpb25zLCBFeHByZXNzaW9uVHlwZSB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRlT3B0aW9ucyc7XG5pbXBvcnQgeyBKU09ORGF0YSB9IGZyb20gJy4uL3R5cGVzL0pTT05EYXRhJztcbmltcG9ydCB7IEV2YWx1YXRvciB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRvcic7XG5pbXBvcnQgeyBKU09ORGF0YUV2YWx1YXRvciB9IGZyb20gJy4uL2V2YWx1YXRvci9KU09ORGF0YUV2YWx1YXRvcic7XG5pbXBvcnQgeyBFbnZpcm9ubWVudEV2YWx1YXRvciB9IGZyb20gJy4uL2V2YWx1YXRvci9FbnZpcm9ubWVudEV2YWx1YXRvcic7XG5pbXBvcnQgeyBBcmd2RXZhbHVhdG9yIH0gZnJvbSAnLi4vZXZhbHVhdG9yL0FyZ3ZFdmFsdWF0b3InO1xuaW1wb3J0IHsgaXNOb2RlSnMgfSBmcm9tICcuLi9jb21tb24vaXNOb2RlSnMnO1xuaW1wb3J0IHsgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL3R5cGVzL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcic7XG5pbXBvcnQgeyBBT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3IgfSBmcm9tICcuLi9hb3AvQU9QSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yJztcbmltcG9ydCB7IEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXIgfSBmcm9tICcuL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXInO1xuaW1wb3J0IHsgTGlmZWN5Y2xlTWFuYWdlciB9IGZyb20gJy4vTGlmZWN5Y2xlTWFuYWdlcic7XG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlJztcbmltcG9ydCB7IEZhY3RvcnlSZWNvcmRlciB9IGZyb20gJy4uL2NvbW1vbi9GYWN0b3J5UmVjb3JkZXInO1xuXG5jb25zdCBQUkVfREVTVFJPWV9FVkVOVF9LRVkgPSAnY29udGFpbmVyOmV2ZW50OnByZS1kZXN0cm95JztcblxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uQ29udGV4dCB7XG4gICAgcHJpdmF0ZSByZXNvbHV0aW9ucyA9IG5ldyBNYXA8SW5zdGFuY2VTY29wZSB8IHN0cmluZywgSW5zdGFuY2VSZXNvbHV0aW9uPigpO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgcHJpdmF0ZSBmYWN0b3JpZXMgPSBuZXcgRmFjdG9yeVJlY29yZGVyKCk7XG4gICAgcHJpdmF0ZSBldmFsdWF0b3JDbGFzc2VzID0gbmV3IE1hcDxzdHJpbmcsIE5ld2FibGU8RXZhbHVhdG9yPj4oKTtcbiAgICBwcml2YXRlIGV2ZW50RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGRlZmF1bHRTY29wZTogSW5zdGFuY2VTY29wZTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxhenlNb2RlOiBib29sZWFuO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlcjogSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yTWFuYWdlcjtcbiAgICBwdWJsaWMgY29uc3RydWN0b3Iob3B0aW9uczogQXBwbGljYXRpb25Db250ZXh0T3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRoaXMuZGVmYXVsdFNjb3BlID0gb3B0aW9ucy5kZWZhdWx0U2NvcGUgfHwgSW5zdGFuY2VTY29wZS5TSU5HTEVUT047XG4gICAgICAgIHRoaXMubGF6eU1vZGUgPSBvcHRpb25zLmxhenlNb2RlID09PSB1bmRlZmluZWQgPyB0cnVlIDogb3B0aW9ucy5sYXp5TW9kZTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlckluc3RhbmNlU2NvcGVSZXNvbHV0aW9uKEluc3RhbmNlU2NvcGUuU0lOR0xFVE9OLCBTaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24pO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySW5zdGFuY2VTY29wZVJlc29sdXRpb24oSW5zdGFuY2VTY29wZS5HTE9CQUxfU0hBUkVEX1NJTkdMRVRPTiwgR2xvYmFsU2hhcmVkSW5zdGFuY2VSZXNvbHV0aW9uKTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlckluc3RhbmNlU2NvcGVSZXNvbHV0aW9uKEluc3RhbmNlU2NvcGUuVFJBTlNJRU5ULCBUcmFuc2llbnRJbnN0YW5jZVJlc29sdXRpb24pO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZhbHVhdG9yKEV4cHJlc3Npb25UeXBlLkpTT05fUEFUSCwgSlNPTkRhdGFFdmFsdWF0b3IpO1xuICAgICAgICBpZiAoaXNOb2RlSnMpIHtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFdmFsdWF0b3IoRXhwcmVzc2lvblR5cGUuRU5WLCBFbnZpcm9ubWVudEV2YWx1YXRvcik7XG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyRXZhbHVhdG9yKEV4cHJlc3Npb25UeXBlLkFSR1YsIEFyZ3ZFdmFsdWF0b3IpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlciA9IG5ldyBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyKHRoaXMpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySW5zdEF3YXJlUHJvY2Vzc29yKEFPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvci5jcmVhdGUodGhpcykpO1xuICAgIH1cbiAgICBnZXRJbnN0YW5jZTxULCBPPihzeW1ib2w6IE5ld2FibGU8VD4sIG93bmVyPzogTyk6IFQ7XG4gICAgZ2V0SW5zdGFuY2U8VCwgTz4oc3ltYm9sOiBJZGVudGlmaWVyPFQ+LCBvd25lcj86IE8pOiBUIHwgVFtdO1xuICAgIGdldEluc3RhbmNlPFQsIE8+KHN5bWJvbDogSWRlbnRpZmllcjxUPiwgb3duZXI/OiBPKTogVCB8IFRbXSB7XG4gICAgICAgIGlmIChzeW1ib2wgPT09IEFwcGxpY2F0aW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMgYXMgdW5rbm93biBhcyBUO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygc3ltYm9sID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygc3ltYm9sID09PSAnc3ltYm9sJykge1xuICAgICAgICAgICAgY29uc3QgZmFjdG9yeURlZiA9IHRoaXMuZ2V0RmFjdG9yeShzeW1ib2wpO1xuICAgICAgICAgICAgaWYgKGZhY3RvcnlEZWYpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9kdWNlciA9IGZhY3RvcnlEZWYucHJvZHVjZSh0aGlzLCBvd25lcik7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHByb2R1Y2VyKCkgYXMgVCB8IFRbXTtcbiAgICAgICAgICAgICAgICBjb25zdCBjb25zdHIgPSByZXN1bHQ/LmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc3RyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudENsYXNzID0gY29uc3RyIGFzIE5ld2FibGU8VD47XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc29sdmVyID0gbmV3IExpZmVjeWNsZU1hbmFnZXI8VD4oY29tcG9uZW50Q2xhc3MsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0luc3RBd2FyZVByb2Nlc3NvciA9IHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5pc0luc3RBd2FyZVByb2Nlc3NvckNsYXNzKGNvbXBvbmVudENsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZXIuaW52b2tlUHJlSW5qZWN0TWV0aG9kKHJlc3VsdCBhcyBJbnN0YW5jZTxUPik7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNJbnN0QXdhcmVQcm9jZXNzb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5hZnRlckluc3RhbnRpYXRpb24ocmVzdWx0IGFzIEluc3RhbmNlPFQ+KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlci5pbnZva2VQb3N0SW5qZWN0TWV0aG9kKHJlc3VsdCBhcyBJbnN0YW5jZTxUPik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNsYXNzTWV0YWRhdGEgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlYWRlcigpLmdldENsYXNzTWV0YWRhdGE8VD4oc3ltYm9sKTtcbiAgICAgICAgICAgICAgICBpZiAoIWNsYXNzTWV0YWRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDbGFzcyBhbGlhcyBub3QgZm91bmQ6ICR7c3ltYm9sLnRvU3RyaW5nKCl9YCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sID0gY2xhc3NNZXRhZGF0YS5yZWFkZXIoKS5nZXRDbGFzcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb21wb25lbnRDbGFzcyA9IHN5bWJvbDtcbiAgICAgICAgY29uc3QgcmVhZGVyID0gQ2xhc3NNZXRhZGF0YS5nZXRJbnN0YW5jZShjb21wb25lbnRDbGFzcykucmVhZGVyKCk7XG4gICAgICAgIGNvbnN0IHNjb3BlID0gcmVhZGVyLmdldFNjb3BlKCk7XG4gICAgICAgIGNvbnN0IHJlc29sdXRpb24gPSAodGhpcy5yZXNvbHV0aW9ucy5nZXQoc2NvcGUpIHx8IHRoaXMucmVzb2x1dGlvbnMuZ2V0KHRoaXMuZGVmYXVsdFNjb3BlKSkgYXMgSW5zdGFuY2VSZXNvbHV0aW9uO1xuICAgICAgICBjb25zdCBnZXRJbnN0YW5jZU9wdGlvbnMgPSB7XG4gICAgICAgICAgICBpZGVudGlmaWVyOiBjb21wb25lbnRDbGFzcyxcbiAgICAgICAgICAgIG93bmVyLFxuICAgICAgICAgICAgb3duZXJQcm9wZXJ0eUtleTogdW5kZWZpbmVkXG4gICAgICAgIH07XG4gICAgICAgIGlmIChyZXNvbHV0aW9uLnNob3VsZEdlbmVyYXRlKGdldEluc3RhbmNlT3B0aW9ucykpIHtcbiAgICAgICAgICAgIGNvbnN0IGJ1aWxkZXIgPSB0aGlzLmNyZWF0ZUNvbXBvbmVudEluc3RhbmNlQnVpbGRlcihjb21wb25lbnRDbGFzcyk7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGJ1aWxkZXIuYnVpbGQoKTtcbiAgICAgICAgICAgIGNvbnN0IHNhdmVJbnN0YW5jZU9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgLi4uZ2V0SW5zdGFuY2VPcHRpb25zLFxuICAgICAgICAgICAgICAgIGluc3RhbmNlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVzb2x1dGlvbi5zYXZlSW5zdGFuY2Uoc2F2ZUluc3RhbmNlT3B0aW9ucyk7XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x1dGlvbi5nZXRJbnN0YW5jZShnZXRJbnN0YW5jZU9wdGlvbnMpIGFzIFQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUNvbXBvbmVudEluc3RhbmNlQnVpbGRlcjxUPihjb21wb25lbnRDbGFzczogTmV3YWJsZTxUPikge1xuICAgICAgICBjb25zdCBidWlsZGVyID0gbmV3IENvbXBvbmVudEluc3RhbmNlQnVpbGRlcihjb21wb25lbnRDbGFzcywgdGhpcywgdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyKTtcbiAgICAgICAgYnVpbGRlci5hcHBlbmRMYXp5TW9kZSh0aGlzLmxhenlNb2RlKTtcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXI7XG4gICAgfVxuXG4gICAgZ2V0RmFjdG9yeShrZXk6IEZhY3RvcnlJZGVudGlmaWVyKSB7XG4gICAgICAgIGNvbnN0IGZhY3RvcnkgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlYWRlcigpLmdldENvbXBvbmVudEZhY3Rvcnkoa2V5KTtcbiAgICAgICAgaWYgKCFmYWN0b3J5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mYWN0b3JpZXMuZ2V0KGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfVxuICAgIGJpbmRGYWN0b3J5PFQ+KFxuICAgICAgICBzeW1ib2w6IEZhY3RvcnlJZGVudGlmaWVyLFxuICAgICAgICBmYWN0b3J5OiBTZXJ2aWNlRmFjdG9yeTxULCB1bmtub3duPixcbiAgICAgICAgaW5qZWN0aW9ucz86IElkZW50aWZpZXJbXSxcbiAgICAgICAgaXNTaW5nbGU/OiBib29sZWFuXG4gICAgKSB7XG4gICAgICAgIHRoaXMuZmFjdG9yaWVzLmFwcGVuZChzeW1ib2wsIGZhY3RvcnksIGluamVjdGlvbnMsIGlzU2luZ2xlKTtcbiAgICB9XG4gICAgaW52b2tlPFIsIEN0eD4oZnVuYzogQW55RnVuY3Rpb248UiwgQ3R4Piwgb3B0aW9uczogSW52b2tlRnVuY3Rpb25PcHRpb25zPEN0eD4gPSB7fSk6IFIge1xuICAgICAgICBsZXQgZm46IEFueUZ1bmN0aW9uPFI+O1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGZuID0gZnVuYy5iaW5kKG9wdGlvbnMuY29udGV4dCBhcyBUaGlzUGFyYW1ldGVyVHlwZTx0eXBlb2YgZnVuYz4pIGFzIEFueUZ1bmN0aW9uPFI+O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm4gPSBmdW5jIGFzIEFueUZ1bmN0aW9uPFI+O1xuICAgICAgICB9XG4gICAgICAgIGlmIChoYXNBcmdzKG9wdGlvbnMpKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5hcmdzID8gZm4oLi4ub3B0aW9ucy5hcmdzKSA6IGZuKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGFyZ3NJbmRlbnRpZmllcnM6IElkZW50aWZpZXJbXSA9IFtdO1xuICAgICAgICBpZiAoaGFzSW5qZWN0aW9ucyhvcHRpb25zKSkge1xuICAgICAgICAgICAgYXJnc0luZGVudGlmaWVycyA9IG9wdGlvbnMuaW5qZWN0aW9ucztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoZm4sIEZ1bmN0aW9uTWV0YWRhdGEpLnJlYWRlcigpO1xuICAgICAgICAgICAgYXJnc0luZGVudGlmaWVycyA9IG1ldGFkYXRhLmdldFBhcmFtZXRlcnMoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhcmdzID0gYXJnc0luZGVudGlmaWVycy5tYXAoKGlkZW50aWZpZXIsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0SW5zdGFuY2UoaWRlbnRpZmllcik7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnN0YW5jZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0FycmF5VHlwZSA9IChpZGVudGlmaWVyIGFzIHVua25vd24pID09PSBBcnJheTtcbiAgICAgICAgICAgICAgICBpZiAoaXNBcnJheVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIG1hdGNoaW5nIGluamVjdGFibGVzIGZvdW5kIGZvciBwYXJhbWV0ZXIgYXQgJHtpbmRleH0uYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZVswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBhcmdzLmxlbmd0aCA+IDAgPyBmbiguLi5hcmdzKSA6IGZuKCk7XG4gICAgfVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuZXZlbnRFbWl0dGVyLmVtaXQoUFJFX0RFU1RST1lfRVZFTlRfS0VZKTtcbiAgICAgICAgdGhpcy5yZXNvbHV0aW9ucy5mb3JFYWNoKGl0ID0+IHtcbiAgICAgICAgICAgIGl0LmRlc3Ryb3koKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGV2YWx1YXRlPFQsIE8sIEE+KGV4cHJlc3Npb246IHN0cmluZywgb3B0aW9uczogRXZhbHVhdGlvbk9wdGlvbnM8Tywgc3RyaW5nLCBBPik6IFQgfCB1bmRlZmluZWQge1xuICAgICAgICBjb25zdCBldmFsdWF0b3JDbGFzcyA9IHRoaXMuZXZhbHVhdG9yQ2xhc3Nlcy5nZXQob3B0aW9ucy50eXBlKTtcbiAgICAgICAgaWYgKCFldmFsdWF0b3JDbGFzcykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgVW5rbm93biBldmFsdWF0b3IgbmFtZTogJHtvcHRpb25zLnR5cGV9YCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZXZhbHVhdG9yID0gdGhpcy5nZXRJbnN0YW5jZShldmFsdWF0b3JDbGFzcyk7XG4gICAgICAgIHJldHVybiBldmFsdWF0b3IuZXZhbCh0aGlzLCBleHByZXNzaW9uLCBvcHRpb25zLmV4dGVybmFsQXJncyk7XG4gICAgfVxuICAgIHJlY29yZEpTT05EYXRhKG5hbWVzcGFjZTogc3RyaW5nLCBkYXRhOiBKU09ORGF0YSkge1xuICAgICAgICBjb25zdCBldmFsdWF0b3IgPSB0aGlzLmdldEluc3RhbmNlKEpTT05EYXRhRXZhbHVhdG9yKTtcbiAgICAgICAgZXZhbHVhdG9yLnJlY29yZERhdGEobmFtZXNwYWNlLCBkYXRhKTtcbiAgICB9XG4gICAgZ2V0SlNPTkRhdGEobmFtZXNwYWNlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgZXZhbHVhdG9yID0gdGhpcy5nZXRJbnN0YW5jZShKU09ORGF0YUV2YWx1YXRvcik7XG4gICAgICAgIHJldHVybiBldmFsdWF0b3IuZ2V0SlNPTkRhdGEobmFtZXNwYWNlKTtcbiAgICB9XG4gICAgYmluZEluc3RhbmNlPFQ+KGlkZW50aWZpZXI6IHN0cmluZyB8IHN5bWJvbCwgaW5zdGFuY2U6IFQpIHtcbiAgICAgICAgY29uc3QgcmVzb2x1dGlvbiA9IHRoaXMucmVzb2x1dGlvbnMuZ2V0KEluc3RhbmNlU2NvcGUuU0lOR0xFVE9OKTtcbiAgICAgICAgcmVzb2x1dGlvbj8uc2F2ZUluc3RhbmNlKHtcbiAgICAgICAgICAgIGlkZW50aWZpZXIsXG4gICAgICAgICAgICBpbnN0YW5jZVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVnaXN0ZXJJbnN0YW5jZVNjb3BlUmVzb2x1dGlvbjxUIGV4dGVuZHMgTmV3YWJsZTxJbnN0YW5jZVJlc29sdXRpb24+PihcbiAgICAgICAgc2NvcGU6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmcsXG4gICAgICAgIHJlc29sdXRpb25Db25zdHJ1Y3RvcjogVCxcbiAgICAgICAgY29uc3RydWN0b3JBcmdzPzogQ29uc3RydWN0b3JQYXJhbWV0ZXJzPFQ+XG4gICAgKSB7XG4gICAgICAgIHRoaXMucmVzb2x1dGlvbnMuc2V0KHNjb3BlLCBuZXcgcmVzb2x1dGlvbkNvbnN0cnVjdG9yKC4uLihjb25zdHJ1Y3RvckFyZ3MgfHwgW10pKSk7XG4gICAgfVxuICAgIHJlZ2lzdGVyRXZhbHVhdG9yKG5hbWU6IHN0cmluZywgZXZhbHVhdG9yQ2xhc3M6IE5ld2FibGU8RXZhbHVhdG9yPikge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGV2YWx1YXRvckNsYXNzLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgbWV0YWRhdGEuc2V0U2NvcGUoSW5zdGFuY2VTY29wZS5TSU5HTEVUT04pO1xuICAgICAgICB0aGlzLmV2YWx1YXRvckNsYXNzZXMuc2V0KG5hbWUsIGV2YWx1YXRvckNsYXNzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFJlZ2lzdGVycyBhbiBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3IgY2xhc3MgdG8gY3VzdG9taXplXG4gICAgICogICAgICB0aGUgaW5zdGFudGlhdGlvbiBwcm9jZXNzIGF0IHZhcmlvdXMgc3RhZ2VzIHdpdGhpbiB0aGUgSW9DXG4gICAgICogQGRlcHJlY2F0ZWQgUmVwbGFjZWQgd2l0aCB7QGxpbmsgcmVnaXN0ZXJCZWZvcmVJbnN0YW50aWF0aW9uUHJvY2Vzc29yfSBhbmQge0BsaW5rIHJlZ2lzdGVyQWZ0ZXJJbnN0YW50aWF0aW9uUHJvY2Vzc29yfVxuICAgICAqIEBwYXJhbSB7TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPn0gY2xhenpcbiAgICAgKiBAc2VlIEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3NvclxuICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAqL1xuICAgIHJlZ2lzdGVySW5zdEF3YXJlUHJvY2Vzc29yKGNsYXp6OiBOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+KSB7XG4gICAgICAgIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5hcHBlbmRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyhjbGF6eik7XG4gICAgfVxuICAgIHJlZ2lzdGVyQmVmb3JlSW5zdGFudGlhdGlvblByb2Nlc3Nvcihwcm9jZXNzb3I6IDxUPihjb25zdHJ1Y3RvcjogTmV3YWJsZTxUPiwgYXJnczogdW5rbm93bltdKSA9PiBUIHwgdW5kZWZpbmVkIHwgdm9pZCkge1xuICAgICAgICB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuYXBwZW5kSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoXG4gICAgICAgICAgICBjbGFzcyBJbm5lclByb2Nlc3NvciBpbXBsZW1lbnRzIFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3Ige1xuICAgICAgICAgICAgICAgIGJlZm9yZUluc3RhbnRpYXRpb248VD4oY29uc3RydWN0b3I6IE5ld2FibGU8VD4sIGFyZ3M6IHVua25vd25bXSk6IHZvaWQgfCBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3Nvcihjb25zdHJ1Y3RvciwgYXJncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbiAgICByZWdpc3RlckFmdGVySW5zdGFudGlhdGlvblByb2Nlc3Nvcihwcm9jZXNzb3I6IDxUIGV4dGVuZHMgb2JqZWN0PihpbnN0YW5jZTogVCkgPT4gVCkge1xuICAgICAgICB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuYXBwZW5kSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoXG4gICAgICAgICAgICBjbGFzcyBJbm5lclByb2Nlc3NvciBpbXBsZW1lbnRzIFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3Ige1xuICAgICAgICAgICAgICAgIGFmdGVySW5zdGFudGlhdGlvbjxUIGV4dGVuZHMgb2JqZWN0PihpbnN0YW5jZTogVCk6IFQge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvY2Vzc29yKGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuICAgIG9uUHJlRGVzdHJveShsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudEVtaXR0ZXIub24oUFJFX0RFU1RST1lfRVZFTlRfS0VZLCBsaXN0ZW5lcik7XG4gICAgfVxuICAgIGdldENsYXNzTWV0YWRhdGE8VD4oY3RvcjogTmV3YWJsZTxUPikge1xuICAgICAgICByZXR1cm4gQ2xhc3NNZXRhZGF0YS5nZXRSZWFkZXIoY3RvcikgYXMgQ2xhc3NNZXRhZGF0YVJlYWRlcjxUPjtcbiAgICB9XG4gICAgZGVzdHJveVRyYW5zaWVudEluc3RhbmNlPFQ+KGluc3RhbmNlOiBUKSB7XG4gICAgICAgIGNvbnN0IHJlc29sdXRpb24gPSB0aGlzLnJlc29sdXRpb25zLmdldChJbnN0YW5jZVNjb3BlLlRSQU5TSUVOVCk7XG4gICAgICAgIHJlc29sdXRpb24/LmRlc3Ryb3lUaGF0ICYmIHJlc29sdXRpb24uZGVzdHJveVRoYXQoaW5zdGFuY2UpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE1ldGFkYXRhLCBNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4uL3R5cGVzL01ldGFkYXRhJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEFzcGVjdCB9IGZyb20gJy4vQXNwZWN0JztcbmltcG9ydCB7IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcCwgRGVmYXVsdFZhbHVlTWFwIH0gZnJvbSAnLi4vY29tbW9uL0RlZmF1bHRWYWx1ZU1hcCc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuL0FkdmljZSc7XG5cbmV4cG9ydCB0eXBlIFVzZUFzcGVjdE1hcCA9IERlZmF1bHRWYWx1ZU1hcDxzdHJpbmcgfCBzeW1ib2wsIERlZmF1bHRWYWx1ZU1hcDxBZHZpY2UsIEFycmF5PE5ld2FibGU8QXNwZWN0Pj4+PjtcblxuZXhwb3J0IGludGVyZmFjZSBVc2VBc3BlY3RNZXRhZGF0YVJlYWRlciBleHRlbmRzIE1ldGFkYXRhUmVhZGVyIHtcbiAgICBnZXRBc3BlY3RzKCk6IFVzZUFzcGVjdE1hcDtcbiAgICBnZXRBc3BlY3RzT2YobWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sLCBhZHZpY2U6IEFkdmljZSk6IEFycmF5PE5ld2FibGU8QXNwZWN0Pj47XG59XG5leHBvcnQgY2xhc3MgQU9QQ2xhc3NNZXRhZGF0YSBpbXBsZW1lbnRzIE1ldGFkYXRhPFVzZUFzcGVjdE1ldGFkYXRhUmVhZGVyLCBOZXdhYmxlPHVua25vd24+PiB7XG4gICAgc3RhdGljIGdldFJlZmxlY3RLZXkoKSB7XG4gICAgICAgIHJldHVybiAnYW9wOnVzZS1hc3BlY3QtbWV0YWRhdGEnO1xuICAgIH1cbiAgICBwcml2YXRlIGFzcGVjdE1hcDogVXNlQXNwZWN0TWFwID0gY3JlYXRlRGVmYXVsdFZhbHVlTWFwKCgpID0+IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcCgoKSA9PiBbXSkpO1xuICAgIGluaXQoKTogdm9pZCB7XG4gICAgICAgIC8vIElHTk9SRVxuICAgIH1cblxuICAgIGFwcGVuZChtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2wsIGFkdmljZTogQWR2aWNlLCBhc3BlY3RzOiBBcnJheTxOZXdhYmxlPEFzcGVjdD4+KSB7XG4gICAgICAgIGNvbnN0IGFkdmljZUFzcGVjdE1hcCA9IHRoaXMuYXNwZWN0TWFwLmdldChtZXRob2ROYW1lKTtcbiAgICAgICAgY29uc3QgZXhpdGluZ0FzcGVjdEFycmF5ID0gYWR2aWNlQXNwZWN0TWFwLmdldChhZHZpY2UpO1xuICAgICAgICBleGl0aW5nQXNwZWN0QXJyYXkucHVzaCguLi5hc3BlY3RzKTtcbiAgICB9XG5cbiAgICByZWFkZXIoKTogVXNlQXNwZWN0TWV0YWRhdGFSZWFkZXIge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0QXNwZWN0czogKCk6IFVzZUFzcGVjdE1hcCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNwZWN0TWFwO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldEFzcGVjdHNPZjogKG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCwgYWR2aWNlOiBBZHZpY2UpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3BlY3RNYXAuZ2V0KG1ldGhvZE5hbWUpLmdldChhZHZpY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcblxuZnVuY3Rpb24gZ2V0TWV0aG9kRGVzY3JpcHRvcnMocHJvdG90eXBlOiBvYmplY3QpOiBSZWNvcmQ8c3RyaW5nLCBQcm9wZXJ0eURlc2NyaXB0b3I+IHtcbiAgICBpZiAoXG4gICAgICAgIHR5cGVvZiBwcm90b3R5cGUgIT09ICdvYmplY3QnIHx8XG4gICAgICAgIHByb3RvdHlwZSA9PT0gbnVsbCB8fFxuICAgICAgICBPYmplY3QucHJvdG90eXBlID09PSBwcm90b3R5cGUgfHxcbiAgICAgICAgRnVuY3Rpb24ucHJvdG90eXBlID09PSBwcm90b3R5cGVcbiAgICApIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBjb25zdCBzdXBlclByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90b3R5cGUpO1xuICAgIGNvbnN0IHN1cGVyRGVzY3JpcHRvcnMgPSBzdXBlclByb3RvdHlwZSA9PT0gcHJvdG90eXBlID8ge30gOiBnZXRNZXRob2REZXNjcmlwdG9ycyhzdXBlclByb3RvdHlwZSk7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oc3VwZXJEZXNjcmlwdG9ycywgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMocHJvdG90eXBlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxNZXRob2RNZW1iZXJOYW1lczxUPihjbHM6IE5ld2FibGU8VD4pIHtcbiAgICBjb25zdCBkZXNjcmlwdG9ycyA9IGdldE1ldGhvZERlc2NyaXB0b3JzKGNscy5wcm90b3R5cGUpO1xuICAgIGRlbGV0ZSBkZXNjcmlwdG9yc1snY29uc3RydWN0b3InXTtcbiAgICBjb25zdCBtZXRob2ROYW1lcyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3Qga2V5IGluIGRlc2NyaXB0b3JzKSB7XG4gICAgICAgIGNvbnN0IG1lbWJlciA9IGNscy5wcm90b3R5cGVba2V5XTtcbiAgICAgICAgaWYgKHR5cGVvZiBtZW1iZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIG1ldGhvZE5hbWVzLmFkZChrZXkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtZXRob2ROYW1lcztcbn1cbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IGdldEFsbE1ldGhvZE1lbWJlck5hbWVzIH0gZnJvbSAnLi4vY29tbW9uL2dldEFsbE1ldGhvZE1lbWJlck5hbWVzJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcblxudHlwZSBNZW1iZXJJZGVudGlmaWVyID0gc3RyaW5nIHwgc3ltYm9sO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUG9pbnRjdXQge1xuICAgIHN0YXRpYyBjb21iaW5lKC4uLnBvaW50Y3V0czogUG9pbnRjdXRbXSkge1xuICAgICAgICByZXR1cm4gbmV3IE9yUG9pbnRjdXQocG9pbnRjdXRzKTtcbiAgICB9XG4gICAgc3RhdGljIG9mPFQ+KGNsczogTmV3YWJsZTxUPiwgLi4ubWV0aG9kTmFtZXM6IE1lbWJlcklkZW50aWZpZXJbXSkge1xuICAgICAgICBjb25zdCBlbnRyaWVzID0gbmV3IE1hcDxOZXdhYmxlPHVua25vd24+LCBTZXQ8TWVtYmVySWRlbnRpZmllcj4+KCk7XG4gICAgICAgIGNvbnN0IG1ldGhvZHMgPSBuZXcgU2V0PE1lbWJlcklkZW50aWZpZXI+KG1ldGhvZE5hbWVzIGFzIE1lbWJlcklkZW50aWZpZXJbXSk7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBnZXRBbGxNZXRob2RNZW1iZXJOYW1lcyhjbHMpLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgICAgICAgICAgICAgbWV0aG9kcy5hZGQobWV0aG9kTmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbnRyaWVzLnNldChjbHMsIG1ldGhvZHMpO1xuICAgICAgICByZXR1cm4gbmV3IFByZWNpdGVQb2ludGN1dChlbnRyaWVzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWRcbiAgICAgKi9cbiAgICBzdGF0aWMgdGVzdE1hdGNoPFQ+KGNsczogTmV3YWJsZTxUPiwgcmVnZXg6IFJlZ0V4cCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXRjaChjbHMsIHJlZ2V4KTtcbiAgICB9XG4gICAgc3RhdGljIG1hdGNoPFQ+KGNsczogTmV3YWJsZTxUPiwgcmVnZXg6IFJlZ0V4cCkge1xuICAgICAgICByZXR1cm4gbmV3IE1lbWJlck1hdGNoUG9pbnRjdXQoY2xzLCByZWdleCk7XG4gICAgfVxuICAgIHN0YXRpYyBmcm9tKC4uLmNsYXNzZXM6IEFycmF5PE5ld2FibGU8dW5rbm93bj4+KSB7XG4gICAgICAgIGNvbnN0IG9mID0gKC4uLm1ldGhvZE5hbWVzOiBNZW1iZXJJZGVudGlmaWVyW10pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgT3JQb2ludGN1dChjbGFzc2VzLm1hcChjbHMgPT4gUG9pbnRjdXQub2YoY2xzLCAuLi5tZXRob2ROYW1lcykpKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgbWF0Y2ggPSAocmVnZXg6IFJlZ0V4cCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBPclBvaW50Y3V0KFxuICAgICAgICAgICAgICAgIGNsYXNzZXMubWFwKGNscyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTWVtYmVyTWF0Y2hQb2ludGN1dChjbHMsIHJlZ2V4KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9mLFxuICAgICAgICAgICAgbWF0Y2gsXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBkZXByZWNhdGVkXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRlc3RNYXRjaDogbWF0Y2hcbiAgICAgICAgfTtcbiAgICB9XG4gICAgc3RhdGljIG1hcmtlZCh0eXBlOiBzdHJpbmcgfCBzeW1ib2wsIHZhbHVlOiB1bmtub3duID0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gbmV3IE1hcmtlZFBvaW50Y3V0KHR5cGUsIHZhbHVlKTtcbiAgICB9XG4gICAgc3RhdGljIGNsYXNzPFQ+KGNsczogTmV3YWJsZTxUPikge1xuICAgICAgICByZXR1cm4gbmV3IENsYXNzUG9pbnRjdXQoY2xzKTtcbiAgICB9XG4gICAgYWJzdHJhY3QgdGVzdChqcElkZW50aWZpZXI6IElkZW50aWZpZXIsIGpwTWVtYmVyOiBzdHJpbmcgfCBzeW1ib2wpOiBib29sZWFuO1xufVxuXG5jbGFzcyBPclBvaW50Y3V0IGV4dGVuZHMgUG9pbnRjdXQge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcG9pbnRjdXRzOiBQb2ludGN1dFtdKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHRlc3QoanBJZGVudGlmaWVyOiBJZGVudGlmaWVyLCBqcE1lbWJlcjogc3RyaW5nIHwgc3ltYm9sKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvaW50Y3V0cy5zb21lKGl0ID0+IGl0LnRlc3QoanBJZGVudGlmaWVyLCBqcE1lbWJlcikpO1xuICAgIH1cbn1cblxuY2xhc3MgUHJlY2l0ZVBvaW50Y3V0IGV4dGVuZHMgUG9pbnRjdXQge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgbWV0aG9kRW50cmllczogTWFwPElkZW50aWZpZXIsIFNldDxNZW1iZXJJZGVudGlmaWVyPj4pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgdGVzdChqcElkZW50aWZpZXI6IElkZW50aWZpZXIsIGpwTWVtYmVyOiBzdHJpbmcgfCBzeW1ib2wpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgbWVtYmVycyA9IHRoaXMubWV0aG9kRW50cmllcy5nZXQoanBJZGVudGlmaWVyKTtcbiAgICAgICAgcmV0dXJuICEhbWVtYmVycyAmJiBtZW1iZXJzLmhhcyhqcE1lbWJlcik7XG4gICAgfVxufVxuY2xhc3MgTWFya2VkUG9pbnRjdXQgZXh0ZW5kcyBQb2ludGN1dCB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBtYXJrZWRUeXBlOiBzdHJpbmcgfCBzeW1ib2wsIHByaXZhdGUgbWFya2VkVmFsdWU6IHVua25vd24gPSB0cnVlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHRlc3QoanBJZGVudGlmaWVyOiBJZGVudGlmaWVyLCBqcE1lbWJlcjogc3RyaW5nIHwgc3ltYm9sKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0eXBlb2YganBJZGVudGlmaWVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShqcElkZW50aWZpZXIsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBjb25zdCBtYXJrSW5mbyA9IG1ldGFkYXRhLnJlYWRlcigpLmdldE1lbWJlcnNNYXJrSW5mbyhqcE1lbWJlcik7XG4gICAgICAgIHJldHVybiBtYXJrSW5mb1t0aGlzLm1hcmtlZFR5cGVdID09PSB0aGlzLm1hcmtlZFZhbHVlO1xuICAgIH1cbn1cbmNsYXNzIE1lbWJlck1hdGNoUG9pbnRjdXQgZXh0ZW5kcyBQb2ludGN1dCB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjbGF6ejogTmV3YWJsZTx1bmtub3duPiwgcHJpdmF0ZSByZWdleDogUmVnRXhwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHRlc3QoanBJZGVudGlmaWVyOiBJZGVudGlmaWVyLCBqcE1lbWJlcjogc3RyaW5nIHwgc3ltYm9sKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBqcElkZW50aWZpZXIgPT09IHRoaXMuY2xhenogJiYgdHlwZW9mIGpwTWVtYmVyID09PSAnc3RyaW5nJyAmJiAhIXRoaXMucmVnZXgudGVzdChqcE1lbWJlcik7XG4gICAgfVxufVxuY2xhc3MgQ2xhc3NQb2ludGN1dCBleHRlbmRzIFBvaW50Y3V0IHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNsYXp6OiBOZXdhYmxlPHVua25vd24+KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHRlc3QoanBJZGVudGlmaWVyOiBJZGVudGlmaWVyKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBqcElkZW50aWZpZXIgPT09IHRoaXMuY2xheno7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgUG9pbnRjdXQgfSBmcm9tICcuL1BvaW50Y3V0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4vQWR2aWNlJztcbmltcG9ydCB7IEFzcGVjdE1ldGFkYXRhIH0gZnJvbSAnLi9Bc3BlY3RNZXRhZHRhJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFzcGVjdChcbiAgICBjb21wb25lbnRBc3BlY3RDbGFzczogTmV3YWJsZTx1bmtub3duPixcbiAgICBtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2wsXG4gICAgYWR2aWNlOiBBZHZpY2UsXG4gICAgcG9pbnRjdXQ6IFBvaW50Y3V0XG4pIHtcbiAgICBBc3BlY3RNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLmFwcGVuZChjb21wb25lbnRBc3BlY3RDbGFzcywgbWV0aG9kTmFtZSwgYWR2aWNlLCBwb2ludGN1dCk7XG4gICAgLy8gY29uc3QgQXNwZWN0Q2xhc3MgPSBDb21wb25lbnRNZXRob2RBc3BlY3QuY3JlYXRlKGNvbXBvbmVudEFzcGVjdENsYXNzLCBtZXRob2ROYW1lKTtcbiAgICAvLyBwb2ludGN1dC5nZXRNZXRob2RzTWFwKCkuZm9yRWFjaCgoanBNZW1iZXJzLCBqcENsYXNzKSA9PiB7XG4gICAgLy8gICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoanBDbGFzcywgQU9QQ2xhc3NNZXRhZGF0YSk7XG4gICAgLy8gICAgIGpwTWVtYmVycy5mb3JFYWNoKG1ldGhvZE5hbWUgPT4ge1xuICAgIC8vICAgICAgICAgbWV0YWRhdGEuYXBwZW5kKG1ldGhvZE5hbWUsIGFkdmljZSwgW0FzcGVjdENsYXNzXSk7XG4gICAgLy8gICAgIH0pO1xuICAgIC8vIH0pO1xufVxuIiwiaW1wb3J0IHsgUG9pbnRjdXQgfSBmcm9tICcuLi9Qb2ludGN1dCc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuLi9BZHZpY2UnO1xuaW1wb3J0IHsgYWRkQXNwZWN0IH0gZnJvbSAnLi4vYWRkQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi8uLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIEFmdGVyKHBvaW50Y3V0OiBQb2ludGN1dCk6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgIGFkZEFzcGVjdCh0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTx1bmtub3duPiwgcHJvcGVydHlLZXksIEFkdmljZS5BZnRlciwgcG9pbnRjdXQpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBQb2ludGN1dCB9IGZyb20gJy4uL1BvaW50Y3V0JztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4uL0FkdmljZSc7XG5pbXBvcnQgeyBhZGRBc3BlY3QgfSBmcm9tICcuLi9hZGRBc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uLy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gQWZ0ZXJSZXR1cm4ocG9pbnRjdXQ6IFBvaW50Y3V0KTogTWV0aG9kRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgYWRkQXNwZWN0KHRhcmdldC5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPHVua25vd24+LCBwcm9wZXJ0eUtleSwgQWR2aWNlLkFmdGVyUmV0dXJuLCBwb2ludGN1dCk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi4vUG9pbnRjdXQnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi4vQWR2aWNlJztcbmltcG9ydCB7IGFkZEFzcGVjdCB9IGZyb20gJy4uL2FkZEFzcGVjdCc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBBcm91bmQocG9pbnRjdXQ6IFBvaW50Y3V0KTogTWV0aG9kRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgYWRkQXNwZWN0KHRhcmdldC5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPHVua25vd24+LCBwcm9wZXJ0eUtleSwgQWR2aWNlLkFyb3VuZCwgcG9pbnRjdXQpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBQb2ludGN1dCB9IGZyb20gJy4uL1BvaW50Y3V0JztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4uL0FkdmljZSc7XG5pbXBvcnQgeyBhZGRBc3BlY3QgfSBmcm9tICcuLi9hZGRBc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uLy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gQmVmb3JlKHBvaW50Y3V0OiBQb2ludGN1dCk6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgIGFkZEFzcGVjdCh0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTx1bmtub3duPiwgcHJvcGVydHlLZXksIEFkdmljZS5CZWZvcmUsIHBvaW50Y3V0KTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgUG9pbnRjdXQgfSBmcm9tICcuLi9Qb2ludGN1dCc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuLi9BZHZpY2UnO1xuaW1wb3J0IHsgYWRkQXNwZWN0IH0gZnJvbSAnLi4vYWRkQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi8uLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIEZpbmFsbHkocG9pbnRjdXQ6IFBvaW50Y3V0KTogTWV0aG9kRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgYWRkQXNwZWN0KHRhcmdldC5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPHVua25vd24+LCBwcm9wZXJ0eUtleSwgQWR2aWNlLkZpbmFsbHksIHBvaW50Y3V0KTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgUG9pbnRjdXQgfSBmcm9tICcuLi9Qb2ludGN1dCc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuLi9BZHZpY2UnO1xuaW1wb3J0IHsgYWRkQXNwZWN0IH0gZnJvbSAnLi4vYWRkQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi8uLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIFRocm93bihwb2ludGN1dDogUG9pbnRjdXQpOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICBhZGRBc3BlY3QodGFyZ2V0LmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dW5rbm93bj4sIHByb3BlcnR5S2V5LCBBZHZpY2UuVGhyb3duLCBwb2ludGN1dCk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4uL0FkdmljZSc7XG5pbXBvcnQgeyBBc3BlY3QsIFByb2NlZWRpbmdBc3BlY3QgfSBmcm9tICcuLi9Bc3BlY3QnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi8uLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBBT1BDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vQU9QQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmZ1bmN0aW9uIFVzZUFzcGVjdHMoYWR2aWNlOiBBZHZpY2UuQXJvdW5kLCBhc3BlY3RzOiBBcnJheTxOZXdhYmxlPFByb2NlZWRpbmdBc3BlY3Q+Pik6IE1ldGhvZERlY29yYXRvcjtcbmZ1bmN0aW9uIFVzZUFzcGVjdHMoYWR2aWNlOiBBZHZpY2UsIGFzcGVjdHM6IEFycmF5PE5ld2FibGU8QXNwZWN0Pj4pOiBNZXRob2REZWNvcmF0b3I7XG5mdW5jdGlvbiBVc2VBc3BlY3RzKGFkdmljZTogQWR2aWNlLCBhc3BlY3RzOiBBcnJheTxOZXdhYmxlPEFzcGVjdD4+KTogTWV0aG9kRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgY29uc3QgY2xhenogPSB0YXJnZXQuY29uc3RydWN0b3I7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoY2xhenosIEFPUENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBtZXRhZGF0YS5hcHBlbmQocHJvcGVydHlLZXksIGFkdmljZSwgYXNwZWN0cyk7XG4gICAgfTtcbn1cblxuZXhwb3J0IHsgVXNlQXNwZWN0cyB9O1xuIl0sIm5hbWVzIjpbIkluc3RhbmNlU2NvcGUiLCJSZWZsZWN0IiwiZ2xvYmFsIiwiRXhwcmVzc2lvblR5cGUiLCJMaWZlY3ljbGUiLCJBZHZpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBWUEsK0JBSVg7QUFKRCxDQUFBLFVBQVksYUFBYSxFQUFBO0FBQ3JCLElBQUEsYUFBQSxDQUFBLFdBQUEsQ0FBQSxHQUFBLG9DQUFnRCxDQUFBO0FBQ2hELElBQUEsYUFB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QUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLGFBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU0sUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQWtCLEdBQUEsU0FBQSxDQUFBLFVBQUEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLFNBQUEsQ0FBQSxpQkFBeUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsUUFBZ0IsR0FBQSxTQUFBLENBQUEsUUFBQSxDQUFDLENBQUMsQ0FBQyxTQUFBLENBQUEsT0FBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFP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QUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDOzs7Ozs7OztBQVE1Rjs7QUNkTSxTQUFVLEtBQUssQ0FBQyxRQUFrQixFQUFBO0lBQ3BDLE9BQU8sVUFBVSxNQUFNLEVBQUUsV0FBVyxFQUFBO0FBQ2hDLFFBQUEsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUErQixFQUFFLFdBQVcsRUFBRUssY0FBTSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztBQUMzRixLQUFDLENBQUM7QUFDTjs7QUNKTSxTQUFVLFdBQVcsQ0FBQyxRQUFrQixFQUFBO0lBQzFDLE9BQU8sVUFBVSxNQUFNLEVBQUUsV0FBVyxFQUFBO0FBQ2hDLFFBQUEsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUErQixFQUFFLFdBQVcsRUFBRUEsY0FBTSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNqRyxLQUFDLENBQUM7QUFDTjs7QUNKTSxTQUFVLE1BQU0sQ0FBQyxRQUFrQixFQUFBO0lBQ3JDLE9BQU8sVUFBVSxNQUFNLEVBQUUsV0FBVyxFQUFBO0FBQ2hDLFFBQUEsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUErQixFQUFFLFdBQVcsRUFBRUEsY0FBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM1RixLQUFDLENBQUM7QUFDTjs7QUNKTSxTQUFVLE1BQU0sQ0FBQyxRQUFrQixFQUFBO0lBQ3JDLE9BQU8sVUFBVSxNQUFNLEVBQUUsV0FBVyxFQUFBO0FBQ2hDLFFBQUEsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUErQixFQUFFLFdBQVcsRUFBRUEsY0FBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM1RixLQUFDLENBQUM7QUFDTjs7QUNKTSxTQUFVLE9BQU8sQ0FBQyxRQUFrQixFQUFBO0lBQ3RDLE9BQU8sVUFBVSxNQUFNLEVBQUUsV0FBVyxFQUFBO0FBQ2hDLFFBQUEsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUErQixFQUFFLFdBQVcsRUFBRUEsY0FBTSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM3RixLQUFDLENBQUM7QUFDTjs7QUNKTSxTQUFVLE1BQU0sQ0FBQyxRQUFrQixFQUFBO0lBQ3JDLE9BQU8sVUFBVSxNQUFNLEVBQUUsV0FBVyxFQUFBO0FBQ2hDLFFBQUEsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUErQixFQUFFLFdBQVcsRUFBRUEsY0FBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM1RixLQUFDLENBQUM7QUFDTjs7QUNEQSxTQUFTLFVBQVUsQ0FBQyxNQUFjLEVBQUUsT0FBK0IsRUFBQTtJQUMvRCxPQUFPLFVBQVUsTUFBTSxFQUFFLFdBQVcsRUFBQTtBQUNoQyxRQUFBLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFDakMsSUFBTSxRQUFRLEdBQUcsdUJBQXVCLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzlFLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNsRCxLQUFDLENBQUM7QUFDTjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlsyLDMxXX0=
