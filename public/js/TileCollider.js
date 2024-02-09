import { TileResolver } from "./TileResolver.js";
import { coin } from "./tiles/coin.js";
import { chance } from "./tiles/chance.js";
import { ground } from "./tiles/ground.js";
import { brick } from "./tiles/brick.js";


//import { handleX, handleY } from "./tiles/ground.js";

const handlers = {
    ground,
    coin,
    brick,
    chance,
    undefined,
}

export class TileCollider {
    constructor(){
        //this.tiles = new TileResolver(tileMatrix);
        this.resolvers = [];
    }

    addGrid(tileMatrix) {
        this.resolvers.push(new TileResolver(tileMatrix))
    }

    checkX(entity, gameContext, level) {
        let x;
        if (entity.vel.x > 0) {
            x = entity.bounds.right;
        } else if (entity.vel.x < 0) {
            x = entity.bounds.left;
        } else {
            return;
        }
        for (const resolver of this.resolvers){
            const matches = resolver.searchByRange(
                x, x,
                entity.bounds.top, entity.bounds.bottom);

            matches.forEach(match => {
                this.handle(0, entity, match, resolver, gameContext, level);
            });
        }
    }

    checkY(entity, gameContext, level) {
        let y;
        if (entity.vel.y > 0) {
            y = entity.bounds.bottom;
        } else if (entity.vel.y < 0) {
            y = entity.bounds.top;
        } else {
            return;
        }

        for (const resolver of this.resolvers){
            const matches = resolver.searchByRange(
                entity.bounds.left, entity.bounds.right,
                y, y);
    
            matches.forEach(match => {
                this.handle(1, entity, match, resolver, gameContext, level);
            });
        }
    }

    handle(index, entity, match, resolver, gameContext, level) {
        const tileCollisionContext = {
            entity,
            match,
            resolver,
            gameContext,
            level
        };

        const handler = handlers[match.tile.type];
        if (handler) {
            handler[index](tileCollisionContext);
        }
    }

    test(entity) {
        this.checkY(entity);
        /*
        const match = this.tiles.matchByPosition(entity.bounds.left, entity.bounds.top);
        if (match) {
            console.log('Matched tile:', match, match.tile);
        }
        */
    }
}

export default {TileCollider};