module.exports = {
  get: {
    tags: ['System'],
    summary: "get list system (by Admin)",
    operationId: 'GetListSystem',
    parameters: [
      {
        name: 'field',
        in: 'query',
        description: "Filter field ",
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
        description: "Get list system success",
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
          },
        },
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
  }
}
