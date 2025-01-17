import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isFetchingPlayerDeltas: false,
  isFetchingGroupDeltas: false,
  isFetchingLeaderboards: {
    five_min: false,
    day: false,
    week: false,
    month: false,
    year: false
  },
  leaderboards: {
    five_min: null,
    day: null,
    week: null,
    month: null,
    year: null
  },
  playerDeltas: {},
  groupDeltas: {},
  error: null
};

const slice = createSlice({
  name: 'deltas',
  initialState,
  reducers: {
    onFetchLeaderboardsRequest(state, action) {
      const { period } = action.payload;

      state.isFetchingLeaderboards[period] = true;
      state.error = null;
    },
    onFetchLeaderboardsSuccess(state, action) {
      const { period, data } = action.payload;

      state.isFetchingLeaderboards[period] = false;
      state.leaderboards[period] = data;
      state.error = null;
    },
    onFetchLeaderboardsError(state, action) {
      const { period, error } = action;

      state.isFetchingLeaderboards[period] = false;
      state.error = error;
    },
    onFetchPlayerDeltasRequest(state) {
      state.isFetchingPlayerDeltas = true;
      state.error = null;
    },
    onFetchPlayerDeltasSuccess(state, action) {
      const { username, data } = action.payload;
      const customPeriod = !('week' in data);

      state.error = null;
      state.isFetchingPlayerDeltas = false;
      state.playerDeltas[username] = customPeriod
        ? { ...state.playerDeltas[username], custom: data }
        : data;
    },
    onFetchPlayerDeltasError(state, action) {
      state.isFetchingPlayerDeltas = false;
      state.error = action.payload;
    },
    onFetchGroupDeltasRequest(state) {
      state.isFetchingGroupDeltas = true;
      state.error = null;
    },
    onFetchGroupDeltasSuccess(state, action) {
      const { groupId, data, refresh } = action.payload;

      state.error = null;
      state.isFetchingGroupDeltas = false;
      state.groupDeltas[groupId] = refresh ? data : [...state.groupDeltas[groupId], ...data];
    },
    onFetchGroupDeltasError(state, action) {
      state.isFetchingGroupDeltas = false;
      state.error = action.payload;
    },
    onInvalidate(state, action) {
      const { period, username } = action.payload;

      if (period) {
        state.playerDeltas[username] = { ...state.playerDeltas[username], [period]: null };
      } else {
        state.playerDeltas[username] = {};
      }
    }
  }
});

// Export the action reducers
export const reducers = slice.actions;
// Export the reducer
export default slice.reducer;
