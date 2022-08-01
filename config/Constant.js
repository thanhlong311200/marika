const REFRESH_TOKEN = 'refresh_token'
const ACCESS_TOKEN = 'access_Token'

// handler user Google
const GG_API_OAUTH = "https://oauth2.googleapis.com/token"
const GG_API_INFO = "https://www.googleapis.com/oauth2/v3/userinfo"
const GG_GRANT_TYPE = "authorization_code"

const FB_API_OAUTH= "https://graph.facebook.com/v12.0/oauth/access_token"
const FB_API_INFO = "https://graph.facebook.com/me"
const FB_FIELDS = "id,name,email,picture"

// code response
const E_PERMISSION = "E_PERMISSION";
const E_REQUEST = "E_REQUEST";
const E_VALIDATION = "E_VALIDATION";
const ERROR = "ERROR";
const SUCCESS = "SUCCESS";

// Type add member Mail Chimp
const WELCOME_LIST = 'welcomeList';
const WELCOME_PROGRAM = 'welcomeProgram';
const SURVEY_COMPLETION = 'surveyCompletion';
const MEMBER_CANCEL_SUB = 'memberCancelsSub';
const AIA_SIGN_UP = 'AIASignUp';

module.exports = {
  REFRESH_TOKEN,
  ACCESS_TOKEN,
  // google
  GG_API_OAUTH,
  GG_API_INFO,
  GG_GRANT_TYPE,
  //facebook
  FB_API_OAUTH,
  FB_API_INFO,
  FB_FIELDS,
  // code
  E_PERMISSION,
  E_REQUEST,
  E_VALIDATION,
  ERROR,
  SUCCESS,
  // mail chimp
  WELCOME_LIST,
  WELCOME_PROGRAM,
  SURVEY_COMPLETION,
  MEMBER_CANCEL_SUB,
  AIA_SIGN_UP,
}
