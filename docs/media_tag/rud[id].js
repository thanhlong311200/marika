module.exports = {
  put: {
    tags: ['Media tag'],
    summary: "update media tag by id (by Admin)",
    operationId: 'updateMediaTag',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "id of media tag",
      required: true,
      schema: {
        type: 'string',
      }
    }],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: "object",
            properties: {
              name: {
                type: 'string',
                description: "name media tag",
                example: 'tag test',
              },
              categoryId: {
                type: "string",
                description: "Id of category",
                example: "61cc5df3dc50a2ef90b9131a"
              },
              topicId: {
                type: "string",
                description: "Id of topic",
                example: "61cc5df3dc50a2ef90b9131a"
              },
              description: {
                type: 'string',
                description: "description media tag",
                example: 'All prices in AUD. Subscriptions will auto renew at the end of each subscription period.',
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
                description: "name media tag",
                example: 'tag test',
              },
              categoryId: {
                type: "string",
                description: "Id of category",
                example: "61cc5df3dc50a2ef90b9131a"
              },
              topicId: {
                type: "string",
                description: "Id of topic",
                example: "61cc5df3dc50a2ef90b9131a"
              },
              description: {
                type: 'string',
                description: "description media tag",
                example: 'All prices in AUD. Subscriptions will auto renew at the end of each subscription period.',
              },
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: "Update media tag success",
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
                      description: "name media tag",
                      example: 'tag test',
                    },
                    categoryId: {
                      type: "string",
                      description: "Id of category",
                      example: "61cc5df3dc50a2ef90b9131a"
                    },
                    topicId: {
                      type: "string",
                      description: "Id of topic",
                      example: "61cc5df3dc50a2ef90b9131a"
                    },
                    description: {
                      type: 'string',
                      description: "description media tag",
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
        description: "Change media tag Fail !",
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
    tags: ['Media tag'],
    summary: "delete media tag by id (by Admin)",
    operationId: 'deleteMediaTag',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: "id of media tag",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "delete media tag success!",
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Success200"
            }
          }
        },
      },
      '400': {
        description: "Delete media tag Fail !",
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
    },
  },
  get: {
    tags: ['Media tag'],
    summary: "get media tag by id (by User & Admin)",
    operationId: 'GetMediaTag',
    parameters: [
      {
        name: 'id',
        in: 'path',
        description: "id of media tag",
        required: true,
        schema: {
          type: 'string',
        }
      },
    ],
    responses: {
      '200': {
        description: "Get media tag by id success",
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
                      description: "name media tag",
                      example: 'tag test',
                    },
                    categoryId: {
                      type: "string",
                      description: "Id of category",
                      example: "61cc5df3dc50a2ef90b9131a"
                    },
                    topicId: {
                      type: "string",
                      description: "Id of topic",
                      example: "61cc5df3dc50a2ef90b9131a"
                    },
                    description: {
                      type: 'string',
                      description: "description media tag",
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
        description: "Get media tag Fail !",
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
    },
  },
}
