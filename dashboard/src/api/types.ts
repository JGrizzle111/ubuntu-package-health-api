export type HealthResponse = {
    status: string;
    service: string;
};

export type PackageInfo = {
    name: string;
    installed_version: string | null;
    candidate_version: string | null;
    is_installed: boolean;
    is_upgradable: boolean;
};

export type PackageDependencies = {
    name: string;
    dependencies: string[];
};

export type UpgradablePackage = {
    name: string;
    current_version: string | null;
    new_version: string | null;
    architecture?: string | null;
};

export type UpgradableResponse = {
    packages: UpgradablePackage[];
}