const moment = require("moment");
module.exports = {
  post: {
    tags: ['Tracking Answer'],
    summary: "create Tracking Answer (by User)",
    operationId: 'CreateTrackingAnswer',
    security: [{
      bearerAuth: []
    }],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: "object",
            properties: {
              topicId: {
                type: 'string',
                description: "topic id",
                example: "61c9dc10181bee674562a0c6",
              },
              answer: {
                type: 'number',
                description: "answer",
                example: 1,
              },
              date: {
                type: 'string',
                description: "date create answer",
                example: moment().format("YYYY-MM-DD hh:mm:ss"),
              },
            }
          }
        },
        'application/json': {
          schema: {
            type: "object",
            properties: {
              topicId: {
                type: 'string',
                description: "topic id",
                example: "61c9dc10181bee674562a0c6",
              },
              answer: {
                type: 'number',
                description: "answer",
                example: 1,
              },
              date: {
                type: 'string',
                description: "date create answer",
                example: moment().format("YYYY-MM-DD hh:mm:ss"),
              },
            }
          }
        },
      }
    },
    responses: {
      '200': {
        description: "Create Tracking Answer success",
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
                      type: 'string',
                      description: "topic _id",
                      example: "61c9dc10181bee674562a0c6",
                    },
                    userId: {
                      type: 'string',
                      description: "userId",
                      example: "61c9dc10181bee674562a0c6",
                    },
                    topicId: {
                      type: 'string',
                      description: "topic id",
                      example: "61c9dc10181bee674562a0c6",
                    },
                    answer: {
                      type: 'number',
                      description: "answer",
                      example: 0,
                    },
                    createdAt: {
                      type: 'string',
                      description: "createdAt",
                      example: "2021-12-28T10:05:45.234Z",
                    },
                    updatedAt: {
                      type: 'string',
                      description: "updatedAt",
                      example: "2021-12-28T10:05:45.235Z",
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
        description: "Create Tracking Answer Fail !",
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
    tags: ['Tracking Answer'],
    summary: "get Tracking Answer By Id (by User)",
    operationId: 'GetTrackingAnswer',
    parameters: [
      {
        name: 'start',
        in: 'query',
        option: true,
        description: " filter answer in range start => end",
        default: '2021-12-23'
      },
      {
        name: 'end',
        in: 'query',
        description: " filter answer in range start => end",
        default: '2022-01-03'
      },
      {
        name: 'topicId',
        in: 'query',
        description: " filter answer of topic Id",
        default: '61cca432c61fed714268f2e4'
      },
      {
        name: 'answer',
        in: 'query',
        description: " filter query answer",
        default: 1
      },
    ],
    responses: {
      '200': {
        description: "Get Tracking Answer success",
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
                      _id: {
                        type: 'string',
                        description: "topic _id",
                        example: "61c9dc10181bee674562a0c6",
                      },
                      userId: {
                        type: 'string',
                        description: "userId",
                        example: "61c9dc10181bee674562a0c6",
                      },
                      topicId: {
                        type: 'string',
                        description: "topic id",
                        example: "61c9dc10181bee674562a0c6",
                      },
                      answer: {
                        type: 'number',
                        description: "answer",
                        example: 0,
                      },
                      createdAt: {
                        type: 'string',
                        description: "createdAt",
                        example: "2021-12-28T10:05:45.234Z",
                      },
                      updatedAt: {
                        type: 'string',
                        description: "updatedAt",
                        example: "2021-12-28T10:05:45.235Z",
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
        description: "Get Tracking Answer Fail !",
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
