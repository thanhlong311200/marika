module.exports = {
  put: {
    tags: ['Menu food'],
    summary: "update menu food by id (by User)",
    operationId: 'updateMenuFood',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "id of menu food",
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
              }
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: "Update menu food success",
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
                    mealId: {
                      type: "string",
                      description: "mealId in menu food",
                      example: '61d8814894e14f1683bf612b',
                    },
                    recipe: {
                      type: "string",
                      description: "recipe in menu food",
                      example: '61ccc573e1baed4bb9512d1a',
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
        description: "Change menu food Fail !",
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
    tags: ['Menu food'],
    summary: "delete menu food by id (by User)",
    operationId: 'deleteMenuFood',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: "id of menu food",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "delete menu food success!",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Success200"
            }
          }
        },
      },
      '400': {
        description: "Delete menu food Fail !",
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
    tags: ['Menu food'],
    summary: "get menu food by id (by all people)",
    operationId: 'GetMenuFood',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: "id of menu food",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "Get menu food by id success",
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
                      type: "object",
                      description: "recipe in menu food",
                      properties: {
                        name: {
                          type: 'string',
                          description: 'name of recipe',
                          example: "eggs on toast"
                        },
                        typeId: {
                          type: "string",
                          description: "Id of type",
                          example: "61cc5a72dc50a2ef90b91302"
                        },
                        mealId: {
                          type: "string",
                          description: "Id of meal",
                          example: "61cc5ea8dc50a2ef90b9132f"
                        },
                        dietaryId: {
                          type: "string",
                          description: "Id of dietary",
                          example: "61ccb63096d0afe3106a03ef"
                        },
                        categoryId: {
                          type: "string",
                          description: "Id of category",
                          example: "61cc5df3dc50a2ef90b9131a"
                        },
                        ingredients: {
                          type: "array",
                          description: 'ingredients of recipe',
                          items: {
                            type: "object",
                            properties: {
                              _id: {
                                type: "string",
                                description: "Id of ingredients",
                                example: "61cc558b87a64b5da0aa9892"
                              },
                              qty: {
                                type: "number",
                                description: "qty of ingredients",
                                example: 5,
                              },
                            }
                          },
                        },
                        size: {
                          type: 'number',
                          description: 'size of recipe',
                          example: 5,
                        },
                        price: {
                          type: 'number',
                          description: 'price of recipe',
                          example: 7.5,
                        },
                        status: {
                          type: 'string',
                          description: 'status of recipe - default published',
                          example: "draft"
                        },
                        nutritionInformation: {
                          type: 'array',
                          description: 'nutrition information of recipe',
                          items: {
                            type: 'object',
                            properties: {
                              field: {
                                type: 'string',
                                description: "field of object item in nutrition information",
                                example: "calories",
                              },
                              value: {
                                type: 'string',
                                description: "value of object item in nutrition information",
                                example: "352",
                              },
                            }
                          },
                        },
                        method: {
                          type: 'array',
                          description: 'method of recipe',
                          items: {
                            type: 'object',
                            properties: {
                              step: {
                                type: 'number',
                                description: "field of object item in method",
                                example: 1,
                              },
                              content: {
                                type: 'string',
                                description: "content of object item in method",
                                example: "Preheat the oven to 180’C.",
                              },
                            }
                          },
                        },
                        mediaId: {
                          type: 'string',
                          description: 'id of media',
                          example: "6188b95764f92b00194d47c8"
                        },
                        description: {
                          type: 'string',
                          description: 'description of recipe',
                          example: "Description of meal from Marika. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco "
                        },
                        note: {
                          type: 'string',
                          description: 'note of recipe',
                          example: "The chicken mince can be substituted for any mince you like! \n" +
                            "To make this recipe vegan, substitute the chicken mince for tofu, tasty cheese for vegan cheese and omit the yogurt to serve."
                        },
                        time: {
                          type: 'string',
                          description: 'time of recipe',
                          example: "50 mins"
                        },
                        serves: {
                          type: 'string',
                          description: 'serves of recipe',
                          example: 6,
                        },
                      }
                    },
                    meal: {
                      type: "object",
                      properties: {
                        _id: {
                          $ref: "#/components/schemas/_id"
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
                    thumbnail: {
                      type: 'string',
                      description: 'thumbnail menu food',
                      example: "https://3scoach.vn/wp-content/uploads/2021/06/che-do-an.jpeg"
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
        description: "Get menu food Fail !",
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
