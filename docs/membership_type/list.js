module.exports = {
  get: {
    tags: ['Membership Type'],
    summary: "get list membership type (by User & Admin)",
    operationId: 'GetListMembershipType',
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
        description: "Get list membership type success",
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
                        description: "name membership type",
                        example: 'category test',
                      },
                      description: {
                        type: 'string',
                        description: "description membership type",
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
        description: "Get membership type Fail !",
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
