module.exports = {
  get: {
    tags: ['Recipes'],
    summary: "Get recipes by id (by User & Admin)",
    operationId: 'GetRecipes',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "Id of recipes",
      required: true,
      schema: {
        type: 'string',
      }
    }],
    responses: {
      '200': {
        description: "get recipes success",
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
                    name: {
                      type: 'string',
                      description: 'name of recipes',
                      example: "eggs on toast"
                    },
                    tags: {
                      type: "object",
                      properties: {
                        _id: {
                          $ref: "#/components/schemas/_id"
                        },
                        name: {
                          type: 'string',
                          description: "name recipes tags ",
                          example: 'tags test',
                        },
                        description: {
                          type: 'string',
                          description: "description recipes tags ",
                          example: 'All prices in AUD. Subscriptions will auto renew at the end of each subscription period.',
                        },
                      }
                    },
                    meal: {
                      type: "object",
                      properties: {
                        _id: {
                          type: "string",
                          description: "Id of meal",
                          example: "61cc5ea8dc50a2ef90b9132f",
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
                      description: 'ingredients of recipes',
                      items: {
                        type: "object",
                        properties: {
                          _id: {
                            $ref: "#/components/schemas/_id"
                          },
                          name: {
                            type: 'string',
                            description: "name Ingredients",
                            example: 'extra virgin olive oil',
                          },
                          category: {
                            type: "object",
                            description: "category ingredients",
                            properties: {
                              _id: {
                                type: "string",
                                description: "Id of category",
                                example: "61cc5df3dc50a2ef90b9131a",
                              },
                              name: {
                                type: 'string',
                                description: "name category",
                                example: 'category test',
                              },
                              description: {
                                type: 'string',
                                description: "description category",
                                example: 'All prices in AUD. Subscriptions will auto renew at the end of each subscription period.',
                              },
                            }
                          },
                          unit: {
                            type: 'string',
                            description: "unit of ingredients",
                            example: 'tsd',
                          },
                        }
                      },
                    },
                    price: {
                      type: 'number',
                      description: 'price of recipes',
                      example: 7.5,
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
                    status: {
                      type: 'string',
                      description: 'status of recipes - default published',
                      example: "draft"
                    },
                    dietary: {
                      type: "array",
                      description: "dietary of recipes",
                      items: {
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
                    media: {
                      type: "object",
                      properties: {
                        _id: {
                          type: 'string',
                          description: 'id of media',
                          example: "6188b95764f92b00194d47c8",
                        },
                        type: {
                          type: 'string',
                          description: 'type is image',
                          example: "image"
                        },
                        name: {
                          type: 'string',
                          description: 'title media',
                          example: "image name"
                        },
                        status: {
                          type: 'string',
                          description: 'type is "draft"|"published"',
                          example: "published"
                        },
                        urlFile: {
                          type: 'string',
                          description: 'urlFile value is file when type is image|audio, type is link when urlFile value is video',
                          example: "https://3scoach.vn/wp-content/uploads/2021/06/che-do-an.jpeg"
                        },
                        thumbnail: {
                          type: 'string',
                          description: 'thumbnail media',
                          example: "https://3scoach.vn/wp-content/uploads/2021/06/che-do-an.jpeg"
                        },
                      }
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
                    type: {
                      type: "object",
                      properties: {
                        _id: {
                          type: "string",
                          description: "Id of type",
                          example: "61cc5a72dc50a2ef90b91302",
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
                    category: {
                      type: "object",
                      properties: {
                        _id: {
                          type: "string",
                          description: "Id of category",
                          example: "61cc5df3dc50a2ef90b9131a",
                        },
                        name: {
                          type: 'string',
                          description: "name recipes category",
                          example: 'category test',
                        },
                        description: {
                          type: 'string',
                          description: "description recipes category",
                          example: 'All prices in AUD. Subscriptions will auto renew at the end of each subscription period.',
                        },
                      }
                    },
                    size: {
                      type: 'number',
                      description: 'size of recipes',
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
        description: `recipes not found`,
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
    }
  }
}
