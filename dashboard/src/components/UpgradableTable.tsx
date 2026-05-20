import { useEffect, useState } from "react";
import { getUpgradeablePackages } from "../api/packageHealthApi";
import type { UpgradablePackage } from "../api/types";

function UpgradableTable() {
    const [packages, setPackages] = useState<UpgradablePackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getUpgradeablePackages()
            .then((data) => {
                setPackages(data.packages);
            })
            .catch((err) => {
                const message =
                    err instanceof Error ? err.message : "Something went wrong.";
                setError(message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <section className="card">
            <h2>Upgradable Packages</h2>

            {loading && <p>Loading upgradable packages...</p>}
            {error && <p className="error">Error: {error}</p>}
            {!loading && !error && packages.length === 0 && (
                <p>No upgradable packages found.</p>
            )}

            {packages.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Package</th>
                            <th>Current Version</th>
                            <th>New Version</th>
                            <th>Architecture</th>
                        </tr>
                    </thead>
                    <tbody>
                        {packages.map((pkg) =>(
                            <tr key={`${pkg.name}-${pkg.new_version}`}>
                                <td>{pkg.name}</td>
                                <td>{pkg.current_version ?? "Unknown"}</td>
                                <td>{pkg.new_version ?? "Unknown"}</td>
                                <td>{pkg.architecture ?? "Unknown"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}

export default UpgradableTable;