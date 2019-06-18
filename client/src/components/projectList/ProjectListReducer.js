import {
  PROJECTS_LOADING,
  GET_PROJECTS,
  ADD_PROJECT,
  DELETE_PROJECT,
  UPDATE_PROJECT,
  GET_ERROR
} from "./ProjectListTypes";

const initialState = {
  projects: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERROR:
      return {
        ...state,
        loading: false
      };
    case PROJECTS_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_PROJECTS:
      return {
        ...state,
        projects: action.payload,
        loading: false
      };

    case ADD_PROJECT:
      return {
        ...state,
        projects: [...state.projects, action.newProject],
        loading: false
      };
    case DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(
          (item, index) => item.id !== action.projectId
        ),
        loading: false
      };
    case UPDATE_PROJECT:
      const updatedProjects = state.projects.map(item => {
        if (item.id === action.updatedProject.id) {
          return { ...item, ...action.updatedProject };
        }
        return item;
      });

      return {
        ...state,
        projects: updatedProjects,
        loading: false
      };

    default:
      return state;
  }
}
