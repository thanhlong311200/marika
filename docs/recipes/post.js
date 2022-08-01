module.exports = {
  post: {
    tags: ['Recipes'],
    summary: "upload recipes (by Admin)",
    operationId: 'uploadRecipes',
    security: [{
      bearerAuth: []
    }],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              "name",
              "mealId",
              "ingredients",
              "price",
              "nutritionInformation",
              "method",
            ],
            properties: {
              name: {
                type: 'string',
                description: 'name of recipes',
                example: "eggs on toast"
              },
              mealId: {
                type: "string",
                description: "Id of meal",
                example: "61cc5ea8dc50a2ef90b9132f"
              },
              tags: {
                type: "array",
                description: 'id of tag',
                items: {
                  type: "string",
                  description: "Id of ingredients",
                  example: "61cc558b87a64b5da0aa9892"
                },
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
                    qty: {
                      type: "number",
                      description: "qty of ingredients",
                      example: 5,
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
                  type: 'string',
                  description: 'id of media',
                  example: "6188b95764f92b00194d47c8"
                }
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
              mediaId: {
                type: 'string',
                description: 'id of media',
                example: "6188b95764f92b00194d47c8"
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
              typeId: {
                type: "string",
                description: "Id of type",
                example: "61cc5a72dc50a2ef90b91302"
              },
              categoryId: {
                type: "string",
                description: "Id of category",
                example: "61cc5df3dc50a2ef90b9131a"
              },
              size: {
                type: 'number',
                description: 'size of recipes',
                example: 5,
              },
            }
          }
        },
      }
    },
    responses: {
      '200': {
        description: "upload recipes success",
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
                      type: "array",
                      description: 'id of tag',
                      items: {
                        type: "string",
                        description: "Id of ingredients",
                        example: "61cc558b87a64b5da0aa9892"
                      },
                    },
                    mealId: {
                      type: "string",
                      description: "Id of meal",
                      example: "61cc5ea8dc50a2ef90b9132f"
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
                          qty: {
                            type: "number",
                            description: "qty of ingredients",
                            example: 5,
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
                        type: 'string',
                        description: 'id of media',
                        example: "6188b95764f92b00194d47c8"
                      }
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
                    mediaId: {
                      type: 'string',
                      description: 'id of media',
                      example: "6188b95764f92b00194d47c8"
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
                    typeId: {
                      type: "string",
                      description: "Id of type",
                      example: "61cc5a72dc50a2ef90b91302"
                    },
                    categoryId: {
                      type: "string",
                      description: "Id of category",
                      example: "61cc5df3dc50a2ef90b9131a"
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
        description: "Upload recipes Fail !",
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
        description: "Invalid fields",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error422"
            }
          }
        },
      }
    },
  },
}
