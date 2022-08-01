module.exports = {
  get: {
    tags: ['Ingredients'],
    summary: "get list Ingredients (by User & Admin)",
    operationId: 'GetListIngredients',
    parameters: [
      {
        name: 'name',
        in: 'query',
        description: "Filter name ",
        schema: {
          type: 'string',
        }
      },
      {
        name: 'type',
        in: 'query',
        description: "type ingredients",
        schema: {
          type: 'string',
        }
      },
      {
        name: 'categoryId',
        in: 'query',
        description: "id of category",
        schema: {
          type: 'string',
        }
      },
      {
        name: 'pageNumber',
        in: 'query',
        description: "page number pagination",
        schema: {
          type: 'number',
          default: 0,
        }
      },
      {
        name: 'itemsPerPage',
        in: 'query',
        description: "items per Page pagination",
        schema: {
          type: 'number',
          default: 10,
        }
      },
    ],
    responses: {
      '200': {
        description: "Get list Ingredients success",
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: "string",
                  description: "response message",
                  example: "The request was executed successfully"
                },
                code: {
                  type: "string",
                  description: "response code",
                  example: "SUCCESS"
                },
                data: {
                  type: 'array',
                  items: {
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
          },
        },
      },
      '400': {
        description: "Get Ingredients Fail !",
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
    },
  }
}
