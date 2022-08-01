module.exports = {
  get: {
    tags: ['Recipes meal'],
    summary: "get list recipes meal (by User & Admin)",
    operationId: 'GetListRecipesMeal',
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
        name: 'showAll',
        in: 'query',
        description: "Filter all item",
        schema: {
          type: 'boolean',
          default: null,
        }
      },
      {
        name: 'isMenuFood',
        in: 'query',
        description: "Filter is menu food (if not query 'isMenuFood' then 'isMenuFood' is true)",
        schema: {
          type: 'boolean',
          default: null,
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
        description: "Get list recipes meal success",
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
                        description: "name recipes meal",
                        example: 'breakfast',
                      },
                      isMenuFood: {
                        type: 'boolean',
                        description: "recipes meal is menu food ?",
                        example: true,
                      },
                      description: {
                        type: 'string',
                        description: "description recipes meal",
                        example: 'Breakfast, served between 6am and 10am',
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
        description: "Get recipes meal Fail !",
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
