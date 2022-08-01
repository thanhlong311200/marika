module.exports = {
  get: {
    tags: ['Shopping list'],
    summary: "get All shopping list (Admin)",
    operationId: 'GetAllShoppingList',
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
        description: "Get list shopping list success",
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
                    type: "object",
                    properties: {
                      _id: {
                        $ref: "#/components/schemas/_id"
                      },
                      totalIngredients: {
                        type: 'number',
                        description: 'total of ingredient',
                        example: 5,
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
                            meal: {
                              type: "object",
                              properties: {
                                _id: {
                                  type: 'string',
                                  description: "id of meal",
                                  example: '61ce8b4a9514337011cce750',
                                },
                                name: {
                                  type: 'string',
                                  description: "name recipes meal",
                                  example: 'breakfast',
                                },
                                description: {
                                  type: 'string',
                                  description: "description recipes meal",
                                  example: 'Breakfast, served between 6am and 10am',
                                },
                              }
                            },
                            ingredients: {
                              type: "array",
                              description: "ingredients in shopping list",
                              items: {
                                type: "object",
                                properties: {
                                  _id: {
                                    type: 'string',
                                    description: "id Ingredients",
                                    example: '61ce8b4a9514337011cce750',
                                  },
                                  name: {
                                    type: 'string',
                                    description: "name Ingredients",
                                    example: 'Ingredients A',
                                  },
                                  unit: {
                                    type: 'string',
                                    description: "unit Ingredients",
                                    example: 'tsd',
                                  },
                                  category: {
                                    type: 'object',
                                    properties: {
                                      _id: {
                                        type: 'string',
                                        description: "Id ingredients category",
                                        example: '61ccc573e1baed4bb9512d1a',
                                      },
                                      name: {
                                        type: 'string',
                                        description: "name ingredients category",
                                        example: 'category test',
                                      },
                                      description: {
                                        type: 'string',
                                        description: "description ingredients category",
                                        example: 'All prices in AUD. Subscriptions will auto renew at the end of each subscription period.',
                                      },
                                    }
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
                    }
                  }
                }
              }
            },
          },
        },
      },
      '400': {
        description: "Get shopping list Fail !",
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
