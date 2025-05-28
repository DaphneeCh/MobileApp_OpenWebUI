// Types pour la BDD

export type DonneesServeur = {
    id_serveur: number,
    id_nom_serveur: string,
    nom_serveur_affiche: string,
    adresse: string,
    cleAPI?: string
}

export type ParametresApplication = {
    notifications: boolean
}