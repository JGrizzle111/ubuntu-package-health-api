import type {
    HealthResponse,
    PackageDependencies,
    PackageInfo,
    UpgradableResponse,
} from "./types";

const API_BASE_URL = "http://127.0.0.1:8000";

async function request<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`);

    if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const detail = errorBody?.detail || `Request failed with ${response.status}`;
        throw new Error(detail);
    }
    
    return response.json() as Promise<T>;
}

export function getHealth(): Promise<HealthResponse> {
    return request<HealthResponse>("/health");
}

export function getPackageInfo(packageName: string): Promise<PackageInfo> {
    return request<PackageInfo>(`/packages/${packageName}`);
}

export function getPackageDependencies(packageName: string): Promise<PackageDependencies> {
    return request<PackageDependencies>(`/packages/${packageName}/dependencies`);
}

export function getUpgradeablePackages(): Promise<UpgradableResponse> {
    return request<UpgradableResponse>("/system/upgradable");
}