enum RoomEvents {
  NewGrid = "new_grid",
  RequestGrid = "request_grid",
  NewRoom = "new_room",
  CreateRoom = "request_new_room",
  JoinRoom = "join_room",
  MemberStateChanged = "member_state_changed",
  PlayerToggleReady = "player_toggle_ready",
  LeaveRoom = "leave_room",
  PlayerSolvedGrid = "player_solved_grid",
  PlayerLost = "player_lost",
  RoundEnd = "round_end",
}

export default RoomEvents;
