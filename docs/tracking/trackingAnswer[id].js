module.exports = {
  put: {
    tags: ['Tracking Answer'],
    summary: "update Tracking Answer by id (by User)",
    operationId: 'UpdateTrackingAnswer',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "Id Tracking Answer",
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
              answer: {
                type: 'number',
                description: "answer",
                example: 0,
              },
            }
          }
        },
        'application/json': {
          schema: {
            type: "object",
            properties: {
              answer: {
                type: 'number',
                description: "answer",
                example: 0,
              },
            }
          }
        },
      }
    },
    responses: {
      '200': {
        description: "Update Tracking Answer success",
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
        description: "Change  Tracking Answer Fail !",
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
    tags: ['Tracking Answer'],
    summary: "delete Tracking Answer by id (by User)",
    operationId: 'DeleteTrackingAnswer',
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
        description: "delete Tracking Answer success !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Success200"
            }
          }
        },
      },
      '404': {
        description: "Delete Tracking Answer Fail !",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error404"
            }
          }
        },
      },
      '400': {
        description: "Delete Tracking Answer Fail !",
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
    tags: ['Tracking Answer'],
    summary: "get Tracking Answer By Id (by User)",
    operationId: 'GetTrackingAnswerById',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "Tracking Answer Id",
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
        description: "Get Tracking Answer by id success",
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
