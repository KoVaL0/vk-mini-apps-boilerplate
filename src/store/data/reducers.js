import {
  SET_COLOR_SCHEME,
  SET_SNACKBAR,
  SET_IS_NOTIFICATIONS_ENABLED,
  SET_IS_ONBOARDING_VIEWED,
  SET_NOTIFICATIONS,
  SET_PROFILE,
  SET_ACTIVE_QUIZ,
  SET_ACTIVE_ANSWER,
  SET_DATA,
  SET_BLOCK_VIEW,
  SET_CITY,
  SET_SEX,
  SET_COUNTRY,
} from "./actionTypes";

const initialState = {
  colorScheme: "client_light",
  isOnboardingViewed: true,
  isNotificationsEnabled: false,
  snackbar: null,
  profile: {
    city: null,
    country: null,
    sex: 0,
  },
  blockView: true,
  activeAnswer: null,
  activeQuiz: null,
  data: {
    slideIndex: null,
    quiz: [
      {
        id: null,
        type: null,
        image: null,
        header: null,
        text: null,
        questions: [
          {
            type: null,
            title: null,
            answer: [null]
          }
        ]
      },
    ]
  }
};

export const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_COLOR_SCHEME: {
      return {
        ...state,
        colorScheme: action.payload.data,
      };
    }
    case SET_SNACKBAR: {
      return {
        ...state,
        snackbar: action.payload.data,
      };
    }
    case SET_IS_ONBOARDING_VIEWED: {
      return {
        ...state,
        isOnboardingViewed: action.payload.data,
      };
    }
    case SET_IS_NOTIFICATIONS_ENABLED: {
      return {
        ...state,
        isNotificationsEnabled: action.payload.data,
      };
    }
    case SET_PROFILE: {
      return {
        ...state,
        profile: action.payload.data,
      };
    }
    case SET_NOTIFICATIONS: {
      return {
        ...state,
        notifications: action.payload.data,
      };
    }
    case SET_COUNTRY: {
      return {
        ...state,
        profile: {...state.profile, country: {title: action.payload.data}},
      };
    }
    case SET_SEX: {
      return {
        ...state,
        profile: {...state.profile, sex: action.payload.data},
      };
    }
    case SET_CITY: {
      return {
        ...state,
        profile: {...state.profile, city: {title: action.payload.data}},
      };
    }
    case SET_ACTIVE_QUIZ: {
      return {
        ...state,
        activeQuiz: action.payload.data,
      };
    }
    case SET_ACTIVE_ANSWER: {
      return {
        ...state,
        activeAnswer: action.payload.data,
      };
    }
    case SET_DATA: {
      return {
        ...state,
        data: action.payload.data,
      };
    }
    case SET_BLOCK_VIEW: {
      return {
        ...state,
        blockView: action.payload.data,
      };
    }

    default: {
      return state;
    }
  }
};
