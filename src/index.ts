interface ModelMapperAdapter {
    modelToApi(model: { [index: string]: any }, map: any[][]): object;

    apiToModel<T extends Object | {}>(apiModel: { [index: string]: any }, map: any[][], ModelClass: { new(): T; }): T
}

export class BasicModelMapper implements ModelMapperAdapter {

    /**
     * Converts a Model to an API response object
     * @param {object} model The model to convert to a POJO
     * @param {array} map An array of arrays, the inner arrays containing key mappings between objects.
     *                         Inner array format can be either ['modelPropertyKey', ['apiPropertyKey'] or
     *                         ['modelPropertyKey', apiToModelTransformer(), modelToApiTransformer()]
     */
    modelToApi(model: { [index: string]: any }, map: any[][]): object {
        let result: { [index: string]: any } = {};
        map.forEach((value, key) => {
            result[value[1]] = model[value[0]];
        });
        return result;
    }

    /**
     * Converts a plain API response object to a Model.
     * @param {object} apiModel The API response to convert to a Model
     * @param {array} map An array of arrays, the inner arrays containing key mappings between objects.
     *                         Inner array format can be either ['modelPropertyKey', ['apiPropertyKey'] or
     *                         ['modelPropertyKey', apiToModelTransformer(), modelToApiTransformer()]
     * @param {Prototype} ModelClass The type of model we are creating (e.g., User)
     */
    apiToModel<T extends Object>(apiModel: { [index: string]: any }, map: any[][], ModelClass?: { new(): T; }): T {
        let model: { [index: string]: any } = {};
        map.forEach((value, key) => {
            model[value[2] || value[0]] = apiModel[value[1]];
        });
        const result: any = (ModelClass) ? new ModelClass() : new Object();
        return Object.assign(result,model);
    }
}

export class AutoModelMapper implements ModelMapperAdapter {

    /**
     * Converts one type of object to another, in this case to/from our Models to
     * plain API response objects.
     * @param {object} sourceObj The source object, either a Model or a plain API response object
     * @param {array} mapping An array of arrays, the inner arrays containing key mappings between objects.
     *                        Inner array format can be either ['modelPropertyKey', ['apiPropertyKey'] or
     *                        ['modelPropertyKey', apiToModelTransformer(), modelToApiTransformer()]
     * @param {bool} isMappingModelToApi True if we are taking a Model object an
     *                                   mapping to an API response object, otherwise false.
     */
    mappingReducer(sourceObj: { [index: string]: any }, mapping: any[][], isMappingModelToApi: boolean): object {
        const sourceMapIndex = isMappingModelToApi ? 0 : 1;
        const targetMapIndex = isMappingModelToApi ? 1 : 0;
        const lambdaMapIndex = isMappingModelToApi ? 2 : 1;

        let init: { [index: string]: any } = {};
        // Iterate through each element of the `mapping` object,
        // and map the source property to the target property.
        return mapping.reduce((targetObj, mapEl) => {
            if (mapEl.length === 3) {
                // We are using mapping functions to generate the result.
                // Process and Object.assign the result.
                if (mapEl[lambdaMapIndex] !== null) {
                    const result = mapEl[lambdaMapIndex](sourceObj);
                    targetObj = Object.assign(targetObj, result);
                }
            } else {
                // Just a simple straight mapping conversion.
                targetObj[mapEl[targetMapIndex]] = sourceObj[mapEl[sourceMapIndex]];
            }

            return targetObj;
        }, init);
    }

    /**
     * Converts a Model to an API response object
     * @param {object} model The model to convert to a POJO
     * @param {array} map An array of arrays, the inner arrays containing key mappings between objects.
     *                         Inner array format can be either ['modelPropertyKey', ['apiPropertyKey'] or
     *                         ['modelPropertyKey', apiToModelTransformer(), modelToApiTransformer()]
     */
    modelToApi(model: { [index: string]: any }, map: any[][]): object {
        return this.mappingReducer(model, map, true);
    }

    /**
     * Converts a plain API response object to a Model.
     * @param {object} apiModel The API response to convert to a Model
     * @param {array} map An array of arrays, the inner arrays containing key mappings between objects.
     *                         Inner array format can be either ['modelPropertyKey', ['apiPropertyKey'] or
     *                         ['modelPropertyKey', apiToModelTransformer(), modelToApiTransformer()]
     * @param {Prototype} ModelClass The type of model we are creating (e.g., User)
     */
    apiToModel<T extends Object>(apiModel: { [index: string]: any }, map: any[][], ModelClass?: { new(): T; }): T {
        const model = this.mappingReducer(apiModel, map, false);
        const result: any = (ModelClass) ? new ModelClass() : new Object();
        return Object.assign(result,model);
    }
}
