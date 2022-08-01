module.exports = {
  put: {
    tags: ['Ingredients'],
    summary: "update Ingredients by id (by Admin)",
    operationId: 'updateIngredients',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "id of Ingredients",
      required: true,
      schema: {
        type: 'string',
      }
    }],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: "object",
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
        description: "Update Ingredients success",
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
        description: "Change Ingredients Fail !",
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
  delete: {
    tags: ['Ingredients'],
    summary: "delete Ingredients by id (by Admin)",
    operationId: 'deleteIngredients',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: "id of Ingredients",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "delete Ingredients success!",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Success200"
            }
          }
        },
      },
      '400': {
        description: "Delete Ingredients Fail !",
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
  },
  get: {
    tags: ['Ingredients'],
    summary: "get Ingredients by id (by User & Admin)",
    operationId: 'GetIngredients',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: "id of Ingredients",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "Get Ingredients by id success",
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
  },
}
