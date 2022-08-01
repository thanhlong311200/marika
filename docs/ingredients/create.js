module.exports = {
  post: {
    tags: ['Ingredients'],
    summary: "create Ingredients (by Admin)",
    operationId: 'createIngredients',
    security: [{
      bearerAuth: []
    }],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: "object",
            required: [
              "name",
              "unit",
              "categoryId",
            ],
            properties: {
              name: {
                type: 'string',
                description: "name Ingredients",
                example: 'extra virgin olive oil',
              },
              type: {
                type: 'string',
                description: "type of ingredients. value type is 'normal'|'toServe'",
                example: 'normal',
              },
              unit: {
                type: 'string',
                description: "unit of ingredients",
                example: 'tsd',
              },
              categoryId: {
                type: "string",
                description: "Id of category",
                example: "61cc5df3dc50a2ef90b9131a"
              },
            }
          }
        },
        'application/json': {
          schema: {
            type: 'object',
            required: [
              "name",
              "unit",
              "categoryId",
            ],
            properties: {
              name: {
                type: 'string',
                description: "name Ingredients",
                example: 'extra virgin olive oil',
              },
              type: {
                type: 'string',
                description: "type of ingredients. value type is 'normal'|'toServe'",
                example: 'normal',
              },
              unit: {
                type: 'string',
                description: "unit of ingredients",
                example: 'tsd',
              },
              categoryId: {
                type: "string",
                description: "Id of category",
                example: "61cc5df3dc50a2ef90b9131a"
              },
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: "Create Ingredients success",
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                code: {
                  type: "string",
                  description: "response code",
                  example: "SUCCESS"
                },
                data: {
                  properties: {
                    _id: {
                      $ref: "#/components/schemas/_id"
                    },
                    name: {
                      type: 'string',
                      description: "name Ingredients",
                      example: 'extra virgin olive oil',
                    },
                    type: {
                      type: 'string',
                      description: "type of ingredients. value type is 'normal'|'toServe'",
                      example: 'normal',
                    },
                    categoryId: {
                      type: "string",
                      description: "Id of category",
                      example: "61cc5df3dc50a2ef90b9131a"
                    },
                    unit: {
                      type: 'string',
                      description: "unit of ingredients",
                      example: 'tsd',
                    },
                  }
                },
                message: {
                  type: "string",
                  description: "response message",
                  example: "The request was executed successfully"
                },
              }
            }
          }
        }
      },
      '400': {
        description: "Create Ingredients Fail !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error400"
            }
          }
        },
      },
      '401': {
        description: "Permission Fail !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error401"
            }
          }
        },
      },
      '422': {
        description: "Invalid field",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error422"
            }
          }
        }
      },
      '500': {
        description: 'Server error'
      }
    },
  },

}
