const moment = require("moment");
module.exports = {
  post: {
    tags: ["Survey Answer"],
    summary: "create a survey (by Admin)",
    operationId: "createSurvey",
    requestBody: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Name of the survey",
                example: "Pre registration",
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
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Name of the survey",
                example: "Pre registration",
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
        description: "Create survey success",
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
                      description: "Name of the survey",
                      example: "Pre registration",
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
    },
  },
};
