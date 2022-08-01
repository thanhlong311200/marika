module.exports = {
  post: {
    tags: ['Recipes meal'],
    summary: "create recipes meal (by Admin)",
    operationId: 'createRecipesMeal',
    security: [{
      bearerAuth: []
    }],
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
    responses: {
      '200': {
        description: "Create recipes meal success",
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
        description: "Create recipes meal Fail !",
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
