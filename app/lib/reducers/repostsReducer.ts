export type RepostsState = {
  reposts: Map<string, string[]>;
  isLoading: Set<string>;
};

export type RepostsAction = {
  type: string;
  notesIds?: string[];
  reposts?: [string, string[]][];
};

export default function repostsReducer(
  state: RepostsState,
  action: RepostsAction,
): RepostsState {
  switch (action.type) {
    case "ADD_REPOSTS": {
      if (!action.notesIds) return state;

      const isLoading = new Set(state.isLoading);

      action.notesIds.forEach((id) => {
        if (!state.reposts.has(id)) {
          isLoading.add(id);
        }
      });

      return {
        ...state,
        isLoading,
      };
    }
    case "UPDATE_REPOSTS": {
      if (!action.reposts) return state;

      const isLoading = new Set(state.isLoading);
      const reposts = new Map(state.reposts);

      action.reposts.forEach(([noteId, repostIds]) => {
        isLoading.delete(noteId);
        reposts.set(noteId, [...(reposts.get(noteId) || []), ...repostIds]);
      });

      return {
        ...state,
        reposts,
        isLoading,
      };
    }
    case "REMOVE_REPOSTS": {
      if (!action.notesIds) return state;

      const reposts = new Map(state.reposts);

      action.notesIds.forEach((id) => {
        reposts.delete(id);
      });

      return {
        ...state,
        reposts,
      };
    }
  }
  throw Error(`Unknown action: ${action.type}`);
}
