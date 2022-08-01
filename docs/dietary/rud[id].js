module.exports = {
  put: {
    tags: ['Dietary'],
    summary: "update dietary by id (by Admin)",
    operationId: 'updateDietary',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "id of dietary",
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
                description: "name dietary",
                example: 'fiber',
              },
              description: {
                type: 'string',
                description: "description dietary",
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
                description: "name dietary",
                example: 'fiber',
              },
              description: {
                type: 'string',
                description: "description dietary",
                example: 'a thread or filament from which a vegetable tissue, mineral substance, or textile is formed.',
              },
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: "Update dietary success",
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
                      description: "name dietary",
                      example: 'fiber',
                    },
                    description: {
                      type: 'string',
                      description: "description dietary",
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
        description: "Change dietary Fail !",
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
    tags: ['Dietary'],
    summary: "delete dietary by id (by Admin)",
    operationId: 'deleteDietary',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: "id of dietary",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "delete dietary success!",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Success200"
            }
          }
        },
      },
      '400': {
        description: "Delete dietary Fail !",
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
    tags: ['Dietary'],
    summary: "get dietary by id (by User & Admin)",
    operationId: 'GetDietary',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: "id of dietary",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "Get dietary by id success",
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
                      description: "name dietary",
                      example: 'fiber',
                    },
                    description: {
                      type: 'string',
                      description: "description dietary",
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
        description: "Get dietary Fail !",
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
