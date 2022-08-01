const {object} = require("sharp/lib/is");
module.exports = {
  get: {
    tags: ['Media series'],
    summary: "get list media series (by User & Admin)",
    operationId: 'GetListPreviewMediaSeries',
    // parameters: [
    //   {
    //     name: 'name',
    //     in: 'query',
    //     description: "Filter name ",
    //     schema: {
    //       type: 'string',
    //       default: '',
    //     }
    //   },
    //   {
    //     name: 'pageNumber',
    //     in: 'query',
    //     description: "page number pagination",
    //     schema: {
    //       type: 'number',
    //       default: 0,
    //     }
    //   },
    //   {
    //     name: 'itemsPerPage',
    //     in: 'query',
    //     description: "items per Page pagination",
    //     schema: {
    //       type: 'number',
    //       default: 10,
    //     }
    //   },],
    responses: {
      '200': {
        description: "Get list media series success",
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: "string",
                  description: "response message",
                  example: "The request was executed successfully"
                },
                code: {
                  type: "string",
                  description: "response code",
                  example: "SUCCESS"
                },
                data: {
                  type: 'array',
                  items: {
                    properties: {
                      _id: {
                        $ref: "#/components/schemas/_id"
                      },
                      name: {
                        type: 'string',
                        description: "name media series",
                        example: 'series test',
                      },
                      description: {
                        type: 'string',
                        description: "description media series",
                        example: 'All prices in AUD. Subscriptions will auto renew at the end of each subscription period.',
                      },
                      medias: {
                        type: "array",
                        description: "list media preview",
                        items: {
                          type: "object",
                          properties:{
                            _id: {
                              type: 'string',
                              description: "id media",
                              example: '61d0a01a633b747ac43a80a7',
                            },
                            type: {
                              type: 'string',
                              description: 'type is "video"|"image"|"audio"',
                              example: "image"
                            },
                            name: {
                              type: 'string',
                              description: 'title media',
                              example: "episode name"
                            },
                            urlFile: {
                              type: 'string',
                              description: 'urlFile value is file when type is image|audio, type is link when urlFile value is video',
                              example: "https://3scoach.vn/wp-content/uploads/2021/06/che-do-an.jpeg"
                            },
                            description: {
                              type: 'string',
                              description: "description media series",
                              example: 'All prices in AUD. Subscriptions will auto renew at the end of each subscription period.',
                            },
                          }
                        }
                      },
                    }
                  }
                }
              }
            },
          },
        },
      },
      '400': {
        description: "Get media series Fail !",
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
  }
}
