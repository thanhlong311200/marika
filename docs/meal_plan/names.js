module.exports = {
  get: {
    tags: ['Meal plan'],
    summary: "get list meal plan (by User & Admin)",
    operationId: 'GetListNameMealPlan',
    parameters: [
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
        description: "Get list meal plan success",
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
                    type: 'string',
                    description: "name meal plan",
                    example: 'Nourished',
                  }
                }
              }
            },
          },
        },
      },
      '400': {
        description: "Get meal plan Fail !",
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
