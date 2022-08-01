module.exports = {
  post: {
    tags: ['Menu food'],
    summary: "create menu food with recipes (by user)",
    operationId: 'createMenuFoodRecipes',
    security: [{
      bearerAuth: []
    }],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: "object",
            required: [
              "data",
            ],
            properties: {
              data: {
                type: 'array',
                items: {
                  type: "object",
                  required: [
                    "date",
                    "recipe",
                  ],
                  properties: {
                    date: {
                      type: 'date',
                      description: "date menu food",
                      example: '2022-01-15',
                    },
                    swap: {
                      type: 'boolean',
                      description: "swap is true <=> Eating out. swap is false <=> Leftover",
                      example: true,
                    },
                    mealId: {
                      type: "string",
                      description: "id of meal",
                      example: '61db8b0473521bba24ee5315',
                    },
                    recipe: {
                      type: "string",
                      description: "recipe in menu food",
                      example: '61ccc573e1baed4bb9512d1a',
                    },
                  }
                }
              }
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: "Create menu food success",
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
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      _id: {
                        $ref: "#/components/schemas/_id"
                      },
                      userId: {
                        $ref: "#/components/schemas/_id"
                      },
                      date: {
                        type: 'datetime',
                        description: "date menu food",
                        example: '2022-01-15',
                      },
                      swap: {
                        type: 'boolean',
                        description: "swap is true <=> Eating out. swap is false <=> Leftover",
                        example: true,
                      },
                      recipe: {
                        type: "string",
                        description: "recipe in menu food",
                        example: '61ccc573e1baed4bb9512d1a',
                      },
                      mealId: {
                        type: "string",
                        description: "mealId in menu food",
                        example: '61d8814894e14f1683bf612b',
                      }
                    }
                  },
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
        description: "Create menu food Fail !",
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
