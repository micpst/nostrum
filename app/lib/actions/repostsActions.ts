import repostService from "@/app/lib/services/repostService";
import type {
  RepostsAction,
  RepostsState,
} from "@/app/lib/reducers/repostsReducer";
import type {
  CreateRepostRequest,
  ListNotesRepostsRequest,
} from "@/app/lib/services/repostService";

function addReposts(notesIds: string[]): RepostsAction {
  return {
    type: "ADD_REPOSTS",
    notesIds,
  };
}

export function removeReposts(notesIds: string[]): RepostsAction {
  return {
    type: "REMOVE_REPOSTS",
    notesIds,
  };
}

export function updateReposts(reposts: [string, string[]][]): RepostsAction {
  return {
    type: "UPDATE_REPOSTS",
    reposts,
  };
}

export function addRepostsAsync({
  relays,
  pubkey,
  notesIds,
}: ListNotesRepostsRequest): (
  dispatch: any,
  getState: () => RepostsState,
) => void {
  return async (dispatch, getState) => {
    const prevLoading = new Set(getState().isLoading);

    dispatch(addReposts(notesIds));

    const newNoteIds = Array.from(getState().isLoading).filter(
      (noteId) => !prevLoading.has(noteId),
    );
    const newReposts = await repostService.listNotesRepostsAsync({
      relays,
      pubkey,
      notesIds: newNoteIds,
    });
    const groupedReposts = newNoteIds.map((noteId) => {
      const reposts = newReposts
        .filter(([id]) => id === noteId)
        .map(([, reposts]) => reposts)
        .flat();
      return [noteId, reposts];
    }) as [string, string[]][];

    dispatch(updateReposts(groupedReposts));
  };
}

export function addRepostAsync({
  relays,
  pubkey,
  noteToRepost,
}: CreateRepostRequest): (dispatch: any, getState: () => RepostsState) => void {
  return async (dispatch, getState) => {
    const repostEvent = await repostService.createRepostAsync({
      relays,
      pubkey,
      noteToRepost,
    });
    dispatch(updateReposts([[noteToRepost.id, [repostEvent.id]]]));
  };
}

export function removeRepostAsync({
  relays,
  pubkey,
  noteToRepost,
}: CreateRepostRequest): (dispatch: any, getState: () => RepostsState) => void {
  return async (dispatch, getState) => {
    const repostIds = getState().reposts.get(noteToRepost.id);
    if (!repostIds) return;

    await Promise.all(
      repostIds.map(async (repostId) =>
        repostService.deleteRepostAsync({
          relays,
          pubkey,
          repostId,
        }),
      ),
    );
    dispatch(removeReposts([noteToRepost.id]));
  };
}
