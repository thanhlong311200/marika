module.exports = {
  put: {
    tags: ['Tracking Topic'],
    summary: "update Tracking Topic by id (by Admin)",
    operationId: 'UpdateTrackingTopic',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "Id tracking topic",
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
                  }
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
        description: "Update Tracking success",
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
        description: "Change  Tracking Fail !",
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
    tags: ['Tracking Topic'],
    summary: "delete Tracking Topic by id (by Admin)",
    operationId: 'DeleteTrackingTopic',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "trackingId",
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
        description: "delete  Tracking success !",
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
        description: "Delete Tracking Fail !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error404"
            }
          }
        },
      },
      '400': {
        description: "Delete Tracking Fail !",
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
}
