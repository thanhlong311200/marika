module.exports = {
  get: {
    tags: ['Membership'],
    summary: "fetch list members (by all people)",
    operationId: 'GetListMembership',
    parameters: [
      {
        name: 'type',
        in: 'query',
        description: "Filter type query",
        schema: {
          type: 'string',
          default: '',
        }
      },
      {
        name: 'name',
        in: 'query',
        description: "Filter name query",
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
      },
    ],
    responses: {
      '200': {
        description: "Get list membership success",
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
                        description: "name membership",
                        example: '6 months',
                      },
                      type: {
                        type: 'string',
                        description: "type membership",
                        example: 'month',
                      },
                      time: {
                        type: 'number',
                        description: "time membership",
                        example: 6,
                      },
                      price: {
                        type: 'number',
                        description: "name membership",
                        example: 5.25,
                      },
                      description: {
                        type: 'string',
                        description: "description membership",
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
        description: "Get membership Fail !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error400"
            }
          }
        },
      },
    },
  }
}
