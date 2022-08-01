module.exports = {
  post: {
    tags: ['Media category'],
    summary: "create media category (by Admin)",
    operationId: 'createMediaCategory',
    security: [{
      bearerAuth: []
    }],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: "object",
            required: [
              "type",
              "name",
            ],
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
            required: [
              "type",
              "name",
            ],
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
        description: "Create media category success",
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
        description: "Create media category Fail !",
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
