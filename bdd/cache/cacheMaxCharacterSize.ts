import { Cache } from "react-native-cache";
import { ICacheOptions } from "react-native-cache/dist/cache";

const TAILLE_MAX = 2000000; // 2 millions de caractères max
// En supposant que l'on code un caractère sur 16 bits, cela fait environ 4 Mo maximum

/**
 * Cache qui ne peut pas dépasser un nombre total de caractères
 */
export class CacheMaxCharacterSize extends Cache {
    /** Taille maximale du cache (en nombre de caractères) */
    protected maxCharacterSize: number;

    constructor(options: ICacheOptions, maxCharacterSize: number) {
        super(options);
        this.maxCharacterSize = (0 <= maxCharacterSize && maxCharacterSize <= TAILLE_MAX)? maxCharacterSize : TAILLE_MAX;
    }

    /**
     * Donne le nombre maximal de caractères autorisé pour ce cache
     * @returns {number} Un nombre entier positif
     */
    public getMaxCharacterSize(): number {
        return this.maxCharacterSize;
    }

    /**
     * Donne la taille totale du cache, en nombre de caractères de l'ensemble des éléments
     * @returns {Promise<number>} Le nombre de caractères de l'ensemble des éléments du cache
     */
    public async getCurrentTotalCharacterSize(): Promise<number> {
        var taille = 0;

        const allEntries = await this.getAll();
        Object.values(allEntries).forEach((entry) => {
            taille += entry.value.length;
        });

        return taille;
    }

    /**
     * Récupère la taille d'un élément (en nombre de caractères) sans toucher sa position dans le LRU
     * @param {string} key La clé de l'élément dont on veut la taille
     * @returns {Promise<number>} Le nombre de caractères de l'élément souhaité (0 s'il n'existe pas)
     */
    public async peakElementCharacterSize(key: string): Promise<number> {
        const value = await this.peek(key);

        return (value)? value.length : 0;
    }

    /**
     * Applique la taille maximale du cache (en nombre de caractères)
     */
    public async enforceMaxCharacterSize(): Promise<void> {
        if (!this.maxCharacterSize) {
            return;
        }
        
        const tailleActuelle = await this.getCurrentTotalCharacterSize();
        if (tailleActuelle < this.maxCharacterSize) {
            return;
        }

        // On supprime autant d'éléments qu'il faut pour passer en-dessous de la taille max
        const lru = await this.getLRU();
        var sommeSuppressions = 0;
        var victimCount = 0

        while (tailleActuelle - sommeSuppressions > this.maxCharacterSize && lru.slice(0,1).length) {
            const victimKey = lru.slice(0,1)[0];
            const victimSize = await this.peakElementCharacterSize(victimKey);
            await this.remove(victimKey);
            sommeSuppressions += victimSize;
            victimCount++;
        }

        const survivorList = lru.slice(victimCount);
        return this.setLRU(survivorList);
    }

    /**
     * Confirme si la clé existe ou non dans le cache
     * @param {string} key La clé à tester
     * @returns {Promise<boolean>} `true` si la clé est dans le cache, `false` sinon
     */
    public async hasKey(key: string): Promise<boolean> {
        const getAll = await this.getAll();
        const allKeys = Object.keys(getAll);
        return allKeys.includes(key);
    }

    /**
     * Applique les limites du cache : le nombre d'éléments du cache (cache original) et le nombre max de caractères
     * @override
     */
    public async enforceLimits(): Promise<void> {
        await super.enforceLimits();
        await this.enforceMaxCharacterSize();
    }

}