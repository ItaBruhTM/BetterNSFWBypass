// @name         BetterNSFWBypass
// @description  Bypassa il controllo NSFW per canali senza età verificata
// @version      1.0.0
// @author       Eld3rly
// @source       https://github.com/Eld3rly/BetterNSFWBypass

import { findModule } from "@vendetta/webpack";
import { before } from "@vendetta/patcher";
import { showToast } from "@vendetta/ui/toasts";

let unpatch: () => void;

export default {
    onLoad() {
        const userModule = findModule(m => typeof m?.getCurrentUser === "function");
        const currentUser = userModule?.getCurrentUser?.();
        if (!currentUser) {
            showToast("Utente non trovato", 1);
            return;
        }

        // Patcha temporaneamente per forzare il flag nsfwAllowed
        unpatch = before("getCurrentUser", userModule, (_, res) => {
            if (res) res.nsfwAllowed = true;
        });

        // Imposta direttamente il flag una volta per sicurezza
        currentUser.nsfwAllowed = true;

        showToast("BetterNSFWBypass attivo", 0);
    },

    onUnload() {
        if (unpatch) unpatch();
        showToast("BetterNSFWBypass disattivato", 1);
    }
};
