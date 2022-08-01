module.exports = {
  post: {
    tags: ['Media tag'],
    summary: "create media tag (by Admin)",
    operationId: 'createMediaTag',
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: "object",
            required: [
              "name",
            ],
            properties: {
              name: {
                type: 'string',
                description: "name media tag",
                example: 'tag test',
              },
              categoryId: {
                type: "string",
                description: "Id of category",
                example: "61cc5df3dc50a2ef90b9131a"
              },
              topicId: {
                type: "string",
                description: "Id of topic",
                example: "61cc5df3dc50a2ef90b9131a"
              },
              description: {
                type: 'string',
                description: "description media tag",
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
            ],
            properties: {
              name: {
                type: 'string',
                description: "name media tag",
                example: 'tag test',
              },
              categoryId: {
                type: "string",
                description: "Id of category",
                example: "61cc5df3dc50a2ef90b9131a"
              },
              topicId: {
                type: "string",
                description: "Id of topic",
                example: "61cc5df3dc50a2ef90b9131a"
              },
              description: {
                type: 'string',
                description: "description media tag",
                example: 'All prices in AUD. Subscriptions will auto renew at the end of each subscription period.',
              },
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: "Create media tag success",
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
                      description: "name media tag",
                      example: 'tag test',
                    },
                    categoryId: {
                      type: "string",
                      description: "Id of category",
                      example: "61cc5df3dc50a2ef90b9131a"
                    },
                    topicId: {
                      type: "string",
                      description: "Id of topic",
                      example: "61cc5df3dc50a2ef90b9131a"
                    },
                    description: {
                      type: 'string',
                      description: "description media tag",
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
        description: "Create media tag Fail !",
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
