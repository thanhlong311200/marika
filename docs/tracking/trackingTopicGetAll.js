module.exports = {
  get: {
    tags: ['Tracking Topic'],
    summary: "get List Tracking Topic (by User)",
    operationId: 'GetTrackingTopic',
    security: [{
      bearerAuth: []
    }],
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
