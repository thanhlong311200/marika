module.exports = {
  post: {
    tags: ['Topic media'],
    summary: "create topic media (by Admin)",
    operationId: 'createTopicMedia',
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
              "categoryId",
            ],
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
            required: [
              "name",
              "categoryId",
            ],
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
        description: "Create topic media ship success",
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
        description: "Create media topic Fail !",
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
