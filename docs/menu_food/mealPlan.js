module.exports = {
  post: {
    tags: ['Menu food'],
    summary: "Upload menu food for meal plan (by user)",
    operationId: 'UploadMenuFoodForMealPlan',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              "mealPlanId",
            ],
            properties: {
              mealPlanId: {
                type: "string",
                description: "id of meal plan",
                example: '61ccc573e1baed4bb9512d1a',
              },
              startDate: {
                type: 'date',
                description: "start date of menu food. if there is no startDate field then startDate equal date now !",
                example: '2022-01-15',
              },
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
                  type: 'array',
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
                        description: "swap is always equal false",
                        example: false,
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
                      },
                    }
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
