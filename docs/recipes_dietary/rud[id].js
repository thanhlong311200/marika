module.exports = {
  put: {
    tags: ['Recipes dietary'],
    summary: "update recipes dietary by id (by Admin)",
    operationId: 'updateRecipesDietary',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "id of recipes dietary",
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
                description: "name recipes dietary",
                example: 'fiber',
              },
              description: {
                type: 'string',
                description: "description recipes dietary",
                example: 'a thread or filament from which a vegetable tissue, mineral substance, or textile is formed.',
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
                description: "name recipes dietary",
                example: 'fiber',
              },
              description: {
                type: 'string',
                description: "description recipes dietary",
                example: 'a thread or filament from which a vegetable tissue, mineral substance, or textile is formed.',
              },
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: "Update recipes dietary success",
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
                      description: "name recipes dietary",
                      example: 'fiber',
                    },
                    description: {
                      type: 'string',
                      description: "description recipes dietary",
                      example: 'a thread or filament from which a vegetable tissue, mineral substance, or textile is formed.',
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
        description: "Change recipes dietary Fail !",
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
    tags: ['Recipes dietary'],
    summary: "delete recipes dietary by id (by Admin)",
    operationId: 'deleteRecipesDietary',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: "id of recipes dietary",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "delete recipes dietary success!",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Success200"
            }
          }
        },
      },
      '400': {
        description: "Delete recipes dietary Fail !",
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
    tags: ['Recipes dietary'],
    summary: "get recipes dietary by id (by User & Admin)",
    operationId: 'GetRecipesDietary',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: "id of recipes dietary",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "Get recipes dietary by id success",
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
                      description: "name recipes dietary",
                      example: 'fiber',
                    },
                    description: {
                      type: 'string',
                      description: "description recipes dietary",
                      example: 'a thread or filament from which a vegetable tissue, mineral substance, or textile is formed.',
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
        description: "Get recipes dietary Fail !",
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
