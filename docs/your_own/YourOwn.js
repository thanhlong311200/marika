module.exports = {
  post: {
    tags: ['YourOwn'],
    summary: "create YourOwn (by User)",
    operationId: 'createYourOwn',
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
              //   example: ["option1","option2", "option3"],
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
              //   example: ["option1","option2", "option3"],
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
        description: "Create YourOwn success",
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
                  properties: {
                    userId: {
                      type: 'string',
                      description: "userId Your Own",
                      example: '61c3692db43e7b19',
                    },
                    // menu: {
                    //
                    //   type: 'array',
                    //   description: "menu Your Own",
                    //   example: ["option1","option2", "option3"],
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
              }
            }
          }
        }
      },
      '400': {
        description: "Create YourOwn Fail !",
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
  get: {
    tags: ['YourOwn'],
    summary: "user get list YourOwn (by User)",
    operationId: 'getYourOwn',
    parameters: [
      {
        name: 'options',
        in: 'query',
        description: "Filter options query",
        schema: {
          type: 'string',
          default: '',
          enum: ['food', 'hub', 'mind', 'stress']
        }
      },
      {
        name: 'filter',
        in: 'query',
        description: "Filter text query",
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
        description: "Get YourOwn success",
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
                    type: 'object',
                    properties: {
                      menu: {
                        type: 'array',
                        description: "menu Your Own",
                        example: ["option1", "option2", "option3"],
                      },
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
        }
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
