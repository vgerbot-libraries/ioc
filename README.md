# @vgerbot/ioc

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/4497cb65ff94475486ce8c444b82d9ce)](https://www.codacy.com/gh/vgerbot-libraries/ioc/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=vgerbot-libraries/ioc&amp;utm_campaign=Badge_Grade) [![Codacy Badge](https://app.codacy.com/project/badge/Coverage/4497cb65ff94475486ce8c444b82d9ce)](https://www.codacy.com/gh/vgerbot-libraries/ioc/dashboard?utm_source=github.com&utm_medium=referral&utm_content=vgerbot-libraries/ioc&utm_campaign=Badge_Coverage)

A lightweight inversion of control (IoC) container for JavaScript powered by TypeScript, supporting dependency injection, lifecycle management, aspect-oriented programming (AOP), and other enterprise-grade features.

## 🌟 Key Features

- **🔄 Dependency Injection**: Complete dependency injection support, including constructor injection and property injection
- **🔄 Lifecycle Management**: Support for PreInject, PostInject, PreDestroy, and other lifecycle hooks
- **🎯 Multiple Scopes**: Support for Singleton, Transient, Global Shared Singleton, and other scopes
- **✂️ AOP Support**: Complete aspect-oriented programming support, including Before, After, Around, and other advice types
- **🏭 Factory Pattern**: Support for factory methods and custom instance creation strategies
- **🔗 Multiple Binding Types**: Support for symbol binding, alias binding, value binding, and more
- **📊 Expression Evaluation**: Support for JSON path, environment variables, command-line arguments, and other expression evaluation
- **📡 Event System**: Built-in event emitter supporting container lifecycle events

## 📦 Installation

```bash
npm install @vgerbot/ioc reflect-metadata
```

## 🚀 Quick Start

### Basic Usage

```typescript
import 'reflect-metadata';
import { ApplicationContext, Inject, Injectable } from '@vgerbot/ioc';

@Injectable()
class UserService {
    getUser(id: number) {
        return { id, name: 'John Doe' };
    }
}

class UserController {
    @Inject()
    private userService!: UserService;

    getUser(id: number) {
        return this.userService.getUser(id);
    }
}

const context = new ApplicationContext();
const controller = context.getInstance(UserController);
console.log(controller.getUser(1)); // { id: 1, name: 'John Doe' }
```

### Constructor Injection

```typescript
class DatabaseService {
    connect() {
        console.log('Database connected');
    }
}

class UserService {
    constructor(
        @Inject() private db: DatabaseService
    ) {}

    getUsers() {
        this.db.connect();
        return ['user1', 'user2'];
    }
}

const context = new ApplicationContext();
const userService = context.getInstance(UserService);
userService.getUsers();
```

## 🎯 Scope Management

The IoC container supports multiple instance scopes that control how and when instances are created and managed. Understanding these scopes is crucial for proper resource management and application architecture.

### Scope Types Overview

| Scope | Description | Instance Lifecycle | Use Cases |
|-------|-------------|-------------------|-----------|
| **Singleton** | One instance per container | Created once, reused within container | Services, repositories, configurations |
| **Transient** | New instance every time | Created on each request | Stateless operations, temporary objects |
| **Global Shared Singleton** | One instance across all containers | Created once, shared globally | Global state, system-wide configurations |

### Singleton

```typescript
import { Scope, InstanceScope } from '@vgerbot/ioc';

@Scope(InstanceScope.SINGLETON)
class DatabaseConnection {
    private static connectionCount = 0;
    
    constructor() {
        DatabaseConnection.connectionCount++;
        console.log(`Connection #${DatabaseConnection.connectionCount} created`);
    }
}

const context = new ApplicationContext();
const conn1 = context.getInstance(DatabaseConnection);
const conn2 = context.getInstance(DatabaseConnection);
console.log(conn1 === conn2); // true - same instance
```

### Transient

```typescript
@Scope(InstanceScope.TRANSIENT)
class HttpRequest {
    private id = Math.random().toString(36);
    
    getId() {
        return this.id;
    }
}

const context = new ApplicationContext();
const req1 = context.getInstance(HttpRequest);
const req2 = context.getInstance(HttpRequest);
console.log(req1.getId() === req2.getId()); // false - different instances
console.log(req1 === req2); // false
```

### Global Shared Singleton

```typescript
@Scope(InstanceScope.GLOBAL_SHARED_SINGLETON)
class GlobalConfig {
    private config = { version: '1.0.0' };
    
    getVersion() {
        return this.config.version;
    }
    
    updateVersion(version: string) {
        this.config.version = version;
    }
}

const context1 = new ApplicationContext();
const context2 = new ApplicationContext();
const config1 = context1.getInstance(GlobalConfig);
const config2 = context2.getInstance(GlobalConfig);

console.log(config1 === config2); // true - shared across containers
config1.updateVersion('2.0.0');
console.log(config2.getVersion()); // '2.0.0' - shared state
```


## 🔄 Lifecycle Management

```typescript
import { PreInject, PostInject, PreDestroy } from '@vgerbot/ioc';

class DatabaseService {
    connect() {
        console.log('Database connected');
    }
}

class UserService {
    @Inject()
    private db!: DatabaseService;

    @PreInject()
    beforeInject() {
        console.log('Before injection - db is', this.db); // undefined
    }

    @PostInject()
    afterInject() {
        console.log('After injection - db is', this.db); // DatabaseService instance
        this.db.connect();
    }

    @PreDestroy()
    beforeDestroy() {
        console.log('Cleaning up UserService');
    }
}
```

## ✂️ Aspect-Oriented Programming (AOP)

### Before Advice

```typescript
import { Aspect, JoinPoint, UseAspects, Advice } from '@vgerbot/ioc';

class LoggingAspect implements Aspect {
    execute(joinPoint: JoinPoint) {
        console.log(`Calling method: ${joinPoint.method}`);
        console.log(`Arguments:`, joinPoint.args);
    }
}

class UserService {
    @UseAspects(Advice.Before, [LoggingAspect])
    getUser(id: number) {
        return { id, name: 'John Doe' };
    }
}
```

### Around Advice

```typescript
import { ProceedingAspect, ProceedingJoinPoint } from '@vgerbot/ioc';

class TimingAspect implements ProceedingAspect {
    execute(joinPoint: ProceedingJoinPoint) {
        const start = Date.now();
        const result = joinPoint.proceed();
        const duration = Date.now() - start;
        console.log(`Method ${joinPoint.method} took ${duration}ms`);
        return result;
    }
}

class UserService {
    @UseAspects(Advice.Around, [TimingAspect])
    getUser(id: number) {
        // Simulate async operation
        return new Promise(resolve => {
            setTimeout(() => resolve({ id, name: 'John Doe' }), 100);
        });
    }
}
```

### AfterReturn Advice

```typescript
class TransformAspect implements Aspect {
    execute(joinPoint: JoinPoint) {
        // Modify return value
        return {
            ...joinPoint.returnValue,
            transformed: true
        };
    }
}

class UserService {
    @UseAspects(Advice.AfterReturn, [TransformAspect])
    getUser(id: number) {
        return { id, name: 'John Doe' };
    }
}
```

## 🏭 Factory Pattern and Binding

### Factory Methods

```typescript
import { Factory } from '@vgerbot/ioc';

class DatabaseConfig {
    constructor(public host: string, public port: number) {}
}

class ConfigFactory {
    @Factory('database-config')
    createDatabaseConfig(): DatabaseConfig {
        return new DatabaseConfig('localhost', 5432);
    }
}

const context = new ApplicationContext();
const config = context.getInstance('database-config') as DatabaseConfig;
console.log(config.host); // 'localhost'
```

### Symbol Binding

```typescript
import { Bind, Injectable } from '@vgerbot/ioc';

const USER_SERVICE = Symbol('UserService');

@Bind(USER_SERVICE)
class UserService {
    getUsers() {
        return ['user1', 'user2'];
    }
}

@Injectable({ produce: USER_SERVICE })
class MockUserService {
    getUsers() {
        return ['mock-user1', 'mock-user2'];
    }
}

const context = new ApplicationContext();

// Get instance by symbol
const userService = context.getInstance(USER_SERVICE);
```

### Value Binding

```typescript
import { Value, Env } from '@vgerbot/ioc';

class ApiService {
    @Value('config.api.baseUrl')
    private baseUrl!: string;

    @Env('NODE_ENV')
    private environment!: string;

    getApiUrl() {
        return `${this.baseUrl}/api`;
    }
}

const context = new ApplicationContext();
// Set JSON data
context.recordJSONData('config', {
    api: {
        baseUrl: 'https://api.example.com'
    }
});

const apiService = context.getInstance(ApiService);
console.log(apiService.getApiUrl()); // https://api.example.com/api
```

## 🎛️ Advanced Features

### Custom Instantiation Processor

```typescript
import { PartialInstAwareProcessor } from '@vgerbot/ioc';

class CustomInstAwareProcessor implements PartialInstAwareProcessor {
    beforeInstantiation<T>(constructor: any, args: unknown[]): T | undefined | void {
        console.log(`Creating instance of ${constructor.name}`);
        // Can return custom instance or undefined to let container continue
    }

    afterInstantiation<T extends object>(instance: T): T {
        console.log(`Instance created: ${instance.constructor.name}`);
        // Can modify instance and return it
        return instance;
    }
}

const context = new ApplicationContext();
context.registerInstAwareProcessor(CustomInstAwareProcessor);
```

### Event Listening

```typescript
const context = new ApplicationContext();

// Listen for pre-destroy events
context.onPreDestroy(() => {
    console.log('Container is about to be destroyed');
});

// Listen for specific instance pre-destroy events
context.onPreDestroyThat((instance) => {
    console.log(`Instance ${instance.constructor.name} is about to be destroyed`);
});

// Destroy container
context.destroy();
```

### Function Invocation with Injection

```typescript
import { Inject } from '@vgerbot/ioc';

class UserService {
    getUser(id: number) {
        return { id, name: 'John Doe' };
    }
}

function processUser(userService: UserService, userId: number) {
    return userService.getUser(userId);
}

const context = new ApplicationContext();

// Auto-inject function parameters
const result = context.invoke(processUser, {
    injections: [UserService, 42]
});

// Or use decorator to mark function parameters
function processUserWithDecorator(
    @Inject() userService: UserService,
    userId: number
) {
    return userService.getUser(userId);
}

const result2 = context.invoke(processUserWithDecorator, {
    args: [undefined, 42] // First parameter will be auto-injected
});
```

## 🔧 Configuration Options

```typescript
import { ApplicationContext, InstanceScope } from '@vgerbot/ioc';

const context = new ApplicationContext({
    // Default scope
    defaultScope: InstanceScope.SINGLETON,
    
    // Lazy mode
    lazyMode: true
});
```

## 📋 API Reference

### Decorators

- `@Injectable(options?)` - Mark injectable class
- `@Inject(identifier?)` - Dependency injection decorator
- `@Scope(scope)` - Set instance scope
- `@Bind(identifier)` - Bind identifier
- `@Factory(identifier)` - Factory method
- `@Value(path)` - Value injection
- `@Env(key)` - Environment variable injection
- `@PreInject()` - Pre-injection hook
- `@PostInject()` - Post-injection hook
- `@PreDestroy()` - Pre-destroy hook
- `@UseAspects(advice, aspects)` - AOP aspects

### Core Classes

- `ApplicationContext` - Application context and container
- `InstanceScope` - Instance scope enumeration
- `Advice` - AOP advice type enumeration

### Interfaces

- `Aspect` - Aspect interface
- `ProceedingAspect` - Around advice interface
- `InstanceResolution` - Instance resolution interface
- `Evaluator` - Expression evaluator interface

## 🤝 Contributing

Contributions are welcome! Please check the [GitHub repository](https://github.com/vgerbot-libraries/ioc) for more information.

## 📄 License

This project is licensed under the MIT License.

