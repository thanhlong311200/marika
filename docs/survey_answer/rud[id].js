const moment = require("moment");
module.exports = {
  delete: {
    tags: ["Survey Answer"],
    summary: "delete a survey by id (by Admin)",
    operationId: "DeleteSurvey",
    parameters: [
      {
        name: "id",
        in: "path",
        description: "surveyId wants to delete, id //61c809f7b41996c2ad8c218e",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    responses: {
      200: {
        description: "delete survey success!",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Success200",
            },
          },
        },
      },
      404: {
        description: "Delete survey Fail!",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error404",
            },
          },
        },
      },
    },
  },

  put: {
    tags: ["Survey Answer"],
    summary: "update a survey by id (by Admin)",
    operationId: "updateSurvey",
    parameters: [
      {
        name: "id",
        in: "path",
        description: "surveyId wants to update, id //61c809f7b41996c2ad8c218e",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    requestBody: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Survey name",
                example: "health",
              },
              startDate: {
                type: "string",
                description: "Start time of the survey",
                example: moment().format("YYYY-MM-DD"),
              },
              endDate: {
                type: "string",
                description: "End time of the survey",
                example: moment().add(7, 'day').format("YYYY-MM-DD"),
              },
              status: {
                type: "number",
                description: "Status of the survey",
                example: "1",
              },
              questions: {
                type: "array",
                description: "Question of the survey",
                example: [
                  {
                    question:
                      "tell us why you’re here. select the two goals that are most relevant to you",
                    options: [
                      "build body confidence, self-esteem and body image",
                      "manage emotional eating, binge eating or disordered eating",
                    ],
                    numberOfAnswers: 1,
                  },
                  {
                    question:
                      "when it comes to planning your weekly meals, which sounds most like you?",
                    options: [
                      "I’m a big eater",
                      "I’m a big gourmand",
                      "I’m a big foodie",
                    ],
                    numberOfAnswers: 2,
                  },
                ],
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Update survey success",
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
                  properties: {
                    name: {
                      type: "string",
                      description: "Survey name",
                      example: "health",
                    },
                    startDate: {
                      type: "string",
                      description: "After start time, survey can be seen",
                      example: "2020-01-01T00:00:00.000Z",
                    },
                    endTime: {
                      type: "string",
                      description: "Before end time, survey can be seen",
                      example: "2022-01-01T00:00:00.000Z",
                    },
                    status: {
                      type: "number",
                      description: "Status of the survey",
                      example: "1",
                    },
                    questions: {
                      type: "array",
                      description: "Question of the survey",
                      example: [
                        {
                          question:
                            "tell us why you’re here. select the two goals that are most relevant to you",
                          options: [
                            "build body confidence, self-esteem and body image",
                            "manage emotional eating, binge eating or disordered eating",
                          ],
                          numberOfAnswers: 1,
                        },
                        {
                          question:
                            "when it comes to planning your weekly meals, which sounds most like you?",
                          options: [
                            "I’m a big eater",
                            "I’m a big gourmand",
                            "I’m a big foodie",
                          ],
                          numberOfAnswers: 2,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
      400: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error400",
            },
          },
        },
      },
      422: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error422",
            },
          },
        },
      },
    },
  },

  get: {
    tags: ["Survey Answer"],
    summary: "get a survey by id (by User & Admin)",
    operationId: "GetSurveyById",
    parameters: [
      {
        name: "id",
        in: "path",
        description: "surveyId wants to get, id //61c809f7b41996c2ad8c218e",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
    responses: {
      200: {
        description: "Get survey success",
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
                  properties: {
                    id: {
                      type: "string",
                      description: "Survey id",
                      example: "61bce58ad69ba1db79507032",
                    },
                    name: {
                      type: "string",
                      description: "Name of the survey",
                      example: "health",
                    },
                    status: {
                      type: "number",
                      description: "Status of the survey",
                      example: "1",
                    },
                    startDate: {
                      type: "string",
                      description: "Start time of the survey",
                      example: moment().format("YYYY-MM-DD"),
                    },
                    endDate: {
                      type: "string",
                      description: "End time of the survey",
                      example: moment().add(7, 'day').format("YYYY-MM-DD"),
                    },
                    questions: {
                      type: "array",
                      description: "Question of the survey",
                      example: [
                        {
                          question:
                            "tell us why you’re here. select the two goals that are most relevant to you",
                          options: [
                            "build body confidence, self-esteem and body image",
                            "manage emotional eating, binge eating or disordered eating",
                          ],
                          numberOfAnswers: 1,
                        },
                        {
                          question:
                            "when it comes to planning your weekly meals, which sounds most like you?",
                          options: [
                            "I’m a big eater",
                            "I’m a big gourmand",
                            "I’m a big foodie",
                          ],
                          numberOfAnswers: 2,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
      404: {
        description: "Get survey by id fail!",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error404",
            },
          },
        },
      },
    },
  },
};
