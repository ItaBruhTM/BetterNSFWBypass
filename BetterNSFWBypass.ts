// SPDX-License-Identifier: MIT
// ==UserPlugin==
// @name         BetterNSFWBypass
// @description  Bypasses age restriction for NSFW channels by enabling nsfwAllowed.
// @version      1.0.0
// @author       Eld3rly (converted by ChatGPT)
// @source       https://github.com/Eld3rly/BetterNSFWBypass
// @license      MIT
// ==/UserPlugin==

import { definePlugin } from "@vencord/plugins";
import { findModule } from "@cumcord/modules/webpack";

export default definePlugin({
    name: "BetterNSFWBypass",
    description: "Bypasses age restriction for NSFW channels by enabling nsfwAllowed.",
    
    // Funzione che forza `nsfwAllowed` sull'utente
    bypassNSFW() {
        const userStore = findModule(m => m?.getCurrentUser);
        const currentUser = userStore?.getCurrentUser?.();

        if (currentUser && typeof currentUser.nsfwAllowed === "boolean") {
            currentUser.nsfwAllowed = true;
            console.log("[BetterNSFWBypass] NSFW bypass applied.");
        } else {
            console.warn("[BetterNSFWBypass] Could not apply NSFW bypass: user not found or property missing.");
        }
    },

    // Avvia il plugin
    start() {
        this.bypassNSFW();

        // Anche al cambio di canale, riapplica il bypass
        this.unpatch = findModule(m => m?.getChannelId)?.addChangeListener?.(() => {
            this.bypassNSFW();
        });
    },

    // Ferma il plugin
    stop() {
        if (this.unpatch) {
            findModule(m => m?.getChannelId)?.removeChangeListener?.(this.unpatch);
        }
    }
});