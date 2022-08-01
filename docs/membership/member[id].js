module.exports = {
  put: {
    tags: ['Membership'],
    summary: "update membership by id (by Admin)",
    operationId: 'updateMembership',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "membershipId you want to update, id: 61cb374eba7d0a061825551f",
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
              name: {
                type: 'string',
                description: "name membership",
                example: '6 months',
              },
              amountOfSaving: {
                type: 'number',
                description: "amount Of Saving",
                example: 10,
              },
              // type: {
              //   type: 'string',
              //   description: "type membership",
              //   example: 'month',
              // },
              // time: {
              //   type: 'number',
              //   description: "time membership",
              //   example: 6,
              // },
              // price: {
              //   type: 'number',
              //   description: "name membership",
              //   example: 5.25,
              // },
              description: {
                type: 'string',
                description: "description membership",
                example: 'Subscriptions will auto renew at the end of each subscription period.',
              },
            }
          }
        },
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: "name membership",
                example: '6 months',
              },
              type: {
                type: 'string',
                description: "type membership",
                example: 'month',
              },
              time: {
                type: 'number',
                description: "time membership",
                example: 6,
              },
              price: {
                type: 'number',
                description: "name membership",
                example: 100,
              },
              amountOfSaving: {
                type: 'number',
                description: "amount Of Saving",
                example: 10,
              },
              description: {
                type: 'string',
                description: "description membership",
                example: 'All prices in AUD. Subscriptions will auto renew at the end of each subscription period.',
              },
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: "Update membership success",
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
                    _id: {
                      $ref: "#/components/schemas/_id"
                    },
                    name: {
                      type: 'string',
                      description: "name membership",
                      example: '6 months',
                    },
                    type: {
                      type: 'string',
                      description: "type membership",
                      example: 'month',
                    },
                    time: {
                      type: 'number',
                      description: "time membership",
                      example: 6,
                    },
                    price: {
                      type: 'number',
                      description: "name membership",
                      example: 5.25,
                    },
                    description: {
                      type: 'string',
                      description: "description membership",
                      example: 'All prices in AUD. Subscriptions will auto renew at the end of each subscription period.',
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
        description: "Change membership Fail !",
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
    tags: ['Membership'],
    summary: "Delete membership by id (by Admin)",
    operationId: 'deleteMembership',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: "the membership id you want to delete, id: 61cb374eba7d0a061825551f",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "delete membership success!",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Success200"
            }
          }
        },
      },
      '400': {
        description: "Delete membership Fail !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error400"
            }
          }
        },
      },
      '401': {
        description: "Delete membership Fail!",
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
    tags: ['Membership'],
    summary: "get membership by id (by all people)",
    operationId: 'GetMembership',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: "the membership id you want to get, id: 61cb374eba7d0a061825551f",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "Get membership by id success",
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
                    _id: {
                      $ref: "#/components/schemas/_id"
                    },
                    name: {
                      type: 'string',
                      description: "name membership",
                      example: '6 months',
                    },
                    type: {
                      type: 'string',
                      description: "type membership",
                      example: 'month',
                    },
                    time: {
                      type: 'number',
                      description: "time membership",
                      example: 6,
                    },
                    price: {
                      type: 'number',
                      description: "name membership",
                      example: 5.25,
                    },
                    description: {
                      type: 'string',
                      description: "description membership",
                      example: 'All prices in AUD. Subscriptions will auto renew at the end of each subscription period.',
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
        description: "Get membership Fail !",
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
}
