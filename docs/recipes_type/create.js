module.exports = {
  post: {
    tags: ['Recipes type'],
    summary: "create recipes type (by Admin)",
    operationId: 'createRecipesType',
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
                description: "name recipes type",
                example: 'vegetarian',
              },
              description: {
                type: 'string',
                description: "description recipes type",
                example: 'vegetarian food recipes',
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
                description: "name recipes type",
                example: 'vegetarian',
              },
              description: {
                type: 'string',
                description: "description recipes type",
                example: 'vegetarian food recipes',
              },
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: "Create recipes type success",
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
                      description: "name recipes type",
                      example: 'vegetarian',
                    },
                    description: {
                      type: 'string',
                      description: "description recipes type",
                      example: 'vegetarian food recipes',
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
        description: "Create recipes type Fail !",
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
