# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetClassesTaughtByTrainer*](#getclassestaughtbytrainer)
  - [*ListAvailableMemberships*](#listavailablememberships)
- [**Mutations**](#mutations)
  - [*AddNewTrainer*](#addnewtrainer)
  - [*BookClass*](#bookclass)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetClassesTaughtByTrainer
You can execute the `GetClassesTaughtByTrainer` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getClassesTaughtByTrainer(vars: GetClassesTaughtByTrainerVariables): QueryPromise<GetClassesTaughtByTrainerData, GetClassesTaughtByTrainerVariables>;

interface GetClassesTaughtByTrainerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClassesTaughtByTrainerVariables): QueryRef<GetClassesTaughtByTrainerData, GetClassesTaughtByTrainerVariables>;
}
export const getClassesTaughtByTrainerRef: GetClassesTaughtByTrainerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getClassesTaughtByTrainer(dc: DataConnect, vars: GetClassesTaughtByTrainerVariables): QueryPromise<GetClassesTaughtByTrainerData, GetClassesTaughtByTrainerVariables>;

interface GetClassesTaughtByTrainerRef {
  ...
  (dc: DataConnect, vars: GetClassesTaughtByTrainerVariables): QueryRef<GetClassesTaughtByTrainerData, GetClassesTaughtByTrainerVariables>;
}
export const getClassesTaughtByTrainerRef: GetClassesTaughtByTrainerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getClassesTaughtByTrainerRef:
```typescript
const name = getClassesTaughtByTrainerRef.operationName;
console.log(name);
```

### Variables
The `GetClassesTaughtByTrainer` query requires an argument of type `GetClassesTaughtByTrainerVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetClassesTaughtByTrainerVariables {
  trainerId: UUIDString;
}
```
### Return Type
Recall that executing the `GetClassesTaughtByTrainer` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetClassesTaughtByTrainerData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetClassesTaughtByTrainerData {
  classes: ({
    id: UUIDString;
    name: string;
    scheduleTime: TimestampString;
    durationInMinutes: number;
  } & Class_Key)[];
}
```
### Using `GetClassesTaughtByTrainer`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getClassesTaughtByTrainer, GetClassesTaughtByTrainerVariables } from '@dataconnect/generated';

// The `GetClassesTaughtByTrainer` query requires an argument of type `GetClassesTaughtByTrainerVariables`:
const getClassesTaughtByTrainerVars: GetClassesTaughtByTrainerVariables = {
  trainerId: ..., 
};

// Call the `getClassesTaughtByTrainer()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getClassesTaughtByTrainer(getClassesTaughtByTrainerVars);
// Variables can be defined inline as well.
const { data } = await getClassesTaughtByTrainer({ trainerId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getClassesTaughtByTrainer(dataConnect, getClassesTaughtByTrainerVars);

console.log(data.classes);

// Or, you can use the `Promise` API.
getClassesTaughtByTrainer(getClassesTaughtByTrainerVars).then((response) => {
  const data = response.data;
  console.log(data.classes);
});
```

### Using `GetClassesTaughtByTrainer`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getClassesTaughtByTrainerRef, GetClassesTaughtByTrainerVariables } from '@dataconnect/generated';

// The `GetClassesTaughtByTrainer` query requires an argument of type `GetClassesTaughtByTrainerVariables`:
const getClassesTaughtByTrainerVars: GetClassesTaughtByTrainerVariables = {
  trainerId: ..., 
};

// Call the `getClassesTaughtByTrainerRef()` function to get a reference to the query.
const ref = getClassesTaughtByTrainerRef(getClassesTaughtByTrainerVars);
// Variables can be defined inline as well.
const ref = getClassesTaughtByTrainerRef({ trainerId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getClassesTaughtByTrainerRef(dataConnect, getClassesTaughtByTrainerVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.classes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.classes);
});
```

## ListAvailableMemberships
You can execute the `ListAvailableMemberships` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAvailableMemberships(): QueryPromise<ListAvailableMembershipsData, undefined>;

interface ListAvailableMembershipsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAvailableMembershipsData, undefined>;
}
export const listAvailableMembershipsRef: ListAvailableMembershipsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAvailableMemberships(dc: DataConnect): QueryPromise<ListAvailableMembershipsData, undefined>;

interface ListAvailableMembershipsRef {
  ...
  (dc: DataConnect): QueryRef<ListAvailableMembershipsData, undefined>;
}
export const listAvailableMembershipsRef: ListAvailableMembershipsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAvailableMembershipsRef:
```typescript
const name = listAvailableMembershipsRef.operationName;
console.log(name);
```

### Variables
The `ListAvailableMemberships` query has no variables.
### Return Type
Recall that executing the `ListAvailableMemberships` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAvailableMembershipsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAvailableMembershipsData {
  memberships: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    price: number;
    durationInMonths: number;
  } & Membership_Key)[];
}
```
### Using `ListAvailableMemberships`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAvailableMemberships } from '@dataconnect/generated';


// Call the `listAvailableMemberships()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAvailableMemberships();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAvailableMemberships(dataConnect);

console.log(data.memberships);

// Or, you can use the `Promise` API.
listAvailableMemberships().then((response) => {
  const data = response.data;
  console.log(data.memberships);
});
```

### Using `ListAvailableMemberships`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAvailableMembershipsRef } from '@dataconnect/generated';


// Call the `listAvailableMembershipsRef()` function to get a reference to the query.
const ref = listAvailableMembershipsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAvailableMembershipsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.memberships);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.memberships);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## AddNewTrainer
You can execute the `AddNewTrainer` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addNewTrainer(vars: AddNewTrainerVariables): MutationPromise<AddNewTrainerData, AddNewTrainerVariables>;

interface AddNewTrainerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddNewTrainerVariables): MutationRef<AddNewTrainerData, AddNewTrainerVariables>;
}
export const addNewTrainerRef: AddNewTrainerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addNewTrainer(dc: DataConnect, vars: AddNewTrainerVariables): MutationPromise<AddNewTrainerData, AddNewTrainerVariables>;

interface AddNewTrainerRef {
  ...
  (dc: DataConnect, vars: AddNewTrainerVariables): MutationRef<AddNewTrainerData, AddNewTrainerVariables>;
}
export const addNewTrainerRef: AddNewTrainerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addNewTrainerRef:
```typescript
const name = addNewTrainerRef.operationName;
console.log(name);
```

### Variables
The `AddNewTrainer` mutation requires an argument of type `AddNewTrainerVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddNewTrainerVariables {
  firstName: string;
  lastName: string;
  specialty: string;
}
```
### Return Type
Recall that executing the `AddNewTrainer` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddNewTrainerData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddNewTrainerData {
  trainer_insert: Trainer_Key;
}
```
### Using `AddNewTrainer`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addNewTrainer, AddNewTrainerVariables } from '@dataconnect/generated';

// The `AddNewTrainer` mutation requires an argument of type `AddNewTrainerVariables`:
const addNewTrainerVars: AddNewTrainerVariables = {
  firstName: ..., 
  lastName: ..., 
  specialty: ..., 
};

// Call the `addNewTrainer()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addNewTrainer(addNewTrainerVars);
// Variables can be defined inline as well.
const { data } = await addNewTrainer({ firstName: ..., lastName: ..., specialty: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addNewTrainer(dataConnect, addNewTrainerVars);

console.log(data.trainer_insert);

// Or, you can use the `Promise` API.
addNewTrainer(addNewTrainerVars).then((response) => {
  const data = response.data;
  console.log(data.trainer_insert);
});
```

### Using `AddNewTrainer`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addNewTrainerRef, AddNewTrainerVariables } from '@dataconnect/generated';

// The `AddNewTrainer` mutation requires an argument of type `AddNewTrainerVariables`:
const addNewTrainerVars: AddNewTrainerVariables = {
  firstName: ..., 
  lastName: ..., 
  specialty: ..., 
};

// Call the `addNewTrainerRef()` function to get a reference to the mutation.
const ref = addNewTrainerRef(addNewTrainerVars);
// Variables can be defined inline as well.
const ref = addNewTrainerRef({ firstName: ..., lastName: ..., specialty: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addNewTrainerRef(dataConnect, addNewTrainerVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.trainer_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.trainer_insert);
});
```

## BookClass
You can execute the `BookClass` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
bookClass(vars: BookClassVariables): MutationPromise<BookClassData, BookClassVariables>;

interface BookClassRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: BookClassVariables): MutationRef<BookClassData, BookClassVariables>;
}
export const bookClassRef: BookClassRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
bookClass(dc: DataConnect, vars: BookClassVariables): MutationPromise<BookClassData, BookClassVariables>;

interface BookClassRef {
  ...
  (dc: DataConnect, vars: BookClassVariables): MutationRef<BookClassData, BookClassVariables>;
}
export const bookClassRef: BookClassRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the bookClassRef:
```typescript
const name = bookClassRef.operationName;
console.log(name);
```

### Variables
The `BookClass` mutation requires an argument of type `BookClassVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface BookClassVariables {
  userId: UUIDString;
  classId: UUIDString;
  bookingDate: DateString;
}
```
### Return Type
Recall that executing the `BookClass` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `BookClassData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface BookClassData {
  booking_insert: Booking_Key;
}
```
### Using `BookClass`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, bookClass, BookClassVariables } from '@dataconnect/generated';

// The `BookClass` mutation requires an argument of type `BookClassVariables`:
const bookClassVars: BookClassVariables = {
  userId: ..., 
  classId: ..., 
  bookingDate: ..., 
};

// Call the `bookClass()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await bookClass(bookClassVars);
// Variables can be defined inline as well.
const { data } = await bookClass({ userId: ..., classId: ..., bookingDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await bookClass(dataConnect, bookClassVars);

console.log(data.booking_insert);

// Or, you can use the `Promise` API.
bookClass(bookClassVars).then((response) => {
  const data = response.data;
  console.log(data.booking_insert);
});
```

### Using `BookClass`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, bookClassRef, BookClassVariables } from '@dataconnect/generated';

// The `BookClass` mutation requires an argument of type `BookClassVariables`:
const bookClassVars: BookClassVariables = {
  userId: ..., 
  classId: ..., 
  bookingDate: ..., 
};

// Call the `bookClassRef()` function to get a reference to the mutation.
const ref = bookClassRef(bookClassVars);
// Variables can be defined inline as well.
const ref = bookClassRef({ userId: ..., classId: ..., bookingDate: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = bookClassRef(dataConnect, bookClassVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.booking_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.booking_insert);
});
```

