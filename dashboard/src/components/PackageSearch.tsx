import { useState } from "react";
import type { FormEvent } from "react";
import { getPackageDependencies, getPackageInfo } from "../api/packageHealthApi";
import type { PackageDependencies, PackageInfo } from "../api/types";

function PackageSearch() {
    const [packageName, setPackageName] = useState("nginx");
    const [packageInfo, setPackageInfo] = useState<PackageInfo | null>(null);
    const [dependencies, setDependencies] = useState<PackageDependencies | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const trimmedName = packageName.trim();

        if (!trimmedName) {
            setError("Enter a package name.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setPackageInfo(null);
            setDependencies(null);

            const [infoResult, dependenciesResult] = await Promise.all([
                getPackageInfo(trimmedName),
                getPackageDependencies(trimmedName),
            ]);

            setPackageInfo(infoResult);
            setDependencies(dependenciesResult);
        } catch (err) {
            const message = 
                err instanceof Error ? err.message : "Something went wrong.";
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="card">
            <h2>Package Lookup</h2>

            <form onSubmit={handleSubmit} className="search-form">
                <input 
                    value={packageName}
                    onChange={(event) => setPackageName(event.target.value)}
                    placeholder="Enter package name, e.g. nginx"
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Checking..." : "Check Package"}
                </button>
            </form>

            {error && <p className="error">Error: {error}</p>}

            {packageInfo && (
                <div className="package-result">
                    <h3>{packageInfo.name}</h3>

                    <div className="info-grid">
                        <div>
                            <span className="label">Installed</span>
                            <strong>{packageInfo.is_installed? "Yes" : "No"}</strong>
                        </div>

                        <div>
                            <span className="label">Upgradable</span>
                            <strong>{packageInfo.is_upgradable ? "Yes" : "No"}</strong>
                        </div>

                        <div>
                            <span className="label">Installed Version</span>
                            <strong>{packageInfo.installed_version ?? "None"}</strong>
                        </div>

                        <div>
                            <span className="label">Candidate Version</span>
                            <strong>{packageInfo.candidate_version ?? "None"}</strong>
                        </div>
                    </div>
                </div>
            )}

            {dependencies && (
                <div className="dependencies">
                    <h3>Dependencies</h3>

                    {dependencies.dependencies.length === 0 ? (
                        <p>No direct dependencies found.</p>
                    ) : (
                        <ul>
                            {dependencies.dependencies.map((dependency) => (
                                <li key={dependency}>{dependency}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </section>
    );
}

export default PackageSearch;