module.exports = {
  get: {
    tags: ['Meal plan'],
    summary: "get list meal plan (by User & Admin)",
    operationId: 'GetListMealPlan',
    parameters: [
      {
        name: 'name',
        in: 'query',
        description: "name of meal plan",
        schema: {
          type: 'string',
        }
      },
      {
        name: 'dietaryId',
        in: 'query',
        description: "id of dietary",
        schema: {
          type: 'string',
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
      },
    ],
    responses: {
      '200': {
        description: "Get list meal plan success",
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
                      name: {
                        type: 'string',
                        description: "name Meal plan",
                        example: 'Meal plan test',
                      },
                      numberOfSnack: {
                        type: 'number',
                        description: "numberOfSnack",
                        example: 2,
                      },
                      dietary: {
                        type: "object",
                        properties: {
                          _id: {
                            type: 'string',
                            description: "id dietary",
                            example: '61d78e8aa0602ce65b848f73',
                          },
                          name: {
                            type: 'string',
                            description: "name dietary",
                            example: 'fiber',
                          },
                          description: {
                            type: 'string',
                            description: "description dietary",
                            example: 'a thread or filament from which a vegetable tissue, mineral substance, or textile is formed.',
                          },
                        }
                      },
                      menuFoods: {
                        type: "array",
                        description: "menu food in meal plan",
                        items: {
                          type: "object",
                          properties: {
                            _id: {
                              $ref: "#/components/schemas/_id"
                            },
                            recipes: {
                              type: "array",
                              description: "recipes in menu food",
                              items: {
                                type: "object",
                                properties: {
                                  _id: {
                                    $ref: "#/components/schemas/_id"
                                  },
                                  name: {
                                    type: 'string',
                                    description: 'name of recipes',
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
                                    description: 'ingredients of recipes',
                                    items: {
                                      type: "object",
                                      properties: {
                                        _id: {
                                          type: "string",
                                          description: "Id of ingredients",
                                          example: "61cc558b87a64b5da0aa9892"
                                        },
                                        name: {
                                          type: "string",
                                          description: "name of ingredients",
                                          example: "egg"
                                        },
                                        unit: {
                                          type: "string",
                                          description: "unit of ingredients",
                                          example: "tsd"
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
                                    description: 'size of recipes',
                                    example: 5,
                                  },
                                  price: {
                                    type: 'number',
                                    description: 'price of recipes',
                                    example: 7.5,
                                  },
                                  status: {
                                    type: 'string',
                                    description: 'status of recipes - default published',
                                    example: "draft"
                                  },
                                  nutritionInformation: {
                                    type: 'array',
                                    description: 'nutrition information of recipes',
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
                                    description: 'method of recipes',
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
                                  thumbnail: {
                                    type: 'string',
                                    description: 'thumbnail of recipes',
                                    example: "https://torange.biz/photo/54/IMAGE/video-templates-youtube-title-thumbnail-background-54866.jpg"
                                  },
                                  description: {
                                    type: 'string',
                                    description: 'description of recipes',
                                    example: "Description of meal from Marika. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco "
                                  },
                                  note: {
                                    type: 'string',
                                    description: 'note of recipes',
                                    example: "The chicken mince can be substituted for any mince you like! \n" +
                                      "To make this recipe vegan, substitute the chicken mince for tofu, tasty cheese for vegan cheese and omit the yogurt to serve."
                                  },
                                  time: {
                                    type: 'string',
                                    description: 'time of recipes',
                                    example: "50 mins"
                                  },
                                  serves: {
                                    type: 'string',
                                    description: 'serves of recipes',
                                    example: 6,
                                  },
                                  isFavorite: {
                                    type: 'boolean',
                                    description: 'isFavorite media',
                                    example: true
                                  },
                                }
                              }
                            },
                          }
                        }
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
        description: "Get meal plan Fail !",
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
