module.exports = {
  post: {
    tags: ['Shopping list'],
    summary: "create or update shopping list (by user)",
    operationId: 'createShoppingList',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              "data",
            ],
            properties: {
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
                          displayQty: {
                            type: 'string',
                            description: "Display Qty of Ingredients",
                            example: '1 1/2',
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
                                displayQty: {
                                  type: 'string',
                                  description: "Display Qty of Ingredients",
                                  example: '1 1/2',
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
  delete: {
    tags: ['Shopping list'],
    summary: "delete shopping list by id (by User and Admin)",
    operationId: 'deleteShoppingList',
    parameters: [
      {
        name: 'id',
        in: 'query',
        description: "id of shopping list **(user is not required)**",
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "delete shopping list success!",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Success200"
            }
          }
        },
      },
      '400': {
        description: "Delete shopping list Fail !",
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
  },
  get: {
    tags: ['Shopping list'],
    summary: "get shopping list by id (all personal)",
    operationId: 'GetShoppingList',
    parameters: [
      {
        name: 'id',
        in: 'query',
        description: "id of shopping list **(user is not required)**",
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "Get shopping list by id success",
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
  },
}
