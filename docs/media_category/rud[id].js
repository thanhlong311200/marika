module.exports = {
  put: {
    tags: ['Media category'],
    summary: "update media category by id (by Admin)",
    operationId: 'updateMediaCategory',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "id of media category",
      required: true,
      schema: {
        type: 'string',
      }
    }],
    security: [{
      bearerAuth: []
    }],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: "object",
            properties: {
              type: {
                type: 'string',
                description: 'type is "video"|"image"|"audio"',
                example: "image"
              },
              name: {
                type: 'string',
                description: "name media category",
                example: 'category test',
              },
              description: {
                type: 'string',
                description: "description media category",
                example: 'All prices in AUD. Subscriptions will auto renew at the end of each subscription period.',
              },
            }
          }
        },
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                description: 'type is "video"|"image"|"audio"',
                example: "image"
              },
              name: {
                type: 'string',
                description: "name media category",
                example: 'category test',
              },
              description: {
                type: 'string',
                description: "description media category",
                example: 'All prices in AUD. Subscriptions will auto renew at the end of each subscription period.',
              },
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: "Update media category success",
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
                    type: {
                      type: 'string',
                      description: 'type is "video"|"image"|"audio"',
                      example: "image"
                    },
                    name: {
                      type: 'string',
                      description: "name media category",
                      example: 'category test',
                    },
                    description: {
                      type: 'string',
                      description: "description media category",
                      example: 'All prices in AUD. Subscriptions will auto renew at the end of each subscription period.',
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
        description: "Change media category Fail !",
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
    tags: ['Media category'],
    summary: "delete media category by id (by Admin)",
    operationId: 'deleteMediaCategory',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: "id of media category",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "delete media category success!",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Success200"
            }
          }
        },
      },
      '400': {
        description: "Delete media category Fail !",
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
    tags: ['Media category'],
    summary: "get media category by id (by User & Admin)",
    operationId: 'GetMediaCategory',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: "id of media category",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "Get media category by id success",
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
                    type: {
                      type: 'string',
                      description: 'type is "video"|"image"|"audio"',
                      example: "image"
                    },
                    name: {
                      type: 'string',
                      description: "name media category",
                      example: 'category test',
                    },
                    description: {
                      type: 'string',
                      description: "description media category",
                      example: 'All prices in AUD. Subscriptions will auto renew at the end of each subscription period.',
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
        description: "Get media category Fail !",
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
