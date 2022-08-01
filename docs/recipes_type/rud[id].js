module.exports = {
  put: {
    tags: ['Recipes type'],
    summary: "update recipes type by id (by Admin)",
    operationId: 'updateRecipesType',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "id of recipes type",
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
                description: "name recipes type",
                example: 'vegetarian',
              },
              description: {
                type: 'string',
                description: "description recipes type",
                example: 'vegetarian food recipes',
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
                description: "name recipes type",
                example: 'vegetarian',
              },
              description: {
                type: 'string',
                description: "description recipes type",
                example: 'vegetarian food recipes',
              },
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: "Update recipes type success",
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
                      description: "name recipes type",
                      example: 'vegetarian',
                    },
                    description: {
                      type: 'string',
                      description: "description recipes type",
                      example: 'vegetarian food recipes',
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
        description: "Change recipes type Fail !",
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
    tags: ['Recipes type'],
    summary: "delete recipes type by id (by Admin)",
    operationId: 'deleteRecipesType',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: "id of recipes type",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "delete recipes type success!",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Success200"
            }
          }
        },
      },
      '400': {
        description: "Delete recipes type Fail !",
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
    tags: ['Recipes type'],
    summary: "get recipes type by id (by User & Admin)",
    operationId: 'GetRecipesType',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: "id of recipes type",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "Get recipes type by id success",
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
                      description: "name recipes type",
                      example: 'vegetarian',
                    },
                    description: {
                      type: 'string',
                      description: "description recipes type",
                      example: 'vegetarian food recipes',
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
        description: "Get recipes type Fail !",
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
