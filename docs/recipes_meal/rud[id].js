module.exports = {
  put: {
    tags: ['Recipes meal'],
    summary: "update recipes meal by id (by Admin)",
    operationId: 'updateRecipesMeal',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "id of recipes meal",
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
                description: "name recipes meal",
                example: 'breakfast',
              },
              isMenuFood: {
                type: 'boolean',
                description: "recipes meal is menu food ?",
                example: true,
              },
              description: {
                type: 'string',
                description: "description recipes meal",
                example: 'Breakfast, served between 6am and 10am',
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
                description: "name recipes meal",
                example: 'breakfast',
              },
              isMenuFood: {
                type: 'boolean',
                description: "recipes meal is menu food ?",
                example: true,
              },
              description: {
                type: 'string',
                description: "description recipes meal",
                example: 'Breakfast, served between 6am and 10am',
              },
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: "Update recipes meal success",
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
                      description: "name recipes meal",
                      example: 'breakfast',
                    },
                    isMenuFood: {
                      type: 'boolean',
                      description: "recipes meal is menu food ?",
                      example: true,
                    },
                    description: {
                      type: 'string',
                      description: "description recipes meal",
                      example: 'Breakfast, served between 6am and 10am',
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
        description: "Change recipes meal Fail !",
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
    tags: ['Recipes meal'],
    summary: "delete recipes meal by id (by Admin)",
    operationId: 'deleteRecipesMeal',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: "id of recipes meal",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "delete recipes meal success!",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Success200"
            }
          }
        },
      },
      '400': {
        description: "Delete recipes meal Fail !",
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
    tags: ['Recipes meal'],
    summary: "get recipes meal by id (by User & Admin)",
    operationId: 'GetRecipesMeal',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: "id of recipes meal",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "Get recipes meal by id success",
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
                      description: "name recipes meal",
                      example: 'breakfast',
                    },
                    isMenuFood: {
                      type: 'boolean',
                      description: "recipes meal is menu food ?",
                      example: true,
                    },
                    description: {
                      type: 'string',
                      description: "description recipes meal",
                      example: 'Breakfast, served between 6am and 10am',
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
        description: "Get recipes meal Fail !",
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
