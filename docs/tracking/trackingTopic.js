module.exports = {
  post: {
    tags: ['Tracking Topic'],
    summary: "create Tracking Topic (by Admin)",
    operationId: 'CreateTrackingTopic',
    security: [{
      bearerAuth: []
    }],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: "object",
            properties: {
              name: {
                type: 'string',
                description: "name topic",
                example: "energy level",
              },
              type: {
                type: 'string',
                description: "type topic",
                enum: ["radio", "input", "checkbox"],
                default: 'radio',
              },
              question: {
                type: "string",
                example: "How do you feel?"
              },
              options: {
                type: "array",
                example: [
                  {
                    "index": 1,
                    "value": "struggling"
                  },
                  {
                    "index": 2,
                    "value": "not great"
                  },
                  {
                    "index": 3,
                    "value": "feeling okay"
                  },
                  {
                    "index": 4,
                    "value": "somewhat relaxed"
                  },
                  {
                    "index": 5,
                    "value": "feeling great"
                  },
                ]
              },
              description: {
                type: 'string',
                description: "description topic",
                example: "Add energy level"
              }
            }
          }
        },
      }
    },
    responses: {
      '200': {
        description: "Create Tracking Topic success",
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
                    index: {
                      type: 'string',
                      description: "Index for topic",
                      example: "1",
                    },
                    name: {
                      type: 'string',
                      description: "name topic",
                      example: "energy level",
                    },
                    type: {
                      type: 'string',
                      description: "type topic",
                      example: "radio",
                    },
                    question: {
                      type: "string",
                      example: "How do you feel?"
                    },
                    options: {
                      type: "array",
                      example: [
                        {
                          "index": 1,
                          "value": "struggling"
                        },
                        {
                          "index": 2,
                          "value": "not great"
                        },
                        {
                          "index": 3,
                          "value": "feeling okay"
                        },
                        {
                          "index": 4,
                          "value": "somewhat relaxed"
                        },
                        {
                          "index": 5,
                          "value": "feeling great"
                        },
                      ]
                    },
                    description: {
                      type: 'string',
                      description: "description topic",
                      example: "Add energy level"
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
        description: "Create Tracking Topic Fail !",
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
    tags: ['Tracking Topic'],
    summary: "get list Tracking Topic (by User & Admin)",
    operationId: 'GetTrackingTopic',
    parameters: [
      {
        name: 'answerToday',
        in: 'query',
        description: "Tracking today data topic get answer",
        schema: {
          type: 'boolean',
          default: false,
          enum: [true, false]
        }
      },
    ],
    responses: {
      '200': {
        description: "Get Tracking Topic success",
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
                      index: {
                        type: 'string',
                        description: "Index for topic",
                        example: "1",
                      },
                      name: {
                        type: 'string',
                        description: "name topic",
                        example: "energy level",
                      },
                      type: {
                        type: 'string',
                        description: "type topic",
                        example: "radio",
                      },
                      question: {
                        type: "string",
                        example: "How do you feel?"
                      },
                      options: {
                        type: "array",
                        example: [
                          {
                            "index": 1,
                            "value": "struggling"
                          },
                          {
                            "index": 2,
                            "value": "not great"
                          },
                          {
                            "index": 3,
                            "value": "feeling okay"
                          },
                          {
                            "index": 4,
                            "value": "somewhat relaxed"
                          },
                          {
                            "index": 5,
                            "value": "feeling great"
                          },
                        ]
                      },
                      description: {
                        type: 'string',
                        description: "description topic",
                        example: "Add energy level"
                      }
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
        description: "Get Tracking Topic Fail !",
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
