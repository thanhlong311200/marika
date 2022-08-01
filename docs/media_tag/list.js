module.exports = {
  get: {
    tags: ['Media tag'],
    summary: "get list media tag (by User & Admin)",
    operationId: 'GetListMediaTag',
    parameters: [
      {
        name: 'name',
        in: 'query',
        description: "Filter name ",
        schema: {
          type: 'string',
          default: '',
        }
      },
      {
        name: 'categoryId',
        in: 'query',
        description: "Filter categoryId ",
        schema: {
          type: 'string',
          default: '',
        }
      },
      {
        name: 'topicId',
        in: 'query',
        description: "Filter topicId ",
        schema: {
          type: 'string',
          default: '',
        }
      },
      {
        name: 'pageNumber',
        in: 'query',
        description: "page number pagination",
        schema: {
          type: 'number',
          default: 0,
        }
      },
      {
        name: 'itemsPerPage',
        in: 'query',
        description: "items per Page pagination",
        schema: {
          type: 'number',
          default: 10,
        }
      },],
    responses: {
      '200': {
        description: "Get list media tag success",
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: "string",
                  description: "response message",
                  example: "The request was executed successfully"
                },
                code: {
                  type: "string",
                  description: "response code",
                  example: "SUCCESS"
                },
                data: {
                  type: 'array',
                  items: {
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
                  }
                }
              }
            },
          },
        },
      },
      '400': {
        description: "Get media tag Fail !",
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
  }
}
