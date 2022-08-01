module.exports = {
  get: {
    tags: ['Topic media'],
    summary: "get list topic media (by User & Admin)",
    operationId: 'GetListTopicMedia',
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
        description: "categoryId of media. eg: 61caaa2c721c61dcf0b38e00",
        schema: {
          type: 'string',
        }
      },
      {
        name: 'type',
        in: 'query',
        description: "Filter type",
        schema: {
          type: 'string',
          default: 'video',
          enum: ['video', 'image', 'audio'],
        }
      },
      {
        name: 'subType',
        in: 'query',
        description: "Filter sub type",
        schema: {
          type: 'string',
          default: 'other',
          enum: ['recipes', 'audio', 'video', 'other'],
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
      },
    ],
    responses: {
      '200': {
        description: "Get list topic media success",
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
                  }
                }
              }
            },
          },
        },
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
  }
}
