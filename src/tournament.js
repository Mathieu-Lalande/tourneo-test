export function createTournament({ name, teams = [], minPlayers, maxPlayers, withPools = false } = {}) {
    if (!name) {
        throw new Error("name is required");
    }
    if (minPlayers !== undefined && maxPlayers !== undefined && minPlayers > maxPlayers) {
        throw new Error("minPlayers must be lower than maxPlayers");
    }
    return {
        name,
        teams,
        matches: [],
        createdAt: new Date(),
        minPlayers,
        maxPlayers,
        players: [],
        withPools,
        pools: undefined,
        poolsFinished: false,
        bracket: undefined,
        status: "CREATED",
    };
}

export function addPlayer(tournament, player) {
    if (tournament.status === "STARTED") {
        throw new Error("registration closed");
    }
    if (tournament.players.length >= tournament.maxPlayers) {
        throw new Error("tournament is full");
    }
    tournament.players.push(player);
}

export function removePlayer(tournament, playerName) {
    const index = tournament.players.findIndex(p => p.name === playerName);
    if (index !== -1) {
        tournament.players.splice(index, 1);
    }
}

export function startTournament(tournament) {
    if (tournament.players.length < tournament.minPlayers) {
        throw new Error("not enough players");
    }
    tournament.status = "STARTED";
    if (tournament.withPools) {
        // Simple pool generation: split players into 2 pools
        const mid = Math.ceil(tournament.players.length / 2);
        tournament.pools = [
            tournament.players.slice(0, mid),
            tournament.players.slice(mid)
        ];
        tournament.poolsFinished = false;
    }
}

export function closePools(tournament) {
    if (!tournament.poolsFinished) {
        throw new Error("pools not finished");
    }
    tournament.bracket = tournament.players.slice();
}