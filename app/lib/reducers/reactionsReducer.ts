export type ReactionsState = {
  reactions: Map<string, string[]>;
  isLoading: Set<string>;
};

export type ReactionsAction = {
  type: string;
  notesIds?: string[];
  reactions?: [string, string[]][];
};

export default function reactionsReducer(
  state: ReactionsState,
  action: ReactionsAction,
): ReactionsState {
  switch (action.type) {
    case "ADD_REACTIONS": {
      if (!action.notesIds) return state;

      const isLoading = new Set(state.isLoading);

      action.notesIds.forEach((id) => {
        if (!state.reactions.has(id)) {
          isLoading.add(id);
        }
      });

      return {
        ...state,
        isLoading,
      };
    }
    case "UPDATE_REACTIONS": {
      if (!action.reactions) return state;

      const isLoading = new Set(state.isLoading);
      const reactions = new Map(state.reactions);

      action.reactions.forEach(([noteId, reactionIds]) => {
        isLoading.delete(noteId);
        reactions.set(noteId, [
          ...(reactions.get(noteId) || []),
          ...reactionIds,
        ]);
      });

      return {
        ...state,
        reactions,
        isLoading,
      };
    }
    case "REMOVE_REACTIONS": {
      if (!action.notesIds) return state;

      const reactions = new Map(state.reactions);

      action.notesIds.forEach((id) => {
        reactions.delete(id);
      });

      return {
        ...state,
        reactions,
      };
    }
  }
  throw Error(`Unknown action: ${action.type}`);
}
