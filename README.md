# Model mapper adapter(s) for mobx-rest
You may need to use different kind of models while sending request and using in mobx-rest and officialy mobx-rest does not suppoer model mapping yet.

I inspired by mobx-rest's apiClient adapter pattern and build a model mapper adapter patter.

In order to achieve mapping, new Model class has 1 new property and 2 new alias functions.

**New property is :** `Model.modelMap`

**New alias functions are** : `Model.toApiObject()` and `Model.toModelObject()`

I have created 2 different kind of mapper for testing and production purposes.

## Basic mapper adapter 
Works on plain objects and supports flat objects only. Basically it applies key to key mapping.
This mapper can produce any type of class that given in return of Api to Model mapping.

This mapper also used for jest tests as is.

**Example :**
```js
import modelMapper from "mobx-rest";
import { BasicModelMapper } from "./mobx-rest-auto-mapper-adapter";

const adapter = modelMapper(new BasicModelMapper());

const modelMap=[
    ['username','name']
];
const model = {"username":"Emrah TOY"};
const apiModel = adapter.modelToApi(model,modelMap); // returns {"name":"Emrah TOY"}
```

**Api to model - object to object mapping :**
```js
// reversing apiModel to model again
const viewModel = adapter.apiToModel(apiModel,modelMap); // returns {"username":"Emrah TOY"}
```

**Api to model - object to Class mapping :**
```js
class User {};
// reversing apiModel to model again but as a User class this time.
const viewModel = adapter.apiToModel(apiModel,modelMap,User); // returns User class with username property
```

## Auto mapper adapter
Along with basic mapper, auto mapper can run on nested properties. Plus on that can also map via arrow functions noted in map list ( like @computed from mobx ).
This mapper can produce any type of class that given in return of Api to Model mapping.

**Example :**
```js
import modelMapper from "mobx-rest";
import { AutoModelMapper } from "./mobx-rest-auto-mapper-adapter";

const adapter = modelMapper(new AutoModelMapper());

const modelMap=[
    [
        'username',
        toApiObject=>{ 
            const splitName = toApiObject.username.split(" ");
            return {"name":splintName[0],"surname":splitName[1]};
        }, 
        toModelObject=>{
            const joinedName = toModelObject.name+" "+toModelObject.surname;
            return {"username":joinedName};
        }
    ]
];
const model = {"username":"Emrah TOY"};
const apiModel = adapter.modelToApi(model,modelMap); // returns {"name":"Emrah", "surname":"TOY"}
```

**Api to model - object to object mapping :**
```js
// reversing apiModel to model again
const viewModel = adapter.apiToModel(apiModel,modelMap); // returns {"username":"Emrah TOY"}
```

**Api to model - object to Class mapping :**
```js
class User {};
// reversing apiModel to model again but as a User class this time.
const viewModel = adapter.apiToModel(apiModel,modelMap,User); // returns User class with username property
```

