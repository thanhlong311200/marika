module.exports = {
  post: {
    tags: ["Favorite"],
    summary: "create favorite (by User)",
    operationId: "createFavorite",
    security: [
      {
        bearerAuth: [],
      },
    ],
    requestBody: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            required: ["type", "itemId"],
            properties: {
              type: {
                type: "string",
                description:
                  "type of favorite, type is menu or recipe or media",
                example: "media",
              },
              itemId: {
                type: "string",
                description: "object item id of favorite",
                example: "61c9a3842b6be3f659716ab0",
              },
            },
          },
        },
        "application/json": {
          schema: {
            type: "object",
            properties: {
              type: {
                type: "string",
                description:
                  "type of favorite, type is menu or recipe or media",
                example: "media",
              },
              itemId: {
                type: "string",
                description: "object item id of favorite",
                example: "61c9a3842b6be3f659716ab0",
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Create Favorite success",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  description: "response code",
                  example: "SUCCESS",
                },
                data: {
                  type: "object",
                  properties: {
                    _id: {
                      type: "string",
                      description: "id of favorite",
                      example: "61c9a1676f6cdfe68db204bc",
                    },
                    userId: {
                      type: "string",
                      description: "userId",
                      example: "61c3692db43e7b19",
                    },
                    type: {
                      type: "string",
                      description: "type of media",
                      example: "hub",
                    },
                    data: {
                      type: "array",
                      description: "custom favorite item ids",
                      example: ["61c948c7bdc47ca8bf369c62"],
                      items: {
                        type: "string",
                        description: "custom favorite item id",
                        example: "61c948c7bdc47ca8bf369c62",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      400: {
        description: "Create Favorite Fail !",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error400",
            },
          },
        },
      },
      401: {
        description: "Permission Fail !",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error401",
            },
          },
        },
      },
      422: {
        description: "Invalid field",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error422",
            },
          },
        },
      },
      500: {
        description: "Server error",
      },
    },
  },
  get: {
    tags: ["Favorite"],
    summary: "get list favorite (by User)",
    operationId: "getFavorite",
    parameters: [
      {
        name: "isAll",
        in: "query",
        description: "Get all favorite or default 5 record",
        required: false,
        schema: {
          type: "boolean",
        },
      },
      {
        name: "type",
        in: "query",
        description: "type of favorite, type is menu or recipe or media",
        required: false,
        schema: {
          type: "string",
        },
      },
    ],
    responses: {
      200: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                data: {
                  type: "object",
                  description:
                    "favorite items, group by category. Exclude menu",
                  properties: {
                    medias: {
                      type: "object",
                      properties: {
                        categoryId: {
                          type: "array",
                          description: "media items",
                          items: {
                            type: "object",
                            description: "media item",
                          },
                        },
                      },
                    },
                    recipes: {
                      type: "object",
                      properties: {
                        categoryId: {
                          type: "array",
                          description: "recipe items",
                          items: {
                            type: "object",
                            description: "recipe item",
                          },
                        },
                      },
                    },
                    menus: {
                      type: "array",
                      items: {
                        type: "object",
                        description: "menu item",
                      },
                    },
                    mediaCategory: {
                      type: "array",
                      items: {
                        type: "object",
                        description: "media Category item",
                        properties:{
                          _id: {
                            type: "string",
                            description: "id of media category",
                          },
                          name: {
                            type: "string",
                            description: "name of media category",
                          },
                        }
                      },
                    },
                    recipeCategory: {
                      type: "array",
                      items: {
                        type: "object",
                        description: "recipe Category item",
                        properties:{
                          _id: {
                            type: "string",
                            description: "id of recipe category",
                          },
                          name: {
                            type: "string",
                            description: "name of recipe category",
                          },
                        }
                      },
                    },
                  },
                },
              },
              example: {
                data: {
                  medias: {
                    undefined: [
                      {
                        status: "draft",
                        _id: "61c948c7bdc47ca8bf369c62",
                        type: "image",
                        topic: [],
                        userId: "61c3ed71f498c31bd1dc3b8d",
                        resources:
                          "https://avatars.githubusercontent.com/u/42924033?v=4",
                        createdAt: "2021-12-27T05:01:59.344Z",
                        updatedAt: "2021-12-27T05:01:59.344Z",
                        __v: 0,
                      },
                    ],
                    "61cc9417a141afb9bd9900dd": [
                      {
                        _id: "61cc942ba141afb9bd9900e3",
                        userId: "61c3ed71f498c31bd1dc3b8d",
                        name: "episode name",
                        type: "video",
                        status: "published",
                        categoryId: "61cc9417a141afb9bd9900dd",
                        topicId: "61cc9422a141afb9bd9900e0",
                        urlFile:
                          "https://3scoach.vn/wp-content/uploads/2021/06/che-do-an.jpeg",
                        subtype: "trailer",
                        thumbnail:
                          "https://3scoach.vn/wp-content/uploads/2021/06/che-do-an.jpeg",
                        description:
                          "Lead statement. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
                        detailInfo:
                          "Lead statement. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
                        createdAt: "2021-12-29T17:00:27.949Z",
                        updatedAt: "2021-12-29T17:00:27.949Z",
                        __v: 0,
                      },
                    ],
                  },
                  recipes: {},
                  menus: [],
                  mediaCategory: [],
                  recipeCategory: [],
                },
              },
            },
          },
        },
      },
      404: {
        description: "Get survey Fail!",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error404",
            },
          },
        },
      },
      401: {
        description: "Permission Fail !",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error401",
            },
          },
        },
      },
      500: {
        description: "Server error",
      },
    },
  },
};
