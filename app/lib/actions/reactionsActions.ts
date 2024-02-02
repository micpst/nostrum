import reactionService from "@/app/lib/services/reactionService";
import type {
  ReactionsAction,
  ReactionsState,
} from "@/app/lib/reducers/reactionsReducer";
import type {
  CreateReactionRequest,
  ListNotesReactionsRequest,
} from "@/app/lib/services/reactionService";

function addReactions(notesIds: string[]): ReactionsAction {
  return {
    type: "ADD_REACTIONS",
    notesIds,
  };
}

export function removeReactions(notesIds: string[]): ReactionsAction {
  return {
    type: "REMOVE_REACTIONS",
    notesIds,
  };
}

export function updateReactions(
  reactions: [string, string[]][],
): ReactionsAction {
  return {
    type: "UPDATE_REACTIONS",
    reactions,
  };
}

export function addReactionsAsync({
  relays,
  pubkey,
  notesIds,
}: ListNotesReactionsRequest): (
  dispatch: any,
  getState: () => ReactionsState,
) => void {
  return async (dispatch, getState) => {
    const prevLoading = new Set(getState().isLoading);

    dispatch(addReactions(notesIds));

    const newNoteIds = Array.from(getState().isLoading).filter(
      (noteId) => !prevLoading.has(noteId),
    );
    const newReactions = await reactionService.listNotesReactionsAsync({
      relays,
      pubkey,
      notesIds: newNoteIds,
    });
    const groupedReactions = newNoteIds.map((noteId) => {
      const reactions = newReactions
        .filter(([id]) => id === noteId)
        .map(([, reactions]) => reactions)
        .flat();
      return [noteId, reactions];
    }) as [string, string[]][];

    dispatch(updateReactions(groupedReactions));
  };
}

export function addReactionAsync({
  relays,
  pubkey,
  noteToReact,
}: CreateReactionRequest): (
  dispatch: any,
  getState: () => ReactionsState,
) => void {
  return async (dispatch, getState) => {
    const likeEvent = await reactionService.createReactionAsync({
      relays,
      pubkey,
      noteToReact,
    });
    dispatch(updateReactions([[noteToReact.id, [likeEvent.id]]]));
  };
}

export function removeReactionAsync({
  relays,
  pubkey,
  noteToReact,
}: CreateReactionRequest): (
  dispatch: any,
  getState: () => ReactionsState,
) => void {
  return async (dispatch, getState) => {
    const reactionIds = getState().reactions.get(noteToReact.id);
    if (!reactionIds) return;

    await Promise.all(
      reactionIds.map(async (reactionId) =>
        reactionService.deleteReactionAsync({
          relays,
          pubkey,
          reactionId,
        }),
      ),
    );
    dispatch(removeReactions([noteToReact.id]));
  };
}
