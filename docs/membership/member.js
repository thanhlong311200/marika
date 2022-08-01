module.exports = {
  post: {
    tags: ['Membership'],
    summary: "create membership (by Admin)",
    operationId: 'createMembership',
    security: [{
      bearerAuth: []
    }],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: "object",
            required: [
              "type",
              "name",
              "time",
              "price",
            ],
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
                enum: ['hour', 'day', 'week', 'month', "year"]
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
                example: 'Subscriptions will auto renew at the end of each subscription period.',
              },
            }
          }
        },
        'application/json': {
          schema: {
            type: 'object',
            required: [
              "type",
              "name",
              "time",
              "price",
            ],
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
        description: "Create membership ship success",
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
        description: "Create membership Fail !",
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
