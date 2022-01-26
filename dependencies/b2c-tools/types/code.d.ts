export type CartridgeMapping = {
    /**
     * - cartridge name
     */
    dest: string;
    /**
     * - directory
     */
    src: string;
};
/**
 * Syncs the given cartridge mapping (src:dest) to the environments code version
 *
 * @param {Environment} env
 * @param {CartridgeMapping[]} cartridges
 * @param {boolean} reload
 * @return {Promise<void>}
 */
export function syncCartridges(env: Environment, cartridges: CartridgeMapping[], reload?: boolean): Promise<void>;
/**
 * Reloads (or activates) the environments code version
 *
 * @param {Environment} env
 * @return {Promise<void>}
 */
export function reloadCodeVersion(env: Environment): Promise<void>;
/**
 * @typedef {Object} CartridgeMapping
 * @property {string} dest - cartridge name
 * @property {string} src - directory
 */
/**
 * Find Cartridges recursively in the working directory
 *
 * @return {CartridgeMapping[]}
 */
export function findCartridges(): CartridgeMapping[];
//# sourceMappingURL=code.d.ts.map