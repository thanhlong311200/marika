module.exports = {
  get: {
    tags: ['Media'],
    summary: "get a media by id (by User & Admin)",
    operationId: 'Getmedia',
    parameters: [{
      name: 'id',
      in: 'path',
      description: "mediaId you want to get, id: 61b70e9cfd84fd885f9fade3",
      required: true,
      schema: {
        type: 'string',
      }
    }],
    responses: {
      '200': {
        description: "get media success",
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
                  type: "object",
                  properties: {
                    _id: {
                      $ref: "#/components/schemas/_id"
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
                    status: {
                      type: 'string',
                      description: 'type is "draft"|"published"',
                      example: "published"
                    },
                    categoryId: {
                      $ref: "#/components/schemas/_id",
                    },
                    topicId: {
                      $ref: "#/components/schemas/_id",
                    },
                    urlFile: {
                      type: 'string',
                      description: 'urlFile value is file when type is image|audio, type is link when urlFile value is video',
                      example: "https://3scoach.vn/wp-content/uploads/2021/06/che-do-an.jpeg"
                    },
                    mp4Link: {
                      type: 'string',
                      description: 'mp4Link is uri http',
                      example: "https://player.vimeo.com/progressive_redirect/playback/650964508/rendition/1080p"
                    },
                    tagIds: {
                      type: "array",
                      description: "list Id of tag",
                      items: {
                        type: 'string',
                        description: 'id of tag',
                        example: "61cc5df3dc50a2ef90b9131a"
                      },
                    },
                    seriesId: {
                      type: "string",
                      description: "Id of series",
                      example: "61cc5df3dc50a2ef90b9131a"
                    },
                    episode: {
                      type: "number",
                      description: "episode number of series",
                      example: 1
                    },
                    subtype: {
                      type: 'string',
                      description: 'type is "full"|"trailer"|"bonus"',
                      example: "trailer"
                    },
                    thumbnail: {
                      type: 'string',
                      description: 'thumbnail media',
                      example: "https://3scoach.vn/wp-content/uploads/2021/06/che-do-an.jpeg"
                    },
                    thumbnailMobile: {
                      type: 'string',
                      description: 'thumbnail Mobile',
                      example: "https://3scoach.vn/wp-content/uploads/2021/06/che-do-an.jpeg"
                    },
                    description: {
                      type: 'string',
                      description: 'description media',
                      example: "Lead statement. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
                    },
                    detailInfo: {
                      type: 'string',
                      description: 'detailInfo media',
                      example: "Lead statement. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
                    },
                    isFavorite: {
                      type: 'boolean',
                      description: 'isFavorite media',
                      example: true
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
        description: `Media not found`,
        content: {
          'application/json': {
            schema: {
              $ref: "#/components/schemas/Error400"
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
      }
    }
  }
}
