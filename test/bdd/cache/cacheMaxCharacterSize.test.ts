import { CacheMaxCharacterSize } from "@/bdd/cache/cacheMaxCharacterSize";
import { MemoryStore } from "react-native-cache";

/** 
 * Les tests de ce cache sont inspirés de ceux de 'react-native-cache'.
 * Nous ne testons que les nouvelles méthodes, et celles qui ont été modifiées, par rapport à la librairie de base 'react-native-cache'.
 * En effet, les autres méthodes issues de 'react-native-cache' n'ont pas été touchées.
 */

const cache = new CacheMaxCharacterSize({
    namespace: "test",
    policy: {
        maxEntries: 2, // nb max d'éléments
        stdTTL: 3600
    },
    backend: MemoryStore,
},
    100 // nb total max de caractères
);

describe("cache", () => {
    it("can get the size of an element", async () => {
        await cache.set("key", "test");
        const value = await cache.peakElementCharacterSize("key");

        expect(value).toBe(4);
    });

    it("can get the total size of its elements", async () => {
        await cache.set("key1", "test");
        await cache.set("key2", "secondTest");
        const value = await cache.getCurrentTotalCharacterSize();

        expect(value).toBe(14);
    });

    it("evicts entries in lastAccessed order (by maxEntries)", async () => {
        // On teste le nombre maximum d'éléments (2)
        await cache.set("key1", "value1");
        await cache.set("key2", "value2");
        var nbElements = Object.keys(await cache.getAll()).length;
        expect(nbElements).toBe(2);

        await cache.set("key3", "value3");
        const value1 = await cache.get("key1");
        expect(value1).toBe(undefined);
        nbElements = Object.keys(await cache.getAll()).length;
        expect(nbElements).toBe(2);
    });

    it("evicts entries in lastAccessed order (by maxCharacterSize)", async () => {
        // On teste la taille maximale (en nombre de caractères)
        await cache.set("key1", "value1".repeat(16)); // value size : 96
        var totalSize = await cache.getCurrentTotalCharacterSize();
        expect(totalSize).toBe(96);

        await cache.set("key2", "value2"); // add a value size of 6
        const value1 = await cache.get("key1");
        expect(value1).toBe(undefined);

        totalSize = await cache.getCurrentTotalCharacterSize();
        expect(totalSize).toBe(6);
    });

});