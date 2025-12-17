import test from "node:test";
import assert from "node:assert";

import {
  createTournament,
  addPlayer,
  startTournament
} from "../tournament.js";

test("Un tournoi ne peut pas démarrer avec moins de 3 joueurs", () => {
  const tournament = createTournament({
    name: "Tournoi trop petit",
    minPlayers: 3,
    maxPlayers: 10
  });

  addPlayer(tournament, { name: "Mathieu", phone: "1" });
  addPlayer(tournament, { name: "Jean michel dupont du gard", phone: "2" });

  assert.throws(
    () => startTournament(tournament),
    /not enough players/
  );
});

test("Un tournoi démarre quand le nombre minimum de joueurs est atteint", () => {
  const tournament = createTournament({
    name: "Tournoi valide",
    minPlayers: 3,
    maxPlayers: 10
  });

  addPlayer(tournament, { name: "Mathieu", phone: "1" });
  addPlayer(tournament, { name: "Jean michel dupont du gard", phone: "2" });
  addPlayer(tournament, { name: "Jean René", phone: "3" });

  startTournament(tournament);

  assert.equal(tournament.status, "STARTED");
});

test("Aucune inscription possible après le démarrage", () => {
  const tournament = createTournament({
    name: "Tournoi fermé",
    minPlayers: 3,
    maxPlayers: 5
  });

  addPlayer(tournament, { name: "A", phone: "1" });
  addPlayer(tournament, { name: "B", phone: "2" });
  addPlayer(tournament, { name: "C", phone: "3" });

  startTournament(tournament);

  assert.throws(
    () => addPlayer(tournament, { name: "D", phone: "4" }),
    /registration closed/
  );
});
