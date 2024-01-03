(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.IoC = {}));
})(this, (function (exports) { 'use strict';

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
        GlobalMetadata.getReader = function () {
            return this.getInstance().reader();
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

    exports.ExpressionType = void 0;
    (function (ExpressionType) {
        ExpressionType["ENV"] = "inject-environment-variables";
        ExpressionType["JSON_PATH"] = "inject-json-data";
        ExpressionType["ARGV"] = "inject-argv";
    })(exports.ExpressionType || (exports.ExpressionType = {}));

    var isNodeJs = (function () {
        try {
            eval('require("os").arch();');
            return true;
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
            var globalMetadataReader = GlobalMetadata.getReader();
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
        var beforeAdviceAspects = metadata.getAspectsOf(methodName, exports.Advice.Before).map(ClassToInstance);
        var afterAdviceAspects = metadata.getAspectsOf(methodName, exports.Advice.After).map(ClassToInstance);
        var tryCatchAdviceAspects = metadata.getAspectsOf(methodName, exports.Advice.Thrown).map(ClassToInstance);
        var tryFinallyAdviceAspects = metadata.getAspectsOf(methodName, exports.Advice.Finally).map(ClassToInstance);
        var afterReturnAdviceAspects = metadata.getAspectsOf(methodName, exports.Advice.AfterReturn).map(ClassToInstance);
        var aroundAdviceAspects = metadata.getAspectsOf(methodName, exports.Advice.Around).map(ClassToInstance);
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
            this.factories = new Map();
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
        return ApplicationContext;
    }());

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
        function Pointcut(methodEntries) {
            this.methodEntries = methodEntries;
        }
        Pointcut.combine = function () {
            var ps = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                ps[_i] = arguments[_i];
            }
            return ps.reduce(function (prev, it) {
                return prev.combine(it);
            });
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
            return new Pointcut(entries);
        };
        Pointcut.testMatch = function (cls, regex) {
            var methodNames = getAllMethodMemberNames(cls);
            var matchMethodNames = Array.from(methodNames).filter(function (it) {
                return regex.test(it);
            });
            return Pointcut.of.apply(Pointcut, __spreadArray([cls], __read(matchMethodNames), false));
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
                return Pointcut.combine.apply(Pointcut, __spreadArray([], __read(classes.map(function (cls) { return Pointcut.of.apply(Pointcut, __spreadArray([cls], __read(methodNames), false)); })), false));
            };
            var testMatch = function (regex) {
                return Pointcut.combine.apply(Pointcut, __spreadArray([], __read(classes.map(function (cls) {
                    return Pointcut.testMatch(cls, regex);
                })), false));
            };
            return {
                of: of,
                testMatch: testMatch
            };
        };
        Pointcut.prototype.combine = function (other) {
            var map = new Map(this.methodEntries);
            var otherMap = other.methodEntries;
            otherMap.forEach(function (value, key) {
                var set = map.get(key);
                if (!!set) {
                    value.forEach(function (item) {
                        set.add(item);
                    });
                }
                else {
                    map.set(key, value);
                }
            });
            return new Pointcut(map);
        };
        Pointcut.prototype.getMethodsMap = function () {
            return new Map(this.methodEntries);
        };
        return Pointcut;
    }());

    function addAspect(componentAspectClass, methodName, advice, pointcut) {
        var AspectClass = ComponentMethodAspect.create(componentAspectClass, methodName);
        pointcut.getMethodsMap().forEach(function (jpMembers, jpClass) {
            var metadata = MetadataInstanceManager.getMetadata(jpClass, AOPClassMetadata);
            jpMembers.forEach(function (methodName) {
                metadata.append(methodName, advice, [AspectClass]);
            });
        });
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
    exports.GlobalMetadata = GlobalMetadata;
    exports.Inject = Inject;
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

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudW1kLmpzIiwic291cmNlcyI6WyIuLi9zcmMvZm91bmRhdGlvbi9JbnN0YW5jZVNjb3BlLnRzIiwiLi4vc3JjL2NvbW1vbi9EZWZhdWx0VmFsdWVNYXAudHMiLCIuLi9ub2RlX21vZHVsZXMvcmVmbGVjdC1tZXRhZGF0YS9SZWZsZWN0LmpzIiwiLi4vc3JjL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLnRzIiwiLi4vc3JjL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9TZXJ2aWNlRmFjdG9yeURlZi50cyIsIi4uL3NyYy9tZXRhZGF0YS9HbG9iYWxNZXRhZGF0YS50cyIsIi4uL3NyYy90eXBlcy9FdmFsdWF0ZU9wdGlvbnMudHMiLCIuLi9zcmMvY29tbW9uL2lzTm9kZUpzLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvVmFsdWUudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9Bcmd2LnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvQmluZC50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0Vudi50cyIsIi4uL3NyYy9jb21tb24vaXNOb3REZWZpbmVkLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvRmFjdG9yeS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0luamVjdC50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0luc3RBd2FyZVByb2Nlc3Nvci50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL0pTT05EYXRhLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvTGlmZWN5Y2xlRGVjb3JhdG9yLnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvTWFyay50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0xpZmVjeWNsZS50cyIsIi4uL3NyYy9kZWNvcmF0b3JzL1Bvc3RJbmplY3QudHMiLCIuLi9zcmMvZGVjb3JhdG9ycy9QcmVEZXN0cm95LnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvUHJlSW5qZWN0LnRzIiwiLi4vc3JjL2RlY29yYXRvcnMvU2NvcGUudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9FdmVudEVtaXR0ZXIudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9JbnZva2VGdW5jdGlvbk9wdGlvbnMudHMiLCIuLi9ub2RlX21vZHVsZXMvQHZnZXJib3QvbGF6eS9kaXN0L2luZGV4LmNqcy5qcyIsIi4uL3NyYy9mb3VuZGF0aW9uL0xpZmVjeWNsZU1hbmFnZXIudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9Db21wb25lbnRJbnN0YW5jZUJ1aWxkZXIudHMiLCIuLi9zcmMvbWV0YWRhdGEvRnVuY3Rpb25NZXRhZGF0YS50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0NvbXBvbmVudEluc3RhbmNlV3JhcHBlci50cyIsIi4uL3NyYy9jb21tb24vaW52b2tlUHJlRGVzdHJveS50cyIsIi4uL3NyYy9yZXNvbHV0aW9uL1NpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbi50cyIsIi4uL3NyYy9yZXNvbHV0aW9uL0dsb2JhbFNoYXJlZEluc3RhbmNlUmVzb2x1dGlvbi50cyIsIi4uL3NyYy9yZXNvbHV0aW9uL1RyYW5zaWVudEluc3RhbmNlUmVzb2x1dGlvbi50cyIsIi4uL3NyYy9ldmFsdWF0b3IvSlNPTkRhdGFFdmFsdWF0b3IudHMiLCIuLi9zcmMvZXZhbHVhdG9yL0Vudmlyb25tZW50RXZhbHVhdG9yLnRzIiwiLi4vc3JjL2V2YWx1YXRvci9Bcmd2RXZhbHVhdG9yLnRzIiwiLi4vc3JjL2FvcC9BZHZpY2UudHMiLCIuLi9zcmMvYW9wL0FzcGVjdFV0aWxzLnRzIiwiLi4vc3JjL2FvcC9jcmVhdGVBc3BlY3QudHMiLCIuLi9zcmMvYW9wL0FPUENsYXNzTWV0YWRhdGEudHMiLCIuLi9zcmMvYW9wL0FPUEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvci50cyIsIi4uL3NyYy9mb3VuZGF0aW9uL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXIudHMiLCIuLi9zcmMvZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQudHMiLCIuLi9zcmMvYW9wL0NvbXBvbmVudE1ldGhvZEFzcGVjdC50cyIsIi4uL3NyYy9jb21tb24vZ2V0QWxsTWV0aG9kTWVtYmVyTmFtZXMudHMiLCIuLi9zcmMvYW9wL1BvaW50Y3V0LnRzIiwiLi4vc3JjL2FvcC9hZGRBc3BlY3QudHMiLCIuLi9zcmMvYW9wL2RlY29yYXRvcnMvQWZ0ZXIudHMiLCIuLi9zcmMvYW9wL2RlY29yYXRvcnMvQWZ0ZXJSZXR1cm4udHMiLCIuLi9zcmMvYW9wL2RlY29yYXRvcnMvQXJvdW5kLnRzIiwiLi4vc3JjL2FvcC9kZWNvcmF0b3JzL0JlZm9yZS50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9GaW5hbGx5LnRzIiwiLi4vc3JjL2FvcC9kZWNvcmF0b3JzL1Rocm93bi50cyIsIi4uL3NyYy9hb3AvZGVjb3JhdG9ycy9Vc2VBc3BlY3RzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBlbnVtIEluc3RhbmNlU2NvcGUge1xuICAgIFNJTkdMRVRPTiA9ICdpb2MtcmVzb2x1dGlvbjpjb250YWluZXItc2luZ2xldG9uJyxcbiAgICBUUkFOU0lFTlQgPSAnaW9jLXJlc29sdXRpb246dHJhbnNpZW50JyxcbiAgICBHTE9CQUxfU0hBUkVEX1NJTkdMRVRPTiA9ICdpb2MtcmVzb2x1dGlvbjpnbG9iYWwtc2hhcmVkLXNpbmdsZXRvbidcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBjcmVhdGVEZWZhdWx0VmFsdWVNYXA8SywgVj4oZmFjdG9yeTogKGtleTogSykgPT4gVikge1xuICAgIGNvbnN0IG1hcCA9IG5ldyBNYXA8SywgVj4oKTtcbiAgICBjb25zdCBvcmlnaW5HZXQgPSBtYXAuZ2V0LmJpbmQobWFwKTtcbiAgICBtYXAuZ2V0ID0gZnVuY3Rpb24gKGtleTogSykge1xuICAgICAgICBpZiAobWFwLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICByZXR1cm4gb3JpZ2luR2V0KGtleSkgYXMgVjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IGZhY3Rvcnkoa2V5KTtcbiAgICAgICAgICAgIG1hcC5zZXQoa2V5LCBkZWZhdWx0VmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIG1hcC5nZXQoa2V5KSBhcyBWO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gbWFwIGFzIERlZmF1bHRWYWx1ZU1hcDxLLCBWPjtcbn1cbmV4cG9ydCB0eXBlIERlZmF1bHRWYWx1ZU1hcDxLLCBWPiA9IE9taXQ8TWFwPEssIFY+LCAnZ2V0Jz4gJiB7XG4gICAgZ2V0OiAoa2V5OiBLKSA9PiBWO1xufTtcbiIsIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuQ29weXJpZ2h0IChDKSBNaWNyb3NvZnQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cblxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xudmFyIFJlZmxlY3Q7XG4oZnVuY3Rpb24gKFJlZmxlY3QpIHtcbiAgICAvLyBNZXRhZGF0YSBQcm9wb3NhbFxuICAgIC8vIGh0dHBzOi8vcmJ1Y2t0b24uZ2l0aHViLmlvL3JlZmxlY3QtbWV0YWRhdGEvXG4gICAgKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gICAgICAgIHZhciByb290ID0gdHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiA/IGdsb2JhbCA6XG4gICAgICAgICAgICB0eXBlb2Ygc2VsZiA9PT0gXCJvYmplY3RcIiA/IHNlbGYgOlxuICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzID09PSBcIm9iamVjdFwiID8gdGhpcyA6XG4gICAgICAgICAgICAgICAgICAgIEZ1bmN0aW9uKFwicmV0dXJuIHRoaXM7XCIpKCk7XG4gICAgICAgIHZhciBleHBvcnRlciA9IG1ha2VFeHBvcnRlcihSZWZsZWN0KTtcbiAgICAgICAgaWYgKHR5cGVvZiByb290LlJlZmxlY3QgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJvb3QuUmVmbGVjdCA9IFJlZmxlY3Q7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBleHBvcnRlciA9IG1ha2VFeHBvcnRlcihyb290LlJlZmxlY3QsIGV4cG9ydGVyKTtcbiAgICAgICAgfVxuICAgICAgICBmYWN0b3J5KGV4cG9ydGVyKTtcbiAgICAgICAgZnVuY3Rpb24gbWFrZUV4cG9ydGVyKHRhcmdldCwgcHJldmlvdXMpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0W2tleV0gIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHsgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocHJldmlvdXMpXG4gICAgICAgICAgICAgICAgICAgIHByZXZpb3VzKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0pKGZ1bmN0aW9uIChleHBvcnRlcikge1xuICAgICAgICB2YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgICAgICAgLy8gZmVhdHVyZSB0ZXN0IGZvciBTeW1ib2wgc3VwcG9ydFxuICAgICAgICB2YXIgc3VwcG9ydHNTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCI7XG4gICAgICAgIHZhciB0b1ByaW1pdGl2ZVN5bWJvbCA9IHN1cHBvcnRzU3ltYm9sICYmIHR5cGVvZiBTeW1ib2wudG9QcmltaXRpdmUgIT09IFwidW5kZWZpbmVkXCIgPyBTeW1ib2wudG9QcmltaXRpdmUgOiBcIkBAdG9QcmltaXRpdmVcIjtcbiAgICAgICAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gc3VwcG9ydHNTeW1ib2wgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciAhPT0gXCJ1bmRlZmluZWRcIiA/IFN5bWJvbC5pdGVyYXRvciA6IFwiQEBpdGVyYXRvclwiO1xuICAgICAgICB2YXIgc3VwcG9ydHNDcmVhdGUgPSB0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gXCJmdW5jdGlvblwiOyAvLyBmZWF0dXJlIHRlc3QgZm9yIE9iamVjdC5jcmVhdGUgc3VwcG9ydFxuICAgICAgICB2YXIgc3VwcG9ydHNQcm90byA9IHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXk7IC8vIGZlYXR1cmUgdGVzdCBmb3IgX19wcm90b19fIHN1cHBvcnRcbiAgICAgICAgdmFyIGRvd25MZXZlbCA9ICFzdXBwb3J0c0NyZWF0ZSAmJiAhc3VwcG9ydHNQcm90bztcbiAgICAgICAgdmFyIEhhc2hNYXAgPSB7XG4gICAgICAgICAgICAvLyBjcmVhdGUgYW4gb2JqZWN0IGluIGRpY3Rpb25hcnkgbW9kZSAoYS5rLmEuIFwic2xvd1wiIG1vZGUgaW4gdjgpXG4gICAgICAgICAgICBjcmVhdGU6IHN1cHBvcnRzQ3JlYXRlXG4gICAgICAgICAgICAgICAgPyBmdW5jdGlvbiAoKSB7IHJldHVybiBNYWtlRGljdGlvbmFyeShPYmplY3QuY3JlYXRlKG51bGwpKTsgfVxuICAgICAgICAgICAgICAgIDogc3VwcG9ydHNQcm90b1xuICAgICAgICAgICAgICAgICAgICA/IGZ1bmN0aW9uICgpIHsgcmV0dXJuIE1ha2VEaWN0aW9uYXJ5KHsgX19wcm90b19fOiBudWxsIH0pOyB9XG4gICAgICAgICAgICAgICAgICAgIDogZnVuY3Rpb24gKCkgeyByZXR1cm4gTWFrZURpY3Rpb25hcnkoe30pOyB9LFxuICAgICAgICAgICAgaGFzOiBkb3duTGV2ZWxcbiAgICAgICAgICAgICAgICA/IGZ1bmN0aW9uIChtYXAsIGtleSkgeyByZXR1cm4gaGFzT3duLmNhbGwobWFwLCBrZXkpOyB9XG4gICAgICAgICAgICAgICAgOiBmdW5jdGlvbiAobWFwLCBrZXkpIHsgcmV0dXJuIGtleSBpbiBtYXA7IH0sXG4gICAgICAgICAgICBnZXQ6IGRvd25MZXZlbFxuICAgICAgICAgICAgICAgID8gZnVuY3Rpb24gKG1hcCwga2V5KSB7IHJldHVybiBoYXNPd24uY2FsbChtYXAsIGtleSkgPyBtYXBba2V5XSA6IHVuZGVmaW5lZDsgfVxuICAgICAgICAgICAgICAgIDogZnVuY3Rpb24gKG1hcCwga2V5KSB7IHJldHVybiBtYXBba2V5XTsgfSxcbiAgICAgICAgfTtcbiAgICAgICAgLy8gTG9hZCBnbG9iYWwgb3Igc2hpbSB2ZXJzaW9ucyBvZiBNYXAsIFNldCwgYW5kIFdlYWtNYXBcbiAgICAgICAgdmFyIGZ1bmN0aW9uUHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKEZ1bmN0aW9uKTtcbiAgICAgICAgdmFyIHVzZVBvbHlmaWxsID0gdHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgcHJvY2Vzcy5lbnYgJiYgcHJvY2Vzcy5lbnZbXCJSRUZMRUNUX01FVEFEQVRBX1VTRV9NQVBfUE9MWUZJTExcIl0gPT09IFwidHJ1ZVwiO1xuICAgICAgICB2YXIgX01hcCA9ICF1c2VQb2x5ZmlsbCAmJiB0eXBlb2YgTWFwID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIE1hcC5wcm90b3R5cGUuZW50cmllcyA9PT0gXCJmdW5jdGlvblwiID8gTWFwIDogQ3JlYXRlTWFwUG9seWZpbGwoKTtcbiAgICAgICAgdmFyIF9TZXQgPSAhdXNlUG9seWZpbGwgJiYgdHlwZW9mIFNldCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTZXQucHJvdG90eXBlLmVudHJpZXMgPT09IFwiZnVuY3Rpb25cIiA/IFNldCA6IENyZWF0ZVNldFBvbHlmaWxsKCk7XG4gICAgICAgIHZhciBfV2Vha01hcCA9ICF1c2VQb2x5ZmlsbCAmJiB0eXBlb2YgV2Vha01hcCA9PT0gXCJmdW5jdGlvblwiID8gV2Vha01hcCA6IENyZWF0ZVdlYWtNYXBQb2x5ZmlsbCgpO1xuICAgICAgICAvLyBbW01ldGFkYXRhXV0gaW50ZXJuYWwgc2xvdFxuICAgICAgICAvLyBodHRwczovL3JidWNrdG9uLmdpdGh1Yi5pby9yZWZsZWN0LW1ldGFkYXRhLyNvcmRpbmFyeS1vYmplY3QtaW50ZXJuYWwtbWV0aG9kcy1hbmQtaW50ZXJuYWwtc2xvdHNcbiAgICAgICAgdmFyIE1ldGFkYXRhID0gbmV3IF9XZWFrTWFwKCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBcHBsaWVzIGEgc2V0IG9mIGRlY29yYXRvcnMgdG8gYSBwcm9wZXJ0eSBvZiBhIHRhcmdldCBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSBkZWNvcmF0b3JzIEFuIGFycmF5IG9mIGRlY29yYXRvcnMuXG4gICAgICAgICAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSBwcm9wZXJ0eUtleSAoT3B0aW9uYWwpIFRoZSBwcm9wZXJ0eSBrZXkgdG8gZGVjb3JhdGUuXG4gICAgICAgICAqIEBwYXJhbSBhdHRyaWJ1dGVzIChPcHRpb25hbCkgVGhlIHByb3BlcnR5IGRlc2NyaXB0b3IgZm9yIHRoZSB0YXJnZXQga2V5LlxuICAgICAgICAgKiBAcmVtYXJrcyBEZWNvcmF0b3JzIGFyZSBhcHBsaWVkIGluIHJldmVyc2Ugb3JkZXIuXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqXG4gICAgICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcbiAgICAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eSBkZWNsYXJhdGlvbnMgYXJlIG5vdCBwYXJ0IG9mIEVTNiwgdGhvdWdoIHRoZXkgYXJlIHZhbGlkIGluIFR5cGVTY3JpcHQ6XG4gICAgICAgICAqICAgICAgICAgLy8gc3RhdGljIHN0YXRpY1Byb3BlcnR5O1xuICAgICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5O1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgICAgIGNvbnN0cnVjdG9yKHApIHsgfVxuICAgICAgICAgKiAgICAgICAgIHN0YXRpYyBzdGF0aWNNZXRob2QocCkgeyB9XG4gICAgICAgICAqICAgICAgICAgbWV0aG9kKHApIHsgfVxuICAgICAgICAgKiAgICAgfVxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gY29uc3RydWN0b3JcbiAgICAgICAgICogICAgIEV4YW1wbGUgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnNBcnJheSwgRXhhbXBsZSk7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gY29uc3RydWN0b3IpXG4gICAgICAgICAqICAgICBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnNBcnJheSwgRXhhbXBsZSwgXCJzdGF0aWNQcm9wZXJ0eVwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBwcm90b3R5cGUpXG4gICAgICAgICAqICAgICBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnNBcnJheSwgRXhhbXBsZS5wcm90b3R5cGUsIFwicHJvcGVydHlcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBtZXRob2QgKG9uIGNvbnN0cnVjdG9yKVxuICAgICAgICAgKiAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEV4YW1wbGUsIFwic3RhdGljTWV0aG9kXCIsXG4gICAgICAgICAqICAgICAgICAgUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzQXJyYXksIEV4YW1wbGUsIFwic3RhdGljTWV0aG9kXCIsXG4gICAgICAgICAqICAgICAgICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoRXhhbXBsZSwgXCJzdGF0aWNNZXRob2RcIikpKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIG1ldGhvZCAob24gcHJvdG90eXBlKVxuICAgICAgICAgKiAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiLFxuICAgICAgICAgKiAgICAgICAgIFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9yc0FycmF5LCBFeGFtcGxlLnByb3RvdHlwZSwgXCJtZXRob2RcIixcbiAgICAgICAgICogICAgICAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihFeGFtcGxlLnByb3RvdHlwZSwgXCJtZXRob2RcIikpKTtcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwgcHJvcGVydHlLZXksIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGlmICghSXNVbmRlZmluZWQocHJvcGVydHlLZXkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFJc0FycmF5KGRlY29yYXRvcnMpKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICAgICAgaWYgKCFJc09iamVjdCh0YXJnZXQpKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICAgICAgaWYgKCFJc09iamVjdChhdHRyaWJ1dGVzKSAmJiAhSXNVbmRlZmluZWQoYXR0cmlidXRlcykgJiYgIUlzTnVsbChhdHRyaWJ1dGVzKSlcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICAgICAgICAgIGlmIChJc051bGwoYXR0cmlidXRlcykpXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgcHJvcGVydHlLZXkgPSBUb1Byb3BlcnR5S2V5KHByb3BlcnR5S2V5KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gRGVjb3JhdGVQcm9wZXJ0eShkZWNvcmF0b3JzLCB0YXJnZXQsIHByb3BlcnR5S2V5LCBhdHRyaWJ1dGVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghSXNBcnJheShkZWNvcmF0b3JzKSlcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICAgICAgICAgIGlmICghSXNDb25zdHJ1Y3Rvcih0YXJnZXQpKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIERlY29yYXRlQ29uc3RydWN0b3IoZGVjb3JhdG9ycywgdGFyZ2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBleHBvcnRlcihcImRlY29yYXRlXCIsIGRlY29yYXRlKTtcbiAgICAgICAgLy8gNC4xLjIgUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSlcbiAgICAgICAgLy8gaHR0cHM6Ly9yYnVja3Rvbi5naXRodWIuaW8vcmVmbGVjdC1tZXRhZGF0YS8jcmVmbGVjdC5tZXRhZGF0YVxuICAgICAgICAvKipcbiAgICAgICAgICogQSBkZWZhdWx0IG1ldGFkYXRhIGRlY29yYXRvciBmYWN0b3J5IHRoYXQgY2FuIGJlIHVzZWQgb24gYSBjbGFzcywgY2xhc3MgbWVtYmVyLCBvciBwYXJhbWV0ZXIuXG4gICAgICAgICAqIEBwYXJhbSBtZXRhZGF0YUtleSBUaGUga2V5IGZvciB0aGUgbWV0YWRhdGEgZW50cnkuXG4gICAgICAgICAqIEBwYXJhbSBtZXRhZGF0YVZhbHVlIFRoZSB2YWx1ZSBmb3IgdGhlIG1ldGFkYXRhIGVudHJ5LlxuICAgICAgICAgKiBAcmV0dXJucyBBIGRlY29yYXRvciBmdW5jdGlvbi5cbiAgICAgICAgICogQHJlbWFya3NcbiAgICAgICAgICogSWYgYG1ldGFkYXRhS2V5YCBpcyBhbHJlYWR5IGRlZmluZWQgZm9yIHRoZSB0YXJnZXQgYW5kIHRhcmdldCBrZXksIHRoZVxuICAgICAgICAgKiBtZXRhZGF0YVZhbHVlIGZvciB0aGF0IGtleSB3aWxsIGJlIG92ZXJ3cml0dGVuLlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gY29uc3RydWN0b3JcbiAgICAgICAgICogICAgIEBSZWZsZWN0Lm1ldGFkYXRhKGtleSwgdmFsdWUpXG4gICAgICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcbiAgICAgICAgICogICAgIH1cbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBjb25zdHJ1Y3RvciwgVHlwZVNjcmlwdCBvbmx5KVxuICAgICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XG4gICAgICAgICAqICAgICAgICAgQFJlZmxlY3QubWV0YWRhdGEoa2V5LCB2YWx1ZSlcbiAgICAgICAgICogICAgICAgICBzdGF0aWMgc3RhdGljUHJvcGVydHk7XG4gICAgICAgICAqICAgICB9XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gcHJvdG90eXBlLCBUeXBlU2NyaXB0IG9ubHkpXG4gICAgICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcbiAgICAgICAgICogICAgICAgICBAUmVmbGVjdC5tZXRhZGF0YShrZXksIHZhbHVlKVxuICAgICAgICAgKiAgICAgICAgIHByb3BlcnR5O1xuICAgICAgICAgKiAgICAgfVxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBjb25zdHJ1Y3RvcilcbiAgICAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xuICAgICAgICAgKiAgICAgICAgIEBSZWZsZWN0Lm1ldGFkYXRhKGtleSwgdmFsdWUpXG4gICAgICAgICAqICAgICAgICAgc3RhdGljIHN0YXRpY01ldGhvZCgpIHsgfVxuICAgICAgICAgKiAgICAgfVxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBwcm90b3R5cGUpXG4gICAgICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcbiAgICAgICAgICogICAgICAgICBAUmVmbGVjdC5tZXRhZGF0YShrZXksIHZhbHVlKVxuICAgICAgICAgKiAgICAgICAgIG1ldGhvZCgpIHsgfVxuICAgICAgICAgKiAgICAgfVxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGRlY29yYXRvcih0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFJc09iamVjdCh0YXJnZXQpKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICAgICAgaWYgKCFJc1VuZGVmaW5lZChwcm9wZXJ0eUtleSkgJiYgIUlzUHJvcGVydHlLZXkocHJvcGVydHlLZXkpKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICAgICAgT3JkaW5hcnlEZWZpbmVPd25NZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSwgdGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGVjb3JhdG9yO1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydGVyKFwibWV0YWRhdGFcIiwgbWV0YWRhdGEpO1xuICAgICAgICAvKipcbiAgICAgICAgICogRGVmaW5lIGEgdW5pcXVlIG1ldGFkYXRhIGVudHJ5IG9uIHRoZSB0YXJnZXQuXG4gICAgICAgICAqIEBwYXJhbSBtZXRhZGF0YUtleSBBIGtleSB1c2VkIHRvIHN0b3JlIGFuZCByZXRyaWV2ZSBtZXRhZGF0YS5cbiAgICAgICAgICogQHBhcmFtIG1ldGFkYXRhVmFsdWUgQSB2YWx1ZSB0aGF0IGNvbnRhaW5zIGF0dGFjaGVkIG1ldGFkYXRhLlxuICAgICAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IG9uIHdoaWNoIHRvIGRlZmluZSBtZXRhZGF0YS5cbiAgICAgICAgICogQHBhcmFtIHByb3BlcnR5S2V5IChPcHRpb25hbCkgVGhlIHByb3BlcnR5IGtleSBmb3IgdGhlIHRhcmdldC5cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xuICAgICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5IGRlY2xhcmF0aW9ucyBhcmUgbm90IHBhcnQgb2YgRVM2LCB0aG91Z2ggdGhleSBhcmUgdmFsaWQgaW4gVHlwZVNjcmlwdDpcbiAgICAgICAgICogICAgICAgICAvLyBzdGF0aWMgc3RhdGljUHJvcGVydHk7XG4gICAgICAgICAqICAgICAgICAgLy8gcHJvcGVydHk7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAgICAgY29uc3RydWN0b3IocCkgeyB9XG4gICAgICAgICAqICAgICAgICAgc3RhdGljIHN0YXRpY01ldGhvZChwKSB7IH1cbiAgICAgICAgICogICAgICAgICBtZXRob2QocCkgeyB9XG4gICAgICAgICAqICAgICB9XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBjb25zdHJ1Y3RvclxuICAgICAgICAgKiAgICAgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIG9wdGlvbnMsIEV4YW1wbGUpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIGNvbnN0cnVjdG9yKVxuICAgICAgICAgKiAgICAgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIG9wdGlvbnMsIEV4YW1wbGUsIFwic3RhdGljUHJvcGVydHlcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gcHJvdG90eXBlKVxuICAgICAgICAgKiAgICAgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIG9wdGlvbnMsIEV4YW1wbGUucHJvdG90eXBlLCBcInByb3BlcnR5XCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBjb25zdHJ1Y3RvcilcbiAgICAgICAgICogICAgIFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBvcHRpb25zLCBFeGFtcGxlLCBcInN0YXRpY01ldGhvZFwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIG1ldGhvZCAob24gcHJvdG90eXBlKVxuICAgICAgICAgKiAgICAgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIG9wdGlvbnMsIEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIGRlY29yYXRvciBmYWN0b3J5IGFzIG1ldGFkYXRhLXByb2R1Y2luZyBhbm5vdGF0aW9uLlxuICAgICAgICAgKiAgICAgZnVuY3Rpb24gTXlBbm5vdGF0aW9uKG9wdGlvbnMpOiBEZWNvcmF0b3Ige1xuICAgICAgICAgKiAgICAgICAgIHJldHVybiAodGFyZ2V0LCBrZXk/KSA9PiBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgb3B0aW9ucywgdGFyZ2V0LCBrZXkpO1xuICAgICAgICAgKiAgICAgfVxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZGVmaW5lTWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUsIHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgICAgIGlmICghSXNPYmplY3QodGFyZ2V0KSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICBpZiAoIUlzVW5kZWZpbmVkKHByb3BlcnR5S2V5KSlcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eUtleSA9IFRvUHJvcGVydHlLZXkocHJvcGVydHlLZXkpO1xuICAgICAgICAgICAgcmV0dXJuIE9yZGluYXJ5RGVmaW5lT3duTWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUsIHRhcmdldCwgcHJvcGVydHlLZXkpO1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydGVyKFwiZGVmaW5lTWV0YWRhdGFcIiwgZGVmaW5lTWV0YWRhdGEpO1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0cyBhIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0aGUgdGFyZ2V0IG9iamVjdCBvciBpdHMgcHJvdG90eXBlIGNoYWluIGhhcyB0aGUgcHJvdmlkZWQgbWV0YWRhdGEga2V5IGRlZmluZWQuXG4gICAgICAgICAqIEBwYXJhbSBtZXRhZGF0YUtleSBBIGtleSB1c2VkIHRvIHN0b3JlIGFuZCByZXRyaWV2ZSBtZXRhZGF0YS5cbiAgICAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCBvbiB3aGljaCB0aGUgbWV0YWRhdGEgaXMgZGVmaW5lZC5cbiAgICAgICAgICogQHBhcmFtIHByb3BlcnR5S2V5IChPcHRpb25hbCkgVGhlIHByb3BlcnR5IGtleSBmb3IgdGhlIHRhcmdldC5cbiAgICAgICAgICogQHJldHVybnMgYHRydWVgIGlmIHRoZSBtZXRhZGF0YSBrZXkgd2FzIGRlZmluZWQgb24gdGhlIHRhcmdldCBvYmplY3Qgb3IgaXRzIHByb3RvdHlwZSBjaGFpbjsgb3RoZXJ3aXNlLCBgZmFsc2VgLlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XG4gICAgICAgICAqICAgICAgICAgLy8gcHJvcGVydHkgZGVjbGFyYXRpb25zIGFyZSBub3QgcGFydCBvZiBFUzYsIHRob3VnaCB0aGV5IGFyZSB2YWxpZCBpbiBUeXBlU2NyaXB0OlxuICAgICAgICAgKiAgICAgICAgIC8vIHN0YXRpYyBzdGF0aWNQcm9wZXJ0eTtcbiAgICAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgICAgICBjb25zdHJ1Y3RvcihwKSB7IH1cbiAgICAgICAgICogICAgICAgICBzdGF0aWMgc3RhdGljTWV0aG9kKHApIHsgfVxuICAgICAgICAgKiAgICAgICAgIG1ldGhvZChwKSB7IH1cbiAgICAgICAgICogICAgIH1cbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0Lmhhc01ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZSk7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gY29uc3RydWN0b3IpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0Lmhhc01ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZSwgXCJzdGF0aWNQcm9wZXJ0eVwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBwcm90b3R5cGUpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0Lmhhc01ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZS5wcm90b3R5cGUsIFwicHJvcGVydHlcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBtZXRob2QgKG9uIGNvbnN0cnVjdG9yKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5oYXNNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUsIFwic3RhdGljTWV0aG9kXCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBwcm90b3R5cGUpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0Lmhhc01ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZS5wcm90b3R5cGUsIFwibWV0aG9kXCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gaGFzTWV0YWRhdGEobWV0YWRhdGFLZXksIHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgICAgIGlmICghSXNPYmplY3QodGFyZ2V0KSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICBpZiAoIUlzVW5kZWZpbmVkKHByb3BlcnR5S2V5KSlcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eUtleSA9IFRvUHJvcGVydHlLZXkocHJvcGVydHlLZXkpO1xuICAgICAgICAgICAgcmV0dXJuIE9yZGluYXJ5SGFzTWV0YWRhdGEobWV0YWRhdGFLZXksIHRhcmdldCwgcHJvcGVydHlLZXkpO1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydGVyKFwiaGFzTWV0YWRhdGFcIiwgaGFzTWV0YWRhdGEpO1xuICAgICAgICAvKipcbiAgICAgICAgICogR2V0cyBhIHZhbHVlIGluZGljYXRpbmcgd2hldGhlciB0aGUgdGFyZ2V0IG9iamVjdCBoYXMgdGhlIHByb3ZpZGVkIG1ldGFkYXRhIGtleSBkZWZpbmVkLlxuICAgICAgICAgKiBAcGFyYW0gbWV0YWRhdGFLZXkgQSBrZXkgdXNlZCB0byBzdG9yZSBhbmQgcmV0cmlldmUgbWV0YWRhdGEuXG4gICAgICAgICAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3Qgb24gd2hpY2ggdGhlIG1ldGFkYXRhIGlzIGRlZmluZWQuXG4gICAgICAgICAqIEBwYXJhbSBwcm9wZXJ0eUtleSAoT3B0aW9uYWwpIFRoZSBwcm9wZXJ0eSBrZXkgZm9yIHRoZSB0YXJnZXQuXG4gICAgICAgICAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgbWV0YWRhdGEga2V5IHdhcyBkZWZpbmVkIG9uIHRoZSB0YXJnZXQgb2JqZWN0OyBvdGhlcndpc2UsIGBmYWxzZWAuXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqXG4gICAgICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcbiAgICAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eSBkZWNsYXJhdGlvbnMgYXJlIG5vdCBwYXJ0IG9mIEVTNiwgdGhvdWdoIHRoZXkgYXJlIHZhbGlkIGluIFR5cGVTY3JpcHQ6XG4gICAgICAgICAqICAgICAgICAgLy8gc3RhdGljIHN0YXRpY1Byb3BlcnR5O1xuICAgICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5O1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgICAgIGNvbnN0cnVjdG9yKHApIHsgfVxuICAgICAgICAgKiAgICAgICAgIHN0YXRpYyBzdGF0aWNNZXRob2QocCkgeyB9XG4gICAgICAgICAqICAgICAgICAgbWV0aG9kKHApIHsgfVxuICAgICAgICAgKiAgICAgfVxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gY29uc3RydWN0b3JcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuaGFzT3duTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBjb25zdHJ1Y3RvcilcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuaGFzT3duTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLCBcInN0YXRpY1Byb3BlcnR5XCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIHByb3RvdHlwZSlcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuaGFzT3duTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLnByb3RvdHlwZSwgXCJwcm9wZXJ0eVwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIG1ldGhvZCAob24gY29uc3RydWN0b3IpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0Lmhhc093bk1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZSwgXCJzdGF0aWNNZXRob2RcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBtZXRob2QgKG9uIHByb3RvdHlwZSlcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuaGFzT3duTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLnByb3RvdHlwZSwgXCJtZXRob2RcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBoYXNPd25NZXRhZGF0YShtZXRhZGF0YUtleSwgdGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICAgICAgaWYgKCFJc09iamVjdCh0YXJnZXQpKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgIGlmICghSXNVbmRlZmluZWQocHJvcGVydHlLZXkpKVxuICAgICAgICAgICAgICAgIHByb3BlcnR5S2V5ID0gVG9Qcm9wZXJ0eUtleShwcm9wZXJ0eUtleSk7XG4gICAgICAgICAgICByZXR1cm4gT3JkaW5hcnlIYXNPd25NZXRhZGF0YShtZXRhZGF0YUtleSwgdGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0ZXIoXCJoYXNPd25NZXRhZGF0YVwiLCBoYXNPd25NZXRhZGF0YSk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXRzIHRoZSBtZXRhZGF0YSB2YWx1ZSBmb3IgdGhlIHByb3ZpZGVkIG1ldGFkYXRhIGtleSBvbiB0aGUgdGFyZ2V0IG9iamVjdCBvciBpdHMgcHJvdG90eXBlIGNoYWluLlxuICAgICAgICAgKiBAcGFyYW0gbWV0YWRhdGFLZXkgQSBrZXkgdXNlZCB0byBzdG9yZSBhbmQgcmV0cmlldmUgbWV0YWRhdGEuXG4gICAgICAgICAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3Qgb24gd2hpY2ggdGhlIG1ldGFkYXRhIGlzIGRlZmluZWQuXG4gICAgICAgICAqIEBwYXJhbSBwcm9wZXJ0eUtleSAoT3B0aW9uYWwpIFRoZSBwcm9wZXJ0eSBrZXkgZm9yIHRoZSB0YXJnZXQuXG4gICAgICAgICAqIEByZXR1cm5zIFRoZSBtZXRhZGF0YSB2YWx1ZSBmb3IgdGhlIG1ldGFkYXRhIGtleSBpZiBmb3VuZDsgb3RoZXJ3aXNlLCBgdW5kZWZpbmVkYC5cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xuICAgICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5IGRlY2xhcmF0aW9ucyBhcmUgbm90IHBhcnQgb2YgRVM2LCB0aG91Z2ggdGhleSBhcmUgdmFsaWQgaW4gVHlwZVNjcmlwdDpcbiAgICAgICAgICogICAgICAgICAvLyBzdGF0aWMgc3RhdGljUHJvcGVydHk7XG4gICAgICAgICAqICAgICAgICAgLy8gcHJvcGVydHk7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAgICAgY29uc3RydWN0b3IocCkgeyB9XG4gICAgICAgICAqICAgICAgICAgc3RhdGljIHN0YXRpY01ldGhvZChwKSB7IH1cbiAgICAgICAgICogICAgICAgICBtZXRob2QocCkgeyB9XG4gICAgICAgICAqICAgICB9XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBjb25zdHJ1Y3RvclxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIGNvbnN0cnVjdG9yKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUsIFwic3RhdGljUHJvcGVydHlcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gcHJvdG90eXBlKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUucHJvdG90eXBlLCBcInByb3BlcnR5XCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBjb25zdHJ1Y3RvcilcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLCBcInN0YXRpY01ldGhvZFwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIG1ldGhvZCAob24gcHJvdG90eXBlKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRNZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldE1ldGFkYXRhKG1ldGFkYXRhS2V5LCB0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgICAgICBpZiAoIUlzT2JqZWN0KHRhcmdldCkpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICAgICAgaWYgKCFJc1VuZGVmaW5lZChwcm9wZXJ0eUtleSkpXG4gICAgICAgICAgICAgICAgcHJvcGVydHlLZXkgPSBUb1Byb3BlcnR5S2V5KHByb3BlcnR5S2V5KTtcbiAgICAgICAgICAgIHJldHVybiBPcmRpbmFyeUdldE1ldGFkYXRhKG1ldGFkYXRhS2V5LCB0YXJnZXQsIHByb3BlcnR5S2V5KTtcbiAgICAgICAgfVxuICAgICAgICBleHBvcnRlcihcImdldE1ldGFkYXRhXCIsIGdldE1ldGFkYXRhKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldHMgdGhlIG1ldGFkYXRhIHZhbHVlIGZvciB0aGUgcHJvdmlkZWQgbWV0YWRhdGEga2V5IG9uIHRoZSB0YXJnZXQgb2JqZWN0LlxuICAgICAgICAgKiBAcGFyYW0gbWV0YWRhdGFLZXkgQSBrZXkgdXNlZCB0byBzdG9yZSBhbmQgcmV0cmlldmUgbWV0YWRhdGEuXG4gICAgICAgICAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3Qgb24gd2hpY2ggdGhlIG1ldGFkYXRhIGlzIGRlZmluZWQuXG4gICAgICAgICAqIEBwYXJhbSBwcm9wZXJ0eUtleSAoT3B0aW9uYWwpIFRoZSBwcm9wZXJ0eSBrZXkgZm9yIHRoZSB0YXJnZXQuXG4gICAgICAgICAqIEByZXR1cm5zIFRoZSBtZXRhZGF0YSB2YWx1ZSBmb3IgdGhlIG1ldGFkYXRhIGtleSBpZiBmb3VuZDsgb3RoZXJ3aXNlLCBgdW5kZWZpbmVkYC5cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xuICAgICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5IGRlY2xhcmF0aW9ucyBhcmUgbm90IHBhcnQgb2YgRVM2LCB0aG91Z2ggdGhleSBhcmUgdmFsaWQgaW4gVHlwZVNjcmlwdDpcbiAgICAgICAgICogICAgICAgICAvLyBzdGF0aWMgc3RhdGljUHJvcGVydHk7XG4gICAgICAgICAqICAgICAgICAgLy8gcHJvcGVydHk7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAgICAgY29uc3RydWN0b3IocCkgeyB9XG4gICAgICAgICAqICAgICAgICAgc3RhdGljIHN0YXRpY01ldGhvZChwKSB7IH1cbiAgICAgICAgICogICAgICAgICBtZXRob2QocCkgeyB9XG4gICAgICAgICAqICAgICB9XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBjb25zdHJ1Y3RvclxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRPd25NZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIGNvbnN0cnVjdG9yKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRPd25NZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUsIFwic3RhdGljUHJvcGVydHlcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gcHJvdG90eXBlKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRPd25NZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUucHJvdG90eXBlLCBcInByb3BlcnR5XCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBjb25zdHJ1Y3RvcilcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0T3duTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLCBcInN0YXRpY01ldGhvZFwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIG1ldGhvZCAob24gcHJvdG90eXBlKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRPd25NZXRhZGF0YShcImN1c3RvbTphbm5vdGF0aW9uXCIsIEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldE93bk1ldGFkYXRhKG1ldGFkYXRhS2V5LCB0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgICAgICBpZiAoIUlzT2JqZWN0KHRhcmdldCkpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICAgICAgaWYgKCFJc1VuZGVmaW5lZChwcm9wZXJ0eUtleSkpXG4gICAgICAgICAgICAgICAgcHJvcGVydHlLZXkgPSBUb1Byb3BlcnR5S2V5KHByb3BlcnR5S2V5KTtcbiAgICAgICAgICAgIHJldHVybiBPcmRpbmFyeUdldE93bk1ldGFkYXRhKG1ldGFkYXRhS2V5LCB0YXJnZXQsIHByb3BlcnR5S2V5KTtcbiAgICAgICAgfVxuICAgICAgICBleHBvcnRlcihcImdldE93bk1ldGFkYXRhXCIsIGdldE93bk1ldGFkYXRhKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldHMgdGhlIG1ldGFkYXRhIGtleXMgZGVmaW5lZCBvbiB0aGUgdGFyZ2V0IG9iamVjdCBvciBpdHMgcHJvdG90eXBlIGNoYWluLlxuICAgICAgICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IG9uIHdoaWNoIHRoZSBtZXRhZGF0YSBpcyBkZWZpbmVkLlxuICAgICAgICAgKiBAcGFyYW0gcHJvcGVydHlLZXkgKE9wdGlvbmFsKSBUaGUgcHJvcGVydHkga2V5IGZvciB0aGUgdGFyZ2V0LlxuICAgICAgICAgKiBAcmV0dXJucyBBbiBhcnJheSBvZiB1bmlxdWUgbWV0YWRhdGEga2V5cy5cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIGNsYXNzIEV4YW1wbGUge1xuICAgICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5IGRlY2xhcmF0aW9ucyBhcmUgbm90IHBhcnQgb2YgRVM2LCB0aG91Z2ggdGhleSBhcmUgdmFsaWQgaW4gVHlwZVNjcmlwdDpcbiAgICAgICAgICogICAgICAgICAvLyBzdGF0aWMgc3RhdGljUHJvcGVydHk7XG4gICAgICAgICAqICAgICAgICAgLy8gcHJvcGVydHk7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAgICAgY29uc3RydWN0b3IocCkgeyB9XG4gICAgICAgICAqICAgICAgICAgc3RhdGljIHN0YXRpY01ldGhvZChwKSB7IH1cbiAgICAgICAgICogICAgICAgICBtZXRob2QocCkgeyB9XG4gICAgICAgICAqICAgICB9XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBjb25zdHJ1Y3RvclxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRNZXRhZGF0YUtleXMoRXhhbXBsZSk7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gY29uc3RydWN0b3IpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE1ldGFkYXRhS2V5cyhFeGFtcGxlLCBcInN0YXRpY1Byb3BlcnR5XCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIHByb3RvdHlwZSlcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0TWV0YWRhdGFLZXlzKEV4YW1wbGUucHJvdG90eXBlLCBcInByb3BlcnR5XCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBjb25zdHJ1Y3RvcilcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0TWV0YWRhdGFLZXlzKEV4YW1wbGUsIFwic3RhdGljTWV0aG9kXCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gbWV0aG9kIChvbiBwcm90b3R5cGUpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE1ldGFkYXRhS2V5cyhFeGFtcGxlLnByb3RvdHlwZSwgXCJtZXRob2RcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBnZXRNZXRhZGF0YUtleXModGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICAgICAgaWYgKCFJc09iamVjdCh0YXJnZXQpKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgIGlmICghSXNVbmRlZmluZWQocHJvcGVydHlLZXkpKVxuICAgICAgICAgICAgICAgIHByb3BlcnR5S2V5ID0gVG9Qcm9wZXJ0eUtleShwcm9wZXJ0eUtleSk7XG4gICAgICAgICAgICByZXR1cm4gT3JkaW5hcnlNZXRhZGF0YUtleXModGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG4gICAgICAgIH1cbiAgICAgICAgZXhwb3J0ZXIoXCJnZXRNZXRhZGF0YUtleXNcIiwgZ2V0TWV0YWRhdGFLZXlzKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldHMgdGhlIHVuaXF1ZSBtZXRhZGF0YSBrZXlzIGRlZmluZWQgb24gdGhlIHRhcmdldCBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3Qgb24gd2hpY2ggdGhlIG1ldGFkYXRhIGlzIGRlZmluZWQuXG4gICAgICAgICAqIEBwYXJhbSBwcm9wZXJ0eUtleSAoT3B0aW9uYWwpIFRoZSBwcm9wZXJ0eSBrZXkgZm9yIHRoZSB0YXJnZXQuXG4gICAgICAgICAqIEByZXR1cm5zIEFuIGFycmF5IG9mIHVuaXF1ZSBtZXRhZGF0YSBrZXlzLlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgY2xhc3MgRXhhbXBsZSB7XG4gICAgICAgICAqICAgICAgICAgLy8gcHJvcGVydHkgZGVjbGFyYXRpb25zIGFyZSBub3QgcGFydCBvZiBFUzYsIHRob3VnaCB0aGV5IGFyZSB2YWxpZCBpbiBUeXBlU2NyaXB0OlxuICAgICAgICAgKiAgICAgICAgIC8vIHN0YXRpYyBzdGF0aWNQcm9wZXJ0eTtcbiAgICAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgICAgICBjb25zdHJ1Y3RvcihwKSB7IH1cbiAgICAgICAgICogICAgICAgICBzdGF0aWMgc3RhdGljTWV0aG9kKHApIHsgfVxuICAgICAgICAgKiAgICAgICAgIG1ldGhvZChwKSB7IH1cbiAgICAgICAgICogICAgIH1cbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmdldE93bk1ldGFkYXRhS2V5cyhFeGFtcGxlKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBjb25zdHJ1Y3RvcilcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0T3duTWV0YWRhdGFLZXlzKEV4YW1wbGUsIFwic3RhdGljUHJvcGVydHlcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBwcm9wZXJ0eSAob24gcHJvdG90eXBlKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRPd25NZXRhZGF0YUtleXMoRXhhbXBsZS5wcm90b3R5cGUsIFwicHJvcGVydHlcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBtZXRob2QgKG9uIGNvbnN0cnVjdG9yKVxuICAgICAgICAgKiAgICAgcmVzdWx0ID0gUmVmbGVjdC5nZXRPd25NZXRhZGF0YUtleXMoRXhhbXBsZSwgXCJzdGF0aWNNZXRob2RcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBtZXRob2QgKG9uIHByb3RvdHlwZSlcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZ2V0T3duTWV0YWRhdGFLZXlzKEV4YW1wbGUucHJvdG90eXBlLCBcIm1ldGhvZFwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGdldE93bk1ldGFkYXRhS2V5cyh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgICAgICBpZiAoIUlzT2JqZWN0KHRhcmdldCkpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICAgICAgaWYgKCFJc1VuZGVmaW5lZChwcm9wZXJ0eUtleSkpXG4gICAgICAgICAgICAgICAgcHJvcGVydHlLZXkgPSBUb1Byb3BlcnR5S2V5KHByb3BlcnR5S2V5KTtcbiAgICAgICAgICAgIHJldHVybiBPcmRpbmFyeU93bk1ldGFkYXRhS2V5cyh0YXJnZXQsIHByb3BlcnR5S2V5KTtcbiAgICAgICAgfVxuICAgICAgICBleHBvcnRlcihcImdldE93bk1ldGFkYXRhS2V5c1wiLCBnZXRPd25NZXRhZGF0YUtleXMpO1xuICAgICAgICAvKipcbiAgICAgICAgICogRGVsZXRlcyB0aGUgbWV0YWRhdGEgZW50cnkgZnJvbSB0aGUgdGFyZ2V0IG9iamVjdCB3aXRoIHRoZSBwcm92aWRlZCBrZXkuXG4gICAgICAgICAqIEBwYXJhbSBtZXRhZGF0YUtleSBBIGtleSB1c2VkIHRvIHN0b3JlIGFuZCByZXRyaWV2ZSBtZXRhZGF0YS5cbiAgICAgICAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCBvbiB3aGljaCB0aGUgbWV0YWRhdGEgaXMgZGVmaW5lZC5cbiAgICAgICAgICogQHBhcmFtIHByb3BlcnR5S2V5IChPcHRpb25hbCkgVGhlIHByb3BlcnR5IGtleSBmb3IgdGhlIHRhcmdldC5cbiAgICAgICAgICogQHJldHVybnMgYHRydWVgIGlmIHRoZSBtZXRhZGF0YSBlbnRyeSB3YXMgZm91bmQgYW5kIGRlbGV0ZWQ7IG90aGVyd2lzZSwgZmFsc2UuXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqXG4gICAgICAgICAqICAgICBjbGFzcyBFeGFtcGxlIHtcbiAgICAgICAgICogICAgICAgICAvLyBwcm9wZXJ0eSBkZWNsYXJhdGlvbnMgYXJlIG5vdCBwYXJ0IG9mIEVTNiwgdGhvdWdoIHRoZXkgYXJlIHZhbGlkIGluIFR5cGVTY3JpcHQ6XG4gICAgICAgICAqICAgICAgICAgLy8gc3RhdGljIHN0YXRpY1Byb3BlcnR5O1xuICAgICAgICAgKiAgICAgICAgIC8vIHByb3BlcnR5O1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgICAgIGNvbnN0cnVjdG9yKHApIHsgfVxuICAgICAgICAgKiAgICAgICAgIHN0YXRpYyBzdGF0aWNNZXRob2QocCkgeyB9XG4gICAgICAgICAqICAgICAgICAgbWV0aG9kKHApIHsgfVxuICAgICAgICAgKiAgICAgfVxuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gY29uc3RydWN0b3JcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZGVsZXRlTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIHByb3BlcnR5IChvbiBjb25zdHJ1Y3RvcilcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZGVsZXRlTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLCBcInN0YXRpY1Byb3BlcnR5XCIpO1xuICAgICAgICAgKlxuICAgICAgICAgKiAgICAgLy8gcHJvcGVydHkgKG9uIHByb3RvdHlwZSlcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZGVsZXRlTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLnByb3RvdHlwZSwgXCJwcm9wZXJ0eVwiKTtcbiAgICAgICAgICpcbiAgICAgICAgICogICAgIC8vIG1ldGhvZCAob24gY29uc3RydWN0b3IpXG4gICAgICAgICAqICAgICByZXN1bHQgPSBSZWZsZWN0LmRlbGV0ZU1ldGFkYXRhKFwiY3VzdG9tOmFubm90YXRpb25cIiwgRXhhbXBsZSwgXCJzdGF0aWNNZXRob2RcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqICAgICAvLyBtZXRob2QgKG9uIHByb3RvdHlwZSlcbiAgICAgICAgICogICAgIHJlc3VsdCA9IFJlZmxlY3QuZGVsZXRlTWV0YWRhdGEoXCJjdXN0b206YW5ub3RhdGlvblwiLCBFeGFtcGxlLnByb3RvdHlwZSwgXCJtZXRob2RcIik7XG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBkZWxldGVNZXRhZGF0YShtZXRhZGF0YUtleSwgdGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICAgICAgaWYgKCFJc09iamVjdCh0YXJnZXQpKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgIGlmICghSXNVbmRlZmluZWQocHJvcGVydHlLZXkpKVxuICAgICAgICAgICAgICAgIHByb3BlcnR5S2V5ID0gVG9Qcm9wZXJ0eUtleShwcm9wZXJ0eUtleSk7XG4gICAgICAgICAgICB2YXIgbWV0YWRhdGFNYXAgPSBHZXRPckNyZWF0ZU1ldGFkYXRhTWFwKHRhcmdldCwgcHJvcGVydHlLZXksIC8qQ3JlYXRlKi8gZmFsc2UpO1xuICAgICAgICAgICAgaWYgKElzVW5kZWZpbmVkKG1ldGFkYXRhTWFwKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBpZiAoIW1ldGFkYXRhTWFwLmRlbGV0ZShtZXRhZGF0YUtleSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgaWYgKG1ldGFkYXRhTWFwLnNpemUgPiAwKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgdmFyIHRhcmdldE1ldGFkYXRhID0gTWV0YWRhdGEuZ2V0KHRhcmdldCk7XG4gICAgICAgICAgICB0YXJnZXRNZXRhZGF0YS5kZWxldGUocHJvcGVydHlLZXkpO1xuICAgICAgICAgICAgaWYgKHRhcmdldE1ldGFkYXRhLnNpemUgPiAwKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgTWV0YWRhdGEuZGVsZXRlKHRhcmdldCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBleHBvcnRlcihcImRlbGV0ZU1ldGFkYXRhXCIsIGRlbGV0ZU1ldGFkYXRhKTtcbiAgICAgICAgZnVuY3Rpb24gRGVjb3JhdGVDb25zdHJ1Y3RvcihkZWNvcmF0b3JzLCB0YXJnZXQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlY29yYXRvciA9IGRlY29yYXRvcnNbaV07XG4gICAgICAgICAgICAgICAgdmFyIGRlY29yYXRlZCA9IGRlY29yYXRvcih0YXJnZXQpO1xuICAgICAgICAgICAgICAgIGlmICghSXNVbmRlZmluZWQoZGVjb3JhdGVkKSAmJiAhSXNOdWxsKGRlY29yYXRlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFJc0NvbnN0cnVjdG9yKGRlY29yYXRlZCkpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IGRlY29yYXRlZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIERlY29yYXRlUHJvcGVydHkoZGVjb3JhdG9ycywgdGFyZ2V0LCBwcm9wZXJ0eUtleSwgZGVzY3JpcHRvcikge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVjb3JhdG9yID0gZGVjb3JhdG9yc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgZGVjb3JhdGVkID0gZGVjb3JhdG9yKHRhcmdldCwgcHJvcGVydHlLZXksIGRlc2NyaXB0b3IpO1xuICAgICAgICAgICAgICAgIGlmICghSXNVbmRlZmluZWQoZGVjb3JhdGVkKSAmJiAhSXNOdWxsKGRlY29yYXRlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFJc09iamVjdChkZWNvcmF0ZWQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdG9yID0gZGVjb3JhdGVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkZXNjcmlwdG9yO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIEdldE9yQ3JlYXRlTWV0YWRhdGFNYXAoTywgUCwgQ3JlYXRlKSB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0TWV0YWRhdGEgPSBNZXRhZGF0YS5nZXQoTyk7XG4gICAgICAgICAgICBpZiAoSXNVbmRlZmluZWQodGFyZ2V0TWV0YWRhdGEpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFDcmVhdGUpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgdGFyZ2V0TWV0YWRhdGEgPSBuZXcgX01hcCgpO1xuICAgICAgICAgICAgICAgIE1ldGFkYXRhLnNldChPLCB0YXJnZXRNZXRhZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbWV0YWRhdGFNYXAgPSB0YXJnZXRNZXRhZGF0YS5nZXQoUCk7XG4gICAgICAgICAgICBpZiAoSXNVbmRlZmluZWQobWV0YWRhdGFNYXApKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFDcmVhdGUpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgbWV0YWRhdGFNYXAgPSBuZXcgX01hcCgpO1xuICAgICAgICAgICAgICAgIHRhcmdldE1ldGFkYXRhLnNldChQLCBtZXRhZGF0YU1hcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbWV0YWRhdGFNYXA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gMy4xLjEuMSBPcmRpbmFyeUhhc01ldGFkYXRhKE1ldGFkYXRhS2V5LCBPLCBQKVxuICAgICAgICAvLyBodHRwczovL3JidWNrdG9uLmdpdGh1Yi5pby9yZWZsZWN0LW1ldGFkYXRhLyNvcmRpbmFyeWhhc21ldGFkYXRhXG4gICAgICAgIGZ1bmN0aW9uIE9yZGluYXJ5SGFzTWV0YWRhdGEoTWV0YWRhdGFLZXksIE8sIFApIHtcbiAgICAgICAgICAgIHZhciBoYXNPd24gPSBPcmRpbmFyeUhhc093bk1ldGFkYXRhKE1ldGFkYXRhS2V5LCBPLCBQKTtcbiAgICAgICAgICAgIGlmIChoYXNPd24pXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gT3JkaW5hcnlHZXRQcm90b3R5cGVPZihPKTtcbiAgICAgICAgICAgIGlmICghSXNOdWxsKHBhcmVudCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9yZGluYXJ5SGFzTWV0YWRhdGEoTWV0YWRhdGFLZXksIHBhcmVudCwgUCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gMy4xLjIuMSBPcmRpbmFyeUhhc093bk1ldGFkYXRhKE1ldGFkYXRhS2V5LCBPLCBQKVxuICAgICAgICAvLyBodHRwczovL3JidWNrdG9uLmdpdGh1Yi5pby9yZWZsZWN0LW1ldGFkYXRhLyNvcmRpbmFyeWhhc293bm1ldGFkYXRhXG4gICAgICAgIGZ1bmN0aW9uIE9yZGluYXJ5SGFzT3duTWV0YWRhdGEoTWV0YWRhdGFLZXksIE8sIFApIHtcbiAgICAgICAgICAgIHZhciBtZXRhZGF0YU1hcCA9IEdldE9yQ3JlYXRlTWV0YWRhdGFNYXAoTywgUCwgLypDcmVhdGUqLyBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoSXNVbmRlZmluZWQobWV0YWRhdGFNYXApKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBUb0Jvb2xlYW4obWV0YWRhdGFNYXAuaGFzKE1ldGFkYXRhS2V5KSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gMy4xLjMuMSBPcmRpbmFyeUdldE1ldGFkYXRhKE1ldGFkYXRhS2V5LCBPLCBQKVxuICAgICAgICAvLyBodHRwczovL3JidWNrdG9uLmdpdGh1Yi5pby9yZWZsZWN0LW1ldGFkYXRhLyNvcmRpbmFyeWdldG1ldGFkYXRhXG4gICAgICAgIGZ1bmN0aW9uIE9yZGluYXJ5R2V0TWV0YWRhdGEoTWV0YWRhdGFLZXksIE8sIFApIHtcbiAgICAgICAgICAgIHZhciBoYXNPd24gPSBPcmRpbmFyeUhhc093bk1ldGFkYXRhKE1ldGFkYXRhS2V5LCBPLCBQKTtcbiAgICAgICAgICAgIGlmIChoYXNPd24pXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9yZGluYXJ5R2V0T3duTWV0YWRhdGEoTWV0YWRhdGFLZXksIE8sIFApO1xuICAgICAgICAgICAgdmFyIHBhcmVudCA9IE9yZGluYXJ5R2V0UHJvdG90eXBlT2YoTyk7XG4gICAgICAgICAgICBpZiAoIUlzTnVsbChwYXJlbnQpKVxuICAgICAgICAgICAgICAgIHJldHVybiBPcmRpbmFyeUdldE1ldGFkYXRhKE1ldGFkYXRhS2V5LCBwYXJlbnQsIFApO1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICAvLyAzLjEuNC4xIE9yZGluYXJ5R2V0T3duTWV0YWRhdGEoTWV0YWRhdGFLZXksIE8sIFApXG4gICAgICAgIC8vIGh0dHBzOi8vcmJ1Y2t0b24uZ2l0aHViLmlvL3JlZmxlY3QtbWV0YWRhdGEvI29yZGluYXJ5Z2V0b3dubWV0YWRhdGFcbiAgICAgICAgZnVuY3Rpb24gT3JkaW5hcnlHZXRPd25NZXRhZGF0YShNZXRhZGF0YUtleSwgTywgUCkge1xuICAgICAgICAgICAgdmFyIG1ldGFkYXRhTWFwID0gR2V0T3JDcmVhdGVNZXRhZGF0YU1hcChPLCBQLCAvKkNyZWF0ZSovIGZhbHNlKTtcbiAgICAgICAgICAgIGlmIChJc1VuZGVmaW5lZChtZXRhZGF0YU1hcCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHJldHVybiBtZXRhZGF0YU1hcC5nZXQoTWV0YWRhdGFLZXkpO1xuICAgICAgICB9XG4gICAgICAgIC8vIDMuMS41LjEgT3JkaW5hcnlEZWZpbmVPd25NZXRhZGF0YShNZXRhZGF0YUtleSwgTWV0YWRhdGFWYWx1ZSwgTywgUClcbiAgICAgICAgLy8gaHR0cHM6Ly9yYnVja3Rvbi5naXRodWIuaW8vcmVmbGVjdC1tZXRhZGF0YS8jb3JkaW5hcnlkZWZpbmVvd25tZXRhZGF0YVxuICAgICAgICBmdW5jdGlvbiBPcmRpbmFyeURlZmluZU93bk1ldGFkYXRhKE1ldGFkYXRhS2V5LCBNZXRhZGF0YVZhbHVlLCBPLCBQKSB7XG4gICAgICAgICAgICB2YXIgbWV0YWRhdGFNYXAgPSBHZXRPckNyZWF0ZU1ldGFkYXRhTWFwKE8sIFAsIC8qQ3JlYXRlKi8gdHJ1ZSk7XG4gICAgICAgICAgICBtZXRhZGF0YU1hcC5zZXQoTWV0YWRhdGFLZXksIE1ldGFkYXRhVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIDMuMS42LjEgT3JkaW5hcnlNZXRhZGF0YUtleXMoTywgUClcbiAgICAgICAgLy8gaHR0cHM6Ly9yYnVja3Rvbi5naXRodWIuaW8vcmVmbGVjdC1tZXRhZGF0YS8jb3JkaW5hcnltZXRhZGF0YWtleXNcbiAgICAgICAgZnVuY3Rpb24gT3JkaW5hcnlNZXRhZGF0YUtleXMoTywgUCkge1xuICAgICAgICAgICAgdmFyIG93bktleXMgPSBPcmRpbmFyeU93bk1ldGFkYXRhS2V5cyhPLCBQKTtcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBPcmRpbmFyeUdldFByb3RvdHlwZU9mKE8pO1xuICAgICAgICAgICAgaWYgKHBhcmVudCA9PT0gbnVsbClcbiAgICAgICAgICAgICAgICByZXR1cm4gb3duS2V5cztcbiAgICAgICAgICAgIHZhciBwYXJlbnRLZXlzID0gT3JkaW5hcnlNZXRhZGF0YUtleXMocGFyZW50LCBQKTtcbiAgICAgICAgICAgIGlmIChwYXJlbnRLZXlzLmxlbmd0aCA8PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBvd25LZXlzO1xuICAgICAgICAgICAgaWYgKG93bktleXMubGVuZ3RoIDw9IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudEtleXM7XG4gICAgICAgICAgICB2YXIgc2V0ID0gbmV3IF9TZXQoKTtcbiAgICAgICAgICAgIHZhciBrZXlzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIG93bktleXNfMSA9IG93bktleXM7IF9pIDwgb3duS2V5c18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBvd25LZXlzXzFbX2ldO1xuICAgICAgICAgICAgICAgIHZhciBoYXNLZXkgPSBzZXQuaGFzKGtleSk7XG4gICAgICAgICAgICAgICAgaWYgKCFoYXNLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0LmFkZChrZXkpO1xuICAgICAgICAgICAgICAgICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciBfYSA9IDAsIHBhcmVudEtleXNfMSA9IHBhcmVudEtleXM7IF9hIDwgcGFyZW50S2V5c18xLmxlbmd0aDsgX2ErKykge1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBwYXJlbnRLZXlzXzFbX2FdO1xuICAgICAgICAgICAgICAgIHZhciBoYXNLZXkgPSBzZXQuaGFzKGtleSk7XG4gICAgICAgICAgICAgICAgaWYgKCFoYXNLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0LmFkZChrZXkpO1xuICAgICAgICAgICAgICAgICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ga2V5cztcbiAgICAgICAgfVxuICAgICAgICAvLyAzLjEuNy4xIE9yZGluYXJ5T3duTWV0YWRhdGFLZXlzKE8sIFApXG4gICAgICAgIC8vIGh0dHBzOi8vcmJ1Y2t0b24uZ2l0aHViLmlvL3JlZmxlY3QtbWV0YWRhdGEvI29yZGluYXJ5b3dubWV0YWRhdGFrZXlzXG4gICAgICAgIGZ1bmN0aW9uIE9yZGluYXJ5T3duTWV0YWRhdGFLZXlzKE8sIFApIHtcbiAgICAgICAgICAgIHZhciBrZXlzID0gW107XG4gICAgICAgICAgICB2YXIgbWV0YWRhdGFNYXAgPSBHZXRPckNyZWF0ZU1ldGFkYXRhTWFwKE8sIFAsIC8qQ3JlYXRlKi8gZmFsc2UpO1xuICAgICAgICAgICAgaWYgKElzVW5kZWZpbmVkKG1ldGFkYXRhTWFwKSlcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5cztcbiAgICAgICAgICAgIHZhciBrZXlzT2JqID0gbWV0YWRhdGFNYXAua2V5cygpO1xuICAgICAgICAgICAgdmFyIGl0ZXJhdG9yID0gR2V0SXRlcmF0b3Ioa2V5c09iaik7XG4gICAgICAgICAgICB2YXIgayA9IDA7XG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBuZXh0ID0gSXRlcmF0b3JTdGVwKGl0ZXJhdG9yKTtcbiAgICAgICAgICAgICAgICBpZiAoIW5leHQpIHtcbiAgICAgICAgICAgICAgICAgICAga2V5cy5sZW5ndGggPSBrO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5cztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIG5leHRWYWx1ZSA9IEl0ZXJhdG9yVmFsdWUobmV4dCk7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAga2V5c1trXSA9IG5leHRWYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBrKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gNiBFQ01BU2NyaXB0IERhdGEgVHlwMGVzIGFuZCBWYWx1ZXNcbiAgICAgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZWNtYXNjcmlwdC1kYXRhLXR5cGVzLWFuZC12YWx1ZXNcbiAgICAgICAgZnVuY3Rpb24gVHlwZSh4KSB7XG4gICAgICAgICAgICBpZiAoeCA9PT0gbnVsbClcbiAgICAgICAgICAgICAgICByZXR1cm4gMSAvKiBOdWxsICovO1xuICAgICAgICAgICAgc3dpdGNoICh0eXBlb2YgeCkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJ1bmRlZmluZWRcIjogcmV0dXJuIDAgLyogVW5kZWZpbmVkICovO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJib29sZWFuXCI6IHJldHVybiAyIC8qIEJvb2xlYW4gKi87XG4gICAgICAgICAgICAgICAgY2FzZSBcInN0cmluZ1wiOiByZXR1cm4gMyAvKiBTdHJpbmcgKi87XG4gICAgICAgICAgICAgICAgY2FzZSBcInN5bWJvbFwiOiByZXR1cm4gNCAvKiBTeW1ib2wgKi87XG4gICAgICAgICAgICAgICAgY2FzZSBcIm51bWJlclwiOiByZXR1cm4gNSAvKiBOdW1iZXIgKi87XG4gICAgICAgICAgICAgICAgY2FzZSBcIm9iamVjdFwiOiByZXR1cm4geCA9PT0gbnVsbCA/IDEgLyogTnVsbCAqLyA6IDYgLyogT2JqZWN0ICovO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiA2IC8qIE9iamVjdCAqLztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyA2LjEuMSBUaGUgVW5kZWZpbmVkIFR5cGVcbiAgICAgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcy11bmRlZmluZWQtdHlwZVxuICAgICAgICBmdW5jdGlvbiBJc1VuZGVmaW5lZCh4KSB7XG4gICAgICAgICAgICByZXR1cm4geCA9PT0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIC8vIDYuMS4yIFRoZSBOdWxsIFR5cGVcbiAgICAgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcy1udWxsLXR5cGVcbiAgICAgICAgZnVuY3Rpb24gSXNOdWxsKHgpIHtcbiAgICAgICAgICAgIHJldHVybiB4ID09PSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIC8vIDYuMS41IFRoZSBTeW1ib2wgVHlwZVxuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzLXN5bWJvbC10eXBlXG4gICAgICAgIGZ1bmN0aW9uIElzU3ltYm9sKHgpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgeCA9PT0gXCJzeW1ib2xcIjtcbiAgICAgICAgfVxuICAgICAgICAvLyA2LjEuNyBUaGUgT2JqZWN0IFR5cGVcbiAgICAgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LXR5cGVcbiAgICAgICAgZnVuY3Rpb24gSXNPYmplY3QoeCkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSBcIm9iamVjdFwiID8geCAhPT0gbnVsbCA6IHR5cGVvZiB4ID09PSBcImZ1bmN0aW9uXCI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gNy4xIFR5cGUgQ29udmVyc2lvblxuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy10eXBlLWNvbnZlcnNpb25cbiAgICAgICAgLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG4gICAgICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXRvcHJpbWl0aXZlXG4gICAgICAgIGZ1bmN0aW9uIFRvUHJpbWl0aXZlKGlucHV0LCBQcmVmZXJyZWRUeXBlKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKFR5cGUoaW5wdXQpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwIC8qIFVuZGVmaW5lZCAqLzogcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgICAgIGNhc2UgMSAvKiBOdWxsICovOiByZXR1cm4gaW5wdXQ7XG4gICAgICAgICAgICAgICAgY2FzZSAyIC8qIEJvb2xlYW4gKi86IHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgICAgICBjYXNlIDMgLyogU3RyaW5nICovOiByZXR1cm4gaW5wdXQ7XG4gICAgICAgICAgICAgICAgY2FzZSA0IC8qIFN5bWJvbCAqLzogcmV0dXJuIGlucHV0O1xuICAgICAgICAgICAgICAgIGNhc2UgNSAvKiBOdW1iZXIgKi86IHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBoaW50ID0gUHJlZmVycmVkVHlwZSA9PT0gMyAvKiBTdHJpbmcgKi8gPyBcInN0cmluZ1wiIDogUHJlZmVycmVkVHlwZSA9PT0gNSAvKiBOdW1iZXIgKi8gPyBcIm51bWJlclwiIDogXCJkZWZhdWx0XCI7XG4gICAgICAgICAgICB2YXIgZXhvdGljVG9QcmltID0gR2V0TWV0aG9kKGlucHV0LCB0b1ByaW1pdGl2ZVN5bWJvbCk7XG4gICAgICAgICAgICBpZiAoZXhvdGljVG9QcmltICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZXhvdGljVG9QcmltLmNhbGwoaW5wdXQsIGhpbnQpO1xuICAgICAgICAgICAgICAgIGlmIChJc09iamVjdChyZXN1bHQpKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBPcmRpbmFyeVRvUHJpbWl0aXZlKGlucHV0LCBoaW50ID09PSBcImRlZmF1bHRcIiA/IFwibnVtYmVyXCIgOiBoaW50KTtcbiAgICAgICAgfVxuICAgICAgICAvLyA3LjEuMS4xIE9yZGluYXJ5VG9QcmltaXRpdmUoTywgaGludClcbiAgICAgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb3JkaW5hcnl0b3ByaW1pdGl2ZVxuICAgICAgICBmdW5jdGlvbiBPcmRpbmFyeVRvUHJpbWl0aXZlKE8sIGhpbnQpIHtcbiAgICAgICAgICAgIGlmIChoaW50ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRvU3RyaW5nXzEgPSBPLnRvU3RyaW5nO1xuICAgICAgICAgICAgICAgIGlmIChJc0NhbGxhYmxlKHRvU3RyaW5nXzEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSB0b1N0cmluZ18xLmNhbGwoTyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghSXNPYmplY3QocmVzdWx0KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZU9mID0gTy52YWx1ZU9mO1xuICAgICAgICAgICAgICAgIGlmIChJc0NhbGxhYmxlKHZhbHVlT2YpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSB2YWx1ZU9mLmNhbGwoTyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghSXNPYmplY3QocmVzdWx0KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlT2YgPSBPLnZhbHVlT2Y7XG4gICAgICAgICAgICAgICAgaWYgKElzQ2FsbGFibGUodmFsdWVPZikpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHZhbHVlT2YuY2FsbChPKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFJc09iamVjdChyZXN1bHQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHRvU3RyaW5nXzIgPSBPLnRvU3RyaW5nO1xuICAgICAgICAgICAgICAgIGlmIChJc0NhbGxhYmxlKHRvU3RyaW5nXzIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSB0b1N0cmluZ18yLmNhbGwoTyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghSXNPYmplY3QocmVzdWx0KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICB9XG4gICAgICAgIC8vIDcuMS4yIFRvQm9vbGVhbihhcmd1bWVudClcbiAgICAgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLzIwMTYvI3NlYy10b2Jvb2xlYW5cbiAgICAgICAgZnVuY3Rpb24gVG9Cb29sZWFuKGFyZ3VtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gISFhcmd1bWVudDtcbiAgICAgICAgfVxuICAgICAgICAvLyA3LjEuMTIgVG9TdHJpbmcoYXJndW1lbnQpXG4gICAgICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXRvc3RyaW5nXG4gICAgICAgIGZ1bmN0aW9uIFRvU3RyaW5nKGFyZ3VtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIiArIGFyZ3VtZW50O1xuICAgICAgICB9XG4gICAgICAgIC8vIDcuMS4xNCBUb1Byb3BlcnR5S2V5KGFyZ3VtZW50KVxuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy10b3Byb3BlcnR5a2V5XG4gICAgICAgIGZ1bmN0aW9uIFRvUHJvcGVydHlLZXkoYXJndW1lbnQpIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBUb1ByaW1pdGl2ZShhcmd1bWVudCwgMyAvKiBTdHJpbmcgKi8pO1xuICAgICAgICAgICAgaWYgKElzU3ltYm9sKGtleSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgICAgICAgIHJldHVybiBUb1N0cmluZyhrZXkpO1xuICAgICAgICB9XG4gICAgICAgIC8vIDcuMiBUZXN0aW5nIGFuZCBDb21wYXJpc29uIE9wZXJhdGlvbnNcbiAgICAgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdGVzdGluZy1hbmQtY29tcGFyaXNvbi1vcGVyYXRpb25zXG4gICAgICAgIC8vIDcuMi4yIElzQXJyYXkoYXJndW1lbnQpXG4gICAgICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWlzYXJyYXlcbiAgICAgICAgZnVuY3Rpb24gSXNBcnJheShhcmd1bWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXlcbiAgICAgICAgICAgICAgICA/IEFycmF5LmlzQXJyYXkoYXJndW1lbnQpXG4gICAgICAgICAgICAgICAgOiBhcmd1bWVudCBpbnN0YW5jZW9mIE9iamVjdFxuICAgICAgICAgICAgICAgICAgICA/IGFyZ3VtZW50IGluc3RhbmNlb2YgQXJyYXlcbiAgICAgICAgICAgICAgICAgICAgOiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJndW1lbnQpID09PSBcIltvYmplY3QgQXJyYXldXCI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gNy4yLjMgSXNDYWxsYWJsZShhcmd1bWVudClcbiAgICAgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtaXNjYWxsYWJsZVxuICAgICAgICBmdW5jdGlvbiBJc0NhbGxhYmxlKGFyZ3VtZW50KSB7XG4gICAgICAgICAgICAvLyBOT1RFOiBUaGlzIGlzIGFuIGFwcHJveGltYXRpb24gYXMgd2UgY2Fubm90IGNoZWNrIGZvciBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2QuXG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGFyZ3VtZW50ID09PSBcImZ1bmN0aW9uXCI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gNy4yLjQgSXNDb25zdHJ1Y3Rvcihhcmd1bWVudClcbiAgICAgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtaXNjb25zdHJ1Y3RvclxuICAgICAgICBmdW5jdGlvbiBJc0NvbnN0cnVjdG9yKGFyZ3VtZW50KSB7XG4gICAgICAgICAgICAvLyBOT1RFOiBUaGlzIGlzIGFuIGFwcHJveGltYXRpb24gYXMgd2UgY2Fubm90IGNoZWNrIGZvciBbW0NvbnN0cnVjdF1dIGludGVybmFsIG1ldGhvZC5cbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYXJndW1lbnQgPT09IFwiZnVuY3Rpb25cIjtcbiAgICAgICAgfVxuICAgICAgICAvLyA3LjIuNyBJc1Byb3BlcnR5S2V5KGFyZ3VtZW50KVxuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1pc3Byb3BlcnR5a2V5XG4gICAgICAgIGZ1bmN0aW9uIElzUHJvcGVydHlLZXkoYXJndW1lbnQpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoVHlwZShhcmd1bWVudCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDMgLyogU3RyaW5nICovOiByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDQgLyogU3ltYm9sICovOiByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gNy4zIE9wZXJhdGlvbnMgb24gT2JqZWN0c1xuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vcGVyYXRpb25zLW9uLW9iamVjdHNcbiAgICAgICAgLy8gNy4zLjkgR2V0TWV0aG9kKFYsIFApXG4gICAgICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWdldG1ldGhvZFxuICAgICAgICBmdW5jdGlvbiBHZXRNZXRob2QoViwgUCkge1xuICAgICAgICAgICAgdmFyIGZ1bmMgPSBWW1BdO1xuICAgICAgICAgICAgaWYgKGZ1bmMgPT09IHVuZGVmaW5lZCB8fCBmdW5jID09PSBudWxsKVxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpZiAoIUlzQ2FsbGFibGUoZnVuYykpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmM7XG4gICAgICAgIH1cbiAgICAgICAgLy8gNy40IE9wZXJhdGlvbnMgb24gSXRlcmF0b3IgT2JqZWN0c1xuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vcGVyYXRpb25zLW9uLWl0ZXJhdG9yLW9iamVjdHNcbiAgICAgICAgZnVuY3Rpb24gR2V0SXRlcmF0b3Iob2JqKSB7XG4gICAgICAgICAgICB2YXIgbWV0aG9kID0gR2V0TWV0aG9kKG9iaiwgaXRlcmF0b3JTeW1ib2wpO1xuICAgICAgICAgICAgaWYgKCFJc0NhbGxhYmxlKG1ldGhvZCkpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpOyAvLyBmcm9tIENhbGxcbiAgICAgICAgICAgIHZhciBpdGVyYXRvciA9IG1ldGhvZC5jYWxsKG9iaik7XG4gICAgICAgICAgICBpZiAoIUlzT2JqZWN0KGl0ZXJhdG9yKSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICAgICAgICByZXR1cm4gaXRlcmF0b3I7XG4gICAgICAgIH1cbiAgICAgICAgLy8gNy40LjQgSXRlcmF0b3JWYWx1ZShpdGVyUmVzdWx0KVxuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvMjAxNi8jc2VjLWl0ZXJhdG9ydmFsdWVcbiAgICAgICAgZnVuY3Rpb24gSXRlcmF0b3JWYWx1ZShpdGVyUmVzdWx0KSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlclJlc3VsdC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyA3LjQuNSBJdGVyYXRvclN0ZXAoaXRlcmF0b3IpXG4gICAgICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWl0ZXJhdG9yc3RlcFxuICAgICAgICBmdW5jdGlvbiBJdGVyYXRvclN0ZXAoaXRlcmF0b3IpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyBmYWxzZSA6IHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1pdGVyYXRvcmNsb3NlXG4gICAgICAgIGZ1bmN0aW9uIEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IpIHtcbiAgICAgICAgICAgIHZhciBmID0gaXRlcmF0b3JbXCJyZXR1cm5cIl07XG4gICAgICAgICAgICBpZiAoZilcbiAgICAgICAgICAgICAgICBmLmNhbGwoaXRlcmF0b3IpO1xuICAgICAgICB9XG4gICAgICAgIC8vIDkuMSBPcmRpbmFyeSBPYmplY3QgSW50ZXJuYWwgTWV0aG9kcyBhbmQgSW50ZXJuYWwgU2xvdHNcbiAgICAgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb3JkaW5hcnktb2JqZWN0LWludGVybmFsLW1ldGhvZHMtYW5kLWludGVybmFsLXNsb3RzXG4gICAgICAgIC8vIDkuMS4xLjEgT3JkaW5hcnlHZXRQcm90b3R5cGVPZihPKVxuICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vcmRpbmFyeWdldHByb3RvdHlwZW9mXG4gICAgICAgIGZ1bmN0aW9uIE9yZGluYXJ5R2V0UHJvdG90eXBlT2YoTykge1xuICAgICAgICAgICAgdmFyIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBPICE9PSBcImZ1bmN0aW9uXCIgfHwgTyA9PT0gZnVuY3Rpb25Qcm90b3R5cGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3RvO1xuICAgICAgICAgICAgLy8gVHlwZVNjcmlwdCBkb2Vzbid0IHNldCBfX3Byb3RvX18gaW4gRVM1LCBhcyBpdCdzIG5vbi1zdGFuZGFyZC5cbiAgICAgICAgICAgIC8vIFRyeSB0byBkZXRlcm1pbmUgdGhlIHN1cGVyY2xhc3MgY29uc3RydWN0b3IuIENvbXBhdGlibGUgaW1wbGVtZW50YXRpb25zXG4gICAgICAgICAgICAvLyBtdXN0IGVpdGhlciBzZXQgX19wcm90b19fIG9uIGEgc3ViY2xhc3MgY29uc3RydWN0b3IgdG8gdGhlIHN1cGVyY2xhc3MgY29uc3RydWN0b3IsXG4gICAgICAgICAgICAvLyBvciBlbnN1cmUgZWFjaCBjbGFzcyBoYXMgYSB2YWxpZCBgY29uc3RydWN0b3JgIHByb3BlcnR5IG9uIGl0cyBwcm90b3R5cGUgdGhhdFxuICAgICAgICAgICAgLy8gcG9pbnRzIGJhY2sgdG8gdGhlIGNvbnN0cnVjdG9yLlxuICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBub3QgdGhlIHNhbWUgYXMgRnVuY3Rpb24uW1tQcm90b3R5cGVdXSwgdGhlbiB0aGlzIGlzIGRlZmluYXRlbHkgaW5oZXJpdGVkLlxuICAgICAgICAgICAgLy8gVGhpcyBpcyB0aGUgY2FzZSB3aGVuIGluIEVTNiBvciB3aGVuIHVzaW5nIF9fcHJvdG9fXyBpbiBhIGNvbXBhdGlibGUgYnJvd3Nlci5cbiAgICAgICAgICAgIGlmIChwcm90byAhPT0gZnVuY3Rpb25Qcm90b3R5cGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3RvO1xuICAgICAgICAgICAgLy8gSWYgdGhlIHN1cGVyIHByb3RvdHlwZSBpcyBPYmplY3QucHJvdG90eXBlLCBudWxsLCBvciB1bmRlZmluZWQsIHRoZW4gd2UgY2Fubm90IGRldGVybWluZSB0aGUgaGVyaXRhZ2UuXG4gICAgICAgICAgICB2YXIgcHJvdG90eXBlID0gTy5wcm90b3R5cGU7XG4gICAgICAgICAgICB2YXIgcHJvdG90eXBlUHJvdG8gPSBwcm90b3R5cGUgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvdHlwZSk7XG4gICAgICAgICAgICBpZiAocHJvdG90eXBlUHJvdG8gPT0gbnVsbCB8fCBwcm90b3R5cGVQcm90byA9PT0gT2JqZWN0LnByb3RvdHlwZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvdG87XG4gICAgICAgICAgICAvLyBJZiB0aGUgY29uc3RydWN0b3Igd2FzIG5vdCBhIGZ1bmN0aW9uLCB0aGVuIHdlIGNhbm5vdCBkZXRlcm1pbmUgdGhlIGhlcml0YWdlLlxuICAgICAgICAgICAgdmFyIGNvbnN0cnVjdG9yID0gcHJvdG90eXBlUHJvdG8uY29uc3RydWN0b3I7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbnN0cnVjdG9yICE9PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3RvO1xuICAgICAgICAgICAgLy8gSWYgd2UgaGF2ZSBzb21lIGtpbmQgb2Ygc2VsZi1yZWZlcmVuY2UsIHRoZW4gd2UgY2Fubm90IGRldGVybWluZSB0aGUgaGVyaXRhZ2UuXG4gICAgICAgICAgICBpZiAoY29uc3RydWN0b3IgPT09IE8pXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3RvO1xuICAgICAgICAgICAgLy8gd2UgaGF2ZSBhIHByZXR0eSBnb29kIGd1ZXNzIGF0IHRoZSBoZXJpdGFnZS5cbiAgICAgICAgICAgIHJldHVybiBjb25zdHJ1Y3RvcjtcbiAgICAgICAgfVxuICAgICAgICAvLyBuYWl2ZSBNYXAgc2hpbVxuICAgICAgICBmdW5jdGlvbiBDcmVhdGVNYXBQb2x5ZmlsbCgpIHtcbiAgICAgICAgICAgIHZhciBjYWNoZVNlbnRpbmVsID0ge307XG4gICAgICAgICAgICB2YXIgYXJyYXlTZW50aW5lbCA9IFtdO1xuICAgICAgICAgICAgdmFyIE1hcEl0ZXJhdG9yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIE1hcEl0ZXJhdG9yKGtleXMsIHZhbHVlcywgc2VsZWN0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW5kZXggPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXlzID0ga2V5cztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmFsdWVzID0gdmFsdWVzO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RvciA9IHNlbGVjdG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBNYXBJdGVyYXRvci5wcm90b3R5cGVbXCJAQGl0ZXJhdG9yXCJdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfTtcbiAgICAgICAgICAgICAgICBNYXBJdGVyYXRvci5wcm90b3R5cGVbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfTtcbiAgICAgICAgICAgICAgICBNYXBJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5faW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+PSAwICYmIGluZGV4IDwgdGhpcy5fa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSB0aGlzLl9zZWxlY3Rvcih0aGlzLl9rZXlzW2luZGV4XSwgdGhpcy5fdmFsdWVzW2luZGV4XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggKyAxID49IHRoaXMuX2tleXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faW5kZXggPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXlzID0gYXJyYXlTZW50aW5lbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXMgPSBhcnJheVNlbnRpbmVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faW5kZXgrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiByZXN1bHQsIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgTWFwSXRlcmF0b3IucHJvdG90eXBlLnRocm93ID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbmRleCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fa2V5cyA9IGFycmF5U2VudGluZWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXMgPSBhcnJheVNlbnRpbmVsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgTWFwSXRlcmF0b3IucHJvdG90eXBlLnJldHVybiA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5faW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faW5kZXggPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleXMgPSBhcnJheVNlbnRpbmVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmFsdWVzID0gYXJyYXlTZW50aW5lbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogdmFsdWUsIGRvbmU6IHRydWUgfTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXBJdGVyYXRvcjtcbiAgICAgICAgICAgIH0oKSk7XG4gICAgICAgICAgICByZXR1cm4gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIE1hcCgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fa2V5cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FjaGVLZXkgPSBjYWNoZVNlbnRpbmVsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZUluZGV4ID0gLTI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXAucHJvdG90eXBlLCBcInNpemVcIiwge1xuICAgICAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX2tleXMubGVuZ3RoOyB9LFxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBNYXAucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIHRoaXMuX2ZpbmQoa2V5LCAvKmluc2VydCovIGZhbHNlKSA+PSAwOyB9O1xuICAgICAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLl9maW5kKGtleSwgLyppbnNlcnQqLyBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbmRleCA+PSAwID8gdGhpcy5fdmFsdWVzW2luZGV4XSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIE1hcC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5fZmluZChrZXksIC8qaW5zZXJ0Ki8gdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlc1tpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBNYXAucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5fZmluZChrZXksIC8qaW5zZXJ0Ki8gZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNpemUgPSB0aGlzLl9rZXlzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBpbmRleCArIDE7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXlzW2kgLSAxXSA9IHRoaXMuX2tleXNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmFsdWVzW2kgLSAxXSA9IHRoaXMuX3ZhbHVlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleXMubGVuZ3RoLS07XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl92YWx1ZXMubGVuZ3RoLS07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSB0aGlzLl9jYWNoZUtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlS2V5ID0gY2FjaGVTZW50aW5lbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZUluZGV4ID0gLTI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBNYXAucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXlzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlcy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZUtleSA9IGNhY2hlU2VudGluZWw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlSW5kZXggPSAtMjtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIE1hcC5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBNYXBJdGVyYXRvcih0aGlzLl9rZXlzLCB0aGlzLl92YWx1ZXMsIGdldEtleSk7IH07XG4gICAgICAgICAgICAgICAgTWFwLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgTWFwSXRlcmF0b3IodGhpcy5fa2V5cywgdGhpcy5fdmFsdWVzLCBnZXRWYWx1ZSk7IH07XG4gICAgICAgICAgICAgICAgTWFwLnByb3RvdHlwZS5lbnRyaWVzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IE1hcEl0ZXJhdG9yKHRoaXMuX2tleXMsIHRoaXMuX3ZhbHVlcywgZ2V0RW50cnkpOyB9O1xuICAgICAgICAgICAgICAgIE1hcC5wcm90b3R5cGVbXCJAQGl0ZXJhdG9yXCJdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5lbnRyaWVzKCk7IH07XG4gICAgICAgICAgICAgICAgTWFwLnByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLmVudHJpZXMoKTsgfTtcbiAgICAgICAgICAgICAgICBNYXAucHJvdG90eXBlLl9maW5kID0gZnVuY3Rpb24gKGtleSwgaW5zZXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jYWNoZUtleSAhPT0ga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZUluZGV4ID0gdGhpcy5fa2V5cy5pbmRleE9mKHRoaXMuX2NhY2hlS2V5ID0ga2V5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fY2FjaGVJbmRleCA8IDAgJiYgaW5zZXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZUluZGV4ID0gdGhpcy5fa2V5cy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9rZXlzLnB1c2goa2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlcy5wdXNoKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlSW5kZXg7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWFwO1xuICAgICAgICAgICAgfSgpKTtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldEtleShrZXksIF8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0VmFsdWUoXywgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRFbnRyeShrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtrZXksIHZhbHVlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBuYWl2ZSBTZXQgc2hpbVxuICAgICAgICBmdW5jdGlvbiBDcmVhdGVTZXRQb2x5ZmlsbCgpIHtcbiAgICAgICAgICAgIHJldHVybiAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gU2V0KCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYXAgPSBuZXcgX01hcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU2V0LnByb3RvdHlwZSwgXCJzaXplXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLl9tYXAuc2l6ZTsgfSxcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgU2V0LnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIHRoaXMuX21hcC5oYXModmFsdWUpOyB9O1xuICAgICAgICAgICAgICAgIFNldC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiB0aGlzLl9tYXAuc2V0KHZhbHVlLCB2YWx1ZSksIHRoaXM7IH07XG4gICAgICAgICAgICAgICAgU2V0LnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIHRoaXMuX21hcC5kZWxldGUodmFsdWUpOyB9O1xuICAgICAgICAgICAgICAgIFNldC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7IHRoaXMuX21hcC5jbGVhcigpOyB9O1xuICAgICAgICAgICAgICAgIFNldC5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX21hcC5rZXlzKCk7IH07XG4gICAgICAgICAgICAgICAgU2V0LnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLl9tYXAudmFsdWVzKCk7IH07XG4gICAgICAgICAgICAgICAgU2V0LnByb3RvdHlwZS5lbnRyaWVzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fbWFwLmVudHJpZXMoKTsgfTtcbiAgICAgICAgICAgICAgICBTZXQucHJvdG90eXBlW1wiQEBpdGVyYXRvclwiXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMua2V5cygpOyB9O1xuICAgICAgICAgICAgICAgIFNldC5wcm90b3R5cGVbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5rZXlzKCk7IH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFNldDtcbiAgICAgICAgICAgIH0oKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbmFpdmUgV2Vha01hcCBzaGltXG4gICAgICAgIGZ1bmN0aW9uIENyZWF0ZVdlYWtNYXBQb2x5ZmlsbCgpIHtcbiAgICAgICAgICAgIHZhciBVVUlEX1NJWkUgPSAxNjtcbiAgICAgICAgICAgIHZhciBrZXlzID0gSGFzaE1hcC5jcmVhdGUoKTtcbiAgICAgICAgICAgIHZhciByb290S2V5ID0gQ3JlYXRlVW5pcXVlS2V5KCk7XG4gICAgICAgICAgICByZXR1cm4gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIFdlYWtNYXAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2tleSA9IENyZWF0ZVVuaXF1ZUtleSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBXZWFrTWFwLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZSA9IEdldE9yQ3JlYXRlV2Vha01hcFRhYmxlKHRhcmdldCwgLypjcmVhdGUqLyBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YWJsZSAhPT0gdW5kZWZpbmVkID8gSGFzaE1hcC5oYXModGFibGUsIHRoaXMuX2tleSkgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFdlYWtNYXAucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlID0gR2V0T3JDcmVhdGVXZWFrTWFwVGFibGUodGFyZ2V0LCAvKmNyZWF0ZSovIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhYmxlICE9PSB1bmRlZmluZWQgPyBIYXNoTWFwLmdldCh0YWJsZSwgdGhpcy5fa2V5KSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFdlYWtNYXAucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICh0YXJnZXQsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZSA9IEdldE9yQ3JlYXRlV2Vha01hcFRhYmxlKHRhcmdldCwgLypjcmVhdGUqLyB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGFibGVbdGhpcy5fa2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFdlYWtNYXAucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYmxlID0gR2V0T3JDcmVhdGVXZWFrTWFwVGFibGUodGFyZ2V0LCAvKmNyZWF0ZSovIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhYmxlICE9PSB1bmRlZmluZWQgPyBkZWxldGUgdGFibGVbdGhpcy5fa2V5XSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgV2Vha01hcC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE5PVEU6IG5vdCBhIHJlYWwgY2xlYXIsIGp1c3QgbWFrZXMgdGhlIHByZXZpb3VzIGRhdGEgdW5yZWFjaGFibGVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fa2V5ID0gQ3JlYXRlVW5pcXVlS2V5KCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gV2Vha01hcDtcbiAgICAgICAgICAgIH0oKSk7XG4gICAgICAgICAgICBmdW5jdGlvbiBDcmVhdGVVbmlxdWVLZXkoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleTtcbiAgICAgICAgICAgICAgICBkb1xuICAgICAgICAgICAgICAgICAgICBrZXkgPSBcIkBAV2Vha01hcEBAXCIgKyBDcmVhdGVVVUlEKCk7XG4gICAgICAgICAgICAgICAgd2hpbGUgKEhhc2hNYXAuaGFzKGtleXMsIGtleSkpO1xuICAgICAgICAgICAgICAgIGtleXNba2V5XSA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIEdldE9yQ3JlYXRlV2Vha01hcFRhYmxlKHRhcmdldCwgY3JlYXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFoYXNPd24uY2FsbCh0YXJnZXQsIHJvb3RLZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY3JlYXRlKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgcm9vdEtleSwgeyB2YWx1ZTogSGFzaE1hcC5jcmVhdGUoKSB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtyb290S2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIEZpbGxSYW5kb21CeXRlcyhidWZmZXIsIHNpemUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7ICsraSlcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyW2ldID0gTWF0aC5yYW5kb20oKSAqIDB4ZmYgfCAwO1xuICAgICAgICAgICAgICAgIHJldHVybiBidWZmZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBHZW5SYW5kb21CeXRlcyhzaXplKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBVaW50OEFycmF5ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjcnlwdG8gIT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheShzaXplKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbXNDcnlwdG8gIT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbXNDcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KHNpemUpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZpbGxSYW5kb21CeXRlcyhuZXcgVWludDhBcnJheShzaXplKSwgc2l6ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBGaWxsUmFuZG9tQnl0ZXMobmV3IEFycmF5KHNpemUpLCBzaXplKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIENyZWF0ZVVVSUQoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBHZW5SYW5kb21CeXRlcyhVVUlEX1NJWkUpO1xuICAgICAgICAgICAgICAgIC8vIG1hcmsgYXMgcmFuZG9tIC0gUkZDIDQxMjIgwqcgNC40XG4gICAgICAgICAgICAgICAgZGF0YVs2XSA9IGRhdGFbNl0gJiAweDRmIHwgMHg0MDtcbiAgICAgICAgICAgICAgICBkYXRhWzhdID0gZGF0YVs4XSAmIDB4YmYgfCAweDgwO1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIG9mZnNldCA9IDA7IG9mZnNldCA8IFVVSURfU0laRTsgKytvZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJ5dGUgPSBkYXRhW29mZnNldF07XG4gICAgICAgICAgICAgICAgICAgIGlmIChvZmZzZXQgPT09IDQgfHwgb2Zmc2V0ID09PSA2IHx8IG9mZnNldCA9PT0gOClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBcIi1cIjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ5dGUgPCAxNilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBcIjBcIjtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IGJ5dGUudG9TdHJpbmcoMTYpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gdXNlcyBhIGhldXJpc3RpYyB1c2VkIGJ5IHY4IGFuZCBjaGFrcmEgdG8gZm9yY2UgYW4gb2JqZWN0IGludG8gZGljdGlvbmFyeSBtb2RlLlxuICAgICAgICBmdW5jdGlvbiBNYWtlRGljdGlvbmFyeShvYmopIHtcbiAgICAgICAgICAgIG9iai5fXyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGRlbGV0ZSBvYmouX187XG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG4gICAgfSk7XG59KShSZWZsZWN0IHx8IChSZWZsZWN0ID0ge30pKTtcbiIsImltcG9ydCB7IE1ldGFkYXRhLCBNZXRhZGF0YUNsYXNzLCBNZXRhZGF0YVJlYWRlciB9IGZyb20gJy4uL3R5cGVzL01ldGFkYXRhJztcbmltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgeyBjcmVhdGVEZWZhdWx0VmFsdWVNYXAgfSBmcm9tICcuLi9jb21tb24vRGVmYXVsdFZhbHVlTWFwJztcblxudHlwZSBBbnlNZXRhZGF0YSA9IE1ldGFkYXRhPE1ldGFkYXRhUmVhZGVyLCB1bmtub3duPjtcbnR5cGUgQW55TWV0YWRhdGFDbGFzcyA9IE1ldGFkYXRhQ2xhc3M8TWV0YWRhdGFSZWFkZXIsIHVua25vd24sIEFueU1ldGFkYXRhPjtcblxuY29uc3QgbWV0YWRhdGFJbnN0YW5jZU1hcCA9IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcDxBbnlNZXRhZGF0YUNsYXNzLCBTZXQ8QW55TWV0YWRhdGE+PigoKSA9PiBuZXcgU2V0KCkpO1xuXG5leHBvcnQgY2xhc3MgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIge1xuICAgIHN0YXRpYyBnZXRNZXRhZGF0YTxSIGV4dGVuZHMgTWV0YWRhdGFSZWFkZXIsIFQgZXh0ZW5kcyBPYmplY3QsIE0gZXh0ZW5kcyBNZXRhZGF0YTxSLCBUPiA9IE1ldGFkYXRhPFIsIFQ+PihcbiAgICAgICAgdGFyZ2V0OiBULFxuICAgICAgICBtZXRhZGF0YUNsYXNzOiBNZXRhZGF0YUNsYXNzPFIsIFQsIE0+XG4gICAgKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IG1ldGFkYXRhQ2xhc3MuZ2V0UmVmbGVjdEtleSgpO1xuICAgICAgICBsZXQgbWV0YWRhdGEgPSBSZWZsZWN0LmdldE1ldGFkYXRhKGtleSwgdGFyZ2V0KTtcbiAgICAgICAgaWYgKCFtZXRhZGF0YSkge1xuICAgICAgICAgICAgbWV0YWRhdGEgPSBuZXcgbWV0YWRhdGFDbGFzcygpO1xuICAgICAgICAgICAgbWV0YWRhdGEuaW5pdCh0YXJnZXQpO1xuICAgICAgICAgICAgUmVmbGVjdC5kZWZpbmVNZXRhZGF0YShrZXksIG1ldGFkYXRhLCB0YXJnZXQpO1xuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2VTZXQgPSBtZXRhZGF0YUluc3RhbmNlTWFwLmdldChtZXRhZGF0YUNsYXNzKTtcbiAgICAgICAgICAgIGluc3RhbmNlU2V0LmFkZChtZXRhZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1ldGFkYXRhIGFzIE07XG4gICAgfVxuICAgIHN0YXRpYyBnZXRBbGxJbnN0YW5jZW9mPE0gZXh0ZW5kcyBBbnlNZXRhZGF0YUNsYXNzPihtZXRhZGF0YUNsYXNzOiBNKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKG1ldGFkYXRhSW5zdGFuY2VNYXAuZ2V0KG1ldGFkYXRhQ2xhc3MpKTtcbiAgICB9XG59XG4iLCIvLyBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG5pbXBvcnQgeyBJbnN0YW5jZVNjb3BlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9JbnN0YW5jZVNjb3BlJztcbmltcG9ydCB7IEpzU2VydmljZUNsYXNzIH0gZnJvbSAnLi4vdHlwZXMvSnNTZXJ2aWNlQ2xhc3MnO1xuaW1wb3J0IHsgTWV0YWRhdGEsIE1ldGFkYXRhUmVhZGVyIH0gZnJvbSAnLi4vdHlwZXMvTWV0YWRhdGEnO1xuaW1wb3J0IHsgSWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0lkZW50aWZpZXInO1xuaW1wb3J0IHsgTGlmZWN5Y2xlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9MaWZlY3ljbGUnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgY3JlYXRlRGVmYXVsdFZhbHVlTWFwIH0gZnJvbSAnLi4vY29tbW9uL0RlZmF1bHRWYWx1ZU1hcCc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4vTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgTWVtYmVyS2V5IH0gZnJvbSAnLi4vdHlwZXMvTWVtYmVyS2V5JztcbmltcG9ydCB7IEtleU9mIH0gZnJvbSAnLi4vdHlwZXMvS2V5T2YnO1xuXG5jb25zdCBDTEFTU19NRVRBREFUQV9LRVkgPSAnaW9jOmNsYXNzLW1ldGFkYXRhJztcblxuZXhwb3J0IGludGVyZmFjZSBNYXJrSW5mbyB7XG4gICAgW2tleTogc3RyaW5nIHwgc3ltYm9sXTogdW5rbm93bjtcbn1cblxuZXhwb3J0IGNsYXNzIE1hcmtJbmZvQ29udGFpbmVyIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IG1hcCA9IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcDxNZW1iZXJLZXksIE1hcmtJbmZvPigoKSA9PiAoe30gYXMgTWFya0luZm8pKTtcbiAgICBnZXRNYXJrSW5mbyhtZXRob2Q6IE1lbWJlcktleSk6IE1hcmtJbmZvIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwLmdldChtZXRob2QpO1xuICAgIH1cbiAgICBtYXJrKG1ldGhvZDogTWVtYmVyS2V5LCBrZXk6IE1lbWJlcktleSwgdmFsdWU6IHVua25vd24pIHtcbiAgICAgICAgY29uc3QgbWFya0luZm8gPSB0aGlzLm1hcC5nZXQobWV0aG9kKTtcbiAgICAgICAgbWFya0luZm9ba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgICBnZXRNZW1iZXJzKCkge1xuICAgICAgICByZXR1cm4gbmV3IFNldCh0aGlzLm1hcC5rZXlzKCkpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBhcmFtZXRlck1hcmtJbmZvQ29udGFpbmVyIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IG1hcCA9IGNyZWF0ZURlZmF1bHRWYWx1ZU1hcDxNZW1iZXJLZXksIFJlY29yZDxudW1iZXIsIE1hcmtJbmZvPj4oKCkgPT4ge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfSk7XG4gICAgZ2V0TWFya0luZm8obWV0aG9kOiBNZW1iZXJLZXkpOiBSZWNvcmQ8bnVtYmVyLCBNYXJrSW5mbz4ge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXAuZ2V0KG1ldGhvZCk7XG4gICAgfVxuICAgIG1hcmsobWV0aG9kOiBNZW1iZXJLZXksIGluZGV4OiBudW1iZXIsIGtleTogTWVtYmVyS2V5LCB2YWx1ZTogdW5rbm93bikge1xuICAgICAgICBjb25zdCBwYXJhbXNNYXJrSW5mbyA9IHRoaXMubWFwLmdldChtZXRob2QpO1xuICAgICAgICBjb25zdCBtYXJrSW5mbyA9IHBhcmFtc01hcmtJbmZvW2luZGV4XSB8fCB7fTtcbiAgICAgICAgbWFya0luZm9ba2V5XSA9IHZhbHVlO1xuICAgICAgICBwYXJhbXNNYXJrSW5mb1tpbmRleF0gPSBtYXJrSW5mbztcbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhc3NNYXJrSW5mbyB7XG4gICAgY3RvcjogTWFya0luZm87XG4gICAgbWVtYmVyczogTWFya0luZm9Db250YWluZXI7XG4gICAgcGFyYW1zOiBQYXJhbWV0ZXJNYXJrSW5mb0NvbnRhaW5lcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDbGFzc01ldGFkYXRhUmVhZGVyPFQ+IGV4dGVuZHMgTWV0YWRhdGFSZWFkZXIge1xuICAgIGdldENsYXNzKCk6IE5ld2FibGU8VD47XG4gICAgZ2V0U2NvcGUoKTogSW5zdGFuY2VTY29wZSB8IHN0cmluZztcbiAgICBnZXRDb25zdHJ1Y3RvclBhcmFtZXRlclR5cGVzKCk6IEFycmF5PElkZW50aWZpZXI+O1xuICAgIGdldE1ldGhvZHMobGlmZWN5Y2xlOiBMaWZlY3ljbGUpOiBBcnJheTxzdHJpbmcgfCBzeW1ib2w+O1xuICAgIGdldFByb3BlcnR5VHlwZU1hcCgpOiBNYXA8c3RyaW5nIHwgc3ltYm9sLCBJZGVudGlmaWVyPjtcbiAgICBnZXRDdG9yTWFya0luZm8oKTogTWFya0luZm87XG4gICAgZ2V0QWxsTWFya2VkTWVtYmVycygpOiBTZXQ8TWVtYmVyS2V5PjtcbiAgICBnZXRNZW1iZXJzTWFya0luZm8obWV0aG9kS2V5OiBLZXlPZjxUPik6IE1hcmtJbmZvO1xuICAgIGdldFBhcmFtZXRlck1hcmtJbmZvKG1ldGhvZEtleTogS2V5T2Y8VD4pOiBSZWNvcmQ8bnVtYmVyLCBNYXJrSW5mbz47XG59XG5cbmV4cG9ydCBjbGFzcyBDbGFzc01ldGFkYXRhPFQ+IGltcGxlbWVudHMgTWV0YWRhdGE8Q2xhc3NNZXRhZGF0YVJlYWRlcjxUPiwgTmV3YWJsZTxUPj4ge1xuICAgIHN0YXRpYyBnZXRSZWZsZWN0S2V5KCkge1xuICAgICAgICByZXR1cm4gQ0xBU1NfTUVUQURBVEFfS0VZO1xuICAgIH1cbiAgICBwcml2YXRlIHNjb3BlOiBJbnN0YW5jZVNjb3BlIHwgc3RyaW5nID0gSW5zdGFuY2VTY29wZS5TSU5HTEVUT047XG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvclBhcmFtZXRlclR5cGVzOiBBcnJheTxJZGVudGlmaWVyPiA9IFtdO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbGlmZWN5Y2xlTWV0aG9kc01hcDogUmVjb3JkPHN0cmluZyB8IHN5bWJvbCwgU2V0PExpZmVjeWNsZT4+ID0ge307XG4gICAgcHJpdmF0ZSByZWFkb25seSBwcm9wZXJ0eVR5cGVzTWFwID0gbmV3IE1hcDxzdHJpbmcgfCBzeW1ib2wsIElkZW50aWZpZXI+KCk7XG4gICAgcHJpdmF0ZSBjbGF6eiE6IE5ld2FibGU8VD47XG4gICAgcHJpdmF0ZSByZWFkb25seSBtYXJrczogQ2xhc3NNYXJrSW5mbyA9IHtcbiAgICAgICAgY3Rvcjoge30sXG4gICAgICAgIG1lbWJlcnM6IG5ldyBNYXJrSW5mb0NvbnRhaW5lcigpLFxuICAgICAgICBwYXJhbXM6IG5ldyBQYXJhbWV0ZXJNYXJrSW5mb0NvbnRhaW5lcigpXG4gICAgfTtcblxuICAgIHN0YXRpYyBnZXRJbnN0YW5jZTxUPihjdG9yOiBOZXdhYmxlPFQ+KSB7XG4gICAgICAgIHJldHVybiBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICB9XG4gICAgc3RhdGljIGdldFJlYWRlcjxUPihjdG9yOiBOZXdhYmxlPFQ+KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEluc3RhbmNlKGN0b3IpLnJlYWRlcigpO1xuICAgIH1cblxuICAgIGluaXQodGFyZ2V0OiBOZXdhYmxlPFQ+KSB7XG4gICAgICAgIHRoaXMuY2xhenogPSB0YXJnZXQ7XG4gICAgICAgIGNvbnN0IGNvbnN0ciA9IHRhcmdldCBhcyBKc1NlcnZpY2VDbGFzczx1bmtub3duPjtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25zdHIuc2NvcGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U2NvcGUoY29uc3RyLnNjb3BlKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgY29uc3RyLmluamVjdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29uc3QgaW5qZWN0aW9ucyA9IGNvbnN0ci5pbmplY3QoKTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIGluamVjdGlvbnMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlY29yZFByb3BlcnR5VHlwZShrZXksIGluamVjdGlvbnNba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBjb25zdHIubWV0YWRhdGEgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gY29uc3RyLm1ldGFkYXRhKCk7XG4gICAgICAgICAgICBpZiAobWV0YWRhdGEuc2NvcGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNjb3BlKG1ldGFkYXRhLnNjb3BlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGluamVjdGlvbnMgPSBtZXRhZGF0YS5pbmplY3Q7XG4gICAgICAgICAgICBpZiAoaW5qZWN0aW9ucykge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIGluamVjdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWNvcmRQcm9wZXJ0eVR5cGUoa2V5LCBpbmplY3Rpb25zW2tleV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1hcmtlcigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGN0b3I6IChrZXk6IHN0cmluZyB8IHN5bWJvbCwgdmFsdWU6IHVua25vd24pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm1hcmtzLmN0b3Jba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1lbWJlcjogKHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wgfCBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBtYXJrOiAoa2V5OiBzdHJpbmcgfCBzeW1ib2wsIHZhbHVlOiB1bmtub3duKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtzLm1lbWJlcnMubWFyayhwcm9wZXJ0eUtleSwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhcmFtZXRlcjogKHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBtYXJrOiAoa2V5OiBzdHJpbmcgfCBzeW1ib2wsIHZhbHVlOiB1bmtub3duKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtzLnBhcmFtcy5tYXJrKHByb3BlcnR5S2V5LCBpbmRleCwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBzZXRTY29wZShzY29wZTogSW5zdGFuY2VTY29wZSB8IHN0cmluZykge1xuICAgICAgICB0aGlzLnNjb3BlID0gc2NvcGU7XG4gICAgfVxuICAgIHNldENvbnN0cnVjdG9yUGFyYW1ldGVyVHlwZShpbmRleDogbnVtYmVyLCBjbHM6IElkZW50aWZpZXIpIHtcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3RvclBhcmFtZXRlclR5cGVzW2luZGV4XSA9IGNscztcbiAgICB9XG4gICAgcmVjb3JkUHJvcGVydHlUeXBlKHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wsIHR5cGU6IElkZW50aWZpZXIpIHtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eVR5cGVzTWFwLnNldChwcm9wZXJ0eUtleSwgdHlwZSk7XG4gICAgfVxuICAgIGFkZExpZmVjeWNsZU1ldGhvZChtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2wsIGxpZmVjeWNsZTogTGlmZWN5Y2xlKSB7XG4gICAgICAgIGNvbnN0IGxpZmVjeWNsZXMgPSB0aGlzLmdldExpZmVjeWNsZXMobWV0aG9kTmFtZSk7XG4gICAgICAgIGxpZmVjeWNsZXMuYWRkKGxpZmVjeWNsZSk7XG4gICAgICAgIHRoaXMubGlmZWN5Y2xlTWV0aG9kc01hcFttZXRob2ROYW1lXSA9IGxpZmVjeWNsZXM7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0TGlmZWN5Y2xlcyhtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2wpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGlmZWN5Y2xlTWV0aG9kc01hcFttZXRob2ROYW1lXSB8fCBuZXcgU2V0PExpZmVjeWNsZT4oKTtcbiAgICB9XG4gICAgZ2V0TWV0aG9kcyhsaWZlY3ljbGU6IExpZmVjeWNsZSk6IEFycmF5PHN0cmluZyB8IHN5bWJvbD4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5saWZlY3ljbGVNZXRob2RzTWFwKS5maWx0ZXIoaXQgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGlmZWN5Y2xlcyA9IHRoaXMubGlmZWN5Y2xlTWV0aG9kc01hcFtpdF07XG4gICAgICAgICAgICByZXR1cm4gbGlmZWN5Y2xlcy5oYXMobGlmZWN5Y2xlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlYWRlcigpOiBDbGFzc01ldGFkYXRhUmVhZGVyPFQ+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldENsYXNzOiAoKSA9PiB0aGlzLmNsYXp6LFxuICAgICAgICAgICAgZ2V0U2NvcGU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zY29wZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRDb25zdHJ1Y3RvclBhcmFtZXRlclR5cGVzOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3JQYXJhbWV0ZXJUeXBlcy5zbGljZSgwKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRNZXRob2RzOiAobGlmZWN5Y2xlOiBMaWZlY3ljbGUpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRNZXRob2RzKGxpZmVjeWNsZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0UHJvcGVydHlUeXBlTWFwOiAoKSA9PiBuZXcgTWFwKHRoaXMucHJvcGVydHlUeXBlc01hcCksXG4gICAgICAgICAgICBnZXRDdG9yTWFya0luZm86ICgpOiBNYXJrSW5mbyA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgLi4udGhpcy5tYXJrcy5jdG9yIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0QWxsTWFya2VkTWVtYmVyczogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hcmtzLm1lbWJlcnMuZ2V0TWVtYmVycygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldE1lbWJlcnNNYXJrSW5mbzogKGtleTogS2V5T2Y8VD4pOiBNYXJrSW5mbyA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFya3MubWVtYmVycy5nZXRNYXJrSW5mbyhrZXkgYXMgTWVtYmVyS2V5KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRQYXJhbWV0ZXJNYXJrSW5mbzogKG1ldGhvZEtleTogS2V5T2Y8VD4pOiBSZWNvcmQ8bnVtYmVyLCBNYXJrSW5mbz4gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1hcmtzLnBhcmFtcy5nZXRNYXJrSW5mbyhtZXRob2RLZXkgYXMgTWVtYmVyS2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4uL3R5cGVzL1NlcnZpY2VGYWN0b3J5JztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4vQXBwbGljYXRpb25Db250ZXh0JztcblxuZXhwb3J0IGNsYXNzIFNlcnZpY2VGYWN0b3J5RGVmPFQ+IHtcbiAgICBzdGF0aWMgY3JlYXRlRnJvbUNsYXNzTWV0YWRhdGE8VD4obWV0YWRhdGE6IENsYXNzTWV0YWRhdGE8VD4pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTZXJ2aWNlRmFjdG9yeURlZigoY29udGFpbmVyOiBBcHBsaWNhdGlvbkNvbnRleHQsIG93bmVyOiB1bmtub3duKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlYWRlciA9IG1ldGFkYXRhLnJlYWRlcigpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNsYXp6ID0gcmVhZGVyLmdldENsYXNzKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRhaW5lci5nZXRJbnN0YW5jZShjbGF6eiwgb3duZXIpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBmYWN0b3J5OiBTZXJ2aWNlRmFjdG9yeTxULCB1bmtub3duPiwgcHVibGljIHJlYWRvbmx5IGluamVjdGlvbnM/OiBJZGVudGlmaWVyW10pIHt9XG59XG4iLCJpbXBvcnQgeyBNZXRhZGF0YSB9IGZyb20gJy4uL3R5cGVzL01ldGFkYXRhJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IFNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi4vdHlwZXMvU2VydmljZUZhY3RvcnknO1xuaW1wb3J0IHsgRmFjdG9yeUlkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9GYWN0b3J5SWRlbnRpZmllcic7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IFNlcnZpY2VGYWN0b3J5RGVmIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9TZXJ2aWNlRmFjdG9yeURlZic7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yJztcblxuZXhwb3J0IGludGVyZmFjZSBHbG9iYWxNZXRhZGF0YVJlYWRlciB7XG4gICAgZ2V0Q29tcG9uZW50RmFjdG9yeTxUPihrZXk6IEZhY3RvcnlJZGVudGlmaWVyKTogU2VydmljZUZhY3RvcnlEZWY8VD4gfCB1bmRlZmluZWQ7XG4gICAgZ2V0Q2xhc3NNZXRhZGF0YTxUPihhbGlhc05hbWU6IHN0cmluZyB8IHN5bWJvbCk6IENsYXNzTWV0YWRhdGE8VD4gfCB1bmRlZmluZWQ7XG4gICAgZ2V0SW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcygpOiBBcnJheTxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+Pjtcbn1cbmV4cG9ydCBjbGFzcyBHbG9iYWxNZXRhZGF0YSBpbXBsZW1lbnRzIE1ldGFkYXRhPEdsb2JhbE1ldGFkYXRhUmVhZGVyLCB2b2lkPiB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgSU5TVEFOQ0UgPSBuZXcgR2xvYmFsTWV0YWRhdGEoKTtcbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XG4gICAgICAgIHJldHVybiBHbG9iYWxNZXRhZGF0YS5JTlNUQU5DRTtcbiAgICB9XG4gICAgc3RhdGljIGdldFJlYWRlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoKS5yZWFkZXIoKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBjbGFzc0FsaWFzTWV0YWRhdGFNYXAgPSBuZXcgTWFwPHN0cmluZyB8IHN5bWJvbCwgQ2xhc3NNZXRhZGF0YTx1bmtub3duPj4oKTtcbiAgICBwcml2YXRlIGNvbXBvbmVudEZhY3RvcmllcyA9IG5ldyBNYXA8RmFjdG9yeUlkZW50aWZpZXIsIFNlcnZpY2VGYWN0b3J5RGVmPHVua25vd24+PigpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcHJvY2Vzc29yQ2xhc3NlczogU2V0PE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4+ID0gbmV3IFNldCgpO1xuICAgIHJlY29yZEZhY3Rvcnk8VD4oc3ltYm9sOiBGYWN0b3J5SWRlbnRpZmllciwgZmFjdG9yeTogU2VydmljZUZhY3Rvcnk8VCwgdW5rbm93bj4sIGluamVjdGlvbnM/OiBJZGVudGlmaWVyW10pIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnRGYWN0b3JpZXMuc2V0KHN5bWJvbCwgbmV3IFNlcnZpY2VGYWN0b3J5RGVmKGZhY3RvcnksIGluamVjdGlvbnMpKTtcbiAgICB9XG4gICAgcmVjb3JkQ2xhc3NBbGlhczxUPihhbGlhc05hbWU6IHN0cmluZyB8IHN5bWJvbCwgbWV0YWRhdGE6IENsYXNzTWV0YWRhdGE8VD4pIHtcbiAgICAgICAgdGhpcy5jbGFzc0FsaWFzTWV0YWRhdGFNYXAuc2V0KGFsaWFzTmFtZSwgbWV0YWRhdGEpO1xuICAgIH1cbiAgICByZWNvcmRQcm9jZXNzb3JDbGFzcyhjbGF6ejogTmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPikge1xuICAgICAgICB0aGlzLnByb2Nlc3NvckNsYXNzZXMuYWRkKGNsYXp6KTtcbiAgICB9XG4gICAgaW5pdCgpIHtcbiAgICAgICAgLy8gUEFTUztcbiAgICB9XG4gICAgcmVhZGVyKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0Q29tcG9uZW50RmFjdG9yeTogPFQ+KGtleTogRmFjdG9yeUlkZW50aWZpZXIpOiBTZXJ2aWNlRmFjdG9yeURlZjxUPiB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50RmFjdG9yaWVzLmdldChrZXkpIGFzIFNlcnZpY2VGYWN0b3J5RGVmPFQ+IHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldENsYXNzTWV0YWRhdGE6IDxUPihhbGlhc05hbWU6IHN0cmluZyB8IHN5bWJvbCk6IENsYXNzTWV0YWRhdGE8VD4gfCB1bmRlZmluZWQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNsYXNzQWxpYXNNZXRhZGF0YU1hcC5nZXQoYWxpYXNOYW1lKSBhcyBDbGFzc01ldGFkYXRhPFQ+IHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXM6ICgpOiBBcnJheTxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+PiA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5wcm9jZXNzb3JDbGFzc2VzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJleHBvcnQgaW50ZXJmYWNlIEV2YWx1YXRpb25PcHRpb25zPE8sIEUgZXh0ZW5kcyBzdHJpbmcsIEEgPSB1bmtub3duPiB7XG4gICAgdHlwZTogRTtcbiAgICBvd25lcj86IE87XG4gICAgcHJvcGVydHlOYW1lPzogc3RyaW5nIHwgc3ltYm9sO1xuICAgIGV4dGVybmFsQXJncz86IEE7XG59XG5cbmV4cG9ydCBlbnVtIEV4cHJlc3Npb25UeXBlIHtcbiAgICBFTlYgPSAnaW5qZWN0LWVudmlyb25tZW50LXZhcmlhYmxlcycsXG4gICAgSlNPTl9QQVRIID0gJ2luamVjdC1qc29uLWRhdGEnLFxuICAgIEFSR1YgPSAnaW5qZWN0LWFyZ3YnXG59XG4iLCJleHBvcnQgY29uc3QgaXNOb2RlSnMgPSAoKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGV2YWwoJ3JlcXVpcmUoXCJvc1wiKS5hcmNoKCk7Jyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn0pKCk7XG4iLCJpbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0dsb2JhbE1ldGFkYXRhJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuaW1wb3J0IHsgaXNOb2RlSnMgfSBmcm9tICcuLi9jb21tb24vaXNOb2RlSnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gVmFsdWU8QSA9IHVua25vd24+KGV4cHJlc3Npb246IHN0cmluZywgdHlwZTogRXhwcmVzc2lvblR5cGUgfCBzdHJpbmcsIGV4dGVybmFsQXJncz86IEEpOiBQcm9wZXJ0eURlY29yYXRvciB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgRXhwcmVzc2lvblR5cGUuRU5WOlxuICAgICAgICBjYXNlIEV4cHJlc3Npb25UeXBlLkFSR1Y6XG4gICAgICAgICAgICBpZiAoIWlzTm9kZUpzKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgXCIke3R5cGV9XCIgZXZhbHVhdG9yIG9ubHkgc3VwcG9ydHMgbm9kZWpzIGVudmlyb25tZW50IWApO1xuICAgICAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gKHRhcmdldDogT2JqZWN0LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sKSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEodGFyZ2V0LmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgY29uc3QgdmFsdWVfc3ltYm9sID0gU3ltYm9sKCcnKTtcbiAgICAgICAgbWV0YWRhdGEucmVjb3JkUHJvcGVydHlUeXBlKHByb3BlcnR5S2V5LCB2YWx1ZV9zeW1ib2wpO1xuICAgICAgICBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlY29yZEZhY3RvcnkodmFsdWVfc3ltYm9sLCAoY29udGFpbmVyLCBvd25lcikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICgpID0+XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmV2YWx1YXRlPHN0cmluZywgdHlwZW9mIG93bmVyLCBBPihleHByZXNzaW9uIGFzIHN0cmluZywge1xuICAgICAgICAgICAgICAgICAgICBvd25lcixcbiAgICAgICAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgZXh0ZXJuYWxBcmdzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBWYWx1ZSB9IGZyb20gJy4vVmFsdWUnO1xuaW1wb3J0IHsgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gQXJndihuYW1lOiBzdHJpbmcsIGFyZ3Y6IHN0cmluZ1tdID0gcHJvY2Vzcy5hcmd2KSB7XG4gICAgcmV0dXJuIFZhbHVlKG5hbWUsIEV4cHJlc3Npb25UeXBlLkFSR1YsIGFyZ3YpO1xufVxuIiwiaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9HbG9iYWxNZXRhZGF0YSc7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIEJpbmQoYWxpYXNOYW1lOiBzdHJpbmcgfCBzeW1ib2wpOiBDbGFzc0RlY29yYXRvciB7XG4gICAgcmV0dXJuIDxURnVuY3Rpb24gZXh0ZW5kcyBGdW5jdGlvbj4odGFyZ2V0OiBURnVuY3Rpb24pID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQgYXMgdW5rbm93biBhcyBOZXdhYmxlPHVua25vd24+LCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWNvcmRDbGFzc0FsaWFzKGFsaWFzTmFtZSwgbWV0YWRhdGEpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBWYWx1ZSB9IGZyb20gJy4vVmFsdWUnO1xuaW1wb3J0IHsgRXhwcmVzc2lvblR5cGUgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0ZU9wdGlvbnMnO1xuXG5leHBvcnQgZnVuY3Rpb24gRW52KG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiBWYWx1ZShuYW1lLCBFeHByZXNzaW9uVHlwZS5FTlYpO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGlzTnVsbCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIG51bGwge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZTogdW5rbm93bik6IHZhbHVlIGlzIHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQ7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNOb3REZWZpbmVkPFQ+KHZhbHVlOiBUIHwgdW5kZWZpbmVkIHwgbnVsbCk6IHZhbHVlIGlzIHVuZGVmaW5lZCB8IG51bGwge1xuICAgIHJldHVybiBpc051bGwodmFsdWUpIHx8IGlzVW5kZWZpbmVkKHZhbHVlKTtcbn1cbiIsImltcG9ydCB7IEdsb2JhbE1ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvR2xvYmFsTWV0YWRhdGEnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgRmFjdG9yeUlkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9GYWN0b3J5SWRlbnRpZmllcic7XG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlJztcbmltcG9ydCB7IGlzTm90RGVmaW5lZCB9IGZyb20gJy4uL2NvbW1vbi9pc05vdERlZmluZWQnO1xuXG5leHBvcnQgZnVuY3Rpb24gRmFjdG9yeShwcm9kdWNlSWRlbnRpZmllcj86IEZhY3RvcnlJZGVudGlmaWVyKTogTWV0aG9kRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gKHRhcmdldDogT2JqZWN0LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sKSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldGFkYXRhID0gR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKTtcbiAgICAgICAgY29uc3QgY2xhenogPSB0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTxJbnN0YW5jZTx1bmtub3duPj47XG5cbiAgICAgICAgaWYgKGlzTm90RGVmaW5lZChwcm9kdWNlSWRlbnRpZmllcikpIHtcbiAgICAgICAgICAgIHByb2R1Y2VJZGVudGlmaWVyID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnZGVzaWduOnJldHVybnR5cGUnLCB0YXJnZXQsIHByb3BlcnR5S2V5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNOb3REZWZpbmVkKHByb2R1Y2VJZGVudGlmaWVyKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgcmV0dXJuIHR5cGUgbm90IHJlY29nbml6ZWQsIGNhbm5vdCBwZXJmb3JtIGluc3RhbmNlIGNyZWF0aW9uIScpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGluamVjdGlvbnMgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdkZXNpZ246cGFyYW10eXBlcycsIHRhcmdldCwgcHJvcGVydHlLZXkpO1xuXG4gICAgICAgIG1ldGFkYXRhLnJlY29yZEZhY3RvcnkoXG4gICAgICAgICAgICBwcm9kdWNlSWRlbnRpZmllcixcbiAgICAgICAgICAgIChjb250YWluZXIsIG93bmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBjb250YWluZXIuZ2V0SW5zdGFuY2UoY2xhenosIG93bmVyKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmdW5jID0gaW5zdGFuY2VbcHJvcGVydHlLZXldO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZnVuYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gY29udGFpbmVyLmdldEluc3RhbmNlKGNsYXp6KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jLmFwcGx5KGluc3RhbmNlLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4gZnVuYztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5qZWN0aW9uc1xuICAgICAgICApO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IGlzTm90RGVmaW5lZCB9IGZyb20gJy4uL2NvbW1vbi9pc05vdERlZmluZWQnO1xuXG5leHBvcnQgZnVuY3Rpb24gSW5qZWN0PFQ+KGNvbnN0cj86IElkZW50aWZpZXI8VD4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gPFRhcmdldD4odGFyZ2V0OiBUYXJnZXQsIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wsIHBhcmFtZXRlckluZGV4PzogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBwYXJhbWV0ZXJJbmRleCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIC8vIGNvbnN0cnVjdG9yIHBhcmFtZXRlclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0Q29uc3RyID0gdGFyZ2V0IGFzIE5ld2FibGU8VD47XG4gICAgICAgICAgICBpZiAoaXNOb3REZWZpbmVkKGNvbnN0cikpIHtcbiAgICAgICAgICAgICAgICBjb25zdHIgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdkZXNpZ246cGFyYW10eXBlcycsIHRhcmdldCwgcHJvcGVydHlLZXkpW3BhcmFtZXRlckluZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc05vdERlZmluZWQoY29uc3RyKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHlwZSBub3QgcmVjb2duaXplZCwgaW5qZWN0aW9uIGNhbm5vdCBiZSBwZXJmb3JtZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGNsYXNzTWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXRDb25zdHIsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICAgICAgY2xhc3NNZXRhZGF0YS5zZXRDb25zdHJ1Y3RvclBhcmFtZXRlclR5cGUocGFyYW1ldGVySW5kZXgsIGNvbnN0cik7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ29iamVjdCcgJiYgdGFyZ2V0ICE9PSBudWxsICYmIHByb3BlcnR5S2V5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIHByb3BlcnR5XG4gICAgICAgICAgICBpZiAoaXNOb3REZWZpbmVkKGNvbnN0cikpIHtcbiAgICAgICAgICAgICAgICBjb25zdHIgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdkZXNpZ246dHlwZScsIHRhcmdldCwgcHJvcGVydHlLZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzTm90RGVmaW5lZChjb25zdHIpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUeXBlIG5vdCByZWNvZ25pemVkLCBpbmplY3Rpb24gY2Fubm90IGJlIHBlcmZvcm1lZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQuY29uc3RydWN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICAgICAgbWV0YWRhdGEucmVjb3JkUHJvcGVydHlUeXBlKHByb3BlcnR5S2V5LCBjb25zdHIpO1xuICAgICAgICB9XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3IgfSBmcm9tICcuLi90eXBlcy9JbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3InO1xuaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9HbG9iYWxNZXRhZGF0YSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBJbnN0QXdhcmVQcm9jZXNzb3IoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIDxDbHMgZXh0ZW5kcyBOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+Pih0YXJnZXQ6IENscykge1xuICAgICAgICBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlY29yZFByb2Nlc3NvckNsYXNzKHRhcmdldCk7XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IFZhbHVlIH0gZnJvbSAnLi9WYWx1ZSc7XG5pbXBvcnQgeyBFeHByZXNzaW9uVHlwZSB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRlT3B0aW9ucyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBKU09ORGF0YShuYW1lc3BhY2U6IHN0cmluZywganNvbnBhdGg6IHN0cmluZykge1xuICAgIHJldHVybiBWYWx1ZShgJHtuYW1lc3BhY2V9OiR7anNvbnBhdGh9YCwgRXhwcmVzc2lvblR5cGUuSlNPTl9QQVRIKTtcbn1cbiIsImltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcblxuLyoqXG4gKiBVcm4gY2FsbHMgdGhlIG1ldGhvZHMgYW5ub3RhdGVkIHdpdGggQFBvc3RJbmplY3Qgb25seSBvbmNlLCBqdXN0IGFmdGVyIHRoZSBpbmplY3Rpb24gb2YgcHJvcGVydGllcy5cbiAqIEBhbm5vdGF0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBMaWZlY3ljbGVEZWNvcmF0b3IgPSAobGlmZWN5Y2xlOiBMaWZlY3ljbGUpOiBNZXRob2REZWNvcmF0b3IgPT4ge1xuICAgIHJldHVybiAodGFyZ2V0OiBPYmplY3QsIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wpID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YSh0YXJnZXQuY29uc3RydWN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBtZXRhZGF0YS5hZGRMaWZlY3ljbGVNZXRob2QocHJvcGVydHlLZXksIGxpZmVjeWNsZSk7XG4gICAgfTtcbn07XG4iLCJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBNYXJrKGtleTogc3RyaW5nIHwgc3ltYm9sLCB2YWx1ZTogdW5rbm93biA9IHRydWUpOiBGdW5jdGlvbiB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChcbiAgICAgICAgLi4uYXJnczpcbiAgICAgICAgICAgIHwgUGFyYW1ldGVyczxDbGFzc0RlY29yYXRvcj5cbiAgICAgICAgICAgIHwgUGFyYW1ldGVyczxNZXRob2REZWNvcmF0b3I+XG4gICAgICAgICAgICB8IFBhcmFtZXRlcnM8UHJvcGVydHlEZWNvcmF0b3I+XG4gICAgICAgICAgICB8IFBhcmFtZXRlcnM8UGFyYW1ldGVyRGVjb3JhdG9yPlxuICAgICkge1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIC8vIGNsYXNzIGRlY29yYXRvclxuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShhcmdzWzBdLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgICAgIG1ldGFkYXRhLm1hcmtlcigpLmN0b3Ioa2V5LCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJncy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIC8vIHByb3BlcnR5IGRlY29yYXRvclxuICAgICAgICAgICAgY29uc3QgW3Byb3RvdHlwZSwgcHJvcGVydHlLZXldID0gYXJncztcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEocHJvdG90eXBlLmNvbnN0cnVjdG9yLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgICAgIG1ldGFkYXRhLm1hcmtlcigpLm1lbWJlcihwcm9wZXJ0eUtleSkubWFyayhrZXksIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMyAmJiB0eXBlb2YgYXJnc1syXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIC8vIHBhcmFtZXRlciBkZWNvcmF0b3JcbiAgICAgICAgICAgIGNvbnN0IFtwcm90b3R5cGUsIHByb3BlcnR5S2V5LCBpbmRleF0gPSBhcmdzO1xuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShwcm90b3R5cGUuY29uc3RydWN0b3IsIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICAgICAgbWV0YWRhdGEubWFya2VyKCkucGFyYW1ldGVyKHByb3BlcnR5S2V5LCBpbmRleCkubWFyayhrZXksIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIG1ldGhvZCBkZWNvcmF0b3JcbiAgICAgICAgICAgIGNvbnN0IFtwcm90b3R5cGUsIHByb3BlcnR5S2V5XSA9IGFyZ3M7XG4gICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHByb3RvdHlwZS5jb25zdHJ1Y3RvciwgQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICBtZXRhZGF0YS5tYXJrZXIoKS5tZW1iZXIocHJvcGVydHlLZXkpLm1hcmsoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuIiwiZXhwb3J0IGVudW0gTGlmZWN5Y2xlIHtcbiAgICBQUkVfSU5KRUNUID0gJ2lvYy1zY29wZTpwcmUtaW5qZWN0JyxcbiAgICBQT1NUX0lOSkVDVCA9ICdpb2Mtc2NvcGU6cG9zdC1pbmplY3QnLFxuICAgIFBSRV9ERVNUUk9ZID0gJ2lvYy1zY29wZTpwcmUtZGVzdHJveSdcbn1cbiIsImltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5pbXBvcnQgeyBMaWZlY3ljbGVEZWNvcmF0b3IgfSBmcm9tICcuL0xpZmVjeWNsZURlY29yYXRvcic7XG5cbi8qKlxuICogVXJuIGNhbGxzIHRoZSBtZXRob2RzIGFubm90YXRlZCB3aXRoIEBQb3N0SW5qZWN0IG9ubHkgb25jZSwganVzdCBhZnRlciB0aGUgaW5qZWN0aW9uIG9mIHByb3BlcnRpZXMuXG4gKiBAYW5ub3RhdGlvblxuICovXG5leHBvcnQgY29uc3QgUG9zdEluamVjdCA9ICgpOiBNZXRob2REZWNvcmF0b3IgPT4gTGlmZWN5Y2xlRGVjb3JhdG9yKExpZmVjeWNsZS5QT1NUX0lOSkVDVCk7XG4iLCJpbXBvcnQgeyBMaWZlY3ljbGVEZWNvcmF0b3IgfSBmcm9tICcuL0xpZmVjeWNsZURlY29yYXRvcic7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5cbmV4cG9ydCBjb25zdCBQcmVEZXN0cm95ID0gKCkgPT4gTGlmZWN5Y2xlRGVjb3JhdG9yKExpZmVjeWNsZS5QUkVfREVTVFJPWSk7XG4iLCJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9MaWZlY3ljbGUnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlRGVjb3JhdG9yIH0gZnJvbSAnLi9MaWZlY3ljbGVEZWNvcmF0b3InO1xuXG4vKipcbiAqIFVybiBjYWxscyB0aGUgbWV0aG9kcyBhbm5vdGF0ZWQgd2l0aCBAUG9zdEluamVjdCBvbmx5IG9uY2UsIGp1c3QgYWZ0ZXIgdGhlIGluamVjdGlvbiBvZiBwcm9wZXJ0aWVzLlxuICogQGFubm90YXRpb25cbiAqL1xuZXhwb3J0IGNvbnN0IFByZUluamVjdCA9ICgpOiBNZXRob2REZWNvcmF0b3IgPT4gTGlmZWN5Y2xlRGVjb3JhdG9yKExpZmVjeWNsZS5QUkVfSU5KRUNUKTtcbiIsImltcG9ydCB7IEluc3RhbmNlU2NvcGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0luc3RhbmNlU2NvcGUnO1xuaW1wb3J0IHsgQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0NsYXNzTWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBTY29wZShzY29wZTogSW5zdGFuY2VTY29wZSB8IHN0cmluZyk6IENsYXNzRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gPFRGdW5jdGlvbiBleHRlbmRzIEZ1bmN0aW9uPih0YXJnZXQ6IFRGdW5jdGlvbikgPT4ge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRhcmdldCBhcyB1bmtub3duIGFzIE5ld2FibGU8dW5rbm93bj4sIENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBtZXRhZGF0YS5zZXRTY29wZShzY29wZSk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IEFueUZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMvQW55RnVuY3Rpb24nO1xuXG5leHBvcnQgdHlwZSBFdmVudExpc3RlbmVyID0gQW55RnVuY3Rpb247XG5leHBvcnQgY2xhc3MgRXZlbnRFbWl0dGVyIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGV2ZW50cyA9IG5ldyBNYXA8c3RyaW5nIHwgc3ltYm9sLCBFdmVudExpc3RlbmVyW10+KCk7XG5cbiAgICBvbih0eXBlOiBzdHJpbmcgfCBzeW1ib2wsIGxpc3RlbmVyOiBFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLmV2ZW50cy5nZXQodHlwZSk7XG4gICAgICAgIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcikgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMgPSBbbGlzdGVuZXJdO1xuICAgICAgICAgICAgdGhpcy5ldmVudHMuc2V0KHR5cGUsIGxpc3RlbmVycyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxzID0gbGlzdGVuZXJzIGFzIEV2ZW50TGlzdGVuZXJbXTtcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gbHMuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIGxzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIGVtaXQodHlwZTogc3RyaW5nIHwgc3ltYm9sLCAuLi5hcmdzOiB1bmtub3duW10pIHtcbiAgICAgICAgdGhpcy5ldmVudHMuZ2V0KHR5cGUpPy5mb3JFYWNoKGZuID0+IHtcbiAgICAgICAgICAgIGZuKC4uLmFyZ3MpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5cbnR5cGUgSW52b2tlRnVuY3Rpb25BcmdzID0ge1xuICAgIGFyZ3M/OiB1bmtub3duW107XG59O1xudHlwZSBJbnZva2VGdW5jdGlvbkluamVjdGlvbnMgPSB7XG4gICAgaW5qZWN0aW9ucz86IElkZW50aWZpZXJbXTtcbn07XG5cbnR5cGUgSW52b2tlRnVuY3Rpb25CYXNpY09wdGlvbnM8VD4gPSB7XG4gICAgY29udGV4dD86IFQ7XG59O1xuXG5leHBvcnQgdHlwZSBJbnZva2VGdW5jdGlvbk9wdGlvbnM8VD4gPVxuICAgIHwgKEludm9rZUZ1bmN0aW9uQmFzaWNPcHRpb25zPFQ+ICYgSW52b2tlRnVuY3Rpb25BcmdzKVxuICAgIHwgKEludm9rZUZ1bmN0aW9uQmFzaWNPcHRpb25zPFQ+ICYgSW52b2tlRnVuY3Rpb25JbmplY3Rpb25zKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGhhc0FyZ3M8VD4ob3B0aW9uczogSW52b2tlRnVuY3Rpb25PcHRpb25zPFQ+KTogb3B0aW9ucyBpcyBJbnZva2VGdW5jdGlvbkJhc2ljT3B0aW9uczxUPiAmIEludm9rZUZ1bmN0aW9uQXJncyB7XG4gICAgcmV0dXJuICdhcmdzJyBpbiBvcHRpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzSW5qZWN0aW9uczxUPihcbiAgICBvcHRpb25zOiBJbnZva2VGdW5jdGlvbk9wdGlvbnM8VD5cbik6IG9wdGlvbnMgaXMgSW52b2tlRnVuY3Rpb25CYXNpY09wdGlvbnM8VD4gJiBJbnZva2VGdW5jdGlvbkluamVjdGlvbnMge1xuICAgIHJldHVybiAnaW5qZWN0aW9ucycgaW4gb3B0aW9ucztcbn1cbiIsIlwidXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO1xuLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cblxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG52YXIgZT1mdW5jdGlvbigpe3JldHVybiBlPU9iamVjdC5hc3NpZ258fGZ1bmN0aW9uKGUpe2Zvcih2YXIgdCxyPTEsbj1hcmd1bWVudHMubGVuZ3RoO3I8bjtyKyspZm9yKHZhciBvIGluIHQ9YXJndW1lbnRzW3JdKU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pJiYoZVtvXT10W29dKTtyZXR1cm4gZX0sZS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9O2Z1bmN0aW9uIHQoKXt9dmFyIHI9e30sbj1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoZSl7dGhpcy5ldmFsdWF0ZVJlc3VsdD1yLHRoaXMuY29udGV4dD1lLnRhcmdldCx0aGlzLmNvbXB1dGVGbj1lLmV2YWx1YXRlLHRoaXMucmVzZXRUZXN0ZXI9ZS5yZXNldFRlc3RlcnN9cmV0dXJuIGUucHJvdG90eXBlLnJlbGVhc2U9ZnVuY3Rpb24oKXt0aGlzLnJlc2V0KHQpfSxlLnByb3RvdHlwZS5yZXNldD1mdW5jdGlvbihlKXt0aGlzLmV2YWx1YXRlUmVzdWx0PXIsdGhpcy5jb21wdXRlRm49ZXx8dGhpcy5jb21wdXRlRm59LGUucHJvdG90eXBlLmV2YWx1YXRlPWZ1bmN0aW9uKCl7dGhpcy5pc1ByZXNlbnQoKSYmIXRoaXMubmVlZFJlc2V0KCl8fCh0aGlzLmV2YWx1YXRlUmVzdWx0PXRoaXMuY29tcHV0ZUZuLmNhbGwodGhpcy5jb250ZXh0LHRoaXMuY29udGV4dCkpfSxlLnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ldmFsdWF0ZSgpLHRoaXMuZXZhbHVhdGVSZXN1bHR9LGUucHJvdG90eXBlLmlzUHJlc2VudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmV2YWx1YXRlUmVzdWx0IT09cn0sZS5wcm90b3R5cGUubmVlZFJlc2V0PWZ1bmN0aW9uKCl7dmFyIGU9dGhpcztyZXR1cm4gdGhpcy5yZXNldFRlc3Rlci5zb21lKChmdW5jdGlvbih0KXtyZXR1cm4gdChlLmNvbnRleHQpfSkpfSxlfSgpO2Z1bmN0aW9uIG8odCxyLG8pe3ZhciB1O3U9XCJmdW5jdGlvblwiPT10eXBlb2Ygbz97ZXZhbHVhdGU6b306ZSh7fSxvKTt2YXIgYT1PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQscik7aWYoYSYmIWEuY29uZmlndXJhYmxlKXRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBvdmVycmlkZSBvdmVycmlkZSBwcm9wZXJ0eTogXCIrU3RyaW5nKHIpKTt2YXIgaT1cImJvb2xlYW5cIj09dHlwZW9mIHUuZW51bWVyYWJsZT91LmVudW1lcmFibGU6KG51bGw9PWE/dm9pZCAwOmEuZW51bWVyYWJsZSl8fCEwLHM9dS5yZXNldEJ5fHxbXSxsPWZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGUsdCxyLG8pe2UuX19sYXp5X198fE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19sYXp5X19cIix7dmFsdWU6e30sZW51bWVyYWJsZTohMSx3cml0YWJsZTohMSxjb25maWd1cmFibGU6ITF9KTt2YXIgdT1lLl9fbGF6eV9fO2lmKCF1W3RdKXt2YXIgYT1vLm1hcCgoZnVuY3Rpb24oZSl7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIGV8fFwibnVtYmVyXCI9PXR5cGVvZiBlfHxcInN5bWJvbFwiPT10eXBlb2YgZT9mdW5jdGlvbihlKXt2YXIgdDtyZXR1cm4gZnVuY3Rpb24ocil7dmFyIG49cltlXSxvPW4hPT10O3JldHVybiB0PW4sb319KGUpOih0PWUsZnVuY3Rpb24oZSl7dmFyIG49dChlKSxvPW4hPT1yO3JldHVybiByPW4sb30pO3ZhciB0LHJ9KSk7dVt0XT1uZXcgbih7dGFyZ2V0OmUsZXZhbHVhdGU6cixyZXNldFRlc3RlcnM6YX0pfXJldHVybiB1W3RdfSh0aGlzLHIsdS5ldmFsdWF0ZSxzKX07cmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LHIse2NvbmZpZ3VyYWJsZTohMCxlbnVtZXJhYmxlOmksZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGwuY2FsbCh0aGlzKS5nZXQoKX19KSxsfWZ1bmN0aW9uIHUoZSx0LHIpe3JldHVybiBvKGUsdCxyKS5jYWxsKGUpfWV4cG9ydHMubGF6eU1lbWJlcj1mdW5jdGlvbihlKXtyZXR1cm4gZnVuY3Rpb24odCxyKXtvKHQscixlKX19LGV4cG9ydHMubGF6eU1lbWJlck9mQ2xhc3M9ZnVuY3Rpb24oZSx0LHIpe28oZS5wcm90b3R5cGUsdCxyKX0sZXhwb3J0cy5sYXp5UHJvcD11LGV4cG9ydHMubGF6eVZhbD1mdW5jdGlvbihlKXtyZXR1cm4gdSh7X192YWxfXzpudWxsfSxcIl9fdmFsX19cIixlKX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5janMuanMubWFwXG4iLCJpbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhLCBDbGFzc01ldGFkYXRhUmVhZGVyIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IExpZmVjeWNsZSB9IGZyb20gJy4vTGlmZWN5Y2xlJztcbmltcG9ydCB7IEluc3RhbmNlIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2UnO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuXG5leHBvcnQgY2xhc3MgTGlmZWN5Y2xlTWFuYWdlcjxUID0gdW5rbm93bj4ge1xuICAgIHByaXZhdGUgY2xhc3NNZXRhZGF0YVJlYWRlcjogQ2xhc3NNZXRhZGF0YVJlYWRlcjxUPjtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGNvbXBvbmVudENsYXNzOiBOZXdhYmxlPFQ+LCBwcml2YXRlIHJlYWRvbmx5IGNvbnRhaW5lcjogQXBwbGljYXRpb25Db250ZXh0KSB7XG4gICAgICAgIHRoaXMuY2xhc3NNZXRhZGF0YVJlYWRlciA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKHRoaXMuY29tcG9uZW50Q2xhc3MsIENsYXNzTWV0YWRhdGEpLnJlYWRlcigpO1xuICAgIH1cbiAgICBpbnZva2VQcmVJbmplY3RNZXRob2QoaW5zdGFuY2U6IEluc3RhbmNlPFQ+KSB7XG4gICAgICAgIGNvbnN0IG1ldGhvZHMgPSB0aGlzLmNsYXNzTWV0YWRhdGFSZWFkZXIuZ2V0TWV0aG9kcyhMaWZlY3ljbGUuUFJFX0lOSkVDVCk7XG4gICAgICAgIHRoaXMuaW52b2tlTGlmZWN5Y2xlTWV0aG9kcyhpbnN0YW5jZSwgbWV0aG9kcyk7XG4gICAgfVxuICAgIGludm9rZVBvc3RJbmplY3RNZXRob2QoaW5zdGFuY2U6IEluc3RhbmNlPFQ+KSB7XG4gICAgICAgIGNvbnN0IG1ldGhvZHMgPSB0aGlzLmNsYXNzTWV0YWRhdGFSZWFkZXIuZ2V0TWV0aG9kcyhMaWZlY3ljbGUuUE9TVF9JTkpFQ1QpO1xuICAgICAgICB0aGlzLmludm9rZUxpZmVjeWNsZU1ldGhvZHMoaW5zdGFuY2UsIG1ldGhvZHMpO1xuICAgIH1cbiAgICBpbnZva2VQcmVEZXN0cm95SW5qZWN0TWV0aG9kKGluc3RhbmNlOiBJbnN0YW5jZTxUPikge1xuICAgICAgICBjb25zdCBtZXRob2RzID0gdGhpcy5jbGFzc01ldGFkYXRhUmVhZGVyLmdldE1ldGhvZHMoTGlmZWN5Y2xlLlBSRV9ERVNUUk9ZKTtcbiAgICAgICAgdGhpcy5pbnZva2VMaWZlY3ljbGVNZXRob2RzKGluc3RhbmNlLCBtZXRob2RzKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBpbnZva2VMaWZlY3ljbGVNZXRob2RzKGluc3RhbmNlOiBJbnN0YW5jZTxUPiwgbWV0aG9kS2V5czogQXJyYXk8c3RyaW5nIHwgc3ltYm9sPikge1xuICAgICAgICBtZXRob2RLZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmludm9rZShpbnN0YW5jZVtrZXldLCB7XG4gICAgICAgICAgICAgICAgY29udGV4dDogaW5zdGFuY2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhLCBDbGFzc01ldGFkYXRhUmVhZGVyIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlJztcbmltcG9ydCB7IFNlcnZpY2VGYWN0b3J5RGVmIH0gZnJvbSAnLi9TZXJ2aWNlRmFjdG9yeURlZic7XG5pbXBvcnQgeyBHbG9iYWxNZXRhZGF0YSB9IGZyb20gJy4uL21ldGFkYXRhL0dsb2JhbE1ldGFkYXRhJztcbmltcG9ydCB7IGxhenlQcm9wIH0gZnJvbSAnQHZnZXJib3QvbGF6eSc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXIgfSBmcm9tICcuL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXInO1xuaW1wb3J0IHsgTGlmZWN5Y2xlTWFuYWdlciB9IGZyb20gJy4vTGlmZWN5Y2xlTWFuYWdlcic7XG5cbmV4cG9ydCBjbGFzcyBDb21wb25lbnRJbnN0YW5jZUJ1aWxkZXI8VD4ge1xuICAgIHByaXZhdGUgZ2V0Q29uc3RydWN0b3JBcmdzOiAoKSA9PiB1bmtub3duW10gPSAoKSA9PiBbXTtcbiAgICBwcml2YXRlIHByb3BlcnR5RmFjdG9yaWVzOiBSZWNvcmQ8c3RyaW5nIHwgc3ltYm9sLCBTZXJ2aWNlRmFjdG9yeURlZjx1bmtub3duPj4gPSB7fTtcbiAgICBwcml2YXRlIGxhenlNb2RlOiBib29sZWFuID0gdHJ1ZTtcbiAgICBwcml2YXRlIGxpZmVjeWNsZVJlc29sdmVyOiBMaWZlY3ljbGVNYW5hZ2VyPFQ+O1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGNvbXBvbmVudENsYXNzOiBOZXdhYmxlPFQ+LFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGNvbnRhaW5lcjogQXBwbGljYXRpb25Db250ZXh0LFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXI6IEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXJcbiAgICApIHtcbiAgICAgICAgdGhpcy5saWZlY3ljbGVSZXNvbHZlciA9IG5ldyBMaWZlY3ljbGVNYW5hZ2VyPFQ+KGNvbXBvbmVudENsYXNzLCBjb250YWluZXIpO1xuICAgICAgICBjb25zdCByZWFkZXIgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShjb21wb25lbnRDbGFzcywgQ2xhc3NNZXRhZGF0YSkucmVhZGVyKCk7XG4gICAgICAgIHRoaXMuYXBwZW5kQ2xhc3NNZXRhZGF0YShyZWFkZXIpO1xuICAgIH1cbiAgICBhcHBlbmRMYXp5TW9kZShsYXp5TW9kZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLmxhenlNb2RlID0gbGF6eU1vZGU7XG4gICAgfVxuICAgIHByaXZhdGUgYXBwZW5kQ2xhc3NNZXRhZGF0YTxUPihjbGFzc01ldGFkYXRhUmVhZGVyOiBDbGFzc01ldGFkYXRhUmVhZGVyPFQ+KSB7XG4gICAgICAgIGNvbnN0IHR5cGVzID0gY2xhc3NNZXRhZGF0YVJlYWRlci5nZXRDb25zdHJ1Y3RvclBhcmFtZXRlclR5cGVzKCk7XG4gICAgICAgIHRoaXMuZ2V0Q29uc3RydWN0b3JBcmdzID0gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVzLm1hcChpdCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udGFpbmVyLmdldEluc3RhbmNlKGl0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBnbG9iYWxNZXRhZGF0YVJlYWRlciA9IEdsb2JhbE1ldGFkYXRhLmdldFJlYWRlcigpO1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gY2xhc3NNZXRhZGF0YVJlYWRlci5nZXRQcm9wZXJ0eVR5cGVNYXAoKTtcbiAgICAgICAgZm9yIChjb25zdCBbcHJvcGVydHlOYW1lLCBwcm9wZXJ0eVR5cGVdIG9mIHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcGVydHlUeXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eUZhY3Rvcmllc1twcm9wZXJ0eU5hbWVdID0gbmV3IFNlcnZpY2VGYWN0b3J5RGVmKChjb250YWluZXIsIG93bmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiBjb250YWluZXIuZ2V0SW5zdGFuY2UocHJvcGVydHlUeXBlLCBvd25lcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBmYWN0b3J5ID0gdGhpcy5jb250YWluZXIuZ2V0RmFjdG9yeShwcm9wZXJ0eVR5cGUpO1xuICAgICAgICAgICAgaWYgKGZhY3RvcnkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnR5RmFjdG9yaWVzW3Byb3BlcnR5TmFtZV0gPSBmYWN0b3J5O1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcHJvcGVydHlDbGFzc01ldGFkYXRhID0gZ2xvYmFsTWV0YWRhdGFSZWFkZXIuZ2V0Q2xhc3NNZXRhZGF0YShwcm9wZXJ0eVR5cGUpO1xuICAgICAgICAgICAgaWYgKHByb3BlcnR5Q2xhc3NNZXRhZGF0YSkge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydHlGYWN0b3JpZXNbcHJvcGVydHlOYW1lXSA9IFNlcnZpY2VGYWN0b3J5RGVmLmNyZWF0ZUZyb21DbGFzc01ldGFkYXRhKHByb3BlcnR5Q2xhc3NNZXRhZGF0YSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwcm9wZXJ0eUZhY3RvcnkgPSBnbG9iYWxNZXRhZGF0YVJlYWRlci5nZXRDb21wb25lbnRGYWN0b3J5KHByb3BlcnR5VHlwZSk7XG4gICAgICAgICAgICBpZiAocHJvcGVydHlGYWN0b3J5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eUZhY3Rvcmllc1twcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlGYWN0b3J5O1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGJ1aWxkKCkge1xuICAgICAgICBjb25zdCBhcmdzID0gdGhpcy5nZXRDb25zdHJ1Y3RvckFyZ3MoKTtcbiAgICAgICAgY29uc3QgcHJvcGVydGllcyA9IHRoaXMuY3JlYXRlUHJvcGVydGllc0dldHRlckJ1aWxkZXIoKTtcbiAgICAgICAgY29uc3QgaXNDcmVhdGluZ0luc3RBd2FyZVByb2Nlc3NvciA9IHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5pc0luc3RBd2FyZVByb2Nlc3NvckNsYXNzKHRoaXMuY29tcG9uZW50Q2xhc3MpO1xuICAgICAgICBpZiAoaXNDcmVhdGluZ0luc3RBd2FyZVByb2Nlc3Nvcikge1xuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgdGhpcy5jb21wb25lbnRDbGFzcyguLi5hcmdzKSBhcyBJbnN0YW5jZTxUPjtcbiAgICAgICAgICAgIHRoaXMubGlmZWN5Y2xlUmVzb2x2ZXIuaW52b2tlUHJlSW5qZWN0TWV0aG9kKGluc3RhbmNlKTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBnZXR0ZXIgPSBwcm9wZXJ0aWVzW2tleV0oaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVmaW5lUHJvcGVydHkoaW5zdGFuY2UsIGtleSwgZ2V0dGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubGlmZWN5Y2xlUmVzb2x2ZXIuaW52b2tlUG9zdEluamVjdE1ldGhvZChpbnN0YW5jZSk7XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgaW5zdGFuY2U6IHVuZGVmaW5lZCB8IEluc3RhbmNlPFQ+ID0gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyLmJlZm9yZUluc3RhbnRpYXRpb24odGhpcy5jb21wb25lbnRDbGFzcywgYXJncyk7XG4gICAgICAgICAgICBpZiAoIWluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2UgPSBuZXcgdGhpcy5jb21wb25lbnRDbGFzcyguLi5hcmdzKSBhcyBJbnN0YW5jZTxUPjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubGlmZWN5Y2xlUmVzb2x2ZXIuaW52b2tlUHJlSW5qZWN0TWV0aG9kKGluc3RhbmNlKTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBnZXR0ZXIgPSBwcm9wZXJ0aWVzW2tleV0oaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVmaW5lUHJvcGVydHkoaW5zdGFuY2UsIGtleSwgZ2V0dGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluc3RhbmNlID0gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyLmFmdGVySW5zdGFudGlhdGlvbihpbnN0YW5jZSk7XG4gICAgICAgICAgICB0aGlzLmxpZmVjeWNsZVJlc29sdmVyLmludm9rZVBvc3RJbmplY3RNZXRob2QoaW5zdGFuY2UpO1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgZGVmaW5lUHJvcGVydHk8VCwgVj4oaW5zdGFuY2U6IFQsIGtleTogc3RyaW5nIHwgc3ltYm9sLCBnZXR0ZXI6ICgpID0+IFYpIHtcbiAgICAgICAgaWYgKHRoaXMubGF6eU1vZGUpIHtcbiAgICAgICAgICAgIGxhenlQcm9wKGluc3RhbmNlLCBrZXksIGdldHRlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBpbnN0YW5jZVtrZXldID0gZ2V0dGVyKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBjcmVhdGVQcm9wZXJ0aWVzR2V0dGVyQnVpbGRlcigpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0ge30gYXMgUmVjb3JkPGtleW9mIFQsIChpbnN0YW5jZTogVCkgPT4gKCkgPT4gdW5rbm93bj47XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMucHJvcGVydHlGYWN0b3JpZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgZmFjdG9yeSwgaW5qZWN0aW9ucyB9ID0gdGhpcy5wcm9wZXJ0eUZhY3Rvcmllc1trZXldO1xuICAgICAgICAgICAgcmVzdWx0W2tleSBhcyBrZXlvZiBUXSA9IDxUPihpbnN0YW5jZTogVCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZuID0gZmFjdG9yeSh0aGlzLmNvbnRhaW5lciwgaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRhaW5lci5pbnZva2UoZm4sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluamVjdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59XG4iLCJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGEgfSBmcm9tICcuLi90eXBlcy9NZXRhZGF0YSc7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBJbnN0YW5jZVNjb3BlIH0gZnJvbSAnLi4vZm91bmRhdGlvbi9JbnN0YW5jZVNjb3BlJztcblxuZXhwb3J0IGNvbnN0IEZVTkNUSU9OX01FVEFEQVRBX0tFWSA9IFN5bWJvbCgnaW9jOmZ1bmN0aW9uLW1ldGFkYXRhJyk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRnVuY3Rpb25NZXRhZGF0YVJlYWRlciB7XG4gICAgZ2V0UGFyYW1ldGVycygpOiBJZGVudGlmaWVyW107XG4gICAgaXNGYWN0b3J5KCk6IGJvb2xlYW47XG4gICAgZ2V0U2NvcGUoKTogSW5zdGFuY2VTY29wZSB8IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGNsYXNzIEZ1bmN0aW9uTWV0YWRhdGEgaW1wbGVtZW50cyBNZXRhZGF0YTxGdW5jdGlvbk1ldGFkYXRhUmVhZGVyLCBGdW5jdGlvbj4ge1xuICAgIHN0YXRpYyBnZXRSZWZsZWN0S2V5KCkge1xuICAgICAgICByZXR1cm4gRlVOQ1RJT05fTUVUQURBVEFfS0VZO1xuICAgIH1cbiAgICBwcml2YXRlIHJlYWRvbmx5IHBhcmFtZXRlcnM6IElkZW50aWZpZXJbXSA9IFtdO1xuICAgIHByaXZhdGUgc2NvcGU/OiBJbnN0YW5jZVNjb3BlO1xuICAgIHByaXZhdGUgaXNGYWN0b3J5OiBib29sZWFuID0gZmFsc2U7XG4gICAgc2V0UGFyYW1ldGVyVHlwZShpbmRleDogbnVtYmVyLCBzeW1ib2w6IElkZW50aWZpZXIpIHtcbiAgICAgICAgdGhpcy5wYXJhbWV0ZXJzW2luZGV4XSA9IHN5bWJvbDtcbiAgICB9XG4gICAgc2V0U2NvcGUoc2NvcGU6IEluc3RhbmNlU2NvcGUpIHtcbiAgICAgICAgdGhpcy5zY29wZSA9IHNjb3BlO1xuICAgIH1cbiAgICBzZXRJc0ZhY3RvcnkoaXNGYWN0b3J5OiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuaXNGYWN0b3J5ID0gaXNGYWN0b3J5O1xuICAgIH1cbiAgICBpbml0KCkge1xuICAgICAgICAvLyBQQVNTO1xuICAgIH1cbiAgICByZWFkZXIoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXRQYXJhbWV0ZXJzOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyYW1ldGVycy5zbGljZSgwKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpc0ZhY3Rvcnk6ICgpID0+IHRoaXMuaXNGYWN0b3J5LFxuICAgICAgICAgICAgZ2V0U2NvcGU6ICgpID0+IHRoaXMuc2NvcGVcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJsZXQgaW5zdGFuY2VTZXJpYWxObyA9IC0xO1xuXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50SW5zdGFuY2VXcmFwcGVyIHtcbiAgICBwdWJsaWMgcmVhZG9ubHkgc2VyaWFsTm8gPSArK2luc3RhbmNlU2VyaWFsTm87XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgaW5zdGFuY2U6IHVua25vd24pIHt9XG5cbiAgICBwdWJsaWMgY29tcGFyZVRvKG90aGVyOiBDb21wb25lbnRJbnN0YW5jZVdyYXBwZXIpOiAtMSB8IDAgfCAxIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VyaWFsTm8gPiBvdGhlci5zZXJpYWxObyA/IC0xIDogdGhpcy5zZXJpYWxObyA8IG90aGVyLnNlcmlhbE5vID8gMSA6IDA7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi4vbWV0YWRhdGEvQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBMaWZlY3ljbGUgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0xpZmVjeWNsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnZva2VQcmVEZXN0cm95KGluc3RhbmNlOiB1bmtub3duKSB7XG4gICAgY29uc3QgY2xhenogPSBpbnN0YW5jZT8uY29uc3RydWN0b3I7XG4gICAgaWYgKCFjbGF6eikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoY2xhenosIENsYXNzTWV0YWRhdGEpO1xuICAgIGNvbnN0IHByZURlc3Ryb3lNZXRob2RzID0gbWV0YWRhdGEuZ2V0TWV0aG9kcyhMaWZlY3ljbGUuUFJFX0RFU1RST1kpO1xuICAgIHByZURlc3Ryb3lNZXRob2RzLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IGNsYXp6LnByb3RvdHlwZVttZXRob2ROYW1lXTtcbiAgICAgICAgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIG1ldGhvZC5hcHBseShpbnN0YW5jZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbiIsImltcG9ydCB7IEdldEluc3RhbmNlT3B0aW9ucywgSW5zdGFuY2VSZXNvbHV0aW9uLCBTYXZlSW5zdGFuY2VPcHRpb25zIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IElkZW50aWZpZXIgfSBmcm9tICcuLi90eXBlcy9JZGVudGlmaWVyJztcbmltcG9ydCB7IENvbXBvbmVudEluc3RhbmNlV3JhcHBlciB9IGZyb20gJy4uL2ZvdW5kYXRpb24vQ29tcG9uZW50SW5zdGFuY2VXcmFwcGVyJztcbmltcG9ydCB7IGludm9rZVByZURlc3Ryb3kgfSBmcm9tICcuLi9jb21tb24vaW52b2tlUHJlRGVzdHJveSc7XG5cbmV4cG9ydCBjbGFzcyBTaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24gaW1wbGVtZW50cyBJbnN0YW5jZVJlc29sdXRpb24ge1xuICAgIHByaXZhdGUgcmVhZG9ubHkgSU5TVEFOQ0VfTUFQID0gbmV3IE1hcDxJZGVudGlmaWVyLCBDb21wb25lbnRJbnN0YW5jZVdyYXBwZXI+KCk7XG4gICAgZ2V0SW5zdGFuY2U8VCwgTz4ob3B0aW9uczogR2V0SW5zdGFuY2VPcHRpb25zPFQsIE8+KTogVCB7XG4gICAgICAgIHJldHVybiB0aGlzLklOU1RBTkNFX01BUC5nZXQob3B0aW9ucy5pZGVudGlmaWVyKT8uaW5zdGFuY2UgYXMgVDtcbiAgICB9XG5cbiAgICBzYXZlSW5zdGFuY2U8VCwgTz4ob3B0aW9uczogU2F2ZUluc3RhbmNlT3B0aW9uczxULCBPPik6IHZvaWQge1xuICAgICAgICB0aGlzLklOU1RBTkNFX01BUC5zZXQob3B0aW9ucy5pZGVudGlmaWVyLCBuZXcgQ29tcG9uZW50SW5zdGFuY2VXcmFwcGVyKG9wdGlvbnMuaW5zdGFuY2UpKTtcbiAgICB9XG5cbiAgICBzaG91bGRHZW5lcmF0ZTxULCBPPihvcHRpb25zOiBHZXRJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLklOU1RBTkNFX01BUC5oYXMob3B0aW9ucy5pZGVudGlmaWVyKTtcbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgY29uc3QgaW5zdGFuY2VXcmFwcGVycyA9IEFycmF5LmZyb20odGhpcy5JTlNUQU5DRV9NQVAudmFsdWVzKCkpO1xuICAgICAgICBpbnN0YW5jZVdyYXBwZXJzLnNvcnQoKGEsIGIpID0+IGEuY29tcGFyZVRvKGIpKTtcbiAgICAgICAgaW5zdGFuY2VXcmFwcGVycy5mb3JFYWNoKGluc3RhbmNlV3JhcHBlciA9PiB7XG4gICAgICAgICAgICBpbnZva2VQcmVEZXN0cm95KGluc3RhbmNlV3JhcHBlci5pbnN0YW5jZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLklOU1RBTkNFX01BUC5jbGVhcigpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEdldEluc3RhbmNlT3B0aW9ucywgSW5zdGFuY2VSZXNvbHV0aW9uLCBTYXZlSW5zdGFuY2VPcHRpb25zIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IFNpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbiB9IGZyb20gJy4vU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uJztcblxuY29uc3QgU0lOR0xFVE9OX0lOU1RBTkNFX1NJTkdMRVRPTiA9IG5ldyBTaW5nbGV0b25JbnN0YW5jZVJlc29sdXRpb24oKTtcblxuZXhwb3J0IGNsYXNzIEdsb2JhbFNoYXJlZEluc3RhbmNlUmVzb2x1dGlvbiBpbXBsZW1lbnRzIEluc3RhbmNlUmVzb2x1dGlvbiB7XG4gICAgZ2V0SW5zdGFuY2U8VCwgTz4ob3B0aW9uczogR2V0SW5zdGFuY2VPcHRpb25zPFQsIE8+KTogVCB7XG4gICAgICAgIHJldHVybiBTSU5HTEVUT05fSU5TVEFOQ0VfU0lOR0xFVE9OLmdldEluc3RhbmNlKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHNhdmVJbnN0YW5jZTxULCBPPihvcHRpb25zOiBTYXZlSW5zdGFuY2VPcHRpb25zPFQsIE8+KTogdm9pZCB7XG4gICAgICAgIFNJTkdMRVRPTl9JTlNUQU5DRV9TSU5HTEVUT04uc2F2ZUluc3RhbmNlKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHNob3VsZEdlbmVyYXRlPFQsIE8+KG9wdGlvbnM6IEdldEluc3RhbmNlT3B0aW9uczxULCBPPik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gU0lOR0xFVE9OX0lOU1RBTkNFX1NJTkdMRVRPTi5zaG91bGRHZW5lcmF0ZShvcHRpb25zKTtcbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgLy8gUEFTUztcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJbnN0YW5jZVJlc29sdXRpb24sIFNhdmVJbnN0YW5jZU9wdGlvbnMgfSBmcm9tICcuLi90eXBlcy9JbnN0YW5jZVJlc29sdXRpb24nO1xuaW1wb3J0IHsgaW52b2tlUHJlRGVzdHJveSB9IGZyb20gJy4uL2NvbW1vbi9pbnZva2VQcmVEZXN0cm95JztcblxuZXhwb3J0IGNsYXNzIFRyYW5zaWVudEluc3RhbmNlUmVzb2x1dGlvbiBpbXBsZW1lbnRzIEluc3RhbmNlUmVzb2x1dGlvbiB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBpbnN0YW5jZXMgPSBuZXcgU2V0PHVua25vd24+KCk7XG4gICAgc2hvdWxkR2VuZXJhdGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGdldEluc3RhbmNlPFQ+KCk6IFQgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2F2ZUluc3RhbmNlPFQsIE8+KG9wdGlvbnM6IFNhdmVJbnN0YW5jZU9wdGlvbnM8VCwgTz4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZXMuYWRkKG9wdGlvbnMuaW5zdGFuY2UpO1xuICAgIH1cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLmluc3RhbmNlcy5mb3JFYWNoKGl0ID0+IHtcbiAgICAgICAgICAgIGlmICghaXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbnZva2VQcmVEZXN0cm95KGl0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuaW5zdGFuY2VzLmNsZWFyKCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgRXZhbHVhdG9yIH0gZnJvbSAnLi4vdHlwZXMvRXZhbHVhdG9yJztcbmltcG9ydCB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4uL2ZvdW5kYXRpb24vQXBwbGljYXRpb25Db250ZXh0JztcbmltcG9ydCB7IEpTT05EYXRhIH0gZnJvbSAnLi4vdHlwZXMvSlNPTkRhdGEnO1xuXG5leHBvcnQgY2xhc3MgSlNPTkRhdGFFdmFsdWF0b3IgaW1wbGVtZW50cyBFdmFsdWF0b3Ige1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbmFtZXNwYWNlRGF0YU1hcCA9IG5ldyBNYXA8c3RyaW5nLCBKU09ORGF0YT4oKTtcbiAgICBldmFsPFQ+KGNvbnRleHQ6IEFwcGxpY2F0aW9uQ29udGV4dCwgZXhwcmVzc2lvbjogc3RyaW5nKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IGNvbG9uSW5kZXggPSBleHByZXNzaW9uLmluZGV4T2YoJzonKTtcbiAgICAgICAgaWYgKGNvbG9uSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luY29ycmVjdCBleHByZXNzaW9uLCBuYW1lc3BhY2Ugbm90IHNwZWNpZmllZCcpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5hbWVzcGFjZSA9IGV4cHJlc3Npb24uc3Vic3RyaW5nKDAsIGNvbG9uSW5kZXgpO1xuICAgICAgICBjb25zdCBleHAgPSBleHByZXNzaW9uLnN1YnN0cmluZyhjb2xvbkluZGV4ICsgMSk7XG4gICAgICAgIGlmICghdGhpcy5uYW1lc3BhY2VEYXRhTWFwLmhhcyhuYW1lc3BhY2UpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEluY29ycmVjdCBleHByZXNzaW9uOiBuYW1lc3BhY2Ugbm90IHJlY29yZGVkOiBcIiR7bmFtZXNwYWNlfVwiYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMubmFtZXNwYWNlRGF0YU1hcC5nZXQobmFtZXNwYWNlKSBhcyBKU09ORGF0YTtcbiAgICAgICAgcmV0dXJuIHJ1bkV4cHJlc3Npb24oZXhwLCBkYXRhIGFzIE9iamVjdCk7XG4gICAgfVxuICAgIHJlY29yZERhdGEobmFtZXNwYWNlOiBzdHJpbmcsIGRhdGE6IEpTT05EYXRhKSB7XG4gICAgICAgIHRoaXMubmFtZXNwYWNlRGF0YU1hcC5zZXQobmFtZXNwYWNlLCBkYXRhKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJ1bkV4cHJlc3Npb24oZXhwcmVzc2lvbjogc3RyaW5nLCByb290Q29udGV4dDogT2JqZWN0KSB7XG4gICAgY29uc3QgZm4gPSBjb21waWxlRXhwcmVzc2lvbihleHByZXNzaW9uKTtcbiAgICByZXR1cm4gZm4ocm9vdENvbnRleHQpO1xufVxuXG5mdW5jdGlvbiBjb21waWxlRXhwcmVzc2lvbihleHByZXNzaW9uOiBzdHJpbmcpIHtcbiAgICBpZiAoZXhwcmVzc2lvbi5pbmRleE9mKCcsJykgPiAtMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEluY29ycmVjdCBleHByZXNzaW9uIHN5bnRheCwgVGhlICcsJyBpcyBub3QgYWxsb3dlZCBpbiBleHByZXNzaW9uOiBcIiR7ZXhwcmVzc2lvbn1cImApO1xuICAgIH1cbiAgICBpZiAoZXhwcmVzc2lvbi5sZW5ndGggPiAxMjApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYEluY29ycmVjdCBleHByZXNzaW9uIHN5bnRheCwgZXhwcmVzc2lvbiBsZW5ndGggY2Fubm90IGJlIGdyZWF0ZXIgdGhhbiAxMjAsIGJ1dCBhY3R1YWw6ICR7ZXhwcmVzc2lvbi5sZW5ndGh9YFxuICAgICAgICApO1xuICAgIH1cbiAgICBpZiAoL1xcKC4qP1xcKS8udGVzdChleHByZXNzaW9uKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEluY29ycmVjdCBleHByZXNzaW9uIHN5bnRheCwgcGFyZW50aGVzZXMgYXJlIG5vdCBhbGxvd2VkIGluIGV4cHJlc3Npb246IFwiJHtleHByZXNzaW9ufVwiYCk7XG4gICAgfVxuICAgIGV4cHJlc3Npb24gPSBleHByZXNzaW9uLnRyaW0oKTtcbiAgICBpZiAoZXhwcmVzc2lvbiA9PT0gJycpIHtcbiAgICAgICAgcmV0dXJuIChyb290OiBPYmplY3QpID0+IHJvb3Q7XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdFZhck5hbWUgPSB2YXJOYW1lKCdjb250ZXh0Jyk7XG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbihcbiAgICAgICAgcm9vdFZhck5hbWUsXG4gICAgICAgIGBcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gJHtyb290VmFyTmFtZX0uJHtleHByZXNzaW9ufTtcbiAgICAgICAgfSBjYXRjaChlcnJvcikgeyB0aHJvdyBlcnJvciB9XG4gICAgYFxuICAgICk7XG59XG5sZXQgVkFSX1NFUVVFTkNFID0gRGF0ZS5ub3coKTtcbmZ1bmN0aW9uIHZhck5hbWUocHJlZml4OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gcHJlZml4ICsgJycgKyAoVkFSX1NFUVVFTkNFKyspLnRvU3RyaW5nKDE2KTtcbn1cbiIsImltcG9ydCB7IEV2YWx1YXRvciB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRvcic7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuLi9mb3VuZGF0aW9uL0FwcGxpY2F0aW9uQ29udGV4dCc7XG5cbmV4cG9ydCBjbGFzcyBFbnZpcm9ubWVudEV2YWx1YXRvciBpbXBsZW1lbnRzIEV2YWx1YXRvciB7XG4gICAgZXZhbDxUPihjb250ZXh0OiBBcHBsaWNhdGlvbkNvbnRleHQsIGV4cHJlc3Npb246IHN0cmluZyk6IFQgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gcHJvY2Vzcy5lbnZbZXhwcmVzc2lvbl0gYXMgVCB8IHVuZGVmaW5lZDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBFdmFsdWF0b3IgfSBmcm9tICcuLi90eXBlcy9FdmFsdWF0b3InO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuXG5leHBvcnQgY2xhc3MgQXJndkV2YWx1YXRvciBpbXBsZW1lbnRzIEV2YWx1YXRvciB7XG4gICAgZXZhbDxULCBBID0gc3RyaW5nW10+KGNvbnRleHQ6IEFwcGxpY2F0aW9uQ29udGV4dCwgZXhwcmVzc2lvbjogc3RyaW5nLCBhcmdzPzogQSk6IFQgfCB1bmRlZmluZWQge1xuICAgICAgICBjb25zdCBhcmd2ID0gYXJncyB8fCBwcm9jZXNzLmFyZ3Y7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdmFyLXJlcXVpcmVzXG4gICAgICAgIGNvbnN0IG1pbmltaXN0ID0gcmVxdWlyZSgnbWluaW1pc3QnKTtcbiAgICAgICAgY29uc3QgbWFwID0gbWluaW1pc3QoYXJndik7XG4gICAgICAgIHJldHVybiBtYXBbZXhwcmVzc2lvbl07XG4gICAgfVxufVxuIiwiZXhwb3J0IGVudW0gQWR2aWNlIHtcbiAgICBCZWZvcmUsXG4gICAgQWZ0ZXIsXG4gICAgQXJvdW5kLFxuICAgIEFmdGVyUmV0dXJuLFxuICAgIFRocm93bixcbiAgICBGaW5hbGx5XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuL0FkdmljZSc7XG5cbnR5cGUgQmVmb3JlSG9vayA9IChhcmdzOiBhbnlbXSkgPT4gdm9pZDtcbnR5cGUgQWZ0ZXJIb29rID0gKGFyZ3M6IGFueVtdKSA9PiB2b2lkO1xudHlwZSBUaHJvd25Ib29rID0gKHJlYXNvbjogYW55LCBhcmdzOiBhbnlbXSkgPT4gdm9pZDtcbnR5cGUgRmluYWxseUhvb2sgPSAoYXJnczogYW55W10pID0+IHZvaWQ7XG50eXBlIEFmdGVyUmV0dXJuSG9vayA9IChyZXR1cm5WYWx1ZTogYW55LCBhcmdzOiBhbnlbXSkgPT4gYW55O1xudHlwZSBBcm91bmRIb29rID0gKHRoaXM6IGFueSwgb3JpZ2luZm46ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCwgYXJnczogYW55W10pID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBBc3BlY3RVdGlscyB7XG4gICAgcHJpdmF0ZSBiZWZvcmVIb29rczogQXJyYXk8QmVmb3JlSG9vaz4gPSBbXTtcbiAgICBwcml2YXRlIGFmdGVySG9va3M6IEFycmF5PEFmdGVySG9vaz4gPSBbXTtcbiAgICBwcml2YXRlIHRocm93bkhvb2tzOiBBcnJheTxUaHJvd25Ib29rPiA9IFtdO1xuICAgIHByaXZhdGUgZmluYWxseUhvb2tzOiBBcnJheTxGaW5hbGx5SG9vaz4gPSBbXTtcbiAgICBwcml2YXRlIGFmdGVyUmV0dXJuSG9va3M6IEFycmF5PEFmdGVyUmV0dXJuSG9vaz4gPSBbXTtcbiAgICBwcml2YXRlIGFyb3VuZEhvb2tzOiBBcnJheTxBcm91bmRIb29rPiA9IFtdO1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZm46ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KSB7fVxuICAgIGFwcGVuZChhZHZpY2U6IEFkdmljZS5CZWZvcmUsIGhvb2s6IEJlZm9yZUhvb2spOiB2b2lkO1xuICAgIGFwcGVuZChhZHZpY2U6IEFkdmljZS5BZnRlciwgaG9vazogQWZ0ZXJIb29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuVGhyb3duLCBob29rOiBUaHJvd25Ib29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuRmluYWxseSwgaG9vazogRmluYWxseUhvb2spOiB2b2lkO1xuICAgIGFwcGVuZChhZHZpY2U6IEFkdmljZS5BZnRlclJldHVybiwgaG9vazogQWZ0ZXJSZXR1cm5Ib29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UuQXJvdW5kLCBob29rOiBBcm91bmRIb29rKTogdm9pZDtcbiAgICBhcHBlbmQoYWR2aWNlOiBBZHZpY2UsIGhvb2s6IEZ1bmN0aW9uKSB7XG4gICAgICAgIGxldCBob29rc0FycmF5OiBGdW5jdGlvbltdIHwgdW5kZWZpbmVkO1xuICAgICAgICBzd2l0Y2ggKGFkdmljZSkge1xuICAgICAgICAgICAgY2FzZSBBZHZpY2UuQmVmb3JlOlxuICAgICAgICAgICAgICAgIGhvb2tzQXJyYXkgPSB0aGlzLmJlZm9yZUhvb2tzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBZHZpY2UuQWZ0ZXI6XG4gICAgICAgICAgICAgICAgaG9va3NBcnJheSA9IHRoaXMuYWZ0ZXJIb29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLlRocm93bjpcbiAgICAgICAgICAgICAgICBob29rc0FycmF5ID0gdGhpcy50aHJvd25Ib29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLkZpbmFsbHk6XG4gICAgICAgICAgICAgICAgaG9va3NBcnJheSA9IHRoaXMuZmluYWxseUhvb2tzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBZHZpY2UuQWZ0ZXJSZXR1cm46XG4gICAgICAgICAgICAgICAgaG9va3NBcnJheSA9IHRoaXMuYWZ0ZXJSZXR1cm5Ib29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWR2aWNlLkFyb3VuZDpcbiAgICAgICAgICAgICAgICBob29rc0FycmF5ID0gdGhpcy5hcm91bmRIb29rcztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaG9va3NBcnJheSkge1xuICAgICAgICAgICAgaG9va3NBcnJheS5wdXNoKGhvb2spO1xuICAgICAgICB9XG4gICAgfVxuICAgIGV4dHJhY3QoKSB7XG4gICAgICAgIGNvbnN0IHsgYXJvdW5kSG9va3MsIGJlZm9yZUhvb2tzLCBhZnRlckhvb2tzLCBhZnRlclJldHVybkhvb2tzLCBmaW5hbGx5SG9va3MsIHRocm93bkhvb2tzIH0gPSB0aGlzO1xuICAgICAgICBjb25zdCBmbiA9IGFyb3VuZEhvb2tzLnJlZHVjZVJpZ2h0KChwcmV2LCBuZXh0KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dC5jYWxsKHRoaXMsIHByZXYsIGFyZ3MpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSwgdGhpcy5mbikgYXMgdHlwZW9mIHRoaXMuZm47XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodGhpczogYW55LCAuLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICAgICAgYmVmb3JlSG9va3MuZm9yRWFjaChob29rID0+IHtcbiAgICAgICAgICAgICAgICBob29rLmNhbGwodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGludm9rZSA9IChvbkVycm9yOiAocmVhc29uOiBhbnkpID0+IHZvaWQsIG9uRmluYWxseTogKCkgPT4gdm9pZCwgb25BZnRlcjogKHJldHVyblZhbHVlOiBhbnkpID0+IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCByZXR1cm5WYWx1ZTogYW55O1xuICAgICAgICAgICAgICAgIGxldCBpc1Byb21pc2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSA9IGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmV0dXJuVmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc1Byb21pc2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSByZXR1cm5WYWx1ZS5jYXRjaChvbkVycm9yKS5maW5hbGx5KG9uRmluYWxseSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25GaW5hbGx5KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGlzUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWUudGhlbigodmFsdWU6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9uQWZ0ZXIodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb25BZnRlcihyZXR1cm5WYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBpbnZva2UoXG4gICAgICAgICAgICAgICAgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhyb3duSG9va3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3duSG9va3MuZm9yRWFjaChob29rID0+IGhvb2suY2FsbCh0aGlzLCBlcnJvciwgYXJncykpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZmluYWxseUhvb2tzLmZvckVhY2goaG9vayA9PiBob29rLmNhbGwodGhpcywgYXJncykpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdmFsdWUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBhZnRlckhvb2tzLmZvckVhY2goaG9vayA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBob29rLmNhbGwodGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWZ0ZXJSZXR1cm5Ib29rcy5yZWR1Y2UoKHJldFZhbCwgaG9vaykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhvb2suY2FsbCh0aGlzLCByZXRWYWwsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG5pbXBvcnQgdHlwZSB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4uL2ZvdW5kYXRpb24vQXBwbGljYXRpb25Db250ZXh0JztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4vQWR2aWNlJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEFzcGVjdCwgSm9pblBvaW50LCBQcm9jZWVkaW5nSm9pblBvaW50IH0gZnJvbSAnLi9Bc3BlY3QnO1xuaW1wb3J0IHsgQXNwZWN0VXRpbHMgfSBmcm9tICcuL0FzcGVjdFV0aWxzJztcbmltcG9ydCB7IFVzZUFzcGVjdE1ldGFkYXRhUmVhZGVyIH0gZnJvbSAnLi9BT1BDbGFzc01ldGFkYXRhJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFzcGVjdDxUPihcbiAgICBhcHBDdHg6IEFwcGxpY2F0aW9uQ29udGV4dCxcbiAgICB0YXJnZXQ6IFQsXG4gICAgbWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sLFxuICAgIG1ldGhvZEZ1bmM6IEZ1bmN0aW9uLFxuICAgIG1ldGFkYXRhOiBVc2VBc3BlY3RNZXRhZGF0YVJlYWRlclxuKSB7XG4gICAgY29uc3QgY3JlYXRlQXNwZWN0Q3R4ID0gKGFkdmljZTogQWR2aWNlLCBhcmdzOiBhbnlbXSwgcmV0dXJuVmFsdWU6IGFueSA9IG51bGwsIGVycm9yOiBhbnkgPSBudWxsKTogSm9pblBvaW50ID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRhcmdldCxcbiAgICAgICAgICAgIG1ldGhvZE5hbWUsXG4gICAgICAgICAgICBhcmd1bWVudHM6IGFyZ3MsXG4gICAgICAgICAgICByZXR1cm5WYWx1ZSxcbiAgICAgICAgICAgIGVycm9yLFxuICAgICAgICAgICAgYWR2aWNlXG4gICAgICAgIH07XG4gICAgfTtcbiAgICBjb25zdCBhc3BlY3RVdGlscyA9IG5ldyBBc3BlY3RVdGlscyhtZXRob2RGdW5jIGFzICguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTtcbiAgICBjb25zdCBDbGFzc1RvSW5zdGFuY2UgPSAoQXNwZWN0Q2xhc3M6IE5ld2FibGU8QXNwZWN0PikgPT4gYXBwQ3R4LmdldEluc3RhbmNlKEFzcGVjdENsYXNzKTtcbiAgICBjb25zdCBiZWZvcmVBZHZpY2VBc3BlY3RzID0gbWV0YWRhdGEuZ2V0QXNwZWN0c09mKG1ldGhvZE5hbWUsIEFkdmljZS5CZWZvcmUpLm1hcChDbGFzc1RvSW5zdGFuY2UpO1xuICAgIGNvbnN0IGFmdGVyQWR2aWNlQXNwZWN0cyA9IG1ldGFkYXRhLmdldEFzcGVjdHNPZihtZXRob2ROYW1lLCBBZHZpY2UuQWZ0ZXIpLm1hcChDbGFzc1RvSW5zdGFuY2UpO1xuICAgIGNvbnN0IHRyeUNhdGNoQWR2aWNlQXNwZWN0cyA9IG1ldGFkYXRhLmdldEFzcGVjdHNPZihtZXRob2ROYW1lLCBBZHZpY2UuVGhyb3duKS5tYXAoQ2xhc3NUb0luc3RhbmNlKTtcbiAgICBjb25zdCB0cnlGaW5hbGx5QWR2aWNlQXNwZWN0cyA9IG1ldGFkYXRhLmdldEFzcGVjdHNPZihtZXRob2ROYW1lLCBBZHZpY2UuRmluYWxseSkubWFwKENsYXNzVG9JbnN0YW5jZSk7XG4gICAgY29uc3QgYWZ0ZXJSZXR1cm5BZHZpY2VBc3BlY3RzID0gbWV0YWRhdGEuZ2V0QXNwZWN0c09mKG1ldGhvZE5hbWUsIEFkdmljZS5BZnRlclJldHVybikubWFwKENsYXNzVG9JbnN0YW5jZSk7XG4gICAgY29uc3QgYXJvdW5kQWR2aWNlQXNwZWN0cyA9IG1ldGFkYXRhLmdldEFzcGVjdHNPZihtZXRob2ROYW1lLCBBZHZpY2UuQXJvdW5kKS5tYXAoQ2xhc3NUb0luc3RhbmNlKTtcblxuICAgIGlmIChiZWZvcmVBZHZpY2VBc3BlY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXNwZWN0VXRpbHMuYXBwZW5kKEFkdmljZS5CZWZvcmUsIChhcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgam9pblBvaW50ID0gY3JlYXRlQXNwZWN0Q3R4KEFkdmljZS5CZWZvcmUsIGFyZ3MpO1xuICAgICAgICAgICAgYmVmb3JlQWR2aWNlQXNwZWN0cy5mb3JFYWNoKGFzcGVjdCA9PiB7XG4gICAgICAgICAgICAgICAgYXNwZWN0LmV4ZWN1dGUoam9pblBvaW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGFmdGVyQWR2aWNlQXNwZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFzcGVjdFV0aWxzLmFwcGVuZChBZHZpY2UuQWZ0ZXIsIChhcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgam9pblBvaW50ID0gY3JlYXRlQXNwZWN0Q3R4KEFkdmljZS5BZnRlciwgYXJncyk7XG4gICAgICAgICAgICBhZnRlckFkdmljZUFzcGVjdHMuZm9yRWFjaChhc3BlY3QgPT4ge1xuICAgICAgICAgICAgICAgIGFzcGVjdC5leGVjdXRlKGpvaW5Qb2ludCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmICh0cnlDYXRjaEFkdmljZUFzcGVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBhc3BlY3RVdGlscy5hcHBlbmQoQWR2aWNlLlRocm93biwgKGVycm9yLCBhcmdzKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBqb2luUG9pbnQgPSBjcmVhdGVBc3BlY3RDdHgoQWR2aWNlLlRocm93biwgYXJncywgbnVsbCwgZXJyb3IpO1xuICAgICAgICAgICAgdHJ5Q2F0Y2hBZHZpY2VBc3BlY3RzLmZvckVhY2goYXNwZWN0ID0+IHtcbiAgICAgICAgICAgICAgICBhc3BlY3QuZXhlY3V0ZShqb2luUG9pbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0cnlGaW5hbGx5QWR2aWNlQXNwZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFzcGVjdFV0aWxzLmFwcGVuZChBZHZpY2UuRmluYWxseSwgKGFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBqb2luUG9pbnQgPSBjcmVhdGVBc3BlY3RDdHgoQWR2aWNlLkZpbmFsbHksIGFyZ3MpO1xuICAgICAgICAgICAgdHJ5RmluYWxseUFkdmljZUFzcGVjdHMuZm9yRWFjaChhc3BlY3QgPT4ge1xuICAgICAgICAgICAgICAgIGFzcGVjdC5leGVjdXRlKGpvaW5Qb2ludCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGFmdGVyUmV0dXJuQWR2aWNlQXNwZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFzcGVjdFV0aWxzLmFwcGVuZChBZHZpY2UuQWZ0ZXJSZXR1cm4sIChyZXR1cm5WYWx1ZSwgYXJncykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGFmdGVyUmV0dXJuQWR2aWNlQXNwZWN0cy5yZWR1Y2UoKHByZXZSZXR1cm5WYWx1ZSwgYXNwZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgam9pblBvaW50ID0gY3JlYXRlQXNwZWN0Q3R4KEFkdmljZS5BZnRlclJldHVybiwgYXJncywgcmV0dXJuVmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBhc3BlY3QuZXhlY3V0ZShqb2luUG9pbnQpO1xuICAgICAgICAgICAgfSwgcmV0dXJuVmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoYXJvdW5kQWR2aWNlQXNwZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFyb3VuZEFkdmljZUFzcGVjdHMuZm9yRWFjaChhc3BlY3QgPT4ge1xuICAgICAgICAgICAgYXNwZWN0VXRpbHMuYXBwZW5kKEFkdmljZS5Bcm91bmQsIChvcmlnaW5GbiwgYXJncykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGpvaW5Qb2ludCA9IGNyZWF0ZUFzcGVjdEN0eChBZHZpY2UuQXJvdW5kLCBhcmdzLCBudWxsKSBhcyBQcm9jZWVkaW5nSm9pblBvaW50O1xuICAgICAgICAgICAgICAgIGpvaW5Qb2ludC5wcm9jZWVkID0gKGpwQXJncyA9IGFyZ3MpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbkZuKGpwQXJncyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXNwZWN0LmV4ZWN1dGUoam9pblBvaW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXNwZWN0VXRpbHMuZXh0cmFjdCgpO1xufVxuIiwiaW1wb3J0IHsgTWV0YWRhdGEsIE1ldGFkYXRhUmVhZGVyIH0gZnJvbSAnLi4vdHlwZXMvTWV0YWRhdGEnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQXNwZWN0IH0gZnJvbSAnLi9Bc3BlY3QnO1xuaW1wb3J0IHsgY3JlYXRlRGVmYXVsdFZhbHVlTWFwLCBEZWZhdWx0VmFsdWVNYXAgfSBmcm9tICcuLi9jb21tb24vRGVmYXVsdFZhbHVlTWFwJztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4vQWR2aWNlJztcblxuZXhwb3J0IHR5cGUgVXNlQXNwZWN0TWFwID0gRGVmYXVsdFZhbHVlTWFwPHN0cmluZyB8IHN5bWJvbCwgRGVmYXVsdFZhbHVlTWFwPEFkdmljZSwgQXJyYXk8TmV3YWJsZTxBc3BlY3Q+Pj4+O1xuXG5leHBvcnQgaW50ZXJmYWNlIFVzZUFzcGVjdE1ldGFkYXRhUmVhZGVyIGV4dGVuZHMgTWV0YWRhdGFSZWFkZXIge1xuICAgIGdldEFzcGVjdHMoKTogVXNlQXNwZWN0TWFwO1xuICAgIGdldEFzcGVjdHNPZihtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2wsIGFkdmljZTogQWR2aWNlKTogQXJyYXk8TmV3YWJsZTxBc3BlY3Q+Pjtcbn1cbmV4cG9ydCBjbGFzcyBBT1BDbGFzc01ldGFkYXRhIGltcGxlbWVudHMgTWV0YWRhdGE8VXNlQXNwZWN0TWV0YWRhdGFSZWFkZXIsIE5ld2FibGU8dW5rbm93bj4+IHtcbiAgICBzdGF0aWMgZ2V0UmVmbGVjdEtleSgpIHtcbiAgICAgICAgcmV0dXJuICdhb3A6dXNlLWFzcGVjdC1tZXRhZGF0YSc7XG4gICAgfVxuICAgIHByaXZhdGUgYXNwZWN0TWFwOiBVc2VBc3BlY3RNYXAgPSBjcmVhdGVEZWZhdWx0VmFsdWVNYXAoKCkgPT4gY3JlYXRlRGVmYXVsdFZhbHVlTWFwKCgpID0+IFtdKSk7XG4gICAgaW5pdCgpOiB2b2lkIHtcbiAgICAgICAgLy8gSUdOT1JFXG4gICAgfVxuXG4gICAgYXBwZW5kKG1ldGhvZE5hbWU6IHN0cmluZyB8IHN5bWJvbCwgYWR2aWNlOiBBZHZpY2UsIGFzcGVjdHM6IEFycmF5PE5ld2FibGU8QXNwZWN0Pj4pIHtcbiAgICAgICAgY29uc3QgYWR2aWNlQXNwZWN0TWFwID0gdGhpcy5hc3BlY3RNYXAuZ2V0KG1ldGhvZE5hbWUpO1xuICAgICAgICBjb25zdCBleGl0aW5nQXNwZWN0QXJyYXkgPSBhZHZpY2VBc3BlY3RNYXAuZ2V0KGFkdmljZSk7XG4gICAgICAgIGV4aXRpbmdBc3BlY3RBcnJheS5wdXNoKC4uLmFzcGVjdHMpO1xuICAgIH1cblxuICAgIHJlYWRlcigpOiBVc2VBc3BlY3RNZXRhZGF0YVJlYWRlciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXRBc3BlY3RzOiAoKTogVXNlQXNwZWN0TWFwID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3BlY3RNYXA7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0QXNwZWN0c09mOiAobWV0aG9kTmFtZTogc3RyaW5nIHwgc3ltYm9sLCBhZHZpY2U6IEFkdmljZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzcGVjdE1hcC5nZXQobWV0aG9kTmFtZSkuZ2V0KGFkdmljZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL3R5cGVzL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcic7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB0eXBlIHsgQXBwbGljYXRpb25Db250ZXh0IH0gZnJvbSAnLi4vZm91bmRhdGlvbi9BcHBsaWNhdGlvbkNvbnRleHQnO1xuaW1wb3J0IHsgY3JlYXRlQXNwZWN0IH0gZnJvbSAnLi9jcmVhdGVBc3BlY3QnO1xuaW1wb3J0IHsgQU9QQ2xhc3NNZXRhZGF0YSB9IGZyb20gJy4vQU9QQ2xhc3NNZXRhZGF0YSc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3IgaW1wbGVtZW50cyBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yIHtcbiAgICBzdGF0aWMgY3JlYXRlKGFwcEN0eDogQXBwbGljYXRpb25Db250ZXh0KTogTmV3YWJsZTxBT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3I+IHtcbiAgICAgICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgQU9QSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yIHtcbiAgICAgICAgICAgIHByb3RlY3RlZCByZWFkb25seSBhcHBDdHg6IEFwcGxpY2F0aW9uQ29udGV4dCA9IGFwcEN0eDtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IGFwcEN0eDogQXBwbGljYXRpb25Db250ZXh0O1xuICAgIGFmdGVySW5zdGFudGlhdGlvbjxUIGV4dGVuZHMgb2JqZWN0PihpbnN0YW5jZTogVCk6IFQge1xuICAgICAgICBjb25zdCBjbGF6eiA9IGluc3RhbmNlLmNvbnN0cnVjdG9yO1xuXG4gICAgICAgIGNvbnN0IHVzZUFzcGVjdE1ldGFkYXRhID0gTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIuZ2V0TWV0YWRhdGEoY2xhenosIEFPUENsYXNzTWV0YWRhdGEpO1xuICAgICAgICBjb25zdCB1c2VBc3BlY3RNZXRhZGF0YVJlYWRlciA9IHVzZUFzcGVjdE1ldGFkYXRhLnJlYWRlcigpO1xuICAgICAgICBjb25zdCB1c2VBc3BlY3RzTWFwID0gdXNlQXNwZWN0TWV0YWRhdGFSZWFkZXIuZ2V0QXNwZWN0cygpO1xuICAgICAgICBpZiAodXNlQXNwZWN0c01hcC5zaXplID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhc3BlY3RTdG9yZU1hcCA9IG5ldyBXZWFrTWFwPG9iamVjdCwgTWFwPHN0cmluZyB8IHN5bWJvbCwgRnVuY3Rpb24+PigpO1xuICAgICAgICBhc3BlY3RTdG9yZU1hcC5zZXQoaW5zdGFuY2UsIG5ldyBNYXA8c3RyaW5nIHwgc3ltYm9sLCBGdW5jdGlvbj4oKSk7XG5cbiAgICAgICAgY29uc3QgcHJveHlSZXN1bHQgPSBuZXcgUHJveHkoaW5zdGFuY2UsIHtcbiAgICAgICAgICAgIGdldDogKHRhcmdldCwgcHJvcCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpblZhbHVlID0gKHRhcmdldCBhcyBSZWNvcmQ8c3RyaW5nIHwgc3ltYm9sLCB1bmtub3duPilbcHJvcF07XG4gICAgICAgICAgICAgICAgaWYgKHByb3AgaW4gdGFyZ2V0ICYmIHR5cGVvZiBvcmlnaW5WYWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhc3BlY3RNYXAgPSBhc3BlY3RTdG9yZU1hcC5nZXQoaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWFzcGVjdE1hcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpblZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChhc3BlY3RNYXAuaGFzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXNwZWN0TWFwLmdldChwcm9wKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhc3BlY3RGbiA9IGNyZWF0ZUFzcGVjdCh0aGlzLmFwcEN0eCwgdGFyZ2V0LCBwcm9wLCBvcmlnaW5WYWx1ZSwgdXNlQXNwZWN0TWV0YWRhdGFSZWFkZXIpO1xuICAgICAgICAgICAgICAgICAgICBhc3BlY3RNYXAuc2V0KHByb3AsIGFzcGVjdEZuKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFzcGVjdEZuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJveHlSZXN1bHQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yLCBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yJztcbmltcG9ydCB7IGxhenlNZW1iZXIgfSBmcm9tICdAdmdlcmJvdC9sYXp5JztcbmltcG9ydCB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4vQXBwbGljYXRpb25Db250ZXh0JztcbmltcG9ydCB7IEluc3RhbmNlIH0gZnJvbSAnLi4vdHlwZXMvSW5zdGFuY2UnO1xuaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9HbG9iYWxNZXRhZGF0YSc7XG5cbmV4cG9ydCBjbGFzcyBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyIHtcbiAgICBwcml2YXRlIGluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXM6IFNldDxOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+PiA9IG5ldyBTZXQoKTtcbiAgICBAbGF6eU1lbWJlcjxJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyLCBrZXlvZiBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyLCBQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yW10+KHtcbiAgICAgICAgZXZhbHVhdGU6IGluc3RhbmNlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGdsb2JhbEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMgPSBHbG9iYWxNZXRhZGF0YS5nZXRSZWFkZXIoKS5nZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKCk7XG4gICAgICAgICAgICBjb25zdCBpbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzID0gZ2xvYmFsSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3Nlcy5jb25jYXQoXG4gICAgICAgICAgICAgICAgQXJyYXkuZnJvbShpbnN0YW5jZS5pbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBpbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzLm1hcChpdCA9PiBpbnN0YW5jZS5jb250YWluZXIuZ2V0SW5zdGFuY2U8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvciwgdm9pZD4oaXQpKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVzZXRCeTogW1xuICAgICAgICAgICAgaW5zdGFuY2UgPT4gaW5zdGFuY2UuaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3Nlcy5zaXplLFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGdsb2JhbEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMgPSBHbG9iYWxNZXRhZGF0YS5nZXRSZWFkZXIoKS5nZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdsb2JhbEluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfSlcbiAgICBwcml2YXRlIGluc3RBd2FyZVByb2Nlc3Nvckluc3RhbmNlcyE6IEFycmF5PFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjb250YWluZXI6IEFwcGxpY2F0aW9uQ29udGV4dCkge31cbiAgICBhcHBlbmRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyhpbnN0QXdhcmVQcm9jZXNzb3JDbGFzczogTmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPikge1xuICAgICAgICB0aGlzLmluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMuYWRkKGluc3RBd2FyZVByb2Nlc3NvckNsYXNzKTtcbiAgICB9XG4gICAgYXBwZW5kSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcyhcbiAgICAgICAgaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlczogU2V0PE5ld2FibGU8UGFydGlhbEluc3RBd2FyZVByb2Nlc3Nvcj4+IHwgQXJyYXk8TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPj5cbiAgICApIHtcbiAgICAgICAgaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3Nlcy5mb3JFYWNoKGl0ID0+IHtcbiAgICAgICAgICAgIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3Nlcy5hZGQoaXQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYmVmb3JlSW5zdGFudGlhdGlvbjxUPihjb21wb25lbnRDbGFzczogTmV3YWJsZTxUPiwgYXJnczogdW5rbm93bltdKSB7XG4gICAgICAgIGNvbnN0IGluc3RBd2FyZVByb2Nlc3NvcnMgPSB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvckluc3RhbmNlcztcbiAgICAgICAgbGV0IGluc3RhbmNlOiB1bmRlZmluZWQgfCBJbnN0YW5jZTxUPjtcbiAgICAgICAgaW5zdEF3YXJlUHJvY2Vzc29ycy5zb21lKHByb2Nlc3NvciA9PiB7XG4gICAgICAgICAgICBpZiAoIXByb2Nlc3Nvci5iZWZvcmVJbnN0YW50aWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5zdGFuY2UgPSBwcm9jZXNzb3IuYmVmb3JlSW5zdGFudGlhdGlvbjxUPihjb21wb25lbnRDbGFzcywgYXJncykgYXMgSW5zdGFuY2U8VD47XG4gICAgICAgICAgICByZXR1cm4gISFpbnN0YW5jZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9XG4gICAgYWZ0ZXJJbnN0YW50aWF0aW9uPFQ+KGluc3RhbmNlOiBJbnN0YW5jZTxUPikge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JJbnN0YW5jZXMucmVkdWNlKChpbnN0YW5jZSwgcHJvY2Vzc29yKSA9PiB7XG4gICAgICAgICAgICBpZiAocHJvY2Vzc29yLmFmdGVySW5zdGFudGlhdGlvbikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHByb2Nlc3Nvci5hZnRlckluc3RhbnRpYXRpb24oaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIGlmICghIXJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0IGFzIEluc3RhbmNlPFQ+O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgfSwgaW5zdGFuY2UpO1xuICAgIH1cbiAgICBpc0luc3RBd2FyZVByb2Nlc3NvckNsYXNzKGNsczogTmV3YWJsZTx1bmtub3duPikge1xuICAgICAgICBjb25zdCBjbGFzc2VzID0gdGhpcy5nZXRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzc2VzKCk7XG4gICAgICAgIHJldHVybiBjbGFzc2VzLmluZGV4T2YoY2xzIGFzIE5ld2FibGU8SW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yPikgPiAtMTtcbiAgICB9XG4gICAgZ2V0SW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcygpIHtcbiAgICAgICAgY29uc3QgZ2xvYmFsSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcyA9IEdsb2JhbE1ldGFkYXRhLmdldEluc3RhbmNlKCkucmVhZGVyKCkuZ2V0SW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3NlcygpO1xuICAgICAgICByZXR1cm4gZ2xvYmFsSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3Nlcy5jb25jYXQoQXJyYXkuZnJvbSh0aGlzLmluc3RBd2FyZVByb2Nlc3NvckNsYXNzZXMpKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJbnN0YW5jZVNjb3BlIH0gZnJvbSAnLi9JbnN0YW5jZVNjb3BlJztcbmltcG9ydCB7IEluc3RhbmNlUmVzb2x1dGlvbiB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlUmVzb2x1dGlvbic7XG5pbXBvcnQgeyBJZGVudGlmaWVyIH0gZnJvbSAnLi4vdHlwZXMvSWRlbnRpZmllcic7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4uL3R5cGVzL1NlcnZpY2VGYWN0b3J5JztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciwgRXZlbnRMaXN0ZW5lciB9IGZyb20gJy4vRXZlbnRFbWl0dGVyJztcbmltcG9ydCB7IEFueUZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMvQW55RnVuY3Rpb24nO1xuaW1wb3J0IHsgaGFzQXJncywgaGFzSW5qZWN0aW9ucywgSW52b2tlRnVuY3Rpb25PcHRpb25zIH0gZnJvbSAnLi9JbnZva2VGdW5jdGlvbk9wdGlvbnMnO1xuaW1wb3J0IHsgR2xvYmFsTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9HbG9iYWxNZXRhZGF0YSc7XG5pbXBvcnQgeyBGYWN0b3J5SWRlbnRpZmllciB9IGZyb20gJy4uL3R5cGVzL0ZhY3RvcnlJZGVudGlmaWVyJztcbmltcG9ydCB7IENsYXNzTWV0YWRhdGEsIENsYXNzTWV0YWRhdGFSZWFkZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9DbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IENvbXBvbmVudEluc3RhbmNlQnVpbGRlciB9IGZyb20gJy4vQ29tcG9uZW50SW5zdGFuY2VCdWlsZGVyJztcbmltcG9ydCB7IEZ1bmN0aW9uTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS9GdW5jdGlvbk1ldGFkYXRhJztcbmltcG9ydCB7IEFwcGxpY2F0aW9uQ29udGV4dE9wdGlvbnMgfSBmcm9tICcuLi90eXBlcy9BcHBsaWNhdGlvbkNvbnRleHRPcHRpb25zJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyIH0gZnJvbSAnLi4vbWV0YWRhdGEvTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXInO1xuaW1wb3J0IHsgU2VydmljZUZhY3RvcnlEZWYgfSBmcm9tICcuL1NlcnZpY2VGYWN0b3J5RGVmJztcbmltcG9ydCB7IFNpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbiB9IGZyb20gJy4uL3Jlc29sdXRpb24vU2luZ2xldG9uSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IEdsb2JhbFNoYXJlZEluc3RhbmNlUmVzb2x1dGlvbiB9IGZyb20gJy4uL3Jlc29sdXRpb24vR2xvYmFsU2hhcmVkSW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IFRyYW5zaWVudEluc3RhbmNlUmVzb2x1dGlvbiB9IGZyb20gJy4uL3Jlc29sdXRpb24vVHJhbnNpZW50SW5zdGFuY2VSZXNvbHV0aW9uJztcbmltcG9ydCB7IEV2YWx1YXRpb25PcHRpb25zLCBFeHByZXNzaW9uVHlwZSB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRlT3B0aW9ucyc7XG5pbXBvcnQgeyBKU09ORGF0YSB9IGZyb20gJy4uL3R5cGVzL0pTT05EYXRhJztcbmltcG9ydCB7IEV2YWx1YXRvciB9IGZyb20gJy4uL3R5cGVzL0V2YWx1YXRvcic7XG5pbXBvcnQgeyBKU09ORGF0YUV2YWx1YXRvciB9IGZyb20gJy4uL2V2YWx1YXRvci9KU09ORGF0YUV2YWx1YXRvcic7XG5pbXBvcnQgeyBFbnZpcm9ubWVudEV2YWx1YXRvciB9IGZyb20gJy4uL2V2YWx1YXRvci9FbnZpcm9ubWVudEV2YWx1YXRvcic7XG5pbXBvcnQgeyBBcmd2RXZhbHVhdG9yIH0gZnJvbSAnLi4vZXZhbHVhdG9yL0FyZ3ZFdmFsdWF0b3InO1xuaW1wb3J0IHsgaXNOb2RlSnMgfSBmcm9tICcuLi9jb21tb24vaXNOb2RlSnMnO1xuaW1wb3J0IHsgUGFydGlhbEluc3RBd2FyZVByb2Nlc3NvciB9IGZyb20gJy4uL3R5cGVzL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvcic7XG5pbXBvcnQgeyBBT1BJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3IgfSBmcm9tICcuLi9hb3AvQU9QSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yJztcbmltcG9ydCB7IEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXIgfSBmcm9tICcuL0luc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXInO1xuaW1wb3J0IHsgTGlmZWN5Y2xlTWFuYWdlciB9IGZyb20gJy4vTGlmZWN5Y2xlTWFuYWdlcic7XG5pbXBvcnQgeyBJbnN0YW5jZSB9IGZyb20gJy4uL3R5cGVzL0luc3RhbmNlJztcblxuY29uc3QgUFJFX0RFU1RST1lfRVZFTlRfS0VZID0gJ2NvbnRhaW5lcjpldmVudDpwcmUtZGVzdHJveSc7XG5cbmV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbkNvbnRleHQge1xuICAgIHByaXZhdGUgcmVzb2x1dGlvbnMgPSBuZXcgTWFwPEluc3RhbmNlU2NvcGUgfCBzdHJpbmcsIEluc3RhbmNlUmVzb2x1dGlvbj4oKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIHByaXZhdGUgZmFjdG9yaWVzID0gbmV3IE1hcDxGYWN0b3J5SWRlbnRpZmllciwgU2VydmljZUZhY3RvcnlEZWY8YW55Pj4oKTtcbiAgICBwcml2YXRlIGV2YWx1YXRvckNsYXNzZXMgPSBuZXcgTWFwPHN0cmluZywgTmV3YWJsZTxFdmFsdWF0b3I+PigpO1xuICAgIHByaXZhdGUgZXZlbnRFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZGVmYXVsdFNjb3BlOiBJbnN0YW5jZVNjb3BlO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbGF6eU1vZGU6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSByZWFkb25seSBpbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyOiBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3JNYW5hZ2VyO1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihvcHRpb25zOiBBcHBsaWNhdGlvbkNvbnRleHRPcHRpb25zID0ge30pIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0U2NvcGUgPSBvcHRpb25zLmRlZmF1bHRTY29wZSB8fCBJbnN0YW5jZVNjb3BlLlNJTkdMRVRPTjtcbiAgICAgICAgdGhpcy5sYXp5TW9kZSA9IG9wdGlvbnMubGF6eU1vZGUgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBvcHRpb25zLmxhenlNb2RlO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySW5zdGFuY2VTY29wZVJlc29sdXRpb24oSW5zdGFuY2VTY29wZS5TSU5HTEVUT04sIFNpbmdsZXRvbkluc3RhbmNlUmVzb2x1dGlvbik7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJJbnN0YW5jZVNjb3BlUmVzb2x1dGlvbihJbnN0YW5jZVNjb3BlLkdMT0JBTF9TSEFSRURfU0lOR0xFVE9OLCBHbG9iYWxTaGFyZWRJbnN0YW5jZVJlc29sdXRpb24pO1xuICAgICAgICB0aGlzLnJlZ2lzdGVySW5zdGFuY2VTY29wZVJlc29sdXRpb24oSW5zdGFuY2VTY29wZS5UUkFOU0lFTlQsIFRyYW5zaWVudEluc3RhbmNlUmVzb2x1dGlvbik7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJFdmFsdWF0b3IoRXhwcmVzc2lvblR5cGUuSlNPTl9QQVRILCBKU09ORGF0YUV2YWx1YXRvcik7XG4gICAgICAgIGlmIChpc05vZGVKcykge1xuICAgICAgICAgICAgdGhpcy5yZWdpc3RlckV2YWx1YXRvcihFeHByZXNzaW9uVHlwZS5FTlYsIEVudmlyb25tZW50RXZhbHVhdG9yKTtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJFdmFsdWF0b3IoRXhwcmVzc2lvblR5cGUuQVJHViwgQXJndkV2YWx1YXRvcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyID0gbmV3IEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3Nvck1hbmFnZXIodGhpcyk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJJbnN0QXdhcmVQcm9jZXNzb3IoQU9QSW5zdGFudGlhdGlvbkF3YXJlUHJvY2Vzc29yLmNyZWF0ZSh0aGlzKSk7XG4gICAgfVxuICAgIGdldEluc3RhbmNlPFQsIE8+KHN5bWJvbDogSWRlbnRpZmllcjxUPiwgb3duZXI/OiBPKTogVCB7XG4gICAgICAgIGlmIChzeW1ib2wgPT09IEFwcGxpY2F0aW9uQ29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMgYXMgdW5rbm93biBhcyBUO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygc3ltYm9sID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygc3ltYm9sID09PSAnc3ltYm9sJykge1xuICAgICAgICAgICAgY29uc3QgZmFjdG9yeURlZiA9IHRoaXMuZ2V0RmFjdG9yeShzeW1ib2wpO1xuICAgICAgICAgICAgaWYgKGZhY3RvcnlEZWYpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGZhY3RvcnksIGluamVjdGlvbnMgfSA9IGZhY3RvcnlEZWY7XG4gICAgICAgICAgICAgICAgY29uc3QgZm4gPSBmYWN0b3J5KHRoaXMsIG93bmVyKTtcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy5pbnZva2UoZm4sIHtcbiAgICAgICAgICAgICAgICAgICAgaW5qZWN0aW9uc1xuICAgICAgICAgICAgICAgIH0pIGFzIFQ7XG4gICAgICAgICAgICAgICAgY29uc3QgY29uc3RyID0gcmVzdWx0Py5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbnN0ciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21wb25lbnRDbGFzcyA9IGNvbnN0ciBhcyBOZXdhYmxlPFQ+O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXNvbHZlciA9IG5ldyBMaWZlY3ljbGVNYW5hZ2VyPFQ+KGNvbXBvbmVudENsYXNzLCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNJbnN0QXdhcmVQcm9jZXNzb3IgPSB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuaXNJbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyhjb21wb25lbnRDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVyLmludm9rZVByZUluamVjdE1ldGhvZChyZXN1bHQgYXMgSW5zdGFuY2U8VD4pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzSW5zdEF3YXJlUHJvY2Vzc29yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuYWZ0ZXJJbnN0YW50aWF0aW9uKHJlc3VsdCBhcyBJbnN0YW5jZTxUPik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZXIuaW52b2tlUG9zdEluamVjdE1ldGhvZChyZXN1bHQgYXMgSW5zdGFuY2U8VD4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjbGFzc01ldGFkYXRhID0gR2xvYmFsTWV0YWRhdGEuZ2V0SW5zdGFuY2UoKS5yZWFkZXIoKS5nZXRDbGFzc01ldGFkYXRhPFQ+KHN5bWJvbCk7XG4gICAgICAgICAgICAgICAgaWYgKCFjbGFzc01ldGFkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3ltYm9sID0gY2xhc3NNZXRhZGF0YS5yZWFkZXIoKS5nZXRDbGFzcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb21wb25lbnRDbGFzcyA9IHN5bWJvbDtcbiAgICAgICAgY29uc3QgcmVhZGVyID0gQ2xhc3NNZXRhZGF0YS5nZXRJbnN0YW5jZShjb21wb25lbnRDbGFzcykucmVhZGVyKCk7XG4gICAgICAgIGNvbnN0IHNjb3BlID0gcmVhZGVyLmdldFNjb3BlKCk7XG4gICAgICAgIGNvbnN0IHJlc29sdXRpb24gPSAodGhpcy5yZXNvbHV0aW9ucy5nZXQoc2NvcGUpIHx8IHRoaXMucmVzb2x1dGlvbnMuZ2V0KHRoaXMuZGVmYXVsdFNjb3BlKSkgYXMgSW5zdGFuY2VSZXNvbHV0aW9uO1xuICAgICAgICBjb25zdCBnZXRJbnN0YW5jZU9wdGlvbnMgPSB7XG4gICAgICAgICAgICBpZGVudGlmaWVyOiBjb21wb25lbnRDbGFzcyxcbiAgICAgICAgICAgIG93bmVyLFxuICAgICAgICAgICAgb3duZXJQcm9wZXJ0eUtleTogdW5kZWZpbmVkXG4gICAgICAgIH07XG4gICAgICAgIGlmIChyZXNvbHV0aW9uLnNob3VsZEdlbmVyYXRlKGdldEluc3RhbmNlT3B0aW9ucykpIHtcbiAgICAgICAgICAgIGNvbnN0IGJ1aWxkZXIgPSB0aGlzLmNyZWF0ZUNvbXBvbmVudEluc3RhbmNlQnVpbGRlcihjb21wb25lbnRDbGFzcyk7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGJ1aWxkZXIuYnVpbGQoKTtcbiAgICAgICAgICAgIGNvbnN0IHNhdmVJbnN0YW5jZU9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgLi4uZ2V0SW5zdGFuY2VPcHRpb25zLFxuICAgICAgICAgICAgICAgIGluc3RhbmNlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVzb2x1dGlvbi5zYXZlSW5zdGFuY2Uoc2F2ZUluc3RhbmNlT3B0aW9ucyk7XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x1dGlvbi5nZXRJbnN0YW5jZShnZXRJbnN0YW5jZU9wdGlvbnMpIGFzIFQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUNvbXBvbmVudEluc3RhbmNlQnVpbGRlcjxUPihjb21wb25lbnRDbGFzczogTmV3YWJsZTxUPikge1xuICAgICAgICBjb25zdCBidWlsZGVyID0gbmV3IENvbXBvbmVudEluc3RhbmNlQnVpbGRlcihjb21wb25lbnRDbGFzcywgdGhpcywgdGhpcy5pbnN0QXdhcmVQcm9jZXNzb3JNYW5hZ2VyKTtcbiAgICAgICAgYnVpbGRlci5hcHBlbmRMYXp5TW9kZSh0aGlzLmxhenlNb2RlKTtcbiAgICAgICAgcmV0dXJuIGJ1aWxkZXI7XG4gICAgfVxuXG4gICAgZ2V0RmFjdG9yeShrZXk6IEZhY3RvcnlJZGVudGlmaWVyKSB7XG4gICAgICAgIGNvbnN0IGZhY3RvcnkgPSBHbG9iYWxNZXRhZGF0YS5nZXRJbnN0YW5jZSgpLnJlYWRlcigpLmdldENvbXBvbmVudEZhY3Rvcnkoa2V5KTtcbiAgICAgICAgaWYgKCFmYWN0b3J5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mYWN0b3JpZXMuZ2V0KGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XG4gICAgfVxuICAgIGJpbmRGYWN0b3J5PFQ+KHN5bWJvbDogRmFjdG9yeUlkZW50aWZpZXIsIGZhY3Rvcnk6IFNlcnZpY2VGYWN0b3J5PFQsIHVua25vd24+LCBpbmplY3Rpb25zPzogSWRlbnRpZmllcltdKSB7XG4gICAgICAgIHRoaXMuZmFjdG9yaWVzLnNldChzeW1ib2wsIG5ldyBTZXJ2aWNlRmFjdG9yeURlZihmYWN0b3J5LCBpbmplY3Rpb25zKSk7XG4gICAgfVxuICAgIGludm9rZTxSLCBDdHg+KGZ1bmM6IEFueUZ1bmN0aW9uPFIsIEN0eD4sIG9wdGlvbnM6IEludm9rZUZ1bmN0aW9uT3B0aW9uczxDdHg+ID0ge30pOiBSIHtcbiAgICAgICAgbGV0IGZuOiBBbnlGdW5jdGlvbjxSPjtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBmbiA9IGZ1bmMuYmluZChvcHRpb25zLmNvbnRleHQgYXMgVGhpc1BhcmFtZXRlclR5cGU8dHlwZW9mIGZ1bmM+KSBhcyBBbnlGdW5jdGlvbjxSPjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZuID0gZnVuYyBhcyBBbnlGdW5jdGlvbjxSPjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGFzQXJncyhvcHRpb25zKSkge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMuYXJncyA/IGZuKC4uLm9wdGlvbnMuYXJncykgOiBmbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChoYXNJbmplY3Rpb25zKG9wdGlvbnMpKSB7XG4gICAgICAgICAgICBjb25zdCBhcmdzID0gb3B0aW9ucy5pbmplY3Rpb25zID8gb3B0aW9ucy5pbmplY3Rpb25zLm1hcChpdCA9PiB0aGlzLmdldEluc3RhbmNlKGl0KSkgOiBbXTtcbiAgICAgICAgICAgIHJldHVybiBhcmdzLmxlbmd0aCA+IDAgPyBmbiguLi5hcmdzKSA6IGZuKCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShmbiwgRnVuY3Rpb25NZXRhZGF0YSkucmVhZGVyKCk7XG4gICAgICAgIGNvbnN0IHBhcmFtZXRlcklkZW50aWZpZXJzID0gbWV0YWRhdGEuZ2V0UGFyYW1ldGVycygpO1xuICAgICAgICBjb25zdCBhcmdzID0gcGFyYW1ldGVySWRlbnRpZmllcnMubWFwKGlkZW50aWZpZXIgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5zdGFuY2UoaWRlbnRpZmllcik7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZm4oLi4uYXJncyk7XG4gICAgfVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuZXZlbnRFbWl0dGVyLmVtaXQoUFJFX0RFU1RST1lfRVZFTlRfS0VZKTtcbiAgICAgICAgdGhpcy5yZXNvbHV0aW9ucy5mb3JFYWNoKGl0ID0+IHtcbiAgICAgICAgICAgIGl0LmRlc3Ryb3koKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGV2YWx1YXRlPFQsIE8sIEE+KGV4cHJlc3Npb246IHN0cmluZywgb3B0aW9uczogRXZhbHVhdGlvbk9wdGlvbnM8Tywgc3RyaW5nLCBBPik6IFQgfCB1bmRlZmluZWQge1xuICAgICAgICBjb25zdCBldmFsdWF0b3JDbGFzcyA9IHRoaXMuZXZhbHVhdG9yQ2xhc3Nlcy5nZXQob3B0aW9ucy50eXBlKTtcbiAgICAgICAgaWYgKCFldmFsdWF0b3JDbGFzcykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgVW5rbm93biBldmFsdWF0b3IgbmFtZTogJHtvcHRpb25zLnR5cGV9YCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZXZhbHVhdG9yID0gdGhpcy5nZXRJbnN0YW5jZShldmFsdWF0b3JDbGFzcyk7XG4gICAgICAgIHJldHVybiBldmFsdWF0b3IuZXZhbCh0aGlzLCBleHByZXNzaW9uLCBvcHRpb25zLmV4dGVybmFsQXJncyk7XG4gICAgfVxuICAgIHJlY29yZEpTT05EYXRhKG5hbWVzcGFjZTogc3RyaW5nLCBkYXRhOiBKU09ORGF0YSkge1xuICAgICAgICBjb25zdCBldmFsdWF0b3IgPSB0aGlzLmdldEluc3RhbmNlKEpTT05EYXRhRXZhbHVhdG9yKTtcbiAgICAgICAgZXZhbHVhdG9yLnJlY29yZERhdGEobmFtZXNwYWNlLCBkYXRhKTtcbiAgICB9XG4gICAgYmluZEluc3RhbmNlPFQ+KGlkZW50aWZpZXI6IHN0cmluZyB8IHN5bWJvbCwgaW5zdGFuY2U6IFQpIHtcbiAgICAgICAgY29uc3QgcmVzb2x1dGlvbiA9IHRoaXMucmVzb2x1dGlvbnMuZ2V0KEluc3RhbmNlU2NvcGUuU0lOR0xFVE9OKTtcbiAgICAgICAgcmVzb2x1dGlvbj8uc2F2ZUluc3RhbmNlKHtcbiAgICAgICAgICAgIGlkZW50aWZpZXIsXG4gICAgICAgICAgICBpbnN0YW5jZVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVnaXN0ZXJJbnN0YW5jZVNjb3BlUmVzb2x1dGlvbjxUIGV4dGVuZHMgTmV3YWJsZTxJbnN0YW5jZVJlc29sdXRpb24+PihcbiAgICAgICAgc2NvcGU6IEluc3RhbmNlU2NvcGUgfCBzdHJpbmcsXG4gICAgICAgIHJlc29sdXRpb25Db25zdHJ1Y3RvcjogVCxcbiAgICAgICAgY29uc3RydWN0b3JBcmdzPzogQ29uc3RydWN0b3JQYXJhbWV0ZXJzPFQ+XG4gICAgKSB7XG4gICAgICAgIHRoaXMucmVzb2x1dGlvbnMuc2V0KHNjb3BlLCBuZXcgcmVzb2x1dGlvbkNvbnN0cnVjdG9yKC4uLihjb25zdHJ1Y3RvckFyZ3MgfHwgW10pKSk7XG4gICAgfVxuICAgIHJlZ2lzdGVyRXZhbHVhdG9yKG5hbWU6IHN0cmluZywgZXZhbHVhdG9yQ2xhc3M6IE5ld2FibGU8RXZhbHVhdG9yPikge1xuICAgICAgICBjb25zdCBtZXRhZGF0YSA9IE1ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyLmdldE1ldGFkYXRhKGV2YWx1YXRvckNsYXNzLCBDbGFzc01ldGFkYXRhKTtcbiAgICAgICAgbWV0YWRhdGEuc2V0U2NvcGUoSW5zdGFuY2VTY29wZS5TSU5HTEVUT04pO1xuICAgICAgICB0aGlzLmV2YWx1YXRvckNsYXNzZXMuc2V0KG5hbWUsIGV2YWx1YXRvckNsYXNzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFJlZ2lzdGVycyBhbiBJbnN0YW50aWF0aW9uQXdhcmVQcm9jZXNzb3IgY2xhc3MgdG8gY3VzdG9taXplXG4gICAgICogICAgICB0aGUgaW5zdGFudGlhdGlvbiBwcm9jZXNzIGF0IHZhcmlvdXMgc3RhZ2VzIHdpdGhpbiB0aGUgSW9DXG4gICAgICogQGRlcHJlY2F0ZWQgUmVwbGFjZWQgd2l0aCB7QGxpbmsgcmVnaXN0ZXJCZWZvcmVJbnN0YW50aWF0aW9uUHJvY2Vzc29yfSBhbmQge0BsaW5rIHJlZ2lzdGVyQWZ0ZXJJbnN0YW50aWF0aW9uUHJvY2Vzc29yfVxuICAgICAqIEBwYXJhbSB7TmV3YWJsZTxQYXJ0aWFsSW5zdEF3YXJlUHJvY2Vzc29yPn0gY2xhenpcbiAgICAgKiBAc2VlIEluc3RhbnRpYXRpb25Bd2FyZVByb2Nlc3NvclxuICAgICAqIEBzaW5jZSAxLjAuMFxuICAgICAqL1xuICAgIHJlZ2lzdGVySW5zdEF3YXJlUHJvY2Vzc29yKGNsYXp6OiBOZXdhYmxlPFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3I+KSB7XG4gICAgICAgIHRoaXMuaW5zdEF3YXJlUHJvY2Vzc29yTWFuYWdlci5hcHBlbmRJbnN0QXdhcmVQcm9jZXNzb3JDbGFzcyhjbGF6eik7XG4gICAgfVxuICAgIHJlZ2lzdGVyQmVmb3JlSW5zdGFudGlhdGlvblByb2Nlc3Nvcihwcm9jZXNzb3I6IDxUPihjb25zdHJ1Y3RvcjogTmV3YWJsZTxUPiwgYXJnczogdW5rbm93bltdKSA9PiBUIHwgdW5kZWZpbmVkIHwgdm9pZCkge1xuICAgICAgICB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuYXBwZW5kSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoXG4gICAgICAgICAgICBjbGFzcyBJbm5lclByb2Nlc3NvciBpbXBsZW1lbnRzIFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3Ige1xuICAgICAgICAgICAgICAgIGJlZm9yZUluc3RhbnRpYXRpb248VD4oY29uc3RydWN0b3I6IE5ld2FibGU8VD4sIGFyZ3M6IHVua25vd25bXSk6IHZvaWQgfCBUIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2Nlc3Nvcihjb25zdHJ1Y3RvciwgYXJncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbiAgICByZWdpc3RlckFmdGVySW5zdGFudGlhdGlvblByb2Nlc3Nvcihwcm9jZXNzb3I6IDxUIGV4dGVuZHMgb2JqZWN0PihpbnN0YW5jZTogVCkgPT4gVCkge1xuICAgICAgICB0aGlzLmluc3RBd2FyZVByb2Nlc3Nvck1hbmFnZXIuYXBwZW5kSW5zdEF3YXJlUHJvY2Vzc29yQ2xhc3MoXG4gICAgICAgICAgICBjbGFzcyBJbm5lclByb2Nlc3NvciBpbXBsZW1lbnRzIFBhcnRpYWxJbnN0QXdhcmVQcm9jZXNzb3Ige1xuICAgICAgICAgICAgICAgIGFmdGVySW5zdGFudGlhdGlvbjxUIGV4dGVuZHMgb2JqZWN0PihpbnN0YW5jZTogVCk6IFQge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvY2Vzc29yKGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuICAgIG9uUHJlRGVzdHJveShsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudEVtaXR0ZXIub24oUFJFX0RFU1RST1lfRVZFTlRfS0VZLCBsaXN0ZW5lcik7XG4gICAgfVxuICAgIGdldENsYXNzTWV0YWRhdGE8VD4oY3RvcjogTmV3YWJsZTxUPikge1xuICAgICAgICByZXR1cm4gQ2xhc3NNZXRhZGF0YS5nZXRSZWFkZXIoY3RvcikgYXMgQ2xhc3NNZXRhZGF0YVJlYWRlcjxUPjtcbiAgICB9XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG5pbXBvcnQgeyBBc3BlY3QsIEpvaW5Qb2ludCB9IGZyb20gJy4vQXNwZWN0JztcbmltcG9ydCB7IEFwcGxpY2F0aW9uQ29udGV4dCB9IGZyb20gJy4uL2ZvdW5kYXRpb24vQXBwbGljYXRpb25Db250ZXh0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi90eXBlcy9OZXdhYmxlJztcbmltcG9ydCB7IEluamVjdCB9IGZyb20gJy4uL2RlY29yYXRvcnMvSW5qZWN0JztcbmltcG9ydCB7IGxhenlQcm9wIH0gZnJvbSAnQHZnZXJib3QvbGF6eSc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb21wb25lbnRNZXRob2RBc3BlY3QgaW1wbGVtZW50cyBBc3BlY3Qge1xuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKGNsYXp6OiBOZXdhYmxlPHVua25vd24+LCBtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2wpOiBOZXdhYmxlPEFzcGVjdD4ge1xuICAgICAgICByZXR1cm4gY2xhc3MgQ29tcG9uZW50TWV0aG9kQXNwZWN0SW1wbCBleHRlbmRzIENvbXBvbmVudE1ldGhvZEFzcGVjdCB7XG4gICAgICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgICAgIGxhenlQcm9wKHRoaXMsICdhc3BlY3RJbnN0YW5jZScsIHtcbiAgICAgICAgICAgICAgICAgICAgZXZhbHVhdGU6ICgpID0+IHRoaXMuYXBwQ3R4LmdldEluc3RhbmNlKGNsYXp6KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXhlY3V0ZShjdHg6IEpvaW5Qb2ludCk6IGFueSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZnVuYyA9IHRoaXMuYXNwZWN0SW5zdGFuY2VbbWV0aG9kTmFtZV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzLmFzcGVjdEluc3RhbmNlLCBjdHgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgYXNwZWN0SW5zdGFuY2UhOiBhbnk7XG4gICAgQEluamVjdChBcHBsaWNhdGlvbkNvbnRleHQpXG4gICAgcHJvdGVjdGVkIGFwcEN0eCE6IEFwcGxpY2F0aW9uQ29udGV4dDtcbiAgICBhYnN0cmFjdCBleGVjdXRlKGN0eDogSm9pblBvaW50KTogYW55O1xufVxuIiwiaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuXG5mdW5jdGlvbiBnZXRNZXRob2REZXNjcmlwdG9ycyhwcm90b3R5cGU6IG9iamVjdCk6IFJlY29yZDxzdHJpbmcsIFByb3BlcnR5RGVzY3JpcHRvcj4ge1xuICAgIGlmIChcbiAgICAgICAgdHlwZW9mIHByb3RvdHlwZSAhPT0gJ29iamVjdCcgfHxcbiAgICAgICAgcHJvdG90eXBlID09PSBudWxsIHx8XG4gICAgICAgIE9iamVjdC5wcm90b3R5cGUgPT09IHByb3RvdHlwZSB8fFxuICAgICAgICBGdW5jdGlvbi5wcm90b3R5cGUgPT09IHByb3RvdHlwZVxuICAgICkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGNvbnN0IHN1cGVyUHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvdHlwZSk7XG4gICAgY29uc3Qgc3VwZXJEZXNjcmlwdG9ycyA9IHN1cGVyUHJvdG90eXBlID09PSBwcm90b3R5cGUgPyB7fSA6IGdldE1ldGhvZERlc2NyaXB0b3JzKHN1cGVyUHJvdG90eXBlKTtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihzdXBlckRlc2NyaXB0b3JzLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhwcm90b3R5cGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFsbE1ldGhvZE1lbWJlck5hbWVzPFQ+KGNsczogTmV3YWJsZTxUPikge1xuICAgIGNvbnN0IGRlc2NyaXB0b3JzID0gZ2V0TWV0aG9kRGVzY3JpcHRvcnMoY2xzLnByb3RvdHlwZSk7XG4gICAgZGVsZXRlIGRlc2NyaXB0b3JzWydjb25zdHJ1Y3RvciddO1xuICAgIGNvbnN0IG1ldGhvZE5hbWVzID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gZGVzY3JpcHRvcnMpIHtcbiAgICAgICAgY29uc3QgbWVtYmVyID0gY2xzLnByb3RvdHlwZVtrZXldO1xuICAgICAgICBpZiAodHlwZW9mIG1lbWJlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbWV0aG9kTmFtZXMuYWRkKGtleSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1ldGhvZE5hbWVzO1xufVxuIiwiaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgZ2V0QWxsTWV0aG9kTWVtYmVyTmFtZXMgfSBmcm9tICcuLi9jb21tb24vZ2V0QWxsTWV0aG9kTWVtYmVyTmFtZXMnO1xuXG50eXBlIE1lbWJlcklkZW50aWZpZXIgPSBzdHJpbmcgfCBzeW1ib2w7XG5cbmV4cG9ydCBjbGFzcyBQb2ludGN1dCB7XG4gICAgc3RhdGljIGNvbWJpbmUoLi4ucHM6IFBvaW50Y3V0W10pIHtcbiAgICAgICAgcmV0dXJuIHBzLnJlZHVjZSgocHJldiwgaXQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBwcmV2LmNvbWJpbmUoaXQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgc3RhdGljIG9mPFQ+KGNsczogTmV3YWJsZTxUPiwgLi4ubWV0aG9kTmFtZXM6IE1lbWJlcklkZW50aWZpZXJbXSkge1xuICAgICAgICBjb25zdCBlbnRyaWVzID0gbmV3IE1hcDxOZXdhYmxlPHVua25vd24+LCBTZXQ8TWVtYmVySWRlbnRpZmllcj4+KCk7XG4gICAgICAgIGNvbnN0IG1ldGhvZHMgPSBuZXcgU2V0PE1lbWJlcklkZW50aWZpZXI+KG1ldGhvZE5hbWVzIGFzIE1lbWJlcklkZW50aWZpZXJbXSk7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBnZXRBbGxNZXRob2RNZW1iZXJOYW1lcyhjbHMpLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgICAgICAgICAgICAgbWV0aG9kcy5hZGQobWV0aG9kTmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbnRyaWVzLnNldChjbHMsIG1ldGhvZHMpO1xuICAgICAgICByZXR1cm4gbmV3IFBvaW50Y3V0KGVudHJpZXMpO1xuICAgIH1cbiAgICBzdGF0aWMgdGVzdE1hdGNoPFQ+KGNsczogTmV3YWJsZTxUPiwgcmVnZXg6IFJlZ0V4cCkge1xuICAgICAgICBjb25zdCBtZXRob2ROYW1lcyA9IGdldEFsbE1ldGhvZE1lbWJlck5hbWVzKGNscyk7XG4gICAgICAgIGNvbnN0IG1hdGNoTWV0aG9kTmFtZXMgPSBBcnJheS5mcm9tKG1ldGhvZE5hbWVzKS5maWx0ZXIoaXQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlZ2V4LnRlc3QoaXQpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIFBvaW50Y3V0Lm9mKGNscywgLi4ubWF0Y2hNZXRob2ROYW1lcyk7XG4gICAgfVxuICAgIHN0YXRpYyBmcm9tKC4uLmNsYXNzZXM6IEFycmF5PE5ld2FibGU8dW5rbm93bj4+KSB7XG4gICAgICAgIGNvbnN0IG9mID0gKC4uLm1ldGhvZE5hbWVzOiBNZW1iZXJJZGVudGlmaWVyW10pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBQb2ludGN1dC5jb21iaW5lKC4uLmNsYXNzZXMubWFwKGNscyA9PiBQb2ludGN1dC5vZihjbHMsIC4uLm1ldGhvZE5hbWVzKSkpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCB0ZXN0TWF0Y2ggPSAocmVnZXg6IFJlZ0V4cCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIFBvaW50Y3V0LmNvbWJpbmUoXG4gICAgICAgICAgICAgICAgLi4uY2xhc3Nlcy5tYXAoY2xzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFBvaW50Y3V0LnRlc3RNYXRjaChjbHMsIHJlZ2V4KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG9mLFxuICAgICAgICAgICAgdGVzdE1hdGNoXG4gICAgICAgIH07XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgbWV0aG9kRW50cmllczogTWFwPE5ld2FibGU8dW5rbm93bj4sIFNldDxNZW1iZXJJZGVudGlmaWVyPj4pIHt9XG4gICAgY29tYmluZShvdGhlcjogUG9pbnRjdXQpIHtcbiAgICAgICAgY29uc3QgbWFwID0gbmV3IE1hcDxOZXdhYmxlPHVua25vd24+LCBTZXQ8TWVtYmVySWRlbnRpZmllcj4+KHRoaXMubWV0aG9kRW50cmllcyk7XG4gICAgICAgIGNvbnN0IG90aGVyTWFwID0gb3RoZXIubWV0aG9kRW50cmllcztcbiAgICAgICAgb3RoZXJNYXAuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2V0ID0gbWFwLmdldChrZXkpO1xuICAgICAgICAgICAgaWYgKCEhc2V0KSB7XG4gICAgICAgICAgICAgICAgdmFsdWUuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2V0LmFkZChpdGVtKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWFwLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBuZXcgUG9pbnRjdXQobWFwKTtcbiAgICB9XG4gICAgZ2V0TWV0aG9kc01hcCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNYXAodGhpcy5tZXRob2RFbnRyaWVzKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBQb2ludGN1dCB9IGZyb20gJy4vUG9pbnRjdXQnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uL3R5cGVzL05ld2FibGUnO1xuaW1wb3J0IHsgQ29tcG9uZW50TWV0aG9kQXNwZWN0IH0gZnJvbSAnLi9Db21wb25lbnRNZXRob2RBc3BlY3QnO1xuaW1wb3J0IHsgTWV0YWRhdGFJbnN0YW5jZU1hbmFnZXIgfSBmcm9tICcuLi9tZXRhZGF0YS9NZXRhZGF0YUluc3RhbmNlTWFuYWdlcic7XG5pbXBvcnQgeyBBT1BDbGFzc01ldGFkYXRhIH0gZnJvbSAnLi9BT1BDbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4vQWR2aWNlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFzcGVjdChcbiAgICBjb21wb25lbnRBc3BlY3RDbGFzczogTmV3YWJsZTx1bmtub3duPixcbiAgICBtZXRob2ROYW1lOiBzdHJpbmcgfCBzeW1ib2wsXG4gICAgYWR2aWNlOiBBZHZpY2UsXG4gICAgcG9pbnRjdXQ6IFBvaW50Y3V0XG4pIHtcbiAgICBjb25zdCBBc3BlY3RDbGFzcyA9IENvbXBvbmVudE1ldGhvZEFzcGVjdC5jcmVhdGUoY29tcG9uZW50QXNwZWN0Q2xhc3MsIG1ldGhvZE5hbWUpO1xuICAgIHBvaW50Y3V0LmdldE1ldGhvZHNNYXAoKS5mb3JFYWNoKChqcE1lbWJlcnMsIGpwQ2xhc3MpID0+IHtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShqcENsYXNzLCBBT1BDbGFzc01ldGFkYXRhKTtcbiAgICAgICAganBNZW1iZXJzLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgICAgICAgICBtZXRhZGF0YS5hcHBlbmQobWV0aG9kTmFtZSwgYWR2aWNlLCBbQXNwZWN0Q2xhc3NdKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgeyBQb2ludGN1dCB9IGZyb20gJy4uL1BvaW50Y3V0JztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4uL0FkdmljZSc7XG5pbXBvcnQgeyBhZGRBc3BlY3QgfSBmcm9tICcuLi9hZGRBc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uLy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gQWZ0ZXIocG9pbnRjdXQ6IFBvaW50Y3V0KTogTWV0aG9kRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgYWRkQXNwZWN0KHRhcmdldC5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPHVua25vd24+LCBwcm9wZXJ0eUtleSwgQWR2aWNlLkFmdGVyLCBwb2ludGN1dCk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi4vUG9pbnRjdXQnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi4vQWR2aWNlJztcbmltcG9ydCB7IGFkZEFzcGVjdCB9IGZyb20gJy4uL2FkZEFzcGVjdCc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBBZnRlclJldHVybihwb2ludGN1dDogUG9pbnRjdXQpOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICBhZGRBc3BlY3QodGFyZ2V0LmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dW5rbm93bj4sIHByb3BlcnR5S2V5LCBBZHZpY2UuQWZ0ZXJSZXR1cm4sIHBvaW50Y3V0KTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgUG9pbnRjdXQgfSBmcm9tICcuLi9Qb2ludGN1dCc7XG5pbXBvcnQgeyBBZHZpY2UgfSBmcm9tICcuLi9BZHZpY2UnO1xuaW1wb3J0IHsgYWRkQXNwZWN0IH0gZnJvbSAnLi4vYWRkQXNwZWN0JztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi8uLi90eXBlcy9OZXdhYmxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIEFyb3VuZChwb2ludGN1dDogUG9pbnRjdXQpOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICBhZGRBc3BlY3QodGFyZ2V0LmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dW5rbm93bj4sIHByb3BlcnR5S2V5LCBBZHZpY2UuQXJvdW5kLCBwb2ludGN1dCk7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IFBvaW50Y3V0IH0gZnJvbSAnLi4vUG9pbnRjdXQnO1xuaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi4vQWR2aWNlJztcbmltcG9ydCB7IGFkZEFzcGVjdCB9IGZyb20gJy4uL2FkZEFzcGVjdCc7XG5pbXBvcnQgeyBOZXdhYmxlIH0gZnJvbSAnLi4vLi4vdHlwZXMvTmV3YWJsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBCZWZvcmUocG9pbnRjdXQ6IFBvaW50Y3V0KTogTWV0aG9kRGVjb3JhdG9yIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgcHJvcGVydHlLZXkpIHtcbiAgICAgICAgYWRkQXNwZWN0KHRhcmdldC5jb25zdHJ1Y3RvciBhcyBOZXdhYmxlPHVua25vd24+LCBwcm9wZXJ0eUtleSwgQWR2aWNlLkJlZm9yZSwgcG9pbnRjdXQpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBQb2ludGN1dCB9IGZyb20gJy4uL1BvaW50Y3V0JztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4uL0FkdmljZSc7XG5pbXBvcnQgeyBhZGRBc3BlY3QgfSBmcm9tICcuLi9hZGRBc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uLy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gRmluYWxseShwb2ludGN1dDogUG9pbnRjdXQpOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICBhZGRBc3BlY3QodGFyZ2V0LmNvbnN0cnVjdG9yIGFzIE5ld2FibGU8dW5rbm93bj4sIHByb3BlcnR5S2V5LCBBZHZpY2UuRmluYWxseSwgcG9pbnRjdXQpO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBQb2ludGN1dCB9IGZyb20gJy4uL1BvaW50Y3V0JztcbmltcG9ydCB7IEFkdmljZSB9IGZyb20gJy4uL0FkdmljZSc7XG5pbXBvcnQgeyBhZGRBc3BlY3QgfSBmcm9tICcuLi9hZGRBc3BlY3QnO1xuaW1wb3J0IHsgTmV3YWJsZSB9IGZyb20gJy4uLy4uL3R5cGVzL05ld2FibGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gVGhyb3duKHBvaW50Y3V0OiBQb2ludGN1dCk6IE1ldGhvZERlY29yYXRvciB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIHByb3BlcnR5S2V5KSB7XG4gICAgICAgIGFkZEFzcGVjdCh0YXJnZXQuY29uc3RydWN0b3IgYXMgTmV3YWJsZTx1bmtub3duPiwgcHJvcGVydHlLZXksIEFkdmljZS5UaHJvd24sIHBvaW50Y3V0KTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgQWR2aWNlIH0gZnJvbSAnLi4vQWR2aWNlJztcbmltcG9ydCB7IEFzcGVjdCwgUHJvY2VlZGluZ0FzcGVjdCB9IGZyb20gJy4uL0FzcGVjdCc7XG5pbXBvcnQgeyBNZXRhZGF0YUluc3RhbmNlTWFuYWdlciB9IGZyb20gJy4uLy4uL21ldGFkYXRhL01ldGFkYXRhSW5zdGFuY2VNYW5hZ2VyJztcbmltcG9ydCB7IEFPUENsYXNzTWV0YWRhdGEgfSBmcm9tICcuLi9BT1BDbGFzc01ldGFkYXRhJztcbmltcG9ydCB7IE5ld2FibGUgfSBmcm9tICcuLi8uLi90eXBlcy9OZXdhYmxlJztcblxuZnVuY3Rpb24gVXNlQXNwZWN0cyhhZHZpY2U6IEFkdmljZS5Bcm91bmQsIGFzcGVjdHM6IEFycmF5PE5ld2FibGU8UHJvY2VlZGluZ0FzcGVjdD4+KTogTWV0aG9kRGVjb3JhdG9yO1xuZnVuY3Rpb24gVXNlQXNwZWN0cyhhZHZpY2U6IEFkdmljZSwgYXNwZWN0czogQXJyYXk8TmV3YWJsZTxBc3BlY3Q+Pik6IE1ldGhvZERlY29yYXRvcjtcbmZ1bmN0aW9uIFVzZUFzcGVjdHMoYWR2aWNlOiBBZHZpY2UsIGFzcGVjdHM6IEFycmF5PE5ld2FibGU8QXNwZWN0Pj4pOiBNZXRob2REZWNvcmF0b3Ige1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wZXJ0eUtleSkge1xuICAgICAgICBjb25zdCBjbGF6eiA9IHRhcmdldC5jb25zdHJ1Y3RvcjtcbiAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBNZXRhZGF0YUluc3RhbmNlTWFuYWdlci5nZXRNZXRhZGF0YShjbGF6eiwgQU9QQ2xhc3NNZXRhZGF0YSk7XG4gICAgICAgIG1ldGFkYXRhLmFwcGVuZChwcm9wZXJ0eUtleSwgYWR2aWNlLCBhc3BlY3RzKTtcbiAgICB9O1xufVxuXG5leHBvcnQgeyBVc2VBc3BlY3RzIH07XG4iXSwibmFtZXMiOlsiSW5zdGFuY2VTY29wZSIsIlJlZmxlY3QiLCJnbG9iYWwiLCJFeHByZXNzaW9uVHlwZSIsIkxpZmVjeWNsZSIsIkFkdmljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBWUEsbUNBSVg7SUFKRCxDQUFBLFVBQVksYUFBYSxFQUFBO0lBQ3JCLElBQUEsYUFBQSxDQUFBLFdBQUEsQ0FBQSxHQUFBLG9DQUFnRCxDQUFBO0lBQ2hELElBQUEsYUFBQSxDQUFBLFdBQUEsQ0FBQSxHQUFBLDBCQUFzQyxDQUFBO0lBQ3RDLElBQUEsYUFBQSxDQUFBLHlCQUFBLENBQUEsR0FBQSx3Q0FBa0UsQ0FBQTtJQUN0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QyxDQUFDLENBQUM7SUFDcEU7SUFDQTtBQUNBO0lBQ0E7SUFDQTtBQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsYUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTSxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBa0IsR0FBQSxTQUFBLENBQUEsVUFBQSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsU0FBQSxDQUFBLGlCQUF5QixDQUFDLFNBQVMs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
