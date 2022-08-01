module.exports = {
  post: {
    tags: ['Recipes dietary'],
    summary: "create recipes dietary (by Admin)",
    operationId: 'createRecipesDietary',
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
                description: "name recipes dietary",
                example: 'fiber',
              },
              description: {
                type: 'string',
                description: "description recipes dietary",
                example: 'a thread or filament from which a vegetable tissue, mineral substance, or textile is formed.',
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
                description: "name recipes dietary",
                example: 'fiber',
              },
              description: {
                type: 'string',
                description: "description recipes dietary",
                example: 'a thread or filament from which a vegetable tissue, mineral substance, or textile is formed.',
              },
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: "Create recipes dietary success",
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
                      description: "name recipes dietary",
                      example: 'fiber',
                    },
                    description: {
                      type: 'string',
                      description: "description recipes dietary",
                      example: 'a thread or filament from which a vegetable tissue, mineral substance, or textile is formed.',
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
        description: "Create recipes dietary Fail !",
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
