# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useAddNewTrainer, useGetClassesTaughtByTrainer, useBookClass, useListAvailableMemberships } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useAddNewTrainer(addNewTrainerVars);

const { data, isPending, isSuccess, isError, error } = useGetClassesTaughtByTrainer(getClassesTaughtByTrainerVars);

const { data, isPending, isSuccess, isError, error } = useBookClass(bookClassVars);

const { data, isPending, isSuccess, isError, error } = useListAvailableMemberships();

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { addNewTrainer, getClassesTaughtByTrainer, bookClass, listAvailableMemberships } from '@dataconnect/generated';


// Operation AddNewTrainer:  For variables, look at type AddNewTrainerVars in ../index.d.ts
const { data } = await AddNewTrainer(dataConnect, addNewTrainerVars);

// Operation GetClassesTaughtByTrainer:  For variables, look at type GetClassesTaughtByTrainerVars in ../index.d.ts
const { data } = await GetClassesTaughtByTrainer(dataConnect, getClassesTaughtByTrainerVars);

// Operation BookClass:  For variables, look at type BookClassVars in ../index.d.ts
const { data } = await BookClass(dataConnect, bookClassVars);

// Operation ListAvailableMemberships: 
const { data } = await ListAvailableMemberships(dataConnect);


```