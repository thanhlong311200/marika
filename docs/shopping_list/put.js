module.exports = {
  put: {
    tags: ['Shopping list'],
    summary: "update shopping list (all personal)",
    operationId: 'updateShoppingList',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "Id shopping list",
      required: true,
      schema: {
        type: 'string',
      }
    }],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              "date",
              "mealId",
              "ingredientId",
              "buyStatus",
            ],
            properties: {
              date: {
                type: 'string',
                description: "date shopping list",
                example: '2022-01-15',
              },
              mealId: {
                type: 'string',
                description: "id of meal",
                example: '61ce8b4a9514337011cce750',
              },
              ingredientId: {
                type: 'string',
                description: "id Ingredients",
                example: '61ce8b4a9514337011cce750',
              },
              buyStatus: {
                type: 'boolean',
                description: "purchased ingredients (true|false)",
                example: true,
              },
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: "Create shopping list success",
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
                    _id: {
                      $ref: "#/components/schemas/_id"
                    },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          date: {
                            type: 'string',
                            description: "date shopping list",
                            example: '2022-01-15',
                          },
                          mealId: {
                            type: 'string',
                            description: "id of meal",
                            example: '61ce8b4a9514337011cce750',
                          },
                          ingredients: {
                            type: "array",
                            description: "ingredients in shopping list **(required then create shopping list)**",
                            items: {
                              type: "object",
                              properties: {
                                _id: {
                                  type: 'string',
                                  description: "id Ingredients",
                                  example: '61ce8b4a9514337011cce750',
                                },
                                qty: {
                                  type: 'number',
                                  description: "id of category",
                                  example: 1,
                                },
                                order: {
                                  type: 'number',
                                  description: "order of Ingredients",
                                  example: 1,
                                },
                                status: {
                                  type: 'boolean',
                                  description: "choose Ingredients (true|false)",
                                  example: true,
                                },
                                buyStatus: {
                                  type: 'boolean',
                                  description: "purchased ingredients (true|false)",
                                  example: true,
                                },
                              }
                            }
                          },
                          totalIngredients: {
                            type: 'number',
                            description: 'total of ingredient',
                            example: 5,
                          },
                        }
                      }
                    },
                    status: {
                      type: 'string',
                      description: 'type is "private"|"published" **Default "private"**',
                      example: "private"
                    },
                    totalIngredients: {
                      type: 'number',
                      description: 'total of ingredient',
                      example: 5,
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
        description: "Create shopping list Fail !",
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
