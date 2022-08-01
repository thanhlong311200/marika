module.exports = {
  get: {
    tags: ['Recipes'],
    summary: "Get recipes name by id (by all people)",
    operationId: 'GetNameRecipes',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "Id of recipes",
      required: true,
      schema: {
        type: 'string',
      }
    }],
    responses: {
      '200': {
        description: "get recipes success",
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
                  type: "object",
                  properties: {
                    name: {
                      type: 'string',
                      description: 'name of recipes',
                      example: "eggs on toast"
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
        description: `recipes not found`,
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error400"
            }
          }
        },
      },
    }
  }
}
