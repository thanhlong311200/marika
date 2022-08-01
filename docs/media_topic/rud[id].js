module.exports = {
  put: {
    tags: ['Topic media'],
    summary: "update topic media by id (by Admin)",
    operationId: 'updateTopicMedia',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "id of topic media",
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
              name: {
                type: 'string',
                description: "name topic media",
                example: 'egg free',
              },
              categoryId: {
                $ref: "#/components/schemas/_id"
              },
              description: {
                type: 'string',
                description: "description topic media",
                example: 'All prices in AUD. Subscriptions will auto renew at the end of each subscription period.',
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
                description: "name topic media",
                example: 'egg free',
              },
              categoryId: {
                $ref: "#/components/schemas/_id"
              },
              description: {
                type: 'string',
                description: "description topic media",
                example: 'All prices in AUD. Subscriptions will auto renew at the end of each subscription period.',
              },
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: "Update topic media success",
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
                      description: "type topic media",
                      example: 'EGG',
                    },
                    name: {
                      type: 'string',
                      description: "name topic media",
                      example: 'egg free',
                    },
                    categoryId: {
                      $ref: "#/components/schemas/_id"
                    },
                    description: {
                      type: 'string',
                      description: "description topic media",
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
        description: "Change topic media Fail !",
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
    tags: ['Topic media'],
    summary: "delete topic media by id (by Admin)",
    operationId: 'deleteTopicMedia',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: "id of topic media",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "delete topic media success!",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Success200"
            }
          }
        },
      },
      '400': {
        description: "Delete topic media Fail !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error400"
            }
          }
        },
      },
      '401': {
        description: "Delete topic media Fail!",
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
    tags: ['Topic media'],
    summary: "get topic media by id (by User & Admin)",
    operationId: 'GetTopicMedia',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: "id of topic media",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "Get topic media by id success",
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
                      description: "type topic media",
                      example: 'EGG',
                    },
                    name: {
                      type: 'string',
                      description: "name topic media",
                      example: 'egg free',
                    },
                    categoryId: {
                      $ref: "#/components/schemas/_id"
                    },
                    description: {
                      type: 'string',
                      description: "description topic media",
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
        description: "Get topic media Fail !",
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
