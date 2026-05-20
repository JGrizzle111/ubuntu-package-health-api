import { useEffect, useState } from "react";
import { getHealth } from "../api/packageHealthApi";
import type { HealthResponse } from "../api/types";

function HealthCard() {
    const [health, setHealth] = useState<HealthResponse | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        getHealth()
            .then(setHealth)
            .catch((err) => setError(err.message));
    }, []);

    return (
        <section className="card">
            <h2>API Health</h2>

            {error && <p className="error">Error: {error}</p>}

            {!error && !health && <p>Checking API...</p>}

            {health && (
                <div>
                    <p>
                        <strong>Status:</strong>{" "}
                        <span className="status-ok">{health.status}</span>
                    </p>
                    <p>
                        <strong>Service:</strong> {health.service}
                    </p>
                </div>
            )}
        </section>
    );
}

export default HealthCard;