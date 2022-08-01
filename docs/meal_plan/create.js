module.exports = {
  post: {
    tags: ['Meal plan'],
    summary: "create meal plan (by Admin)",
    operationId: 'createMealPlan',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              "name",
              "dietaryId",
              "menuFood",
            ],
            properties: {
              name: {
                type: 'string',
                description: "name Meal plan",
                example: 'Meal plan test',
              },
              dietaryId: {
                type: 'string',
                description: "id dietary",
                example: '61d78e8aa0602ce65b848f73',
              },
              // numberOfSnack: {
              //   type: 'number',
              //   description: "numberOfSnack",
              //   example: 2,
              // },
              menuFood: {
                type: "array",
                description: "menu food in meal plan",
                items: {
                  type: 'string',
                  description: "Id of menu food",
                  example: '61d7d9b35785554f515373ba',
                }
              },
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: "Create meal plan success",
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
                    name: {
                      type: 'string',
                      description: "name Meal plan",
                      example: 'Meal plan test',
                    },
                    dietaryId: {
                      type: 'string',
                      description: "id dietary",
                      example: '61d78e8aa0602ce65b848f73',
                    },
                    numberOfSnack: {
                      type: 'number',
                      description: "numberOfSnack",
                      example: 2,
                    },
                    menuFood: {
                      type: "array",
                      description: "menu food in meal plan",
                      items: {
                        type: 'string',
                        description: "Id of menu food",
                        example: '61d7d9b35785554f515373ba',
                      }
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
        description: "Create meal plan Fail !",
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
