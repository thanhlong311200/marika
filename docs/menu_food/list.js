module.exports = {
  get: {
    tags: ['Menu food'],
    summary: "get list menu food (by User & Admin)",
    operationId: 'GetListMenuFood',
    parameters: [
      {
        name: 'userId',
        in: 'query',
        description: "Id of user (by Admin). eg: userId=61b70e9cfd84fd885f9fade3",
        example: "",
        schema: {
          type: 'string',
        }
      },
      {
        name: 'recipe',
        in: 'query',
        description: "Id of recipe. eg: recipe=61b70e9cfd84fd885f9fade3",
        example: "",
        schema: {
          type: 'string',
        }
      },
      {
        name: 'isFavorite',
        in: 'query',
        description: "isFavorite of recipe. eg: isFavorite=true",
        schema: {
          type: 'boolean',
          default: true,
          enum: [true, false],
        }
      },
      {
        name: 'swap',
        in: 'query',
        description: "swap is true <=> Eating out. swap is false <=> Leftover",
        schema: {
          type: 'boolean',
          enum: [true, false],
        }
      },
      {
        name: 'start',
        in: 'query',
        description: "Start date filter data format year-month-day",
      },
      {
        name: 'end',
        in: 'query',
        description: "End date filter data format year-month-day",
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
        description: "Get list menu food success",
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
                        type: 'object',
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
                  }
                }
              }
            },
          },
        },
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
  }
}
