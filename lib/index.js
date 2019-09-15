"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AutoModelMapper = exports.BasicModelMapper = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BasicModelMapper =
/*#__PURE__*/
function () {
  function BasicModelMapper() {
    _classCallCheck(this, BasicModelMapper);
  }

  _createClass(BasicModelMapper, [{
    key: "modelToApi",

    /**
     * Converts a Model to an API response object
     * @param {object} model The model to convert to a POJO
     * @param {array} map An array of arrays, the inner arrays containing key mappings between objects.
     *                         Inner array format can be either ['modelPropertyKey', ['apiPropertyKey'] or
     *                         ['modelPropertyKey', apiToModelTransformer(), modelToApiTransformer()]
     */
    value: function modelToApi(model, map) {
      var result = {};
      map.forEach(function (value, key) {
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

  }, {
    key: "apiToModel",
    value: function apiToModel(apiModel, map, ModelClass) {
      var model = {};
      map.forEach(function (value, key) {
        model[value[2] || value[0]] = apiModel[value[1]];
      });
      var result = ModelClass ? new ModelClass() : new Object();
      return Object.assign(result, model);
    }
  }]);

  return BasicModelMapper;
}();

exports.BasicModelMapper = BasicModelMapper;

var AutoModelMapper =
/*#__PURE__*/
function () {
  function AutoModelMapper() {
    _classCallCheck(this, AutoModelMapper);
  }

  _createClass(AutoModelMapper, [{
    key: "mappingReducer",

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
    value: function mappingReducer(sourceObj, mapping, isMappingModelToApi) {
      var sourceMapIndex = isMappingModelToApi ? 0 : 1;
      var targetMapIndex = isMappingModelToApi ? 1 : 0;
      var lambdaMapIndex = isMappingModelToApi ? 2 : 1;
      var init = {}; // Iterate through each element of the `mapping` object,
      // and map the source property to the target property.

      return mapping.reduce(function (targetObj, mapEl) {
        if (mapEl.length === 3) {
          // We are using mapping functions to generate the result.
          // Process and Object.assign the result.
          if (mapEl[lambdaMapIndex] !== null) {
            var result = mapEl[lambdaMapIndex](sourceObj);
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

  }, {
    key: "modelToApi",
    value: function modelToApi(model, map) {
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

  }, {
    key: "apiToModel",
    value: function apiToModel(apiModel, map, ModelClass) {
      var model = this.mappingReducer(apiModel, map, false);
      var result = ModelClass ? new ModelClass() : new Object();
      return Object.assign(result, model);
    }
  }]);

  return AutoModelMapper;
}();

exports.AutoModelMapper = AutoModelMapper;