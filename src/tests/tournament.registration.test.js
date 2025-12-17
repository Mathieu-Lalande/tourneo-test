import test from "node:test";
import assert from "node:assert";

import {
  createTournament,
  addPlayer,
  removePlayer
} from "../tournament.ts";

test("Un joueur peut être ajouté à un tournoi", () => {
  const tournament = createTournament({
    name: "Volleyball tournament",
    minPlayers: 3,
    maxPlayers: 4
  });

  addPlayer(tournament, { name: "Mathieu", phone: "0600000000" });

  assert.equal(tournament.players.length, 1);
});

test("Impossible d'ajouter plus de joueurs que le maximum", () => {
  const tournament = createTournament({
    name: "Limited tournament",
    minPlayers: 2,
    maxPlayers: 2
  });

  addPlayer(tournament, { name: "Mathieu", phone: "1" });
  addPlayer(tournament, { name: "Jean michel dupont du gard", phone: "2" });

  assert.throws(
    () => addPlayer(tournament, { name: "Jean René", phone: "3" }),
    /tournament is full/
  );
});

test("Un joueur peut être retiré avant le démarrage du tournoi", () => {
  const tournament = createTournament({
    name: "Editable tournament",
    minPlayers: 2,
    maxPlayers: 4
  });

  addPlayer(tournament, { name: "Mathieu", phone: "1" });
  removePlayer(tournament, "Mathieu");

  assert.equal(tournament.players.length, 0);
});
