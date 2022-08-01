module.exports = {
  put: {
    tags: ['System'],
    summary: "update system by id (by Admin)",
    operationId: 'updateSystem',
    parameters: [{
      name: 'field',
      in: 'path',
      description: "field of system",
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
              field: {
                type: 'string',
                description: "field system",
                example: 'redirect_uri',
              },
              value: {
                type: 'string',
                description: "value of field",
                example: 'https://marikaday.com',
              },
            }
          }
        },
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              field: {
                type: 'string',
                description: "field system",
                example: 'redirect_uri',
              },
              value: {
                type: 'string',
                description: "value of field",
                example: 'https://marikaday.com',
              },
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: "Update system success",
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
                    field: {
                      type: 'string',
                      description: "field system",
                      example: 'redirect_uri',
                    },
                    value: {
                      type: 'string',
                      description: "value of field",
                      example: 'https://marikaday.com',
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
        description: "Change system Fail !",
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
    tags: ['System'],
    summary: "delete system by id (by Admin)",
    operationId: 'deleteSystem',
    parameters: [
      {
        name: 'field',
        in: 'path',
        description: "field of system",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "delete system success!",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Success200"
            }
          }
        },
      },
      '400': {
        description: "Delete system Fail !",
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
    tags: ['System'],
    summary: "get system by id (by Admin)",
    operationId: 'GetSystem',
    parameters: [
      {
        name: 'field',
        in: 'path',
        description: "field of system",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "Get system by id success",
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
                    field: {
                      type: 'string',
                      description: "field system",
                      example: 'redirect_uri',
                    },
                    value: {
                      type: 'string',
                      description: "value of field",
                      example: 'https://marikaday.com',
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
        description: "Get system Fail !",
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
