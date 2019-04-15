db._createDatabase(process.env.ARANGO_DATABASE);
db._useDatabase(process.env.ARANGO_DATABASE);
const graph_module = require("org/arangodb/general-graph");
const edgeDefinitions = graph_module._edgeDefinitions();
graph_module._extendEdgeDefinitions(
  edgeDefinitions,
  graph_module._relation("users_invite", "User", "User")
);
graph_module._extendEdgeDefinitions(
  edgeDefinitions,
  graph_module._relation("users_friends", "User", "User")
);
graph_module._extendEdgeDefinitions(
  edgeDefinitions,
  graph_module._relation("invite_room", "User", "Room")
);
graph_module._extendEdgeDefinitions(
  edgeDefinitions,
  graph_module._relation("users_room", "User", "Room")
);
graph_module._extendEdgeDefinitions(
  edgeDefinitions,
  graph_module._relation("room_playlist", "users_invite", "Playlist")
);
graph_module._extendEdgeDefinitions(
  edgeDefinitions,
  graph_module._relation("users_playlist", "User", "Playlist")
);
graph_module._extendEdgeDefinitions(
  edgeDefinitions,
  graph_module._relation("music_playlist", "Music", "Playlist")
);

graph_module._create("streamUs", edgeDefinitions);

db._collection("User").ensureIndex({ type: "hash", unique: true, fields: ["email"] });
db._collection("Music").ensureIndex({ type: "hash", unique: false, fields: ["genre", "uri"] });
db._collection("Playlist").ensureIndex({ type: "hash", unique: false, fields: ["uri"] });
