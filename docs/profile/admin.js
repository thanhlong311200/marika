module.exports = {
  get: {
    tags: ['Profile'],
    summary: "get profile information by id (by Admin)",
    operationId: 'getProfileById',
    parameters: [{
      name: 'userId',
      in: 'path',
      description: "Id of the user who wants to get the profile",
      required: true,
      schema: {
        type: 'string',
      }
    }],
    responses: {
      '200': {
        description: "Read profile success",
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
                    email: {
                      type: 'string',
                      description: "Email of user",
                      example: "name@gamil.com"
                    },
                    name: {
                      type: 'string',
                      description: "Name of user",
                      example: "Jone"
                    },
                    nickname: {
                      type: 'string',
                      description: "nickname of user",
                      example: "Biet Danh"
                    },
                    phone: {
                      type: 'string',
                      description: "Phone of user",
                      example: "0987654321"
                    },
                    birthday: {
                      type: 'string',
                      description: "birthday of user",
                      example: "10/10/2021"
                    },
                    address: {
                      type: 'string',
                      description: "address of user",
                      example: "4 Defu Ave 1, Singapore"
                    },
                    city: {
                      type: 'string',
                      description: "city of user",
                      example: "Singapore",
                    },
                    postcode: {
                      type: 'string',
                      description: "postcode",
                      example: "539536",
                    },
                    state: {
                      type: 'string',
                      description: "state",
                      example: "VIC",
                    },
                    sex: {
                      type: 'string',
                      description: "sex",
                      example: "male",
                    },
                    customField: {
                      type: 'array',
                      description: "custom field",
                      items: {
                        type: "object",
                        properties: {
                          field: {
                            type: 'string',
                            description: "name field",
                            example: "favorite",
                          },
                          value: {
                            type: 'string',
                            description: "value field",
                            example: "music",
                          }
                        }
                      },
                    },
                    myProgram: {
                      type: 'number',
                      description: "0 is 'create my own', 1 is 'fuelled menu'",
                      example: 1,
                    },
                    mealPlan: {
                      type: "string",
                      description: "name of mealPlan",
                      example: "Healthy"
                    },
                    dietary: {
                      type: "string",
                      description: "Id of dietary",
                      example: "61ccb63096d0afe3106a03ef"
                    },
                    showNutritional: {
                      type: 'number',
                      description: "0 is unselect, 1 is selected",
                      example: 1,
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
        description: "Read profile Fail !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error400"
            }
          }
        },
      },
    },
  },
  delete: {
    tags: ['Profile'],
    summary: "delete profile information by id (by Admin)",
    operationId: 'deleteProfileById',
    parameters: [{
      name: 'userId',
      in: 'path',
      description: "Id of the user who wants to delete the profile",
      required: true,
      schema: {
        type: 'string',
      }
    }],
    security: [{
      bearerAuth: []
    }],
    responses: {
      '200': {
        description: "delete profile success !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Success200"
            }
          }
        },
      },
      '400': {
        description: "delete profile Fail !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error400"
            }
          }
        },
      },
      '401': {
        description: "delete user Fail !",
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
