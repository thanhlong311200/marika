module.exports = {
  put: {
    tags: ['YourOwn'],
    summary: "update YourOwn by id (by User)",
    operationId: 'updateYourOwn',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "yourOwnId",
      required: true,
      schema: {
        type: 'string',
      }
    }],
    security: [{
      bearerAuth: []
    }],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: "object",
            properties: {
              // menu: {
              //   type: 'array',
              //   description: "menu Your Own",
              //   example: ["option1", "option2", "option3"],
              // },
              food: {
                type: 'string',
                description: "food Your Own",
                example: 'Cook',
              },
              hub: {
                type: 'string',
                description: "hub Your Own",
                example: 'hub...',
              },
              mind: {
                type: 'string',
                description: "Mind Your Own",
                example: 'mind...',
              },
              stress: {
                type: 'string',
                description: "Stress Your Own",
                example: 'happy',
              }
            }
          }
        },
        'application/json': {
          schema: {
            type: "object",
            properties: {
              // menu: {
              //   type: 'array',
              //   description: "menu Your Own",
              //   example: ["option1", "option2", "option3"],
              // },
              food: {
                type: 'string',
                description: "food Your Own",
                example: 'Cook',
              },
              hub: {
                type: 'string',
                description: "hub Your Own",
                example: 'hub...',
              },
              mind: {
                type: 'string',
                description: "Mind Your Own",
                example: 'mind...',
              },
              stress: {
                type: 'string',
                description: "Stress Your Own",
                example: 'happy',
              }
            }
          }
        },
      }
    },
    responses: {
      '200': {
        description: "Update YourOwn success",
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
                // menu: {
                //   type: 'array',
                //   description: "menu Your Own",
                //   example: ["option1", "option2", "option3"],
                // },
                data: {
                  type: 'object',
                  properties: {
                    food: {
                      type: 'string',
                      description: "food Your Own",
                      example: 'Cook',
                    },
                    hub: {
                      type: 'string',
                      description: "hub Your Own",
                      example: 'hub...',
                    },
                    mind: {
                      type: 'string',
                      description: "Mind Your Own",
                      example: 'mind...',
                    },
                    stress: {
                      type: 'string',
                      description: "Stress Your Own",
                      example: 'happy',
                    }
                  }
                }
              }
            }
          }
        },
      },
      '400': {
        description: "Change  YourOwn Fail !",
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
    tags: ['YourOwn'],
    summary: "delete YourOwn by id (by User)",
    operationId: 'deleteYourOwn',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "yourOwnId",
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
        description: "delete  YourOwn success !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Success200"
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
      '404': {
        description: "Delete YourOwn Fail !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error404"
            }
          }
        },
      },
      '400': {
        description: "Delete YourOwn Fail !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error400"
            }
          }
        },
      },
    }
  },
  get: {
    tags: ['YourOwn'],
    summary: "get YourOwn By Id (by User)",
    operationId: 'getYourOwnById',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "yourOwnId",
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
        description: "Get YourOwn by id success",
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
                  properties:{
                    // menu: {
                    //   type: 'array',
                    //   description: "menu Your Own",
                    //   example: ["option1", "option2", "option3"],
                    // },
                    food: {
                      type: 'string',
                      description: "food Your Own",
                      example: 'Cook',
                    },
                    hub: {
                      type: 'string',
                      description: "hub Your Own",
                      example: 'hub...',
                    },
                    mind: {
                      type: 'string',
                      description: "Mind Your Own",
                      example: 'mind...',
                    },
                    stress: {
                      type: 'string',
                      description: "Stress Your Own",
                      example: 'happy',
                    },
                    _id: {
                      type: 'string',
                      description: "value field",
                      example: 'id track',
                    },
                  }
                }
              }
            }
          }
        }
      },
      '400': {
        description: "Get YourOwn Fail !",
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
    },
  },
}
